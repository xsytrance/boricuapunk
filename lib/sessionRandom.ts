const STORAGE_KEY = "bp-archive-seed";

/** Stable per-tab seed for archive/Hackermouth picks (sessionStorage). */
export function getSessionSeed(): number {
  if (typeof window === "undefined") return 0x9e3779b9;
  try {
    let raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) {
      raw = String((Math.random() * 0xffffffff) | 0);
      sessionStorage.setItem(STORAGE_KEY, raw);
    }
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? (n >>> 0) : 0x9e3779b9;
  } catch {
    return 0x9e3779b9;
  }
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let seq = 0;

/** Next unit float [0,1) — deterministic sequence for this session + call order. */
export function nextSessionUnit(): number {
  const rng = mulberry32((getSessionSeed() + seq++) >>> 0);
  return rng();
}

export function pickFrom<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.min(arr.length - 1, Math.floor(rand() * arr.length))]!;
}
