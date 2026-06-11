import { Users } from "lucide-react";

/** Decorative mock credit-card style TNVS membership card */
export function MockupCard() {
  return (
    <div className="relative w-full aspect-[1.586/1] bg-linear-to-br from-slate-900 via-slate-800 to-primary text-gold rounded-xl p-4 shadow-xl border border-slate-700/50 overflow-hidden group/mockup transition-all duration-500 hover:scale-[1.03] hover:-rotate-1 select-none">
      {/* Background Saffron Gold Accent Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <span className="text-[8px] font-bold text-white">TN</span>
          </div>
          <div className="leading-none">
            <div className="text-[7px] font-semibold text-white uppercase tracking-wider">TNVS</div>
            <div className="text-[5px] text-slate-400">TRADER UNION</div>
          </div>
        </div>
        <div className="text-[6px] font-mono text-gold-foreground bg-gold px-1.5 py-0.5 rounded leading-none font-bold">
          ACTIVE MEMBER
        </div>
      </div>
      {/* Body Details */}
      <div className="mt-5 flex gap-2.5 items-center">
        {/* Mock Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-700/60 border border-slate-600/50 flex items-center justify-center overflow-hidden shrink-0">
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <div className="text-[9px] font-bold text-white truncate">Senthil Kumar</div>
          <div className="text-[6px] text-slate-400 font-mono">TNVS-RJE38271A</div>
          <div className="text-[6px] text-slate-400">District: Chennai</div>
        </div>
      </div>
      {/* Footer stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary via-gold to-primary" />
    </div>
  );
}
