import { cn } from "@/lib/utils";

/**
 * SonicScribe mark — five recording-level bars whose tall centre bar and short
 * crossbar form a medical cross.
 *
 * Single colour by design: it inherits `currentColor`, so the same geometry
 * serves the header, the favicon and one-colour print without a second file.
 * Canonical source: /brand/logo.svg — keep the two in sync.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="26" width="6" height="12" rx="3" />
      <rect x="16" y="22" width="6" height="20" rx="3" />
      <rect x="29" y="7" width="6" height="50" rx="3" />
      <rect x="42" y="22" width="6" height="20" rx="3" />
      <rect x="52" y="26" width="6" height="12" rx="3" />
      <rect x="24.5" y="29" width="15" height="6" rx="3" />
    </svg>
  );
}

/**
 * Mark + wordmark lock-up. `markClassName` sizes the mark; the wordmark inherits
 * the surrounding text colour so the pair always reads as one unit.
 */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "font-heading text-xl font-semibold tracking-tight",
          wordmarkClassName
        )}
      >
        SonicScribe<span className="font-light"> AI</span>
      </span>
    </span>
  );
}
