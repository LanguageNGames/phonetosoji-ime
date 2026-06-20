import {
  dictionary,
  type DictionaryEntry,
} from "./dictionary";

export const englishIndex:
  Record<string, DictionaryEntry[]> = {};

for (const entry of dictionary) {
  const key =
    entry.english.toLowerCase();

  if (!englishIndex[key]) {
    englishIndex[key] = [];
  }

  englishIndex[key].push(entry);
}