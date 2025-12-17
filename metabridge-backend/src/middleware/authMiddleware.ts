import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

/**
 * Extend Express Request to include user
 * (does NOT change runtime behavior)
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * JWT Authentication Middleware
 * (same logic, just properly typed)
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // 🔥 TEMP DEBUG LOG (ADD THIS)
    console.log("JWT payload:", payload);

    req.user = {
      id: payload.id,
      email: payload.email,   // may be undefined → important
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
