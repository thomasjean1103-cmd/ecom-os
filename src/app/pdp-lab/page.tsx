import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { safeJsonObject } from "@/lib/json";
import { pdpOutput } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

async function createPdp(formData: FormData) {
  "use server";
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;
  await prisma.pdpVersion.create({
    data: {
      productId,
      version: Number(formData.get("version") ?? 1),
      priorityGoal: String(formData.get("priorityGoal") ?? "") || null,
      heroSection: safeJsonObject(String(formData.get("heroSection") ?? "{}")),
      problemSection: safeJsonObject(String(formData.get("problemSection") ?? "{}")),
      solutionSection: safeJsonObject(String(formData.get("solutionSection") ?? "{}")),
      socialProofSection: safeJsonObject(String(formData.get("socialProofSection") ?? "{}")),
      howItWorksSection: safeJsonObject(String(formData.get("howItWorksSection") ?? "{}")),
      objectionSection: safeJsonObject(String(formData.get("objectionSection") ?? "{}")),
      finalCtaSection: safeJsonObject(String(formData.get("finalCtaSection") ?? "{}")),
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  revalidatePath("/pdp-lab");
}

export default async function PdpLabPage() {
  const [products, versions] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.pdpVersion.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  return (
    <>
      <AppHeader screenId="pdp-lab" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="PDP Lab" subtitle="PDP 7 sections ordre fixe">
          <form action={createPdp} className="space-y-3 text-xs">
            <select name="productId" required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Selectionner un produit</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input type="number" name="version" defaultValue={1} className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="priorityGoal" placeholder="increase_atc | justify_price | reassure | increase_aov | prequalify" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="heroSection" placeholder="Hero section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="problemSection" placeholder="Problem section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="solutionSection" placeholder="Solution section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="socialProofSection" placeholder="Social proof section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="howItWorksSection" placeholder="How it works section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="objectionSection" placeholder="Objection section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="finalCtaSection" placeholder="Final CTA section JSON" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="notes" placeholder="Notes" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter version PDP" />
          </form>
        </Card>
        <ModuleOutputCard output={pdpOutput(versions)} />
      </main>
    </>
  );
}
