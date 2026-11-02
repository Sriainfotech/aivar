export const metadata = {
  metadataBase: new URL("https://ivarlife.com"),
  title: "AIVAR | Food, supply, gifting and packaging",
  description:
    "AIVAR makes date spreads, makhana and makhana chips, supplies food to corporate, education and government kitchens, and offers corporate food gifting, food packaging and food-industry staffing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
