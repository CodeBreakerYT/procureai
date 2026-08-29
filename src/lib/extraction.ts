import { z } from "zod";
import mammoth from "mammoth";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import type Groq from "groq-sdk";
import { getGroqClient, MODEL } from "./groq";
import {
  computeAiScore,
  computePriceScore,
  computeRequirementMatchPct,
  computeRiskScore,
  computeSupportScore,
  computeTechnicalScore,
} from "./scoring";
import type { Requirement, RequirementStatus, RiskItem, Vendor } from "./types";

const ExtractionSchema = z.object({
  vendorName: z.string(),
  price: z.number(),
  priceDisclosed: z.boolean(),
  sla: z.number(),
  slaDisclosed: z.boolean(),
  implementationWeeks: z.number(),
  support: z.string(),
  apiSupport: z.boolean(),
  security: z.string(),
  requirementAssessments: z.array(
    z.object({
      requirementLabel: z.string(),
      status: z.enum(["met", "partial", "unmet"]),
      evidence: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  risks: z.array(
    z.object({
      level: z.enum(["high", "medium", "low"]),
      title: z.string(),
    })
  ),
  negotiationPoints: z.array(z.string()),
});

export type VendorExtraction = z.infer<typeof ExtractionSchema>;

const EXTRACTION_TOOL: Groq.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "extract_vendor_proposal",
    description: "Extract structured commercial and technical data from a vendor proposal document.",
    parameters: {
      type: "object",
      properties: {
        vendorName: { type: "string", description: "The vendor/company name as stated in the proposal" },
        price: {
          type: "number",
          description:
            "Total contract price in INR (numeric, no currency symbols). If the document does not actually state a " +
            "price (e.g. it defers to a separate private order form/schedule), put your best-effort estimate here " +
            "AND set priceDisclosed to false — never leave this blank.",
        },
        priceDisclosed: {
          type: "boolean",
          description: "True only if the document itself states an actual price figure. False if it's estimated, redacted, or deferred elsewhere.",
        },
        sla: {
          type: "number",
          description:
            "Committed SLA uptime percentage, e.g. 99.9. If no SLA commitment is actually stated in the document, use 0 and set slaDisclosed to false.",
        },
        slaDisclosed: {
          type: "boolean",
          description: "True only if the document itself states an actual SLA/uptime commitment.",
        },
        implementationWeeks: { type: "number", description: "Implementation/onboarding timeline in weeks" },
        support: { type: "string", description: "Support coverage summary, e.g. '24/7 phone & chat'" },
        apiSupport: { type: "boolean", description: "Whether the vendor offers a REST/GraphQL API" },
        security: { type: "string", description: "Security & compliance summary, e.g. 'AES-256, SOC 2, ISO 27001'" },
        requirementAssessments: {
          type: "array",
          description: "An assessment for EVERY requirement label provided, in the same order",
          items: {
            type: "object",
            properties: {
              requirementLabel: { type: "string", description: "Must match one of the provided requirement labels exactly" },
              status: { type: "string", enum: ["met", "partial", "unmet"] },
              evidence: { type: "string", description: "One sentence citing what in the document supports this assessment" },
            },
            required: ["requirementLabel", "status", "evidence"],
          },
        },
        strengths: { type: "array", items: { type: "string" }, description: "3-5 concrete strengths of this proposal" },
        risks: {
          type: "array",
          description: "Commercial or contractual risks found in the proposal",
          items: {
            type: "object",
            properties: {
              level: { type: "string", enum: ["high", "medium", "low"] },
              title: { type: "string", description: "A short, specific risk statement, e.g. '8% annual renewal increase'" },
            },
            required: ["level", "title"],
          },
        },
        negotiationPoints: { type: "array", items: { type: "string" }, description: "2-4 concrete points a buyer should negotiate" },
      },
      required: [
        "vendorName",
        "price",
        "priceDisclosed",
        "sla",
        "slaDisclosed",
        "implementationWeeks",
        "support",
        "apiSupport",
        "security",
        "requirementAssessments",
        "strengths",
        "risks",
        "negotiationPoints",
      ],
    },
  },
};

async function fileToText(buffer: Buffer, fileType: "pdf" | "docx"): Promise<string> {
  if (fileType === "docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export async function extractVendorFromDocument(opts: {
  vendorId: string;
  vendorName: string;
  fileName: string;
  fileType: "pdf" | "docx";
  fileSizeKb: number;
  buffer: Buffer;
  requirements: Requirement[];
  budget: number;
}): Promise<Vendor> {
  const client = getGroqClient();
  if (!client) throw new Error("GROQ_API_KEY is not configured");

  const documentText = await fileToText(opts.buffer, opts.fileType);
  const requirementList = opts.requirements.map((r) => `- ${r.label} (${r.priority})`).join("\n");

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are NOVA, the extraction engine inside ProcureAI. Read the attached vendor proposal document " +
          "carefully and extract only what is stated or clearly implied — do not invent numbers. Price and SLA are " +
          "commonly deferred to a separate private order form or simply left out of real contracts — when that " +
          "happens, still provide your best estimate for price/sla but set priceDisclosed/slaDisclosed to false so " +
          "the buyer knows it was never actually stated. You must assess the proposal against every requirement " +
          "listed by the user. Always respond by calling the extract_vendor_proposal function.",
      },
      {
        role: "user",
        content:
          `Requirements to assess against:\n${requirementList}\n\n` +
          // Groq's free tier caps requests at 8,000 tokens/minute for this model.
          // Real-world contracts easily exceed that, so we cap the document slice
          // conservatively (~3k tokens) to leave headroom for the schema + output.
          `Vendor proposal document contents:\n\n${documentText.slice(0, 12000)}`,
      },
    ],
    tools: [EXTRACTION_TOOL],
    tool_choice: { type: "function", function: { name: "extract_vendor_proposal" } },
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall) throw new Error("Groq did not return a structured extraction");

  const data = ExtractionSchema.parse(JSON.parse(toolCall.function.arguments));
  return buildVendorFromExtraction(opts, data);
}

function normalizeLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * The model is asked to echo requirement labels verbatim, but open-weight
 * models frequently paraphrase them instead. Prefer positional matching
 * (we explicitly ask for "one assessment per requirement, in order"), and
 * fall back to fuzzy substring matching so a paraphrase still resolves.
 */
function matchRequirementStatus(
  label: string,
  index: number,
  assessments: VendorExtraction["requirementAssessments"]
): RequirementStatus {
  if (assessments.length === 0) return "pending";

  // Positional match is trustworthy since the model is asked for one
  // assessment per requirement, in the same order.
  if (assessments[index]) return assessments[index].status;

  const normalized = normalizeLabel(label);
  const fuzzy = assessments.find((a) => {
    const candidate = normalizeLabel(a.requirementLabel);
    return candidate.includes(normalized) || normalized.includes(candidate);
  });
  return fuzzy?.status ?? "pending";
}

function buildVendorFromExtraction(
  opts: {
    vendorId: string;
    vendorName: string;
    fileName: string;
    fileType: "pdf" | "docx";
    fileSizeKb: number;
    requirements: Requirement[];
    budget: number;
  },
  data: VendorExtraction
): Vendor {
  const weighted = opts.requirements.map((req, i) => {
    const status = matchRequirementStatus(req.label, i, data.requirementAssessments);
    return { ...req, status };
  });

  const requirementMatchPct = computeRequirementMatchPct(weighted);
  const priceScore = computePriceScore(data.price, opts.budget, data.priceDisclosed);
  const technicalScore = computeTechnicalScore({
    apiSupport: data.apiSupport,
    security: data.security,
    sla: data.sla,
    slaDisclosed: data.slaDisclosed,
  });
  const supportScore = computeSupportScore(data.support);

  const risks: RiskItem[] = data.risks.map((r, i) => ({
    id: `${opts.vendorId}-risk-${i}`,
    level: r.level,
    title: r.title,
  }));
  const riskScore = computeRiskScore(risks);

  const aiScore = computeAiScore({ requirementMatchPct, priceScore, technicalScore, supportScore, riskScore });

  return {
    id: opts.vendorId,
    name: data.vendorName || opts.vendorName,
    fileName: opts.fileName,
    fileType: opts.fileType,
    fileSizeKb: opts.fileSizeKb,
    status: "analyzed",
    uploadedAt: new Date().toISOString().slice(0, 10),
    price: data.price,
    priceDisclosed: data.priceDisclosed,
    sla: data.sla,
    slaDisclosed: data.slaDisclosed,
    implementationWeeks: data.implementationWeeks,
    support: data.support,
    apiSupport: data.apiSupport,
    security: data.security,
    requirementMatchPct,
    aiScore,
    priceScore,
    technicalScore,
    supportScore,
    riskScore,
    strengths: data.strengths,
    risks,
    negotiationPoints: data.negotiationPoints,
    summary: "",
  };
}
