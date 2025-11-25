import { getRandomCitation } from "@/lib/citations";

export function RandomCitation() {
  const randomCitation = getRandomCitation();

  return (
    <blockquote className="mt-4 italic border-l-4 border-gray-300 pl-4 text-lg text-gray-700">
      &quot;{randomCitation.text}&quot;
      {randomCitation.author && (
        <cite className="block mt-2 text-right font-normal">
          — {randomCitation.author}
        </cite>
      )}
    </blockquote>
  );
}
