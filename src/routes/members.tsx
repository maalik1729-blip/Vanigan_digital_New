import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Search, User, Phone, Mail, Loader2, AlertCircle, CreditCard,
  ChevronLeft, ChevronRight, ShieldCheck, Building2, Scale, Users,
  MapPin, Heart, Shield, Star, Tag, Store, Plus, X
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { Section, SectionLabel } from "@/components/Section";
import { StatusPill } from "@/components/StatusPill";

const searchSchema = z.object({
  search: z.string().optional(),
  district: z.string().optional(),
  assembly: z.string().optional(),
  page: z.coerce.number().optional(),
  service: z.string().optional(),
  type: z.string().optional(),
  tab: z.enum(["members", "organizers", "businesses"]).optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
});

export const Route = createFileRoute("/members")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "உறுப்பினர் பட்டியல் — Members Directory · TNVS" },
      { name: "description", content: "View official registered members of Tamil Nadu Vanigargalin Sangamam." },
    ],
  }),
  component: MembersPage,
});

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

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  "Hotels & Restaurants": { icon: "🍽️", color: "from-orange-500 to-red-500" },
  "Caterers": { icon: "🥘", color: "from-amber-500 to-orange-500" },
  "Daily Needs": { icon: "🛒", color: "from-green-500 to-emerald-500" },
  "Organic Products": { icon: "🌿", color: "from-lime-500 to-green-500" },
  "Doctors": { icon: "👨‍⚕️", color: "from-blue-500 to-cyan-500" },
  "Hospitals & Clinics": { icon: "🏥", color: "from-sky-500 to-blue-500" },
  "Pharmacy": { icon: "💊", color: "from-teal-500 to-cyan-500" },
  "Labs & Diagnostics": { icon: "🔬", color: "from-sky-600 to-blue-700" },
  "Spa & Beauty": { icon: "💅", color: "from-pink-500 to-rose-500" },
  "Education": { icon: "🎓", color: "from-violet-500 to-purple-500" },
  "Coaching Centers": { icon: "📚", color: "from-purple-500 to-indigo-500" },
  "IT & Software": { icon: "💻", color: "from-indigo-500 to-blue-500" },
  "Digital & IT Products": { icon: "🖥️", color: "from-blue-500 to-indigo-500" },
  "Electricals & Electronics": { icon: "⚡", color: "from-yellow-500 to-amber-500" },
  "Construction Materials": { icon: "🧱", color: "from-stone-500 to-slate-500" },
  "Civil Contractors": { icon: "🏗️", color: "from-slate-500 to-gray-600" },
  "Real Estate": { icon: "🏠", color: "from-emerald-500 to-teal-500" },
  "Interior Design": { icon: "🛋️", color: "from-fuchsia-500 to-pink-500" },
  "Transport": { icon: "🚛", color: "from-blue-600 to-indigo-600" },
  "Automobiles": { icon: "🚗", color: "from-gray-600 to-slate-600" },
  "Automobile": { icon: "🚘", color: "from-gray-500 to-zinc-600" },
  "Textiles & Garments": { icon: "👗", color: "from-rose-500 to-pink-500" },
  "Jewellery": { icon: "💎", color: "from-yellow-400 to-amber-500" },
  "Footwear": { icon: "👟", color: "from-orange-400 to-amber-500" },
  "Agriculture": { icon: "🌾", color: "from-lime-600 to-green-600" },
  "Nursery & Plants": { icon: "🌱", color: "from-green-400 to-lime-500" },
  "B2B Services": { icon: "🤝", color: "from-cyan-500 to-blue-500" },
  "Finance & Banking": { icon: "🏦", color: "from-blue-700 to-indigo-700" },
  "Banking & Finance": { icon: "🏦", color: "from-blue-800 to-indigo-800" },
  "Insurance": { icon: "🛡️", color: "from-teal-600 to-cyan-700" },
  "Legal Services": { icon: "⚖️", color: "from-slate-600 to-gray-700" },
  "Advocate & Legal": { icon: "⚖️", color: "from-slate-700 to-gray-800" },
  "Jobs": { icon: "💼", color: "from-sky-500 to-blue-600" },
  "Advertising": { icon: "📢", color: "from-red-500 to-rose-500" },
  "Printing Services": { icon: "🖨️", color: "from-gray-500 to-slate-500" },
  "Photography": { icon: "📸", color: "from-violet-600 to-purple-600" },
  "Wedding Services": { icon: "💒", color: "from-pink-400 to-rose-400" },
  "Event Management": { icon: "🎉", color: "from-amber-400 to-yellow-400" },
  "Banquets & Event Halls": { icon: "🏛️", color: "from-amber-500 to-orange-500" },
  "Home Appliances": { icon: "🏠", color: "from-teal-400 to-cyan-500" },
  "Furniture": { icon: "🪑", color: "from-stone-400 to-amber-500" },
  "Hardware & Tools": { icon: "🔧", color: "from-zinc-500 to-slate-500" },
  "Demand Services": { icon: "🛠️", color: "from-orange-600 to-red-600" },
  "Hire Services": { icon: "🔑", color: "from-teal-500 to-green-500" },
  "Courier Services": { icon: "📦", color: "from-orange-500 to-amber-500" },
  "Packers & Movers": { icon: "🚚", color: "from-blue-500 to-sky-500" },
  "Pest Control": { icon: "🐛", color: "from-lime-700 to-green-700" },
  "Repairs": { icon: "🔩", color: "from-slate-500 to-gray-500" },
  "Sports": { icon: "⚽", color: "from-green-600 to-emerald-600" },
  "Religious": { icon: "🛕", color: "from-amber-600 to-yellow-600" },
  "Bills & Recharge": { icon: "📱", color: "from-indigo-500 to-blue-600" },
  "Travel & Tourism": { icon: "✈️", color: "from-sky-500 to-cyan-500" },
};

