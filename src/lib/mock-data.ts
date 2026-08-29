import type {
  AnalysisStep,
  ProcurementProject,
  Requirement,
  RiskItem,
  Vendor,
} from "./types";

export const mockProjects: ProcurementProject[] = [
  {
    id: "erp-selection",
    name: "ERP Software Selection",
    category: "Enterprise Software",
    budget: 2500000,
    durationMonths: 24,
    description:
      "Selecting a new ERP platform to unify finance, inventory, and HR operations across three regional offices.",
    status: "analyzing",
    createdAt: "2026-08-02",
    vendorCount: 3,
    requirementCount: 6,
  },
  {
    id: "cloud-infra",
    name: "Cloud Infrastructure Partner",
    category: "IT Infrastructure",
    budget: 4800000,
    durationMonths: 36,
    description: "Migrating on-prem workloads to a managed cloud infrastructure provider.",
    status: "collecting",
    createdAt: "2026-07-18",
    vendorCount: 2,
    requirementCount: 5,
  },
  {
    id: "hr-platform",
    name: "HR & Payroll Platform",
    category: "HR Tech",
    budget: 1200000,
    durationMonths: 12,
    description: "Replacing legacy payroll software with a modern HRMS for 450 employees.",
    status: "completed",
    createdAt: "2026-06-05",
    vendorCount: 4,
    requirementCount: 7,
  },
  {
    id: "security-audit-tools",
    name: "Security Monitoring Suite",
    category: "Cybersecurity",
    budget: 3200000,
    durationMonths: 18,
    description: "Procuring a SIEM + endpoint detection suite for the security operations team.",
    status: "draft",
    createdAt: "2026-08-20",
    vendorCount: 0,
    requirementCount: 4,
  },
];

export const mockRequirements: Record<string, Requirement[]> = {
  "erp-selection": [
    { id: "r1", label: "SSO support", priority: "mandatory", status: "met" },
    { id: "r2", label: "REST API", priority: "mandatory", status: "met" },
    { id: "r3", label: "24/7 support", priority: "high", status: "met" },
    { id: "r4", label: "SLA ≥ 99.9%", priority: "mandatory", status: "met" },
    { id: "r5", label: "Implementation < 12 weeks", priority: "high", status: "partial" },
    { id: "r6", label: "Data encryption at rest & in transit", priority: "mandatory", status: "met" },
  ],
  "cloud-infra": [
    { id: "r1", label: "99.99% uptime SLA", priority: "mandatory", status: "pending" },
    { id: "r2", label: "Multi-region failover", priority: "high", status: "pending" },
    { id: "r3", label: "SOC 2 Type II compliance", priority: "mandatory", status: "pending" },
    { id: "r4", label: "24/7 NOC support", priority: "high", status: "pending" },
    { id: "r5", label: "Kubernetes-native tooling", priority: "medium", status: "pending" },
  ],
  "hr-platform": [
    { id: "r1", label: "Payroll compliance (India)", priority: "mandatory", status: "met" },
    { id: "r2", label: "Mobile app for employees", priority: "high", status: "met" },
    { id: "r3", label: "Biometric attendance integration", priority: "medium", status: "met" },
    { id: "r4", label: "Custom approval workflows", priority: "high", status: "met" },
    { id: "r5", label: "Data residency in India", priority: "mandatory", status: "met" },
    { id: "r6", label: "24/7 support", priority: "medium", status: "partial" },
    { id: "r7", label: "REST API", priority: "low", status: "met" },
  ],
  "security-audit-tools": [
    { id: "r1", label: "Real-time threat detection", priority: "mandatory", status: "pending" },
    { id: "r2", label: "SIEM + EDR in one console", priority: "high", status: "pending" },
    { id: "r3", label: "Compliance reporting (ISO 27001)", priority: "mandatory", status: "pending" },
    { id: "r4", label: "On-call incident response", priority: "high", status: "pending" },
  ],
};

