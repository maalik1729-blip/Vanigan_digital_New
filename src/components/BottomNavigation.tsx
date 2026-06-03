import { Link, useLocation } from "@tanstack/react-router";
import { Home, User, Search, LayoutGrid, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const BOTTOM_NAV = [
  { to: "/", icon: Home, label: "Home", labelTa: "முகப்பு" },
  { to: "/membership", icon: User, label: "Membership", labelTa: "உறுப்பினர்" },
  { to: "/voter-id", icon: Search, label: "Search", labelTa: "தேடல்" },
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard", labelTa: "கட்டுப்பாட்டு அறை" },
  { to: "/services", icon: MoreHorizontal, label: "Services", labelTa: "சேவைகள்" },
] as const;

export function BottomNavigation() {
  const loc = useLocation();
  const { language } = useLanguage();

  return (
    <nav
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-[60px] px-2">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const active = loc.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] rounded-lg transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                active
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
              <span className="text-[11px] font-medium leading-tight">
                {language === "ta" ? item.labelTa : item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  );
}
