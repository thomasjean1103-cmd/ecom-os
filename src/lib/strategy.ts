import type { Angle, Avatar, Offer, Positioning } from "@prisma/client";

import type { StandardModuleOutput } from "@/lib/types";

export function avatarOutput(items: Avatar[]): StandardModuleOutput {
  const complete = items.filter(
    (a) => a.mainPain && a.hiddenDesire && a.tofMessage && a.mofMessage && a.bofMessage,
  ).length;
  return {
    summary: `${items.length} avatars, ${complete} avec messaging map complet.`,
    key_findings: [
      `Avatars crees: ${items.length}`,
      `Avatars exploitables funnel: ${complete}`,
      "Triggers copy et confiance centralises.",
    ],
    decision: complete >= 1 ? "TEST" : "NOT_ENOUGH_DATA",
    why:
      complete >= 1
        ? "Au moins un avatar actionnable permet de lancer des creatives ciblees."
        : "Profil insuffisant pour guider acquisition et copy.",
    risks: [
      "Persona decoratif sans buying moment reel.",
      "Messages TOF/MOF/BOF non differencies.",
    ],
    kill_criteria: [
      "Si aucun avatar complet en 7 jours, pause production copy.",
      "Si CTR ne monte pas apres alignement avatar, iterer triggers.",
    ],
    next_move:
      complete >= 1 ? "Mapper top 3 angles par avatar." : "Completer identity, pain, desire, funnel map.",
    assets_to_generate: ["messaging map", "buying moment map", "trigger library"],
    structured_json: { avatarCount: items.length, completeAvatars: complete },
  };
}

export function positioningOutput(positioning: Positioning | null): StandardModuleOutput {
  if (!positioning) {
    return {
      summary: "Aucun positionnement defini.",
      key_findings: ["Definir ennemi, promesse, mecanisme et preuve."],
      decision: "NOT_ENOUGH_DATA",
      why: "Le produit n'a pas encore de doctrine de bataille explicite.",
      risks: ["Copy generique et non differenciante."],
      kill_criteria: ["Si core promise absente, stop campagne froide."],
      next_move: "Creer le premier positionnement produit.",
      assets_to_generate: ["battle card", "positioning statement"],
      structured_json: {},
    };
  }

  const completeness = [
    positioning.mainEnemy,
    positioning.beatenAlternative,
    positioning.corePromise,
    positioning.differentiatingMechanism,
    positioning.mainProof,
  ].filter(Boolean).length;

  return {
    summary: `Positionnement defini avec ${completeness}/5 piliers critiques.`,
    key_findings: [
      `Ennemi principal: ${positioning.mainEnemy ?? "n/a"}`,
      `Promesse centrale: ${positioning.corePromise ?? "n/a"}`,
      `Mecanisme: ${positioning.differentiatingMechanism ?? "n/a"}`,
    ],
    decision: completeness >= 4 ? "TEST" : "ITERATE",
    why: completeness >= 4 ? "Base solide pour copy et creatives coherentes." : "Positionnement incomplet, risque de message confus.",
    risks: ["Promesse non prouvable.", "Terrain de comparaison mal choisi."],
    kill_criteria: [
      "Si promesse ne tient pas en preuve primaire, iterer positionnement.",
      "Si audience ne percoit pas le mecanisme, simplifier message.",
    ],
    next_move: "Brancher positionnement dans Offer + Copy Lab.",
    assets_to_generate: ["tone guide", "visual territory board", "comparison script"],
    structured_json: { positioningId: positioning.id, completeness },
  };
}

export function offerOutput(items: Offer[]): StandardModuleOutput {
  const scenarios = new Set(items.map((o) => o.scenario)).size;
  return {
    summary: `${items.length} offres, ${scenarios} scenarios couverts.`,
    key_findings: [
      "Ordre AOV impose: bundle -> free shipping -> upsell -> cross-sell.",
      `Scenarios actifs: ${scenarios}/4`,
      `Offres en test: ${items.filter((o) => o.verdict === "TESTING").length}`,
    ],
    decision: scenarios >= 4 ? "TEST" : "ITERATE",
    why: scenarios >= 4 ? "Comparaison complete des leviers conversion/marge/AOV/LTV." : "Tous les scenarios n'ont pas ete modelises.",
    risks: ["Trop de friction sur scenario marge max.", "AOV max peut tuer CVR sans garde-fous."],
    kill_criteria: [
      "Si CVR baisse >10% pour gain AOV <20%, iterer offre.",
      "Si marge nette degradee apres upsell, simplifier structure.",
    ],
    next_move: scenarios >= 4 ? "Lancer un test scenario a la fois sur 7-14 jours." : "Creer les scenarios manquants.",
    assets_to_generate: ["offer comparison matrix", "post-add upsell copy"],
    structured_json: { offerCount: items.length, scenarios },
  };
}

export function angleOutput(items: Angle[]): StandardModuleOutput {
  const ranked = items.filter((a) => a.rank !== null).length;
  const top3 = [...items]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3)
    .map((x) => x.name);
  return {
    summary: `${items.length} angles evalues, top prioritaire: ${top3.join(", ") || "n/a"}.`,
    key_findings: [
      `Angles classes: ${ranked}`,
      `Angles winners: ${items.filter((a) => a.status === "WINNER").length}`,
      "Saturation penalisee dans le score total.",
    ],
    decision: items.length >= 3 ? "TEST" : "NOT_ENOUGH_DATA",
    why: items.length >= 3 ? "Le minimum pour un batch test multi-angle est atteint." : "Pas assez d'angles pour une priorisation robuste.",
    risks: ["Angles trop similaires faussent les tests.", "Saturation sous-estimee sur audiences froides."],
    kill_criteria: [
      "Si CPC > seuil apres 500 clics, couper angle.",
      "Si CTR < baseline sur 3 creatives, angle en DEAD.",
    ],
    next_move: items.length >= 3 ? "Tester top 3 angles avec format constant." : "Ajouter au moins 3 angles distincts.",
    assets_to_generate: ["angle brief", "creative hypotheses", "kill-threshold sheet"],
    structured_json: { angleCount: items.length, top3 },
  };
}
