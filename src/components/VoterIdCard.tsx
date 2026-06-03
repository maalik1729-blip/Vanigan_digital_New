import headerLogo from "@/assets/349b584e-1b60-469e-9e5d-8d124cb057cb.png";
import rightLogo from "@/assets/ChatGPT Image Mar 25, 2026, 05_31_25 PM (1).png";
import ownerSign from "@/assets/8bb61dfb-f349-4e0b-8501-560feae9f000.png";

export type Voter = {
  ID: number;
  ASSEMBLY_NO: string;
  ASSEMBLY_NAME: string;
  PART_NO: string;
  SECTION_NO: string;
  SERIAL_NO: string;
  HOUSE_NO: string;
  VOTER_NAME: string;
  RELATION_TYPE: string;
  RELATION_NAME: string;
  EPIC_NO: string;
  MOBILE_NUMBER: string;
  AGE: string;
  GENDER: string;
  PART_NAME: string;
  POLLING_STATION_NAME: string;
  POLLING_STATION_ADDRESS: string;
  MAIN_TOWN: string;
  WARD: string;
  POST_OFFICE: string;
  POLICE_STATION: string;
  DISTRICT: string;
  PIN_CODE: string;
  PHOTO_URL?: string;
  BLOOD_GROUP?: string;
  DOB?: string;
  BUSINESS_TYPE?: string;
};

export type Template = "front" | "back";

/* ── Brand colors matching reference ── */
const RUST = "#7e534c";
const CHARCOAL = "#382a26";
const LIGHT_BG = "#faf7f6";
const TEXT_MUTED = "#8c7e7a";

/* ── Helpers ── */
function membershipNo(voter: Voter) {
  const base = voter.EPIC_NO.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6);
  const sn   = parseInt(voter.SERIAL_NO || "1").toString(16).padStart(2, "0").toUpperCase();
  return `TNVS-${base}${sn}`;
}

