/**
 * Central site metadata used across `metadata` exports, JSON-LD,
 * robots.txt and sitemap.xml. Set NEXT_PUBLIC_SITE_URL once a production
 * domain is connected; falls back to the current Vercel deployment URL
 * (or localhost in dev) so links and canonical tags are always absolute.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
export const siteName = "Nasji Culture";
export const siteDescription =
  "Contemporary fashion rooted in heritage craft. Small-batch, handcrafted kaftans and agbada, made to order.";
