import Anthropic from "@anthropic-ai/sdk";

export type CompetitiveInput = {
  productName: string;
  niche: string;
  competitorName: string;
  competitorUrl?: string;
  context?: string;
};

export type CompetitiveOutput = {
  promise: string;
  angle: string;
  priceRange: string;
  offerStructure: string;
  pdpAnalysis: string;
  checkoutAnalysis: string;
  guarantee: string;
  urgencyTactic: string;
  socialProof: string;
  weaknesses: string[];
  stealItems: string[];
  adaptItems: string[];
  avoidItems: string[];
  counterItems: string[];
  notes: string;
};

export async function analyzeCompetitor(input: CompetitiveInput): Promise<CompetitiveOutput> {
  const client = new Anthropic();

  const prompt = `Tu es un expert en veille concurrentielle e-commerce et stratégie de différenciation.

Analyse ce concurrent et fournis une veille complète et actionnable.

Notre produit: ${input.productName}
Niche: ${input.niche}
Concurrent à analyser: ${input.competitorName}
${input.competitorUrl ? `URL: ${input.competitorUrl}` : ""}
${input.context ? `Contexte: ${input.context}` : ""}

Génère une analyse stratégique complète basée sur:
- Ta connaissance du marché et des patterns e-commerce dans cette niche
- Les tactiques communes des acteurs de ce secteur
- Les angles de différenciation exploitables

Sois ultra-actionnable: chaque insight doit être directement utilisable pour notre stratégie.
Pour STEAL: identifie ce qu'ils font mieux que la moyenne et qu'on doit absolument copier.
Pour ADAPT: ce qui fonctionne mais qu'on peut améliorer/adapter à notre angle.
Pour EVITER: leurs erreurs et tactiques usées qui dégradent la confiance.
Pour COUNTER: comment répondre directement à leurs avantages perçus.`;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 8192,
    thinking: { type: "adaptive" },
    tools: [
      {
        name: "analyze_competitor",
        description: "Analyse complète et actionnable d'un concurrent e-commerce",
        input_schema: {
          type: "object" as const,
          properties: {
            promise: {
              type: "string",
              description: "Promesse principale: leur core promise et value proposition centrale",
            },
            angle: {
              type: "string",
              description: "Angle marketing: l'angle narratif et émotionnel dominant dans leur communication",
            },
            priceRange: {
              type: "string",
              description: "Range de prix: fourchette de prix observée et positionnement (low/mid/premium)",
            },
            offerStructure: {
              type: "string",
              description: "Structure d'offre: bundles, upsells, cross-sells, garanties et mécanismes de conversion",
            },
            pdpAnalysis: {
              type: "string",
              description: "Analyse PDP: structure de la page produit, longueur, preuves sociales, points forts/faibles",
            },
            checkoutAnalysis: {
              type: "string",
              description: "Analyse checkout: friction, éléments de réassurance, options de paiement, abandon cart strategy",
            },
            guarantee: {
              type: "string",
              description: "Garantie utilisée: type, durée et formulation de leur garantie principale",
            },
            urgencyTactic: {
              type: "string",
              description: "Tactique d'urgence: FOMO, stock limité, timer, offre limitée - ce qu'ils utilisent",
            },
            socialProof: {
              type: "string",
              description: "Preuve sociale: type (avis, UGC, médias, influenceurs), volume et mise en valeur",
            },
            weaknesses: {
              type: "array",
              items: { type: "string" },
              description: "Failles identifiées: leurs points faibles exploitables (3-5 éléments concrets)",
            },
            stealItems: {
              type: "array",
              items: { type: "string" },
              description: "STEAL - Copier directement: ce qu'ils font mieux que la moyenne et qu'on doit adopter (3-5 éléments)",
            },
            adaptItems: {
              type: "array",
              items: { type: "string" },
              description: "ADAPTER: ce qui fonctionne chez eux mais qu'on peut améliorer ou personnaliser (3-5 éléments)",
            },
            avoidItems: {
              type: "array",
              items: { type: "string" },
              description: "ÉVITER: leurs erreurs, tactiques usées ou éléments qui nuisent à la confiance (3-5 éléments)",
            },
            counterItems: {
              type: "array",
              items: { type: "string" },
              description: "COUNTER: comment répondre directement à leurs avantages dans notre messaging (3-5 éléments)",
            },
            notes: {
              type: "string",
              description: "Notes stratégiques: insights supplémentaires, opportunités de positionnement, priorités d'action",
            },
          },
          required: [
            "promise", "angle", "priceRange", "offerStructure", "pdpAnalysis",
            "checkoutAnalysis", "guarantee", "urgencyTactic", "socialProof",
            "weaknesses", "stealItems", "adaptItems", "avoidItems", "counterItems", "notes",
          ],
        },
      },
    ],
    tool_choice: { type: "tool", name: "analyze_competitor" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("L'agent n'a pas retourné d'analyse concurrentielle structurée");
  }

  return toolUse.input as CompetitiveOutput;
}
