import { getRandomCitation } from "@/lib/citations";

export function RandomCitation() {
  const randomCitation = getRandomCitation();

  return (
    <blockquote className="citation">
      &quot;{randomCitation.text}&quot;
      {randomCitation.author && (
        <footer className="citation-footer">
          — {randomCitation.author}
        </footer>
      )}
    </blockquote>
  );
}
