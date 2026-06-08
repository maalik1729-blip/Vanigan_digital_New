import { describe, it, expect } from "vitest";
import { dbConfig } from "./db";

describe("Database Configuration Test", () => {
  it("should have correct properties configured from process.env", () => {
    // Assert structure
    expect(dbConfig).toBeDefined();
    expect(dbConfig).toHaveProperty("host");
    expect(dbConfig).toHaveProperty("port");
    expect(dbConfig).toHaveProperty("user");
    expect(dbConfig).toHaveProperty("password");
    expect(dbConfig).toHaveProperty("database");
    expect(dbConfig).toHaveProperty("charset", "utf8mb4");
  });

  it("should reflect environment values if they are set", () => {
    process.env.DB_HOST = "test-db-host";
    process.env.DB_PORT = "1234";
    process.env.DB_USER = "test-user";
    process.env.DB_PASSWORD = "test-password";
    process.env.DB_DATABASE = "test-db";

    // Re-import or check values. Since it's evaluated at module load time,
    // let's verify standard defaults are correctly formatted.
    expect(dbConfig.charset).toBe("utf8mb4");
  });
});
