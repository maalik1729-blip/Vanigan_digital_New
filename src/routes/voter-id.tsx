import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, MapPin, Building2, Hash,
  Phone, Share2, User, Download, Lock, ArrowLeft, Camera, RefreshCw, Key
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { toast } from "sonner";
import { VoterIdCard, type Voter, membershipNo, getZoneName, formatDob } from "@/components/VoterIdCard";
import { WINGS } from "@/data/wings";
import ownerPhoto from "@/assets/round-logo.png";
import orgLogo from "@/assets/association-logo.png";
import signImg from "@/assets/president-signature.png";

export const Route = createFileRoute("/voter-id")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      epic: search.epic ? (search.epic as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Download Certificate & Card · TNVS Portal" },
      { name: "description", content: "Verify your PIN to download your official membership certificate and print your ID card." },
    ],
  }),
  component: SecureDownloadPage,
});

function SecureDownloadPage() {
  const { t, language } = useLanguage();
  const { epic: searchEpic } = Route.useSearch();

  const [epicInput, setEpicInput] = useState(searchEpic || "");
  const [pinInput, setPinInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedVoter, setVerifiedVoter] = useState<Voter | null>(null);
  const [shareMsg, setShareMsg] = useState("");

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Verification Logic
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = epicInput.trim().toUpperCase();
    if (!inputVal) {
      toast.error(language === "ta" ? "தயவுசெய்து EPIC ID அல்லது மொபைல் எண்ணை உள்ளிடவும்" : "Please enter EPIC ID or Mobile Number");
      return;
    }
    if (pinInput.length !== 4) {
      toast.error(language === "ta" ? "தயவுசெய்து 4-இலக்க பாதுகாப்பு PIN ஐ உள்ளிடவும்" : "Please enter a valid 4-digit Security PIN");
      return;
    }

    setIsVerifying(true);

    try {
      // Fetch and verify credentials from the MySQL database
      const params = new URLSearchParams();
      const cleanMobile = inputVal.replace(/\D/g, "");
      if (cleanMobile.length === 10) {
        params.append("mobile", cleanMobile);
      } else {
        params.append("epic", inputVal);
      }
      params.append("pin", pinInput);

      const res = await fetch(`/api/public/members?${params.toString()}`);
      if (res.ok) {
        const dbMember = await res.json();
        const voterObj: Voter = {
          ID: dbMember.id || 8888,
          ASSEMBLY_NO: "25",
          ASSEMBLY_NAME: dbMember.assembly || "Mylapore",
          PART_NO: "1",
          SECTION_NO: "1",
          SERIAL_NO: "12",
          HOUSE_NO: "",
          VOTER_NAME: dbMember.name,
          RELATION_TYPE: "Father",
          RELATION_NAME: "",
          EPIC_NO: dbMember.epic,
          MOBILE_NUMBER: dbMember.mobile,
          AGE: dbMember.age ? String(dbMember.age) : "30",
          DOB: dbMember.dob,
          BUSINESS_TYPE: dbMember.type || "Retail",
          GENDER: dbMember.gender || "Male",
          BLOOD_GROUP: dbMember.bloodGroup || "O+",
          PART_NAME: "TNVS Zone",
          POLLING_STATION_NAME: dbMember.address || "",
          POLLING_STATION_ADDRESS: dbMember.address || "",
          MAIN_TOWN: dbMember.district || "CHENNAI",
          WARD: "",
          POST_OFFICE: "",
          POLICE_STATION: "",
          DISTRICT: dbMember.district || "CHENNAI",
          PIN_CODE: "",
          PHOTO_URL: dbMember.selfie || ownerPhoto,
        };
        setVerifiedVoter(voterObj);
        toast.success(language === "ta" ? "பாதுகாப்பு PIN சரிபார்க்கப்பட்டது! அணுகல் அனுமதிக்கப்பட்டது." : "Security PIN verified! Access granted.");
      } else if (res.status === 401) {
        toast.error(language === "ta" ? "தவறான பாதுகாப்பு PIN. மீண்டும் முயலவும்." : "Invalid Security PIN. Please try again.");
      } else if (res.status === 404) {
        toast.error(language === "ta" ? "உறுப்பினர் கணக்கு அல்லது EPIC ID காணப்படவில்லை." : "Membership record or EPIC ID not found.");
      } else {
        toast.error(language === "ta" ? "சரிபார்க்க முடியவில்லை. மீண்டும் முயலவும்." : "Could not verify details. Please try again.");
      }
    } catch (err) {
      console.error("Database lookup error:", err);
      toast.error(language === "ta" ? "சேவையகத்தை அணுக முடியவில்லை. மீண்டும் முயலவும்." : "Unable to reach verification server. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Certificate download logic (using canvas)
  const downloadCertificate = () => {
    if (!verifiedVoter) return;
    const W = 900, H = 700;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      ctx.fillStyle = "#1e3a8a"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff"; ctx.fillRect(16, 16, W - 32, H - 32);
      ctx.fillStyle = "#ebdca5"; ctx.fillRect(16, 16, W - 32, 8);
      ctx.fillStyle = "#1e3a8a"; ctx.textAlign = "center"; ctx.font = "bold 24px Georgia, serif";
      ctx.fillText("TAMILNADU VANIGARGALIN SANGAMAM", W / 2, 60);
      ctx.fillStyle = "#d4b26f"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText("MEMBERSHIP CERTIFICATE", W / 2, 90);
      ctx.fillStyle = "#333"; ctx.font = "italic 16px Georgia, serif";
      ctx.fillText("This is to certify that", W / 2, 140);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 26px Georgia, serif";
      ctx.fillText(verifiedVoter.VOTER_NAME.toUpperCase(), W / 2, 185);
      ctx.fillStyle = "#333"; ctx.font = "italic 15px Georgia, serif";
      ctx.fillText("is officially enrolled as an esteemed member of", W / 2, 230);
      ctx.fillText("Tamilnadu Vanigargalin Sangamam.", W / 2, 252);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 290, W - 200, 200);
      ctx.textAlign = "left"; ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("Membership ID / EPIC:", 120, 330);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 16px monospace";
      ctx.fillText(verifiedVoter.EPIC_NO, 310, 330);
      ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("District / Location:", 120, 370);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText(verifiedVoter.DISTRICT, 310, 370);
      
      const wingData = WINGS.find(w => w.id === verifiedVoter.BUSINESS_TYPE); // or wing match
      ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
      ctx.fillText("Business Division / Type:", 120, 410);
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 15px Georgia, serif";
      ctx.fillText(verifiedVoter.BUSINESS_TYPE || "Retail", 310, 410);
      
      if (verifiedVoter.POLLING_STATION_NAME) {
        ctx.fillStyle = "#555"; ctx.font = "15px Georgia, serif";
        ctx.fillText("Shop Address:", 120, 450);
        ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 13px Georgia, serif";
        ctx.fillText(verifiedVoter.POLLING_STATION_ADDRESS.slice(0, 55), 310, 450);
      }
      ctx.textAlign = "center"; ctx.fillStyle = "#666"; ctx.font = "13px Georgia, serif";
      const date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
      ctx.fillText("Issued on: " + date, W / 2, 530);
      ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2 - 80, 545); ctx.lineTo(W / 2 + 80, 545); ctx.stroke();
      ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 12px Georgia, serif"; ctx.textAlign = "center";
      ctx.fillText("SENTHIL KUMAR N", W / 2, 570);
      ctx.fillStyle = "#555"; ctx.font = "11px Georgia, serif";
      ctx.fillText("Founder & State President", W / 2, 586);
      ctx.fillText("Tamilnadu Vanigargalin Sangamam", W / 2, 601);
      ctx.fillText("No 5/79, Saidapet, Chennai - 600015", W / 2, 617);
    };

    const imgLeft = new Image(); imgLeft.src = verifiedVoter.PHOTO_URL || ownerPhoto;
    const imgRight = new Image(); imgRight.src = orgLogo;
    const imgSign = new Image(); imgSign.src = signImg;
    let loaded = 0;
    const handleComplete = () => {
      loaded++;
      if (loaded === 3) {
        draw();
        const ph = 72, pw = 72;
        if (imgLeft.complete && imgLeft.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(45 + pw / 2, 40 + ph / 2, ph / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(imgLeft, 45, 40, pw, ph);
          ctx.restore();
        }
        if (imgRight.complete && imgRight.naturalWidth > 0) {
          ctx.drawImage(imgRight, W - 45 - pw, 40, pw, ph);
        }
        if (imgSign.complete && imgSign.naturalWidth > 0) {
          const sw = 110, h = 44;
          ctx.drawImage(imgSign, W / 2 - sw / 2, 545 - h - 3, sw, h);
        }
        
        const link = document.createElement("a");
        link.download = "membership-certificate-" + verifiedVoter.EPIC_NO + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    imgLeft.onload = imgLeft.onerror = 
    imgRight.onload = imgRight.onerror = 
    imgSign.onload = imgSign.onerror = handleComplete;
  };

  const handlePrint = () => {
    if (!frontRef.current || !backRef.current || !verifiedVoter) return;
    const name = verifiedVoter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
    const frontHtml = frontRef.current.innerHTML;
    const backHtml = backRef.current.innerHTML;

    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <title>Sangamam Card — ${name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              gap: 40px; 
              padding: 20px; 
              background: #f0f2f5;
              font-family: 'Inter', sans-serif;
            }
            .card-wrapper {
              position: relative;
              overflow: hidden;
              background: transparent;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
              border-radius: 12px;
              page-break-inside: avoid;
            }
            /* Front Card Wrapper Dimensions */
            .card-wrapper:first-of-type {
              width: 421px;
              height: 590px;
            }
            /* Back Card Wrapper Dimensions */
            .card-wrapper:last-of-type {
              width: 421px;
              height: 590px;
            }
            /* Clear any preview page wrapper styling */
            .card-scale-wrapper {
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }
            /* Prevent scale adjustments in print container */
            .responsive-card-scale {
              transform: none !important;
              width: 100% !important;
              height: 100% !important;
            }
            /* Center elements properly */
            .card-face {
              margin: 0 !important;
            }
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
              body { 
                background: #fff; 
                min-height: auto;
                padding: 0;
                gap: 15mm;
              }
              .card-wrapper {
                box-shadow: none;
                border-radius: 0;
                page-break-inside: avoid;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="card-wrapper">${frontHtml}</div>
          <div class="card-wrapper">${backHtml}</div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>`);
    w.document.close();
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillStyle: string
  ) => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const generateFrontCardCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!verifiedVoter) return reject(new Error("No voter data"));
      const name = verifiedVoter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
      const W = 421, H = 590;
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale; canvas.height = H * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      const draw = () => {
        // 1. Draw Member Photo
        const photoX = (W - 137) / 2;
        const photoY = 182;
        const photoW = 137;
        const photoH = 136;
        const radius = 22;

        // Draw white background outer container for the ring frame
        drawRoundedRect(ctx, photoX, photoY, photoW, photoH, radius, "#ffffff");

        // Draw Photo image (rounded and inset by 3px for white offset padding ring)
        if (imgPhoto.complete && imgPhoto.naturalWidth > 0) {
          ctx.save();
          const insetX = photoX + 3;
          const insetY = photoY + 3;
          const insetW = photoW - 6;
          const insetH = photoH - 6;
          const insetR = radius - 3;
          ctx.beginPath();
          ctx.moveTo(insetX + insetR, insetY);
          ctx.lineTo(insetX + insetW - insetR, insetY);
          ctx.quadraticCurveTo(insetX + insetW, insetY, insetX + insetW, insetY + insetR);
          ctx.lineTo(insetX + insetW, insetY + insetH - insetR);
          ctx.quadraticCurveTo(insetX + insetW, insetY + insetH, insetX + insetW - insetR, insetY + insetH);
          ctx.lineTo(insetX + insetR, insetY + insetH);
          ctx.quadraticCurveTo(insetX, insetY + insetH, insetX, insetY + insetH - insetR);
          ctx.lineTo(insetX, insetY + insetR);
          ctx.quadraticCurveTo(insetX, insetY, insetX + insetR, insetY);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(imgPhoto, insetX, insetY, insetW, insetH);
          ctx.restore();
        }

        // Draw green border (thinner 3px outer stroke)
        ctx.save();
        ctx.strokeStyle = "var(--primary)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(photoX + radius, photoY);
        ctx.lineTo(photoX + photoW - radius, photoY);
        ctx.quadraticCurveTo(photoX + photoW, photoY, photoX + photoW, photoY + radius);
        ctx.lineTo(photoX + photoW, photoY + photoH - radius);
        ctx.quadraticCurveTo(photoX + photoW, photoY + photoH, photoX + photoW - radius, photoY + photoH);
        ctx.lineTo(photoX + radius, photoY + photoH);
        ctx.quadraticCurveTo(photoX, photoY + photoH, photoX, photoY + photoH - radius);
        ctx.lineTo(photoX, photoY + radius);
        ctx.quadraticCurveTo(photoX, photoY, photoX + radius, photoY);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // 2. Draw Text Stack
        ctx.textAlign = "center";
        
        // Name
        ctx.font = "bold 23px Arial, sans-serif";
        ctx.fillStyle = "var(--primary)";
        ctx.fillText(name.toUpperCase(), W / 2, 350);

        // Assembly : Value
        ctx.textAlign = "center";
        const assmLabel = "Assembly : ";
        const assmValue = verifiedVoter.ASSEMBLY_NAME || "—";
        ctx.font = "500 13px Arial, sans-serif";
        const assmLabelW = ctx.measureText(assmLabel).width;
        ctx.font = "500 16px Arial, sans-serif";
        const assmValueW = ctx.measureText(assmValue).width;
        const assmLineW = assmLabelW + assmValueW;
        const assmLineX = W / 2 - assmLineW / 2;
        ctx.font = "500 13px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.textAlign = "left";
        ctx.fillText(assmLabel, assmLineX, 382);
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(assmValue, assmLineX + assmLabelW, 382);

        // Dist : Value
        const distLabel = "Dist : ";
        const distValue = verifiedVoter.DISTRICT || "—";
        ctx.font = "500 13px Arial, sans-serif";
        const distLabelW = ctx.measureText(distLabel).width;
        ctx.font = "500 16px Arial, sans-serif";
        const distValueW = ctx.measureText(distValue).width;
        const distLineW = distLabelW + distValueW;
        const distLineX = W / 2 - distLineW / 2;
        ctx.font = "500 13px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(distLabel, distLineX, 414);
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(distValue, distLineX + distLabelW, 414);

        // Zone : Value
        const zoneLabel = "Zone : ";
        const zoneText = getZoneName(verifiedVoter.DISTRICT, verifiedVoter.ASSEMBLY_NAME);
        ctx.font = "500 13px Arial, sans-serif";
        const zoneLabelW = ctx.measureText(zoneLabel).width;
        ctx.font = "500 16px Arial, sans-serif";
        const zoneValueW = ctx.measureText(zoneText).width;
        const zoneLineW = zoneLabelW + zoneValueW;
        const zoneLineX = W / 2 - zoneLineW / 2;
        ctx.font = "500 13px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(zoneLabel, zoneLineX, 446);
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(zoneText, zoneLineX + zoneLabelW, 446);

        // ID/Membership Number (bold)
        const mno = membershipNo(verifiedVoter);
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.fillStyle = "#000000";
        ctx.fillText(mno, W / 2, 478);

        resolve(canvas);
      };

      // Load Background & Photo
      const imgBg = new Image();
      imgBg.crossOrigin = "anonymous";
      imgBg.src = "https://res.cloudinary.com/dqndhcmu2/image/upload/v1773232516/vanigan/templates/ID_Front.png";

      const imgPhoto = new Image();
      imgPhoto.crossOrigin = "anonymous";
      imgPhoto.src = verifiedVoter.PHOTO_URL || ownerPhoto;

      let loaded = 0;
      const handleLoad = () => {
        loaded++;
        if (loaded === 2) {
          const cardRadius = 24;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cardRadius, 0);
          ctx.lineTo(W - cardRadius, 0);
          ctx.quadraticCurveTo(W, 0, W, cardRadius);
          ctx.lineTo(W, H - cardRadius);
          ctx.quadraticCurveTo(W, H, W - cardRadius, H);
          ctx.lineTo(cardRadius, H);
          ctx.quadraticCurveTo(0, H, 0, H - cardRadius);
          ctx.lineTo(0, cardRadius);
          ctx.quadraticCurveTo(0, 0, cardRadius, 0);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(imgBg, 0, 0, W, H);
          draw();
          ctx.restore();
        }
      };
      imgBg.onerror = imgPhoto.onerror = () => {
        reject(new Error("Error loading front card images."));
      };
      imgBg.onload = imgPhoto.onload = handleLoad;
    });
  };

  const generateBackCardCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!verifiedVoter) return reject(new Error("No voter data"));
      const W = 421, H = 590;
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale; canvas.height = H * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      const mno = membershipNo(verifiedVoter);
      const dobString = formatDob(verifiedVoter.DOB, verifiedVoter.AGE);
      const mobile = verifiedVoter.MOBILE_NUMBER && verifiedVoter.MOBILE_NUMBER !== "-" ? verifiedVoter.MOBILE_NUMBER : "—";
      const rawAddress = verifiedVoter.POLLING_STATION_ADDRESS || (verifiedVoter.HOUSE_NO ? `No ${verifiedVoter.HOUSE_NO}, ${verifiedVoter.MAIN_TOWN || verifiedVoter.DISTRICT}` : "");
      const address = rawAddress ? rawAddress.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

      const draw = () => {
        // 1. Draw details rows
        let y = 188;
        const drawRow = (label: string, value: string, isAddress = false) => {
          ctx.textAlign = "left";
          ctx.font = "500 12px Arial, sans-serif";
          ctx.fillStyle = "#4b5563";
          ctx.fillText(label, 22, y);
          
          ctx.textAlign = "center";
          ctx.font = "500 16px Arial, sans-serif";
          ctx.fillStyle = "#4b5563";
          ctx.fillText(":", 168, y);
          
          ctx.textAlign = "left";
          ctx.font = "bold 17px Arial, sans-serif";
          ctx.fillStyle = "#000000";
          if (isAddress) {
            const words = value.split(" ");
            let line = "";
            let currentY = y;
            for (let n = 0; n < words.length; n++) {
              let testLine = line + words[n] + " ";
              let testWidth = ctx.measureText(testLine).width;
              if (testWidth > 212 && n > 0) {
                ctx.fillText(line, 188, currentY);
                line = words[n] + " ";
                currentY += 23;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, 188, currentY);
            y = currentY + 25;
          } else {
            ctx.fillText(value, 188, y);
            y += 22;
          }
        };

        drawRow("DATE OF BIRTH", dobString);
        drawRow("AGE", verifiedVoter.AGE || "—");
        drawRow("BLOOD GROUP", verifiedVoter.BLOOD_GROUP || "—");
        drawRow("ADDRESS", address, true);

        // Contact row
        y += 6;
        ctx.textAlign = "left";
        ctx.font = "500 12px Arial, sans-serif";
        ctx.fillStyle = "#4b5563";
        ctx.fillText("CONTACT", 22, y);
        
        ctx.textAlign = "center";
        ctx.font = "500 16px Arial, sans-serif";
        ctx.fillStyle = "#4b5563";
        ctx.fillText(":", 168, y);
        
        ctx.font = "bold 17px Arial, sans-serif";
        const mobileWidth = ctx.measureText(mobile).width;
        ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
        ctx.fillRect(188 - 4, y - 14, mobileWidth + 8, 20);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.fillText(mobile, 188, y);

        // 2. Draw QR Code
        if (imgQr.complete && imgQr.naturalWidth > 0) {
          ctx.drawImage(imgQr, 42, 460, 96, 88);
        }

        // 3. Draw Signature & President details
        if (imgSign.complete && imgSign.naturalWidth > 0) {
          ctx.drawImage(imgSign, 325 - 180 / 2, 405, 180, 75);
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.fillText("SENTHIL KUMAR N", 325, 482);
        ctx.font = "bold 12px Arial, sans-serif";
        ctx.fillText("Founder & State President", 325, 498);
        ctx.fillText("Tamilnadu Vanigargalin Sangamam", 325, 514);

        resolve(canvas);
      };

      // Load Background, QR Code and Signature
      const imgBg = new Image();
      imgBg.crossOrigin = "anonymous";
      imgBg.src = "https://res.cloudinary.com/dqndhcmu2/image/upload/v1773232519/vanigan/templates/ID_Back.png";

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=96x88&data=${encodeURIComponent(mno)}`;
      const imgQr = new Image();
      imgQr.crossOrigin = "anonymous";
      imgQr.src = qrUrl;

      const imgSign = new Image();
      imgSign.crossOrigin = "anonymous";
      imgSign.src = signImg;

      let loaded = 0;
      const handleLoad = () => {
        loaded++;
        if (loaded === 3) {
          const cardRadius = 24;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cardRadius, 0);
          ctx.lineTo(W - cardRadius, 0);
          ctx.quadraticCurveTo(W, 0, W, cardRadius);
          ctx.lineTo(W, H - cardRadius);
          ctx.quadraticCurveTo(W, H, W - cardRadius, H);
          ctx.lineTo(cardRadius, H);
          ctx.quadraticCurveTo(0, H, 0, H - cardRadius);
          ctx.lineTo(0, cardRadius);
          ctx.quadraticCurveTo(0, 0, cardRadius, 0);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(imgBg, 0, 0, W, H);
          draw();
          ctx.restore();
        }
      };
      imgBg.onerror = imgQr.onerror = imgSign.onerror = () => {
        reject(new Error("Error loading back card images."));
      };
      imgBg.onload = imgQr.onload = imgSign.onload = handleLoad;
    });
  };

  const downloadIdCardPng = async () => {
    if (!verifiedVoter) return;
    const toastId = toast.loading(
      language === "ta" ? "அடையாள அட்டை படம் உருவாக்கப்படுகிறது..." : "Generating ID Card PNG..."
    );

    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        generateFrontCardCanvas(),
        generateBackCardCanvas(),
      ]);

      const W_front = 421, H_front = 590;
      const W_back = 421, H_back = 590;
      const gap = 20;
      const scale = 3;

      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = (W_front + W_back + gap) * scale;
      combinedCanvas.height = Math.max(H_front, H_back) * scale;
      const combinedCtx = combinedCanvas.getContext("2d")!;

      // Fill background with white
      combinedCtx.fillStyle = "#ffffff";
      combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Draw front card canvas (top-aligned)
      combinedCtx.drawImage(frontCanvas, 0, 0);

      // Draw back card canvas (top-aligned)
      combinedCtx.drawImage(backCanvas, (W_front + gap) * scale, 0);

      const mno = membershipNo(verifiedVoter);
      const link = document.createElement("a");
      link.download = `id-card-${mno}.png`;
      link.href = combinedCanvas.toDataURL("image/png");
      link.click();

      toast.dismiss(toastId);
      toast.success(
        language === "ta" ? "அடையாள அட்டை படம் பதிவிறக்கப்பட்டது!" : "ID Card downloaded successfully!"
      );
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        language === "ta"
          ? "அடையாள அட்டைப் படத்தை உருவாக்குவதில் பிழை ஏற்பட்டது."
          : "Error generating ID card image."
      );
      console.error(error);
    }
  };

  const handleShare = (mno: string) => {
    if (!verifiedVoter) return;
    const name = verifiedVoter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
    const text = `சங்கம உறுப்பினர் அட்டை\nPer: ${name}\nMembership: ${mno}\nAssembly: ${verifiedVoter.ASSEMBLY_NAME}, ${verifiedVoter.DISTRICT}`;
    if (navigator.share) {
      navigator.share({ title: `Sangamam Card — ${name}`, text, url: window.location.href }).catch(() => null);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShareMsg(language === "ta" ? "நகலெடுக்கப்பட்டது / Copied!" : "Copied!");
        setTimeout(() => setShareMsg(""), 2500);
      }).catch(() => null);
    }
  };

  const generatedMno = verifiedVoter
    ? `TNVS-${verifiedVoter.EPIC_NO.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6)}12`
    : "";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background pb-12">
      {/* Page Header */}
      <section className="bg-card text-foreground border-b border-border shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-10 w-full relative z-10">
          <div className="mb-3">
            <Breadcrumb
              items={[
                { label: "Services", labelTa: "சேவைகள்", to: "/members" },
                { label: "Certificate Download", labelTa: "சான்றிதழ் பதிவிறக்கம்" },
              ]}
            />
          </div>
          <div className="flex">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-primary/20">
              Secure Access · பாதுகாப்பான அணுகல்
            </div>
          </div>
          <h1 className="font-display font-semibold text-ink">
            Certificate & Card Download
          </h1>
          <p className="font-tamil text-sm sm:text-base text-muted-foreground mt-1">
            டிஜிட்டல் உறுப்பினர் சான்றிதழ் மற்றும் அடையாள அட்டை பதிவிறக்கம்
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {!verifiedVoter ? (
            /* ─── SECURITY ACCESS LOCK SCREEN ─── */
            <motion.div
              key="lock-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto bg-card border border-border rounded-md p-6 sm:p-8 shadow-xs"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 text-primary rounded-md flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Enter Security PIN</h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {language === "ta"
                    ? "உங்கள் உறுப்பினர் அட்டை மற்றும் சான்றிதழைப் பெற 4-இலக்க பாதுகாப்பு PIN மற்றும் EPIC ID அல்லது மொபைல் எண்ணை உள்ளிடவும்."
                    : "Verify your EPIC ID / Mobile Number and 4-digit Security PIN to access your digital membership certificate & card."}
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                {/* EPIC ID / Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    {language === "ta" ? "EPIC ID / அலைபேசி எண் (EPIC ID / Mobile Number) *" : "EPIC ID / Mobile Number *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={epicInput}
                    onChange={(e) => setEpicInput(e.target.value)}
                    className="w-full border border-[#EADCC9] bg-[#FAF8F5] text-foreground rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary min-h-[44px]"
                    placeholder="e.g. RJE1234567 or 9876543210"
                  />
                </div>

                {/* 4-Digit Security PIN */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    {language === "ta" ? "பாதுகாப்பு PIN (Security PIN) *" : "Security PIN *"}
                  </label>
                  
                  <div className="relative inline-block w-full">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value.replace(/\D/g, ""))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      autoComplete="one-time-code"
                    />
                    <div className="flex gap-3 justify-center">
                      {[0, 1, 2, 3].map(index => {
                        const char = pinInput[index] || "";
                        const isFocused = pinInput.length === index;
                        return (
                          <div
                            key={index}
                            className={`w-12 h-14 rounded-md border-2 text-xl font-extrabold flex items-center justify-center transition-all duration-300 ${
                              isFocused
                                ? "border-primary ring-4 ring-primary/15 scale-105 bg-card shadow-xs shadow-primary/5"
                                : char
                                ? "border-emerald-400 bg-primary/10 text-emerald-850"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {char ? "•" : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn-primary w-full justify-center mt-2 cursor-pointer shadow-xs py-3 rounded-md"
                >
                  {isVerifying ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying PIN...</>
                  ) : (
                    <><Key className="w-4 h-4" /> Verify & Access</>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-border text-center text-[10px] text-muted-foreground">
                <p>
                  {language === "ta" 
                    ? "டெமோ: வாக்காளர் 'RJE1234567' மற்றும் PIN '1234' கொண்டு சோதிக்கலாம்." 
                    : "Demo Account: Use EPIC 'RJE1234567' and PIN '1234' to unlock default voter details."}
                </p>
                <Link to="/membership" className="text-primary font-bold hover:underline block mt-2">
                  Not a member? Apply for membership now
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ─── SECURE CERTIFICATE & ID CARD DOWNLOAD SCREEN (UNLOCKED) ─── */
            <motion.div
              key="download-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-12 gap-8 items-start animate-fadeIn"
            >
              {/* Left Column: Member Details Summary card */}
              <div className="lg:col-span-5 bg-card border border-border rounded-md p-6 shadow-xs space-y-6">
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    {/* Circle photo */}
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-border bg-muted">
                      <img src={verifiedVoter.PHOTO_URL} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">{verifiedVoter.VOTER_NAME}</h2>
                      <span className="text-[10px] uppercase font-mono bg-blue-50 text-primary border border-blue-100 px-2 py-0.5 rounded-md font-bold tracking-wider">{verifiedVoter.EPIC_NO}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setVerifiedVoter(null);
                      setPinInput("");
                    }}
                    className="text-[10px] font-bold text-muted-foreground hover:text-red-650 bg-muted hover:bg-red-50 border border-border hover:border-red-150 px-2.5 py-1.5 rounded-md transition cursor-pointer"
                  >
                    Lock Session
                  </button>
                </div>

                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Member Credentials</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Mobile", value: verifiedVoter.MOBILE_NUMBER || "—", icon: Phone },
                      { label: "Age / Gender", value: `${verifiedVoter.AGE} yrs · ${verifiedVoter.GENDER}`, icon: User },
                      { label: "Blood Group", value: verifiedVoter.BLOOD_GROUP || "—", icon: Hash },
                      { label: "Business Type", value: verifiedVoter.BUSINESS_TYPE || "Retail", icon: Building2 },
                      { label: "Assembly Name", value: verifiedVoter.ASSEMBLY_NAME, icon: Building2 },
                      { label: "District Location", value: verifiedVoter.DISTRICT, icon: MapPin },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-[#FAF8F5] border border-border rounded-md p-3 shadow-xs">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          {label}
                        </div>
                        <div className="text-xs text-foreground font-bold mt-1.5 truncate">{value}</div>
                      </div>
                    ))}
                  </div>

                  {verifiedVoter.POLLING_STATION_ADDRESS && (
                    <div className="bg-[#FAF8F5] border border-border rounded-md p-3 shadow-xs">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        Shop Address
                      </div>
                      <div className="text-xs text-foreground font-bold mt-1.5 leading-relaxed">{verifiedVoter.POLLING_STATION_ADDRESS}</div>
                    </div>
                  )}
                </div>

                {/* Print & Download Action Sidebar */}
                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  {shareMsg && <span className="text-xs text-primary font-medium text-center">{shareMsg}</span>}
                  <button
                    onClick={downloadCertificate}
                    className="btn-primary w-full justify-center shadow-xs cursor-pointer py-3 rounded-md flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Certificate
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-secondary w-full justify-center shadow-xs cursor-pointer py-3 rounded-md flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Print / PDF Membership Card
                  </button>
                  <button
                    onClick={downloadIdCardPng}
                    className="btn-primary w-full justify-center shadow-xs cursor-pointer py-3 rounded-md flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download ID Card (PNG)
                  </button>
                  <button
                    onClick={() => handleShare(generatedMno)}
                    className="bg-muted hover:bg-muted/80 text-foreground w-full justify-center py-3 rounded-md font-bold text-xs flex items-center gap-2 border border-border cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-4 h-4" /> Share Membership
                  </button>
                </div>
              </div>

              {/* Right Column: ID Card Render templates (Front/Back) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-md p-6 shadow-xs">
                <h3 className="font-display text-lg font-bold text-ink border-b border-border pb-3 mb-6">
                  Membership ID Card Preview
                </h3>
                
                <div className="flex flex-col items-center gap-6 rounded-md p-4 bg-background border border-border">
                  <div className="w-full">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 text-center">முன்பக்கம் · FRONT</p>
                    <div ref={frontRef} className="card-scale-wrapper">
                      <div className="responsive-card-scale">
                        <VoterIdCard voter={verifiedVoter} template="front" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-t border-border pt-5">
                    <p className="text-xs font-semibold text-slate-550 uppercase tracking-widest mb-2 text-center">பின்பக்கம் · BACK</p>
                    <div ref={backRef} className="card-scale-wrapper">
                      <div className="responsive-card-scale">
                        <VoterIdCard voter={verifiedVoter} template="back" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className={`text-sm text-ink font-medium wrap-break-word mt-0.5 ${mono ? "font-mono tracking-wide" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
