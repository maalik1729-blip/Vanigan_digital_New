import { useState, useEffect } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const wordsEn = ["trader", "business", "merchant", "retailer", "shopkeeper"];
const wordsTa = [
  "வணிகர்களுக்குத்",
  "வியாபாரிகளுக்குத்",
  "உறுப்பினர்களுக்குத்",
  "தொழில்முனைவோருக்குத்",
  "சிறு வணிகர்களுக்குத்",
];

export function WordSwapper() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);

  const words = language === "ta" ? wordsTa : wordsEn;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [words.length]);

  // Reset index to 0 when language switches
  useEffect(() => {
    setIndex(0);
  }, [language]);

  const currentWord = words[index] || "";

  // Animation variants for smooth vertical slide & fade
  const variants = {
    enter: {
      y: 20,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: "spring" as const, stiffness: 260, damping: 20 },
        opacity: { duration: 0.25 },
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        y: { type: "spring" as const, stiffness: 260, damping: 20 },
        opacity: { duration: 0.25 },
      },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
    <span className="block select-none">
      {language === "ta" ? (
        <span className="flex flex-col lg:flex-row lg:items-center lg:gap-x-2">
          <span className="relative inline-block h-[1.3em] overflow-hidden align-middle whitespace-nowrap">
            {/* Invisible spacer to reserve exact width naturally */}
            <span className="invisible select-none" aria-hidden="true">{currentWord}</span>
            <AnimatePresence mode="wait">
              <m.span
                key={currentWord}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute left-0 top-0 w-full text-left font-display animate-text-gradient bg-clip-text text-transparent bg-linear-to-r from-gold via-amber-500 to-orange-500 bg-size-[200%_auto]"
              >
                {currentWord}
              </m.span>
            </AnimatePresence>
          </span>
          <span className="whitespace-nowrap">தேவையான அனைத்தும்.</span>
        </span>
      ) : (
        <span className="flex flex-col lg:flex-row lg:items-center lg:gap-x-2">
          <span className="inline-flex items-center whitespace-nowrap">
            <span>Everything a</span>
            <span className="relative inline-block h-[1.3em] overflow-hidden align-middle mx-1.5 md:mx-2 whitespace-nowrap">
              {/* Invisible spacer to reserve exact width naturally */}
              <span className="invisible select-none" aria-hidden="true">{currentWord}</span>
              <AnimatePresence mode="wait">
                <m.span
                  key={currentWord}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute left-0 top-0 w-full text-left font-display animate-text-gradient bg-clip-text text-transparent bg-linear-to-r from-gold via-amber-500 to-orange-500 bg-size-[200%_auto]"
                >
                  {currentWord}
                </m.span>
              </AnimatePresence>
            </span>
          </span>
          <span className="whitespace-nowrap">needs.</span>
        </span>
      )}
    </span>
    </LazyMotion>
  );
}
