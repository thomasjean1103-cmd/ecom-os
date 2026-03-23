// ─── Shared context ───────────────────────────────────────────────────────────

export type AiContext = {
  productName: string;
  niche: string;
  description?: string;
  price?: string;
  testBudget?: string;
};

export type AiModule = "avatar" | "market" | "voc" | "competitor";

// ─── Avatar Studio types ──────────────────────────────────────────────────────

export type AiPersona = {
  name: string;
  age: string;
  job: string;
  location: string;
  income: string;
  situation: string;
  mainPain: string;
  hiddenDesire: string;
  fears: string[];
  objections: string[];
  failedSolutions: string[];
  channels: string[];
  verbatims: string[];
  buyingMoment: string;
  copyTriggers: string[];
  tofMessage: string;
  mofMessage: string;
  bofMessage: string;
};

export type AvatarOutput = { personas: [AiPersona, AiPersona] };

// ─── Market Intel types ───────────────────────────────────────────────────────

export type AiSeasonality = { month: string; index: number; note: string };
export type AiGeo = { country: string; potential: "FORT" | "MOYEN" | "FAIBLE"; note: string };

export type MarketOutput = {
  tam: string;
  sam: string;
  som: string;
  trends: string[];
  seasonality: AiSeasonality[];
  geos: AiGeo[];
  demographics: { ageRanges: string[]; gender: string; income: string; psychographics: string[] };
  window: string;
  opportunities: string[];
  risks: string[];
};

// ─── VOC Vault types ──────────────────────────────────────────────────────────

export type AiVerbatim = {
  quote: string;
  type: "pain" | "desire" | "fear" | "objection" | "frustration";
  emotionalIntensity: number;
  purchaseProximity: number;
};

export type VocOutput = {
  verbatims: AiVerbatim[];
  emotionalWords: string[];
  copyFormulas: Array<{ formula: string; usage: string }>;
  objections: Array<{ objection: string; response: string }>;
};

// ─── Competitor Board types ───────────────────────────────────────────────────

export type AiCompetitor = {
  name: string;
  priceRange: string;
  promise: string;
  angle: string;
  strengths: string[];
  weaknesses: string[];
  guarantee: string;
  urgencyTactic: string;
  socialProof: string;
  steal: string[];
  adapt: string[];
  avoid: string[];
  counter: string[];
};

export type CompetitorOutput = {
  competitors: [AiCompetitor, AiCompetitor, AiCompetitor];
  uniqueAngles: string[];
  matrix: { steal: string[]; adapt: string[]; avoid: string[]; counter: string[] };
};

export type AiOutput = AvatarOutput | MarketOutput | VocOutput | CompetitorOutput;

// ─── System prompts ───────────────────────────────────────────────────────────

export const SYSTEM_PROMPTS: Record<AiModule, string> = {
  avatar: `Tu es un expert en marketing e-commerce, psychologie comportementale et copywriting persuasif. Tu génères des buyer personas ultra-réalistes pour des boutiques e-commerce francophones. Réponds TOUJOURS en JSON valide uniquement, sans markdown ni texte autour.`,

  market: `Tu es un analyste de marché senior spécialisé en e-commerce D2C. Tu produis des analyses de marché réalistes et exploitables pour le marché français/francophone. Tes chiffres sont contextualisés et crédibles. Réponds TOUJOURS en JSON valide uniquement, sans markdown ni texte autour.`,

  voc: `Tu es un expert en copywriting e-commerce et psychologie du consommateur. Tu génères des verbatims clients authentiques, des mots émotionnels puissants et des formules copy prêtes à l'emploi. Ton style est direct, émotionnel et persuasif. Réponds TOUJOURS en JSON valide uniquement, sans markdown ni texte autour.`,

  competitor: `Tu es un analyste concurrentiel expert en e-commerce et publicité digitale. Tu analyses les concurrents pour identifier leurs forces, faiblesses et comment les battre. Tu fournis des recommandations tactiques concrètes. Réponds TOUJOURS en JSON valide uniquement, sans markdown ni texte autour.`,
};

// ─── User prompt builders ─────────────────────────────────────────────────────

