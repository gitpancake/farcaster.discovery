const CITY_OVERRIDES: Record<string, string> = {
  "Cote d'Azur": "CAZ",
};

function normalizeCityName(city: string): string {
  return city
    .normalize("NFD") // decompose accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-zA-Z\s-]/g, "") // remove non-alpha except dash/space
    .replace(/\s+/g, " ") // condense whitespace
    .trim();
}

export function cityToCode(city: string): string {
  const cleanCity = normalizeCityName(city);

  // Check overrides
  const override = CITY_OVERRIDES[cleanCity];
  if (override) return override;

  const parts = cleanCity.split(/[\s-]+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }

  if (parts.length === 2) {
    return parts
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase(); // First letters
  }

  // Multi-word: use first letter of each of first 3 words
  return parts
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}
