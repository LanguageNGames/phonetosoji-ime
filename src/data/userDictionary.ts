export type UserDictionary = {
  [key: string]: string[];
};

const STORAGE_KEY =
  "phonetosoji-user-dictionary";

export function loadUserDictionary():
UserDictionary {
  if (
    typeof localStorage === "undefined"
  ) {
    return {};
  }

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

export function saveUserDictionary(
  dictionary: UserDictionary
) {
  if (
    typeof localStorage === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(dictionary)
  );
}
