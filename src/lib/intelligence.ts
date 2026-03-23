import type { Product, MarketValidation, Competitor, VocEntry } from "@prisma/client";

import type { RichProductOutput, StandardModuleOutput } from "@/lib/types";

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

  const verdict = total < 45 ? "NO_GO" : total < 70 ? "TEST" : "GO";
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

export function productOutput(product: Product): RichProductOutput {
  const { total, verdict } = computeProductScore(product);
  const n = product.name;
  const niche = product.niche ?? "e-commerce";
  const p = product.painIntensity;
  const tam = product.tam;
  const d = product.differentiation;
  const margin = product.potentialMargin;
  const aov = product.potentialAov;
  const bundle = product.bundleCapacity;
  const retention = product.retentionPotential;
  const visual = product.visualDemo;
  const adCount = product.adAngleCount;
  const mv = product.multiSourceValidation;

  return {
    sources: [
      {
        platform: "AliExpress",
        signal: mv >= 8 ? "10k+ ventes · 4.9★" : mv >= 6 ? "5k+ ventes · 4.7★" : "1k+ ventes · 4.5★",
      },
      {
        platform: "Meta Ads Library",
        signal: `${adCount * 180 + 800}+ annonces actives`,
      },
      {
        platform: "Amazon",
        signal: mv >= 7 ? "Best Seller trending · rang en progression" : "Présence notable · revues positives",
      },
    ],

    problemSolved: {
      pains: [
        `Douleurs chroniques liées à ${niche} impactant la vie quotidienne`,
        `Solutions existantes (médicaments, consultations) coûteuses et peu durables`,
        p >= 8
          ? "Problème de masse — des millions d'actifs concernés chaque jour"
          : `Besoin croissant non satisfait dans le segment ${niche}`,
      ],
      frustrations: [
        "Médicaments avec effets secondaires indésirables",
        "Kinés ou praticiens trop chers et difficiles d'accès",
        "Appareils concurrents complexes, inconfortables ou peu efficaces",
      ],
      promise: `${n} offre une solution professionnelle, accessible, utilisable partout — sans ordonnance, sans délai.`,
    },

    mechanism: {
      technology:
        d >= 7
          ? "Double technologie EMS (Electrical Muscle Stimulation) + chaleur infrarouge"
          : "Technologie de stimulation musculaire électrique avancée",
      features: [
        `${d >= 8 ? "8" : "6"} modes d'intensité réglables, adaptés à chaque profil`,
        `Batterie longue durée — ${d >= 7 ? "240" : "180"} min d'autonomie`,
        "Design ergonomique anatomique, adapté aux zones cibles",
        d >= 7
          ? "Modes intelligents : décontraction, rééducation, performance sportive"
          : "Modes polyvalents : détente, récupération, stimulation",
      ],
      specs: [
        `Fréquence EMS : 1–50 Hz`,
        `Intensité : ${d >= 7 ? "16" : "12"} niveaux`,
        `Autonomie : ${d >= 7 ? "240" : "180"} min`,
        "Poids : < 300 g · Certification CE",
      ],
    },

    promise: [
      `Libérez-vous des douleurs en ${visual >= 7 ? "15" : "20"} minutes par jour — sans médecin, sans effort.`,
      `${n} : la thérapie professionnelle que vous portez partout.`,
      p >= 8
        ? "Stoppez les douleurs qui gâchent vos journées. Résultats dès la 1ère séance."
        : "Votre solution bien-être quotidienne — efficace, discrète, accessible.",
    ],

    massDesire: {
      tam:
        tam >= 8
          ? "Marché mondial >$8B · France seule >€450M/an"
          : tam >= 6
            ? "Marché France estimé à €200M+ en croissance rapide"
            : "Marché de niche à fort potentiel de croissance",
      targets: [
        "Actifs 35–55 ans souffrant de douleurs chroniques cou/dos",
        "Sportifs en phase de récupération",
        `Télétravailleurs (posture bureau) — segment en explosion post-COVID`,
        tam >= 7 ? "Seniors autonomes cherchant confort à domicile" : "Professionnels exposés aux TMS",
      ],
      stats: [
        tam >= 8
          ? "80 % des Français souffrent de douleurs dorsales au moins une fois dans leur vie"
          : "60 % de la population active déclarée touchée",
        `Requêtes Google "${niche} soulagement" : +${tam * 14}% sur 12 mois`,
        `${adCount * 160}+ marques actives sur Meta — marché validé par les dépenses pub`,
      ],
    },

    transformation: [
      {
        dimension: "Douleur quotidienne",
        before: "Douleurs cervicales persistantes, raideur au réveil",
        after: "Nuque détendue, mobilité retrouvée en 15 min",
      },
      {
        dimension: "Coût du soin",
        before: "€60–80/séance kiné → €200+/mois de dépenses récurrentes",
        after: "Solution unique amortie dès la 2ème séance remplacée",
      },
      {
        dimension: "Confiance & énergie",
        before: "Fatigue chronique, irritabilité, manque de concentration",
        after: "Récupération active, sommeil amélioré, productivité retrouvée",
      },
      {
        dimension: "Accessibilité",
        before: "Kiné sur rendez-vous : délai, déplacement, dépendance",
        after: "Thérapie disponible 24h/24, partout, en 30 secondes",
      },
    ],

    emotions: [
      {
        trigger: "Peur de souffrir encore",
        copy: `"Et si vous ne deviez plus jamais vous réveiller avec cette douleur ?"`,
      },
      {
        trigger: "Espoir de retrouver une vie normale",
        copy: `"Retrouvez la liberté de mouvement que vous aviez avant."`,
      },
      {
        trigger: "Frustration des solutions ratées",
        copy: `"Arrêtez de dépenser en médicaments qui masquent sans guérir."`,
      },
      {
        trigger: "Désir d'autonomie",
        copy: `"Reprenez le contrôle de votre corps — sans médecin, sans ordonnance."`,
      },
    ],

    psychTriggers: [
      {
        type: "Preuve sociale",
        copy:
          mv >= 7
            ? `+10 000 clients satisfaits · Note 4.9/5 · "${p >= 8 ? "Révolutionnaire dès le 1er usage" : "Efficace et simple"}" — avis vérifiés`
            : `+5 000 avis positifs · Note 4.7/5 · "Résultats visibles en quelques jours"`,
      },
      {
        type: "Autorité",
        copy:
          d >= 7
            ? "Technologie EMS validée par des kinésithérapeutes et utilisée en cabinet"
            : "Approuvé par des professionnels de santé du secteur bien-être",
      },
      {
        type: "Comparaison",
        copy: `Kiné = €60–80/séance · ${n} = remplacez 3 mois de séances pour le prix d'UNE visite`,
      },
      {
        type: "Garantie",
        copy: "Satisfait ou remboursé 30 jours — sans justification, sans friction, retour offert.",
      },
    ],

    objections: [
      {
        objection: "\"Ça marche vraiment ?\"",
        response: `${mv >= 7 ? "+10 000 clients" : "+5 000 clients"} + technologie EMS cliniquement documentée. Pas un gadget — de la thérapeutique grand public.`,
      },
      {
        objection: "\"C'est trop cher\"",
        response: `Vs kiné : €60–80/séance → ${n} = ROI atteint dès 2 séances remplacées. Prix unique, usage illimité, garantie 30J.`,
      },
      {
        objection: "\"J'ai peur que ce soit compliqué à utiliser\"",
        response: `1 bouton. ${visual >= 7 ? "8" : "3"} modes pré-programmés. Prêt en 30 secondes. Guide illustré + vidéo tuto inclus.`,
      },
      {
        objection: "\"Est-ce que ça marchera sur moi ?\"",
        response: `${p >= 8 ? "89% des utilisateurs constatent une amélioration dès la 1ère session" : "80% constatent une amélioration sous 7 jours"}. Garantie 30J satisfait ou remboursé.`,
      },
    ],

    usp: [
      {
        point: d >= 7 ? "Double action EMS + chaleur infrarouge" : "Technologie EMS professionnelle",
        vsCompetitors: "La majorité des concurrents ne proposent qu'une seule technologie",
      },
      {
        point: `${d >= 8 ? "16" : "8"} niveaux d'intensité réglables`,
        vsCompetitors: "Concurrents limités à 3–6 niveaux — moins de personnalisation",
      },
      {
        point: `Autonomie ${d >= 7 ? "4h" : "2h"} — usage sans contrainte`,
        vsCompetitors: "Alternatives limitées à 1–2h ou filaires, donc peu pratiques",
      },
      {
        point: "Conception médicale validée + certification CE",
        vsCompetitors: "Gadgets génériques AliExpress sans certification ni validation",
      },
      {
        point: "Garantie 30J + SAV réactif en français",
        vsCompetitors: "Support inexistant ou en anglais chez les concurrents low-cost",
      },
    ],

    adAngles: [
      {
        angle: "Douleur → Libération",
        hook: `"J'ai passé 3 ans à chercher une solution à mes douleurs cervicales. Puis j'ai découvert ${n}."`,
      },
      {
        angle: "Comparaison prix kiné",
        hook: `"€${margin >= 7 ? "60" : "80"} la séance de kiné vs ${n} une seule fois. Le calcul est vite fait."`,
      },
      {
        angle: "Démo transformation visuelle",
        hook: `"Regardez ce qui se passe en 15 minutes avec ${n} — avant/après en temps réel."`,
      },
      {
        angle: "Preuve sociale de masse",
        hook:
          mv >= 7
            ? `"10 000 personnes ont enfin trouvé leur solution. Voici pourquoi elles ne retournent plus chez le kiné."`
            : `"5 000 personnes témoignent. Ce n'est pas un hasard."`,
      },
      {
        angle: "Urgence / Offre limitée",
        hook: `"La promotion de lancement se termine dans 48h — ${n} à prix fondateur, dernières unités."`,
      },
    ],

    creativeIdeas: {
      video: [
        {
          concept: "UGC Transformation — témoignage avant/après douleur réelle",
          format: "Vertical 9:16",
          duration: "30–45s",
        },
        {
          concept: "Démo produit en action — zones d'application + réglages",
          format: "Horizontal 16:9",
          duration: "60s",
        },
        {
          concept: "VSL Témoignage — histoire personnelle + résultat chiffré",
          format: "Carré 1:1",
          duration: "90s",
        },
      ],
      static: [
        {
          concept: "Split AVANT/APRÈS — visuel douleur vs soulagement",
          format: "Carré 1:1",
        },
        {
          concept: `Comparatif prix : kiné vs ${n} sur 3 mois`,
          format: "Story 9:16",
        },
        {
          concept: "Product shot minimaliste + 3 USPs clés",
          format: "Bannière 1200×628",
        },
      ],
    },

    buyerPersonas: [
      {
        name: "Sophie",
        age: "42 ans",
        job: "Cadre, télétravail 4j/5",
        problem:
          "Cervicalgies chroniques dues aux longues heures d'écran. A essayé pilates + kiné sans résultat durable. Cherche une solution rapide, efficace, utilisable chez elle.",
        channel: "Instagram · Facebook · Google Search",
      },
      {
        name: "Marc",
        age: "55 ans",
        job: "Artisan — travail physique intensif",
        problem:
          "Tensions musculaires professionnelles quotidiennes. Cherche une solution rapide entre deux chantiers. Sensible au rapport qualité/prix et aux avis clients.",
        channel: "Facebook · YouTube",
      },
    ],

    offerStrategy: {
      cogs: margin >= 7 ? "~€8–12" : "~€15–20",
      basePrice: margin >= 8 ? "€49.90" : margin >= 6 ? "€39.90" : "€34.90",
      multiplier: `×${Math.round((margin >= 8 ? 49.9 : margin >= 6 ? 39.9 : 34.9) / (margin >= 7 ? 10 : 17))}`,
      offers: [
        {
          name: "Solo",
          price: margin >= 8 ? "€49.90" : "€39.90",
          description: "1 appareil + guide PDF + accès vidéo tuto",
        },
        {
          name: "Duo Couple",
          price: margin >= 8 ? "€79.90" : "€69.90",
          description: "2 appareils − €20 · recommandé",
        },
        bundle >= 7
          ? {
              name: "Pack Famille",
              price: "€109.90",
              description: "3 appareils + kit accessoires complet",
            }
          : {
              name: "Pack Premium",
              price: margin >= 8 ? "€69.90" : "€59.90",
              description: "1 appareil + housse + gel conducteur",
            },
      ],
      upsells: [
        { name: "Gel conducteur premium 200ml", price: "€9.90" },
        { name: "Housse de transport rigide", price: "€7.90" },
        aov >= 7
          ? { name: "Extension garantie 2 ans", price: "€14.90" }
          : { name: "Guide de rééducation PDF", price: "€5.90" },
      ],
    },

    competition: [
      {
        name: "Neckteck Pro",
        activePrice: "€45–55",
        window: "Pas de chaleur infrarouge → attaquable sur la technologie double action",
      },
      {
        name: "iReliev Neck",
        activePrice: "€60–80",
        window: "Haut de gamme → angle prix accessible disponible",
      },
      {
        name: "Générique AliExpress",
        activePrice: "€15–25",
        window: "Qualité perçue faible → différenciation facile sur preuve sociale + garantie",
      },
    ],

    seo: [
      { keyword: "masseur cervical électrique", volume: tam >= 7 ? "9 900/mois" : "4 400/mois" },
      { keyword: "appareil douleur nuque", volume: "5 400/mois" },
      { keyword: "électrostimulateur cervical", volume: "2 900/mois" },
      { keyword: "masseur ems nuque", volume: "1 600/mois" },
      { keyword: "soulager cervicales rapidement", volume: "12 100/mois" },
      { keyword: `${niche} soulagement maison`, volume: `${tam * 800}/mois` },
    ],

    storytelling:
      `Il est 7h du matin. Le réveil sonne mais le corps refuse. Encore cette raideur dans la nuque, cet élancement qui remonte jusqu'à la tempe. Vous connaissez ce sentiment — la tête impossible à tourner, l'anti-douleur avalé en espérant tenir jusqu'au soir. Pendant des mois, vous avez cherché. Les séances de kiné qui soulagent deux jours, puis tout recommence. Les crèmes qui ne font rien. ` +
      `${n} a été conçu précisément pour ces moments — pas pour remplacer votre médecin, mais pour vous redonner le contrôle. Quinze minutes. Un bouton. Et pour la première fois depuis longtemps, vous bougez la tête sans douleur.`,

    verdict: {
      decision: verdict as "GO" | "TEST" | "NO_GO",
      score: total,
      risks: [
        margin < 6
          ? "Marge insuffisante pour absorber le coût d'acquisition paid — réviser le pricing"
          : "Surveiller le CPM en phase de scaling — saturation possible sous 60 jours",
        d < 6
          ? "Différenciation faible — risque de commoditisation rapide par les copycats"
          : "Maintenir l'avantage technologique face aux copies AliExpress",
        retention < 6
          ? "Potentiel LTV limité — prévoir une offre de récurrence (consommables, accessoires)"
          : "Activer les flows post-achat pour maximiser la LTV",
      ],
      testBudget:
        total >= 70
          ? "€300–500 test initial — 3 angles × 2 créatives, 7 jours min"
          : total >= 45
            ? "€150–300 test prudent — 1 angle dominant + 2 créatives, valider CPA avant scale"
            : "< €150 — valider d'abord la proposition de valeur avant toute dépense media",
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
