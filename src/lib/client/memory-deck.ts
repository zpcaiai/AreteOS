"use client";

export interface MemoryCard {
  id: string;
  title: string;
  content: string;
  source?: string;
  added: number;
  ease: number;
  interval: number;
  reps: number;
  due: number;
  lastReview?: number;
}

const KEY = "arete-memory-deck-v1";
const DAY = 86_400_000;

function load(): MemoryCard[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as MemoryCard[];
  } catch {
    return [];
  }
}

function save(deck: MemoryCard[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(deck));
  } catch {
    // Storage quota should not break the UI.
  }
}

export function getDeck() {
  return load();
}

export function addMemoryCard(input: { title: string; content: string; source?: string }) {
  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || !content) return false;
  const deck = load();
  const fingerprint = `${title}\n${content}`.toLowerCase();
  if (deck.some((card) => `${card.title}\n${card.content}`.toLowerCase() === fingerprint)) return false;
  const now = Date.now();
  deck.push({
    id: crypto.randomUUID(),
    title,
    content,
    source: input.source?.trim() || undefined,
    added: now,
    ease: 2.5,
    interval: 0,
    reps: 0,
    due: now,
  });
  save(deck);
  return true;
}

export function removeMemoryCard(id: string) {
  save(load().filter((card) => card.id !== id));
}

export function getDueCards(now = Date.now()) {
  return load()
    .filter((card) => card.due <= now)
    .sort((a, b) => a.due - b.due);
}

export function reviewCard(id: string, quality: 1 | 3 | 5, now = Date.now()) {
  const deck = load();
  const card = deck.find((item) => item.id === id);
  if (!card) return null;
  if (quality < 3) {
    card.reps = 0;
    card.interval = 0;
    card.due = now + 10 * 60 * 1000;
  } else {
    card.reps += 1;
    if (card.reps === 1) card.interval = 1;
    else if (card.reps === 2) card.interval = 3;
    else card.interval = Math.max(1, Math.round(card.interval * card.ease));
    card.ease = Math.max(1.3, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    card.due = now + card.interval * DAY;
  }
  card.lastReview = now;
  save(deck);
  return card;
}

export function deckStats(now = Date.now()) {
  const deck = load();
  return {
    total: deck.length,
    due: deck.filter((card) => card.due <= now).length,
    mature: deck.filter((card) => card.interval >= 21).length,
  };
}

export function nextDueLabel(card: MemoryCard, now = Date.now()) {
  const days = Math.ceil((card.due - now) / DAY);
  if (days <= 0) return "待复习";
  if (days === 1) return "明天";
  return `${days} 天后`;
}

