import rightLogo from "@/assets/ChatGPT Image Mar 25, 2026, 05_31_25 PM (1).png";
import ownerSign from "@/assets/8bb61dfb-f349-4e0b-8501-560feae9f000.png";
import { ZONE_BREAKDOWN } from "@/data/zones";

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

/* ── Helpers ── */
export function membershipNo(voter: Voter) {
  const base = voter.EPIC_NO.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6);
  const sn = parseInt(voter.SERIAL_NO || "1", 10).toString(16).padStart(2, "0").toUpperCase();
  return `TNV-${base}${sn}`;
}

export function getZoneName(district?: string, assemblyName?: string): string {
  if (!district && !assemblyName) return "North Zone";
  const dist = district?.toUpperCase().trim() || "";
  const assm = assemblyName?.toLowerCase().trim() || "";

  const found = ZONE_BREAKDOWN.find(
    (item) =>
      item.district.toUpperCase().trim() === dist &&
      item.constituency.toLowerCase().trim() === assm
  );

  if (found) {
    return found.zone.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const foundByDist = ZONE_BREAKDOWN.find(
    (item) => item.district.toUpperCase().trim() === dist
  );
  if (foundByDist) {
    return foundByDist.zone.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return "North Zone";
}

export function formatDob(dob?: string, age?: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (dob) {
    const d = new Date(dob);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    }
    const parts = dob.split("-");
    if (parts.length === 3) {
      const yr = parseInt(parts[0], 10);
      const mo = parseInt(parts[1], 10) - 1;
      const dy = parseInt(parts[2], 10);
      if (mo >= 0 && mo < 12) {
        return `${String(dy).padStart(2, "0")} ${months[mo]} ${yr}`;
      }
    }
    return dob;
  }
  const birthYear = new Date().getFullYear() - parseInt(age || "30", 10);
  return `01 Jan ${birthYear}`;
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════ */
export function VoterIdCard({ voter, template }: { voter: Voter; template: Template }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .card-scale-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          overflow: hidden;
          padding: 10px 0;
        }

        .responsive-card-scale {
          transform-origin: center center;
          transition: transform 0.2s ease-in-out;
          flex-shrink: 0;
        }

        .card-face {
          width: 421px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
          box-sizing: border-box;
          text-align: left;
          border-radius: 24px;
        }

        .card-face * {
          box-sizing: border-box;
        }

        #page1-div {
          background-image: url(https://res.cloudinary.com/dqndhcmu2/image/upload/v1773232516/vanigan/templates/ID_Front.png);
          background-repeat: no-repeat;
          background-size: 421px 590px;
          background-position: center;
          height: 590px;
        }

        #page2-div {
          background-image: url(https://res.cloudinary.com/dqndhcmu2/image/upload/v1773232519/vanigan/templates/ID_Back.png);
          background-repeat: no-repeat;
          background-size: 421px 590px;
          background-position: center;
          height: 590px;
        }

        .front-photo-wrap {
          position: absolute;
          top: 182px;
          left: 50%;
          transform: translateX(-50%);
          width: 137px;
        }

        .front-stack {
          position: absolute;
          top: 328px;
          left: 28px;
          right: 28px;
          text-align: center;
        }

        .front-stack > * + * {
          margin-top: 5px;
        }

        .front-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          margin-top: 3px;
        }

        .photo {
          display: block;
          margin: 0 auto;
          border: none;
          border-radius: 20px;
          width: 133px;
          height: 133px;
          object-fit: cover;
          object-position: center top;
          padding: 0;
          background: #ffffff;
          box-shadow:
            0 0 0 1px rgba(0, 146, 69, 0.1),
            0 6px 24px rgba(0, 92, 69, 0.30),
            0 2px 6px rgba(0, 92, 69, 0.14);
        }

        .name {
          font-size: 21px;
          font-weight: 800;
          color: #009245;
          line-height: 1.15;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .detail-line {
          font-size: 13.5px;
          font-weight: 600;
          color: #1f2937;
          text-transform: capitalize;
          line-height: 1.3;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .front-line {
          text-align: center;
          word-break: break-word;
          padding: 0 18px;
        }

        .suffix-tag {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: #009245;
          border-radius: 4px;
          padding: 1.5px 5px;
          margin-left: 4px;
          vertical-align: middle;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .id-number {
          font-size: 17px;
          font-weight: 800;
          color: #111827;
          letter-spacing: 0.12em;
          margin-top: 6px;
          font-variant-numeric: tabular-nums;
        }

        .back-content {
          position: absolute;
          top: 234px;
          left: 22px;
          right: 20px;
        }

        .back-details {
          transform: translateY(-60px);
        }

        .back-row {
          display: grid;
          grid-template-columns: 40% 5% 55%;
          align-items: start;
          margin-bottom: 7px;
        }

        .back-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.08em;
          padding-top: 2px;
        }

        .back-sep {
          font-size: 15px;
          line-height: 1;
          text-align: center;
          font-weight: 400;
          color: #d1d5db;
          padding-top: 1px;
        }

        .back-value {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
          word-break: break-word;
          letter-spacing: 0.01em;
        }

        .back-value.address {
          line-height: 1.25;
        }

        .back-bottom {
          display: grid;
          grid-template-columns: 40% 60%;
          align-items: start;
          margin-top: -20px;
        }

        .qr-wrap {
          padding-left: 20px;
        }

        .sign-wrap {
          text-align: center;
          padding-right: 10px;
        }

        .signature-name {
          text-align: center;
          margin: 2px 0 0;
          font-size: 12.5px;
          font-weight: 800;
          color: #111827;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .small-text {
          font-size: 10px;
          font-weight: 500;
          color: #4b5563;
          line-height: 1.3;
          margin: 1px 0 0;
          letter-spacing: 0.01em;
        }

        .contact-value {
          background: rgba(255, 255, 255, 0.78);
          display: inline-block;
          padding: 1px 4px;
          border-radius: 4px;
        }

        @media print {
          #page1-div,
          #page2-div {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        @media (max-width: 500px) {
          .responsive-card-scale {
            transform: scale(0.85) !important;
          }
        }
        @media (max-width: 420px) {
          .responsive-card-scale {
            transform: scale(0.75) !important;
          }
        }
        @media (max-width: 360px) {
          .responsive-card-scale {
            transform: scale(0.65) !important;
          }
        }
      `}</style>
      {template === "back" ? <GovBack voter={voter} /> : <GovFront voter={voter} />}
    </>
  );
}

/* ══════════════════════════════════════════════
   FRONT — Portrait Premium Design
   ══════════════════════════════════════════════ */
function GovFront({ voter }: { voter: Voter }) {
  const name = voter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
  const mno = membershipNo(voter);
  const zoneName = getZoneName(voter.DISTRICT, voter.ASSEMBLY_NAME);

  return (
    <div id="page1-div" className="card-face">
      <div className="front-photo-wrap">
        <img
          src={voter.PHOTO_URL || "https://via.placeholder.com/137x136"}
          crossOrigin="anonymous"
          className="photo"
          alt={name}
        />
      </div>

      <div className="front-stack">
        <div className="front-line">
          <p className="name">{name}</p>
        </div>
        <div className="front-meta">
          <div className="front-line">
            <p className="detail-line">
              <span style={{color:'#6b7280', fontWeight:600, fontSize:'0.82em', letterSpacing:'0.05em', textTransform:'uppercase'}}>Assembly</span>
              {" : "}{voter.ASSEMBLY_NAME || "—"}
            </p>
          </div>
          <div className="front-line">
            <p className="detail-line">
              <span style={{color:'#6b7280', fontWeight:600, fontSize:'0.82em', letterSpacing:'0.05em', textTransform:'uppercase'}}>Dist</span>
              {" : "}{voter.DISTRICT || "—"}
            </p>
          </div>
          <div className="front-line">
            <p className="detail-line">
              <span style={{color:'#6b7280', fontWeight:600, fontSize:'0.82em', letterSpacing:'0.05em', textTransform:'uppercase'}}>Zone</span>
              {" : "}{zoneName}</p>
          </div>
          <div className="front-line">
            <p className="id-number">{mno}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BACK — Portrait Premium Design
   ══════════════════════════════════════════════ */
function GovBack({ voter }: { voter: Voter }) {
  const name = voter.VOTER_NAME.replace(/\s*-\s*$/, "").trim();
  const mno = membershipNo(voter);
  const dobString = formatDob(voter.DOB, voter.AGE);
  const mobile = voter.MOBILE_NUMBER && voter.MOBILE_NUMBER !== "-" ? voter.MOBILE_NUMBER : "—";
  
  const rawAddress =
    voter.POLLING_STATION_ADDRESS ||
    (voter.HOUSE_NO ? `No ${voter.HOUSE_NO}, ${voter.MAIN_TOWN || voter.DISTRICT}` : "");
  const address = rawAddress
    ? rawAddress.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=96x88&data=${encodeURIComponent(mno)}`;

  return (
    <div id="page2-div" className="card-face">
      <div className="back-content">
        <div className="back-details">
          <div className="back-row">
            <div className="back-label">DATE OF BIRTH</div>
            <div className="back-sep">:</div>
            <div className="back-value">{dobString}</div>
          </div>

          <div className="back-row">
            <div className="back-label">AGE</div>
            <div className="back-sep">:</div>
            <div className="back-value">{voter.AGE || "—"}</div>
          </div>

          <div className="back-row">
            <div className="back-label">BLOOD GROUP</div>
            <div className="back-sep">:</div>
            <div className="back-value">{voter.BLOOD_GROUP || "—"}</div>
          </div>

          <div className="back-row">
            <div className="back-label">ADDRESS</div>
            <div className="back-sep">:</div>
            <div className="back-value address">{address}</div>
          </div>

          <div className="back-row" style={{ marginTop: "8px" }}>
            <div className="back-label">CONTACT</div>
            <div className="back-sep">:</div>
            <div className="back-value">
              <span className="contact-value">{mobile}</span>
            </div>
          </div>
        </div>

        <div className="back-bottom">
          <div className="qr-wrap">
            <img src={qrUrl} width="96" height="88" alt="QR Code" />
          </div>
          <div className="sign-wrap">
            <img
              src={ownerSign}
              alt="Signature"
              style={{ height: 75, objectFit: "contain", opacity: 0.9, display: "block", margin: "-18px auto -12px" }}
            />
            <p className="signature-name">SENTHIL KUMAR N</p>
            <p className="small-text">Founder &amp; State President</p>
            <p className="small-text">Tamilnadu Vanigargalin Sangamam</p>
          </div>
        </div>
      </div>
    </div>
  );
}
