import { DecisionBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { StandardModuleOutput } from "@/lib/types";

export function ModuleOutputCard({ output }: { output: StandardModuleOutput }) {
  return (
    <Card title="Sortie Standard Module" subtitle="Format obligatoire 9 elements">
      <div className="space-y-3 text-xs text-zinc-300">
        <p>{output.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Decision</span>
          <DecisionBadge decision={output.decision} />
        </div>
        <p>
          <span className="text-zinc-400">Why: </span>
          {output.why}
        </p>
        <div>
          <p className="mb-1 text-zinc-400">Key findings</p>
          <ul className="list-disc space-y-1 pl-4">
            {output.key_findings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-zinc-400">Kill criteria</p>
          <ul className="list-disc space-y-1 pl-4">
            {output.kill_criteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p>
          <span className="text-zinc-400">Next move: </span>
          {output.next_move}
        </p>
      </div>
    </Card>
  );
}
