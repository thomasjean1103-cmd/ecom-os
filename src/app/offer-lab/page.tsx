import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { parseCsv } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";
import { angleOutput, offerOutput } from "@/lib/strategy";

async function createOffer(formData: FormData) {
  "use server";
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const scenario = String(formData.get("scenario") ?? "").trim();
  if (!productId || !name || !scenario) return;

  await prisma.offer.create({
    data: {
      productId,
      name,
      scenario,
      basePrice: Number(formData.get("basePrice") ?? 0) || null,
      bundleStructure: JSON.stringify(parseCsv(String(formData.get("bundleStructure") ?? ""))),
      freeShippingThreshold: Number(formData.get("freeShippingThreshold") ?? 0) || null,
      upsellOffer: String(formData.get("upsellOffer") ?? "") || null,
      crossSellOffer: String(formData.get("crossSellOffer") ?? "") || null,
      rationale: String(formData.get("rationale") ?? "") || null,
      expectedFriction: String(formData.get("expectedFriction") ?? "") || null,
      expectedGain: String(formData.get("expectedGain") ?? "") || null,
      conversionDanger: String(formData.get("conversionDanger") ?? "") || null,
      marginDanger: String(formData.get("marginDanger") ?? "") || null,
      testDecision: String(formData.get("testDecision") ?? "") || null,
      verdict: "DRAFT",
    },
  });
  revalidatePath("/offer-lab");
}

async function createAngle(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const avatarRelevance = Number(formData.get("avatarRelevance") ?? 0);
  const competitorDiff = Number(formData.get("competitorDiff") ?? 0);
  const visualDemonstrability = Number(formData.get("visualDemonstrability") ?? 0);
  const emotionalPotential = Number(formData.get("emotionalPotential") ?? 0);
  const saturationLevel = Number(formData.get("saturationLevel") ?? 0);
  const totalScore =
    avatarRelevance +
    competitorDiff +
    visualDemonstrability +
    emotionalPotential +
    (10 - saturationLevel);

  await prisma.angle.create({
    data: {
      name,
      description: String(formData.get("description") ?? "") || null,
      productNiche: String(formData.get("productNiche") ?? "") || null,
      avatarRelevance,
      competitorDiff,
      visualDemonstrability,
      emotionalPotential,
      saturationLevel,
      totalScore,
      status: "CANDIDATE",
    },
  });
  revalidatePath("/offer-lab");
}

export default async function OfferLabPage() {
  const [products, offers, angles] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.offer.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.angle.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  return (
    <>
      <AppHeader screenId="offer-lab" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Offer Architecture" subtitle="4 scenarios + ordre AOV strict">
          <form action={createOffer} className="space-y-3 text-xs">
            <select name="productId" required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Selectionner un produit</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input name="name" required placeholder="Nom offre" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <select name="scenario" required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="conversion_max">Conversion Max</option>
              <option value="margin_max">Marge Max</option>
              <option value="aov_max">AOV Max</option>
              <option value="ltv_max">LTV Max</option>
            </select>
            <input type="number" step="0.01" name="basePrice" placeholder="Prix de base" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="bundleStructure" placeholder="Bundle (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input type="number" step="0.01" name="freeShippingThreshold" placeholder="Seuil livraison gratuite" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="upsellOffer" placeholder="Upsell post-ajout" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="crossSellOffer" placeholder="Cross-sell panier" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="rationale" placeholder="Rationale" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="expectedFriction" placeholder="Friction attendue" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="expectedGain" placeholder="Gain attendu" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="conversionDanger" placeholder="Danger conversion" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="marginDanger" placeholder="Danger marge" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="testDecision" placeholder="Decision test" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <button type="submit" className="rounded bg-zinc-100 px-3 py-2 font-semibold text-zinc-900">Enregistrer offre</button>
          </form>
        </Card>
        <ModuleOutputCard output={offerOutput(offers)} />
        <Card title="Angle Selector" subtitle="Top 3 angles a tester en priorite">
          <form action={createAngle} className="space-y-3 text-xs">
            <input name="name" required placeholder="Nom angle" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="description" placeholder="Description angle" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="productNiche" placeholder="Niche produit" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min={1} max={10} name="avatarRelevance" defaultValue={5} className="rounded border border-zinc-700 bg-zinc-950 p-2" placeholder="Avatar relevance" />
              <input type="number" min={1} max={10} name="competitorDiff" defaultValue={5} className="rounded border border-zinc-700 bg-zinc-950 p-2" placeholder="Competitor diff" />
              <input type="number" min={1} max={10} name="visualDemonstrability" defaultValue={5} className="rounded border border-zinc-700 bg-zinc-950 p-2" placeholder="Visual demo" />
              <input type="number" min={1} max={10} name="emotionalPotential" defaultValue={5} className="rounded border border-zinc-700 bg-zinc-950 p-2" placeholder="Emotional potential" />
              <input type="number" min={1} max={10} name="saturationLevel" defaultValue={5} className="rounded border border-zinc-700 bg-zinc-950 p-2" placeholder="Saturation" />
            </div>
            <button type="submit" className="rounded bg-zinc-100 px-3 py-2 font-semibold text-zinc-900">Ajouter angle</button>
          </form>
        </Card>
        <ModuleOutputCard output={angleOutput(angles)} />
      </main>
    </>
  );
}
