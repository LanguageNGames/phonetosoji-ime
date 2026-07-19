import { cmuDictionary } from "./loadCmudict";

const pronunciationIndex =
  new Map<string, string[]>();

for (const entry of cmuDictionary) {
  const key =
    entry.pronunciation
      .join(" ")
      .replace(/[0-9]/g, "");

  const word =
    entry.word.toLowerCase();

  const existing =
    pronunciationIndex.get(key);

  if (existing) {
    if (!existing.includes(word)) {
      existing.push(word);
    }
  } else {
    pronunciationIndex.set(
      key,
      [word]
    );
  }
}

export function findWordsByPronunciation(
  phonemes: string[]
): string[] {
  const key =
    phonemes.join(" ");

  return (
    pronunciationIndex.get(key)
    ?? []
  );
}
