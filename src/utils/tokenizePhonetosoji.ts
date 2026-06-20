export function tokenizePhonetosoji(
  input: string
): string[] {
  const tokens: string[] = [];

  let i = 0;

  const multiCharTokens = [
    "th2",
    "th",
    "sh",
    "ch",

    "a2",
    "a3",
    "e2",
    "i2",
    "o2",
    "o3",
    "o4",
    "o6",
    "u2",
    "r2",
    "r3",
    "n2",
  ];

  while (i < input.length) {
    let matched = false;

    for (const token of multiCharTokens) {
      if (
        input.slice(i, i + token.length) ===
        token
      ) {
        tokens.push(token);
        i += token.length;
        matched = true;
        break;
      }
    }

    if (matched) {
      continue;
    }

    tokens.push(input[i]);
    i++;
  }

  return tokens;
}