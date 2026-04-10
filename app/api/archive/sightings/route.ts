import { listSightings } from "@/lib/archivePhotoPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitValue = Number(url.searchParams.get("limit") || "20");
  const sightings = await listSightings(Number.isFinite(limitValue) ? limitValue : 20);
  return Response.json({ ok: true, sightings });
}
