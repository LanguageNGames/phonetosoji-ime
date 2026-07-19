type SeedEntry = {
  phonetosoji: string;
  english: string;
};

export function normalizePhonetosojiKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase();
}

const seedEntries: SeedEntry[] = [
  { phonetosoji: "ho2m", english: "home" },
  { phonetosoji: "bo6k", english: "book" },
  { phonetosoji: "ho4s", english: "house" },
  { phonetosoji: "u2", english: "you" },
  { phonetosoji: "red", english: "red" },
  { phonetosoji: "kr2", english: "car" },
  { phonetosoji: "dr3", english: "door" },
  { phonetosoji: "pen", english: "pen" },
  { phonetosoji: "b8", english: "boy" },
  { phonetosoji: "top", english: "top" },
  { phonetosoji: "dog", english: "dog" },
  { phonetosoji: "kik", english: "kick" },
  { phonetosoji: "go2", english: "go" },
  { phonetosoji: "fish", english: "fish" },
  { phonetosoji: "van", english: "van" },
  { phonetosoji: "sa3n", english: "sun" },
  { phonetosoji: "zo3", english: "zoo" },
  { phonetosoji: "man", english: "man" },
  { phonetosoji: "wet", english: "wet" },
  { phonetosoji: "yes", english: "yes" },
  { phonetosoji: "hat", english: "hat" },
  { phonetosoji: "li2t", english: "light" },
  { phonetosoji: "thin2k", english: "think" },
  { phonetosoji: "this", english: "this" },
  { phonetosoji: "ship", english: "ship" },
  { phonetosoji: "chek", english: "check" },
  { phonetosoji: "groz2", english: "garage" },
  { phonetosoji: "ja3j", english: "judge" },
  { phonetosoji: "sin2", english: "sing" },

  { phonetosoji: "ri2t=sb", english: "right" },
  { phonetosoji: "ri2t=a", english: "write" },
  { phonetosoji: "ri2t=o", english: "rite" },
  { phonetosoji: "ri2t=n", english: "wright" },

  { phonetosoji: "tha2r=]", english: "their" },
  { phonetosoji: "tha2r=L", english: "there" },
  { phonetosoji: "tha2/r", english: "they're" },

  { phonetosoji: "to=‘", english: "to" },
  { phonetosoji: "to3=Q", english: "too" },
  { phonetosoji: "to3=#", english: "two" },

  { phonetosoji: "se2=a", english: "see" },
  { phonetosoji: "se2=L", english: "sea" },

  { phonetosoji: "thro3", english: "through" },
  { phonetosoji: "tho2", english: "though" },

  // Corrected after comparing with the sample sentences:
  // ta3f corresponds to /tʌf/ and should be "tough".
  // The sample sentence uses thot for "thought".
  { phonetosoji: "ta3f", english: "tough" },
  { phonetosoji: "thot", english: "thought" },

  { phonetosoji: "bu2tifl", english: "beautiful" },
  { phonetosoji: "kompu2tr", english: "computer" },
  { phonetosoji: "la2n2wij", english: "language" },
  { phonetosoji: "childrin", english: "children" },
  { phonetosoji: "sko6l", english: "school" },
  { phonetosoji: "frend", english: "friend" },

  { phonetosoji: "I2", english: "I" },
  { phonetosoji: "wa3nt", english: "want" },
  { phonetosoji: "r2", english: "are" },
  { phonetosoji: "pla2in2", english: "playing" },
  { phonetosoji: "o4tsi2d", english: "outside" },
  { phonetosoji: "a3bo4t", english: "about" },
  { phonetosoji: "ri2tin2", english: "writing" },
  { phonetosoji: "a2", english: "a" },
  { phonetosoji: "letr", english: "letter" },
  { phonetosoji: "she2", english: "she" },
  { phonetosoji: "bot", english: "bought" },
  { phonetosoji: "blo3", english: "blue" },
  { phonetosoji: "do3", english: "do" },
  { phonetosoji: "no2", english: "know" },
  { phonetosoji: "wa2r", english: "where" },
  { phonetosoji: "tha2", english: "they" },
  { phonetosoji: "went", english: "went" },
];

export const seedDictionaryByInput:
  Record<string, string[]> = {};

for (const entry of seedEntries) {
  const key =
    normalizePhonetosojiKey(
      entry.phonetosoji
    );

  seedDictionaryByInput[key] ??= [];

  if (
    !seedDictionaryByInput[key].includes(
      entry.english
    )
  ) {
    seedDictionaryByInput[key].push(
      entry.english
    );
  }
}
