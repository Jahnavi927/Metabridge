import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;

export const DATABASE_URL = process.env.DATABASE_URL || "";

export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const BCRYPT_SALT_ROUNDS = Number(
  process.env.BCRYPT_SALT_ROUNDS || 10
);
