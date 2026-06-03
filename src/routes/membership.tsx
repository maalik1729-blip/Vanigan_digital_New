import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Download,
  FileCheck,
  Loader2,
  Upload,
  Camera,
  RefreshCw,
  User,
  Briefcase,
  FolderOpen,
  ClipboardList,
  Star,
  Shield,
  Info,
  Building2,
  Phone,
  Mail,
  MapPin,
  Lock,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import ownerPhoto from "@/assets/349b584e-1b60-469e-9e5d-8d124cb057cb.png";
import orgLogo from "@/assets/ChatGPT Image Mar 25, 2026, 05_31_25 PM (1).png";
import signImg from "@/assets/8bb61dfb-f349-4e0b-8501-560feae9f000.png";
import { FloatingInput, FloatingTextarea, FloatingSelect } from "@/components/FloatingInput";
import { z } from "zod";
import { WINGS } from "@/data/wings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const membershipSearchSchema = z.object({
  wing: z.string().optional(),
  name: z.string().optional(),
  epic: z.string().optional(),
  mobile: z.string().optional(),
  district: z.string().optional(),
  assembly: z.string().optional(),
  address: z.string().optional(),
});

export const Route = createFileRoute("/membership")({
  validateSearch: (search) => membershipSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Apply for Membership · TN Vanigargalin Sangamam" },
      { name: "description", content: "Apply online for Tamil Nadu Vanigargalin Sangamam membership in 5 minutes." },
    ],
  }),
  component: Membership,
});

const STEPS = [
  {
    n: 1,
    t: "Personal & Contact Details",
    ta: "தனிநபர் & தொடர்பு விவரங்கள்",
    icon: User,
    desc: "Your name, mobile number, email, and district",
    descTa: "உங்கள் பெயர், கைபேசி, மின்னஞ்சல் மற்றும் மாவட்டம்",
    tip: "Use your Aadhaar-linked mobile number for easier verification.",
    tipTa: "சரிபார்க்க உங்கள் ஆதார் இணைந்த கைபேசி எண்ணை பயன்படுத்தவும்.",
  },
  {
    n: 2,
    t: "Business Details",
    ta: "வணிக விவரங்கள்",
    icon: Briefcase,
    desc: "Shop name, type, wing, address, and years in business",
    descTa: "கடை பெயர், வகை, பிரிவு, முகவரி மற்றும் வணிக ஆண்டுகள்",
    tip: "Select the wing that best matches your business activity.",
    tipTa: "உங்கள் வணிக நடவடிக்கைக்கு பொருந்தும் பிரிவைத் தேர்ந்தெடுக்கவும்.",
  },
  {
    n: 3,
    t: "Documents & Review",
    ta: "ஆவணங்கள் & சரிபார்",
    icon: FolderOpen,
    desc: "Upload documents, verify details, and set security PIN",
    descTa: "ஆவணங்களைப் பதிவேற்றவும், விவரங்களை சரிபார்க்கவும், பாதுகாப்பு PIN ஐ அமைக்கவும்",
    tip: "All files must be under 5 MB. JPG, PNG and PDF formats are accepted.",
    tipTa: "அனைத்து கோப்புகளும் 5 MB க்கும் குறைவாக இருக்க வேண்டும். JPG, PNG மற்றும் PDF ஏற்றுக்கொள்ளப்படும்.",
  },
  {
    n: 4,
    t: "Success",
    ta: "நிறைவு",
    icon: Star,
    desc: "Download your membership certificate",
    descTa: "உங்கள் உறுப்பினர் சான்றிதழை பதிவிறக்கவும்",
    tip: "",
    tipTa: "",
  },
];

const DISTRICTS = [
  { en: "Ariyalur", ta: "அரியலூர்" },
  { en: "Chengalpattu", ta: "செங்கல்பட்டு" },
  { en: "Chennai", ta: "சென்னை" },
  { en: "Coimbatore", ta: "கோயம்புத்தூர்" },
  { en: "Cuddalore", ta: "கடலூர்" },
  { en: "Dharmapuri", ta: "தர்மபுரி" },
  { en: "Dindigul", ta: "திண்டுக்கல்" },
  { en: "Erode", ta: "ஈரோடு" },
  { en: "Kallakurichi", ta: "கள்ளக்குறிச்சி" },
  { en: "Kanchipuram", ta: "காஞ்சிபுரம்" },
  { en: "Kanyakumari", ta: "கன்னியாகுமரி" },
  { en: "Karur", ta: "கரூர்" },
  { en: "Krishnagiri", ta: "கிருஷ்ணகிரி" },
  { en: "Madurai", ta: "மதுரை" },
  { en: "Mayiladuthurai", ta: "மயிலாடுதுறை" },
  { en: "Nagapattinam", ta: "நாகப்பட்டினம்" },
  { en: "Namakkal", ta: "நாமக்கல்" },
  { en: "Nilgiris", ta: "நீலகிரி" },
  { en: "Perambalur", ta: "பெரம்பலூர்" },
  { en: "Pudukkottai", ta: "புதுக்கோட்டை" },
  { en: "Ramanathapuram", ta: "இராமநாதபுரம்" },
  { en: "Ranipet", ta: "இராணிப்பேட்டை" },
  { en: "Salem", ta: "சேலம்" },
  { en: "Sivaganga", ta: "சிவகங்கை" },
  { en: "Tenkasi", ta: "தென்காசி" },
  { en: "Thanjavur", ta: "தஞ்சாவூர்" },
  { en: "Theni", ta: "தேனி" },
  { en: "Thoothukudi", ta: "தூத்துக்குடி" },
  { en: "Tiruchirappalli", ta: "திருச்சிராப்பள்ளி" },
  { en: "Tirunelveli", ta: "திருநெல்வேலி" },
  { en: "Tirupathur", ta: "திருப்பத்தூர்" },
  { en: "Tiruppur", ta: "திருப்பூர்" },
  { en: "Tiruvallur", ta: "திருவள்ளூர்" },
  { en: "Tiruvannamalai", ta: "திருவண்ணாமலை" },
  { en: "Tiruvarur", ta: "திருவாரூர்" },
  { en: "Vellore", ta: "வேலூர்" },
  { en: "Viluppuram", ta: "விழுப்புரம்" },
  { en: "Virudhunagar", ta: "விருதுநகர்" },
];

