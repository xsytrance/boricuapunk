export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAMPLE = "música, Borinqueños, corazón, piñón";

export async function GET() {
  return new Response(JSON.stringify({ ok: true, response: SAMPLE }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
