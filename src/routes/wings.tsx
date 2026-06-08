import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { Section, SectionLabel } from "@/components/Section";
import { Search, ArrowRight, ArrowLeft, Sparkles, MapPin, Globe, Users, Award, ShieldCheck, ChevronRight, ChevronDown, Phone, Mail, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { WINGS } from "@/data/wings";
import { ZONE_BREAKDOWN } from "@/data/zones";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/wings")({
  head: () => ({
    meta: [
      { title: "Wings & Divisions · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Explore the specialized wings and regional constituencies of Tamil Nadu Vanigargalin Sangamam." },
    ],
  }),
  component: Wings,
});

const DEPARTMENTS = [
  {
    id: "professional",
    nameEn: "Professional Services",
    nameTa: "தொழில்முறைப் பிரிவுகள்",
    descEn: "Legal, technical, financial, and digital expert networks.",
    descTa: "சட்டம், தொழில்நுட்பம், நிதி மற்றும் டிஜிட்டல் சார்ந்த நிபுணர் கூட்டமைப்பு.",
    wings: ["women-entrepreneurs", "chartered-accountants", "doctors", "lawyers", "engineers", "information-technology", "young-entrepreneurs", "media-relations"]
  },
  {
    id: "agricultural",
    nameEn: "Agricultural & Food Industry",
    nameTa: "விவசாயம் மற்றும் உணவுப் பிரிவுகள்",
    descEn: "Farming, organic agro-trading, milk farmers, and restaurant owners.",
    descTa: "விவசாயிகள், இயற்கை உற்பத்தி, பால் பண்ணை மற்றும் உணவக உரிமையாளர்கள்.",
    wings: ["agriculture", "restaurant-owners", "marine-business", "tribal-entrepreneurs", "distributors"]
  },
  {
    id: "industrial",
    nameEn: "Industrial & Manufacturing Trade",
    nameTa: "தொழில் மற்றும் வர்த்தகப் பிரிவுகள்",
    descEn: "Heavy industrial manufacturers, textile weavers, logistics, and real estate developers.",
    descTa: "உற்பத்தியாளர்கள், நெசவாளர்கள், தளவாடங்கள் மற்றும் கட்டுமானத் துறை சார்ந்தவர்கள்.",
    wings: ["manufacturers", "import-export", "weavers", "printing-press", "computer-mobile", "insurance-finance"]
  },
  {
    id: "public",
    nameEn: "Public & General Services",
    nameTa: "பொது மற்றும் சமூகப் பிரிவுகள்",
    descEn: "Retailers, handloom craftsmen, tourism agencies, and workers unions.",
    descTa: "சிறு சில்லறை வணிகர்கள், கைத்தறி கலைஞர்கள், சுற்றுலா முகவர்கள் மற்றும் தொழிலாளர்கள்.",
    wings: ["labour", "differently-abled", "transgender-entrepreneurs", "pharmacists", "educators", "tourism-transport", "sports-business", "shop-owners", "street-vendors", "hotels-lodgings", "beauty-fitness", "central-govt-relations", "state-govt-relations", "cottage-industry", "digital-advertisers"]
  }
];

// Deterministic South Indian / Tamil names lists
const TAMIL_MEN_FIRST_NAMES = [
  "Arun", "Karthik", "Saravanan", "Senthil", "Venkatesh", "Murugan", "Prabhu", "Vijay", "Ramesh", "Suresh",
  "Selvam", "Pandian", "Anbarasan", "Muthu", "Rajesh", "Kumar", "Balaji", "Hari", "Ganesh", "Manikandan",
  "Sundar", "Prakash", "Sivakumar", "Dinesh", "Baskar", "Loganathan", "Kathiravan", "Shanmugam", "Rajarajan",
  "Elango", "Ranganathan", "Gunasekaran", "Jayakumar", "Thirumurugan", "Senthilvel", "Velmurugan", "Karthikeyan"
];

const TAMIL_WOMEN_FIRST_NAMES = [
  "Priya", "Meena", "Abirami", "Kavitha", "Lakshmi", "Deepa", "Divya", "Sindhu", "Anitha", "Kokila",
  "Revathi", "Gayathri", "Mythili", "Soundarya", "Malathi", "Suganya", "Chitra", "Uma", "Bhavani", "Shanthi",
  "Saraswathi", "Aruna", "Nandhini", "Radha", "Kalyani", "Geetha", "Vidya", "Sangeetha", "Kokilavani", "Jayanthi"
];

const TAMIL_LAST_NAMES = [
  "Kalyanasundaram", "Ramakrishnan", "Subramanian", "Ganesan", "Muthuvel", "Chidambaram", "Karuppasamy",
  "Swaminathan", "Palani", "Thangaraj", "Sundaram", "Viswanathan", "Arumugam", "Rajendran", "Selvaraj",
  "Narayanan", "Pandian", "Ramasamy", "Sethuraman", "Raghavan", "Nataraajan", "Vasudevan", "Somalingam"
];

