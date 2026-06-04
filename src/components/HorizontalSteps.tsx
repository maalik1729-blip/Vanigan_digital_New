import { useLanguage } from "@/hooks/useLanguage";
import { SectionLabel } from "@/components/Section";

const HOW_IT_WORKS = [
  { n: "01", t: "தகவல் நிரப்புக", e: "Fill your details",    td: "பெயர், கைபேசி, மாவட்டம், வணிக வகை.", d: "Name, mobile, district, business type." },
  { n: "02", t: "புகைப்படம் பதிவேற்றவும்", e: "Upload photo", td: "அடையாள அட்டைக்கு தெளிவான முன்பக்கப் புகைப்படம்.", d: "A clear front-facing photo for your ID card." },
  { n: "03", t: "சான்றிதழ் பெறு", e: "Get certificate",      td: "உடனடி டிஜிட்டல் சான்றிதழ் + EPIC அடையாள அட்டை.", d: "Instant digital certificate + EPIC ID." },
];

export function HorizontalSteps() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-slate-50/40 dark:bg-slate-900/5 border-t border-b border-border/50 py-16 md:py-24">
      
      {/* Ambient background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-primary blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[300px] h-[300px] rounded-full opacity-[0.03] bg-gold blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* Header Layout */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <SectionLabel>{t("எப்படி பெறுவது", "How it works")}</SectionLabel>
          <h2 className="mt-4 font-display text-3xl md:text-4.5xl font-bold leading-tight text-ink">
            {t(
              "3 எளிய படிகளில் பதிவுசெய்யப்பட்ட உறுப்பினராகுங்கள்.",
              "Become a registered member in 3 simple steps."
            )}
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
            {t(
              "மொத்த நேரம்: 5 நிமிடங்கள் · கட்டணம்: ₹500/ஆண்டு. உங்கள் வணிகத்தை எளிதாக டிஜிட்டல் மயமாக்குங்கள்.",
              "Total time: ~5 minutes · Fee: ₹500/year. Seamless digital onboarding for your shop."
            )}
          </p>
        </div>

        {/* Steps Grid (Responsive 1 -> 2 -> 3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative">
          
          {HOW_IT_WORKS.map((step, idx) => (
            <div
              key={step.n}
              className="card-base card-interactive w-full p-6 sm:p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[200px] sm:min-h-[230px] relative group"
            >
              {/* Corner Saffron Gold Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-gold/15 to-transparent rounded-tr-2xl rounded-bl-full" />
              
              {/* Header: Step Number */}
              <div className="flex justify-between items-center">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-gold dark:text-gold-light group-hover:scale-110 transition duration-300">
                  {step.n}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-muted-foreground">
                  {t(`படி ${idx + 1}`, `Step ${idx + 1}`)}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2 mt-4 flex-1">
                <h3 className="font-display font-bold text-ink text-base sm:text-lg">
                  {t(step.t, step.e)}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-tamil">
                  {t(step.td, step.d)}
                </p>
              </div>

              {/* Connecting indicator line for desktop view */}
              {idx < 2 && (
                <div className="absolute top-1/2 -right-4 lg:-right-5 w-4 lg:w-5 h-[1.5px] border-t-2 border-dashed border-border/60 pointer-events-none hidden lg:block" />
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
