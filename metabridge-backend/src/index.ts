// ✅ src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import doctorRoutes from "../routes/doctorRoutes";
import patientRoutes from "../routes/patientRoutes"; // 👈 Patient routes

dotenv.config();

const app = express();

// ✅ CORS setup — allow all localhost ports (for dev)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) {
        callback(null, true); // ✅ allow any localhost (5173, 3000, 3002, etc.)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // Set to true only if using cookies/sessions
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Metabridge backend is running successfully");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[INFO] Server running on port ${PORT}`));

// ✅ Test DB Connection
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error:", err));
