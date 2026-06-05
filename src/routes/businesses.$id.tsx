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

// Unique Unsplash images per sub-category
const SUBCATEGORY_META: Record<string, string> = {
  // Advertising
  "Branding & Marketing":             UNS("1557804506-669a67965ba0"),
  "Digital & Display Advertising":    UNS("1504711434969-e33886168f5c"),
  "Printing & Outdoor Advertising":   UNS("1562776977-f5db5477e89c"),
  "Social Media Advertising":         UNS("1611162617474-5b21e879e113"),
  "TV & Broadcasting Media":          UNS("1478720568477-152d9b92543f"),
  // Advocate & Legal / Legal Services
  "Consumer Court Advocates":         UNS("1589829545856-d10d557cf95f"),
  "Criminal Case Advocates":          UNS("1521791055903-6e73b4e8de57"),
  "Family Dispute Advocates":         UNS("1576091160399-112ba8d25d1d"),
  "High Court & District Court":      UNS("1568254183919-78a4f43a2877"),
  "Notary & Documentation":           UNS("1450101499163-c8848c66ca85"),
  "Property Case Advocates":          UNS("1560518883-ce09059eeffa"),
  // Agriculture
  "Agricultural Equipment":           UNS("1560493676-2532658-af12"),
  "Fertilizer Dealers":               UNS("1416879595882-3373a0480b5b"),
  "Fertilizers & Organic Products":   UNS("1500937386664-56d1dfef3854"),
  "Millets & Grains":                 UNS("1574323347407-f859a1f1682f"),
  "Seed Suppliers":                   UNS("1464226184884-fa280b87b29f"),
  "Seeds & Trees":                    UNS("1506792006437-256b665c2a0a"),
  // Automobile
  "Auto Parts & Accessories":         UNS("1486262715619-67b85e0b08d3"),
  "Car & Bike Sales":                 UNS("1503376780353-7e6692767b70"),
  "Helmet & Riding Gear":             UNS("1558618047-3c8c76ca7d13"),
  "Vehicle Body Building":            UNS("1581092921461-eab62e97a780"),
  "Vehicle Tyres & Batteries":        UNS("1558618666-fcd25c85cd64"),
  "Wash, Polish & Detailing":         UNS("1520340232587-129a01bde7af"),
  // B2B Services
  "Chemicals & Industrial Supplies":  UNS("1530811761207-8d9d22f0a9bd"),
  "Electrical & Electronics Components": UNS("1518770660439-4636190af475"),
  "Healthcare & Medical Supplies":    UNS("1576086213369-97a306d36557"),
  "Packaging Machines & Products":    UNS("1566576912321-d58ddd7a6097"),
  // Banking & Finance
  "Business & Educational Loans":     UNS("1454165804606-c3d57bc86b40"),
  "Home Loans":                       UNS("1560518883-ce09059eeffa"),
  "Personal & Car Loans":             UNS("1544377193-33dcf4d68fb5"),
  "Share Market & Crypto":            UNS("1611974789855-9c2a0a7236a3"),
  // Banquets & Event Halls
  "AC Banquet Halls":                 UNS("1587825140708-dfaf72ae4b04"),
  "Party Halls on Rent":              UNS("1527529482837-4698179dc6ce"),
  "Wedding Halls":                    UNS("1519741497674-611481863552"),
  // Bills & Recharge
  "Broadband & Cable TV":             UNS("1518770660439-4636190af475"),
  "DTH Recharge":                     UNS("1478720568477-152d9b92543f"),
  "Electricity Bills":                UNS("1550751827-4bd374c3f58b"),
  "Gas & Water Bills":                UNS("1558618047-3c8c76ca7d13"),
  "Mobile Prepaid & Postpaid":        UNS("1556742049-0cfed4f6a45d"),
  // Caterers
  "Multi-cuisine Caterers":           UNS("1555244162-803834f70033"),
  "North Indian Caterers":            UNS("1546833999-2fcf4e1e04fa"),
  "Party & Birthday Caterers":        UNS("1527529482837-4698179dc6ce"),
  "South Indian Caterers":            UNS("1512621776951-a57141f6454e"),
  "Wedding Caterers":                 UNS("1464306208223-3b8dfe55a3d2"),
  // Civil Contractors
  "Borewell & Drilling":              UNS("1504307651254-35680f356dfd"),
  "Building & Construction":          UNS("1581094794329-c8112a89af12"),
  "Interior & Flooring":              UNS("1618221195710-dd6b41faaea6"),
  "Painting & Waterproofing":         UNS("1562259949-e8e7689d7828"),
  "Plumbing & Pipeline":              UNS("1504890536015-c5d7a3e52db4"),
  // Construction Materials
  "Cement, Sand & Bricks":            UNS("1504307651254-35680f356dfd"),
  "Glass & Aluminium Work":           UNS("1518005068-a2fce8a4d5eb"),
  "Iron Rods & Steel":                UNS("1530811761207-8d9d22f0a9bd"),
  "PVC, Doors & Windows":             UNS("1558618047-3c8c76ca7d13"),
  "Paints & Hardware":                UNS("1562259949-e8e7689d7828"),
  "Tiles, Granite & Mosaic":          UNS("1615876234886-fd9a39fda97f"),
  // Courier Services
  "Blue Dart":                        UNS("1566576912321-d58ddd7a6097"),
  "DTDC":                             UNS("1601584428474-47a887d20b1e"),
  "International Courier":            UNS("1488085061851-e6be41f0fe9a"),
  "Local Courier":                    UNS("1519003722824-194d4455a60c"),
  "Professional Couriers":            UNS("1566576912321-d58ddd7a6097"),
  // Daily Needs
  "Bakeries & Milk Shops":            UNS("1509440159596-0249088772ff"),
  "Fish & Meat Shops":                UNS("1518492950406-7f8cedb2f56c"),
  "Fruits & Vegetable Shops":         UNS("1488459716781-31db52582fe9"),
  "Grocery & Supermarkets":           UNS("1542838132-92c53300491e"),
  "Juice Bars & Drinking Water":      UNS("1490474504789-a48440b0bb19"),
  // Demand Services
  "Carpenters & Masons":              UNS("1572981779307-38b8cabb2407"),
  "Housekeeping Services":            UNS("1581578731548-c64695cc6952"),
  "Security Services":                UNS("1558618047-3c8c76ca7d13"),
  // Digital & IT Products
  "CCTV & Security Systems":          UNS("1558002038-bb4237b50b33"),
  "Computer Sales & Service":         UNS("1587831990711-23ca6441447b"),
  "Networking & UPS":                 UNS("1558618047-3c8c76ca7d13"),
  // Doctors
  "Dentists & Dental Surgeons":       UNS("1606811971618-4486d14f3f99"),
  "Dermatologists & Skin Doctors":    UNS("1576091160550-2173dba999ef"),
  "Eye Specialists & Surgeons":       UNS("1559757148-47f8b7c6ab26"),
  "General Physicians":               UNS("1551601651-2a8555f1a136"),
  "Gynaecologists & Obstetricians":   UNS("1559757174-ef3f89845eba"),
  "Neurologists & Psychiatrists":     UNS("1559757148-47f8b7c6ab26"),
  "Orthopaedic & Spine Specialists":  UNS("1576091160399-112ba8d25d1d"),
  "Paediatricians":                   UNS("1518152006-d239e5bcf0c5"),
  // Education
  "Colleges & Universities":          UNS("1523050854058-8df90110c9f1"),
  "Engineering & Medical Colleges":   UNS("1576091160399-112ba8d25d1d"),
  "Music, Art & Language Classes":    UNS("1511379938547-c1f69419868d"),
  "Pre-KG & Child Care":              UNS("1503454537195-1dcabb73ffb9"),
  "Schools":                          UNS("1580582932707-520aed937b7b"),
  "Study Abroad Consultants":         UNS("1488085061851-e6be41f0fe9a"),
  "Tuition Centres":                  UNS("1434030216411-0b793f4b4173"),
  // Electricals & Electronics
  "Electrical Shops":                 UNS("1518770660439-4636190af475"),
  "Electricians":                     UNS("1558618047-3c8c76ca7d13"),
  "Electronics Showrooms":            UNS("1550751827-4bd374c3f58b"),
  "GPS Vehicle Tracking":             UNS("1519003722824-194d4455a60c"),
  "Hardware Stores":                  UNS("1572981779307-38b8cabb2407"),
  "Plumbing & Water Treatment":       UNS("1504890536015-c5d7a3e52db4"),
  "Solar Power Plants":               UNS("1509391366636-d1ed4fc0d49c"),
  // Furniture & Home
  "Furniture Showrooms":              UNS("1555041469-a586c61ea9bc"),
  "Tools & Fasteners":                UNS("1572981779307-38b8cabb2407"),
  "Furniture & Appliances on Hire":   UNS("1556909114-f6e7ad7d3136"),
  "Vehicles on Hire (Car/Bus/Bike)":  UNS("1492144534655-ae79c964c9d7"),
  "Cookware & Steel Items":           UNS("1556909114-f6e7ad7d3136"),
  "TV Showrooms":                     UNS("1478720568477-152d9b92543f"),
  // Hospitals & Clinics
  "Children's Hospitals":             UNS("1518152006-d239e5bcf0c5"),
  "ENT Clinics":                      UNS("1551601651-2a8555f1a136"),
  "Eye Hospitals":                    UNS("1559757148-47f8b7c6ab26"),
  "Home Nursing Services":            UNS("1576086213369-97a306d36557"),
  "Maternity Hospitals":              UNS("1559757174-ef3f89845eba"),
  "Mental Health Hospitals":          UNS("1576091160550-2173dba999ef"),
  "Multi-specialty Hospitals":        UNS("1538108149393-fbbd81895907"),
  "Nursing Homes":                    UNS("1551601651-2a8555f1a136"),
  "Orthopaedic Hospitals":            UNS("1576091160399-112ba8d25d1d"),
  "Veterinary Hospitals":             UNS("1587300003388-59429a54ce4b"),
  // Hotels & Restaurants
  "5-Star & 3-Star Hotels":           UNS("1564501049412-61d2ad2d6e79"),
  "Coffee Shops & Cafes":             UNS("1509042239860-f550ce710b93"),
  "Dhaba & Tandoori":                 UNS("1546833999-2fcf4e1e04fa"),
  "Fast Food & Biryani Shops":        UNS("1512621776951-a57141f6454e"),
  "Resorts & Guest Houses":           UNS("1551882547-ab3a2f1baa2c"),
  "Veg & Non-Veg Restaurants":        UNS("1517248135467-4c7edcad34c4"),
  // IT & Software
  "Computer Networking":              UNS("1558618047-3c8c76ca7d13"),
  "IT Consultants & Solutions":       UNS("1461749280684-dccba630e2f6"),
  "Mobile App Developers":            UNS("1512941937669-90a1b58e7e9c"),
  "POS & Sales Software":             UNS("1556742049-0cfed4f6a45d"),
  "Software Development Companies":   UNS("1504384308090-c5bc1d1c4e19"),
  "Software Training Institutes":     UNS("1581092335397-9fa73b8d7875"),
  // Insurance
  "Health Insurance":                 UNS("1576086213369-97a306d36557"),
  "Insurance Agents":                 UNS("1450101499163-c8848c66ca85"),
  "Life Insurance (LIC)":             UNS("1454165804606-c3d57bc86b40"),
  "Vehicle Insurance (Car & Bike)":   UNS("1503376780353-7e6692767b70"),
  // Jewellery
  "Gold & Diamond Stores":            UNS("1515562141207-7a88fb7ce338"),
  "Jewellery Manufacturers":          UNS("1602173574-c5f2c18e09c3"),
  "Jewellery Showrooms":              UNS("1515562141207-7a88fb7ce338"),
  // Jobs
  "BPO & Call Centres":               UNS("1521791136064-7986c2920216"),
  "HR & Manpower Services":           UNS("1507679799987-c73779587ccf"),
  "Part-time & Work-from-Home":       UNS("1486312338219-ce68d2c6f44d"),
  // Labs & Diagnostics
  "Blood Testing Labs":               UNS("1576086213369-97a306d36557"),
  "Health Check-up Labs":             UNS("1551601651-2a8555f1a136"),
  "Scan Centres (MRI/X-Ray)":         UNS("1559757148-47f8b7c6ab26"),
  // Organic Products
  "Nattu Koli Pannai":                UNS("1518492950406-7f8cedb2f56c"),
  "Organic Food & Dairy":             UNS("1490818387583-1baba5e638af"),
  "Organic Grocery Stores":           UNS("1542838132-92c53300491e"),
  "Organic Oils":                     UNS("1474979266404-7eaacbf3e695"),
  "Organic Skincare":                 UNS("1596755389378-c31d21fd1273"),
  // Packers & Movers
  "Household Goods Movers":           UNS("1601584428474-47a887d20b1e"),
  "Local Movers":                     UNS("1519003722824-194d4455a60c"),
  // Pest Control
  "Cockroach Control":                UNS("1628177201049-f4cd92bf93a5"),
  "Mosquito Control":                 UNS("1628177201049-f4cd92bf93a5"),
  "Residential & Commercial Pest Control": UNS("1628177201049-f4cd92bf93a5"),
  "Termite Control":                  UNS("1628177201049-f4cd92bf93a5"),
  // Photography
  "Studio & Event Photography":       UNS("1471341971476-ae15ff5dd4ea"),
  // Printing Services
  "Books & Stationery Printing":      UNS("1481627834876-b7833e8f3d41"),
  "Digital Printing":                 UNS("1562776977-f5db5477e89c"),
  "Flex & Banner Printing":           UNS("1504711434969-e33886168f5c"),
  "Printing Press":                   UNS("1562776977-f5db5477e89c"),
  "Stickers & Labels":                UNS("1527576397016-ea514802a6c1"),
  "Textile Printing":                 UNS("1558618666-fcd25c85cd64"),
  // Real Estate
  "Independent Houses":               UNS("1480074568708-e8b0145a4f94"),
  "Plots & Lands":                    UNS("1500382017468-9049fed747ef"),
  "Real Estate Agents & Builders":    UNS("1560518883-ce09059eeffa"),
  "Villas":                           UNS("1512917774080-9991f1c4c750"),
  // Religious
  "Pooja Item Shops":                 UNS("1609710228159-0fa9bd7c0827"),
  "Religious Book Dealers":           UNS("1481627834876-b7833e8f3d41"),
  "Religious Trusts & Organisations": UNS("1609710228159-0fa9bd7c0827"),
  "Temple Construction":              UNS("1609710228159-0fa9bd7c0827"),
  // Repairs
  "AC & Refrigerator Repair":         UNS("1621905251189-08b45d6a269e"),
  "Mobile & Laptop Repair":           UNS("1556742049-0cfed4f6a45d"),
  "TV & Home Theatre Repair":         UNS("1478720568477-152d9b92543f"),
  // Spa & Beauty
  "Beauty Parlours":                  UNS("1560750588-73207b1ef5b8"),
  "Bridegroom Makeup":                UNS("1519741497674-611481863552"),
  "Facial Services":                  UNS("1596755389378-c31d21fd1273"),
  "Herbal & Wellness Products":       UNS("1474979266404-7eaacbf3e695"),
  "Saloons":                          UNS("1503951914875-452162b0f3f1"),
  "Spas (Men / Women / Unisex)":      UNS("1544161515-4be31d3e2900"),
  // Sports
  "Fitness Centres":                  UNS("1571019613454-1cb2f99b2d8b"),
  "Sports Coaching":                  UNS("1576153192396-180ecef2a715"),
  "Sports Kit Shops":                 UNS("1535131323232-d9409b4a1d3a"),
  "Trophies & Shields":               UNS("1558618047-3c8c76ca7d13"),
  // Textiles & Garments
  "Handloom & Fabrics":               UNS("1558618666-fcd25c85cd64"),
  "Home Furnishing":                  UNS("1556909114-f6e7ad7d3136"),
  "Kids Wear":                        UNS("1503454537195-1dcabb73ffb9"),
  "Ladies Wear":                      UNS("1515886657613-9f3515b0c78f"),
  "Men's Wear":                       UNS("1617137984306-d8bace30b7ef"),
  "Ready-made Garment Retailers":     UNS("1558618666-fcd25c85cd64"),
  // Transport
  "Bus Tickets":                      UNS("1492144534655-ae79c964c9d7"),
  "Cab Services":                     UNS("1504632083-7e12ccb0a4ee"),
  "Drivers on Hire":                  UNS("1494976388531-d1058494cdd8"),
  "Travels & Tour Operators":         UNS("1488085061851-e6be41f0fe9a"),
  "Vehicle Transport":                UNS("1492144534655-ae79c964c9d7"),
  // Travel & Tourism
  "Tour Packages (Domestic & International)": UNS("1488085061851-e6be41f0fe9a"),
  "Tourist Guides":                   UNS("1526772662-44fd4b4f56cc"),
  "Travel Agents":                    UNS("1488085061851-e6be41f0fe9a"),
  // Wedding Services
  "Bridal Makeup & Mehendi":          UNS("1519741497674-611481863552"),
  "DJ, Sound & Music Bands":          UNS("1511379938547-c1f69419868d"),
  "Decorators & Florists":            UNS("1487530811176-3780de880c2d"),
  "Wedding Cards & Event Organisers": UNS("1511795409834-ef04bbd61622"),
  "Wedding Photographers":            UNS("1519741497674-611481863552"),
};