export function buildUserPrompt(module: AiModule, ctx: AiContext): string {
  const base = `Produit: "${ctx.productName}" | Niche: "${ctx.niche}"${ctx.description ? ` | Description: "${ctx.description}"` : ""}`;

  switch (module) {
    case "avatar":
      return `${base}

Génère 2 buyer personas détaillés et distincts. Réponds avec ce JSON exact:
{"personas":[{"name":"Prénom","age":"35-45 ans","job":"Métier précis","location":"Ville","income":"Revenu mensuel net","situation":"Situation de vie 2-3 phrases","mainPain":"Douleur principale 1 phrase forte","hiddenDesire":"Désir profond non avoué","fears":["peur1","peur2","peur3"],"objections":["objection1","objection2","objection3"],"failedSolutions":["solution ratée1","solution ratée2"],"channels":["Instagram","Facebook"],"verbatims":["citation authentique1","citation2","citation3"],"buyingMoment":"Moment déclencheur d'achat","copyTriggers":["trigger1","trigger2","trigger3"],"tofMessage":"Message TOF accrocheur","mofMessage":"Message MOF preuve","bofMessage":"Message BOF urgence CTA"}]}
Les 2 personas doivent être très différents (âge, job, situation, motivation).`;

    case "market":
      return `${base}${ctx.testBudget ? ` | Budget test: "${ctx.testBudget}"` : ""}

Génère une analyse de marché complète. Réponds avec ce JSON exact:
{"tam":"Marché mondial ex: $8.2B","sam":"France+francophone ex: €420M","som":"Part réaliste an1 ex: €85K-250K","trends":["tendance1","tendance2","tendance3","tendance4"],"seasonality":[{"month":"Jan","index":5,"note":"note"},{"month":"Fév","index":6,"note":"note"},{"month":"Mar","index":7,"note":"note"},{"month":"Avr","index":8,"note":"note"},{"month":"Mai","index":7,"note":"note"},{"month":"Jun","index":6,"note":"note"},{"month":"Jul","index":5,"note":"note"},{"month":"Aoû","index":5,"note":"note"},{"month":"Sep","index":7,"note":"note"},{"month":"Oct","index":8,"note":"note"},{"month":"Nov","index":10,"note":"note"},{"month":"Déc","index":9,"note":"note"}],"geos":[{"country":"France","potential":"FORT","note":"raison"},{"country":"Belgique","potential":"MOYEN","note":"raison"},{"country":"Suisse","potential":"FORT","note":"raison"},{"country":"Canada QC","potential":"MOYEN","note":"raison"}],"demographics":{"ageRanges":["35-45 ans (primary)","25-35 ans (secondary)"],"gender":"Femmes 65% / Hommes 35%","income":"2500-4500€/mois","psychographics":["trait1","trait2","trait3"]},"window":"Description fenêtre opportunité","opportunities":["opportunité1","opportunité2","opportunité3"],"risks":["risque1","risque2","risque3"]}`;

    case "voc":
      return `${base}

Génère 10 verbatims clients + mots émotionnels + formules copy. Réponds avec ce JSON exact:
{"verbatims":[{"quote":"Citation authentique spécifique","type":"pain","emotionalIntensity":4,"purchaseProximity":5}],"emotionalWords":["mot1","mot2","mot3","mot4","mot5","mot6","mot7","mot8"],"copyFormulas":[{"formula":"Formule copy prête à l'emploi","usage":"hook"},{"formula":"Formule2","usage":"pdp"},{"formula":"Formule3","usage":"email"},{"formula":"Formule4","usage":"ad"},{"formula":"Formule5","usage":"objection"}],"objections":[{"objection":"Objection1","response":"Réponse persuasive1"},{"objection":"Objection2","response":"Réponse2"},{"objection":"Objection3","response":"Réponse3"},{"objection":"Objection4","response":"Réponse4"}]}
Génère exactement 10 verbatims, mix de types: pain(4), desire(3), fear(1), objection(1), frustration(1).`;

    case "competitor":
      return `${base}${ctx.price ? ` | Notre prix cible: "${ctx.price}"` : ""}

Génère l'analyse de 3 concurrents réalistes. Réponds avec ce JSON exact:
{"competitors":[{"name":"Nom marque","priceRange":"€XX-XX","promise":"Promesse principale","angle":"Angle marketing","strengths":["force1","force2","force3"],"weaknesses":["faiblesse1","faiblesse2","faiblesse3"],"guarantee":"Garantie","urgencyTactic":"Tactique urgence","socialProof":"Type+volume preuve","steal":["élément à copier1","élément2"],"adapt":["à adapter1","à adapter2"],"avoid":["erreur à éviter1","erreur2"],"counter":["contre-attaque1","contre-attaque2"]}],"uniqueAngles":["angle unique1","angle unique2","angle unique3"],"matrix":{"steal":["best practice cross-concurrents1","2"],"adapt":["adaptation1","2"],"avoid":["écueil1","2"],"counter":["stratégie counter1","2"]}}
Les 3 concurrents doivent avoir des niveaux de gamme différents (low-cost, mid, premium).`;
  }
}

