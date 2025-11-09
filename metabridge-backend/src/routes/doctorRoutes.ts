import express from "express";
import { doctorSignup, doctorLogin, verifyDoctorOTP } from "../controllers/doctorController";

const router = express.Router();

router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);
router.post("/verify-otp", verifyDoctorOTP);

export default router;
