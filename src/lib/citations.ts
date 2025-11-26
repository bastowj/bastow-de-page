import { Citation, Citations } from "@/constants/citations";
/**
 * Get a random citation from the list of citations
 *
 * @returns {Citation} A random citation
 */
export function getRandomCitation(): Citation {
  const randomIndex = Math.floor(Math.random() * Citations.length);
  return Citations[randomIndex];
}
