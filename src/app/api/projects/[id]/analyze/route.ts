import { NextResponse } from "next/server";
import { getProject, getRequirements, upsertVendor } from "@/lib/server-store";
import { extractVendorFromDocument } from "@/lib/extraction";
import { hasGroqKey } from "@/lib/groq";

export async function POST(request: Request, ctx: RouteContext<"/api/projects/[id]/analyze">) {
  const { id: projectId } = await ctx.params;
  const project = getProject(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!hasGroqKey()) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const vendorId = String(formData.get("vendorId") ?? crypto.randomUUID());
  const vendorName = String(formData.get("vendorName") ?? "Vendor");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const fileType = file.name.toLowerCase().endsWith(".docx") ? "docx" : "pdf";
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const vendor = await extractVendorFromDocument({
      vendorId,
      vendorName,
      fileName: file.name,
      fileType,
      fileSizeKb: Math.round(buffer.byteLength / 1024),
      buffer,
      requirements: await getRequirements(projectId),
      budget: project.budget,
    });

    await upsertVendor(projectId, vendor);
    return NextResponse.json({ vendor });
  } catch (err) {
    console.error("[analyze] extraction failed", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
