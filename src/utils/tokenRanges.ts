export type TokenRange = {
  index: number;
  start: number;
  end: number;
  text: string;
};

export function getTokenRanges(
  text: string
): TokenRange[] {
  const ranges: TokenRange[] = [];
  const regex = /\S+/g;

  let match: RegExpExecArray | null;

  while (
    (match = regex.exec(text)) !== null
  ) {
    ranges.push({
      index: ranges.length,
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }

  return ranges;
}

export function getActiveTokenIndex(
  text: string,
  cursorPosition: number
): number {
  const ranges =
    getTokenRanges(text);

  if (ranges.length === 0) {
    return 0;
  }

  const insideToken =
    ranges.find(
      (range) =>
        cursorPosition >= range.start &&
        cursorPosition <= range.end
    );

  if (insideToken) {
    return insideToken.index;
  }

  const nextTokenIndex =
    ranges.findIndex(
      (range) =>
        cursorPosition < range.start
    );

  if (nextTokenIndex === -1) {
    return ranges.length - 1;
  }

  return Math.max(
    0,
    nextTokenIndex - 1
  );
}

export function replaceTokenAtIndex(
  text: string,
  tokenIndex: number,
  replacement: string
): string {
  const ranges =
    getTokenRanges(text);

  const range =
    ranges[tokenIndex];

  if (!range) {
    return text;
  }

  return (
    text.slice(0, range.start) +
    replacement +
    text.slice(range.end)
  );
}
