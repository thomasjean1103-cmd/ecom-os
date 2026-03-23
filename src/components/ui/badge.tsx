import { decisionColorMap } from "@/lib/mock-data";
import type { Decision } from "@/lib/types";

export function DecisionBadge({ decision }: { decision: Decision }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${decisionColorMap[decision]}`}
    >
      {decision}
    </span>
  );
}