// ─── Mock data generators (fallback sans clé API) ─────────────────────────────

export function generateMock(module: AiModule, ctx: AiContext): AiOutput {
  const n = ctx.productName;
  const niche = ctx.niche;

  switch (module) {
    case "avatar":
      return {
        personas: [
          {
            name: "Sophie",
            age: "38-48 ans",
            job: "Cadre marketing, télétravail 4j/5",
            location: "Paris 15e / banlieue ouest",
            income: "3 200–4 500 €/mois net",
            situation: `Sophie est cadre dans une entreprise tech. Elle passe 9h/jour devant son écran et souffre de douleurs chroniques liées à ${niche}. Elle a deux enfants, peu de temps pour elle, et cherche des solutions rapides et efficaces.`,
            mainPain: `Douleurs persistantes liées à ${niche} qui impactent sa productivité et sa qualité de vie.`,
            hiddenDesire: "Retrouver la vitalité et l'énergie de ses 30 ans sans changer radicalement son mode de vie.",
            fears: ["Que ça ne marche pas comme les autres solutions", "Perdre du temps et de l'argent", "Que ses proches pensent qu'elle se fait avoir"],
            objections: ["\"C'est trop cher pour un truc en ligne\"", "\"J'ai déjà essayé des trucs similaires\"", "\"Je n'ai pas le temps de m'en occuper\""],
            failedSolutions: [`Coaching ${niche} abandonné après 3 séances`, "Applications mobile non utilisées après 1 semaine"],
            channels: ["Instagram", "Pinterest", "Google Search", "YouTube"],
            verbatims: [
              `"J'ai essayé tellement de choses pour ${niche}, rien ne tient dans la durée."`,
              `"Ce que je veux c'est quelque chose de simple qui s'intègre à ma vie."`,
              `"Si ça pouvait m'enlever juste cette douleur quotidienne, ce serait déjà énorme."`,
            ],
            buyingMoment: "Le soir après une journée difficile, seule devant son téléphone vers 21h-22h.",
            copyTriggers: ["Résultats rapides et visibles", "Simple à intégrer", "Approuvé par des experts"],
            tofMessage: `"Et si ${n} vous rendait la vie plus légère en 15 minutes par jour ?"`,
            mofMessage: `"4 700 femmes comme vous ont transformé leur rapport à ${niche} avec ${n}."`,
            bofMessage: `"Essayez ${n} 30 jours — satisfaite ou remboursée, sans question."`,
          },
          {
            name: "Marc",
            age: "50-62 ans",
            job: "Chef d'entreprise artisanal / gérant PME",
            location: "Ville moyenne, France",
            income: "4 000–6 000 €/mois",
            situation: `Marc dirige une PME de 8 personnes. Il travaille debout ou en déplacement, supporte des tensions physiques liées à ${niche} depuis des années. Pragmatique et sceptique, il achète uniquement si c'est prouvé.`,
            mainPain: `Douleurs chroniques liées à ${niche} qui limitent son efficacité professionnelle et l'empêchent de profiter de ses weekends.`,
            hiddenDesire: "Retrouver l'énergie et la mobilité pour continuer à diriger sans se sentir vieillir.",
            fears: ["Se faire arnaquer en ligne", "Produit inutile qui prend la poussière", "Jugement des employés s'ils voient ça"],
            objections: ["\"Je préfère voir un vrai médecin\"", "\"Est-ce que c'est vraiment validé ?\"", "\"Mon temps est précieux, si ça prend trop de temps non\""],
            failedSolutions: ["Kiné régulier — coûteux et pas toujours disponible", `Médicaments anti-douleur — effets secondaires`],
            channels: ["Facebook", "YouTube", "Google", "Bouche-à-oreille"],
            verbatims: [
              `"J'ai pas le temps pour les solutions compliquées, il me faut quelque chose d'efficace."`,
              `"Si ça marche vraiment, je suis preneur. Mais faut me le prouver."`,
              `"Les douleurs liées à ${niche}, ça ruine mes weekends depuis 5 ans."`,
            ],
            buyingMoment: "Le samedi matin en lisant les actualités, après une semaine difficile.",
            copyTriggers: ["Preuve concrète (chiffres, études)", "Gain de temps mesurable", "Rapport qualité/prix démontré"],
            tofMessage: `"${n} : la solution que les professionnels utilisent pour rester au top sans perdre de temps."`,
            mofMessage: `"Validé par 10 000+ utilisateurs. ROI constaté dès la 1ère semaine."`,
            bofMessage: `"Commandez maintenant — livraison 48h et garantie 30 jours satisfait ou remboursé."`,
          },
        ],
      } as AvatarOutput;

    case "market":
      return {
        tam: `$${Math.round(Math.random() * 5 + 3)}.${Math.round(Math.random() * 9)}B mondial`,
        sam: `€${Math.round(Math.random() * 200 + 300)}M France + francophonie`,
        som: `€${Math.round(Math.random() * 100 + 80)}K–€${Math.round(Math.random() * 200 + 200)}K réaliste an 1`,
        trends: [
          `Demande +${Math.round(Math.random() * 30 + 20)}% sur 24 mois dans ${niche}`,
          "Montée du D2C — les consommateurs contournent la grande distribution",
          "Contenu UGC et reviews = principal driver de décision d'achat",
          `Saisonnalité marquée avec pic fort sur ${niche} en nov-déc`,
        ],
        seasonality: [
          { month: "Jan", index: 5, note: "Résolutions nouvel an" },
          { month: "Fév", index: 5, note: "Faible" },
          { month: "Mar", index: 6, note: "Printemps — légère reprise" },
          { month: "Avr", index: 7, note: "Tendance hausse" },
          { month: "Mai", index: 7, note: "Stable" },
          { month: "Jun", index: 6, note: "Légère baisse" },
          { month: "Jul", index: 5, note: "Vacances" },
          { month: "Aoû", index: 4, note: "Creux estival" },
          { month: "Sep", index: 7, note: "Rentrée — forte reprise" },
          { month: "Oct", index: 8, note: "Accélération" },
          { month: "Nov", index: 10, note: "Black Friday — pic absolu" },
          { month: "Déc", index: 9, note: "Fêtes — forte demande" },
        ],
        geos: [
          { country: "France", potential: "FORT", note: "Marché principal, fort pouvoir d'achat, logistique maîtrisée" },
          { country: "Belgique", potential: "MOYEN", note: "Marché francophone accessible, CPM plus faible" },
          { country: "Suisse", potential: "FORT", note: "Pouvoir d'achat élevé, AOV naturellement plus fort" },
          { country: "Canada QC", potential: "MOYEN", note: "Francophone, marché en croissance, délais logistique" },
        ],
        demographics: {
          ageRanges: ["35-50 ans (primary — 58%)", "25-35 ans (secondary — 28%)", "50-65 ans (tertiary — 14%)"],
          gender: "Femmes 62% / Hommes 38%",
          income: "Classe moyenne à supérieure, 2 500–5 000€/mois net",
          psychographics: [
            "Orienté solutions, pragmatique, peu de temps disponible",
            "Sensible à la preuve sociale et aux avis clients vérifiés",
            `Frustré par l'échec des solutions précédentes dans ${niche}`,
          ],
        },
        window: `Marché ${niche} encore en phase de croissance active — les acteurs dominants n'ont pas encore saturé l'espace publicitaire. Fenêtre d'entrée estimée à 6-12 mois avant commoditisation.`,
        opportunities: [
          "CPM encore bas sur Meta — saturation pas encore atteinte",
          `Contenu éducatif sur ${niche} quasi inexistant = SEO facile`,
          "Marché B2C peu différencié — angle expérience et garantie créent une rupture immédiate",
        ],
        risks: [
          "Copycats rapides si le produit cartonne — nécessite brand building dès j1",
          "Dépendance aux algorithmes Meta — diversifier trafic sous 90 jours",
          `Saisonnalité ${niche} — anticiper creux estival avec offres spéciales`,
        ],
      } as MarketOutput;

    case "voc":
      return {
        verbatims: [
          { quote: `"J'avais essayé tellement de choses pour ${niche}… ${n} est la première solution qui a vraiment marché pour moi."`, type: "desire", emotionalIntensity: 5, purchaseProximity: 5 },
          { quote: `"Honnêtement je l'ai commandé en me disant que ça ne marcherait pas non plus. Quelle surprise."`, type: "desire", emotionalIntensity: 4, purchaseProximity: 5 },
          { quote: `"Je souffre de ${niche} depuis 3 ans. C'est la première semaine sans douleur."`, type: "pain", emotionalIntensity: 5, purchaseProximity: 5 },
          { quote: `"Le pire c'est que je savais que j'avais ce problème depuis longtemps et je ne faisais rien."`, type: "frustration", emotionalIntensity: 4, purchaseProximity: 3 },
          { quote: `"J'avais peur que ce soit compliqué à utiliser. Finalement c'est hyper simple."`, type: "fear", emotionalIntensity: 3, purchaseProximity: 4 },
          { quote: `"Ça fait des années que je cherche une solution à ${niche} qui s'intègre à ma vie sans effort."`, type: "pain", emotionalIntensity: 4, purchaseProximity: 4 },
          { quote: `"Le rapport qualité-prix est imbattable comparé aux alternatives que j'avais testées."`, type: "desire", emotionalIntensity: 3, purchaseProximity: 5 },
          { quote: `"J'aurais dû faire ça bien plus tôt. Des années à souffrir inutilement."`, type: "pain", emotionalIntensity: 5, purchaseProximity: 4 },
          { quote: `"Est-ce que c'est vraiment validé scientifiquement ? C'est ma seule question."`, type: "objection", emotionalIntensity: 3, purchaseProximity: 4 },
          { quote: `"Ce que j'aime c'est que je n'ai plus à dépendre de rendez-vous ou d'autres personnes pour gérer ça."`, type: "desire", emotionalIntensity: 4, purchaseProximity: 5 },
        ],
        emotionalWords: ["libération", "enfin", "soulagement", "contrôle", "résultats", "simple", "efficace", "confiance"],
        copyFormulas: [
          { formula: `"Enfin une solution qui s'attaque vraiment à ${niche} — pas juste un masque."`, usage: "hook" },
          { formula: `"10 000 personnes ont arrêté de souffrir. C'est peut-être votre tour."`, usage: "ad" },
          { formula: `"Si vous avez essayé autre chose et ça n'a pas marché, voici pourquoi ${n} est différent."`, usage: "pdp" },
          { formula: `"En 15 minutes par jour, vous pouvez reprendre le contrôle sur ${niche}."`, usage: "email" },
          { formula: `"Nous comprenons votre scepticisme. C'est pourquoi nous offrons 30 jours satisfait ou remboursé."`, usage: "objection" },
        ],
        objections: [
          { objection: "\"C'est trop cher\"", response: `Comparez au coût de ne rien faire — en consultations, médicaments, journées perdues. ${n} se rentabilise en moins d'un mois.` },
          { objection: "\"Ça va vraiment marcher pour moi ?\"", response: `80% de nos clients constatent une amélioration sous 7 jours. Et si ce n'est pas votre cas, remboursement intégral sous 30 jours — sans question.` },
          { objection: "\"J'ai déjà essayé des trucs similaires\"", response: `${n} utilise une approche différente des solutions classiques — c'est exactement pour les personnes comme vous, qui ont tout essayé sans résultat durable.` },
          { objection: "\"Je vais y réfléchir\"", response: `Chaque jour sans agir, le problème s'aggrave. Nos clients qui ont attendu disent tous : "J'aurais dû le faire bien plus tôt."` },
        ],
      } as VocOutput;

    case "competitor":
      return {
        competitors: [
          {
            name: `${niche.slice(0, 4).toUpperCase()}Pro`,
            priceRange: "€15–25",
            promise: "Le plus accessible du marché",
            angle: "Prix bas / volume",
            strengths: ["Prix imbattable", "Large disponibilité Amazon", "Notoriété par volume"],
            weaknesses: ["Qualité perçue faible", "SAV inexistant", "Aucune différenciation", "Copy générique"],
            guarantee: "Retour Amazon 30J",
            urgencyTactic: "Stock limité (faux)",
            socialProof: "4.1★ sur 200 avis Amazon génériques",
            steal: ["Présence Amazon", "Prix d'appel"],
            adapt: ["Volume d'avis — générer des vraies reviews rapidement"],
            avoid: ["Copy générique sans émotion", "Photos produit sans contexte"],
            counter: ["Attaquer sur la qualité et la garantie", "Storytelling vs produit sans âme"],
          },
          {
            name: `Flex${niche.slice(0, 5)}`,
            priceRange: "€35–55",
            promise: "La solution complète pour les actifs",
            angle: "Performance + lifestyle",
            strengths: ["Bon branding", "Présence Instagram forte", "UGC efficace"],
            weaknesses: ["Prix sans justification claire", "Pas de garantie solide", "Objections non traitées"],
            guarantee: "14J uniquement",
            urgencyTactic: "Édition limitée saisonnière",
            socialProof: "15K abonnés Instagram, 4.6★ sur 500 avis",
            steal: ["Style visuel Instagram", "Format UGC stories", "Positionnement lifestyle"],
            adapt: ["Durée garantie (14J → 30J) = avantage immédiat", "Traiter les objections qu'ils ignorent"],
            avoid: ["Édition limitée artificielle — perd en crédibilité"],
            counter: ["Garantie plus longue", "Copy plus émotionnelle et spécifique"],
          },
          {
            name: `Prestige${niche.slice(0, 3).toUpperCase()}`,
            priceRange: "€80–120",
            promise: "La référence premium du marché",
            angle: "Autorité médicale / premium",
            strengths: ["Positionnement expert crédible", "Prix premium = valeur perçue haute", "Partenariats avec professionnels"],
            weaknesses: ["Prix excluant 70% du marché", "Peu de preuve sociale UGC", "Tunnel d'achat long"],
            guarantee: "60J mais processus complexe",
            urgencyTactic: "Pré-commandes / waitlists",
            socialProof: "Certifications médicales, 50+ témoignages experts",
            steal: ["Angle autorité médicale", "Format testimonial expert", "Certifications"],
            adapt: ["Autorité sans le prix premium — accessible + crédible"],
            avoid: ["Tunnel trop complexe", "Jargon médical trop dense"],
            counter: ["Même crédibilité, prix 2× plus accessible, garantie meilleure"],
          },
        ],
        uniqueAngles: [
          `Angle "résultats en 15 minutes" — aucun concurrent ne le promet avec preuve`,
          `Angle "économie vs kiné/médecin" — calcul ROI concret non exploité`,
          `Angle "autonomie totale" — ne plus dépendre de rendez-vous ou de prescriptions`,
        ],
        matrix: {
          steal: ["Présence Amazon des low-cost", "Lifestyle visuel du mid-market", "Autorité médicale du premium"],
          adapt: ["Garantie 30J minimum (vs 14J concurrents)", "UGC + experts = combo non utilisé", "Prix accessible + positionnement crédible"],
          avoid: ["Fausse urgence détectable", "Copy générique sans émotion", "Tunnel d'achat trop long"],
          counter: ["Garantie la plus longue du marché", "Ratio prix/qualité le plus fort", "SAV humain vs bots concurrents"],
        },
      } as CompetitorOutput;
  }
}
