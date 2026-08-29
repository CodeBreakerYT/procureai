import { NextResponse } from "next/server";
import { getGroqClient, MODEL } from "@/lib/groq";
import { getRequirements, getVendors } from "@/lib/server-store";
import { getMockChatResponse } from "@/lib/mock-data";

export async function POST(request: Request) {
  const { projectId, message } = (await request.json()) as { projectId?: string; message: string };

  const client = getGroqClient();
  if (!client || !projectId) {
    return NextResponse.json({ reply: getMockChatResponse(message) });
  }

  const vendors = getVendors(projectId).filter((v) => v.status === "analyzed");
  const requirements = getRequirements(projectId);

  if (vendors.length === 0) {
    return NextResponse.json({ reply: getMockChatResponse(message) });
  }

  const context = vendors
    .map((v) => {
      const price = v.priceDisclosed ? `₹${v.price.toLocaleString("en-IN")}` : "not disclosed";
      const sla = v.slaDisclosed ? `${v.sla}%` : "not disclosed";
      return (
        `${v.name}: AI score ${v.aiScore}/100, price ${price}, SLA ${sla}, ` +
        `implementation ${v.implementationWeeks} weeks, requirement match ${v.requirementMatchPct}%, ` +
        `support "${v.support}", risks: ${v.risks.map((r) => `${r.title} (${r.level})`).join("; ") || "none"}`
      );
    })
    .join("\n");

  const requirementLines = requirements.map((r) => `- ${r.label} (${r.priority})`).join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are NOVA, ProcureAI's procurement assistant. Answer the user's question about their vendors " +
            "using ONLY the data provided below. Be concise (2-4 sentences), specific, and cite numbers when relevant. " +
            "Never invent figures that aren't in the provided data.\n\n" +
            `Project requirements:\n${requirementLines}\n\nAnalyzed vendors:\n${context}`,
        },
        { role: "user", content: message },
      ],
    });

    const text = completion.choices[0]?.message?.content;
    return NextResponse.json({ reply: text?.trim() || getMockChatResponse(message) });
  } catch (err) {
    console.error("[chat] request failed", err);
    return NextResponse.json({ reply: getMockChatResponse(message) });
  }
}
