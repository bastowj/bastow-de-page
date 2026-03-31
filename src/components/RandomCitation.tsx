import { getRandomCitation } from "@/lib/citations";

export function RandomCitation() {
  const randomCitation = getRandomCitation();

  return (
    <blockquote className="citation">
      &quot;{randomCitation.text}&quot;
    </blockquote>
  );
}
