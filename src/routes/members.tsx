import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import {
  Search, User, Phone, Mail,
  Loader2, AlertCircle, CreditCard, ChevronLeft, ChevronRight,
  FileCheck, Award, ShieldCheck, Building2, Scale, Users, Briefcase, 
  GraduationCap, HeartPulse, ArrowRight, X, QrCode, CheckCircle2,
  Sparkles, ShieldAlert, Check, HelpCircle, Coins, Store, Factory, Globe, Rocket,
  MapPin, Heart, Shield, Star, Tag
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Section, SectionLabel } from "@/components/Section";

const searchSchema = z.object({
  search:      z.string().optional(),
  district:    z.string().optional(),
  assembly:    z.string().optional(),
  page:        z.coerce.number().optional(),
  service:     z.string().optional(),
  type:        z.string().optional(),
  tab:         z.enum(["members", "organizers", "businesses"]).optional(),
  category:    z.string().optional(),
  subCategory: z.string().optional(),
});

export const Route = createFileRoute("/members")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "உறுப்பினர் பட்டியல் — Members Directory · TNVS" },
      { name: "description", content: "View official registered members of Tamil Nadu Vanigargalin Sangamam." },
    ],
  }),
  component: MembersPage,
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
    labelEn: "Membership",
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

interface Member {
  id: number;
  name: string;
  epic: string;
  mobile: string;
  email?: string;
  dob?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  assembly?: string;
  district?: string;
  shop?: string;
  type?: string;
  address?: string;
  years?: string;
  wing?: string;
  selfie?: string;
  idProof?: string;
  bizProof?: string;
  created_at: string;
}

interface Organizer {
  id: number;
  organizer_code: string;
  name: string;
  mobile: string;
  email?: string;
  role?: string;
  district?: string;
  assembly?: string;
  status: string;
  created_at: string;
}

interface Business {
  _id: string;
  name: string;
  category?: string;
  subCategory?: string;
  description?: string;
  district?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  avgRating?: number;
  reviewCount?: number;
  coverImage?: string;
  image?: string;
  img?: string;
  imageUrl?: string;
  active?: boolean;
  listingCode?: string;
}

