import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Privacy and data security guidelines for Tamil Nadu Vanigargalin Sangamam members." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-10 text-left font-sans">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition mb-6 cursor-pointer bg-card px-3 py-1.5 rounded-sm border border-border shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div className="bg-card border border-border rounded-md p-6 md:p-10 shadow-xs space-y-6">
          {/* Header */}
          <div className="border-b border-border pb-5 space-y-2">
            <div className="w-12 h-12 bg-primary/10 text-emerald-600 rounded-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Your Privacy is Our Priority</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            At <strong>Tamil Nadu Vanigargalin Sangamam (தமிழ்நாடு வணிகர்களின் சங்கமம்)</strong>, we value the trust you place in us as our member. Protecting your personal information is as important to us as ensuring the quality of advocacy, certification, and business support services we provide. This Privacy Policy explains what information we collect, how we use it, how we safeguard it, and your rights when engaging with our portal—whether for membership, renewal, or loan applications.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
              Information We Collect
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed pl-2">
              When you interact with us, we may collect the following:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>Full Name</li>
              <li>Email Address & Phone Number</li>
              <li>Billing & Shipping Address</li>
              <li>Order History & Purchase Preferences</li>
              <li>Payment Details (via secure third-party gateways; we do not store card details)</li>
              <li>Business/Wholesale Information (for B2B clients)</li>
              <li>Device & Browser Data (for website use and analytics)</li>
              <li>Cookies & Tracking Data (for performance improvement)</li>
            </ul>
            <p className="text-xs text-muted-foreground pl-2">
              We collect only the information necessary to provide you with safe, reliable, and efficient service.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
              Why We Collect Your Information
            </h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>Processing and fulfilling orders</li>
              <li>Managing deliveries and providing shipment updates</li>
              <li>Offering customer service and support</li>
              <li>Sending optional promotional updates (only if you opt in)</li>
              <li>Improving our product offerings and customer experience</li>
              <li>Wholesale/B2B account management</li>
              <li>Meeting legal, regulatory, and tax compliance requirements</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
              How We Protect Your Information
            </h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>SSL Encryption for all online interactions</li>
              <li>Secure Payment Processing via PCI-compliant gateways</li>
              <li>Firewall & Access Controls on servers and systems</li>
              <li>Restricted Staff Access to sensitive data</li>
              <li>Regular Reviews of security and privacy practices</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
              Your Rights & Choices
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed pl-2">
              As our valued customer, you have the right to:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request corrections or updates to your information</li>
              <li>Ask for deletion of your data (subject to legal requirements)</li>
              <li>Withdraw consent from promotional communication at any time</li>
              <li>Raise concerns about data misuse or handling</li>
            </ul>
            <p className="text-xs text-muted-foreground pl-2">
              We aim to process all verified requests within 30 days.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
              Third-Party Sharing
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed pl-2">
              We do not sell or rent your personal information. Data may be shared only with logistics partners (for delivery of orders), payment processors (for secure transactions), and government/regulatory authorities when legally required.
            </p>
          </div>

          {/* Policy Updates & Contact Details */}
          <div className="border-t border-border pt-6 mt-8 space-y-4">
            <div className="text-xxs text-muted-foreground font-mono">
              Last Updated: August 2025 | © 2025 Tamil Nadu Vanigargalin Sangamam. All Rights Reserved.
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">Contact Us</h4>
            <div className="bg-muted border border-border rounded-md p-4 text-xs font-mono text-foreground space-y-2">
              <div className="font-sans font-bold text-foreground text-xs">Tamil Nadu Vanigargalin Sangamam (தமிழ்நாடு வணிகர்களின் சங்கமம்)</div>
              <div>📍 Mylapore, Chennai — 600 004, Tamil Nadu, India</div>
              <div>📞 Helpline: 044-2345-6789</div>
              <div>📧 Email: info@tnvs.gov.in</div>
              <div>🌐 Website: <span className="text-emerald-600 underline">tnvs.gov.in</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
