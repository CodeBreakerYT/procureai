import { NextResponse } from "next/server";
import { getRequirements, setRequirements } from "@/lib/server-store";
import type { Requirement } from "@/lib/types";

export async function GET(_request: Request, ctx: RouteContext<"/api/projects/[id]/requirements">) {
  const { id } = await ctx.params;
  return NextResponse.json({ requirements: await getRequirements(id) });
}

export async function PUT(request: Request, ctx: RouteContext<"/api/projects/[id]/requirements">) {
  const { id } = await ctx.params;
  const body = (await request.json()) as { requirements: Requirement[] };
  await setRequirements(id, body.requirements);
  return NextResponse.json({ ok: true });
}
