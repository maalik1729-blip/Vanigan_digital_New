import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import {
  Users, FileCheck, Award, Building2, Scale, Briefcase,
  Coins, Store, Rocket, ArrowRight, X, QrCode, CheckCircle2,
  Sparkles, Check
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Section, SectionLabel } from "@/components/Section";

const servicesSearchSchema = z.object({
  service: z.string().optional(),
  type:    z.string().optional(),
});

export const Route = createFileRoute("/services")({
  validateSearch: servicesSearchSchema,
  head: () => ({
    meta: [
      { title: "சேவைகள் — Our Services · TNVS" },
      { name: "description", content: "Official TVK / TNVS trader association services. Apply for membership, download certificate, request business loans." },
    ],
  }),
  component: ServicesPage,
});

type ServiceItem = {
  i: React.ComponentType<any>;
  t: string;
  e: string;
  d: string;
  de: string;
  to?: string;
  modalType?: "renewal" | "support" | "loan";
};

type Category = {
  label: string;
  labelEn: string;
  items: ServiceItem[];
};

const cats: Category[] = [
  {
    label: "உறுப்பினர் சேர்க்கை",
    labelEn: "Membership Services",
    items: [
      { i: Users, t: "புதிய உறுப்பினர் சேர்க்கை", e: "New Membership", d: "ஆன்லைனில் 5 நிமிடங்களில் விண்ணப்பிக்கவும் - உடனடி EPIC ஐடி.", de: "Online application with instant EPIC ID.", to: "/membership" },
      { i: FileCheck, t: "சான்றிதழ் பதிவிறக்கம்", e: "Certificate Download", d: "முத்திரையிடப்பட்ட டிஜிட்டல் சான்றிதழ் மற்றும் PDF அடையாள அட்டை.", de: "Stamped digital certificate and PDF ID card.", to: "/voter-id" },
      { i: Award, t: "உறுப்பினர் புதுப்பித்தல்", e: "Membership Renewal", d: "ஒரே கிளிக்கில் UPI கட்டணம் மூலம் ஆண்டுதோறும் புதுப்பிக்கவும்.", de: "Renew yearly with one-click UPI payment.", modalType: "renewal" },
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

function ServicesPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearch({ from: "/services" });
  const navigate = useNavigate({ from: "/services" });

  // Modals Overlay Controller states
  const [modal, setModal] = useState<{ type: "renewal" | "support" | "loan" | null; subject?: string }>({ type: null });
  const [step, setStep] = useState(1);
  const [chatStep, setChatStep] = useState(0);
  const [formInput, setFormInput] = useState({ epic: "", phone: "", name: "", details: "", document: "", loanType: "", loanAmount: "", businessType: "" });
  const [businessName, setBusinessName] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Accessible Modal Trap Focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (modal.type) {
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.type]);

  // Parse URL search parameters to trigger modals automatically
  useEffect(() => {
    const service = searchParams.service;
    const type = searchParams.type;

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
        setChatStep(2);
      } else {
        setChatStep(0);
      }
    }
  }, [searchParams.service, searchParams.type]);

  const openModal = (type: "renewal" | "support" | "loan", subject: string) => {
    setModal({ type, subject });
    setStep(1);
    setFormInput({ epic: "", phone: "", name: "", details: "", document: "", loanType: "", loanAmount: "", businessType: "" });
    setChatStep(0);
    setBusinessName("");
    setSelectedBusinessType("");
    setLoading(false);
  };

  const closeModal = () => {
    setModal({ type: null });
    // Reset query parameters cleanly
    navigate({ search: (prev) => ({ ...prev, service: undefined, type: undefined }) });
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.epic || !formInput.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.name || !formInput.phone || !formInput.businessType) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1400);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-24 pb-16 bg-background">
      
      {/* Banner */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 w-full text-left">
          <SectionLabel>{t("சேவைகள்", "Services")}</SectionLabel>
          <h1 className="mt-4 font-display font-extrabold text-ink text-3xl md:text-4xl leading-tight">
            {t("அனைத்து வணிகர்களுக்காகவும், அனைத்து மாவட்டங்களிலும்.", "Built for every vanigar, across every district.")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl font-tamil text-sm sm:text-base leading-relaxed">
            {t("தமிழ்நாடு முழுவதும் உள்ள அனைத்து வியாபாரிகளின் மேம்பாட்டிற்கான சங்க உத்தியோகபூர்வ சேவைகள் — ஒரே இடத்தில்.", "Official Sangam services built to advocate and support small-to-large merchants across Tamil Nadu.")}
          </p>
        </div>
      </section>

      {/* Services Grid layout */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 space-y-14">
          {cats.map((cat) => (
            <div key={cat.label} className="space-y-6 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <h2 className="font-display text-lg md:text-xl font-bold text-foreground">{t(cat.label, cat.labelEn)}</h2>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground font-mono select-none">
                  {cat.items.length} {t("சேவைகள்", "Services")}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((s) => {
                  const CardContent = (
                    <>
                      {s.e === "New Membership" && (
                        <span className="absolute top-4 right-4 bg-linear-to-r from-emerald-600 to-teal-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm z-10 font-mono animate-pulse">
                          {t("தொடங்கவும் · START HERE", "START HERE")}
                        </span>
                      )}
                      <div className="text-left w-full">
                        <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary shrink-0">
                          <s.i className="w-5 h-5" />
                        </div>
                        <h3 className="mt-4 font-display text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">{t(s.t, s.e)}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">{t(s.d, s.de)}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between w-full">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground group-hover:text-primary transition-all duration-200">
                          {s.to ? t("செல்க", "Apply / Go") : t("விண்ணப்பிக்க", "Request / Apply")} 
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </>
                  );

                  return s.to ? (
                    <Link
                      key={s.e}
                      to={s.to}
                      className="relative group p-6 flex flex-col justify-between min-h-[200px] text-left cursor-pointer focus:outline-none transition-all duration-200 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-xs"
                    >
                      {CardContent}
                    </Link>
                  ) : (
                    <button
                      key={s.e}
                      onClick={() => s.modalType && openModal(s.modalType, s.e)}
                      className="relative group p-6 flex flex-col justify-between min-h-[200px] text-left cursor-pointer focus:outline-none transition-all duration-200 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-xs"
                    >
                      {CardContent}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* DYNAMIC PREMIUM SERVICES MODALS */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="bg-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-border flex flex-col max-h-[calc(100dvh-32px)] focus:outline-none animate-fade-in"
          >
            {/* Header */}
            <div className="bg-muted text-foreground px-6 py-4 flex items-center justify-between border-b border-border">
              <div>
                <h3 className="font-display font-semibold text-lg text-ink">{modal.subject}</h3>
                <span className="text-xs opacity-75 font-tamil font-light text-muted-foreground">வணிகர் சங்கம உத்தியோகபூர்வ சேவை</span>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Close modal">
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
                      <div className="p-4 bg-muted border border-border rounded-xl text-xs text-foreground space-y-1">
                        <p className="font-semibold text-primary">Membership Renewal Fees: ₹500/year</p>
                        <p className="text-muted-foreground">Renewing updates your stamped digital trader certificate and grants emergency relief eligibility for the active year.</p>
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-muted-foreground">Enter EPIC / ID No *</label>
                        <input 
                          required 
                          type="text" 
                          className="input-base" 
                          placeholder="e.g. TNVS9873" 
                          value={formInput.epic}
                          onChange={e => setFormInput({...formInput, epic: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-muted-foreground">Registered Mobile Number *</label>
                        <input 
                          required 
                          type="tel" 
                          maxLength={10}
                          className="input-base" 
                          placeholder="e.g. 9876543210" 
                          value={formInput.phone}
                          onChange={e => setFormInput({...formInput, phone: e.target.value.replace(/\D/g, "")})}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Proceed to Payment (பணம் செலுத்துக) <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <div className="text-center space-y-5 py-4">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative p-4 bg-muted border border-border rounded-xl shadow-inner mb-3">
                          {/* Simulated Payment QR code */}
                          <QrCode className="w-40 h-40 text-foreground" />
                          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs bg-card text-foreground px-2 py-1 rounded">UPI Scan</span>
                          </div>
                        </div>
                        <span className="text-xs bg-muted border border-border text-foreground px-3 py-1 rounded-full font-semibold">Payable: ₹500</span>
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
                            className="bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-semibold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-none min-h-[44px]"
                          >
                            {loading ? (
                              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>Simulate Successful Payment <Check className="w-4 h-4" /></>
                            )}
                          </button>
                        ) : (
                          <div className="bg-muted border border-border rounded-lg p-3 text-xs text-primary text-center font-medium">
                            {t("UPI கட்டண ஒருங்கிணைப்பு விரைவில் வரும்", "UPI payment integration coming soon")}
                          </div>
                        )}
                        <button onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:underline cursor-pointer bg-transparent border-none">Go Back</button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="text-center space-y-4 py-6">
                      <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-primary animate-bounce" />
                      </div>
                      <h4 className="font-display font-semibold text-lg text-primary">Renewal Successful! (புதுப்பிக்கப்பட்டது)</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Thank you! Your TNVS membership renewal has been processed. Your digital card is active for the current calendar year.
                      </p>
                      <div className="flex justify-center gap-3 pt-4">
                        <Link to="/voter-id" search={{ epic: undefined }} onClick={closeModal} className="btn-primary text-xs flex items-center justify-center">
                          View Stamped Card
                        </Link>
                        <button onClick={closeModal} className="btn-secondary text-xs">
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. BUSINESS SUPPORT & LEGAL ADVISORY MODAL */}
              {modal.type === "support" && (
                <div>
                  {step === 1 && (
                    <form onSubmit={handleSupportSubmit} className="space-y-4 text-left">
                      <div className="p-3 bg-muted border border-border rounded-xl text-xs text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-primary animate-pulse" />
                        <p className="text-muted-foreground">Get free advisory and assistance from expert TVK district committees.</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground font-tamil">தொழில் / கடை பெயர் (Shop or Business Name) *</label>
                        <input 
                          required 
                          type="text" 
                          className="input-base" 
                          placeholder="e.g. Suman Agencies / சுமன் ஏஜென்சிஸ்" 
                          value={formInput.name}
                          onChange={e => setFormInput({...formInput, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground font-tamil">உறுப்பினர் எண் / EPIC ID (If registered)</label>
                        <input 
                          type="text" 
                          className="input-base" 
                          placeholder="e.g. TNVS9823" 
                          value={formInput.epic}
                          onChange={e => setFormInput({...formInput, epic: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground font-tamil">கைபேசி எண் / Mobile *</label>
                        <input 
                          required 
                          type="tel" 
                          maxLength={10}
                          className="input-base" 
                          placeholder="e.g. 9876543210" 
                          value={formInput.phone}
                          onChange={e => setFormInput({...formInput, phone: e.target.value.replace(/\D/g, "")})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground font-tamil">விவரங்கள் / Support Request Details *</label>
                        <textarea 
                          rows={3}
                          required
                          className="input-base min-h-[80px] py-2" 
                          placeholder="Describe your issue or what support you need (GST help, MSME filing, dispute resolution etc.)..." 
                          value={formInput.details}
                          onChange={e => setFormInput({...formInput, details: e.target.value})}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Submit Support Ticket <Check className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <div className="text-center space-y-4 py-6">
                      <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>
                      <h4 className="font-display font-semibold text-lg text-primary">Request Sent Successfully! (அனுப்பப்பட்டது)</h4>
                      <div className="bg-muted p-5 border border-border rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 text-foreground">
                        <div><strong>Ticket ID:</strong> TNVS-SUP-{Math.floor(Math.random() * 80000) + 20000}</div>
                        <div><strong>Support:</strong> {modal.subject}</div>
                        <div><strong>Business:</strong> {formInput.name}</div>
                        <div className="pt-2 border-t border-border mt-2 text-muted-foreground font-tamil">உங்கள் விவரங்கள் மாவட்ட ஆலோசகருக்கு அனுப்பப்பட்டுள்ளது. 24 மணி நேரத்திற்குள் எங்களது மாவட்ட குழு உங்களைத் தொடர்பு கொள்ளும்.</div>
                      </div>
                      <button onClick={closeModal} className="btn-primary px-6 mt-3 cursor-pointer">
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. LOAN REQUEST MODAL — கடன் கோரிக்கை Wizard Form */}
              {modal.type === "loan" && (
                <div className="space-y-6 font-tamil">
                  {/* Title Banner */}
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex justify-between items-baseline">
                      <div className="text-left">
                        <h4 className="font-display font-bold text-base text-foreground">வட்டியில்லா வணிகக் கடன் திட்டம்</h4>
                        <span className="text-xs text-primary font-semibold tracking-wide uppercase">
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
                    <div className="space-y-5 animate-fade-in text-left">
                      <div className="bg-linear-to-br from-emerald-950 to-teal-900 border border-primary/20 text-foreground rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <h5 className="font-display font-bold text-sm text-primary">கடன் கோரிக்கை</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed font-tamil">
                          Pvt Ltd நிறுவனங்கள், கூட்டாண்மை வணிகங்கள், இறக்குமதி ஏற்றுமதி வணிகங்கள், தனியுரிமை (Proprietorship) மற்றும் சுயதொழிலாளர்களுக்கு (Freelancers) 25 லட்சம் வரை வட்டியில்லா கடன் வழங்குகிறோம்.
                        </p>
                      </div>

                      <div className="bg-muted border border-border rounded-xl p-4 text-center space-y-3">
                        <p className="text-xs font-bold text-foreground font-tamil">
                          கடன் விண்ணப்பிக்க விரும்புகிறீர்களா?
                        </p>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => setChatStep(1)}
                            className="btn-primary text-xs px-6 cursor-pointer"
                          >
                            ஆம்
                          </button>
                          <button
                            onClick={closeModal}
                            className="btn-secondary text-xs px-6 cursor-pointer"
                          >
                            இல்லை
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Select Business Type */}
                  {chatStep === 1 && (
                    <div className="space-y-4 animate-fade-in text-left">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setChatStep(0)}
                          className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer bg-transparent border-none"
                        >
                          ← Back
                        </button>
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-primary font-tamil">
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
                              setFormInput({...formInput, businessType: bType});
                              setChatStep(2);
                            }}
                            className="w-full text-left bg-muted hover:bg-card border border-border hover:border-primary/30 rounded-xl px-4 py-3 text-xs text-foreground hover:text-primary font-bold transition cursor-pointer min-h-[44px]"
                          >
                            {bType}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Form Fields input */}
                  {chatStep === 2 && (
                    <form onSubmit={handleLoanSubmit} className="space-y-4 text-left animate-fade-in">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChatStep(1)}
                          className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer bg-transparent border-none"
                        >
                          ← Back
                        </button>
                      </div>

                      <div className="p-3.5 bg-muted border border-border rounded-xl text-xs text-foreground">
                        தேர்ந்தெடுக்கப்பட்டது: <strong className="text-primary">{selectedBusinessType}</strong>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">விண்ணப்பதாரர் பெயர் (Proprietor Name) *</label>
                        <input 
                          required 
                          type="text" 
                          className="input-base" 
                          placeholder="உதாரணம்: செந்தில் குமார்" 
                          value={formInput.name}
                          onChange={e => setFormInput({...formInput, name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">கைபேசி எண் (Mobile) *</label>
                        <input 
                          required 
                          type="tel" 
                          maxLength={10}
                          className="input-base" 
                          placeholder="உதாரணம்: 9876543210" 
                          value={formInput.phone}
                          onChange={e => setFormInput({...formInput, phone: e.target.value.replace(/\D/g, "")})}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">கோரப்படும் கடன் தொகை (Required Loan Amount) *</label>
                        <input 
                          required 
                          type="text" 
                          className="input-base font-mono" 
                          placeholder="உதாரணம்: ₹5,00,000" 
                          value={formInput.loanAmount}
                          onChange={e => setFormInput({...formInput, loanAmount: e.target.value})}
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>விண்ணப்பிக்க (Submit Request) <Check className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Step 3: Success Screen */}
                  {step === 2 && (
                    <div className="text-center space-y-4 py-6 animate-fade-in">
                      <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>
                      <h4 className="font-display font-semibold text-lg text-primary">விண்ணப்பம் சமர்ப்பிக்கப்பட்டது!</h4>
                      <div className="bg-muted p-4 border border-border rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 text-foreground">
                        <div><strong>Loan ID:</strong> TNVS-LN-{Math.floor(Math.random() * 90000) + 10000}</div>
                        <div><strong>Scheme:</strong> {selectedBusinessType} வட்டியில்லா கடன்</div>
                        <div><strong>Applicant:</strong> {formInput.name}</div>
                        <div><strong>Amount:</strong> {formInput.loanAmount}</div>
                        <div className="pt-2 border-t border-border mt-2 text-muted-foreground">உங்கள் கடன் விண்ணப்பம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது. எங்கள் சங்கக் கடன் பரிசீலனைக் குழு உங்களை விரைவில் தொடர்பு கொள்ளும்.</div>
                      </div>
                      <button onClick={closeModal} className="btn-primary px-6 mt-3 cursor-pointer">
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
