"use client";

// Renders one section's HTML body verbatim (ported from the AIVAR artifact).
export default function AivarSection({ html }) {
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
