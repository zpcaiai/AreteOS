"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/client/telemetry";

/** Emits a page_view whenever the route changes. Mounted once globally in Providers. */
export default function Telemetry() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    track("page_view", { path: pathname });
  }, [pathname]);
  return null;
}
