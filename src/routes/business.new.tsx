import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Loader2, CheckCircle2, Copy, Check,
  Store, Phone, Mail, Globe, MapPin, Clock, Info, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { Section, SectionLabel } from "@/components/Section";

const API = "";

export const Route = createFileRoute("/business/new")({
  head: () => ({
    meta: [
      { title: "புதிய வணிக பதிவு — Add Business · TNVS" },
      { name: "description", content: "Register a new local business in the TNVS directory." },
    ],
  }),
  component: BusinessNewPage,
});

const TN_DISTRICTS = [
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

const SUBCATEGORY_MAPPING: Record<string, string[]> = {
  "Advertising": [
    "Branding & Marketing",
    "Digital & Display Advertising",
    "Printing & Outdoor Advertising",
    "Social Media Advertising",
    "TV & Broadcasting Media"
  ],
  "Advocate & Legal": [
    "Consumer Court Advocates",
    "Criminal Case Advocates",
    "Family Dispute Advocates",
    "High Court & District Court",
    "Notary & Documentation",
    "Property Case Advocates"
  ],
  "Agriculture": [
    "Agricultural Equipment",
    "Fertilizer Dealers",
    "Fertilizers & Organic Products",
    "Millets & Grains",
    "Nursery & Cattle",
    "Seed Suppliers",
    "Seeds & Trees"
  ],
  "Automobile": [
    "Auto Parts & Accessories",
    "Car & Bike Sales",
    "Helmet & Riding Gear",
    "Vehicle Body Building",
    "Vehicle Tyres & Batteries",
    "Wash, Polish & Detailing"
  ],
  "B2B Services": [
    "Chemicals & Industrial Supplies",
    "Electrical & Electronics Components",
    "Healthcare & Medical Supplies",
    "Packaging Machines & Products"
  ],
  "Banking & Finance": [
    "Business & Educational Loans",
    "Home Loans",
    "Personal & Car Loans",
    "Share Market & Crypto"
  ],
  "Banquets & Event Halls": [
    "AC Banquet Halls",
    "Party Halls on Rent",
    "Wedding Halls"
  ],
  "Bills & Recharge": [
    "Broadband & Cable TV",
    "DTH Recharge",
    "Electricity Bills",
    "Gas & Water Bills",
    "Mobile Prepaid & Postpaid"
  ],
  "Caterers": [
    "Multi-cuisine Caterers",
    "North Indian Caterers",
    "Party & Birthday Caterers",
    "South Indian Caterers",
    "Wedding Caterers"
  ],
  "Civil Contractors": [
    "Borewell & Drilling",
    "Building & Construction",
    "Interior & Flooring",
    "Painting & Waterproofing",
    "Plumbing & Pipeline"
  ],
  "Construction Materials": [
    "Cement, Sand & Bricks",
    "Glass & Aluminium Work",
    "Iron Rods & Steel",
    "PVC, Doors & Windows",
    "Paints & Hardware",
    "Tiles, Granite & Mosaic"
  ],
  "Courier Services": [
    "Blue Dart",
    "DTDC",
    "International Courier",
    "Local Courier",
    "Professional Couriers"
  ],
  "Daily Needs": [
    "Bakeries & Milk Shops",
    "Dry Fruits & Pooja Items",
    "Fish & Meat Shops",
    "Fruits & Vegetable Shops",
    "Grocery & Supermarkets",
    "Juice Bars & Drinking Water"
  ],
  "Demand Services": [
    "Carpenters & Masons",
    "Housekeeping Services",
    "Security Services"
  ],
  "Digital & IT Products": [
    "CCTV & Security Systems",
    "Computer Sales & Service",
    "Networking & UPS"
  ],
  "Doctors": [
    "Dentists & Dental Surgeons",
    "Dermatologists & Skin Doctors",
    "Eye Specialists & Surgeons",
    "General Physicians",
    "Gynaecologists & Obstetricians",
    "Neurologists & Psychiatrists",
    "Orthopaedic & Spine Specialists",
    "Paediatricians"
  ],
  "Education": [
    "Colleges & Universities",
    "Engineering & Medical Colleges",
    "Music, Art & Language Classes",
    "Pre-KG & Child Care",
    "Schools",
    "Study Abroad Consultants",
    "Tuition Centres",
    "Yoga Classes"
  ],
  "Electricals & Electronics": [
    "Electrical Shops",
    "Electricians",
    "Electronics Showrooms",
    "GPS Vehicle Tracking",
    "Hardware Stores",
    "Plumbing & Water Treatment",
    "Solar Power Plants"
  ],
  "Furniture": [
    "Furniture Showrooms"
  ],
  "Hardware & Tools": [
    "Tools & Fasteners"
  ],
  "Hire Services": [
    "Furniture & Appliances on Hire",
    "Vehicles on Hire (Car/Bus/Bike)"
  ],
  "Home Appliances": [
    "Cookware & Steel Items",
    "Electronics Showrooms",
    "Furniture Showrooms",
    "TV Showrooms"
  ],
  "Hospitals & Clinics": [
    "Children's Hospitals",
    "ENT Clinics",
    "Eye Hospitals",
    "Home Nursing Services",
    "Maternity Hospitals",
    "Mental Health Hospitals",
    "Multi-specialty Hospitals",
    "Nursing Homes",
    "Orthopaedic Hospitals",
    "Veterinary Hospitals"
  ],
  "Hotels & Restaurants": [
    "5-Star & 3-Star Hotels",
    "Coffee Shops & Cafes",
    "Dhaba & Tandoori",
    "Fast Food & Biryani Shops",
    "Resorts & Guest Houses",
    "Veg & Non-Veg Restaurants"
  ],
  "IT & Software": [
    "Computer Networking",
    "IT Consultants & Solutions",
    "Mobile App Developers",
    "POS & Sales Software",
    "Software Development Companies",
    "Software Training Institutes"
  ],
  "Insurance": [
    "Health Insurance",
    "Insurance Agents",
    "Life Insurance (LIC)",
    "Vehicle Insurance (Car & Bike)"
  ],
  "Jewellery": [
    "Gold & Diamond Stores",
    "Jewellery Manufacturers",
    "Jewellery Showrooms"
  ],
  "Jobs": [
    "BPO & Call Centres",
    "HR & Manpower Services",
    "Part-time & Work-from-Home"
  ],
  "Labs & Diagnostics": [
    "Blood Testing Labs",
    "Health Check-up Labs",
    "Scan Centres (MRI/X-Ray)"
  ],
  "Nursery & Plants": [
    "Plant Nursery"
  ],
  "Organic Products": [
    "Nattu Koli Pannai",
    "Organic Food & Dairy",
    "Organic Grocery Stores",
    "Organic Oils",
    "Organic Skincare"
  ],
  "Packers & Movers": [
    "Household Goods Movers",
    "Local Movers"
  ],
  "Pest Control": [
    "Cockroach Control",
    "Mosquito Control",
    "Residential & Commercial Pest Control",
    "Termite Control"
  ],
  "Photography": [
    "Studio & Event Photography"
  ],
  "Printing Services": [
    "Books & Stationery Printing",
    "Digital Printing",
    "Flex & Banner Printing",
    "Printing Press",
    "Stickers & Labels",
    "Textile Printing"
  ],
  "Real Estate": [
    "Independent Houses",
    "PG, Hostels & Rooms",
    "Plots & Lands",
    "Real Estate Agents & Builders",
    "Villas"
  ],
  "Religious": [
    "Pooja Item Shops",
    "Religious Book Dealers",
    "Religious Trusts & Organisations",
    "Temple Construction"
  ],
  "Repairs": [
    "AC & Refrigerator Repair",
    "Mobile & Laptop Repair",
    "TV & Home Theatre Repair"
  ],
  "Spa & Beauty": [
    "Beauty Parlours",
    "Bridegroom Makeup",
    "Facial Services",
    "Herbal & Wellness Products",
    "Saloons",
    "Spas (Men / Women / Unisex)"
  ],
  "Sports": [
    "Cycling",
    "Fitness Centres",
    "Sports Coaching",
    "Sports Kit Shops",
    "Swimming Clubs",
    "Trophies & Shields"
  ],
  "Textiles & Garments": [
    "Handloom & Fabrics",
    "Home Furnishing",
    "Kids Wear",
    "Ladies Wear",
    "Men's Wear",
    "Ready-made Garment Retailers"
  ],
  "Transport": [
    "Bus Tickets",
    "Cab Services",
    "Drivers on Hire",
    "Travels & Tour Operators",
    "Vehicle Transport"
  ],
  "Travel & Tourism": [
    "Tour Packages (Domestic & International)",
    "Tourist Guides",
    "Travel Agents"
  ],
  "Wedding Services": [
    "Bridal Makeup & Mehendi",
    "DJ, Sound & Music Bands",
    "Decorators & Florists",
    "Wedding Cards & Event Organisers",
    "Wedding Photographers"
  ]
};

interface BusinessForm {
  name: string;
  category: string;
  subCategory: string;
  description: string;
  phone: string;
  phone2: string;
  email: string;
  website: string;
  city: string;
  district: string;
  assembly: string;
  address: string;
  pincode: string;
  landmark: string;
  lat: string;
  lng: string;
  openDays: string;
  openTime: string;
  closeTime: string;
  coverImage: string;
}

const initialForm: BusinessForm = {
  name: "",
  category: "Hotels & Restaurants",
  subCategory: "",
  description: "",
  phone: "",
  phone2: "",
  email: "",
  website: "",
  city: "",
  district: "Chennai",
  assembly: "",
  address: "",
  pincode: "",
  landmark: "",
  lat: "",
  lng: "",
  openDays: "Monday to Saturday",
  openTime: "09:00",
  closeTime: "21:00",
  coverImage: "",
};

function BusinessNewPage() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState<BusinessForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    businessId: string;
    listingCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-populate subcategory list based on chosen category
  const subCategories = SUBCATEGORY_MAPPING[form.category] || [];

  useEffect(() => {
    // If the category changes and the current subcategory isn't valid for it, clear it
    if (!subCategories.includes(form.subCategory)) {
      setForm((prev) => ({ ...prev, subCategory: subCategories[0] || "" }));
    }
  }, [form.category, subCategories]);

  const handleChange = (
    key: keyof BusinessForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t("நகலெடுக்கப்பட்டது!", "Copied to clipboard!"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/public/business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("பதிவு செய்வதில் பிழை ஏற்பட்டது.", "Something went wrong during registration."));
      }

      setSuccessData({
        businessId: data.businessId,
        listingCode: data.listingCode,
      });
      toast.success(t("வணிகம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!", "Business registered successfully!"));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t("பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.", "Error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setSuccessData(null);
  };

  if (successData) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        {/* HEADER */}
        <section className="bg-card border-b border-border pt-28 pb-10">
          <div className="max-w-4xl mx-auto px-5 w-full text-center">
            <SectionLabel>{t("பதிவு நிறைவடைந்தது", "Registration Completed")}</SectionLabel>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-xs animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {t("வணிகம் வெற்றிகரமாக சேர்க்கப்பட்டது!", "Business Listed Successfully!")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t(
                "உங்கள் வணிக விபரங்கள் சரிபார்க்கப்பட்டு கோப்பகத்தில் சேர்க்கப்பட்டுள்ளன.",
                "Your business details have been recorded and verified. It is now searchable in our directory."
              )}
            </p>
          </div>
        </section>

        {/* TICKET CARD SUMMARY */}
        <Section className="py-12 flex justify-center">
          <div className="w-full max-w-md bg-card rounded-xl border border-border/80 shadow-lg overflow-hidden text-left relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-display">{form.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{form.category} • {form.subCategory}</p>
                </div>
                <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase font-mono border border-emerald-500/10">
                  {t("செயலில் உள்ளது", "Active")}
                </span>
              </div>

              <div className="bg-muted/40 rounded-lg p-5 border border-border/60 mb-6 flex flex-col items-center justify-center text-center relative">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono mb-2">
                  {t("வணிக குறியீடு", "Business Listing Code")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black font-mono tracking-wider text-primary select-all">
                    {successData.listingCode}
                  </span>
                  <button
                    onClick={() => handleCopy(successData.listingCode)}
                    className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border/40"
                    title={t("நகலெடு", "Copy Code")}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* DETAILS SUMMARY */}
              <div className="space-y-4 text-xs border-t border-border pt-5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">{t("கைபேசி எண்", "Phone Number")}</span>
                  <span className="text-foreground font-mono font-medium">{form.phone}</span>
                </div>
                {form.phone2 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">{t("மாற்று எண்", "Alt. Phone")}</span>
                    <span className="text-foreground font-mono font-medium">{form.phone2}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">{t("மாவட்டம்", "District")}</span>
                  <span className="text-foreground font-medium">{language === "ta" ? (TN_DISTRICTS.find(d => d.en === form.district)?.ta || form.district) : form.district}</span>
                </div>
                {form.assembly && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">{t("தொகுதி", "Assembly")}</span>
                    <span className="text-foreground font-medium">{form.assembly}</span>
                  </div>
                )}
                {form.city && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">{t("நகரம்", "City/Town")}</span>
                    <span className="text-foreground font-medium">{form.city}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
                  <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">{t("முகவரி", "Address")}</span>
                  <span className="text-foreground leading-relaxed">{form.address}</span>
                </div>
              </div>

              {/* NAVIGATION ACTIONS */}
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  to="/business/$id"
                  params={{ id: successData.businessId }}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-md text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Store className="w-4 h-4" />
                  <span>{t("வணிக பக்கத்தை பார்க்க", "View Business Profile")}</span>
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={resetForm}
                    className="bg-muted hover:bg-muted/80 text-foreground font-bold py-2.5 rounded-md text-xs transition duration-200 cursor-pointer border border-border"
                  >
                    {t("மற்றொரு வணிகம்", "Add Another")}
                  </button>
                  <Link
                    to="/businesses"
                    className="bg-card hover:bg-muted text-foreground font-bold py-2.5 rounded-md text-xs transition duration-200 flex items-center justify-center cursor-pointer border border-border"
                  >
                    {t("கோப்பகத்திற்கு திரும்ப", "Back to Directory")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* HEADER SECTION */}
      <section className="bg-card border-b border-border pt-28 pb-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 w-full text-left">
          <div className="mb-4">
            <Link
              to="/businesses"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("வணிகப் பட்டியலுக்கு திரும்பவும்", "Back to Business Directory")}</span>
            </Link>
          </div>
          <SectionLabel>{t("வணிகப் பதிவு", "Business Registration")}</SectionLabel>
          <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {t("புதிய வணிகத்தை சேர்க்கவும்", "Register a New Business")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t(
              "வணிகத்தின் அடிப்படைத் தகவல், தொடர்பு விபரங்கள் மற்றும் முகவரி போன்றவற்றை உள்ளிட்டு அதிகாரப்பூர்வ தமிழ்நாட்டு வணிகர் கோப்பகத்தில் உங்கள் வணிகத்தை இணைக்கவும்.",
              "Enter business basic information, contact details, location, and operating hours below to list your brand in the official Tamil Nadu merchants directory."
            )}
          </p>
        </div>
      </section>

      {/* FORM CONTAINER */}
      <Section className="py-12">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT 2 COLUMNS: FORM SECTIONS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION 1: BASIC INFO */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-xs relative">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                <h3 className="text-xs font-bold text-primary font-mono uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>{t("அடிப்படைத் தகவல்கள்", "Basic Information")}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("வணிகத்தின் பெயர் *", "Business Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder={t("எ.கா. முருகன் டெக்ஸ்டைல்ஸ்", "e.g. Murugan Textiles")}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("வணிகப் பிரிவு *", "Business Category *")}
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="input-base text-xs bg-card w-full cursor-pointer"
                    >
                      {Object.keys(SUBCATEGORY_MAPPING).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("துணைப் பிரிவு", "Subcategory")}
                    </label>
                    <select
                      value={form.subCategory}
                      onChange={(e) => handleChange("subCategory", e.target.value)}
                      className="input-base text-xs bg-card w-full cursor-pointer disabled:opacity-50"
                      disabled={subCategories.length === 0}
                    >
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      {subCategories.length === 0 && (
                        <option value="">{t("பிரிவைத் தேர்ந்தெடுக்கவும்", "Select Category First")}</option>
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("வணிக விளக்கம்", "Business Description")}
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={3}
                      className="input-base text-xs w-full py-2 min-h-[70px]"
                      placeholder={t("வணிகத்தின் சேவைகள், பொருட்கள் பற்றிய குறிப்பு...", "Write a brief description of services, brands, or products...")}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: LOCATION */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-xs relative">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500 rounded-l-lg" />
                <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono uppercase tracking-widest mb-5 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t("இருப்பிடம் & முகவரி", "Location & Address")}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("மாவட்டம் *", "District *")}
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                      className="input-base text-xs bg-card w-full cursor-pointer"
                    >
                      {TN_DISTRICTS.map((dist) => (
                        <option key={dist.en} value={dist.en}>
                          {language === "ta" ? dist.ta : dist.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("தொகுதி (Assembly)", "Assembly Constituency")}
                    </label>
                    <input
                      type="text"
                      value={form.assembly}
                      onChange={(e) => handleChange("assembly", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder={t("எ.கா. மயிலாப்பூர்", "e.g. Mylapore")}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("நகரம் / ஊர்", "City / Town")}
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder={t("எ.கா. சென்னை", "e.g. Chennai")}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("அஞ்சல் குறியீடு (Pincode)", "Pincode")}
                    </label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. 600004"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("அடையாளம் (Landmark)", "Landmark")}
                    </label>
                    <input
                      type="text"
                      value={form.landmark}
                      onChange={(e) => handleChange("landmark", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder={t("எ.கா. லஸ் சர்ச் அருகில்", "e.g. Near Luz Church")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                        {t("அட்சரேகை (Lat)", "Latitude")}
                      </label>
                      <input
                        type="text"
                        value={form.lat}
                        onChange={(e) => handleChange("lat", e.target.value)}
                        className="input-base text-xs w-full font-mono text-center"
                        placeholder="13.028"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                        {t("தீர்க்கரேகை (Lng)", "Longitude")}
                      </label>
                      <input
                        type="text"
                        value={form.lng}
                        onChange={(e) => handleChange("lng", e.target.value)}
                        className="input-base text-xs w-full font-mono text-center"
                        placeholder="80.259"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("முழு முகவரி *", "Full Address *")}
                    </label>
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      rows={2}
                      className="input-base text-xs w-full py-2 min-h-[50px]"
                      placeholder={t("எ.கா. 5, லஸ் சர்ச் ரோடு, மயிலாப்பூர், சென்னை", "e.g. 5, Luz Church Road, Mylapore, Chennai")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT, BUSINESS HOURS & MEDIA */}
            <div className="space-y-6">
              
              {/* SECTION 3: CONTACT INFO */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-xs relative">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{t("தொடர்பு விபரங்கள்", "Contact Details")}</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("கைபேசி எண் *", "Mobile Number *")}
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("மாற்றுத் தொலைபேசி", "Alternate Mobile")}
                    </label>
                    <input
                      type="tel"
                      value={form.phone2}
                      onChange={(e) => handleChange("phone2", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. 044-24941122"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("மின்னஞ்சல் முகவரி", "Email Address")}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. info@murugantextiles.com"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("வலைத்தளம் (Website)", "Website Link")}
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. https://www.murugantextiles.com"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: HOURS & COVER IMAGE */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-xs relative">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-teal-500 rounded-l-lg" />
                <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t("வணிக நேரம் & விவரங்கள்", "Business Hours & Cover")}</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("வேலை நாட்கள்", "Open Days")}
                    </label>
                    <input
                      type="text"
                      value={form.openDays}
                      onChange={(e) => handleChange("openDays", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. Monday to Saturday"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                        {t("திறக்கும் நேரம்", "Open Time")}
                      </label>
                      <input
                        type="time"
                        value={form.openTime}
                        onChange={(e) => handleChange("openTime", e.target.value)}
                        className="input-base text-xs w-full cursor-pointer text-center"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                        {t("மூடும் நேரம்", "Close Time")}
                      </label>
                      <input
                        type="time"
                        value={form.closeTime}
                        onChange={(e) => handleChange("closeTime", e.target.value)}
                        className="input-base text-xs w-full cursor-pointer text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                      {t("முகப்புப் படம் (URL)", "Cover Image URL")}
                    </label>
                    <input
                      type="url"
                      value={form.coverImage}
                      onChange={(e) => handleChange("coverImage", e.target.value)}
                      className="input-base text-xs w-full"
                      placeholder="e.g. https://images.unsplash.com/..."
                    />
                    <span className="text-[9px] text-muted-foreground block font-mono leading-relaxed mt-1">
                      {t(
                        "குறிப்பு: படம் தரப்படாவிடில் வகையின் அடிப்படையில் தானியங்கிப் படம் தேர்ந்தெடுக்கப்படும்.",
                        "Note: If left blank, a high-quality placeholder matching the subcategory will be auto-assigned."
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="bg-card rounded-lg border border-border p-4 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4 shrink-0 text-primary" />
              <span>{t("* குறியிடப்பட்ட அனைத்து புலங்களும் கட்டாயமானவை.", "All fields marked with * are required.")}</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/businesses"
                className="w-1/2 sm:w-auto bg-muted hover:bg-muted/80 text-foreground font-bold py-2.5 px-6 rounded-md text-xs transition duration-200 text-center border border-border cursor-pointer select-none"
              >
                {t("ரத்து செய்", "Cancel")}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 sm:w-auto bg-primary hover:bg-primary/95 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-md text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs border-none select-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("சேமிக்கப்படுகிறது...", "Saving...")}</span>
                  </>
                ) : (
                  <span>{t("பதிவு செய்", "Register Business")}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </Section>
    </div>
  );
}
