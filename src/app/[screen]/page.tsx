import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/header";
import { ModuleOutputCard } from "@/components/ui/module-output-card";
import { SCREENS } from "@/config/screens";
import { defaultModuleOutput } from "@/lib/mock-data";
import type { ScreenId } from "@/lib/types";

const allowedScreens = new Set(SCREENS.map((screen) => screen.id));

function getActionItems(screenId: ScreenId): string[] {
  const common = [
    "Capturer des donnees reelles depuis formulaire module.",
    "Generer decision + kill criteria automatiquement.",
    "Sauvegarder verdict vers la couche memoire.",
  ];

  if (screenId === "product-scout") {
    return [
      "Scorer 10 criteres (1-10) puis calcul total.",
      "Appliquer verdict automatique: <40 NO_GO, 40-64 TEST, 65+ GO.",
      ...common,
    ];
  }

  if (screenId === "cro-diagnostic") {
    return [
      "Entrer Bounce, ATC, CVR, AOV, abandon checkout, temps moyen.",
      "Sortir Biggest Leak, Second Leak, Quick Wins, Chantier Lourd.",
      ...common,
    ];
  }

  return common;
}

export default async function ScreenPage({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const { screen } = await params;
  if (!allowedScreens.has(screen as ScreenId) || screen === "command-center") {
    notFound();
  }

  const screenId = screen as ScreenId;
  const current = SCREENS.find((item) => item.id === screenId);
  if (!current) {
    notFound();
  }

  return (
    <>
      <AppHeader screenId={screenId} />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <h2 className="text-sm font-semibold text-zinc-100">Module Scope</h2>
          <p className="mt-2 text-sm text-zinc-300">{current.description}</p>
          <ul className="mt-4 list-disc space-y-1 pl-4 text-xs text-zinc-400">
            {getActionItems(screenId).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <ModuleOutputCard output={defaultModuleOutput} />
      </main>
    </>
  );
}
