import { useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { MockupCard } from "./MockupCard";

// Optimized trader images (using path for picture element)
const trader1Path = "/assets/trader1";
const trader2Path = "/assets/trader2";
const trader3Path = "/assets/trader3";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ServiceItem {
  i: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  t: string;
  e: string;
  d: string;
  td: string;
  to: string;
  badge: string | null;
  isTall?: boolean;
}

interface StackedServicesProps {
  services: ServiceItem[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const HEADER_OFFSET = 100;  // clean desktop header offset
const STACK_OFFSET  = 32;   // stack spacing per card

// ─── Component ───────────────────────────────────────────────────────────────
export function StackedServices({ services }: StackedServicesProps) {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const setHovered = (val: number | null) => {
    setHoveredIdx(val);
  };

  // Dynamically assign appropriate illustration or photograph to each service card
  const getCardImage = (idx: number, to: string) => {
    if (to === "/voter-id") return "mockup";
    if (idx === 0) return trader3Path;
    if (idx === 2) return trader1Path;
    return trader2Path;
  };

  return (
    <div className="relative space-y-6 md:space-y-0 w-full">
      {services.map((s, idx) => {
        return (
          <div
            key={s.e}
            className="md:sticky top-0 md:h-screen flex items-center justify-center px-4 w-full"
            style={{
              top: `${idx * 24}px`,
              zIndex: 10 + idx,
            }}
          >
            <Link
              to={s.to}
              id={`service-card-${idx}`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className={`card-interactive group flex flex-col md:flex-row items-stretch overflow-hidden w-full max-w-5xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border shadow-2xl transition-all duration-300 no-underline bg-card text-foreground`}
              style={{
                borderRadius: "2rem",
                transform: hoveredIdx === idx ? "scale(1.02) translateY(-8px)" : "scale(1) translateY(0)",
                boxShadow: hoveredIdx === idx
                  ? "0 25px 50px -12px oklch(0.20 0.025 252 / 0.25)"
                  : "0 10px 30px -10px oklch(0.20 0.025 252 / 0.15)",
              }}
            >
              {/* Left Side: Crisp, highly readable text layout */}
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-between text-left space-y-4 md:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Animated Icon bubble */}
                  <div className={`w-12 h-12 rounded-2xl bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white grid place-items-center transition-all duration-300 transform group-hover:scale-110 shrink-0`}>
                    <s.i className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-display text-xl sm:text-2xl font-bold text-ink leading-snug`}>
                        {t(s.t, s.e)}
                      </h3>
                      {s.badge && (
                        <span className={`text-[10px] font-bold text-primary bg-primary/8 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap`}>
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm text-muted-foreground leading-relaxed font-tamil`}>
                      {t(s.td, s.d)}
                    </p>
                  </div>
                </div>
                
                <div className={`inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all duration-300`}>
                  {t("தொடரவும்", "Proceed")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              {/* Right Side: Photograph blending seamlessly into the card background */}
              <div 
                className="w-full md:w-2/5 relative min-h-[200px] md:min-h-auto bg-card flex items-center justify-center"
              >
                {/* Fade mask overlay: blends the photo into the left side clean card bg */}
                <div 
                  className="hidden md:block absolute inset-y-0 -left-3 w-28 bg-linear-to-r from-card via-card to-transparent z-10" 
                />
                {/* Fade mask overlay for mobile top bleed */}
                <div 
                  className="block md:hidden absolute inset-x-0 -top-3 h-20 bg-linear-to-b from-card via-card to-transparent z-10"
                />

                {getCardImage(idx, s.to) === "mockup" ? (
                  <div className="w-full h-full p-6 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
                    <div className="w-full max-w-[280px] transform group-hover:scale-105 transition-transform duration-500">
                      <MockupCard />
                    </div>
                  </div>
                ) : (
                  <picture>
                    <source 
                      type="image/avif" 
                      srcSet={`${getCardImage(idx, s.to)}.avif 409w, ${getCardImage(idx, s.to)}@2x.avif 818w`} 
                    />
                    <source 
                      type="image/webp" 
                      srcSet={`${getCardImage(idx, s.to)}.webp 409w, ${getCardImage(idx, s.to)}@2x.webp 818w`} 
                    />
                    <img
                      src={`${getCardImage(idx, s.to)}.png`}
                      alt={s.e}
                      loading="lazy"
                      decoding="async"
                      width="409"
                      height="409"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  </picture>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
