import { findCandidates } from "./findCandidates";
import type { WordResult } from "../types/ime";

export function convertSentence(
  input: string
): WordResult[] {
  if (!input.trim()) {
    return [];
  }

  const words =
    input.trim().split(/\s+/);

  return words.map(
    (word, index) => {
      const candidates =
        findCandidates(word);

      const autoConvert =
        candidates.length === 1;

      return {
        id: index,
        original: word,
        candidates,
        selectedIndex: 0,
        converted: autoConvert,
        display: autoConvert
          ? candidates[0]
          : word,
      };
    }
  );
}
