export const dynamic = "force-static";

const BASE_URL = "https://ivarlife.com";

export default function sitemap() {
  return [{ url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: new Date() }];
}