export const mockVendors: Record<string, Vendor[]> = {
  "erp-selection": [
    {
      id: "vendor-a",
      name: "Vendor A",
      fileName: "proposal_vendor_a.pdf",
      fileType: "pdf",
      fileSizeKb: 2340,
      status: "analyzed",
      uploadedAt: "2026-08-10",
      price: 2200000,
      priceDisclosed: true,
      sla: 99.95,
      slaDisclosed: true,
      implementationWeeks: 10,
      support: "24/7 phone & chat",
      apiSupport: true,
      security: "AES-256, SOC 2",
      requirementMatchPct: 100,
      aiScore: 92,
      priceScore: 84,
      technicalScore: 94,
      supportScore: 96,
      riskScore: 88,
      strengths: [
        "Meets all mandatory requirements",
        "99.95% SLA with financial penalties",
        "24/7 dedicated support desk",
        "Fastest implementation timeline",
      ],
      risks: [
        { id: "va-risk1", level: "high", title: "8% annual renewal increase" },
        { id: "va-risk2", level: "medium", title: "30% upfront payment required" },
      ],
      negotiationPoints: [
        "Reduce annual renewal increase below 5%",
        "Negotiate upfront payment down to 15%",
        "Lock implementation SLA into contract",
      ],
      summary:
        "Vendor A provides the strongest overall match against the defined requirements while maintaining competitive pricing and implementation time.",
    },
    {
      id: "vendor-b",
      name: "Vendor B",
      fileName: "proposal_vendor_b.pdf",
      fileType: "pdf",
      fileSizeKb: 1870,
      status: "analyzed",
      uploadedAt: "2026-08-10",
      price: 1900000,
      priceDisclosed: true,
      sla: 99.9,
      slaDisclosed: true,
      implementationWeeks: 16,
      support: "Business hours only",
      apiSupport: true,
      security: "AES-256",
      requirementMatchPct: 67,
      aiScore: 78,
      priceScore: 92,
      technicalScore: 74,
      supportScore: 58,
      riskScore: 70,
      strengths: ["Lowest overall price", "Strong REST API documentation"],
      risks: [
        { id: "vb-risk1", level: "high", title: "No 24/7 support coverage" },
        { id: "vb-risk2", level: "medium", title: "Missing data retention policy" },
        { id: "vb-risk3", level: "medium", title: "Implementation timeline 60% longer than Vendor A" },
      ],
      negotiationPoints: [
        "Request 24/7 support as contract add-on",
        "Require documented data retention policy",
      ],
      summary:
        "Vendor B is the cheapest option but falls short on support coverage and requirement match, creating operational risk.",
    },
    {
      id: "vendor-c",
      name: "Vendor C",
      fileName: "proposal_vendor_c.docx",
      fileType: "docx",
      fileSizeKb: 980,
      status: "analyzed",
      uploadedAt: "2026-08-11",
      price: 2500000,
      priceDisclosed: true,
      sla: 99.99,
      slaDisclosed: true,
      implementationWeeks: 8,
      support: "24/7 phone & chat",
      apiSupport: true,
      security: "AES-256, SOC 2, ISO 27001",
      requirementMatchPct: 92,
      aiScore: 86,
      priceScore: 70,
      technicalScore: 90,
      supportScore: 94,
      riskScore: 92,
      strengths: [
        "Highest SLA in the market (99.99%)",
        "Fastest implementation (8 weeks)",
        "ISO 27001 certified security program",
      ],
      risks: [
        { id: "vc-risk1", level: "low", title: "SLA clearly defined and enforceable" },
        { id: "vc-risk2", level: "medium", title: "Premium pricing vs. competitors" },
      ],
      negotiationPoints: [
        "Negotiate a multi-year price lock",
        "Bundle onboarding & training at no extra cost",
      ],
      summary:
        "Vendor C offers premium security and the fastest rollout but comes at the highest price point of the three proposals.",
    },
  ],
  "cloud-infra": [
    {
      id: "vendor-x",
      name: "Vendor X",
      fileName: "proposal_vendor_x.pdf",
      fileType: "pdf",
      fileSizeKb: 3120,
      status: "analyzing",
      uploadedAt: "2026-08-25",
      price: 4200000,
      priceDisclosed: true,
      sla: 99.95,
      slaDisclosed: true,
      implementationWeeks: 14,
      support: "24/7 NOC",
      apiSupport: true,
      security: "SOC 2 Type II",
      requirementMatchPct: 80,
      aiScore: 0,
      priceScore: 0,
      technicalScore: 0,
      supportScore: 0,
      riskScore: 0,
      strengths: [],
      risks: [],
      negotiationPoints: [],
      summary: "",
    },
    {
      id: "vendor-y",
      name: "Vendor Y",
      fileName: "proposal_vendor_y.docx",
      fileType: "docx",
      fileSizeKb: 1540,
      status: "queued",
      uploadedAt: "2026-08-25",
      price: 3900000,
      priceDisclosed: true,
      sla: 99.9,
      slaDisclosed: true,
      implementationWeeks: 20,
      support: "Business hours",
      apiSupport: false,
      security: "SOC 2",
      requirementMatchPct: 0,
      aiScore: 0,
      priceScore: 0,
      technicalScore: 0,
      supportScore: 0,
      riskScore: 0,
      strengths: [],
      risks: [],
      negotiationPoints: [],
      summary: "",
    },
  ],
  "hr-platform": [],
  "security-audit-tools": [],
};

