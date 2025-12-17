import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * ✅ Absolute directory where files are stored on disk
 * Uses project root (safe for dev + prod)
 */
const uploadDir = path.join(process.cwd(), "uploads", "reports");

/**
 * ✅ Ensure directory exists
 */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * ✅ Multer storage configuration
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    cb(null, `${Date.now()}-${safeName}`);
  },
});

/**
 * ✅ File type validation
 */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only PDF, PNG, JPG files are allowed"));
    return;
  }

  cb(null, true);
};

/**
 * ✅ Export upload middleware
 */
export const uploadReport = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