interface Member {
  id: number;
  name: string;
  epic: string;
  mobile: string;
  email?: string;
  dob?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  assembly?: string;
  district?: string;
  shop?: string;
  type?: string;
  address?: string;
  years?: string;
  wing?: string;
  selfie?: string;
}

interface Organizer {
  id: number;
  organizer_code: string;
  name: string;
  mobile: string;
  email?: string;
  role?: string;
  district?: string;
  assembly?: string;
  status: string;
  created_at: string;
}

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

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  const range = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pages.push(i);
    } else if (
      (i === 2 && currentPage - range > 2) ||
      (i === totalPages - 1 && currentPage + range < totalPages - 1)
    ) {
      pages.push("...");
    }
  }

  const uniquePages: (number | string)[] = [];
  pages.forEach((p) => {
    if (p === "..." && uniquePages[uniquePages.length - 1] === "...") {
      return;
    }
    uniquePages.push(p);
  });

  return uniquePages;
}

function MembersPage() {
  const { t } = useLanguage();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const search = searchParams.search || "";
  const district = searchParams.district || "";
  const assembly = searchParams.assembly || "";
  const page = searchParams.page || 1;
  const limit = 12;
  const currentCategory = searchParams.category;
  const currentSubCategory = searchParams.subCategory;
  const isSearchActive = !!(search || district || assembly);

  const [members, setMembers] = useState<Member[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalBusinesses, setTotalBusinesses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tab = searchParams.tab || "members";

  // Form modals and creation states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const [dbMembersCount, setDbMembersCount] = useState<number | null>(null);
  const [dbOrganizersCount, setDbOrganizersCount] = useState<number | null>(null);
  const [dbBusinessesCount, setDbBusinessesCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/public/members?limit=1")
      .then(res => res.json())
      .then(data => setDbMembersCount(data.total))
      .catch(err => console.warn("Failed to fetch total members count:", err));

    fetch("/api/public/organizer")
      .then(res => res.json())
      .then(data => setDbOrganizersCount(data.organizers?.length || 0))
      .catch(err => console.warn("Failed to fetch total organizers count:", err));

    fetch("/api/public/business?limit=1")
      .then(res => res.json())
      .then(data => setDbBusinessesCount(data.total))
      .catch(err => console.warn("Failed to fetch total businesses count:", err));
  }, [refreshCount]);

  const [memberForm, setMemberForm] = useState({
    name: "",
    epic: "",
    mobile: "",
    email: "",
    dob: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    assembly: "",
    district: "",
    shop: "",
    type: "Retail",
    address: "",
    years: "",
    wing: "",
    pin: "",
  });

  const [organizerForm, setOrganizerForm] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    district: "",
    assembly: "",
  });

  const [businessForm, setBusinessForm] = useState({
    name: "",
    description: "",
    category: "Hotels & Restaurants",
    subCategory: "",
    phone: "",
    phone2: "",
    email: "",
    website: "",
    city: "",
    district: "",
    assembly: "",
    address: "",
    pincode: "",
    landmark: "",
    coverImage: "",
  });

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setFormError(null);
    setMemberForm({
      name: "",
      epic: "",
      mobile: "",
      email: "",
      dob: "",
      age: "",
      gender: "Male",
      bloodGroup: "O+",
      assembly: "",
      district: "",
      shop: "",
      type: "Retail",
      address: "",
      years: "",
      wing: "",
      pin: "",
    });
    setOrganizerForm({
      name: "",
      mobile: "",
      email: "",
      role: "",
      district: "",
      assembly: "",
    });
    setBusinessForm({
      name: "",
      description: "",
      category: "Hotels & Restaurants",
      subCategory: "",
      phone: "",
      phone2: "",
      email: "",
      website: "",
      city: "",
      district: "",
      assembly: "",
      address: "",
      pincode: "",
      landmark: "",
      coverImage: "",
    });
  };

  // Search input state
  const [searchVal, setSearchVal] = useState(search);
  const [districtVal, setDistrictVal] = useState(district);
  const [assemblyVal, setAssemblyVal] = useState(assembly);

  useEffect(() => {
    setSearchVal(search);
  }, [search]);

  useEffect(() => {
    setDistrictVal(district);
  }, [district]);

  useEffect(() => {
    setAssemblyVal(assembly);
  }, [assembly]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (district) query.append("district", district);
        if (assembly) query.append("assembly", assembly);

        if (tab === "members") {
          query.append("page", String(page));
          query.append("limit", String(limit));
          const res = await fetch(`/api/public/members?${query.toString()}`, { signal: controller.signal });
          if (!res.ok) throw new Error(await res.text() || "Failed to fetch members");
          const data = await res.json();
          if (active) {
            setMembers(data.members || []);
            setTotalMembers(data.total || 0);
          }
        } else if (tab === "organizers") {
          const res = await fetch(`/api/public/organizer?${query.toString()}`, { signal: controller.signal });
          if (!res.ok) throw new Error(await res.text() || "Failed to fetch organizers");
          const data = await res.json();
          if (active) {
            setOrganizers(data.organizers || []);
          }
        } else if (tab === "businesses") {
          // Skip database query unless search is active or category + subcategory are selected
          if (!isSearchActive && (!searchParams.category || !searchParams.subCategory)) {
            if (active) {
              setBusinesses([]);
              setTotalBusinesses(0);
            }
            setIsLoading(false);
            return;
          }

          query.append("page", String(page));
          query.append("limit", String(limit));
          if (searchParams.category) {
            let cat = searchParams.category;
            if (cat === "Legal Services") cat = "Advocate & Legal";
            if (cat === "Automobiles") cat = "Automobile";
            if (cat === "Finance & Banking") cat = "Banking & Finance";
            query.append("category", cat);
          }
          if (searchParams.subCategory) query.append("subCategory", searchParams.subCategory);
          const res = await fetch(`/api/public/business?${query.toString()}`, { signal: controller.signal });
          if (!res.ok) throw new Error(await res.text() || "Failed to fetch businesses");
          const data = await res.json();
          if (active) {
            setBusinesses(data.businesses || []);
            setTotalBusinesses(data.total || 0);
          }
        }
      } catch (err: any) {
        if (active && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [search, district, assembly, page, tab, searchParams.category, searchParams.subCategory, refreshCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchVal || undefined,
        district: districtVal || undefined,
        assembly: assemblyVal || undefined,
        page: 1,
      }),
    });
  };

  const clearFilters = () => {
    setSearchVal("");
    setDistrictVal("");
    setAssemblyVal("");
    navigate({
      search: () => ({}),
    });
  };

  const handleTabChange = (newTab: "members" | "organizers" | "businesses") => {
    navigate({
      search: (prev) => ({
        ...prev,
        tab: newTab,
        page: 1,
      }),
    });
  };

  let totalPages = 0;
  if (tab === "members") {
    totalPages = Math.ceil(totalMembers / limit);
  } else if (tab === "businesses") {
    totalPages = Math.ceil(totalBusinesses / limit);
  } else if (tab === "organizers") {
    totalPages = Math.ceil(organizers.length / limit);
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      let endpoint = "";
      let bodyData = {};

      if (tab === "members") {
        endpoint = "/api/public/members";
        bodyData = memberForm;
        if (!memberForm.name || !memberForm.epic || !memberForm.mobile || !memberForm.pin) {
          throw new Error(t("பெயர், EPIC ID, போன் மற்றும் PIN ஆகியவை கட்டாயம்", "Name, EPIC ID, Mobile and PIN are required"));
        }
      } else if (tab === "organizers") {
        endpoint = "/api/public/organizer";
        bodyData = organizerForm;
        if (!organizerForm.name || !organizerForm.mobile || !organizerForm.role || !organizerForm.district) {
          throw new Error(t("பெயர், போன், பதவி மற்றும் மாவட்டம் ஆகியவை கட்டாயம்", "Name, Mobile, Role and District are required"));
        }
      } else if (tab === "businesses") {
        endpoint = "/api/public/business";
        bodyData = businessForm;
        if (!businessForm.name || !businessForm.phone || !businessForm.category || !businessForm.district || !businessForm.address) {
          throw new Error(t("வணிக பெயர், போன், வகை, மாவட்டம் மற்றும் முகவரி ஆகியவை கட்டாயம்", "Business Name, Phone, Category, District and Address are required"));
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create directory entry");
      }

      toast.success(t("பதிவு வெற்றிகரமாக சேர்க்கப்பட்டது!", "Directory record added successfully!"));
      closeCreateModal();
      setRefreshCount(prev => prev + 1);

    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const renderMemberForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("பெயர் *", "Name *")}
        </label>
        <input
          type="text"
          required
          value={memberForm.name}
          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Senthil Kumar"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("EPIC ID / உறுப்பினர் எண் *", "EPIC ID / Member Code *")}
        </label>
        <input
          type="text"
          required
          value={memberForm.epic}
          onChange={(e) => setMemberForm({ ...memberForm, epic: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. TNVS123456"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("கைபேசி *", "Mobile *")}
        </label>
        <input
          type="tel"
          required
          value={memberForm.mobile}
          onChange={(e) => setMemberForm({ ...memberForm, mobile: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. 9876543210"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("பாதுகாப்பு PIN (4-இலக்க) *", "Security PIN (4-digit) *")}
        </label>
        <input
          type="password"
          maxLength={4}
          required
          value={memberForm.pin}
          onChange={(e) => setMemberForm({ ...memberForm, pin: e.target.value.replace(/\D/g, "") })}
          className="input-base text-xs font-mono"
          placeholder="••••"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மின்னஞ்சல்", "Email")}
        </label>
        <input
          type="email"
          value={memberForm.email}
          onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. senthil@gmail.com"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("பிறந்த தேதி", "Date of Birth")}
        </label>
        <input
          type="date"
          value={memberForm.dob}
          onChange={(e) => setMemberForm({ ...memberForm, dob: e.target.value })}
          className="input-base text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வயது", "Age")}
        </label>
        <input
          type="number"
          value={memberForm.age}
          onChange={(e) => setMemberForm({ ...memberForm, age: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. 42"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("பாலினம்", "Gender")}
        </label>
        <select
          value={memberForm.gender}
          onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
          className="input-base text-xs bg-card"
        >
          <option value="Male">{t("ஆண்", "Male")}</option>
          <option value="Female">{t("பெண்", "Female")}</option>
          <option value="Other">{t("இதர", "Other")}</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("இரத்த வகை", "Blood Group")}
        </label>
        <select
          value={memberForm.bloodGroup}
          onChange={(e) => setMemberForm({ ...memberForm, bloodGroup: e.target.value })}
          className="input-base text-xs bg-card"
        >
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மாவட்டம்", "District")}
        </label>
        <input
          type="text"
          value={memberForm.district}
          onChange={(e) => setMemberForm({ ...memberForm, district: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Chennai"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("தொகுதி", "Assembly")}
        </label>
        <input
          type="text"
          value={memberForm.assembly}
          onChange={(e) => setMemberForm({ ...memberForm, assembly: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Mylapore"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("கடை / நிறுவன பெயர்", "Shop / Company Name")}
        </label>
        <input
          type="text"
          value={memberForm.shop}
          onChange={(e) => setMemberForm({ ...memberForm, shop: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Senthil Traders"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வணிக வகை", "Business Type")}
        </label>
        <select
          value={memberForm.type}
          onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value })}
          className="input-base text-xs bg-card"
        >
          <option value="Retail">{t("சில்லறை வணிகம்", "Retail")}</option>
          <option value="Wholesale">{t("மொத்த வணிகம்", "Wholesale")}</option>
          <option value="Service">{t("சேவை", "Service")}</option>
          <option value="Other">{t("இதர", "Other")}</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வணிக பிரிவு (சிறப்பு அலகு)", "Business Wing")}
        </label>
        <input
          type="text"
          value={memberForm.wing}
          onChange={(e) => setMemberForm({ ...memberForm, wing: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. IT Wing / Retail Division"
        />
      </div>
      <div className="md:col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("முகவரி", "Address")}
        </label>
        <textarea
          value={memberForm.address}
          onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
          className="input-base text-xs min-h-[60px] py-2"
          placeholder="e.g. 12, Bazaar Street, Mylapore, Chennai"
        />
      </div>
    </div>
  );

  const renderOrganizerForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("பெயர் *", "Name *")}
        </label>
        <input
          type="text"
          required
          value={organizerForm.name}
          onChange={(e) => setOrganizerForm({ ...organizerForm, name: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. K. Murugan"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("கைபேசி *", "Mobile *")}
        </label>
        <input
          type="tel"
          required
          value={organizerForm.mobile}
          onChange={(e) => setOrganizerForm({ ...organizerForm, mobile: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. 9988776655"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("பதவி / பொறுப்பு *", "Role / Designation *")}
        </label>
        <input
          type="text"
          required
          value={organizerForm.role}
          onChange={(e) => setOrganizerForm({ ...organizerForm, role: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. District Coordinator"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மின்னஞ்சல்", "Email")}
        </label>
        <input
          type="email"
          value={organizerForm.email}
          onChange={(e) => setOrganizerForm({ ...organizerForm, email: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. murugan@gmail.com"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மாவட்டம் *", "District *")}
        </label>
        <input
          type="text"
          required
          value={organizerForm.district}
          onChange={(e) => setOrganizerForm({ ...organizerForm, district: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Chennai"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("தொகுதி", "Assembly")}
        </label>
        <input
          type="text"
          value={organizerForm.assembly}
          onChange={(e) => setOrganizerForm({ ...organizerForm, assembly: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Mylapore"
        />
      </div>
    </div>
  );

  const renderBusinessForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வணிக பெயர் *", "Business Name *")}
        </label>
        <input
          type="text"
          required
          value={businessForm.name}
          onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Murugan Textiles"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("கைபேசி *", "Phone *")}
        </label>
        <input
          type="tel"
          required
          value={businessForm.phone}
          onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. 9876543210"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வகை *", "Category *")}
        </label>
        <select
          value={businessForm.category}
          onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
          className="input-base text-xs bg-card"
        >
          {[
            "Hotels & Restaurants",
            "Daily Needs",
            "Pharmacy",
            "Electricals & Electronics",
            "Construction Materials",
            "Textiles & Garments",
            "Jewellery",
            "Agriculture",
            "B2B Services",
            "Banking & Finance",
            "Real Estate",
            "Other",
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("துணைப் பிரிவு", "Subcategory")}
        </label>
        <input
          type="text"
          value={businessForm.subCategory}
          onChange={(e) => setBusinessForm({ ...businessForm, subCategory: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Ready-made Garments"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மாவட்டம் *", "District *")}
        </label>
        <input
          type="text"
          required
          value={businessForm.district}
          onChange={(e) => setBusinessForm({ ...businessForm, district: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Chennai"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("தொகுதி / நகரம்", "Assembly / Town")}
        </label>
        <input
          type="text"
          value={businessForm.assembly}
          onChange={(e) => setBusinessForm({ ...businessForm, assembly: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Mylapore"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மாற்று தொலைபேசி", "Alt. Phone")}
        </label>
        <input
          type="tel"
          value={businessForm.phone2}
          onChange={(e) => setBusinessForm({ ...businessForm, phone2: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. 044-24941122"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("மின்னஞ்சல்", "Email")}
        </label>
        <input
          type="email"
          value={businessForm.email}
          onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. contact@murugantextiles.com"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வலைத்தளம்", "Website")}
        </label>
        <input
          type="url"
          value={businessForm.website}
          onChange={(e) => setBusinessForm({ ...businessForm, website: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. https://www.murugantextiles.com"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("அஞ்சல் குறியீடு (Pincode)", "Pincode")}
        </label>
        <input
          type="text"
          value={businessForm.pincode}
          onChange={(e) => setBusinessForm({ ...businessForm, pincode: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. 600004"
        />
      </div>
      <div className="md:col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வணிக விளக்கம்", "Business Description")}
        </label>
        <input
          type="text"
          value={businessForm.description}
          onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
          className="input-base text-xs"
          placeholder="e.g. Wholesaler and retailer of premium silk sarees and cotton garments."
        />
      </div>
      <div className="md:col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          {t("வணிக முகவரி *", "Business Address *")}
        </label>
        <textarea
          required
          value={businessForm.address}
          onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
          className="input-base text-xs min-h-[60px] py-2"
          placeholder="e.g. 5, Luz Church Road, Mylapore, Chennai"
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">

      {/* MEMBER DIRECTORY TITLE */}
      <section className="bg-card border-b border-border pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full text-left">
          <SectionLabel>
            {tab === "organizers"
              ? t("நிர்வாகிகள் பட்டியல்", "Organizers Directory")
              : tab === "businesses"
                ? t("வணிகர்கள் பட்டியல்", "Business Directory")
                : t("உறுப்பினர் பட்டியல்", "Members Directory")}
          </SectionLabel>
          <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {tab === "organizers"
              ? t("சங்க நிர்வாகிகள்", "Sangam Executive Organizers")
              : tab === "businesses"
                ? t("பதிவுசெய்யப்பட்ட வணிகங்கள்", "Registered Local Businesses")
                : t("பதிவுசெய்யப்பட்ட உறுப்பினர்கள்", "Registered Sangam Members")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-tamil max-w-xl leading-relaxed">
            {tab === "organizers"
              ? t("தமிழ்நாடு வணிகர்கள் சங்கத்தின் பொறுப்புள்ள மாநில, மாவட்ட மற்றும் வட்டார நிர்வாகிகள் பட்டியல்.", "Directory of State, District, and Assembly level executive organizers and office bearers.")
              : tab === "businesses"
                ? t("அதிகாரப்பூர்வமாக பதிவுசெய்யப்பட்ட வணிகங்கள், கடைகள் மற்றும் சேவை வழங்குநர்கள் பட்டியல்.", "Explore verified local shops, services, and wholesale businesses across Tamil Nadu.")
                : t("தமிழ்நாடு வணிகர்களுக்கான அதிகாரப்பூர்வ உறுப்பினர் கோப்பகம். உங்கள் விபரங்களை சரிபார்க்கவும்.", "Official directory of Tamil Nadu Sangam merchants. Search and verify registered memberships.")}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-3xl">
            <div className="bg-muted/40 backdrop-blur-xs rounded-md border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono truncate">
                  {t("உறுப்பினர்கள்", "General Members")}
                </div>
                <div className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {dbMembersCount !== null ? dbMembersCount.toLocaleString() : "290"}
                </div>
              </div>
            </div>

            <div className="bg-muted/40 backdrop-blur-xs rounded-md border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono truncate">
                  {t("நிர்வாகிகள்", "Official Organizers")}
                </div>
                <div className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {dbOrganizersCount !== null ? dbOrganizersCount.toLocaleString() : "7"}
                </div>
              </div>
            </div>

            <div className="bg-muted/40 backdrop-blur-xs rounded-md border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono truncate">
                  {t("வணிகர்கள்", "Listed Businesses")}
                </div>
                <div className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {dbBusinessesCount !== null ? dbBusinessesCount.toLocaleString() : "18,429"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBER SEARCH & LIST SECTION */}
      <Section className="py-12">
        <div className="w-full">
          {/* TAB BAR & DYNAMIC ADD BUTTON */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="bg-muted backdrop-blur-xs p-1.5 rounded-md inline-flex gap-1.5 border border-border max-w-full overflow-x-auto scrollbar-none">
              <button
                onClick={() => handleTabChange("members")}
                className={`px-4 sm:px-5 py-2.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${tab === "members"
                  ? "bg-card text-primary shadow-xs border border-border/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t("உறுப்பினர்கள்", "General Members")}</span>
              </button>
              <button
                onClick={() => handleTabChange("organizers")}
                className={`px-4 sm:px-5 py-2.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${tab === "organizers"
                  ? "bg-card text-primary shadow-xs border border-border/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t("நிர்வாகிகள்", "Official Organizers")}</span>
              </button>
              <button
                onClick={() => handleTabChange("businesses")}
                className={`px-4 sm:px-5 py-2.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${tab === "businesses"
                  ? "bg-card text-primary shadow-xs border border-border/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{t("வணிகர்கள்", "Business Directory")}</span>
              </button>
            </div>

            {tab === "businesses" ? (
              <Link
                to="/business/new"
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-5 rounded-md text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 border-none h-10 select-none shrink-0 no-underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("வணிகம் சேர்க்கை", "Add Business")}</span>
              </Link>
            ) : tab === "members" ? (
              <Link
                to="/membership"
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-5 rounded-md text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 border-none h-10 select-none shrink-0 no-underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("உறுப்பினர் சேர்க்கை", "Add Member")}</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-5 rounded-md text-xs transition duration-200 flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 border-none h-10 select-none shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("நிர்வாகி சேர்க்கை", "Add Organizer")}</span>
              </button>
            )}
          </div>

          {/* Search & Filter Form */}
          <div className="bg-card rounded-md border border-border p-6 shadow-xs mb-8">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 w-full space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                  {tab === "organizers"
                    ? t("நிர்வாகி தேடல்", "Search Organizers")
                    : tab === "businesses"
                      ? t("வணிக தேடல்", "Search Businesses")
                      : t("தேடல்", "Search Keyword")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={
                      tab === "organizers"
                        ? t("நிர்வாகி பெயர், பதவி மூலம் தேடுக...", "Search by name, role, ID...")
                        : tab === "businesses"
                          ? t("வணிகப் பெயர், வகை, முகவரி மூலம் தேடுக...", "Search by business name, category, address...")
                          : t("பெயர், EPIC ID, போன் மூலம் தேடுக...", "Search by name, ID, phone...")
                    }
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="input-base text-xs pl-12!"
                  />
                </div>
              </div>

              <div className="md:col-span-3 w-full space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                  {t("மாவட்டம்", "District")}
                </label>
                <input
                  type="text"
                  placeholder={t("எ.கா. Chennai", "e.g. Chennai")}
                  value={districtVal}
                  onChange={(e) => setDistrictVal(e.target.value)}
                  className="input-base text-xs"
                />
              </div>

              <div className="md:col-span-2 w-full space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
                  {t("தொகுதி", "Assembly")}
                </label>
                <input
                  type="text"
                  placeholder={t("எ.கா. Mylapore", "e.g. Mylapore")}
                  value={assemblyVal}
                  onChange={(e) => setAssemblyVal(e.target.value)}
                  className="input-base text-xs"
                />
              </div>

              <div className="md:col-span-2 flex gap-2 w-full shrink-0">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-md text-xs transition active:scale-95 shadow-xs cursor-pointer min-h-[44px] border-none"
                >
                  {t("தேடுக", "Filter")}
                </button>
                {(search || district || assembly) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-muted hover:bg-muted text-muted-foreground font-bold py-3 px-4 rounded-md text-xs transition cursor-pointer border border-border min-h-[44px]"
                  >
                    {t("ரத்து", "Reset")}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Status Messages */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm font-semibold">
                {tab === "organizers"
                  ? t("நிர்வாகிகள் விபரம் ஏற்றப்படுகிறது...", "Loading organizers profiles...")
                  : tab === "businesses"
                    ? t("வணிகங்கள் விபரம் ஏற்றப்படுகிறது...", "Loading businesses profiles...")
                    : t("உறுப்பினர்கள் விபரம் ஏற்றப்படுகிறது...", "Loading member profiles...")}
              </p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-card border border-border rounded-md p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t("பிழை ஏற்பட்டது", "Load Failure")}
              </h3>
              <p className="text-xs text-rose-600 mt-2 leading-relaxed max-w-xs mx-auto">
                {error}
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 bg-muted hover:bg-muted border border-border text-foreground px-5 py-2.5 rounded-md text-xs font-semibold cursor-pointer shadow-xs hover:shadow-xs active:scale-[0.98] transition-all"
              >
                {t("மீண்டும் முயற்சிக்கவும்", "Reset Search & Retry")}
              </button>
            </div>
          ) : (
            (tab === "members" && members.length === 0) ||
            (tab === "organizers" && organizers.length === 0) ||
            (tab === "businesses" && isSearchActive && businesses.length === 0)
          ) ? (
            <div className="max-w-md mx-auto bg-card border border-border rounded-md p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-4 border border-border">
                {tab === "organizers" ? (
                  <Shield className="w-5 h-5" />
                ) : tab === "businesses" ? (
                  <Building2 className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <h3 className="text-base font-bold text-foreground">
                {tab === "organizers"
                  ? t("நிர்வாகிகள் யாரும் இல்லை", "No Organizers Found")
                  : tab === "businesses"
                    ? t("வணிகங்கள் எதுவும் இல்லை", "No Businesses Found")
                    : t("உறுப்பினர்கள் யாரும் இல்லை", "No Members Found")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto font-tamil">
                {t("வழங்கப்பட்ட தேடல் நிபந்தனைகளுக்குப் பொருந்தும் முடிவுகள் எதுவும் இல்லை.", "No matching records found. Try adjusting your search keyword or filters.")}
              </p>
              {(search || district || assembly) && (
                <button
                  onClick={clearFilters}
                  className="mt-5 bg-muted hover:bg-muted border border-border text-foreground px-5 py-2.5 rounded-md text-xs font-semibold cursor-pointer shadow-xs hover:shadow-xs active:scale-[0.98] transition-all"
                >
                  {t("வடிப்பான்களை நீக்கவும்", "Clear Search Filters")}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Members tab rendering */}
              {tab === "members" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 relative group overflow-hidden"
                    >
                      {/* Subtle golden/blue glow blur element */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-x-1/4 -translate-y-1/4 pointer-events-none group-hover:bg-primary/10 transition duration-500" />

                      {/* Status Pill in top right */}
                      <div className="absolute top-5 right-5">
                        <StatusPill status="active" label="ACTIVE" />
                      </div>

                      <div className="space-y-4 relative z-1">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-50 shrink-0 relative flex items-center justify-center shadow-sm">
                            {member.selfie ? (
                              <img
                                src={member.selfie}
                                alt={member.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-bold text-sm">
                                {member.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 text-left">
                            <h3 className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-primary transition-colors">{member.name}</h3>
                            <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 font-mono text-[9px] font-bold text-amber-700 tracking-wider shadow-xs">
                              ID: {member.epic}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-200 pt-4 text-xs">
                          {member.shop && (
                            <div className="bg-slate-50/50 p-2 rounded-md border border-slate-100 text-left flex justify-between items-center min-h-[28px]">
                              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                                <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {t("கடை", "Shop")}
                              </span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px] text-right">{member.shop}</span>
                            </div>
                          )}

                          <div className="bg-slate-50/50 p-2 rounded-md border border-slate-100 text-left flex justify-between items-center min-h-[28px]">
                            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {t("கைபேசி", "Mobile")}
                            </span>
                            <span className="font-mono text-slate-700 font-semibold text-right">{member.mobile}</span>
                          </div>

                          {(member.assembly || member.district) && (
                            <div className="bg-slate-50/50 p-2 rounded-md border border-slate-100 text-left flex justify-between items-center min-h-[28px]">
                              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {t("வட்டாரம்", "Location")}
                              </span>
                              <span className="font-bold text-slate-800 text-right truncate max-w-[150px]">
                                {[member.assembly, member.district].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          )}

                          {member.bloodGroup && (
                            <div className="bg-slate-50/50 p-2 rounded-md border border-slate-100 text-left flex justify-between items-center min-h-[28px]">
                              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                {t("இரத்த வகை", "Blood Group")}
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-600 font-mono">
                                {member.bloodGroup}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-200 pt-4 flex gap-2 relative z-1">
                        <Link
                          to="/voter-id"
                          search={{ epic: member.epic }}
                          className="flex-1 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-600 font-bold py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] no-underline"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{t("அட்டை காண்க", "View ID Card")}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Organizers tab rendering */}
              {tab === "organizers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {organizers.slice((page - 1) * limit, page * limit).map((org) => {
                    const isStateLevel = org.role && (
                      org.role.toLowerCase().includes("state") ||
                      org.role.toLowerCase().includes("president") ||
                      org.role.toLowerCase().includes("leader") ||
                      org.role.toLowerCase().includes("secretary") ||
                      org.role.toLowerCase().includes("coordinator") ||
                      org.role.toLowerCase().includes("treasurer")
                    );

                    return (
                      <div
                        key={org.id}
                        className="bg-card border border-border rounded-md p-6 hover:shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 relative group"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full overflow-hidden border-2 bg-muted shrink-0 relative flex items-center justify-center shadow-xs transition-colors duration-300 ${isStateLevel ? "border-amber-400 bg-amber-50" : "border-primary bg-primary/5"
                              }`}>
                              <ShieldCheck className={`w-6 h-6 ${isStateLevel ? "text-amber-600" : "text-primary"}`} />
                            </div>
                            <div className="min-w-0 text-left">
                              <h3 className="font-bold text-foreground text-sm truncate leading-tight group-hover:text-primary transition-colors">{org.name}</h3>
                              <div className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${isStateLevel
                                ? "bg-amber-50/80 border border-amber-200 text-amber-700"
                                : "bg-primary/5 border border-primary/20 text-primary"
                                }`}>
                                {org.role || t("நிர்வாகி", "Organizer")}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-border pt-4 text-xs">
                            <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                              <span className="text-muted-foreground flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                {t("நிர்வாகி ஐடி", "Organizer ID")}
                              </span>
                              <span className="font-mono text-foreground text-right">{org.organizer_code}</span>
                            </div>

                            <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                              <span className="text-muted-foreground flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                {t("கைபேசி", "Mobile")}
                              </span>
                              <span className="font-mono text-foreground text-right">{org.mobile}</span>
                            </div>

                            {org.email && (
                              <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  {t("மின்னஞ்சல்", "Email")}
                                </span>
                                <span className="text-foreground truncate max-w-[150px] text-right">{org.email}</span>
                              </div>
                            )}

                            {(org.assembly || org.district) && (
                              <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  {t("வட்டாரம்", "Location")}
                                </span>
                                <span className="font-bold text-foreground text-right truncate max-w-[150px]">
                                  {[org.assembly, org.district].filter(Boolean).join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 border-t border-border pt-4 flex gap-2">
                          <a
                            href={`tel:${org.mobile}`}
                            className="flex-1 bg-muted/80 hover:bg-primary hover:text-white border border-border hover:border-primary text-muted-foreground font-bold py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 transition-all duration-205 cursor-pointer shadow-xs active:scale-[0.98]"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{t("அழைக்க", "Call Organizer")}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Businesses tab rendering */}
              {tab === "businesses" && (
                <>
                  {/* Step 1: Categories View */}
                  {!currentCategory && !isSearchActive && (
                    <div className="w-full text-left">
                      <div className="mb-6">
                        <h3 className="font-display font-extrabold text-base md:text-lg text-foreground uppercase tracking-wider">
                          {t("வகை வாரியாக வணிகங்கள்", "Browse Businesses by Category")}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 font-tamil">
                          {t("கீழே உள்ள ஏதேனும் ஒரு பிரிவைத் தேர்வு செய்து ஆராயுங்கள்.", "Select a business category below to begin exploring.")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {Object.keys(SUBCATEGORY_MAPPING).map((catName) => {
                          const meta = CATEGORY_META[catName] || { icon: "🏪", color: "from-primary to-blue-700" };
                          return (
                            <button
                              key={catName}
                              type="button"
                              onClick={() => {
                                navigate({
                                  search: (prev) => ({
                                    ...prev,
                                    category: catName,
                                    subCategory: undefined,
                                    page: 1,
                                  }),
                                });
                              }}
                              className="bg-card hover:bg-muted/30 border border-border hover:border-primary/30 rounded-md p-5 text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98 hover:-translate-y-0.5 flex flex-col items-center justify-center min-h-[120px] group relative overflow-hidden"
                            >
                              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">{meta.icon}</span>
                              <span className="text-xs font-bold text-foreground leading-tight tracking-tight">{catName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Subcategories View */}
                  {currentCategory && !currentSubCategory && !isSearchActive && (() => {
                    const subcats = SUBCATEGORY_MAPPING[currentCategory] || [];
                    return (
                      <div className="w-full text-left">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                              <span
                                className="cursor-pointer hover:text-primary transition-colors"
                                onClick={() => navigate({ search: (prev) => ({ ...prev, category: undefined, subCategory: undefined, page: 1 }) })}
                              >
                                {t("வணிகங்கள்", "Businesses")}
                              </span>
                              <span>/</span>
                              <span className="font-bold text-foreground">{currentCategory}</span>
                            </div>
                            <h3 className="font-display font-extrabold text-base md:text-lg text-foreground mt-1.5 uppercase tracking-wider">
                              {t("துணைப் பிரிவுகள்", "Select Subcategory")}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigate({
                                search: (prev) => ({
                                  ...prev,
                                  category: undefined,
                                  subCategory: undefined,
                                  page: 1,
                                }),
                              });
                            }}
                            className="px-4 py-2 border border-border hover:border-primary bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary font-bold rounded-md text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 min-h-[38px]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>{t("வகை வாரியாக", "Back to Categories")}</span>
                          </button>
                        </div>

                        {subcats.length === 0 ? (
                          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-md bg-card shadow-2xs font-semibold">
                            {t("துணைப் பிரிவுகள் எதுவும் இல்லை.", "No subcategories available for this category.")}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {subcats.map((subcatName) => (
                              <button
                                key={subcatName}
                                type="button"
                                onClick={() => {
                                  navigate({
                                    search: (prev) => ({
                                      ...prev,
                                      subCategory: subcatName,
                                      page: 1,
                                    }),
                                  });
                                }}
                                className="bg-card hover:bg-muted/30 border border-border hover:border-primary/30 rounded-md p-4 text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98 hover:-translate-y-0.5 flex items-center justify-between group min-h-[60px]"
                              >
                                <span className="text-xs font-bold text-foreground pr-3 group-hover:text-primary transition-colors">{subcatName}</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Step 3: Final Businesses List View */}
                  {(isSearchActive || (currentCategory && currentSubCategory)) && (
                    <div className="w-full text-left">
                      {/* Breadcrumbs for browsing layout */}
                      {!isSearchActive && (
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                              <span
                                className="cursor-pointer hover:text-primary transition-colors"
                                onClick={() => navigate({ search: (prev) => ({ ...prev, category: undefined, subCategory: undefined, page: 1 }) })}
                              >
                                {t("வணிகங்கள்", "Businesses")}
                              </span>
                              <span>/</span>
                              <span
                                className="cursor-pointer hover:text-primary transition-colors"
                                onClick={() => navigate({ search: (prev) => ({ ...prev, subCategory: undefined, page: 1 }) })}
                              >
                                {currentCategory}
                              </span>
                              <span>/</span>
                              <span className="font-bold text-foreground">{currentSubCategory}</span>
                            </div>
                            <h3 className="font-display font-extrabold text-base md:text-lg text-foreground mt-1.5 uppercase tracking-wider">
                              {currentSubCategory}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigate({
                                search: (prev) => ({
                                  ...prev,
                                  subCategory: undefined,
                                  page: 1,
                                }),
                              });
                            }}
                            className="px-4 py-2 border border-border hover:border-primary bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary font-bold rounded-md text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 min-h-[38px]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>{t("துணைப் பிரிவு வாரியாக", "Back to Subcategories")}</span>
                          </button>
                        </div>
                      )}

                      {businesses.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-md bg-card shadow-2xs font-semibold">
                          {t("வணிகங்கள் எதுவும் இல்லை.", "No businesses registered under this subcategory.")}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {businesses.map((biz) => {
                            const defaultImg = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=75&fit=crop&auto=format";
                            const bizImg = biz.imageUrl || biz.image || biz.img || biz.coverImage || defaultImg;
                            return (
                              <div
                                key={biz._id}
                                className="bg-card border border-border rounded-md p-6 hover:shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 relative group overflow-hidden"
                              >
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0 relative flex items-center justify-center shadow-xs">
                                      <img
                                        src={bizImg}
                                        alt={biz.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = defaultImg;
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <div className="flex items-center gap-1.5 max-w-full">
                                        <h3 className="font-bold text-foreground text-sm truncate leading-tight group-hover:text-primary transition-colors">{biz.name}</h3>
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                                      </div>
                                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-muted border border-border font-mono text-[9px] font-bold text-muted-foreground tracking-wider">
                                        {biz.listingCode || `ID: ${biz._id.slice(-6).toUpperCase()}`}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2 border-t border-border pt-4 text-xs">
                                    {biz.category && (
                                      <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                          {t("வகை", "Category")}
                                        </span>
                                        <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md text-[10px] truncate max-w-[150px] text-right">
                                          {biz.subCategory || biz.category}
                                        </span>
                                      </div>
                                    )}

                                    {biz.phone && (
                                      <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                          {t("கைபேசி", "Phone")}
                                        </span>
                                        <span className="font-mono text-foreground text-right">{biz.phone}</span>
                                      </div>
                                    )}

                                    {(biz.city || biz.district) && (
                                      <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                                        <span className="text-slate-405 flex items-center gap-1.5">
                                          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                          {t("நகரம்", "Location")}
                                        </span>
                                        <span className="font-bold text-foreground text-right truncate max-w-[150px]">
                                          {[biz.city, biz.district].filter(Boolean).join(", ")}
                                        </span>
                                      </div>
                                    )}

                                    {biz.avgRating !== undefined && biz.avgRating > 0 && (
                                      <div className="bg-muted/40 p-2 rounded-md border border-border/80 flex justify-between items-center min-h-[28px] text-left">
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                          {t("மதிப்பீடு", "Rating")}
                                        </span>
                                        <span className="font-bold text-foreground text-right">
                                          {biz.avgRating.toFixed(1)} ★ ({biz.reviewCount || 0})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-6 border-t border-border pt-4 flex gap-2">
                                  <Link
                                    to="/business/$id"
                                    params={{ id: biz._id }}
                                    className="flex-1 bg-muted/80 hover:bg-primary hover:text-white border border-border hover:border-primary text-muted-foreground font-bold py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]"
                                  >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>{t("விவரங்கள் காண்க", "View Details")}</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (isSearchActive || (currentCategory && currentSubCategory)) && (
                <div className="flex items-center justify-center gap-1.5 font-mono text-xs mt-8">
                  <button
                    disabled={page <= 1}
                    onClick={() => navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })}
                    className="p-2 border border-border bg-card rounded-sm hover:bg-muted transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers(page, totalPages).map((pNum, idx) => {
                    if (pNum === "...") {
                      return (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground font-bold font-sans">
                          ...
                        </span>
                      );
                    }
                    const active = pNum === page;
                    return (
                      <button
                        key={pNum}
                        onClick={() => navigate({ search: (prev) => ({ ...prev, page: pNum as number }) })}
                        className={`w-9 h-9 rounded-sm border text-center font-bold transition cursor-pointer ${active
                          ? "bg-primary border-primary text-white"
                          : "bg-card border-border hover:bg-muted text-foreground"
                          }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })}
                    className="p-2 border border-border bg-card rounded-sm hover:bg-muted transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Section>
      {/* Create Modal Overlay */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-100 bg-black/40 backdrop-blur-xs grid place-items-center p-4 overflow-y-auto">
          <div className="bg-card rounded-md border border-border w-full max-w-2xl shadow-xl overflow-hidden animate-scaleIn my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border bg-muted/40">
              <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                {tab === "organizers"
                  ? t("புதிய நிர்வாகியை சேர்க்க", "Register New Organizer")
                  : tab === "businesses"
                    ? t("புதிய வணிகத்தை சேர்க்க", "Register New Business")
                    : t("புதிய உறுப்பினரை சேர்க்க", "Register New Member")}
              </h3>
              <button
                onClick={closeCreateModal}
                className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5 text-left max-h-[70vh] overflow-y-auto">
              {tab === "members" && renderMemberForm()}
              {tab === "organizers" && renderOrganizerForm()}
              {tab === "businesses" && renderBusinessForm()}

              {formError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-5 py-2.5 bg-muted hover:bg-muted text-muted-foreground font-bold rounded text-xs transition cursor-pointer border border-border"
                >
                  {t("ரத்து", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded text-xs transition cursor-pointer border-none flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t("சேமிக்கப்படுகிறது...", "Saving...")}</span>
                    </>
                  ) : (
                    <span>{t("சேமி", "Save & Add")}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
