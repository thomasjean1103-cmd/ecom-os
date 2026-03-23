"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SCREENS } from "@/config/screens";

function getHref(id: string) {
  return id === "command-center" ? "/" : `/${id}`;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 p-4 lg:block">
      <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
        <p className="text-xs font-semibold tracking-wide text-zinc-200">ECOM INTELLIGENCE OS</p>
        <p className="text-[11px] text-zinc-400">Command Edition - Decision First</p>
      </div>

      <nav className="space-y-1">
        {SCREENS.map((screen) => {
          const href = getHref(screen.id);
          const active = pathname === href;
          return (
            <Link
              key={screen.id}
              href={href}
              className={`block rounded-md px-3 py-2 text-xs transition ${
                active
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <p className="font-medium">{screen.label}</p>
              <p className={`mt-0.5 text-[10px] ${active ? "text-zinc-700" : "text-zinc-500"}`}>
                Phase {screen.phase}
              </p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
