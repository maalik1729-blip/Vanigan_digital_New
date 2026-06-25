import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionLabel } from "@/components/Section";
import templeLogo from "@/assets/temple-logo.png";
import templeLogoAvif from "@/assets/temple-logo.avif";
import templeLogoAvif2x from "@/assets/temple-logo@2x.avif";
import templeLogoWebp from "@/assets/temple-logo.webp";
import templeLogoWebp2x from "@/assets/temple-logo@2x.webp";
import {
  Award, ShieldCheck, Users, IdCard, ArrowRight,
  CheckCircle, CheckCircle2, Sparkles, Phone, Coins, Play, Search,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { WordSwapper } from "@/components/WordSwapper";
import { HorizontalSteps } from "@/components/HorizontalSteps";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StackedServices } from "@/components/StackedServices";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollProgress } from "@/components/vanigan/Effects";
import {
  LoadingSequence, ScreenTransition,
} from "@/components/vanigan/Effects2";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tamil Nadu Vanigargalin Sangamam — Official Trader Portal" },
      { name: "description", content: "Join Tamil Nadu's official traders association. Membership, certificates, advocacy and business support for vanigars across the state." },
      { property: "og:title", content: "Tamil Nadu Vanigargalin Sangamam" },
      { property: "og:description", content: "Official portal for trader membership, services and business support." },
    ],
  }),
  component: Home,
});

const stats = [
  { v: "1,24,560+", l: "Registered Members",  t: "உறுப்பினர்கள்" },
  { v: "276",        l: "ID Cards Generated",  t: "அட்டைகள் உருவாக்கப்பட்டவை" },
  { v: "29",         l: "Referrals This Month", t: "பரிந்துரைகள்" },
  { v: "92.4%",      l: "Profiles Completed",  t: "விவரங்கள் நிரப்பப்பட்டவை" },
];

// WhatsApp bot quick-action flow icons from vanigan.digital (optimized WebP)
const FLOW_ACTIONS = [
  { img: "/flow-images/flow_register_1775026021.webp",         label: "Register",        labelTa: "பதிவு",          to: "/membership" },
  { img: "/flow-images/flow_view_card_1775026089.webp",        label: "Get ID Card",     labelTa: "அட்டை பெறு",     to: "/voter-id" },
  { img: "/flow-images/flow_how_to_register_1775026438.webp",  label: "How to Register", labelTa: "எப்படி பதிவு?",   to: "/membership" },
  { img: "/flow-images/flow_refer_friend_1775026106.webp",     label: "Refer a Friend",  labelTa: "நண்பரை அழை",    to: "/membership" },
  { img: "/flow-images/flow_become_organizer_1775026124.webp", label: "Be an Organizer", labelTa: "நிர்வாகி ஆகு",   to: "/members" },
  { img: "/flow-images/flow_your_members_1775026138.webp",     label: "Your Members",    labelTa: "உறுப்பினர்கள்",  to: "/members" },
  { img: "/flow-images/flow_request_loan_1775026153.webp",     label: "Request Loan",    labelTa: "கடன் கோரிக்கை", to: "/members" },
  { img: "/flow-images/flow_wings_list_1775026034.webp",       label: "Wings",           labelTa: "பிரிவுகள்",       to: "/wings" },
  { img: "/flow-images/flow_website_1775026047.webp",          label: "Website",         labelTa: "இணையதளம்",       to: "/" },
  { img: "/flow-images/flow_download_1775026063.webp",         label: "Download",        labelTa: "பதிவிறக்கம்",    to: "/voter-id" },
  { img: "/flow-images/flow_help_support_1775026075.webp",     label: "Help & Support",  labelTa: "உதவி",            to: "/assistant" },
];

