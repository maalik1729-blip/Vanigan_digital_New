import { StatusPill } from "@/components/StatusPill";

interface ActivityCardProps {
  date: string;
  title: string;
  subtitle: string;
  status: "success" | "pending" | "info" | "error";
}

/**
 * Mobile-optimized activity item card.
 * Replaces the HTML <table> row on screens < 768px.
 */
export function ActivityCard({ date, title, subtitle, status }: ActivityCardProps) {
  return (
    <div className="py-3.5 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-snug">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed truncate">{subtitle}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <StatusPill status={status} />
        <span className="text-xs text-slate-400 font-mono tabular-nums">{date}</span>
      </div>
    </div>
  );
}
