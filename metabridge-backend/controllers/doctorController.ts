import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../src/db";
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from "../src/config";

// ✅ Doctor Signup
export const doctorSignup = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      license_number,
      hospital_name,
    } = req.body;

    // check if doctor already exists
    const existing = await pool.query(
      "SELECT * FROM doctors WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // insert into table
    const result = await pool.query(
      `INSERT INTO doctors (name, email, password, specialization, license_number, hospital_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, specialization, license_number, hospital_name`,
      [name, email, hashed, specialization, license_number, hospital_name]
    );

    const doctor = result.rows[0];

    // generate token
    const token = jwt.sign({ id: doctor.id, email: doctor.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "Doctor registered", doctor, token });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Doctor Login
export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM doctors WHERE email = $1", [
      email,
    ]);
    const doctor = result.rows[0];

    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor.id, email: doctor.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", doctor, token });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
