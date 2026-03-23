import { SCREENS } from "@/config/screens";
import type { ScreenId } from "@/lib/types";

const PHASE_COLORS: Record<number, string> = {
  2: "var(--phase-2)",
  3: "var(--phase-3)",
  4: "var(--phase-4)",
  5: "var(--phase-5)",
  6: "var(--phase-6)",
  7: "var(--phase-7)",
};

export function AppHeader({ screenId }: { screenId: ScreenId }) {
  const current = SCREENS.find((screen) => screen.id === screenId) ?? SCREENS[0];
  const accentColor = PHASE_COLORS[current.phase] ?? "#6366f1";

  return (
    <header className="relative border-b border-zinc-800 bg-zinc-950/80 px-6 py-5 backdrop-blur">
      {/* Top accent line */}
      <span
        className="absolute inset-x-0 top-0 h-[2px] rounded-t"
        style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
      />

      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Decision Command Layer
      </p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-50">
        {current.label}
      </h1>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400">
        {current.description}
      </p>

      {/* Phase badge */}
      <span
        className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{
          background: `${accentColor}18`,
          color: accentColor,
          border: `1px solid ${accentColor}40`,
        }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: accentColor }}
        />
        Phase {current.phase}
      </span>
    </header>
  );
}
