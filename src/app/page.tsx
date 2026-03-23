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
  const data = commandCenterData({
    priority,
    cro,
    experiments,
    learnings,
    kpi: latestKpi,
  });
  return (
    <>
      <AppHeader screenId="command-center" />
      <main className="space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="This Week's Money Move" subtitle="Priorite unique obligatoire">
            <p className="text-sm text-zinc-200">{data.moneyMove}</p>
          </Card>

          <Card title="Biggest Leak" subtitle="Fuite #1 a traiter en premier">
            <p className="text-lg font-semibold text-red-300">{data.biggestLeak}</p>
          </Card>

          <Card title="Decision Queue" subtitle="Elements a trancher rapidement">
            <ul className="space-y-2 text-sm text-zinc-300">
              {data.decisionQueue.length === 0 ? (
                <li className="rounded border border-dashed border-zinc-700 px-2 py-2 text-zinc-400">
                  Aucune decision en attente. Cree un test ou une offre pour alimenter la queue.
                </li>
              ) : (
                data.decisionQueue.map((item) => (
                  <li key={item} className="flex items-center justify-between rounded bg-zinc-800/70 px-2 py-1">
                    <span>{item}</span>
                    <DecisionBadge decision="TEST" />
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Current Test" subtitle="Mise a jour avant/apres + review date">
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-medium text-zinc-100">{data.currentTest?.name ?? "Aucun test actif"}</p>
              <p>Avant: {data.currentTest?.metricsBefore ?? "{}"}</p>
              <p>Apres: {data.currentTest?.metricsAfter ?? "{}"}</p>
              <p>
                Date revue:{" "}
                {data.currentTest?.reviewDate
                  ? new Date(data.currentTest.reviewDate).toISOString().slice(0, 10)
                  : "n/a"}
              </p>
            </div>
          </Card>

          <Card title="Pattern Alerts" subtitle="Signaux de changement a surveiller">
            <ul className="space-y-2 text-sm text-zinc-300">
              {(cro?.quickWins ? JSON.parse(cro.quickWins) : ["Pas d'alertes patterns pour le moment"]).map((alert: string) => (
                <li key={alert} className="rounded bg-zinc-800/70 px-2 py-1">
                  {alert}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Recent Learnings" subtitle="5 derniers apprentissages rentables">
            <ul className="space-y-2 text-sm text-zinc-300">
              {data.learnings.length === 0 ? (
                <li className="rounded border border-dashed border-zinc-700 px-2 py-2 text-zinc-400">
                  Aucun learning. Les tests termines alimenteront automatiquement cette section.
                </li>
              ) : (
                data.learnings.map((learning) => (
                  <li key={learning.id} className="rounded bg-zinc-800/70 px-2 py-1">
                    {learning.description}
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card title="Core KPIs" subtitle="Seulement les chiffres utiles a la decision">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["revenue", latestKpi?.revenue ?? "n/a"],
                ["cvr", latestKpi?.conversionRate ?? "n/a"],
                ["aov", latestKpi?.aov ?? "n/a"],
                ["atcRate", latestKpi?.atcRate ?? "n/a"],
                ["cartAbandonment", latestKpi?.cartAbandonRate ?? "n/a"],
                ["repeatRate", latestKpi?.repeatRate ?? "n/a"],
                ["ltv", latestKpi?.ltv ?? "n/a"],
              ].map(([key, value]) => (
                <div key={String(key)} className="rounded border border-zinc-800 bg-zinc-900 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">{key}</p>
                  <p className="mt-1 font-semibold text-zinc-100">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
