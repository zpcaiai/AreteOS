import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arete.app";

// Public, non-personalised routes (exclude /api, /admin, /login, dynamic [id]).
const ROUTES = [
  "/", "/dashboard", "/about", "/about/attributions",
  "/cosmos", "/cosmos/archetypes", "/cosmos/dashboard",
  "/telos", "/ethos", "/ethos/archetypes", "/ethos/assessment",
  "/ethos/evolution", "/ethos/families", "/ethos/stack",
  "/phronesis", "/phronesis/dashboard", "/phronesis/models",
  "/genius", "/genius-strategies", "/archon", "/archon/dashboard",
  "/oikos", "/oikos/dashboard", "/praxis", "/praxis/dashboard",
  "/mnemosyne", "/community", "/emporion", "/membership",
  "/identity", "/values", "/beliefs", "/models", "/decisions",
  "/habits", "/mastery", "/legacy", "/timeline", "/twin",
  "/reflection", "/reviews", "/role-models", "/learning-path",
  "/adaptation",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/dashboard" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/dashboard" ? 0.9 : 0.6,
  }));
}
