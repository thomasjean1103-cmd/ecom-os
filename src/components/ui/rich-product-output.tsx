"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Globe,
  Heart,
  Megaphone,
  Search,
  ShieldAlert,
  Star,
  Swords,
  Target,
  TrendingUp,
  Users,
  Video,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

import type { RichProductOutput } from "@/lib/types";

// ─── Verdict banner ──────────────────────────────────────────────────────────

function VerdictBanner({ verdict }: { verdict: RichProductOutput["verdict"] }) {
  const isGo = verdict.decision === "GO";
  const isNo = verdict.decision === "NO_GO";

  const color = isGo
    ? { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", bar: "bg-emerald-500" }
    : isNo
      ? { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", bar: "bg-red-500" }
      : { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", bar: "bg-amber-500" };

  const Icon = isGo ? CheckCircle2 : isNo ? XCircle : AlertTriangle;

  const pct = verdict.score;

  return (
    <div className={`rounded-xl border ${color.border} ${color.bg} p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={28} className={color.text} />
          <div>
            <p className={`text-2xl font-black tracking-tight ${color.text}`}>{verdict.decision}</p>
            <p className="text-xs text-zinc-400">Score global : {verdict.score}/100</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Budget test</p>
          <p className="mt-0.5 text-xs font-semibold text-zinc-200">{verdict.testBudget}</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className={`h-1.5 rounded-full ${color.bar} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Risks */}
      <ul className="mt-3 space-y-1">
        {verdict.risks.map((r) => (
          <li key={r} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
            <AlertTriangle size={10} className="mt-0.5 shrink-0 text-amber-500" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sources pills ────────────────────────────────────────────────────────────

function SourcesPills({ sources }: { sources: RichProductOutput["sources"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((s) => (
        <span
          key={s.platform}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-[11px]"
        >
          <span className="font-semibold text-zinc-200">{s.platform}</span>
          <span className="text-zinc-400">{s.signal}</span>
        </span>
      ))}
    </div>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────

function Section({
  num,
  icon: Icon,
  title,
  accent,
  defaultOpen = false,
  children,
}: {
  num: number;
  icon: React.ElementType;
  title: string;
  accent: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
          style={{ background: `${accent}18`, color: accent }}
        >
          {num}
        </span>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${accent}12`, color: accent }}
        >
          <Icon size={13} />
        </span>
        <span className="flex-1 text-sm font-semibold text-zinc-100">{title}</span>
        {open ? (
          <ChevronDown size={14} className="text-zinc-500" />
        ) : (
          <ChevronRight size={14} className="text-zinc-500" />
        )}
      </button>
      {open && <div className="border-t border-zinc-800 px-4 py-3">{children}</div>}
    </div>
  );
}

// ─── Common sub-components ────────────────────────────────────────────────────

function Chip({ children, color = "#6366f1" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium"
      style={{ background: `${color}18`, color }}
    >
      {children}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RichProductOutputDisplay({ output }: { output: RichProductOutput }) {
  return (
    <div className="space-y-3">
      {/* Verdict */}
      <VerdictBanner verdict={output.verdict} />

      {/* Sources */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Sources de validation
        </p>
        <SourcesPills sources={output.sources} />
      </div>

      {/* Section 1 — Problème résolu */}
      <Section num={1} icon={Target} title="Problème résolu" accent="#ef4444" defaultOpen>
        <div className="space-y-3 text-xs">
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Douleurs principales</p>
            <BulletList items={output.problemSolved.pains} />
          </div>
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Frustrations</p>
            <BulletList items={output.problemSolved.frustrations} />
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Promesse</p>
            <p className="mt-0.5 text-zinc-200">{output.problemSolved.promise}</p>
          </div>
        </div>
      </Section>

      {/* Section 2 — Mécanisme */}
      <Section num={2} icon={Zap} title="Mécanisme différenciant" accent="#f97316">
        <div className="space-y-3 text-xs">
          <Chip color="#f97316">{output.mechanism.technology}</Chip>
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Fonctionnalités</p>
            <BulletList items={output.mechanism.features} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {output.mechanism.specs.map((s) => (
              <span key={s} className="rounded border border-zinc-700 bg-zinc-800/50 px-2 py-0.5 text-[11px] text-zinc-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 3 — Promesse */}
      <Section num={3} icon={TrendingUp} title="Promesse claire — 3 formulations" accent="#6366f1">
        <div className="space-y-2">
          {output.promise.map((p, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-200">
              <span className="mt-0.5 shrink-0 font-black text-indigo-500">{i + 1}.</span>
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* Section 4 — Désir de masse */}
      <Section num={4} icon={Globe} title="Désir de masse" accent="#3b82f6">
        <div className="space-y-3 text-xs">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-400">TAM</p>
            <p className="mt-0.5 font-semibold text-zinc-100">{output.massDesire.tam}</p>
          </div>
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Cibles</p>
            <BulletList items={output.massDesire.targets} />
          </div>
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Stats épidémie</p>
            <BulletList items={output.massDesire.stats} />
          </div>
        </div>
      </Section>

      {/* Section 5 — Transformation */}
      <Section num={5} icon={ArrowRight} title="Transformation AVANT → APRÈS" accent="#22c55e">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Dimension</th>
                <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wide text-red-400">Avant</th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Après</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {output.transformation.map((row) => (
                <tr key={row.dimension}>
                  <td className="py-2 pr-3 font-semibold text-zinc-300">{row.dimension}</td>
                  <td className="py-2 pr-3 text-red-300">{row.before}</td>
                  <td className="py-2 text-emerald-300">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 6 — Émotions */}
      <Section num={6} icon={Heart} title="Triggers émotionnels" accent="#ec4899">
        <div className="grid gap-2 sm:grid-cols-2">
          {output.emotions.map((e) => (
            <div key={e.trigger} className="rounded-lg border border-pink-500/15 bg-pink-500/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-pink-400">{e.trigger}</p>
              <p className="mt-1 text-xs italic text-zinc-300">{e.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7 — Déclencheurs psych */}
      <Section num={7} icon={Brain} title="Déclencheurs psychologiques" accent="#8b5cf6">
        <div className="space-y-2">
          {output.psychTriggers.map((t) => (
            <div key={t.type} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2 text-xs">
              <Chip color="#8b5cf6">{t.type}</Chip>
              <span className="text-zinc-300">{t.copy}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 8 — Objections */}
      <Section num={8} icon={ShieldAlert} title="Objections + réponses" accent="#eab308">
        <div className="space-y-3">
          {output.objections.map((o) => (
            <div key={o.objection} className="rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 text-xs">
              <p className="font-semibold text-amber-300">{o.objection}</p>
              <p className="mt-1 text-zinc-300">{o.response}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 9 — USP */}
      <Section num={9} icon={Star} title="USP — 5 points différenciants" accent="#f59e0b">
        <div className="space-y-2">
          {output.usp.map((u) => (
            <div key={u.point} className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 text-xs">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-400">Notre avantage</p>
                <p className="mt-0.5 font-semibold text-zinc-100">{u.point}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">vs Concurrents</p>
                <p className="mt-0.5 text-zinc-400">{u.vsCompetitors}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 10 — Angles pub */}
      <Section num={10} icon={Megaphone} title="Angles publicitaires + hooks" accent="#06b6d4">
        <div className="space-y-2">
          {output.adAngles.map((a) => (
            <div key={a.angle} className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3 text-xs">
              <p className="font-bold text-cyan-300">{a.angle}</p>
              <p className="mt-1 italic text-zinc-300">{a.hook}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 11 — Créatifs */}
      <Section num={11} icon={Video} title="Idées créatifs" accent="#10b981">
        <div className="space-y-3 text-xs">
          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold text-zinc-400">
              <Video size={11} className="text-emerald-400" /> Vidéo
            </p>
            <div className="space-y-1.5">
              {output.creativeIdeas.video.map((v) => (
                <div key={v.concept} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2">
                  <span className="text-zinc-200">{v.concept}</span>
                  <div className="flex shrink-0 gap-1.5">
                    <Chip color="#10b981">{v.format}</Chip>
                    <Chip color="#6b7280">{v.duration}</Chip>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-zinc-400">Static</p>
            <div className="space-y-1.5">
              {output.creativeIdeas.static.map((s) => (
                <div key={s.concept} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2">
                  <span className="text-zinc-200">{s.concept}</span>
                  <Chip color="#10b981">{s.format}</Chip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 12 — Personas */}
      <Section num={12} icon={Users} title="Buyer Personas" accent="#a855f7">
        <div className="grid gap-3 sm:grid-cols-2">
          {output.buyerPersonas.map((persona) => (
            <div key={persona.name} className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-sm font-black text-purple-300">
                  {persona.name[0]}
                </span>
                <div>
                  <p className="font-bold text-zinc-100">{persona.name}</p>
                  <p className="text-zinc-400">{persona.age} · {persona.job}</p>
                </div>
              </div>
              <p className="mb-1.5 text-zinc-300">{persona.problem}</p>
              <div className="flex flex-wrap gap-1">
                {persona.channel.split(" · ").map((c) => (
                  <Chip key={c} color="#a855f7">{c}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 13 — Stratégie d'offre */}
      <Section num={13} icon={DollarSign} title="Stratégie d'offre" accent="#22c55e">
        <div className="space-y-3 text-xs">
          {/* Economics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "COGS", value: output.offerStrategy.cogs },
              { label: "Prix de vente", value: output.offerStrategy.basePrice },
              { label: "Multiplicateur", value: output.offerStrategy.multiplier },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-2.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
                <p className="mt-0.5 text-sm font-bold text-emerald-400">{value}</p>
              </div>
            ))}
          </div>

          {/* Offers */}
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Offres</p>
            <div className="space-y-1.5">
              {output.offerStrategy.offers.map((o) => (
                <div key={o.name} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2">
                  <div>
                    <span className="font-semibold text-zinc-100">{o.name}</span>
                    <span className="ml-2 text-zinc-400">{o.description}</span>
                  </div>
                  <span className="shrink-0 font-bold text-emerald-400">{o.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upsells */}
          <div>
            <p className="mb-1.5 font-semibold text-zinc-400">Upsells</p>
            <div className="flex flex-wrap gap-2">
              {output.offerStrategy.upsells.map((u) => (
                <span key={u.name} className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
                  <span className="text-zinc-200">{u.name}</span>
                  <span className="font-bold text-emerald-400">{u.price}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 14 — Concurrence */}
      <Section num={14} icon={Swords} title="Concurrence active" accent="#ef4444">
        <div className="space-y-2">
          {output.competition.map((c) => (
            <div key={c.name} className="grid grid-cols-3 gap-2 rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 text-xs">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Concurrent</p>
                <p className="mt-0.5 font-semibold text-zinc-100">{c.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Prix actif</p>
                <p className="mt-0.5 text-zinc-300">{c.activePrice}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Fenêtre</p>
                <p className="mt-0.5 text-zinc-300">{c.window}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 15 — SEO */}
      <Section num={15} icon={Search} title="SEO — mots-clés + volumes" accent="#06b6d4">
        <div className="flex flex-wrap gap-2">
          {output.seo.map((k) => (
            <div key={k.keyword} className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs">
              <span className="text-zinc-200">{k.keyword}</span>
              <span className="font-bold text-cyan-400">{k.volume}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 16 — Storytelling */}
      <Section num={16} icon={BookOpen} title="Storytelling émotionnel" accent="#f59e0b">
        <p className="text-sm leading-relaxed text-zinc-300 italic">
          &ldquo;{output.storytelling}&rdquo;
        </p>
      </Section>
    </div>
  );
}
