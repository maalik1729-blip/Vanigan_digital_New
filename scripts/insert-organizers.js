import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

const organizers = [
  {
    organizer_code: "TNVS-ORG-001",
    name: "Senthil Kumar N",
    mobile: "+91 9840012345",
    email: "senthilkumar@tnvs.org",
    role: "Founder & State President",
    district: "Chennai",
    assembly: "Saidapet",
    pin: "1234",
    status: "active"
  },
  {
    organizer_code: "TNVS-ORG-002",
    name: "M. Manimaran",
    mobile: "+91 9444098765",
    email: "manimaran@tnvs.org",
    role: "State General Secretary",
    district: "Thiruvallur",
    assembly: "Gummidipoondi",
    pin: "1234",
    status: "active"
  },
  {
    organizer_code: "TNVS-ORG-003",
    name: "Rajendran K",
    mobile: "+91 9841098765",
    email: "rajendran@tnvs.org",
    role: "State Treasurer",
    district: "Kanchipuram",
    assembly: "Tambaram",
    pin: "1234",
    status: "active"
  },
  {
    organizer_code: "TNVS-ORG-004",
    name: "Saravanabalan",
    mobile: "+91 9994012345",
    email: "saravanabalan@tnvs.org",
    role: "Coimbatore District Coordinator",
    district: "Coimbatore",
    assembly: "Coimbatore South",
    pin: "1234",
    status: "active"
  },
  {
    organizer_code: "TNVS-ORG-005",
    name: "Agasthiya D",
    mobile: "+91 9894012345",
    email: "agasthiya@tnvs.org",
    role: "Youth Wing Secretary",
    district: "Madurai",
    assembly: "Madurai Central",
    pin: "1234",
    status: "active"
  },
  {
    organizer_code: "TNVS-ORG-006",
    name: "Devi Priya",
    mobile: "+91 9790012345",
    email: "devipriya@tnvs.org",
    role: "Women Wing President",
    district: "Trichy",
    assembly: "Trichy East",
    pin: "1234",
    status: "active"
  }
];

async function main() {
  console.log("Connecting to database...");
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    console.log("Clearing existing organizers...");
    await conn.execute("TRUNCATE TABLE organizer_list");

    console.log("Inserting organizers...");
    const query = `
      INSERT INTO organizer_list (
        organizer_code, name, mobile, email, role, district, assembly, pin, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const org of organizers) {
      await conn.execute(query, [
        org.organizer_code,
        org.name,
        org.mobile,
        org.email,
        org.role,
        org.district,
        org.assembly,
        org.pin,
        org.status
      ]);
      console.log(`Inserted: ${org.name} (${org.role})`);
    }
    console.log("All sample organizers inserted successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await conn.end();
  }
}

main();
