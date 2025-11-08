import express from "express";
import { doctorSignup, doctorLogin } from "../controllers/doctorController.ts";

const router = express.Router();

router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);

export default router;
