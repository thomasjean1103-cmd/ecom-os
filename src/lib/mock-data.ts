import type { Decision, StandardModuleOutput } from "@/lib/types";

export const decisionColorMap: Record<Decision, string> = {
  NO_GO: "bg-red-500/20 text-red-300 border-red-500/40",
  TEST: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  ITERATE: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  KEEP: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  SCALE: "bg-green-500/20 text-green-300 border-green-500/40",
  NOT_ENOUGH_DATA: "bg-zinc-600/40 text-zinc-200 border-zinc-500/40",
};

export const dashboardData = {
  thisWeeksMoneyMove:
    "Corriger la friction checkout mobile (Apple Pay, reassurance bloc, simplification champs).",
  biggestLeak: "Abandon panier: 72% (objectif: < 65%)",
  decisionQueue: [
    "Produit Massage Pro - TEST",
    "Offer Bundle x2 - ITERATE",
    "Creative Angle: Before/After - KEEP",
  ],
  currentTest: {
    name: "Checkout reassurance v2",
    before: "CVR 2.1%",
    after: "CVR 2.6% (early)",
    reviewDate: "2026-03-31",
  },
  patternAlerts: [
    "3 concurrents migrent vers angle 'scientifique'.",
    "UGC face-cam baisse en CTR sur audience froide.",
  ],
  recentLearnings: [
    "Hero + preuve chiffrée au-dessus de la ligne = +18% ATC.",
    "Urgence fake detectee dans commentaires, baisse confiance.",
    "Bundle x3 performant seulement avec ancre premium explicite.",
    "FAQ objections prix augmente CVR mobile de 0.3 points.",
    "CTA unique outperform multi-CTA sur trafic Meta froid.",
  ],
  coreKpis: {
    revenue: "42 800 EUR",
    cvr: "2.4%",
    aov: "58 EUR",
    atcRate: "8.9%",
    cartAbandonment: "72%",
    repeatRate: "16%",
    ltv: "132 EUR",
  },
};

export const defaultModuleOutput: StandardModuleOutput = {
  summary:
    "Module initialise avec structure de decision standard. Connectez les donnees du module pour produire un verdict fiable.",
  key_findings: [
    "La structure impose une decision claire.",
    "Les kill criteria sont requis avant execution.",
    "Le next move force une action unique immediate.",
  ],
  decision: "NOT_ENOUGH_DATA",
  why: "Aucune donnee operationnelle encore connectee pour ce module.",
  risks: [
    "Risque de sur-analyse sans execution testable.",
    "Risque de lancer sans seuils kill explicites.",
  ],
  kill_criteria: ["Si aucune baseline n'est definie apres 7 jours, pause module."],
  next_move: "Brancher les formulaires et enregistrer la premiere entree module.",
  assets_to_generate: ["template JSON module", "checklist de collecte"],
  structured_json: {
    status: "ready_for_connection",
    required_inputs: ["baseline_metrics", "decision_thresholds", "time_window_days"],
  },
};
