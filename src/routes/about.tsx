import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionLabel } from "@/components/Section";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLanguage } from "@/hooks/useLanguage";
import { Target, Heart, Eye } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Learn about the mission, vision and history of Tamil Nadu Vanigargalin Sangamam — Tamil Nadu's official traders association." },
    ],
  }),
  component: About,
});

const pillars = [
  {
    i: Eye,
    t: "Our Vision", ta: "எங்கள் கனவு",
    d: "To be the most trusted voice and welfare body for every trader in Tamil Nadu — from the smallest petty shop to large wholesale merchants.",
    td: "தமிழ்நாட்டின் ஒவ்வொரு வணிகருக்கும் — சிறிய கடைகள் முதல் பெரிய மொத்த வணிகர்கள் வரை — நம்பகமான குரலாகவும் நலன் அமைப்பாகவும் திகழ்வது.",
  },
  {
    i: Target,
    t: "Our Mission", ta: "எங்கள் நோக்கம்",
    d: "Deliver simple, transparent, government-backed services that protect traders, formalize businesses, and unlock welfare benefits.",
    td: "வணிகர்களைப் பாதுகாக்கும், வணிகங்களை முறைப்படுத்தும், நலத்திட்ட சலுகைகளை வழங்கும் எளிய, வெளிப்படையான, அரசு ஆதரவு பெற்ற சேவைகளை வழங்குவது.",
  },
  {
    i: Heart,
    t: "Our Values", ta: "எங்கள் கொள்கைகள்",
    d: "Honesty in service, equality across districts, respect for tradition, and uncompromising trust in every digital interaction.",
    td: "சேவையில் நேர்மை, மாவட்டங்கள் முழுவதும் சமத்துவம், மரபுக்கு மரியாதை, மற்றும் ஒவ்வொரு டிஜிட்டல் தொடர்பிலும் சமரசமற்ற நம்பிக்கை.",
  },
];

const milestones = [
  { y: "2012", t: "Foundation",          ta: "நிறுவப்பட்டது",           d: "Established in Chennai by a council of 24 trader associations.",           td: "24 வணிகர் சங்கங்களின் கவுன்சிலால் சென்னையில் நிறுவப்பட்டது." },
  { y: "2016", t: "Statewide Expansion", ta: "மாநிலளாவிய விரிவாக்கம்",  d: "District chapters formed in all 38 districts of Tamil Nadu.",               td: "தமிழ்நாட்டின் அனைத்து 38 மாவட்டங்களிலும் மாவட்ட கிளைகள் அமைக்கப்பட்டன." },
  { y: "2019", t: "Welfare Fund Launch", ta: "நலன் நிதி தொடக்கம்",       d: "₹2 Cr corpus established for trader emergency and family support.",         td: "வணிகர் அவசர மற்றும் குடும்ப ஆதரவுக்காக ₹2 கோடி நிதி நிறுவப்பட்டது." },
  { y: "2023", t: "Digital Portal",      ta: "டிஜிட்டல் போர்ட்டல்",      d: "End-to-end online membership, payments and certificate delivery.",         td: "முழுமையான ஆன்லைன் உறுப்பினர் சேர்க்கை, கட்டணம் மற்றும் சான்றிதழ் வழங்கல்." },
  { y: "2025", t: "1.2 Lakh Members",   ta: "1.2 லட்சம் உறுப்பினர்கள்", d: "Crossed 1,24,560 registered members across all categories.",               td: "அனைத்து பிரிவுகளிலும் 1,24,560 பதிவுசெய்யப்பட்ட உறுப்பினர்களை கடந்தது." },
];

function About() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-16 w-full">
          <SectionLabel>{t("எங்களைப் பற்றி", "About")}</SectionLabel>
          <h1 className="mt-3 sm:mt-4 font-display font-semibold max-w-3xl">
            {t("நூறு ஆண்டு இயக்கம், நவீன போர்ட்டல்.", "A century-old movement, a modern portal.")}
          </h1>
          <p className="font-tamil mt-3 sm:mt-4 text-lg sm:text-xl text-foreground/75 max-w-3xl" lang="ta">
            {t("தமிழ்நாடு வணிகர்களின் ஒற்றுமை — ஒரு பாரம்பரியம், ஒரு பொறுப்பு.", "The unity of Tamil Nadu's traders — a heritage, a responsibility.")}
          </p>
        </div>
      </section>

      <Section className="py-10 sm:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((b, i) => (
            <ScrollReveal key={b.t} direction="up" delay={i * 0.1}>
              <div className="paper rounded-xl p-6 h-full">
                <div className="w-11 h-11 rounded-md bg-gold/15 grid place-items-center"><b.i className="w-5 h-5 text-primary" /></div>
                <h3 className="mt-4 font-display text-xl font-semibold">{t(b.ta, b.t)}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed font-tamil" lang={t("ta", "en")}>
                  {t(b.td, b.d)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <SectionLabel>{t("எங்கள் பயணம்", "Our Journey")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              {t("பன்னிரண்டு ஆண்டுகள், முப்பத்தெட்டு மாவட்டங்கள்.", "Twelve years, thirty-eight districts.")}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.y} direction="up" delay={i * 0.08}>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="font-display text-xl font-semibold text-gold w-20 shrink-0">{m.y}</div>
                  <div className="border-l border-border pl-6 pb-2 flex-1">
                    <div className="font-semibold text-ink">{t(m.ta, m.t)}</div>
                    <div className="text-sm text-muted-foreground mt-1 font-tamil" lang={t("ta", "en")}>{t(m.td, m.d)}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
