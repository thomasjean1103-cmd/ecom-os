import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  TrendingUp,
  Zap,
} from "lucide-react";

import { AppHeader } from "@/components/layout/header";
import { DecisionBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { commandCenterData } from "@/lib/module-outputs";
import { prisma } from "@/lib/prisma";

export default async function CommandCenterPage() {
  const [priority, cro, experiments, learnings, latestKpi] = await Promise.all([
    prisma.weeklyPriority.findFirst({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } }),
    prisma.croAudit.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.experiment.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.learning.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.kpiSnapshot.findFirst({ orderBy: { date: "desc" } }),
  ]);
  const data = commandCenterData({ priority, cro, experiments, learnings, kpi: latestKpi });

  return (
    <>
      <AppHeader screenId="command-center" />
      <main className="space-y-4 p-4 md:p-6">

        {/* Row 1 */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card
            title="This Week's Money Move"
            subtitle="Priorité unique obligatoire"
            icon={TrendingUp}
            accent="var(--phase-2)"
          >
            <p className="text-sm font-medium text-zinc-200 leading-relaxed">
              {data.moneyMove}
            </p>
          </Card>

          <Card
            title="Biggest Leak"
            subtitle="Fuite #1 à traiter en premier"
            icon={AlertTriangle}
            accent="var(--phase-6)"
          >
            {data.biggestLeak === "Aucune fuite diagnostiquée pour le moment" ? (
              <div className="flex flex-col items-center gap-2 py-3 text-center">
                <CheckCircle2 size={28} className="text-green-500/60" />
                <p className="text-sm text-zinc-500">{data.biggestLeak}</p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-red-300 leading-snug">{data.biggestLeak}</p>
            )}
          </Card>

          <Card
            title="Decision Queue"
            subtitle="Éléments à trancher rapidement"
            icon={ClipboardList}
            accent="var(--phase-3)"
          >
            <ul className="space-y-2 text-sm text-zinc-300">
              {data.decisionQueue.length === 0 ? (
                <li className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-700/60 py-4 text-center text-zinc-500">
                  <ClipboardList size={22} className="text-zinc-700" />
                  <span className="text-xs">Créez un test ou une offre pour alimenter la queue.</span>
                </li>
              ) : (
                data.decisionQueue.map((item) => (
                  <li key={item} className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-1.5">
                    <span className="text-xs">{item}</span>
                    <DecisionBadge decision="TEST" />
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        {/* Row 2 */}
        <div className="grid gap-4 xl:grid-cols-2">
          <Card
            title="Current Test"
            subtitle="Mise à jour avant/après + date de révision"
            icon={FlaskConical}
            accent="var(--phase-5)"
          >
            {!data.currentTest ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <FlaskConical size={26} className="text-zinc-700" />
                <p className="text-sm font-medium text-zinc-100">Aucun test actif</p>
                <p className="text-xs text-zinc-500">Lance un test depuis Experiment Log.</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-zinc-300">
                <p className="font-semibold text-zinc-100">{data.currentTest.name}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-zinc-800/60 p-2">
                    <p className="text-zinc-500 mb-0.5">Avant</p>
                    <p className="text-zinc-200">{data.currentTest.metricsBefore ?? "{}"}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/60 p-2">
                    <p className="text-zinc-500 mb-0.5">Après</p>
                    <p className="text-zinc-200">{data.currentTest.metricsAfter ?? "{}"}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  Révision :{" "}
                  {data.currentTest.reviewDate
                    ? new Date(data.currentTest.reviewDate).toISOString().slice(0, 10)
                    : "n/a"}
                </p>
              </div>
            )}
          </Card>

          <Card
            title="Pattern Alerts"
            subtitle="Signaux de changement à surveiller"
            icon={Zap}
            accent="var(--phase-4)"
          >
            <ul className="space-y-1.5 text-sm text-zinc-300">
              {(cro?.quickWins ? JSON.parse(cro.quickWins) : []).length === 0 ? (
                <li className="flex flex-col items-center gap-2 py-4 text-center">
                  <Activity size={22} className="text-zinc-700" />
                  <span className="text-xs text-zinc-500">Pas d'alertes patterns pour le moment.</span>
                </li>
              ) : (
                (cro?.quickWins ? JSON.parse(cro.quickWins) : []).map((alert: string) => (
                  <li key={alert} className="flex items-start gap-2 rounded-lg bg-zinc-800/60 px-3 py-1.5">
                    <Zap size={11} className="mt-0.5 shrink-0 text-orange-400" />
                    <span className="text-xs">{alert}</span>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        {/* Row 3 */}
        <div className="grid gap-4 xl:grid-cols-2">
          <Card
            title="Recent Learnings"
            subtitle="5 derniers apprentissages rentables"
            icon={BookOpen}
            accent="var(--phase-7)"
          >
            <ul className="space-y-1.5 text-sm text-zinc-300">
              {data.learnings.length === 0 ? (
                <li className="flex flex-col items-center gap-2 py-4 text-center">
                  <BookOpen size={22} className="text-zinc-700" />
                  <span className="text-xs text-zinc-500">
                    Les tests terminés alimenteront automatiquement cette section.
                  </span>
                </li>
              ) : (
                data.learnings.map((learning) => (
                  <li key={learning.id} className="flex items-start gap-2 rounded-lg bg-zinc-800/60 px-3 py-1.5">
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-yellow-500" />
                    <span className="text-xs">{learning.description}</span>
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card
            title="Core KPIs"
            subtitle="Seulement les chiffres utiles à la décision"
            icon={TrendingUp}
            accent="var(--phase-2)"
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Revenue", latestKpi?.revenue ?? "n/a"],
                ["CVR", latestKpi?.conversionRate ?? "n/a"],
                ["AOV", latestKpi?.aov ?? "n/a"],
                ["ATC Rate", latestKpi?.atcRate ?? "n/a"],
                ["Cart Abandon", latestKpi?.cartAbandonRate ?? "n/a"],
                ["Repeat Rate", latestKpi?.repeatRate ?? "n/a"],
                ["LTV", latestKpi?.ltv ?? "n/a"],
              ].map(([key, value]) => (
                <div key={String(key)} className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{key}</p>
                  <p className="mt-1 text-base font-bold text-zinc-100">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </main>
    </>
  );
}
