import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Search, Shield, Phone, Mail,
  Loader2, AlertCircle, MapPin
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const searchSchema = z.object({
  search:      z.string().optional(),
  district:    z.string().optional(),
  assembly:    z.string().optional(),
});

export const Route = createFileRoute("/organizer")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "நிர்வாகிகள் பட்டியல் — Organizers Directory · TNVS" },
      { name: "description", content: "View executive organizers and office bearers of Tamil Nadu Vanigargalin Sangamam." },
    ],
  }),
  component: OrganizerPage,
});

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

function OrganizerPage() {
  const { t, language } = useLanguage();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const search = searchParams.search || "";
  const district = searchParams.district || "";
  const assembly = searchParams.assembly || "";

  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (district) query.append("district", district);
    if (assembly) query.append("assembly", assembly);

    fetch(`/api/public/organizer?${query.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text() || "Failed to fetch organizers");
        }
        return res.json();
      })
      .then((data) => {
        if (active) {
          setOrganizers(data.organizers || []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [search, district, assembly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchVal || undefined,
        district: districtVal || undefined,
        assembly: assemblyVal || undefined,
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

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full text-left">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#009245]/10 text-[#009245] border border-[#009245]/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-[4px] mb-3">
            {t("சங்க நிர்வாகிகள்", "TNVS ORGANIZERS")}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            {t("நிர்வாகிகள் பட்டியல்", "Official Organizers Directory")}
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            {t(
              "தமிழ்நாடு வணிகர்களின் சங்கத்தின் பொறுப்புள்ள மாநில, மாவட்ட மற்றும் வட்டார நிர்வாகிகள் பட்டியல்.",
              "Directory of State, District and Assembly level executive organizers and office bearers."
            )}
          </p>
        </div>

        {/* Search & Filter Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xxs mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {t("தேடல்", "Search Keyword")}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("பெயர், பதவி அல்லது பொறுப்பு மூலம் தேடுக...", "Search by name, role, title...")}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#009245] transition-all"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {t("மாவட்டம்", "District")}
              </label>
              <input
                type="text"
                placeholder={t("எ.கா. Chennai", "e.g. Chennai")}
                value={districtVal}
                onChange={(e) => setDistrictVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#009245] transition-all"
              />
            </div>

            <div className="w-full md:w-48 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {t("தொகுதி", "Assembly")}
              </label>
              <input
                type="text"
                placeholder={t("எ.கா. Saidapet", "e.g. Saidapet")}
                value={assemblyVal}
                onChange={(e) => setAssemblyVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#009245] transition-all"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <button
                type="submit"
                className="flex-1 md:flex-none bg-[#009245] hover:bg-[#007a38] text-white font-bold py-2.5 px-6 rounded-2xl text-sm transition cursor-pointer"
              >
                {t("தேடுக", "Filter")}
              </button>
              {(search || district || assembly) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-605 font-bold py-2.5 px-4 rounded-2xl text-sm transition cursor-pointer border border-slate-200"
                >
                  {t("ரத்து", "Reset")}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Status Messages */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 text-[#009245] animate-spin mb-4" />
            <p className="text-sm font-semibold">{t("நிர்வாகிகள் விபரம் ஏற்றப்படுகிறது...", "Loading organizers profiles...")}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-rose-500 bg-rose-50 rounded-3xl border border-rose-200 p-6">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-bold">{t("பிழை ஏற்பட்டது", "An error occurred")}</p>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
        ) : organizers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 p-6 text-center">
            <Shield className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">{t("நிர்வாகிகள் யாரும் இல்லை", "No Organizers Found")}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {t("வழங்கப்பட்ட தேடல் நிபந்தனைகளுக்குப் பொருந்தும் நிர்வாகிகள் யாரும் இல்லை.", "Try adjusting your search criteria or filters.")}
            </p>
          </div>
        ) : (
          /* Grid Container */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizers.map((org) => (
              <div
                key={org.id}
                className="bg-white border border-slate-200 hover:border-[#009245]/30 rounded-3xl p-6 hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-505 bg-amber-50 flex items-center justify-center text-amber-600 font-bold shrink-0">
                      <Shield className="w-6 h-6 text-[#009245]" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{org.name}</h3>
                      <div className="inline-block bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md mt-1">
                        {org.role || t("நிர்வாகி", "Coordinator")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3.5 text-xs text-left">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-slate-400 shrink-0">{t("நிர்வாகி ஐடி", "Organizer ID")}</span>
                      <span className="font-mono font-bold text-slate-700 truncate">{org.organizer_code}</span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="text-slate-400 shrink-0">{t("கைபேசி", "Mobile")}</span>
                      <span className="font-mono text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {org.mobile}
                      </span>
                    </div>

                    {org.email && (
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-400 shrink-0">{t("மின்னஞ்சல்", "Email")}</span>
                        <span className="text-slate-700 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {org.email}
                        </span>
                      </div>
                    )}

                    {(org.assembly || org.district) && (
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-slate-400 shrink-0">{t("வட்டாரம்", "Location")}</span>
                        <span className="font-bold text-slate-700 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <span>{[org.assembly, org.district].filter(Boolean).join(", ")}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
