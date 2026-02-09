/*
 * Utility function to validate if a string is a well-formed URL.
 * @param url - The string to validate as a URL.
 * @returns A boolean indicating whether the input string is a valid URL.
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
}
