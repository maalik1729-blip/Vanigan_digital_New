import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { z } from "zod";
import {
  Search, MapPin, ChevronRight, Building2,
  Phone, Mail, Globe, Star, Filter, X,
  ArrowLeft, Loader2, AlertCircle, Store,
  Grid3x3, List, ChevronLeft, ChevronDown
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

// ─── Live API base ────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_BASE_URL ?? "https://vanigan-app-automation-5il0.onrender.com";

// ─── Route schema ─────────────────────────────────────────────────────────────
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
  "Legal Services": [
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
  "Automobiles": [
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
  "Finance & Banking": [
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

const searchSchema = z.object({
  category:    z.string().optional(),
  subCategory: z.string().optional(),
  search:      z.string().optional(),
  district:    z.string().optional(),
  page:        z.coerce.number().optional(),
});

export const Route = createFileRoute("/businesses/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "வணிகர் பட்டியல் — Business Directory · TNVS" },
      { name: "description", content: "Explore 18,000+ verified businesses across Tamil Nadu — by category, subcategory and district." },
    ],
  }),
  component: BusinessesPage,
});

// ─── Types ───────────────────────────────────────────────────────────────────
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
  email?: string;
  website?: string;
  avgRating?: number;
  reviewCount?: number;
  coverImage?: string;
  image?: string;
  img?: string;
  imageUrl?: string;
  active?: boolean;
  listingCode?: string;
}

interface BusinessResult {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
}

