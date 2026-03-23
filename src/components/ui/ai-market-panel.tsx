"use client";

import { AlertTriangle, CheckCircle2, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

import type { AiGeo, MarketOutput } from "@/lib/ai-prompts";

type Product = { id: string; name: string; niche: string | null; description: string | null };
type Props = { products: Product[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
      {children}
    </p>
  );
}

function potentialColor(p: AiGeo["potential"]) {
  return p === "FORT"
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    : p === "MOYEN"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-zinc-400 bg-zinc-700/30 border-zinc-700";
}

// ─── Seasonality bar chart ────────────────────────────────────────────────────

function SeasonalityChart({ data }: { data: MarketOutput["seasonality"] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = 10;

  return (
    <div className="relative">
      <div className="flex items-end gap-1">
        {data.map((item, i) => {
          const pct = Math.round((item.index / max) * 100);
          const color =
            item.index >= 9
              ? "#10b981"
              : item.index >= 7
                ? "#6366f1"
                : item.index >= 5
                  ? "#6b7280"
                  : "#374151";

          return (
            <div
              key={item.month}
              className="relative flex flex-1 flex-col items-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {hovered === i && (
                <div className="absolute bottom-full mb-2 z-10 w-max max-w-32 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center shadow-lg">
                  <p className="text-[10px] font-bold text-zinc-100">{item.month}</p>
                  <p className="text-[10px] text-zinc-400">{item.note}</p>
                </div>
              )}
              {/* Index label */}
              <span className="mb-0.5 text-[9px] font-bold" style={{ color }}>
                {item.index}
              </span>
              {/* Bar */}
              <div
                className="w-full rounded-t-sm transition-all"
                style={{ height: `${pct * 0.6 + 8}px`, background: color }}
              />
              {/* Month label */}
              <span className="mt-1 text-[9px] text-zinc-500">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
      <TrendingUp size={36} className="mb-3 text-zinc-700" />
      <p className="text-sm font-semibold text-zinc-400">Aucune analyse générée</p>
      <p className="mt-1 text-xs text-zinc-600">
        Sélectionnez un produit et cliquez sur &ldquo;Analyser le marché&rdquo;
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AiMarketPanel({ products }: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [productName, setProductName] = useState("");
  const [niche, setNiche] = useState("");
  const [testBudget, setTestBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelectedId(id);
    if (!id) return;
    const p = products.find((p) => p.id === id);
    if (p) { setProductName(p.name); setNiche(p.niche ?? ""); }
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "market", context: { productName, niche, testBudget } }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setResult((await res.json()) as MarketOutput);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Produit</label>
            <select
              value={selectedId}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            >
              <option value="">— Sélectionner —</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Niche</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="ex : wellness, fitness…"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Budget test</label>
            <input
              value={testBudget}
              onChange={(e) => setTestBudget(e.target.value)}
              placeholder="ex : €300-500"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generate}
              disabled={loading || !productName || !niche}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <><Loader2 size={13} className="animate-spin" />Génération en cours…</> : <><Sparkles size={13} />✨ Analyser le marché</>}
            </button>
          </div>
        </div>
        {error && <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
      </div>

      {result === null ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {/* TAM / SAM / SOM */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "TAM", value: result.tam, color: "#3b82f6", desc: "Marché mondial" },
              { label: "SAM", value: result.sam, color: "#6366f1", desc: "Marché adressable" },
              { label: "SOM", value: result.som, color: "#22c55e", desc: "Part réaliste an 1" },
            ].map(({ label, value, color, desc }) => (
              <div key={label} className="rounded-xl border p-4 text-center" style={{ borderColor: `${color}30`, background: `${color}08` }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{label}</p>
                <p className="mt-1 text-lg font-black text-zinc-100">{value}</p>
                <p className="text-[10px] text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Tendances */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <SectionLabel>Tendances clés</SectionLabel>
            <ul className="space-y-2">
              {result.trends.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                  <TrendingUp size={12} className="mt-0.5 shrink-0 text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Saisonnalité */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <SectionLabel>Saisonnalité (index 1–10)</SectionLabel>
            <SeasonalityChart data={result.seasonality} />
          </div>

          {/* Géos */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <SectionLabel>Géographies prioritaires</SectionLabel>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="pb-2 text-left text-zinc-500">Pays</th>
                  <th className="pb-2 text-left text-zinc-500">Potentiel</th>
                  <th className="pb-2 text-left text-zinc-500">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {result.geos.map((g) => (
                  <tr key={g.country}>
                    <td className="py-2 font-semibold text-zinc-200">{g.country}</td>
                    <td className="py-2">
                      <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${potentialColor(g.potential)}`}>{g.potential}</span>
                    </td>
                    <td className="py-2 text-zinc-400">{g.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Démographie */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <SectionLabel>Démographie cible</SectionLabel>
            <div className="grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <p className="mb-1 font-semibold text-zinc-400">Tranches d&apos;âge</p>
                <ul className="space-y-1">
                  {result.demographics.ageRanges.map((a) => <li key={a} className="text-zinc-300">{a}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-semibold text-zinc-400">Genre</p>
                <p className="text-zinc-300">{result.demographics.gender}</p>
                <p className="mt-2 mb-1 font-semibold text-zinc-400">Revenu</p>
                <p className="text-zinc-300">{result.demographics.income}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="mb-1.5 font-semibold text-zinc-400">Psychographiques</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.demographics.psychographics.map((ps) => (
                    <span key={ps} className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 text-[11px] text-indigo-300">{ps}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fenêtre */}
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-500/5 p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-amber-400">Fenêtre d&apos;opportunité</p>
            <p className="text-xs text-zinc-300">{result.window}</p>
          </div>

          {/* Opportunités + Risques */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <SectionLabel>Opportunités</SectionLabel>
              <ul className="space-y-2">
                {result.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-400" />{o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <SectionLabel>Risques</SectionLabel>
              <ul className="space-y-2">
                {result.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0 text-red-400" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
