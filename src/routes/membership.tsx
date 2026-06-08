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
  Printer,
  Share2,
  Hash,
  Heart,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import ownerPhoto from "@/assets/round-logo.png";
import orgLogo from "@/assets/association-logo.png";
import signImg from "@/assets/president-signature.png";
import kittenTeacup from "@/assets/kitten_teacup.png";
import unityHands from "@/assets/unity-hands.png";
import { VoterIdCard, type Voter, membershipNo, getZoneName, formatDob } from "@/components/VoterIdCard";
import { z } from "zod";
import { WINGS } from "@/data/wings";

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
    t: "Member Details",
    ta: "உறுப்பினர் விவரங்கள்",
    icon: User,
    desc: "Enter the member's information below. You can search the database to load pre-configured profiles.",
    descTa: "உறுப்பினரின் விவரங்களை கீழே உள்ளிடவும். முன்பே சேமிக்கப்பட்ட விவரங்களை மீட்டெடுக்க தேடல் பெட்டியைப் பயன்படுத்தலாம்.",
    tip: "Tip: Search 'Senthil Kumar' or 'RJE1234567' to load pre-configured voter profiles.",
    tipTa: "குறிப்பு: 'Senthil Kumar' அல்லது 'RJE1234567' எனத் தட்டச்சு செய்து விவரங்களை மீட்டெடுக்கவும்.",
  },
  {
    n: 2,
    t: "Upload Photo",
    ta: "புகைப்படம் பதிவேற்றம்",
    icon: Camera,
    desc: "Upload or capture your passport size identification photo.",
    descTa: "உங்கள் பாஸ்போர்ட் அளவிலான அடையாளப் புகைப்படத்தைப் பதிவேற்றவும் அல்லது எடுக்கவும்.",
    tip: "A clear front-facing photo is required for the digital ID card.",
    tipTa: "டிஜிட்டல் அடையாள அட்டைக்கு தெளிவான முன்பக்கப் புகைப்படம் தேவை.",
  },
  {
    n: 3,
    t: "Review & Security",
    ta: "சரிபார் & பாதுகாப்பு",
    icon: FolderOpen,
    desc: "Review your details, set your security PIN, and complete registration.",
    descTa: "விவரங்களைச் சரிபார்த்து, உங்கள் பாதுகாப்பு பின்னை அமைத்து, பதிவை முடிக்கவும்.",
    tip: "Create a memorable 4-digit PIN to secure your digital pass.",
    tipTa: "உங்கள் டிஜிட்டல் அட்டையைப் பாதுகாக்க மறக்கமுடியாத 4-இலக்க பின்னை உருவாக்கவும்.",
  },
  {
    n: 4,
    t: "Success & ID Card",
    ta: "வெற்றி & அட்டை",
    icon: Star,
    desc: "Your membership card and certificate are ready for download.",
    descTa: "உங்கள் உறுப்பினர் அட்டை மற்றும் சான்றிதழ் பதிவிறக்கத்திற்கு தயாராக உள்ளது.",
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
    wings: ["labour", "differently-abled", "transgender-entrepreneurs", "pharmacists", "educators", "tourism-transport", "sports-business", "shop-owners", "street-vendors", "hotels-lodgings", "beauty-fitness", "central-govt-relations", "state-govt-relations", "cottage-industry", "digital-advertAdvertisers"]
  }
];

function mapWingToCategory(wingId: string): { category: string; subCategory: string } {
  switch (wingId) {
    case "women-entrepreneurs":
      return { category: "Daily Needs", subCategory: "Grocery & Supermarkets" };
    case "chartered-accountants":
      return { category: "Finance & Banking", subCategory: "Personal & Car Loans" };
    case "doctors":
      return { category: "Doctors", subCategory: "General Physicians" };
    case "lawyers":
      return { category: "Advocate & Legal", subCategory: "Notary & Documentation" };
    case "agriculture":
      return { category: "Agriculture", subCategory: "Seeds & Trees" };
    case "information-technology":
      return { category: "IT & Software", subCategory: "Software Development Companies" };
    case "engineers":
      return { category: "Civil Contractors", subCategory: "Building & Construction" };
    case "labour":
      return { category: "Jobs", subCategory: "HR & Manpower Services" };
    case "differently-abled":
      return { category: "B2B Services", subCategory: "Chemicals & Industrial Supplies" };
    case "young-entrepreneurs":
      return { category: "B2B Services", subCategory: "Chemicals & Industrial Supplies" };
    case "media-relations":
      return { category: "Advertising", subCategory: "TV & Broadcasting Media" };
    case "distributors":
      return { category: "B2B Services", subCategory: "Chemicals & Industrial Supplies" };
    case "manufacturers":
      return { category: "B2B Services", subCategory: "Chemicals & Industrial Supplies" };
    case "cottage-industry":
      return { category: "Daily Needs", subCategory: "Grocery & Supermarkets" };
    case "pharmacists":
      return { category: "Hospitals & Clinics", subCategory: "Nursing Homes" };
    case "educators":
      return { category: "Education", subCategory: "Tuition Centres" };
    case "import-export":
      return { category: "B2B Services", subCategory: "Chemicals & Industrial Supplies" };
    case "transgender-entrepreneurs":
      return { category: "B2B Services", subCategory: "Chemicals & Industrial Supplies" };
    case "shop-owners":
      return { category: "Daily Needs", subCategory: "Grocery & Supermarkets" };
    case "central-govt-relations":
      return { category: "Legal Services", subCategory: "Notary & Documentation" };
    case "state-govt-relations":
      return { category: "Legal Services", subCategory: "Notary & Documentation" };
    case "restaurant-owners":
      return { category: "Hotels & Restaurants", subCategory: "Veg & Non-Veg Restaurants" };
    case "tourism-transport":
      return { category: "Transport", subCategory: "Travels & Tour Operators" };
    case "sports-business":
      return { category: "Sports", subCategory: "Sports Kit Shops" };
    case "marine-business":
      return { category: "Agriculture", subCategory: "Millets & Grains" };
    case "tribal-entrepreneurs":
      return { category: "Daily Needs", subCategory: "Grocery & Supermarkets" };
    case "digital-advertisers":
      return { category: "Advertising", subCategory: "Digital & Display Advertising" };
    case "printing-press":
      return { category: "Printing Services", subCategory: "Printing Press" };
    case "computer-mobile":
      return { category: "Digital & IT Products", subCategory: "Computer Sales & Service" };
    case "weavers":
      return { category: "Textiles & Garments", subCategory: "Handloom & Fabrics" };
    case "insurance-finance":
      return { category: "Insurance", subCategory: "Insurance Agents" };
    case "street-vendors":
      return { category: "Daily Needs", subCategory: "Grocery & Supermarkets" };
    case "hotels-lodgings":
      return { category: "Hotels & Restaurants", subCategory: "Resorts & Guest Houses" };
    case "beauty-fitness":
      return { category: "Spa & Beauty", subCategory: "Saloons" };
    default:
      return { category: "Daily Needs", subCategory: "Grocery & Supermarkets" };
  }
}

interface MemberForm {
  name: string;
  epic: string;
  mobile: string;
  email: string;
  dob: string;
  age: string;
  gender: string;
  bloodGroup: string;
  assembly: string;
  district: string;
  shop: string;
  type: string;
  address: string;
  years: string;
  wing: string;
}

