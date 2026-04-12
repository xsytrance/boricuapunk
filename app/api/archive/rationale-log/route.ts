import { readIngestRationaleLog } from "@/lib/archivePhotoPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitValue = Number(url.searchParams.get("limit") || "240");
  const limit = Number.isFinite(limitValue) ? limitValue : 240;
  const text = await readIngestRationaleLog(limit);
  return Response.json({ ok: true, text });
}
