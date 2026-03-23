"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SCREENS } from "@/config/screens";

const PHASE_COLORS: Record<number, string> = {
  2: "var(--phase-2)",
  3: "var(--phase-3)",
  4: "var(--phase-4)",
  5: "var(--phase-5)",
  6: "var(--phase-6)",
  7: "var(--phase-7)",
};

function getHref(id: string) {
  return id === "command-center" ? "/" : `/${id}`;
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-zinc-800 bg-zinc-950 px-3 py-2 lg:hidden">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SCREENS.map((screen) => {
          const href = getHref(screen.id);
          const active = pathname === href;
          const phaseColor = PHASE_COLORS[screen.phase] ?? "#6366f1";
          return (
            <Link
              key={screen.id}
              href={href}
              className={`nav-item whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-medium transition ${
                active
                  ? "text-indigo-200"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-100"
              }`}
              style={active ? {
                background: "rgba(99,102,241,0.15)",
                boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.35)",
              } : undefined}
            >
              <span
                className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: phaseColor }}
              />
              {screen.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