const TAMIL_MEN_FIRST_NAMES_TA = [
  "அருண்", "கார்த்திக்", "சரவணன்", "செந்தில்", "வெங்கடேஷ்", "முருகன்", "பிரபு", "விஜய்", "ரமேஷ்", "சுரேஷ்",
  "செல்வம்", "பாண்டியன்", "அன்பரசன்", "முத்து", "ராஜேஷ்", "குமார்", "பாலாஜி", "ஹரி", "கணேஷ்", "மணிகண்டன்",
  "சுந்தர்", "பிரகாஷ்", "சிவகுமார்", "தினேஷ்", "பாஸ்கர்", "லோகநாதன்", "கதிரவன்", "சண்முகம்", "ராஜராஜன்",
  "இளங்கோ", "ரங்கநாதன்", "குணசேகரன்", "ஜெயகுமார்", "திருமுருகன்", "செந்தில்வேல்", "வேல்முருகன்", "கார்த்திகேயன்"
];

const TAMIL_WOMEN_FIRST_NAMES_TA = [
  "பிரியா", "மீனா", "அபிராமி", "கவிதா", "லட்சுமி", "தீபா", "திவ்யா", "சிந்து", "அனிதா", "கோகிலா",
  "ரேவதி", "காயத்ரி", "மைதிலி", "சௌந்தர்யா", "மாலதி", "சுகன்யா", "சித்ரா", "உமா", "பவானி", "சாந்தி",
  "சரஸ்வதி", "அருணா", "நந்தினி", "ராதா", "கல்யாணி", "கீதா", "வித்யா", "சங்கீதா", "கோகிலவாணி", "ஜெயந்தி"
];

const TAMIL_LAST_NAMES_TA = [
  "கல்யாணசுந்தரம்", "ராமகிருஷ்ணன்", "சுப்பிரமணியன்", "கணேசன்", "முத்துவேல்", "சிதம்பரம்", "கருப்பசாமி",
  "சுவாமிநாதன்", "பழனி", "தங்கராஜ்", "சுந்தரம்", "விஸ்வநாதன்", "ஆறுமுகம்", "ராஜேந்திரன்", "செல்வராஜ்",
  "நாராயணன்", "பாண்டியன்", "ராமசாமி", "சேதுராமன்", "ராகவன்", "நடராஜன்", "வாசுதேவன்", "சோமலிங்கம்"
];

