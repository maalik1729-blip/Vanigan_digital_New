import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Terms of service and legal agreement for Tamil Nadu Vanigargalin Sangamam members." },
    ],
  }),
  component: TermsConditions,
});

function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 text-left font-sans">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-6 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xxs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5 space-y-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-800">Terms & Conditions</h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Please read these terms carefully before using our services</p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Welcome to <strong>Tamil Nadu Vanigargalin Sangamam (தமிழ்நாடு வணிகர்களின் சங்கமம்)</strong>. By accessing our website, registering as a member, or engaging with our services, you agree to comply with and be bound by the following Terms & Conditions. These terms govern all memberships, renewals, certifications, and interactions with Tamil Nadu Vanigargalin Sangamam. If you do not agree with these terms, we request you to discontinue using our services.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              1. General Use of Website & Services
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
              <li>By using our services, you confirm that you are a registered business entity or trader operating in Tamil Nadu, or an authorized representative.</li>
              <li>You agree to provide accurate and complete details when applying for membership or welfare schemes.</li>
              <li>Any misuse, fraudulent activity, or violation of these terms may result in suspension of membership services.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              2. Services & Fees
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
              <li>We specialize in providing trade advocacy, stamp certifications, digital voter identity cards (EPIC ID), and welfare benefits for registered traders.</li>
              <li>All service fees listed on the website (e.g., membership entry or annual renewal fees) are transparently listed in Indian Rupees (INR ₹) and are subject to association bylaws.</li>
              <li>We reserve the right to correct any errors in listings, descriptions, or pricing, and may cancel affected registrations with full refunds where applicable.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              3. Memberships & Payments
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
              <li>Membership subscriptions and renewals are confirmed only after successful payment validation.</li>
              <li>We accept UPI, debit/credit cards, and net banking via secure PCI-compliant gateways.</li>
              <li>Tamil Nadu Vanigargalin Sangamam does not store your payment credentials.</li>
              <li>In the event of duplicate charges or transaction errors, members should contact our support helpline immediately.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              4. Service Timelines
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
              <li>Digital voter identity cards (EPIC IDs) are generated instantly upon verified application submission.</li>
              <li>Welfare claims (such as health coverage cards or subsidized loan reviews) are verified and processed in compliance with regional auditor schedules.</li>
              <li>We are not liable for external network delays, server outages, or incorrect detail inputs.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              5. Cancellations & Fees
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed pl-2">
              All membership fees, renewals, and welfare contributions are non-refundable. In cases of duplicate payment charges, verified claims will be resolved with direct refunds within 5–7 business days.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              6. Member Responsibilities
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed pl-2">
              By registering, members agree not to provide false or incomplete shop registration details, raise fraudulent claims, or misuse the TNVS name, logo, and digital platforms.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              7. Intellectual Property
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed pl-2">
              All association emblems, logo designs, voter card mockups, content, and branding are the exclusive intellectual property of Tamil Nadu Vanigargalin Sangamam (தமிழ்நாடு வணிகர்களின் சங்கமம்).
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              8. Limitation of Liability
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed pl-2">
              Tamil Nadu Vanigargalin Sangamam shall not be liable for courier delays in physical certificate delivery, regional portal outages, or regulatory changes that affect trade laws. Our liability is strictly limited to the value of the registration fee paid.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-3 bg-indigo-600 rounded-full" />
              9. Governing Law & Jurisdiction
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed pl-2">
              These Terms & Conditions are governed by the laws of India. Any disputes shall fall under the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
            </p>
          </div>

          {/* Contact Details */}
          <div className="border-t border-slate-100 pt-6 mt-8 space-y-4">
            <h4 className="font-display text-sm font-bold text-slate-800">Contact Us</h4>
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs font-mono text-slate-700 space-y-2">
              <div className="font-sans font-bold text-slate-800 text-xs">Tamil Nadu Vanigargalin Sangamam (தமிழ்நாடு வணிகர்களின் சங்கமம்)</div>
              <div>📍 Mylapore, Chennai — 600 004, Tamil Nadu, India</div>
              <div>📞 Helpline: 044-2345-6789</div>
              <div>📧 Email: info@tnvs.gov.in</div>
              <div>🌐 Website: <span className="text-indigo-600 underline">tnvs.gov.in</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
