export const dynamic = "force-static";

const BASE_URL = "https://ivarlife.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/operations"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
