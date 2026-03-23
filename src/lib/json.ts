export function safeJsonObject(raw: string | null | undefined, fallback = "{}"): string {
  const value = (raw ?? "").trim();
  if (!value) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return JSON.stringify(parsed);
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function safeJsonArray(raw: string | null | undefined, fallback = "[]"): string {
  const value = (raw ?? "").trim();
  if (!value) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed);
    }
    return fallback;
  } catch {
    return fallback;
  }
}
