import { getTelegramWebhookInfo, setTelegramWebhook } from "@/lib/telegramWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySetupKey(request: Request): boolean {
  const configured = process.env.TELEGRAM_WEBHOOK_SETUP_KEY?.trim();
  if (!configured) return true;
  const provided = request.headers.get("x-setup-key")?.trim();
  return Boolean(provided && provided === configured);
}

function resolveBaseUrl(request: Request): string {
  const configured = process.env.BORICUAPUNK_PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(request: Request) {
  if (!verifySetupKey(request)) {
    return Response.json({ ok: false, error: "Invalid setup key." }, { status: 401 });
  }

  try {
    const info = await getTelegramWebhookInfo();
    return Response.json({ ok: true, info });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read webhook info";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifySetupKey(request)) {
    return Response.json({ ok: false, error: "Invalid setup key." }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { webhookUrl?: string };
    const webhookUrl = body.webhookUrl?.trim() || `${resolveBaseUrl(request)}/api/telegram/webhook`;
    const result = await setTelegramWebhook(webhookUrl);
    return Response.json({ ok: true, webhookUrl, telegram: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to set webhook";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
