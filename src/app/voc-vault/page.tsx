import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { parseCsv, vocOutput } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";

async function createVocEntry(formData: FormData) {
  "use server";
  const quote = String(formData.get("quote") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  if (!quote || !type) return;

  await prisma.vocEntry.create({
    data: {
      quote,
      type,
      source: String(formData.get("source") ?? "") || null,
      sourceUrl: String(formData.get("sourceUrl") ?? "") || null,
      usage: JSON.stringify(parseCsv(String(formData.get("usage") ?? ""))),
      frequency: Number(formData.get("frequency") ?? 1),
      emotionalIntensity: Number(formData.get("emotionalIntensity") ?? 3),
      purchaseProximity: Number(formData.get("purchaseProximity") ?? 3),
      productNiche: String(formData.get("productNiche") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });

  revalidatePath("/voc-vault");
}

export default async function VocVaultPage() {
  const entries = await prisma.vocEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <>
      <AppHeader screenId="voc-vault" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Ajouter verbatim" subtitle="Tag + usage + scores 1-5">
          <form action={createVocEntry} className="space-y-3 text-xs">
            <textarea name="quote" required placeholder="Citation client exacte" className="min-h-20 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <div className="grid gap-2 md:grid-cols-2">
              <input name="type" required placeholder="type: pain | desire | objection..." className="rounded border border-zinc-700 bg-zinc-950 p-2" />
              <input name="source" placeholder="source: review | forum | email..." className="rounded border border-zinc-700 bg-zinc-950 p-2" />
            </div>
            <input name="sourceUrl" placeholder="URL source" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="usage" placeholder="usage recommande (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <div className="grid grid-cols-3 gap-2">
              <label className="space-y-1">
                <span className="text-zinc-400">Frequence</span>
                <input type="number" min={1} name="frequency" defaultValue={1} className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
              </label>
              <label className="space-y-1">
                <span className="text-zinc-400">Intensite emotion</span>
                <input type="number" min={1} max={5} name="emotionalIntensity" defaultValue={3} className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
              </label>
              <label className="space-y-1">
                <span className="text-zinc-400">Proximite achat</span>
                <input type="number" min={1} max={5} name="purchaseProximity" defaultValue={3} className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
              </label>
            </div>
            <input name="productNiche" placeholder="Niche" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="notes" placeholder="Notes" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter verbatim" />
          </form>
        </Card>
        <ModuleOutputCard output={vocOutput(entries)} />
        <Card title="VOC recents" subtitle="Verbatims exploitables">
          <div className="space-y-2 text-xs">
            {entries.length === 0 ? (
              <p className="rounded border border-dashed border-zinc-700 p-3 text-zinc-400">
                Aucun verbatim. Ajoute des citations clients pour nourrir copy et offers.
              </p>
            ) : (
              entries.map((entry) => (
              <div key={entry.id} className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <p className="text-zinc-100">{entry.quote}</p>
                <p className="mt-1 text-zinc-400">
                  {entry.type} | prox achat {entry.purchaseProximity}/5 | intensite {entry.emotionalIntensity}/5
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
