// ---------------------------------------------------------------------------
// Assistant domain types
//
// The assistant's *logic/state* is intentionally decoupled from its
// *visual representation*. Anything that renders NOVA (orb today, a GLB/GLTF
// 3D avatar tomorrow) should only ever depend on `AssistantState` +
// `AssistantMessage` — never on how the visual is implemented.
// ---------------------------------------------------------------------------

export type AssistantState =
  | "idle"
  | "listening"
  | "thinking"
  | "analyzing"
  | "speaking";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Procurement domain types
// ---------------------------------------------------------------------------

export type ProjectStatus = "draft" | "collecting" | "analyzing" | "completed";

export interface ProcurementProject {
  id: string;
  name: string;
  category: string;
  budget: number;
  durationMonths: number;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  vendorCount: number;
  requirementCount: number;
}

export type RequirementPriority = "mandatory" | "high" | "medium" | "low";
export type RequirementStatus = "pending" | "met" | "partial" | "unmet";

export interface Requirement {
  id: string;
  label: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  notes?: string;
}

export type VendorProcessingStatus = "queued" | "reading" | "analyzing" | "analyzed" | "error";

export interface Vendor {
  id: string;
  name: string;
  fileName: string;
  fileType: "pdf" | "docx";
  fileSizeKb: number;
  status: VendorProcessingStatus;
  uploadedAt: string;
  price: number;
  /** false when the source document never actually states a price (deferred to a private order form, etc). */
  priceDisclosed: boolean;
  sla: number;
  /** false when the source document never actually states an SLA commitment. */
  slaDisclosed: boolean;
  implementationWeeks: number;
  support: string;
  apiSupport: boolean;
  security: string;
  requirementMatchPct: number;
  aiScore: number;
  priceScore: number;
  technicalScore: number;
  supportScore: number;
  riskScore: number;
  strengths: string[];
  risks: RiskItem[];
  negotiationPoints: string[];
  summary: string;
}

export type RiskLevel = "high" | "medium" | "low";

export interface RiskItem {
  id: string;
  level: RiskLevel;
  title: string;
  vendorId?: string;
  vendorName?: string;
}

export interface AnalysisStep {
  id: string;
  label: string;
  done: boolean;
}
