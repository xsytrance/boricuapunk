import { ingestCharacterPhoto, type UploadedSighting } from "@/lib/archivePhotoPipeline";

type TelegramPhotoSize = {
  file_id: string;
  width: number;
  height: number;
  file_size?: number;
};

type TelegramDocument = {
  file_id: string;
  mime_type?: string;
  file_name?: string;
};

type TelegramMessage = {
  message_id: number;
  date: number;
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
  };
  caption?: string;
  photo?: TelegramPhotoSize[];
  document?: TelegramDocument;
};

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  channel_post?: TelegramMessage;
};

type TelegramFileResponse = {
  ok: boolean;
  result?: {
    file_path?: string;
    file_size?: number;
  };
};

const API_BASE = "https://api.telegram.org";

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }
  return token;
}

export function verifyTelegramSecret(headerValue: string | null): boolean {
  const configured = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!configured) return true;
  if (!headerValue) return false;
  return headerValue === configured;
}

function pickPhotoFileId(message: TelegramMessage): { fileId: string; mimeType: string; extensionHint?: string } | null {
  const photos = message.photo ?? [];
  if (photos.length > 0) {
    const sorted = [...photos].sort((a, b) => {
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      return areaB - areaA;
    });
    const biggest = sorted[0];
    if (!biggest?.file_id) return null;
    return {
      fileId: biggest.file_id,
      mimeType: "image/jpeg",
      extensionHint: "jpg",
    };
  }

  const document = message.document;
  if (!document?.file_id) return null;
  if (!document.mime_type?.startsWith("image/")) return null;

  const extension = document.file_name?.includes(".")
    ? document.file_name.split(".").pop()?.toLowerCase()
    : document.mime_type.split("/")[1]?.toLowerCase();

  return {
    fileId: document.file_id,
    mimeType: document.mime_type,
    extensionHint: extension,
  };
}

async function fetchTelegramFilePath(fileId: string): Promise<string> {
  const token = getBotToken();
  const response = await fetch(`${API_BASE}/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`);
  if (!response.ok) {
    throw new Error(`Telegram getFile failed (${response.status}).`);
  }

  const payload = (await response.json()) as TelegramFileResponse;
  if (!payload.ok || !payload.result?.file_path) {
    throw new Error("Telegram getFile did not return file_path.");
  }

  return payload.result.file_path;
}

async function downloadTelegramFile(filePath: string): Promise<Buffer> {
  const token = getBotToken();
  const response = await fetch(`${API_BASE}/file/bot${token}/${filePath}`);
  if (!response.ok) {
    throw new Error(`Telegram file download failed (${response.status}).`);
  }
  const data = await response.arrayBuffer();
  return Buffer.from(data);
}

async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const token = getBotToken();
  await fetch(`${API_BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
}

function compactReason(reason: string): string {
  const cleaned = reason.replace(/\s+/g, " ").trim();
  return cleaned.length <= 120 ? cleaned : `${cleaned.slice(0, 117)}...`;
}

function summaryText(sighting: UploadedSighting): string {
  const confidence = `${Math.round(sighting.match.confidence * 100)}%`;
  const quote = sighting.quotes[0]?.text;
  const lines = [
    `✅ Ingested: ${sighting.card.name}`,
    `Role: ${sighting.card.title}`,
    `Match: ${confidence} (${sighting.match.method})`,
    `Reason: ${compactReason(sighting.match.reason)}`,
  ];

  if (quote) lines.push(`Quote: "${quote}"`);
  lines.push(`Hackermouth effect: ${sighting.hackermouthEffects[0] ?? "Signal linked."}`);

  const siteBase = process.env.BORICUAPUNK_PUBLIC_BASE_URL?.trim();
  if (siteBase) {
    lines.push(`Archive: ${siteBase.replace(/\/+$/, "")}/characters`);
  }

  return lines.join("\n");
}

export async function processTelegramUpdate(update: TelegramUpdate): Promise<{
  handled: boolean;
  reason?: string;
  sighting?: UploadedSighting;
}> {
  const message = update.message ?? update.channel_post;
  if (!message) {
    return { handled: false, reason: "No message payload in update." };
  }

  const selected = pickPhotoFileId(message);
  if (!selected) {
    return { handled: false, reason: "Message has no supported image attachment." };
  }

  const filePath = await fetchTelegramFilePath(selected.fileId);
  const buffer = await downloadTelegramFile(filePath);

  const sighting = await ingestCharacterPhoto({
    source: "telegram",
    imageBuffer: buffer,
    mimeType: selected.mimeType,
    caption: message.caption,
    extensionHint: selected.extensionHint,
  });

  const autoReply = process.env.TELEGRAM_INGEST_AUTO_REPLY !== "false";
  if (autoReply) {
    await sendTelegramMessage(message.chat.id, summaryText(sighting));
  }

  return { handled: true, sighting };
}

export async function setTelegramWebhook(webhookUrl: string): Promise<{ ok: boolean; description?: string }> {
  const token = getBotToken();
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

  const response = await fetch(`${API_BASE}/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secretToken || undefined,
      allowed_updates: ["message", "channel_post"],
      drop_pending_updates: false,
    }),
  });

  const payload = (await response.json()) as { ok: boolean; description?: string };
  return payload;
}

export async function getTelegramWebhookInfo(): Promise<unknown> {
  const token = getBotToken();
  const response = await fetch(`${API_BASE}/bot${token}/getWebhookInfo`);
  if (!response.ok) {
    throw new Error(`Telegram getWebhookInfo failed (${response.status}).`);
  }
  return response.json();
}
