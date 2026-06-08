import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, Phone, Globe, ChevronDown, Building2 } from "lucide-react";
import templeLogo from "@/assets/association-logo.png";
import { useLanguage } from "@/hooks/useLanguage";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";

const CATEGORIES = [
  { name: "Hotels & Restaurants",      icon: "🍽️" },
  { name: "Caterers",                  icon: "🥘" },
  { name: "Daily Needs",               icon: "🛒" },
  { name: "Organic Products",          icon: "🌿" },
  { name: "Doctors",                   icon: "👨‍⚕️" },
  { name: "Hospitals & Clinics",       icon: "🏥" },
  { name: "Pharmacy",                  icon: "💊" },
  { name: "Labs & Diagnostics",        icon: "🔬" },
  { name: "Spa & Beauty",              icon: "💅" },
  { name: "Education",                 icon: "🎓" },
  { name: "Coaching Centers",          icon: "📚" },
  { name: "IT & Software",             icon: "💻" },
  { name: "Digital & IT Products",     icon: "🖥️" },
  { name: "Electricals & Electronics", icon: "⚡" },
  { name: "Construction Materials",    icon: "🧱" },
  { name: "Civil Contractors",         icon: "🏗️" },
  { name: "Real Estate",               icon: "🏠" },
  { name: "Interior Design",           icon: "🛋️" },
  { name: "Transport",                 icon: "🚛" },
  { name: "Automobile",                icon: "🚘" },
  { name: "Textiles & Garments",       icon: "👗" },
  { name: "Jewellery",                 icon: "💎" },
  { name: "Agriculture",               icon: "🌾" },
  { name: "B2B Services",              icon: "🤝" },
  { name: "Banking & Finance",         icon: "🏦" },
  { name: "Insurance",                 icon: "🛡️" },
  { name: "Legal Services",            icon: "⚖️" },
  { name: "Advertising",               icon: "📢" },
  { name: "Printing Services",         icon: "🖨️" },
  { name: "Photography",               icon: "📸" },
  { name: "Wedding Services",          icon: "💒" },
  { name: "Event Management",          icon: "🎉" },
  { name: "Transport",                 icon: "🚛" },
  { name: "Travel & Tourism",          icon: "✈️" },
  { name: "Jobs",                      icon: "💼" },
  { name: "Sports",                    icon: "⚽" },
  { name: "Religious",                 icon: "🛕" },
] as const;

const NAV = [
  { to: "/",          label: "முகப்பு",   en: "Home" },
  {
    to: "/members",
    label: "பட்டியல்",
    en: "Directory",
    dropdown: [
      { to: "/members", search: { tab: "members" },     label: "உறுப்பினர்கள்",   en: "Members",          desc: "சங்கத்தின் பதிவு செய்யப்பட்ட உறுப்பினர்கள்", descEn: "All registered members" },
      { to: "/members", search: { tab: "businesses" },  label: "வணிகங்கள்",        en: "Businesses",       desc: "வணிகப் பிரிவுகள் மற்றும் நிறுவனங்கள்",        descEn: "Search merchants & businesses" },
      { to: "/members", search: { tab: "organizers" },  label: "நிர்வாகிகள்",      en: "Organizers",       desc: "மாநில/மாவட்ட நிர்வாகிகள்",                    descEn: "State & district coordinators" },
    ]
  },
  {
    to: "/services",
    label: "சேவைகள்",
    en: "Services",
    dropdown: [
      { to: "/services",    label: "அனைத்து சேவைகள்",   en: "All Services",         desc: "சங்கம் வழங்கும் சேவைகள்",                     descEn: "Full list of services" },
      { to: "/membership",  label: "உறுப்பினர் சேர்க்கை", en: "Apply for Membership", desc: "ஆன்லைனில் 5 நிமிடங்களில் விண்ணப்பிக்கவும்",  descEn: "Apply online in 5 minutes" },
      { to: "/voter-id",    label: "அட்டை பெறுக",        en: "Get My ID Card",       desc: "EPIC எண் மூலம் அட்டை பதிவிறக்கம்",            descEn: "Download your membership card" },
    ]
  },
  {
    to: "/wings",
    label: "அலகுகள்",
    en: "Wings",
    dropdown: [
      { to: "/wings",  label: "34 சிறப்பு வணிகப் பிரிவுகள்", en: "34 Business Wings", desc: "மகளிர், IT, உணவகம், சில்லறை வணிகம்", descEn: "Women, IT, Retail, Food divisions" },
      { to: "/wings",  label: "மண்டலங்கள் & மாவட்டங்கள்",    en: "Regional Zones",    desc: "தமிழ்நாட்டின் அனைத்து மாவட்ட பிரிவுகள்",  descEn: "Regional wings across Tamil Nadu" },
    ]
  },
  {
    to: "/assistant",
    label: "உதவி",
    en: "Help",
    dropdown: [
      { to: "/assistant", label: "உதவி & FAQs",        en: "Help & FAQs",    desc: "அடிக்கடி கேட்கப்படும் கேள்விகள்",  descEn: "Frequently asked questions" },
      { to: "/assistant", label: "நிலவரம் சரிபார்த்தல்", en: "Verify Status",  desc: "விண்ணப்ப நிலை அறிய",               descEn: "Check application status" },
      { to: "/contact",   label: "தொடர்பு கொள்ளவும்",   en: "Contact Us",     desc: "மாவட்ட சங்க தொடர்பு விவரங்கள்",   descEn: "Contact our district office" },
    ]
  },
] as const;

