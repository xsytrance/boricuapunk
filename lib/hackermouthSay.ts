const PREFIX = "hackermouth: ";

/** Prefix Hackermouth dialogue; avoids doubling if already prefixed. */
export function hackermouthSay(message: string): string {
  const m = message.trim();
  if (/^hackermouth:\s/i.test(m)) return m;
  const body = m.replace(/^\s*HACKERMOUTH:\/\/\s*/i, "").trim();
  return PREFIX + body;
}
