import {
  adminUpdateSighting,
  listSightings,
  listSightingsNeedingReview,
  reviewAssignSighting,
} from "@/lib/archivePhotoPipeline";

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

  if (needsReview) {
    const sightings = await listSightingsNeedingReview({
      limit,
      threshold: Number.isFinite(thresholdValue) ? thresholdValue : 0.6,
    });
    return Response.json({ ok: true, sightings });
  }

  const sightings = await listSightings({
    limit,
    search: url.searchParams.get("search") || undefined,
    style: (url.searchParams.get("style") as never) || undefined,
    shotKind: (url.searchParams.get("shotKind") as never) || undefined,
    entityType: (url.searchParams.get("entityType") as never) || undefined,
    entityId: url.searchParams.get("entityId") || undefined,
    mainOnly: ["1", "true", "yes"].includes((url.searchParams.get("mainOnly") || "").toLowerCase()),
    includeRemoved: ["1", "true", "yes"].includes((url.searchParams.get("includeRemoved") || "").toLowerCase()),
    consistentMainStyle: ["1", "true", "yes"].includes((url.searchParams.get("consistentMainStyle") || "").toLowerCase()),
  });

  return Response.json({ ok: true, sightings });
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      sightingId?: string;
      characterId?: string;
      entityType?: "character" | "location" | "unknown";
      entityId?: string;
      artStyle?: string;
      shotKind?: string;
      isMain?: boolean;
      moderationState?: "active" | "unassigned" | "removed";
      notes?: string;
    };
    const sightingId = (body.sightingId || "").trim();

    if (!sightingId) throw fail("sightingId is required.", 400);

    if (body.characterId && !body.entityType && !body.entityId && !body.artStyle && !body.shotKind) {
      const sighting = await reviewAssignSighting({ sightingId, characterId: body.characterId });
      return Response.json({ ok: true, sighting });
    }

    const sighting = await adminUpdateSighting({
      sightingId,
      entityType: body.entityType,
      entityId: body.entityId,
      artStyle: body.artStyle as never,
      shotKind: body.shotKind as never,
      isMain: typeof body.isMain === "boolean" ? body.isMain : undefined,
      moderationState: body.moderationState,
      notes: body.notes,
    });
    return Response.json({ ok: true, sighting });
  } catch (error) {
    const typed = error as ApiError;
    const message = typed?.message || "Unknown review update error";
    const status = typed?.status && Number.isInteger(typed.status) ? typed.status : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}
