import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../src/db";

export const registerPatient = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      password,
      emergency_contact,
      emergency_phone,
      two_factor_enabled,
    } = req.body;

    // Check if already exists
    const existing = await pool.query("SELECT * FROM patients WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new patient
    const newPatient = await pool.query(
      `INSERT INTO patients 
      (first_name, last_name, email, phone, date_of_birth, password, emergency_contact, emergency_phone, two_factor_enabled)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, first_name, last_name, email`,
      [
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        hashedPassword,
        emergency_contact,
        emergency_phone,
        two_factor_enabled,
      ]
    );

    const patient = newPatient.rows[0];
    const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.status(201).json({ message: "Patient registered", patient, token });
  } catch (error: any) {
    console.error("Patient registration error:", error);
    res.status(500).json({ message: "Error registering patient" });
  }
};

export const loginPatient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM patients WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const patient = result.rows[0];
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    delete patient.password;

    res.json({ token, patient });
  } catch (error: any) {
    console.error("Patient login error:", error);
    res.status(500).json({ message: "Error logging in patient" });
  }
};
