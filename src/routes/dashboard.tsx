import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Section } from "@/components/Section";
import {
  Download, FileText, CreditCard, Bell, ChevronRight, ShieldCheck,
  LogOut, ArrowLeft, Copy, Award, Users, Smartphone, Play,
  CheckCircle2, UserPlus, Sparkles, Clock, AlertCircle,
  Coins, Store, Rocket, ArrowRight, X,
  TrendingUp, BarChart3, PieChart as PieIcon, ArrowUpDown, MapPin, Globe, HeartPulse, ArrowUpRight, Search
} from "lucide-react";
import {
  growthData, wingMetrics, districtStats, loanDistribution
} from "./analytics";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getSession, clearSession } from "@/lib/session";
import { LoginPrompt } from "@/components/LoginPrompt";
import { useLanguage } from "@/hooks/useLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { ActivityCard } from "@/components/ActivityCard";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import orgLogo from "@/assets/association-logo.png";
import ownerPhoto from "@/assets/round-logo.png";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Member Dashboard · TN Vanigargalin Sangamam" },
      { name: "description", content: "Member dashboard — view your EPIC ID, download certificate, manage renewals and loans." },
    ],
  }),
  component: Dashboard,
});

const ACTIVITIES = [
  { d: "12 May 2026", t: "Membership Renewal",        s: "Payment ₹500 · UPI Success",           status: "success" as const },
  { d: "08 May 2026", t: "Certificate Download",       s: "EPIC PNG Format",                       status: "success" as const },
  { d: "02 May 2026", t: "Loan Request Submission",   s: "Retail Trader Loan · Under Verification", status: "pending" as const },
  { d: "20 Apr 2026", t: "Profile Address Update",     s: "Shop Location Mylapore",                status: "info"    as const },
];
const EVENTS = [
  {
    id: "agm-live",
    t: "Annual General Meeting (AGM) · Online Livecast",
    d: "Live Now · (In case you cannot attend offline, connect directly)",
    ta: "ஆண்டு பொதுக்குழு கூட்டம் · நேரலை (நேரில் வர முடியாதவர்கள் நேரலையில் இணையலாம்)",
    status: "live",
    attendees: 428,
  },
  {
    id: "agm-offline",
    t: "Annual General Meeting (AGM) · Chennai",
    d: "28 June 2026 · Mylapore Office Hub",
    ta: "ஆண்டு பொதுக்குழு கூட்டம் · சென்னை (நேரடி முகவரி: மயிலாப்பூர் அலுவலகம்)",
    status: "upcoming",
    attendees: 184,
  },
  {
    id: "loan-2026",
    t: "0% Interest Retail Loan Application Window",
    d: "Open until 15 July 2026 · Online Fast-track Submissions",
    ta: "வட்டியில்லா சில்லறை வணிகக் கடன் திட்டம்",
    status: "info",
    attendees: 0,
  },
];

