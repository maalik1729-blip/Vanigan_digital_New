import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number; // in ms
}

export function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Parse the value string
    // Extract prefix (like ₹)
    const prefixMatch = value.match(/^[^\d]+/);
    const prefix = prefixMatch ? prefixMatch[0] : "";

    // Extract suffix (like + or Cr)
    const suffixMatch = value.match(/[^\d.]+$/);
    const suffix = suffixMatch ? suffixMatch[0] : "";

    // Extract the numeric part (remove prefix, suffix and commas)
    const numericStr = value
      .replace(prefix, "")
      .replace(suffix, "")
      .replace(/,/g, "");
    
    const targetNumber = parseFloat(numericStr);
    
    if (isNaN(targetNumber)) {
      setDisplayValue(value);
      return;
    }

    // Determine if it has decimal points
    const decimalMatch = numericStr.match(/\.(\d+)/);
    const decimals = decimalMatch ? decimalMatch[1].length : 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (easeOutQuad)
            const easeProgress = percentage * (2 - percentage);
            const currentValue = easeProgress * targetNumber;

            // Format current value
            let formattedNumber = "";
            if (decimals > 0) {
              formattedNumber = currentValue.toFixed(decimals);
            } else {
              const rounded = Math.floor(currentValue);
              // Use Indian locale formatting (en-IN)
              formattedNumber = rounded.toLocaleString("en-IN");
            }

            setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

            if (progress < duration) {
              requestAnimationFrame(animate);
            } else {
              // Ensure we display exactly the final string at the end
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return <span ref={elementRef}>{displayValue}</span>;
}
