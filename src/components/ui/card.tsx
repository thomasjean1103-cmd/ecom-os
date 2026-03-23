import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="ui-card relative rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 md:p-5 overflow-hidden"
    >
      {/* Subtle accent glow top-left */}
      {accent && (
        <span
          className="pointer-events-none absolute -top-px left-0 right-0 h-[1px] rounded-t-xl"
          style={{ background: `linear-gradient(to right, ${accent}80, transparent)` }}
        />
      )}

      <header className="mb-3 flex items-start gap-2">
        {Icon && (
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={accent ? { background: `${accent}18`, color: accent } : { background: "#27272a", color: "#a1a1aa" }}
          >
            <Icon size={14} />
          </span>
        )}
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
      </header>

      {children}
    </section>
  );
}
