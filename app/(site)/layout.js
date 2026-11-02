import Script from "next/script";
import "../styles/aivar-marketing.css";
import AivarChrome from "../components/AivarChrome";

export default function SiteLayout({ children }) {
  return (
    <>
      <AivarChrome>{children}</AivarChrome>
      <Script src="/scripts/aivar-marketing.js" strategy="afterInteractive" />
    </>
  );
}
