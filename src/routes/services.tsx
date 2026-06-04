import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Section, SectionLabel } from "@/components/Section";
import { 
  FileCheck, Award, ShieldCheck, Building2, Scale, Users, Briefcase, 
  GraduationCap, HeartPulse, ArrowRight, X, QrCode, CreditCard, CheckCircle2,
  Sparkles, ShieldAlert, Check, HelpCircle, Coins, Store, Factory, Globe, Rocket
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Membership, certification, welfare schemes, legal advisory and business support services for Tamil Nadu traders." },
    ],
  }),
  component: Services,
});

type ServiceItem = {
  i: React.ComponentType<any>;
  t: string;
  e: string;
  d: string;
  de: string;
  to?: string;
  modalType?: "renewal" | "welfare" | "support" | "loan";
};

type Category = {
  label: string;
  labelEn: string;
  items: ServiceItem[];
};

const cats: Category[] = [
  {
    label: "உறுப்பினர் சேர்க்கை",
    labelEn: "Membership",
    items: [
      { i: Users, t: "புதிய உறுப்பினர் சேர்க்கை", e: "New Membership", d: "ஆன்லைனில் 5 நிமிடங்களில் விண்ணப்பிக்கவும் - உடனடி EPIC ஐடி.", de: "Online application with instant EPIC ID.", to: "/membership" },
      { i: FileCheck, t: "சான்றிதழ் பதிவிறக்கம்", e: "Certificate Download", d: "முத்திரையிடப்பட்ட டிஜிட்டல் சான்றிதழ் மற்றும் PDF அடையாள அட்டை.", de: "Stamped digital certificate and PDF ID card.", to: "/voter-id" },
      { i: Award, t: "உறுப்பினர் புதுப்பித்தல்", e: "Membership Renewal", d: "ஒரே கிளிக்கில் UPI கட்டணம் மூலம் ஆண்டுதோறும் புதுப்பிக்கவும்.", de: "Renew yearly with one-click UPI payment.", modalType: "renewal" },
    ],
  },
  {
    label: "நலத்திட்டங்கள்",
    labelEn: "Welfare Schemes",
    items: [
      { i: HeartPulse, t: "சுகாதார காப்பீடு", e: "Health Insurance", d: "உறுப்பினர்கள் மற்றும் குடும்பத்தினருக்கு ₹2 லட்சம் வரை மருத்துவக் காப்பீடு.", de: "Group cover up to ₹2 lakh for members and family.", modalType: "welfare" },
      { i: GraduationCap, t: "கல்வி உதவித்தொகை", e: "Scholarships", d: "பதிவுசெய்யப்பட்ட வணிகர்களின் குழந்தைகளுக்கு ஆண்டு கல்வி உதவித்தொகை.", de: "Annual scholarships for children of registered traders.", modalType: "welfare" },
      { i: ShieldCheck, t: "அவசர நிவாரண நிதி", e: "Emergency Aid", d: "48 மணி நேரத்திற்குள் தீ, வெள்ளம் மற்றும் இயற்கை பேரிடர் ஆதரவு.", de: "Fire, flood and bereavement support within 48 hours.", modalType: "welfare" },
    ],
  },
  {
    label: "வணிக ஆதரவு",
    labelEn: "Business Support",
    items: [
      { i: Building2, t: "கடை பதிவு உதவி", e: "Shop Registration", d: "GST, கடை உரிமம், FSSAI, MSME தாக்கல் செய்வதற்கான உதவி.", de: "GST, shop & estd, FSSAI, MSME filing assistance.", modalType: "support" },
      { i: Scale, t: "சட்ட ஆலோசனை", e: "Legal Advisory", d: "உறுப்பினர்களுக்கான இலவச சட்ட உதவி மற்றும் தகராறு தீர்வு.", de: "Free legal aid and dispute mediation for members.", modalType: "support" },
      { i: Briefcase, t: "வணிகக் கண்காட்சிகள்", e: "Trade Exhibitions", d: "தயாரிப்புகளைக் காட்சிப்படுத்த மாவட்ட மற்றும் மாநில அளவிலான கண்காட்சிகள்.", de: "District and state level fairs to showcase products.", modalType: "support" },
    ],
  },
  {
    label: "கடன் கோரிக்கை",
    labelEn: "Loan Assistance",
    items: [
      { i: Coins, t: "வட்டியில்லா வணிகக் கடன்", e: "Interest-Free Business Loan", d: "Pvt Ltd, கூட்டாண்மை, இறக்குமதி/ஏற்றுமதி, Proprietorship மற்றும் Freelancers-க்கு 25 லட்சம் வரை வட்டியில்லா கடன்.", de: "Up to ₹25 lakh interest-free loan for Pvt Ltd, partnerships, import/export, proprietorships and freelancers.", modalType: "loan" },
      { i: Store, t: "சில்லறை வணிகர்கள் கடன்", e: "Retail Trader Loan", d: "பதிவுசெய்யப்பட்ட சில்லறை வணிகர்களுக்கு விரைவான கடன் அனுமதி — குறைந்தபட்ச ஆவணங்களுடன்.", de: "Fast loan approval for registered retail traders with minimal documentation.", modalType: "loan" },
      { i: Rocket, t: "இளைய தொழில்முனைவோர் கடன்", e: "Young Entrepreneur Loan", d: "40 வயதுக்குட்பட்ட இளைய தொழில்முனைவோருக்கு சிறப்பு மானியக் கடன் திட்டம்.", de: "Special subsidised loan scheme for entrepreneurs under 40 years.", modalType: "loan" },
    ],
  },
];

