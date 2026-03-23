import { buildUserPrompt, generateMock, SYSTEM_PROMPTS } from "@/lib/ai-prompts";
import type { AiContext, AiModule } from "@/lib/ai-prompts";

export async function POST(request: Request) {
  let module: AiModule;
  let context: AiContext;

  try {
    const body = await request.json();
    module = body.module as AiModule;
    context = body.context as AiContext;

    if (!module || !context?.productName || !context?.niche) {
      return Response.json({ error: "module, context.productName et context.niche sont requis" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback mock si pas de clé API
  if (!apiKey || apiKey.startsWith("sk-xxx")) {
    return Response.json(generateMock(module, context));
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[module] },
          { role: "user", content: buildUserPrompt(module, context) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // Si clé invalide ou quota dépassé → fallback mock
      if (res.status === 401 || res.status === 429) {
        return Response.json(generateMock(module, context));
      }
      return Response.json({ error: `OpenAI error ${res.status}`, detail: err }, { status: 502 });
    }

    const data = await res.json();
    const content = JSON.parse(data.choices[0].message.content);
    return Response.json(content);
  } catch (e) {
    // Réseau ou parse error → fallback mock
    console.error("[ai-generate] fallback mock:", e);
    return Response.json(generateMock(module, context));
  }
}
