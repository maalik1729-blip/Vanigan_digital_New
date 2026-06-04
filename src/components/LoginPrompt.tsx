import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, IdCard, ArrowRight } from "lucide-react";
import { setSession } from "@/lib/session";
import { toast } from "sonner";
import votersData from "@/data/voters.json";

export function LoginPrompt({ onLogin }: { onLogin: (epic: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const findLocalMember = (input: string) => {
    const cleanInput = input.trim().toUpperCase();
    
    // 1. Direct EPIC match
    const directMember = localStorage.getItem(`tnvs_member_${cleanInput}`);
    if (directMember) {
      try { return JSON.parse(directMember); } catch { return null; }
    }
    
    // 2. Mobile number search
    const cleanMobile = cleanInput.replace(/\D/g, "");
    if (cleanMobile.length === 10) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("tnvs_member_")) {
          try {
            const profile = JSON.parse(localStorage.getItem(key) || "");
            if (profile && profile.mobile === cleanMobile) {
              return profile;
            }
          } catch {}
        }
      }
    }
    return null;
  };

  const findMockVoter = (input: string) => {
    const cleanInput = input.trim().toUpperCase();
    const cleanMobile = input.replace(/\D/g, "");
    
    return votersData.find(v => 
      v.EPIC_NO?.toUpperCase() === cleanInput || 
      (cleanMobile.length === 10 && v.MOBILE_NUMBER === cleanMobile)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const raw = value.trim();
    if (!raw) {
      const emptyMsg = "Please enter your EPIC ID or registered Mobile Number.";
      setError(emptyMsg);
      toast.error(emptyMsg);
      return;
    }

    // 1. Lookup dynamic registered profile
    const dynamicProfile = findLocalMember(raw);
    if (dynamicProfile) {
      const epic = dynamicProfile.epic;
      setSession(epic);
      toast.success("Login successful! Welcome back.");
      setTimeout(() => {
        onLogin(epic);
      }, 150);
      return;
    }

    // 2. Lookup preloaded mock voters
    const mockVoter = findMockVoter(raw);
    if (mockVoter) {
      const epic = mockVoter.EPIC_NO;
      setSession(epic);
      toast.success("Login successful! Welcome back.");
      setTimeout(() => {
        onLogin(epic);
      }, 150);
      return;
    }

    // 3. Fail validation
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