function Services() {
  const { t } = useLanguage();
  const [modal, setModal] = useState<{
    type: "renewal" | "welfare" | "support" | "loan" | null;
    subject?: string;
  }>({ type: null });

  const cardStyles = [
    {
      bg: "bg-slate-950 text-white border-slate-900 shadow-2xl",
      title: "text-white border-b-2 border-slate-800/50",
      pill: "bg-slate-900 border border-slate-800/30 text-slate-300",
      itemBg: "bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/50 hover:bg-slate-900/85",
      itemIconBg: "bg-slate-800 text-gold group-hover:bg-gold group-hover:text-slate-950",
      itemTitle: "text-slate-100",
      itemDesc: "text-slate-400",
      itemBorder: "border-t border-slate-900/80",
      itemLink: "text-gold hover:text-gold/90"
    },
    {
      bg: "bg-blue-900 text-white border-blue-800 shadow-2xl",
      title: "text-white border-b-2 border-blue-800/50",
      pill: "bg-blue-950 border border-blue-850 text-blue-200",
      itemBg: "bg-blue-950/40 border border-blue-800/30 hover:border-blue-750/50 hover:bg-blue-950/60",
      itemIconBg: "bg-blue-950 text-gold group-hover:bg-gold group-hover:text-blue-950",
      itemTitle: "text-blue-100",
      itemDesc: "text-blue-200/60",
      itemBorder: "border-t border-blue-900/80",
      itemLink: "text-gold hover:text-gold/90"
    },
    {
      bg: "bg-white text-slate-900 border-slate-200/80 shadow-2xl",
      title: "text-ink border-b-2 border-primary/20",
      pill: "bg-slate-50 border border-slate-200 text-muted-foreground",
      itemBg: "bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/85",
      itemIconBg: "bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white",
      itemTitle: "text-ink",
      itemDesc: "text-muted-foreground",
      itemBorder: "border-t border-slate-100",
      itemLink: "text-primary hover:text-primary/90"
    }
  ];

  const modalRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current;
    if (!cards.length) return;

    const onScroll = () => {
      const isMobile = window.innerWidth < 768;

      cards.forEach((card, i) => {
        if (!card) return;
        const innerCard = card.firstElementChild as HTMLElement;
        if (!innerCard) return;

        if (isMobile) {
          innerCard.style.transform = "none";
          innerCard.style.filter = "none";
          return;
        }

        const parentRect = card.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        const cardRect = card.getBoundingClientRect();
        const stickyTop = 96 + i * 24;

        // Layout top of card relative to the viewport (ignoring stickiness)
        const cardY = card.offsetTop;
        const cardViewportTop = parentRect.top + cardY;

        // How far past its sticky-top coordinate is the card scroll-pushed?
        const pushed = Math.max(0, stickyTop - cardViewportTop);
        const cardH  = Math.max(cardRect.height, 1);
        const progress = Math.min(1, pushed / cardH);

        // Scroll-driven stacking card scale down and dimming formula
        const isLast = i === cats.length - 1;
        const scrollScale = isLast ? 1 : 1 - progress * 0.04;
        const scrollDim = isLast ? 1 : 1 - progress * 0.15;

        innerCard.style.transform = `scale(${scrollScale})`;
        innerCard.style.transformOrigin = "top center";
        innerCard.style.filter = `brightness(${scrollDim})`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Modal Step State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    epic: "",
    phone: "",
    name: "",
    details: "",
    document: "",
    loanType: "",
    loanAmount: "",
    businessType: ""
  });

  // Loan Chatbot conversational states
  const [chatStep, setChatStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] = useState("");

  const openModal = (type: "renewal" | "welfare" | "support" | "loan", subject: string) => {
    setModal({ type, subject });
    setStep(1);
    setFormInput({ epic: "", phone: "", name: "", details: "", document: "", loanType: "", loanAmount: "", businessType: "" });
    setChatStep(0);
    setBusinessName("");
    setSelectedBusinessType("");
    setLoading(false);
  };

  // Body scroll lock when modal is open
  useEffect(() => {
    if (modal.type) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modal.type]);

  // Escape key close handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (modal.type) {
      window.addEventListener("keydown", handleKeyDown);
      // Auto focus modal for accessibility / focus trap
      modalRef.current?.focus();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.type]);

  // Parse URL search parameters on mount to handle direct links (e.g. ?service=loan&type=freelancer)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const service = params.get("service");
      const type = params.get("type");

      if (service === "loan") {
        setModal({ type: "loan", subject: "Interest-Free Business Loan" });
        setStep(1);
        setFormInput({ epic: "", phone: "", name: "", details: "", document: "", loanType: "", loanAmount: "", businessType: "" });
        setLoading(false);

        const typeMapping: Record<string, string> = {
          "pvt-ltd": "Pvt Ltd நிறுவனம்",
          "partnership": "கூட்டாண்மை வணிகம்",
          "import-export": "இறக்குமதி ஏற்றுமதி வணிகம்",
          "proprietorship": "தனியுரிமை வணிகம்",
          "freelancer": "சுயதொழிலாளர்"
        };

        if (type && typeMapping[type]) {
          setSelectedBusinessType(typeMapping[type]);
          setChatStep(2); // Skip directly to the business name step since ஆம் and category are auto-selected!
        } else {
          setChatStep(0);
        }
      }
    }
  }, []);

  const closeModal = () => {
    setModal({ type: null });
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.epic || !formInput.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to payment scan step
    }, 1000);
  };

  const handleWelfareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to success step
    }, 1200);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to success step
    }, 1000);
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.name || !formInput.phone || !formInput.businessType) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to success/confirmation step
    }, 1400);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-14 md:py-16 w-full">
          <SectionLabel>{t("சேவைகள்", "Services")}</SectionLabel>
          <h1 className="mt-3 sm:mt-4 font-display font-semibold max-w-3xl">
            {t("அனைத்து வணிகர்களுக்காகவும், அனைத்து மாவட்டங்களிலும் உருவாக்கப்பட்டது.", "Built for every vanigar, across every district.")}
          </h1>
          <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl font-tamil text-sm sm:text-[15px] leading-relaxed">
            {t("தமிழ்நாடு முழுவதும் உள்ள அனைத்து வியாபாரிகளின் நலனுக்கான 9 உத்தியோகபூர்வ சேவைகள் — ஒரே இடத்தில்.", "Nine official services for the welfare of all traders across Tamil Nadu — all in one place.")}
          </p>
        </div>
      </section>

      <Section className="py-10 sm:py-14 pb-[180px]">
        <div className="relative">
          {cats.map((cat, idx) => {
            const styles = cardStyles[2];

            return (
              <div
                key={cat.label}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className="md:sticky"
                style={{
                  top: `${96 + idx * 24}px`,
                  zIndex: 10 + idx,
                  paddingBottom: idx < cats.length - 1 ? "2.5rem" : 0,
                }}
              >
                <div 
                  className={`w-full max-w-5xl rounded-3xl border p-6 sm:p-8 md:p-10 ${styles.bg}`}
                >
                  <div className={`flex items-baseline justify-between pb-3 mb-5 sm:mb-6 ${styles.title}`}>
                    <h2 className="font-display text-xl sm:text-2xl font-bold">{t(cat.label, cat.labelEn)}</h2>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${styles.pill}`}>
                      {cat.items.length} {t("சேவைகள்", "services")}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {cat.items.map((s) => {
                      const CardContent = (
                        <>
                          {s.e === "New Membership" && (
                            <span className="absolute -top-3 left-4 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse z-10">
                              {t("இங்கே தொடங்கவும் · START HERE", "START HERE")}
                            </span>
                          )}
                          <div className="text-left w-full">
                            <div className={`w-11 h-11 rounded-lg grid place-items-center transition-colors group-hover:bg-primary group-hover:text-white shrink-0 ${styles.itemIconBg}`}><s.i className="w-5 h-5" /></div>
                            <h3 className={`mt-3 sm:mt-4 font-display text-base sm:text-lg font-semibold leading-tight ${styles.itemTitle}`}>{t(s.t, s.e)}</h3>
                            <p className={`mt-2 text-sm leading-relaxed ${styles.itemDesc}`}>{t(s.d, s.de)}</p>
                          </div>
                          <div className={`mt-4 pt-3 flex items-center justify-between w-full ${styles.itemBorder}`}>
                            <span className={`inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all ${styles.itemLink}`}>
                              {s.to ? t("செல்க", "Apply / Go") : t("விண்ணப்பிக்க", "Request / Apply")} <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </>
                      );

                      return s.to ? (
                        <Link
                          key={s.e}
                          to={s.to}
                          className={`relative card-interactive group p-5 sm:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] text-left cursor-pointer focus:outline-none transition-all duration-300 rounded-2xl ${styles.itemBg}`}
                        >
                          {CardContent}
                        </Link>
                      ) : (
                        <button
                          key={s.e}
                          onClick={() => openModal(s.modalType!, t(s.t, s.e))}
                          className={`relative card-interactive group p-5 sm:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] text-left cursor-pointer focus:outline-none w-full transition-all duration-300 rounded-2xl ${styles.itemBg}`}
                        >
                          {CardContent}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* DYNAMIC PREMIUM MODALS */}
      {modal.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[calc(100dvh-32px)] focus:outline-none animate-fade-in"
            >
              {/* Header */}
              <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-lg">{modal.subject}</h3>
                  <span className="text-xs opacity-75 font-tamil font-light">வணிகர் சங்கம உத்தியோகபூர்வ சேவை</span>
                </div>
                <button onClick={closeModal} className="p-1 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white" aria-label="Close modal">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-[70vh]">
                
                {/* 1. MEMBERSHIP RENEWAL MODAL */}
                {modal.type === "renewal" && (
                  <div>
                    {step === 1 && (
                      <form onSubmit={handleRenewalSubmit} className="space-y-4">
                        <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 space-y-1">
                          <p className="font-semibold">Membership Renewal Fees: ₹500/year</p>
                          <p>Renewing updates your stamped digital trader certificate and grants emergency relief eligibility for the active year.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Enter EPIC / ID No *</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. TNVS9873" 
                            value={formInput.epic}
                            onChange={e => setFormInput({...formInput, epic: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Registered Mobile Number *</label>
                          <input 
                            required 
                            type="tel" 
                            maxLength={10}
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. 9876543210" 
                            value={formInput.phone}
                            onChange={e => setFormInput({...formInput, phone: e.target.value.replace(/\D/g, "")})}
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-lg font-semibold transition text-sm shadow-md flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>Proceed to Payment (பணம் செலுத்துக) <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>
                      </form>
                    )}

                    {step === 2 && (
                      <div className="text-center space-y-5 py-4">
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-inner mb-3">
                            {/* Simulated Payment QR code */}
                            <QrCode className="w-40 h-40 text-slate-800" />
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-xs bg-slate-900 text-white px-2 py-1 rounded">UPI Scan</span>
                            </div>
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">Payable: ₹500</span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          Scan this official TVK UPI QR code using GPay, PhonePe, Paytm, or BHIM to pay your ₹500 renewal fee.
                        </p>
                        <div className="flex flex-col gap-2 pt-3">
                          {import.meta.env.DEV ? (
                            <button 
                              onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                  setLoading(false);
                                  setStep(3); // Success
                                }, 1500);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-md flex items-center justify-center gap-1.5"
                            >
                              {loading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>Simulate Successful Payment <Check className="w-4 h-4" /></>
                              )}
                            </button>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 text-center font-medium">
                              {t("UPI கட்டண ஒருங்கிணைப்பு விரைவில் வரும்", "UPI payment integration coming soon")}
                            </div>
                          )}
                          <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:underline">Go Back</button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="text-center space-y-4 py-6">
                        <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 className="w-10 h-10 text-emerald-800 animate-bounce" />
                        </div>
                        <h4 className="font-display font-semibold text-lg text-emerald-800">Renewal Successful! (புதுப்பிக்கப்பட்டது)</h4>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto">
                          Thank you! Your TNVS membership renewal has been processed. Your digital card is active for the current calendar year.
                        </p>
                        <div className="flex justify-center gap-3 pt-4">
                          <Link to="/voter-id" search={{ epic: undefined }} onClick={closeModal} className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary/95 transition shadow">
                            View Stamped Card
                          </Link>
                          <button onClick={closeModal} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs hover:bg-slate-50 transition">
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. WELFARE SCHEMES CLAIM MODAL */}
                {modal.type === "welfare" && (
                  <div>
                    {step === 1 && (
                      <form onSubmit={handleWelfareSubmit} className="space-y-4">
                        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                          <p>Claims require a minimum of 6 months active association membership to get processed.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">உறுப்பினர் எண் / EPIC ID *</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. TNVS7390" 
                            value={formInput.epic}
                            onChange={e => setFormInput({...formInput, epic: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">வியாபாரி பெயர் / Trader Name *</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. Senthil Kumar N" 
                            value={formInput.name}
                            onChange={e => setFormInput({...formInput, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">உரிம ஆவணம் / Support Proof (Shop License / Aadhar) *</label>
                          <div className="flex items-center justify-center p-3 border border-dashed border-slate-300 bg-slate-50/50 rounded-lg text-center cursor-pointer hover:bg-slate-100 transition">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><FileCheck className="w-4 h-4 text-primary" /> Upload supporting PDF/Image</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">கோரிக்கை விவரம் / Claim Description</label>
                          <textarea 
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="Brief details about the insurance cover or educational needs..." 
                            value={formInput.details}
                            onChange={e => setFormInput({...formInput, details: e.target.value})}
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-lg font-semibold transition text-sm shadow-md flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>Submit Welfare Application <Check className="w-4 h-4" /></>
                          )}
                        </button>
                      </form>
                    )}

                    {step === 2 && (
                      <div className="text-center space-y-4 py-6">
                        <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm animate-pulse">
                          <CheckCircle2 className="w-10 h-10 text-emerald-800" />
                        </div>
                        <h4 className="font-display font-semibold text-lg text-emerald-800">Application Submitted! (விண்ணப்பம் சமர்ப்பிக்கப்பட்டது)</h4>
                        <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1 text-slate-700">
                          <div><strong>Application ID:</strong> TNVS-WEL-{Math.floor(Math.random() * 90000) + 10000}</div>
                          <div><strong>Service:</strong> {modal.subject}</div>
                          <div><strong>Trader Name:</strong> {formInput.name}</div>
                          <div className="pt-2 border-t border-slate-200 mt-2 text-muted-foreground">Our regional Welfare Council will verify your documents and update your status in the Dashboard within 4-5 business days.</div>
                        </div>
                        <button onClick={closeModal} className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-primary/95 transition shadow mt-3">
                          Close Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. BUSINESS SUPPORT & LEGAL ADVISORY MODAL */}
                {modal.type === "support" && (
                  <div>
                    {step === 1 && (
                      <form onSubmit={handleSupportSubmit} className="space-y-4">
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
                          <p>Get free advisory and assistance from expert TVK district committees.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">தொழில் / கடை பெயர் (Shop or Business Name) *</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. Suman Agencies / சுமன் ஏஜென்சிஸ்" 
                            value={formInput.name}
                            onChange={e => setFormInput({...formInput, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">உறுப்பினர் எண் / EPIC ID (If registered)</label>
                          <input 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. TNVS9823" 
                            value={formInput.epic}
                            onChange={e => setFormInput({...formInput, epic: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">கைபேசி எண் / Mobile *</label>
                          <input 
                            required 
                            type="tel" 
                            maxLength={10}
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="e.g. 9876543210" 
                            value={formInput.phone}
                            onChange={e => setFormInput({...formInput, phone: e.target.value.replace(/\D/g, "")})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-tamil">விவரங்கள் / Support Request Details *</label>
                          <textarea 
                            rows={3}
                            required
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none" 
                            placeholder="Describe your issue or what support you need (GST help, MSME filing, dispute resolution etc.)..." 
                            value={formInput.details}
                            onChange={e => setFormInput({...formInput, details: e.target.value})}
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-lg font-semibold transition text-sm shadow-md flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>Submit Support Ticket <Check className="w-4 h-4" /></>
                          )}
                        </button>
                      </form>
                    )}

                    {step === 2 && (
                      <div className="text-center space-y-4 py-6">
                        <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 className="w-10 h-10 text-emerald-800" />
                        </div>
                        <h4 className="font-display font-semibold text-lg text-emerald-800">Request Sent Successfully! (அனுப்பப்பட்டது)</h4>
                        <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-700">
                          <div><strong>Ticket ID:</strong> TNVS-SUP-{Math.floor(Math.random() * 80000) + 20000}</div>
                          <div><strong>Support:</strong> {modal.subject}</div>
                          <div><strong>Business:</strong> {formInput.name}</div>
                          <div className="pt-2 border-t border-slate-200 mt-2 text-muted-foreground font-tamil">உங்கள் விவரங்கள் மாவட்ட ஆலோசகருக்கு அனுப்பப்பட்டுள்ளது. 24 மணி நேரத்திற்குள் எங்களது மாவட்ட குழு உங்களைத் தொடர்பு கொள்ளும்.</div>
                        </div>
                        <button onClick={closeModal} className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-primary/95 transition shadow mt-3">
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. LOAN REQUEST MODAL — கடன் கோரிக்கை Wizard Form */}
                {modal.type === "loan" && (
                  <div className="space-y-6 font-tamil">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex justify-between items-baseline">
                        <div>
                          <h4 className="font-display font-bold text-base text-slate-800">வட்டியில்லா வணிகக் கடன் திட்டம்</h4>
                          <span className="text-xs text-emerald-800 font-semibold tracking-wide uppercase">
                            Interest-Free Business Loan
                          </span>
                        </div>
                        {chatStep > 0 && chatStep < 3 && (
                          <div className="text-xs text-muted-foreground font-semibold font-sans">
                            {chatStep === 1 ? t("படி 1 / 3: வகை தேர்வு", "Step 1 of 3: Select Type") : t("படி 2 / 3: பெயர் உள்ளீடு", "Step 2 of 3: Enter Name")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 0: Welcome and Ad Banner */}
                    {chatStep === 0 && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="bg-linear-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                          <h5 className="font-display font-bold text-sm text-gold">கடன் கோரிக்கை</h5>
                          <p className="text-xs text-emerald-100 leading-relaxed font-tamil">
                            Pvt Ltd நிறுவனங்கள், கூட்டாண்மை வணிகங்கள், இறக்குமதி ஏற்றுமதி வணிகங்கள், தனியுரிமை (Proprietorship) மற்றும் சுயதொழிலாளர்களுக்கு (Freelancers) 25 லட்சம் வரை வட்டியில்லா கடன் வழங்குகிறோம்.
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-3">
                          <p className="text-xs font-bold text-slate-700 font-tamil">
                            கடன் விண்ணப்பிக்க விரும்புகிறீர்களா?
                          </p>
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => setChatStep(1)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-7 rounded-xl text-xs transition active:scale-95 shadow-sm cursor-pointer"
                            >
                              ஆம்
                            </button>
                            <button
                              onClick={closeModal}
                              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-7 rounded-xl text-xs transition active:scale-95 border border-slate-200 cursor-pointer"
                            >
                              இல்லை
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Select Business Type */}
                    {chatStep === 1 && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setChatStep(0)}
                            className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            ← Back
                          </button>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-emerald-950 font-tamil">
                            அருமை! உங்கள் வணிக வகையைத் தேர்ந்தெடுக்கவும்:
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 max-w-sm mx-auto">
                          {[
                            "Pvt Ltd நிறுவனம்",
                            "கூட்டாண்மை வணிகம்",
                            "இறக்குமதி ஏற்றுமதி வணிகம்",
                            "தனியுரிமை வணிகம்",
                            "சுயதொழிலாளர்"
                          ].map((bType) => (
                            <button
                              key={bType}
                              onClick={() => {
                                setSelectedBusinessType(bType);
                                setChatStep(2);
                              }}
                              className="w-full text-left bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold py-3 px-4 rounded-xl text-xs transition border border-slate-200 hover:border-emerald-200 active:scale-[0.99] cursor-pointer shadow-sm"
                            >
                              {bType}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Share Business Name */}
                    {chatStep === 2 && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setChatStep(1)}
                            className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                            {selectedBusinessType}
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-emerald-950 font-tamil">
                            உங்கள் வணிகப் பெயரைப் பகிரவும்:
                          </p>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!businessName.trim()) return;
                            setChatStep(3);
                          }}
                          className="space-y-3 max-w-md mx-auto"
                        >
                          <input
                            required
                            type="text"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 focus:outline-none bg-slate-50"
                            placeholder="e.g. grace market"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs transition active:scale-95 shadow-md cursor-pointer text-center"
                          >
                            சமர்ப்பி
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Step 3: Success Screen */}
                    {chatStep === 3 && (
                      <div className="space-y-5 py-2 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 className="w-9 h-9 text-emerald-800" />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-base text-emerald-900 leading-relaxed px-4">
                            25 லட்சம் வட்டியில்லா கடனுக்கு விண்ணப்பித்ததற்கு நன்றி! எங்கள் குழு விரைவில் தொடர்பு கொள்ளும்.
                          </h4>
                        </div>

                        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl max-w-sm mx-auto text-left text-xs space-y-2 text-slate-700">
                          <div className="flex justify-between pb-1.5 border-b border-slate-200/60 text-xs font-bold text-slate-400 font-mono">
                            <span>APPLICATION RECEIPT</span>
                            <span>STATUS: PENDING</span>
                          </div>
                          <div><strong>Application ID:</strong> TNVS-LOAN-{Math.floor(Math.random() * 90000) + 10000}</div>
                          <div><strong>Business Type:</strong> {selectedBusinessType}</div>
                          <div><strong>Shop Name:</strong> {businessName}</div>
                        </div>

                        <button
                          onClick={closeModal}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-8 rounded-xl text-xs transition active:scale-95 shadow cursor-pointer mt-2"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

    </div>
  );
}
