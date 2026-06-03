import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Generic empty state component.
 * Use when a list, search, or table has zero results.
 */
export function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center px-4"
      aria-live="polite"
    >
      <div
        className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">{subtitle}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
