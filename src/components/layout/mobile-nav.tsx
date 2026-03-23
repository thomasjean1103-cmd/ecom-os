"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SCREENS } from "@/config/screens";

function getHref(id: string) {
  return id === "command-center" ? "/" : `/${id}`;
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-zinc-800 bg-zinc-950 px-3 py-2 lg:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SCREENS.map((screen) => {
          const href = getHref(screen.id);
          const active = pathname === href;
          return (
            <Link
              key={screen.id}
              href={href}
              className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] ${
                active
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-900 text-zinc-300"
              }`}
            >
              {screen.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
