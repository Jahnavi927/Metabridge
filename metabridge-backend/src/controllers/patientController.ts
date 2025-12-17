import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from "../config";
import { generateOTP } from "../utils/otpHelper";
import { sendEmailOTP, sendSmsOTP } from "../utils/notification";

/* ================================
   PATIENT SIGNUP
================================ */
export const registerPatient = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      emergencyContact,
      emergencyPhone,
      twoFactorEnabled
    } = req.body;

    const existing = await pool.query(
      "SELECT * FROM patients WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      BCRYPT_SALT_ROUNDS
    );

    const result = await pool.query(
      `INSERT INTO patients
        (first_name, last_name, email, phone, date_of_birth, password,
         emergency_contact, emergency_phone, two_factor_enabled)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, first_name, last_name, email, phone,
                 date_of_birth, emergency_contact,
                 emergency_phone, two_factor_enabled`,
      [
        firstName,
        lastName,
        email,
        phone || null,
        dateOfBirth || null,
        hashedPassword,
        emergencyContact || null,
        emergencyPhone || null,
        twoFactorEnabled || false
      ]
    );

    const patient = result.rows[0];

    // ✅ JWT now includes role
    const token = jwt.sign(
      {
        id: patient.id,
        role: "patient"
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Patient registered",
      patient,               // ⬅️ kept for UI
      user: {
        id: patient.id,
        role: "patient"
      },
      token
    });

  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* ================================
   PATIENT LOGIN (PASSWORD → OTP)
================================ */
export const loginPatient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM patients WHERE email=$1",
      [email]
    );

    const patient = result.rows[0];
    if (!patient) {
      return res.status(400).json({ message: "Patient not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      patient.password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await pool.query(
      "UPDATE patients SET otp=$1, otp_expiry=$2 WHERE email=$3",
      [otp, otpExpiry, email]
    );

    await sendEmailOTP(email, otp);
    if (patient.phone) {
      await sendSmsOTP(patient.phone, otp);
    }

    res.status(200).json({
      message: "OTP sent to your email/phone"
    });

  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* ================================
   PATIENT OTP VERIFICATION
================================ */
export const verifyPatientOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      "SELECT * FROM patients WHERE email=$1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(400).json({ message: "Patient not found" });
    }

    const patient = result.rows[0];

    if (!patient.otp || !patient.otp_expiry) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (new Date() > patient.otp_expiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otp !== patient.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    await pool.query(
      "UPDATE patients SET otp=NULL, otp_expiry=NULL WHERE email=$1",
      [email]
    );

    // ✅ JWT now includes role
    const token = jwt.sign(
      {
        id: patient.id,
        role: "patient"
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      patient,               // ⬅️ kept for UI
      user: {
        id: patient.id,
        role: "patient"
      },
      token
    });

  } catch (err: any) {
    console.error("OTP verification error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
