import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, MapPin, Building2, Hash,
  Phone, Share2, User, UserPlus, Upload, Camera, ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { toast } from "sonner";
import { Section, SectionLabel } from "@/components/Section";
import { VoterIdCard, type Voter } from "@/components/VoterIdCard";
import votersData from "@/data/voters.json";
import { FieldError } from "@/components/FieldError";
import { Skeleton } from "@/components/Skeleton";

export const Route = createFileRoute("/voter-id")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: search.q ? (search.q as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sangamam Membership Card · TNVS Portal" },
      { name: "description", content: "Generate Tamilnadu Vanigargalin Sangamam membership ID cards." },
    ],
  }),
  component: VoterIdPage,
});

function VoterIdPage() {
  const { t, language } = useLanguage();
  const { q } = Route.useSearch();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Voter[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(true);
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [isCompilingCard, setIsCompilingCard] = useState(false);

  const [formData, setFormData] = useState<Partial<Voter>>({
    VOTER_NAME: "",
    EPIC_NO: "",
    MOBILE_NUMBER: "",
    POLLING_STATION_ADDRESS: "",
    PHOTO_URL: "",
    AGE: "",
    DOB: "",
    GENDER: "Male",
    BLOOD_GROUP: "O+",
    ASSEMBLY_NAME: "",
    DISTRICT: "Chennai",
    BUSINESS_TYPE: "Retail",
  });

  const handleFieldChange = (field: keyof Voter, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === "DOB" && value) {
        const birthDate = new Date(value);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          if (calculatedAge >= 0 && calculatedAge <= 120) {
            next.AGE = calculatedAge.toString();
            if (errors.AGE) {
              setErrors(errs => {
                const nextErrs = { ...errs };
                delete nextErrs.AGE;
                return nextErrs;
              });
            }
          }
        }
      }
      return next;
    });
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const [selected, setSelected] = useState<Voter | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("புகைப்படம் 5MB-க்குள் இருக்க வேண்டும்", "Photo must be under 5MB"));
        return;
      }
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        toast.error(t("தயவுசெய்து JPG, PNG அல்லது WebP படத்தை பதிவேற்றவும்", "Please upload a JPG, PNG or WebP image"));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, PHOTO_URL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const populateForm = (v: Voter) => {
    let fallbackDob = "";
    if (v.AGE) {
      const birthYear = new Date().getFullYear() - parseInt(v.AGE);
      fallbackDob = `${birthYear}-01-01`;
    }

    setFormData({
      VOTER_NAME: v.VOTER_NAME,
      RELATION_TYPE: v.RELATION_TYPE || "Father",
      RELATION_NAME: v.RELATION_NAME || "",
      EPIC_NO: v.EPIC_NO,
      MOBILE_NUMBER: v.MOBILE_NUMBER || "",
      AGE: v.AGE,
      DOB: v.DOB || fallbackDob,
      GENDER: v.GENDER || "Male",
      BLOOD_GROUP: v.BLOOD_GROUP || "O+",
      HOUSE_NO: v.HOUSE_NO || "",
      POLLING_STATION_ADDRESS: v.POLLING_STATION_ADDRESS || "",
      ASSEMBLY_NAME: v.ASSEMBLY_NAME || "",
      DISTRICT: v.DISTRICT || "",
      PIN_CODE: v.PIN_CODE || "",
      PHOTO_URL: v.PHOTO_URL || "",
    });
    setErrors({});
    setShowForm(true);
    toast.success(t("விவரங்கள் தானாக நிரப்பப்பட்டன", "Details populated successfully!"));
  };

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      const autoSearch = async () => {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/voter-search?epic=${encodeURIComponent(q)}`);
          if (!res.ok) throw new Error("API failed");
          const data = await res.json();
          if (data.voters && data.voters.length > 0) {
            populateForm(data.voters[0]);
            return;
          }
        } catch (err) {
          // Fallback to client-side local search
          const match = (votersData as Voter[]).find(v => v.EPIC_NO?.toUpperCase() === q.toUpperCase());
          if (match) {
            populateForm(match);
          }
        } finally {
          setIsSearching(false);
        }
      };
      autoSearch();
    }
  }, [q]);

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
          toast.info(t("பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை", "No matching records found"));
          setShowForm(true);
        }
        return;
      }
    } catch (err) {
      // Fallback to client-side local search
      const queryLower = queryTerm.toLowerCase();
      const isEpic = /^[a-zA-Z0-9]{3,20}$/.test(queryTerm);
      const filtered = (votersData as Voter[]).filter(v => {
        if (isEpic) {
          return v.EPIC_NO?.toLowerCase() === queryLower;
        } else {
          return v.VOTER_NAME?.toLowerCase().includes(queryLower);
        }
      });
      setSearchResults(filtered);
      if (filtered.length === 0) {
        toast.info(t("பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை", "No matching records found"));
        setShowForm(true);
      }
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const selectVoter = (v: Voter) => {
    populateForm(v);
    setSearchResults([]);
    setSearchQuery("");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const name = (formData.VOTER_NAME || "").trim();
    const epic = (formData.EPIC_NO || "").trim();
    const age = (formData.AGE || "").trim();
    const dob = (formData.DOB || "").trim();
    const mobile = (formData.MOBILE_NUMBER || "").trim();
    const assembly = (formData.ASSEMBLY_NAME || "").trim();
    const district = (formData.DISTRICT || "").trim();
    const address = (formData.POLLING_STATION_ADDRESS || "").trim();

    if (!name) {
      newErrors.VOTER_NAME = t("தயவுசெய்து உங்கள் முழுப் பெயரை உள்ளிடவும்", "Please enter your full name");
    } else if (!/^[a-zA-Z\s.\u0B80-\u0BFF]+$/.test(name)) {
      newErrors.VOTER_NAME = t("பெயரில் எழுத்துக்கள் மற்றும் இடைவெளிகள் மட்டுமே இருக்க வேண்டும்", "Full name can only contain letters, dots, and spaces");
    }

    if (!epic) {
      newErrors.EPIC_NO = t("தயவுசெய்து EPIC / ID எண்ணை உள்ளிடவும்", "Please enter EPIC / ID No");
    } else if (!/^[a-zA-Z]{3}\d{7}$/.test(epic)) {
      newErrors.EPIC_NO = t(
        "EPIC எண் வடிவத்தில் இருக்க வேண்டும்: முதல் 3 எழுத்துக்கள் மற்றும் அடுத்த 7 எண்கள் (எ.கா: RJE1234567)",
        "EPIC No must be in the format: first 3 letters followed by 7 digits (e.g. RJE1234567)"
      );
    }

    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.MOBILE_NUMBER = t("சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்", "Mobile number must be a valid 10-digit number starting with 6-9");
    }

    if (!dob) {
      newErrors.DOB = t("தயவுசெய்து உங்கள் பிறந்த தேதியை உள்ளிடவும்", "Please enter your date of birth");
    }

    if (!age) {
      newErrors.AGE = t("தயவுசெய்து உங்கள் வயதை உள்ளிடவும்", "Please enter your age");
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        newErrors.AGE = t("வயது 18 முதல் 120 வரை இருக்க வேண்டும்", "Age must be between 18 and 120");
      }
    }

    if (assembly && !/^[a-zA-Z\s.\u0B80-\u0BFF]+$/.test(assembly)) {
      newErrors.ASSEMBLY_NAME = t("தொகுதி பெயரில் எழுத்துக்கள் மற்றும் இடைவெளிகள் மட்டுமே இருக்க வேண்டும்", "Assembly name should contain only letters, dots, and spaces");
    }

    if (district && !/^[a-zA-Z\s.\u0B80-\u0BFF]+$/.test(district)) {
      newErrors.DISTRICT = t("மாவட்ட பெயரில் எழுத்துக்கள் மற்றும் இடைவெளிகள் மட்டுமே இருக்க வேண்டும்", "District should contain only letters, dots, and spaces");
    }

    if (!address) {
      newErrors.POLLING_STATION_ADDRESS = t("தயவுசெய்து உங்கள் முகவரியை உள்ளிடவும்", "Please enter your address");
    }

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstErrorField = errorKeys[0];
      toast.error(newErrors[firstErrorField]);
      return false;
    }

    return true;
  };

  const handleDetailsNext = () => {
    if (validate()) {
      setFormStep(2);
    }
  };

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.PHOTO_URL) {
      toast.error(t("தயவுசெய்து புகைப்படத்தை பதிவேற்றவும்", "Please upload a photo"));
      return;
    }

    if (!validate()) return;
    
    // Auto-generate some required placeholder fields for the card design
    const generatedVoter: Voter = {
      ID: Math.floor(Math.random() * 10000),
      ASSEMBLY_NO: "25",
      ASSEMBLY_NAME: formData.ASSEMBLY_NAME || "Mylapore",
      PART_NO: "1",
      SECTION_NO: "1",
      SERIAL_NO: Math.floor(Math.random() * 100).toString(),
      HOUSE_NO: formData.HOUSE_NO || "",
      VOTER_NAME: formData.VOTER_NAME || "",
      RELATION_TYPE: formData.RELATION_TYPE || "Father",
      RELATION_NAME: formData.RELATION_NAME || "",
      EPIC_NO: formData.EPIC_NO || "RJE" + Math.floor(Math.random() * 10000000),
      MOBILE_NUMBER: formData.MOBILE_NUMBER || "",
      AGE: formData.AGE || "30",
      DOB: formData.DOB || "",
      BUSINESS_TYPE: formData.BUSINESS_TYPE || "Retail",
      GENDER: formData.GENDER || "Male",
      BLOOD_GROUP: formData.BLOOD_GROUP || "O+",
      PART_NAME: "TNVS Zone",
      POLLING_STATION_NAME: formData.POLLING_STATION_ADDRESS || "Chennai",
      POLLING_STATION_ADDRESS: formData.POLLING_STATION_ADDRESS || "",
      MAIN_TOWN: formData.DISTRICT || "CHENNAI",
      WARD: "",
      POST_OFFICE: "",
      POLICE_STATION: "",
      DISTRICT: formData.DISTRICT || "CHENNAI",
      PIN_CODE: formData.PIN_CODE || "600000",
      PHOTO_URL: formData.PHOTO_URL,
    };
    
    setIsCompilingCard(true);
    setSelected(generatedVoter);
    
    setTimeout(() => {
      setIsCompilingCard(false);
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }, 800);
  };

  const mno = (v: Voter) =>
    `TNVS-${v.EPIC_NO.replace(/[^A-Z0-9]/gi,"").toUpperCase().slice(-6)}${parseInt(v.SERIAL_NO||"1").toString(16).padStart(2,"0").toUpperCase()}`;

  const handlePrint = () => {
    if (!frontRef.current || !backRef.current || !selected) return;
    const name = selected.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
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
              width: 2.125in;
              height: 3.375in;
              position: relative;
              overflow: hidden;
              background: transparent;
              box-shadow: 0 8px 24px rgba(56, 42, 38, 0.12);
              border-radius: 12px;
              page-break-inside: avoid;
            }
            .card-wrapper,
            .card-wrapper * {
              box-sizing: border-box;
            }
            .card-wrapper > div,
            .card-wrapper > div > div,
            .card-wrapper > div > div > div {
              width: 960px !important;
              height: 1520px !important;
              transform: none !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
            }
            .card-wrapper > div {
              transform: scale(calc(2.125 * 96 / 960)) !important;
              transform-origin: top left !important;
            }
            .card-wrapper > div > div > div > div {
              width: 240px !important;
              height: 380px !important;
              transform: scale(4) !important;
              transform-origin: top left !important;
              box-shadow: none !important;
              overflow: hidden !important;
            }
            @media print {
              @page {
                size: auto;
                margin: 0mm;
              }
              body { 
                background: #fff; 
                min-height: auto;
                padding: 10mm;
                gap: 15mm;
              }
              .card-wrapper {
                box-shadow: none;
                border-radius: 0;
                page-break-inside: avoid;
              }
              /* Ensure colored backgrounds print correctly */
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

  const handleShare = async () => {
    if (!selected) return;
    const name = selected.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
    const text = `சங்கம உறுப்பினர் அட்டை\nPer: ${name}\nMembership: ${mno(selected)}\nAssembly: ${selected.ASSEMBLY_NAME}, ${selected.DISTRICT}`;
    if (navigator.share) {
      await navigator.share({ title: `Sangamam Card — ${name}`, text, url: window.location.href }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(text).catch(() => null);
      setShareMsg("நகலெடுக்கப்பட்டது / Copied!");
      setTimeout(() => setShareMsg(""), 2500);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-12 w-full">
          <div className="mb-3 sm:mb-4">
            <Breadcrumb
              items={[
                { label: "Services", labelTa: "சேவைகள்", to: "/services" },
                { label: "Member Card", labelTa: "உறுப்பினர் அட்டை" },
              ]}
            />
          </div>
          <SectionLabel>தமிழ்நாடு வணிகர்களின் சங்கமம்</SectionLabel>
          <h1 className="mt-3 font-display font-semibold text-ink">
            Sangamam Membership Card Generator
          </h1>
          <p className="font-tamil text-base sm:text-lg text-foreground/70 mt-1">சங்கம அட்டை உருவாக்கி</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl font-tamil leading-relaxed">
            {t("பதிவு விவரங்களை உள்ளிட்டு, சங்கமத்தின் உத்தியோகபூர்வ உறுப்பினர் அட்டையை முன்பக்க மற்றும் பின்பக்கத்துடன் உடனடியாக உருவாக்குங்கள்.", "Fill in your details to instantly generate a printable Tamilnadu Vanigargalin Sangamam (TNVS) membership ID card — Front and Back.")}
          </p>
        </div>
      </section>

      <Section className="py-6 sm:py-10">
        <div className="max-w-3xl mx-auto">
          {/* Form Card */}
          <div className="paper rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 border border-border shadow-sm">
            <div className="mb-5 sm:mb-6 border-b border-border pb-4">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Member Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Enter the member's information below.</p>
            </div>

            {/* Search Database Box */}
            <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-lg p-4">
              <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                {t("உறுப்பினர் தேடல் (விருப்பத்தேர்வு)", "Search Member Database (Optional)")}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={t("EPIC ID அல்லது பெயரை உள்ளிடவும்...", "Enter EPIC ID or name...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                  className="flex-1 border border-input bg-background rounded-md px-3 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-primary text-white hover:bg-primary/95 px-4 py-2 rounded-md text-sm font-semibold transition shrink-0 min-h-[44px]"
                >
                  {isSearching ? t("தேடுகிறது...", "Searching...") : t("தேடுக", "Search")}
                </button>
                {!showForm && (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md text-sm font-semibold transition shrink-0 min-h-[44px]"
                  >
                    {t("தவிர்க்கவும்", "Enter Manually")}
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t("குறிப்பு: 'Senthil Kumar' அல்லது 'RJE1234567' எனத் தட்டச்சு செய்து கோப்பில் சேமிக்கப்பட்ட விவரங்களை மீட்டெடுக்கவும்.", "Tip: Search 'Senthil Kumar' or 'RJE1234567' to load pre-configured voter profiles.")}
              </p>

              {/* Search Results Dropdown */}
              {hasSearched && !isSearching && searchResults.length === 0 && (
                <div className="mt-4 p-4 rounded-xl bg-secondary/60 border border-border text-center animate-fade-in">
                  <p className="text-sm text-muted-foreground font-tamil" lang={language === "ta" ? "ta" : "en"}>
                    {t("பதிவு எண் கண்டுபிடிக்கவில்லை.", "No membership record found.")}
                  </p>
                  <p className="mt-2 text-sm font-tamil" lang={language === "ta" ? "ta" : "en"}>
                    {t("இன்னும் உறுப்பினர் இல்லையா?", "Not a member yet?")}{" "}
                    <Link
                      to="/membership"
                      search={{
                        name: !/^[a-zA-Z]{3}\d{7}$/i.test(searchQuery.trim()) ? searchQuery.trim() : undefined,
                        epic: /^[a-zA-Z]{3}\d{7}$/i.test(searchQuery.trim()) ? searchQuery.trim().toUpperCase() : undefined,
                      }}
                      className="text-primary font-semibold hover:underline"
                    >
                      {t("இப்போதே இணையுங்கள் →", "Join now →")}
                    </Link>
                  </p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-3 border border-border bg-card rounded-md divide-y divide-border overflow-hidden max-h-48 overflow-y-auto">
                  {searchResults.map((v) => (
                    <button
                      key={v.ID}
                      type="button"
                      onClick={() => selectVoter(v)}
                      className="w-full text-left px-3 py-2.5 hover:bg-muted/60 transition flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{v.VOTER_NAME}</span>
                        <span className="text-slate-400 mx-2">|</span>
                        <span className="font-mono text-primary font-medium">{v.EPIC_NO}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {v.ASSEMBLY_NAME}, {v.DISTRICT}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Search Skeletons */}
              {isSearching && (
                <div className="mt-3 border border-border bg-card rounded-md divide-y divide-border overflow-hidden p-3 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 w-full">
                      <Skeleton className="w-1/3 h-4" />
                      <span className="text-slate-200">|</span>
                      <Skeleton className="w-1/4 h-4" />
                    </div>
                    <Skeleton className="w-1/4 h-4 text-right" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 w-full">
                      <Skeleton className="w-1/4 h-4" />
                      <span className="text-slate-200">|</span>
                      <Skeleton className="w-1/3 h-4" />
                    </div>
                    <Skeleton className="w-1/5 h-4 text-right" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 w-full">
                      <Skeleton className="w-2/5 h-4" />
                      <span className="text-slate-200">|</span>
                      <Skeleton className="w-1/5 h-4" />
                    </div>
                    <Skeleton className="w-1/4 h-4 text-right" />
                  </div>
                </div>
              )}
            </div>
            
            {showForm && (
              <form onSubmit={handleGenerate} noValidate className="space-y-5">
                {formStep === 1 && (
                  <>
                  <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name (பெயர்) *</label>
                  <input 
                    required 
                    type="text"
                    pattern="^[a-zA-Z\s.\u0B80-\u0BFF]+$"
                    title="Name should contain only letters, dots, and spaces (பெயரில் எழுத்துக்கள் மற்றும் இடைவெளிகள் மட்டுமே இருக்க வேண்டும்)"
                    value={formData.VOTER_NAME} 
                    onChange={e => handleFieldChange("VOTER_NAME", e.target.value)} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.VOTER_NAME 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="e.g. Senthil Kumar / செந்தில் குமார்" 
                  />
                  {errors.VOTER_NAME && (
                    <FieldError message={errors.VOTER_NAME} />
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">EPIC / ID No *</label>
                  <input 
                    required 
                    type="text"
                    pattern="^[a-zA-Z]{3}\d{7}$"
                    title="EPIC No must be 3 letters followed by 7 digits (எ.கா: RJE1234567)"
                    value={formData.EPIC_NO} 
                    onChange={e => handleFieldChange("EPIC_NO", e.target.value.toUpperCase())} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 uppercase ${
                      errors.EPIC_NO 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="e.g. RJE1234567" 
                  />
                  {errors.EPIC_NO && (
                    <FieldError message={errors.EPIC_NO} />
                  )}
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Mobile Number (கைபேசி எண்)</label>
                  <input 
                    type="tel"
                    pattern="^[6-9]\d{9}$"
                    maxLength={10}
                    title="Please enter a valid 10-digit mobile number starting with 6-9 (6-9 இல் தொடங்கும் 10 இலக்க கைபேசி எண்)"
                    value={formData.MOBILE_NUMBER} 
                    onChange={e => handleFieldChange("MOBILE_NUMBER", e.target.value.replace(/\D/g, ""))} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.MOBILE_NUMBER 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="e.g. 9876543210" 
                  />
                  {errors.MOBILE_NUMBER && (
                    <FieldError message={errors.MOBILE_NUMBER} />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Date of Birth (பிறந்த தேதி) *</label>
                  <input 
                    required 
                    type="date"
                    value={formData.DOB} 
                    onChange={e => handleFieldChange("DOB", e.target.value)} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.DOB 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                  />
                  {errors.DOB && (
                    <FieldError message={errors.DOB} />
                  )}
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Age (வயது) *</label>
                  <input 
                    type="number" 
                    required 
                    min="18"
                    max="120"
                    title="Age must be between 18 and 120 (வயது 18 முதல் 120 வரை இருக்க வேண்டும்)"
                    value={formData.AGE} 
                    onChange={e => handleFieldChange("AGE", e.target.value)} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.AGE 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="Age" 
                  />
                  {errors.AGE && (
                    <FieldError message={errors.AGE} />
                  )}
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Gender (பாலினம்)</label>
                  <select 
                    value={formData.GENDER} 
                    onChange={e => handleFieldChange("GENDER", e.target.value)} 
                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Blood Group (இரத்த வகை)</label>
                  <select 
                    value={formData.BLOOD_GROUP} 
                    onChange={e => handleFieldChange("BLOOD_GROUP", e.target.value)} 
                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Assembly Name (தொகுதி)</label>
                  <input 
                    type="text"
                    pattern="^[a-zA-Z\s.\u0B80-\u0BFF]+$"
                    title="Assembly should contain only letters, dots, and spaces (தொகுதி பெயர் எழுத்துக்கள் மற்றும் இடைவெளிகளில் இருக்க வேண்டும்)"
                    value={formData.ASSEMBLY_NAME} 
                    onChange={e => handleFieldChange("ASSEMBLY_NAME", e.target.value)} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.ASSEMBLY_NAME 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="e.g. Mylapore / மயிலாப்பூர்" 
                  />
                  {errors.ASSEMBLY_NAME && (
                    <FieldError message={errors.ASSEMBLY_NAME} />
                  )}
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">District (மாவட்டம்)</label>
                  <input 
                    type="text"
                    pattern="^[a-zA-Z\s.\u0B80-\u0BFF]+$"
                    title="District should contain only letters, dots, and spaces (மாவட்டம் பெயர் எழுத்துக்கள் மற்றும் இடைவெளிகளில் இருக்க வேண்டும்)"
                    value={formData.DISTRICT} 
                    onChange={e => handleFieldChange("DISTRICT", e.target.value)} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.DISTRICT 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="e.g. Chennai / சென்னை" 
                  />
                  {errors.DISTRICT && (
                    <FieldError message={errors.DISTRICT} />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Business Type (வணிக வகை)</label>
                  <select 
                    value={formData.BUSINESS_TYPE} 
                    onChange={e => handleFieldChange("BUSINESS_TYPE", e.target.value)} 
                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option>Retail</option>
                    <option>Wholesale</option>
                    <option>Manufacturing</option>
                    <option>Service</option>
                    <option>Online</option>
                  </select>
                </div>
 
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium">Address (முகவரி)</label>
                  <textarea 
                    rows={2} 
                    required
                    value={formData.POLLING_STATION_ADDRESS} 
                    onChange={e => handleFieldChange("POLLING_STATION_ADDRESS", e.target.value)} 
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      errors.POLLING_STATION_ADDRESS 
                        ? "border-red-500 bg-red-50/10 focus:ring-red-200" 
                        : "border-input bg-background focus:ring-primary/40"
                    }`}
                    placeholder="Full address (e.g. கதவு எண், தெரு பெயர், ஊர், பின்கோடு)..." 
                  />
                  {errors.POLLING_STATION_ADDRESS && (
                    <FieldError message={errors.POLLING_STATION_ADDRESS} />
                  )}
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="button" onClick={handleDetailsNext} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition shadow-sm">
                  {t("அடுத்து (புகைப்படம்)", "Next (Upload Photo)")}
                </button>
              </div>
              </>
            )}

            {formStep === 2 && (
              <>
                {/* Photo Upload Section */}
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg bg-muted/30 mb-4">
                  {formData.PHOTO_URL ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-3">
                      <img src={formData.PHOTO_URL} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, PHOTO_URL: "" }))} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity">Remove</button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full border border-dashed border-border flex flex-col items-center justify-center bg-card mb-3 text-muted-foreground">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-xs">No Photo</span>
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md text-xs font-medium transition">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo (உரிமையாளர் படம்)
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" aria-label="உங்களை அடையாளப்படுத்தும் புகைப்படம் / Upload your identification photo" />
                  </label>
                </div>
                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={() => setFormStep(1)} className="bg-muted text-muted-foreground px-5 py-2.5 rounded-md font-semibold hover:bg-muted/80 transition shadow-sm min-h-[44px]">
                      {t("பின்செல்க", "Back")}
                    </button>
                    <button type="submit" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition shadow-sm min-h-[44px]">
                      {t("அடையாள அட்டை உருவாக்கு", "Generate ID Card")}
                    </button>
                  </div>
                </>
              )}
            </form>
            )}
          </div>

          {/* Card generator panel */}
          <AnimatePresence>
            {isCompilingCard && (
              <motion.div
                key="skeleton-generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="paper rounded-xl overflow-hidden mt-8 border border-border shadow-sm"
              >
                <div className="gov-stripe h-1" />
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="space-y-2 w-1/3">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-28" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Voter details skeleton */}
                    <div className="lg:col-span-5 space-y-4">
                      <Skeleton className="h-4 w-1/3" />
                      <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    {/* Voter card templates skeleton */}
                    <div className="lg:col-span-7 flex flex-col items-center gap-6">
                      <div className="w-full">
                        <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
                        <div className="flex justify-center">
                          <Skeleton className="h-[210px] w-full max-w-[340px] rounded-xl" />
                        </div>
                      </div>
                      <div className="w-full border-t border-border/60 pt-5">
                        <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
                        <div className="flex justify-center">
                          <Skeleton className="h-[210px] w-full max-w-[340px] rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(selected && !isCompilingCard) && (
              <motion.div
                ref={cardRef}
                key="generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="paper rounded-xl overflow-hidden mt-8"
              >
                <div className="gov-stripe h-1" />
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <SectionLabel>ID Card Generated · அட்டை தயார்</SectionLabel>
                      <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold">{selected.VOTER_NAME.replace(/\s*-\s*$/, "").trim()}</h2>
                      <p className="font-mono text-xs sm:text-sm text-primary mt-0.5">{`TNVS-${selected.EPIC_NO.replace(/[^A-Z0-9]/gi,"").toUpperCase().slice(-6)}${parseInt(selected.SERIAL_NO||"1").toString(16).padStart(2,"0").toUpperCase()}`}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {shareMsg && <span className="text-xs text-primary font-medium w-full md:w-auto">{shareMsg}</span>}
                      <Link
                        to="/membership"
                        search={{
                          name: selected.VOTER_NAME,
                          epic: selected.EPIC_NO,
                          mobile: selected.MOBILE_NUMBER || "",
                          district: selected.DISTRICT || "",
                          assembly: selected.ASSEMBLY_NAME || "",
                          address: selected.POLLING_STATION_ADDRESS || "",
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-slate-950 text-gold px-3.5 py-2 rounded-md font-semibold text-xs hover:bg-slate-900 transition shadow-sm border border-slate-800 min-h-[38px] w-full sm:w-auto"
                      >
                        🌟 Premium Member Card
                      </Link>
                      <button onClick={handleShare} className="inline-flex items-center justify-center gap-2 border border-border bg-card px-3.5 py-2 rounded-md font-semibold text-xs sm:text-sm hover:bg-muted transition min-h-[38px] w-full sm:w-auto">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                      <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-xs sm:text-sm hover:bg-primary/90 transition min-h-[38px] w-full sm:w-auto">
                        <Printer className="w-3.5 h-3.5" /> Print / PDF
                      </button>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Voter details */}
                    <div className="lg:col-span-5">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-4">Member Details · உறுப்பினர் விவரம்</h3>
                      <div className="space-y-3">
                        <DetailRow icon={<User className="w-4 h-4" />} label="Member Name" value={selected.VOTER_NAME.replace(/\s*-\s*$/, "").trim()} />
                        <DetailRow icon={<Hash className="w-4 h-4" />} label="EPIC Number" value={selected.EPIC_NO} mono />
                        <DetailRow icon={<Hash className="w-4 h-4" />} label="Age / Gender / Blood" value={`${selected.AGE} yrs · ${selected.GENDER} · ${selected.BLOOD_GROUP || "—"}`} />
                        <DetailRow icon={<Building2 className="w-4 h-4" />} label="Assembly" value={`${selected.ASSEMBLY_NAME}`} />
                        <DetailRow icon={<MapPin className="w-4 h-4" />} label="District" value={`${selected.DISTRICT}`} />
                        <DetailRow icon={<MapPin className="w-4 h-4" />} label="Address" value={selected.POLLING_STATION_ADDRESS} />
                        {selected.MOBILE_NUMBER && selected.MOBILE_NUMBER !== "-" && (
                          <DetailRow icon={<Phone className="w-4 h-4" />} label="Mobile" value={selected.MOBILE_NUMBER} />
                        )}
                      </div>
                    </div>

                    {/* Both cards */}
                    <div className="lg:col-span-7">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-5">
                        உறுப்பினர் அட்டை · Membership Card
                      </h3>
                      <div className="flex flex-col items-center gap-6 rounded-xl p-2">
                        <div className="w-full">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 text-center">முன்பக்கம் · FRONT</p>
                          <div ref={frontRef} className="card-scale-wrapper">
                            <div className="responsive-card-scale">
                              <VoterIdCard voter={selected} template="front" />
                            </div>
                          </div>
                        </div>
                        <div className="w-full border-t border-border/60 pt-5">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 text-center">பின்பக்கம் · BACK</p>
                          <div ref={backRef} className="card-scale-wrapper">
                            <div className="responsive-card-scale">
                              <VoterIdCard voter={selected} template="back" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
}

function DetailRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className={`text-sm text-ink font-medium wrap-break-word mt-0.5 ${mono ? "font-mono tracking-wide" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
