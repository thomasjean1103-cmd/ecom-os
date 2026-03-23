import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { RichProductOutputDisplay } from "@/components/ui/rich-product-output";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { computeProductScore, productOutput } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";

async function createProduct(formData: FormData) {
  "use server";

  const toInt = (key: string) => {
    const v = Number(formData.get(key) ?? 0);
    return Math.min(10, Math.max(1, isNaN(v) ? 1 : v));
  };
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
  { key: "painIntensity",         label: "Intensité douleur résolue",       accent: "#ef4444" },
  { key: "tam",                   label: "TAM / Taille du marché",           accent: "#3b82f6" },
  { key: "differentiation",       label: "Différenciation possible",         accent: "#8b5cf6" },
  { key: "potentialMargin",       label: "Marge potentielle",                accent: "#22c55e" },
  { key: "potentialAov",          label: "Potentiel AOV",                    accent: "#f97316" },
  { key: "bundleCapacity",        label: "Capacité bundle / upsell",         accent: "#eab308" },
  { key: "retentionPotential",    label: "Rétention / Répétition",           accent: "#06b6d4" },
  { key: "visualDemo",            label: "Démo visuelle / wow effect",       accent: "#ec4899" },
  { key: "adAngleCount",          label: "Angles pub disponibles",           accent: "#a855f7" },
  { key: "multiSourceValidation", label: "Validation multi-sources",         accent: "#10b981" },
] as const;

function verdictColor(v: string) {
  if (v === "GO") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (v === "NO_GO") return "text-red-400 bg-red-500/10 border-red-500/30";
  return "text-amber-400 bg-amber-500/10 border-amber-500/30";
}

export default async function ProductScoutPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const latest = products[0];

  return (
    <>
      <AppHeader screenId="product-scout" />
      <main className="p-4 md:p-6 space-y-6">

        {/* Top row: form + rich output side by side */}
        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">

          {/* ── Form ── */}
          <Card title="Nouveau scoring produit" subtitle="10 critères notés 1 à 10">
            <form action={createProduct} className="space-y-3 text-xs">
              {/* Basics */}
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Nom du produit *"
                  required
                  className="col-span-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  name="niche"
                  placeholder="Niche (ex: wellness, fitness…)"
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  name="bestPath"
                  placeholder="Path: cashflow | brandable | paid-first…"
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <textarea
                name="description"
                placeholder="Description courte du produit"
                className="min-h-16 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />

              {/* Scoring grid */}
              <div className="grid grid-cols-2 gap-2">
                {scoreFields.map(({ key, label, accent }) => (
                  <label key={key} className="space-y-1">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: accent }}
                      />
                      {label}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      name={key}
                      defaultValue={5}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
                    />
                  </label>
                ))}
              </div>

              <textarea
                name="whatMustBeTrue"
                placeholder="What Must Be True pour que ça marche"
                className="min-h-14 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              <textarea
                name="whatKillsIt"
                placeholder="Ce qui tue le produit"
                className="min-h-14 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              <textarea
                name="notes"
                placeholder="Notes libres"
                className="min-h-14 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />

              <SubmitButton label="Scorer et générer l'analyse" />
            </form>
          </Card>

          {/* ── Rich output ── */}
          <div className="min-w-0">
            {latest ? (
              <div className="space-y-3">
                {/* Product title bar */}
                <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-zinc-100">{latest.name}</p>
                    <p className="text-[11px] text-zinc-500">{latest.niche ?? "—"} · Score {latest.totalScore}/100</p>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${verdictColor(latest.verdict)}`}>
                    {latest.verdict}
                  </span>
                </div>

                <RichProductOutputDisplay output={productOutput(latest)} />
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 text-center">
                <p className="text-sm font-medium text-zinc-400">Aucun produit scoré</p>
                <p className="mt-1 text-xs text-zinc-600">
                  Remplis le formulaire pour générer l&apos;analyse complète 16 sections.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {products.length > 0 && (
          <Card title="Historique des scorings" subtitle={`${products.length} produits — 12 derniers`}>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-xs">
              {products.map((product) => (
                <div key={product.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <p className="font-semibold text-zinc-100 leading-snug">{product.name}</p>
                    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-black ${verdictColor(product.verdict)}`}>
                      {product.verdict}
                    </span>
                  </div>
                  {product.niche && <p className="text-zinc-500">{product.niche}</p>}
                  <div className="mt-2 h-1 w-full rounded-full bg-zinc-800">
                    <div
                      className="h-1 rounded-full bg-indigo-500"
                      style={{ width: `${product.totalScore}%` }}
                    />
                  </div>
                  <p className="mt-1 text-zinc-500">{product.totalScore}/100</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
