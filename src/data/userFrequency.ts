export function loadUserFrequency():
Record<string, number> {
  if (
    typeof localStorage === "undefined"
  ) {
    return {};
  }

  const stored =
    localStorage.getItem(
      "userFrequency"
    );

  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function saveUserFrequency(
  data: Record<string, number>
) {
  if (
    typeof localStorage === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    "userFrequency",
    JSON.stringify(data)
  );
}

export const userFrequency =
  loadUserFrequency();
