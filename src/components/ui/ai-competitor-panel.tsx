"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import type { AiCompetitor, CompetitorOutput } from "@/lib/ai-prompts";

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  products: Array<{ id: string; name: string; niche: string | null }>;
};

// ─── STEAL/ADAPT/AVOID/COUNTER badge styles ────────────────────────────────

const TACTIC_STYLES = {
  steal:   { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", header: "bg-emerald-500/10", label: "STEAL"   },
  adapt:   { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/20",    header: "bg-blue-500/10",    label: "ADAPT"   },
  avoid:   { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/20",     header: "bg-red-500/10",     label: "AVOID"   },
  counter: { bg: "bg-purple-500/15",  text: "text-purple-400",  border: "border-purple-500/20",  header: "bg-purple-500/10",  label: "COUNTER" },
} as const;

type TacticKey = keyof typeof TACTIC_STYLES;

// ─── Tactic badge with list ───────────────────────────────────────────────────

function TacticBlock({ tactic, items }: { tactic: TacticKey; items: string[] }) {
  const s = TACTIC_STYLES[tactic];
  return (
    <div className={`rounded-lg border ${s.border} ${s.bg} p-2.5`}>
      <p className={`mb-1.5 text-[10px] font-black uppercase tracking-wider ${s.text}`}>{s.label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
            <span className={`mt-0.5 shrink-0 font-bold ${s.text}`}>›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Competitor card ──────────────────────────────────────────────────────────

function CompetitorCard({ competitor }: { competitor: AiCompetitor }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 bg-zinc-800/40 px-4 py-3">
        <span className="flex-1 text-sm font-bold text-zinc-100">{competitor.name}</span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          {competitor.priceRange}
        </span>
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
          {competitor.angle}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Forces / Faiblesses */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Forces</p>
            <ul className="space-y-1">
              {competitor.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-300">
                  <span className="mt-0.5 shrink-0 font-bold text-emerald-500">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">Faiblesses</p>
            <ul className="space-y-1">
              {competitor.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-300">
                  <span className="mt-0.5 shrink-0 font-bold text-red-500">✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Guarantee / Urgency / Social proof */}
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Garantie</p>
            <p className="mt-0.5 text-xs text-zinc-300">{competitor.guarantee}</p>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Urgence</p>
            <p className="mt-0.5 text-xs text-zinc-300">{competitor.urgencyTactic}</p>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Preuve sociale</p>
            <p className="mt-0.5 text-xs text-zinc-300">{competitor.socialProof}</p>
          </div>
        </div>

        {/* Tactics grid */}
        <div className="grid gap-2 sm:grid-cols-2">
          <TacticBlock tactic="steal"   items={competitor.steal}   />
          <TacticBlock tactic="adapt"   items={competitor.adapt}   />
          <TacticBlock tactic="avoid"   items={competitor.avoid}   />
          <TacticBlock tactic="counter" items={competitor.counter} />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AiCompetitorPanel({ products }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id ?? "");
  const [niche, setNiche] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CompetitorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProduct) return;

    const productName = selectedProduct.name;
    const resolvedNiche = niche || selectedProduct.niche || "";

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "competitor",
          context: { productName, niche: resolvedNiche, price: price || undefined },
        }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const message =
          data && typeof data === "object" && "error" in data && typeof (data as Record<string, unknown>).error === "string"
            ? (data as Record<string, string>).error
            : `Erreur ${res.status}`;
        setError(message);
        return;
      }

      const data: unknown = await res.json();
      setResult(data as CompetitorOutput);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  const tactics: TacticKey[] = ["steal", "adapt", "avoid", "counter"];

  return (
    <div className="space-y-4">
      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Product select */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Produit
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Niche input */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Niche
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder={selectedProduct?.niche ?? "Ex : douleurs dos, sommeil…"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Price input */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Notre prix cible
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex : €49"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedProductId}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Génération en cours…
            </>
          ) : (
            <>
              <Sparkles size={15} />
              ✨ Analyser les concurrents
            </>
          )}
        </button>
      </form>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !result && !error && (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 px-6 py-10 text-center">
          <p className="text-sm text-zinc-500">
            Sélectionnez un produit et analysez vos concurrents pour voir les résultats ici.
          </p>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-10 text-center">
          <Loader2 size={24} className="mx-auto animate-spin text-indigo-400" />
          <p className="mt-3 text-sm text-zinc-500">Génération en cours…</p>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <div className="space-y-6">
          {/* Section 1 — Competitor cards */}
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Analyse concurrents
            </p>
            {result.competitors.map((competitor, i) => (
              <CompetitorCard key={i} competitor={competitor} />
            ))}
          </div>

          {/* Section 2 — Unique angles */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Angles uniques détectés
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {result.uniqueAngles.map((angle, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"
                >
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-amber-400">
                    Angle {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-zinc-200">{angle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 — STEAL/ADAPT/AVOID/COUNTER matrix */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Matrice stratégique cross-concurrents
            </p>
            <div className="grid gap-3 sm:grid-cols-4">
              {tactics.map((tactic) => {
                const s = TACTIC_STYLES[tactic];
                const items = result.matrix[tactic];
                return (
                  <div key={tactic} className={`rounded-xl border ${s.border} overflow-hidden`}>
                    <div className={`${s.header} px-3 py-2`}>
                      <p className={`text-[10px] font-black uppercase tracking-wider ${s.text}`}>
                        {s.label}
                      </p>
                    </div>
                    <div className="bg-zinc-900/60 p-3">
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                            <span className={`mt-0.5 shrink-0 font-bold ${s.text}`}>›</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
