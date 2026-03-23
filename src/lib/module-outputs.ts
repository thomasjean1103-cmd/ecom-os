import type {
  CopyAsset,
  Creative,
  CroAudit,
  Experiment,
  KpiSnapshot,
  Learning,
  PdpVersion,
  WeeklyPriority,
} from "@prisma/client";

import type { StandardModuleOutput } from "@/lib/types";

export function copyLabOutput(items: CopyAsset[]): StandardModuleOutput {
  return {
    summary: `${items.length} assets copy en base (hooks, ads, PDP, email, objections).`,
    key_findings: [
      `Assets TESTING: ${items.filter((x) => x.status === "TESTING").length}`,
      `Assets WINNER: ${items.filter((x) => x.status === "WINNER").length}`,
      "Variants safe/aggressive disponibles pour comparaison.",
    ],
    decision: items.length >= 10 ? "TEST" : "ITERATE",
    why: items.length >= 10 ? "Volume suffisant pour batch tests structurels." : "Library copy encore trop mince.",
    risks: ["Hooks trop similaires.", "Objections critiques non traitees."],
    kill_criteria: [
      "Si CTR n'augmente pas apres 10 hooks, iterer angle et persona.",
      "Si CVR baisse avec variant agressive, revenir safe.",
    ],
    next_move: "Exporter top assets vers Creative Lab.",
    assets_to_generate: ["10 hooks/angle", "PDP objection blocks", "email subject matrix"],
    structured_json: { count: items.length },
  };
}

export function creativeLabOutput(items: Creative[]): StandardModuleOutput {
  return {
    summary: `${items.length} creatives trackees avec hypotheses et kill thresholds.`,
    key_findings: [
      `Formats distincts: ${new Set(items.map((x) => x.format).filter(Boolean)).size}`,
      `Angles utilises: ${new Set(items.map((x) => x.angle).filter(Boolean)).size}`,
      `Creatives WINNER: ${items.filter((x) => x.status === "WINNER").length}`,
    ],
    decision: items.length >= 6 ? "TEST" : "ITERATE",
    why: items.length >= 6 ? "De quoi tester 3 angles x 2 formats minimum." : "Batch creatif incomplet.",
    risks: ["Changer angle+format+offre en meme temps.", "Kill thresholds absents."],
    kill_criteria: [
      "Si CPC > seuil apres 500 clics, couper creative.",
      "Si CTR < baseline sur 3 jours, iterer hook visuel.",
    ],
    next_move: "Lancer batch avec variable unique controlee.",
    assets_to_generate: ["creative matrix", "hook variations", "proof inserts"],
    structured_json: { count: items.length },
  };
}

export function pdpOutput(items: PdpVersion[]): StandardModuleOutput {
  const latest = items[0];
  return {
    summary: latest
      ? `PDP v${latest.version} activee avec objectif ${latest.priorityGoal ?? "non defini"}.`
      : "Aucune version PDP creee.",
    key_findings: [
      `Versions PDP: ${items.length}`,
      "Structure 7 sections imposee.",
      "Verdict PDP trace pour iteration.",
    ],
    decision: items.length >= 1 ? "TEST" : "NOT_ENOUGH_DATA",
    why: items.length >= 1 ? "Base exploitable pour tests ATC/CVR." : "Sans PDP versionnee, pas d'optimisation structurée.",
    risks: ["Optimiser PDP alors que leak vient checkout.", "Preuve sociale insuffisante."],
    kill_criteria: [
      "Si CVR < 1% apres 14 jours, iterer PDP.",
      "Si ATC bon mais purchase faible, investiguer checkout/pricing.",
    ],
    next_move: "Lancer test PDP avec objectif prioritaire unique.",
    assets_to_generate: ["PDP v2 sections", "FAQ objections", "hero variants"],
    structured_json: { count: items.length, latestVersion: latest?.version ?? null },
  };
}

