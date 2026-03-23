import type { Product, MarketValidation, Competitor, VocEntry } from "@prisma/client";

import type { StandardModuleOutput } from "@/lib/types";

type ProductScoreFields = Pick<
  Product,
  | "painIntensity"
  | "tam"
  | "differentiation"
  | "potentialMargin"
  | "potentialAov"
  | "bundleCapacity"
  | "retentionPotential"
  | "visualDemo"
  | "adAngleCount"
  | "multiSourceValidation"
>;

export function computeProductScore(input: ProductScoreFields) {
  const total =
    input.painIntensity +
    input.tam +
    input.differentiation +
    input.potentialMargin +
    input.potentialAov +
    input.bundleCapacity +
    input.retentionPotential +
    input.visualDemo +
    input.adAngleCount +
    input.multiSourceValidation;

  const verdict = total < 40 ? "NO_GO" : total < 65 ? "TEST" : "GO";
  return { total, verdict };
}

export function parseCsv(raw: string | null | undefined): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function productOutput(product: Product): StandardModuleOutput {
  const score = computeProductScore(product);
  const decision: StandardModuleOutput["decision"] =
    score.verdict === "GO"
      ? "TEST"
      : score.verdict === "NO_GO"
        ? "NO_GO"
        : "TEST";
  return {
    summary: `Le produit ${product.name} obtient ${score.total}/100 avec verdict interne ${score.verdict}.`,
    key_findings: [
      `Pain intensity: ${product.painIntensity}/10`,
      `Differentiation: ${product.differentiation}/10`,
      `Visual demo: ${product.visualDemo}/10`,
    ],
    decision,
    why:
      score.verdict === "GO"
        ? "Signal fort mais execution reelle requise avant scale."
        : score.verdict === "TEST"
          ? "Potentiel valide avec reserves; besoin d'iterer l'offre/angle."
          : "Le score global est insuffisant pour un lancement sain.",
    risks: [
      "Score eleve sans preuve marche peut induire un faux positif.",
      "Trop d'angles testes en meme temps degrade la lecture des resultats.",
    ],
    kill_criteria: [
      "Si score total reste < 40 apres 2 iterations, alors NO_GO.",
      "Si aucune preuve achat n'apparait sous 14 jours, alors stop acquisition.",
    ],
    next_move:
      score.verdict === "NO_GO"
        ? "Changer niche ou proposition de valeur avant de reevaluer."
        : "Lancer validation marche multi-preuve sur ce produit.",
    assets_to_generate: ["What must be true", "Kill list produit", "Top 3 angles initiaux"],
    structured_json: {
      productId: product.id,
      totalScore: score.total,
      verdict: score.verdict,
      bestPath: product.bestPath,
    },
  };
}

export function marketOutput(row: MarketValidation): StandardModuleOutput {
  const proofs = row.proofCount;
  const canGo = proofs >= 3;
  return {
    summary: `Validation marche ${row.temperature} avec ${proofs} preuves consolidees.`,
    key_findings: [
      `Search signals: ${JSON.parse(row.searchSignals).length}`,
      `Social signals: ${JSON.parse(row.socialSignals).length}`,
      `Purchase signals: ${JSON.parse(row.purchaseSignals).length}`,
    ],
    decision: canGo ? "TEST" : "NOT_ENOUGH_DATA",
    why: canGo
      ? "La barre multi-preuve est atteinte, lancement testable avec budget controle."
      : "Moins de 3 preuves solides, un GO serait premature.",
    risks: [
      "Interet sans achat si les preuves restent top-funnel.",
      "Angles deja saturés par les concurrents directs.",
    ],
    kill_criteria: [
      "Si preuve achat reste nulle apres 7 jours de recherche, alors NO_GO marche.",
      "Si objections dominantes non traitables, alors stop positionnement courant.",
    ],
    next_move: canGo
      ? "Passer au Competitor Board pour modeliser STEAL/ADAPT/EVITER/COUNTER."
      : "Ajouter des preuves d'achat et contenu avant toute depense media.",
    assets_to_generate: ["Objection map", "Angles libres shortlist", "Plan test marche 14 jours"],
    structured_json: {
      marketValidationId: row.id,
      proofCount: row.proofCount,
      temperature: row.temperature,
      verdict: row.verdict,
    },
  };
}

export function competitorOutput(items: Competitor[]): StandardModuleOutput {
  return {
    summary: `${items.length} concurrents analyses avec classification operationnelle.`,
    key_findings: [
      `Concurrents actifs: ${items.length}`,
      "Structure d'offre comparee sur prix, bundle, upsell.",
      "Failles checkout/reassurance identifiees pour contre-positionnement.",
    ],
    decision: items.length >= 3 ? "TEST" : "NOT_ENOUGH_DATA",
    why: items.length >= 3 ? "Le minimum concurrentiel est atteint pour une lecture fiable." : "Moins de 3 concurrents = vision incomplete du terrain.",
    risks: [
      "Copier des tactiques usees peut degrader la marge.",
      "Sur-optimiser PDP avant preuve d'angle gagnant.",
    ],
    kill_criteria: [
      "Si aucun avantage differenciant n'est trouve apres 5 analyses, reset positionnement.",
      "Si checkout concurrent est meilleur sur tous les axes, prioriser CRO avant acquisition.",
    ],
    next_move:
      items.length >= 3
        ? "Transferer les insights au Positioning + Offer Lab."
        : "Atteindre 3-5 analyses concurrentielles completes.",
    assets_to_generate: ["Tableau STEAL/ADAPT/EVITER/COUNTER", "Counter-offer notes", "PDP checklist"],
    structured_json: {
      competitorCount: items.length,
    },
  };
}

export function vocOutput(items: VocEntry[]): StandardModuleOutput {
  const highIntent = items.filter((v) => v.purchaseProximity >= 4).length;
  return {
    summary: `${items.length} verbatims consolides, dont ${highIntent} proches achat.`,
    key_findings: [
      `Themes haute proximite achat: ${highIntent}`,
      "Douleurs et objections dominantes extractibles pour hooks/PDP/FAQ.",
      "Lexique client reutilisable dans ads, email, page produit.",
    ],
    decision: items.length >= 20 ? "TEST" : "NOT_ENOUGH_DATA",
    why:
      items.length >= 20
        ? "Volume VOC suffisant pour produire des assets copy/creative fiables."
        : "Base VOC trop faible pour generaliser des messages robustes.",
    risks: [
      "Sur-representer une source unique biaise l'angle retenu.",
      "Ignorer objections severes penalise CVR checkout.",
    ],
    kill_criteria: [
      "Si objections severite 4-5 persistent sans reponse, iterer offre/PDP.",
      "Si hooks VOC n'ameliorent pas CTR apres 3 creatives, revoir segmentation.",
    ],
    next_move:
      items.length >= 20
        ? "Generer Copy Lab hooks et FAQ depuis les themes dominants."
        : "Ajouter 20+ verbatims qualifies multisources.",
    assets_to_generate: ["VOC hook bank", "FAQ objections", "UGC scripts"],
    structured_json: {
      vocCount: items.length,
      highIntentCount: highIntent,
    },
  };
}
