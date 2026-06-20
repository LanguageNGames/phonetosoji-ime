import { englishIndex }
from "../data/reverseIndex";

export function findPhonetosoji(
  englishWord: string
): string[] {
  const entries =
    englishIndex[
      englishWord.toLowerCase()
    ] ?? [];

  return entries.map((entry) => {
    if (entry.marker) {
      return `${entry.phonetosoji}=${entry.marker}`;
    }

    return entry.phonetosoji;
  });
}