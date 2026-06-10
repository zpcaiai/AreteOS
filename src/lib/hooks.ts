"use client";

// Small data-layer hooks over @tanstack/react-query so client components get
// caching, deduping, and focus-revalidation without hand-rolled useEffect+fetch.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as T;
}

/** GET with caching keyed by URL. */
export function useApi<T>(url: string | null, options: { refetchMs?: number } = {}) {
  return useQuery<T>({
    queryKey: [url],
    queryFn: () => fetchJson<T>(url as string),
    enabled: url !== null,
    refetchInterval: options.refetchMs,
  });
}

/** JSON mutation that invalidates the given GET urls on success. */
export function useApiMutation<TBody, TResult = unknown>(
  url: string,
  options: { method?: "POST" | "PATCH" | "DELETE"; invalidate?: string[] } = {},
) {
  const qc = useQueryClient();
  return useMutation<TResult, Error, TBody>({
    mutationFn: async (body: TBody) => {
      const res = await fetch(url, {
        method: options.method ?? "POST",
        headers: { "content-type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
      return data as TResult;
    },
    onSuccess: () => {
      for (const u of options.invalidate ?? []) qc.invalidateQueries({ queryKey: [u] });
    },
  });
}
