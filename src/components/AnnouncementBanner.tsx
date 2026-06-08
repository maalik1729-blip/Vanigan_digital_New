import { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const ANNOUNCEMENTS_EN = [
  "Latest Govt Circular: Special GST relief for micro-traders announced!",
  "TNVS Certificate is now legally valid for bank loan applications.",
  "Annual General Meeting on June 15th at Chennai — all members invited.",
];

const ANNOUNCEMENTS_TA = [
  "புதிய அரசு சுற்றறிக்கை: குறுந்தொழில் முனைவோருக்கான சிறப்பு ஜிஎஸ்டி சலுகை அறிவிப்பு!",
  "சங்கமத்தின் அதிகாரப்பூர்வ சான்றிதழ் வங்கி கடன் பெற செல்லுபடியாகும்.",
  "ஆண்டு பொதுக்குழு கூட்டம் ஜூன் 15 அன்று சென்னையில் நடைபெறும்.",
];

const STORAGE_KEY = "tnvs_banner_dismissed_v1";

export function AnnouncementBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Only show if user hasn't dismissed this session
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  // Rotate announcements every 5 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % ANNOUNCEMENTS_EN.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  if (!visible) return null;

  const announcements = language === "ta" ? ANNOUNCEMENTS_TA : ANNOUNCEMENTS_EN;
  const current = announcements[currentIdx];

  return (
    <div
      className="bg-primary text-white px-4 py-2 flex items-center gap-3"
      role="region"
      aria-label="Announcements"
      aria-live="polite"
    >
      {/* Icon */}
      <Megaphone className="w-3.5 h-3.5 shrink-0 text-white/70" aria-hidden="true" />

      {/* Announcement text */}
      <p className="flex-1 text-xs font-medium text-white/90 leading-snug line-clamp-1 font-tamil">
        {current}
      </p>

      {/* Dot indicators */}
      <div className="hidden sm:flex items-center gap-1 shrink-0" aria-hidden="true">
        {announcements.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIdx ? "bg-white scale-125" : "bg-white/40"
            }`}
            aria-label={`Announcement ${i + 1}`}
          />
        ))}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcements"
        className="p-1 rounded hover:bg-white/20 transition ml-1 shrink-0 cursor-pointer"
      >
        <X className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
      </button>
    </div>
  );
}
