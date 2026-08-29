import type { Requirement, RequirementPriority, RiskItem } from "./types";

// ---------------------------------------------------------------------------
// All numeric vendor scores are computed here, deterministically, in plain
// TypeScript — never invented by the LLM. The LLM's job is qualitative
// extraction (facts, risks, narrative); the score a procurement team acts on
// is auditable and reproducible from those facts. This is the trust boundary
// of the whole pipeline.
// ---------------------------------------------------------------------------

const PRIORITY_WEIGHT: Record<RequirementPriority, number> = {
  mandatory: 3,
  high: 2,
  medium: 1,
  low: 0.5,
};

const STATUS_VALUE: Record<Requirement["status"], number> = {
  met: 1,
  partial: 0.5,
  unmet: 0,
  pending: 0,
};

export function computeRequirementMatchPct(requirements: Requirement[]): number {
  if (requirements.length === 0) return 0;
  let weightedSum = 0;
  let weightTotal = 0;
  for (const r of requirements) {
    const weight = PRIORITY_WEIGHT[r.priority];
    weightedSum += weight * STATUS_VALUE[r.status];
    weightTotal += weight;
  }
  return weightTotal === 0 ? 0 : Math.round((weightedSum / weightTotal) * 100);
}

/**
 * Cheaper relative to budget scores higher; over-budget is penalized but not
 * zeroed. When the source document never actually discloses a price
 * (deferred to a private order form, redacted, etc.), we deliberately do NOT
 * reward that as "cheap" — undisclosed pricing is a real commercial risk,
 * not a good score, so it gets a fixed below-average value regardless of
 * whatever raw number was extracted.
 */
export function computePriceScore(price: number, budget: number, disclosed: boolean): number {
  if (!disclosed) return 40;
  if (budget <= 0) return 50;
  const ratio = price / budget;
  const raw = 100 - (ratio - 0.5) * 100;
  return clamp(Math.round(raw), 15, 100);
}

export function computeTechnicalScore(opts: {
  apiSupport: boolean;
  security: string;
  sla: number;
  slaDisclosed: boolean;
}): number {
  let score = 50;
  if (opts.apiSupport) score += 15;
  const securityLower = opts.security.toLowerCase();
  if (securityLower.includes("iso 27001")) score += 12;
  if (securityLower.includes("soc 2") || securityLower.includes("soc2")) score += 10;
  if (securityLower.includes("aes-256") || securityLower.includes("encrypt")) score += 8;
  // SLA 99.0% -> +0, 99.99% -> +~20. No commitment stated -> no bonus, not a penalty.
  if (opts.slaDisclosed) {
    score += clamp(Math.round((opts.sla - 99) * 20), 0, 20);
  }
  return clamp(score, 0, 100);
}

export function computeSupportScore(support: string): number {
  const s = support.toLowerCase();
  if (s.includes("24/7")) return 96;
  if (s.includes("business hours")) return 58;
  return 70;
}

export function computeRiskScore(risks: RiskItem[]): number {
  const penalty = risks.reduce((sum, r) => {
    if (r.level === "high") return sum + 22;
    if (r.level === "medium") return sum + 9;
    return sum + 1;
  }, 0);
  return clamp(100 - penalty, 5, 100);
}

export function computeAiScore(opts: {
  requirementMatchPct: number;
  priceScore: number;
  technicalScore: number;
  supportScore: number;
  riskScore: number;
}): number {
  const weighted =
    opts.requirementMatchPct * 0.35 +
    opts.priceScore * 0.2 +
    opts.technicalScore * 0.2 +
    opts.supportScore * 0.15 +
    opts.riskScore * 0.1;
  return clamp(Math.round(weighted), 0, 100);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
