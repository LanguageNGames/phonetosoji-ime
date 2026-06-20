export type UserDictionary = {
  [key: string]: string[];
};

const STORAGE_KEY =
  "phonetosoji-user-dictionary";

export function loadUserDictionary(): UserDictionary {
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
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(dictionary)
  );
}