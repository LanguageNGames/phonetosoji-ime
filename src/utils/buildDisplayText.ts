import type { WordResult } from "../types/ime";

export function buildDisplayText(
  results: WordResult[]
): string {
  return results
    .map((word) => word.display)
    .join(" ");
}