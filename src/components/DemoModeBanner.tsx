import { Info, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface DemoModeBannerProps {
  message?: string;
  messageTa?: string;
  dismissible?: boolean;
}

/**
 * Premium Blue info banner shown on pages with simulated/demo data.
 * Uses --color-surface-info, --color-border-info, and --color-text-info.
 */
export function DemoModeBanner({
  message = "Preview Mode — This dashboard shows demo data. Real data will be available after official launch.",
  messageTa = "முன்னோட்ட பயன்முறை — இந்த டாஷ்போர்டு மாதிரி தரவைக் காட்டுகிறது. அதிகாரப்பூர்வ வெளியீட்டிற்குப் பிறகு உண்மையான தரவு கிடைக்கும்.",
  dismissible = true,
}: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { language } = useLanguage();

  if (dismissed) return null;

  return (
    <div
      role="status"
      aria-label="Demo mode notice"
      className="flex items-start gap-3 bg-surface-info border border-border-info rounded-xl p-4 text-sm text-text-info shadow-xs animate-fade-in"
    >
      <Info
        className="w-5 h-5 shrink-0 mt-0.5 text-text-info"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-text-info">
          {language === "ta" ? "முன்னோட்ட பயன்முறை / Demo & Preview Mode" : "Demo & Preview Mode / முன்னோட்ட பயன்முறை"}
        </p>
        <p className="text-xs text-text-info/90 mt-1 leading-relaxed font-tamil">{messageTa}</p>
        <p className="text-xs text-text-info/90 mt-0.5 leading-relaxed">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss demo mode notice"
          className="shrink-0 p-1 rounded-lg hover:bg-text-info/10 transition text-text-info"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

