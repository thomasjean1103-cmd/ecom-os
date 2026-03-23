import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { competitorOutput, parseCsv } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";

async function createCompetitor(formData: FormData) {
  "use server";
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!productId || !name) return;

  await prisma.competitor.create({
    data: {
      productId,
      name,
      url: String(formData.get("url") ?? "") || null,
      promise: String(formData.get("promise") ?? "") || null,
      angle: String(formData.get("angle") ?? "") || null,
      offerStructure: String(formData.get("offerStructure") ?? "") || null,
      priceRange: String(formData.get("priceRange") ?? "") || null,
      pdpAnalysis: String(formData.get("pdpAnalysis") ?? "") || null,
      checkoutAnalysis: String(formData.get("checkoutAnalysis") ?? "") || null,
      guarantee: String(formData.get("guarantee") ?? "") || null,
      urgencyTactic: String(formData.get("urgencyTactic") ?? "") || null,
      socialProof: String(formData.get("socialProof") ?? "") || null,
      weaknesses: JSON.stringify(parseCsv(String(formData.get("weaknesses") ?? ""))),
      stealItems: JSON.stringify(parseCsv(String(formData.get("stealItems") ?? ""))),
      adaptItems: JSON.stringify(parseCsv(String(formData.get("adaptItems") ?? ""))),
      avoidItems: JSON.stringify(parseCsv(String(formData.get("avoidItems") ?? ""))),
      counterItems: JSON.stringify(parseCsv(String(formData.get("counterItems") ?? ""))),
      notes: String(formData.get("notes") ?? "") || null,
    },
  });

  revalidatePath("/competitor-board");
}

export default async function CompetitorBoardPage() {
  const [products, competitors] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.competitor.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <>
      <AppHeader screenId="competitor-board" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Ajouter concurrent" subtitle="Minimum 3 a 5 analyses">
          <form action={createCompetitor} className="space-y-3 text-xs">
            <select name="productId" required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Selectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input name="name" required placeholder="Nom concurrent" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="url" placeholder="URL concurrent" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="promise" placeholder="Promesse principale" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="angle" placeholder="Angle marketing" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="priceRange" placeholder="Range prix" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="offerStructure" placeholder="Offer structure (JSON / texte)" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="pdpAnalysis" placeholder="PDP analysis" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="checkoutAnalysis" placeholder="Checkout analysis" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="guarantee" placeholder="Garantie" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="urgencyTactic" placeholder="Urgence utilisee" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="socialProof" placeholder="Preuve sociale" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="weaknesses" placeholder="Failles (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="stealItems" placeholder="STEAL (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="adaptItems" placeholder="ADAPT (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="avoidItems" placeholder="EVITER (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="counterItems" placeholder="COUNTER (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="notes" placeholder="Notes" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter concurrent" />
          </form>
        </Card>
        <ModuleOutputCard output={competitorOutput(competitors)} />
        <Card title="Concurrents recents" subtitle="Comparaison rapide">
          <div className="space-y-2 text-xs">
            {competitors.length === 0 ? (
              <p className="rounded border border-dashed border-zinc-700 p-3 text-zinc-400">
                Aucun concurrent enregistre. Ajoute 3 a 5 concurrents minimum.
              </p>
            ) : (
              competitors.map((c) => (
              <div key={c.id} className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <p className="font-semibold text-zinc-100">{c.name}</p>
                <p className="text-zinc-400">
                  Angle: {c.angle ?? "n/a"} | Prix: {c.priceRange ?? "n/a"}
                </p>
              </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </>
  );
}
