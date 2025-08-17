// Normalizes what we send to the JSONB column so it's ALWAYS a string[]
export type SpecialtyInput = string[] | string | null | undefined;

export function toJsonbStringArray(input: SpecialtyInput): string[] {
  if (Array.isArray(input)) return input.map(String);

  if (typeof input === "string") {
    const t = input.trim();
    if (!t) return [];
    // If it looks like JSON, parse it
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const parsed = JSON.parse(t);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        // fall through to comma split
      }
    }
    // Otherwise treat as comma-separated
    return t.split(",").map(s => s.trim()).filter(Boolean);
  }

  return [];
}