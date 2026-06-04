import { useRef, useEffect, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { MockupCard } from "./MockupCard";

import trader1 from "@/assets/trader1.png";
import trader2 from "@/assets/trader2.png";
import trader3 from "@/assets/trader3.png";

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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hoveredIdxRef = useRef<number | null>(null);

  const cardStyles = [
    {
      bg: "bg-slate-950 text-white border-slate-900/60 shadow-2xl",
      title: "text-white",
      desc: "text-slate-300 font-tamil",
      pill: "bg-slate-900 border border-slate-800 text-gold",
      iconBg: "bg-slate-900 text-gold group-hover:bg-gold group-hover:text-slate-950",
      link: "text-gold hover:text-gold/90",
      imageBg: "#020617"
    },
    {
      bg: "bg-blue-900 text-white border-blue-800/60 shadow-2xl",
      title: "text-white",
      desc: "text-blue-200/70 font-tamil",
      pill: "bg-blue-950 border border-blue-850 text-blue-200",
      iconBg: "bg-blue-950 text-gold group-hover:bg-gold group-hover:text-blue-950",
      link: "text-gold hover:text-gold/90",
      imageBg: "#1e3a8a"
    },
    {
      bg: "bg-white text-slate-900 border-slate-200/80 shadow-2xl",
      title: "text-slate-900",
      desc: "text-slate-500 font-tamil",
      pill: "bg-slate-50 border border-slate-200 text-primary",
      iconBg: "bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white",
      link: "text-primary hover:text-primary/90",
      imageBg: "#ffffff"
    }
  ];

  // Sync ref with hover state so the scroll event loop always has instant, non-stale state access
  const setHovered = (val: number | null) => {
    setHoveredIdx(val);
    hoveredIdxRef.current = val;
    // Dispatch a mock scroll event to trigger high-performance DOM redraws instantly
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("scroll"));
    }
  };

  useEffect(() => {
    const cards = cardRefs.current;
    if (!cards.length) return;

    const onScroll = () => {
      const isMobile = window.innerWidth < 768;

      cards.forEach((card, i) => {
        if (!card) return;
        const innerCard = card.firstElementChild as HTMLElement;
        if (!innerCard) return;

        if (isMobile) {
          // Reset custom styles completely on mobile to follow native relative layout flow
          innerCard.style.transform = "none";
          innerCard.style.filter = "none";
          innerCard.style.boxShadow = "0 10px 30px -10px oklch(0.20 0.025 252 / 0.15)";
          return;
        }

        const parentRect = card.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        const cardRect = card.getBoundingClientRect();
        const stickyTop = HEADER_OFFSET + i * STACK_OFFSET;

        // Layout top of card relative to the viewport (ignoring stickiness)
        const cardY = card.offsetTop;
        const cardViewportTop = parentRect.top + cardY;

        // How far past its sticky-top coordinate is the card scroll-pushed?
        const pushed = Math.max(0, stickyTop - cardViewportTop);
        const cardH  = Math.max(cardRect.height, 1);
        const progress = Math.min(1, pushed / cardH);

        // Scroll-driven stacking card scale down and dimming formula
        const isLast = i === services.length - 1;
        const scrollScale = isLast ? 1 : 1 - progress * 0.04;
        const scrollDim = isLast ? 1 : 1 - progress * 0.15;

        // Hover pop-out calculations
        const isHovered = hoveredIdxRef.current === i;
        const hoverScale = isHovered ? 1.02 : 1;
        const hoverTranslateY = isHovered ? -8 : 0;
        const hoverTranslateX = isHovered ? 8 : 0;

        // Combine scroll scale with hover scale and translate
        const finalScale = scrollScale * hoverScale;
        
        innerCard.style.transform = `scale(${finalScale}) translateY(${hoverTranslateY}px) translateX(${hoverTranslateX}px)`;
        innerCard.style.filter = `brightness(${scrollDim})`;
        innerCard.style.boxShadow = isHovered
          ? "0 25px 50px -12px oklch(0.20 0.025 252 / 0.25)"
          : "0 10px 30px -10px oklch(0.20 0.025 252 / 0.15)";
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [services]);

  // Dynamically assign appropriate illustration or photograph to each service card
  const getCardImage = (idx: number, to: string) => {
    if (to === "/voter-id") return "mockup";
    if (idx === 0) return trader3;
    if (idx === 2) return trader1;
    return trader2;
  };

  return (
    <div className="relative space-y-6 md:space-y-0 md:pb-[180px] w-full">
      {services.map((s, idx) => {
        const styles = cardStyles[2];

        return (
          <div
            key={s.e}
            ref={(el) => { cardRefs.current[idx] = el; }}
            className="md:sticky"
            style={{
              top: `${HEADER_OFFSET + idx * STACK_OFFSET}px`,
              zIndex: hoveredIdx === idx ? 100 : 10 + idx,
              // Spacing offset before cards begin stacking
              paddingBottom: idx < services.length - 1 ? "2.5rem" : 0,
            }}
          >
            <a
              href={s.to}
              id={`service-card-${idx}`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className={`card-interactive group flex flex-col md:flex-row items-stretch overflow-hidden w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border shadow-2xl transition duration-300 no-underline ${styles.bg}`}
              style={{
                borderRadius: "1.5rem",
              }}
            >
              {/* Left Side: Crisp, highly readable text layout */}
              <div className="w-full md:w-3/5 p-6 sm:p-8 flex flex-col justify-between text-left space-y-4 md:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Animated Icon bubble */}
                  <div className={`w-12 h-12 rounded-2xl grid place-items-center transition-all duration-300 transform group-hover:scale-110 shrink-0 ${styles.iconBg}`}>
                    <s.i className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-display text-xl sm:text-2xl font-bold leading-snug ${styles.title}`}>
                        {t(s.t, s.e)}
                      </h3>
                      {s.badge && (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${styles.pill}`}>
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm leading-relaxed ${styles.desc}`}>
                      {t(s.td, s.d)}
                    </p>
                  </div>
                </div>
                
                <div className={`inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all duration-300 ${styles.link}`}>
                  {t("தொடரவும்", "Proceed")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              {/* Right Side: Photograph blending seamlessly into the card background */}
              <div 
                className="w-full md:w-2/5 relative min-h-[200px] md:min-h-auto flex items-center justify-center"
                style={{ backgroundColor: styles.imageBg }}
              >
                {/* Fade mask overlay: blends the photo into the left side clean card bg */}
                <div 
                  className="hidden md:block absolute inset-y-0 -left-3 w-28 z-10" 
                  style={{ backgroundImage: `linear-gradient(to right, ${styles.imageBg} 0%, ${styles.imageBg} 40%, transparent 100%)` }}
                />
                {/* Fade mask overlay for mobile top bleed */}
                <div 
                  className="block md:hidden absolute inset-x-0 -top-3 h-20 z-10"
                  style={{ backgroundImage: `linear-gradient(to bottom, ${styles.imageBg} 0%, ${styles.imageBg} 40%, transparent 100%)` }}
                />

                {getCardImage(idx, s.to) === "mockup" ? (
                  <div className="w-full h-full p-6 flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-950">
                    <div className="w-full max-w-[280px] transform group-hover:scale-105 transition-transform duration-500">
                      <MockupCard />
                    </div>
                  </div>
                ) : (
                  <img
                    src={getCardImage(idx, s.to) as string}
                    alt={s.e}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                )}
              </div>
            </a>
          </div>
        );
      })}

    </div>
  );
}
