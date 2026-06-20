import dictionaryData from "./dictionary.json";

export interface DictionaryEntry {
  english: string;
  phonetosoji: string;
  marker?: string;
}

export const dictionary =
  dictionaryData as DictionaryEntry[];