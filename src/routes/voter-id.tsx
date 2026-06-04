import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, MapPin, Building2, Hash,
  Phone, Share2, User, Download, Lock, ArrowLeft, Camera, RefreshCw, Key
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { toast } from "sonner";
import { VoterIdCard, type Voter } from "@/components/VoterIdCard";
import votersData from "@/data/voters.json";
import { WINGS } from "@/data/wings";
import ownerPhoto from "@/assets/349b584e-1b60-469e-9e5d-8d124cb057cb.png";
import orgLogo from "@/assets/ChatGPT Image Mar 25, 2026, 05_31_25 PM (1).png";
import signImg from "@/assets/8bb61dfb-f349-4e0b-8501-560feae9f000.png";

export const Route = createFileRoute("/voter-id")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      epic: search.epic ? (search.epic as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Download Certificate & Card · TNVS Portal" },
      { name: "description", content: "Verify your PIN to download your official membership certificate and print your ID card." },
    ],
  }),
  component: SecureDownloadPage,
});

function SecureDownloadPage() {
  const { t, language } = useLanguage();
  const { epic: searchEpic } = Route.useSearch();

  const [epicInput, setEpicInput] = useState(searchEpic || "");
  const [pinInput, setPinInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedVoter, setVerifiedVoter] = useState<Voter | null>(null);
  const [shareMsg, setShareMsg] = useState("");

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Verification Logic
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = epicInput.trim().toUpperCase();
    if (!inputVal) {
      toast.error(language === "ta" ? "தயவுசெய்து EPIC ID அல்லது மொபைல் எண்ணை உள்ளிடவும்" : "Please enter EPIC ID or Mobile Number");
      return;
    }
    if (pinInput.length !== 4) {
      toast.error(language === "ta" ? "தயவுசெய்து 4-இலக்க பாதுகாப்பு PIN ஐ உள்ளிடவும்" : "Please enter a valid 4-digit Security PIN");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      let resolvedEpic = inputVal;
      let foundDynamicMember = null;
      let foundMockVoter: any = null;

      // Check if input is a 10-digit mobile number
      const cleanMobile = inputVal.replace(/\D/g, "");
      if (cleanMobile.length === 10) {
        // Search dynamic localStorage members by mobile
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("tnvs_member_")) {
            try {
              const profile = JSON.parse(localStorage.getItem(key) || "");
              if (profile && profile.mobile === cleanMobile) {
                foundDynamicMember = profile;
                resolvedEpic = profile.epic.toUpperCase();
                break;
              }
            } catch {}
          }
        }

        // If not found in dynamic members, search mock voters
        if (!foundDynamicMember) {
          foundMockVoter = votersData.find(v => v.MOBILE_NUMBER === cleanMobile);
          if (foundMockVoter) {
            resolvedEpic = foundMockVoter.EPIC_NO.toUpperCase();
          }
        }
      } else {
        // Direct search by EPIC ID
        const savedMemberStr = localStorage.getItem(`tnvs_member_${inputVal}`);
        if (savedMemberStr) {
          try { foundDynamicMember = JSON.parse(savedMemberStr); } catch {}
        } else {
          foundMockVoter = votersData.find(v => v.EPIC_NO?.toUpperCase() === inputVal);
        }
      }

      // Check PIN verification for the resolved member
      if (foundDynamicMember) {
        const savedPin = localStorage.getItem(`tnvs_pin_${resolvedEpic}`);
        if (savedPin === pinInput) {
          const voterObj: Voter = {
            ID: 8888,
            ASSEMBLY_NO: "25",
            ASSEMBLY_NAME: foundDynamicMember.assembly || "Mylapore",
            PART_NO: "1",
            SECTION_NO: "1",
            SERIAL_NO: "12",
            HOUSE_NO: "",
            VOTER_NAME: foundDynamicMember.name,
            RELATION_TYPE: "Father",
            RELATION_NAME: "",
            EPIC_NO: foundDynamicMember.epic,
            MOBILE_NUMBER: foundDynamicMember.mobile,
            AGE: foundDynamicMember.age || "30",
            DOB: foundDynamicMember.dob,
            BUSINESS_TYPE: foundDynamicMember.type || "Retail",
            GENDER: foundDynamicMember.gender || "Male",
            BLOOD_GROUP: foundDynamicMember.bloodGroup || "O+",
            PART_NAME: "TNVS Zone",
            POLLING_STATION_NAME: foundDynamicMember.address || "",
            POLLING_STATION_ADDRESS: foundDynamicMember.address || "",
            MAIN_TOWN: foundDynamicMember.district || "CHENNAI",
            WARD: "",
            POST_OFFICE: "",
            POLICE_STATION: "",
            DISTRICT: foundDynamicMember.district || "CHENNAI",
            PIN_CODE: "",
            PHOTO_URL: foundDynamicMember.photoUrl || ownerPhoto,
          };
          setVerifiedVoter(voterObj);
          toast.success(language === "ta" ? "பாதுகாப்பு PIN சரிபார்க்கப்பட்டது! அணுகல் அனுமதிக்கப்பட்டது." : "Security PIN verified! Access granted.");
        } else {
          toast.error(language === "ta" ? "தவறான பாதுகாப்பு PIN. மீண்டும் முயலவும்." : "Invalid Security PIN. Please try again.");
        }
      } else if (foundMockVoter) {
        // Default PIN for mock database voters is '1234'
        if (pinInput === "1234") {
          const voterObj: Voter = {
            ID: foundMockVoter.ID,
            ASSEMBLY_NO: foundMockVoter.ASSEMBLY_NO || "25",
            ASSEMBLY_NAME: foundMockVoter.ASSEMBLY_NAME || "Mylapore",
            PART_NO: foundMockVoter.PART_NO || "1",
            SECTION_NO: foundMockVoter.SECTION_NO || "1",
            SERIAL_NO: foundMockVoter.SERIAL_NO || "12",
            HOUSE_NO: foundMockVoter.HOUSE_NO || "",
            VOTER_NAME: foundMockVoter.VOTER_NAME,
            RELATION_TYPE: foundMockVoter.RELATION_TYPE || "Father",
            RELATION_NAME: foundMockVoter.RELATION_NAME || "",
            EPIC_NO: foundMockVoter.EPIC_NO,
            MOBILE_NUMBER: foundMockVoter.MOBILE_NUMBER || "",
            AGE: foundMockVoter.AGE || "35",
            DOB: foundMockVoter.DOB || "",
            BUSINESS_TYPE: foundMockVoter.BUSINESS_TYPE || "Retail",
            GENDER: foundMockVoter.GENDER || "Male",
            BLOOD_GROUP: foundMockVoter.BLOOD_GROUP || "O+",
            PART_NAME: foundMockVoter.PART_NAME || "TNVS Zone",
            POLLING_STATION_NAME: foundMockVoter.POLLING_STATION_NAME || foundMockVoter.POLLING_STATION_ADDRESS || "",
            POLLING_STATION_ADDRESS: foundMockVoter.POLLING_STATION_ADDRESS || "",
            MAIN_TOWN: foundMockVoter.MAIN_TOWN || foundMockVoter.DISTRICT || "Chennai",
            WARD: foundMockVoter.WARD || "",
            POST_OFFICE: foundMockVoter.POST_OFFICE || "",
            POLICE_STATION: foundMockVoter.POLICE_STATION || "",
            DISTRICT: foundMockVoter.DISTRICT || "Chennai",
            PIN_CODE: foundMockVoter.PIN_CODE || "",
            PHOTO_URL: foundMockVoter.PHOTO_URL || ownerPhoto,
          };
          setVerifiedVoter(voterObj as any);
          toast.success(language === "ta" ? "பாதுகாப்பு PIN சரிபார்க்கப்பட்டது! அணுகல் அனுமதிக்கப்பட்டது." : "Security PIN verified! Access granted.");
        } else {
          toast.error(language === "ta" ? "தவறான பாதுகாப்பு PIN. மீண்டும் முயலவும்." : "Invalid Security PIN. Please try again.");
        }
      } else {
        toast.error(language === "ta" ? "உறுப்பினர் கணக்கு அல்லது EPIC ID காணப்படவில்லை." : "Membership record or EPIC ID not found.");
      }
      setIsVerifying(false);
    }, 1200);
  };

  // Certificate download logic (using canvas)
  const downloadCertificate = () => {
    if (!verifiedVoter) return;
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
      ctx.fillText(verifiedVoter.VOTER_NAME.toUpperCase(), W / 2, 185);
      ctx.fillStyle = "#333"; ctx.font = "italic 15px Georgia, serif";
      ctx.fillText("is officially enrolled as an esteemed member of", W / 2, 230);
      ctx.fillText("Tamilnadu Vanigargalin Sangamam.", W / 2, 252);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 290, W - 200, 200);
      ctx.textAlign = "left"; ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("Membership ID / EPIC:", 120, 330);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 16px monospace";
      ctx.fillText(verifiedVoter.EPIC_NO, 310, 330);
      ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("District / Location:", 120, 370);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText(verifiedVoter.DISTRICT, 310, 370);
      
      const wingData = WINGS.find(w => w.id === verifiedVoter.BUSINESS_TYPE); // or wing match
      ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("Business Division / Type:", 120, 410);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText(verifiedVoter.BUSINESS_TYPE || "Retail", 310, 410);
      
      if (verifiedVoter.POLLING_STATION_NAME) {
        ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
        ctx.fillText("Shop Address:", 120, 450);
        ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 13px Georgia, serif";
        ctx.fillText(verifiedVoter.POLLING_STATION_ADDRESS.slice(0, 55), 310, 450);
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

    const imgLeft = new Image(); imgLeft.src = verifiedVoter.PHOTO_URL || ownerPhoto;
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
        link.download = "membership-certificate-" + verifiedVoter.EPIC_NO + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    imgLeft.onload = imgLeft.onerror = 
    imgRight.onload = imgRight.onerror = 
    imgSign.onload = imgSign.onerror = handleComplete;
  };

  const handlePrint = () => {
    if (!frontRef.current || !backRef.current || !verifiedVoter) return;
    const name = verifiedVoter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
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

  const handleShare = (mno: string) => {
    if (!verifiedVoter) return;
    const name = verifiedVoter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
    const text = `சங்கம உறுப்பினர் அட்டை\nPer: ${name}\nMembership: ${mno}\nAssembly: ${verifiedVoter.ASSEMBLY_NAME}, ${verifiedVoter.DISTRICT}`;
    if (navigator.share) {
      navigator.share({ title: `Sangamam Card — ${name}`, text, url: window.location.href }).catch(() => null);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShareMsg(language === "ta" ? "நகலெடுக்கப்பட்டது / Copied!" : "Copied!");
        setTimeout(() => setShareMsg(""), 2500);
      }).catch(() => null);
    }
  };

  const generatedMno = verifiedVoter
    ? `TNVS-${verifiedVoter.EPIC_NO.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6)}12`
    : "";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50/50 pb-12">
      {/* Page Header */}
      <section className="bg-slate-900 text-white border-b border-slate-800 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-primary/30 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-10 w-full relative z-10">
          <div className="mb-3">
            <Breadcrumb
              items={[
                { label: "Services", labelTa: "சேவைகள்", to: "/services" },
                { label: "Certificate Download", labelTa: "சான்றிதழ் பதிவிறக்கம்" },
              ]}
            />
          </div>
          <div className="flex">
            <div className="inline-flex items-center gap-1.5 bg-primary/25 text-blue-300 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-primary/30">
              Secure Access · பாதுகாப்பான அணுகல்
            </div>
          </div>
          <h1 className="font-display font-semibold text-white">
            Certificate & Card Download
          </h1>
          <p className="font-tamil text-sm sm:text-base text-slate-400 mt-1">
            டிஜிட்டல் உறுப்பினர் சான்றிதழ் மற்றும் அடையாள அட்டை பதிவிறக்கம்
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {!verifiedVoter ? (
            /* ─── SECURITY ACCESS LOCK SCREEN ─── */
            <motion.div
              key="lock-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 text-[#002B7F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">Enter Security PIN</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {language === "ta"
                    ? "உங்கள் உறுப்பினர் அட்டை மற்றும் சான்றிதழைப் பெற 4-இலக்க பாதுகாப்பு PIN மற்றும் EPIC ID அல்லது மொபைல் எண்ணை உள்ளிடவும்."
                    : "Verify your EPIC ID / Mobile Number and 4-digit Security PIN to access your digital membership certificate & card."}
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                {/* EPIC ID / Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === "ta" ? "EPIC ID / அலைபேசி எண் (EPIC ID / Mobile Number) *" : "EPIC ID / Mobile Number *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={epicInput}
                    onChange={(e) => setEpicInput(e.target.value)}
                    className="w-full border border-[#EADCC9] bg-[#FAF8F5] text-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B7F]/40 focus:border-[#002B7F] min-h-[44px]"
                    placeholder="e.g. RJE1234567 or 9876543210"
                  />
                </div>

                {/* 4-Digit Security PIN */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === "ta" ? "பாதுகாப்பு PIN (Security PIN) *" : "Security PIN *"}
                  </label>
                  
                  <div className="relative inline-block w-full">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value.replace(/\D/g, ""))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      autoComplete="one-time-code"
                    />
                    <div className="flex gap-3 justify-center">
                      {[0, 1, 2, 3].map(index => {
                        const char = pinInput[index] || "";
                        const isFocused = pinInput.length === index;
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

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn-primary w-full justify-center mt-2 cursor-pointer shadow-md py-3 rounded-xl"
                >
                  {isVerifying ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying PIN...</>
                  ) : (
                    <><Key className="w-4 h-4" /> Verify & Access</>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-[10px] text-slate-400">
                <p>
                  {language === "ta" 
                    ? "டெமோ: வாக்காளர் 'RJE1234567' மற்றும் PIN '1234' கொண்டு சோதிக்கலாம்." 
                    : "Demo Account: Use EPIC 'RJE1234567' and PIN '1234' to unlock default voter details."}
                </p>
                <Link to="/membership" className="text-[#002B7F] font-bold hover:underline block mt-2">
                  Not a member? Apply for membership now
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ─── SECURE CERTIFICATE & ID CARD DOWNLOAD SCREEN (UNLOCKED) ─── */
            <motion.div
              key="download-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-12 gap-8 items-start animate-fadeIn"
            >
              {/* Left Column: Member Details Summary card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {/* Circle photo */}
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={verifiedVoter.PHOTO_URL} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-slate-850">{verifiedVoter.VOTER_NAME}</h2>
                      <span className="text-[10px] uppercase font-mono bg-blue-50 text-primary border border-blue-100 px-2 py-0.5 rounded-md font-bold tracking-wider">{verifiedVoter.EPIC_NO}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setVerifiedVoter(null);
                      setPinInput("");
                    }}
                    className="text-[10px] font-bold text-slate-450 hover:text-red-650 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-150 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    Lock Session
                  </button>
                </div>

                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Credentials</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Mobile", value: verifiedVoter.MOBILE_NUMBER || "—", icon: Phone },
                      { label: "Age / Gender", value: `${verifiedVoter.AGE} yrs · ${verifiedVoter.GENDER}`, icon: User },
                      { label: "Blood Group", value: verifiedVoter.BLOOD_GROUP || "—", icon: Hash },
                      { label: "Business Type", value: verifiedVoter.BUSINESS_TYPE || "Retail", icon: Building2 },
                      { label: "Assembly Name", value: verifiedVoter.ASSEMBLY_NAME, icon: Building2 },
                      { label: "District Location", value: verifiedVoter.DISTRICT, icon: MapPin },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-[#FAF8F5] border border-slate-100 rounded-xl p-3 shadow-xxs">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          {label}
                        </div>
                        <div className="text-xs text-slate-800 font-bold mt-1.5 truncate">{value}</div>
                      </div>
                    ))}
                  </div>

                  {verifiedVoter.POLLING_STATION_ADDRESS && (
                    <div className="bg-[#FAF8F5] border border-slate-100 rounded-xl p-3 shadow-xxs">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Shop Address
                      </div>
                      <div className="text-xs text-slate-800 font-bold mt-1.5 leading-relaxed">{verifiedVoter.POLLING_STATION_ADDRESS}</div>
                    </div>
                  )}
                </div>

                {/* Print & Download Action Sidebar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  {shareMsg && <span className="text-xs text-primary font-medium text-center">{shareMsg}</span>}
                  <button
                    onClick={downloadCertificate}
                    className="btn-primary w-full justify-center shadow-md cursor-pointer py-3 rounded-xl flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Certificate
                  </button>
                  <button
                    onClick={handlePrint}
                    className="bg-slate-900 hover:bg-slate-800 text-white w-full justify-center py-3 rounded-xl font-bold text-xs flex items-center gap-2 border-none cursor-pointer shadow-xs"
                  >
                    <Printer className="w-4 h-4" /> Print / PDF Membership Card
                  </button>
                  <button
                    onClick={() => handleShare(generatedMno)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-full justify-center py-3 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-200 cursor-pointer shadow-xxs"
                  >
                    <Share2 className="w-4 h-4" /> Share Membership
                  </button>
                </div>
              </div>

              {/* Right Column: ID Card Render templates (Front/Back) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
                  Membership ID Card Preview
                </h3>
                
                <div className="flex flex-col items-center gap-6 rounded-2xl p-4 bg-slate-50/50 border border-slate-200/60">
                  <div className="w-full">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 text-center">முன்பக்கம் · FRONT</p>
                    <div ref={frontRef} className="card-scale-wrapper">
                      <div className="responsive-card-scale">
                        <VoterIdCard voter={verifiedVoter} template="front" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-t border-slate-200 pt-5">
                    <p className="text-xs font-semibold text-slate-550 uppercase tracking-widest mb-2 text-center">பின்பக்கம் · BACK</p>
                    <div ref={backRef} className="card-scale-wrapper">
                      <div className="responsive-card-scale">
                        <VoterIdCard voter={verifiedVoter} template="back" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