const WING_CATEGORIES = [
  {
    id: "professional",
    nameEn: "Professional Services",
    nameTa: "தொழில்முறைப் பிரிவுகள்",
    wings: ["women-entrepreneurs", "chartered-accountants", "doctors", "lawyers", "engineers", "information-technology", "young-entrepreneurs", "media-relations"]
  },
  {
    id: "agricultural",
    nameEn: "Agricultural & Food Industry",
    nameTa: "விவசாயம் மற்றும் உணவுப் பிரிவுகள்",
    wings: ["agriculture", "restaurant-owners", "marine-business", "tribal-entrepreneurs", "distributors"]
  },
  {
    id: "industrial",
    nameEn: "Industrial & Manufacturing Trade",
    nameTa: "தொழில் மற்றும் வர்த்தகப் பிரிவுகள்",
    wings: ["manufacturers", "import-export", "weavers", "printing-press", "computer-mobile", "insurance-finance"]
  },
  {
    id: "public",
    nameEn: "Public & General Services",
    nameTa: "பொது மற்றும் சமூகப் பிரிவுகள்",
    wings: ["labour", "differently-abled", "transgender-entrepreneurs", "pharmacists", "educators", "tourism-transport", "sports-business", "shop-owners", "street-vendors", "hotels-lodgings", "beauty-fitness", "central-govt-relations", "state-govt-relations", "cottage-industry", "digital-advertisers"]
  }
];

