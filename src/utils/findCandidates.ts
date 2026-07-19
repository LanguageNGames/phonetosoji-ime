import { phonetosojiToCmuString } from "./phonetosojiToCmuString";

import {
  findWordsByPronunciation,
} from "../data/cmuPronunciationIndex";

import { applyMarker } from "./applyMarker";
import { rankCandidates } from "./rankCandidates";

import {
  parsePhonetosojiToken,
} from "./parsePhonetosojiToken";

import {
  loadUserDictionary,
} from "../data/userDictionary";

import {
  seedDictionaryByInput,
  normalizePhonetosojiKey,
} from "../data/seedDictionary";

export function findCandidates(
  input: string
): string[] {
  const parsed =
    parsePhonetosojiToken(input);

  if (!parsed.core) {
    return [];
  }

  const fullKey =
    parsed.marker &&
    parsed.markerSeparator
      ? `${parsed.core}${parsed.markerSeparator}${parsed.marker}`
      : parsed.core;

  const normalizedFullKey =
    normalizePhonetosojiKey(fullKey);

  const normalizedBaseKey =
    normalizePhonetosojiKey(parsed.core);

  const userDictionary =
    loadUserDictionary();

  const userExact =
    userDictionary[normalizedFullKey];

  if (userExact?.length) {
    return rankCandidates(userExact);
  }

  const seedExact =
    seedDictionaryByInput[
      normalizedFullKey
    ];

  if (seedExact?.length) {
    return rankCandidates(seedExact);
  }

  if (!parsed.marker) {
    const userBase =
      userDictionary[normalizedBaseKey];

    if (userBase?.length) {
      return rankCandidates(userBase);
    }

    const seedBase =
      seedDictionaryByInput[
        normalizedBaseKey
      ];

    if (seedBase?.length) {
      return rankCandidates(seedBase);
    }
  }

  const phonemes =
    phonetosojiToCmuString(
      parsed.core
    );

  if (parsed.marker) {
    const forced =
      applyMarker(
        phonemes,
        parsed.marker
      );

    if (forced.length > 0) {
      return forced;
    }

    const forcedLower =
      applyMarker(
        phonemes,
        parsed.marker.toLowerCase()
      );

    if (forcedLower.length > 0) {
      return forcedLower;
    }
  }

  return rankCandidates(
    findWordsByPronunciation(
      phonemes
    )
  );
}
