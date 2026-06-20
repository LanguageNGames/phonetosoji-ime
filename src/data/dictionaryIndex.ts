import {
  dictionary,
  type DictionaryEntry,
} from "./dictionary";

export const phonetosojiIndex:
  Record<string, DictionaryEntry[]> = {};

for (const entry of dictionary) {
  const key =
    entry.phonetosoji.toLowerCase();

  if (!phonetosojiIndex[key]) {
    phonetosojiIndex[key] = [];
  }

  phonetosojiIndex[key].push(entry);
}