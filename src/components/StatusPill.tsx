interface StatusPillProps {
  status: "success" | "pending" | "info" | "error" | "active";
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusPillProps["status"],
  { dot: string; label: string }
> = {
  success: { dot: "bg-emerald-500", label: "Success" },
  pending: { dot: "bg-amber-400",   label: "Pending" },
  info:    { dot: "bg-blue-500",    label: "Info" },
  error:   { dot: "bg-red-500",     label: "Error" },
  active:  { dot: "bg-emerald-500", label: "Active" },
};

/**
 * Pill-shaped status badge. Uses color + label text (not color alone) — WCAG 1.4.1.
 * Replace all raw status dots and colored spans with this component.
 */
export function StatusPill({ status, label, className = "" }: StatusPillProps) {
  const { dot, label: defaultLabel } = STATUS_CONFIG[status];
  const displayLabel = label ?? defaultLabel;

  return (
    <span
      className={`status-pill status-${status} ${className}`}
      aria-label={`Status: ${displayLabel}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${dot} shrink-0`}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  );
}
