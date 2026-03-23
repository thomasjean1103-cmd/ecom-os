import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { parseCsv } from "@/lib/intelligence";
import { prisma } from "@/lib/prisma";
import { avatarOutput } from "@/lib/strategy";

async function createAvatar(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const productIdRaw = String(formData.get("productId") ?? "");

  await prisma.avatar.create({
    data: {
      name,
      productId: productIdRaw || null,
      identity: String(formData.get("identity") ?? "") || null,
      currentSituation: String(formData.get("currentSituation") ?? "") || null,
      mainPain: String(formData.get("mainPain") ?? "") || null,
      failedSolutions: JSON.stringify(parseCsv(String(formData.get("failedSolutions") ?? ""))),
      beliefs: JSON.stringify(parseCsv(String(formData.get("beliefs") ?? ""))),
      hiddenDesire: String(formData.get("hiddenDesire") ?? "") || null,
      buyingMoment: String(formData.get("buyingMoment") ?? "") || null,
      copyTriggers: JSON.stringify(parseCsv(String(formData.get("copyTriggers") ?? ""))),
      trustTriggers: JSON.stringify(parseCsv(String(formData.get("trustTriggers") ?? ""))),
      resistanceTriggers: JSON.stringify(parseCsv(String(formData.get("resistanceTriggers") ?? ""))),
      tofMessage: String(formData.get("tofMessage") ?? "") || null,
      mofMessage: String(formData.get("mofMessage") ?? "") || null,
      bofMessage: String(formData.get("bofMessage") ?? "") || null,
      hottestMoment: String(formData.get("hottestMoment") ?? "") || null,
      whyHotThen: String(formData.get("whyHotThen") ?? "") || null,
      bestAngleForMoment: String(formData.get("bestAngleForMoment") ?? "") || null,
    },
  });

  revalidatePath("/avatar-studio");
}

export default async function AvatarStudioPage() {
  const [products, avatars] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.avatar.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <>
      <AppHeader screenId="avatar-studio" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="Avatar Studio" subtitle="Avatar actionnable + messaging map">
          <form action={createAvatar} className="space-y-3 text-xs">
            <div className="grid gap-2 md:grid-cols-2">
              <input name="name" required placeholder="Nom avatar" className="rounded border border-zinc-700 bg-zinc-950 p-2" />
              <select name="productId" className="rounded border border-zinc-700 bg-zinc-950 p-2">
                <option value="">Sans produit</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <input name="identity" placeholder="Identite" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="currentSituation" placeholder="Situation actuelle" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="mainPain" placeholder="Douleur principale" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="failedSolutions" placeholder="Solutions ratees (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="beliefs" placeholder="Croyances (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="hiddenDesire" placeholder="Hidden desire" className="min-h-14 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="buyingMoment" placeholder="Buying moment" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="copyTriggers" placeholder="Copy triggers (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="trustTriggers" placeholder="Trust triggers (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="resistanceTriggers" placeholder="Resistance triggers (csv)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="tofMessage" placeholder="Message TOF" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="mofMessage" placeholder="Message MOF" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <textarea name="bofMessage" placeholder="Message BOF" className="min-h-12 w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="hottestMoment" placeholder="Moment le plus chaud" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="whyHotThen" placeholder="Pourquoi a ce moment" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input name="bestAngleForMoment" placeholder="Angle recommande" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <button type="submit" className="rounded bg-zinc-100 px-3 py-2 font-semibold text-zinc-900">Enregistrer avatar</button>
          </form>
        </Card>
        <ModuleOutputCard output={avatarOutput(avatars)} />
      </main>
    </>
  );
}
