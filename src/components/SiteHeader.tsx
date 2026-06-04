import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, Phone, Globe, ChevronDown } from "lucide-react";
import templeLogo from "@/assets/ChatGPT Image Mar 25, 2026, 05_31_25 PM (1).png";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

const NAV = [
  { to: "/",          label: "முகப்பு",     en: "Home" },
  {
    to: "/services",
    label: "சேவைகள்",
    en: "Services",
    dropdown: [
      { to: "/membership", label: "புதிய உறுப்பினர் சேர்க்கை", en: "Apply for Membership", desc: "5 நிமிடங்களில் ஆன்லைனில் பதிவு செய்ய", descEn: "Register online in 5 minutes" },
      { to: "/voter-id", label: "சங்கம அட்டை & சான்றிதழ்", en: "Get Membership Card", desc: "PDF அட்டை & சான்றிதழ் பெற", descEn: "Download digital card & certificate" },
      { to: "/services", label: "அனைத்து சேவைகள்", en: "View All Services", desc: "கடனுதவி மற்றும் வணிக சேவைகள்", descEn: "Loan assistance and legal support" }
    ]
  },
  {
    to: "/wings",
    label: "அலகுகள்",
    en: "Wings",
    dropdown: [
      { to: "/wings", label: "34 சிறப்பு வணிகப் பிரிவுகள்", en: "34 Specialized Wings", desc: "மகளிர், IT, உணவகம், சில்லறை வணிகம்", descEn: "Women, IT, Retail, Food divisions" },
      { to: "/wings", label: "மண்டலங்கள் & மாவட்டங்கள்", en: "Regional Zones", desc: "தமிழ்நாட்டின் அனைத்து மாவட்ட பிரிவுகள்", descEn: "Regional wings across Tamil Nadu" }
    ]
  },
  { to: "/membership",label: "இணைவு",       en: "Join" },
  {
    to: "/assistant",
    label: "ஆதரவு",
    en: "Support",
    dropdown: [
      { to: "/assistant", label: "உதவி மையம் & FAQs", en: "Support Center & FAQs", desc: "அடிக்கடி கேட்கப்படும் கேள்விகள்", descEn: "Frequently asked questions" },
      { to: "/assistant", label: "நிலவரம் சரிபார்த்தல்", en: "Verify Status", desc: "உறுப்பினர் விண்ணப்ப நிலை அறிய", descEn: "Check membership application status" },
      { to: "/assistant", label: "உதவி எண்: 044-2345-6789", en: "Helpline Support", desc: "மாவட்ட சங்க தொடர்பு விவரங்கள்", descEn: "Contact district office directly" }
    ]
  },
] as const;

