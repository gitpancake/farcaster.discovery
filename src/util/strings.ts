// format this string to have commas 32 750 197

export function replaceSpacesWithCommas(str: string): string {
  return str.replace(/\s/g, ",");
}

// remove all spaces from string
export function removeSpaces(str: string): string {
  return str.replace(/\s/g, "");
}
