"use client";

import { useReportWebVitals } from "next/web-vitals";
import * as Sentry from "@sentry/nextjs";

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) + Next's custom
 * hydration/route-change timings. Two sinks, both non-blocking:
 *   1) a Sentry breadcrumb so any captured error carries the page's
 *      recent perf context;
 *   2) a `sendBeacon` to /api/vitals which funnels into the pino/Sentry
 *      server log pipeline (production only).
 * Telemetry never throws into the render path.
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    const m = metric as typeof metric & { rating?: string; navigationType?: string };
    const path = typeof window !== "undefined" ? window.location.pathname : undefined;

    Sentry.addBreadcrumb({
      category: "web-vital",
      level: "info",
      message: metric.name,
      data: { value: Math.round(metric.value), rating: m.rating },
    });

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(`[web-vital] ${metric.name} = ${Math.round(metric.value)} (${m.rating ?? "n/a"})`);
      return;
    }

    try {
      const body = JSON.stringify({
        name: metric.name,
        value: Number(metric.value.toFixed(4)),
        rating: m.rating,
        id: metric.id,
        path,
        navigationType: m.navigationType,
      });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/vitals", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/vitals", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
      }
    } catch {
      /* telemetry must never break the page */
    }
  });
  return null;
}
