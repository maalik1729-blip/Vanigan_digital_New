import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Quote, Star, Award } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

// Use optimized image paths (WebP/AVIF with fallback)
const trader1Path = "/assets/trader1";
const trader2Path = "/assets/trader2";
const trader3Path = "/assets/trader3";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Senthil Kumar",
    nameTa: "செந்தில் குமார்",
    role: "Grocery Store Owner",
    roleTa: "மளிகைக் கடை உரிமையாளர்",
    location: "Mylapore, Chennai",
    locationTa: "மயிலாப்பூர், சென்னை",
    image: trader1Path,
    text: "The digital ID card and certificate give instant credibility. It was extremely helpful when applying for my business expansion loan.",
    textTa: "டிஜிட்டல் அடையாள அட்டை மற்றும் சான்றிதழ் உடனடி அங்கீகாரத்தை வழங்குகிறது. கடன் விண்ணப்பத்திற்கு இது எனக்கு மிகவும் உதவியாக இருந்தது.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rajeshwari S",
    nameTa: "ராஜேஸ்வரி S",
    role: "Textile Merchant",
    roleTa: "ஜவுளி வியாபாரி",
    location: "Nelpettai, Madurai",
    locationTa: "நெல்பேட்டை, மதுரை",
    image: trader2Path,
    text: "The association's welfare schemes and health insurance are a huge safety net for small merchants like us. Registration took only 5 minutes.",
    textTa: "சங்கத்தின் நலத்திட்டங்கள் மற்றும் மருத்துவக் காப்பீடு எங்களைப் போன்ற சிறு வணிகர்களுக்கு ஒரு பெரிய பாதுகாப்பு வளையமாகும். 5 நிமிடங்களில் பதிவு செய்ய முடிந்தது.",
    rating: 5,
  },
  {
    id: 3,
    name: "Anbu Chezhian",
    nameTa: "அன்பு செழியன்",
    role: "Hardware & Tools Dealer",
    roleTa: "ஹார்டுவேர் மற்றும் கருவிகள் வியாபாரி",
    location: "Gandhipuram, Coimbatore",
    locationTa: "காந்திபுரம், கோயம்புத்தூர்",
    image: trader3Path,
    text: "I registered online and got my stamped certificate instantly. The government recognition and transparency in TNVS is outstanding.",
    textTa: "நான் ஆன்லைனில் பதிவு செய்து, எனது முத்திரையிடப்பட்ட சான்றிதழை உடனடியாகப் பெற்றேன். TNVS-ன் அரசு அங்கீகாரம் மற்றும் வெளிப்படைத்தன்மை சிறப்பானது.",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const { language } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();

  // Simple autoplay hook
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-12 relative py-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {TESTIMONIALS.map((t) => (
            <CarouselItem key={t.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
              <div className="h-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow duration-300">
                {/* Background soft gradients */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 rounded-bl-full -z-10 group-hover:bg-primary/4 transition-colors" />
                
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/25 transition-colors" />
                  </div>

                  {/* Testimonial text */}
                  <p className="text-slate-600 text-sm md:text-base italic leading-relaxed mb-6 font-tamil">
                    "{language === "ta" ? t.textTa : t.text}"
                  </p>
                </div>

                {/* Profile block */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <div className="relative">
                    <picture>
                      <source 
                        type="image/avif" 
                        srcSet={`${t.image}.avif 409w, ${t.image}@2x.avif 818w`} 
                      />
                      <source 
                        type="image/webp" 
                        srcSet={`${t.image}.webp 409w, ${t.image}@2x.webp 818w`} 
                      />
                      <img
                        src={`${t.image}.png`}
                        alt={language === "ta" ? t.nameTa : t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/10 shadow-sm"
                        loading="lazy"
                        decoding="async"
                        width="48"
                        height="48"
                      />
                    </picture>
                    <div className="absolute -bottom-1 -right-1 bg-gold text-white p-0.5 rounded-full shadow-sm">
                      <Award className="w-3 h-3 text-gold-foreground" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-slate-800 text-sm md:text-base leading-tight">
                      {language === "ta" ? t.nameTa : t.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === "ta" ? t.roleTa : t.role}
                    </p>
                    <p className="text-[10px] text-primary/80 font-semibold tracking-wide uppercase mt-0.5">
                      {language === "ta" ? t.locationTa : t.location}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation buttons */}
        <div className="hidden md:flex justify-end gap-2 mt-6">
          <CarouselPrevious className="static translate-y-0 h-10 w-10 border-slate-200 text-slate-600 hover:bg-slate-50" />
          <CarouselNext className="static translate-y-0 h-10 w-10 border-slate-200 text-slate-600 hover:bg-slate-50" />
        </div>
      </Carousel>
    </div>
  );
}
