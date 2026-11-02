"use client";

import { AIVAR_CHROME_HEADER } from "../data/aivarChromeHeader";
import { AIVAR_CHROME_FOOTER } from "../data/aivarChromeFooter";

// Shared persistent chrome across every /(site) page: header+nav, cart
// drawer, quick-view modal, search, toast, preloader and other overlays —
// ported verbatim from the AIVAR artifact's <header> and post-</main> markup.
// Each page only supplies its own section content as {children}.
export default function AivarChrome({ children }) {
  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: AIVAR_CHROME_HEADER }} />
      <main id="top">{children}</main>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: AIVAR_CHROME_FOOTER }} />
    </>
  );
}
