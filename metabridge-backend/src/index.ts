import dotenv from "dotenv";
import { pool } from "./db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`[INFO] Server running on port ${PORT}`);

  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err: any) {
    console.error("❌ DB connection error:", err.message || err);
  }
});
