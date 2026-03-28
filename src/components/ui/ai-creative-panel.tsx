"use client";

import { Loader2, Sparkles, Swords } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { AiCreativeBrief, CreativeOutput } from "@/lib/ai-prompts";

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

// ─── Hook Battle Engine ───────────────────────────────────────────────────────

type FrameworkScore = {
  label: string;
  score: number;
  color: string;
  hits: string[];
};

const FRAMEWORKS = {
  AIDA: {
    label: "AIDA",
    color: "#6366f1",
    signals: {
      Attention: ["vous", "votre", "et si", "enfin", "stop", "alerte", "attention", "secret", "pourquoi", "comment", "jamais", "toujours", "incroyable", "choquant", "urgent", "maintenant", "aujourd"],
      Interest: ["découvrez", "saviez", "savoir", "apprenez", "comprendre", "méthode", "astuce", "solution", "résultat", "prouvé", "études", "experts", "scientifique"],
      Desire: ["imaginez", "rêvez", "transformez", "retrouvez", "liberté", "énergie", "vie", "bonheur", "sans douleur", "enfin", "vraiment", "naturel", "rapide", "facile", "simple"],
      Action: ["commandez", "essayez", "profitez", "obtenez", "cliquez", "achetez", "réservez", "maintenant", "aujourd", "limité", "offre", "gratuit", "garanti", "remboursé"],
    },
  },
  PAS: {
    label: "PAS",
    color: "#f59e0b",
    signals: {
      Problem: ["douleur", "souffrez", "problème", "difficile", "impossible", "encore", "toujours", "jamais", "échoué", "essayé", "frustration", "épuisé", "fatigué", "galère", "peine"],
      Agitate: ["chronique", "chaque jour", "nuit", "semaines", "mois", "années", "empire", "aggrave", "pire", "même", "encore", "toujours pareil", "rien ne marche"],
      Solution: ["solution", "méthode", "enfin", "fonctionne", "marche", "résout", "élimine", "supprime", "guérit", "soulage", "transforme", "change", "découvert", "révolutionnaire"],
    },
  },
  BAB: {
    label: "BAB",
    color: "#22c55e",
    signals: {
      Before: ["avant", "quand", "j'avais", "vous avez", "comme vous", "vous aussi", "souffrez", "luttiez", "galérez", "essayé tout", "plus jamais"],
      After: ["maintenant", "aujourd", "résultats", "transformé", "changé", "libre", "soulagement", "énergie", "dors", "marche", "vit", "profite", "fonctionne"],
      Bridge: ["grâce à", "avec", "depuis", "j'ai découvert", "vous découvrirez", "la méthode", "le programme", "notre solution", "essayez"],
    },
  },
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreFramework(
  hookTokens: string[],
  hookRaw: string,
  fw: (typeof FRAMEWORKS)[keyof typeof FRAMEWORKS],
): { score: number; hits: string[] } {
  const lowerHook = hookRaw.toLowerCase();
  let total = 0;
  let maxTotal = 0;
  const hits: string[] = [];

  for (const [phase, keywords] of Object.entries(fw.signals)) {
    maxTotal += 100;
    let phaseHit = 0;
    for (const kw of keywords) {
      if (lowerHook.includes(kw) || hookTokens.includes(kw.replace(/\s/g, ""))) {
        phaseHit = Math.min(phaseHit + 35, 100);
        if (!hits.includes(phase)) hits.push(phase);
      }
    }
    total += phaseHit;
  }

  return {
    score: maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0,
    hits,
  };
}

function analyzeHook(hook: string): FrameworkScore[] {
  if (!hook.trim()) return Object.values(FRAMEWORKS).map((fw) => ({ label: fw.label, score: 0, color: fw.color, hits: [] }));
  const tokens = tokenize(hook);
  return Object.values(FRAMEWORKS).map((fw) => {
    const { score, hits } = scoreFramework(tokens, hook, fw);
    return { label: fw.label, score, color: fw.color, hits };
  });
}

// ─── Hook Battle component ────────────────────────────────────────────────────

function HookBattle() {
  const [hookA, setHookA] = useState("");
  const [hookB, setHookB] = useState("");
  const [scoresA, setScoresA] = useState<FrameworkScore[]>([]);
  const [scoresB, setScoresB] = useState<FrameworkScore[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setScoresA(analyzeHook(hookA));
      setScoresB(analyzeHook(hookB));
    }, 150);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hookA, hookB]);

  const totalA = scoresA.reduce((s, f) => s + f.score, 0);
  const totalB = scoresB.reduce((s, f) => s + f.score, 0);
  const winner: "A" | "B" | "tie" | null =
    hookA.trim() && hookB.trim()
      ? totalA > totalB + 5
        ? "A"
        : totalB > totalA + 5
          ? "B"
          : "tie"
      : null;

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Swords size={14} className="text-rose-400" />
        <p className="text-xs font-semibold text-zinc-200">Hook Battle</p>
        <span className="ml-auto rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400">
          AIDA · PAS · BAB
        </span>
      </div>
      <p className="mb-3 text-[11px] text-zinc-500">
        Entre 2 hooks en face-à-face — l&apos;outil score chacun contre les 3 grands frameworks copy en temps réel.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            { label: "Hook A", value: hookA, set: setHookA, scores: scoresA, id: "A" as const },
            { label: "Hook B", value: hookB, set: setHookB, scores: scoresB, id: "B" as const },
          ] as const
        ).map(({ label, value, set, scores, id }) => {
          const isWinner = winner === id;
          const isLoser = winner !== null && winner !== "tie" && winner !== id;
          return (
            <div
              key={id}
              className={`rounded-lg border p-3 transition-colors ${
                isWinner
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : isLoser
                    ? "border-zinc-700/40 bg-zinc-900/40 opacity-70"
                    : "border-zinc-700/50 bg-zinc-900/40"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400">{label}</span>
                {isWinner && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    ✓ Gagnant
                  </span>
                )}
                {winner === "tie" && (
                  <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] text-zinc-400">
                    Égalité
                  </span>
                )}
              </div>
              <textarea
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={`Hook ${id}…`}
                rows={2}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20"
              />

              {scores.length > 0 && (
                <div className="mt-3 space-y-2">
                  {scores.map((fw) => (
                    <div key={fw.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold" style={{ color: fw.color }}>
                          {fw.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {fw.hits.map((h) => (
                            <span
                              key={h}
                              className="rounded px-1 py-0.5 text-[9px] font-medium"
                              style={{ background: `${fw.color}18`, color: fw.color }}
                            >
                              {h}
                            </span>
                          ))}
                          <span className="font-mono text-[10px]" style={{ color: fw.color }}>
                            {fw.score}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${fw.score}%`, background: fw.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Creative Brief Card ──────────────────────────────────────────────────────

const FORMAT_COLORS: Record<string, string> = {
  "ugc": "#6366f1",
  "image": "#3b82f6",
  "carousel": "#8b5cf6",
  "vsl": "#ec4899",
  "story": "#f59e0b",
};

function formatColor(format: string): string {
  const key = Object.keys(FORMAT_COLORS).find((k) => format.toLowerCase().includes(k));
  return key ? FORMAT_COLORS[key] : "#6366f1";
}

function CreativeBriefCard({ brief, index }: { brief: AiCreativeBrief; index: number }) {
  const color = formatColor(brief.format);

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border p-4 text-xs"
      style={{ borderColor: `${color}30`, background: `${color}08` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-zinc-100">{brief.name}</p>
          <p className="mt-0.5 text-zinc-400">{brief.angle}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: `${color}20`, color }}
        >
          {brief.format}
        </span>
      </div>

      {/* Hook */}
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Hooks</p>
        <p className="text-zinc-300">
          <span className="text-zinc-500">Visuel · </span>
          {brief.hookVisual}
        </p>
        <p className="text-zinc-300">
          <span className="text-zinc-500">Verbal · </span>
          <em>{brief.hookVerbal}</em>
        </p>
        <p className="text-zinc-400">
          <span className="text-zinc-500">Pattern interrupt · </span>
          {brief.patternInterrupt}
        </p>
      </div>

      {/* Script */}
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Script</p>
        <ol className="space-y-1">
          {brief.script.map((line, i) => (
            <li key={i} className="flex gap-2 text-zinc-300">
              <span className="shrink-0 font-mono text-zinc-600">{i + 1}.</span>
              <span className="italic">{line}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Proof + CTA */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg bg-zinc-800/60 px-2 py-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-600">Preuve</p>
          <p className="mt-0.5 font-medium text-zinc-300">{brief.proofType}</p>
        </div>
        <div className="flex-1 rounded-lg bg-zinc-800/60 px-2 py-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-600">CTA</p>
          <p className="mt-0.5 font-medium text-zinc-300">{brief.cta}</p>
        </div>
      </div>

      {/* KPI / Kill */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg bg-emerald-500/8 px-2 py-1.5 border border-emerald-500/15">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-600">KPI cible</p>
          <p className="mt-0.5 text-emerald-400">{brief.kpiTarget}</p>
        </div>
        <div className="flex-1 rounded-lg bg-red-500/8 px-2 py-1.5 border border-red-500/15">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-red-600">Kill si</p>
          <p className="mt-0.5 text-red-400">{brief.killThreshold}</p>
        </div>
      </div>

      {/* Why */}
      <p className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 px-3 py-2 text-zinc-400 italic">
        {brief.why}
      </p>

      {/* Index badge */}
      <div className="flex justify-end">
        <span className="text-[10px] text-zinc-600">Brief #{index + 1}</span>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
      <Sparkles size={28} className="mb-3 text-zinc-700" />
      <p className="text-sm font-medium text-zinc-500">Aucun brief généré</p>
      <p className="mt-1 text-xs text-zinc-600">
        Sélectionnez un produit et lancez la génération pour obtenir 3 briefs créatifs.
      </p>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function AiCreativePanel({ products }: Props) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreativeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          module: "creative",
          context: { productName, niche, description },
        }),
      });
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const data = (await res.json()) as CreativeOutput;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Product */}
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

          {/* Generate */}
          <div className="flex items-end">
            <button
              onClick={generate}
              disabled={loading || !productName || !niche}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  Générer les briefs
                </>
              )}
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
          <div className="grid gap-4 lg:grid-cols-3">
            {result.briefs.map((brief, i) => (
              <CreativeBriefCard key={i} brief={brief} index={i} />
            ))}
          </div>
          <HookBattle />
        </div>
      )}
    </div>
  );
}
