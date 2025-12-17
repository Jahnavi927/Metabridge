import nodemailer from "nodemailer";
import twilio from "twilio";

// ✅ Explicit SMTP config (CORRECT WAY)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // MUST be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// ✅ Send OTP via Email
export const sendEmailOTP = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"MetaBridge Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your MetaBridge OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    });
    console.log(`📧 Email OTP sent to ${email}: ${otp}`);
  } catch (err) {
    console.error("Email OTP Error:", err);
  }
};

// ✅ Send OTP via SMS (UNCHANGED)
const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const sendSmsOTP = async (phone: string, otp: string) => {
  try {
    await client.messages.create({
      body: `Your MetaBridge OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
    console.log(`📱 SMS OTP sent to ${phone}: ${otp}`);
  } catch (err) {
    console.error("SMS OTP Error:", err);
  }
};
