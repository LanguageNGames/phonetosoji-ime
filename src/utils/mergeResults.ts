import type { WordResult } from "../types/ime";

export function mergeResults(
  oldResults: WordResult[],
  newResults: WordResult[]
): WordResult[] {
  return newResults.map(
    (newWord, index) => {
      const existing =
        oldResults[index];

      if (
        !existing ||
        existing.original !==
          newWord.original
      ) {
        return newWord;
      }

      const maxIndex =
        Math.max(
          0,
          newWord.candidates.length - 1
        );

      const selectedIndex =
        Math.min(
          existing.selectedIndex,
          maxIndex
        );

      return {
        ...newWord,
        selectedIndex,
        converted:
          existing.converted,
        display:
          existing.converted &&
          newWord.candidates[
            selectedIndex
          ]
            ? newWord.candidates[
                selectedIndex
              ]
            : newWord.display,
      };
    }
  );
}
