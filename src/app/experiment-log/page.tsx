import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { safeJsonObject } from "@/lib/json";
import { experimentOutput } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

async function createLearningFromExperiment(experimentId: string, verdict: string) {
  if (verdict === "RUNNING" || verdict === "NOT_ENOUGH_DATA") {
    return;
  }
  const experiment = await prisma.experiment.findUnique({
    where: { id: experimentId },
    include: { product: true },
  });
  if (!experiment || experiment.learningGenerated) {
    return;
  }

  await prisma.learning.create({
    data: {
      type: verdict === "SCALE" || verdict === "KEEP" ? "win" : "insight",
      description: `Experiment ${experiment.name} closed with verdict ${verdict}.`,
      productType: experiment.product?.niche ?? null,
      angle: experiment.type ?? null,
      trafficContext: "experiment-log",
      tags: JSON.stringify(["auto-generated", "experiment", verdict.toLowerCase()]),
      impact: verdict === "SCALE" ? "high" : "medium",
      sourceExperimentId: experiment.id,
    },
  });

  await prisma.experiment.update({
    where: { id: experiment.id },
    data: { learningGenerated: true },
  });
}

async function createExperiment(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const hypothesis = String(formData.get("hypothesis") ?? "").trim();
  const variableChanged = String(formData.get("variableChanged") ?? "").trim();
  if (!name || !hypothesis || !variableChanged) return;
  const verdict = String(formData.get("verdict") ?? "RUNNING");
  const experiment = await prisma.experiment.create({
    data: {
      productId: String(formData.get("productId") ?? "") || null,
      name,
      type: String(formData.get("type") ?? "") || null,
      hypothesis,
      variableChanged,
      keptConstant: String(formData.get("keptConstant") ?? "") || null,
      metricsBefore: safeJsonObject(String(formData.get("metricsBefore") ?? "{}")),
      metricsAfter: safeJsonObject(String(formData.get("metricsAfter") ?? "{}")),
      killThreshold: safeJsonObject(String(formData.get("killThreshold") ?? "{}")),
      verdict,
      reviewDate: formData.get("reviewDate")
        ? new Date(String(formData.get("reviewDate")))
        : null,
    },
  });
  await createLearningFromExperiment(experiment.id, verdict);
  revalidatePath("/experiment-log");
}

async function closeExperiment(formData: FormData) {
  "use server";
  const experimentId = String(formData.get("experimentId") ?? "");
  const verdict = String(formData.get("verdict") ?? "");
  const verdictNotes = String(formData.get("verdictNotes") ?? "");
  if (!experimentId || !verdict) return;

  await prisma.experiment.update({
    where: { id: experimentId },
    data: {
      verdict,
      verdictNotes: verdictNotes || null,
      endDate: new Date(),
    },
  });
  await createLearningFromExperiment(experimentId, verdict);
  revalidatePath("/experiment-log");
}

async function createWeeklyPriority(formData: FormData) {
  "use server";
  const moneyMove = String(formData.get("moneyMove") ?? "").trim();
  if (!moneyMove) return;
  await prisma.weeklyPriority.create({
    data: {
      weekStart: new Date(String(formData.get("weekStart") ?? new Date().toISOString())),
      moneyMove,
      biggestLeak: String(formData.get("biggestLeak") ?? "") || null,
      leakMetric: String(formData.get("leakMetric") ?? "") || null,
      secondaryTasks: JSON.stringify(
        String(formData.get("secondaryTasks") ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 2),
      ),
    },
  });
  revalidatePath("/experiment-log");
}

export default async function ExperimentLogPage() {
  const [products, experiments] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.experiment.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  return (
    <>
      <AppHeader screenId="experiment-log" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Experiment Builder" subtitle="1 variable changee, 7-14 jours minimum">
          <form action={createExperiment} className="space-y-3 text-xs">
            <select name="productId" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Sans produit</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input name="name" required placeholder="Nom test" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="type" placeholder="angle | creative | offer | pdp | price | copy" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="hypothesis" required placeholder="Hypothese" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="variableChanged" required placeholder="Variable changee" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="keptConstant" placeholder="Ce qui ne change pas" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="metricsBefore" placeholder='Metrics before JSON' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="metricsAfter" placeholder='Metrics after JSON' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="killThreshold" placeholder='Kill threshold JSON' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <select name="verdict" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="RUNNING">RUNNING</option>
              <option value="CUT">CUT</option>
              <option value="ITERATE">ITERATE</option>
              <option value="KEEP">KEEP</option>
              <option value="SCALE">SCALE</option>
              <option value="NOT_ENOUGH_DATA">NOT_ENOUGH_DATA</option>
            </select>
            <input type="date" name="reviewDate" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Creer test" />
          </form>
        </Card>
        <Card title="Weekly Priority Engine" subtitle="UNE seule priorite majeure">
          <form action={createWeeklyPriority} className="space-y-3 text-xs">
            <input type="date" name="weekStart" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="moneyMove" required placeholder="This week's money move" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="biggestLeak" placeholder="Biggest leak" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="leakMetric" placeholder="Metric leak associee" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="secondaryTasks" placeholder="Secondary tasks (csv, max 2)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Enregistrer priorite" />
          </form>
        </Card>
        <Card title="Close Test + Auto Learning" subtitle="Fermer un test et alimenter la memoire">
          <form action={closeExperiment} className="space-y-3 text-xs">
            <select name="experimentId" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="">Selectionner test</option>
              {experiments.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.verdict})
                </option>
              ))}
            </select>
            <select name="verdict" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2">
              <option value="CUT">CUT</option>
              <option value="ITERATE">ITERATE</option>
              <option value="KEEP">KEEP</option>
              <option value="SCALE">SCALE</option>
              <option value="NOT_ENOUGH_DATA">NOT_ENOUGH_DATA</option>
            </select>
            <textarea name="verdictNotes" placeholder="Notes verdict" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Fermer test" />
          </form>
        </Card>
        <ModuleOutputCard output={experimentOutput(experiments)} />
      </main>
    </>
  );
}
