import { wordFrequency }
from "../data/wordFrequency";

import { userFrequency }
from "../data/userFrequency";

export function rankCandidates(
  words: string[]
): string[] {
  return [...words].sort((a, b) => {
    const scoreA =
      (wordFrequency[a] ?? 0) +
      (userFrequency[a] ?? 0) * 10000;

    const scoreB =
      (wordFrequency[b] ?? 0) +
      (userFrequency[b] ?? 0) * 10000;

    return scoreB - scoreA;
  });
}