import { AlertTriangle } from "lucide-react";

interface FieldErrorProps {
  message: string;
  id?: string;
}

/**
 * Standardized form field error message.
 * Always includes an icon so color is NOT the sole indicator (WCAG 1.4.1).
 */
export function FieldError({ message, id }: FieldErrorProps) {
  return (
    <div
      id={id}
      role="alert"
      className="flex items-center gap-1.5 mt-1.5"
      aria-live="polite"
    >
      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" aria-hidden="true" />
      <span className="text-xs font-medium text-red-600">{message}</span>
    </div>
  );
}