const AVATAR_COLORS = [
  "bg-blue-500 text-white border-blue-600",
  "bg-primary text-white border-emerald-600",
  "bg-violet-500 text-white border-violet-600",
  "bg-primary text-white border-amber-600",
  "bg-rose-500 text-white border-rose-600",
  "bg-primary text-white border-indigo-600",
  "bg-teal-500 text-white border-teal-600",
  "bg-cyan-500 text-white border-cyan-600",
  "bg-purple-500 text-white border-purple-600"
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getDeterministicRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface Officer {
  roleEn: string;
  roleTa: string;
  nameEn: string;
  nameTa: string;
  phone: string;
  email: string;
  avatarColor: string;
  verified: boolean;
  initials: string;
}

function generateOfficers(district: string, wingId: string, wingNameEn: string, wingNameTa: string): Officer[] {
  const roles = [
    { en: "President", ta: "தலைவர்" },
    { en: "Secretary", ta: "செயலாளர்" },
    { en: "Treasurer", ta: "பொருளாளர்" }
  ];

  return roles.map((role, idx) => {
    const seedStr = `${district}-${wingId}-${idx}`;
    let seed = hashString(seedStr);

    const isWomanWing = wingId === "women-entrepreneurs";
    const randGender = getDeterministicRandom(seed);
    const isWoman = isWomanWing || (randGender < 0.3);

    const firstNamesList = isWoman ? TAMIL_WOMEN_FIRST_NAMES : TAMIL_MEN_FIRST_NAMES;
    const firstNamesTaList = isWoman ? TAMIL_WOMEN_FIRST_NAMES_TA : TAMIL_MEN_FIRST_NAMES_TA;
    
    seed = hashString(seed.toString());
    const firstNameIdx = Math.floor(getDeterministicRandom(seed) * firstNamesList.length);
    const firstNameEn = firstNamesList[firstNameIdx];
    const firstNameTa = firstNamesTaList[firstNameIdx];

    seed = hashString(seed.toString());
    const lastNameIdx = Math.floor(getDeterministicRandom(seed) * TAMIL_LAST_NAMES.length);
    const lastNameEn = TAMIL_LAST_NAMES[lastNameIdx];
    const lastNameTa = TAMIL_LAST_NAMES_TA[lastNameIdx];

    let prefixEn = "";
    let prefixTa = "";
    if (wingId === "doctors") {
      prefixEn = "Dr. ";
      prefixTa = "டாக்டர். ";
    } else if (wingId === "lawyers") {
      prefixEn = "Adv. ";
      prefixTa = "வழக்கறிஞர். ";
    } else if (wingId === "chartered-accountants") {
      prefixEn = "CA ";
      prefixTa = "சி.ஏ. ";
    } else if (wingId === "engineers") {
      prefixEn = "Er. ";
      prefixTa = "பொறியாளர். ";
    } else if (wingId === "educators") {
      prefixEn = "Prof. ";
      prefixTa = "பேராசிரியர். ";
    }

    const nameEn = `${prefixEn}${firstNameEn} ${lastNameEn[0]}.`;
    const nameTa = `${prefixTa}${firstNameTa} ${lastNameTa[0]}.`;

    const prefixes = ["944", "984", "948", "978", "890", "737"];
    seed = hashString(seed.toString());
    const phonePrefix = prefixes[Math.floor(getDeterministicRandom(seed) * prefixes.length)];
    seed = hashString(seed.toString());
    const phoneSuffix = Math.floor(1000000 + getDeterministicRandom(seed) * 8999999);
    const phone = `+91 ${phonePrefix} ${phoneSuffix.toString().substring(0, 3)} ${phoneSuffix.toString().substring(3)}`;

    const email = `${firstNameEn.toLowerCase()}.${role.en.toLowerCase()}@vanigarsangamam.org`;
    const initials = (prefixEn ? prefixEn.replace(".", "").trim() : firstNameEn[0]) + lastNameEn[0];

    seed = hashString(seed.toString());
    const avatarColor = AVATAR_COLORS[Math.floor(getDeterministicRandom(seed) * AVATAR_COLORS.length)];

    return {
      roleEn: role.en,
      roleTa: role.ta,
      nameEn,
      nameTa,
      phone,
      email,
      avatarColor,
      verified: true,
      initials
    };
  });
}


function Wings() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"wings" | "zones">("wings");

  // Wings State
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  // Zones State
  const [zoneQuery, setZoneQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  // Zones State (Extended for Sequential Progressive Explorer)
  const [selectedDeptZone, setSelectedDeptZone] = useState<string>("all");
  const [selectedWingZone, setSelectedWingZone] = useState<string>("all");

  const explorerRef = useRef<HTMLDivElement>(null);

  const handleStatsZoneClick = () => {
    setSelectedZone("all");
    setSelectedDistrict("all");
    setSelectedDeptZone("all");
    setSelectedWingZone("all");
    setZoneQuery("");
    setTimeout(() => {
      explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleStatsDistrictClick = () => {
    setSelectedZone("all");
    setSelectedDistrict("all");
    setSelectedDeptZone("all");
    setSelectedWingZone("all");
    setZoneQuery("");
    setTimeout(() => {
      explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleBreadcrumbClick = (step: number) => {
    setZoneQuery("");
    if (step === 1) {
      setSelectedZone("all");
      setSelectedDistrict("all");
      setSelectedDeptZone("all");
      setSelectedWingZone("all");
    } else if (step === 2) {
      setSelectedDistrict("all");
      setSelectedDeptZone("all");
      setSelectedWingZone("all");
    } else if (step === 3) {
      setSelectedDeptZone("all");
      setSelectedWingZone("all");
    } else if (step === 4) {
      setSelectedWingZone("all");
    }
  };

  // Unique Zones list
  const uniqueZones = Array.from(new Set(ZONE_BREAKDOWN.map(item => item.zone)));

  // Available districts based on selected zone
  const availableDistricts = Array.from(
    new Set(
      ZONE_BREAKDOWN
        .filter(item => selectedZone === "all" || item.zone === selectedZone)
        .map(item => item.district)
    )
  );

  // Total statistics for Zones breakdown
  const statsZonesCount = uniqueZones.length;
  const statsDistrictsCount = Array.from(new Set(ZONE_BREAKDOWN.map(item => item.district))).length;

  // Filter wings
  const filteredWings = WINGS.filter((w) => {
    const term = query.toLowerCase();
    return (
      w.nameEn.toLowerCase().includes(term) ||
      w.nameTa.toLowerCase().includes(term) ||
      w.descriptionEn.toLowerCase().includes(term) ||
      w.descriptionTa.toLowerCase().includes(term)
    );
  });

  // Sequential progressive step tracker
  const currentStep = useMemo(() => {
    if (selectedZone === "all") return 1;
    if (selectedDistrict === "all") return 2;
    if (selectedDeptZone === "all") return 3;
    if (selectedWingZone === "all") return 4;
    return 5;
  }, [selectedZone, selectedDistrict, selectedDeptZone, selectedWingZone]);

  const activeDept = useMemo(() => {
    return DEPARTMENTS.find(d => d.id === selectedDeptZone);
  }, [selectedDeptZone]);

  const activeWing = useMemo(() => {
    return WINGS.find(w => w.id === selectedWingZone);
  }, [selectedWingZone]);

  // Context-specific search inputs and filtered item lists
  const searchPlaceholder = useMemo(() => {
    if (currentStep === 1) return t("மண்டலத்தைத் தேடுக... (எ.கா: CHENNAI)", "Search zone... (e.g. CHENNAI)");
    if (currentStep === 2) return t("மாவட்டத்தைத் தேடுக... (எ.கா: THIRUVALLUR)", "Search district... (e.g. THIRUVALLUR)");
    if (currentStep === 3) return t("சேவைப் பிரிவைத் தேடுக...", "Search service category...");
    if (currentStep === 4) return t("உறுப்புப் பிரிவைத் தேடுக... (எ.கா: மகளிர்)", "Search wing... (e.g. Women)");
    return t("நிர்வாகியைத் தேடுக... (எ.கா: பெயர், மின்னஞ்சல்)", "Search officer... (e.g. Name, Email)");
  }, [currentStep, t]);

  const filteredZonesList = useMemo(() => {
    const term = zoneQuery.toLowerCase().trim();
    if (!term) return uniqueZones;
    return uniqueZones.filter(zone => zone.toLowerCase().includes(term));
  }, [uniqueZones, zoneQuery]);

  const filteredDistrictsList = useMemo(() => {
    const term = zoneQuery.toLowerCase().trim();
    if (!term) return availableDistricts;
    return availableDistricts.filter(dist => dist.toLowerCase().includes(term));
  }, [availableDistricts, zoneQuery]);

  const deptWingsList = useMemo(() => {
    if (!activeDept) return [];
    return WINGS.filter(w => activeDept.wings.includes(w.id));
  }, [activeDept]);

  const filteredWingsList = useMemo(() => {
    const term = zoneQuery.toLowerCase().trim();
    if (!term) return deptWingsList;
    return deptWingsList.filter(wing =>
      wing.nameEn.toLowerCase().includes(term) ||
      wing.nameTa.toLowerCase().includes(term) ||
      wing.descriptionEn.toLowerCase().includes(term) ||
      wing.descriptionTa.toLowerCase().includes(term)
    );
  }, [deptWingsList, zoneQuery]);

  const activeOfficers = useMemo(() => {
    if (selectedDistrict === "all" || selectedWingZone === "all" || !activeWing) return [];
    return generateOfficers(selectedDistrict, selectedWingZone, activeWing.nameEn, activeWing.nameTa);
  }, [selectedDistrict, selectedWingZone, activeWing]);

  const filteredOfficersList = useMemo(() => {
    const term = zoneQuery.toLowerCase().trim();
    if (!term) return activeOfficers;
    return activeOfficers.filter(off =>
      off.nameEn.toLowerCase().includes(term) ||
      off.nameTa.toLowerCase().includes(term) ||
      off.phone.includes(term) ||
      off.email.toLowerCase().includes(term) ||
      off.roleEn.toLowerCase().includes(term) ||
      off.roleTa.toLowerCase().includes(term)
    );
  }, [activeOfficers, zoneQuery]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <h1 className="sr-only">{t("சங்கமப் பிரிவுகள் மற்றும் மண்டலங்கள்", "Wings & Regional Zones")}</h1>
      {/* Header section with tab switcher */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-12 w-full">
          <div className="mb-4">
            <Link to="/members" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> {t("சேவைகளுக்குத் திரும்பு", "Back to Services")}
            </Link>
          </div>

          <div className="flex border-b border-border mb-8" role="tablist" aria-label="Wings and Zones Navigation">
            <button
              role="tab"
              aria-selected={activeTab === "wings"}
              aria-controls="wings-panel"
              id="wings-tab"
              onClick={() => setActiveTab("wings")}
              className={`pb-4 px-6 font-display text-sm md:text-base font-bold transition-all relative cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group ${
                activeTab === "wings" ? "text-primary" : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <span className="relative z-10">{t("34 வணிகப் பிரிவுகள்", "34 Specialized Wings")}</span>
              
              {activeTab === "wings" ? (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-px left-6 right-6 h-[8px] z-0 text-primary flex items-center"
                  transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
                >
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                    <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              ) : (
                <div className="absolute -bottom-px left-6 right-6 h-[8px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-0 origin-center text-primary/30 flex items-center">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                    <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "zones"}
              aria-controls="zones-panel"
              id="zones-tab"
              onClick={() => setActiveTab("zones")}
              className={`pb-4 px-6 font-display text-sm md:text-base font-bold transition-all relative cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group ${
                activeTab === "zones" ? "text-primary" : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <span className="relative z-10">{t("மண்டல வாரியான தொகுதிகள்", "Regional Zone Breakdown")}</span>
              
              {activeTab === "zones" ? (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-px left-6 right-6 h-[8px] z-0 text-primary flex items-center"
                  transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
                >
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                    <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              ) : (
                <div className="absolute -bottom-px left-6 right-6 h-[8px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-0 origin-center text-primary/30 flex items-center">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                    <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {activeTab === "wings" ? (
            <div id="wings-panel" role="tabpanel" aria-labelledby="wings-tab" className="focus:outline-none">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>{t("துணைப் பிரிவுகள்", "Specialized Wings")}</span>
              </div>
              
              <h2 className="mt-3 font-display text-2xl md:text-4xl font-bold text-foreground leading-tight max-w-3xl">
                {t("வணிகர்களின் சங்கமத்தின் 34 பிரிவுகள்", "34 Organizational Wings")}
              </h2>
              
              <p className="mt-4 text-xs md:text-sm text-muted-foreground max-w-2xl font-tamil leading-relaxed">
                {t(
                  "உங்கள் வணிகத்தின் தன்மைக்கு ஏற்ற பிரிவைத் தேர்ந்தெடுத்து, அதற்கான சிறப்புச் சலுகைகள், சட்ட ஆலோசனைகள் மற்றும் தொழில் கூட்டுறவு வாய்ப்புகளைப் பெறுங்கள்.",
                  "Choose the wing that fits your business type to access specialized support, trade benefits, advisory services, and specific networking channels."
                )}
              </p>

              {/* Search bar */}
              <div className="mt-8 max-w-xl relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("பிரிவைத் தேடுக... (எ.கா: மகளிர், IT, உணவகம்)", "Search wings... (e.g. Women, IT, Restaurant)")}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-md bg-card shadow-xs focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-xs md:text-sm transition duration-300 min-h-[44px]"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="mt-4 sm:mt-6 scroll-x pb-2">
                <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
                <button
                  onClick={() => setSelectedDept("all")}
                  className={`px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer min-h-[44px] border ${
                    selectedDept === "all" 
                      ? "bg-primary text-white border-primary shadow-xs" 
                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t("அனைத்துப் பிரிவுகளும்", "All Departments")}
                </button>
                {DEPARTMENTS.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id)}
                    className={`px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer min-h-[44px] border ${
                      selectedDept === dept.id 
                        ? "bg-primary text-white border-primary shadow-xs" 
                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {language === "ta" ? dept.nameTa : dept.nameEn}
                  </button>
                ))}
                </div>
              </div>
            </div>
          ) : (
            <div id="zones-panel" role="tabpanel" aria-labelledby="zones-tab" className="focus:outline-none">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>{t("புவியியல் கவரேஜ்", "Geographical Coverage")}</span>
              </div>
              
              <h2 className="mt-3 font-display text-2xl md:text-4xl font-bold text-foreground leading-tight max-w-3xl">
                {t("தமிழக மண்டல மற்றும் தொகுதி வாரியான பகுப்பாய்வு", "Tamil Nadu Zone & Constituency Breakdown")}
              </h2>
              
              <p className="mt-4 text-xs md:text-sm text-muted-foreground max-w-2xl font-tamil leading-relaxed">
                {t(
                  "தமிழ்நாடு வணிகர்களின் சங்கமம் அமைப்பின் கீழ் செயல்படும் அதிகாரப்பூர்வ மண்டலங்கள், மாவட்டங்கள் மற்றும் சட்டமன்ற தொகுதிகளின் முழு விவரங்கள்.",
                  "Explore the full regional coverage of our association, mapped strictly by regional zones, covered districts, and corresponding legislative assembly constituencies."
                )}
              </p>

              {/* Statistics Panel */}
              <div className="mt-8 stats-grid max-w-md">
                <button
                  onClick={handleStatsZoneClick}
                  className="group relative overflow-hidden bg-linear-to-br from-white to-blue-50/30 border border-blue-100/80 rounded-md stats-card-padding shadow-xs hover:shadow-xs hover:shadow-blue-500/5 hover:border-blue-500/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 text-left block w-full focus:outline-none min-h-[100px]"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl -mr-4 -mt-4 transition-all duration-500 group-hover:bg-blue-500/10 group-hover:scale-110 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight tabular-nums group-hover:scale-105 origin-left transition-transform duration-300">
                        {statsZonesCount}
                      </div>
                      <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2 font-display leading-tight">
                        {t("அதிகாரப்பூர்வ மண்டலங்கள்", "Regional Zones")}
                      </div>
                    </div>
                    <div className="p-2 rounded-md bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                </button>
                <button
                  onClick={handleStatsDistrictClick}
                  className="group relative overflow-hidden bg-linear-to-br from-white to-amber-50/30 border border-amber-100/80 rounded-md stats-card-padding shadow-xs hover:shadow-xs hover:shadow-amber-500/5 hover:border-amber-500/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 text-left block w-full focus:outline-none min-h-[100px]"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl -mr-4 -mt-4 transition-all duration-500 group-hover:bg-primary/10 group-hover:scale-110 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-amber-600 tracking-tight tabular-nums group-hover:scale-105 origin-left transition-transform duration-300">
                        {statsDistrictsCount}
                      </div>
                      <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2 font-display leading-tight">
                        {t("உள்ளடக்கிய மாவட்டங்கள்", "Districts Covered")}
                      </div>
                    </div>
                    <div className="p-2 rounded-md bg-primary/10 text-amber-600 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Section className="py-8">
        {activeTab === "wings" ? (
          <div>
            {filteredWings.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-md p-6 shadow-xs max-w-md mx-auto">
                <div className="text-muted-foreground text-sm font-semibold">{t("பிரிவுகள் எதுவும் காணப்படவில்லை.", "No matching wings found.")}</div>
                <button onClick={() => setQuery("")} className="mt-3 text-xs text-primary font-bold hover:underline">
                  {t("அனைத்தையும் காட்டு", "Clear Search & View All")}
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {DEPARTMENTS.filter(d => selectedDept === "all" || selectedDept === d.id).map(dept => {
                  const deptWings = filteredWings.filter(w => dept.wings.includes(w.id));
                  if (deptWings.length === 0) return null;

                  return (
                    <div key={dept.id} className="space-y-6">
                      <div className="border-b border-border pb-3">
                        <h2 className="font-display text-lg md:text-xl font-bold text-foreground leading-snug">
                          {language === "ta" ? dept.nameTa : dept.nameEn}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed font-tamil">
                          {language === "ta" ? dept.descTa : dept.descEn}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <AnimatePresence>
                          {deptWings.map((w, index) => {
                            const Icon = w.icon;
                            return (
                              <Link
                                key={w.id}
                                to="/membership"
                                search={{ wing: w.id }}
                                className="block text-left h-full cursor-pointer focus:outline-none"
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.15) }}
                                  className="card-base card-interactive group p-5 md:p-6 flex flex-col justify-between min-h-[190px] h-full"
                                >
                                  <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-md bg-primary/5 text-primary grid place-items-center transition duration-300 group-hover:bg-primary group-hover:text-white">
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-display font-bold text-sm md:text-base text-foreground leading-snug">
                                      {language === "ta" ? w.nameTa : w.nameEn}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-tamil">
                                      {language === "ta" ? w.descriptionTa : w.descriptionEn}
                                    </p>
                                  </div>
                                  
                                  <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline transition-all">
                                      {t("சேர / Join", "Join Wing")} <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                  </div>
                                </motion.div>
                              </Link>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div ref={explorerRef} className="space-y-6 scroll-mt-20">
            {/* Contextual Controller: Back Button, Title Info, Search Input */}
            <div className="bg-muted border border-border rounded-md p-4 md:p-6 shadow-xs flex flex-col gap-4">
              
              {/* Visual Breadcrumb Progress Path */}
              <div className="flex items-center gap-2 flex-wrap text-xxs md:text-xs font-bold text-muted-foreground overflow-x-auto pb-1.5">
                <button
                  onClick={() => handleBreadcrumbClick(1)}
                  className={`hover:text-primary transition shrink-0 cursor-pointer min-h-[44px] px-3 py-2 rounded-md flex items-center border border-transparent ${currentStep === 1 ? "text-primary bg-primary/5 border-primary/10" : ""}`}
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  {t("மண்டலங்கள்", "Zones")}
                </button>
                
                {selectedZone !== "all" && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <button
                      onClick={() => handleBreadcrumbClick(2)}
                      className={`hover:text-primary transition shrink-0 cursor-pointer min-h-[44px] px-3 py-2 rounded-md flex items-center border border-transparent ${currentStep === 2 ? "text-primary bg-primary/5 border-primary/10" : ""}`}
                    >
                      <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span className="truncate max-w-[120px]">{selectedZone}</span>
                    </button>
                  </>
                )}

                {selectedDistrict !== "all" && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <button
                      onClick={() => handleBreadcrumbClick(3)}
                      className={`hover:text-primary transition shrink-0 cursor-pointer min-h-[44px] px-3 py-2 rounded-md flex items-center border border-transparent ${currentStep === 3 ? "text-primary bg-primary/5 border-primary/10" : ""}`}
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span className="truncate max-w-[120px]">{selectedDistrict}</span>
                    </button>
                  </>
                )}

                {selectedDeptZone !== "all" && activeDept && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <button
                      onClick={() => handleBreadcrumbClick(4)}
                      className={`hover:text-primary transition shrink-0 cursor-pointer min-h-[44px] px-3 py-2 rounded-md flex items-center border border-transparent ${currentStep === 4 ? "text-primary bg-primary/5 border-primary/10" : ""}`}
                    >
                      <Award className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span className="truncate max-w-[120px]">{language === "ta" ? activeDept.nameTa : activeDept.nameEn}</span>
                    </button>
                  </>
                )}

                {selectedWingZone !== "all" && activeWing && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-primary bg-primary/5 px-3 py-2 rounded-md border border-primary/10 shrink-0 flex items-center min-h-[44px]">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0 text-primary animate-pulse" />
                      <span className="truncate max-w-[120px]">{language === "ta" ? activeWing.nameTa : activeWing.nameEn}</span>
                    </span>
                  </>
                )}
              </div>

              <div className="h-px bg-muted w-full" />

              {/* Back Button & Search Filter Coordination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={() => handleBreadcrumbClick(currentStep - 1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary bg-card border border-border shadow-xs px-3 py-2 rounded-md transition cursor-pointer min-h-[44px] focus:outline-none"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t("பின்னால்", "Back")}</span>
                    </button>
                  )}
                  <div>
                    <div className="text-xxs uppercase tracking-wider text-muted-foreground font-bold">
                      {t(`படி ${currentStep} இல் 5`, `Step ${currentStep} of 5`)}
                    </div>
                    <h2 className="font-display font-extrabold text-sm md:text-base text-foreground mt-0.5 leading-none">
                      {currentStep === 1 && t("மண்டலத்தைத் தேர்ந்தெடுக்கவும்", "Select Regional Zone")}
                      {currentStep === 2 && t("மாவட்டத்தைத் தேர்ந்தெடுக்கவும்", "Select Covered District")}
                      {currentStep === 3 && t("சேவைப் பிரிவைத் தேர்ந்தெடுக்கவும்", "Select Department Service")}
                      {currentStep === 4 && t("உறுப்புப் பிரிவைத் தேர்ந்தெடுக்கவும்", "Select Specialty Wing")}
                      {currentStep === 5 && t("அதிகாரப்பூர்வ நிர்வாகிகள்", "Active Verified Officers")}
                    </h2>
                  </div>
                </div>

                {/* Context-sensitive Search Input */}
                <div className="relative w-full sm:max-w-xs shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={zoneQuery}
                    onChange={(e) => setZoneQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="block w-full pl-9 pr-3 py-2 border border-border rounded-md bg-card shadow-xs focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-xs transition duration-300 min-h-[44px]"
                  />
                </div>
              </div>

            </div>

            {/* Progressive Visual Grid Views */}
            <div className="min-h-[250px]">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Zones list */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1-zones"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredZonesList.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-card border border-border rounded-md shadow-xs">
                        <p className="text-muted-foreground text-xs font-semibold">{t("மண்டலங்கள் எதுவும் காணப்படவில்லை.", "No matching zones found.")}</p>
                        <button onClick={() => setZoneQuery("")} className="mt-2 text-xxs text-primary font-bold hover:underline">
                          {t("தேடலை நீக்கு", "Clear Search")}
                        </button>
                      </div>
                    ) : (
                      filteredZonesList.map((zone) => {
                        const distCount = Array.from(new Set(ZONE_BREAKDOWN.filter(item => item.zone === zone).map(item => item.district))).length;
                        return (
                          <button
                            key={zone}
                            onClick={() => {
                              setSelectedZone(zone);
                              setZoneQuery("");
                            }}
                            className="card-base card-interactive p-4 flex items-center justify-between group text-left cursor-pointer focus:outline-none w-full bg-card border border-border shadow-xs min-h-[44px]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-primary/5 text-primary grid place-items-center transition duration-300 group-hover:bg-primary group-hover:text-white shrink-0">
                                  <Globe className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-display font-extrabold text-xs md:text-sm text-foreground group-hover:text-primary transition truncate">
                                  {zone}
                                </h3>
                                <span className="text-[10px] font-bold text-muted-foreground block mt-0.5 uppercase tracking-wider">
                                  {t(`${distCount} மாவட்டங்கள்`, `${distCount} Districts Covered`)}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {/* Step 2: Districts list */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2-districts"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredDistrictsList.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-card border border-border rounded-md shadow-xs">
                        <p className="text-muted-foreground text-xs font-semibold">{t("மாவட்டங்கள் எதுவும் காணப்படவில்லை.", "No matching districts found.")}</p>
                        <button onClick={() => setZoneQuery("")} className="mt-2 text-xxs text-primary font-bold hover:underline">
                          {t("தேடலை நீக்கு", "Clear Search")}
                        </button>
                      </div>
                    ) : (
                      filteredDistrictsList.map((district) => {
                        const constituencyCount = ZONE_BREAKDOWN.filter(item => item.district === district).length;
                        return (
                          <button
                            key={district}
                            onClick={() => {
                              setSelectedDistrict(district);
                              setZoneQuery("");
                            }}
                            className="card-base card-interactive p-4 flex items-center justify-between group text-left cursor-pointer focus:outline-none w-full bg-card border border-border shadow-xs min-h-[44px]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-primary/5 text-primary grid place-items-center transition duration-300 group-hover:bg-primary group-hover:text-white shrink-0">
                                  <MapPin className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-display font-extrabold text-xs md:text-sm text-foreground group-hover:text-primary transition truncate uppercase">
                                  {district}
                                </h3>
                                <span className="text-[10px] font-bold text-muted-foreground block mt-0.5 uppercase tracking-wider">
                                  {t(`${constituencyCount} தொகுதிகள்`, `${constituencyCount} Constituencies`)}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {/* Step 3: Departments list */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3-departments"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {DEPARTMENTS.map((dept) => {
                      const deptColors: Record<string, { bg: string, text: string, accent: string, border: string, hover: string }> = {
                        professional: { bg: "bg-violet-50/70", text: "text-violet-750", accent: "bg-violet-600", border: "border-violet-100/80", hover: "hover:border-violet-300 hover:ring-violet-500/5" },
                        agricultural: { bg: "bg-primary/10/70", text: "text-emerald-750", accent: "bg-emerald-600", border: "border-emerald-100/80", hover: "hover:border-emerald-300 hover:ring-emerald-500/5" },
                        industrial: { bg: "bg-primary/10/70", text: "text-amber-750", accent: "bg-amber-600", border: "border-amber-100/80", hover: "hover:border-amber-300 hover:ring-amber-500/5" },
                        public: { bg: "bg-blue-50/70", text: "text-blue-750", accent: "bg-blue-600", border: "border-blue-100/80", hover: "hover:border-blue-300 hover:ring-blue-500/5" }
                      };
                      const colors = deptColors[dept.id] || { bg: "bg-muted", text: "text-foreground", accent: "bg-slate-650", border: "border-border", hover: "hover:border-slate-300" };

                      return (
                        <button
                          key={dept.id}
                          onClick={() => {
                            setSelectedDeptZone(dept.id);
                            setZoneQuery("");
                          }}
                          className={`p-5 md:p-6 border rounded-md flex flex-col justify-between text-left transition duration-300 group cursor-pointer focus:outline-none shadow-xs hover:shadow-xs hover:ring-8 bg-card min-h-[44px] ${colors.border} ${colors.hover}`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-6 rounded-full ${colors.accent}`} />
                              <h3 className={`font-display font-extrabold text-sm md:text-base leading-none ${colors.text}`}>
                                {language === "ta" ? dept.nameTa : dept.nameEn}
                              </h3>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed font-tamil">
                              {language === "ta" ? dept.descTa : dept.descEn}
                            </p>
                          </div>
                          
                          <div className="mt-6 pt-3.5 border-t border-border flex items-center justify-between w-full">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                              {t(`${dept.wings.length} சிறப்புப் பிரிவுகள்`, `${dept.wings.length} Specialized Wings`)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                              {t("அடுத்து", "Next")} <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 4: Specialty Wings list */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4-wings"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredWingsList.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-card border border-border rounded-md shadow-xs">
                        <p className="text-muted-foreground text-xs font-semibold">{t("பிரிவுகள் எதுவும் காணப்படவில்லை.", "No matching wings found.")}</p>
                        <button onClick={() => setZoneQuery("")} className="mt-2 text-xxs text-primary font-bold hover:underline">
                          {t("தேடலை நீக்கு", "Clear Search")}
                        </button>
                      </div>
                    ) : (
                      filteredWingsList.map((wing) => {
                        const WingIcon = wing.icon;
                        return (
                          <button
                            key={wing.id}
                            onClick={() => {
                              setSelectedWingZone(wing.id);
                              setZoneQuery("");
                            }}
                            className="card-base card-interactive p-4 md:p-5 flex flex-col justify-between group text-left cursor-pointer focus:outline-none w-full bg-card border border-border shadow-xs min-h-[170px]"
                          >
                            <div className="space-y-3">
                              <div className="w-9 h-9 rounded-md bg-primary/5 text-primary grid place-items-center transition duration-300 group-hover:bg-primary group-hover:text-white shrink-0">
                                <WingIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-display font-extrabold text-xs md:text-sm text-foreground leading-snug truncate">
                                  {language === "ta" ? wing.nameTa : wing.nameEn}
                                </h3>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed font-tamil">
                                  {language === "ta" ? wing.descriptionTa : wing.descriptionEn}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                {t("3 அதிகாரிகள்", "3 Active Officers")}
                              </span>
                              <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                                {t("நிர்வாகிகள்", "Officers")} <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {/* Step 5: Active Officers Profile Cards */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5-officers"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {filteredOfficersList.length === 0 ? (
                      <div className="text-center py-12 bg-card border border-border rounded-md shadow-xs max-w-md mx-auto">
                        <p className="text-muted-foreground text-xs font-semibold">{t("நிர்வாகிகள் எதுவும் காணப்படவில்லை.", "No matching officers found.")}</p>
                        <button onClick={() => setZoneQuery("")} className="mt-2 text-xxs text-primary font-bold hover:underline">
                          {t("தேடலை நீக்கு", "Clear Search")}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredOfficersList.map((officer, oIdx) => (
                          <div
                            key={`officer-${oIdx}`}
                            className="flex flex-col justify-between p-5 md:p-6 border border-border rounded-md bg-card hover:border-slate-300 transition duration-300 hover:shadow-xs relative overflow-hidden"
                          >
                            {/* Top Role Accent Strip */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                              oIdx === 0 ? "bg-blue-500" : oIdx === 1 ? "bg-primary" : "bg-primary"
                            }`} />

                            <div className="flex items-start gap-3.5 mt-2">
                              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-display font-extrabold text-[12px] tracking-wide shrink-0 border shadow-xs ${officer.avatarColor}`}>
                                {officer.initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                                    oIdx === 0 
                                      ? "bg-blue-50 text-blue-600 border-blue-100" 
                                      : oIdx === 1 
                                        ? "bg-primary/10 text-emerald-600 border-emerald-100" 
                                        : "bg-primary/10 text-amber-600 border-amber-100"
                                  }`}>
                                    {language === "ta" ? officer.roleTa : officer.roleEn}
                                  </span>
                                  <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50 shrink-0" />
                                </div>
                                <h5 className="font-display font-bold text-xs md:text-sm text-foreground mt-1.5 truncate" title={language === "ta" ? officer.nameTa : officer.nameEn}>
                                  {language === "ta" ? officer.nameTa : officer.nameEn}
                                </h5>
                              </div>
                            </div>

                            {/* Contact buttons with min 44px tap target size to align with best practices */}
                            <div className="mt-5 pt-3.5 border-t border-border flex flex-col gap-2.5">
                              <a
                                href={`tel:${officer.phone.replace(/\s+/g, "")}`}
                                className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-primary transition font-semibold min-h-[44px] px-3.5 bg-muted hover:bg-primary/5 rounded-md border border-border"
                              >
                                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="tabular-nums truncate shrink-0">{officer.phone}</span>
                              </a>
                              <a
                                href={`mailto:${officer.email}`}
                                className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-primary transition font-semibold min-h-[44px] px-3.5 bg-muted hover:bg-primary/5 rounded-md border border-border"
                              >
                                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="truncate" title={officer.email}>{officer.email}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        )}
      </Section>

      {/* Coordinator CTA section */}
      <Section className="py-12 border-t border-border bg-card">
        <div className="bg-muted text-foreground rounded-md p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-border">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {t("நிர்வாகியாக இணைய", "Join as Officer")}
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">
              {t("தலைமை ஏற்கத் தயாரா?", "Ready to Lead?")}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl font-tamil leading-relaxed">
              {t(
                "உங்கள் பரிந்துரை லிங்க் மூலம் 25 வணிகர்களை ஒன்றிணைத்து, தமிழ்நாடு வணிகர்களின் சங்கமத்தில் 'ஒருங்கிணைப்பாளர்' பொறுப்பை பெற்றிடுங்கள்!",
                "Unite 25 traders through your referral link and earn the 'Coordinator' role in the Tamil Nadu Traders Association!"
              )}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="btn-primary shrink-0"
          >
            {t("டாஷ்போர்டுக்கு செல்க", "Go to Dashboard")} <ArrowRight className="w-4 h-4 text-primary-foreground" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
