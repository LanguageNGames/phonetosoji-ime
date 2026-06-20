export function replaceWord(
  text: string,
  wordIndex: number,
  replacement: string
): string {
  const words = text.split(/\s+/);

  if (
    wordIndex < 0 ||
    wordIndex >= words.length
  ) {
    return text;
  }

  words[wordIndex] = replacement;

  return words.join(" ");
}