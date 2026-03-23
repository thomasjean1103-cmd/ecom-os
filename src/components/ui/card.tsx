import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 md:p-5">
      <header className="mb-3">
        <h3 className="text-sm font-semibold tracking-wide text-zinc-100">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs text-zinc-400">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