export const mockAnalysisSteps: AnalysisStep[] = [
  { id: "s1", label: "Reading documents", done: true },
  { id: "s2", label: "Extracting pricing", done: true },
  { id: "s3", label: "Matching requirements", done: true },
  { id: "s4", label: "Checking contract terms", done: true },
  { id: "s5", label: "Detecting risks", done: true },
  { id: "s6", label: "Generating recommendation", done: true },
];

export function getAllRisks(projectId: string): RiskItem[] {
  const vendors = mockVendors[projectId] ?? [];
  const risks: RiskItem[] = [];
  vendors.forEach((v) => {
    v.risks.forEach((r) => {
      risks.push({ ...r, vendorId: v.id, vendorName: v.name });
    });
  });
  return risks;
}

export function getProject(id: string): ProcurementProject | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getTopVendor(projectId: string): Vendor | undefined {
  const vendors = mockVendors[projectId] ?? [];
  if (vendors.length === 0) return undefined;
  return [...vendors].sort((a, b) => b.aiScore - a.aiScore)[0];
}

export const dashboardStats = {
  activeProjects: mockProjects.filter((p) => p.status !== "completed").length,
  vendorsAnalyzed: Object.values(mockVendors).flat().filter((v) => v.status === "analyzed").length,
  potentialSavings: 4300000,
  pendingReviews: 3,
};

export const recentInsights = [
  {
    id: "i1",
    text: "Vendor A's renewal clause could raise costs 8% annually — flagged for negotiation.",
    projectId: "erp-selection",
    time: "2h ago",
  },
  {
    id: "i2",
    text: "Vendor B is missing a documented data retention policy required for compliance.",
    projectId: "erp-selection",
    time: "5h ago",
  },
  {
    id: "i3",
    text: "Cloud Infrastructure Partner: 2 of 2 proposals received, analysis starting soon.",
    projectId: "cloud-infra",
    time: "1d ago",
  },
  {
    id: "i4",
    text: "HR & Payroll Platform closed — Vendor Nimbus HR selected with 94/100 score.",
    projectId: "hr-platform",
    time: "3d ago",
  },
];

export const scoreRadarData = (vendor: Vendor) => [
  { metric: "Match", value: vendor.requirementMatchPct },
  { metric: "Price", value: vendor.priceScore },
  { metric: "Technical", value: vendor.technicalScore },
  { metric: "Support", value: vendor.supportScore },
  { metric: "Risk", value: vendor.riskScore },
];

export const mockChatResponses: Record<string, string> = {
  cheapest:
    "Vendor B is the cheapest option at ₹19L, roughly 14% below Vendor A and 24% below Vendor C.",
  "recommend vendor a":
    "Vendor A scored highest overall (92/100) because it meets every mandatory requirement, offers a 99.95% SLA, and has the fastest realistic implementation timeline among fully-compliant vendors.",
  "vendor b": "Vendor B's biggest risks are no 24/7 support coverage and a missing data retention policy — both could create compliance gaps.",
  requirements:
    "Vendor A meets 100% of your defined requirements, followed by Vendor C at 92% and Vendor B at 67%.",
  compare:
    "Vendor A costs ₹3L less than Vendor C, matches 8% more requirements, but has a slightly lower SLA (99.95% vs 99.99%) and 2 weeks longer implementation.",
  default:
    "I can help compare pricing, SLAs, risks, and requirement matches across your vendors — just ask me anything about this project.",
};

export function getMockChatResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("cheap")) return mockChatResponses.cheapest;
  if (q.includes("recommend") || q.includes("why")) return mockChatResponses["recommend vendor a"];
  if (q.includes("vendor b") || q.includes("risk")) return mockChatResponses["vendor b"];
  if (q.includes("requirement") || q.includes("meets all")) return mockChatResponses.requirements;
  if (q.includes("compare")) return mockChatResponses.compare;
  return mockChatResponses.default;
}
