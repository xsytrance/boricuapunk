import { ingestCharacterPhoto } from "@/lib/archivePhotoPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

type IngestError = Error & { status?: number };

function fail(message: string, status: number): IngestError {
  const error = new Error(message) as IngestError;
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

async function bufferFromUrl(imageUrl: string): Promise<{ buffer: Buffer; mimeType: string }> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw fail("imageUrl must be a valid absolute URL.", 400);
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw fail("imageUrl must use http or https.", 400);
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    const status = response.status >= 500 ? 502 : 400;
    throw fail(`Failed to fetch image URL (${response.status})`, status);
  }

  const mimeType = response.headers.get("content-type") || "image/jpeg";
  assertImageMime(mimeType);

  const arrayBuffer = await response.arrayBuffer();
  assertImageSize(arrayBuffer.byteLength);
  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
  };
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const sourceRaw = String(formData.get("source") || "manual");
      const source = sourceRaw === "telegram" ? "telegram" : "manual";
      const caption = String(formData.get("caption") || "");
      const file = formData.get("photo") ?? formData.get("image");

      if (!(file instanceof File)) {
        return Response.json({ error: "Missing photo file field (photo or image)." }, { status: 400 });
      }

      const mimeType = file.type || "image/jpeg";
      assertImageMime(mimeType);

      const arrayBuffer = await file.arrayBuffer();
      assertImageSize(arrayBuffer.byteLength);

      const extension = file.name.includes(".") ? file.name.split(".").pop() : undefined;

      const sighting = await ingestCharacterPhoto({
        source,
        imageBuffer: Buffer.from(arrayBuffer),
        mimeType,
        caption,
        extensionHint: extension,
      });

      return Response.json({ ok: true, sighting });
    }

    const body = (await request.json()) as {
      imageUrl?: string;
      caption?: string;
      source?: "telegram" | "manual";
    };

    if (!body.imageUrl) {
      return Response.json({ error: "imageUrl is required for JSON ingestion." }, { status: 400 });
    }

    const { buffer, mimeType } = await bufferFromUrl(body.imageUrl);
    const sighting = await ingestCharacterPhoto({
      source: body.source === "telegram" ? "telegram" : "manual",
      imageBuffer: buffer,
      mimeType,
      caption: body.caption,
    });

    return Response.json({ ok: true, sighting });
  } catch (error) {
    const typed = error as IngestError;
    const message = typed?.message || "Unknown ingest error";
    const status = typed?.status && Number.isInteger(typed.status) ? typed.status : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}