function getSubcategoryImage(subCategory: string): string | null {
  if (!subCategory) return null;
  if (SUBCATEGORY_META[subCategory]) return SUBCATEGORY_META[subCategory];
  const key = Object.keys(SUBCATEGORY_META).find(
    k => k.toLowerCase().includes(subCategory.toLowerCase()) || subCategory.toLowerCase().includes(k.toLowerCase())
  );
  return key ? SUBCATEGORY_META[key] : null;
}

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

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}

// ─── Per-category image pools (unique photos per business via _id hash) ────────
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  "Caterers": [
    UNS("1555244162-803834f70033"), UNS("1464306208223-3b8dfe55a3d2"), UNS("1546833999-2fcf4e1e04fa"),
    UNS("1555939594-58329b277545"), UNS("1414235077428-338989a2e8c0"), UNS("1504674900247-0877df9cc836"),
    UNS("1567620905732-2d1ec7ab7445"), UNS("1565299624946-b28f40a0ae38"), UNS("1512621776951-a57141f6454e"),
    UNS("1482049016688-2d3e1685571f"), UNS("1540189549336-e7612f237521"), UNS("1490645935967-10de6ba17061"),
  ],
  "Hotels & Restaurants": [
    UNS("1517248135467-4c7edcad34c4"), UNS("1551632436-814a3e53e267"), UNS("1559339352-11d035aa65de"),
    UNS("1544025162-052a24a0a674"), UNS("1590846406792-314f9a01bc7b"), UNS("1555396273-b5a5e083ef65"),
    UNS("1567521464027-f127ff144326"), UNS("1574071318508-1cdbab80d002"), UNS("1466978913421-dad2ebd01d17"),
    UNS("1484723091739-30a097e8f929"), UNS("1563245372-f21724e3856d"), UNS("1504754955-d0d3d2d04f9d"),
  ],
  "Doctors": [
    UNS("1551601651-2a8555f1a136"), UNS("1559757174-ef3f89845eba"), UNS("1576091160399-112ba8d25d1d"),
    UNS("1576086213369-97a306d36557"), UNS("1559757148-47f8b7c6ab26"), UNS("1612349317150-e413f6a5b16d"),
    UNS("1579684385127-1ef15d508118"), UNS("1584820927498-cad076eecec4"), UNS("1582750433449-648ed127bb54"),
    UNS("1631815589968-fdb09a223b1e"), UNS("1638202993928-7267aad84c31"), UNS("1527613145-ded424ee5871"),
  ],
  "Hospitals & Clinics": [
    UNS("1538108149393-fbbd81895907"), UNS("1519494026892-4c1fde2e0f09"), UNS("1516549655169-df83a0774514"),
    UNS("1586773860418-d37222d8fce3"), UNS("1585814279905-79e65e08a4b7"), UNS("1530497610245-768937d70f5e"),
    UNS("1504439468489-c8920d796a29"), UNS("1551884831-ef1f5f3e0cf0"), UNS("1563213126-2947e30e6b40"),
    UNS("1578496479914-7ef3b0af0e16"), UNS("1557825835-70d97c3bef2c"), UNS("1543333995-9a20fe17e638"),
  ],
  "Education": [
    UNS("1503676260728-1c00da094a0b"), UNS("1523050854058-8df90110c9f1"), UNS("1580582932707-520aed937b7b"),
    UNS("1497633762265-9d179a990aa6"), UNS("1509062522246-a0b9e71b5f89"), UNS("1456513080510-7bf3a84b82f8"),
    UNS("1434030216411-0b793f4b4173"), UNS("1513258496099-48168024b1a9"), UNS("1516979187895-ef4b2de9d5f6"),
    UNS("1546410531-88588da0a48b"), UNS("1488190211105-8fb0d4d54a7b"), UNS("1606761568499-6b3e36b08bc7"),
  ],
  "IT & Software": [
    UNS("1461749280684-dccba630e2f6"), UNS("1504384308090-c5bc1d1c4e19"), UNS("1512941937669-90a1b58e7e9c"),
    UNS("1587831990711-23ca6441447b"), UNS("1498050108023-c5249f4df085"), UNS("1607799279861-4dd421887179"),
    UNS("1555066931-bf19f8fd1085"), UNS("1593642632559-0c6d3fc62b89"), UNS("1617040096597-50e02b1c76f1"),
    UNS("1593642634315-48f5414c3ad9"), UNS("1526374965328-7f61d4dc18c5"), UNS("1571171637578-41bc2dd41cd2"),
  ],
  "Real Estate": [
    UNS("1560518883-ce09059eeffa"), UNS("1512917774080-9991f1c4c750"), UNS("1480074568708-e8b0145a4f94"),
    UNS("1545324418-cc1a3fa12c98"), UNS("1582407947304-5087cd68effa"), UNS("1486325212027-8081e485255e"),
    UNS("1564013799919-ab600027ffc6"), UNS("1558618049-11e4a6af29cd"), UNS("1600596542815-ffad4c1539a9"),
    UNS("1600585154340-be6161a56a0c"), UNS("1583608205776-bfd35f0d9f83"), UNS("1568605114967-8130f3a36994"),
  ],
  "Automobiles": [
    UNS("1503376780353-7e6692767b70"), UNS("1494976388531-d1058494cdd8"), UNS("1486262715619-67b85e0b08d3"),
    UNS("1552519507-da3b142862c3"), UNS("1542362567-b07e54358753"), UNS("1525609004556-c46c7d6cf023"),
    UNS("1549399542-7c8b660dc5f0"), UNS("1583121274602-3e2820c61522"), UNS("1558618047-3c8c76ca7d13"),
    UNS("1603584173870-7f23b5c05a94"), UNS("1580273916550-22af8dba4fc0"), UNS("1568605117036-5c9e8f5f2e7f"),
  ],
  "Automobile": [
    UNS("1503376780353-7e6692767b70"), UNS("1494976388531-d1058494cdd8"), UNS("1552519507-da3b142862c3"),
    UNS("1542362567-b07e54358753"), UNS("1525609004556-c46c7d6cf023"), UNS("1549399542-7c8b660dc5f0"),
    UNS("1583121274602-3e2820c61522"), UNS("1603584173870-7f23b5c05a94"), UNS("1580273916550-22af8dba4fc0"),
    UNS("1617531038823-9e3ac9c1e5ef"), UNS("1536700765826-3b41c6f7de09"), UNS("1502877338535-766e1452684a"),
  ],
  "Transport": [
    UNS("1492144534655-ae79c964c9d7"), UNS("1519003722824-194d4455a60c"), UNS("1488085061851-e6be41f0fe9a"),
    UNS("1504632083-7e12ccb0a4ee"), UNS("1494976388531-d1058494cdd8"), UNS("1436491865332-7a61a109cc05"),
    UNS("1544620347-c4fd4a3d5957"), UNS("1530521954074-e0a93919b394"), UNS("1568702846914-96b305d2aaeb"),
    UNS("1561361513-2d000a50f0dc"), UNS("1449965408869-00c17c2513ae"), UNS("1580674684081-7617fbf3d745"),
  ],
  "Civil Contractors": [
    UNS("1581094794329-c8112a89af12"), UNS("1504307651254-35680f356dfd"), UNS("1562259949-e8e7689d7828"),
    UNS("1504890536015-c5d7a3e52db4"), UNS("1618221195710-dd6b41faaea6"), UNS("1541888946425-d81bb19240f5"),
    UNS("1503387762-592deb58ef4e"), UNS("1565008447742-97a73e8f3784"), UNS("1590725121172-6e6af8a8b4da"),
    UNS("1517581177683-2531ec1a18e8"), UNS("1600585154526-990dced4db0d"), UNS("1507089947368-19c1da9775ae"),
  ],
  "Construction Materials": [
    UNS("1504307651254-35680f356dfd"), UNS("1518005068-a2fce8a4d5eb"), UNS("1530811761207-8d9d22f0a9bd"),
    UNS("1562259949-e8e7689d7828"), UNS("1615876234886-fd9a39fda97f"), UNS("1581579186913-43c7343ebb96"),
    UNS("1565538810643-e6cfe01bfee6"), UNS("1589939705384-5185137a7f0f"), UNS("1558618666-fcd25c85cd64"),
    UNS("1508450859948-4e04fabaa4ea"), UNS("1510759591672-14b088a2abac"), UNS("1567538096630-e6a00f535d13"),
  ],
  "Agriculture": [
    UNS("1500937386664-56d1dfef3854"), UNS("1464226184884-fa280b87b29f"), UNS("1574323347407-f859a1f1682f"),
    UNS("1416879595882-3373a0480b5b"), UNS("1506792006437-256b665c2a0a"), UNS("1499529112087-3b64e27edcea"),
    UNS("1523348837708-15d4a09cfac2"), UNS("1476062234720-7571a6e1f607"), UNS("1625246333195-12ebdb2e7da5"),
    UNS("1543257580-7269da773bfe"), UNS("1591782408546-a3dab5597c5d"), UNS("1440761341955-26a8d6e36948"),
  ],
  "Textiles & Garments": [
    UNS("1558618666-fcd25c85cd64"), UNS("1515886657613-9f3515b0c78f"), UNS("1617137984306-d8bace30b7ef"),
    UNS("1503454537195-1dcabb73ffb9"), UNS("1556909114-f6e7ad7d3136"), UNS("1521572163474-6864f9cf17ab"),
    UNS("1596755389378-c31d21fd1273"), UNS("1529139574466-a303027bc851"), UNS("1512436991641-6745cdb1723f"),
    UNS("1583744526357-d7d3ad0dace1"), UNS("1469334031814-0c5a20d1e3e6"), UNS("1485518882851-32a2a17a7a8c"),
  ],
  "Jewellery": [
    UNS("1515562141207-7a88fb7ce338"), UNS("1602173574-c5f2c18e09c3"), UNS("1611591437281-460bfbe1220a"),
    UNS("1617038260897-41a1f14a8ca0"), UNS("1535632066927-ab7c9ab60908"), UNS("1605100804763-247f67b3557e"),
    UNS("1610694955371-d65a33067b07"), UNS("1589128777073-263566ae5e4d"), UNS("1573408301185-9521e7272231"),
    UNS("1599643478518-a784e5dc4c8f"), UNS("1561828995-b2e3e7b9b21c"), UNS("1628015097379-67a5e5c10e56"),
  ],
  "Spa & Beauty": [
    UNS("1560750588-73207b1ef5b8"), UNS("1503951914875-452162b0f3f1"), UNS("1596755389378-c31d21fd1273"),
    UNS("1544161515-4be31d3e2900"), UNS("1519741497674-611481863552"), UNS("1487412947147-5cebf100ffc2"),
    UNS("1522337360788-8b13dee7a37e"), UNS("1616394584738-fc6e612e71b9"), UNS("1570172619644-dfd03ed5d881"),
    UNS("1562322140-8baeececf3df"), UNS("1515377905703-c4788e51af15"), UNS("1596462502278-27bfdc1b4cb7"),
  ],
  "Wedding Services": [
    UNS("1519741497674-611481863552"), UNS("1511795409834-ef04bbd61622"), UNS("1487530811176-3780de880c2d"),
    UNS("1511379938547-c1f69419868d"), UNS("1469371670807-013ccf25f16a"), UNS("1465495976277-4387fa4d2d19"),
    UNS("1525772764200-be829a350797"), UNS("1518998053901-5348d3961a04"), UNS("1513071344780-b5e2b46a3fa5"),
    UNS("1606800052052-943c8b4e4f17"), UNS("1583939003579-23b6b6f48e68"), UNS("1607631568010-0bfbe4bf3b47"),
  ],
  "Printing Services": [
    UNS("1562776977-f5db5477e89c"), UNS("1481627834876-b7833e8f3d41"), UNS("1504711434969-e33886168f5c"),
    UNS("1527576397016-ea514802a6c1"), UNS("1586953208448-b90a07095d23"), UNS("1563906267088-f523a11d3930"),
    UNS("1596079890701-0b24d8b8b44a"), UNS("1558618047-3c8c76ca7d13"), UNS("1574953194-4c9bdd12f833"),
    UNS("1606823616-d2b41e1f4c0f"), UNS("1532153545069-cbf7ce4f4d2b"), UNS("1612365886021-5a9ff3cecc0a"),
  ],
  "Advertising": [
    UNS("1504711434969-e33886168f5c"), UNS("1557804506-669a67965ba0"), UNS("1611162617474-5b21e879e113"),
    UNS("1562776977-f5db5477e89c"), UNS("1533750349088-cd871a92f312"), UNS("1542744173-8e7e53415bb0"),
    UNS("1559136555-9303bafe527e"), UNS("1532619187608-e5375cab36aa"), UNS("1611162618479-ee0d6e52edba"),
    UNS("1508166785545-5e8a3cbb5bc8"), UNS("1586953208448-b90a07095d23"), UNS("1533174072545-7a4e9e04bf13"),
  ],
  "Finance & Banking": [
    UNS("1554224155-6726b3ff858f"), UNS("1611974789855-9c2a0a7236a3"), UNS("1454165804606-c3d57bc86b40"),
    UNS("1507679799987-c73779587ccf"), UNS("1450101499163-c8848c66ca85"), UNS("1559526324-593bc073d938"),
    UNS("1565514020179-026b92b2d6ad"), UNS("1579621970563-ebec7560ef56"), UNS("1526304640581-d339046af166"),
    UNS("1518183214770-89396c4f5b71"), UNS("1616803689943-5b60ee98a3c0"), UNS("1580519542036-c47de6196ba5"),
  ],
  "Banking & Finance": [
    UNS("1611974789855-9c2a0a7236a3"), UNS("1554224155-6726b3ff858f"), UNS("1454165804606-c3d57bc86b40"),
    UNS("1544377193-33dcf4d68fb5"), UNS("1450101499163-c8848c66ca85"), UNS("1559526324-593bc073d938"),
    UNS("1565514020179-026b92b2d6ad"), UNS("1579621970563-ebec7560ef56"), UNS("1518183214770-89396c4f5b71"),
    UNS("1526304640581-d339046af166"), UNS("1616803689943-5b60ee98a3c0"), UNS("1580519542036-c47de6196ba5"),
  ],
  "Insurance": [
    UNS("1450101499163-c8848c66ca85"), UNS("1454165804606-c3d57bc86b40"), UNS("1576086213369-97a306d36557"),
    UNS("1503376780353-7e6692767b70"), UNS("1507679799987-c73779587ccf"), UNS("1559526324-593bc073d938"),
    UNS("1565514020179-026b92b2d6ad"), UNS("1618005182384-a83a8bd57fbe"), UNS("1621761191319-c6fb62004040"),
    UNS("1553729459-52bb13e2b47e"), UNS("1580519542036-c47de6196ba5"), UNS("1560472354-b33ff0ad2a89"),
  ],
  "Advocate & Legal": [
    UNS("1589829545856-d10d557cf95f"), UNS("1521791055903-6e73b4e8de57"), UNS("1568254183919-78a4f43a2877"),
    UNS("1450101499163-c8848c66ca85"), UNS("1560518883-ce09059eeffa"), UNS("1521791136064-7986c2920216"),
    UNS("1507679799987-c73779587ccf"), UNS("1479142506502-19bf9a7d5a69"), UNS("1575408264798-102f9d082b28"),
    UNS("1562564058-bc76fa4ecca1"), UNS("1631538993698-d9c63e6b4a7f"), UNS("1507003211169-0a1dd7228f2d"),
  ],
  "Legal Services": [
    UNS("1589829545856-d10d557cf95f"), UNS("1521791055903-6e73b4e8de57"), UNS("1568254183919-78a4f43a2877"),
    UNS("1479142506502-19bf9a7d5a69"), UNS("1575408264798-102f9d082b28"), UNS("1562564058-bc76fa4ecca1"),
    UNS("1631538993698-d9c63e6b4a7f"), UNS("1521791136064-7986c2920216"), UNS("1507679799987-c73779587ccf"),
    UNS("1507003211169-0a1dd7228f2d"), UNS("1450101499163-c8848c66ca85"), UNS("1560518883-ce09059eeffa"),
  ],
  "Electricals & Electronics": [
    UNS("1550751827-4bd374c3f58b"), UNS("1518770660439-4636190af475"), UNS("1509391366636-d1ed4fc0d49c"),
    UNS("1558618047-3c8c76ca7d13"), UNS("1558002038-bb4237b50b33"), UNS("1572981779307-38b8cabb2407"),
    UNS("1519003722824-194d4455a60c"), UNS("1498049834880-7e9080a16f04"), UNS("1487611419359-d7b5ff82b578"),
    UNS("1620927702-d0a72f9f6a3f"), UNS("1604329760661-6e0a73dfa1af"), UNS("1581092160562-40aa73eba9ce"),
  ],
  "Digital & IT Products": [
    UNS("1587831990711-23ca6441447b"), UNS("1558002038-bb4237b50b33"), UNS("1461749280684-dccba630e2f6"),
    UNS("1550751827-4bd374c3f58b"), UNS("1518770660439-4636190af475"), UNS("1498049834880-7e9080a16f04"),
    UNS("1487611419359-d7b5ff82b578"), UNS("1620927702-d0a72f9f6a3f"), UNS("1604329760661-6e0a73dfa1af"),
    UNS("1581092160562-40aa73eba9ce"), UNS("1512941937669-90a1b58e7e9c"), UNS("1607799279861-4dd421887179"),
  ],
  "Sports": [
    UNS("1571019613454-1cb2f99b2d8b"), UNS("1576153192396-180ecef2a715"), UNS("1535131323232-d9409b4a1d3a"),
    UNS("1558618666-fcd25c85cd64"), UNS("1612872087-5bb09f30e7b2"), UNS("1541534741688-6078c787b53d"),
    UNS("1517649763962-0c623066013b"), UNS("1547347298-4074ad3086f0"), UNS("1526676037926-ac6e68fea95e"),
    UNS("1599058945522-4f37e7bf8c5f"), UNS("1553108715-308e8537ce55"), UNS("1574680096145-d05b474e2155"),
  ],
  "Photography": [
    UNS("1471341971476-ae15ff5dd4ea"), UNS("1516035069371-29a1b244cc32"), UNS("1542038784456-1ea8e935640e"),
    UNS("1495121553079-4c61f93c6933"), UNS("1452626038306-9197ba8aa6b2"), UNS("1514539079130-25950c84af65"),
    UNS("1504257432389-52343af06ae3"), UNS("1504916586636-c6e9e6e63b28"), UNS("1598618443855-232ee0f4f4b0"),
    UNS("1593642634559-c6cbf9b7e69c"), UNS("1558618048-dcec0ef96aab"), UNS("1577979749830-f1d742b96791"),
  ],
  "Organic Products": [
    UNS("1490818387583-1baba5e638af"), UNS("1542838132-92c53300491e"), UNS("1518492950406-7f8cedb2f56c"),
    UNS("1474979266404-7eaacbf3e695"), UNS("1596755389378-c31d21fd1273"), UNS("1488459716781-31db52582fe9"),
    UNS("1490474504789-a48440b0bb19"), UNS("1612197620501-2a6dc28d67ae"), UNS("1540420773420-3a05bb2ced7e"),
    UNS("1519996529931-28324d5a630e"), UNS("1607305387299-a3d9611cd469"), UNS("1488459716781-31db52582fe9"),
  ],
  "Daily Needs": [
    UNS("1542838132-92c53300491e"), UNS("1488459716781-31db52582fe9"), UNS("1509440159596-0249088772ff"),
    UNS("1518492950406-7f8cedb2f56c"), UNS("1490474504789-a48440b0bb19"), UNS("1490818387583-1baba5e638af"),
    UNS("1534483509719-3feaee7c30da"), UNS("1556742049-0cfed4f6a45d"), UNS("1613676215-9d54af3c3179"),
    UNS("1543168256-b7e4b6e9a4a2"), UNS("1604503468766-a8a5631a2f2e"), UNS("1535914254981-b5012eebbd37"),
  ],
  "Courier Services": [
    UNS("1566576912321-d58ddd7a6097"), UNS("1601584428474-47a887d20b1e"), UNS("1488085061851-e6be41f0fe9a"),
    UNS("1519003722824-194d4455a60c"), UNS("1586528116311-ad8dd3c8310d"), UNS("1580674684081-7617fbf3d745"),
    UNS("1612865547977-32e7e26dc20e"), UNS("1574688636-61ede2524cb9"),
    UNS("1553413077-190dd305b4ea"), UNS("1578575437130-527eed3ff0f5"), UNS("1533750349088-cd871a92f312"),
  ],
  "Packers & Movers": [
    UNS("1601584428474-47a887d20b1e"), UNS("1519003722824-194d4455a60c"), UNS("1566576912321-d58ddd7a6097"),
    UNS("1586528116311-ad8dd3c8310d"), UNS("1580674684081-7617fbf3d745"), UNS("1612865547977-32e7e26dc20e"),
    UNS("1578575437130-527eed3ff0f5"), UNS("1553413077-190dd305b4ea"),
    UNS("1533750349088-cd871a92f312"), UNS("1574688636-61ede2524cb9"), UNS("1464319134039-bc2f7f76ab2f"),
  ],
  "Pest Control": [
    UNS("1628177201049-f4cd92bf93a5"), UNS("1582719471384-894fbb16e074"), UNS("1625246333195-12ebdb2e7da5"),
    UNS("1558618047-3c8c76ca7d13"), UNS("1416879595882-3373a0480b5b"), UNS("1599940824399-c89f6c703f14"),
    UNS("1609710228159-0fa9bd7c0827"), UNS("1503454537195-1dcabb73ffb9"), UNS("1547592180-85f173990554"),
    UNS("1590005024862-6b67679a29fb"), UNS("1598300042247-d088f8ab3a91"), UNS("1584308666744-f0cb5bba7831"),
  ],
  "Repairs": [
    UNS("1621905251189-08b45d6a269e"), UNS("1556742049-0cfed4f6a45d"), UNS("1572981779307-38b8cabb2407"),
    UNS("1581092921461-eab62e97a780"), UNS("1558618047-3c8c76ca7d13"), UNS("1487611419359-d7b5ff82b578"),
    UNS("1504890536015-c5d7a3e52db4"), UNS("1518770660439-4636190af475"),
    UNS("1553108715-308e8537ce55"), UNS("1608571423902-ae20802f0965"), UNS("1617347454861-3db8701e4f55"),
  ],
  "Religious": [
    UNS("1609710228159-0fa9bd7c0827"), UNS("1481627834876-b7833e8f3d41"), UNS("1519669556878-63639304a07c"),
    UNS("1545293704-c5a0fb00e040"), UNS("1564419359361-ebdcb022b40d"), UNS("1582719471384-894fbb16e074"),
    UNS("1603415526960-f7e0328c63b8"), UNS("1589652717521-10c0d7000a7d"), UNS("1556742049-0cfed4f6a45d"),
    UNS("1531088009183-5ff5b7c95f91"), UNS("1548092032-4b91d92ed574"), UNS("1529156069898-49953e39b3ac"),
  ],
  "Banquets & Event Halls": [
    UNS("1587825140708-dfaf72ae4b04"), UNS("1527529482837-4698179dc6ce"), UNS("1519741497674-611481863552"),
    UNS("1511578314322-379afb476865"), UNS("1469371670807-013ccf25f16a"), UNS("1504674900247-0877df9cc836"),
    UNS("1530103862676-de8c9debad1d"), UNS("1464366400600-ac2779ada385"), UNS("1578926078799-48e56d8c3e30"),
    UNS("1492684223066-81342ee5ff30"), UNS("1533174072545-7a4e9e04bf13"), UNS("1429962017-e8d50a1b3024"),
  ],
  "Labs & Diagnostics": [
    UNS("1576086213369-97a306d36557"), UNS("1559757148-47f8b7c6ab26"), UNS("1551601651-2a8555f1a136"),
    UNS("1579684385127-1ef15d508118"), UNS("1538108149393-fbbd81895907"), UNS("1527613145-ded424ee5871"),
    UNS("1612349317150-e413f6a5b16d"), UNS("1582750433449-648ed127bb54"), UNS("1631815589968-fdb09a223b1e"),
    UNS("1638202993928-7267aad84c31"), UNS("1516549655169-df83a0774514"), UNS("1530497610245-768937d70f5e"),
  ],
  "Furniture": [
    UNS("1555041469-a586c61ea9bc"), UNS("1556909114-f6e7ad7d3136"), UNS("1618221195710-dd6b41faaea6"),
    UNS("1493663284028-6cfeeb92a6f0"), UNS("1540574163-c96bcd8a9b55"), UNS("1600585154340-be6161a56a0c"),
    UNS("1524758631624-e2822c4d3afe"), UNS("1565538811070-50f887fc8ce8"), UNS("1507089947368-19c1da9775ae"),
    UNS("1486304873000-e639cb87af85"), UNS("1618220179428-22790b461d35"), UNS("1595526051383-a02fc8d38b3f"),
  ],
  "Home Appliances": [
    UNS("1556909114-f6e7ad7d3136"), UNS("1550751827-4bd374c3f58b"), UNS("1618221195710-dd6b41faaea6"),
    UNS("1555041469-a586c61ea9bc"), UNS("1484154218851-a2dfe57d474c"), UNS("1585771724684-38796367a489"),
    UNS("1567538096630-e6a00f535d13"), UNS("1600121848594-d8be75b10278"), UNS("1574263236-99404f5c25a7"),
    UNS("1565183928294-7063f23ce0f8"), UNS("1616486338812-3dadae4eac24"), UNS("1583847268964-b28dc8f51f92"),
  ],
  "Jobs": [
    UNS("1507679799987-c73779587ccf"), UNS("1521791136064-7986c2920216"), UNS("1486312338219-ce68d2c6f44d"),
    UNS("1454165804606-c3d57bc86b40"), UNS("1524995997946-a1d2e5a4a672"), UNS("1568992687947-868a62a9f521"),
    UNS("1553877522-43269d4ea984"), UNS("1571867424488-4756796d5b32"), UNS("1600880292203-757bb62b2f72"),
    UNS("1573496359142-b8d87734a5a2"), UNS("1565688534549-b44570a0f2a1"), UNS("1542744173-8e7e53415bb0"),
  ],
  "B2B Services": [
    UNS("1521791136064-7986c2920216"), UNS("1530811761207-8d9d22f0a9bd"), UNS("1518770660439-4636190af475"),
    UNS("1576086213369-97a306d36557"), UNS("1566576912321-d58ddd7a6097"), UNS("1454165804606-c3d57bc86b40"),
    UNS("1507679799987-c73779587ccf"), UNS("1542744173-8e7e53415bb0"), UNS("1564121211816-51b76d30d9a3"),
    UNS("1600880292203-757bb62b2f72"), UNS("1553877522-43269d4ea984"), UNS("1571867424488-4756796d5b32"),
  ],
  "Travel & Tourism": [
    UNS("1488085061851-e6be41f0fe9a"), UNS("1526772662-44fd4b4f56cc"), UNS("1469854523086-cc02fe5d8800"),
    UNS("1507525428034-b723cf961d3e"), UNS("1524850011238-e9c699e4ada5"), UNS("1476514525405-309230709fbd"),
    UNS("1500530855697-b1bc11e4a903"), UNS("1539635278303-d4002c07b28a"), UNS("1530521938006-83db9f8d5f33"),
    UNS("1464037866556-6812c9d1c72e"), UNS("1548574505-db18b21e0c53"), UNS("1501436513145-30f24e19fcc8"),
  ],
  "Nursery & Plants": [
    UNS("1416879595882-3373a0480b5b"), UNS("1506792006437-256b665c2a0a"), UNS("1574323347407-f859a1f1682f"),
    UNS("1547592180-85f173990554"), UNS("1540420773420-3a05bb2ced7e"), UNS("1476062234720-7571a6e1f607"),
    UNS("1466442929976-cd23d3f93ffa"), UNS("1512428559087-560fa5ceab42"), UNS("1524059633606-a522381cae54"),
    UNS("1491895200222-0fc4a4c35e5c"), UNS("1558615069-dda88a1d5440"), UNS("1454165804606-c3d57bc86b40"),
  ],
  "Demand Services": [
    UNS("1581092921461-eab62e97a780"), UNS("1572981779307-38b8cabb2407"), UNS("1581578731548-c64695cc6952"),
    UNS("1504890536015-c5d7a3e52db4"), UNS("1558618047-3c8c76ca7d13"), UNS("1621905251189-08b45d6a269e"),
    UNS("1541534741688-6078c787b53d"), UNS("1499529112087-3b64e27edcea"), UNS("1510075222893-6de1d23b0d83"),
    UNS("1504307651254-35680f356dfd"), UNS("1565538811070-50f887fc8ce8"), UNS("1617347454861-3db8701e4f55"),
  ],
};