function MembersPage() {
  const { t, language } = useLanguage();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const search = searchParams.search || "";
  const district = searchParams.district || "";
  const assembly = searchParams.assembly || "";
  const page = searchParams.page || 1;
  const limit = 12;

  // Card styles for Services
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

  const [modal, setModal] = useState<{
    type: "renewal" | "support" | "loan" | null;
    subject?: string;
  }>({ type: null });

  const modalRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const openModal = (type: "renewal" | "support" | "loan", subject: string) => {
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
      modalRef.current?.focus();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.type]);

  // Parse URL search parameters on mount or Route search change
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

  const closeModal = () => {
    setModal({ type: null });
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

  const [members, setMembers] = useState<Member[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalBusinesses, setTotalBusinesses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tab = searchParams.tab || "members";

  // Search input state
  const [searchVal, setSearchVal] = useState(search);
  const [districtVal, setDistrictVal] = useState(district);
  const [assemblyVal, setAssemblyVal] = useState(assembly);

  useEffect(() => {
    setSearchVal(search);
  }, [search]);

  useEffect(() => {
    setDistrictVal(district);
  }, [district]);

  useEffect(() => {
    setAssemblyVal(assembly);
  }, [assembly]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (district) query.append("district", district);
        if (assembly) query.append("assembly", assembly);

        if (tab === "members") {
          query.append("page", String(page));
          query.append("limit", String(limit));
          const res = await fetch(`/api/public/members?${query.toString()}`, { signal: controller.signal });
          if (!res.ok) throw new Error(await res.text() || "Failed to fetch members");
          const data = await res.json();
          if (active) {
            setMembers(data.members || []);
            setTotalMembers(data.total || 0);
          }
        } else if (tab === "organizers") {
          const res = await fetch(`/api/public/organizer?${query.toString()}`, { signal: controller.signal });
          if (!res.ok) throw new Error(await res.text() || "Failed to fetch organizers");
          const data = await res.json();
          if (active) {
            setOrganizers(data.organizers || []);
          }
        } else if (tab === "businesses") {
          query.append("page", String(page));
          query.append("limit", String(limit));
          if (searchParams.category) query.append("category", searchParams.category);
          if (searchParams.subCategory) query.append("subCategory", searchParams.subCategory);
          const res = await fetch(`/api/public/business?${query.toString()}`, { signal: controller.signal });
          if (!res.ok) throw new Error(await res.text() || "Failed to fetch businesses");
          const data = await res.json();
          if (active) {
            setBusinesses(data.businesses || []);
            setTotalBusinesses(data.total || 0);
          }
        }
      } catch (err: any) {
        if (active && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [search, district, assembly, page, tab, searchParams.category, searchParams.subCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchVal || undefined,
        district: districtVal || undefined,
        assembly: assemblyVal || undefined,
        page: 1,
      }),
    });
  };

  const clearFilters = () => {
    setSearchVal("");
    setDistrictVal("");
    setAssemblyVal("");
    navigate({
      search: () => ({}),
    });
  };

  const handleTabChange = (newTab: "members" | "organizers" | "businesses") => {
    navigate({
      search: (prev) => ({
        ...prev,
        tab: newTab,
        page: 1,
      }),
    });
  };

  let totalPages = 0;
  if (tab === "members") {
    totalPages = Math.ceil(totalMembers / limit);
  } else if (tab === "businesses") {
    totalPages = Math.ceil(totalBusinesses / limit);
  } else if (tab === "organizers") {
    totalPages = Math.ceil(organizers.length / limit);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-24 pb-16 bg-slate-50/50">
      
      {/* SERVICES CONTENT AT THE TOP */}
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-14 w-full text-left">
          <SectionLabel>{t("சேவைகள்", "Services")}</SectionLabel>
          <h1 className="mt-3 sm:mt-4 font-display font-semibold max-w-3xl">
            {t("அனைத்து வணிகர்களுக்காகவும், அனைத்து மாவட்டங்களிலும் உருவாக்கப்பட்டது.", "Built for every vanigar, across every district.")}
          </h1>
          <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl font-tamil text-sm sm:text-[15px] leading-relaxed">
            {t("தமிழ்நாடு முழுவதும் உள்ள அனைத்து வியாபாரிகளின் மேம்பாட்டிற்கான 9 உத்தியோகபூர்வ சேவைகள் — ஒரே இடத்தில்.", "Nine official services for all traders across Tamil Nadu — all in one place.")}
          </p>
        </div>
      </section>

      <Section className="py-10 sm:py-14 pb-[80px]">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
          {cats.map((cat, idx) => {
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
                  className="w-full max-w-5xl rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <h2 className="font-display text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">{t(cat.label, cat.labelEn)}</h2>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-500 font-mono select-none">
                      {cat.items.length} {t("சேவைகள்", "services")}
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {cat.items.map((s) => {
                      const CardContent = (
                        <>
                          {s.e === "New Membership" && (
                            <span className="absolute top-4 right-4 bg-linear-to-r from-emerald-600 to-teal-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm z-10 font-mono animate-pulse">
                              {t("தொடங்கவும் · START HERE", "START HERE")}
                            </span>
                          )}
                          <div className="text-left w-full">
                            <div className="w-12 h-12 rounded-xl bg-slate-100/70 text-slate-600 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary shrink-0">
                              <s.i className="w-5 h-5" />
                            </div>
                            <h3 className="mt-4 font-display text-base font-bold text-slate-850 leading-tight group-hover:text-primary transition-colors duration-200">{t(s.t, s.e)}</h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-400 group-hover:text-slate-500 transition-colors duration-200">{t(s.d, s.de)}</p>
                          </div>
                          <div className="mt-6 pt-4 border-t border-slate-100/50 flex items-center justify-between w-full">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-primary transition-all duration-200">
                              {s.to ? t("செல்க", "Apply / Go") : t("விண்ணப்பிக்க", "Request / Apply")} 
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </>
                      );

                      return s.to ? (
                        <Link
                          key={s.e}
                          to={s.to}
                          className="relative group p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] text-left cursor-pointer focus:outline-none transition-all duration-300 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-slate-50/80"
                        >
                          {CardContent}
                        </Link>
                      ) : (
                        <button
                          key={s.e}
                          onClick={() => s.modalType && openModal(s.modalType, s.e)}
                          className="relative group p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] text-left cursor-pointer focus:outline-none transition-all duration-300 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-slate-50/80"
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

      {/* MEMBER DIRECTORY TITLE */}
      <section className="border-t border-slate-100 bg-slate-50/30 pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full text-left">
          <SectionLabel>
            {tab === "organizers" 
              ? t("நிர்வாகிகள் பட்டியல்", "Organizers Directory") 
              : tab === "businesses" 
                ? t("வணிகர்கள் பட்டியல்", "Business Directory") 
                : t("உறுப்பினர் பட்டியல்", "Members Directory")}
          </SectionLabel>
          <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            {tab === "organizers"
              ? t("சங்க நிர்வாகிகள்", "Sangam Executive Organizers")
              : tab === "businesses"
                ? t("பதிவுசெய்யப்பட்ட வணிகங்கள்", "Registered Local Businesses")
                : t("பதிவுசெய்யப்பட்ட உறுப்பினர்கள்", "Registered Sangam Members")}
          </h2>
          <p className="mt-2 text-sm text-slate-505 font-tamil max-w-xl leading-relaxed">
            {tab === "organizers"
              ? t("தமிழ்நாடு வணிகர்கள் சங்கத்தின் பொறுப்புள்ள மாநில, மாவட்ட மற்றும் வட்டார நிர்வாகிகள் பட்டியல்.", "Directory of State, District, and Assembly level executive organizers and office bearers.")
              : tab === "businesses"
                ? t("அதிகாரப்பூர்வமாக பதிவுசெய்யப்பட்ட வணிகங்கள், கடைகள் மற்றும் சேவை வழங்குநர்கள் பட்டியல்.", "Explore verified local shops, services, and wholesale businesses across Tamil Nadu.")
                : t("தமிழ்நாடு வணிகர்களுக்கான அதிகாரப்பூர்வ உறுப்பினர் கோப்பகம். உங்கள் விபரங்களை சரிபார்க்கவும்.", "Official directory of Tamil Nadu Sangam merchants. Search and verify registered memberships.")}
          </p>
        </div>
      </section>

      {/* MEMBER SEARCH & LIST SECTION */}
      <Section className="pb-20">
        <div className="w-full">
          {/* TAB BAR PILL SELECTOR */}
          <div className="bg-slate-100/70 backdrop-blur-xs p-1.5 rounded-2xl inline-flex gap-1.5 border border-slate-200/50 mb-8 max-w-full overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleTabChange("members")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                tab === "members"
                  ? "bg-white text-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-850 hover:bg-white/40"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t("உறுப்பினர்கள்", "General Members")}</span>
            </button>
            <button
              onClick={() => handleTabChange("organizers")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                tab === "organizers"
                  ? "bg-white text-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-850 hover:bg-white/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t("நிர்வாகிகள்", "Official Organizers")}</span>
            </button>
            <button
              onClick={() => handleTabChange("businesses")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                tab === "businesses"
                  ? "bg-white text-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-850 hover:bg-white/40"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t("வணிகர்கள்", "Business Directory")}</span>
            </button>
          </div>

          {/* Search & Filter Form */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 w-full space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  {tab === "organizers" 
                    ? t("நிர்வாகி தேடல்", "Search Organizers") 
                    : tab === "businesses" 
                      ? t("வணிக தேடல்", "Search Businesses") 
                      : t("தேடல்", "Search Keyword")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={
                      tab === "organizers" 
                        ? t("நிர்வாகி பெயர், பதவி மூலம் தேடுக...", "Search by name, role, ID...")
                        : tab === "businesses"
                          ? t("வணிகப் பெயர், வகை, முகவரி மூலம் தேடுக...", "Search by business name, category, address...")
                          : t("பெயர், EPIC ID, போன் மூலம் தேடுக...", "Search by name, ID, phone...")
                    }
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div className="md:col-span-3 w-full space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  {t("மாவட்டம்", "District")}
                </label>
                <input
                  type="text"
                  placeholder={t("எ.கா. Chennai", "e.g. Chennai")}
                  value={districtVal}
                  onChange={(e) => setDistrictVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all min-h-[44px]"
                />
              </div>

              <div className="md:col-span-2 w-full space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  {t("தொகுதி", "Assembly")}
                </label>
                <input
                  type="text"
                  placeholder={t("எ.கா. Mylapore", "e.g. Mylapore")}
                  value={assemblyVal}
                  onChange={(e) => setAssemblyVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all min-h-[44px]"
                />
              </div>

              <div className="md:col-span-2 flex gap-2 w-full shrink-0">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-2xl text-xs transition active:scale-95 shadow-sm cursor-pointer min-h-[44px]"
                >
                  {t("தேடுக", "Filter")}
                </button>
                {(search || district || assembly) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-2xl text-xs transition cursor-pointer border border-slate-200 min-h-[44px]"
                  >
                    {t("ரத்து", "Reset")}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Status Messages */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm font-semibold">
                {tab === "organizers" 
                  ? t("நிர்வாகிகள் விபரம் ஏற்றப்படுகிறது...", "Loading organizers profiles...")
                  : tab === "businesses" 
                    ? t("வணிகங்கள் விபரம் ஏற்றப்படுகிறது...", "Loading businesses profiles...")
                    : t("உறுப்பினர்கள் விபரம் ஏற்றப்படுகிறது...", "Loading member profiles...")}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-rose-500 bg-rose-50 rounded-3xl border border-rose-200 p-6">
              <AlertCircle className="w-8 h-8 mb-3" />
              <p className="text-sm font-bold">{t("பிழை ஏற்பட்டது", "An error occurred")}</p>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
          ) : (
            (tab === "members" && members.length === 0) ||
            (tab === "organizers" && organizers.length === 0) ||
            (tab === "businesses" && businesses.length === 0)
          ) ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-150 p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              {tab === "organizers" ? (
                <Shield className="w-12 h-12 text-slate-300 mb-3" />
              ) : tab === "businesses" ? (
                <Building2 className="w-12 h-12 text-slate-300 mb-3" />
              ) : (
                <User className="w-12 h-12 text-slate-300 mb-3" />
              )}
              <h3 className="text-base font-bold text-slate-800">
                {tab === "organizers" 
                  ? t("நிர்வாகிகள் யாரும் இல்லை", "No Organizers Found") 
                  : tab === "businesses" 
                    ? t("வணிகங்கள் எதுவும் இல்லை", "No Businesses Found") 
                    : t("உறுப்பினர்கள் யாரும் இல்லை", "No Members Found")}
              </h3>
              <p className="text-xs text-slate-405 mt-1 leading-relaxed max-w-xs mx-auto">
                {t("வழங்கப்பட்ட தேடல் நிபந்தனைகளுக்குப் பொருந்தும் முடிவுகள் எதுவும் இல்லை.", "Try adjusting your search criteria or filters.")}
              </p>
            </div>
          ) : (
            <>
              {/* Members tab rendering */}
              {tab === "members" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {/* Premium avatar with clean design */}
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-50 shrink-0 relative flex items-center justify-center shadow-xs">
                            {member.selfie ? (
                              <img
                                src={member.selfie}
                                alt={member.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-bold text-sm">
                                {member.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 text-left">
                            <h3 className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-primary transition-colors">{member.name}</h3>
                            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/80 font-mono text-[9px] font-bold text-slate-450 tracking-wider">
                              ID: {member.epic}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-50 pt-4 text-xs">
                          {member.shop && (
                            <div className="flex items-center justify-between min-h-[24px]">
                              <span className="text-slate-405 flex items-center gap-1.5">
                                <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {t("கடை", "Shop")}
                              </span>
                              <span className="font-bold text-slate-700 truncate max-w-[170px] text-right">{member.shop}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between min-h-[24px]">
                            <span className="text-slate-405 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {t("கைபேசி", "Mobile")}
                            </span>
                            <span className="font-mono text-slate-700 text-right">{member.mobile}</span>
                          </div>

                          {(member.assembly || member.district) && (
                            <div className="flex items-center justify-between min-h-[24px]">
                              <span className="text-slate-405 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {t("வட்டாரம்", "Location")}
                              </span>
                              <span className="font-bold text-slate-700 text-right truncate max-w-[170px]">
                                {[member.assembly, member.district].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          )}

                          {member.bloodGroup && (
                            <div className="flex items-center justify-between min-h-[24px]">
                              <span className="text-slate-405 flex items-center gap-1.5">
                                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 animate-pulse" />
                                {t("இரத்த வகை", "Blood Group")}
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-50/60 border border-rose-100/50 text-[10px] font-bold text-rose-600 font-mono">
                                {member.bloodGroup}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-50 pt-4 flex gap-2">
                        <Link
                          to="/voter-id"
                          search={{ epic: member.epic }}
                          className="flex-1 bg-slate-50/80 hover:bg-primary hover:text-white border border-slate-200/60 hover:border-primary text-slate-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-xs active:scale-[0.98]"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{t("அட்டை காண்க", "View ID Card")}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Organizers tab rendering */}
              {tab === "organizers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {organizers.slice((page - 1) * limit, page * limit).map((org) => (
                    <div
                      key={org.id}
                      className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {/* Circular shield badge for organizers */}
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-50 shrink-0 relative flex items-center justify-center shadow-xs">
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                              <Shield className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="min-w-0 text-left">
                            <h3 className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-primary transition-colors">{org.name}</h3>
                            <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md bg-primary/8 text-[9px] font-extrabold text-primary uppercase tracking-wider">
                              {org.role || t("நிர்வாகி", "Organizer")}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-50 pt-4 text-xs">
                          <div className="flex items-center justify-between min-h-[24px]">
                            <span className="text-slate-405 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {t("நிர்வாகி ஐடி", "Organizer ID")}
                            </span>
                            <span className="font-mono text-slate-700 text-right">{org.organizer_code}</span>
                          </div>

                          <div className="flex items-center justify-between min-h-[24px]">
                            <span className="text-slate-405 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {t("கைபேசி", "Mobile")}
                            </span>
                            <span className="font-mono text-slate-700 text-right">{org.mobile}</span>
                          </div>

                          {org.email && (
                            <div className="flex items-center justify-between min-h-[24px]">
                              <span className="text-slate-405 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {t("மின்னஞ்சல்", "Email")}
                              </span>
                              <span className="text-slate-700 truncate max-w-[170px] text-right">{org.email}</span>
                            </div>
                          )}

                          {(org.assembly || org.district) && (
                            <div className="flex items-center justify-between min-h-[24px]">
                              <span className="text-slate-405 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {t("வட்டாரம்", "Location")}
                              </span>
                              <span className="font-bold text-slate-700 text-right truncate max-w-[170px]">
                                {[org.assembly, org.district].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-50 pt-4 flex gap-2">
                        <a
                          href={`tel:${org.mobile}`}
                          className="flex-1 bg-slate-50/80 hover:bg-primary hover:text-white border border-slate-200/60 hover:border-primary text-slate-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-xs active:scale-[0.98]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t("அழைக்க", "Call Organizer")}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Businesses tab rendering */}
              {tab === "businesses" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {businesses.map((biz) => {
                    const defaultImg = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=75&fit=crop&auto=format";
                    const bizImg = biz.imageUrl || biz.image || biz.img || biz.coverImage || defaultImg;
                    return (
                      <div
                        key={biz._id}
                        className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative group"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            {/* Business logo / thumbnail */}
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-50 shrink-0 relative flex items-center justify-center shadow-xs">
                              <img
                                src={bizImg}
                                alt={biz.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = defaultImg;
                                }}
                              />
                            </div>
                            <div className="min-w-0 text-left">
                              <h3 className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-primary transition-colors">{biz.name}</h3>
                              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/80 font-mono text-[9px] font-bold text-slate-450 tracking-wider font-mono">
                                {biz.listingCode || `ID: ${biz._id.slice(-6).toUpperCase()}`}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-slate-50 pt-4 text-xs">
                            {biz.category && (
                              <div className="flex items-center justify-between min-h-[24px]">
                                <span className="text-slate-405 flex items-center gap-1.5">
                                  <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {t("வகை", "Category")}
                                </span>
                                <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md text-[10px] truncate max-w-[170px] text-right">
                                  {biz.subCategory || biz.category}
                                </span>
                              </div>
                            )}

                            {biz.phone && (
                              <div className="flex items-center justify-between min-h-[24px]">
                                <span className="text-slate-405 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {t("கைபேசி", "Phone")}
                                </span>
                                <span className="font-mono text-slate-700 text-right">{biz.phone}</span>
                              </div>
                            )}

                            {(biz.city || biz.district) && (
                              <div className="flex items-center justify-between min-h-[24px]">
                                <span className="text-slate-405 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {t("நகரம்", "Location")}
                                </span>
                                <span className="font-bold text-slate-700 text-right truncate max-w-[170px]">
                                  {[biz.city, biz.district].filter(Boolean).join(", ")}
                                </span>
                              </div>
                            )}

                            {biz.avgRating !== undefined && biz.avgRating > 0 && (
                              <div className="flex items-center justify-between min-h-[24px]">
                                <span className="text-slate-405 flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                  {t("மதிப்பீடு", "Rating")}
                                </span>
                                <span className="font-bold text-slate-700 text-right">
                                  {biz.avgRating.toFixed(1)} ★ ({biz.reviewCount || 0})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 border-t border-slate-50 pt-4 flex gap-2">
                          <Link
                            to="/business/$id"
                            params={{ id: biz._id }}
                            className="flex-1 bg-slate-50/80 hover:bg-primary hover:text-white border border-slate-200/60 hover:border-primary text-slate-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-xs active:scale-[0.98]"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{t("விவரங்கள் காண்க", "View Details")}</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 font-mono text-xs mt-8">
                  <button
                    disabled={page <= 1}
                    onClick={() => navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pNum = idx + 1;
                    const active = pNum === page;
                    return (
                      <button
                        key={pNum}
                        onClick={() => navigate({ search: (prev) => ({ ...prev, page: pNum }) })}
                        className={`w-9 h-9 rounded-lg border text-center font-bold transition cursor-pointer ${
                          active
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
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
