import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { safeJsonObject } from "@/lib/json";
import { creativeLabOutput } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

async function createCreative(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.creative.create({
    data: {
      name,
      hypothesis: String(formData.get("hypothesis") ?? "") || null,
      angle: String(formData.get("angle") ?? "") || null,
      persona: String(formData.get("persona") ?? "") || null,
      hookVisual: String(formData.get("hookVisual") ?? "") || null,
      hookVerbal: String(formData.get("hookVerbal") ?? "") || null,
      patternInterrupt: String(formData.get("patternInterrupt") ?? "") || null,
      proofType: String(formData.get("proofType") ?? "") || null,
      cta: String(formData.get("cta") ?? "") || null,
      format: String(formData.get("format") ?? "") || null,
      kpiTarget: safeJsonObject(String(formData.get("kpiTarget") ?? ""), "{}"),
      killThreshold: safeJsonObject(String(formData.get("killThreshold") ?? ""), "{}"),
    },
  });
  revalidatePath("/creative-lab");
}

export default async function CreativeLabPage() {
  const items = await prisma.creative.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
  return (
    <>
      <AppHeader screenId="creative-lab" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Creative Lab" subtitle="Matrice creative + kill thresholds">
          <form action={createCreative} className="space-y-3 text-xs">
            <input name="name" required placeholder="Nom creative" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="hypothesis" placeholder="Hypothese testee" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="angle" placeholder="Angle" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="persona" placeholder="Persona cible" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="hookVisual" placeholder="Hook visuel" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="hookVerbal" placeholder="Hook verbal" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="patternInterrupt" placeholder="Pattern interrupt" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="proofType" placeholder="Preuve: ugc | demo | stat | testimonial" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="cta" placeholder="CTA" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="format" placeholder="Format creative" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="kpiTarget" placeholder='KPI cible JSON ex: {"metric":"CTR","target":2.0}' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="killThreshold" placeholder='Kill threshold JSON ex: {"metric":"CPC","max":3.0}' className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter creative" />
          </form>
        </Card>
        <ModuleOutputCard output={creativeLabOutput(items)} />
      </main>
    </>
  );
}
