export type ParsedPhonetosojiToken = {
  raw: string;
  prefix: string;
  core: string;
  marker?: string;
  markerSeparator?: "=" | "/";
  suffix: string;
};

export function parsePhonetosojiToken(
  raw: string
): ParsedPhonetosojiToken {
  const match = raw.match(
    /^([("'“‘\[]*)(.*?)([.,!?;:)"'”’\]]*)$/u
  );

  const prefix =
    match?.[1] ?? "";

  const body =
    match?.[2] ?? raw;

  const suffix =
    match?.[3] ?? "";

  const equalsIndex =
    body.indexOf("=");

  const slashIndex =
    body.indexOf("/");

  let markerIndex = -1;
  let markerSeparator:
    | "="
    | "/"
    | undefined;

  if (
    equalsIndex >= 0 &&
    slashIndex >= 0
  ) {
    markerIndex =
      Math.min(
        equalsIndex,
        slashIndex
      );

    markerSeparator =
      equalsIndex < slashIndex
        ? "="
        : "/";
  } else if (equalsIndex >= 0) {
    markerIndex = equalsIndex;
    markerSeparator = "=";
  } else if (slashIndex >= 0) {
    markerIndex = slashIndex;
    markerSeparator = "/";
  }

  if (
    markerIndex >= 0 &&
    markerSeparator
  ) {
    return {
      raw,
      prefix,
      core: body
        .slice(0, markerIndex)
        .toLowerCase(),
      marker: body.slice(
        markerIndex + 1
      ),
      markerSeparator,
      suffix,
    };
  }

  return {
    raw,
    prefix,
    core: body.toLowerCase(),
    suffix,
  };
}

function matchInputCapitalization(
  rawInputToken: string,
  replacement: string
): string {
  const parsed =
    parsePhonetosojiToken(
      rawInputToken
    );

  const visibleInput =
    rawInputToken.slice(
      parsed.prefix.length,
      rawInputToken.length -
        parsed.suffix.length
    );

  const letters =
    visibleInput.match(/[A-Za-z]/g)
      ?.join("") ?? "";

  if (
    letters.length > 1 &&
    letters === letters.toUpperCase()
  ) {
    return replacement.toUpperCase();
  }

  const firstLetter =
    visibleInput.match(/[A-Za-z]/)?.[0];

  if (
    firstLetter &&
    firstLetter ===
      firstLetter.toUpperCase()
  ) {
    return (
      replacement.charAt(0).toUpperCase() +
      replacement.slice(1)
    );
  }

  return replacement;
}

export function applyOriginalPunctuation(
  rawInputToken: string,
  replacement: string
): string {
  const parsed =
    parsePhonetosojiToken(
      rawInputToken
    );

  const caseAdjusted =
    matchInputCapitalization(
      rawInputToken,
      replacement
    );

  return `${parsed.prefix}${caseAdjusted}${parsed.suffix}`;
}
