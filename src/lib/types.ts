export type Decision =
  | "NO_GO"
  | "TEST"
  | "ITERATE"
  | "KEEP"
  | "SCALE"
  | "NOT_ENOUGH_DATA";

export type StandardModuleOutput = {
  summary: string;
  key_findings: string[];
  decision: Decision;
  why: string;
  risks: string[];
  kill_criteria: string[];
  next_move: string;
  assets_to_generate: string[];
  structured_json: Record<string, unknown>;
};

export type ScreenId =
  | "command-center"
  | "product-scout"
  | "market-intel"
  | "competitor-board"
  | "voc-vault"
  | "avatar-studio"
  | "positioning"
  | "offer-lab"
  | "copy-lab"
  | "creative-lab"
  | "pdp-lab"
  | "cro-diagnostic"
  | "experiment-log"
  | "learnings-patterns";

export type ScreenDefinition = {
  id: ScreenId;
  label: string;
  description: string;
  phase: number;
};
