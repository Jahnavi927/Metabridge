import express, { Request, Response } from "express";
import {
  doctorSignup,
  doctorLogin,
  verifyDoctorOTP,
} from "../controllers/doctorController";
import { authenticate } from "../middleware/authMiddleware";
import { uploadReport } from "../middleware/upload";
import { pool } from "../db";

const router = express.Router();

/* ============================
   🔥 DEBUG ROUTE (DO NOT REMOVE)
   This proves routing is mounted
============================ */
router.get("/__test", (_req: Request, res: Response) => {
  res.json({ ok: true, route: "doctorRoutes mounted" });
});

/* ============================
   AUTH ROUTES
============================ */
router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);
router.post("/verify-otp", verifyDoctorOTP);

/* ============================
   GET PATIENTS LIST
============================ */
router.get(
  "/patients",
  authenticate,
  async (_req: any, res: Response) => {
    try {
      const result = await pool.query(
        `
        SELECT id, first_name, last_name, email
        FROM patients
        ORDER BY first_name
        `
      );
      res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("Fetch patients error:", err);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  }
);

/* ============================
   SEND MESSAGE TO PATIENT
============================ */
router.post(
  "/send-message",
  authenticate,
  async (req: any, res: Response) => {
    try {
      const { patient_id, message } = req.body;

      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized doctor" });
      }

      if (!patient_id || !message) {
        return res
          .status(400)
          .json({ message: "Patient ID and message are required" });
      }

      await pool.query(
        `
        INSERT INTO messages (doctor_id, patient_id, message)
        VALUES ($1, $2, $3)
        `,
        [req.user.id, Number(patient_id), message]
      );

      res.status(200).json({ message: "Message sent successfully" });
    } catch (err: any) {
      console.error("Send message error:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
);

/* ============================
   SEND REPORT
============================ */
router.post(
  "/send-report",
  authenticate,
  uploadReport.single("report"),
  async (req: any, res: Response) => {
    try {
      const { patient_id } = req.body;

      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized doctor" });
      }

      if (!patient_id) {
        return res.status(400).json({ message: "Patient ID missing" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Report file missing" });
      }

      const relativePath = `uploads/reports/${req.file.filename}`;

await pool.query(
  `
  INSERT INTO reports (doctor_id, patient_id, file_url, file_name)
  VALUES ($1, $2, $3, $4)
  `,
  [
    req.user.id,
    Number(patient_id),
    relativePath,              // ✅ ONLY RELATIVE PATH
    req.file.originalname,
  ]
);



      res.status(200).json({ message: "Report sent successfully" });
    } catch (err: any) {
      console.error("Send report error:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
);
router.post(
  "/appointment",
  authenticate,
  async (req: any, res: Response) => {
    try {
      const { patientId, date, time } = req.body;

      if (!patientId || !date || !time) {
        return res.status(400).json({ message: "Missing fields" });
      }

      await pool.query(
        `
        INSERT INTO appointments (doctor_id, patient_id, appointment_time)
        VALUES ($1, $2, $3)
        `,
        [
          req.user.id,
          Number(patientId),
          new Date(`${date} ${time}`)
        ]
      );

      res.status(201).json({ message: "Appointment scheduled" });
    } catch (err: any) {
      console.error("Appointment error:", err);
      res.status(500).json({ message: "Failed to schedule appointment" });
    }
  }
);


export default router;