function Membership() {
  const { t, language } = useLanguage();
  const search = Route.useSearch();

  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tnvs_form_step");
      const parsed = saved ? parseInt(saved, 10) : 1;
      return parsed >= 5 ? 1 : Math.min(4, Math.max(1, parsed));
    }
    return 1;
  });

  const [form, setForm] = useState(() => {
    const baseForm = {
      name: search.name || "",
      mobile: search.mobile || "",
      email: "",
      district: search.district || "Chennai",
      shop: "",
      type: "Retail",
      address: search.address || "",
      years: "",
      wing: search.wing || "",
    };
    if (search.name || search.epic) return baseForm;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tnvs_form_data");
      if (saved) {
        try { return { ...baseForm, ...JSON.parse(saved) }; }
        catch { return baseForm; }
      }
    }
    return baseForm;
  });

  const [docs, setDocs] = useState<Record<string, File | string | null>>({
    idProof: null,
    shopPhoto: null,
    bizProof: null,
    selfie: null,
  });

  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamCapturing, setWebcamCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pin, setPin] = useState("");

  const epicRef = useRef(search.epic || "TN-VS-" + Math.floor(10000000 + Math.random() * 89999999));
  const epic = epicRef.current;
  const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

  useEffect(() => {
    if (search.name && search.epic) {
      toast.success(
        language === "ta"
          ? "தேர்தல் தரவுத்தளத்திலிருந்து விவரங்கள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன!"
          : "Details imported successfully from Voter Database!"
      );
    }
  }, [search.name, search.epic, language]);

  useEffect(() => { localStorage.setItem("tnvs_form_data", JSON.stringify(form)); }, [form]);
  useEffect(() => {
    if (step < 4) {
      localStorage.setItem("tnvs_form_step", step.toString());
    } else {
      localStorage.removeItem("tnvs_form_step");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const clearDraft = () => {
    if (window.confirm(language === "ta" ? "உங்கள் படிவத் தகவல்களை நீக்க விரும்புகிறீர்களா?" : "Are you sure you want to clear your registration draft?")) {
      localStorage.removeItem("tnvs_form_data");
      localStorage.removeItem("tnvs_form_step");
      setForm({ name: "", mobile: "", email: "", district: "Chennai", shop: "", type: "Retail", address: "", years: "", wing: "" });
      setDocs({ idProof: null, shopPhoto: null, bizProof: null, selfie: null });
      setStep(1);
      toast.success(language === "ta" ? "படிவம் மீட்டமைக்கப்பட்டது" : "Form draft reset successfully");
    }
  };

  const validate = (): boolean => {
    if (step === 1) {
      if (!form.name.trim()) { toast.error(language === "ta" ? "உங்கள் முழுப் பெயரை உள்ளிடவும்" : "Enter your full name"); return false; }
      if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, "").slice(-10))) { toast.error(language === "ta" ? "சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்" : "Enter valid 10-digit mobile"); return false; }
      if (!form.email.includes("@")) { toast.error(language === "ta" ? "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Enter valid email"); return false; }
    }
    if (step === 2) {
      if (!form.shop.trim()) { toast.error(language === "ta" ? "வணிகப் பெயரை உள்ளிடவும்" : "Enter shop/business name"); return false; }
      if (!form.wing) { toast.error(language === "ta" ? "தயவுசெய்து வணிகப் பிரிவைத் தேர்ந்தெடுக்கவும்" : "Please select your business wing"); return false; }
    }
    if (step === 3) {
      const missing = [
        !docs.idProof && (language === "ta" ? "அடையாள ஆவணம்" : "Aadhaar / Voter ID"),
        !docs.shopPhoto && (language === "ta" ? "கடை புகைப்படம்" : "Shop Front Photo"),
        !docs.bizProof && (language === "ta" ? "வணிக சான்று" : "Business Proof"),
        !docs.selfie && (language === "ta" ? "பாஸ்போர்ட் புகைப்படம்" : "Passport Photo"),
      ].filter(Boolean);
      if (missing.length) { toast.error(`${language === "ta" ? "ஆவணங்களைப் பதிவேற்றவும்: " : "Please upload: "}${missing.join(", ")}`); return false; }
      if (pin.length !== 4) {
        toast.error(language === "ta" ? "தயவுசெய்து 4-இலக்க பாதுகாப்பு PIN ஐ உள்ளிடவும்" : "Please create a valid 4-digit security PIN");
        return false;
      }
    }
    return true;
  };

  const next = () => { if (validate()) setStep(s => Math.min(4, s + 1)); };
  const back = () => setStep(s => Math.max(1, s - 1));

  const handlePaySubmit = async () => {
    if (!validate()) return;
    if (pin.length !== 4) {
      toast.error(language === "ta" ? "தயவுசெய்து 4-இலக்க பாதுகாப்பு PIN ஐ உள்ளிடவும்" : "Please create a valid 4-digit security PIN");
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    localStorage.setItem("tnvs_last_epic", epic);
    localStorage.removeItem("tnvs_form_data");
    localStorage.removeItem("tnvs_form_step");
    setStep(4);
  };

  const downloadCertificate = () => {
    const W = 900, H = 700;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      ctx.fillStyle = "#1e3a8a"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff"; ctx.fillRect(16, 16, W - 32, H - 32);
      ctx.fillStyle = "#ebdca5"; ctx.fillRect(16, 16, W - 32, 8);
      ctx.fillStyle = "#1e3a8a"; ctx.textAlign = "center"; ctx.font = "bold 24px Georgia, serif";
      ctx.fillText("TAMILNADU VANIGARGALIN SANGAMAM", W / 2, 60);
      ctx.fillStyle = "#d4b26f"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText("MEMBERSHIP CERTIFICATE", W / 2, 90);
      ctx.fillStyle = "#333"; ctx.font = "italic 16px Georgia, serif";
      ctx.fillText("This is to certify that", W / 2, 140);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 26px Georgia, serif";
      ctx.fillText(form.name.toUpperCase(), W / 2, 185);
      ctx.fillStyle = "#333"; ctx.font = "italic 15px Georgia, serif";
      ctx.fillText("is officially enrolled as an esteemed member of", W / 2, 230);
      ctx.fillText("Tamilnadu Vanigargalin Sangamam.", W / 2, 252);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 290, W - 200, 200);
      ctx.textAlign = "left"; ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("Membership ID / EPIC:", 120, 330);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 16px monospace";
      ctx.fillText(epic, 310, 330);
      ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("District / Location:", 120, 370);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText(form.district, 310, 370);
      const wingData = WINGS.find(w => w.id === form.wing);
      if (wingData) {
        ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
        ctx.fillText("Business Division / Wing:", 120, 410);
        ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 14px Georgia, serif";
        ctx.fillText(wingData.nameEn, 310, 410);
      }
      if (form.shop) {
        ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
        ctx.fillText("Shop / Business Name:", 120, 450);
        ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 15px Georgia, serif";
        ctx.fillText(form.shop, 310, 450);
      }
      ctx.textAlign = "center"; ctx.fillStyle = "#666"; ctx.font = "13px Georgia, serif";
      const date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
      ctx.fillText("Issued on: " + date, W / 2, 530);
      ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2 - 80, 545); ctx.lineTo(W / 2 + 80, 545); ctx.stroke();
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 12px Georgia, serif"; ctx.textAlign = "center";
      ctx.fillText("SENTHIL KUMAR N", W / 2, 570);
      ctx.fillStyle = "#555"; ctx.font = "11px Georgia, serif";
      ctx.fillText("Founder & State President", W / 2, 586);
      ctx.fillText("Tamilnadu Vanigargalin Sangamam", W / 2, 601);
      ctx.fillText("No 5/79, Saidapet, Chennai - 600015", W / 2, 617);
      const link = document.createElement("a");
      link.download = "membership-certificate-" + epic + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    const imgLeft = new Image(); imgLeft.src = ownerPhoto;
    const imgRight = new Image(); imgRight.src = orgLogo;
    const imgSign = new Image(); imgSign.src = signImg;
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === 3) {
        draw();
        const ph = 72, pw = 72;
        ctx.save();
        ctx.beginPath();
        ctx.arc(45 + pw / 2, 40 + ph / 2, ph / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(imgLeft, 45, 40, pw, ph);
        ctx.restore();
        ctx.drawImage(imgRight, W - 45 - pw, 40, pw, ph);
        const sw = 110, sh = 44;
        ctx.drawImage(imgSign, W / 2 - sw / 2, 545 - sh - 3, sw, sh);
        ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 12px Georgia, serif"; ctx.textAlign = "center";
        ctx.fillText("SENTHIL KUMAR N", W / 2, 570);
        ctx.fillStyle = "#555"; ctx.font = "11px Georgia, serif";
        ctx.fillText("Founder & State President", W / 2, 586);
        ctx.fillText("Tamilnadu Vanigargalin Sangamam", W / 2, 601);
        const link2 = document.createElement("a");
        link2.download = "membership-certificate-" + epic + ".png";
        link2.href = canvas.toDataURL("image/png");
        link2.click();
      }
    };
    imgLeft.onload = imgRight.onload = imgSign.onload = onLoad;
    imgLeft.onerror = imgRight.onerror = imgSign.onerror = () => { loaded++; if (loaded === 3) draw(); };
  };

  const handleFile = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDocs(prev => ({ ...prev, [key]: file }));
    if (file) toast.success(`${file.name} uploaded ✓`);
  };

  const handleSelfieSimulate = () => {
    setWebcamCapturing(true);
    setTimeout(() => {
      setDocs(prev => ({ ...prev, selfie: "Selfie Image (Captured Live via Webcam Scanner)" }));
      setWebcamCapturing(false);
      setUseWebcam(false);
      toast.success(language === "ta" ? "புகைப்படம் வெற்றிகரமாக எடுக்கப்பட்டது ✓" : "Selfie captured successfully ✓");
    }, 1800);
  };

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  const docsConfig = [
    { k: "selfie", icon: Camera, l: "Passport Size Photo", ta: "பாஸ்போர்ட் புகைப்படம்", accept: "image/jpeg,image/png,image/webp", webcam: true },
    { k: "idProof", icon: User, l: "Aadhaar / Voter ID", ta: "அடையாள ஆவணம்", accept: "image/*,application/pdf" },
    { k: "shopPhoto", icon: Building2, l: "Shop Front Photo", ta: "கடை புகைப்படம்", accept: "image/*" },
    { k: "bizProof", icon: FileCheck, l: "Business Proof (GST / License)", ta: "வணிக சான்று", accept: "image/*,application/pdf" },
  ];

  const cardMaxWidth = step === 4 ? "max-w-4xl" : "max-w-3xl";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50/50 pb-12">
      {/* ── Page Header ── */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-primary/30 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex-1">
            <Breadcrumb
              items={[
                { label: "Services", labelTa: "சேவைகள்", to: "/services" },
                { label: "Membership", labelTa: "உறுப்பினர் சேர்க்கை" },
              ]}
            />
            <div className="flex">
              <div className="inline-flex items-center gap-1.5 bg-primary/25 text-blue-300 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-primary/30">
                Apply · இணைய
              </div>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              Member Registration
            </h1>
            <p className="font-tamil text-xs text-slate-400 mt-1">5 நிமிடங்களில் உறுப்பினராகப் பதிவு செய்யுங்கள்.</p>
          </div>
          {step < 4 && (
            <button
              onClick={clearDraft}
              className="inline-flex items-center gap-1.5 border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-center backdrop-blur-xs shadow-sm hover:scale-[1.02] active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-550" />
              {language === "ta" ? "படிவத்தை மீட்டமை" : "Reset Draft"}
            </button>
          )}
        </div>
      </header>

      {/* ── Unified Stepper ── */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 md:p-5 shadow-xs">
            {/* Desktop Stepper */}
            <div className="hidden sm:flex items-center justify-between relative">
              {/* Stepper background track line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-105 z-0" />
              {/* Stepper active track line */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 z-0"
                style={{ width: `${((step - 1) / 2) * 88}%` }}
              />

              {STEPS.slice(0, 3).map((s) => {
                const Icon = s.icon;
                const done = step > s.n;
                const active = step === s.n;
                return (
                  <div key={s.n} className="flex flex-col items-center relative z-10 bg-white px-4">
                    <button
                      onClick={() => {
                        if (s.n < step) setStep(s.n);
                      }}
                      disabled={s.n >= step}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                        done
                          ? "bg-primary text-white border-primary cursor-pointer hover:bg-primary/95"
                          : active
                          ? "bg-white border-primary text-primary ring-4 ring-primary/10"
                          : "bg-white border-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : <span>{s.n}</span>}
                    </button>
                    <span className={`text-xs font-bold mt-2 ${active ? "text-primary" : done ? "text-slate-700" : "text-slate-400"}`}>
                      {s.t}
                    </span>
                    <span className={`font-tamil text-[10px] mt-0.5 ${active ? "text-primary/80" : done ? "text-slate-500" : "text-slate-400/70"}`}>
                      {s.ta}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Stepper */}
            <div className="sm:hidden flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="text-primary font-extrabold uppercase tracking-wide">
                  Step {step} of 3: {currentStep.t}
                </span>
                <span className="font-tamil text-slate-400 font-normal">
                  {currentStep.ta}
                </span>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-full transition-all duration-550 ${
                      step >= i ? "bg-primary" : "bg-slate-200/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      <div className={`mx-auto px-4 sm:px-6 py-8 w-full ${cardMaxWidth}`}>
        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-250/70 shadow-sm overflow-hidden transition-all duration-300">
          {/* Step Header inside card */}
          {step < 4 && (
            <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      {currentStep.t}
                    </h2>
                    <p className="font-tamil text-xs text-slate-500 mt-0.5">{currentStep.ta}</p>
                  </div>
                </div>
                
                {/* Visual Fee Badge (Always clear to users so they aren't confused) */}
                <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl px-4 py-2 flex items-center gap-2.5 self-start sm:self-auto shrink-0 shadow-xxs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider leading-none">Annual Fee</div>
                    <div className="text-sm font-black text-emerald-950 mt-1 leading-none">₹ 500</div>
                  </div>
                </div>
              </div>

              {/* Spacious Alert Box for description and tip */}
              <div className="mt-6 bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/40 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <p className="text-xs text-slate-650 leading-relaxed font-medium">{currentStep.desc}</p>
                <p className="font-tamil text-xs text-slate-400 leading-relaxed">{currentStep.descTa}</p>
                {currentStep.tip && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider leading-none">Tip / குறிப்பு</span>
                      <p className="text-xs text-amber-700 leading-relaxed mt-1">{language === "ta" ? currentStep.tipTa : currentStep.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                {/* ─── Step 1: Personal Details ─── */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition duration-205 text-slate-350 group-focus-within:text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <FloatingInput
                          label="Full Name / பெயர்"
                          value={form.name}
                          onChange={e => upd("name", e.target.value)}
                          autoComplete="name"
                          className="pl-10 h-[52px]"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition duration-205 text-slate-350 group-focus-within:text-primary">
                          <Phone className="w-4 h-4" />
                        </div>
                        <FloatingInput
                          label="Mobile / கைபேசி"
                          value={form.mobile}
                          onChange={e => upd("mobile", e.target.value)}
                          inputMode="numeric"
                          maxLength={10}
                          className="pl-10 h-[52px]"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition duration-205 text-slate-350 group-focus-within:text-primary">
                          <Mail className="w-4 h-4" />
                        </div>
                        <FloatingInput
                          label="Email / மின்னஞ்சல்"
                          type="email"
                          value={form.email}
                          onChange={e => upd("email", e.target.value)}
                          autoComplete="email"
                          className="pl-10 h-[52px]"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition duration-205 text-slate-350 group-focus-within:text-primary">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <FloatingSelect
                          label="District / மாவட்டம்"
                          value={form.district}
                          onChange={e => upd("district", e.target.value)}
                          className="pl-10 h-[52px]"
                        >
                          {DISTRICTS.map(d => (
                            <option key={d.en} value={d.en}>
                              {language === "ta" ? `${d.ta} / ${d.en}` : `${d.en} / ${d.ta}`}
                            </option>
                          ))}
                        </FloatingSelect>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 2: Business Details ─── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <div className="relative group">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition duration-200 text-slate-350 group-focus-within:text-primary">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <FloatingInput
                            label="Shop / Business Name (கடை பெயர்)"
                            value={form.shop}
                            onChange={e => upd("shop", e.target.value)}
                            className="pl-10 h-[52px]"
                          />
                        </div>
                      </div>
                      <FloatingSelect
                        label="Business Type / வகை"
                        value={form.type}
                        onChange={e => upd("type", e.target.value)}
                        className="h-[52px]"
                      >
                        {["Retail", "Wholesale", "Manufacturing", "Service", "Online"].map(d => (
                          <option key={d}>{d}</option>
                        ))}
                      </FloatingSelect>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition duration-200 text-slate-350 group-focus-within:text-primary">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <FloatingInput
                          label="Years in Business (அனுபவம்)"
                          value={form.years}
                          onChange={e => upd("years", e.target.value)}
                          type="number"
                          min="0"
                          max="100"
                          className="pl-10 h-[52px]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FloatingSelect
                          label="Wing / பிரிவு"
                          value={form.wing}
                          onChange={e => upd("wing", e.target.value)}
                          className="h-[52px]"
                        >
                          <option value="">-- Select Your Business Wing / பிரிவு --</option>
                          {WING_CATEGORIES.map(category => (
                            <optgroup
                              key={category.id}
                              label={language === "ta" ? category.nameTa : category.nameEn}
                            >
                              {WINGS.filter(w => category.wings.includes(w.id)).map(w => (
                                <option key={w.id} value={w.id}>
                                  {language === "ta" ? w.nameTa : w.nameEn}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </FloatingSelect>
                      </div>
                      <div className="md:col-span-2">
                        <FloatingTextarea
                          label="Shop Address / முகவரி"
                          value={form.address}
                          onChange={e => upd("address", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 3: Documents & Review ─── */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Documents Upload Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {docsConfig.map(doc => {
                        const DocIcon = doc.icon;
                        const uploaded = docs[doc.k];
                        return (
                          <div
                            key={doc.k}
                            className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden group shadow-xxs ${
                              uploaded
                                ? "border-emerald-300 bg-emerald-50/40"
                                : "border-dashed border-slate-200 hover:border-primary/50 hover:bg-slate-50/50 hover:scale-[1.01]"
                            }`}
                            onDragOver={!doc.webcam ? e => e.preventDefault() : undefined}
                            onDrop={!doc.webcam ? e => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
                                setDocs(prev => ({ ...prev, [doc.k]: file }));
                                toast.success(`${file.name} uploaded ✓`);
                              }
                            } : undefined}
                          >
                            <div className="p-5 flex flex-col justify-between h-full min-h-[160px]">
                              {/* Header */}
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${uploaded ? "bg-emerald-100 text-emerald-600 scale-105" : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                                  {uploaded ? <Check className="w-5 h-5" /> : <DocIcon className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-bold text-slate-800 leading-tight">{doc.l}</div>
                                  <div className="font-tamil text-xs text-slate-400 mt-0.5">{doc.ta}</div>
                                </div>
                              </div>

                              {/* Upload Action/Status Area */}
                              <div className="mt-4">
                                {uploaded ? (
                                  <div className="text-xs text-emerald-800 font-bold bg-emerald-100/70 border border-emerald-200/50 px-3 py-2 rounded-xl flex items-center justify-between gap-1.5 animate-fadeIn">
                                    <span className="truncate max-w-[80%]">
                                      {typeof uploaded === "string" ? uploaded : (uploaded as File).name}
                                    </span>
                                    <label className="text-primary hover:underline cursor-pointer shrink-0 text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-xxs">
                                      Change
                                      <input
                                        key={`change-${doc.k}-${uploaded ? 'uploaded' : 'empty'}`}
                                        type="file"
                                        accept={doc.accept}
                                        className="hidden"
                                        onChange={handleFile(doc.k)}
                                      />
                                    </label>
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-450">
                                    {doc.webcam ? (
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setUseWebcam(true)}
                                          className="flex-1 inline-flex justify-center items-center gap-1.5 bg-primary text-white hover:bg-primary/95 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
                                        >
                                          <Camera className="w-3.5 h-3.5" />
                                          {language === "ta" ? "கேமரா" : "Camera"}
                                        </button>
                                        <label className="flex-1 inline-flex justify-center items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xxs">
                                          <Upload className="w-3.5 h-3.5 text-slate-400" />
                                          {language === "ta" ? "பதிவேற்று" : "Upload File"}
                                          <input
                                            key={`upload-selfie-${docs.selfie ? 'uploaded' : 'empty'}`}
                                            type="file"
                                            accept={doc.accept}
                                            className="hidden"
                                            onChange={e => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5MB"); return; }
                                              setDocs(prev => ({ ...prev, selfie: file }));
                                              toast.success("Passport photo uploaded ✓");
                                            }}
                                          />
                                        </label>
                                      </div>
                                    ) : (
                                      <label className="w-full inline-flex justify-center items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xxs">
                                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                                        {language === "ta" ? "கோப்பைத் தேர்ந்தெடு" : "Choose File or Drag & Drop"}
                                        <input
                                          key={`upload-${doc.k}-${docs[doc.k] ? 'uploaded' : 'empty'}`}
                                          type="file"
                                          accept={doc.accept}
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
                                            setDocs(prev => ({ ...prev, [doc.k]: file }));
                                            toast.success(`${file.name} uploaded ✓`);
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* File size note */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-550 bg-slate-50 border border-slate-200/50 rounded-2xl px-4 py-3 shadow-xxs">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Max file size: <strong>5 MB</strong> per document. Accepted formats: <strong>JPG, PNG, PDF</strong></span>
                    </div>

                    {/* Review Section */}
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-lg font-bold text-slate-900">Review Your Details</h3>
                      </div>

                      {/* Unified Grid Summary */}
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Personal Info Summary Card */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xxs">
                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold text-slate-800">Personal Details</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-xs text-primary font-extrabold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3.5">
                            {[
                              { label: "Full Name", value: form.name || "—", icon: User },
                              { label: "Mobile", value: form.mobile || "—", icon: Phone },
                              { label: "Email", value: form.email || "—", icon: Mail },
                              { label: "District", value: form.district, icon: MapPin },
                            ].map(({ label, value, icon: Icon }) => (
                              <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-xxs">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
                                <div className="text-sm text-slate-850 font-bold mt-1.5 break-all">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Business Info Summary Card */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xxs">
                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold text-slate-800">Business Details</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStep(2)}
                              className="text-xs text-primary font-extrabold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3.5">
                            {[
                              { label: "Shop Name", value: form.shop || "—" },
                              { label: "Type", value: form.type },
                              { label: "Wing / Division", value: WINGS.find(w => w.id === form.wing)?.[language === "ta" ? "nameTa" : "nameEn"] || "—" },
                              { label: "Experience", value: form.years ? `${form.years} Years` : "—" },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-xxs">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
                                <div className="text-sm text-slate-850 font-bold mt-1.5 break-all">{value}</div>
                              </div>
                            ))}
                          </div>
                          {form.address && (
                            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xxs">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shop Address</div>
                              <div className="text-sm text-slate-855 font-bold mt-1.5 leading-relaxed">{form.address}</div>
                            </div>
                          )}
                        </div>

                        {/* Documents Uploaded Card */}
                        <div className="md:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xxs">
                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold text-slate-800">Uploaded Documents</span>
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {docsConfig.map(doc => {
                              const isUploaded = !!docs[doc.k];
                              return (
                                <div
                                  key={doc.k}
                                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold shadow-xxs transition-colors ${
                                    isUploaded
                                      ? "bg-white text-emerald-800 border-emerald-200/60"
                                      : "bg-red-50/50 text-red-600 border-red-150"
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${isUploaded ? "bg-emerald-100 text-emerald-650" : "bg-red-100 text-red-600"}`}>
                                    {isUploaded ? "✓" : "✕"}
                                  </span>
                                  <span className="truncate">{doc.l}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Security PIN Section */}
                      <div className="border-t border-slate-150 pt-6">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="p-1 rounded-lg bg-primary/10 text-primary">
                              <Lock className="w-4 h-4" />
                            </div>
                            <label className="text-sm font-extrabold text-slate-900">
                              {language === "ta" ? "பாதுகாப்பு PIN குறியீட்டை உருவாக்கவும்" : "Create Security PIN"}
                            </label>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-4 font-tamil">
                            {language === "ta"
                              ? "உறுப்பினர் அட்டை மற்றும் தகவல்களைப் பாதுகாக்க 4-இலக்க PIN ஐ உள்ளிடவும்."
                              : "Set a 4-digit security PIN to protect your digital membership pass."}
                          </p>
                          <div className="relative inline-block group">
                            <input
                              type="text"
                              pattern="[0-9]*"
                              maxLength={4}
                              value={pin}
                              onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              autoComplete="one-time-code"
                            />
                            <div className="flex gap-3">
                              {[0, 1, 2, 3].map(index => {
                                const char = pin[index] || "";
                                const isFocused = pin.length === index;
                                return (
                                  <div
                                    key={index}
                                    className={`w-12 h-14 rounded-2xl border-2 text-xl font-extrabold flex items-center justify-center transition-all duration-300 ${
                                      isFocused
                                        ? "border-primary ring-4 ring-primary/15 scale-105 bg-white shadow-md shadow-primary/5"
                                        : char
                                        ? "border-emerald-400 bg-emerald-50 text-emerald-850"
                                        : "border-slate-200 bg-slate-50 text-slate-300"
                                    }`}
                                  >
                                    {char ? "•" : ""}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Premium Checkout fee card */}
                      <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                        <div className="absolute top-0 right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-emerald-400" />
                              <span className="font-extrabold text-sm text-slate-200 tracking-wide uppercase">Annual Member Subscription</span>
                            </div>
                            <p className="text-xs text-slate-400">Includes Digital Membership Card & Official Trade Wings access</p>
                          </div>
                          <div className="flex items-baseline gap-1 self-start sm:self-center shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Total:</span>
                            <span className="font-display text-3xl font-black text-emerald-450 tracking-tight">₹500</span>
                            <span className="text-xs text-slate-400">/year</span>
                          </div>
                        </div>
                        
                        <div className="h-px bg-slate-800/80 my-4" />
                        
                        <div className="flex flex-col sm:flex-row justify-between gap-3 text-[11px] text-slate-400 relative z-10">
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-emerald-400" /> 256-bit Secure Encryption Checkout
                          </span>
                          <span className="bg-slate-800 px-2.5 py-1 rounded-md text-[10px] text-amber-300 font-bold border border-slate-700/50">
                            Demo Mode: No real payment processed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 4: Success ─── */}
                {step === 4 && (
                  <div className="py-6 flex flex-col items-center animate-fadeIn">
                    {/* Success badge */}
                    <div className="text-center max-w-md mx-auto mb-8">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto shadow-md">
                          <Check className="w-10 h-10" />
                        </div>
                        <div className="absolute -right-1 -top-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-sm">
                          <Star className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                      <h2 className="mt-6 font-display text-2xl sm:text-3xl font-black text-slate-850 tracking-tight">Registration Complete!</h2>
                      <p className="font-tamil text-sm text-slate-500 mt-1.5">உறுப்பினர் பதிவு வெற்றிகரமாக முடிந்தது.</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Welcome to the Tamil Nadu Vanigargalin Sangamam community.</p>
                    </div>

                    {/* Premium Digital Membership Card Mockup */}
                    <div className="w-full max-w-md bg-linear-to-br from-slate-900 to-blue-950 border border-slate-800/80 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl shadow-primary/10 group">
                      {/* Decorative backdrop elements */}
                      <div className="absolute top-0 right-0 w-44 h-44 bg-primary/20 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none group-hover:bg-primary/25 transition duration-500" />
                      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4 pointer-events-none" />
                      
                      {/* Card Header branding */}
                      <div className="flex justify-between items-start gap-4 mb-6 relative z-10 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <img src={orgLogo} className="w-8 h-8 rounded-full border border-white/20 bg-white object-contain" alt="TNVS Logo" />
                          <div>
                            <div className="text-[10px] font-black text-white leading-none tracking-wider uppercase">TNVS</div>
                            <div className="text-[8px] text-slate-455 mt-0.5 leading-none font-tamil font-normal">வணிகர்களின் சங்கமம்</div>
                          </div>
                        </div>
                        <div className="bg-primary/30 border border-primary/45 rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-blue-300">
                          Active Member
                        </div>
                      </div>

                      {/* Official EPIC ID Code */}
                      <div className="mb-6 relative z-10">
                        <div className="text-[9px] uppercase font-bold tracking-wider text-slate-455 mb-1">Official ID / EPIC</div>
                        <div className="font-mono text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-200 via-indigo-100 to-blue-100 tracking-widest">{epic}</div>
                      </div>

                      {/* Credentials Grid */}
                      <div className="grid grid-cols-2 gap-4 relative z-10 text-white pt-2">
                        <div>
                          <div className="text-[9px] text-slate-455 font-bold uppercase tracking-wider mb-0.5">Name / பெயர்</div>
                          <div className="text-sm font-bold text-slate-100 truncate">{form.name || "Sangamam Member"}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-455 font-bold uppercase tracking-wider mb-0.5">District / மாவட்டம்</div>
                          <div className="text-sm font-bold text-slate-100 truncate">{form.district}</div>
                        </div>
                        {form.shop && (
                          <div className="col-span-2">
                            <div className="text-[9px] text-slate-455 font-bold uppercase tracking-wider mb-0.5">Business Name / கடை பெயர்</div>
                            <div className="text-sm font-bold text-slate-100 truncate leading-snug">{form.shop}</div>
                          </div>
                        )}
                      </div>

                      {/* Bottom decorative barcode pattern representation */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider leading-none">TAMIL NADU, INDIA</span>
                          <span className="text-[7px] text-slate-655 font-tamil font-normal mt-0.5 leading-none">அதிகாரப்பூர்வ அட்டை</span>
                        </div>
                        <div className="h-6 w-24 opacity-60 bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,#000_2px,#000_5px)]" />
                      </div>
                    </div>

                    {/* Next Steps info */}
                    <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 space-y-3 shadow-xxs">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1.5 border-b border-slate-200">What's Next?</div>
                      {[
                        { text: "Download your PDF Membership Certificate", ta: "உறுப்பினர் சான்றிதழை பதிவிறக்கவும்", done: true },
                        { text: "View and edit your profile on the dashboard", ta: "டாஷ்போர்டில் உங்கள் சுயவிவரத்தை பாருங்கள்", done: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs text-slate-650">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                            {item.done ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800">{language === "ta" ? item.ta : item.text}</p>
                            <p className="text-[10px] text-slate-450">{i === 0 ? "Generate high-resolution printable pass" : "Manage your wings and local constituencies"}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                      <button
                        onClick={downloadCertificate}
                        className="btn-primary flex-1 justify-center py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer transition active:scale-95"
                      >
                        <Download className="w-4 h-4" /> Download Certificate
                      </button>
                      <Link
                        to="/dashboard"
                        className="btn-secondary flex-1 justify-center py-3 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4 text-slate-500" /> Go to Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation Buttons ── */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-slate-150 flex justify-between items-center">
                <button
                  onClick={back}
                  disabled={step === 1 || submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-850 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition cursor-pointer rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={step === 3 ? handlePaySubmit : next}
                    disabled={submitting}
                    className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold cursor-pointer hover:shadow-md transition duration-200 flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                    ) : step === 3 ? (
                      <>Pay ₹500 & Submit <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Continue <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Webcam Modal ── */}
      {useWebcam && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-slate-800">Selfie Camera Scanner</span>
              </div>
              <button onClick={() => setUseWebcam(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">✕ Close</button>
            </div>
            <div className="aspect-square bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-4 border-dashed border-primary/60 animate-pulse absolute" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/40 -translate-y-1/2 animate-bounce" />
              {webcamCapturing ? (
                <div className="text-white text-xs space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  <span>Scanning Face...</span>
                </div>
              ) : (
                <span className="text-slate-500 text-xs">Position your face inside the circle</span>
              )}
            </div>
            <p className="text-xs text-slate-500">Align your face inside the scanning circle</p>
            <button
              type="button"
              onClick={handleSelfieSimulate}
              disabled={webcamCapturing}
              className="btn-primary w-full justify-center"
            >
              {webcamCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              Capture Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Membership;
