import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  CheckCircle2, User, Phone, MapPin, Award, ArrowRight, FileText, 
  Search, GraduationCap, Heart, HelpCircle, Play, Sparkles, ArrowLeft, ChevronDown, ShieldAlert, Check
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { DemoModeBanner } from "@/components/DemoModeBanner";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Support Center · TN Vanigargalin Sangamam" },
      { name: "description", content: "Get instant help, verify membership status, view welfare schemes, and read FAQs in Tamil and English." },
    ],
  }),
  component: Assistant,
});

export function Assistant() {
  const { language, t } = useLanguage();
  
  // Status checker state
  const [epicSearch, setEpicSearch] = useState("");
  const [checkedProfile, setCheckedProfile] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Search profile simulation handler
  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epicSearch.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setCheckedProfile(null);

    setTimeout(() => {
      setIsSearching(false);
      const query = epicSearch.trim().toUpperCase();
      
      if (query.length > 2) {
        setCheckedProfile({
          name: t("மாதிரி சுயவிவரம் — செந்தில் குமார் (Demo)", "Sample Profile — Senthil Kumar (Demo)"),
          mobile: "+91 944 20 •• 44",
          district: "Chennai",
          epic: query.startsWith("TNVS") ? query : `TNVS-${query}`,
          timeline: [
            { label: t("விண்ணப்பம் பெறப்பட்டது", "Application Received"), desc: t("அனைத்து விவரங்களும் பெறப்பட்டன", "Submitted successfully"), completed: true, date: "May 12" },
            { label: t("சரிபார்ப்பு பணி", "Under Verification"), desc: t("மாவட்ட நிர்வாக ஒப்புதல் பெற்றது", "Approved by district team"), completed: true, date: "May 14" },
            { label: t("அட்டை உருவாக்கப்பட்டது", "Card Generated"), desc: t("செயலில் உள்ள உறுப்பினர் அட்டை", "Active and downloadable"), completed: true, date: "May 15" }
          ]
        });
      } else {
        setSearchError(t("சரியான EPIC ID அல்லது கைபேசி எண்ணை உள்ளிடவும்.", "Please enter a valid EPIC ID or Mobile Number."));
      }
    }, 800);
  };

  const welfareSchemes = [
    {
      title: t("சுகாதார காப்பீடு", "Health Insurance"),
      desc: t("உங்களுக்கும் உங்கள் குடும்பத்திற்கும் ₹2,00,000 வரை ரொக்கமில்லா மருத்துவமனை அனுமதி.", "Cashless hospitalization up to ₹2,00,000 for your family."),
      icon: <Heart className="w-5 h-5 text-rose-500" aria-hidden="true" />,
      bg: "bg-rose-50/50 border-rose-100"
    },
    {
      title: t("கல்வி உதவித்தொகை", "Educational Scholarship"),
      desc: t("செயலில் உள்ள வணிகர்களின் குழந்தைகளுக்கு ஆண்டுக்கு ₹15,000 வரை உதவித்தொகை.", "Up to ₹15,000 per year for children of active traders."),
      icon: <GraduationCap className="w-5 h-5 text-indigo-500" aria-hidden="true" />,
      bg: "bg-indigo-50/50 border-indigo-100"
    },
    {
      title: t("அவசர நிவாரண நிதி", "Emergency Relief Fund"),
      desc: t("கடை தீ விபத்து அல்லது இயற்கை பேரிடர் ஏற்பட்டால் 48 மணி நேரத்திற்குள் உடனடி நிவாரணம்.", "Immediate disaster/shop fire support within 48 hours."),
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" aria-hidden="true" />,
      bg: "bg-amber-50/50 border-amber-100"
    }
  ];

  const faqs = [
    {
      q: t("தேவையான ஆவணங்கள் என்னென்ன?", "What documents are required for application?"),
      a: t("புதிய உறுப்பினர் சேர்க்கைக்கு: 1. ஆதார் அட்டை, 2. கடை உரிமம் அல்லது GST சான்று, 3. பாஸ்போர்ட் அளவு புகைப்படம்.", "For new membership: 1. Aadhaar Card, 2. Shop License or GST certificate, 3. Passport size photo.")
    },
    {
      q: t("உறுப்பினர் சேர்க்கை மற்றும் புதுப்பித்தல் கட்டணம் எவ்வளவு?", "How much is the membership registration fee?"),
      a: t("வருடாந்திர உறுப்பினர் கட்டணம் ₹500 மட்டுமே. வருடாந்திர புதுப்பித்தல் கட்டணமும் ₹500 ஆகும். இரண்டையும் ஆன்லைனில் பாதுகாப்பாக செலுத்தலாம்.", "The annual membership registration fee is ₹500 only. Renewal fees are also ₹500 per year, payable securely online.")
    },
    {
      q: t("நலத்திட்டங்கள் பெற தகுதி என்ன?", "What is the eligibility for welfare schemes?"),
      a: t("நலத்திட்டங்களுக்கு தகுதி பெற, நீங்கள் குறைந்தபட்சம் 6 மாதங்கள் செயலில் உள்ள உறுப்பினராக இருக்க வேண்டும் மற்றும் உங்கள் சந்தாக்கள் நிலுவையின்றி இருக்க வேண்டும்.", "To qualify for welfare, you must be a registered member for at least 6 months, and hold an Active Membership Card (no pending dues).")
    },
    {
      q: t("உறுப்பினர் சான்றிதழை எவ்வாறு பதிவிறக்கம் செய்வது?", "How do I download my membership certificate?"),
      a: t("விண்ணப்பம் அங்கீகரிக்கப்பட்டதும், உங்கள் உத்தியோகபூர்வ சான்றிதழை உங்கள் உறுப்பினர் டாஷ்போர்டில் இருந்தோ அல்லது சேவைகள் பக்கத்திலிருந்தோ எந்த நேரத்திலும் பதிவிறக்கம் செய்யலாம்.", "Once approved, you can instantly download your official stamped membership certificate from the Services page or your dashboard.")
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Top Breadcrumb */}
      <div>
        <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-4 pb-2 transition-all">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> {t("சேவைகளுக்குத் திரும்பு", "Back to Services")}
        </Link>
      </div>

      {/* Hero Welcome Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" aria-hidden="true" />
          <span>{t("சங்கம உதவி மற்றும் சேவை மையம்", "Support & Service Center")}</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {t("உங்களுக்கு எவ்வாறு உதவ முடியும்?", "How can we help you today?")}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-tamil">
          {t(
            "உறுப்பினர் சேர்க்கை, நலத்திட்டங்கள் மற்றும் கணக்கு சரிபார்ப்புகளை விரைவாக செய்ய உங்கள் உத்தியோகபூர்வ உதவி மையம்.",
            "Your official support center to check membership, verify status, and explore welfare schemes instantly."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Interactive Widgets (Reordered: FAQ -> Status Checker -> Welfare Schemes) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* FAQ - Progressive Accordions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-800">
                {t("அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)", "Frequently Asked Questions")}
              </h3>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border rounded-xl overflow-hidden transition duration-300 bg-white ${isOpen ? "border-primary/30 ring-4 ring-primary/5" : "border-slate-100 hover:bg-slate-50/40"}`}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 cursor-pointer min-h-[44px]"
                      aria-expanded={isOpen}
                    >
                      <span className="text-xs font-bold text-slate-700 leading-snug font-tamil">
                        {faq.q}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} 
                        aria-hidden="true"
                      />
                    </button>
                      {isOpen && (
                        <div className="animate-fade-in">
                          <div className="px-4 pb-4 pt-1.5 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-tamil">
                            {faq.a}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Checker */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                <Search className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-800">
                {t("உறுப்பினர் நிலை சரிபார்த்தல்", "Verify Membership Status")}
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-tamil">
              {t(
                "உங்கள் உறுப்பினர் நிலையை அறிய, தயவுசெய்து உங்கள் EPIC ID / மொபைல் எண்ணை உள்ளிடவும்:",
                "To check your membership status, please enter your EPIC ID or registered Mobile Number below:"
              )}
            </p>

            <form onSubmit={handleCheckStatus} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                required
                type="text"
                value={epicSearch}
                onChange={(e) => setEpicSearch(e.target.value)}
                placeholder={t("e.g. TNVS-782 அல்லது கைபேசி எண்", "e.g. TNVS-782 or Mobile Number")}
                className="flex-1 border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition duration-300 min-h-[44px]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-5 rounded-xl text-xs active:scale-95 transition cursor-pointer min-h-[44px]"
              >
                {isSearching ? t("சரிபார்க்கிறது...", "Verifying...") : t("தேடுக", "Verify")}
              </button>
            </form>

            <div className="mt-1">
              <DemoModeBanner message={t("விண்ணப்ப நிலை சரிபார்ப்பு தற்போது டெமோ பயன்முறையில் உள்ளது.", "Membership status checking is currently simulated for demo purposes.")} />
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 flex items-center gap-2 font-tamil animate-fade-in">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" aria-hidden="true" />
                {searchError}
              </div>
            )}

            {/* Simulated Live Timeline Tracker */}
              {checkedProfile && (
                <div className="animate-fade-in p-5 bg-slate-50/50 border border-slate-200/60 rounded-2xl space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs md:text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-800" aria-hidden="true" />
                      <span>{t("உறுப்பினர் கணக்கு செயலில் உள்ளது", "Active Profile (Demo)")}</span>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t("சரிபார்க்கப்பட்டது", "Verified")}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 shadow-xs">
                      <User className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="text-xs uppercase font-bold text-slate-400">Name</div>
                        <div className="font-semibold text-slate-700">{checkedProfile.name}</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 shadow-xs">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="text-xs uppercase font-bold text-slate-400">Mobile</div>
                        <div className="font-semibold text-slate-700">{checkedProfile.mobile}</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 shadow-xs">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="text-xs uppercase font-bold text-slate-400">District</div>
                        <div className="font-semibold text-slate-700">{checkedProfile.district}</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 shadow-xs">
                      <Award className="w-4 h-4 text-emerald-800 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="text-xs uppercase font-bold text-slate-400">EPIC ID</div>
                        <div className="font-mono font-bold text-emerald-850">{checkedProfile.epic}</div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Status Tracker Timeline */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-450">Application Progress Timeline</div>
                    
                    <div className="space-y-4">
                      {checkedProfile.timeline.map((step: any, idx: number) => (
                        <div key={idx} className="flex gap-3 relative">
                          {idx < checkedProfile.timeline.length - 1 && (
                            <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-emerald-100" />
                          )}
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">{step.label}</h4>
                              <span className="text-xs text-slate-400 font-mono">{step.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-tamil mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    <Link 
                      to="/voter-id" 
                      search={{ q: checkedProfile.epic }}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer min-h-[38px]"
                    >
                      {t("அட்டை பெறுக", "Get ID Card")} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link 
                      to="/services" 
                      className="text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 transition active:scale-95 cursor-pointer min-h-[38px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> {t("சான்றிதழ் பெறுக", "Download Certificate")}
                    </Link>
                  </div>
                </div>
              )}
          </div>
 
          {/* Welfare Schemes */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Heart className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-800">
                {t("சங்கமத்தின் சிறப்பு நலத்திட்டங்கள்", "Official Welfare Schemes")}
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-tamil">
              {t(
                "தமிழ்நாடு வணிகர்களின் சங்கமம் உறுப்பினர்களுக்கு 3 முக்கிய நலத்திட்டங்களை வழங்குகிறது:",
                "Tamilnadu Vanigargalin Sangamam offers three core welfare schemes to all verified active members:"
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {welfareSchemes.map((scheme, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-2xl shadow-xs hover:shadow-sm transition flex flex-col justify-between space-y-3 ${scheme.bg}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-100 shrink-0">
                        {scheme.icon}
                      </div>
                      <h4 className="font-display font-bold text-xs text-slate-800 leading-tight">
                        {scheme.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-tamil">
                      {scheme.desc}
                    </p>
                  </div>
                  <Link 
                    to="/services" 
                    className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    {t("மேலும் அறிய →", "Learn more →")}
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Widgets (Promo & Info & Contact) */}
        <div className="space-y-6">
          
          {/* SIDEBAR WIDGET 1: Hero Membership Application Promo */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-xl" aria-hidden="true" />
            
            <div className="relative space-y-3">
              <span className="text-xs bg-gold/20 border border-gold/15 text-gold px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {t("உறுப்பினர் சேர்க்கை", "Join Sangamam")}
              </span>
              <h3 className="font-display font-bold text-base leading-snug">
                {t("5 நிமிடங்களில் ஆன்லைனில் விண்ணப்பிக்கவும்", "Apply Online in 5 Minutes")}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-tamil">
                {t(
                  "உங்களிடம் ஆதார் அட்டை, வணிக முகவரி சான்று மற்றும் புகைப்படம் தயாராக இருக்க வேண்டும். உடனே டிஜிட்டல் உறுப்பினர் அட்டை பெற்றிடுங்கள்.",
                  "Submit details online, generate your digital ID card instantly, and receive your official framed certificate."
                )}
              </p>
              
              <div className="pt-2">
                <Link 
                  to="/membership" 
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer min-h-[40px]"
                >
                  {t("விண்ணப்பிக்க தொடங்கவும்", "Start Application")} 
                  <ArrowRight className="w-4 h-4 text-slate-900" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* SIDEBAR WIDGET 2: Welcome Video */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center text-primary border border-primary/10">
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <h4 className="font-display font-bold text-xs text-slate-800">
                {t("வரவேற்பு காணொளி", "Welcome Video")}
              </h4>
            </div>
            <video
              src="/welcome_video.mp4"
              controls
              preload="none"
              poster="/favicon.png"
              className="w-full block"
              aria-label={t("தமிழ்நாடு வணிகர்களின் சங்கமம் வரவேற்பு காணொளி", "Tamil Nadu Vanigargalin Sangamam welcome video")}
            />
            <p className="px-4 py-2.5 text-[11px] text-muted-foreground font-tamil leading-relaxed">
              {t("சங்கமத்தில் சேரும் முன் இந்த காணொளியை பாருங்கள்.", "Watch this before joining the association.")}
            </p>
          </div>

          {/* SIDEBAR WIDGET 3: Emergency Support Card / Contact */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h4 className="font-display font-bold text-xs text-slate-800">
              {t("அவசர உதவிக்கு தொடர்பு கொள்ளவும்", "Need Urgent Assistance?")}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-tamil">
              {t(
                "நலத்திட்டங்கள் அல்லது அவசர நிவாரணம் பற்றிய கூடுதல் சந்தேகங்களுக்கு எங்கள் மாவட்ட அலுவலகத்தை அழைக்கவும்:",
                "For further queries regarding emergency fire relief, education, or insurance claims, call our official helpline:"
              )}
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <div className="font-bold text-slate-700">044-2345-6789</div>
                <div className="text-xs text-slate-400 font-medium">Landline · Mon-Sat 10am-6pm</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
