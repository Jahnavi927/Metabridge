import express from "express";
import cors from "cors";
import doctorRoutes from "./src/routes/doctorRoutes";
import patientRoutes from "../routes/patientRoutes";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Separate route prefixes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);


// Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("✅ MetaBridge backend running successfully");
});

export default app;
