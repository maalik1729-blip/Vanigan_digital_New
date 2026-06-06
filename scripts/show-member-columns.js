import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

async function main() {
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    const [columns] = await conn.execute("DESCRIBE member_list");
    console.log("Columns in 'member_list' table:");
    console.log(columns.map(c => `${c.Field} (${c.Type}) - Nullable: ${c.Null}`).join('\n'));
  } catch (err) {
    console.error("Error describing member_list:", err);
  } finally {
    await conn.end();
  }
}

main();