const SCROLL_THRESHOLD = 80;
const SHOW_DELTA = 6;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showBizCategories, setShowBizCategories] = useState(false);

  const loc = useLocation();
  const { language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Smart hide-on-scroll-down, show-on-scroll-up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      setScrolled(currentY > SCROLL_THRESHOLD);
      if (currentY > SCROLL_THRESHOLD) {
        if (delta > 0) setHidden(true);
        else if (delta < -SHOW_DELTA) setHidden(false);
      } else {
        setHidden(false);
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
    setShowBizCategories(false);
  }, [loc.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!activeDropdown) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setActiveDropdown(null);
        setShowBizCategories(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDropdown]);

  // ESC closes mobile menu + lock body scroll + Focus Trap
  useEffect(() => {
    if (!open) return;
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (!menuRef.current) return;

      const focusableEls = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleFocusTrap);

    // Initial focus on open: focus close button or first link
    const initialFocusTimer = setTimeout(() => {
      if (menuRef.current) {
        const focusableEls = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select'
        );
        if (focusableEls.length > 0) {
          // Focus the close button if it exists, or the first link
          const closeBtn = Array.from(focusableEls).find(
            (el) => el.getAttribute("aria-label")?.toLowerCase().includes("close")
          );
          if (closeBtn) {
            closeBtn.focus();
          } else {
            focusableEls[0].focus();
          }
        }
      }
    }, 50);

    const root = document.documentElement;
    const body = document.body;
    const prev = { ro: root.style.overflow, rh: root.style.height, bo: body.style.overflow, bh: body.style.height };
    root.style.overflow = "hidden";
    root.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      clearTimeout(initialFocusTimer);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("keydown", handleFocusTrap);
      root.style.overflow = prev.ro;
      root.style.height = prev.rh;
      body.style.overflow = prev.bo;
      body.style.height = prev.bh;
    };
  }, [open]);

  // Restore focus to hamburger when mobile drawer is closed
  useEffect(() => {
    if (!open && hamburgerRef.current) {
      hamburgerRef.current.focus();
    }
  }, [open]);

  const isVisible = !hidden || open;
  const toggleLanguage = () => setLanguage(language === "ta" ? "en" : "ta");

  return (
    <>
      {/* ── Main Header — 64px single layer ─────────────────────────────────── */}
      <header
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          background: scrolled ? "var(--header-bg-scrolled)" : "var(--header-bg-top)",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          borderBottomColor: scrolled ? "var(--header-border-scrolled)" : "var(--header-border)",
          boxShadow: scrolled ? "var(--header-shadow)" : "none",
        }}
        className={[
          "fixed top-0 left-0 right-0 z-50 border-b flex flex-col",
          "transition-[transform,background,box-shadow,border-color]",
          "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        ].join(" ")}
      >
        {/* Announcement Banner — dismissible, replaces marquee ticker */}
        <AnnouncementBanner />

        {/* 64px nav row */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 w-full flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 min-w-0"
            aria-label="Tamil Nadu Vanigargalin Sangamam — Home"
          >
            <img
              src={templeLogo}
              alt="TNVS Logo"
              className="w-9 h-9 object-contain shrink-0 transition-transform group-hover:scale-105 duration-300"
              width={36}
              height={36}
            />
            <div className="leading-tight hidden md:flex flex-col justify-center">
              <div className="font-display font-bold text-[13px] text-ink leading-tight">
                Tamil Nadu Vanigargalin Sangamam
              </div>
              <div className="font-tamil text-[11px] text-muted-foreground mt-0.5">
                Reg. No. 2012/TNVS
              </div>
            </div>
          </Link>

          {/* Desktop Navigation — visible from lg: (1024px) */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV.map((n) => {
              const active = loc.pathname === n.to || (n.to !== "/" && loc.pathname.startsWith(n.to));
              const hasDropdown = "dropdown" in n;
              return (
                <div key={n.to} data-nav-dropdown className="relative flex items-center">
                  <button
                    onClick={() => {
                      if (hasDropdown) {
                        setActiveDropdown(activeDropdown === n.en ? null : n.en);
                        setShowBizCategories(false);
                      }
                    }}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={hasDropdown ? activeDropdown === n.en : undefined}
                    className={[
                      "relative px-3 py-2 text-[13px] font-semibold transition-colors duration-200",
                      "min-h-[40px] inline-flex items-center gap-1 rounded-lg border-none bg-transparent cursor-pointer whitespace-nowrap",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-ink hover:bg-muted",
                    ].join(" ")}
                  >
                    {/* Direct link if no dropdown */}
                    {!hasDropdown && (
                      <Link to={n.to} className="absolute inset-0 rounded-lg" aria-label={n.en} />
                    )}
                    <span>{language === "ta" ? n.label : n.en}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${activeDropdown === n.en ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    )}
                    {/* Active indicator — clean 2px underline */}
                    {active && (
                      <span className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-primary" />
                    )}
                  </button>

                  {/* Desktop Dropdown */}
                  {hasDropdown && activeDropdown === n.en && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 min-w-[220px]">
                      <div className="bg-card rounded-xl border border-border shadow-lg p-1.5 space-y-0.5">
                        {n.dropdown.map((sub) => {
                          const isBusinessSub =
                            sub.to === "/members" && (sub as any).search?.tab === "businesses";
                          return (
                            <div key={sub.en}>
                              <Link
                                to={sub.to}
                                search={"search" in sub ? (sub as any).search : undefined}
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setShowBizCategories(false);
                                }}
                                className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-muted transition cursor-pointer group/item"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[13px] font-semibold text-foreground group-hover/item:text-primary transition-colors">
                                    {language === "ta" ? sub.label : sub.en}
                                  </span>
                                  {isBusinessSub && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowBizCategories(!showBizCategories);
                                      }}
                                      className="p-0.5 rounded hover:bg-primary/10 transition"
                                      aria-label="Browse categories"
                                      aria-expanded={showBizCategories}
                                    >
                                      <ChevronDown
                                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showBizCategories ? "rotate-180" : ""}`}
                                        aria-hidden="true"
                                      />
                                    </button>
                                  )}
                                </div>
                                {sub.desc && (
                                  <span className="text-xs text-muted-foreground mt-0.5 font-normal font-tamil leading-snug">
                                    {language === "ta" ? sub.desc : sub.descEn}
                                  </span>
                                )}
                              </Link>

                              {/* Category sub-panel */}
                              {isBusinessSub && showBizCategories && (
                                <div className="mt-1 ml-2 pl-3 border-l-2 border-primary/20">
                                  <div className="flex items-center gap-1.5 mb-1.5 px-1">
                                    <Building2 className="w-3 h-3 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-bold text-foreground">
                                      {language === "ta" ? "வணிகப் பிரிவுகள்" : "Categories"}
                                    </span>
                                  </div>
                                  <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                                    {CATEGORIES.map((cat) => (
                                      <Link
                                        key={cat.name}
                                        to="/members"
                                        search={{ tab: "businesses", category: cat.name }}
                                        onClick={() => {
                                          setActiveDropdown(null);
                                          setShowBizCategories(false);
                                        }}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-muted hover:text-primary transition"
                                      >
                                        <span className="text-sm shrink-0">{cat.icon}</span>
                                        <span className="text-xs font-medium text-foreground truncate">
                                          {cat.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Language Toggle — plain text style */}
            <button
              onClick={toggleLanguage}
              aria-label={`Switch to ${language === "ta" ? "English" : "Tamil"}`}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-semibold text-muted-foreground hover:text-ink hover:bg-muted transition min-h-[36px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{language === "ta" ? "EN" : "தமிழ்"}</span>
            </button>

            {/* My Account link */}
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-primary hover:bg-muted transition rounded-lg min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              {language === "ta" ? "கணக்கு" : "My Account"}
            </Link>

            {/* Join Now CTA */}
            <Link
              to="/membership"
              className="hidden lg:inline-flex btn-primary text-[13px] px-4 py-2 min-h-[40px] items-center justify-center whitespace-nowrap select-none cursor-pointer"
            >
              {language === "ta" ? "இணைவு" : "Join Now"}
            </Link>

            {/* Mobile hamburger */}
            <button
              ref={hamburgerRef}
              className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground border border-border rounded-lg bg-card hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-60 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          ref={menuRef}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="relative ml-auto w-full max-w-xs h-full flex flex-col animate-slide-up overflow-y-auto"
            style={{
              background: "var(--drawer-bg)",
              borderLeft: "1px solid var(--drawer-border)",
              boxShadow: "var(--drawer-shadow)",
              overscrollBehavior: "contain",
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <div className="text-sm font-bold text-foreground">Menu</div>
                <div className="text-xs text-muted-foreground font-tamil">வழிகாட்டல்</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg hover:bg-muted transition text-muted-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto" aria-label="Mobile navigation">
              {NAV.map((n) => {
                const active = loc.pathname === n.to || (n.to !== "/" && loc.pathname.startsWith(n.to));
                const hasDropdown = "dropdown" in n;
                return (
                  <div key={n.to} className="space-y-0.5">
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center justify-between px-4 min-h-[48px] rounded-xl transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "bg-primary/8 text-primary font-bold"
                          : "text-muted-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      <span className="text-sm font-semibold">
                        {language === "ta" ? n.label : n.en}
                      </span>
                      <span className="text-xs text-muted-foreground font-tamil">
                        {language === "ta" ? n.en : n.label}
                      </span>
                    </Link>

                    {hasDropdown && (
                      <div className="pl-4 pr-2 py-1 space-y-0.5 border-l-2 border-border ml-4">
                        {n.dropdown.map((sub) => (
                          <Link
                            key={sub.en}
                            to={sub.to}
                            search={"search" in sub ? (sub as any).search : undefined}
                            onClick={() => setOpen(false)}
                            className="flex flex-col px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition"
                          >
                            <span className="text-sm font-semibold text-foreground">
                              {language === "ta" ? sub.label : sub.en}
                            </span>
                            {sub.desc && (
                              <span className="text-xs text-muted-foreground font-normal leading-snug mt-0.5 font-tamil">
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
            <div className="px-4 py-4 border-t border-border space-y-3">
              {/* Language Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setLanguage("ta"); setOpen(false); }}
                  className={[
                    "flex-1 py-3 rounded-xl text-sm font-semibold border transition min-h-[48px] cursor-pointer",
                    language === "ta"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-card",
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
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-card",
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
                className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2 hover:text-primary transition"
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
