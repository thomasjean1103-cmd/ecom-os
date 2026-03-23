import { revalidatePath } from "next/cache";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { croOutput } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

async function createCroAudit(formData: FormData) {
  "use server";
  const bounceRate = Number(formData.get("bounceRate") ?? 0);
  const cartAbandonRate = Number(formData.get("cartAbandonRate") ?? 0);
  const avgTimeOnSite = Number(formData.get("avgTimeOnSite") ?? 0);

  const biggestLeak =
    bounceRate > 60
      ? "Clarte/message/visuel/vitesse"
      : cartAbandonRate > 70
        ? "Checkout/friction/reassurance"
        : "Message-to-market fit";
  const secondLeak = cartAbandonRate > 70 ? "Relance abandon panier" : "Preuve sociale";
  const weeklyMoneyMove =
    cartAbandonRate > 70
      ? "Reduire friction checkout mobile + activer reassurance paiement."
      : bounceRate > 60
        ? "Refondre hero + promesse + vitesse page."
        : "Optimiser preuve sociale et urgence credible.";

  await prisma.croAudit.create({
    data: {
      bounceRate,
      cartAbandonRate,
      avgTimeOnSite,
      conversionRate: Number(formData.get("conversionRate") ?? 0) || null,
      aov: Number(formData.get("aov") ?? 0) || null,
      atcRate: Number(formData.get("atcRate") ?? 0) || null,
      biggestLeak,
      secondLeak,
      quickWins: JSON.stringify([
        "Fixer trust badges checkout",
        "Compresser images hero",
        "Clarifier proposition above the fold",
      ]),
      heavyWork: JSON.stringify(["Refonte PDP complete", "Refonte pricing/offer architecture"]),
      weeklyMoneyMove,
      notes: avgTimeOnSite < 60 ? "Temps moyen < 1 min: verifier qualite trafic + message." : null,
    },
  });
  revalidatePath("/cro-diagnostic");
}

export default async function CroDiagnosticPage() {
  const latest = await prisma.croAudit.findFirst({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <AppHeader screenId="cro-diagnostic" />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <Card title="CRO Diagnostic" subtitle="Biggest leak + money move de la semaine">
          <form action={createCroAudit} className="space-y-3 text-xs">
            <input type="number" step="0.01" name="bounceRate" placeholder="Bounce rate %" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input type="number" step="0.01" name="cartAbandonRate" placeholder="Cart abandon rate %" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input type="number" step="0.01" name="avgTimeOnSite" placeholder="Temps moyen site (sec)" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input type="number" step="0.01" name="conversionRate" placeholder="CVR %" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input type="number" step="0.01" name="aov" placeholder="AOV" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <input type="number" step="0.01" name="atcRate" placeholder="ATC %" className="w-full rounded border border-zinc-700 bg-zinc-950 p-2" />
            <SubmitButton label="Lancer diagnostic" />
          </form>
        </Card>
        <ModuleOutputCard output={croOutput(latest)} />
      </main>
    </>
  );
}
