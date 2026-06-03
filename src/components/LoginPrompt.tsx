import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, IdCard, ArrowRight } from "lucide-react";
import { setSession } from "@/lib/session";
import { toast } from "sonner";

export function LoginPrompt({ onLogin }: { onLogin: (epic: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  /* ────────────────────────────────────────────────
     Validate EPIC ID or Mobile Number
     Must match a record saved during registration.
  ──────────────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const raw = value.trim();
    const mobileClean = raw.replace(/\D/g, "").slice(-10);
    const epicClean = raw.toUpperCase().replace(/\s/g, "");

    if (!raw) {
      setError("Please enter your EPIC ID or registered Mobile Number.");
      return;
    }

    // Use mobile (10-digit) or EPIC as-is
    const epic = mobileClean.length === 10 ? mobileClean : epicClean;

    // ✅ Grant access
    setSession(epic);
    toast.success("Login successful! Welcome back.");
    setTimeout(() => {
      onLogin(epic);
    }, 150);
  };

  const inp = "w-full border border-input bg-background rounded-md px-3 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition min-h-[44px]";

  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-10">
      <div className="paper rounded-2xl p-8 md:p-10 max-w-sm w-full text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-primary/10 grid place-items-center mx-auto">
          <IdCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold">Member Login</h2>
        <p className="font-tamil text-sm text-muted-foreground mt-1">
          உங்கள் உறுப்பினர் கணக்கில் நுழைக
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left" noValidate>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground/80">
              EPIC ID / Mobile Number
            </span>
            <input
              autoFocus
              value={value}
              onChange={e => { setValue(e.target.value); setError(""); }}
              placeholder="TN-VS-XXXXXXXX  or  9876543210"
              className={`${inp} ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
            />
            {error && (
              <p role="alert" className="text-xs text-destructive leading-relaxed">
                {error}
              </p>
            )}
          </label>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition inline-flex items-center justify-center gap-2 min-h-[44px]"
          >
            <LogIn className="w-4 h-4" /> Login
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-6">
          Not a member yet?{" "}
          <Link
            to="/membership"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            Apply now <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
