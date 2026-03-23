import { SCREENS } from "@/config/screens";
import type { ScreenId } from "@/lib/types";

export function AppHeader({ screenId }: { screenId: ScreenId }) {
  const current = SCREENS.find((screen) => screen.id === screenId) ?? SCREENS[0];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/70 px-4 py-4 backdrop-blur md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Decision Command Layer
      </p>
      <h1 className="mt-1 text-xl font-semibold text-zinc-100">{current.label}</h1>
      <p className="mt-1 max-w-3xl text-sm text-zinc-400">{current.description}</p>
    </header>
  );
}
