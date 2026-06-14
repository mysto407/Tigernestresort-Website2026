"use client";

import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromISO(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
  className?: string;
}

export default function DateField({
  label,
  value,
  onChange,
  min,
  placeholder = "Add date",
  className = "",
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = fromISO(value);
  const minDate = min ? fromISO(min) : startOfDay(new Date());
  const today = startOfDay(new Date());

  const [viewMonth, setViewMonth] = useState<Date>(
    () => selected ?? minDate ?? today
  );

  useEffect(() => {
    if (!open) return;

    const handlePointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const openCalendar = () => {
    setViewMonth(selected ?? minDate ?? today);
    setOpen(true);
  };

  const isDisabled = (day: Date): boolean =>
    minDate ? startOfDay(day) < startOfDay(minDate) : false;

  const selectDay = (day: Date) => {
    if (isDisabled(day)) return;
    onChange(toISO(day));
    setOpen(false);
  };

  // Build the calendar grid for the current view month.
  const monthIndex = viewMonth.getMonth();
  const year = viewMonth.getFullYear();
  const leadingBlanks = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));

  const minMonthStart = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    : null;
  const viewMonthStart = new Date(year, monthIndex, 1);
  const canGoPrev = !minMonthStart || viewMonthStart > minMonthStart;

  const goPrev = () =>
    canGoPrev && setViewMonth(new Date(year, monthIndex - 1, 1));
  const goNext = () => setViewMonth(new Date(year, monthIndex + 1, 1));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openCalendar())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex flex-col gap-0.5 text-left cursor-pointer ${className}`}
      >
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/40">
          {label}
        </span>
        <span className="font-sans text-sm min-w-[4.5rem]">
          {selected ? (
            <span className="text-white">
              {selected.getDate()} {MONTHS_SHORT[selected.getMonth()]}
            </span>
          ) : (
            <span className="text-white/40">{placeholder}</span>
          )}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${label} calendar`}
          className="absolute bottom-full left-0 z-50 mb-4 w-[286px] rounded-3xl border border-white/10 bg-forest-900/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="font-serif text-base tracking-wide text-cream">
              {MONTHS[monthIndex]} {year}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-white/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7">
            {WEEKDAYS.map((w) => (
              <span
                key={w}
                className="py-1 text-center font-mono text-[9px] uppercase tracking-wider text-gold-400/70"
              >
                {w}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <span key={`blank-${i}`} />;

              const disabled = isDisabled(day);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const isToday = isSameDay(day, today);

              const base =
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full font-sans text-sm transition-colors";
              const state = isSelected
                ? "bg-gold-400 font-medium text-forest-900"
                : disabled
                ? "cursor-not-allowed text-white/15"
                : `text-cream/80 hover:bg-white/10 ${isToday ? "ring-1 ring-gold-400/40" : ""}`;

              return (
                <button
                  key={toISO(day)}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={`${base} ${state}`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
