import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Section, SectionLabel } from "@/components/Section";
import { 
  Users, HeartPulse, Coins, MapPin, Globe, TrendingUp,
  Award, ArrowUpRight, ArrowDownRight, ChevronRight, CheckCircle2,
  Calendar, FileText, BarChart3, PieChart as PieIcon, ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Association Analytics · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Interactive growth insights, regional distributions, and business credit capital allocation statistics of TNVS." },
    ],
  }),
  component: AnalyticsDashboard,
});

// ─── DATA MODELS & MOCKS ──────────────────────────────────────────────────────

export type MonthData = { month: string; members: number; labelTa: string; labelEn: string };
export const growthData: MonthData[] = [
  { month: "May 25", members: 85200,  labelTa: "மே 25", en: "May 25" },
  { month: "Jun 25", members: 88400,  labelTa: "ஜூன் 25", en: "Jun 25" },
  { month: "Jul 25", members: 91900,  labelTa: "ஜூலை 25", en: "Jul 25" },
  { month: "Aug 25", members: 94800,  labelTa: "ஆக 25", en: "Aug 25" },
  { month: "Sep 25", members: 98100,  labelTa: "செப் 25", en: "Sep 25" },
  { month: "Oct 25", members: 102300, labelTa: "அக் 25", en: "Oct 25" },
  { month: "Nov 25", members: 106900, labelTa: "நவ 25", en: "Nov 25" },
  { month: "Dec 25", members: 110500, labelTa: "டிச 25", en: "Dec 25" },
  { month: "Jan 26", members: 114200, labelTa: "ஜன 26", en: "Jan 26" },
  { month: "Feb 26", members: 118600, labelTa: "பிப் 26", en: "Feb 26" },
  { month: "Mar 26", members: 121800, labelTa: "மார்ச் 26", en: "Mar 26" },
  { month: "Apr 26", members: 124560, labelTa: "ஏப் 26", en: "Apr 26" },
] as any;

export type WingMetric = { id: string; nameEn: string; nameTa: string; count: number; colorClass: string; percentage: number };
export const wingMetrics: WingMetric[] = [
  { id: "professional", nameEn: "Professional Services", nameTa: "தொழில்முறைப் பிரிவுகள்", count: 38450, colorClass: "bg-violet-500", percentage: 31 },
  { id: "agricultural", nameEn: "Agricultural & Food", nameTa: "விவசாயம் & உணவு", count: 24120, colorClass: "bg-emerald-500", percentage: 19 },
  { id: "industrial", nameEn: "Industrial & Manufacturing", nameTa: "தொழில் & வர்த்தகம்", count: 31900, colorClass: "bg-amber-500", percentage: 26 },
  { id: "public", nameEn: "Public & General Services", nameTa: "பொது & சமூகப் பிரிவுகள்", count: 30090, colorClass: "bg-blue-500", percentage: 24 },
];

export type DistrictStat = { nameEn: string; nameTa: string; zone: string; count: number; claims: number; ratio: string };
export const districtStats: DistrictStat[] = [
  { nameEn: "Chennai", nameTa: "சென்னை", zone: "North Zone", count: 28450, claims: 24, ratio: "0.08%" },
  { nameEn: "Coimbatore", nameTa: "கோயம்புத்தூர்", zone: "West Zone", count: 18120, claims: 15, ratio: "0.08%" },
  { nameEn: "Madurai", nameTa: "மதுரை", zone: "South Zone", count: 14200, claims: 11, ratio: "0.07%" },
  { nameEn: "Trichy", nameTa: "திருச்சி", zone: "Central Zone", count: 11850, claims: 9, ratio: "0.07%" },
  { nameEn: "Salem", nameTa: "சேலம்", zone: "West Zone", count: 10900, claims: 8, ratio: "0.07%" },
  { nameEn: "Tiruppur", nameTa: "திருப்பூர்", zone: "West Zone", count: 9800, claims: 7, ratio: "0.07%" },
  { nameEn: "Tirunelveli", nameTa: "திருநெல்வேலி", zone: "South Zone", count: 8640, claims: 6, ratio: "0.07%" },
  { nameEn: "Vellore", nameTa: "வேலூர்", zone: "North Zone", count: 7200, claims: 5, ratio: "0.07%" },
  { nameEn: "Kanchipuram", nameTa: "காஞ்சிபுரம்", zone: "North Zone", count: 5400, claims: 4, ratio: "0.07%" },
  { nameEn: "Others", nameTa: "இதர மாவட்டங்கள்", zone: "Statewide", count: 10000, claims: 9, ratio: "0.09%" },
];

