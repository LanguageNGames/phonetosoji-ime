export const userDictionary:
Record<string, string> =
  JSON.parse(
    localStorage.getItem(
      "userDictionary"
    ) ?? "{}"
  );

export function saveUserDictionary() {
  localStorage.setItem(
    "userDictionary",
    JSON.stringify(
      userDictionary
    )
  );
}