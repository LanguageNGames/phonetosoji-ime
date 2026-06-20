export function loadUserFrequency():
Record<string, number> {

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
  localStorage.setItem(
    "userFrequency",
    JSON.stringify(data)
  );
}

export const userFrequency =
  loadUserFrequency();