import React from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  blur?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

/**
 * High-performance, CSS-only replacement for ScrollReveal.
 * Replaces heavy Framer Motion scroll triggers with clean, GPU-accelerated CSS animations.
 */
export function ScrollReveal({
  children,
  direction = "up",
  duration,
  delay = 0,
  className = "",
  stagger = false,
  staggerDelay = 0.08,
}: ScrollRevealProps) {
  const animClass = direction === "scale" || direction === "fade" ? "animate-fade-in" : "animate-slide-up";

  if (stagger && React.Children.count(children) > 1) {
    return (
      <div className={className}>
        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            className={animClass}
            style={{
              animationDelay: `${delay + i * staggerDelay}s`,
              ...(duration ? { animationDuration: `${duration}s` } : {}),
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${animClass} ${className}`}
      style={{
        ...(delay ? { animationDelay: `${delay}s` } : {}),
        ...(duration ? { animationDuration: `${duration}s` } : {}),
      }}
    >
      {children}
    </div>
  );
}

