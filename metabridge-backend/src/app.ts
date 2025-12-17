import express from "express";
import cors from "cors";
import path from "path";

import doctorRoutes from "./routes/doctorRoutes";
import patientRoutes from "./routes/patientRoutes";
import authRoutes from "./routes/auth"; // ✅ ADD THIS

const app = express();

// ✅ CORS (frontend localhost allowed)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Serve uploaded reports
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// ✅ Routes
app.use("/api/auth", authRoutes);       // ✅ users register/login
app.use("/api/doctor", doctorRoutes);   // doctor OTP, send-report
app.use("/api/patient", patientRoutes); // patient OTP, dashboard

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("✅ MetaBridge backend running successfully");
});

export default app;
