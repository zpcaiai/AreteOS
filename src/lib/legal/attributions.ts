// Central attribution + disclaimer copy. Client-safe (no imports).
// Framing rule across the whole product: "inspired by" — never "based on the book"
// or anything implying official authorization, licensing, or endorsement.

export const DISCLAIMER_SHORT =
  "An original system inspired by widely-taught ideas. Not affiliated with, endorsed by, or licensed from any author or rights-holder. Figures shown are factual case studies and do not endorse this product.";

export const DISCLAIMER_LONG =
  "This product is an original software system. It is inspired by general, widely-described concepts in human development, management, cognitive science and strategy — concepts and methods are not protected by copyright. It reproduces no copyrighted text, diagrams, or tables from any book. It is not affiliated with, endorsed by, sponsored by, or licensed from any author, estate, publisher, company, or rights-holder. Real people referenced in the libraries are presented as factual, educational case studies and do not endorse, and are not associated with, this product. Method and book names are referenced descriptively only, to credit the ideas that inspired the work, and remain the property of their respective owners.";

// Each engine credits the ideas it was *inspired by* (not implementations of any work).
export const INSPIRATIONS: { area: string; inspiredBy: string }[] = [
  { area: "Genius / Excellence modeling", inspiredBy: "general concepts of cognitive modeling — logical levels, representational systems, and test–operate–test–exit loops" },
  { area: "Leadership Leverage", inspiredBy: "widely-taught ideas about leadership at different 'logical levels' (environment → mission)" },
  { area: "Management OS", inspiredBy: "widely-taught management ideas: management leverage, knowledge-worker effectiveness, tacit-knowledge capture, and anti-fragility" },
  { area: "Business Scaling (SFM)", inspiredBy: "general ideas of success-factor modeling, organizational alignment, and scalable business systems" },
  { area: "Identity Library", inspiredBy: "the general principle that identity organizes long-term behavior — an original architecture, not a personality test" },
];
