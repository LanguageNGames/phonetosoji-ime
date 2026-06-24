import { phonetosojiToCmuString }
from "./phonetosojiToCmuString";

import {
  findWordsByPronunciation
}
from "../data/cmuPronunciationIndex";

import { applyMarker }
from "./applyMarker";

import { rankCandidates }
from "./rankCandidates";

export function findCandidates(
  input: string
): string[] {

  const [base, marker] =
    input.split("=");

  const phonemes =
    phonetosojiToCmuString(base);
  
  if (marker) {
    const forced =
      applyMarker(
        phonemes,
        marker
      );

    if (forced.length > 0) {
      return forced;
    }
  }

  return rankCandidates(
    findWordsByPronunciation(
      phonemes
    )
  );
}