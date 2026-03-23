import type { ScreenDefinition } from "@/lib/types";

export const SCREENS: ScreenDefinition[] = [
  {
    id: "command-center",
    label: "Command Center",
    description: "Priorite, fuites, tests en cours et KPIs critiques.",
    phase: 2,
  },
  {
    id: "product-scout",
    label: "Product Scout",
    description: "Scoring 10 criteres et verdict GO / TEST / NO_GO.",
    phase: 3,
  },
  {
    id: "market-intel",
    label: "Market Intel",
    description: "Validation multi-preuves et temperature marche.",
    phase: 3,
  },
  {
    id: "competitor-board",
    label: "Competitor Board",
    description: "Analyse 3-5 concurrents et modeles STEAL/ADAPT/EVITER/COUNTER.",
    phase: 3,
  },
  {
    id: "voc-vault",
    label: "VOC Vault",
    description: "Verbatims tags, intensite emotionnelle et proximite achat.",
    phase: 3,
  },
  {
    id: "avatar-studio",
    label: "Avatar Studio",
    description: "Avatar actionnable + messaging map TOF/MOF/BOF.",
    phase: 4,
  },
  {
    id: "positioning",
    label: "Positioning",
    description: "Promesse centrale, mecanisme, preuve et territoire.",
    phase: 4,
  },
  {
    id: "offer-lab",
    label: "Offer Lab",
    description: "Architecture d'offre en 4 scenarios et priorite AOV.",
    phase: 4,
  },
  {
    id: "copy-lab",
    label: "Copy Lab",
    description: "Hooks, ads, PDP, email et traitement d'objections.",
    phase: 5,
  },
  {
    id: "creative-lab",
    label: "Creative Lab",
    description: "Matrice creative, hypotheses, KPI cibles et kill thresholds.",
    phase: 5,
  },
  {
    id: "pdp-lab",
    label: "PDP Lab",
    description: "PDP 7 sections avec objectif prioritaire.",
    phase: 5,
  },
  {
    id: "cro-diagnostic",
    label: "CRO Diagnostic",
    description: "Lecture des fuites conversion et money move hebdo.",
    phase: 6,
  },
  {
    id: "experiment-log",
    label: "Experiment Log",
    description: "Hypotheses, variable unique, duree et verdicts.",
    phase: 6,
  },
  {
    id: "learnings-patterns",
    label: "Learnings & Patterns",
    description: "Memoire, patterns gagnants, dead angles et banques.",
    phase: 7,
  },
];

export const NON_COMMAND_SCREENS = SCREENS.filter(
  (screen) => screen.id !== "command-center",
);
