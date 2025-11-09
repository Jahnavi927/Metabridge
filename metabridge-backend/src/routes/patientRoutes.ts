import express from "express";
import { registerPatient, loginPatient, verifyPatientOTP } from "../controllers/patientController";

const router = express.Router();

// ✅ Patient Registration
router.post("/register", registerPatient);

// ✅ Patient Login (password check + OTP generation)
router.post("/login", loginPatient);

// ✅ Patient OTP Verification
router.post("/verify-otp", verifyPatientOTP);

export default router;
