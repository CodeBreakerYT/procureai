import { NextResponse } from "next/server";
import { getTopVendorLive, getVendors, upsertVendor } from "@/lib/server-store";
import { generateRecommendationNarrative } from "@/lib/recommendation";

export async function GET(_request: Request, ctx: RouteContext<"/api/projects/[id]/recommendation">) {
  const { id } = await ctx.params;
  const top = getTopVendorLive(id);
  if (!top) {
    return NextResponse.json({ vendor: null });
  }

  if (!top.summary) {
    const others = getVendors(id).filter((v) => v.status === "analyzed" && v.id !== top.id);
    top.summary = await generateRecommendationNarrative(top, others);
    upsertVendor(id, top);
  }

  return NextResponse.json({ vendor: top });
}