function Membership() {
  const { t, language } = useLanguage();
  const search = Route.useSearch();

  const todayDate = new Date();
  const maxDob = `${todayDate.getFullYear() - 18}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
  const minDob = `${todayDate.getFullYear() - 120}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMountedRef = useRef(false);

  const baseForm = {
    name: search.name || "",
    epic: search.epic || "",
    mobile: search.mobile || "",
    email: "",
    dob: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    assembly: search.assembly || "",
    district: search.district || "Chennai",
    shop: "",
    type: "Retail",
    address: search.address || "",
    years: "",
    wing: search.wing || "",
  };

  const [form, setForm] = useState<MemberForm>(baseForm);

  const [docs, setDocs] = useState<Record<string, File | string | null>>({
    idProof: null,
    shopPhoto: null,
    bizProof: null,
    selfie: null,
  });

  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamCapturing, setWebcamCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [tempSelfie, setTempSelfie] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (useWebcam && !tempSelfie) {
      setCameraError(false);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.error("Camera access error:", err);
            setCameraError(true);
          });
      } else {
        setCameraError(true);
      }
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [useWebcam, tempSelfie]);

  const [submitting, setSubmitting] = useState(false);
  const [pin, setPin] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const epicRef = useRef(search.epic || "TN-VS-" + Math.floor(10000000 + Math.random() * 89999999));
  
  const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleDobPartChange = (part: "year" | "month" | "day", value: string) => {
    let [y, m, d] = form.dob ? form.dob.split("-") : ["0000", "00", "00"];
    if (!y) y = "0000";
    if (!m) m = "00";
    if (!d) d = "00";

    if (part === "year") y = value || "0000";
    if (part === "month") m = value || "00";
    if (part === "day") d = value || "00";

    const newDob = `${y}-${m}-${d}`;
    let calculatedAgeStr = "";

    const isComplete = y !== "0000" && m !== "00" && d !== "00";

    if (isComplete) {
      const birthDate = new Date(newDob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge >= 18 && calculatedAge <= 120) {
          calculatedAgeStr = calculatedAge.toString();
        }
      }
    }

    setForm((prev) => ({
      ...prev,
      dob: newDob,
      age: calculatedAgeStr,
    }));
  };


  useEffect(() => {
    if (search.name && search.epic) {
      toast.success(
        language === "ta"
          ? "தேர்தல் தரவுத்தளத்திலிருந்து விவரங்கள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன!"
          : "Details imported successfully from Voter Database!"
      );
    }
  }, [search.name, search.epic, language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("tnvs_form_step");
      if (savedStep) {
        const parsed = parseInt(savedStep, 10);
        if (parsed >= 1 && parsed <= 4) {
          setStep(parsed);
        }
      }
      
      const savedData = localStorage.getItem("tnvs_form_data");
      if (savedData && !(search.name || search.epic)) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed) {
            setForm((prev) => ({ ...prev, ...parsed }));
          }
        } catch {}
      }
      setIsLoaded(true);
    }
  }, [search.name, search.epic]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tnvs_form_data", JSON.stringify(form));
    }
  }, [form, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      if (step < 4) {
        localStorage.setItem("tnvs_form_step", step.toString());
      } else {
        localStorage.removeItem("tnvs_form_step");
      }
    }
    if (isMountedRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      isMountedRef.current = true;
    }
  }, [step, isLoaded]);

  const clearDraft = () => {
    if (window.confirm(language === "ta" ? "உங்கள் படிவத் தகவல்களை நீக்க விரும்புகிறீர்களா?" : "Are you sure you want to clear your registration draft?")) {
      localStorage.removeItem("tnvs_form_data");
      localStorage.removeItem("tnvs_form_step");
      setForm({
        name: "",
        epic: "",
        mobile: "",
        email: "",
        dob: "",
        age: "",
        gender: "Male",
        bloodGroup: "O+",
        assembly: "",
        district: "Chennai",
        shop: "",
        type: "Retail",
        address: "",
        years: "",
        wing: "",
      });
      setDocs({ idProof: null, shopPhoto: null, bizProof: null, selfie: null });
      setStep(1);
      toast.success(language === "ta" ? "படிவம் மீட்டமைக்கப்பட்டது" : "Form draft reset successfully");
    }
  };

  const handleSearch = async () => {
    const queryTerm = searchQuery.trim();
    if (!queryTerm) return;
    setSearchResults([]);
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (/^[a-zA-Z0-9]{3,20}$/.test(queryTerm)) {
        params.append("epic", queryTerm);
      } else {
        params.append("name", queryTerm);
      }

      const res = await fetch(`/api/voter-search?${params.toString()}`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      if (data.voters) {
        setSearchResults(data.voters);
        if (data.voters.length === 0) {
          toast.info(language === "ta" ? "பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை" : "No matching records found");
        }
        return;
      }
    } catch (err) {
      setSearchResults([]);
      toast.info(language === "ta" ? "பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை" : "No matching records found");
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const selectVoter = (v: any) => {
    let fallbackDob = "";
    if (v.AGE) {
      const birthYear = new Date().getFullYear() - parseInt(v.AGE);
      fallbackDob = `${birthYear}-01-01`;
    }
    setForm({
      ...form,
      name: v.VOTER_NAME || "",
      epic: v.EPIC_NO || "",
      mobile: v.MOBILE_NUMBER || form.mobile,
      dob: v.DOB || fallbackDob,
      age: v.AGE || "",
      gender: v.GENDER || "Male",
      bloodGroup: v.BLOOD_GROUP || "O+",
      assembly: v.ASSEMBLY_NAME || "",
      district: v.DISTRICT || "Chennai",
      address: v.POLLING_STATION_ADDRESS || "",
    });
    setSearchResults([]);
    setSearchQuery("");
    toast.success(
      language === "ta"
        ? "விவரங்கள் தானாக நிரப்பப்பட்டன"
        : "Details populated successfully!"
    );
  };

  const validate = (): boolean => {
    if (step === 1) {
      if (!form.name.trim()) { toast.error(language === "ta" ? "உங்கள் முழுப் பெயரை உள்ளிடவும்" : "Enter your full name"); return false; }
      if (!form.epic.trim()) { toast.error(language === "ta" ? "தயவுசெய்து EPIC / ID எண்ணை உள்ளிடவும்" : "Enter EPIC / ID No"); return false; }
      if (!/^[a-zA-Z]{3}\d{7}$/.test(form.epic.trim())) {
        toast.error(language === "ta" 
          ? "EPIC எண் வடிவத்தில் இருக்க வேண்டும் (எ.கா: RJE1234567)" 
          : "EPIC No must be in format: 3 letters followed by 7 digits (e.g. RJE1234567)");
        return false;
      }
      if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, "").slice(-10))) { toast.error(language === "ta" ? "சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்" : "Enter valid 10-digit mobile"); return false; }
      if (form.email && !form.email.includes("@")) { toast.error(language === "ta" ? "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Enter valid email"); return false; }
      if (!form.dob || form.dob.includes("0000") || form.dob.split("-").includes("00")) {
        toast.error(language === "ta" ? "உங்கள் பிறந்த தேதியை முழுமையாக உள்ளிடவும்" : "Please complete your date of birth selection");
        return false;
      }
      const birthDate = new Date(form.dob);
      if (isNaN(birthDate.getTime())) {
        toast.error(language === "ta" ? "பிறந்த தேதி செல்லாதது" : "Invalid date of birth");
        return false;
      }
      const today = new Date();
      if (birthDate > today) {
        toast.error(language === "ta" ? "பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது" : "Date of birth cannot be in the future");
        return false;
      }
      let expectedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        expectedAge--;
      }
      if (expectedAge < 18 || expectedAge > 120) {
        toast.error(language === "ta" ? "பிறந்த தேதியின்படி வயது 18 முதல் 120 வரை இருக்க வேண்டும்" : "Age based on date of birth must be between 18 and 120");
        return false;
      }
      if (!form.age) { toast.error(language === "ta" ? "உங்கள் வயதை உள்ளிடவும்" : "Enter your age"); return false; }
      const ageNum = parseInt(form.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        toast.error(language === "ta" ? "வயது 18 முதல் 120 வரை இருக்க வேண்டும்" : "Age must be between 18 and 120");
        return false;
      }
      if (Math.abs(ageNum - expectedAge) > 1) {
        toast.error(language === "ta" ? "பிறந்த தேதியும் வயதும் பொருந்தவில்லை" : "Date of birth and age do not match");
        return false;
      }
      if (!form.shop.trim()) { toast.error(language === "ta" ? "வணிகப் பெயரை உள்ளிடவும்" : "Enter shop/business name"); return false; }
      if (!form.wing) { toast.error(language === "ta" ? "தயவுசெய்து வணிகப் பிரிவைத் தேர்ந்தெடுக்கவும்" : "Please select your business wing"); return false; }
      if (!form.address.trim()) { toast.error(language === "ta" ? "உங்கள் முகவரியை உள்ளிடவும்" : "Enter your address"); return false; }
    }
    if (step === 2) {
      if (!docs.selfie) {
        toast.error(language === "ta" ? "தயவுசெய்து புகைப்படத்தைப் பதிவேற்றவும்" : "Please upload your photo");
        return false;
      }
    }
    if (step === 3) {
      const missing = [
        !docs.idProof && (language === "ta" ? "அடையாள ஆவணம்" : "Aadhaar / Voter ID"),
        !docs.shopPhoto && (language === "ta" ? "கடை புகைப்படம்" : "Shop Front Photo"),
        !docs.bizProof && (language === "ta" ? "வணிக சான்று" : "Business Proof"),
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
    try {
      if (!validate()) return;
      setSubmitting(true);

      // Helper to compress and resize images on the client side
      const compressAndResizeImage = (src: string | File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string | null> => {
        return new Promise((resolve) => {
          const img = new Image();
          
          const loadImage = () => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > maxWidth) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                resolve(null);
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL("image/jpeg", quality);
              resolve(dataUrl);
            };
            img.onerror = () => resolve(null);
          };

          if (src instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(src);
            reader.onload = (event) => {
              img.src = event.target?.result as string;
              loadImage();
            };
            reader.onerror = () => resolve(null);
          } else {
            img.src = src;
            loadImage();
          }
        });
      };

      // Helper to read File/Blob or Base64 and compress it
      const fileToBase64 = async (f: any): Promise<string | null> => {
        if (!f) return null;
        try {
          return await compressAndResizeImage(f);
        } catch (err) {
          console.warn("Image compression failed, falling back to raw reader:", err);
          if (typeof f === "string") return f;
          return new Promise((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = () => resolve(null);
            r.readAsDataURL(f);
          });
        }
      };

      const selfieVal = await fileToBase64(docs.selfie);
      const idProofVal = await fileToBase64(docs.idProof);
      const shopPhotoVal = await fileToBase64(docs.shopPhoto);
      const bizProofVal = await fileToBase64(docs.bizProof);

      // 1. Auto-save business details to MySQL
      try {
        const mappedCategory = mapWingToCategory(form.wing);
        const bizPayload = {
          name: form.shop,
          phone: form.mobile,
          category: mappedCategory.category,
          subCategory: mappedCategory.subCategory,
          district: form.district,
          assembly: form.assembly || null,
          address: form.address,
          description: `Registered TNVS Member: ${form.name} (EPIC: ${form.epic})`,
          email: form.email || null,
        };

        const bizRes = await fetch("/api/public/business", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bizPayload),
        });

        if (!bizRes.ok) {
          const errData = await bizRes.json().catch(() => ({}));
          console.warn("Failed to add business automatically:", errData.error || bizRes.statusText);
        } else {
          toast.success(
            language === "ta"
              ? "புதிய வணிகம் வெற்றிகரமாக தரவுத்தளத்தில் சேர்க்கப்பட்டது!"
              : "Business listing registered successfully in database!"
          );
        }
      } catch (bizErr) {
        console.error("Error adding business to local DB:", bizErr);
      }

      // 2. Save member profile to MySQL member_list
      try {
        const memberPayload = {
          ...form,
          epic: form.epic.toUpperCase(),
          selfie: selfieVal,
          idProof: idProofVal,
          shopPhoto: shopPhotoVal,
          bizProof: bizProofVal,
          pin: pin,
        };

        const memRes = await fetch("/api/public/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberPayload),
        });

        if (!memRes.ok) {
          const errData = await memRes.json().catch(() => ({}));
          throw new Error(errData.error || "Server registration failed");
        } else {
          toast.success(
            language === "ta"
              ? "உறுப்பினர் சேர்க்கை வெற்றிகரமாகத் தரவுத்தளத்தில் சேமிக்கப்பட்டது!"
              : "Member profile saved successfully in database!"
          );
        }
      } catch (memErr: any) {
        console.error("Error saving member to DB:", memErr);
        toast.error(
          language === "ta"
            ? `தரவுத்தளத்தில் சேமிக்க முடியவில்லை: ${memErr.message}`
            : `Failed to save member to database: ${memErr.message}`
        );
        throw memErr; // Halt registration if database save fails
      }
      await new Promise(r => setTimeout(r, 2000));
      setSubmitting(false);

      localStorage.removeItem("tnvs_form_data");
      localStorage.removeItem("tnvs_form_step");
      setStep(4);
    } catch (err: any) {
      setSubmitting(false);
      console.error("Payment submission error:", err);
      toast.error(
        language === "ta"
          ? `பதிவு செய்வதில் பிழை ஏற்பட்டது: ${err.message || err}`
          : `An error occurred during registration: ${err.message || err}`
      );
    }
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
      ctx.fillText(form.epic || epicRef.current, 310, 330);
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
    };

    const imgLeft = new Image(); imgLeft.src = (typeof docs.selfie === "string" ? docs.selfie : "") || ownerPhoto;
    const imgRight = new Image(); imgRight.src = orgLogo;
    const imgSign = new Image(); imgSign.src = signImg;
    let loaded = 0;
    const handleComplete = () => {
      loaded++;
      if (loaded === 3) {
        draw();
        const ph = 72, pw = 72;
        if (imgLeft.complete && imgLeft.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(45 + pw / 2, 40 + ph / 2, ph / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(imgLeft, 45, 40, pw, ph);
          ctx.restore();
        }
        if (imgRight.complete && imgRight.naturalWidth > 0) {
          ctx.drawImage(imgRight, W - 45 - pw, 40, pw, ph);
        }
        if (imgSign.complete && imgSign.naturalWidth > 0) {
          const sw = 110, h = 44;
          ctx.drawImage(imgSign, W / 2 - sw / 2, 545 - h - 3, sw, h);
        }
        
        const link = document.createElement("a");
        link.download = "membership-certificate-" + (form.epic || epicRef.current) + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    imgLeft.onload = imgLeft.onerror = 
    imgRight.onload = imgRight.onerror = 
    imgSign.onload = imgSign.onerror = handleComplete;
  };

  const handlePrint = () => {
    if (!frontRef.current || !backRef.current) return;
    const name = form.name.replace(/\s*-\s*$/, "").trim();
    const frontHtml = frontRef.current.innerHTML;
    const backHtml = backRef.current.innerHTML;

    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <title>Sangamam Card — ${name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              gap: 40px; 
              padding: 20px; 
              background: #f0f2f5;
              font-family: 'Inter', sans-serif;
            }
            .card-wrapper {
              position: relative;
              overflow: hidden;
              background: transparent;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
              border-radius: 12px;
              page-break-inside: avoid;
            }
            /* Front Card Wrapper Dimensions */
            .card-wrapper:first-of-type {
              width: 421px;
              height: 590px;
            }
            /* Back Card Wrapper Dimensions */
            .card-wrapper:last-of-type {
              width: 421px;
              height: 590px;
            }
            /* Clear any preview page wrapper styling */
            .card-scale-wrapper {
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }
            /* Prevent scale adjustments in print container */
            .responsive-card-scale {
              transform: none !important;
              width: 100% !important;
              height: 100% !important;
            }
            /* Center elements properly */
            .card-face {
              margin: 0 !important;
            }
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
              body { 
                background: #fff; 
                min-height: auto;
                padding: 0;
                gap: 15mm;
              }
              .card-wrapper {
                box-shadow: none;
                border-radius: 0;
                page-break-inside: avoid;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="card-wrapper">${frontHtml}</div>
          <div class="card-wrapper">${backHtml}</div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>`);
    w.document.close();
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillStyle: string
  ) => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

   const generateFrontCardCanvas = (): Promise<HTMLCanvasElement> => {
     return new Promise((resolve, reject) => {
       if (!generatedVoter) return reject(new Error("No voter data"));
       const name = generatedVoter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
       const W = 421, H = 590;
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale; canvas.height = H * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      const draw = () => {
        // 1. Draw Member Photo
        const photoX = (W - 137) / 2;
        const photoY = 182;
        const photoW = 137;
        const photoH = 136;
        const radius = 22;

        // Draw white background outer container for the ring frame
        drawRoundedRect(ctx, photoX, photoY, photoW, photoH, radius, "#ffffff");

        // Draw Photo image (rounded and inset by 3px for white offset padding ring)
        if (imgPhoto.complete && imgPhoto.naturalWidth > 0) {
          ctx.save();
          const insetX = photoX + 3;
          const insetY = photoY + 3;
          const insetW = photoW - 6;
          const insetH = photoH - 6;
          const insetR = radius - 3;
          ctx.beginPath();
          ctx.moveTo(insetX + insetR, insetY);
          ctx.lineTo(insetX + insetW - insetR, insetY);
          ctx.quadraticCurveTo(insetX + insetW, insetY, insetX + insetW, insetY + insetR);
          ctx.lineTo(insetX + insetW, insetY + insetH - insetR);
          ctx.quadraticCurveTo(insetX + insetW, insetY + insetH, insetX + insetW - insetR, insetY + insetH);
          ctx.lineTo(insetX + insetR, insetY + insetH);
          ctx.quadraticCurveTo(insetX, insetY + insetH, insetX, insetY + insetH - insetR);
          ctx.lineTo(insetX, insetY + insetR);
          ctx.quadraticCurveTo(insetX, insetY, insetX + insetR, insetY);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(imgPhoto, insetX, insetY, insetW, insetH);
          ctx.restore();
        }

        // Draw green border (thinner 3px outer stroke)
        ctx.save();
        ctx.strokeStyle = "var(--primary)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(photoX + radius, photoY);
        ctx.lineTo(photoX + photoW - radius, photoY);
        ctx.quadraticCurveTo(photoX + photoW, photoY, photoX + photoW, photoY + radius);
        ctx.lineTo(photoX + photoW, photoY + photoH - radius);
        ctx.quadraticCurveTo(photoX + photoW, photoY + photoH, photoX + photoW - radius, photoY + photoH);
        ctx.lineTo(photoX + radius, photoY + photoH);
        ctx.quadraticCurveTo(photoX, photoY + photoH, photoX, photoY + photoH - radius);
        ctx.lineTo(photoX, photoY + radius);
        ctx.quadraticCurveTo(photoX, photoY, photoX + radius, photoY);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // 2. Draw Text Stack
        ctx.textAlign = "center";
        
        // Name
        ctx.font = "bold 23px Arial, sans-serif";
        ctx.fillStyle = "var(--primary)";
        ctx.fillText(name.toUpperCase(), W / 2, 350);

        // Assembly : Value
        const assmLabel = "Assembly : ";
        const assmValue = generatedVoter.ASSEMBLY_NAME || "—";
        ctx.font = "500 13px Arial, sans-serif";
        const assmLabelW = ctx.measureText(assmLabel).width;
        ctx.font = "500 16px Arial, sans-serif";
        const assmValueW = ctx.measureText(assmValue).width;
        const assmLineW = assmLabelW + assmValueW;
        const assmLineX = W / 2 - assmLineW / 2;
        ctx.font = "500 13px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.textAlign = "left";
        ctx.fillText(assmLabel, assmLineX, 382);
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(assmValue, assmLineX + assmLabelW, 382);

        // Dist : Value
        const distLabel = "Dist : ";
        const distValue = generatedVoter.DISTRICT || "—";
        ctx.font = "500 13px Arial, sans-serif";
        const distLabelW = ctx.measureText(distLabel).width;
        ctx.font = "500 16px Arial, sans-serif";
        const distValueW = ctx.measureText(distValue).width;
        const distLineW = distLabelW + distValueW;
        const distLineX = W / 2 - distLineW / 2;
        ctx.font = "500 13px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(distLabel, distLineX, 414);
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(distValue, distLineX + distLabelW, 414);

        // Zone : Value
        const zoneLabel = "Zone : ";
        const zoneText = getZoneName(generatedVoter.DISTRICT, generatedVoter.ASSEMBLY_NAME);
        ctx.font = "500 13px Arial, sans-serif";
        const zoneLabelW = ctx.measureText(zoneLabel).width;
        ctx.font = "500 16px Arial, sans-serif";
        const zoneValueW = ctx.measureText(zoneText).width;
        const zoneLineW = zoneLabelW + zoneValueW;
        const zoneLineX = W / 2 - zoneLineW / 2;
        ctx.font = "500 13px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(zoneLabel, zoneLineX, 446);
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(zoneText, zoneLineX + zoneLabelW, 446);

        // ID/Membership Number (bold)
        const mno = membershipNo(generatedVoter);
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.fillStyle = "#000000";
        ctx.fillText(mno, W / 2, 478);

        resolve(canvas);
      };

      // Load Background & Photo
      const imgBg = new Image();
      imgBg.crossOrigin = "anonymous";
      imgBg.src = "https://res.cloudinary.com/dqndhcmu2/image/upload/v1773232516/vanigan/templates/ID_Front.png";

      const imgPhoto = new Image();
      imgPhoto.crossOrigin = "anonymous";
      imgPhoto.src = (typeof docs.selfie === "string" ? docs.selfie : docs.selfie ? URL.createObjectURL(docs.selfie as Blob) : "") || ownerPhoto;

      let loaded = 0;
      const handleLoad = () => {
        loaded++;
        if (loaded === 2) {
          const cardRadius = 24;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cardRadius, 0);
          ctx.lineTo(W - cardRadius, 0);
          ctx.quadraticCurveTo(W, 0, W, cardRadius);
          ctx.lineTo(W, H - cardRadius);
          ctx.quadraticCurveTo(W, H, W - cardRadius, H);
          ctx.lineTo(cardRadius, H);
          ctx.quadraticCurveTo(0, H, 0, H - cardRadius);
          ctx.lineTo(0, cardRadius);
          ctx.quadraticCurveTo(0, 0, cardRadius, 0);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(imgBg, 0, 0, W, H);
          draw();
          ctx.restore();
        }
      };
      imgBg.onerror = imgPhoto.onerror = () => {
        reject(new Error("Error loading front card images."));
      };
      imgBg.onload = imgPhoto.onload = handleLoad;
    });
  };

  const generateBackCardCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!generatedVoter) return reject(new Error("No voter data"));
      const W = 421, H = 590;
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale; canvas.height = H * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      const mno = membershipNo(generatedVoter);
      const dobString = formatDob(generatedVoter.DOB, generatedVoter.AGE);
      const mobile = generatedVoter.MOBILE_NUMBER && generatedVoter.MOBILE_NUMBER !== "-" ? generatedVoter.MOBILE_NUMBER : "—";
      const rawAddress = generatedVoter.POLLING_STATION_ADDRESS || (generatedVoter.HOUSE_NO ? `No ${generatedVoter.HOUSE_NO}, ${generatedVoter.MAIN_TOWN || generatedVoter.DISTRICT}` : "");
      const address = rawAddress ? rawAddress.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

      const draw = () => {
        // 1. Draw details rows
        let y = 188;
        const drawRow = (label: string, value: string, isAddress = false) => {
          ctx.textAlign = "left";
          ctx.font = "500 12px Arial, sans-serif";
          ctx.fillStyle = "#4b5563";
          ctx.fillText(label, 22, y);
          
          ctx.textAlign = "center";
          ctx.font = "500 16px Arial, sans-serif";
          ctx.fillStyle = "#4b5563";
          ctx.fillText(":", 168, y);
          
          ctx.textAlign = "left";
          ctx.font = "bold 17px Arial, sans-serif";
          ctx.fillStyle = "#000000";
          if (isAddress) {
            const words = value.split(" ");
            let line = "";
            let currentY = y;
            for (let n = 0; n < words.length; n++) {
              let testLine = line + words[n] + " ";
              let testWidth = ctx.measureText(testLine).width;
              if (testWidth > 212 && n > 0) {
                ctx.fillText(line, 188, currentY);
                line = words[n] + " ";
                currentY += 23;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, 188, currentY);
            y = currentY + 25;
          } else {
            ctx.fillText(value, 188, y);
            y += 22;
          }
        };

        drawRow("DATE OF BIRTH", dobString);
        drawRow("AGE", generatedVoter.AGE || "—");
        drawRow("BLOOD GROUP", generatedVoter.BLOOD_GROUP || "—");
        drawRow("ADDRESS", address, true);

        // Contact row
        y += 6;
        ctx.textAlign = "left";
        ctx.font = "500 12px Arial, sans-serif";
        ctx.fillStyle = "#4b5563";
        ctx.fillText("CONTACT", 22, y);
        
        ctx.textAlign = "center";
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#4b5563";
        ctx.fillText(":", 168, y);
        
        ctx.font = "bold 17px Arial, sans-serif";
        const mobileWidth = ctx.measureText(mobile).width;
        ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
        ctx.fillRect(188 - 4, y - 14, mobileWidth + 8, 20);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.fillText(mobile, 188, y);

        // 2. Draw QR Code
        if (imgQr.complete && imgQr.naturalWidth > 0) {
          ctx.drawImage(imgQr, 42, 460, 96, 88);
        }

        // 3. Draw Signature & President details
        if (imgSign.complete && imgSign.naturalWidth > 0) {
          ctx.drawImage(imgSign, 325 - 180 / 2, 405, 180, 75);
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.fillText("SENTHIL KUMAR N", 325, 482);
        ctx.font = "bold 12px Arial, sans-serif";
        ctx.fillText("Founder & State President", 325, 498);
        ctx.fillText("Tamilnadu Vanigargalin Sangamam", 325, 514);

        resolve(canvas);
      };

      // Load Background, QR Code and Signature
      const imgBg = new Image();
      imgBg.crossOrigin = "anonymous";
      imgBg.src = "https://res.cloudinary.com/dqndhcmu2/image/upload/v1773232519/vanigan/templates/ID_Back.png";

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=96x88&data=${encodeURIComponent(mno)}`;
      const imgQr = new Image();
      imgQr.crossOrigin = "anonymous";
      imgQr.src = qrUrl;

      const imgSign = new Image();
      imgSign.crossOrigin = "anonymous";
      imgSign.src = signImg;

      let loaded = 0;
      const handleLoad = () => {
        loaded++;
        if (loaded === 3) {
          const cardRadius = 24;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cardRadius, 0);
          ctx.lineTo(W - cardRadius, 0);
          ctx.quadraticCurveTo(W, 0, W, cardRadius);
          ctx.lineTo(W, H - cardRadius);
          ctx.quadraticCurveTo(W, H, W - cardRadius, H);
          ctx.lineTo(cardRadius, H);
          ctx.quadraticCurveTo(0, H, 0, H - cardRadius);
          ctx.lineTo(0, cardRadius);
          ctx.quadraticCurveTo(0, 0, cardRadius, 0);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(imgBg, 0, 0, W, H);
          draw();
          ctx.restore();
        }
      };
      imgBg.onerror = imgQr.onerror = imgSign.onerror = () => {
        reject(new Error("Error loading back card images."));
      };
      imgBg.onload = imgQr.onload = imgSign.onload = handleLoad;
    });
  };

  const downloadIdCardPng = async () => {
    if (!generatedVoter) return;
    const toastId = toast.loading(
      language === "ta" ? "அடையாள அட்டை படம் உருவாக்கப்படுகிறது..." : "Generating ID Card PNG..."
    );

    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        generateFrontCardCanvas(),
        generateBackCardCanvas(),
      ]);

      const W_front = 421, H_front = 590;
      const W_back = 421, H_back = 590;
      const gap = 20;
      const scale = 3;

      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = (W_front + W_back + gap) * scale;
      combinedCanvas.height = Math.max(H_front, H_back) * scale;
      const combinedCtx = combinedCanvas.getContext("2d")!;

      // Fill background with white
      combinedCtx.fillStyle = "#ffffff";
      combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Draw front card canvas (top-aligned)
      combinedCtx.drawImage(frontCanvas, 0, 0);

      // Draw back card canvas (top-aligned)
      combinedCtx.drawImage(backCanvas, (W_front + gap) * scale, 0);

      const mno = membershipNo(generatedVoter);
      const link = document.createElement("a");
      link.download = `id-card-${mno}.png`;
      link.href = combinedCanvas.toDataURL("image/png");
      link.click();

      toast.dismiss(toastId);
      toast.success(
        language === "ta" ? "அடையாள அட்டை படம் பதிவிறக்கப்பட்டது!" : "ID Card downloaded successfully!"
      );
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        language === "ta"
          ? "அடையாள அட்டைப் படத்தை உருவாக்குவதில் பிழை ஏற்பட்டது."
          : "Error generating ID card image."
      );
      console.error(error);
    }
  };

  const handleShare = (mno: string) => {
    const name = form.name.replace(/\s*-\s*$/, "").trim();
    const text = `சங்கம உறுப்பினர் அட்டை\nPer: ${name}\nMembership: ${mno}\nAssembly: ${form.assembly}, ${form.district}`;
    if (navigator.share) {
      navigator.share({ title: `Sangamam Card — ${name}`, text, url: window.location.href }).catch(() => null);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShareMsg(language === "ta" ? "நகலெடுக்கப்பட்டது / Copied!" : "Copied!");
        setTimeout(() => setShareMsg(""), 2500);
      }).catch(() => null);
    }
  };

  const handleFile = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDocs(prev => ({ ...prev, [key]: file }));
    if (file) toast.success(`${file.name} uploaded ✓`);
  };

  const handleSelfieCapture = () => {
    if (streamRef.current && videoRef.current) {
      setWebcamCapturing(true);
      setTimeout(() => {
        try {
          const video = videoRef.current!;
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const dataUrl = canvas.toDataURL("image/png");
            setTempSelfie(dataUrl);
          }
        } catch (err) {
          setTempSelfie(ownerPhoto);
        } finally {
          setWebcamCapturing(false);
          stopCamera();
        }
      }, 800);
    } else {
      setWebcamCapturing(true);
      setTimeout(() => {
        setTempSelfie(ownerPhoto);
        setWebcamCapturing(false);
      }, 800);
    }
  };

  const handleSelfieConfirm = () => {
    if (tempSelfie) {
      setDocs((prev) => ({ ...prev, selfie: tempSelfie }));
      toast.success(language === "ta" ? "புகைப்படம் வெற்றிகரமாக பதிவேற்றப்பட்டது ✓" : "Photo uploaded successfully ✓");
    }
    setTempSelfie(null);
    setUseWebcam(false);
  };

  const handleSelfieRetake = () => {
    setTempSelfie(null);
  };

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  const docsConfig = [
    { k: "idProof", icon: User, l: "Aadhaar / Voter ID", ta: "அடையாள ஆவணம்", accept: "image/*,application/pdf" },
    { k: "shopPhoto", icon: Building2, l: "Shop Front Photo", ta: "கடை புகைப்படம்", accept: "image/*" },
    { k: "bizProof", icon: FileCheck, l: "Business Proof (GST / License)", ta: "வணிக சான்று", accept: "image/*,application/pdf" },
  ];

  const photoPreview = docs.selfie
    ? (typeof docs.selfie === "string" ? docs.selfie : URL.createObjectURL(docs.selfie as Blob))
    : "";

  const generatedVoter: Voter = {
    ID: 9999,
    ASSEMBLY_NO: "25",
    ASSEMBLY_NAME: form.assembly || "Mylapore",
    PART_NO: "1",
    SECTION_NO: "1",
    SERIAL_NO: "12",
    HOUSE_NO: "",
    VOTER_NAME: form.name,
    RELATION_TYPE: "Father",
    RELATION_NAME: "",
    EPIC_NO: form.epic,
    MOBILE_NUMBER: form.mobile,
    AGE: form.age || "30",
    DOB: form.dob,
    BUSINESS_TYPE: form.type || "Retail",
    GENDER: form.gender || "Male",
    BLOOD_GROUP: form.bloodGroup || "O+",
    PART_NAME: "TNVS Zone",
    POLLING_STATION_NAME: form.address || "",
    POLLING_STATION_ADDRESS: form.address || "",
    MAIN_TOWN: form.district || "CHENNAI",
    WARD: "",
    POST_OFFICE: "",
    POLICE_STATION: "",
    DISTRICT: form.district || "CHENNAI",
    PIN_CODE: "",
    PHOTO_URL: (typeof docs.selfie === "string" ? docs.selfie : "") || ownerPhoto,
  };

  const generatedMno = `TNVS-${form.epic.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6)}12`;

  const customInputClass = "w-full border border-border bg-card text-foreground rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary min-h-[46px] transition-all duration-200 placeholder-slate-400";

  const cardMaxWidth = step === 4 ? "max-w-4xl" : "max-w-6xl";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-12">
      {/* ── Page Header ── */}
      <header className="bg-card text-foreground border-b border-border shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex-1">
            <Breadcrumb
              items={[
                { label: "Services", labelTa: "சேவைகள்", to: "/members" },
                { label: "Membership", labelTa: "உறுப்பினர் சேர்க்கை" },
              ]}
            />
            <div className="flex">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-primary/20">
                Apply · இணைய
              </div>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-ink">
              Member Registration
            </h1>
            <p className="font-tamil text-xs text-muted-foreground mt-1">5 நிமிடங்களில் உறுப்பினராகப் பதிவு செய்யுங்கள்.</p>
          </div>
          {step < 4 && (
            <button
              onClick={clearDraft}
              className="inline-flex items-center gap-1.5 border border-border bg-muted hover:bg-muted/80 text-foreground hover:text-ink px-3.5 py-2 rounded-md text-xs font-semibold transition cursor-pointer self-start sm:self-center shadow-xs active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              {language === "ta" ? "படிவத்தை மீட்டமை" : "Reset Draft"}
            </button>
          )}
        </div>
      </header>

      {/* ── Unified Stepper ── */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-card rounded-md border border-border p-4 md:p-5 shadow-xs">
            {/* Desktop Stepper */}
            <div className="hidden sm:flex items-center justify-between relative text-center">
              {/* Stepper background track line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-105 z-0" />
              {/* Stepper active track line */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 z-0"
                style={{ width: `${((step - 1) / 2) * 88}%` }}
              />

              {STEPS.slice(0, 3).map((s) => {
                const done = step > s.n;
                const active = step === s.n;
                return (
                  <div key={s.n} className="flex flex-col items-center relative z-10 bg-card px-4">
                    <button
                      onClick={() => {
                        if (s.n < step) setStep(s.n);
                      }}
                      disabled={s.n >= step}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                        done
                          ? "bg-primary text-white border-primary cursor-pointer hover:bg-primary/95"
                          : active
                          ? "bg-card border-primary text-primary ring-4 ring-primary/10"
                          : "bg-card border-border text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : <span>{s.n}</span>}
                    </button>
                    <span className={`text-xs font-bold mt-2 ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.t}
                    </span>
                    <span className={`font-tamil text-[10px] mt-0.5 ${active ? "text-primary/80" : done ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
                      {s.ta}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Stepper */}
            <div className="sm:hidden flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="text-primary font-extrabold uppercase tracking-wide">
                  Step {step} of 3: {currentStep.t}
                </span>
                <span className="font-tamil text-muted-foreground font-normal">
                  {currentStep.ta}
                </span>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-full transition-all duration-550 ${
                      step >= i ? "bg-primary" : "bg-muted"
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
        
        <div className={`flex flex-col ${step < 4 ? "lg:flex-row gap-8 items-start" : ""}`}>
          
          {/* Left Column: Form Card Wrapper */}
          <div className={`w-full ${step < 4 ? "lg:flex-1" : ""}`}>
            
            {/* Form Card */}
            <div className="bg-card rounded-md border border-border shadow-xs overflow-hidden transition-all duration-300">
          {/* Step Header inside card */}
          {step < 4 && (
            <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-md bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
                      {currentStep.t}
                    </h2>
                    <p className="font-tamil text-xs text-muted-foreground mt-0.5">{currentStep.ta}</p>
                  </div>
                </div>
                

              </div>

              {/* Spacious Alert Box for description and tip */}
              <div className="mt-6 bg-muted rounded-md px-5 py-4 border border-border space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-muted/40 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <p className="text-xs text-slate-650 leading-relaxed font-medium">{currentStep.desc}</p>
                <p className="font-tamil text-xs text-muted-foreground leading-relaxed">{currentStep.descTa}</p>
                {currentStep.tip && (
                  <div className="mt-3 pt-3 border-t border-border flex items-start gap-2.5">
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
                {/* ─── Step 1: Member Details ─── */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Search Database Box */}
                    <div className="bg-[#F3F6FC]/60 border border-border rounded-md p-5">
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        {language === "ta" ? "உறுப்பினர் தேடல் (விருப்பத்தேர்வு)" : "SEARCH MEMBER DATABASE (OPTIONAL)"}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder={language === "ta" ? "EPIC ID அல்லது பெயரை உள்ளிடவும்..." : "Enter EPIC ID or name..."}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                          className="flex-1 border border-border bg-card rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px]"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="bg-primary text-white hover:bg-[#002060] px-5 py-2 rounded-md text-sm font-semibold transition shrink-0 min-h-[44px] cursor-pointer"
                        >
                          {isSearching 
                            ? (language === "ta" ? "தேடுகிறது..." : "Searching...") 
                            : (language === "ta" ? "தேடுக" : "Search")}
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        {language === "ta"
                          ? "குறிப்பு: 'Senthil Kumar' அல்லது 'RJE1234567' எனத் தட்டச்சு செய்து விவரங்களை மீட்டெடுக்கவும்."
                          : "Tip: Search 'Senthil Kumar' or 'RJE1234567' to load pre-configured voter profiles."}
                      </p>

                      {/* Search Results Dropdown */}
                      {hasSearched && !isSearching && searchResults.length === 0 && (
                        <div className="mt-3 p-3 rounded-sm bg-red-50 border border-red-100 text-center">
                          <p className="text-xs text-red-650 font-medium">
                            {language === "ta" ? "பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை." : "No matching records found."}
                          </p>
                        </div>
                      )}

                      {searchResults.length > 0 && (
                        <div className="mt-3 border border-border bg-card rounded-sm divide-y divide-slate-100 overflow-hidden max-h-48 overflow-y-auto shadow-xs">
                          {searchResults.map((v) => (
                            <button
                              key={v.ID}
                              type="button"
                              onClick={() => selectVoter(v)}
                              className="w-full text-left px-3 py-2.5 hover:bg-muted transition flex justify-between items-center text-xs cursor-pointer"
                            >
                              <div>
                                <span className="font-semibold text-foreground">{v.VOTER_NAME}</span>
                                <span className="text-muted-foreground mx-2">|</span>
                                <span className="font-mono text-primary font-medium">{v.EPIC_NO}</span>
                              </div>
                              <div className="text-muted-foreground text-[10px]">
                                {v.ASSEMBLY_NAME}, {v.DISTRICT}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "முழு பெயர் (Full Name) *" : "Full Name (பெயர்) *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => {
                              const titled = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
                              upd("name", titled);
                            }}
                            className={`${customInputClass} pl-10`}
                            placeholder="e.g. Senthil Kumar / செந்தில் குமார்"
                          />
                        </div>
                      </div>

                      {/* EPIC ID */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "வாக்காளர் அடையாள எண் (EPIC / ID No) *" : "EPIC / ID No *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Hash className="w-4 h-4" />
                          </div>
                          <input
                            required
                            type="text"
                            value={form.epic}
                            onChange={(e) => upd("epic", e.target.value.toUpperCase())}
                            className={`${customInputClass} pl-10`}
                            placeholder="E.G. RJE1234567"
                          />
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "கைபேசி எண் (Mobile Number) *" : "Mobile Number (கைபேசி எண்) *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            required
                            type="tel"
                            maxLength={10}
                            value={form.mobile}
                            onChange={(e) => upd("mobile", e.target.value.replace(/\D/g, ""))}
                            className={`${customInputClass} pl-10`}
                            placeholder="e.g. 9876543210"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "மின்னஞ்சல் முகவரி (Email Address)" : "Email Address (மின்னஞ்சல்)"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => upd("email", e.target.value)}
                            className={`${customInputClass} pl-10`}
                            placeholder="e.g. name@example.com"
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "பிறந்த தேதி (Date of Birth) *" : "Date of Birth (பிறந்த தேதி) *"}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {/* Day Select */}
                          <select
                            required
                            value={form.dob && form.dob.split("-")[2] !== "00" ? form.dob.split("-")[2] : ""}
                            onChange={(e) => handleDobPartChange("day", e.target.value)}
                            className={customInputClass}
                          >
                            <option value="">{language === "ta" ? "நாள் / Day" : "Day"}</option>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>

                          {/* Month Select */}
                          <select
                            required
                            value={form.dob && form.dob.split("-")[1] !== "00" ? form.dob.split("-")[1] : ""}
                            onChange={(e) => handleDobPartChange("month", e.target.value)}
                            className={customInputClass}
                          >
                            <option value="">{language === "ta" ? "மாதம் / Month" : "Month"}</option>
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => {
                              const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                              const monthNamesTa = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];
                              return (
                                <option key={m} value={m}>
                                  {language === "ta" ? monthNamesTa[parseInt(m) - 1] : monthNamesEn[parseInt(m) - 1]}
                                </option>
                              );
                            })}
                          </select>

                          {/* Year Select */}
                          <select
                            required
                            value={form.dob && form.dob.split("-")[0] !== "0000" ? form.dob.split("-")[0] : ""}
                            onChange={(e) => handleDobPartChange("year", e.target.value)}
                            className={customInputClass}
                          >
                            <option value="">{language === "ta" ? "ஆண்டு / Year" : "Year"}</option>
                            {Array.from({ length: 103 }, (_, i) => String(todayDate.getFullYear() - 18 - i)).map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Age */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "வயது (Age) *" : "Age (வயது) *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Clock className="w-4 h-4" />
                          </div>
                          <input
                            required
                            readOnly
                            type="number"
                            min="18"
                            max="120"
                            value={form.age}
                            className={`${customInputClass} pl-10 bg-muted text-muted-foreground cursor-not-allowed`}
                            placeholder="Age"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "பாலினம் (Gender)" : "Gender (பாலினம்)"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <User className="w-4 h-4" />
                          </div>
                          <select
                            value={form.gender}
                            onChange={(e) => upd("gender", e.target.value)}
                            className={`${customInputClass} pl-10`}
                          >
                            <option value="Male">{language === "ta" ? "ஆண் / Male" : "Male"}</option>
                            <option value="Female">{language === "ta" ? "பெண் / Female" : "Female"}</option>
                            <option value="Other">{language === "ta" ? "இதர / Other" : "Other"}</option>
                          </select>
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "இரத்த வகை (Blood Group)" : "Blood Group (இரத்த வகை)"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Heart className="w-4 h-4" />
                          </div>
                          <select
                            value={form.bloodGroup}
                            onChange={(e) => upd("bloodGroup", e.target.value)}
                            className={`${customInputClass} pl-10`}
                          >
                            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Shop Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "கடை / வணிகப் பெயர் (Shop / Business Name) *" : "Shop / Business Name (கடை பெயர்) *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <input
                            required
                            type="text"
                            value={form.shop}
                            onChange={(e) => upd("shop", e.target.value)}
                            className={`${customInputClass} pl-10`}
                            placeholder="e.g. Senthil Traders / செந்தில் டிரேடர்ஸ்"
                          />
                        </div>
                      </div>

                      {/* Business Type */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "வணிக வகை (Business Type)" : "Business Type (வணிக வகை)"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <select
                            value={form.type}
                            onChange={(e) => upd("type", e.target.value)}
                            className={`${customInputClass} pl-10`}
                          >
                            {["Retail", "Wholesale", "Manufacturing", "Service", "Online"].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "வணிக அனுபவம் (Years in Business)" : "Years in Business (அனுபவம்)"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Clock className="w-4 h-4" />
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={form.years}
                            onChange={(e) => upd("years", e.target.value)}
                            className={`${customInputClass} pl-10`}
                            placeholder="Years"
                          />
                        </div>
                      </div>

                      {/* Assembly Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "தொகுதி (Assembly Name)" : "Assembly Name (தொகுதி)"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={form.assembly}
                            onChange={(e) => upd("assembly", e.target.value)}
                            className={`${customInputClass} pl-10`}
                            placeholder="e.g. Mylapore / மயிலாப்பூர்"
                          />
                        </div>
                      </div>

                      {/* District */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "மாவட்டம் (District) *" : "District (மாவட்டம்) *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <select
                            value={form.district}
                            onChange={(e) => upd("district", e.target.value)}
                            className={`${customInputClass} pl-10`}
                          >
                            {DISTRICTS.map(d => (
                              <option key={d.en} value={d.en}>
                                {language === "ta" ? `${d.ta} / ${d.en}` : `${d.en} / ${d.ta}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Business Wing */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "வணிகப் பிரிவு (Business Wing) *" : "Business Wing / பிரிவு *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <select
                            value={form.wing}
                            onChange={(e) => upd("wing", e.target.value)}
                            className={`${customInputClass} pl-10`}
                          >
                            <option value="">{language === "ta" ? "-- வணிகப் பிரிவைத் தேர்ந்தெடுக்கவும் --" : "-- Select Your Business Wing --"}</option>
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
                          </select>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {language === "ta" ? "முகவரி (Address) *" : "Address (முகவரி) *"}
                        </label>
                        <div className="relative rounded-md shadow-xs">
                          <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <textarea
                            required
                            rows={3}
                            value={form.address}
                            onChange={(e) => upd("address", e.target.value)}
                            className="w-full border border-border bg-card text-foreground rounded-md pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-slate-400"
                            placeholder={language === "ta" ? "முகவரி (எ.கா. கதவு எண், தெரு பெயர், ஊர், பின்கோடு)..." : "Full address (e.g. கதவு எண், தெரு பெயர், ஊர், பின்கோடு)..."}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 2: Upload Photo ─── */}
                {step === 2 && (
                  <div className="space-y-6 flex flex-col items-center">
                    {/* Search Database Box (kept consistent at top) */}
                    <div className="w-full bg-[#F3F6FC]/60 border border-border rounded-md p-5 mb-4">
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        {language === "ta" ? "உறுப்பினர் தேடல் (விருப்பத்தேர்வு)" : "SEARCH MEMBER DATABASE (OPTIONAL)"}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder={language === "ta" ? "EPIC ID அல்லது பெயரை உள்ளிடவும்..." : "Enter EPIC ID or name..."}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                          className="flex-1 border border-border bg-card rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px]"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="bg-primary text-white hover:bg-[#002060] px-5 py-2 rounded-md text-sm font-semibold transition shrink-0 min-h-[44px] cursor-pointer"
                        >
                          {isSearching 
                            ? (language === "ta" ? "தேடுகிறது..." : "Searching...") 
                            : (language === "ta" ? "தேடுக" : "Search")}
                        </button>
                      </div>
                    </div>

                    <div className="w-full max-w-lg border-2 border-dashed border-border bg-muted/20 rounded-md p-8 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary/50">
                      
                      {/* Circular Photo Container */}
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary shadow-xs flex items-center justify-center bg-muted mb-6">
                        {docs.selfie ? (
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground flex flex-col items-center justify-center">
                            <User className="w-14 h-14 text-muted-foreground" />
                            <span className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wider">Photo</span>
                          </div>
                        )}
                        {docs.selfie && (
                          <button
                            type="button"
                            onClick={() => setDocs(prev => ({ ...prev, selfie: null }))}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity font-bold cursor-pointer border-none"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      {/* Upload and Capture Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
                        <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#002060] text-white px-5 py-2.5 rounded-md text-sm font-semibold transition shadow-xs min-h-[48px] flex-1 text-center">
                          <Upload className="w-4 h-4" />
                          {language === "ta" ? "பதிவேற்று" : "Upload Photo (உரிமையாளர் படம்)"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error(language === "ta" ? "புகைப்படம் 5MB-க்குள் இருக்க வேண்டும்" : "Photo must be under 5MB");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setDocs(prev => ({ ...prev, selfie: reader.result as string }));
                                toast.success(language === "ta" ? "புகைப்படம் வெற்றிகரமாக பதிவேற்றப்பட்டது ✓" : "Photo uploaded successfully ✓");
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => setUseWebcam(true)}
                          className="inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-5 py-2.5 rounded-md text-sm font-semibold transition shadow-xs min-h-[48px] flex-1 cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-slate-550" />
                          {language === "ta" ? "கேமரா" : "Take Photo (Camera)"}
                        </button>
                      </div>

                      {/* Photo Quality Guide */}
                      <div className="w-full max-w-sm mt-4 rounded-md border border-border overflow-hidden text-left shadow-xs">
                        <div className="bg-primary px-4 py-2 flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                          <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                            {language === "ta" ? "புகைப்பட வழிகாட்டி" : "Photo Quality Guide"}
                          </p>
                        </div>
                        <div className="bg-card px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                          {[
                            { ok: true,  text: language === "ta" ? "பாஸ்போர்ட் அளவு" : "Passport-size portrait" },
                            { ok: false, text: language === "ta" ? "இருட்டான / மங்கலான" : "Dark or blurry selfies" },
                            { ok: true,  text: language === "ta" ? "வெளிர் பின்னணி" : "Light / neutral background" },
                            { ok: false, text: language === "ta" ? "நிறைந்த பின்னணி" : "Busy background" },
                            { ok: true,  text: language === "ta" ? "முகம் மையத்தில்" : "Face centered, well-lit" },
                            { ok: false, text: language === "ta" ? "கண்ணாடி / தொப்பி" : "Glasses / cap / tilt" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className={`mt-0.5 text-[10px] font-extrabold shrink-0 ${item.ok ? "text-emerald-500" : "text-red-400"}`}>
                                {item.ok ? "✓" : "✗"}
                              </span>
                              <p className={`text-[10px] leading-snug ${ item.ok ? "text-foreground" : "text-muted-foreground"}`}>{item.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-primary/10 border-t border-amber-100 px-4 py-2">
                          <p className="text-[10px] text-amber-700 font-medium">
                            {language === "ta"
                              ? "அதிகபட்சம் 5MB · JPG, PNG, WebP"
                              : "Max 5 MB · Formats: JPG, PNG, WebP"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 3: Review & Security ─── */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Document Upload section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {docsConfig.map(doc => {
                        const DocIcon = doc.icon;
                        const uploaded = docs[doc.k];
                        return (
                          <div
                            key={doc.k}
                            className={`relative rounded-md border-2 transition-all duration-300 overflow-hidden group shadow-xs ${
                              uploaded
                                ? "border-emerald-300 bg-primary/10/40"
                                : "border-dashed border-border hover:border-primary/50 hover:bg-background hover:scale-[1.01]"
                            }`}
                          >
                            <div className="p-4 flex flex-col justify-between h-full min-h-[140px]">
                              {/* Header */}
                              <div className="flex items-start gap-2.5">
                                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 ${uploaded ? "bg-emerald-100 text-emerald-600 scale-105" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                                  {uploaded ? <Check className="w-4 h-4" /> : <DocIcon className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold text-foreground leading-tight">{doc.l}</div>
                                  <div className="font-tamil text-[10px] text-muted-foreground mt-0.5">{doc.ta}</div>
                                </div>
                              </div>

                              {/* Upload Action/Status Area */}
                              <div className="mt-4">
                                {uploaded ? (
                                  <div className="text-[11px] text-emerald-800 font-bold bg-emerald-100/70 border border-emerald-200/50 px-2.5 py-1.5 rounded-sm flex items-center justify-between gap-1.5 animate-fadeIn">
                                    <span className="truncate max-w-[80%]">
                                      {typeof uploaded === "string" ? "Uploaded ✓" : (uploaded as File).name}
                                    </span>
                                    <label className="text-primary hover:underline cursor-pointer shrink-0 text-[9px] font-bold uppercase tracking-wider bg-card px-1.5 py-0.5 rounded border border-border shadow-xs">
                                      Change
                                      <input
                                        type="file"
                                        accept={doc.accept}
                                        className="hidden"
                                        onChange={handleFile(doc.k)}
                                      />
                                    </label>
                                  </div>
                                ) : (
                                  <label className="w-full inline-flex justify-center items-center gap-1.5 border border-border bg-card hover:bg-muted text-foreground px-3 py-1.5 rounded-sm text-xs font-semibold transition cursor-pointer shadow-xs">
                                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                                    {language === "ta" ? "கோப்பைத் தேர்ந்தெடு" : "Choose File"}
                                    <input
                                      type="file"
                                      accept={doc.accept}
                                      className="hidden"
                                      onChange={handleFile(doc.k)}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Review Details Card */}
                    <div className="border-t border-border pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-lg font-bold text-ink">Review Your Details</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal & Contact Summary Card */}
                        <div className="bg-muted rounded-md border border-border p-5 space-y-4 shadow-xs">
                          <div className="flex justify-between items-center pb-2.5 border-b border-border">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold text-foreground">Personal Details</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-xs text-primary font-extrabold hover:underline cursor-pointer border-none bg-transparent"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              { label: "Full Name", value: form.name || "—" },
                              { label: "EPIC ID / No", value: form.epic || "—" },
                              { label: "Mobile", value: form.mobile || "—" },
                              { label: "Email", value: form.email || "—" },
                              { label: "DOB", value: form.dob || "—" },
                              { label: "Age / Gender / Blood", value: `${form.age || "—"} yrs / ${form.gender} / ${form.bloodGroup}` },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-card rounded-md p-3 border border-border shadow-xs">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
                                <div className="text-xs text-foreground font-bold mt-1.5 break-all">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Business Summary Card */}
                        <div className="bg-muted rounded-md border border-border p-5 space-y-4 shadow-xs">
                          <div className="flex justify-between items-center pb-2.5 border-b border-border">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold text-foreground">Business Details</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-xs text-primary font-extrabold hover:underline cursor-pointer border-none bg-transparent"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              { label: "Shop Name", value: form.shop || "—" },
                              { label: "Type", value: form.type },
                              { label: "Wing / Division", value: WINGS.find(w => w.id === form.wing)?.[language === "ta" ? "nameTa" : "nameEn"] || "—" },
                              { label: "Experience", value: form.years ? `${form.years} Years` : "—" },
                              { label: "Assembly", value: form.assembly || "—" },
                              { label: "District", value: form.district },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-card rounded-md p-3 border border-border shadow-xs">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
                                <div className="text-xs text-foreground font-bold mt-1.5 break-all">{value}</div>
                              </div>
                            ))}
                          </div>
                          {form.address && (
                            <div className="bg-card rounded-md p-3 border border-border shadow-xs">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Shop Address</div>
                              <div className="text-xs text-foreground font-bold mt-1.5 leading-relaxed">{form.address}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security PIN Section */}
                    <div className="border-t border-border pt-6">
                      <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1 rounded-sm bg-primary/10 text-primary">
                            <Lock className="w-4 h-4" />
                          </div>
                          <label className="text-sm font-extrabold text-ink">
                            {language === "ta" ? "பாதுகாப்பு PIN குறியீட்டை உருவாக்கவும்" : "Create Security PIN"}
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-tamil">
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
                                  className={`w-12 h-14 rounded-md border-2 text-xl font-extrabold flex items-center justify-center transition-all duration-300 ${
                                    isFocused
                                      ? "border-primary ring-4 ring-primary/15 scale-105 bg-card shadow-xs shadow-primary/5"
                                      : char
                                      ? "border-emerald-400 bg-primary/10 text-emerald-850"
                                      : "border-border bg-muted text-muted-foreground"
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

                    {/* Membership Info Card (No Pricing or Amount) */}
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-950 rounded-md p-6 text-white relative overflow-hidden shadow-xs">
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                      <div className="absolute top-0 right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-emerald-400" />
                            <span className="font-extrabold text-sm text-foreground tracking-wide uppercase">{language === "ta" ? "சங்க உறுப்பினர் பதிவு" : "TNVS Member Registry"}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{language === "ta" ? "டிஜிட்டல் உறுப்பினர் அட்டை மற்றும் வணிகப் பிரிவு அணுகலை உள்ளடக்கியது" : "Official registration with digital membership pass and selected trade wing division access."}</p>
                        </div>
                      </div>
                      
                      <div className="h-px bg-slate-800/80 my-4" />
                      
                      <div className="flex flex-col sm:flex-row justify-between gap-3 text-[11px] text-muted-foreground relative z-10">
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" /> {language === "ta" ? "உடனடி டிஜிட்டல் அட்டை உருவாக்கம்" : "Instant Digital ID Generation"}
                        </span>
                        <span className="bg-slate-800 px-2.5 py-1 rounded-md text-[10px] text-emerald-300 font-bold border border-slate-700/50">
                          {language === "ta" ? "பாதுகாப்பான தரவு சேமிப்பு" : "Secure Member Database"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 4: Success & ID Card ─── */}
                {step === 4 && (
                  <div className="py-6 flex flex-col items-center animate-fadeIn">
                    {/* Success badge */}
                    <div className="text-center max-w-md mx-auto mb-8">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto shadow-xs">
                          <Check className="w-10 h-10" />
                        </div>
                        <div className="absolute -right-1 -top-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-xs">
                          <Star className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                      <h2 className="mt-6 font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">Registration Complete!</h2>
                      <p className="font-tamil text-sm text-muted-foreground mt-1.5">உறுப்பினர் பதிவு வெற்றிகரமாக முடிந்தது.</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Welcome to the Tamil Nadu Vanigargalin Sangamam community.</p>
                    </div>

                    {/* Both card faces display */}
                    <div className="w-full max-w-md bg-muted border border-border rounded-md p-6 mb-8 flex flex-col items-center gap-6 shadow-xs">
                      <div className="w-full">
                        <p className="text-xs font-semibold text-slate-550 uppercase tracking-widest mb-2 text-center">முன்பக்கம் · FRONT</p>
                        <div ref={frontRef} className="card-scale-wrapper">
                          <div className="responsive-card-scale">
                            <VoterIdCard voter={generatedVoter} template="front" />
                          </div>
                        </div>
                      </div>
                      <div className="w-full border-t border-border pt-5">
                        <p className="text-xs font-semibold text-slate-550 uppercase tracking-widest mb-2 text-center">பின்பக்கம் · BACK</p>
                        <div ref={backRef} className="card-scale-wrapper">
                          <div className="responsive-card-scale">
                            <VoterIdCard voter={generatedVoter} template="back" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps info */}
                    <div className="w-full max-w-md bg-muted border border-border rounded-md p-5 mb-8 space-y-3 shadow-xs">
                      <div className="text-xs font-bold text-foreground uppercase tracking-wider pb-1.5 border-b border-border">What's Next?</div>
                      {[
                        { text: "Download your PDF Membership Certificate", ta: "உறுப்பினர் சான்றிதழை பதிவிறக்கவும்", done: true },
                        { text: "View and edit your profile on the dashboard", ta: "டாஷ்போர்டில் உங்கள் சுயவிவரத்தை பாருங்கள்", done: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs text-slate-650">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                            {item.done ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground">{language === "ta" ? item.ta : item.text}</p>
                            <p className="text-[10px] text-muted-foreground">{i === 0 ? "Generate high-resolution printable pass" : "Manage your wings and local constituencies"}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="flex flex-col gap-3 w-full max-w-md">
                      {shareMsg && <span className="text-xs text-primary font-medium w-full text-center block mb-1">{shareMsg}</span>}
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                          onClick={downloadCertificate}
                          className="btn-primary flex-1 justify-center py-3 rounded-md text-xs font-bold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" /> Download Certificate
                        </button>
                        <button
                          onClick={handlePrint}
                          className="btn-secondary flex-1 justify-center py-3 rounded-md text-xs font-bold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" /> Print / PDF Card
                        </button>
                      </div>

                      <button
                        onClick={downloadIdCardPng}
                        className="btn-primary w-full justify-center py-3 rounded-md text-xs font-bold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> Download ID Card (PNG)
                      </button>

                      <button
                        onClick={() => handleShare(generatedMno)}
                        className="bg-muted hover:bg-muted/80 text-foreground w-full justify-center py-3 rounded-md text-xs font-bold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5 border border-border"
                      >
                        <Share2 className="w-4 h-4" /> Share Registration Info
                      </button>
                    </div>
                    <div className="w-full max-w-md mt-4 text-center">
                      <Link
                        to="/dashboard"
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> Go to Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation Buttons ── */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                <button
                  onClick={back}
                  disabled={step === 1 || submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition cursor-pointer rounded-md border-none bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={step === 3 ? handlePaySubmit : next}
                    disabled={submitting}
                    className="btn-primary py-2.5 px-5 rounded-md text-xs font-bold cursor-pointer hover:shadow-xs transition duration-200 flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                    ) : step === 3 ? (
                      <>{language === "ta" ? "பதிவைச் சமர்ப்பி" : "Submit Registration"} <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>{language === "ta" ? "தொடரவும்" : "Continue"} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Unity Banner */}
      {step < 4 && (
        <div className="w-full lg:w-80 shrink-0 bg-card rounded-md border border-border p-5 flex flex-col items-center gap-5 shadow-xs overflow-hidden">
          <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md overflow-hidden relative">
            <img 
              src={unityHands} 
              alt="Unity" 
              className="w-[70%] h-[70%] object-contain animate-slow-spin" 
            />
          </div>
          <div className="space-y-1.5 text-center lg:text-left">
            <h3 className="font-display font-bold text-base text-foreground leading-tight">
              {t("வணிகர்கள் சங்கமம் — ஒற்றுமையே வலிமை", "Traders Union — Unity is Strength")}
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed font-tamil">
              {t(
                "நமக்குள் இருக்கும் கருத்து வேறுபாடுகளைக் களைந்து, ஒற்றுமையுடன் செயல்பட்டு நமது உரிமைகளைப் பாதுகாப்போம்.",
                "Let us set aside our differences, work together in unity, and protect our rights and business interests."
              )}
            </p>
          </div>
        </div>
      )}

    </div>

  </div>

      {/* ── Webcam Modal ── */}
      {useWebcam && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs grid place-items-center p-4">
          <div className="bg-card rounded-md p-5 max-w-sm w-full text-center space-y-4 shadow-2xl border border-border animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-foreground">Selfie Camera Scanner</span>
              </div>
              <button onClick={() => setUseWebcam(false)} className="text-muted-foreground hover:text-muted-foreground text-xs font-semibold border-none bg-transparent cursor-pointer">✕ Close</button>
            </div>
            <div className="aspect-square bg-black rounded-md relative overflow-hidden flex items-center justify-center">
              {tempSelfie ? (
                <img
                  src={tempSelfie}
                  alt="Captured Selfie"
                  className="w-full h-full object-cover"
                />
              ) : !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs block">Camera Access Blocked / Unavailable</span>
                  <span className="text-muted-foreground text-[10px] mt-1 block">Simulating fallback capture...</span>
                </div>
              )}
              
              {!tempSelfie && (
                <>
                  <div className="w-40 h-40 rounded-full border-4 border-dashed border-primary/60 animate-pulse absolute pointer-events-none" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/40 -translate-y-1/2 animate-bounce pointer-events-none" />
                </>
              )}
              {webcamCapturing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span>Scanning Face...</span>
                </div>
              )}
            </div>
            {tempSelfie ? (
              <p className="text-xs text-muted-foreground font-tamil leading-relaxed">
                {language === "ta" 
                  ? "புகைப்படம் உங்களுக்கு திருப்தியா? அல்லது மீண்டும் எடுக்க வேண்டுமா?" 
                  : "Are you satisfied with this photo? Or would you like to retake it?"}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {language === "ta" 
                  ? "உங்கள் முகத்தை வட்டத்திற்குள் நேராக வைக்கவும்" 
                  : "Align your face inside the scanning circle"}
              </p>
            )}
            {tempSelfie ? (
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={handleSelfieConfirm}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 justify-center py-2.5 rounded-md font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-xs transition active:scale-98"
                >
                  <Check className="w-4 h-4" /> {language === "ta" ? "சரி / OK" : "OK"}
                </button>
                <button
                  type="button"
                  onClick={handleSelfieRetake}
                  className="bg-muted hover:bg-muted text-foreground flex-1 justify-center py-2.5 rounded-md font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-border shadow-xs transition active:scale-98"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {language === "ta" ? "மீண்டும் எடு" : "Retake Photo"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSelfieCapture}
                disabled={webcamCapturing}
                className="btn-primary w-full justify-center cursor-pointer py-2.5 rounded-md font-bold"
              >
                {webcamCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {language === "ta" ? "புகைப்படம் எடு" : "Capture Photo"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