// ─── How many px the user must scroll before the hide logic activates ─────────
const SCROLL_THRESHOLD = 100;
// ─── Min upward scroll delta before we re-show the navbar ────────────────────
const SHOW_DELTA = 8;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);       // true = navbar slid up
  const [scrolled, setScrolled] = useState(false);   // true = past threshold (glass intensifies)

  const loc = useLocation();
  const { language, setLanguage } = useLanguage();

  const menuRef = useRef<HTMLDivElement>(null);

  // ─── Smart hide-on-scroll-down, show-on-scroll-up ──────────────────────────
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta    = currentY - lastY;            // positive = scrolling down

      // Past threshold check
      setScrolled(currentY > SCROLL_THRESHOLD);

      if (currentY > SCROLL_THRESHOLD) {
        if (delta > 0) {
          // Scrolling DOWN → hide
          setHidden(true);
        } else if (delta < -SHOW_DELTA) {
          // Scrolling UP by enough → show
          setHidden(false);
        }
      } else {
        // Near top — always show
        setHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  // ESC closes mobile menu + lock body & html scroll
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);

    const root = document.documentElement;
    const body = document.body;

    const prevRootOverflow = root.style.overflow;
    const prevRootHeight   = root.style.height;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight   = body.style.height;

    // Lock scrolling on both elements to fully disable scroll chaining on iOS Safari
    root.style.overflow = "hidden";
    root.style.height   = "100%";
    body.style.overflow = "hidden";
    body.style.height   = "100%";

    return () => {
      document.removeEventListener("keydown", handler);
      root.style.overflow = prevRootOverflow;
      root.style.height   = prevRootHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height   = prevBodyHeight;
    };
  }, [open]);

  // Always show navbar when mobile menu is open
  const isVisible = !hidden || open;

  const toggleLanguage = () => setLanguage(language === "ta" ? "en" : "ta");

  return (
    <>
      <header
        style={{
          // Slide up by the full header height when hidden
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          // Glassmorphism background — intensifies after scroll threshold
          background: scrolled
            ? "var(--header-bg-scrolled)"
            : "var(--header-bg-top)",
          // Stronger blur when scrolled
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px) saturate(120%)",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px) saturate(120%)",
          // Subtle border glow on scroll
          borderBottomColor: scrolled
            ? "var(--header-border-scrolled)"
            : "var(--header-border)",
          // Drop shadow appears on scroll
          boxShadow: scrolled
            ? "var(--header-shadow)"
            : "none",
        }}
        className={[
          "fixed top-0 left-0 right-0 z-50 border-b",
          "transition-[transform,background,backdrop-filter,box-shadow]",
          "duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",  // iOS-style decel curve
        ].join(" ")}
      >
        {/* Gov tri-colour stripe — always present */}
        <div className="gov-stripe h-[3px]" aria-hidden="true" />

        {/* Announcement ticker bar */}
        <div className="bg-primary text-white border-b border-primary-foreground/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-2 flex items-center justify-between gap-2 lg:gap-4 w-full">
            <span className="text-xs font-semibold font-tamil flex items-center gap-1.5 shrink-0 select-none border-r border-white/20 pr-4">
              <span aria-hidden="true" className="text-gold">✦</span>
              {language === "ta" ? "பதிவு எண். 2012/TNVS" : "Reg. No. 2012/TNVS"}
            </span>

            <div className="flex-1 overflow-hidden relative flex items-center h-4 mx-2">
              <div className="animate-marquee whitespace-nowrap flex gap-16 font-tamil text-xs">
                <span>
                  {language === "ta"
                    ? "புதிய நலத்திட்டம்: ₹2 லட்சம் மருத்துவ காப்பீட்டுக்கு உடனே விண்ணப்பிக்கவும்! ✦ புதிய அரசு சுற்றறிக்கை: குறுந்தொழில் முனைவோருக்கான சிறப்பு ஜிஎஸ்டி சலுகை அறிவிப்பு! ✦ சங்கமத்தின் அதிகாரப்பூர்வ சான்றிதழ் வங்கி கடன் பெற செல்லுபடியாகும்! ✦ ஆண்டு பொதுக்குழு கூட்டம் ஜூன் 15 அன்று சென்னையில் நடைபெறும்! ✦ "
                    : "New Welfare Scheme: Apply for ₹2 Lakh Health Cover now! ✦ Latest Govt Circular: Special GST relief for micro-traders announced! ✦ TNVS Stamped Certificate is now legally valid for bank loan applications! ✦ Annual General Meeting to be held on June 15th at Chennai! ✦ "}
                </span>
                <span>
                  {language === "ta"
                    ? "புதிய நலத்திட்டம்: ₹2 லட்சம் மருத்துவ காப்பீட்டுக்கு உடனே விண்ணப்பிக்கவும்! ✦ புதிய அரசு சுற்றறிக்கை: குறுந்தொழில் முனைவோருக்கான சிறப்பு ஜிஎஸ்டி சலுகை அறிவிப்பு! ✦ சங்கமத்தின் அதிகாரப்பூர்வ சான்றிதழ் வங்கி கடன் பெற செல்லுபடியாகும்! ✦ ஆண்டு பொதுக்குழு கூட்டம் ஜூன் 15 அன்று சென்னையில் நடைபெறும்! ✦ "
                    : "New Welfare Scheme: Apply for ₹2 Lakh Health Cover now! ✦ Latest Govt Circular: Special GST relief for micro-traders announced! ✦ TNVS Stamped Certificate is now legally valid for bank loan applications! ✦ Annual General Meeting to be held on June 15th at Chennai! ✦ "}
                </span>
              </div>
            </div>

            <a
              href="tel:04423456789"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium opacity-90 hover:opacity-100 transition shrink-0 select-none border-l border-white/20 pl-4"
              aria-label="Call helpline 044-2345-6789"
            >
              <Phone className="w-3 h-3" aria-hidden="true" />
              044-2345-6789
            </a>
          </div>
        </div>

        {/* Brand + Nav row — 3-col grid: [logo | nav | controls] */}
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 h-16 w-full grid grid-cols-[1fr_auto_1fr] items-center">

          {/* Col 1 — Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group min-w-0" aria-label="Tamil Nadu Vanigargalin Sangamam — Home">
            <img
              src={templeLogo}
              alt="TNVS Logo"
              className="w-10 h-10 object-contain shrink-0 transition-transform group-hover:scale-105 duration-300"
              width={40}
              height={40}
            />
            <div className="leading-tight hidden md:flex flex-col justify-center">
              <div className="font-display font-bold text-slate-800 text-[13px] xl:text-[14px]">
                Tamil Nadu Vanigargalin Sangamam
              </div>
              <div className="font-tamil text-[11px] text-slate-500 mt-0.5">
                தமிழ்நாடு வணிகர்களின் சங்கமம்
              </div>
            </div>
          </Link>

          {/* Col 2 — Desktop Navigation (always truly centered) */}
          <nav className="hidden xl:flex items-center gap-1.5 justify-center" aria-label="Main navigation">
            {NAV.map((n) => {
              const active = loc.pathname === n.to;
              const hasDropdown = "dropdown" in n;
              return (
                <div key={n.to} className="relative group/nav min-h-[44px] flex items-center">
                  <Link
                    to={n.to}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative px-3 py-2 text-sm font-semibold transition-colors duration-200 min-h-[40px] inline-flex items-center justify-center rounded-lg whitespace-nowrap group/link gap-1",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      active
                        ? "text-primary font-bold"
                        : "text-slate-500 hover:text-primary hover:bg-slate-50/60",
                    ].join(" ")}
                  >
                    <span className="relative z-10 text-sm">{language === "ta" ? n.label : n.en}</span>
                    {hasDropdown && (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover/nav:rotate-180 transition-transform duration-300 relative z-10" />
                    )}
                    
                    {active ? (
                      <motion.div
                        layoutId="activeNavUnderline"
                        className="absolute -bottom-px left-1.5 right-1.5 h-[8px] z-0 text-gold flex items-center"
                        transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
                      >
                        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                          <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                    ) : (
                      <div className="absolute -bottom-px left-1.5 right-1.5 h-[8px] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-0 origin-center text-gold/30 flex items-center">
                        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                          <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </Link>

                  {/* Desktop Dropdown Card */}
                  {hasDropdown && (
                    <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-64 pt-3 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform scale-95 group-hover/nav:scale-100 z-50 pointer-events-none group-hover/nav:pointer-events-auto">
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-2.5 space-y-0.5 overflow-hidden">
                        {n.dropdown.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="block px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition text-left cursor-pointer group/item"
                          >
                            <div className="font-semibold text-slate-800 text-[13px] group-hover/item:text-primary transition-colors leading-tight">
                              {language === "ta" ? sub.label : sub.en}
                            </div>
                            {sub.desc && (
                              <div className="text-[10px] text-slate-400 font-normal leading-normal mt-0.5 font-tamil">
                                {language === "ta" ? sub.desc : sub.descEn}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Col 3 — Right Controls + Mobile Hamburger */}
          <div className="flex items-center gap-1 lg:gap-2 justify-end">

            {/* Desktop only controls */}
            <Link
              to="/dashboard"
              className="hidden xl:inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary transition min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              {language === "ta" ? "எனது கணக்கு" : "My Account"}
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="xl:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 border border-slate-200/80 rounded-[10px] bg-white/60 backdrop-blur-sm hover:bg-white/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label={`Switch to ${language === "ta" ? "English" : "Tamil"}`}
              aria-pressed={language === "ta"}
              className={[
                "hidden xl:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition min-h-[44px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer shrink-0",
                language === "ta"
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              ].join(" ")}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{language === "ta" ? "தமிழ்" : "English"}</span>
            </button>

            {/* Join Now — absolute right corner */}
            <Link
              to="/membership"
              className="hidden xl:inline-flex btn-primary select-none cursor-pointer whitespace-nowrap text-sm px-4 py-2.5 min-h-[44px] items-center justify-center ml-[25px]"
            >
              {language === "ta" ? "இணைவு" : "Join Now"}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile menu — full-screen overlay ─────────────────────────────── */}
      {open && (
        <div
          className="xl:hidden fixed inset-0 z-60 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          ref={menuRef}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel — glassmorphism */}
          <div
            className="relative ml-auto w-full max-w-sm h-full flex flex-col animate-slide-up overflow-y-auto"
            style={{
              background: "var(--drawer-bg)",
              backdropFilter: "blur(24px) saturate(200%)",
              WebkitBackdropFilter: "blur(24px) saturate(200%)",
              borderLeft: "1px solid var(--drawer-border)",
              boxShadow: "var(--drawer-shadow)",
              overscrollBehavior: "contain", // prevent background overscroll rubber-banding
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
              <div>
                <div className="text-sm font-bold text-slate-800">Menu</div>
                <div className="text-xs text-slate-400 font-tamil">வழிகாட்டல்</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-[10px] hover:bg-slate-100/80 transition text-slate-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto" aria-label="Mobile navigation">
              {NAV.map((n) => {
                const active = loc.pathname === n.to;
                const hasDropdown = "dropdown" in n;
                return (
                  <div key={n.to} className="space-y-1">
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center justify-between px-4 min-h-[48px] rounded-xl transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "bg-primary/8 text-primary font-bold"
                          : "hover:bg-slate-50/80 text-slate-700",
                      ].join(" ")}
                    >
                      <span className="text-sm font-semibold">
                        {language === "ta" ? n.label : n.en}
                      </span>
                      <span className="font-tamil text-xs text-slate-455">
                        {language === "ta" ? n.en : n.label}
                      </span>
                    </Link>
                    
                    {hasDropdown && (
                      <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-100/85 ml-4">
                        {n.dropdown.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setOpen(false)}
                            className="flex flex-col px-3.5 py-2 rounded-lg text-slate-650 hover:bg-slate-50 transition text-left cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-slate-800">
                              {language === "ta" ? sub.label : sub.en}
                            </span>
                            {sub.desc && (
                              <span className="text-[10px] text-slate-400 font-normal leading-normal font-tamil mt-0.5">
                                {language === "ta" ? sub.desc : sub.descEn}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer controls */}
            <div className="px-4 py-4 border-t border-slate-100/80 space-y-3">
              {/* Language Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setLanguage("ta"); setOpen(false); }}
                  className={[
                    "flex-1 py-3 rounded-xl text-sm font-semibold border transition min-h-[48px] cursor-pointer",
                    language === "ta"
                      ? "bg-primary text-white border-primary"
                      : "bg-white/70 text-slate-600 border-slate-200/80 hover:bg-white/90",
                  ].join(" ")}
                  aria-pressed={language === "ta"}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => { setLanguage("en"); setOpen(false); }}
                  className={[
                    "flex-1 py-3 rounded-xl text-sm font-semibold border transition min-h-[48px] cursor-pointer",
                    language === "en"
                      ? "bg-primary text-white border-primary"
                      : "bg-white/70 text-slate-600 border-slate-200/80 hover:bg-white/90",
                  ].join(" ")}
                  aria-pressed={language === "en"}
                >
                  English
                </button>
              </div>


              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 border border-primary/20 bg-primary/6 text-primary py-3 rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                {language === "ta" ? "எனது கணக்கு" : "My Account"}
              </Link>

              <Link
                to="/membership"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {language === "ta" ? "உறுப்பினர் சேர்க்கை" : "Apply for Membership"}
              </Link>

              <a
                href="tel:04423456789"
                className="flex items-center justify-center gap-2 text-xs text-slate-500 py-2"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                Helpline: 044-2345-6789 · Mon–Sat 10am–6pm
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
