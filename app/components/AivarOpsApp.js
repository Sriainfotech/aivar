"use client";

import { AIVAR_OPS_BODY } from "../data/aivarOpsBody";

// Ported near-verbatim from the "AIVAR Operations | Inventory, sales and
// vendor invoices" HTML artifact. public/scripts/aivar-ops.js (unmodified)
// runs after mount and already falls back to localStorage-only persistence
// outside a Claude Artifact (it checks for window.claude before trying
// claude.use("db")), so no patching was needed for that part.
export default function AivarOpsApp() {
  return <div dangerouslySetInnerHTML={{ __html: AIVAR_OPS_BODY }} />;
}
