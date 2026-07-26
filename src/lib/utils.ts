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
  return /^[a-zA-Z0-9_-]+$/.test(s);
}

/**
 * Convert a category name into a URL-safe slug.
 *
 * Category names are free text, so they can contain spaces, umlauts and
 * punctuation. Percent-encoding them is not viable: Next hands
 * `generateMetadata` and the page component different encoding levels of the
 * same param, so no fixed number of decode calls is correct in both. Slugs
 * avoid the problem by keeping URLs in `[a-z0-9-]`, where encoding is a no-op.
 *
 * @param category - The category name to slugify
 * @returns The slug, or an empty string if nothing URL-safe remains
 */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