const faqs = [
  {
    q: "சங்கத்தில் உறுப்பினராக எவ்வாறு விண்ணப்பிப்பது?",
    e: "How do I apply for membership?",
    a: "விண்ணப்பிக்க 'உறுப்பினர் சேர்க்கை' பொத்தானைக் கிளிக் செய்து, உங்கள் தனிப்பட்ட மற்றும் வணிக விவரங்களை நிரப்பவும். பின்னர் கடை புகைப்படம் மற்றும் அடையாளச் சான்றை பதிவேற்றி, ஆண்டுக் கட்டணத்தைச் செலுத்தினால், உங்கள் EPIC அடையாள அட்டையும் சான்றிதழும் உடனடியாக உருவாக்கப்படும்.",
    ae: "Click on 'Apply for Membership', fill in your personal and business details, upload a shop photo and a valid ID proof, pay the annual registration fee online, and your official EPIC ID card and certificate will be generated instantly."
  },
  {
    q: "உறுப்பினர் சேர்க்கைக்கு என்னென்ன ஆவணங்கள் தேவை?",
    e: "What documents are required for registration?",
    a: "விண்ணப்பிக்க செல்லுபடியாகும் அடையாளச் சான்று (ஆதார் அட்டை, வாக்காளர் அடையாள அட்டை அல்லது GSTIN) மற்றும் உங்கள் கடை/வணிகத்தின் முன்பக்க புகைப்படம் மட்டுமே போதுமானது.",
    ae: "You only need a valid government-issued ID proof (Aadhaar Card, Voter ID, or GSTIN) and a clear front photograph of your shop/business premises."
  },
  {
    q: "இந்த டிஜிட்டல் சான்றிதழ் சட்டப்பூர்வமாக செல்லுபடியாகுமா?",
    e: "Is the digital certificate legally valid?",
    a: "ஆம், தமிழ்நாடு வணிகர்களின் சங்கமம் பதிவு எண். 2012/TNVS கீழ் பதிவு செய்யப்பட்ட அதிகாரப்பூர்வ அமைப்பாகும். QR குறியீடு சரிபார்ப்புடன் கூடிய இந்த டிஜிட்டல் சான்றிதழ் வங்கி வணிகக் கடன்கள், வர்த்தக அங்கீகாரங்கள் மற்றும் இதர வணிகச் சரிபார்ப்புகளுக்குச் செல்லுபடியாகும்.",
    ae: "Yes, Tamil Nadu Vanigargalin Sangamam is a registered traders association (Reg No. 2012/TNVS). The QR-code-verified digital certificate is widely accepted for bank business loans, trade references, and official merchant verifications."
  },
  {
    q: "உறுப்பினர் அட்டை மற்றும் சான்றிதழ் செல்லுபடியாகும் காலம் எவ்வளவு?",
    e: "How long is the membership valid?",
    a: "சங்கத்தின் உறுப்பினர் சேர்க்கை பதிவு செய்த நாளிலிருந்து 1 வருடத்திற்குச் செல்லுபடியாகும். காலம் முடிவதற்குள் உங்கள் EPIC எண் மூலம் ஆன்லைனிலேயே எளிய முறையில் புதுப்பித்துக் கொள்ளலாம்.",
    ae: "Membership is valid for exactly 1 year from the date of registration. You can easily renew it online using your EPIC number before it expires."
  }
];

// MockupCard is now in @/components/MockupCard.tsx
// Only 3 top services on homepage — full list on /services

