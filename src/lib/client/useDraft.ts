"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function hasContent(value: unknown) {
  if (typeof value === "string") return value.trim().length > 0;
  if (value && typeof value === "object") {
    return Object.values(value).some((v) => typeof v === "string" && v.trim().length > 0);
  }
  return false;
}

export function useDraft<T>(key: string, value: T, setValue: (value: T) => void, delay = 800) {
  const [savedHint, setSavedHint] = useState(false);
  const restoredRef = useRef(false);
  const skipFirstSaveRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      if (typeof value === "string") {
        if (!value.trim()) setValue(raw as T);
      } else if (value && typeof value === "object" && !hasContent(value)) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setValue(parsed as T);
      }
    } catch {
      // Corrupt drafts are ignored.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        if (hasContent(value)) {
          localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
          setSavedHint(true);
          if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
          hintTimerRef.current = setTimeout(() => setSavedHint(false), 2000);
        } else {
          localStorage.removeItem(key);
        }
      } catch {
        // Storage is progressive enhancement.
      }
    }, delay);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [key, value, delay]);

  useEffect(
    () => () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    },
    [],
  );

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
    setSavedHint(false);
  }, [key]);

  return { savedHint, clearDraft };
}

