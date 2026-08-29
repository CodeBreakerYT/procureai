import fs from "fs";
import path from "path";
import { getProject, mockRequirements, mockVendors } from "./mock-data";
import type { Requirement, Vendor } from "./types";

// ---------------------------------------------------------------------------
// File-backed per-project store for the live backend.
//
// This is a prototype persistence layer: it seeds from mock-data.ts on first
// access, then holds real analysis results (uploaded + Groq-analyzed
// vendors, edited requirements) in a local JSON file. A plain in-memory Map
// isn't reliable here — Next.js dev mode (Turbopack) can reload route
// modules between requests, silently resetting module-level state — so this
// writes through to disk on every mutation. Swap this module for a real
// database without touching any route handler signatures — every function
// here is the only thing callers depend on.
// ---------------------------------------------------------------------------

interface ProjectData {
  requirements: Requirement[];
  vendors: Vendor[];
}

type StoreFile = Record<string, ProjectData>;

const STORE_PATH = path.join(process.cwd(), ".data", "store.json");

function readAll(): StoreFile {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoreFile;
  } catch {
    return {};
  }
}

function writeAll(data: StoreFile) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function ensure(all: StoreFile, projectId: string): ProjectData {
  if (!all[projectId]) {
    all[projectId] = {
      requirements: [...(mockRequirements[projectId] ?? [])],
      vendors: [...(mockVendors[projectId] ?? [])],
    };
  }
  return all[projectId];
}

export function getRequirements(projectId: string): Requirement[] {
  const all = readAll();
  return ensure(all, projectId).requirements;
}

export function setRequirements(projectId: string, requirements: Requirement[]) {
  const all = readAll();
  ensure(all, projectId).requirements = requirements;
  writeAll(all);
}

export function getVendors(projectId: string): Vendor[] {
  const all = readAll();
  return ensure(all, projectId).vendors;
}

export function upsertVendor(projectId: string, vendor: Vendor) {
  const all = readAll();
  const data = ensure(all, projectId);
  const idx = data.vendors.findIndex((v) => v.id === vendor.id);
  if (idx >= 0) data.vendors[idx] = vendor;
  else data.vendors.push(vendor);
  writeAll(all);
}

export function getAllRisksLive(projectId: string) {
  const vendors = getVendors(projectId);
  return vendors.flatMap((v) => v.risks.map((r) => ({ ...r, vendorId: v.id, vendorName: v.name })));
}

export function getTopVendorLive(projectId: string): Vendor | undefined {
  const vendors = getVendors(projectId).filter((v) => v.status === "analyzed");
  if (vendors.length === 0) return undefined;
  return [...vendors].sort((a, b) => b.aiScore - a.aiScore)[0];
}

export { getProject };
