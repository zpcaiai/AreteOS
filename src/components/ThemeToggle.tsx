"use client";

// Dark/light theme toggle. The preference is stored in a cookie so the server
// can render the right theme on first paint (no flash), and mirrored onto
// <html data-theme> for instant switching.

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => { setTheme(readTheme()); }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.cookie = `theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
