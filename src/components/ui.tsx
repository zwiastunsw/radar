import React from "react";
import { cn } from "../utils/scoring";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--brand-light)] px-2.5 py-1 text-xs text-[var(--text-main)]">
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  subtext,
}: {
  children: React.ReactNode;
  subtext?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--text-main)]">
        {children}
      </h2>
      {subtext ? (
        <p className="mt-1 text-sm text-[var(--text-muted)]">{subtext}</p>
      ) : null}
    </div>
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function ProgressBar({
  total,
  done,
}: {
  total: number;
  done: number;
}) {
  const percent = total > 0 ? clampPercent((done / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1 text-xs text-[var(--text-muted)]">
        {done} / {total}
      </div>

      <div
        role="progressbar"
        aria-label="Postęp"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.max(0, Math.min(done, total))}
        aria-valuetext={`${done} z ${total}`}
        className="h-2 w-full rounded-full bg-[var(--brand-light)]"
      >
        <div
          className="h-2 rounded-full bg-[var(--brand)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}