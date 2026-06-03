import { 
  Sparkles, Calculator, HeartPulse, Scale, Sprout, Cpu, Wrench, HardHat,
  Award, Rocket, Megaphone, Truck, Factory, Home, Pill, GraduationCap,
  Globe, UserCheck, Store, Landmark, Map, Utensils, Compass, Trophy,
  Anchor, Trees, Tv, Printer, Smartphone, Shirt, Coins, ShoppingBag,
  Bed, Dumbbell, type LucideIcon
} from "lucide-react";

export type Wing = {
  id: string;
  nameTa: string;
  nameEn: string;
  icon: LucideIcon;
  descriptionTa: string;
  descriptionEn: string;
};

export const WINGS: Wing[] = [
  {
    id: "women-entrepreneurs",
    nameTa: "மகளிர் - தொழில்முனைவோர் பிரிவு",
    nameEn: "Women Entrepreneurs Wing",
    icon: Sparkles,
    descriptionTa: "மகளிர் சுயஉதவிக் குழுக்கள் மற்றும் பெண் தொழில்முனைவோருக்கான சிறப்புப் பிரிவு.",
    descriptionEn: "Dedicated wing for women-led businesses, home industries, and startups."
  },
  {
    id: "chartered-accountants",
    nameTa: "பட்டய கணக்காளர்கள் பிரிவு",
    nameEn: "Chartered Accountants Wing",
    icon: Calculator,
    descriptionTa: "நிதி, வரி மற்றும் தணிக்கை ஆலோசனைகளை வணிகர்களுக்கு வழங்கும் பிரிவு.",
    descriptionEn: "Financial advisors, tax experts, and accountants supporting trader compliance."
  },
  {
    id: "doctors",
    nameTa: "மருத்துவர் பிரிவு",
    nameEn: "Doctors Wing",
    icon: HeartPulse,
    descriptionTa: "தனியார் கிளினிக்குகள், மருத்துவமனைகள் மற்றும் சுகாதாரத் துறை சார்ந்தவர்களின் பிரிவு.",
    descriptionEn: "Medical practitioners, clinics, and health care service providers."
  },
  {
    id: "lawyers",
    nameTa: "வழக்கறிஞர் பிரிவு",
    nameEn: "Lawyers Wing",
    icon: Scale,
    descriptionTa: "வியாபாரிகளுக்கு சட்ட ஆலோசனைகள் மற்றும் வழக்குகளில் உதவும் சட்டப் பிரிவு.",
    descriptionEn: "Legal advocates providing dispute resolution, contract guidance, and protection."
  },
  {
    id: "agriculture",
    nameTa: "விவசாய பிரிவு",
    nameEn: "Agriculture Wing",
    icon: Sprout,
    descriptionTa: "விவசாயிகள், இயற்கை விவசாய உற்பத்தியாளர்கள் மற்றும் உழவர் சந்தை வணிகர்களின் பிரிவு.",
    descriptionEn: "Farmers, agro-traders, organic producers, and nursery owners."
  },
  {
    id: "information-technology",
    nameTa: "தகவல் தொழில்நுட்ப பிரிவு",
    nameEn: "Information Technology Wing",
    icon: Cpu,
    descriptionTa: "மென்பொருள், இணையதள வடிவமைப்பு மற்றும் டிஜிட்டல் தொழில்நுட்ப நிறுவனங்களின் பிரிவு.",
    descriptionEn: "Software developers, tech startups, and digital service agencies."
  },
  {
    id: "engineers",
    nameTa: "பொறியாளர் பிரிவு",
    nameEn: "Engineers Wing",
    icon: Wrench,
    descriptionTa: "கட்டுமானப் பொறியாளர்கள், ஆலோசகர்கள் மற்றும் திட்ட வடிவமைப்பாளர்களின் பிரிவு.",
    descriptionEn: "Civil, electrical, and mechanical consulting engineers and contractors."
  },
  {
    id: "labour",
    nameTa: "தொழிலாளர் பிரிவு",
    nameEn: "Labour Wing",
    icon: HardHat,
    descriptionTa: "கடை மற்றும் நிறுவனங்களின் தொழிலாளர்களின் உரிமைகள் மற்றும் நலனுக்கான பிரிவு.",
    descriptionEn: "Advocating for worker welfare, safety, and retail employee support."
  },
  {
    id: "differently-abled",
    nameTa: "மாற்றுத்திறனாளிகள் பிரிவு",
    nameEn: "Differently Abled Wing",
    icon: Award,
    descriptionTa: "மாற்றுத்திறனாளி தொழில்முனைவோரின் வாழ்வாதாரத்தை மேம்படுத்தும் சிறப்புப் பிரிவு.",
    descriptionEn: "Specially-abled entrepreneurs and accessible trade promotion."
  },
  {
    id: "young-entrepreneurs",
    nameTa: "இளைய தொழில் முனைவோர் பிரிவு",
    nameEn: "Young Entrepreneurs Wing",
    icon: Rocket,
    descriptionTa: "இளைய தலைமுறை வியாபாரிகள் மற்றும் புதிய ஸ்டார்ட்-அப் நிறுவனங்களின் பிரிவு.",
    descriptionEn: "Next-gen business leaders, youth startups, and innovation network."
  },
  {
    id: "media-relations",
    nameTa: "செய்தி தொடர்பாளர் பிரிவு",
    nameEn: "Media & PR Wing",
    icon: Megaphone,
    descriptionTa: "சங்கத்தின் செய்திகள், பத்திரிக்கை மற்றும் ஊடக உறவுகளை நிர்வகிக்கும் பிரிவு.",
    descriptionEn: "Press relations, newsletter publishing, and public communication."
  },
  {
    id: "distributors",
    nameTa: "விநியோகஸ்தர் பிரிவு",
    nameEn: "Distributors Wing",
    icon: Truck,
    descriptionTa: "FMCG, மொத்த விநியோகஸ்தர்கள் மற்றும் லோஜிஸ்டிக்ஸ் வணிகர்களின் பிரிவு.",
    descriptionEn: "FMCG, bulk dealers, wholesale distributors, and supply chain partners."
  },
  {
    id: "manufacturers",
    nameTa: "உற்பத்தியாளர் பிரிவு",
    nameEn: "Manufacturers Wing",
    icon: Factory,
    descriptionTa: "சிறு, குறு மற்றும் நடுத்தர உற்பத்தி தொழிற்சாலைகளின் உரிமையாளர்கள் பிரிவு.",
    descriptionEn: "Micro, small, and medium scale manufacturing enterprises (MSMEs)."
  },
  {
    id: "cottage-industry",
    nameTa: "மனைத்தொழில் பிரிவு",
    nameEn: "Cottage & Home Business Wing",
    icon: Home,
    descriptionTa: "வீட்டுத் தயாரிப்புகள், கைவினைப் பொருட்கள் மற்றும் குடிசைத் தொழில்முனைவோர் பிரிவு.",
    descriptionEn: "Handicrafts, home-made products, and cottage scale entrepreneurs."
  },
  {
    id: "pharmacists",
    nameTa: "மருந்தாளுனர் & மருந்து வணிகப் பிரிவு",
    nameEn: "Pharmacists & Druggists Wing",
    icon: Pill,
    descriptionTa: "மருந்துக்கடைகள், மொத்த மருந்து விநியோகஸ்தர்கள் மற்றும் மருந்தாளுனர்கள் பிரிவு.",
    descriptionEn: "Retail pharmacies, chemists, and wholesale pharmaceutical distributors."
  },
  {
    id: "educators",
    nameTa: "கல்வியாளர் பிரிவு",
    nameEn: "Educators Wing",
    icon: GraduationCap,
    descriptionTa: "தனியார் பள்ளிகள், பயிற்சி மையங்கள் மற்றும் கல்வி நிறுவனங்களின் உரிமையாளர்கள் பிரிவு.",
    descriptionEn: "Coaching centers, private schools, academies, and skills institutes."
  },
  {
    id: "import-export",
    nameTa: "இறக்குமதி / ஏற்றுமதி வணிக பிரிவு",
    nameEn: "Import / Export Wing",
    icon: Globe,
    descriptionTa: "சர்வதேச வணிகம், சுங்க அனுமதி மற்றும் ஏற்றுமதி இறக்குமதி வர்த்தகர்களின் பிரிவு.",
    descriptionEn: "Global trade, custom clearance agents, and import-export merchants."
  },
  {
    id: "transgender-entrepreneurs",
    nameTa: "மூன்றாம் பாலினத்தவர் தொழில் முனைவோர் பிரிவு",
    nameEn: "Transgender Entrepreneurs Wing",
    icon: UserCheck,
    descriptionTa: "திருநங்கையர் மற்றும் மூன்றாம் பாலினத்தவர் தொழில்முனைவோருக்கான வாழ்வாதாரப் பிரிவு.",
    descriptionEn: "Empowering transgender small business owners and micro-startups."
  },
  {
    id: "shop-owners",
    nameTa: "கடை உரிமையாளர் பிரிவு",
    nameEn: "Shop Owners Wing",
    icon: Store,
    descriptionTa: "அனைத்து வகையான சில்லறை மற்றும் மொத்த விற்பனை கடைகளின் உரிமையாளர்கள் பிரிவு.",
    descriptionEn: "General retailers, supermarkets, and brick-and-mortar storefronts."
  },
  {
    id: "central-govt-relations",
    nameTa: "மத்திய அரசு உறவுப் பிரிவு",
    nameEn: "Central Govt Relations Wing",
    icon: Landmark,
    descriptionTa: "மத்திய அரசு திட்டங்கள், வரி விதிப்பு மற்றும் சட்ட விவாதங்களை ஒருங்கிணைக்கும் பிரிவு.",
    descriptionEn: "Liaison with GST council, central trade ministries, and regulatory bodies."
  },
  {
    id: "state-govt-relations",
    nameTa: "மாநில அரசு உறவுப் பிரிவு",
    nameEn: "State Govt Relations Wing",
    icon: Map,
    descriptionTa: "மாநில அரசு உரிமங்கள், உள்ளாட்சி அமைப்புகள் மற்றும் மானியங்களை ஒருங்கிணைக்கும் பிரிவு.",
    descriptionEn: "Liaison with state department, municipal corporations, and local authorities."
  },
  {
    id: "restaurant-owners",
    nameTa: "உணவக உரிமையாளர் பிரிவு",
    nameEn: "Restaurant Owners Wing",
    icon: Utensils,
    descriptionTa: "உணவகங்கள், ஹோட்டல்கள், பேக்கரிகள் மற்றும் உணவு விநியோக நிறுவனங்களின் பிரிவு.",
    descriptionEn: "Restaurants, eateries, bakeries, caterers, and food court operators."
  },
  {
    id: "tourism-transport",
    nameTa: "சுற்றுலா மற்றும் போக்குவரத்து வணிக பிரிவு",
    nameEn: "Tourism & Transport Wing",
    icon: Compass,
    descriptionTa: "டிராவல் ஏஜென்சிகள், வாடகை வாகனங்கள் மற்றும் சுற்றுலா மேம்பாட்டு வர்த்தகர்கள் பிரிவு.",
    descriptionEn: "Travel agencies, fleet operators, logistics, and tourism promoters."
  },
  {
    id: "sports-business",
    nameTa: "விளையாட்டு & விளையாட்டு வணிகப் பிரிவு",
    nameEn: "Sports & Fitness Business Wing",
    icon: Trophy,
    descriptionTa: "விளையாட்டு உபகரணங்கள் விற்பனையாளர்கள் மற்றும் விளையாட்டுக்கூட உரிமையாளர்கள் பிரிவு.",
    descriptionEn: "Sports gear shops, academies, turf operators, and events organizers."
  },
  {
    id: "marine-business",
    nameTa: "கடல் சார்ந்த வணிகப் பிரிவு",
    nameEn: "Marine & Seafood Business Wing",
    icon: Anchor,
    descriptionTa: "மீன்பிடி உபகரணங்கள், கடல் உணவு ஏற்றுமதி மற்றும் கடற்கரை வர்த்தகர்கள் பிரிவு.",
    descriptionEn: "Seafood exporters, fisheries, cold chains, and maritime logistics."
  },
  {
    id: "tribal-entrepreneurs",
    nameTa: "பழங்குடியினர் - தொழில்முனைவோர் பிரிவு",
    nameEn: "Tribal Entrepreneurs Wing",
    icon: Trees,
    descriptionTa: "மலைவாழ் மற்றும் பழங்குடியின மக்களின் பாரம்பரிய தயாரிப்புகள் மற்றும் வணிக மேம்பாட்டுப் பிரிவு.",
    descriptionEn: "Promoting forest produce, tribal arts, crafts, and micro-enterprises."
  },
  {
    id: "digital-advertisers",
    nameTa: "டிஜிட்டல் விளம்பரதாரர் பிரிவு",
    nameEn: "Digital Advertisers Wing",
    icon: Tv,
    descriptionTa: "டிஜிட்டல் விளம்பரப் பலகைகள், சமூக ஊடக விளம்பரங்கள் மற்றும் வடிவமைப்பு நிறுவனங்கள் பிரிவு.",
    descriptionEn: "Digital signage operators, social media marketers, and creative ad agencies."
  },
  {
    id: "printing-press",
    nameTa: "அச்சக தொழில் பிரிவு",
    nameEn: "Printing Press Wing",
    icon: Printer,
    descriptionTa: "அச்சக உரிமையாளர்கள், பத்திரிகை அச்சடிப்பாளர்கள் மற்றும் பேக்கேஜிங் வடிவமைப்பு பிரிவு.",
    descriptionEn: "Offset printers, flex board makers, and book binding industries."
  },
  {
    id: "computer-mobile",
    nameTa: "கணினி மற்றும் அலைபேசி தொழில் பிரிவு",
    nameEn: "Computer & Mobile Industry Wing",
    icon: Smartphone,
    descriptionTa: "கணினி, அலைபேசி விற்பனை மற்றும் பழுதுநீக்கும் சேவை மையங்களின் பிரிவு.",
    descriptionEn: "Computer hardware shops, mobile showrooms, and service centers."
  },
  {
    id: "weavers",
    nameTa: "நெசவாளர் வணிக பிரிவு",
    nameEn: "Weavers Wing",
    icon: Shirt,
    descriptionTa: "கைத்தறி, விசைத்தறி நெசவாளர்கள் மற்றும் ஜவுளி வியாபாரிகளின் பிரிவு.",
    descriptionEn: "Handloom weavers, powerloom factories, and textile retail traders."
  },
  {
    id: "insurance-finance",
    nameTa: "காப்பீடு, நிதி மற்றும் சீட்டு தொழில்முனைவோர் பிரிவு",
    nameEn: "Insurance, Finance & Chit Fund Wing",
    icon: Coins,
    descriptionTa: "நிதி நிறுவனங்கள், காப்பீட்டு முகவர்கள் மற்றும் பதிவுசெய்யப்பட்ட சீட்டு நிறுவனங்களின் பிரிவு.",
    descriptionEn: "Chit fund operators, gold loans, insurance advisors, and micro-finance."
  },
  {
    id: "street-vendors",
    nameTa: "சாலையோர வியாபாரிகள் பிரிவு",
    nameEn: "Street Vendors Wing",
    icon: ShoppingBag,
    descriptionTa: "சாலையோர குறு வியாபாரிகள், தள்ளுவண்டி கடை உரிமையாளர்களின் சிறப்புப் பிரிவு.",
    descriptionEn: "Street hawkers, mobile cart vendors, and weekly market micro-traders."
  },
  {
    id: "hotels-lodgings",
    nameTa: "தங்கும் விடுதி வணிகப் பிரிவு",
    nameEn: "Hotels & Lodgings Wing",
    icon: Bed,
    descriptionTa: "தங்கும் விடுதிகள், மேன்ஷன்கள் மற்றும் தங்கும் இல்லங்களின் உரிமையாளர்கள் பிரிவு.",
    descriptionEn: "Budget hotels, mansions, lodges, and guest house operators."
  },
  {
    id: "beauty-fitness",
    nameTa: "அழகுக்கலை மற்றும் உடற்பயிற்சி வணிகப் பிரிவு",
    nameEn: "Beauty & Fitness Wing",
    icon: Dumbbell,
    descriptionTa: "அழகு நிலையங்கள், உடற்பயிற்சிக் கூடங்கள் மற்றும் அழகு சாதன பொருட்கள் விற்பனையாளர்கள் பிரிவு.",
    descriptionEn: "Salons, gyms, spas, and cosmetic retail distributors."
  }
];