const GENERAL_POOL: string[] = [
  UNS("1486406146926-c627a92ad1ab"), UNS("1507679799987-c73779587ccf"), UNS("1521791136064-7986c2920216"),
  UNS("1454165804606-c3d57bc86b40"), UNS("1556742049-0cfed4f6a45d"), UNS("1542744173-8e7e53415bb0"),
  UNS("1564121211816-51b76d30d9a3"), UNS("1600880292203-757bb62b2f72"), UNS("1553877522-43269d4ea984"),
  UNS("1571867424488-4756796d5b32"), UNS("1524995997946-a1d2e5a4a672"), UNS("1568992687947-868a62a9f521"),
  UNS("1573496359142-b8d87734a5a2"), UNS("1565688534549-b44570a0f2a1"),
  UNS("1497366216548-37526851114c"), UNS("1497366754035-f200968a7db3"), UNS("1497366811353-6b6ed0c3e2a4"),
];

function getBusinessImage(b: Business): string {
  if (b.coverImage?.trim()) return b.coverImage.trim();
  if (b.image?.trim()) return b.image.trim();
  if (b.img?.trim()) return b.img.trim();
  if (b.imageUrl?.trim()) return b.imageUrl.trim();

  // Pick a unique image from the category pool using hash of combined unique fields
  // Using _id + name + listingCode + phone ensures different images even for similar IDs
  const seed = `${b._id || ""}|${b.name || ""}|${b.listingCode || ""}|${b.phone || ""}`;
  const hash = hashString(seed);

  const cat = b.category || "";
  const pool =
    CATEGORY_IMAGE_POOLS[cat] ||
    CATEGORY_IMAGE_POOLS[
      Object.keys(CATEGORY_IMAGE_POOLS).find(
        k => k.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(k.toLowerCase())
      ) || ""
    ] ||
    GENERAL_POOL;

  return pool[hash % pool.length];
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
