import fs from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";
import { getProject, mockRequirements, mockVendors } from "./mock-data";
import type { Requirement, Vendor } from "./types";

// ---------------------------------------------------------------------------
// Per-project store for the live backend.
//
// On Netlify, this reads/writes through Netlify Blobs — durable storage tied
// to the site, so uploaded vendor data survives across serverless function
// invocations (a plain local JSON file does NOT: Netlify functions can run on
// a fresh, throwaway filesystem per invocation, so a file written by one
// upload request may simply not exist for the next page load).
//
// In local `next dev` (no Netlify runtime present), it falls back to the
// same local JSON file this used before — Blobs needs Netlify's runtime
// context, which plain `next dev` doesn't provide.
//
// Swap this module for a different backing store without touching any route
// handler — every function here is the only thing callers depend on.
// ---------------------------------------------------------------------------

interface ProjectData {
  requirements: Requirement[];
  vendors: Vendor[];
}

type StoreFile = Record<string, ProjectData>;

const STORE_PATH = path.join(process.cwd(), ".data", "store.json");
const BLOB_STORE_NAME = "procureai-data";
const BLOB_KEY = "store.json";

function isNetlifyRuntime(): boolean {
  return !!process.env.NETLIFY || !!process.env.NETLIFY_BLOBS_CONTEXT;
}

async function readAll(): Promise<StoreFile> {
  if (isNetlifyRuntime()) {
    try {
      const store = getStore(BLOB_STORE_NAME);
      const data = await store.get(BLOB_KEY, { type: "json" });
      return (data as StoreFile) ?? {};
    } catch (err) {
      console.error("[server-store] Netlify Blobs read failed, falling back to empty store", err);
      return {};
    }
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoreFile;
  } catch {
    return {};
  }
}

async function writeAll(data: StoreFile): Promise<void> {
  if (isNetlifyRuntime()) {
    const store = getStore(BLOB_STORE_NAME);
    await store.setJSON(BLOB_KEY, data);
    return;
  }
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

export async function getRequirements(projectId: string): Promise<Requirement[]> {
  const all = await readAll();
  return ensure(all, projectId).requirements;
}

export async function setRequirements(projectId: string, requirements: Requirement[]): Promise<void> {
  const all = await readAll();
  ensure(all, projectId).requirements = requirements;
  await writeAll(all);
}

export async function getVendors(projectId: string): Promise<Vendor[]> {
  const all = await readAll();
  return ensure(all, projectId).vendors;
}

export async function upsertVendor(projectId: string, vendor: Vendor): Promise<void> {
  const all = await readAll();
  const data = ensure(all, projectId);
  const idx = data.vendors.findIndex((v) => v.id === vendor.id);
  if (idx >= 0) data.vendors[idx] = vendor;
  else data.vendors.push(vendor);
  await writeAll(all);
}

export async function getAllRisksLive(projectId: string) {
  const vendors = await getVendors(projectId);
  return vendors.flatMap((v) => v.risks.map((r) => ({ ...r, vendorId: v.id, vendorName: v.name })));
}

export async function getTopVendorLive(projectId: string): Promise<Vendor | undefined> {
  const vendors = (await getVendors(projectId)).filter((v) => v.status === "analyzed");
  if (vendors.length === 0) return undefined;
  return [...vendors].sort((a, b) => b.aiScore - a.aiScore)[0];
}

export { getProject };
