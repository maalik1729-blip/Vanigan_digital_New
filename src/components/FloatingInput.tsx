import { useState, useId } from "react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

interface FloatingSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
}

// ─── Shared floating label logic ──────────────────────────────────────────────

function useFloatingLabel(externalValue?: string | number | readonly string[]) {
  const [focused, setFocused] = useState(false);
  const hasValue = externalValue !== undefined && externalValue !== "";
  const floated = focused || hasValue;
  return { focused, setFocused, floated };
}

// ─── Text / Email / Number / Tel input ───────────────────────────────────────

export function FloatingInput({ label, error, success, value, onChange, className = "", ...props }: FloatingInputProps) {
  const id = useId();
  const { focused, setFocused, floated } = useFloatingLabel(value);

  const borderColor = error
    ? "border-red-400"
    : success
    ? "border-emerald-400"
    : focused
    ? "border-primary"
    : "border-slate-200";

  const ringColor = error
    ? "ring-red-400/15"
    : focused
    ? "ring-primary/10"
    : "ring-transparent";

  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "   /* space keeps :placeholder-shown working */
        className={[
          "peer w-full bg-white border rounded-xl px-4 pt-[22px] pb-[10px]",
          "text-base md:text-sm font-medium text-slate-800 outline-none min-h-[56px]",
          "transition-all duration-200",
          `${borderColor} ring-4 ${ringColor}`,
          className,
        ].join(" ")}
        {...props}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className={[
          `absolute ${className.includes("pl-") ? "left-10" : "left-4"} font-medium pointer-events-none select-none`,
          "transition-all duration-200 ease-in-out",
          floated
            ? "top-[8px] text-[10px] tracking-wide font-semibold " +
              (error ? "text-red-500" : focused ? "text-primary" : "text-slate-400")
            : "top-[17px] text-sm text-slate-400",
        ].join(" ")}
      >
        {label}
      </label>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}

// ─── Textarea variant ─────────────────────────────────────────────────────────

export function FloatingTextarea({ label, error, value, onChange, className = "", ...props }: FloatingTextareaProps) {
  const id = useId();
  const { focused, setFocused, floated } = useFloatingLabel(value as string);

  const borderColor = error
    ? "border-red-400"
    : focused
    ? "border-primary"
    : "border-slate-200";

  const ringColor = error ? "ring-red-400/15" : focused ? "ring-primary/10" : "ring-transparent";

  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className={[
          "peer w-full bg-white border rounded-xl px-4 pt-[26px] pb-[10px]",
          "text-base md:text-sm font-medium text-slate-800 outline-none resize-none",
          "transition-all duration-200",
          `${borderColor} ring-4 ${ringColor}`,
          className,
        ].join(" ")}
        {...props}
      />
      <label
        htmlFor={id}
        className={[
          `absolute ${className.includes("pl-") ? "left-10" : "left-4"} font-medium pointer-events-none select-none`,
          "transition-all duration-200 ease-in-out",
          floated
            ? "top-[8px] text-[10px] tracking-wide font-semibold " +
              (error ? "text-red-500" : focused ? "text-primary" : "text-slate-400")
            : "top-[18px] text-sm text-slate-400",
        ].join(" ")}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}

// ─── Select variant ───────────────────────────────────────────────────────────

export function FloatingSelect({ label, error, value, onChange, children, className = "", ...props }: FloatingSelectProps) {
  const id = useId();
  const { focused, setFocused, floated } = useFloatingLabel(value);

  const borderColor = error
    ? "border-red-400"
    : focused
    ? "border-primary"
    : "border-slate-200";

  const ringColor = error ? "ring-red-400/15" : focused ? "ring-primary/10" : "ring-transparent";

  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={[
          "w-full bg-white border rounded-xl px-4 pt-[22px] pb-[10px]",
          "text-base md:text-sm font-medium text-slate-800 outline-none min-h-[56px]",
          "transition-all duration-200 appearance-none cursor-pointer",
          `${borderColor} ring-4 ${ringColor}`,
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>

      {/* Always-floated label for selects (they always have a value) */}
      <label
        htmlFor={id}
        className={[
          `absolute ${className.includes("pl-") ? "left-10" : "left-4"} font-semibold pointer-events-none select-none`,
          "transition-all duration-200 top-[8px] text-[10px] tracking-wide",
          focused ? "text-primary" : "text-slate-400",
        ].join(" ")}
      >
        {label}
      </label>

      {/* Custom chevron */}
      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>

      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}
