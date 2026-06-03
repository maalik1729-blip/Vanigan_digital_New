import { useEffect, useRef, type ReactNode } from "react";

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("section-visible"); observer.disconnect(); } },
      { threshold: 0.05, rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`section-reveal max-w-7xl mx-auto px-5 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      <span className="w-6 h-px bg-gold" />
      {children}
    </div>
  );
}
