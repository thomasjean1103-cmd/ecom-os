"use client";

import {
  Activity,
  BarChart2,
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  Package,
  Palette,
  PenTool,
  ShoppingBag,
  Swords,
  Tag,
  Target,
  UserCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SCREENS } from "@/config/screens";
import type { ScreenId } from "@/lib/types";

const SCREEN_ICONS: Record<ScreenId, React.ElementType> = {
  "command-center": LayoutDashboard,
  "product-scout": Package,
  "market-intel": BarChart2,
  "competitor-board": Swords,
  "voc-vault": MessageSquare,
  "avatar-studio": UserCircle,
  positioning: Target,
  "offer-lab": Tag,
  "copy-lab": PenTool,
  "creative-lab": Palette,
  "pdp-lab": ShoppingBag,
  "cro-diagnostic": Activity,
  "experiment-log": FlaskConical,
  "learnings-patterns": BookOpen,
};

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 p-4 lg:block">
      {/* Logo */}
      <div className="mb-5 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3">
        <p className="text-xs font-bold tracking-widest text-zinc-200 uppercase">
          ECOM Intelligence OS
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-500">Command Edition · Decision First</p>
      </div>

      <nav className="space-y-0.5">
        {SCREENS.map((screen) => {
          const href = getHref(screen.id);
          const active = pathname === href;
          const Icon = SCREEN_ICONS[screen.id as ScreenId];
          const phaseColor = PHASE_COLORS[screen.phase] ?? "#71717a";

          return (
            <Link
              key={screen.id}
              href={href}
              className={`nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${
                active
                  ? "nav-item-active bg-indigo-600/20 text-indigo-300 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.4)]"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              {/* Icon */}
              <Icon
                size={15}
                className={active ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"}
              />

              {/* Label + phase */}
              <div className="min-w-0 flex-1">
                <p className={`font-medium truncate ${active ? "text-indigo-200" : ""}`}>
                  {screen.label}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: phaseColor }}
                  />
                  <span className="text-[10px]" style={{ color: phaseColor }}>
                    Phase {screen.phase}
                  </span>
                </div>
              </div>

              {/* Active bar */}
              {active && (
                <span className="ml-auto h-4 w-0.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
