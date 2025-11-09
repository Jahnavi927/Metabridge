import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from "../config";
import { generateOTP } from "../utils/otpHelper";
import { sendEmailOTP, sendSmsOTP } from "../utils/notification";

// ✅ Doctor Signup
export const doctorSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, specialization, license_number, hospital_name, contact_no } = req.body;

    const existing = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
    if (existing.rows.length > 0) return res.status(400).json({ message: "Doctor already exists" });

    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO doctors 
       (name, email, password, specialization, license_number, hospital_name, contact_no, otp, otp_expiry)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NULL,NULL)
       RETURNING id, name, email, specialization, license_number, hospital_name, contact_no`,
      [name, email, hashed, specialization, license_number, hospital_name, contact_no || null]
    );

    const doctor = result.rows[0];
    const token = jwt.sign({ id: doctor.id, email: doctor.email }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "Doctor registered", doctor, token });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Doctor Login → Sends OTP
export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
    const doctor = result.rows[0];
    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await pool.query("UPDATE doctors SET otp=$1, otp_expiry=$2 WHERE email=$3", [otp, otpExpiry, email]);

    await sendEmailOTP(email, otp);
    if (doctor.contact_no) await sendSmsOTP(doctor.contact_no, otp);

    res.status(200).json({ message: "OTP sent to your email/phone" });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Doctor OTP Verification
export const verifyDoctorOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(400).json({ message: "Doctor not found" });

    const doctor = result.rows[0];
    if (!doctor.otp || !doctor.otp_expiry) return res.status(400).json({ message: "OTP not requested" });
    if (new Date() > doctor.otp_expiry) return res.status(400).json({ message: "OTP expired" });
    if (otp !== doctor.otp) return res.status(400).json({ message: "Invalid OTP" });

    await pool.query("UPDATE doctors SET otp=NULL, otp_expiry=NULL WHERE email=$1", [email]);
    const token = jwt.sign({ id: doctor.id, email: doctor.email }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", doctor, token });
  } catch (err: any) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
