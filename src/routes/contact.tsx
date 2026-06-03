import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionLabel } from "@/components/Section";
import { FloatingInput, FloatingTextarea, FloatingSelect } from "@/components/FloatingInput";
import { useLanguage } from "@/hooks/useLanguage";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · TN Vanigargalin Sangamam" },
      { name: "description", content: "Get in touch — head office in Mylapore, Chennai. Helpline, email and district offices." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t, language } = useLanguage();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", email: "", subject: "Membership", message: "" });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success(t("செய்தி அனுப்பப்பட்டது!", "Message sent! We'll respond within 2 business days."));
    setForm({ name: "", mobile: "", email: "", subject: "Membership", message: "" });
  };

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-16 w-full">
          <SectionLabel>{t("தொடர்பு", "Contact")}</SectionLabel>
          <h1 className="mt-3 sm:mt-4 font-display font-semibold">
            {t("நாங்கள் உதவ தயாராக இருக்கிறோம்.", "We're here to help.")}
          </h1>
          <p className="font-tamil mt-3 text-foreground/75" lang="ta">
            {t("எந்த உதவிக்கும் தயங்காமல் தொடர்பு கொள்ளுங்கள்.", "Reach out to us for any assistance.")}
          </p>
        </div>
      </section>

      <Section className="py-10 sm:py-14 grid lg:grid-cols-5 gap-6 sm:gap-10">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { i: MapPin, t: "Head Office", ta: "தலைமை அலுவலகம்", d: "TN Vanigargalin Sangamam,\nNo. 24, North Mada Street,\nMylapore, Chennai \u2014 600\u00a0004", td: "தமிழ்நாடு வணிகர்களின் சங்கமம்,\nஎண். 24, வடக்கு மடா தெரு,\nமயிலாப்பூர், சென்னை \u2014 600\u00a0004" },
            { i: Phone, t: "Helpline", ta: "உதவி எண்", d: "1800-XXX-XXXX (Toll-free)\n+91 91944 20044", td: "1800-XXX-XXXX (கட்டணமற்றது)\n+91 91944 20044" },
            { i: Mail, t: "Email", ta: "மின்னஞ்சல்", d: "info@tnvs.gov.in\nsupport@tnvs.gov.in", td: "info@tnvs.gov.in\nsupport@tnvs.gov.in" },
            { i: Clock, t: "Office Hours", ta: "அலுவலக நேரம்", d: "Monday \u2013 Saturday\n10:00 AM \u2013 6:00 PM", td: "திங்கள் \u2013 சனி\nகாலை 10:00 \u2013 மாலை 6:00" },
          ].map((c) => (
            <div key={c.t} className="paper rounded-xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/8 grid place-items-center text-primary shrink-0"><c.i className="w-5 h-5" /></div>
              <div>
                <div className="font-display font-semibold">{t(c.ta, c.t)}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line mt-1 leading-relaxed font-tamil" lang={language === "ta" ? "ta" : "en"}>{t(c.td, c.d)}</div>
              </div>
            </div>
          ))}
        </div>

        <form className="lg:col-span-3 paper rounded-xl p-5 sm:p-8 space-y-5" onSubmit={handleSubmit}>
          <h2 className="font-display text-2xl font-semibold">{t("எங்களுக்கு செய்தி அனுப்புங்கள்", "Send us a message")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <FloatingInput
              label={t("உங்கள் பெயர்", "Your Name")}
              value={form.name} onChange={set("name")}
              required autoComplete="name"
            />
            <FloatingInput
              label={t("கைபேசி எண்", "Mobile Number")}
              value={form.mobile} onChange={set("mobile")}
              type="tel" required autoComplete="tel"
            />
          </div>
          <FloatingInput
            label={t("மின்னஞ்சல் (விரும்பினால்)", "Email (optional)")}
            value={form.email} onChange={set("email")}
            type="email" autoComplete="email"
          />
          <FloatingSelect
            label={t("விஷயம்", "Subject")}
            value={form.subject} onChange={set("subject")}
          >
            {[
              { v: "Membership",    l: t("உறுப்பினர் சேர்க்கை", "Membership") },
              { v: "Certificate",   l: t("சான்றிதழ்", "Certificate") },
              { v: "Welfare claim", l: t("நலன் கோரிக்கை", "Welfare claim") },
              { v: "Other",         l: t("மற்றவை", "Other") },
            ].map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </FloatingSelect>
          <FloatingTextarea
            label={t("செய்தி", "Message")}
            value={form.message} onChange={set("message")}
            required className="min-h-[120px]"
          />
          <button
            type="submit"
            disabled={sending}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            {sending ? <><Loader2 className="w-4 h-4 animate-spin" />{t("அனுப்புகிறது…", "Sending…")}</> : t("செய்தி அனுப்பு", "Send message")}
          </button>
        </form>
      </Section>
    </div>
  );
}