// ─── Category metadata ─────────────────────────────────────────────────────
const UNS = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=75&fit=crop&auto=format`;

const CATEGORY_META: Record<string, { icon: string; image: string; color: string; colorDark: string }> = {
  // ── Food & Hospitality ───────────────────────────────────────────────────────
  "Hotels & Restaurants":      { icon: "🍽️", image: UNS("1517248135467-4c7edcad34c4"), color: "from-orange-500 to-red-500",    colorDark: "bg-orange-50 border-orange-200" },
  "Caterers":                  { icon: "🥘", image: UNS("1555244162-803834f70033"), color: "from-amber-500 to-orange-500",   colorDark: "bg-amber-50 border-amber-200" },
  "Daily Needs":               { icon: "🛒", image: UNS("1542838132-92c53300491e"), color: "from-green-500 to-emerald-500",  colorDark: "bg-green-50 border-green-200" },
  "Organic Products":          { icon: "🌿", image: UNS("1490818387583-1baba5e638af"), color: "from-lime-500 to-green-500",   colorDark: "bg-lime-50 border-lime-200" },

  // ── Health & Medical ─────────────────────────────────────────────────────────
  "Doctors":                   { icon: "👨‍⚕️", image: UNS("1551601651-2a8555f1a136"), color: "from-blue-500 to-cyan-500",    colorDark: "bg-blue-50 border-blue-200" },
  "Hospitals & Clinics":       { icon: "🏥", image: UNS("1538108149393-fbbd81895907"), color: "from-sky-500 to-blue-500",    colorDark: "bg-sky-50 border-sky-200" },
  "Pharmacy":                  { icon: "💊", image: UNS("1585435557343-3b092031a831"), color: "from-teal-500 to-cyan-500",   colorDark: "bg-teal-50 border-teal-200" },
  "Labs & Diagnostics":        { icon: "🔬", image: UNS("1576086213369-97a306d36557"), color: "from-sky-600 to-blue-700",    colorDark: "bg-sky-50 border-sky-200" },

  // ── Beauty & Wellness ────────────────────────────────────────────────────────
  "Spa & Beauty":              { icon: "💅", image: UNS("1560750588-73207b1ef5b8"), color: "from-pink-500 to-rose-500",    colorDark: "bg-pink-50 border-pink-200" },

  // ── Education ────────────────────────────────────────────────────────────────
  "Education":                 { icon: "🎓", image: UNS("1503676260728-1c00da094a0b"), color: "from-violet-500 to-purple-500", colorDark: "bg-violet-50 border-violet-200" },
  "Coaching Centers":          { icon: "📚", image: UNS("1434030216411-0b793f4b4173"), color: "from-purple-500 to-indigo-500", colorDark: "bg-purple-50 border-purple-200" },

  // ── Technology ───────────────────────────────────────────────────────────────
  "IT & Software":             { icon: "💻", image: UNS("1461749280684-dccba630e2f6"), color: "from-indigo-500 to-blue-500",  colorDark: "bg-indigo-50 border-indigo-200" },
  "Digital & IT Products":     { icon: "🖥️", image: UNS("1587831990711-23ca6441447b"), color: "from-blue-500 to-indigo-500",  colorDark: "bg-blue-50 border-blue-200" },
  "Electricals & Electronics": { icon: "⚡", image: UNS("1550751827-4bd374c3f58b"), color: "from-yellow-500 to-amber-500",  colorDark: "bg-yellow-50 border-yellow-200" },

  // ── Construction & Real Estate ───────────────────────────────────────────────
  "Construction Materials":    { icon: "🧱", image: UNS("1504307651254-35680f356dfd"), color: "from-stone-500 to-slate-500",  colorDark: "bg-stone-50 border-stone-200" },
  "Civil Contractors":         { icon: "🏗️", image: UNS("1581094794329-c8112a89af12"), color: "from-slate-500 to-gray-600",   colorDark: "bg-slate-50 border-slate-200" },
  "Real Estate":               { icon: "🏠", image: UNS("1560518883-ce09059eeffa"), color: "from-emerald-500 to-teal-500",  colorDark: "bg-emerald-50 border-emerald-200" },
  "Interior Design":           { icon: "🛋️", image: UNS("1618221195710-dd6b41faaea6"), color: "from-fuchsia-500 to-pink-500", colorDark: "bg-fuchsia-50 border-fuchsia-200" },

  // ── Transport & Automotive ───────────────────────────────────────────────────
  "Transport":                 { icon: "🚛", image: UNS("1492144534655-ae79c964c9d7"), color: "from-blue-600 to-indigo-600",  colorDark: "bg-blue-50 border-blue-200" },
  "Automobiles":               { icon: "🚗", image: UNS("1503376780353-7e6692767b70"), color: "from-gray-600 to-slate-600",   colorDark: "bg-gray-50 border-gray-200" },
  "Automobile":                { icon: "🚘", image: UNS("1494976388531-d1058494cdd8"), color: "from-gray-500 to-zinc-600",    colorDark: "bg-gray-50 border-gray-200" },

  // ── Fashion & Lifestyle ──────────────────────────────────────────────────────
  "Textiles & Garments":       { icon: "👗", image: UNS("1558618666-fcd25c85cd64"), color: "from-rose-500 to-pink-500",     colorDark: "bg-rose-50 border-rose-200" },
  "Jewellery":                 { icon: "💎", image: UNS("1515562141207-7a88fb7ce338"), color: "from-yellow-400 to-amber-500", colorDark: "bg-yellow-50 border-yellow-200" },
  "Footwear":                  { icon: "👟", image: UNS("1542291026-7eec264c27ff"), color: "from-orange-400 to-amber-500",  colorDark: "bg-orange-50 border-orange-200" },

  // ── Agriculture & Nature ─────────────────────────────────────────────────────
  "Agriculture":               { icon: "🌾", image: UNS("1500937386664-56d1dfef3854"), color: "from-lime-600 to-green-600",   colorDark: "bg-lime-50 border-lime-200" },
  "Nursery & Plants":          { icon: "🌱", image: UNS("1416879595882-3373a0480b5b"), color: "from-green-400 to-lime-500",   colorDark: "bg-green-50 border-lime-200" },

  // ── Business & Finance ───────────────────────────────────────────────────────
  "B2B Services":              { icon: "🤝", image: UNS("1521791136064-7986c2920216"), color: "from-cyan-500 to-blue-500",    colorDark: "bg-cyan-50 border-cyan-200" },
  "Finance & Banking":         { icon: "🏦", image: UNS("1554224155-6726b3ff858f"), color: "from-blue-700 to-indigo-700",   colorDark: "bg-blue-50 border-blue-200" },
  "Banking & Finance":         { icon: "🏦", image: UNS("1611974789855-9c2a0a7236a3"), color: "from-blue-800 to-indigo-800",  colorDark: "bg-blue-50 border-blue-200" },
  "Insurance":                 { icon: "🛡️", image: UNS("1450101499163-c8848c66ca85"), color: "from-teal-600 to-cyan-700",   colorDark: "bg-teal-50 border-teal-200" },
  "Legal Services":            { icon: "⚖️", image: UNS("1589829545856-d10d557cf95f"), color: "from-slate-600 to-gray-700",  colorDark: "bg-slate-50 border-slate-200" },
  "Advocate & Legal":          { icon: "⚖️", image: UNS("1521791055903-6e73b4e8de57"), color: "from-slate-700 to-gray-800",  colorDark: "bg-slate-50 border-slate-200" },
  "Jobs":                      { icon: "💼", image: UNS("1507679799987-c73779587ccf"), color: "from-sky-500 to-blue-600",    colorDark: "bg-sky-50 border-sky-200" },

  // ── Marketing & Media ────────────────────────────────────────────────────────
  "Advertising":               { icon: "📢", image: UNS("1504711434969-e33886168f5c"), color: "from-red-500 to-rose-500",    colorDark: "bg-red-50 border-red-200" },
  "Printing Services":         { icon: "🖨️", image: UNS("1562776977-f5db5477e89c"), color: "from-gray-500 to-slate-500",   colorDark: "bg-gray-50 border-gray-200" },
  "Photography":               { icon: "📸", image: UNS("1471341971476-ae15ff5dd4ea"), color: "from-violet-600 to-purple-600", colorDark: "bg-violet-50 border-violet-200" },

  // ── Events & Entertainment ───────────────────────────────────────────────────
  "Wedding Services":          { icon: "💒", image: UNS("1519741497674-611481863552"), color: "from-pink-400 to-rose-400",   colorDark: "bg-pink-50 border-pink-200" },
  "Event Management":          { icon: "🎉", image: UNS("1511578314322-379afb476865"), color: "from-amber-400 to-yellow-400", colorDark: "bg-amber-50 border-amber-200" },
  "Banquets & Event Halls":    { icon: "🏛️", image: UNS("1587825140708-dfaf72ae4b04"), color: "from-amber-500 to-orange-500", colorDark: "bg-amber-50 border-amber-200" },

  // ── Home & Lifestyle ─────────────────────────────────────────────────────────
  "Home Appliances":           { icon: "🏠", image: UNS("1556909114-f6e7ad7d3136"), color: "from-teal-400 to-cyan-500",    colorDark: "bg-teal-50 border-teal-200" },
  "Furniture":                 { icon: "🪑", image: UNS("1555041469-a586c61ea9bc"), color: "from-stone-400 to-amber-500",  colorDark: "bg-stone-50 border-stone-200" },
  "Hardware & Tools":          { icon: "🔧", image: UNS("1572981779307-38b8cabb2407"), color: "from-zinc-500 to-slate-500",  colorDark: "bg-zinc-50 border-zinc-200" },

  // ── Services ─────────────────────────────────────────────────────────────────
  "Demand Services":           { icon: "🛠️", image: UNS("1581092921461-eab62e97a780"), color: "from-orange-600 to-red-600",  colorDark: "bg-orange-50 border-orange-200" },
  "Hire Services":             { icon: "🔑", image: UNS("1558618047-3c8c76ca7d13"), color: "from-teal-500 to-green-500",   colorDark: "bg-teal-50 border-teal-200" },
  "Courier Services":          { icon: "📦", image: UNS("1566576912321-d58ddd7a6097"), color: "from-orange-500 to-amber-500", colorDark: "bg-orange-50 border-orange-200" },
  "Packers & Movers":          { icon: "🚚", image: UNS("1601584428474-47a887d20b1e"), color: "from-blue-500 to-sky-500",    colorDark: "bg-blue-50 border-blue-200" },
  "Pest Control":              { icon: "🐛", image: UNS("1628177201049-f4cd92bf93a5"), color: "from-lime-700 to-green-700",  colorDark: "bg-lime-50 border-lime-200" },
  "Repairs":                   { icon: "🔩", image: UNS("1621905251189-08b45d6a269e"), color: "from-slate-500 to-gray-500",  colorDark: "bg-slate-50 border-slate-200" },

  // ── Sports, Recreation & Utility ─────────────────────────────────────────────
  "Sports":                    { icon: "⚽", image: UNS("1571019613454-1cb2f99b2d8b"), color: "from-green-600 to-emerald-600", colorDark: "bg-green-50 border-green-200" },
  "Religious":                 { icon: "🛕", image: UNS("1609710228159-0fa9bd7c0827"), color: "from-amber-600 to-yellow-600", colorDark: "bg-amber-50 border-amber-200" },
  "Bills & Recharge":          { icon: "📱", image: UNS("1556742049-0cfed4f6a45d"), color: "from-indigo-500 to-blue-600",  colorDark: "bg-indigo-50 border-indigo-200" },
  "Travel & Tourism":          { icon: "✈️", image: UNS("1488085061851-e6be41f0fe9a"), color: "from-sky-500 to-cyan-500",    colorDark: "bg-sky-50 border-sky-200" },
};

const DEFAULT_META = { icon: "🏪", image: UNS("1486406146926-c627a92ad1ab"), color: "from-primary to-blue-700", colorDark: "bg-primary/5 border-primary/20" };

function getCategoryMeta(cat: string) {
  if (CATEGORY_META[cat]) return CATEGORY_META[cat];
  const key = Object.keys(CATEGORY_META).find(
    k => k.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(k.toLowerCase())
  );
  return key ? CATEGORY_META[key] : DEFAULT_META;
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}

function getBusinessImage(b: Business): string {
  if (b.coverImage?.trim()) return b.coverImage.trim();
  if (b.image?.trim()) return b.image.trim();
  if (b.img?.trim()) return b.img.trim();
  if (b.imageUrl?.trim()) return b.imageUrl.trim();
  const meta = getCategoryMeta(b.category || "");
  return meta.image;
}

// ─── Tamil Nadu districts ─────────────────────────────────────────────────
const TN_DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Dindigul",
  "Thanjavur", "Ranipet", "Sivaganga", "Virudhunagar", "Nagapattinam",
  "Villupuram", "Kancheepuram", "Chengalpattu", "Tiruvannamalai",
  "Cuddalore", "Kallakurichi", "Ariyalur", "Perambalur", "Karur",
  "Namakkal", "The Nilgiris", "Krishnagiri", "Dharmapuri", "Tiruppur",
  "Tiruvarur", "Pudukkottai", "Ramanathapuram", "Tenkasi", "Tirupattur",
  "Mayiladuthurai", "Chengalpattu"
];

const LIMIT = 12;

// ─── API fetchers ─────────────────────────────────────────────────────────────
async function fetchCategories(): Promise<{ category: string; count: number }[]> {
  try {
    const res = await fetch(`${API}/api/categories`);
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    // Normalize: could be array of strings or array of objects
    if (Array.isArray(data)) {
      return data.map((item: any) =>
        typeof item === "string"
          ? { category: item, count: 0 }
          : { category: item.category || item.name || String(item), count: item.count || 0 }
      ).filter(d => d.category);
    }
    if (data.categories) {
      return data.categories.map((item: any) =>
        typeof item === "string"
          ? { category: item, count: 0 }
          : { category: item.category || item.name || String(item), count: item.count || 0 }
      ).filter((d: any) => d.category);
    }
    return [];
  } catch {
    // Fallback: return static category list
    return Object.keys(CATEGORY_META).map(c => ({ category: c, count: 0 }));
  }
}

async function fetchSubcategories(category: string): Promise<string[]> {
  try {
    const res = await fetch(`${API}/api/public/categories/${encodeURIComponent(category)}/subcategories`);
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) =>
        typeof item === "string" ? item : item.subCategory || item.name || String(item)
      ).filter(Boolean);
    }
    if (data.subcategories) return data.subcategories;
    return SUBCATEGORY_MAPPING[category] || [];
  } catch {
    return SUBCATEGORY_MAPPING[category] || [];
  }
}

async function fetchBusinesses(params: {
  category?: string;
  subCategory?: string;
  search?: string;
  district?: string;
  page?: number;
}): Promise<BusinessResult> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.subCategory) query.set("subCategory", params.subCategory);
  if (params.search) query.set("search", params.search);
  if (params.district) query.set("district", params.district);
  query.set("page", String(params.page || 1));
  query.set("limit", String(LIMIT));

  const res = await fetch(`${API}/api/public/businesses?${query.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Main Page Component ──────────────────────────────────────────────────────
function BusinessesPage() {
  const navigate = useNavigate({ from: "/businesses" });
  const search = Route.useSearch();
  const { language } = useLanguage();

  const selectedCategory = search.category || "";
  const selectedSubCategory = search.subCategory || "";
  const searchText = search.search || "";
  const selectedDistrict = search.district || "";
  const currentPage = search.page || 1;

  // Local state
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizError, setBizError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchText);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load categories on mount
  useEffect(() => {
    setCatLoading(true);
    fetchCategories().then(data => {
      setCategories(data);
      setCatLoading(false);
    });
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    setSubLoading(true);
    fetchSubcategories(selectedCategory).then(data => {
      setSubcategories(data);
      setSubLoading(false);
    });
  }, [selectedCategory]);

  // Load businesses when any filter changes
  useEffect(() => {
    if (!selectedCategory && !searchText) {
      setBusinesses([]);
      setTotal(0);
      return;
    }
    setBizLoading(true);
    setBizError(null);
    fetchBusinesses({
      category: selectedCategory || undefined,
      subCategory: selectedSubCategory || undefined,
      search: searchText || undefined,
      district: selectedDistrict || undefined,
      page: currentPage,
    })
      .then(data => {
        let list = data.businesses || [];
        // Perform client-side subCategory filtering since production API ignores it
        if (selectedSubCategory) {
          list = list.filter((b: Business) => b.subCategory === selectedSubCategory);
        }
        setBusinesses(list);
        setTotal(data.total || 0);
        setBizLoading(false);
      })
      .catch(err => {
        setBizError(err.message || "Failed to load businesses");
        setBizLoading(false);
      });
  }, [selectedCategory, selectedSubCategory, searchText, selectedDistrict, currentPage]);

  // Sync local search input to URL on debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (localSearch !== searchText) {
        navigate({
          search: (prev) => ({ ...prev, search: localSearch || undefined, page: 1 }),
        });
      }
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [localSearch, searchText, navigate]);

  // Keep local search input in sync when searchText changes (e.g. cleared from external components or back/forward navigation)
  useEffect(() => {
    setLocalSearch(searchText || "");
  }, [searchText]);

  const selectCategory = useCallback((cat: string) => {
    navigate({
      search: { category: cat, subCategory: undefined, page: 1, search: searchText || undefined, district: selectedDistrict || undefined },
    });
    setLocalSearch(searchText);
  }, [navigate, searchText, selectedDistrict]);

  const clearCategory = useCallback(() => {
    navigate({
      search: { category: undefined, subCategory: undefined, page: 1, search: localSearch || undefined, district: selectedDistrict || undefined },
    });
  }, [navigate, localSearch, selectedDistrict]);

  const selectSubCategory = useCallback((sub: string) => {
    navigate({
      search: (prev) => ({ ...prev, subCategory: sub === selectedSubCategory ? undefined : sub, page: 1 }),
    });
  }, [navigate, selectedSubCategory]);

  const setPage = useCallback((p: number) => {
    navigate({ search: (prev) => ({ ...prev, page: p }) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const totalPages = Math.ceil(total / LIMIT);
  const showBusiness = !!(selectedCategory || searchText);

  const t = (ta: string, en: string) => language === "ta" ? ta : en;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero / Search Header ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #0ea5e9 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-white/70 text-sm" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition">{t("முகப்பு", "Home")}</Link>
            <ChevronRight className="w-4 h-4" />
            {selectedCategory ? (
              <>
                <button onClick={clearCategory} className="hover:text-white transition">
                  {t("வணிகர் பட்டியல்", "Business Directory")}
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{selectedCategory}</span>
                {selectedSubCategory && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium">{selectedSubCategory}</span>
                  </>
                )}
              </>
            ) : (
              <span className="text-white font-medium">{t("வணிகர் பட்டியல்", "Business Directory")}</span>
            )}
          </nav>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2 leading-tight">
            {selectedCategory
              ? selectedCategory
              : t("வணிகர் பட்டியல்", "Business Directory")}
          </h1>
          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-xl font-tamil">
            {selectedSubCategory
              ? `${selectedCategory} › ${selectedSubCategory}`
              : selectedCategory
                ? t("துணைப்பிரிவுகளை தேர்வு செய்யுங்கள் அல்லது வணிகங்களை தேடுங்கள்", "Browse subcategories or search within this category")
                : t("தமிழ்நாட்டின் 18,000+ சரிபார்க்கப்பட்ட வணிகங்களை ஆராயுங்கள்", "Explore 18,000+ verified businesses across Tamil Nadu")}
          </p>

          {/* Search bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                id="business-search"
                type="search"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder={t("வணிகர் பெயர், விளக்கம், நகரம்...", "Business name, description, city...")}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              {localSearch && (
                <button
                  onClick={() => { setLocalSearch(""); navigate({ search: (p) => ({ ...p, search: undefined, page: 1 }) }); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition shadow-lg ${showFilters ? "bg-white text-primary" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              <Filter className="w-4 h-4" />
              {t("வடிகட்டு", "Filter")}
            </button>
          </div>

          {/* District Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-2xl">
              <label className="text-white text-xs font-semibold mb-2 block">
                {t("மாவட்டம் தேர்வு", "Select District")}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate({ search: (p) => ({ ...p, district: undefined, page: 1 }) })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${!selectedDistrict ? "bg-white text-primary" : "bg-white/20 text-white hover:bg-white/30"}`}
                >
                  {t("அனைத்தும்", "All Districts")}
                </button>
                {TN_DISTRICTS.map(d => (
                  <button
                    key={d}
                    onClick={() => navigate({ search: (p) => ({ ...p, district: d === selectedDistrict ? undefined : d, page: 1 }) })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedDistrict === d ? "bg-white text-primary" : "bg-white/20 text-white hover:bg-white/30"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Level 1: Category Grid (when no category selected) ────────────────── */}
      {!selectedCategory && !searchText && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-ink">
                {t("வணிகப் பிரிவுகள்", "Business Categories")}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {catLoading
                  ? t("ஏற்றுகிறது...", "Loading...")
                  : `${categories.length} ${t("பிரிவுகள்", "categories available")}`}
              </p>
            </div>
          </div>

          {catLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-36" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map(({ category, count }) => {
                const meta = getCategoryMeta(category);
                return (
                  <button
                    key={category}
                    id={`category-${category.replace(/[^a-zA-Z0-9]/g, "-")}`}
                    onClick={() => selectCategory(category)}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {/* Gradient bg */}
                    <div className={`absolute inset-0 bg-linear-to-br ${meta.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    {/* Image */}
                    <div className="relative h-24 overflow-hidden">
                      <img
                        src={meta.image}
                        alt={category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-2 left-3 text-2xl" aria-hidden="true">{meta.icon}</span>
                    </div>

                    {/* Text */}
                    <div className="p-3">
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors">
                        {category}
                      </div>
                      {count > 0 && (
                        <div className="text-[10px] text-slate-400 mt-1">{count} {t("வணிகங்கள்", "businesses")}</div>
                      )}
                    </div>

                    <ChevronRight className="absolute bottom-3 right-3 w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Level 2: Category Selected — show subcategories + businesses ──────── */}
      {selectedCategory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Back button */}
          <button
            onClick={clearCategory}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t("அனைத்து பிரிவுகளும்", "All Categories")}
          </button>

          {/* Category header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl bg-linear-to-br ${getCategoryMeta(selectedCategory).color} flex items-center justify-center text-2xl shadow-md`}
              aria-hidden="true"
            >
              {getCategoryMeta(selectedCategory).icon}
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-ink">{selectedCategory}</h2>
              <p className="text-muted-foreground text-sm">
                {bizLoading
                  ? t("ஏற்றுகிறது...", "Loading...")
                  : `${total.toLocaleString()} ${t("வணிகங்கள் கண்டுபிடிக்கப்பட்டன", "businesses found")}`}
              </p>
            </div>
          </div>

          {/* Subcategory pills */}
          {(subLoading || subcategories.length > 0) && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">
                {t("துணைப்பிரிவுகள்", "Subcategories")}
                {subLoading && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate({ search: (p) => ({ ...p, subCategory: undefined, page: 1 }) })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${!selectedSubCategory ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"}`}
                >
                  {t("அனைத்தும்", "All")}
                </button>
                {subcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => selectSubCategory(sub)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${selectedSubCategory === sub ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* View mode + count bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-muted-foreground">
              {!bizLoading && businesses.length > 0 && (
                <span>
                  {t("காட்டுகிறது", "Showing")} {((currentPage - 1) * LIMIT) + 1}–{Math.min(currentPage * LIMIT, total)} {t("இல்", "of")} {total.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-white shadow text-primary" : "text-slate-400 hover:text-slate-600"}`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition ${viewMode === "list" ? "bg-white shadow text-primary" : "text-slate-400 hover:text-slate-600"}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Business list */}
          <BusinessList
            businesses={businesses}
            loading={bizLoading}
            error={bizError}
            viewMode={viewMode}
            t={t}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPage={setPage}
              t={t}
            />
          )}
        </div>
      )}

      {/* ── Search results (no category selected but search active) ───────────── */}
      {!selectedCategory && searchText && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-ink">
                {t("தேடல் முடிவுகள்", "Search Results")}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {bizLoading
                  ? t("தேடுகிறோம்...", "Searching...")
                  : `${total.toLocaleString()} ${t("வணிகங்கள் கண்டுபிடிக்கப்பட்டன", "businesses found")} "${searchText}"`}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-white shadow text-primary" : "text-slate-400"}`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition ${viewMode === "list" ? "bg-white shadow text-primary" : "text-slate-400"}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <BusinessList
            businesses={businesses}
            loading={bizLoading}
            error={bizError}
            viewMode={viewMode}
            t={t}
          />

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPage={setPage}
              t={t}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Business List Component ──────────────────────────────────────────────────
function BusinessList({
  businesses,
  loading,
  error,
  viewMode,
  t,
}: {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  t: (ta: string, en: string) => string;
}) {
  if (loading) {
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-60" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
        <h3 className="font-semibold text-slate-700 mb-1">{t("பிழை ஏற்பட்டது", "Something went wrong")}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Store className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="font-semibold text-slate-700 mb-1">{t("வணிகங்கள் இல்லை", "No businesses found")}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("மற்றொரு பிரிவை அல்லது வேறு வார்த்தைகளை முயற்சிக்கவும்", "Try a different category or search term")}
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {businesses.map(b => (
          <BusinessListCard key={b._id} business={b} t={t} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {businesses.map(b => (
        <BusinessGridCard key={b._id} business={b} t={t} />
      ))}
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function BusinessGridCard({ business: b, t }: { business: Business; t: (ta: string, en: string) => string }) {
  const [imgError, setImgError] = useState(false);
  const img = imgError ? getCategoryMeta(b.category || "").image : getBusinessImage(b);
  const meta = getCategoryMeta(b.category || "");

  return (
    <Link
      to="/businesses/$id"
      params={{ id: b._id }}
      id={`business-card-${b._id}`}
      className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={img}
          alt={b.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        {b.category && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm">
            {b.category}
          </span>
        )}

        {/* Rating */}
        {b.avgRating && b.avgRating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
            <Star className="w-3 h-3 fill-current" />
            {b.avgRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {b.name}
        </h3>

        {b.subCategory && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-primary/70 bg-primary/8 px-2 py-0.5 rounded-full">
            {b.subCategory}
          </span>
        )}

        {b.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{b.description}</p>
        )}

        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
          {(b.district || b.city) && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{[b.city, b.district].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {b.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{b.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-primary font-semibold group-hover:underline">
            {t("மேலும் அறிக", "View Details")} →
          </span>
          {b.listingCode && (
            <span className="text-[9px] text-slate-300">{b.listingCode}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── List Card ────────────────────────────────────────────────────────────────
function BusinessListCard({ business: b, t }: { business: Business; t: (ta: string, en: string) => string }) {
  const [imgError, setImgError] = useState(false);
  const img = imgError ? getCategoryMeta(b.category || "").image : getBusinessImage(b);

  return (
    <Link
      to="/businesses/$id"
      params={{ id: b._id }}
      id={`business-list-${b._id}`}
      className="group flex gap-4 bg-white rounded-2xl border border-slate-200 p-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={img}
          alt={b.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
              {b.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {b.category && (
                <span className="text-[10px] font-semibold text-slate-400">{b.category}</span>
              )}
              {b.subCategory && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-[10px] font-semibold text-primary/70">{b.subCategory}</span>
                </>
              )}
            </div>
          </div>
          {b.avgRating && b.avgRating > 0 && (
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">{b.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {b.description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">{b.description}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-3">
          {(b.district || b.city) && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{[b.city, b.district].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {b.phone && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Phone className="w-3 h-3 shrink-0" />
              <span>{b.phone}</span>
            </div>
          )}
          {b.email && (
            <div className="sm:flex hidden items-center gap-1 text-xs text-slate-500">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[150px]">{b.email}</span>
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
    </Link>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onPage,
  t,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  t: (ta: string, en: string) => string;
}) {
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  }).filter(p => p >= 1 && p <= totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        {t("முந்தைய", "Prev")}
      </button>

      {page > 4 && totalPages > 7 && (
        <>
          <button onClick={() => onPage(1)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">1</button>
          <span className="text-slate-400 text-sm">…</span>
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${p === page ? "bg-primary text-white border-primary shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          {p}
        </button>
      ))}

      {page < totalPages - 3 && totalPages > 7 && (
        <>
          <span className="text-slate-400 text-sm">…</span>
          <button onClick={() => onPage(totalPages)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        {t("அடுத்த", "Next")}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
