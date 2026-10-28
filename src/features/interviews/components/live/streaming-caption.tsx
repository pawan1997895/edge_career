"use client";

import * as React from "react";

/**
 * Reveals a caption word by word while the interviewer speaks.
 * Remount it (via `key`) for each new turn so it starts from the first word.
 */
export function StreamingCaption({ text, streaming }: { text: string; streaming: boolean }) {
  const words = React.useMemo(() => text.split(" "), [text]);
  const [shown, setShown] = React.useState(1);

  React.useEffect(() => {
    if (!streaming) return;
    const id = setInterval(() => setShown((n) => Math.min(words.length, n + 1)), 170);
    return () => clearInterval(id);
  }, [streaming, words.length]);

  return <>{streaming ? words.slice(0, shown).join(" ") : text}</>;
}