const TOP_SERVICES = [
  {
    i: Users,
    t: "புதிய உறுப்பினர் சேர்க்கை",
    e: "Apply for Membership",
    d: "Apply online in 5 minutes — get your official EPIC ID and stamped certificate instantly.",
    td: "5 நிமிடங்களில் ஆன்லைனில் விண்ணப்பிக்கவும் — உடனடி EPIC ID மற்றும் சான்றிதழ் பெறுங்கள்.",
    to: "/membership",
    badge: "START HERE",
    className: "md:col-span-2",
  },
  {
    i: IdCard,
    t: "சங்கம அட்டை பெறுக",
    e: "Get My Membership Card",
    d: "Search by name or EPIC — generate your official TNVS front & back membership card instantly.",
    td: "பெயர் அல்லது EPIC மூலம் தேடுங்கள் — உங்கள் அதிகாரப்பூர்வ TNVS உறுப்பினர் அட்டையை உருவாக்குங்கள்.",
    to: "/voter-id",
    badge: "INSTANT",
    className: "md:col-span-1 md:row-span-2",
    isTall: true,
  },
  {
    i: ShieldCheck,
    t: "வணிகப் பாதுகாப்பு",
    e: "Trade Protection",
    d: "Advocacy, legal support, and trade rights mediation for all registered traders.",
    td: "வணிகர்களுக்கான சட்ட உதவி, வர்த்தக உரிமைப் பாதுகாப்பு மற்றும் ஆலோசனைகள்.",
    to: "/members",
    badge: null,
    className: "md:col-span-1",
  },
  {
    i: Coins,
    t: "வட்டி இல்லா வணிகக் கடன்",
    e: "Interest-Free Loans",
    d: "Access micro-credit schemes and interest-free business loans for small traders.",
    td: "குறுந்தொழில் மற்றும் சிறு வணிகர்களுக்கான வட்டி இல்லா கடன் மற்றும் நிதி உதவிகள்.",
    to: "/members",
    badge: "NEW",
    className: "md:col-span-1",
  },
];

const HOW_IT_WORKS = [
  { n: "01", t: "தகவல் நிரப்புக", e: "Fill your details",    td: "பெயர், கைபேசி, மாவட்டம், வணிக வகை.", d: "Name, mobile, district, business type." },
  { n: "02", t: "புகைப்படம் பதிவேற்றவும்", e: "Upload photo", td: "அடையாள அட்டைக்கு தெளிவான முன்பக்கப் புகைப்படம்.", d: "A clear front-facing photo for your ID card." },
  { n: "03", t: "சான்றிதழ் பெறு", e: "Get certificate",      td: "உடனடி டிஜிட்டல் சான்றிதழ் + EPIC அடையாள அட்டை.", d: "Instant digital certificate + EPIC ID." },
];

