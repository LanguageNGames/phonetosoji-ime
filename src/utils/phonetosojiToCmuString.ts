import {
  phonetosojiExceptions
}
from "../data/phonetosojiExceptions";
import { phonetosojiToCmu }
from "../data/phonetosojiToCmu";

import { tokenizePhonetosoji }
from "./tokenizePhonetosoji";

export function phonetosojiToCmuString(
  input: string
): string[] {
  const exception =
    phonetosojiExceptions[
      input.toLowerCase()
    ];

  if (exception) {
    return exception;
  }

  const tokens =
    tokenizePhonetosoji(
      input.toLowerCase()
    );

  return tokens.flatMap((token) => {
    const phoneme =
      phonetosojiToCmu[token];

    if (!phoneme) {
      return [];
    }

    return phoneme.split(" ");
  });
}