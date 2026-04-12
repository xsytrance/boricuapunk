import { listSightings, listSightingsNeedingReview, reviewAssignSighting } from "@/lib/archivePhotoPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApiError = Error & { status?: number };

function fail(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitValue = Number(url.searchParams.get("limit") || "20");
  const thresholdValue = Number(url.searchParams.get("threshold") || "0.6");
  const needsReview = ["1", "true", "yes"].includes((url.searchParams.get("needsReview") || "").toLowerCase());

  const limit = Number.isFinite(limitValue) ? limitValue : 20;

  const sightings = needsReview
    ? await listSightingsNeedingReview({ limit, threshold: Number.isFinite(thresholdValue) ? thresholdValue : 0.6 })
    : await listSightings(limit);

  return Response.json({ ok: true, sightings });
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { sightingId?: string; characterId?: string };
    const sightingId = (body.sightingId || "").trim();
    const characterId = (body.characterId || "").trim();

    if (!sightingId) throw fail("sightingId is required.", 400);
    if (!characterId) throw fail("characterId is required.", 400);

    const sighting = await reviewAssignSighting({ sightingId, characterId });
    return Response.json({ ok: true, sighting });
  } catch (error) {
    const typed = error as ApiError;
    const message = typed?.message || "Unknown review update error";
    const status = typed?.status && Number.isInteger(typed.status) ? typed.status : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}
