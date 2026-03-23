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

// ─── Rich Product Scout Output (16 sections) ────────────────────────────────

export type RichProductOutput = {
  /** Header — sources de validation */
  sources: Array<{ platform: string; signal: string }>;

  /** 1. Problème résolu */
  problemSolved: { pains: string[]; frustrations: string[]; promise: string };

  /** 2. Mécanisme différenciant */
  mechanism: { technology: string; features: string[]; specs: string[] };

  /** 3. Promesse claire — 3 formulations */
  promise: [string, string, string];

  /** 4. Désir de masse */
  massDesire: { tam: string; targets: string[]; stats: string[] };

  /** 5. Transformation AVANT→APRÈS — 4 lignes */
  transformation: Array<{ dimension: string; before: string; after: string }>;

  /** 6. Émotions — 4 triggers */
  emotions: Array<{ trigger: string; copy: string }>;

  /** 7. Déclencheurs psychologiques */
  psychTriggers: Array<{ type: string; copy: string }>;

  /** 8. Objections — 4 objections + réponses */
  objections: Array<{ objection: string; response: string }>;

  /** 9. USP — 5 points différenciants */
  usp: Array<{ point: string; vsCompetitors: string }>;

  /** 10. Angles publicitaires — 5 angles avec hooks */
  adAngles: Array<{ angle: string; hook: string }>;

  /** 11. Idées créatifs */
  creativeIdeas: {
    video: Array<{ concept: string; format: string; duration: string }>;
    static: Array<{ concept: string; format: string }>;
  };

  /** 12. Buyer personas — 2 personas */
  buyerPersonas: Array<{
    name: string;
    age: string;
    job: string;
    problem: string;
    channel: string;
  }>;

  /** 13. Stratégie d'offre */
  offerStrategy: {
    cogs: string;
    basePrice: string;
    multiplier: string;
    offers: Array<{ name: string; price: string; description: string }>;
    upsells: Array<{ name: string; price: string }>;
  };

  /** 14. Concurrence */
  competition: Array<{ name: string; activePrice: string; window: string }>;

  /** 15. SEO */
  seo: Array<{ keyword: string; volume: string }>;

  /** 16. Storytelling */
  storytelling: string;

  /** Verdict final */
  verdict: {
    decision: "GO" | "TEST" | "NO_GO";
    score: number;
    risks: string[];
    testBudget: string;
  };
};
