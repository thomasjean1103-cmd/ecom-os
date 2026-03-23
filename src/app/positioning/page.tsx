import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { positioningOutput } from "@/lib/strategy";

async function upsertPositioning(formData: FormData) {
  "use server";
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  await prisma.positioning.upsert({
    where: { productId },
    update: {
      mainEnemy: String(formData.get("mainEnemy") ?? "") || null,
      beatenAlternative: String(formData.get("beatenAlternative") ?? "") || null,
      corePromise: String(formData.get("corePromise") ?? "") || null,
      differentiatingMechanism: String(formData.get("differentiatingMechanism") ?? "") || null,
      mainProof: String(formData.get("mainProof") ?? "") || null,
      recommendedTone: String(formData.get("recommendedTone") ?? "") || null,
      visualTerritory: String(formData.get("visualTerritory") ?? "") || null,
      comparisonTerrain: String(formData.get("comparisonTerrain") ?? "") || null,
    },
    create: {
      productId,
      mainEnemy: String(formData.get("mainEnemy") ?? "") || null,
      beatenAlternative: String(formData.get("beatenAlternative") ?? "") || null,
      corePromise: String(formData.get("corePromise") ?? "") || null,
      differentiatingMechanism: String(formData.get("differentiatingMechanism") ?? "") || null,
      mainProof: String(formData.get("mainProof") ?? "") || null,
      recommendedTone: String(formData.get("recommendedTone") ?? "") || null,
      visualTerritory: String(formData.get("visualTerritory") ?? "") || null,
      comparisonTerrain: String(formData.get("comparisonTerrain") ?? "") || null,
    },
  });
  revalidatePath("/positioning");
}

export default async function PositioningPage() {
  const [products, latest] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.positioning.findFirst({ orderBy: { updatedAt: "desc" } }),
  ]);
  return (
    <>
      <AppHeader screenId="positioning" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Positioning Engine" subtitle="Doctrine de bataille produit">
          <form action={upsertPositioning} className="space-y-3 text-xs">
            <select name="productId" required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Selectionner un produit</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input name="mainEnemy" placeholder="Ennemi principal" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="beatenAlternative" placeholder="Alternative battue" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="corePromise" placeholder="Promesse centrale" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="differentiatingMechanism" placeholder="Mecanisme differenciant" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="mainProof" placeholder="Preuve principale" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="recommendedTone" placeholder="Ton recommande" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="visualTerritory" placeholder="Territoire visuel" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="comparisonTerrain" placeholder="Terrain de comparaison" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <button type="submit" className="rounded bg-zinc-100 px-3 py-2 font-semibold text-zinc-900">Enregistrer positionnement</button>
          </form>
        </Card>
        <ModuleOutputCard output={positioningOutput(latest)} />
      </main>
    </>
  );
}
