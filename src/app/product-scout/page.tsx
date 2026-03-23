import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { computeProductScore, productOutput } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";

async function createProduct(formData: FormData) {
  "use server";

  const toInt = (key: string) => Number(formData.get(key) ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const payload = {
    painIntensity: toInt("painIntensity"),
    tam: toInt("tam"),
    differentiation: toInt("differentiation"),
    potentialMargin: toInt("potentialMargin"),
    potentialAov: toInt("potentialAov"),
    bundleCapacity: toInt("bundleCapacity"),
    retentionPotential: toInt("retentionPotential"),
    visualDemo: toInt("visualDemo"),
    adAngleCount: toInt("adAngleCount"),
    multiSourceValidation: toInt("multiSourceValidation"),
  };

  const { total, verdict } = computeProductScore(payload);
  await prisma.product.create({
    data: {
      name,
      niche: String(formData.get("niche") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      ...payload,
      totalScore: total,
      verdict,
      bestPath: String(formData.get("bestPath") ?? "") || null,
      whatMustBeTrue: String(formData.get("whatMustBeTrue") ?? "") || null,
      whatKillsIt: String(formData.get("whatKillsIt") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });

  revalidatePath("/product-scout");
}

const scoreFields = [
  ["painIntensity", "Intensite probleme resolu"],
  ["tam", "TAM"],
  ["differentiation", "Differenciation possible"],
  ["potentialMargin", "Marge potentielle"],
  ["potentialAov", "Potentiel AOV"],
  ["bundleCapacity", "Capacite bundle"],
  ["retentionPotential", "Retention / repetition"],
  ["visualDemo", "Demonstration visuelle"],
  ["adAngleCount", "Nombre d'angles pub"],
  ["multiSourceValidation", "Validation multi-sources"],
] as const;

export default async function ProductScoutPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const latest = products[0];

  return (
    <>
      <AppHeader screenId="product-scout" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Nouveau scoring produit" subtitle="10 criteres notes 1 a 10">
          <form action={createProduct} className="space-y-3 text-xs">
            <div className="grid gap-2 md:grid-cols-2">
              <input name="name" placeholder="Nom produit" required className="rounded border border-zinc-700 bg-zinc-950 p-2" />
              <input name="niche" placeholder="Niche" className="rounded border border-zinc-700 bg-zinc-950 p-2" />
            </div>
            <textarea name="description" placeholder="Description courte" className="min-h-20 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <div className="grid grid-cols-2 gap-2">
              {scoreFields.map(([key, label]) => (
                <label key={key} className="space-y-1">
                  <span className="text-zinc-400">{label}</span>
                  <input type="number" min={1} max={10} name={key} defaultValue={5} className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
                </label>
              ))}
            </div>
            <input name="bestPath" placeholder="best path: cashflow | brandable | paid-first ..." className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="whatMustBeTrue" placeholder="What Must Be True" className="min-h-16 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="whatKillsIt" placeholder="Ce qui le tue" className="min-h-16 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="notes" placeholder="Notes" className="min-h-16 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Enregistrer et scorer" />
          </form>
        </Card>

        <ModuleOutputCard
          output={
            latest
              ? productOutput(latest)
              : {
                  summary: "Aucun produit score pour le moment.",
                  key_findings: ["Ajoute un produit pour declencher scoring + verdict."],
                  decision: "NOT_ENOUGH_DATA",
                  why: "Le module n'a pas encore de donnees.",
                  risks: ["Decision sans data."],
                  kill_criteria: ["Si aucun produit saisi cette semaine, stop pipeline acquisition."],
                  next_move: "Creer le premier score produit.",
                  assets_to_generate: ["grille de notation"],
                  structured_json: {},
                }
          }
        />

        <Card title="Produits recents" subtitle="Historique des 12 derniers scorings">
          <div className="space-y-2 text-xs">
            {products.length === 0 ? (
              <p className="rounded border border-dashed border-zinc-700 p-3 text-zinc-400">
                Aucun produit encore. Commence par un scoring ci-dessus.
              </p>
            ) : (
              products.map((product) => (
              <div key={product.id} className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <p className="font-semibold text-zinc-100">{product.name}</p>
                <p className="text-zinc-400">
                  Score {product.totalScore}/100 - Verdict {product.verdict}
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
