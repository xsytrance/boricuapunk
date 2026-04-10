import { getEvolvingQuoteOfDay } from "@/lib/archivePhotoPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const quote = await getEvolvingQuoteOfDay();
  return Response.json({ ok: true, quote });
}
