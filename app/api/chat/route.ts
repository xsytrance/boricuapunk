import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);
const SSH_TARGET = "xsyvps@100.101.0.83";
const ENGINE_DIR = "~/.openclaw/workspace/multivera";
const ENGINE_TIMEOUT_MS = 45_000;

type ApiError = Error & { status?: number };

function fail(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

function sh(value: string): string {
  return `'${value.replace(/'/g, `'\"'\"'`)}'`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      character_id?: string;
      commit_id?: string;
      message?: string;
      history?: Array<{ role?: string; content?: string }>;
    };

    const characterId = (body.character_id || "").trim();
    const commitId = (body.commit_id || "").trim();
    const message = (body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!characterId) throw fail("character_id is required.", 400);
    if (!commitId) throw fail("commit_id is required.", 400);
    if (!message) throw fail("message is required.", 400);

    const remoteCommand = `bash -lc "cd ${ENGINE_DIR} && PYTHONIOENCODING=utf-8 .venv/bin/python engine.py --character ${sh(characterId)} --commit ${sh(commitId)} --message ${sh(message)} --history ${sh(JSON.stringify(history))} --json"`;

    const { stdout } = await execFileAsync("ssh", [SSH_TARGET, remoteCommand], {
      timeout: ENGINE_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
      encoding: "utf8",
    });

    const raw = (stdout || "").trim();
    if (!raw) throw fail("Engine returned empty output.", 502);

    let parsed: { response?: string };
    try {
      parsed = JSON.parse(raw) as { response?: string };
    } catch {
      throw fail(`Engine returned non-JSON output: ${raw.slice(0, 300)}`, 502);
    }

    if (!parsed.response || typeof parsed.response !== "string") {
      throw fail("Engine JSON missing response field.", 502);
    }

    return new Response(JSON.stringify({ response: parsed.response }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    const typed = error as ApiError & { code?: string };

    if (typed.code === "ETIMEDOUT") {
      return new Response(JSON.stringify({ error: "Engine request timed out." }), {
        status: 504,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const status = typed.status && Number.isInteger(typed.status) ? typed.status : 500;
    const message = typed.message || "Unknown chat bridge error";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
