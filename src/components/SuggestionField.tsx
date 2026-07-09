"use client";

import { useId } from "react";

type Suggestion = string | { label: string; value: string };

function itemLabel(item: Suggestion) {
  return typeof item === "string" ? item : item.label;
}

function itemValue(item: Suggestion) {
  return typeof item === "string" ? item : item.value;
}

export function SuggestionChips({
  suggestions,
  value,
  onChange,
  mode = "replace",
  separator = "\n",
  label = "可选输入",
}: {
  suggestions: Suggestion[];
  value: string;
  onChange: (next: string) => void;
  mode?: "replace" | "append";
  separator?: string;
  label?: string;
}) {
  if (!suggestions.length) return null;

  function apply(next: string) {
    if (mode === "append" && value.trim()) {
      onChange(`${value.trimEnd()}${separator}${next}`);
      return;
    }
    onChange(next);
  }

  return (
    <div className="mt-2" aria-label={label}>
      <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => {
          const next = itemValue(item);
          const active = value.trim() === next.trim();
          return (
            <button
              key={`${itemLabel(item)}-${next}`}
              type="button"
              onClick={() => apply(next)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 text-left text-xs leading-5 transition ${
                active
                  ? "border-amber-300/70 bg-amber-400/10 text-amber-100"
                  : "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-amber-400/60 hover:text-slate-100"
              }`}>
              {itemLabel(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SuggestionField({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
  as = "textarea",
  rows = 2,
  type = "text",
  maxLength,
  disabled,
  className,
  chipLabel,
  chipMode = "replace",
  chipSeparator,
}: {
  value: string;
  onChange: (next: string) => void;
  suggestions: Suggestion[];
  placeholder?: string;
  label?: string;
  as?: "input" | "textarea";
  rows?: number;
  type?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  chipLabel?: string;
  chipMode?: "replace" | "append";
  chipSeparator?: string;
}) {
  const generatedId = useId();
  const inputClass = className ?? "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200";

  return (
    <div>
      {label && <label htmlFor={generatedId} className="text-sm text-slate-300">{label}</label>}
      {as === "textarea" ? (
        <textarea
          id={generatedId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={inputClass}
        />
      ) : (
        <input
          id={generatedId}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={inputClass}
        />
      )}
      <SuggestionChips
        suggestions={suggestions}
        value={value}
        onChange={onChange}
        mode={chipMode}
        separator={chipSeparator}
        label={chipLabel}
      />
    </div>
  );
}
