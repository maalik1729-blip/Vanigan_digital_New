import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, IdCard, ArrowRight } from "lucide-react";
import { setSession } from "@/lib/session";
import { toast } from "sonner";

export function LoginPrompt({ onLogin }: { onLogin: (epic: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const raw = value.trim();
    if (!raw) {
      const emptyMsg = "Please enter your EPIC ID or registered Mobile Number.";
      setError(emptyMsg);
      toast.error(emptyMsg);
      return;
    }

    try {
      // Query the database to verify the member exists
      const params = new URLSearchParams();
      const cleanMobile = raw.replace(/\D/g, "");
      if (cleanMobile.length === 10) {
        params.append("mobile", cleanMobile);
      } else {
        params.append("epic", raw);
      }

      const res = await fetch(`/api/public/members?${params.toString()}`);
      if (res.ok || res.status === 401) {
        const data = res.ok ? await res.json() : null;
        const resolvedEpic = data?.epic || raw.toUpperCase();
        setSession(resolvedEpic);
        toast.success("Login successful! Welcome back.");
        setTimeout(() => {
          onLogin(resolvedEpic);
        }, 150);
        return;
      }
    } catch (err) {
      console.error("Database login check failed:", err);
    }

    // Fail validation
    const errorMsg = "No registered member found with this EPIC ID or Mobile Number. Please check your credentials.";
    setError(errorMsg);
    toast.error(errorMsg);
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
              EPIC ID / Registered Mobile Number
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
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition inline-flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
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