function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [epicId, setEpicId] = useState<string | null>(() => getSession());
  const [dashboardTab, setDashboardTab] = useState<"overview" | "loans" | "recruiter" | "tools">("overview");

  const [dbProfile, setDbProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (!epicId) {
      setDbProfile(null);
      return;
    }
    const cleanEpic = epicId.trim().toUpperCase();
    setIsLoadingProfile(true);
    fetch(`/api/public/members?epic=${cleanEpic}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setDbProfile({
            ...data,
            photoUrl: data.selfie || ""
          });
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch member profile from database:", err);
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [epicId]);

  const currentMember = useMemo(() => {
    if (dbProfile) return dbProfile;

    if (!epicId) return null;
    const cleanEpic = epicId.trim().toUpperCase();
    
    // Fallback to President
    return {
      name: "Senthil Kumar N",
      epic: cleanEpic,
      mobile: "+91 944 20 •• 44",
      district: "Chennai",
      assembly: "Mylapore",
      shop: "Senthil Traders",
      type: "Retail",
      address: "Mylapore, Chennai",
      email: "president@tnvs.org",
      dob: "1985-05-15",
      age: "41",
      gender: "Male",
      bloodGroup: "A+",
      photoUrl: "",
      years: "15",
      wing: "Retail"
    };
  }, [epicId, dbProfile]);

  // Subsidized Loan Gated States
  const [showLoanCategories, setShowLoanCategories] = useState(true);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanModalSubject, setLoanModalSubject] = useState("");
  const [loanChatStep, setLoanChatStep] = useState(0);
  const [loanInputs, setLoanInputs] = useState({ name: "", phone: "", amount: "" });

  const openDashboardLoanModal = (type: "business" | "retail" | "young") => {
    let subject = "";
    if (type === "business") subject = t("வட்டியில்லா வணிகக் கடன் விண்ணப்பம்", "Interest-Free Business Loan Application");
    else if (type === "retail") subject = t("சில்லறை வணிகர்கள் கடன் விண்ணப்பம்", "Retail Trader Loan Application");
    else if (type === "young") subject = t("இளைய தொழில்முனைவோர் கடன் விண்ணப்பம்", "Young Entrepreneur Loan Application");
    
    setLoanModalSubject(subject);
    setLoanChatStep(1);
    setLoanInputs({ name: currentMember?.name || "Senthil Kumar N", phone: currentMember?.mobile || "+91 944 20 •• 44", amount: "" });
    setIsLoanModalOpen(true);
  };

  const [isCoordinator, setIsCoordinator] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsCoordinator(localStorage.getItem("tnvs_is_coordinator") === "true");
    }
  }, []);
  const [copiedLink, setCopiedLink] = useState(false);

  // Referred Members CRM Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "expired">("all");

  const mockReferredMembers = useMemo(() => [
    { id: "TNVS-5098", name: "Karthikeyan M", shop: "Karthik Traders", phone: "+91 98450 11234", district: "Chennai", date: "24 May 2026", status: "active" },
    { id: "TNVS-8891", name: "Selvam Kumar", shop: "Selvi Rice Stores", phone: "+91 97720 90812", district: "Madurai", date: "22 May 2026", status: "active" },
    { id: "TNVS-4112", name: "Arul Murugan N", shop: "Murugan Provisions", phone: "+91 94432 10091", district: "Trichy", date: "20 May 2026", status: "pending" },
    { id: "TNVS-3908", name: "Meenakshi Sundaram", shop: "Meenakshi Silks", phone: "+91 91234 56789", district: "Coimbatore", date: "18 May 2026", status: "active" },
    { id: "TNVS-1224", name: "Rajesh Kannan", shop: "Kannan Electricals", phone: "+91 80567 12345", district: "Salem", date: "15 May 2026", status: "expired" },
  ], []);

  const filteredReferredMembers = useMemo(() => {
    return mockReferredMembers.filter((m) => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, statusFilter, mockReferredMembers]);

  // RSVP Toggles States
  const [rsvpStates, setRsvpStates] = useState<Record<string, "attending" | "not_attending" | "none">>({
    "agm-live": "none",
    "agm-offline": "none",
    "loan-2026": "none",
  });

  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({
    "agm-live": 428,
    "agm-offline": 184,
    "loan-2026": 0,
  });

  // Live Stream Simulator overlay state
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [liveStreamTitle, setLiveStreamTitle] = useState("");

  const [streamComments, setStreamComments] = useState<Array<{ id: number; user: string; text: string; location: string }>>([
    { id: 1, user: "Siva Shanmugam", text: "வணக்கம் அசோசியேஷன் தலைவர்களே! 🙏", location: "Salem" },
    { id: 2, user: "Muthu Pandian", text: "Good initiative by TNVS team.", location: "Madurai" },
    { id: 3, user: "Rajasekar K", text: "சென்னை போக முடியல, இங்கிருந்தே பார்க்குறது சூப்பர்!", location: "Coimbatore" },
  ]);

  useEffect(() => {
    if (!isLiveStreamOpen) return;

    const dummyComments = [
      { user: "Selvaraj M", text: "ஜிஎஸ்டி ஹெல்ப் டெஸ்க் ரொம்ப பயனுள்ளதா இருக்கு.", location: "Trichy" },
      { user: "Devi Prasad", text: "TNVS வாழ்க! 🌟", location: "Nellai" },
      { user: "Arun Kumar", text: "Excellent clarity in video and sound.", location: "Erode" },
      { user: "Ramakrishnan", text: "வணக்கம்! சென்னை அலுவலகம் சிறப்பா செயல்படுது.", location: "Vellore" },
      { user: "Meera Nair", text: "Proud to be a TNVS member.", location: "Kanyakumari" },
      { user: "Kathiravan S", text: "அடுத்த மாநாடு எப்போ நடக்கும்?", location: "Tiruppur" },
    ];

    let count = 4;
    const interval = setInterval(() => {
      const randomComment = dummyComments[Math.floor(Math.random() * dummyComments.length)];
      setStreamComments(prev => [
        ...prev, 
        { id: count++, user: randomComment.user, text: randomComment.text, location: randomComment.location }
      ].slice(-8)); // Keep last 8 comments
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreamOpen]);

  // GST Hub states
  const [gstActiveTab, setGstActiveTab] = useState<"calc" | "query">("calc");
  const [calcAmount, setCalcAmount] = useState<string>("10000");
  const [calcRate, setCalcRate] = useState<number>(18);
  const [gstQueryText, setGstQueryText] = useState("");

  // Business Loans & Credit Portal states
  const [loanPortalTab, setLoanPortalTab] = useState<"apply" | "track">("apply");
  const [loanSchemeType, setLoanSchemeType] = useState<"business" | "retail" | "young" | "micro" | null>(null);
  const [loanFormStep, setLoanFormStep] = useState(1); // 1: Select/Fill, 2: Upload, 3: Success
  const [loanFormInputs, setLoanFormInputs] = useState({
    shopName: "Senthil Traders",
    proprietorName: "Senthil Kumar N",
    phone: "+91 944 20 •• 44",
    aadhaar: "",
    amount: "500000",
    tenure: "24",
    businessStructure: "Proprietorship",
    reason: "",
    age: "30"
  });

  useEffect(() => {
    if (currentMember) {
      setLoanFormInputs(prev => ({
        ...prev,
        shopName: currentMember.shop || "Senthil Traders",
        proprietorName: currentMember.name,
        phone: currentMember.mobile,
        age: currentMember.age || "30",
      }));
    }
  }, [currentMember]);
  const [loanUploads, setLoanUploads] = useState<Array<{ name: string; size: string; progress: number; status: "uploading" | "done" }>>([]);
  const [isLoanUploading, setIsLoanUploading] = useState(false);
  const [loanClaims, setLoanClaims] = useState<Array<{
    id: string;
    type: "business" | "retail" | "young" | "micro";
    title: string;
    description: string;
    date: string;
    status: "pending" | "approved" | "disbursed" | "rejected";
    step: number; // 1: Submitted, 2: Verification, 3: Approved, 4: Disbursed
    docs: string[];
  }>>([
    {
      id: "TNVS-LN-88301",
      type: "business",
      title: "Interest-Free Business Loan (₹5,00,000)",
      description: "Proprietorship · 24 Months repayment",
      date: "08 May 2026",
      status: "approved",
      step: 3,
      docs: ["ShopLicense.pdf", "GSTR_Registration.pdf", "BankStatement_6M.pdf"]
    },
    {
      id: "TNVS-LN-41102",
      type: "retail",
      title: "Retail Trader Loan (₹50,000)",
      description: "Proprietorship · 12 Months repayment",
      date: "02 May 2026",
      status: "pending",
      step: 2,
      docs: ["ShopLicense.pdf", "AadharCard.pdf", "BankStatement_3M.pdf"]
    }
  ]);

  const startSimulatedLoanUpload = () => {
    setIsLoanUploading(true);
    const files = loanSchemeType === "business" 
      ? [
          { name: "GSTR_Registration.pdf", size: "2.1 MB", progress: 0, status: "uploading" as const },
          { name: "BankStatement_6M.pdf", size: "5.4 MB", progress: 0, status: "uploading" as const }
        ]
      : loanSchemeType === "retail"
      ? [
          { name: "ShopLicense.pdf", size: "1.8 MB", progress: 0, status: "uploading" as const },
          { name: "BankStatement_3M.pdf", size: "4.1 MB", progress: 0, status: "uploading" as const }
        ]
      : loanSchemeType === "young"
      ? [
          { name: "AadharCard.pdf", size: "1.2 MB", progress: 0, status: "uploading" as const },
          { name: "BusinessProjectReport.pdf", size: "3.5 MB", progress: 0, status: "uploading" as const }
        ]
      : [
          { name: "AadharCard.pdf", size: "1.2 MB", progress: 0, status: "uploading" as const },
          { name: "ShopPhoto.jpg", size: "2.8 MB", progress: 0, status: "uploading" as const }
        ];

    setLoanUploads(files);

    let progress1 = 0;
    let progress2 = 0;

    const timer = setInterval(() => {
      progress1 = Math.min(progress1 + Math.floor(Math.random() * 25) + 15, 100);
      progress2 = Math.min(progress2 + Math.floor(Math.random() * 20) + 12, 100);

      setLoanUploads(prev => {
        if (prev.length < 2) return prev;
        const next = [...prev];
        next[0] = { ...next[0], progress: progress1, status: progress1 === 100 ? "done" : "uploading" };
        next[1] = { ...next[1], progress: progress2, status: progress2 === 100 ? "done" : "uploading" };
        return next;
      });

      if (progress1 === 100 && progress2 === 100) {
        clearInterval(timer);
        setIsLoanUploading(false);
        toast.success(
          language === "ta"
            ? "ஆவணங்கள் வெற்றிகரமாக பதிவேற்றப்பட்டன! 📄"
            : "Documents uploaded successfully! 📄"
        );
      }
    }, 150);
  };

  const handleLoanPortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanSchemeType) return;

    const newApp = {
      id: `TNVS-LN-${Math.floor(Math.random() * 90000) + 10000}`,
      type: loanSchemeType,
      title: loanSchemeType === "business"
        ? t("வட்டியில்லா வணிகக் கடன்", "Interest-Free Business Loan") + ` (₹${Number(loanFormInputs.amount).toLocaleString()})`
        : loanSchemeType === "retail"
        ? t("சில்லறை வணிகர்கள் கடன்", "Retail Trader Loan") + ` (₹${Number(loanFormInputs.amount).toLocaleString()})`
        : loanSchemeType === "young"
        ? t("இளைய தொழில்முனைவோர் கடன்", "Young Entrepreneur Loan") + ` (₹${Number(loanFormInputs.amount).toLocaleString()})`
        : t("நுண்ணிய & சாலையோர வியாபாரிகள் கடன்", "Micro & Street Vendor Loan") + ` (₹${Number(loanFormInputs.amount).toLocaleString()})`,
      description: `${loanFormInputs.businessStructure} · ${loanFormInputs.tenure} Months repayment`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "pending" as const,
      step: 1, // Submitted
      docs: loanUploads.map(f => f.name)
    };

    setLoanClaims(prev => [newApp, ...prev]);
    setLoanFormStep(3); // Success Step
    toast.success(
      language === "ta"
        ? "விண்ணப்பம் சமர்ப்பிக்கப்பட்டது! டிராக்கிங் ஐடி: " + newApp.id
        : "Application submitted successfully! Tracking ID: " + newApp.id
    );
  };

  const cgstAmount = useMemo(() => {
    const amt = Number(calcAmount) || 0;
    return ((amt * (calcRate / 2)) / 100).toFixed(2);
  }, [calcAmount, calcRate]);

  const sgstAmount = useMemo(() => {
    const amt = Number(calcAmount) || 0;
    return ((amt * (calcRate / 2)) / 100).toFixed(2);
  }, [calcAmount, calcRate]);

  const totalCalculated = useMemo(() => {
    const amt = Number(calcAmount) || 0;
    const cgst = Number(cgstAmount);
    const sgst = Number(sgstAmount);
    return (amt + cgst + sgst).toFixed(2);
  }, [calcAmount, cgstAmount, sgstAmount]);
  
  const handleToggleRsvp = (eventId: string, status: "attending" | "not_attending") => {
    const current = rsvpStates[eventId];
    
    // Toggle logic
    let nextStatus: "attending" | "not_attending" | "none" = status;
    if (current === status) {
      nextStatus = "none";
    }

    setRsvpStates(prev => ({ ...prev, [eventId]: nextStatus }));

    // Adjust attendee counter
    setAttendeeCounts(prev => {
      const base = prev[eventId];
      let diff = 0;
      if (nextStatus === "attending" && current !== "attending") {
        diff = 1;
      } else if (nextStatus !== "attending" && current === "attending") {
        diff = -1;
      }
      return { ...prev, [eventId]: base + diff };
    });

    if (nextStatus === "attending") {
      toast.success(
        language === "ta" 
          ? "வருகை உறுதி செய்யப்பட்டது! கூட்டத்தில் சந்திப்போம். 🤝" 
          : "RSVP confirmed! See you at the event. 🤝"
      );
    } else if (nextStatus === "none") {
      toast.info(t("பதில் ரத்து செய்யப்பட்டது.", "RSVP canceled."));
    }
  };

  const handleLogout = () => {
    clearSession();
    setEpicId(null);
    toast.success("Signed out successfully.");
  };

  const handleDownloadIdCard = () => {
    if (!epicId) return;
    navigate({ to: "/voter-id", search: { epic: epicId } } as never);
  };

  const handleOptInCoordinator = () => {
    setIsCoordinator(true);
    localStorage.setItem("tnvs_is_coordinator", "true");
    toast.success(
      language === "ta"
        ? "ஒருங்கிணைப்பாளர் திட்டத்தில் இணைந்ததற்கு வாழ்த்துகள்! 🌟"
        : "Successfully opted in as a Coordinator! 🌟"
    );
  };

  if (!epicId) {
    return <LoginPrompt onLogin={(id) => setEpicId(id)} />;
  }

  // Use window.location.origin for referral URL — not a non-existent domain
  const referralUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/refer/${epicId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl).catch(() => {});
    setCopiedLink(true);
    toast.success(t("பரிந்துரை இணைப்பு நகலெடுக்கப்பட்டது! ✓", "Referral link copied successfully! ✓"));
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const InfoCellDark = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-primary/5 p-3 rounded-md border border-white/10 text-left">
      <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground leading-none">{label}</div>
      <div className="text-xs font-bold text-slate-100 mt-1.5 leading-none">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-12">

      {/* Page Header */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 w-full">

          {/* Demo Mode Banner — full width, top of page */}
          <div className="mb-5">
            <DemoModeBanner />
          </div>

          <Breadcrumb
            items={[
              { label: "Services", labelTa: "சேவைகள்", to: "/members" },
              { label: "Dashboard", labelTa: "டாஷ்போர்டு" },
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                  Member ID: {epicId}
                </div>
                <StatusPill status="active" label="ACTIVE" />
              </div>
              <h1 className="mt-2.5 font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
                {t("வணக்கம், " + (currentMember?.name || "செந்தில் குமார் N"), "Welcome, " + (currentMember?.name || "Senthil Kumar N"))}
              </h1>
              <p className="font-tamil text-xs md:text-sm text-slate-550 mt-0.5">
                {t("உங்கள் உறுப்பினர் கணக்கு செயலில் உள்ளது.", "Your membership account is active.")}
              </p>
            </div>

            <div className="flex gap-2.5 flex-wrap items-center">
              <button
                onClick={handleDownloadIdCard}
                className="btn-primary py-3 px-5 rounded-md text-sm font-bold shadow-xs cursor-pointer transition hover:scale-[1.02] active:scale-98 min-h-[48px]"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                {t("சான்றிதழ் பதிவிறக்கம்", "Download Certificate")}
              </button>
              <button
                onClick={handleLogout}
                className="btn-ghost py-3 px-4 rounded-md text-sm font-semibold cursor-pointer transition active:scale-98 min-h-[48px]"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {t("வெளியேறு", "Sign Out")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Navigation Tabs Stepper ── */}
      <section className="border-b border-border sticky top-0 z-40 shadow-xs backdrop-blur-md bg-card/90 py-2.5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex bg-slate-105 p-1.5 rounded-md border border-border w-full sm:w-auto overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview", labelTa: "முன்னோட்டம்", icon: Store },
              { id: "loans", label: "Business Loans", labelTa: "வணிகக் கடன்கள்", icon: Coins },
              { id: "recruiter", label: "Recruiter Hub", labelTa: "ஒருங்கிணைப்பாளர்", icon: Users },
              { id: "tools", label: "Tools & Apps", labelTa: "டிஜிட்டல் சேவைகள்", icon: Smartphone }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const active = dashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setDashboardTab(tab.id as any);
                    toast.info(language === "ta" ? `${tab.labelTa} பிரிவு திறக்கப்பட்டது` : `${tab.label} section loaded`);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-md text-xs font-bold transition-all relative cursor-pointer min-h-[40px] whitespace-nowrap ${
                    active ? "bg-card text-primary shadow-xs border border-border/30 font-extrabold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${active ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                  <div className="flex flex-col items-start leading-none text-left">
                    <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
                    <span className="font-tamil text-[8px] opacity-75 mt-0.5">{tab.labelTa}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Dashboard Tab Content Area ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={dashboardTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >

            {/* ─── TAB 1: Overview ─── */}
            {dashboardTab === "overview" && (
              <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
                {/* Left side: Member card & actions */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Glowing Premium Member Card */}
                  <div className="bg-linear-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-md border border-slate-800 p-6 relative overflow-hidden shadow-xl shadow-primary/10 group">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-primary/20 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none group-hover:bg-primary/25 transition duration-500" />
                    
                    <div className="flex justify-between items-center pb-4 border-b border-white/10 gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-850 shadow-xs shrink-0">
                          <img 
                            src={currentMember?.photoUrl || ownerPhoto} 
                            alt={currentMember?.name || "Member Photo"} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <div className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {t("உறுப்பினர் அடையாள எண்", "Membership ID")}
                          </div>
                          <div className="font-mono text-base font-black text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-yellow-100 to-amber-400 tracking-wider">
                            {epicId}
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-white/20 p-1 bg-card shadow-xs shrink-0">
                        <img src={orgLogo} alt="TNVS" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <InfoCellDark label="Member Name"        value={currentMember?.name || "Senthil Kumar N"} />
                      <InfoCellDark label="District"           value={currentMember?.district || "Chennai"} />
                      <InfoCellDark label="Zone"               value={currentMember?.district ? `${currentMember.district} Zone` : "Chennai Zone"} />
                      <InfoCellDark label="Assembly"           value={currentMember?.assembly || "Mylapore"} />
                      <InfoCellDark label="Registered Mobile"  value={currentMember?.mobile || "+91 944 20 •• 44"} />
                      <InfoCellDark label="Member Class"       value={currentMember?.type || "A+ Patron"} />
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="text-[10px] text-muted-foreground">
                        {t("வரை செல்லும்", "Valid till")}{" "}
                        <span className="text-white font-bold font-mono">04 Dec 2026</span>
                      </div>
                      <StatusPill status="active" label="ACTIVE" />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        handleDownloadIdCard();
                        toast.info("Preparing digital member pass...");
                      }}
                      className="bg-card rounded-md border border-border p-5 text-left group min-h-[90px] cursor-pointer shadow-xs hover:shadow-xs hover:border-primary/30 transition-all duration-205 hover:-translate-y-0.5"
                    >
                      <div className="w-9 h-9 rounded-md bg-primary/5 text-primary flex items-center justify-center group-hover:scale-105 transition duration-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold mt-3 text-foreground">
                        {t("உறுப்பினர் சான்றிதழ்", "Download Certificate")}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{t("PDF / PNG கோப்பு", "High-res PDF/PNG")}</div>
                    </button>

                    <button
                      onClick={() => toast.info("Renewal window opens October 2026. Current membership valid till Dec 2026.")}
                      className="bg-card rounded-md border border-border p-5 text-left group min-h-[90px] cursor-pointer shadow-xs hover:shadow-xs hover:border-primary/30 transition-all duration-205 hover:-translate-y-0.5"
                    >
                      <div className="w-9 h-9 rounded-md bg-primary/5 text-primary flex items-center justify-center group-hover:scale-105 transition duration-300">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold mt-3 text-foreground">
                        {t("கணக்கு புதுப்பித்தல்", "Card Renewal")}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{t("உறுப்பினர் புதுப்பித்தல்", "Membership Renewal")}</div>
                    </button>
                  </div>
                </div>

                {/* Right side: Activity and events */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Recent Activity */}
                  <div className="bg-card rounded-md border border-border p-6 shadow-xs text-left">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                      <h2 className="font-display text-xs font-bold text-foreground uppercase tracking-wide">
                        {t("சமீபத்திய செயல்பாடுகள்", "Recent Activity Logs")}
                      </h2>
                      <span className="text-[9px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-bold border border-border uppercase">
                        {t("நடப்பு மாதம்", "This Month")}
                      </span>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto rounded-md border border-border/85">
                      <table className="w-full text-left border-collapse" aria-label="Recent activity">
                        <thead>
                          <tr className="bg-muted border-b border-border">
                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">{t("தேதி", "Date")}</th>
                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">{t("செயல்பாடு", "Activity Detail")}</th>
                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">{t("நிலை", "Status")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ACTIVITIES.map((a) => (
                            <tr key={a.t} className="border-b border-border hover:bg-background transition">
                              <td className="px-4 py-3.5 text-xs text-muted-foreground font-mono whitespace-nowrap">{a.d}</td>
                              <td className="px-4 py-3.5">
                                <div className="text-xs font-bold text-foreground">{a.t}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{a.s}</div>
                              </td>
                              <td className="px-4 py-3.5">
                                <StatusPill status={a.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden divide-y divide-slate-100">
                      {ACTIVITIES.map((a) => (
                        <ActivityCard
                          key={a.t}
                          date={a.d}
                          title={a.t}
                          subtitle={a.s}
                          status={a.status}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Meetings and announcements */}
                  <div className="bg-card rounded-md border border-border p-6 shadow-xs text-left space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-500 animate-bounce" aria-hidden="true" />
                        {t("கூட்டங்கள் & நிகழ்வுகள்", "Meetings & Announcements")}
                      </h2>
                      <span className="text-[9px] font-bold bg-primary/100/10 text-amber-600 px-2 py-0.5 rounded uppercase">
                        {EVENTS.filter(e => e.status === "live").length > 0 ? "LIVE SESSION" : "UPCOMING"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {EVENTS.map((e) => {
                        const isLive = e.status === "live";
                        const isUpcoming = e.status === "upcoming";
                        const isRsvped = rsvpStates[e.id] === "attending";
                        const count = attendeeCounts[e.id];

                        return (
                          <div
                            key={e.id}
                            onClick={
                              isLive 
                                ? () => {
                                    setLiveStreamTitle(language === "ta" ? e.ta : e.t);
                                    setIsLiveStreamOpen(true);
                                  }
                                : e.id === "loan-2026"
                                ? () => {
                                    setLoanPortalTab("apply");
                                    setLoanSchemeType("retail");
                                    setLoanFormStep(1);
                                    setDashboardTab("loans");
                                    setTimeout(() => {
                                      const element = document.getElementById("loans-portal-section");
                                      if (element) element.scrollIntoView({ behavior: "smooth" });
                                    }, 100);
                                    toast.success(
                                      language === "ta"
                                        ? "வட்டியில்லா சில்லறை வணிகக் கடன் விண்ணப்பம் திறக்கப்பட்டது! 🪙"
                                        : "Interest-Free Retail Loan Form opened in Loans tab! 🪙"
                                    );
                                  }
                                : undefined
                            }
                            className={`rounded-md border transition-all duration-300 flex flex-col gap-3 text-left group ${
                              isLive 
                                ? "p-5 bg-rose-50/70 text-rose-950 border-rose-200/80 shadow-md animate-pulse-subtle cursor-pointer hover:bg-rose-100/80 hover:border-rose-300 hover:shadow-lg active:scale-[0.99]" 
                                : e.id === "loan-2026"
                                ? "p-4 bg-background hover:bg-primary/5 border-border hover:border-amber-500/30 cursor-pointer active:scale-[0.99]"
                                : "p-4 bg-background hover:bg-muted border-border hover:border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 w-full">
                              <div className="space-y-1">
                                <div className={`text-[9px] font-black uppercase tracking-widest ${isLive ? "text-rose-700 flex items-center gap-1.5" : "text-muted-foreground"}`}>
                                  {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
                                  {isLive ? t("நேரடி ஒளிபரப்பு", "LIVE BROADCAST") : e.id === "loan-2026" ? t("கடன் திட்டம்", "LOAN SCHEME") : t("நிகழ்வு", "ANNOUNCEMENT")}
                                </div>
                                <h4 className={`leading-snug font-bold text-xs ${isLive ? "text-base font-black text-rose-950 font-serif tracking-tight" : "text-slate-800 font-sans"}`}>
                                  {language === "ta" ? e.ta : e.t}
                                </h4>
                                {isLive ? (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span>{e.d}</span>
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-muted-foreground font-tamil font-semibold">
                                    {e.d}
                                  </p>
                                )}
                              </div>

                              {isLive && (
                                <div
                                  className="bg-linear-to-r from-red-600 to-rose-600 group-hover:from-red-500 group-hover:to-rose-500 text-white px-3.5 py-2 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-xs border border-red-500/25 transition-all duration-305"
                                >
                                  <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                                  <span>{t("நேரடி ஒளிபரப்பு", "Watch Live")}</span>
                                </div>
                              )}

                              {e.id === "loan-2026" && (
                                <div
                                  className="bg-primary hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-xs transition active:scale-95 cursor-pointer"
                                >
                                  <span>{t("விண்ணப்பிக்க", "Apply Online")}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            {/* Attendee Counters & RSVP Panel for upcoming events */}
                            {isUpcoming && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-border mt-0.5">
                                <div className="text-[10px] text-muted-foreground font-tamil">
                                  {count > 0 ? (
                                    <span>✓ <strong className="text-foreground font-bold">{count}</strong> {t("வணிகர்கள் பங்கேற்கிறார்கள்", "traders attending")}</span>
                                  ) : (
                                    t("முன்பதிவு செய்ய விருப்பம்", "RSVP open to all members")
                                  )}
                                </div>

                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e_event) => {
                                      e_event.stopPropagation();
                                      handleToggleRsvp(e.id, "attending");
                                    }}
                                    className={`px-3 py-1 rounded text-[10px] font-extrabold transition cursor-pointer border ${
                                      isRsvped 
                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                                        : "bg-card border-border hover:bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {isRsvped ? t("✓ நான் வருகிறேன்", "✓ Going") : t("நான் வருகிறேன்", "Going")}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e_event) => {
                                      e_event.stopPropagation();
                                      setRsvpStates(prev => ({ ...prev, [e.id]: "none" }));
                                      setAttendeeCounts(prev => {
                                        const current = rsvpStates[e.id];
                                        const base = prev[e.id];
                                        return { ...prev, [e.id]: current === "attending" ? base - 1 : base };
                                      });
                                      toast.info(t("பதில் ரத்து செய்யப்பட்டது.", "RSVP canceled."));
                                    }}
                                    className="bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground px-2 py-1 rounded text-[10px] transition cursor-pointer"
                                  >
                                    {t("வரவில்லை", "Decline")}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: Business Loans ─── */}
            {dashboardTab === "loans" && (
              <div className="space-y-6 animate-fadeIn text-left">
                {/* Hero promo banner */}
                <div className="relative overflow-hidden rounded-md bg-navy border border-blue-900/50 shadow-xs flex flex-col justify-center p-6 sm:p-10 min-h-[220px] select-none bg-radial-at-tr from-blue-950 via-navy to-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-primary rounded-full"></div>
                    <span className="bg-blue-600/30 text-blue-450 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                      {t("உறுப்பினர் சிறப்பு சலுகை", "MEMBER SPECIAL OFFER")}
                    </span>
                  </div>
                  <h1 className="mt-4 font-serif text-xl sm:text-3xl font-extrabold text-white leading-tight max-w-2xl">
                    {language === "ta" ? (
                      <>வட்டியில்லா <span className="text-amber-400">கடன்</span> பெற்று உங்கள் தொழிலை வளர்க்கவும்.</>
                    ) : (
                      <>Grow your business with 0% <span className="text-amber-400">Interest Loans</span>.</>
                    )}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-tamil font-semibold">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{t("வட்டியில்லா கடன்", "0% Interest (0% Vatti)")}</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{t("எளிய ஆவணங்கள்", "Only Simple Documents Needed")}</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{t("₹25 லட்சம் வரை பெறலாம்", "Get up to ₹25 Lakhs")}</span>
                  </div>
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Loan Apply/Track portal */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Business Loans & Credit Portal */}
                    <div id="loans-portal-section" className="bg-card rounded-md border border-border p-6 shadow-xs border-l-4 border-l-emerald-600">
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-emerald-600 animate-pulse" />
                          <h3 className="font-display font-bold text-sm text-foreground">
                            {t("வணிகக் கடன் & நிதியுதவி", "Business Loans & Credit Portal")}
                          </h3>
                        </div>
                        <div className="flex bg-muted p-0.5 rounded-sm border border-slate-205/40 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setLoanPortalTab("apply")}
                            className={`px-3 py-1 font-bold rounded-md transition ${
                              loanPortalTab === "apply"
                                ? "bg-card text-emerald-600 shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t("விண்ணப்பிக்க", "Apply")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setLoanPortalTab("track")}
                            className={`px-3 py-1 font-bold rounded-md transition ${
                              loanPortalTab === "track"
                                ? "bg-card text-emerald-600 shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t("டிராக் செய்க", "Track Status")}
                          </button>
                        </div>
                      </div>

                      {/* Portal Body */}
                      {loanPortalTab === "apply" && (
                        <div className="pt-4 text-left">
                          {loanFormStep === 1 && (
                            <div>
                              {!loanSchemeType ? (
                                <div className="space-y-3">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">{t("கடன் பிரிவைத் தேர்ந்தெடுக்கவும்", "Select a Loan Type")}</span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div 
                                      onClick={() => {
                                        setLoanSchemeType("business");
                                        setLoanFormInputs(prev => ({ ...prev, amount: "500000", tenure: "24", reason: "" }));
                                      }}
                                      className="border border-border rounded-md p-4 bg-background hover:bg-primary/10/20 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[140px]"
                                    >
                                      <div>
                                        <div className="w-9 h-9 rounded-sm bg-primary/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                          <Coins className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-xs font-bold text-foreground font-tamil leading-tight">{t("வட்டியில்லா வணிகக் கடன்", "Interest-Free Business Loan")}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-tamil">
                                          {t("இறக்குமதி, ஏற்றுமதி, மற்றும் பிற வணிகங்களுக்கு ₹25 லட்சம் வரை.", "Up to ₹25 lakh for Pvt Ltd, partnerships, and freelancers.")}
                                        </p>
                                      </div>
                                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-3 flex items-center gap-0.5 group-hover:translate-x-1 transition">
                                        {t("கடன் கோருக →", "Select Loan →")}
                                      </span>
                                    </div>

                                    <div 
                                      onClick={() => {
                                        setLoanSchemeType("retail");
                                        setLoanFormInputs(prev => ({ ...prev, amount: "50000", tenure: "12", reason: "" }));
                                      }}
                                      className="border border-border rounded-md p-4 bg-background hover:bg-primary/10/20 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[140px]"
                                    >
                                      <div>
                                        <div className="w-9 h-9 rounded-sm bg-primary/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                          <Store className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-xs font-bold text-foreground font-tamil leading-tight">{t("சில்லறை வணிகர்கள் கடன்", "Retail Trader Loan")}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-tamil">
                                          {t("பதிவுசெய்த சில்லறை வர்த்தகர்களுக்கு ₹5 லட்சம் வரை எளிய கடன்.", "Quick working capital up to ₹5 lakh with minimal documents.")}
                                        </p>
                                      </div>
                                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-3 flex items-center gap-0.5 group-hover:translate-x-1 transition">
                                        {t("கடன் கோருக →", "Select Loan →")}
                                      </span>
                                    </div>

                                    <div 
                                      onClick={() => {
                                        setLoanSchemeType("young");
                                        setLoanFormInputs(prev => ({ ...prev, amount: "200000", tenure: "18", reason: "" }));
                                      }}
                                      className="border border-border rounded-md p-4 bg-background hover:bg-primary/10/20 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[140px]"
                                    >
                                      <div>
                                        <div className="w-9 h-9 rounded-sm bg-primary/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                          <Rocket className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-xs font-bold text-foreground font-tamil leading-tight">{t("இளைய தொழில்முனைவோர் கடன்", "Young Entrepreneur Loan")}</h4>
                                        <p className="text-[10px] text-slate-505 mt-1 leading-normal font-tamil">
                                          {t("40 வயதுக்குட்பட்ட இளைஞர்களுக்கு வட்டி மானியத்துடன் கூடிய நிதியுதவி.", "Special subsidized loan scheme for entrepreneurs under 40 years.")}
                                        </p>
                                      </div>
                                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-3 flex items-center gap-0.5 group-hover:translate-x-1 transition">
                                        {t("கடன் கோருக →", "Select Loan →")}
                                      </span>
                                    </div>

                                    <div 
                                      onClick={() => {
                                        setLoanSchemeType("micro");
                                        setLoanFormInputs(prev => ({ ...prev, amount: "25000", tenure: "6", reason: "" }));
                                      }}
                                      className="border border-border rounded-md p-4 bg-background hover:bg-primary/10/20 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[140px]"
                                    >
                                      <div>
                                        <div className="w-9 h-9 rounded-sm bg-primary/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                          <Smartphone className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-xs font-bold text-foreground font-tamil leading-tight">{t("நுண்ணிய & சாலையோர வியாபாரிகள் கடன்", "Micro & Street Vendor Loan")}</h4>
                                        <p className="text-[10px] text-slate-505 mt-1 leading-normal font-tamil">
                                          {t("சாலையோர மற்றும் சிறு வணிகர்களுக்கான ₹50,000 வரையிலான உடனடி குறுங்கடன்.", "Zero-interest micro-loans up to ₹50,000 for local street merchants.")}
                                        </p>
                                      </div>
                                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-3 flex items-center gap-0.5 group-hover:translate-x-1 transition">
                                        {t("கடன் கோருக →", "Select Loan →")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <form onSubmit={(e) => { e.preventDefault(); setLoanFormStep(2); startSimulatedLoanUpload(); }} className="space-y-4 font-sans text-xs">
                                  <div className="flex justify-between items-center bg-muted p-2.5 rounded-sm border border-border">
                                    <span className="font-bold text-slate-705 capitalize">
                                      {t("தேர்ந்தெடுக்கப்பட்ட கடன்:", "Selected Loan:")} <span className="text-emerald-705">
                                        {loanSchemeType === "business"
                                          ? t("வட்டியில்லா வணிகக் கடன்", "Interest-Free Business Loan")
                                          : loanSchemeType === "retail"
                                          ? t("சில்லறை வணிகர்கள் கடன்", "Retail Trader Loan")
                                          : loanSchemeType === "young"
                                          ? t("இளைய தொழில்முனைவோர் கடன்", "Young Entrepreneur Loan")
                                          : t("நுண்ணிய & சாலையோர வியாபாரிகள் கடன்", "Micro & Street Vendor Loan")}
                                      </span>
                                    </span>
                                    <button 
                                      type="button" 
                                      onClick={() => setLoanSchemeType(null)}
                                      className="text-[9px] font-bold text-rose-650 hover:underline"
                                    >
                                      {t("மாற்று", "Change Type")}
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-650 block">{t("தேவைப்படும் கடன் தொகை *", "Loan Amount Needed *")}</label>
                                      <select 
                                        value={loanFormInputs.amount} 
                                        onChange={(e) => setLoanFormInputs({ ...loanFormInputs, amount: e.target.value })}
                                        className="w-full bg-card border border-border rounded-sm p-2.5 font-bold text-foreground"
                                      >
                                        {loanSchemeType === "micro" ? (
                                          <>
                                            <option value="10000">₹10,000</option>
                                            <option value="25000">₹25,000</option>
                                            <option value="50000">₹50,000</option>
                                          </>
                                        ) : loanSchemeType === "retail" ? (
                                          <>
                                            <option value="50000">₹50,000</option>
                                            <option value="100000">₹1,00,000</option>
                                            <option value="200000">₹2,00,000</option>
                                            <option value="500000">₹5,00,000</option>
                                          </>
                                        ) : loanSchemeType === "young" ? (
                                          <>
                                            <option value="100000">₹1,00,000</option>
                                            <option value="250000">₹2,50,000</option>
                                            <option value="500000">₹5,00,000</option>
                                          </>
                                        ) : (
                                          <>
                                            <option value="500000">₹5,00,000</option>
                                            <option value="1000000">₹10,00,000</option>
                                            <option value="1500000">₹15,00,000</option>
                                            <option value="2500000">₹25,00,000</option>
                                          </>
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-650 block">{t("திருப்பிக் செலுத்தும் காலம் *", "Repayment Tenure *")}</label>
                                      <select 
                                        value={loanFormInputs.tenure} 
                                        onChange={(e) => setLoanFormInputs({ ...loanFormInputs, tenure: e.target.value })}
                                        className="w-full bg-card border border-border rounded-sm p-2.5 text-foreground font-bold"
                                      >
                                        {loanSchemeType === "micro" ? (
                                          <>
                                            <option value="6">6 Months</option>
                                            <option value="12">12 Months</option>
                                          </>
                                        ) : (
                                          <>
                                            <option value="12">12 Months</option>
                                            <option value="18">18 Months</option>
                                            <option value="24">24 Months</option>
                                            <option value="36">36 Months</option>
                                          </>
                                        )}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-650 block">{t("வணிக அமைப்பு முறை *", "Business Structure *")}</label>
                                      <select 
                                        value={loanFormInputs.businessStructure} 
                                        onChange={(e) => setLoanFormInputs({ ...loanFormInputs, businessStructure: e.target.value })}
                                        className="w-full bg-card border border-border rounded-sm p-2.5 text-foreground font-bold"
                                      >
                                        <option value="Proprietorship">{t("தனியுரிமை", "Proprietorship")}</option>
                                        <option value="Partnership">{t("கூட்டாண்மை", "Partnership")}</option>
                                        <option value="Pvt Ltd">{t("பிரைவேட் லிமிடெட்", "Pvt Ltd")}</option>
                                        <option value="Freelancer">{t("சுயதொழில்", "Freelancer")}</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-650 block">{t("ஆதார் எண் *", "Aadhaar Card Number *")}</label>
                                      <input 
                                        type="text" 
                                        required 
                                        placeholder="12 Digit UID Number"
                                        value={loanFormInputs.aadhaar}
                                        onChange={(e) => setLoanFormInputs({ ...loanFormInputs, aadhaar: e.target.value.replace(/\D/g, "").slice(0,12) })}
                                        className="w-full bg-card border border-border rounded-sm p-2.5 font-bold" 
                                      />
                                    </div>

                                    {loanSchemeType === "young" && (
                                      <div className="space-y-1">
                                        <label className="font-bold text-slate-650 block">{t("வயது *", "Age *")}</label>
                                        <input 
                                          type="number" 
                                          required 
                                          min="18"
                                          max="40"
                                          value={loanFormInputs.age}
                                          onChange={(e) => setLoanFormInputs({ ...loanFormInputs, age: e.target.value })}
                                          className="w-full bg-card border border-border rounded-sm p-2.5 font-bold" 
                                        />
                                      </div>
                                    )}

                                    <div className="space-y-1 sm:col-span-2">
                                      <label className="font-bold text-slate-650 block">{t("கடன் கோருவதற்கான நோக்கம் *", "Purpose of Loan *")}</label>
                                      <input 
                                        type="text" 
                                        required 
                                        placeholder={t("எ.கா. சரக்கு கொள்முதல், கடை புதுப்பித்தல்", "e.g. Purchase of stock, shop renovation")}
                                        value={loanFormInputs.reason}
                                        onChange={(e) => setLoanFormInputs({ ...loanFormInputs, reason: e.target.value })}
                                        className="w-full bg-card border border-border rounded-sm p-2.5" 
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-primary text-white font-bold py-2.5 rounded-md cursor-pointer shadow-xs transition"
                                  >
                                    {t("ஆவணங்கள் பதிவேற்றத்திற்குத் தொடரவும் →", "Continue to Documents Upload →")}
                                  </button>
                                </form>
                              )}
                            </div>
                          )}

                          {/* Step 2: Upload Documents & Verify */}
                          {loanFormStep === 2 && (
                            <div className="space-y-4 font-sans text-xs">
                              <div className="bg-muted border border-border p-3.5 rounded-md space-y-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Simulated Document Verification</span>
                                <div className="space-y-2.5">
                                  {loanUploads.map((file, idx) => (
                                    <div key={idx} className="flex flex-col bg-card border border-border p-3 rounded-sm shadow-xs">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-foreground">{file.name}</span>
                                        <span className="text-slate-405 font-mono text-[10px]">{file.size}</span>
                                      </div>
                                      <div className="flex items-center gap-3 mt-2">
                                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                                          <div 
                                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${file.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-[9px] font-bold text-emerald-600 shrink-0">{file.progress}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={isLoanUploading}
                                onClick={handleLoanPortalSubmit}
                                className={`w-full font-bold py-2.5 rounded-md transition ${
                                  isLoanUploading 
                                    ? "bg-muted text-muted-foreground cursor-not-allowed" 
                                    : "bg-emerald-600 hover:bg-primary text-white cursor-pointer shadow-xs"
                                }`}
                              >
                                {isLoanUploading ? t("ஆவணங்கள் பதிவேற்றப்படுகின்றன...", "Uploading verified files...") : t("கடன் விண்ணப்பத்தை சமர்ப்பி", "Submit Loan Application")}
                              </button>
                            </div>
                          )}

                          {/* Step 3: Success Screen */}
                          {loanFormStep === 3 && (
                            <div className="text-center py-6 space-y-4 animate-fade-in font-sans text-xs">
                              <div className="w-14 h-14 rounded-full bg-primary/10 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                                <CheckCircle2 className="w-8 h-8 animate-pulse" />
                              </div>
                              <div>
                                <h4 className="font-display font-black text-sm text-slate-805 uppercase tracking-wide">
                                  {t("விண்ணப்பம் வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது!", "Application Submitted Successfully!")}
                                </h4>
                                <p className="text-[10px] text-muted-foreground font-tamil mt-1">
                                  {t("விண்ணப்பங்கள் 3 முதல் 5 வேலை நாட்களுக்குள் சரிபார்க்கப்படும்.", "All applications will be verified by the TNVS executive board within 3-5 business days.")}
                                </p>
                              </div>

                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={() => setLoanPortalTab("track")}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2 px-4 rounded-sm cursor-pointer shadow-xs border-none"
                                >
                                  {t("விண்ணப்பங்களை டிராக் செய்க", "Track Application Status")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLoanSchemeType(null);
                                    setLoanFormStep(1);
                                  }}
                                  className="bg-muted hover:bg-muted text-foreground text-xs font-bold py-2 px-4 rounded-sm cursor-pointer border border-border"
                                >
                                  {t("புதிய விண்ணப்பம்", "Apply Again")}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 2: TRACK APPLICATIONS */}
                      {loanPortalTab === "track" && (
                        <div className="space-y-4 pt-4 animate-fade-in font-sans text-xs">
                          {loanClaims.length > 0 ? (
                            <div className="space-y-4">
                              {loanClaims.map((claim) => (
                                <div key={claim.id} className="border border-border rounded-md bg-card p-4 shadow-xs space-y-4">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="text-left space-y-0.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-black text-foreground">{claim.title}</span>
                                        <span className="text-[9px] bg-muted text-muted-foreground font-mono px-1.5 rounded font-bold">{claim.id}</span>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground font-tamil leading-relaxed">{claim.description}</p>
                                    </div>
                                    <StatusPill 
                                      status={
                                        claim.status === "approved" || claim.status === "disbursed"
                                          ? "success"
                                          : claim.status === "rejected"
                                          ? "error"
                                          : "pending"
                                      } 
                                    />
                                  </div>

                                  {/* Multi-step progress tracker */}
                                  <div className="bg-muted rounded-md p-3.5 border border-border/70 space-y-4">
                                    {/* STAGE 1: SUBMITTED */}
                                    <div className="flex gap-2.5 items-start">
                                      <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                          claim.step >= 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                          1
                                        </div>
                                        <div className={`w-[1.5px] h-4 ${claim.step >= 2 ? "bg-emerald-600" : "bg-muted"}`} />
                                      </div>
                                      <div className="text-xxs text-left -mt-0.5">
                                        <p className={`font-bold ${claim.step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                                          Application Digitally Received
                                        </p>
                                        <p className="text-muted-foreground">
                                          {claim.step >= 1 ? `Submitted on ${claim.date} with linked digital ID.` : "Awaiting submission."}
                                        </p>
                                      </div>
                                    </div>

                                    {/* STAGE 2: DOCUMENT VERIFICATION */}
                                    <div className="flex gap-2.5 items-start">
                                      <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                          claim.step >= 2 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                          2
                                        </div>
                                        <div className={`w-[1.5px] h-4 ${claim.step >= 3 ? "bg-emerald-600" : "bg-muted"}`} />
                                      </div>
                                      <div className="text-xxs text-left -mt-0.5">
                                        <p className={`font-bold ${claim.step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                                          Document Verification
                                        </p>
                                        <p className="text-muted-foreground">
                                          {claim.step >= 2 
                                            ? `Verified documents: ${claim.docs.join(", ")}` 
                                            : "Awaiting automatic verified upload."}
                                        </p>
                                      </div>
                                    </div>

                                    {/* STAGE 3: EXECUTIVE BOARD APPROVAL */}
                                    <div className="flex gap-2.5 items-start">
                                      <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                          claim.step >= 3 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                          3
                                        </div>
                                        <div className={`w-[1.5px] h-4 ${claim.step >= 4 ? "bg-emerald-600" : "bg-muted"}`} />
                                      </div>
                                      <div className="text-xxs text-left -mt-0.5">
                                        <p className={`font-bold ${claim.step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                                          TNVS Board Executive Review
                                          {claim.step === 3 && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary inline-block animate-ping" />}
                                        </p>
                                        <p className="text-slate-405">
                                          {claim.step >= 3 
                                            ? "Approved by state executive committee. Allocation queued." 
                                            : "Awaiting board verification approval."}
                                        </p>
                                      </div>
                                    </div>

                                    {/* STAGE 4: DISBURSEMENT / ENROLLMENT ACTIVE */}
                                    <div className="flex gap-2.5 items-start">
                                      <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                          claim.step >= 4 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                          4
                                        </div>
                                      </div>
                                      <div className="text-xxs text-left -mt-0.5">
                                        <p className={`font-bold ${claim.step >= 4 ? "text-foreground" : "text-muted-foreground"}`}>
                                          {t("கடன் நிதி வழங்கப்பட்டது", "Credit Disbursed")}
                                        </p>
                                        <p className="text-muted-foreground">
                                          {claim.step >= 4 
                                            ? t("கடன் நிதி முதன்மை வங்கிக் கணக்கிற்கு மாற்றப்பட்டது.", "Credit funds transferred to primary bank account.")
                                            : t("நிதி பரிமாற்றத்திற்காக காத்திருக்கிறது.", "Awaiting final credit transfer.")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <EmptyState 
                              icon={Coins}
                              title={t("சமர்ப்பிக்கப்பட்ட விண்ணப்பங்கள் இல்லை", "No Active Applications")} 
                              subtitle={t("கடன் பெற தகுதியான திட்டங்களுக்கு மேல் உள்ள பிரிவில் விண்ணப்பிக்கவும்.", "Apply for eligible credit aid above.")} 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Active banner + subvented loan categories stacked nicely */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Loan Credit Line Active Banner */}
                    <div className="bg-primary text-white rounded-md p-6 border border-primary/20 relative overflow-hidden shadow-xs">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 rounded-full translate-x-1/3 -translate-y-1/3" aria-hidden="true" />
                      <div className="relative flex items-start gap-4">
                        <ShieldCheck className="w-6 h-6 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="space-y-1">
                          <h3 className="font-display font-bold text-base text-slate-50 leading-tight">
                            {t("முன் அங்கீகரிக்கப்பட்ட கடன் வரம்பு செயலில் உள்ளது", "Loan Credit Line Active")}
                          </h3>
                          <p className="text-xs text-primary-foreground/80 leading-relaxed font-tamil">
                            {t(
                              "உங்கள் தகுதியின் அடிப்படையில், ₹5,00,000 வரை முன் அங்கீகரிக்கப்பட்ட வணிகக் கடன் வரம்பு ஏப்ரல் 2027 வரை உடனடியாகப் பெற தயாராக உள்ளது.",
                              "Based on your member profile, you have a pre-approved credit line of up to ₹5,00,000 active until April 2027. Deploy instantly."
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Available Loan Categories Directory */}
                    <div className="bg-card rounded-md border border-border p-6 shadow-xs space-y-4">
                      <div className="pb-2.5 border-b border-border">
                        <h4 className="font-display font-bold text-slate-805 text-sm tracking-wide">SUBVENTED LOAN DIRECTORY</h4>
                        <p className="text-[10px] text-muted-foreground font-tamil mt-0.5">உங்கள் வணிக வளர்ச்சிக்கு தகுதியான கடன்கள்</p>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          { id: "business", icon: Coins, title: t("வட்டியில்லா வணிகக் கடன்", "Interest-Free Business Loan"), desc: t("இறக்குமதி ஏற்றுமதி வணிகங்களுக்கு ₹25 லட்சம் வரை வட்டி இல்லா கடன்.", "Up to ₹25 lakh interest-free loan for Pvt Ltd, partnerships, import/export, and freelancers."), spec: "0% Interest" },
                          { id: "retail", icon: Store, title: t("சில்லறை வணிகர்கள் கடன்", "Retail Trader Loan"), desc: t("பதிவுசெய்யப்பட்ட சில்லறை வணிகர்களுக்கு குறைந்தபட்ச ஆவணங்களுடன் விரைவான கடன் அனுமதி.", "Fast loan approval for registered retail traders with minimal documentation."), spec: "Subsidized" },
                          { id: "young", icon: Rocket, title: t("இளைய தொழில்முனைவோர் கடன்", "Young Entrepreneur Loan"), desc: t("40 வயதுக்குட்பட்ட இளைய தொழில்முனைவோருக்கு சிறப்பு மானியத்துடன் கூடிய நிதி உதவி திட்டம்.", "Special subsidised loan scheme for entrepreneurs under 40 years."), spec: "Special Subsidy" }
                        ].map((loan) => {
                          const Icon = loan.icon;
                          return (
                            <div
                              key={loan.id}
                              onClick={() => openDashboardLoanModal(loan.id as any)}
                              className="p-4 rounded-md border border-border hover:border-primary/30 bg-muted/20 hover:bg-card transition duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group shadow-xs hover:shadow-xs"
                            >
                              <div>
                                <div className="flex justify-between items-center gap-2">
                                  <div className="w-8 h-8 rounded-sm bg-primary/5 text-primary flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-[8px] bg-slate-105 text-slate-655 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    {loan.spec}
                                  </span>
                                </div>
                                <h5 className="text-xs font-bold text-foreground mt-3 group-hover:text-primary transition">{loan.title}</h5>
                                <p className="text-[10px] text-muted-foreground leading-normal font-tamil mt-1">{loan.desc}</p>
                              </div>
                              <span className="text-[9px] font-black text-primary uppercase tracking-wider mt-3 flex items-center gap-0.5">
                                Apply Now →
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: Recruiter Hub & Analytics ─── */}
            {dashboardTab === "recruiter" && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  {/* Left column: Recruiter invite progress & milestones */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Coordinator Widget Card */}
                    <div className="bg-card text-foreground rounded-md p-6 shadow-xs relative overflow-hidden border border-border">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
                      <div className="relative space-y-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Award className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <h3 className="font-display font-bold text-base text-primary">
                              {t("நிர்வாகியாக இணைய", "Become a Coordinator")}
                            </h3>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${isCoordinator ? "bg-emerald-600 text-white" : "bg-amber-600 text-white animate-pulse"}`}>
                            {isCoordinator ? t("ஒருங்கிணைப்பாளர்", "Coordinator") : t("விருப்பம்", "Recruiter Mode")}
                          </span>
                        </div>

                        {!isCoordinator ? (
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground leading-relaxed font-tamil">
                              {t(
                                "தலைமை ஏற்கத் தயாரா? உங்கள் பரிந்துரை லிங்க் மூலம் 25 வணிகர்களை ஒன்றிணைத்து, ஒருங்கிணைப்பாளர் பொறுப்பை பெற்றிடுங்கள்!",
                                "Ready to lead? Connect 25 traders using your unique referral link and earn the Coordinator title!"
                              )}
                            </p>
                            <button
                              onClick={handleOptInCoordinator}
                              className="btn-primary w-full py-2.5 rounded-md text-xs font-bold justify-center cursor-pointer"
                            >
                              <UserPlus className="w-4 h-4" aria-hidden="true" />
                              {language === "ta" ? "ஒருங்கிணைப்பாளராக இணையவும்" : "Activate Recruiter Status"}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <h4 className="font-display font-bold text-sm text-ink flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                {t("தலைமை ஏற்கத் தயாரா?", "Ready to lead?")}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed font-tamil">
                                {t(
                                  "உங்கள் பரிந்துரை லிங்க் மூலம் 25 வணிகர்களை ஒன்றிணைத்து, 'ஒருங்கிணைப்பாளர்' பொறுப்பை பெற்றிடுங்கள்!",
                                  "Bring together 25 traders using your referral link and earn the 'Coordinator' title!"
                                )}
                              </p>
                            </div>

                            {/* Progress */}
                            <div className="bg-muted p-4 rounded-md border border-border space-y-3">
                              <div className="flex justify-between text-sm font-semibold">
                                <span className="text-primary">{mockReferredMembers.length} / 25</span>
                                <span className="text-xs text-muted-foreground font-tamil">
                                  {t(
                                    `${25 - mockReferredMembers.length} மேலும் பரிந்துரைகள் தேவை`,
                                    `${25 - mockReferredMembers.length} more referrals needed`
                                  )}
                                </span>
                              </div>
                              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-linear-to-r from-primary to-primary h-2 rounded-full"
                                  style={{ width: `${(mockReferredMembers.length / 25) * 105}%` }}
                                  role="progressbar"
                                  aria-valuenow={mockReferredMembers.length}
                                  aria-valuemin={0}
                                  aria-valuemax={25}
                                  aria-label={`Referral progress: ${mockReferredMembers.length} of 25`}
                                />
                              </div>
                            </div>

                            {/* Milestones & Badges */}
                            <div className="pt-1.5 text-left">
                              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
                                {t("தனிப்பட்ட மைல்கற்கள்", "Milestone Badges")}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-amber-55 border border-amber-200 rounded-md p-2.5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 rounded-full blur-md" />
                                  <span className="text-lg">🥉</span>
                                  <span className="text-[8px] font-black text-amber-800 tracking-wider uppercase mt-1 font-sans">Bronze Vendor</span>
                                  <span className="text-[8px] text-emerald-605 font-bold mt-0.5">{t("அன்லாக்", "Unlocked")} (5+)</span>
                                </div>
                                <div className="bg-muted border border-border rounded-md p-2.5 flex flex-col items-center justify-center text-center opacity-70">
                                  <span className="text-lg">🥈</span>
                                  <span className="text-[8px] font-black text-muted-foreground tracking-wider uppercase mt-1 font-sans">Silver Organizer</span>
                                  <span className="text-[8px] text-muted-foreground font-bold mt-0.5">LOCKED (15)</span>
                                </div>
                                <div className="bg-muted border border-border rounded-md p-2.5 flex flex-col items-center justify-center text-center opacity-70">
                                  <span className="text-lg">🥇</span>
                                  <span className="text-[8px] font-black text-muted-foreground tracking-wider uppercase mt-1 font-sans">Gold Coordinator</span>
                                  <span className="text-[8px] text-muted-foreground font-bold mt-0.5">LOCKED (25)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Referral Link — uses real origin domain */}
                        <div className="space-y-2 pt-2 text-left">
                          <label
                            htmlFor="referral-link"
                            className="text-xs text-muted-foreground font-bold uppercase tracking-wider block"
                          >
                            {t("பரிந்துரை இணைப்பு", "Referral Link")}
                          </label>
                          <div className="flex gap-2">
                            <input
                              id="referral-link"
                              readOnly
                              type="text"
                              value={referralUrl}
                              className="flex-1 bg-muted border border-border rounded-md px-3.5 py-2 text-base md:text-xs font-mono text-muted-foreground focus:outline-none min-h-[40px]"
                              aria-label="Your referral link — read only"
                            />
                            <button
                              onClick={handleCopyLink}
                              className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-md transition flex items-center justify-center shrink-0 min-w-[40px] min-h-[40px] cursor-pointer"
                              aria-label={t("நகலெடு", "Copy referral link")}
                            >
                              {copiedLink
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                                : <Copy className="w-4 h-4" aria-hidden="true" />
                              }
                            </button>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-tamil">
                            {t("மேலும் உறுப்பினர்களை அழைக்க இந்த இணைப்பைப் பகிரவும்!", "Share this link to invite more members!")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top Recruiters Leaderboard */}
                    <div className="bg-card text-foreground rounded-md p-5 border border-border space-y-4">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-border">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {t("மாநில அளவிலான லீடர்போர்டு", "Top Recruiter Leaderboard")}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 font-sans">
                        {[
                          { name: "Siva Shanmugam", location: "Salem", invites: 24, rank: "1st" },
                          { name: "Muthu Pandian", location: "Madurai", invites: 18, rank: "2nd" },
                          { name: `${currentMember?.name || "Senthil Kumar N"} (You)`, location: currentMember?.district || "Chennai", invites: 5, rank: "3rd" },
                        ].map((item, index) => (
                          <div key={index} className={`flex items-center justify-between text-[11px] p-2.5 rounded-md border ${
                            item.invites === 5 
                              ? "bg-primary/10 border-primary/30 text-ink font-bold" 
                              : "bg-muted border-border text-muted-foreground"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-4 text-center font-bold font-mono text-[10px] ${index === 0 ? "text-amber-600" : index === 1 ? "text-muted-foreground" : "text-amber-700"}`}>
                                {item.rank}
                              </span>
                              <div>
                                <span className="font-semibold text-foreground">{item.name}</span>
                                <span className="text-[9px] text-muted-foreground ml-1 font-bold">({item.location})</span>
                              </div>
                            </div>
                            <span className="font-mono text-primary text-[10px] font-bold">{item.invites} {t("நபர்", "invites")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Referred Database CRM */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-card rounded-md border border-border p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          <h3 className="font-display font-bold text-sm text-slate-805">
                            {t("பரிந்துரைக்கப்பட்ட உறுப்பினர்கள்", "Referred Member CRM")}
                          </h3>
                        </div>
                        <span className="text-[9px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded font-bold uppercase font-mono">
                          {filteredReferredMembers.length} MATCHED
                        </span>
                      </div>

                      {/* CRM Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder={t("பெயர், கடை, மாவட்டம் அல்லது ID மூலம் தேடுக...", "Search by name, shop, district, or ID...")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-muted border border-border rounded-md pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:bg-card focus:border-primary transition"
                        />
                      </div>

                      {/* Status Filter Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "all", label: "All Statuses" },
                          { id: "active", label: "Active" },
                          { id: "pending", label: "Pending" },
                          { id: "expired", label: "Expired" }
                        ].map((pill) => {
                          const active = statusFilter === pill.id;
                          return (
                            <button
                              key={pill.id}
                              type="button"
                              onClick={() => setStatusFilter(pill.id as any)}
                              className={`px-3 py-1 rounded-sm text-[10px] font-bold border transition cursor-pointer ${
                                active 
                                  ? "bg-primary border-primary text-white shadow-xs" 
                                  : "bg-muted border-border text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {pill.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* CRM Results Grid */}
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        <AnimatePresence mode="popLayout">
                          {filteredReferredMembers.length > 0 ? (
                            filteredReferredMembers.map((m) => (
                              <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-background hover:bg-muted border border-border rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                              >
                                <div className="space-y-0.5 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground text-xs">{m.name}</span>
                                    <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.2 rounded font-mono font-bold">{m.id}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-505 font-semibold">
                                    {m.shop} • <span className="text-muted-foreground">{m.district}</span>
                                  </div>
                                  <div className="text-[9px] text-muted-foreground font-mono">
                                    Joined: {m.date}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t border-border sm:border-0 pt-2 sm:pt-0 shrink-0">
                                  <span className="text-[9px] font-bold text-slate-405 font-mono">{m.phone}</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                    m.status === "active"
                                      ? "bg-primary/10 text-emerald-705 border border-emerald-100"
                                      : m.status === "pending"
                                      ? "bg-primary/10 text-amber-705 border border-amber-100"
                                      : "bg-rose-50 text-rose-705 border border-rose-100"
                                  }`}>
                                    {m.status}
                                  </span>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div initial={{ opacity: 0 }} className="py-8 text-center bg-muted/40 rounded-md border border-dashed border-border">
                              <p className="text-xs text-muted-foreground font-tamil">பொருந்தும் பரிந்துரைகள் இல்லை</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">No referred members found matching query.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statewide Association Analytics Panel Gated Section */}
                {isCoordinator && (
                  <AdminAnalyticsPanel t={t} language={language} />
                )}
              </div>
            )}

            {/* ─── TAB 4: Tools & Apps ─── */}
            {dashboardTab === "tools" && (
              <div className="grid lg:grid-cols-12 gap-6 items-start text-left animate-fadeIn">
                {/* Left Column: Digital GST & Finance Hub */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-card rounded-md border border-border p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-primary" />
                        <h3 className="font-display font-bold text-sm text-foreground">
                          {t("டிஜிட்டல் ஜிஎஸ்டி & நிதி மையம்", "Digital GST & Finance Hub")}
                        </h3>
                      </div>
                      <span className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        FREE SERVICE
                      </span>
                    </div>

                    {/* Sub-Tabs Selector */}
                    <div className="flex bg-slate-105 p-1 rounded-md border border-border">
                      <button
                        type="button"
                        onClick={() => setGstActiveTab("calc")}
                        className={`flex-1 py-1.5 rounded-sm font-display text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          gstActiveTab === "calc" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t("கணக்கீடு & காலண்டர்", "Calculator & Dates")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGstActiveTab("query")}
                        className={`flex-1 py-1.5 rounded-sm font-display text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          gstActiveTab === "query" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t("வரி சந்தேகங்கள்", "Ask Auditor")}
                      </button>
                    </div>

                    {/* GST Content: Tab 1 (Calculator & Filing dates) */}
                    {gstActiveTab === "calc" && (
                      <div className="space-y-4 pt-1 animate-fade-in text-left">
                        {/* Micro Filing Calendar */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Filing Deadlines</span>
                          <div className="grid grid-cols-2 gap-2 text-xxs font-mono">
                            <div className="bg-muted border border-border rounded-sm p-2.5 flex flex-col">
                              <span className="text-muted-foreground font-bold">GSTR-1 (Monthly)</span>
                              <span className="text-slate-705 font-black mt-0.5">June 11, 2026</span>
                            </div>
                            <div className="bg-muted border border-border rounded-sm p-2.5 flex flex-col">
                              <span className="text-muted-foreground font-bold">GSTR-3B (Monthly)</span>
                              <span className="text-slate-705 font-black mt-0.5">June 20, 2026</span>
                            </div>
                          </div>
                        </div>

                        {/* GST Calculator */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">GST Quick Calc</span>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="₹ Subtotal"
                              value={calcAmount}
                              onChange={(e) => setCalcAmount(e.target.value)}
                              className="flex-1 bg-card border border-border rounded-sm px-2.5 py-1.5 text-xs text-foreground placeholder-slate-400 focus:outline-none focus:border-primary"
                            />
                            <select
                              value={calcRate}
                              onChange={(e) => setCalcRate(Number(e.target.value))}
                              className="bg-card border border-border rounded-sm px-2 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
                            >
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </select>
                          </div>

                          <div className="bg-primary/5 border border-primary/10 rounded-md p-3.5 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                            <div>
                              <span className="text-muted-foreground">CGST</span>
                              <span className="block text-slate-705 font-black mt-0.5">₹{cgstAmount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">SGST</span>
                              <span className="block text-slate-705 font-black mt-0.5">₹{sgstAmount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">TOTAL</span>
                              <span className="block text-ink font-extrabold mt-0.5">₹{totalCalculated}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GST Content: Tab 2 (Ask Auditor query submission form) */}
                    {gstActiveTab === "query" && (
                      <div className="space-y-3 pt-1 animate-fade-in text-left">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Raise Tax Doubt</div>
                        <div className="space-y-2">
                          <textarea
                            placeholder={t("வரி தொடர்பான சந்தேகங்களை இங்கு டைப் செய்யவும்...", "Type your GST or tax doubts here...")}
                            rows={3}
                            value={gstQueryText}
                            onChange={(e) => setGstQueryText(e.target.value)}
                            className="w-full bg-card border border-border rounded-sm p-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!gstQueryText.trim()) return;
                              toast.success(
                                language === "ta"
                                  ? "வரி சந்தேகம் சமர்ப்பிக்கப்பட்டது! வினவல் குறிப்பு எண்: #TNVS-GST-332 🚀"
                                  : "Query submitted successfully! Ref ID: #TNVS-GST-332 🚀"
                              );
                              setGstQueryText("");
                            }}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-sm text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px] border-none shadow-xs"
                          >
                            <Sparkles className="w-4 h-4 text-gold animate-spin" />
                            <span>{t("கேள்வி சமர்ப்பி", "Submit Query")}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Google Play Store App Download Promotion */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-card rounded-md border border-border p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                      <div className="w-8 h-8 rounded-md bg-primary/5 text-primary flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-bold text-sm text-foreground">
                        {t("அதிகாரப்பூர்வ மொபைல் ஆப்", "Download Vanigan AI App")}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-tamil">
                      {t(
                        "எங்கள் அதிகாரப்பூர்வ மொபைல் ஆப் மூலம் உங்கள் கடை விவரங்களை நிர்வகிக்கலாம், உடனடி ஜிஎஸ்டி விழிப்பூட்டல்களைப் பெறலாம் மற்றும் பிற வணிகர்களுடன் இணைந்திருக்கலாம்.",
                        "Access the complete GST desk, chat with auditor support, track your local loan benefits, and verify referrals instantly with the Vanigan AI android app."
                      )}
                    </p>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.thirumoolar.vanigan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white text-white border-none" aria-hidden="true" />
                      <span>{t("Play Store இல் பதிவிறக்கம்", "Download on Google Play")}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* SEAMLESS CONVERSATIONAL LOAN MODAL */}
      <AnimatePresence>
        {isLoanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto bg-black/40 backdrop-blur-xs">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoanModalOpen(false)}
              className="fixed inset-0"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-card rounded-md border border-border shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-navy to-slate-950 px-5 py-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-gold animate-bounce" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-gold leading-none">
                      {loanModalSubject}
                    </h3>
                    <p className="text-[10px] text-blue-300 font-tamil mt-1">
                      {t("உறுப்பினர் எளிய கடன் போர்டல்", "Subsidized Fast-Track Scheme")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLoanModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 text-white flex items-center justify-center transition cursor-pointer animate-none border-none outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body & Multi-Step Wizard */}
              <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto bg-background">
                {/* Chat Bot Intro */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    AI
                  </div>
                  <div className="bg-card border border-border p-3 rounded-md rounded-tl-none shadow-xs text-xs text-foreground leading-relaxed font-tamil">
                    {t(
                      "வணக்கம்! நான் உங்கள் கடன் உதவியாளர். உங்களது கடன் விண்ணப்பத்தை எளிய 3 படிகளில் சமர்ப்பிக்கலாம். உங்கள் உறுப்பினர் விவரங்கள் ஏற்கனவே சரிபார்க்கப்பட்டன.",
                      "Hello! I am your loan assistant. You can submit your application in 3 simple steps. Your verified member profile is linked."
                    )}
                  </div>
                </div>

                {/* Step 1: Request Amount Input */}
                {loanChatStep >= 1 && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-105 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        AI
                      </div>
                      <div className="bg-card border border-border p-3 rounded-md rounded-tl-none shadow-xs text-xs text-foreground font-tamil">
                        {t("உங்களுக்கு தேவையான கடன் தொகையைத் தேர்ந்தெடுக்கவும் அல்லது உள்ளிடவும்:", "Please choose or enter your desired loan amount:")}
                      </div>
                    </div>

                    <div className="pl-10 grid grid-cols-3 gap-2">
                      {["₹2,00,000", "₹5,00,000", "₹10,00,000"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setLoanInputs({ ...loanInputs, amount: amt });
                            setLoanChatStep(2);
                          }}
                          className={`py-2 px-1 text-center rounded-sm border text-xs font-bold transition cursor-pointer ${
                            loanInputs.amount === amt
                              ? "bg-primary border-primary text-white"
                              : "bg-card border-border hover:bg-muted text-foreground"
                          }`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>

                    <div className="pl-10 flex gap-2">
                      <input
                        type="text"
                        placeholder={t("விருப்பத் தொகை (எ.கா. ₹15,00,000)", "Custom amount (e.g. ₹15,00,000)")}
                        value={loanInputs.amount}
                        onChange={(e) => setLoanInputs({ ...loanInputs, amount: e.target.value })}
                        className="flex-1 bg-card border border-border rounded-sm px-3 py-1.5 text-base md:text-xs text-foreground placeholder-slate-400 focus:outline-none focus:border-primary"
                      />
                      {loanInputs.amount.trim() !== "" && loanChatStep === 1 && (
                        <button
                          type="button"
                          onClick={() => setLoanChatStep(2)}
                          className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-sm text-xs font-bold transition cursor-pointer"
                        >
                          {t("அடுத்து", "Next")}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Confirmation / Verification */}
                {loanChatStep >= 2 && (
                  <div className="space-y-3 animate-fade-in">
                    {/* User Amount Bubble */}
                    <div className="flex justify-end gap-2.5">
                      <div className="bg-primary text-white p-3 rounded-md rounded-tr-none shadow-xs text-xs font-semibold">
                        {loanInputs.amount}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-105 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        AI
                      </div>
                      <div className="bg-card border border-border p-3 rounded-md rounded-tl-none shadow-xs text-xs text-foreground font-tamil leading-relaxed">
                        {t(
                          `அருமை! உங்களது பதிவு செய்யப்பட்ட பெயர்: ${currentMember?.name || "செந்தில் குமார் N"} மற்றும் கைபேசி எண்: ${currentMember?.mobile || "+91 944 20 •• 44"}. இந்த விவரங்களுடன் கடன் கோரிக்கையைச் சமர்ப்பிக்கலாமா?`,
                          `Excellent! Your registered name is ${currentMember?.name || "Senthil Kumar N"} and mobile: ${currentMember?.mobile || "+91 944 20 •• 44"}. Shall we submit the request with these details?`
                        )}
                      </div>
                    </div>

                    <div className="pl-10 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoanChatStep(3);
                          toast.success(
                            language === "ta"
                              ? "கடன் விண்ணப்பம் வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது! 🚀"
                              : "Loan request submitted successfully! 🚀"
                          );
                        }}
                        className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-sm text-xs font-bold transition cursor-pointer flex-1"
                      >
                        {t("ஆம், சமர்ப்பி", "Yes, Submit Request")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoanModalOpen(false);
                          toast.info(t("விண்ணப்பம் ரத்து செய்யப்பட்டது", "Application canceled"));
                        }}
                        className="bg-muted hover:bg-slate-300 text-slate-705 py-2 px-3 rounded-sm text-xs font-bold transition cursor-pointer"
                      >
                        {t("ரத்து", "Cancel")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success Screen */}
                {loanChatStep === 3 && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-105 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        AI
                      </div>
                      <div className="bg-primary/10 border border-emerald-200/80 p-4 rounded-md rounded-tl-none shadow-xs text-xs text-emerald-800 font-tamil leading-relaxed space-y-2">
                        <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          {t("விண்ணப்பம் பெறப்பட்டது!", "Request Received!")}
                        </p>
                        <p>
                          {t(
                            "உங்களது குறிப்பு எண்: #L-998083. எங்கள் கடன் அதிகாரி 24 மணி நேரத்திற்குள் உங்களைத் தொடர்புகொள்கிறோம். நன்றி!",
                            "Your reference number is #L-998083. Our loan officer will contact you within 24 hours. Thank you!"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="pl-10">
                      <button
                        type="button"
                        onClick={() => setIsLoanModalOpen(false)}
                        className="w-full bg-muted hover:bg-muted/80 text-ink py-2 rounded-sm text-xs font-bold border border-border transition cursor-pointer flex items-center justify-center min-h-[36px]"
                      >
                        {t("மூடு", "Close")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}        {/* HIGH-FIDELITY LIVE STREAM BROADCAST MODAL */}
        {isLiveStreamOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLiveStreamOpen(false)}
              className="fixed inset-0"
            />

            {/* Live Frame Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-4xl bg-card border border-border rounded-md overflow-hidden shadow-2xl z-10 flex flex-col md:grid md:grid-cols-12 min-h-[460px] md:h-[480px]"
            >
              {/* Left 8 Columns - Video Stream Canvas */}
              <div className="md:col-span-8 bg-black relative flex flex-col justify-between p-4 h-[280px] md:h-full">
                {/* Overlay header specs */}
                <div className="flex justify-between items-center z-10 w-full">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-card animate-ping" />
                      LIVE
                    </span>
                    <span className="bg-primary/10 text-white/90 text-[9px] font-mono px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 font-semibold">
                      <Users className="w-3 h-3 text-red-400" />
                      482 watching
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLiveStreamOpen(false)}
                    className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 text-white flex items-center justify-center transition cursor-pointer md:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated Visual Broadcast Waves & Graphics */}
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.25)_0%,rgba(0,0,0,1)_80%)] overflow-hidden pointer-events-none">
                  {/* Wave graphics */}
                  <div className="absolute w-[240px] h-[240px] rounded-full border border-primary/20 animate-ping opacity-60" style={{ animationDuration: "3s" }} />
                  <div className="absolute w-[360px] h-[360px] rounded-full border border-sky-500/10 animate-ping opacity-40" style={{ animationDuration: "5s" }} />
                  
                  <div className="text-center space-y-3 z-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold animate-pulse mx-auto">
                      TNVS
                    </div>
                    <div className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Simulated Video Feed Active</div>
                    <div className="text-xs text-muted-foreground font- तमिल max-w-sm px-4">
                      {t("ஜிஎஸ்டி மற்றும் வணிகர் ஆலோசனை நேரலை ஒளிபரப்பு சென்னை அலுவலகத்திலிருந்து.", "GST & Trader Advisory live webinar feed broadcasted from Mylapore Office.")}
                    </div>
                  </div>
                </div>

                {/* Stream Footer Control Bar */}
                <div className="z-10 w-full flex items-center justify-between pt-4 border-t border-white/5 bg-linear-to-t from-black/60 to-transparent p-2 rounded-md">
                  <div className="text-[10px] text-white/70 font-semibold font-mono tracking-wide">
                    1080p Stream • Low Latency Mode
                  </div>
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-green-400 font-black uppercase tracking-wider font-sans">Server Connected</span>
                  </div>
                </div>
              </div>

              {/* Right 4 Columns - Scrolling Chat Panel */}
              <div className="md:col-span-4 bg-muted border-t md:border-t-0 md:border-l border-border flex flex-col justify-between h-[200px] md:h-full">
                {/* Chat Header */}
                <div className="px-4 py-3 bg-card border-b border-border flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-black uppercase text-foreground tracking-wider font-sans">Live Chat Feed</span>
                  </div>
                  <button
                    onClick={() => setIsLiveStreamOpen(false)}
                    className="hidden md:flex w-6 h-6 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-ink items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comments Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col justify-end min-h-0 select-none">
                  {streamComments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-0.5 text-left bg-card p-2 rounded-md border border-border">
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className="text-primary font-sans">{comment.user}</span>
                        <span className="text-muted-foreground uppercase tracking-widest">{comment.location}</span>
                      </div>
                      <p className="text-muted-foreground font-tamil leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input Placeholder */}
                <div className="p-3.5 bg-card border-t border-border shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled
                      placeholder={t("கமெண்ட் செய்ய உள்நுழையவும்...", "Signing in to chat...")}
                      className="flex-1 bg-muted border border-border rounded-sm px-3 py-1.5 text-[10px] text-muted-foreground focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


function AdminAnalyticsPanel({ t, language }: { t: any; language: string }) {
  const [activeTab, setActiveTab] = useState<"overview" | "regional" | "loan">("overview");
  
  // Sort State for Districts Leaderboard
  const [sortField, setSortField] = useState<"count" | "claims">("count");
  const [sortAsc, setSortAsc] = useState(false);

  // Line Chart Interactive Tooltip State
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sorting Handler
  const sortedDistricts = useMemo(() => {
    return [...districtStats].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [sortField, sortAsc]);

  const toggleSort = (field: "count" | "claims") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // SVG Chart Configs
  const chartHeight = 220;
  const chartWidth = 720;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  const points = useMemo(() => {
    const xRange = chartWidth - padding.left - padding.right;
    const yRange = chartHeight - padding.top - padding.bottom;
    const maxVal = 135000;
    const minVal = 70000;

    return growthData.map((d, index) => {
      const x = padding.left + (index / (growthData.length - 1)) * xRange;
      const y = chartHeight - padding.bottom - ((d.members - minVal) / (maxVal - minVal)) * yRange;
      return { x, y, data: d };
    });
  }, [chartWidth, chartHeight]);

  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const bottomY = chartHeight - padding.bottom;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [points, linePath]);

  return (
    <div className="mt-10 pt-10 border-t border-border animate-fade-in max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1 bg-primary/100/10 text-amber-600 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-[4px]">
            {t("சங்கப் புள்ளிவிவரங்கள்", "ASSOCIATION ANALYTICS")}
          </div>
          <h2 className="mt-2 font-display text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
            {t("மாநில சங்க பகுப்பாய்வு", "Statewide Association Analytics")}
          </h2>
          <p className="text-xs text-muted-foreground font-tamil mt-1 leading-relaxed">
            {t("அசோசியேஷன் வளர்ச்சி, வட்டார முன்னிலை மற்றும் கடனுதவி ஒதுக்கீட்டு விவரங்கள்.", "Comprehensive administrative oversight of member growth, district rankings, and loan portfolio breakdown.")}
          </p>
        </div>

        {/* Sub-Header Tab Switcher */}
        <div className="flex bg-slate-105 p-1 rounded-md border border-border self-start sm:self-center">
          {[
            { id: "overview", ta: "வளர்ச்சி", en: "Overview" },
            { id: "regional", ta: "வட்டாரம்", en: "Regional Layout" },
            { id: "loan", ta: "நிதியுதவி", en: "Loans & Credit" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-sm font-display text-xs font-bold transition-all cursor-pointer ${
                  active ? "bg-card text-primary shadow-xs font-extrabold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "ta" ? tab.ta : tab.en}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div
            key="overview-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="card-base p-5 bg-linear-to-br from-white to-blue-50/10 border border-border shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-sans">
                      {t("மொத்த உறுப்பினர்கள்", "ACTIVE MEMBERS")}
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1.5 tabular-nums">
                      1,24,560
                    </div>
                  </div>
                  <div className="p-1.5 bg-primary/10 text-primary rounded-sm"><Users className="w-4 h-4" /></div>
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 mt-2 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+12.4% {t("இந்த மாதம்", "this month")}</span>
                </div>
              </div>
              {/* Card 2 */}
              <div className="card-base p-5 bg-linear-to-br from-white to-emerald-50/10 border border-border shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-sans">
                      {t("வழங்கப்பட்ட மொத்த கடன்கள்", "TOTAL LOANS DISBURSED")}
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1.5 tabular-nums">
                      ₹12.50 Cr
                    </div>
                  </div>
                  <div className="p-1.5 bg-primary/100/10 text-emerald-600 rounded-sm"><Coins className="w-4 h-4" /></div>
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 mt-2 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>94.8% {t("ஒப்புதல் விகிதம்", "disbursement rate")}</span>
                </div>
              </div>
              {/* Card 3 */}
              <div className="card-base p-5 bg-linear-to-br from-white to-amber-50/10 border border-border shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-sans">
                      {t("ஒப்புதல் பெற்ற விண்ணப்பங்கள்", "APPLICATIONS APPROVED")}
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1.5 tabular-nums">
                      428+
                    </div>
                  </div>
                  <div className="p-1.5 bg-primary/100/10 text-amber-600 rounded-sm"><CheckCircle2 className="w-4 h-4" /></div>
                </div>
                <div className="text-[10px] font-semibold text-primary mt-2 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{t("வணிகர்கள் பயனடைந்தனர்", "traders assisted")}</span>
                </div>
              </div>
              {/* Card 4 */}
              <div className="card-base p-5 bg-linear-to-br from-white to-indigo-50/10 border border-border shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-sans">
                      {t("மாநில மாவட்டங்கள்", "DISTRICT FOOTPRINT")}
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1.5 tabular-nums">
                      38 / 38
                    </div>
                  </div>
                  <div className="p-1.5 bg-primary/100/10 text-indigo-600 rounded-sm"><Globe className="w-4 h-4" /></div>
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground mt-2 flex items-center gap-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>100% {t("மாநிலப் பரப்பளவு", "statewide")}</span>
                </div>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="card-base p-5 bg-card border border-border shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
                  {t("உறுப்பினர் சேர்க்கை வளர்ச்சி", "Membership Growth Over Time")}
                </h3>
              </div>

              <div className="relative pt-2 pb-1 bg-linear-to-b from-slate-50/50 to-white rounded-md border border-border overflow-x-auto select-none">
                <svg 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  className="min-w-[640px] w-full h-[180px]"
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoveredIndex(null);
                  }}
                >
                  <defs>
                    <linearGradient id="chartGradientDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[80000, 100000, 120000].map((gridVal, i) => {
                    const yRange = chartHeight - padding.top - padding.bottom;
                    const y = chartHeight - padding.bottom - ((gridVal - 70000) / (135000 - 70000)) * yRange;
                    return (
                      <g key={i}>
                        <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                        <text x={padding.left - 10} y={y + 3} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono">{`${gridVal / 1000}k`}</text>
                      </g>
                    );
                  })}

                  <path d={areaPath} fill="url(#chartGradientDashboard)" />
                  <path d={linePath} fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />

                  {points.map((p, index) => (
                    <g key={index}>
                      <text x={p.x} y={chartHeight - padding.bottom + 15} fill={hoveredIndex === index ? "#1e3a8a" : "#94a3b8"} fontSize="8" fontWeight="bold" textAnchor="middle" className="font-sans">
                        {language === "ta" ? p.data.labelTa : p.data.month}
                      </text>
                      {hoveredIndex === index && <circle cx={p.x} cy={p.y} r="5" fill="#1e3a8a" stroke="#ffffff" strokeWidth="1.5" />}
                      <rect
                        x={p.x - 18}
                        y={padding.top}
                        width="36"
                        height={chartHeight - padding.top - padding.bottom}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => {
                          setHoveredPoint(p.data);
                          setHoveredIndex(index);
                        }}
                      />
                    </g>
                  ))}
                </svg>

                {/* Floating Tooltip */}
                <AnimatePresence>
                  {hoveredPoint && hoveredIndex !== null && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className="absolute bg-card text-foreground rounded-sm p-2.5 shadow-sm border border-border pointer-events-none text-xs space-y-0.5"
                      style={{
                        left: `${Math.min(Math.max((hoveredIndex / (growthData.length - 1)) * 82 + 6, 10), 80)}%`,
                        top: "16px"
                      }}
                    >
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "ta" ? hoveredPoint.labelTa : hoveredPoint.month}
                      </div>
                      <div className="font-mono text-xs font-black text-primary">
                        {hoveredPoint.members.toLocaleString()} {language === "ta" ? "வணிகர்கள்" : "Traders"}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: REGIONAL */}
        {activeTab === "regional" && (
          <motion.div
            key="regional-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-12 gap-5 animate-fade-in"
          >
            {/* Districts Leaderboard */}
            <div className="lg:col-span-7 card-base p-5 bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display font-bold text-sm text-foreground">
                  {t("மாவட்ட முன்னிலை அட்டவணை", "Active Districts Leaderboard")}
                </h3>
                <div className="flex gap-1.5 text-[9px] font-bold uppercase">
                  <button 
                    onClick={() => toggleSort("count")}
                    className={`px-2 py-1 border rounded-md flex items-center gap-0.5 transition cursor-pointer ${sortField === "count" ? "bg-primary border-primary text-white" : "bg-card border-border hover:bg-muted text-muted-foreground"}`}
                  >
                    <span>{t("உறுப்பினர்கள்", "Traders")}</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                  <button 
                    onClick={() => toggleSort("claims")}
                    className={`px-2 py-1 border rounded-md flex items-center gap-0.5 transition cursor-pointer ${sortField === "claims" ? "bg-primary border-primary text-white" : "bg-card border-border hover:bg-muted text-muted-foreground"}`}
                  >
                    <span>{t("கோரிக்கைகள்", "Claims")}</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-sm border border-border max-h-[280px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-muted border-b border-border z-10">
                    <tr>
                      <th className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase">{t("மாவட்டம்", "District")}</th>
                      <th className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase text-right">{t("உறுப்பினர்கள்", "Traders")}</th>
                      <th className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase text-right">{t("கோரிக்கைகள்", "Claims")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDistricts.map((dist, idx) => (
                      <tr key={dist.nameEn} className="border-b border-border hover:bg-background transition text-foreground">
                        <td className="px-3 py-2.5 text-xs font-bold text-foreground">
                          <span className="text-[10px] text-muted-foreground font-mono mr-1">{idx + 1}.</span>
                          {language === "ta" ? dist.nameTa : dist.nameEn}
                        </td>
                        <td className="px-3 py-2.5 text-xs font-bold font-mono text-foreground text-right tabular-nums">{dist.count.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-xs font-bold font-mono text-right text-indigo-600 tabular-nums">
                          {dist.claims} <span className="text-[9px] font-normal text-muted-foreground">({dist.ratio})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Wings Distribution */}
            <div className="lg:col-span-5 card-base p-5 bg-card border border-border shadow-xs space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-primary animate-pulse" />
                  {t("துறை வாரியான பகிர்வு", "Wings Distribution")}
                </h3>
              </div>

              <div className="space-y-3.5 pt-1">
                {wingMetrics.map((wing) => (
                  <div key={wing.id} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-muted-foreground text-xxs">
                        {language === "ta" ? wing.nameTa : wing.nameEn}
                      </span>
                      <div className="flex gap-1.5 items-center font-mono text-xxs">
                        <span className="font-bold text-foreground">{wing.count.toLocaleString()}</span>
                        <span className="text-[9px] text-muted-foreground bg-muted px-1 rounded font-semibold">{wing.percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${wing.percentage}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${wing.colorClass}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: LOAN & CREDIT */}
        {activeTab === "loan" && (
          <motion.div
            key="loan-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-12 gap-5 animate-fade-in"
          >
            {/* Donut Chart */}
            <div className="lg:col-span-5 card-base p-5 bg-card border border-border shadow-xs space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-primary animate-pulse" />
                  {t("கடன் விநியோகப் பகிர்வு", "Loan Portfolio Distribution")}
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    {loanDistribution.map((seg, idx) => (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="10"
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        strokeLinecap="round"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-black text-muted-foreground font-sans tracking-wide">TOTAL</span>
                    <span className="text-xs font-black text-foreground font-mono">₹12.50 Cr</span>
                  </div>
                </div>

                <div className="w-full space-y-1.5 text-xxs">
                  {loanDistribution.map((seg, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-muted border border-border/50 px-2 py-1.5 rounded-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="font-bold text-muted-foreground">
                          {language === "ta" ? seg.nameTa : seg.nameEn}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-foreground">
                        {seg.amount} <span className="text-[8px] text-muted-foreground font-normal">({seg.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Credit Info */}
            <div className="lg:col-span-7 card-base p-5 bg-card border border-border shadow-xs space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  {t("வட்டியற்ற கடனுதவி", "0% Interest Credit Scheme")}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-muted border border-border p-3 rounded-sm space-y-0.5">
                  <div className="text-[8px] font-black uppercase text-muted-foreground tracking-wide">ASSISTANCE CAP</div>
                  <div className="text-base font-black text-foreground">₹25,00,000</div>
                </div>
                <div className="bg-muted border border-border p-3 rounded-sm space-y-0.5">
                  <div className="text-[8px] font-black uppercase text-muted-foreground tracking-wide">REQUEST TIME</div>
                  <div className="text-base font-black text-foreground">48-72 Hours</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-display font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  {t("கடன் விநியோகப் பிரிவு", "Capital Distribution")}
                </h4>
                
                {[
                  { label: "Proprietorship & Retail", percentage: 55, amount: "₹6.87 Cr", color: "bg-primary/100" },
                  { label: "Partnership & Pvt Ltd", percentage: 30, amount: "₹3.75 Cr", color: "bg-blue-500" },
                  { label: "Freelancers & Home-based", percentage: 15, amount: "₹1.88 Cr", color: "bg-purple-500" },
                ].map((sec) => (
                  <div key={sec.label} className="space-y-1">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-muted-foreground font-display">{sec.label}</span>
                      <span className="font-mono text-foreground">{sec.amount} ({sec.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-150 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sec.percentage}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${sec.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/60 p-3 rounded-md border border-border">
      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground font-semibold mt-0.5">{value}</div>
    </div>
  );
}
