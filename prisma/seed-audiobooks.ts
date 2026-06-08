// MISSION OS — 听书成长 Audiobook catalog seed: 16 entries.
// COPYRIGHT-SAFE: copyrighted books are catalog-only (metadata + ORIGINAL summary, no file).
// Public-domain works include playable text. Idempotent (upsert by slug). `npm run db:seed`.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BOOKS = [
  {
    "slug": "strategies-of-genius",
    "title": "Strategies of Genius (concept)",
    "author": "R. Dilts (idea)",
    "relatedModule": "Genius Library",
    "inspiredByNote": "Inspired by the general idea of modeling how exceptional people think.",
    "summary": "An exploration of how to model the thinking patterns, beliefs and strategies of exceptional individuals so others can learn them.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "from-coach-to-awakener",
    "title": "From Coach to Awakener (concept)",
    "author": "R. Dilts (idea)",
    "relatedModule": "Leadership Leverage",
    "inspiredByNote": "Inspired by the idea of leadership across logical levels.",
    "summary": "Frames leadership as a progression of roles — caretaker, guide, coach, mentor, sponsor, awakener — each operating at a higher leverage level.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "high-output-management",
    "title": "High Output Management (concept)",
    "author": "A. Grove (idea)",
    "relatedModule": "Management OS",
    "inspiredByNote": "Inspired by the idea of managerial leverage.",
    "summary": "Treats a manager's output as the output of their team and argues for spending time on the highest-leverage activities.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "the-effective-executive",
    "title": "The Effective Executive (concept)",
    "author": "P. Drucker (idea)",
    "relatedModule": "Management OS",
    "inspiredByNote": "Inspired by the idea of effectiveness and contribution.",
    "summary": "Argues effectiveness is a learnable discipline: focus on contribution, concentrate on the vital few, and build on strengths.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "the-knowledge-creating-company",
    "title": "The Knowledge-Creating Company (concept)",
    "author": "I. Nonaka (idea)",
    "relatedModule": "Management OS",
    "inspiredByNote": "Inspired by the SECI tacit-knowledge idea.",
    "summary": "Describes how organizations convert tacit individual knowledge into explicit shared assets through cycles of socialization, externalization, combination and internalization.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "antifragile",
    "title": "Antifragile (concept)",
    "author": "N. Taleb (idea)",
    "relatedModule": "Cognitive OS",
    "inspiredByNote": "Inspired by the idea of gaining from disorder.",
    "summary": "Distinguishes the fragile, the robust and the antifragile — systems that improve under stress and volatility.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "thinking-fast-and-slow",
    "title": "Thinking, Fast and Slow (concept)",
    "author": "D. Kahneman (idea)",
    "relatedModule": "Cognitive OS",
    "inspiredByNote": "Inspired by the idea of two systems of thinking and cognitive bias.",
    "summary": "Contrasts fast intuitive thinking with slow deliberate reasoning and catalogs the biases that distort judgment.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "poor-charlies-almanack",
    "title": "Poor Charlie's Almanack (concept)",
    "author": "C. Munger (idea)",
    "relatedModule": "Cognitive OS",
    "inspiredByNote": "Inspired by the latticework-of-models idea.",
    "summary": "Advocates building a latticework of mental models from many disciplines and reasoning by inversion to avoid error.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "good-strategy-bad-strategy",
    "title": "Good Strategy Bad Strategy (concept)",
    "author": "R. Rumelt (idea)",
    "relatedModule": "Cognitive OS",
    "inspiredByNote": "Inspired by the idea of diagnosis-first strategy.",
    "summary": "Argues good strategy starts with an honest diagnosis, a guiding policy, and coherent action — not goals and slogans.",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "mindset",
    "title": "Mindset (concept)",
    "author": "C. Dweck (idea)",
    "relatedModule": "Genius Kids",
    "inspiredByNote": "Inspired by the growth-mindset idea.",
    "summary": "Contrasts a fixed mindset (ability is static) with a growth mindset (ability grows with effort and strategy).",
    "textContent": "",
    "sourceType": "CATALOG",
    "isPublicDomain": false
  },
  {
    "slug": "the-montessori-method",
    "title": "The Montessori Method",
    "author": "M. Montessori",
    "relatedModule": "Genius Kids",
    "inspiredByNote": "Public-domain text; inspired the prepared-environment idea.",
    "summary": "An early account of child-led learning in a carefully prepared environment that supports independence and concentration.",
    "textContent": "The Montessori Method emphasizes preparing an environment in which the child can act, choose and concentrate freely. The adult's role is to observe and to remove obstacles, not to direct every action. When children are given freedom within thoughtful limits, they reveal a deep capacity for self-directed work and joyful concentration.",
    "sourceType": "PUBLIC_DOMAIN",
    "isPublicDomain": true
  },
  {
    "slug": "the-nicomachean-ethics",
    "title": "The Nicomachean Ethics",
    "author": "Aristotle",
    "relatedModule": "Worldview OS",
    "inspiredByNote": "Public-domain; inspired the first-causes and virtue ideas.",
    "summary": "A foundational inquiry into the good life, virtue as a mean between extremes, and happiness as activity of the soul in accordance with virtue.",
    "textContent": "Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good; and for this reason the good has rightly been declared to be that at which all things aim. Virtue, then, is a state of character concerned with choice, lying in a mean relative to us.",
    "sourceType": "PUBLIC_DOMAIN",
    "isPublicDomain": true
  },
  {
    "slug": "the-adventures-of-sherlock-holmes",
    "title": "The Adventures of Sherlock Holmes",
    "author": "A. Conan Doyle",
    "relatedModule": "Genius Library",
    "inspiredByNote": "Public-domain; inspired the observation-and-deduction model.",
    "summary": "Detective stories illustrating disciplined observation of detail and reasoning from evidence to the single explanation that fits.",
    "textContent": "It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts. The world is full of obvious things which nobody by any chance ever observes.",
    "sourceType": "PUBLIC_DOMAIN",
    "isPublicDomain": true
  },
  {
    "slug": "the-notebooks-of-leonardo-da-vinci",
    "title": "The Notebooks of Leonardo da Vinci",
    "author": "Leonardo da Vinci",
    "relatedModule": "Genius Library",
    "inspiredByNote": "Public-domain; inspired saper-vedere observation.",
    "summary": "Leonardo's collected observations on art, nature, anatomy and engineering — a model of learning to truly see and testing ideas against experience.",
    "textContent": "Experience does not err; only your judgments err by expecting from her what is not in her power. Learn how to see. Realize that everything connects to everything else.",
    "sourceType": "PUBLIC_DOMAIN",
    "isPublicDomain": true
  },
  {
    "slug": "the-art-of-war",
    "title": "The Art of War",
    "author": "Sun Tzu",
    "relatedModule": "Cognitive OS",
    "inspiredByNote": "Public-domain; inspired strategic positioning.",
    "summary": "An ancient treatise on strategy: win by position, timing and knowing both yourself and the situation before the contest begins.",
    "textContent": "If you know the enemy and know yourself, you need not fear the result of a hundred battles. The supreme art of war is to subdue the enemy without fighting.",
    "sourceType": "PUBLIC_DOMAIN",
    "isPublicDomain": true
  },
  {
    "slug": "meditations",
    "title": "Meditations",
    "author": "Marcus Aurelius",
    "relatedModule": "Worldview OS",
    "inspiredByNote": "Public-domain; inspired reflection and responsibility.",
    "summary": "Private notes of a Roman emperor on self-discipline, responsibility, and living according to reason and nature.",
    "textContent": "You have power over your mind — not outside events. Realize this, and you will find strength. The happiness of your life depends upon the quality of your thoughts.",
    "sourceType": "PUBLIC_DOMAIN",
    "isPublicDomain": true
  }
] as const;

type Src = "CATALOG" | "PUBLIC_DOMAIN" | "USER_UPLOAD";

async function main() {
  for (const b of BOOKS) {
    await prisma.audioBook.upsert({
      where: { slug: b.slug },
      update: { title: b.title, author: b.author, relatedModule: b.relatedModule, inspiredByNote: b.inspiredByNote, summary: b.summary, textContent: b.textContent, sourceType: b.sourceType as Src, isPublicDomain: b.isPublicDomain, format: "TEXT" },
      create: { slug: b.slug, title: b.title, author: b.author, relatedModule: b.relatedModule, inspiredByNote: b.inspiredByNote, summary: b.summary, textContent: b.textContent, sourceType: b.sourceType as Src, isPublicDomain: b.isPublicDomain, format: "TEXT" },
    });
  }
  console.log(`Seeded ${BOOKS.length} audiobook catalog entries.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
