import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({ path: "./.env" });

// Log loaded environment variables
console.log("🔍 Loaded ENV:", {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  db: process.env.PGDATABASE,
  password: process.env.PGPASSWORD ? "✅ exists" : "❌ missing",
});

// Create PostgreSQL pool
export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

// Connect only in dev/prod (not in test)
if (process.env.NODE_ENV !== "test") {
  pool
    .connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch((err: any) => console.error("DB connection error:", err));
}
