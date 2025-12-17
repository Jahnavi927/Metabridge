import express from "express";
import {
  registerPatient,
  loginPatient,
  verifyPatientOTP,
} from "../controllers/patientController";
import { authenticate } from "../middleware/authMiddleware";
import { pool } from "../db";

const router = express.Router();

/* ============================
   AUTH ROUTES (UNCHANGED)
============================ */
router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/verify-otp", verifyPatientOTP);

/* ============================
   GET PATIENT MESSAGES
============================ */
router.get(
  "/messages",
  authenticate,
  async (req: any, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          m.id,
          m.message,
          m.created_at,
          d.name AS doctor_name
        FROM messages m
        JOIN doctors d ON d.id = m.doctor_id
        WHERE m.patient_id = $1
        ORDER BY m.created_at DESC
        `,
        [req.user.id]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }
);

/* ============================
   GET PATIENT REPORTS
============================ */
router.get(
  "/reports",
  authenticate,
  async (req: any, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          r.id,
          r.file_name,
          r.file_url,
          r.created_at
        FROM reports r
        JOIN patients p ON p.id = r.patient_id
        WHERE r.patient_id = $1
        ORDER BY r.created_at DESC
        `,
        [req.user.id] // users.id from JWT
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Reports fetch error:", err);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  }
);

/* ============================
   GET PATIENT APPOINTMENTS
============================ */
router.get(
  "/appointments",
  authenticate,
  async (req: any, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          a.id,
          d.name AS doctor,
          a.reason,
          a.appointment_time
        FROM appointments a
        JOIN doctors d ON d.id = a.doctor_id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_time DESC
        `,
        [req.user.id]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Appointments fetch error:", err);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  }
);


export default router;
