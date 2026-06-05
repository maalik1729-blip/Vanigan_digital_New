import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  MapPin, Phone, Mail, Globe, Star, ArrowLeft,
  Building2, Tag, ChevronRight, Loader2, AlertCircle,
  Share2, ExternalLink, Clock, CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://vanigan-app-automation-5il0.onrender.com";

export const Route = createFileRoute("/businesses/$id")({
  head: () => ({
    meta: [
      { title: "Business Details · TNVS Directory" },
    ],
  }),
  component: BusinessDetailPage,
});

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
  phone2?: string;
  email?: string;
  website?: string;
  avgRating?: number;
  reviewCount?: number;
  coverImage?: string;
  image?: string;
  img?: string;
  imageUrl?: string;
  galleryImages?: { url: string }[];
  active?: boolean;
  listingCode?: string;
  createdAt?: string;
  assembly?: string;
}

const UNS = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&fit=crop&auto=format`;

const CATEGORY_META: Record<string, { icon: string; image: string; color: string }> = {
  "Hotels & Restaurants":       { icon: "🍽️", image: UNS("1517248135467-4c7edcad34c4"), color: "from-orange-500 to-red-500" },
  "Caterers":                   { icon: "🥘", image: UNS("1555244162-803834f70033"), color: "from-amber-500 to-orange-500" },
  "Daily Needs":                { icon: "🛒", image: UNS("1542838132-92c53300491e"), color: "from-green-500 to-emerald-500" },
  "Organic Products":           { icon: "🌿", image: UNS("1490818387583-1baba5e638af"), color: "from-lime-500 to-green-500" },
  "Doctors":                    { icon: "👨‍⚕️", image: UNS("1551601651-2a8555f1a136"), color: "from-blue-500 to-cyan-500" },
  "Hospitals & Clinics":        { icon: "🏥", image: UNS("1538108149393-fbbd81895907"), color: "from-sky-500 to-blue-500" },
  "Pharmacy":                   { icon: "💊", image: UNS("1585435557343-3b092031a831"), color: "from-teal-500 to-cyan-500" },
  "Spa & Beauty":               { icon: "💅", image: UNS("1560750588-73207b1ef5b8"), color: "from-pink-500 to-rose-500" },
  "Education":                  { icon: "🎓", image: UNS("1503676260728-1c00da094a0b"), color: "from-violet-500 to-purple-500" },
  "Coaching Centers":           { icon: "📚", image: UNS("1434030216411-0b793f4b4173"), color: "from-purple-500 to-indigo-500" },
  "IT & Software":              { icon: "💻", image: UNS("1461749280684-dccba630e2f6"), color: "from-indigo-500 to-blue-500" },
  "Electricals & Electronics":  { icon: "⚡", image: UNS("1518770660439-4636190af475"), color: "from-yellow-500 to-amber-500" },
  "Construction Materials":     { icon: "🧱", image: UNS("1504307651254-35680f356dfd"), color: "from-stone-500 to-slate-500" },
  "Civil Contractors":          { icon: "🏗️", image: UNS("1581094794329-c8112a89af12"), color: "from-slate-500 to-gray-600" },
  "Real Estate":                { icon: "🏠", image: UNS("1560518883-ce09059eeffa"), color: "from-emerald-500 to-teal-500" },
  "Interior Design":            { icon: "🛋️", image: UNS("1555041469-a586c61ea9bc"), color: "from-fuchsia-500 to-pink-500" },
  "Transport":                  { icon: "🚛", image: UNS("1492144534655-ae79c964c9d7"), color: "from-blue-600 to-indigo-600" },
  "Automobiles":                { icon: "🚗", image: UNS("1503376780353-7e6692767b70"), color: "from-gray-600 to-slate-600" },
  "Textiles & Garments":        { icon: "👗", image: UNS("1558618666-fcd25c85cd64"), color: "from-rose-500 to-pink-500" },
  "Jewellery":                  { icon: "💎", image: UNS("1515562141207-7a88fb7ce338"), color: "from-yellow-400 to-amber-500" },
  "Footwear":                   { icon: "👟", image: UNS("1542291026-7eec264c27ff"), color: "from-orange-400 to-amber-500" },
  "Agriculture":                { icon: "🌾", image: UNS("1500937386664-56d1dfef3854"), color: "from-lime-600 to-green-600" },
  "Nursery & Plants":           { icon: "🌱", image: UNS("1416879595882-3373a0480b5b"), color: "from-green-400 to-lime-500" },
  "B2B Services":               { icon: "🤝", image: UNS("1486406146926-c627a92ad1ab"), color: "from-cyan-500 to-blue-500" },
  "Finance & Banking":          { icon: "🏦", image: UNS("1554224155-6726b3ff858f"), color: "from-blue-700 to-indigo-700" },
  "Legal Services":             { icon: "⚖️", image: UNS("1589829545856-d10d557cf95f"), color: "from-slate-600 to-gray-700" },
  "Advertising":                { icon: "📢", image: UNS("1504711434969-e33886168f5c"), color: "from-red-500 to-rose-500" },
  "Printing Services":          { icon: "🖨️", image: UNS("1562776977-f5db5477e89c"), color: "from-gray-500 to-slate-500" },
  "Photography":                { icon: "📸", image: UNS("1471341971476-ae15ff5dd4ea"), color: "from-violet-600 to-purple-600" },
  "Wedding Services":           { icon: "💒", image: UNS("1519741497674-611481863552"), color: "from-pink-400 to-rose-400" },
  "Event Management":           { icon: "🎉", image: UNS("1511578314322-379afb476865"), color: "from-amber-400 to-yellow-400" },
  "Home Appliances":            { icon: "🏠", image: UNS("1556909114-f6e7ad7d3136"), color: "from-teal-400 to-cyan-500" },
  "Furniture":                  { icon: "🪑", image: UNS("1555041469-a586c61ea9bc"), color: "from-stone-400 to-amber-500" },
  "Hardware & Tools":           { icon: "🔧", image: UNS("1572981779307-38b8cabb2407"), color: "from-zinc-500 to-slate-500" },
};

const DEFAULT_META = {
  icon: "🏪",
  image: UNS("1486406146926-c627a92ad1ab"),
  color: "from-primary to-blue-700",
};

function getCategoryMeta(cat: string) {
  if (CATEGORY_META[cat]) return CATEGORY_META[cat];
  const key = Object.keys(CATEGORY_META).find(
    k => k.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(k.toLowerCase())
  );
  return key ? CATEGORY_META[key] : DEFAULT_META;
}

function getBusinessImage(b: Business): string {
  if (b.coverImage?.trim()) return b.coverImage.trim();
  if (b.image?.trim()) return b.image.trim();
  if (b.img?.trim()) return b.img.trim();
  if (b.imageUrl?.trim()) return b.imageUrl.trim();
  return getCategoryMeta(b.category || "").image;
}

function BusinessDetailPage() {
  const { id } = Route.useParams();
  const { language } = useLanguage();
  const t = (ta: string, en: string) => language === "ta" ? ta : en;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setImgError(false);

    // Try the direct ID route first
    fetch(`${API}/api/public/businesses/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          // If direct route fails, try query parameter search fallback
          const fallbackRes = await fetch(`${API}/api/public/businesses?id=${id}`);
          if (!fallbackRes.ok) {
            throw new Error(`Business not found (${res.status})`);
          }
          const fallbackData = await fallbackRes.json();
          if (fallbackData.businesses && fallbackData.businesses.length > 0) {
            return fallbackData.businesses[0];
          }
          throw new Error("Business not found");
        }
        const data = await res.json();
        return data.business || data;
      })
      .then(biz => {
        setBusiness(biz);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load business");
        setLoading(false);
      });
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">{t("ஏற்றுகிறது...", "Loading business...")}</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-slate-800 mb-2">
            {t("வணிகம் கண்டுபிடிக்கப்படவில்லை", "Business Not Found")}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">{error || "The business you're looking for doesn't exist."}</p>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("பட்டியலுக்கு திரும்பு", "Back to Directory")}
          </Link>
        </div>
      </div>
    );
  }

  const meta = getCategoryMeta(business.category || "");
  const heroImg = imgError ? meta.image : getBusinessImage(business);
  const gallery = business.galleryImages?.filter(g => g.url) || [];
  const fullAddress = [business.address, business.city, business.assembly, business.district]
    .filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-slate-900">
        <img
          src={heroImg}
          alt={business.name}
          className="w-full h-full object-cover opacity-70"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button on hero */}
        <div className="absolute top-4 left-4">
          <Link
            to="/businesses"
            search={{ category: business.category }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white text-sm font-semibold hover:bg-black/60 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("திரும்பு", "Back")}
          </Link>
        </div>

        {/* Share button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white text-sm font-semibold hover:bg-black/60 transition"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copied ? t("நகலெடுக்கப்பட்டது!", "Copied!") : t("பகிர்", "Share")}
          </button>
        </div>

        {/* Business name on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          {/* Category badge */}
          {business.category && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-linear-to-r ${meta.color} mb-3 shadow`}>
              <span>{meta.icon}</span>
              {business.category}
              {business.subCategory && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-70" />
                  {business.subCategory}
                </>
              )}
            </span>
          )}
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white leading-tight drop-shadow-lg">
            {business.name}
          </h1>
          {(business.city || business.district) && (
            <div className="flex items-center gap-1.5 mt-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{[business.city, business.district].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content Area ─────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition">{t("முகப்பு", "Home")}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/businesses" className="hover:text-primary transition">{t("வணிகர் பட்டியல்", "Business Directory")}</Link>
          {business.category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link to="/businesses" search={{ category: business.category }} className="hover:text-primary transition">
                {business.category}
              </Link>
            </>
          )}
          {business.subCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link to="/businesses" search={{ category: business.category, subCategory: business.subCategory }} className="hover:text-primary transition">
                {business.subCategory}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 font-medium truncate max-w-[180px]">{business.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left: Main Info */}
          <div className="md:col-span-2 space-y-6">

            {/* Rating */}
            {business.avgRating && business.avgRating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(business.avgRating!) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                    />
                  ))}
                  <span className="font-bold text-amber-700 text-sm ml-1">{business.avgRating.toFixed(1)}</span>
                </div>
                {business.reviewCount && business.reviewCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {business.reviewCount} {t("மதிப்புரைகள்", "reviews")}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {business.description && (
              <div>
                <h2 className="font-display font-semibold text-lg text-ink mb-2">
                  {t("பற்றி", "About")}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {business.description}
                </p>
              </div>
            )}

            {/* Category tags */}
            <div className="flex flex-wrap gap-2">
              {business.category && (
                <Link
                  to="/businesses"
                  search={{ category: business.category }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-linear-to-r ${meta.color} hover:opacity-90 transition`}
                >
                  <Tag className="w-3 h-3" />
                  {business.category}
                </Link>
              )}
              {business.subCategory && (
                <Link
                  to="/businesses"
                  search={{ category: business.category, subCategory: business.subCategory }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition"
                >
                  <Tag className="w-3 h-3" />
                  {business.subCategory}
                </Link>
              )}
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-lg text-ink mb-3">
                  {t("படங்கள்", "Gallery")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.slice(0, 6).map((g, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={g.url}
                        alt={`${business.name} ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map placeholder */}
            {fullAddress && (
              <div>
                <h2 className="font-display font-semibold text-lg text-ink mb-3">
                  {t("இடம்", "Location")}
                </h2>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  {/* Google Maps direction link */}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-700 truncate">{fullAddress}</div>
                      <div className="text-xs text-primary mt-0.5 flex items-center gap-1">
                        {t("Google Maps-ல் திற", "Open in Google Maps")}
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Card ─────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Contact Card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className={`px-5 py-4 bg-linear-to-r ${meta.color} text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{meta.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{t("தொடர்பு கொள்ளவும்", "Contact Business")}</div>
                    <div className="text-white/70 text-xs">{t("நேரடியாக தொடர்பு கொள்ளுங்கள்", "Get in touch directly")}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Phone */}
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition group"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
                        {t("தொலைபேசி", "Phone")}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">{business.phone}</div>
                    </div>
                  </a>
                )}

                {/* Phone 2 */}
                {business.phone2 && (
                  <a
                    href={`tel:${business.phone2}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                        {t("மாற்று தொலைபேசி", "Alt. Phone")}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">{business.phone2}</div>
                    </div>
                  </a>
                )}

                {/* Email */}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">
                        {t("மின்னஞ்சல்", "Email")}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 truncate">{business.email}</div>
                    </div>
                  </a>
                )}

                {/* Website */}
                {business.website && (
                  <a
                    href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-purple-600 font-semibold uppercase tracking-wide flex items-center gap-1">
                        {t("இணையதளம்", "Website")}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                      <div className="text-sm font-semibold text-slate-800 truncate">{business.website}</div>
                    </div>
                  </a>
                )}

                {!business.phone && !business.email && !business.website && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    {t("தொடர்பு விவரங்கள் இல்லை", "No contact details available")}
                  </p>
                )}
              </div>
            </div>

            {/* Business Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm text-ink">
                {t("வணிக தகவல்", "Business Info")}
              </h3>

              {business.listingCode && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("பட்டியல் குறியீடு", "Listing Code")}</span>
                  <span className="font-semibold text-slate-700 font-mono">{business.listingCode}</span>
                </div>
              )}

              {business.district && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("மாவட்டம்", "District")}</span>
                  <span className="font-semibold text-slate-700">{business.district}</span>
                </div>
              )}

              {business.assembly && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("சட்டமன்றம்", "Assembly")}</span>
                  <span className="font-semibold text-slate-700">{business.assembly}</span>
                </div>
              )}

              {business.createdAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t("பதிவு தேதி", "Registered")}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {new Date(business.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
                  </span>
                </div>
              )}

              {business.active !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("நிலை", "Status")}</span>
                  <span className={`font-semibold flex items-center gap-1 ${business.active ? "text-emerald-600" : "text-slate-400"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${business.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                    {business.active ? t("செயலில்", "Active") : t("செயலற்றது", "Inactive")}
                  </span>
                </div>
              )}
            </div>

            {/* Browse more CTA */}
            {business.category && (
              <Link
                to="/businesses"
                search={{ category: business.category }}
                className="flex items-center justify-between w-full p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-primary">
                    {t("மேலும் காண்க", "Browse More")}
                  </div>
                  <div className="text-sm font-bold text-slate-700 mt-0.5">
                    {business.category}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