export function croOutput(audit: CroAudit | null): StandardModuleOutput {
  if (!audit) {
    return {
      summary: "Aucun audit CRO.",
      key_findings: ["Renseigner bounce, abandon panier, temps, CVR, AOV, ATC."],
      decision: "NOT_ENOUGH_DATA",
      why: "Pas de metriques d'entree.",
      risks: ["Actions prises sans diagnostic."],
      kill_criteria: ["Si data tracking manquante, bloquer scale."],
      next_move: "Creer premier audit CRO.",
      assets_to_generate: ["CRO checklist"],
      structured_json: {},
    };
  }

  return {
    summary: `Leak #1: ${audit.biggestLeak ?? "n/a"} | Leak #2: ${audit.secondLeak ?? "n/a"}.`,
    key_findings: [
      `Bounce: ${audit.bounceRate ?? 0}%`,
      `Cart abandon: ${audit.cartAbandonRate ?? 0}%`,
      `CVR: ${audit.conversionRate ?? 0}%`,
    ],
    decision: "ITERATE",
    why: "Le module CRO sert a corriger les fuites avant scale budget.",
    risks: ["Confondre probleme trafic et probleme PDP.", "Ignorer friction checkout."],
    kill_criteria: [
      "Si bounce > 60% durable, refondre hero/message/vitesse.",
      "Si abandon panier > 70%, prioriser checkout + reassurance.",
    ],
    next_move: audit.weeklyMoneyMove ?? "Fixer une seule money move cette semaine.",
    assets_to_generate: ["quick wins list", "heavy work backlog"],
    structured_json: { croAuditId: audit.id },
  };
}

export function experimentOutput(items: Experiment[]): StandardModuleOutput {
  return {
    summary: `${items.length} experiments suivis avec verdicts.`,
    key_findings: [
      `RUNNING: ${items.filter((x) => x.verdict === "RUNNING").length}`,
      `SCALE: ${items.filter((x) => x.verdict === "SCALE").length}`,
      `CUT: ${items.filter((x) => x.verdict === "CUT").length}`,
    ],
    decision: items.length > 0 ? "TEST" : "NOT_ENOUGH_DATA",
    why: items.length > 0 ? "Cadence de test active." : "Aucun test actif.",
    risks: ["Duree test < 7 jours.", "Variables multiples modifiees."],
    kill_criteria: [
      "Si test < 7 jours sans urgence, pas de verdict final.",
      "Si ROAS < seuil apres budget defini, CUT.",
    ],
    next_move: "Maintenir une seule variable par test.",
    assets_to_generate: ["test brief", "review sheet"],
    structured_json: { count: items.length },
  };
}

export function memoryOutput(
  learnings: Learning[],
  patterns: number,
  deadAngles: number,
): StandardModuleOutput {
  return {
    summary: `Memoire active: ${learnings.length} learnings, ${patterns} winning patterns, ${deadAngles} dead angles.`,
    key_findings: [
      `Insights type win: ${learnings.filter((x) => x.type === "win").length}`,
      "Banques exploitables pour copy/offre/objections.",
      "Historique consultable pour eviter repetition d'erreurs.",
    ],
    decision: learnings.length >= 5 ? "KEEP" : "ITERATE",
    why: learnings.length >= 5 ? "Base memoire commence a devenir predictive." : "Trop peu d'historique pour guider les decisions.",
    risks: ["Learning non tagge = inutilisable.", "Pas de boucle auto depuis experiments."],
    kill_criteria: [
      "Si experiment termine sans learning, corriger pipeline.",
      "Si pattern non confirme 2 fois, garder en hypothese.",
    ],
    next_move: "Automatiser alimentation learnings depuis verdicts tests.",
    assets_to_generate: ["pattern cards", "dead-angle register", "objection answers"],
    structured_json: { learnings: learnings.length, patterns, deadAngles },
  };
}

export function commandCenterData(input: {
  priority: WeeklyPriority | null;
  cro: CroAudit | null;
  experiments: Experiment[];
  learnings: Learning[];
  kpi: KpiSnapshot | null;
}) {
  return {
    moneyMove: input.priority?.moneyMove ?? input.cro?.weeklyMoneyMove ?? "Definir UNE priorite majeure.",
    biggestLeak:
      input.priority?.biggestLeak ??
      input.cro?.biggestLeak ??
      "Aucune fuite diagnostiquee pour le moment",
    decisionQueue: input.experiments.slice(0, 3).map((e) => `${e.name} - ${e.verdict}`),
    currentTest: input.experiments[0] ?? null,
    learnings: input.learnings.slice(0, 5),
    kpi: input.kpi,
  };
}
