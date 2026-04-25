import { processTelegramUpdate, verifyTelegramSecret, type TelegramUpdate } from "@/lib/telegramWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const secretHeader = request.headers.get("x-telegram-bot-api-secret-token");
    if (!verifyTelegramSecret(secretHeader)) {
      return Response.json({ ok: false, error: "Invalid webhook secret." }, { status: 401 });
    }

    const update = (await request.json()) as TelegramUpdate;
    const result = await processTelegramUpdate(update);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "telegram webhook failed";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    route: "telegram webhook",
    hint: "POST Telegram update payloads here.",
  });
}
