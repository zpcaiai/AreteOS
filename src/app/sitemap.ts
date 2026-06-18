import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arete.app";

// Public, non-personalised routes (exclude /api, /admin, /login, dynamic [id]).
const ROUTES = [
  "/", "/dashboard", "/start", "/onboarding", "/journey", "/growth-map", "/coach", "/skills",
  "/about", "/about/attributions",
  "/council", "/future-self", "/narrative", "/evidence", "/experiments", "/graph",
  "/growth-protocol", "/bottlenecks", "/prescriptions", "/boardroom",
  "/personal-os", "/specific-knowledge", "/deep-work", "/identity-tree", "/assets", "/life-capital",
  "/cosmos", "/cosmos/archetypes", "/cosmos/constellation", "/cosmos/dashboard",
  "/telos", "/ethos", "/ethos/archetypes", "/ethos/assessment", "/ethos/evolution", "/ethos/families", "/ethos/stack",
  "/phronesis", "/phronesis/dashboard", "/phronesis/models",
  "/genius", "/genius-strategies", "/archon", "/archon/dashboard",
  "/oikos", "/oikos/dashboard", "/praxis", "/praxis/dashboard",
  "/mnemosyne", "/community", "/emporion", "/membership",
  "/identity", "/values", "/beliefs", "/models", "/decisions", "/psychology", "/role-models",
  "/habits", "/mastery", "/legacy", "/timeline", "/twin", "/reflection", "/reviews",
  "/learning-path", "/adaptation", "/memory-deck",
  "/naval", "/naval/dashboard", "/naval/onboarding", "/naval/plan", "/naval/specific-knowledge",
  "/naval/talent-stack", "/naval/leverage", "/naval/judgment", "/naval/decision-journal",
  "/naval/wealth", "/naval/assets", "/naval/opportunities", "/naval/long-term-games",
  "/naval/freedom", "/naval/happiness", "/naval/life-portfolio", "/naval/twin",
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