function Home() {
  const { language, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleVoterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/voter-id", search: { epic: searchQuery.trim() } });
    }
  };

  return (
    <div className="pb-16 sm:pb-0">
      <LoadingSequence />
      <ScreenTransition />
      <ScrollProgress />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        {/* ── Edition metadata strip ───────────────────────────────── */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto py-2 px-4 flex items-center justify-between">
            <span
              className="text-foreground/45 text-[9px] tracking-[0.35em] uppercase font-mono"
            >
              Est. 2024 · The Tamil Nadu Business Register
            </span>
            <span
              className="text-foreground/45 text-[9px] tracking-[0.35em] uppercase hidden md:block font-mono"
            >
              18,428+ Verified Listings · 38 Districts
            </span>
          </div>
        </div>

        {/* ── Ambient background orbs — give the hero depth & warmth ───── */}
        <div aria-hidden="true" className="pointer-events-none">
          {/* Large navy orb — top-right */}
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, oklch(0.30 0.14 255) 0%, transparent 70%)" }}
          />
          {/* Gold accent orb — bottom-left */}
          <div className="absolute -bottom-16 -left-16 w-[300px] h-[300px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.12 85) 0%, transparent 70%)" }}
          />
          {/* Subtle dot pattern overlay */}
          <div className="absolute inset-0 bg-primary/1.5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-10 sm:pt-14 pb-10 sm:pb-16 grid md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 items-center">

          <div className="lg:col-span-7 animate-slide-up">
            <SectionLabel>
              {t("அரசு அங்கீகரிக்கப்பட்டது · பதிவு எண். 2012/TNVS", "Government Registered · Reg. No. 2012/TNVS")}
            </SectionLabel>

            <h1 className="mt-4 sm:mt-5 font-display font-semibold leading-[1.06] text-ink"
               style={{ fontSize: language === "ta" ? "clamp(1.5rem, 4.2vw + 0.3rem, 3rem)" : "clamp(1.75rem, 5vw + 0.5rem, 3.75rem)" }}>
              {language === "ta" ? (
                <>
                  தமிழ்நாடு வணிகர்களின்{" "}
                  <span className="animate-text-gradient">
                    அதிகாரப்பூர்வ இல்லம்.
                  </span>
                </>
              ) : (
                <>
                  The <span className="animate-text-gradient">official home</span> of Tamil Nadu's traders.
                </>
              )}
            </h1>

            <p className="font-tamil text-base sm:text-lg md:text-xl mt-3 sm:mt-4 text-foreground/80 leading-snug">
              {t(
                "தமிழ்நாடு வணிகர்களின் சங்கமம் — அரசு அங்கீகரிக்கப்பட்ட உத்தியோகபூர்வ அமைப்பு.",
                "Tamil Nadu Vanigargalin Sangamam — Govt. Approved Official Organization."
              )}
            </p>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              {t(
                "உறுப்பினர் சேர்க்கைக்கு விண்ணப்பிக்கவும், உங்கள் அதிகாரப்பூர்வ சான்றிதழைப் பதிவிறக்கவும், வணிக ஆதரவை அணுகவும் — அனைத்தும் ஒரே நம்பகமான போர்ட்டலில்.",
                "Apply for membership, download your official certificate, access business support — all from one trusted portal."
              )}
            </p>

            {/* Single primary CTA + secondary text link */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-6">
              <Link
                to="/membership"
                className="btn-primary text-sm sm:text-base px-5 sm:px-6 inline-flex w-full sm:w-auto justify-center"
              >
                <Users className="w-4 h-4" aria-hidden="true" />
                {t("உறுப்பினர் சேர்க்கைக்கு விண்ணப்பிக்க", "Apply for Membership")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/voter-id"
                search={{ epic: undefined }}
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center justify-center sm:justify-start gap-1.5 py-2"
              >
                <IdCard className="w-4 h-4" aria-hidden="true" />
                {t("ஏற்கனவே உறுப்பினரா? என் அட்டை பெறுக →", "Already a member? Get your card →")}
              </Link>
            </div>

            {/* Voter Search Box - Prominent in Hero */}
            <div className="mt-6 sm:mt-8">
              <form onSubmit={handleVoterSearch} className="relative">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("பெயர் அல்லது EPIC எண்ணால் தேடவும்...", "Search by name or EPIC number...")}
                    className="w-full pl-12 pr-4 py-3.5 rounded-md border-2 border-border bg-card text-sm sm:text-base focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t("தேடு", "Search")}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-tamil">
                  {t("உறுப்பினர் அட்டையை உடனடியாக உருவாக்க உங்கள் பெயர் அல்லது EPIC எண்ணை உள்ளிடவும்.", "Enter your name or EPIC number to generate your member card instantly.")}
                </p>
              </form>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                {t("தமிழக அரசால் அங்கீகரிக்கப்பட்டது", "Govt. of Tamil Nadu approved")}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
                {t("உடனடி டிஜிட்டல் சான்றிதழ்", "Instant digital certificate")}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <a href="tel:04423456789" className="hover:text-primary transition">044-2345-6789</a>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center animate-fade-in">
            <picture>
              <source type="image/avif" srcSet={`${templeLogoAvif} 400w, ${templeLogoAvif2x} 800w`} />
              <source type="image/webp" srcSet={`${templeLogoWebp} 400w, ${templeLogoWebp2x} 800w`} />
              <img
                src={templeLogo}
                alt="Tamil Nadu Vanigargalin Sangamam emblem"
                className="w-full max-w-[180px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] h-auto object-contain mx-auto"
                width="400"
                height="400"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* STATS — moved above services for stronger trust signal */}
      <Section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-md overflow-hidden paper p-0">
          {stats.map((s, idx) => (
            <ScrollReveal
              key={s.l}
              delay={idx * 0.09}
              direction="up"
              blur
              className="bg-card p-4 sm:p-6 text-center"
            >
              <div className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold text-primary tabular-nums">
                <AnimatedCounter value={s.v} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 sm:mt-2 uppercase tracking-wider font-semibold">
                {t(s.t, s.l)}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* OFFICIAL BADGES & CERTIFICATIONS */}
      <Section className="py-10">
        <ScrollReveal direction="up" blur>
          <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-md p-6 md:p-8 text-white shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Official Recognition
                  </span>
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold mb-1">
                  {t("அரசு பதிவு எண்: 2012/TNVS", "Registered No: 2012/TNVS")}
                </h3>
                <p className="text-xs text-muted-foreground font-tamil">
                  {t("தமிழ்நாடு அரசியல் பதிவு செய்யப்பட்ட வணிகர்கள் சங்கமம்", "Govt. of Tamil Nadu Registered Traders Association")}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                    <Award className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("ISO", "ISO")}
                  </div>
                  <div className="text-xs font-bold">9001</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("சான்று", "Certified")}
                  </div>
                  <div className="text-xs font-bold">2024</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* HOW IT WORKS — Horizontal scroll-linked steps */}
      <HorizontalSteps />



      {/* QUICK ACTIONS — WhatsApp Bot Flow Icons */}
      <Section className="py-14 border-t border-border bg-linear-to-br from-slate-50 to-white">
        <ScrollReveal direction="up" blur className="text-center mb-10">

          <SectionLabel>{t("விரைவு சேவைகள்", "Quick Actions")}</SectionLabel>
          <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold text-ink">
            {t("WhatsApp வழியாக இந்த சேவைகளை பயன்படுத்துங்கள்", "Access our services instantly")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            {t(
              "எங்கள் டிஜிட்டல் போட் மூலம் பதிவு, அட்டை பதிவிறக்கம், கடன் கோரிக்கை மற்றும் பல சேவைகளை எளிதாக அணுகலாம்.",
              "Register, download your ID card, request loans, and more — all accessible through our digital portal."
            )}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3 max-w-5xl mx-auto">
            {FLOW_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-primary/5 hover:shadow-xs transition-all duration-200 cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 border-border group-hover:border-primary/30 transition-all duration-200 shadow-xs group-hover:shadow-xs group-hover:scale-110">
                  <img
                    src={action.img}
                    alt={action.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">
                  {t(action.labelTa, action.label)}
                </span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </Section>



      {/* CTA after steps */}
      <div className="flex justify-center py-8 border-b border-border bg-background">
        <Link to="/membership" className="btn-primary text-sm sm:text-base px-8">
          <Users className="w-4 h-4" aria-hidden="true" />
          {t("இப்போதே விண்ணப்பிக்கவும்", "Start My Application")}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {/* TOP 3 SERVICES */}
      <Section className="pt-10 pb-16 border-t border-border">
        <ScrollReveal direction="up" blur className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <SectionLabel>{t("எங்கள் சேவைகள்", "Our Services")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold">
              <WordSwapper />
            </h2>
          </div>
          <Link
            to="/members"
            className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            {t("அனைத்து சேவைகளையும் காண்க", "View all services")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <div className="w-full py-8">
          <StackedServices services={TOP_SERVICES} />
        </div>
      </Section>



      {/* WATCH OUR STORY — VIDEO SECTION */}
      <Section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-8">
            <SectionLabel>{t("எங்கள் கதை", "Our Story")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-foreground">
              {t("சங்கமத்தை பற்றி அறிந்துகொள்ளுங்கள்", "Watch Our Story")}
            </h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto font-tamil">
              {t(
                "தமிழ்நாடு வணிகர்களின் சங்கமம் எப்படி உருவானது, என்ன செய்கிறது என்பதை இந்த காணொளியில் அறியுங்கள்.",
                "Learn how Tamil Nadu Vanigargalin Sangamam was founded, what we stand for, and how we serve traders across the state."
              )}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="relative rounded-md overflow-hidden shadow-xl border border-border bg-black group">
              <video
                ref={videoRef}
                src="/welcome_video.mp4"
                controls
                preload="none"
                poster="/favicon.png"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full block aspect-video object-cover"
                style={{
                  // Force GPU hardware acceleration for ultra-smooth rendering & fluid scaling
                  willChange: "transform",
                  transform: "translate3d(0, 0, 0)",
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  // Optimize sub-pixel details and rendering clarity
                  imageRendering: "auto",
                }}
                aria-label={t(
                  "தமிழ்நாடு வணிகர்களின் சங்கமம் வரவேற்பு காணொளி",
                  "Tamil Nadu Vanigargalin Sangamam welcome video"
                )}
              />
              {/* Play/Pause overlay */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors cursor-pointer z-10 w-full h-full border-none focus:outline-none"
                    aria-label={t("காணொளியை இயக்கு", "Play Video")}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-110">
                      <Play className="w-7 h-7 text-white fill-white ml-0.5" aria-hidden="true" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </Section>



      {/* TESTIMONIALS SECTION */}
      <Section className="py-16 border-t border-border bg-background">
        <ScrollReveal direction="up" className="text-center mb-10">
          <SectionLabel>{t("உறுப்பினர் வெற்றிக் கதைகள்", "Member Success Stories")}</SectionLabel>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-ink">
            {t("வணிகர்களின் உண்மை அனுபவங்கள்.", "Real experiences from real traders.")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("சங்கத்தில் இணைந்த பிறகு தங்கள் வணிகத்தில் வளர்ச்சி கண்ட உறுப்பினர்களின் கருத்துக்கள்.", "Feedback from members who experienced growth in their businesses after joining.")}
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <TestimonialCarousel />
        </ScrollReveal>
      </Section>



      {/* FAQ SECTION */}
      <Section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-10">
            <SectionLabel>{t("அடிக்கடி கேட்கப்படும் கேள்விகள்", "Frequently Asked Questions")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-ink">
              {t("உங்களுக்கு ஏதேனும் சந்தேகங்கள் உள்ளதா?", "Have questions? We have answers.")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("சங்கத்தில் இணைவது மற்றும் அதன் பயன்கள் பற்றிய பொதுவான கேள்விகள்.", "Common questions about joining the association and its benefits.")}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border rounded-md px-5 bg-card shadow-xs hover:border-primary/20 transition-all duration-200"
                >
                  <AccordionTrigger className="font-display font-semibold text-foreground text-sm md:text-base py-5 hover:no-underline hover:text-primary">
                    {t(faq.q, faq.e)}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-muted-foreground text-xs md:text-sm leading-relaxed pb-5 border-t border-slate-50 pt-3 font-tamil"
                    lang={language === "ta" ? "ta" : "en"}
                  >
                    {t(faq.a, faq.ae)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <ScrollReveal direction="scale" duration={0.7} className="w-full">
          <div className="relative overflow-hidden rounded-md bg-primary text-primary-foreground p-10 md:p-14">
            <div className="absolute inset-0 opacity-10 bg-black/20" aria-hidden="true" />
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 mb-3">
                <span className="w-6 h-px bg-white/40" />
                {t("இன்றே இணையுங்கள்", "Join today")}
              </div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold">
                {t("ஒன்றாக நிற்போம். பலத்துடன் வணிகம் செய்வோம்.", "Stand together. Trade with strength.")}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-primary-foreground/70">
                {[
                  t("உடனடி சான்றிதழ்", "Instant certificate"),
                  t("சட்ட ஆலோசனை", "Legal advisory"),
                  t("₹500/ஆண்டு", "₹500/year"),
                  t("38 மாவட்டங்கள்", "38 districts"),
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-7">
                <Link
                  to="/membership"
                  className="btn-primary bg-gold text-gold-foreground hover:bg-gold/90 text-base px-7"
                >
                  {t("உறுப்பினர் சேர்க்கைக்கு விண்ணப்பிக்கவும்", "Apply for Membership")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>
      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-primary/95 backdrop-blur-sm border-t border-primary/20 px-4 py-3">
        <Link
          to="/membership"
          className="btn-primary w-full justify-center text-sm py-2.5"
        >
          <Users className="w-4 h-4" aria-hidden="true" />
          {t("இணைவு — ₹500/ஆண்டு", "Join — ₹500/year")}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
