import {
  ingestFigurinePhoto,
  listFigurineSightings,
  listFigurinesNeedingReview,
  reviewAssignFigurine,
} from "@/lib/figurinePipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

type ApiError = Error & { status?: number };

function fail(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

function assertImageMime(mimeType: string) {
  if (!mimeType.startsWith("image/")) {
    throw fail("Only image files are supported.", 415);
  }
}

function assertImageSize(size: number) {
  if (size > MAX_IMAGE_BYTES) {
    throw fail("Image exceeds 10MB upload limit.", 413);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitValue = Number(url.searchParams.get("limit") || "20");
  const thresholdValue = Number(url.searchParams.get("threshold") || "0.7");
  const needsReview = ["1", "true", "yes"].includes((url.searchParams.get("needsReview") || "").toLowerCase());

  const limit = Number.isFinite(limitValue) ? limitValue : 20;

  const sightings = needsReview
    ? await listFigurinesNeedingReview({ limit, threshold: Number.isFinite(thresholdValue) ? thresholdValue : 0.7 })
    : await listFigurineSightings(limit);

  return Response.json({ ok: true, sightings });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const sourceRaw = String(formData.get("source") || "manual");
      const source = sourceRaw === "telegram" ? "telegram" : "manual";
      const caption = String(formData.get("caption") || "");
      const shotType = String(formData.get("shotType") || "single") === "group" ? "group" : "single";
      const file = formData.get("photo") ?? formData.get("image");

      if (!(file instanceof File)) {
        return Response.json({ error: "Missing photo file field (photo or image)." }, { status: 400 });
      }

      const mimeType = file.type || "image/jpeg";
      assertImageMime(mimeType);

      const arrayBuffer = await file.arrayBuffer();
      assertImageSize(arrayBuffer.byteLength);

      const extension = file.name.includes(".") ? file.name.split(".").pop() : undefined;

      const sighting = await ingestFigurinePhoto({
        source,
        imageBuffer: Buffer.from(arrayBuffer),
        mimeType,
        caption,
        extensionHint: extension,
        shotType,
      });

      return Response.json({ ok: true, sighting });
    }

    const body = (await request.json()) as {
      imageUrl?: string;
      caption?: string;
      source?: "telegram" | "manual";
      shotType?: "single" | "group";
    };

    if (!body.imageUrl) {
      return Response.json({ error: "imageUrl is required for JSON ingestion." }, { status: 400 });
    }

    const response = await fetch(body.imageUrl);
    if (!response.ok) {
      const status = response.status >= 500 ? 502 : 400;
      throw fail(`Failed to fetch image URL (${response.status})`, status);
    }

    const mimeType = response.headers.get("content-type") || "image/jpeg";
    assertImageMime(mimeType);

    const arrayBuffer = await response.arrayBuffer();
    assertImageSize(arrayBuffer.byteLength);

    const sighting = await ingestFigurinePhoto({
      source: body.source === "telegram" ? "telegram" : "manual",
      imageBuffer: Buffer.from(arrayBuffer),
      mimeType,
      caption: body.caption,
      shotType: body.shotType === "group" ? "group" : "single",
    });

    return Response.json({ ok: true, sighting });
  } catch (error) {
    const typed = error as ApiError;
    const message = typed?.message || "Unknown figurine ingest error";
    const status = typed?.status && Number.isInteger(typed.status) ? typed.status : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { sightingId?: string; characterId?: string };
    const sightingId = (body.sightingId || "").trim();
    const characterId = (body.characterId || "").trim();
    if (!sightingId) throw fail("sightingId is required.", 400);
    if (!characterId) throw fail("characterId is required.", 400);

    const sighting = await reviewAssignFigurine({ sightingId, characterId });
    return Response.json({ ok: true, sighting });
  } catch (error) {
    const typed = error as ApiError;
    const message = typed?.message || "Unknown figurine review update error";
    const status = typed?.status && Number.isInteger(typed.status) ? typed.status : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}