export type WelfareSegment = { nameEn: string; nameTa: string; value: number; amount: string; percentage: number; color: string; dashArray: string; dashOffset: string };
export const welfareDistribution: WelfareSegment[] = [
  { nameEn: "Retail Trader Loans", nameTa: "சில்லறை வணிகக் கடன்", value: 45, amount: "₹5.62 Cr", percentage: 45, color: "#10b981", dashArray: "282.7", dashOffset: "0" },
  { nameEn: "Young Entrepreneur Loans", nameTa: "இளைய தொழில்முனைவோர் கடன்", value: 30, amount: "₹3.75 Cr", percentage: 30, color: "#3b82f6", dashArray: "282.7", dashOffset: "127.2" },
  { nameEn: "Micro & Street Vendor Loans", nameTa: "குறுந்தொழில் கடன்", value: 25, amount: "₹3.13 Cr", percentage: 25, color: "#f59e0b", dashArray: "282.7", dashOffset: "212.0" },
];

function AnalyticsDashboard() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "regional" | "welfare">("overview");
  
  // Sort State for Districts Leaderboard
  const [sortField, setSortField] = useState<"count" | "claims">("count");
  const [sortAsc, setSortAsc] = useState(false);

  // Line Chart Interactive Tooltip State
  const [hoveredPoint, setHoveredPoint] = useState<MonthData | null>(null);
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50/40">
      
      {/* Header Profile Section */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-12 w-full">
          <SectionLabel>{t("அசோசியேஷன் புள்ளிவிவரம்", "ASSOCIATION INTEL & STATS")}</SectionLabel>
          <h1 className="mt-3 font-display text-2xl md:text-4.5xl font-bold text-slate-900 leading-tight">
            {t("மாநில அளவிலான வளர்ச்சி மற்றும் பகுப்பாய்வு", "Statewide Growth & Analytical Breakdown")}
          </h1>
          <p className="mt-3 text-xs md:text-sm text-slate-500 max-w-2xl font-tamil leading-relaxed">
            {t(
              "உறுப்பினர் சேர்க்கை, 34 தனிப்பிரிவுகள், 38 மாவட்டங்கள் மற்றும் வணிகக் கடன் ஒதுக்கீடுகளை பகுப்பாய்வு செய்யும் அதிகாரப்பூர்வ கண்காணிப்பகம்.",
              "The official dashboard providing live statistical transparency for member registrations, specialized departments, and business credit capital distribution across Tamil Nadu."
            )}
          </p>

          {/* Sub-Header Tab Switcher */}
          <div className="flex border-b border-slate-200 mt-8" role="tablist" aria-label="Analytics Navigation">
            {[
              { id: "overview", ta: "பொது விவரங்கள்", en: "Overview" },
              { id: "regional", ta: "மண்டல வாரியாக", en: "Regional Layout" },
              { id: "welfare", ta: "நிதியுதவி & கடன்கள்", en: "Loans & Credit" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 px-4 sm:px-6 font-display text-xs sm:text-sm font-bold transition-all relative cursor-pointer group ${
                    active ? "text-primary font-extrabold" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="relative z-10">{language === "ta" ? tab.ta : tab.en}</span>
                  {active ? (
                    <motion.div
                      layoutId="activeTabIntelUnderline"
                      className="absolute -bottom-px left-4 right-4 h-[8px] z-0 text-primary flex items-center"
                      transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
                    >
                      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                        <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="absolute -bottom-px left-4 right-4 h-[8px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-0 origin-center text-primary/30 flex items-center">
                      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full" fill="none">
                        <path d="M 2,2 Q 6,8 12,8 L 88,8 Q 94,8 98,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Section className="py-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div
              key="overview-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Premium Key Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric 1 */}
                <div className="relative overflow-hidden card-base p-6 bg-linear-to-br from-white to-blue-50/10 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
                        {t("பதிவுசெய்த உறுப்பினர்கள்", "TOTAL ACTIVE MEMBERS")}
                      </div>
                      <div className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight tabular-nums">
                        1,24,560
                      </div>
                    </div>
                    <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0"><Users className="w-5 h-5" /></div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+12.4% {t("இந்த மாதம்", "this month")}</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="relative overflow-hidden card-base p-6 bg-linear-to-br from-white to-emerald-50/10 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
                        {t("வழங்கப்பட்ட கடனுதவி", "CREDIT DISBURSED")}
                      </div>
                      <div className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight tabular-nums">
                        ₹8.40 Cr
                      </div>
                    </div>
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0"><Award className="w-5 h-5" /></div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>94.8% {t("ஒப்புதல் விகிதம்", "loan approval")}</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="relative overflow-hidden card-base p-6 bg-linear-to-br from-white to-amber-50/10 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-500/20 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
                        {t("வட்டி இல்லா வணிகக் கடன்", "0% INTEREST CAPITAL")}
                      </div>
                      <div className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight tabular-nums">
                        ₹12.50 Cr
                      </div>
                    </div>
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl shrink-0"><Coins className="w-5 h-5" /></div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-primary">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>420+ {t("விண்ணப்பதாரர்கள்", "traders assisted")}</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="relative overflow-hidden card-base p-6 bg-linear-to-br from-white to-indigo-50/10 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
                        {t("மண்டலப் பரப்பளவு", "DISTRICT FOOTPRINT")}
                      </div>
                      <div className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight tabular-nums">
                        38 / 38
                      </div>
                    </div>
                    <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl shrink-0"><Globe className="w-5 h-5" /></div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-slate-500">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>100% {t("மாநில அளவிலான பரப்பு", "state coverage")}</span>
                  </div>
                </div>
              </div>

              {/* Hardware Accelerated SVG Line Chart (Member Growth Trends) */}
              <div className="card-base p-6 bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
                      {t("உறுப்பினர் சேர்க்கை வளர்ச்சி வரைபடம்", "Membership Growth Over Time (1 Year)")}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-tamil mt-1">
                      {t("2025 மே முதல் 2026 ஏப்ரல் வரையிலான மாதாந்திர பதிவு விவரங்கள்.", "Historical compilation of monthly active registered trader counts.")}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full uppercase">
                    12 MONTH COMPILATION
                  </span>
                </div>

                {/* Custom Responsive SVG Chart Canvas */}
                <div className="relative pt-2 pb-1 bg-linear-to-b from-slate-50/50 to-white rounded-xl border border-slate-100 shadow-inner overflow-x-auto select-none">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="min-w-[640px] w-full h-[220px]"
                    onMouseLeave={() => {
                      setHoveredPoint(null);
                      setHoveredIndex(null);
                    }}
                  >
                    {/* Glowing Accent Shadow Filters */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="neonGlow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1e3a8a" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* Horizontal Guideline Grids */}
                    {[80000, 100000, 120000].map((gridVal, i) => {
                      const yRange = chartHeight - padding.top - padding.bottom;
                      const y = chartHeight - padding.bottom - ((gridVal - 70000) / (135000 - 70000)) * yRange;
                      return (
                        <g key={i}>
                          <line 
                            x1={padding.left} 
                            y1={y} 
                            x2={chartWidth - padding.right} 
                            y2={y} 
                            stroke="#e2e8f0" 
                            strokeWidth="1" 
                            strokeDasharray="4 4" 
                          />
                          <text 
                            x={padding.left - 12} 
                            y={y + 4} 
                            fill="#94a3b8" 
                            fontSize="9" 
                            fontWeight="bold"
                            textAnchor="end"
                            className="font-mono"
                          >
                            {`${gridVal / 1000}k`}
                          </text>
                        </g>
                      );
                    })}

                    {/* Gradient Area Path Underneath the Line */}
                    <path d={areaPath} fill="url(#chartGradient)" />

                    {/* The Main Glowing Data Trend Line */}
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#1e3a8a" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      filter="url(#neonGlow)"
                    />

                    {/* Grid Boundary Axis Lines */}
                    <line 
                      x1={padding.left} 
                      y1={chartHeight - padding.bottom} 
                      x2={chartWidth - padding.right} 
                      y2={chartHeight - padding.bottom} 
                      stroke="#cbd5e1" 
                      strokeWidth="1.5" 
                    />

                    {/* Axis Labels (Months) */}
                    {points.map((p, index) => (
                      <g key={index}>
                        {/* Month Text */}
                        <text 
                          x={p.x} 
                          y={chartHeight - padding.bottom + 18} 
                          fill={hoveredIndex === index ? "#1e3a8a" : "#94a3b8"} 
                          fontSize="9" 
                          fontWeight="bold"
                          textAnchor="middle"
                          className="font-display"
                        >
                          {language === "ta" ? p.data.labelTa : p.data.month}
                        </text>
                        
                        {/* Active point indicator node */}
                        {hoveredIndex === index && (
                          <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="6" 
                            fill="#1e3a8a" 
                            stroke="#ffffff" 
                            strokeWidth="2" 
                            className="shadow"
                          />
                        )}

                        {/* Interactive overlay columns for hover detection */}
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

                  {/* Interactive Dynamic Floating Tooltip */}
                  <AnimatePresence>
                    {hoveredPoint && hoveredIndex !== null && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute bg-slate-900 text-white rounded-xl p-3 shadow-lg border border-slate-800 pointer-events-none text-xs space-y-1"
                        style={{
                          left: `${Math.min(Math.max((hoveredIndex / (growthData.length - 1)) * 85 + 5, 10), 80)}%`,
                          top: "24px"
                        }}
                      >
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {language === "ta" ? hoveredPoint.labelTa : hoveredPoint.month}
                        </div>
                        <div className="font-mono text-sm font-black text-gold">
                          {hoveredPoint.members.toLocaleString()} {language === "ta" ? "வணிகர்கள்" : "Traders"}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1 font-sans">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>+{(hoveredIndex > 0 ? ((hoveredPoint.members - growthData[hoveredIndex - 1].members) / growthData[hoveredIndex - 1].members * 100).toFixed(1) : "4.2")}% MoM</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: REGIONAL ANALYTICS */}
          {activeTab === "regional" && (
            <motion.div
              key="regional-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid lg:grid-cols-12 gap-6 items-start"
            >
              
              {/* Leaderboard Table (Left 7 Cols) */}
              <div className="lg:col-span-7 card-base p-5 md:p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-800">
                      {t("மாவட்ட வாரியான முன்னணி அட்டவணை", "Active Districts Coverage Leaderboard")}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-tamil">
                      {t("மாவட்ட வாரியாக பதிவு செய்த உறுப்பினர்கள் மற்றும் கோரப்பட்ட நலத்திட்டங்கள்.", "Sort districts by member counts or active emergency aid requests.")}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase">
                    DISTRICT RANKING
                  </span>
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2 text-xxs font-bold uppercase tracking-wider text-slate-500">
                  <button 
                    onClick={() => toggleSort("count")}
                    className={`px-3 py-1.5 border rounded-lg flex items-center gap-1 transition-all cursor-pointer ${sortField === "count" ? "bg-primary border-primary text-white" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                  >
                    <span>{t("உறுப்பினர்கள்", "Traders")}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => toggleSort("claims")}
                    className={`px-3 py-1.5 border rounded-lg flex items-center gap-1 transition-all cursor-pointer ${sortField === "claims" ? "bg-primary border-primary text-white" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                  >
                    <span>{t("கோரிக்கைகள்", "Claims")}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left border-collapse" aria-label="District Stats Table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{t("மாவட்டம்", "District")}</th>
                        <th className="px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{t("மண்டலம்", "Zone")}</th>
                        <th className="px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">{t("வியாபாரிகள்", "Members")}</th>
                        <th className="px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">{t("கோரிக்கைகள்", "Claims")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDistricts.map((dist, idx) => (
                        <tr key={dist.nameEn} className="border-b border-slate-100 hover:bg-slate-50/60 transition text-slate-700">
                          <td className="px-4 py-3.5 text-xs font-bold text-slate-800">
                            <span className="inline-block w-4 text-[10px] text-slate-400 font-mono">{idx + 1}.</span>
                            {language === "ta" ? dist.nameTa : dist.nameEn}
                          </td>
                          <td className="px-4 py-3.5 text-[10px] uppercase font-bold text-slate-400">{dist.zone}</td>
                          <td className="px-4 py-3.5 text-xs font-bold font-mono text-slate-800 text-right tabular-nums">{dist.count.toLocaleString()}</td>
                          <td className="px-4 py-3.5 text-xs font-bold font-mono text-right text-indigo-600 tabular-nums">
                            {dist.claims} <span className="text-[10px] font-normal text-slate-400">({dist.ratio})</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {sortedDistricts.map((dist, idx) => (
                    <div key={dist.nameEn} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-slate-800">
                            {language === "ta" ? dist.nameTa : dist.nameEn}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          {dist.zone}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t("வியாபாரிகள்", "Members")}</div>
                          <div className="text-sm font-bold font-mono text-slate-800 mt-1 tabular-nums">{dist.count.toLocaleString()}</div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">{t("கோரிக்கைகள்", "Claims")}</div>
                          <div className="text-sm font-bold font-mono text-indigo-700 mt-1 tabular-nums">
                            {dist.claims} <span className="text-[10px] font-normal text-indigo-400">({dist.ratio})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wing Distribution Chart (Right 5 Cols) */}
              <div className="lg:col-span-5 card-base p-5 md:p-6 bg-white border border-slate-200/80 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary animate-pulse" />
                    {t("துறை வாரியான பகிர்வு", "Organizational Wings Distribution")}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-tamil">
                    {t("4 சேவைப் பிரிவுகளின் கீழ் 34 உத்தியோகபூர்வ பிரிவுகளின் உறுப்பினர் விகிதம்.", "Member ratio distribution across the 4 main service departments.")}
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  {wingMetrics.map((wing) => (
                    <div key={wing.id} className="space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-700">
                          {language === "ta" ? wing.nameTa : wing.nameEn}
                        </span>
                        <div className="flex gap-2 items-center font-mono">
                          <span className="font-bold text-slate-900">{wing.count.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">{wing.percentage}%</span>
                        </div>
                      </div>
                      
                      {/* Interactive visual progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${wing.percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${wing.colorClass} shadow-xs relative`}
                        >
                          {/* Inner glowing accent stripe */}
                          <div className="absolute inset-0 bg-white/10" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Statistics Card */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-xs text-primary leading-relaxed space-y-1">
                  <p className="font-bold">Total Wings: 34 Sub-Divisions</p>
                  <p className="text-slate-500 font-tamil leading-relaxed">
                    ஒவ்வொரு பிரிவிற்கும் தனித்தனியாக 3 அதிகாரிகள் (தலைவர், செயலாளர், பொருளாளர்) தேர்ந்தெடுக்கப்பட்டு மாவட்ட வாரியாக செயல்படுகின்றனர்.
                  </p>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 3: WELFARE & CREDIT CAPITAL */}
          {activeTab === "welfare" && (
            <motion.div
              key="welfare-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid lg:grid-cols-12 gap-6 items-start"
            >
              
              {/* SVG Donut Chart (Left 5 Cols) */}
              <div className="lg:col-span-5 card-base p-5 md:p-6 bg-white border border-slate-200/80 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-primary animate-pulse" />
                    {t("கடன் விநியோகப் பகிர்வு", "Loan Portfolio Distribution (Donut Chart)")}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-tamil">
                    {t("₹12.5 கோடி மொத்த வணிகக் கடன் ஒதுக்கீட்டின் விநியோக விகிதம்.", "Breakdown of ₹12.5 Crore credit capital distributed to registered traders.")}
                  </p>
                </div>

                {/* Dynamic SVG Donut Drawing */}
                <div className="flex flex-col items-center justify-center py-2 space-y-4">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="9" />
                      {welfareDistribution.map((seg, idx) => (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="9"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                          strokeLinecap="round"
                        />
                      ))}
                    </svg>
                    {/* Centered label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 font-sans tracking-wide">TOTAL LOANS</span>
                      <span className="text-sm font-black text-slate-800 font-mono">₹12.50 Cr</span>
                    </div>
                  </div>

                  {/* Legends List */}
                  <div className="w-full grid grid-cols-1 gap-2 pt-2 text-xs">
                    {welfareDistribution.map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl transition">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                          <span className="font-bold text-slate-700">
                            {language === "ta" ? seg.nameTa : seg.nameEn}
                          </span>
                        </div>
                        <div className="font-mono font-bold text-slate-800">
                          {seg.amount} <span className="text-[10px] text-slate-400 font-normal">({seg.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Credit Scheme Information Board (Right 7 Cols) */}
              <div className="lg:col-span-7 card-base p-5 md:p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    {t("வட்டியற்ற கடனுதவி பகுப்பாய்வு", "0% Interest Credit Scheme Statistics")}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-tamil">
                    {t("Proprietorships, Freelancers, மற்றும் கூட்டு வியாபாரிகளுக்கான சிறப்பு மானியக் கடன்.", "Analytical report on capital distribution for subsidized business loans.")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stat Card 1 */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
                    <div className="text-[10px] font-black uppercase text-slate-400 font-sans tracking-wide">BUSINESS ASSISTANCE CAP</div>
                    <div className="text-lg font-black text-slate-800">₹25,00,000</div>
                    <p className="text-[10px] text-slate-500 font-tamil leading-relaxed">
                      ஒரு தகுதியான வணிகருக்கு வழங்கப்படும் அதிகபட்ச வட்டியில்லா கடன் வரம்பு.
                    </p>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
                    <div className="text-[10px] font-black uppercase text-slate-400 font-sans tracking-wide">AVERAGE REQUEST TIME</div>
                    <div className="text-lg font-black text-slate-800">48-72 {t("மணிகள்", "Hours")}</div>
                    <p className="text-[10px] text-slate-500 font-tamil leading-relaxed">
                      அரசு மானியங்கள் சரிபார்க்கப்பட்டு கடன் ஒப்புதல் பெற எடுக்கும் சராசரி நேரம்.
                    </p>
                  </div>
                </div>

                {/* Subsidized Loan Progress Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest">
                    {t("கடன் விநியோகப் பிரிவு", "Capital Distribution by Sector")}
                  </h4>
                  
                  {[
                    { label: "Proprietorship & Retail", percentage: 55, amount: "₹6.87 Cr", color: "bg-amber-500" },
                    { label: "Partnership & Pvt Ltd", percentage: 30, amount: "₹3.75 Cr", color: "bg-blue-500" },
                    { label: "Freelancers & Home-based", percentage: 15, amount: "₹1.88 Cr", color: "bg-purple-500" },
                  ].map((sec) => (
                    <div key={sec.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 font-display">{sec.label}</span>
                        <span className="font-mono text-slate-800">{sec.amount} ({sec.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sec.percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${sec.color} shadow-xxs`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </Section>
      
    </div>
  );
}
