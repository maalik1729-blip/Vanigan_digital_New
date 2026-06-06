import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

async function showStructure() {
  const conn = await mysql.createConnection(DB_CONFIG);
  const [columns] = await conn.execute("DESCRIBE business_list");
  console.log("\nTable: business_list\n");
  columns.forEach(col => {
    console.log(`${col.Field.padEnd(20)} ${col.Type.padEnd(20)} ${col.Null} ${col.Key} ${col.Default || ''}`);
  });
  await conn.end();
}

showStructure().catch(console.error);
