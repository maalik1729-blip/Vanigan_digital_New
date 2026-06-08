import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, Users, User, HelpCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const BOTTOM_NAV = [
  { to: "/",          icon: Home,         label: "Home",      labelTa: "முகப்பு"  },
  { to: "/services",  icon: LayoutGrid,   label: "Services",  labelTa: "சேவைகள்"  },
  { to: "/members",   icon: Users,        label: "Directory", labelTa: "பட்டியல்"  },
  { to: "/dashboard", icon: User,         label: "Account",   labelTa: "கணக்கு"   },
  { to: "/assistant", icon: HelpCircle,   label: "Help",      labelTa: "உதவி"     },
] as const;

export function BottomNavigation() {
  const loc = useLocation();
  const { language } = useLanguage();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border"
      aria-label="Mobile navigation"
      style={{ boxShadow: "0 -1px 0 var(--border), 0 -4px 16px -4px oklch(4% 0.004 95 / 0.16)" }}
    >
      <div className="flex items-stretch justify-around h-16 px-1">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.to === "/"
              ? loc.pathname === "/"
              : loc.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center justify-center gap-1 flex-1 relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                "transition-colors duration-200 min-h-[44px]",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {/* Active pill background */}
              {active && (
                <span
                  className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-7 rounded-full bg-primary/10"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                aria-hidden="true"
              />
              <span className={`text-[11px] font-semibold leading-tight relative z-10 ${active ? "text-primary" : "text-muted-foreground"}`}>
                {language === "ta" ? item.labelTa : item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iPhone home indicator safe area */}
      <div className="bg-card" style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
