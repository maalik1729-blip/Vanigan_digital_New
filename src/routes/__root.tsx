import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
  useLocation,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "@/hooks/useTheme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-7xl font-display font-bold text-primary">404</h2>
        <h3 className="mt-4 text-xl font-semibold">பக்கம் காணப்படவில்லை</h3>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          முகப்பு / Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tamil Nadu Vanigargalin Sangamam — Trader Membership Portal" },
      { name: "description", content: "Official portal for Tamil Nadu Vanigargalin Sangamam. Apply for membership, download certificates, and access business support." },
      { name: "theme-color", content: "#1e3a8a" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;600&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png?v=2", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png?v=2" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { LoadingPage } from "./loading";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <RootInner />
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function RootInner() {
  const { language } = useLanguage();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setShowSplash(false);
      }, 550);
      return () => clearTimeout(removeTimer);
    }, 2200);

    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
          .then((reg) => console.log("Service Worker registered successfully with scope:", reg.scope))
          .catch((err) => console.error("Service Worker registration failed:", err));
      });
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {showSplash && (
        <div className={`fixed inset-0 z-200 transition-opacity duration-500 ease-in-out ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <LoadingPage />
        </div>
      )}
      {/*
        Header height breakdown:
          gov-stripe:   3px
          ticker bar:   ~32px on desktop, ~30px on mobile
          nav row:      h-16 = 64px
        Total:          ~99px desktop / ~99px mobile
        We use pt-[99px] with a safe fallback.
        Bottom nav adds 60px on mobile, so we add pb-[60px] for mobile.
      */}
      <div className="min-h-screen flex flex-col pt-[99px] pb-[60px] xl:pb-0">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1"><Outlet /></main>
        <SiteFooter />
      </div>
      <BottomNavigation />
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}
