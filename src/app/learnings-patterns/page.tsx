import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { safeJsonArray } from "@/lib/json";
import { memoryOutput } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

async function createLearning(formData: FormData) {
  "use server";
  const type = String(formData.get("type") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!type || !description) return;
  await prisma.learning.create({
    data: {
      type,
      description,
      productType: String(formData.get("productType") ?? "") || null,
      avatar: String(formData.get("avatar") ?? "") || null,
      angle: String(formData.get("angle") ?? "") || null,
      trafficContext: String(formData.get("trafficContext") ?? "") || null,
      tags: JSON.stringify(
        String(formData.get("tags") ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
      impact: String(formData.get("impact") ?? "") || null,
      sourceExperimentId: String(formData.get("sourceExperimentId") ?? "") || null,
    },
  });
  revalidatePath("/learnings-patterns");
}

async function createPattern(formData: FormData) {
  "use server";
  const category = String(formData.get("category") ?? "").trim();
  const pattern = String(formData.get("pattern") ?? "").trim();
  if (!category || !pattern) return;
  await prisma.winningPattern.create({
    data: {
      category,
      pattern,
      evidence: safeJsonArray(String(formData.get("evidence") ?? "[]")),
      tags: safeJsonArray(String(formData.get("tags") ?? "[]")),
    },
  });
  revalidatePath("/learnings-patterns");
}

async function createDeadAngle(formData: FormData) {
  "use server";
  const angle = String(formData.get("angle") ?? "").trim();
  const whyFailed = String(formData.get("whyFailed") ?? "").trim();
  if (!angle || !whyFailed) return;
  await prisma.deadAngle.create({
    data: {
      angle,
      niche: String(formData.get("niche") ?? "") || null,
      whyFailed,
      observedSymptom: String(formData.get("observedSymptom") ?? "") || null,
    },
  });
  revalidatePath("/learnings-patterns");
}

export default async function LearningsPatternsPage() {
  const [learnings, patternCount, deadAngleCount] = await Promise.all([
    prisma.learning.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.winningPattern.count(),
    prisma.deadAngle.count(),
  ]);

  return (
    <>
      <AppHeader screenId="learnings-patterns" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Learnings Vault" subtitle="Ce qui marche / echoue / contexte">
          <form action={createLearning} className="space-y-3 text-xs">
            <input name="type" required placeholder="win | loss | insight" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="description" required placeholder="Description apprentissage" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="productType" placeholder="Type produit" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="avatar" placeholder="Avatar" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="angle" placeholder="Angle" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="trafficContext" placeholder="Contexte trafic" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="impact" placeholder="high | medium | low" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="tags" placeholder="Tags csv" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="sourceExperimentId" placeholder="Experiment ID source" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter learning" />
          </form>
        </Card>

        <Card title="Winning Pattern Library" subtitle="Patterns replicables">
          <form action={createPattern} className="space-y-3 text-xs">
            <input name="category" required placeholder="hook | offer | pdp | objection | ugc | email" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="pattern" required placeholder="Pattern gagnant" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="evidence" placeholder='Evidence JSON' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="tags" placeholder='Tags JSON' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter pattern" />
          </form>
        </Card>

        <Card title="Dead Angle Registry" subtitle="Angles brules a ne pas recycler">
          <form action={createDeadAngle} className="space-y-3 text-xs">
            <input name="angle" required placeholder="Angle mort" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="niche" placeholder="Niche" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="whyFailed" required placeholder="Pourquoi echec" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="observedSymptom" placeholder="Symptome observe" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter dead angle" />
          </form>
        </Card>

        <ModuleOutputCard output={memoryOutput(learnings, patternCount, deadAngleCount)} />
      </main>
    </>
  );
}
