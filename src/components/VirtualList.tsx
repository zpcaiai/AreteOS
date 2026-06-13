"use client";

import { useEffect, useRef, useState } from "react";

export default function VirtualList<T>({
  items,
  renderItem,
  keyOf,
  batch = 30,
  estimatedHeight = 160,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyOf?: (item: T, index: number) => React.Key;
  batch?: number;
  estimatedHeight?: number;
}) {
  const [count, setCount] = useState(batch);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(batch);
  }, [items, batch]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || count >= items.length) return;
    if (typeof IntersectionObserver === "undefined") {
      setCount(items.length);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setCount((current) => Math.min(current + batch, items.length));
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, items.length, batch]);

  if (!items.length) return null;
  const visible = items.slice(0, count);

  return (
    <>
      {visible.map((item, index) => (
        <div
          key={keyOf ? keyOf(item, index) : index}
          style={{ contentVisibility: "auto", containIntrinsicSize: `auto ${estimatedHeight}px` }}>
          {renderItem(item, index)}
        </div>
      ))}
      {count < items.length && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}
    </>
  );
}

