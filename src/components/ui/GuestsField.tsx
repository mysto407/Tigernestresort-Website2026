"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS = [1, 2, 3, 4, 5, 6];
const MAX_GUESTS = 99;

function formatGuests(n: number): string {
  return `${n} ${n === 1 ? "Guest" : "Guests"}`;
}

interface GuestsFieldProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export default function GuestsField({
  label = "Guests",
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = "",
}: GuestsFieldProps) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [draft, setDraft] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isCustomValue = !options.includes(value);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCustomMode(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCustomMode(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggle = () => {
    setCustomMode(false);
    setOpen((prev) => !prev);
  };

  const selectOption = (n: number) => {
    onChange(n);
    setOpen(false);
    setCustomMode(false);
  };

  const enterCustomMode = () => {
    setDraft(isCustomValue ? String(value) : "");
    setCustomMode(true);
  };

  const applyCustom = () => {
    const parsed = Number.parseInt(draft, 10);
    if (!Number.isFinite(parsed) || parsed < 1) return;
    onChange(Math.min(parsed, MAX_GUESTS));
    setOpen(false);
    setCustomMode(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex flex-col gap-0.5 text-left cursor-pointer ${className}`}
      >
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/40">
          {label}
        </span>
        <span className="font-sans text-sm text-white">{formatGuests(value)}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute bottom-full left-0 z-50 mb-4 w-44 rounded-3xl border border-white/10 bg-forest-900/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          {customMode ? (
            <div className="flex flex-col gap-2 p-1">
              <input
                type="number"
                min={1}
                max={MAX_GUESTS}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyCustom();
                }}
                placeholder="Guests"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white outline-none transition-colors focus:border-gold-400/50 [color-scheme:dark]"
              />
              <button
                type="button"
                onClick={applyCustom}
                className="w-full rounded-2xl bg-gold-400 px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-forest-900 transition-colors hover:bg-gold-300"
              >
                Set guests
              </button>
            </div>
          ) : (
            <>
              {options.map((n) => {
                const isSelected = n === value;
                return (
                  <button
                    key={n}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(n)}
                    className={`flex w-full items-center rounded-2xl px-4 py-2.5 font-sans text-sm transition-colors ${
                      isSelected
                        ? "bg-gold-400 font-medium text-forest-900"
                        : "text-cream/80 hover:bg-white/10"
                    }`}
                  >
                    {formatGuests(n)}
                  </button>
                );
              })}

              <div className="my-1 border-t border-white/10" />

              <button
                type="button"
                onClick={enterCustomMode}
                className={`flex w-full items-center rounded-2xl px-4 py-2.5 font-sans text-sm transition-colors ${
                  isCustomValue
                    ? "bg-gold-400 font-medium text-forest-900"
                    : "text-cream/80 hover:bg-white/10"
                }`}
              >
                {isCustomValue ? formatGuests(value) : "Custom…"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
