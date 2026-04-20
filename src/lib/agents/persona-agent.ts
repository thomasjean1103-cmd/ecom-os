import Anthropic from "@anthropic-ai/sdk";

export type PersonaInput = {
  productName: string;
  niche: string;
  context?: string;
};

export type PersonaOutput = {
  identity: string;
  currentSituation: string;
  mainPain: string;
  failedSolutions: string[];
  beliefs: string[];
  hiddenDesire: string;
  buyingMoment: string;
  copyTriggers: string[];
  trustTriggers: string[];
  resistanceTriggers: string[];
  tofMessage: string;
  mofMessage: string;
  bofMessage: string;
  hottestMoment: string;
  whyHotThen: string;
  bestAngleForMoment: string;
};

export async function generatePersona(input: PersonaInput): Promise<PersonaOutput> {
  const client = new Anthropic();

  const prompt = `Tu es un expert en stratégie e-commerce, psychologie du consommateur et copywriting de direct response.

Génère un persona client ultra-spécifique et actionnable pour ce produit:

Produit: ${input.productName}
Niche: ${input.niche}
${input.context ? `Contexte additionnel: ${input.context}` : ""}

Crée un persona réaliste et utilisable directement pour créer des publicités, du copy et des tunnels de vente.
Sois ultra-concret: donne des détails réels (noms, âges précis, situations vécues, phrases exactes que le client dirait).
Les triggers doivent être des angles copy actionnables, pas des généralités.
Les messages TOF/MOF/BOF doivent être des accroches réelles utilisables en pub.`;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 8192,
    thinking: { type: "adaptive" },
    tools: [
      {
        name: "create_persona",
        description: "Crée un persona client complet et actionnable",
        input_schema: {
          type: "object" as const,
          properties: {
            identity: {
              type: "string",
              description: "Identité détaillée: âge, genre, situation familiale, profession, revenus, localisation",
            },
            currentSituation: {
              type: "string",
              description: "Situation actuelle détaillée: ce qu'il vit au quotidien, son problème concret",
            },
            mainPain: {
              type: "string",
              description: "Douleur principale: la frustration #1 qui le pousse à chercher une solution",
            },
            failedSolutions: {
              type: "array",
              items: { type: "string" },
              description: "Liste des solutions qu'il a déjà essayées et qui ont échoué (3-5 exemples concrets)",
            },
            beliefs: {
              type: "array",
              items: { type: "string" },
              description: "Croyances limitantes et convictions profondes (3-5 phrases qu'il dirait lui-même)",
            },
            hiddenDesire: {
              type: "string",
              description: "Désir profond caché: ce qu'il veut vraiment au fond de lui (pas ce qu'il dit)",
            },
            buyingMoment: {
              type: "string",
              description: "Moment d'achat: quand et dans quelle situation il est prêt à acheter",
            },
            copyTriggers: {
              type: "array",
              items: { type: "string" },
              description: "Triggers copy: angles et formulations qui déclenchent l'action (3-5 exemples)",
            },
            trustTriggers: {
              type: "array",
              items: { type: "string" },
              description: "Triggers de confiance: ce qui le rassure et valide sa décision (3-5 exemples)",
            },
            resistanceTriggers: {
              type: "array",
              items: { type: "string" },
              description: "Triggers de résistance: ses objections principales et freins à l'achat (3-5 exemples)",
            },
            tofMessage: {
              type: "string",
              description: "Message TOF (Top of Funnel): accroche froide pour audience qui ne connaît pas le produit",
            },
            mofMessage: {
              type: "string",
              description: "Message MOF (Middle of Funnel): message pour audience qui a interagi mais n'a pas acheté",
            },
            bofMessage: {
              type: "string",
              description: "Message BOF (Bottom of Funnel): message de conversion pour audience chaude/abandonneurs",
            },
            hottestMoment: {
              type: "string",
              description: "Moment le plus chaud: le contexte précis où il est le plus susceptible d'acheter",
            },
            whyHotThen: {
              type: "string",
              description: "Pourquoi à ce moment: explication psychologique de pourquoi il est chaud à ce moment",
            },
            bestAngleForMoment: {
              type: "string",
              description: "Meilleur angle pour ce moment: l'approche copy/créative optimale pour ce contexte",
            },
          },
          required: [
            "identity", "currentSituation", "mainPain", "failedSolutions",
            "beliefs", "hiddenDesire", "buyingMoment", "copyTriggers",
            "trustTriggers", "resistanceTriggers", "tofMessage", "mofMessage",
            "bofMessage", "hottestMoment", "whyHotThen", "bestAngleForMoment",
          ],
        },
      },
    ],
    tool_choice: { type: "tool", name: "create_persona" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("L'agent n'a pas retourné de persona structuré");
  }

  return toolUse.input as PersonaOutput;
}
