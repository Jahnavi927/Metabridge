// src/db.ts
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Load .env file (adjust path if needed)
dotenv.config({ path: "./.env" });

// Helper to ensure a variable exists
const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`⚠️ Environment variable ${key} is missing`);
  }
  return value || "";
};

// Log loaded environment variables (without printing password)
console.log("🔍 Loaded ENV:", {
  user: process.env.PGUSER ? "✅ exists" : "❌ missing",
  host: process.env.PGHOST ? "✅ exists" : "❌ missing",
  db: process.env.PGDATABASE ? "✅ exists" : "❌ missing",
  password: process.env.PGPASSWORD ? "✅ exists" : "❌ missing",
});

// Create PostgreSQL pool
export const pool = new Pool({
  user: requireEnv("PGUSER"),
  host: requireEnv("PGHOST"),
  database: requireEnv("PGDATABASE"),
  password: requireEnv("PGPASSWORD"),
  port: Number(process.env.PGPORT) || 5432,
  max: 10,           // optional: max connections
  idleTimeoutMillis: 30000, // optional: idle timeout
});

// Connect immediately in dev/prod (not in test)
if (process.env.NODE_ENV !== "test") {
  pool
    .connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch((err: any) =>
      console.error("❌ DB connection error:", err.message || err)
    );
}

// Optional: Export a query helper for convenience
export const query = (text: string, params?: any[]) => pool.query(text, params);
