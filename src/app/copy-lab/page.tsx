import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { copyLabOutput } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

async function createCopyAsset(formData: FormData) {
  "use server";
  const type = String(formData.get("type") ?? "").trim();
  if (!type) return;
  await prisma.copyAsset.create({
    data: {
      type,
      angle: String(formData.get("angle") ?? "") || null,
      funnelStage: String(formData.get("funnelStage") ?? "") || null,
      targetEmotion: String(formData.get("targetEmotion") ?? "") || null,
      objectionHandled: String(formData.get("objectionHandled") ?? "") || null,
      contentSafe: String(formData.get("contentSafe") ?? "") || null,
      contentAggressive: String(formData.get("contentAggressive") ?? "") || null,
      objective: String(formData.get("objective") ?? "") || null,
      productNiche: String(formData.get("productNiche") ?? "") || null,
    },
  });
  revalidatePath("/copy-lab");
}

export default async function CopyLabPage() {
  const assets = await prisma.copyAsset.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
  return (
    <>
      <AppHeader screenId="copy-lab" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Copy Lab" subtitle="Hooks, ads, PDP, emails, objections">
          <form action={createCopyAsset} className="space-y-3 text-xs">
            <input name="type" placeholder="type: hook | ad_copy | pdp_copy..." required className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="angle" placeholder="Angle" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="funnelStage" placeholder="TOF | MOF | BOF" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="targetEmotion" placeholder="Emotion visee" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="objectionHandled" placeholder="Objection traitee" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="contentSafe" placeholder="Variante safe" className="min-h-16 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="contentAggressive" placeholder="Variante agressive" className="min-h-16 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="objective" placeholder="Objectif du bloc" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="productNiche" placeholder="Niche" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Ajouter asset" />
          </form>
        </Card>
        <ModuleOutputCard output={copyLabOutput(assets)} />
      </main>
    </>
  );
}
