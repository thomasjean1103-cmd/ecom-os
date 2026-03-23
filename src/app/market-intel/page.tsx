import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { marketOutput, parseCsv } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";

async function upsertMarketValidation(formData: FormData) {
  "use server";

  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  const searchSignals = parseCsv(String(formData.get("searchSignals") ?? ""));
  const socialSignals = parseCsv(String(formData.get("socialSignals") ?? ""));
  const purchaseSignals = parseCsv(String(formData.get("purchaseSignals") ?? ""));
  const contentSignals = parseCsv(String(formData.get("contentSignals") ?? ""));
  const proofCount =
    (searchSignals.length > 0 ? 1 : 0) +
    (socialSignals.length > 0 ? 1 : 0) +
    (purchaseSignals.length > 0 ? 1 : 0) +
    (contentSignals.length > 0 ? 1 : 0);

  const verdict = proofCount >= 3 ? "GO" : proofCount >= 2 ? "TEST" : "NO_GO";
  await prisma.marketValidation.upsert({
    where: { productId },
    update: {
      temperature: String(formData.get("temperature") ?? "COLD"),
      searchSignals: JSON.stringify(searchSignals),
      socialSignals: JSON.stringify(socialSignals),
      purchaseSignals: JSON.stringify(purchaseSignals),
      contentSignals: JSON.stringify(contentSignals),
      proofCount,
      dominantObjections: JSON.stringify(parseCsv(String(formData.get("dominantObjections") ?? ""))),
      soughtBenefits: JSON.stringify(parseCsv(String(formData.get("soughtBenefits") ?? ""))),
      saturatedAngles: JSON.stringify(parseCsv(String(formData.get("saturatedAngles") ?? ""))),
      freeAngles: JSON.stringify(parseCsv(String(formData.get("freeAngles") ?? ""))),
      verdict,
      killCriteria: JSON.stringify(parseCsv(String(formData.get("killCriteria") ?? ""))),
      nextMove: String(formData.get("nextMove") ?? "") || null,
    },
    create: {
      productId,
      temperature: String(formData.get("temperature") ?? "COLD"),
      searchSignals: JSON.stringify(searchSignals),
      socialSignals: JSON.stringify(socialSignals),
      purchaseSignals: JSON.stringify(purchaseSignals),
      contentSignals: JSON.stringify(contentSignals),
      proofCount,
      dominantObjections: JSON.stringify(parseCsv(String(formData.get("dominantObjections") ?? ""))),
      soughtBenefits: JSON.stringify(parseCsv(String(formData.get("soughtBenefits") ?? ""))),
      saturatedAngles: JSON.stringify(parseCsv(String(formData.get("saturatedAngles") ?? ""))),
      freeAngles: JSON.stringify(parseCsv(String(formData.get("freeAngles") ?? ""))),
      verdict,
      killCriteria: JSON.stringify(parseCsv(String(formData.get("killCriteria") ?? ""))),
      nextMove: String(formData.get("nextMove") ?? "") || null,
    },
  });

  revalidatePath("/market-intel");
}

export default async function MarketIntelPage() {
  const [products, latest] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.marketValidation.findFirst({ orderBy: { updatedAt: "desc" } }),
  ]);

  return (
    <>
      <AppHeader screenId="market-intel" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Validation marche" subtitle="Minimum 3 preuves avant GO">
          <form action={upsertMarketValidation} className="space-y-3 text-xs">
            <select name="productId" required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Selectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <select name="temperature" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="COLD">FROID</option>
              <option value="WARM">TIEDE</option>
              <option value="HOT">CHAUD</option>
            </select>
            <input name="searchSignals" placeholder="Search signals (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="socialSignals" placeholder="Social signals (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="purchaseSignals" placeholder="Purchase signals (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="contentSignals" placeholder="Content signals (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="dominantObjections" placeholder="Objections dominantes (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="soughtBenefits" placeholder="Benefices recherches (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="saturatedAngles" placeholder="Angles satures (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="freeAngles" placeholder="Angles libres (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="killCriteria" placeholder="Kill criteria (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="nextMove" placeholder="Next move" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Enregistrer validation" />
          </form>
        </Card>
        {latest ? (
          <ModuleOutputCard output={marketOutput(latest)} />
        ) : (
          <ModuleOutputCard
            output={{
              summary: "Aucune validation marche enregistree.",
              key_findings: ["Associe d'abord un produit puis ajoute des preuves."],
              decision: "NOT_ENOUGH_DATA",
              why: "Pas de dataset marche actuellement.",
              risks: ["GO sans preuves."],
              kill_criteria: ["Si moins de 3 preuves, interdire lancement."],
              next_move: "Completer la premiere fiche Market Validation.",
              assets_to_generate: ["proof checklist"],
              structured_json: {},
            }}
          />
        )}
      </main>
    </>
  );
}
