"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Replays a subtle entrance animation on each route change (respects
 *  prefers-reduced-motion via the .page-enter CSS). */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
