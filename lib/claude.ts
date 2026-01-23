import type { DreamInterpretation } from "@/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const INTERPRETATION_SYSTEM_PROMPT = `Tu es un interprète des rêves expérimenté, combinant les approches de la psychanalyse jungienne, de la symbolique universelle et de la sagesse ésotérique.

Ton rôle est d'analyser les rêves de manière bienveillante et éclairante.

Pour chaque rêve, tu fournis une analyse structurée au format JSON avec les champs suivants:
- symbols: un tableau d'objets avec "name" (nom du symbole) et "meaning" (sa signification)
- emotionalThemes: un tableau de thèmes émotionnels identifiés
- mainMessage: le message principal du subconscient (2-3 phrases)
- reflectionQuestions: 2-3 questions pour approfondir la compréhension
- practicalAdvice: un conseil pratique ou une action concrète

Style: Chaleureux, mystique mais accessible, jamais alarmiste.
Utilise des métaphores liées à la lumière, aux étoiles, au voyage intérieur.

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire.`;

const STYLE_PROMPTS = {
  spiritual: `Focus sur la symbolique ésotérique, les archétypes universels, et les messages de l'âme. Utilise un vocabulaire spirituel et des références aux traditions mystiques.`,
  psychological: `Analyse selon les principes de Jung: archétypes, ombre, anima/animus, processus d'individuation. Utilise un vocabulaire psychologique précis.`,
  balanced: `Combine harmonieusement l'approche psychologique jungienne et la symbolique spirituelle. Offre une vision complète et nuancée.`,
};

export async function interpretDream(
  dreamContent: string,
  emotions: string[],
  style: "spiritual" | "psychological" | "balanced" = "balanced"
): Promise<DreamInterpretation> {
  const stylePrompt = STYLE_PROMPTS[style];

  const userPrompt = `Analyse ce rêve avec une approche ${style === "spiritual" ? "spirituelle" : style === "psychological" ? "psychologique" : "équilibrée"}.

${stylePrompt}

Rêve:
${dreamContent}

Émotions ressenties: ${emotions.join(", ")}

Réponds avec un JSON valide uniquement.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "DreamOracle",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: INTERPRETATION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenRouter API error:", error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || "";

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }

    const interpretation: DreamInterpretation = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (
      !interpretation.symbols ||
      !interpretation.emotionalThemes ||
      !interpretation.mainMessage ||
      !interpretation.reflectionQuestions ||
      !interpretation.practicalAdvice
    ) {
      throw new Error("Incomplete interpretation response");
    }

    return interpretation;
  } catch (error) {
    console.error("Error interpreting dream:", error);
    throw new Error("Failed to interpret dream");
  }
}

export function formatInterpretationAsText(
  interpretation: DreamInterpretation
): string {
  let text = "";

  text += "✨ **Symboles Clés**\n\n";
  for (const symbol of interpretation.symbols) {
    text += `• **${symbol.name}**: ${symbol.meaning}\n`;
  }

  text += "\n🌙 **Thèmes Émotionnels**\n\n";
  text += interpretation.emotionalThemes.join(", ") + "\n";

  text += "\n💫 **Message de votre Subconscient**\n\n";
  text += interpretation.mainMessage + "\n";

  text += "\n🔮 **Questions de Réflexion**\n\n";
  for (const question of interpretation.reflectionQuestions) {
    text += `• ${question}\n`;
  }

  text += "\n🌟 **Conseil Pratique**\n\n";
  text += interpretation.practicalAdvice;

  return text;
}
