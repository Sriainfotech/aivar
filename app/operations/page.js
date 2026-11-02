import Script from "next/script";
import "../styles/aivar-ops.css";
import AivarOpsApp from "../components/AivarOpsApp";

export const metadata = {
  title: "AIVAR Operations | Inventory, sales and vendor invoices",
  robots: { index: false, follow: false },
};

export default function OperationsPage() {
  return (
    <>
      <AivarOpsApp />
      <Script src="/scripts/aivar-ops.js" strategy="afterInteractive" />
    </>
  );
}
