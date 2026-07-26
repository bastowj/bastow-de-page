"use client";

import { useEffect, useState } from "react";
import { Citations } from "@/constants/citations";
import { getRandomCitation } from "@/lib/citations";

export function RandomCitation() {
  // The home page is statically prerendered, so picking on the server would
  // freeze one citation into the build until the next deploy. Render a stable
  // first citation, then pick for real once mounted.
  const [citation, setCitation] = useState(Citations[0]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setCitation(getRandomCitation()), []);

  return (
    <blockquote className="citation">&quot;{citation.text}&quot;</blockquote>
  );
}
