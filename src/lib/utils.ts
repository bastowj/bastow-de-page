/**
 * Format a date string to a more readable format
 *
 * @param dateString - The date string to format
 * @returns The formatted date string
 */

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
/**
 * Check if a string is a valid slug
 *
 * @param s - The string to check
 * @returns `true` if the string is a valid slug, `false` otherwise
 */
export function isValidSlug(s: string): boolean {
  if (s.includes(":")) {
    return false;
  }
  return /^[a-zA-Z0-9_-]+$/.test(s);
}
