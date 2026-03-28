"use client";

import { Loader2, RefreshCw, Sparkles, User, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { AiPersona, AvatarOutput } from "@/lib/ai-prompts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  niche: string | null;
  description: string | null;
};

type Props = {
  products: Product[];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chip({
  children,
  color = "#6366f1",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium"
      style={{ background: `${color}18`, color }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div className="my-3 h-px bg-zinc-800" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
      {children}
    </p>
  );
}

function BulletList({ items, color = "#ef4444" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
          <span
            className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
            style={{ background: color }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Message Resonance Engine ─────────────────────────────────────────────────

type HitMap = { trigger: string; weight: number };

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function overlaps(msgTokens: string[], phrase: string): number {
  const phraseTokens = tokenize(phrase);
  if (!phraseTokens.length) return 0;
  const hits = phraseTokens.filter((t) => msgTokens.includes(t)).length;
  // Partial match: ≥50% of phrase words found
  return hits / phraseTokens.length >= 0.5 ? hits / phraseTokens.length : 0;
}

function scorePersona(
  message: string,
  persona: AiPersona,
): { score: number; hits: HitMap[] } {
  if (!message.trim()) return { score: 0, hits: [] };
  const tokens = tokenize(message);
  const hits: HitMap[] = [];

  const checks: Array<{ text: string; weight: number }> = [
    ...persona.copyTriggers.map((t) => ({ text: t, weight: 3 })),
    { text: persona.mainPain, weight: 2.5 },
    { text: persona.hiddenDesire, weight: 2.5 },
    ...persona.fears.map((t) => ({ text: t, weight: 1.5 })),
    ...persona.verbatims.map((t) => ({ text: t, weight: 1 })),
    { text: persona.buyingMoment, weight: 1.5 },
  ];

  let earned = 0;
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);

  for (const { text, weight } of checks) {
    const ratio = overlaps(tokens, text);
    if (ratio > 0) {
      const contribution = ratio * weight;
      earned += contribution;
      hits.push({ trigger: text, weight: contribution });
    }
  }

  const raw = maxPossible > 0 ? earned / maxPossible : 0;
  // Sigmoid-like stretch so partial matches feel meaningful
  const score = Math.round(Math.min(100, raw * 220));
  hits.sort((a, b) => b.weight - a.weight);
  return { score, hits: hits.slice(0, 5) };
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Fort";
  if (score >= 40) return "Moyen";
  if (score > 0) return "Faible";
  return "—";
}

function MessageResonanceMeter({ personas }: { personas: [AiPersona, AiPersona] }) {
  const [message, setMessage] = useState("");
  const [scores, setScores] = useState<Array<{ score: number; hits: HitMap[] }>>([
    { score: 0, hits: [] },
    { score: 0, hits: [] },
  ]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setScores(personas.map((p) => scorePersona(message, p)));
    }, 180);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, personas]);

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Zap size={14} className="text-amber-400" />
        <p className="text-xs font-semibold text-zinc-200">Message Resonance Meter</p>
        <span className="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
          BÊTA · temps réel
        </span>
      </div>
      <p className="mb-3 text-[11px] text-zinc-500">
        Colle ton headline ou hook ici — vois instantanément à quel point il résonne avec chaque persona.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="ex : « Enfin un sommeil profond sans médicaments — en 7 nuits »"
        rows={2}
        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
      />

      {/* Scores */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {personas.map((persona, i) => {
          const { score, hits } = scores[i];
          const color = scoreColor(score);
          const barWidth = `${score}%`;
          return (
            <div key={i} className="space-y-2">
              {/* Persona name + badge */}
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-zinc-300">{persona.name}</p>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: `${color}18`, color }}
                >
                  {scoreLabel(score)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: barWidth, background: color }}
                />
              </div>
              <p className="text-right text-[10px] font-mono" style={{ color }}>
                {score} / 100
              </p>

              {/* Hit chips */}
              {hits.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {hits.map((h, j) => (
                    <span
                      key={j}
                      className="max-w-[180px] truncate rounded-md px-1.5 py-0.5 text-[10px]"
                      style={{ background: `${color}15`, color }}
                      title={h.trigger}
                    >
                      ✓ {h.trigger}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-600 italic">
                  {message.trim() ? "Aucun trigger détecté" : "En attente de message…"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Persona card ─────────────────────────────────────────────────────────────

const PERSONA_COLORS = [
  { accent: "#6366f1", bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", circle: "bg-indigo-500/20 text-indigo-300" },
  { accent: "#a855f7", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", circle: "bg-purple-500/20 text-purple-300" },
] as const;

const TOF_COLOR = "#6366f1";
const MOF_COLOR = "#3b82f6";
const BOF_COLOR = "#22c55e";

function PersonaCard({
  persona,
  index,
  isRegenerating,
  onRegenerate,
}: {
  persona: AiPersona;
  index: 0 | 1;
  isRegenerating: boolean;
  onRegenerate: () => void;
}) {
  const colors = PERSONA_COLORS[index];

  return (
    <div
      className={`flex flex-col rounded-xl border ${colors.border} ${colors.bg} p-4 text-xs`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-black ${colors.circle}`}
        >
          {persona.name[0]}
        </span>
        <div>
          <p className="text-sm font-bold text-zinc-100">{persona.name}</p>
          <p className="text-zinc-400">
            {persona.age} · {persona.job}
          </p>
          <p className="text-zinc-500">
            {persona.location} · {persona.income}
          </p>
        </div>
      </div>

      <Divider />

      {/* Situation */}
      <div>
        <SectionLabel>Situation</SectionLabel>
        <p className="leading-relaxed text-zinc-300">{persona.situation}</p>
      </div>

      <Divider />

      {/* Psychologie */}
      <div className="space-y-2">
        <SectionLabel>Psychologie</SectionLabel>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
          <p className="text-[10px] font-semibold text-red-400">Douleur principale</p>
          <p className="mt-0.5 text-zinc-200">{persona.mainPain}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <p className="text-[10px] font-semibold text-emerald-400">Désir caché</p>
          <p className="mt-0.5 text-zinc-200">{persona.hiddenDesire}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold text-zinc-500">Peurs</p>
          <BulletList items={persona.fears} color="#ef4444" />
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold text-zinc-500">Copy triggers</p>
          <div className="flex flex-wrap gap-1">
            {persona.copyTriggers.map((trigger) => (
              <Chip key={trigger} color={colors.accent}>
                {trigger}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* Parcours d'achat */}
      <div className="space-y-2">
        <SectionLabel>Parcours d&apos;achat</SectionLabel>
        <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
          <p className="text-[10px] font-semibold text-zinc-500">Moment déclencheur</p>
          <p className="mt-0.5 text-zinc-200">{persona.buyingMoment}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold text-zinc-500">Solutions ratées</p>
          <BulletList items={persona.failedSolutions} color="#f97316" />
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold text-zinc-500">Objections</p>
          <BulletList items={persona.objections} color="#eab308" />
        </div>
      </div>

      <Divider />

      {/* Verbatims */}
      <div>
        <SectionLabel>Verbatims</SectionLabel>
        <div className="space-y-2">
          {persona.verbatims.map((quote, i) => (
            <p key={i} className="italic text-zinc-400">
              &laquo;&nbsp;{quote.replace(/^["«\u00ab]|["»\u00bb]$/g, "").trim()}&nbsp;&raquo;
            </p>
          ))}
        </div>
      </div>

      <Divider />

      {/* Canaux */}
      <div>
        <SectionLabel>Canaux</SectionLabel>
        <div className="flex flex-wrap gap-1">
          {persona.channels.map((channel) => (
            <Chip key={channel} color="#64748b">
              {channel}
            </Chip>
          ))}
        </div>
      </div>

      <Divider />

      {/* Messaging Map */}
      <div>
        <SectionLabel>Messaging Map</SectionLabel>
        <div className="space-y-1.5">
          {[
            { label: "TOF", message: persona.tofMessage, color: TOF_COLOR },
            { label: "MOF", message: persona.mofMessage, color: MOF_COLOR },
            { label: "BOF", message: persona.bofMessage, color: BOF_COLOR },
          ].map(({ label, message, color }) => (
            <div
              key={label}
              className="flex items-start gap-2 rounded-lg px-3 py-2"
              style={{ background: `${color}10`, border: `1px solid ${color}25` }}
            >
              <span
                className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-black"
                style={{ background: `${color}25`, color }}
              >
                {label}
              </span>
              <span className="text-zinc-300">{message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regenerate button */}
      <div className="mt-4">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RefreshCw size={12} />
          )}
          {isRegenerating ? "Régénération…" : "↺ Régénérer"}
        </button>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
      <User size={36} className="mb-3 text-zinc-700" />
      <p className="text-sm font-semibold text-zinc-400">Aucun persona généré</p>
      <p className="mt-1 text-xs text-zinc-600">
        Sélectionnez un produit et cliquez sur &ldquo;Générer les personas&rdquo;
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AiAvatarPanel({ products }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AvatarOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regenIndex, setRegenIndex] = useState<0 | 1 | null>(null);

  function handleProductSelect(id: string) {
    setSelectedProductId(id);
    if (!id) return;
    const product = products.find((p) => p.id === id);
    if (product) {
      setProductName(product.name);
      setNiche(product.niche ?? "");
      setDescription(product.description ?? "");
    }
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "avatar",
          context: { productName, niche, description },
        }),
      });
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const data = (await res.json()) as AvatarOutput;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function regeneratePersona(index: 0 | 1) {
    if (!result) return;
    setRegenIndex(index);
    setError(null);
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "avatar",
          context: { productName, niche, description },
        }),
      });
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const data = (await res.json()) as AvatarOutput;
      const updatedPersonas: [AiPersona, AiPersona] = [
        index === 0 ? data.personas[0] : result.personas[0],
        index === 1 ? data.personas[1] : result.personas[1],
      ];
      setResult({ personas: updatedPersonas });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setRegenIndex(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Product select */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Produit
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            >
              <option value="">— Sélectionner —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Niche */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Niche
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="ex : santé, bien-être…"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description courte du produit"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>

          {/* Generate button */}
          <div className="flex items-end">
            <button
              onClick={generate}
              disabled={loading || !productName || !niche}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Génération en cours…
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  ✨ Générer les personas
                </>
              )}
              {/* Shimmer */}
              {!loading && (
                <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {result === null ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {result.personas.map((persona, i) => (
              <PersonaCard
                key={i}
                persona={persona}
                index={i as 0 | 1}
                isRegenerating={regenIndex === i}
                onRegenerate={() => regeneratePersona(i as 0 | 1)}
              />
            ))}
          </div>
          <MessageResonanceMeter personas={result.personas} />
        </div>
      )}
    </div>
  );
}
