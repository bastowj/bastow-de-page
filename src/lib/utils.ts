export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isValidSlug(s: string): boolean {
  if (s.includes(":")) {
    return false;
  }
  return /^[a-zA-Z0-9_-]+$/.test(s);
}
