import { homophoneMarkers }
from "../data/homophoneMarkers";

export function applyMarker(
  phonemes: string[],
  marker: string
): string[] {

  const key =
    phonemes.join(" ");

  const group =
    homophoneMarkers[key];

  if (!group) {
    return [];
  }

  const word =
    group[marker];

  return word
    ? [word]
    : [];
}