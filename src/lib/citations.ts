import { Citation, Citations } from "@/constants/citations";

export function getRandomCitation(): Citation {
  const randomIndex = Math.floor(Math.random() * Citations.length);
  return Citations[randomIndex];
}
