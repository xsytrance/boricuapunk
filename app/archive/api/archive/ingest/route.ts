import { ingestCharacterPhoto } from "@/lib/archivePhotoPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function bufferFromUrl(imageUrl: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image URL (${response.status})`);
  }

  const mimeType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();
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

      const arrayBuffer = await file.arrayBuffer();
      const extension = file.name.includes(".") ? file.name.split(".").pop() : undefined;

      const sighting = await ingestCharacterPhoto({
        source,
        imageBuffer: Buffer.from(arrayBuffer),
        mimeType: file.type || "image/jpeg",
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
    const message = error instanceof Error ? error.message : "Unknown ingest error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
