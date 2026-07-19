import type { CmuEntry } from "../types/cmudict";

export function parseCmudict(
  text: string
): CmuEntry[] {
  return text
    .split("\n")
    .filter(
      (line) =>
        line.trim() &&
        !line.startsWith(";;;")
    )
    .map((line) => {
      const parts =
        line.trim().split(/\s+/);

      return {
        word: parts[0]
          .replace(/\(\d+\)$/g, "")
          .toLowerCase(),
        pronunciation:
          parts.slice(1),
      };
    });
}
