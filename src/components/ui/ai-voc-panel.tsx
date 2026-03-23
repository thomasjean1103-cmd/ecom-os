"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import type { AiVerbatim, VocOutput } from "@/lib/ai-prompts";

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  products: Array<{ id: string; name: string; niche: string | null }>;
};

// ─── Verbatim type badge ──────────────────────────────────────────────────────

const TYPE_STYLES: Record<AiVerbatim["type"], { bg: string; text: string; label: string }> = {
  pain:        { bg: "bg-red-500/15",    text: "text-red-400",    label: "Douleur"     },
  desire:      { bg: "bg-emerald-500/15",text: "text-emerald-400",label: "Désir"       },
  fear:        { bg: "bg-amber-500/15",  text: "text-amber-400",  label: "Peur"        },
  objection:   { bg: "bg-blue-500/15",   text: "text-blue-400",   label: "Objection"   },
  frustration: { bg: "bg-orange-500/15", text: "text-orange-400", label: "Frustration" },
};

// ─── Score bars ───────────────────────────────────────────────────────────────

function ScoreBars({ emotionalIntensity, purchaseProximity }: { emotionalIntensity: number; purchaseProximity: number }) {
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0 text-[10px] text-zinc-500">Intensité émot.</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 rounded-sm ${i < emotionalIntensity ? "bg-orange-500" : "bg-zinc-700"}`}
            />
          ))}
        </div>
        <span className="text-[10px] text-zinc-500">{emotionalIntensity}/5</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0 text-[10px] text-zinc-500">Proximité achat</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 rounded-sm ${i < purchaseProximity ? "bg-emerald-500" : "bg-zinc-700"}`}
            />
          ))}
        </div>
        <span className="text-[10px] text-zinc-500">{purchaseProximity}/5</span>
      </div>
    </div>
  );
}

// ─── Verbatim card ────────────────────────────────────────────────────────────

function VerbatimCard({ v }: { v: AiVerbatim }) {
  const style = TYPE_STYLES[v.type];
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <p className="text-xs italic leading-relaxed text-zinc-200">&ldquo;{v.quote}&rdquo;</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}>
          {style.label}
        </span>
      </div>
      <ScoreBars emotionalIntensity={v.emotionalIntensity} purchaseProximity={v.purchaseProximity} />
    </div>
  );
}

// ─── Emotional words ──────────────────────────────────────────────────────────

const WORD_COLORS = [
  "#6366f1","#7c3aed","#9333ea","#a855f7","#c026d3",
  "#db2777","#e11d48","#7c3aed","#6366f1","#8b5cf6",
];

function EmotionalWords({ words }: { words: string[] }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        Mots à fort impact
      </p>
      <div className="flex flex-wrap gap-2">
        {words.map((word, i) => {
          const color = WORD_COLORS[i % WORD_COLORS.length];
          return (
            <span
              key={word}
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: `${color}18`, color }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Copy formula card ────────────────────────────────────────────────────────

const USAGE_STYLES: Record<string, { bg: string; text: string }> = {
  hook:      { bg: "bg-indigo-500/15", text: "text-indigo-400" },
  pdp:       { bg: "bg-cyan-500/15",   text: "text-cyan-400"   },
  email:     { bg: "bg-emerald-500/15",text: "text-emerald-400"},
  ad:        { bg: "bg-pink-500/15",   text: "text-pink-400"   },
  objection: { bg: "bg-amber-500/15",  text: "text-amber-400"  },
};

function CopyFormulaCard({ formula, usage }: { formula: string; usage: string }) {
  const style = USAGE_STYLES[usage] ?? { bg: "bg-zinc-700/40", text: "text-zinc-300" };
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <p className="text-sm font-semibold leading-snug text-zinc-100">{formula}</p>
      <div className="mt-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}>
          {usage}
        </span>
      </div>
    </div>
  );
}

// ─── Objection accordion item ─────────────────────────────────────────────────

function ObjectionItem({ objection, response }: { objection: string; response: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <span className="text-sm font-semibold text-amber-300">{objection}</span>
        <span className="shrink-0 text-zinc-500">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-zinc-800 px-4 py-3">
          <p className="text-xs leading-relaxed text-zinc-300">{response}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AiVocPanel({ products }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id ?? "");
  const [niche, setNiche] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VocOutput | null>(null);
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
        body: JSON.stringify({ module: "voc", context: { productName, niche: resolvedNiche } }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const message = (data && typeof data === "object" && "error" in data && typeof (data as Record<string, unknown>).error === "string")
          ? (data as Record<string, string>).error
          : `Erreur ${res.status}`;
        setError(message);
        return;
      }

      const data: unknown = await res.json();
      setResult(data as VocOutput);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
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
              ✨ Générer la voix du client
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
            Sélectionnez un produit et générez la voix du client pour voir les résultats ici.
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
          {/* Section 1 — Verbatims */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              10 Verbatims clients
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.verbatims.map((v, i) => (
                <VerbatimCard key={i} v={v} />
              ))}
            </div>
          </div>

          {/* Section 2 — Emotional words */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <EmotionalWords words={result.emotionalWords} />
          </div>

          {/* Section 3 — Copy formulas */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Formules copy
            </p>
            <div className="space-y-2">
              {result.copyFormulas.map((cf, i) => (
                <CopyFormulaCard key={i} formula={cf.formula} usage={cf.usage} />
              ))}
            </div>
          </div>

          {/* Section 4 — Objections */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Objections + réponses
            </p>
            <div className="space-y-2">
              {result.objections.map((o, i) => (
                <ObjectionItem key={i} objection={o.objection} response={o.response} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
