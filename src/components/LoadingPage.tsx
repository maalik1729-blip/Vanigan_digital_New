import { useLanguage } from "@/hooks/useLanguage";
import loadingLogo from "@/assets/loading-logo.png";

export function LoadingPage() {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-150 flex flex-col items-center justify-center bg-linear-to-b from-slate-900 via-slate-950 to-blue-950 text-white select-none">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col items-center justify-center space-y-6 max-w-sm text-center px-6">
        {/* Glow-ring Wrapper */}
        <div className="relative w-64 h-64 flex items-center justify-center animate-breathe-premium">
          {/* Pulsing ambient glow */}
          <div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5 blur-xl animate-ambient-glow-premium" aria-hidden="true" />
          <div className="absolute inset-4 rounded-full border border-gold/15 bg-gold/5 blur-md animate-pulse" aria-hidden="true" />
          
          {/* Logo with smooth infinite breathe-premium (no rotation) */}
          <img
            src={loadingLogo}
            alt="TNVS Logo"
            className="w-52 h-52 object-contain relative z-10 filter drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Loading Text */}
        <div className="space-y-2 relative z-10">
          <h2 className="font-display font-bold text-lg tracking-wide text-slate-100">
            {t("வணிகர்களின் சங்கமம்", "Vanigargalin Sangamam")}
          </h2>
          <p className="text-xs text-slate-400 font-tamil tracking-wider animate-pulse">
            {t("தரவு ஏற்றப்படுகிறது, தயவுசெய்து காத்திருக்கவும்...", "Loading secure database, please wait...")}
          </p>
        </div>

        {/* Premium Progress Bar Simulation */}
        <div className="w-48 h-1 bg-slate-800/80 rounded-full overflow-hidden relative z-10 border border-slate-700/30">
          <div className="h-full bg-linear-to-r from-primary via-gold to-primary rounded-full animate-progress-bar" />
        </div>
      </div>
    </div>
  );
}