function PhotoBoxCircle({ photoUrl, size = 80 }: { photoUrl?: string; size?: number }) {
  return (
    <div style={{
      position: "relative",
      width: size + 16,
      height: size + 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Concentric Arc */}
      <div style={{
        position: "absolute",
        width: size + 12,
        height: size + 12,
        borderRadius: "50%",
        borderRight: "2px solid #7e534c",
        borderBottom: "2px solid #7e534c",
        borderLeft: "2px solid transparent",
        borderTop: "2px solid transparent",
        transform: "rotate(-20deg)",
      }} />

      {/* Main Circle Photo */}
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "1px solid #eef0f5",
        background: "#eef0f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {photoUrl ? (
          <img src={photoUrl} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <img
            src={rightLogo}
            alt="TNVS Logo"
            style={{
              width: "70%",
              height: "70%",
              objectFit: "contain",
              opacity: 0.55,
              borderRadius: "50%",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════ */
export function VoterIdCard({ voter, template }: { voter: Voter; template: Template }) {
  return (
    <div className="card-scale-wrapper">
      <div className="responsive-card-scale">
        {template === "back" ? <GovBack voter={voter} /> : <GovFront voter={voter} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FRONT — Portrait Premium Design
   ══════════════════════════════════════════════ */
function GovFront({ voter }: { voter: Voter }) {
  const name     = voter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
  const mno      = membershipNo(voter);
  const birthYear = new Date().getFullYear() - parseInt(voter.AGE || "30");

  return (
    <div style={{
      width: 240, height: 380,
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
      boxSizing: "border-box",
      flexShrink: 0,
      boxShadow: "0 8px 24px rgba(56, 42, 38, 0.15)",
      display: "flex",
      background: "#fff",
      border: "1px solid #dce3f0",
      position: "relative",
    }}>

      {/* ── Left Side Stripe ── */}
      <div style={{
        width: 60,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Top half: Rust brown */}
        <div style={{
          flex: 8, // ratio for upper part (80%)
          background: RUST,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#fff",
          }}>
            <img 
              src={headerLogo} 
              alt="Logo" 
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", transform: "rotate(90deg)" }} 
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 9.2, fontWeight: 800, letterSpacing: "0.05em", lineHeight: 1.1 }}>TAMILNADU VANIGARGALIN SANGAMAM</span>
              <span style={{ fontSize: 7, color: "rgba(255, 255, 255, 0.7)", letterSpacing: "0.02em" }}>MEMBERSHIP CARD</span>
            </div>
          </div>
        </div>

        {/* Bottom half: Dark charcoal with colorful logo */}
        <div style={{
          flex: 2, // ratio for bottom part (20%)
          background: CHARCOAL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 0",
        }}>
          <img 
            src={rightLogo} 
            alt="Logo" 
            style={{ width: 34, height: 34, objectFit: "contain", borderRadius: "50%" }} 
          />
        </div>
      </div>

      {/* ── Right Main Area ── */}
      <div style={{
        flex: 1,
        minWidth: 0,
        padding: "20px 14px 14px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}>
        {/* Profile Circle & Arc */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <PhotoBoxCircle photoUrl={voter.PHOTO_URL} size={70} />
        </div>

        {/* Member Name */}
        <div style={{ width: "100%", paddingLeft: 2 }}>
          <div style={{ 
            fontSize: 12, 
            fontWeight: 800, 
            color: CHARCOAL, 
            letterSpacing: "-0.01em", 
            lineHeight: 1.2,
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {name}
          </div>
          <div style={{ 
            fontSize: 7.5, 
            color: RUST, 
            fontWeight: 700, 
            textTransform: "capitalize", 
            letterSpacing: "0.04em",
            marginTop: 1
          }}>
            association member
          </div>
        </div>

        {/* Thin Separator Line */}
        <div style={{ width: "100%", height: 1, background: "#f0eceb", margin: "4px 0 6px 0" }} />

        {/* Details Block */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          <DetailBlockRow label="epic no" value={voter.EPIC_NO} />
          <DetailBlockRow label="assembly" value={voter.ASSEMBLY_NAME || "—"} />
          <DetailBlockRow label="district" value={voter.DISTRICT || "—"} />
          <DetailBlockRow label="gender" value={voter.GENDER || "—"} />
          <DetailBlockRow label="business type" value={voter.BUSINESS_TYPE || "Retail"} />
        </div>
      </div>
    </div>
  );
}

/* ── Front detail row helper ── */
function DetailBlockRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      width: "100%",
      background: LIGHT_BG,
      borderRadius: 4,
      padding: "6.5px 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span style={{ fontSize: 7.5, color: TEXT_MUTED, textTransform: "capitalize", letterSpacing: "0.02em" }}>
        {label} :
      </span>
      <span style={{ fontSize: 8.5, fontWeight: 700, color: CHARCOAL }}>
        {value}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BACK — Portrait Premium Design
   ══════════════════════════════════════════════ */
function GovBack({ voter }: { voter: Voter }) {
  const name     = voter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
  const mno      = membershipNo(voter);
  const mobile   = voter.MOBILE_NUMBER && voter.MOBILE_NUMBER !== "-" ? voter.MOBILE_NUMBER : "—";
  const rawAddress = voter.POLLING_STATION_ADDRESS || 
    (voter.HOUSE_NO ? `No ${voter.HOUSE_NO}, ${voter.MAIN_TOWN || voter.DISTRICT}` : "");
  const address = rawAddress
    ? rawAddress.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : "—";

  // Format Date of Birth
  let dobString = "—";
  if (voter.DOB) {
    const parts = voter.DOB.split("-");
    if (parts.length === 3) {
      dobString = `${parts[2]} / ${parts[1]} / ${parts[0]}`; // Convert YYYY-MM-DD to DD / MM / YYYY
    } else {
      dobString = voter.DOB; // fallback if already in custom format
    }
  } else {
    const birthYear = new Date().getFullYear() - parseInt(voter.AGE || "30");
    dobString = `01 / 01 / ${birthYear}`;
  }

  const qrData   = encodeURIComponent(`${name}|${mno}|${voter.ASSEMBLY_NAME}|${voter.DISTRICT}`);
  const qrUrl    = `https://api.qrserver.com/v1/create-qr-code/?size=48x48&data=${qrData}&color=382a26&bgcolor=ffffff&margin=2`;

  return (
    <div style={{
      width: 240, height: 380,
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
      boxSizing: "border-box",
      flexShrink: 0,
      boxShadow: "0 8px 24px rgba(56, 42, 38, 0.15)",
      display: "flex",
      background: "#fff",
      border: "1px solid #dce3f0",
      position: "relative",
    }}>

      {/* ── Left Main Area ── */}
      <div style={{
        flex: 1,
        minWidth: 0,
        padding: "20px 14px 14px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}>
        {/* Header: Member Info & Logo */}
        {/* Header: Member Info */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: CHARCOAL, textTransform: "capitalize", lineHeight: 1.1 }}>
            {name}
          </span>
          <span style={{ fontSize: 7, fontFamily: "monospace", color: RUST, fontWeight: 700, marginTop: 1 }}>
            {mno}
          </span>
        </div>

        {/* Details Block */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
          <BackDetailRow label="date of birth" value={dobString} />
          <BackDetailRow label="age" value={voter.AGE ? `${voter.AGE} yrs` : "—"} />
          <BackDetailRow label="blood group" value={voter.BLOOD_GROUP || "—"} />
          <BackDetailRow label="address" value={address} wrap />
          <BackDetailRow label="mobile" value={mobile} />
        </div>

        {/* Return Address, Signature, QR Code Footer */}
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "auto",
          borderTop: "1px solid #f0eceb",
          paddingTop: 8,
        }}>
          {/* Left Column: Return Address & Signature */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 105 }}>
            <span style={{ fontSize: 5.5, color: TEXT_MUTED, fontStyle: "italic", lineHeight: 1.25, display: "block" }}>
              If found, please return to: No 5/79, Saidapet, Chennai-600015
            </span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <img 
                src={ownerSign} 
                alt="Signature" 
                height={26} 
                style={{ height: 26, objectFit: "contain", opacity: 0.85 }} 
              />
              <span style={{ fontSize: 7, fontWeight: 700, color: CHARCOAL, textTransform: "uppercase", marginTop: 2, lineHeight: 1 }}>
                Senthil Kumar N
              </span>
              <span style={{ fontSize: 6, color: TEXT_MUTED, textTransform: "capitalize", lineHeight: 1 }}>
                State President
              </span>
            </div>
          </div>

          {/* Right Column: QR Code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img 
              src={qrUrl} 
              alt="QR Code" 
              width="42" 
              height="42"
              style={{ borderRadius: 2, border: "1px solid #eef0f5", display: "block" }} 
            />
            <span style={{ fontSize: 5, fontFamily: "monospace", color: TEXT_MUTED, marginTop: 2 }}>
              {mno.slice(-8)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Side Stripe (Flipped horizontal mirror) ── */}
      <div style={{
        width: 60,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Top half: Rust brown */}
        <div style={{
          flex: 8,
          background: RUST,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#fff",
          }}>
            <img 
              src={headerLogo} 
              alt="Logo" 
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", transform: "rotate(90deg)" }} 
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 9.2, fontWeight: 800, letterSpacing: "0.05em", lineHeight: 1.1 }}>TAMILNADU VANIGARGALIN SANGAMAM</span>
              <span style={{ fontSize: 7, color: "rgba(255, 255, 255, 0.7)", letterSpacing: "0.02em" }}>MEMBERSHIP CARD</span>
            </div>
          </div>
        </div>

        {/* Bottom half: Dark charcoal with colorful logo */}
        <div style={{
          flex: 2,
          background: CHARCOAL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 0",
        }}>
          <img 
            src={rightLogo} 
            alt="Logo" 
            style={{ width: 34, height: 34, objectFit: "contain", borderRadius: "50%" }} 
          />
        </div>
      </div>
    </div>
  );
}

/* ── Back detail row helper ── */
function BackDetailRow({ label, value, wrap }: { label: string; value: string; wrap?: boolean }) {
  return (
    <div style={{
      display: "flex",
      alignItems: wrap ? "flex-start" : "center",
      gap: 6,
    }}>
      <span style={{
        fontSize: 7.8,
        color: RUST,
        fontWeight: 700,
        textTransform: "uppercase",
        width: 72,
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}>
        {label}
      </span>
      <span style={{ fontSize: 8, color: TEXT_MUTED }}>:</span>
      <span style={{
        fontSize: 8.5,
        fontWeight: 700,
        color: CHARCOAL,
        whiteSpace: wrap ? "normal" : "nowrap",
        overflow: wrap ? "visible" : "hidden",
        textOverflow: wrap ? "clip" : "ellipsis",
        lineHeight: 1.25,
        wordBreak: wrap ? "break-word" : "normal",
      }}>
        {value}
      </span>
    </div>
  );
}
