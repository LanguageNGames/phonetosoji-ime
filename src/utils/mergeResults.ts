import type { WordResult } from "../types/ime";

export function mergeResults(
  oldResults: WordResult[],
  newResults: WordResult[]
): WordResult[] {
  return newResults.map((newWord) => {
    const existing = oldResults.find(
      (oldWord) =>
        oldWord.original === newWord.original
    );

    if (!existing) {
      return newWord;
    }

    return {
      ...newWord,
      selectedIndex:
        existing.selectedIndex,
      converted:
        existing.converted,
    };
  });
}