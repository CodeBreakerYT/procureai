import { getGroqClient, MODEL } from "./groq";
import type { Vendor } from "./types";

/**
 * Generates NOVA's explanation text for the recommendation screen. The
 * recommendation itself (which vendor wins) is already decided by
 * deterministic scoring (scoring.ts) — this call only writes the narrative,
 * and is fed the real computed numbers so it can't contradict them.
 */
export async function generateRecommendationNarrative(top: Vendor, others: Vendor[]): Promise<string> {
  const client = getGroqClient();
  if (!client) {
    return top.summary || fallbackNarrative(top);
  }

  const priceLine = (v: Vendor) => (v.priceDisclosed ? `₹${v.price.toLocaleString("en-IN")}` : "not disclosed");
  const slaLine = (v: Vendor) => (v.slaDisclosed ? `${v.sla}%` : "not disclosed");

  const comparisonLines = others
    .map((v) => `- ${v.name}: AI score ${v.aiScore}, price ${priceLine(v)}, SLA ${slaLine(v)}, match ${v.requirementMatchPct}%`)
    .join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "You are NOVA, ProcureAI's procurement assistant. Write a short, confident 2-3 sentence explanation " +
            "of a vendor recommendation for a procurement team. Use only the numbers given to you — never invent " +
            "figures. Respond with plain text only, no markdown, no preamble.",
        },
        {
          role: "user",
          content:
            `Recommended vendor: ${top.name}\n` +
            `AI score: ${top.aiScore}/100\n` +
            `Requirement match: ${top.requirementMatchPct}%\n` +
            `Price: ${priceLine(top)}\n` +
            `SLA: ${slaLine(top)}\n` +
            `Implementation: ${top.implementationWeeks} weeks\n` +
            `Strengths: ${top.strengths.join("; ")}\n` +
            `Risks: ${top.risks.map((r) => r.title).join("; ")}\n\n` +
            `Other vendors considered:\n${comparisonLines || "(none)"}\n\n` +
            `Write the recommendation narrative.`,
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() || fallbackNarrative(top);
  } catch (err) {
    console.error("[recommendation] narrative generation failed", err);
    return fallbackNarrative(top);
  }
}

function fallbackNarrative(top: Vendor): string {
  return `${top.name} provides the strongest overall match against the defined requirements while maintaining competitive pricing and implementation time.`;
}
