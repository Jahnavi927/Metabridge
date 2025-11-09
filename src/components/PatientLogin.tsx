import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, User, Shield } from "lucide-react";
import { HeartbeatLogo } from "./HeartbeatLogo";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigation, useAuth } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import api from "../api/api";

export function PatientLogin() {
  const { navigateTo } = useNavigation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    twoFactorCode: "",
  });

  // ✅ Auto-login if remembered
  useEffect(() => {
    const storedUser = localStorage.getItem("metabridge_user");
    const storedRole = localStorage.getItem("metabridge_role");
    if (storedUser && storedRole === "patient") {
      navigateTo("patient-dashboard");
    }
  }, [navigateTo]);

  // ✅ Input handler
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Login + Verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otpSent) {
        // Step 1 — Request OTP
        const res = await api.post("/patient/login", {
          email: formData.email.trim(),
          password: formData.password,
        });

        alert(res.data.message || "OTP sent to your phone/email.");
        setOtpSent(true);
      } else {
        // Step 2 — Verify OTP
        const res = await api.post("/patient/verify-otp", {
          email: formData.email.trim(),
          otp: otp.trim(),
        });

        const { token, patient } = res.data;

        if (rememberMe) {
          localStorage.setItem("metabridge_user", JSON.stringify(patient));
          localStorage.setItem("metabridge_role", "patient");
        }

        const name =
          patient?.name || formData.name || formData.email.split("@")[0];
        login({ name, email: formData.email }, "patient");

        alert(`✅ Welcome back, ${name}`);
        navigateTo("patient-dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Cannot connect to server. Please check your backend."
          : "Login failed. Please verify credentials or OTP.");
      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HeartbeatLogo size="md" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Meta Bridge
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigateTo("role-selection")}
              className="border-slate-300 dark:border-slate-600"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mt-24"
      >
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg mx-auto">
            <User className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl text-center mb-2 text-slate-900 dark:text-white">
            Patient Login
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Access your healthcare records securely
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-2"
                placeholder="John Doe"
                required
                disabled={otpSent}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-2"
                placeholder="patient@example.com"
                required
                disabled={otpSent}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => navigateTo("patient-signup")}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  disabled={otpSent}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  disabled={otpSent}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* OTP input */}
            {otpSent && (
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="Enter OTP"
                  className="mt-2"
                  required
                />
              </div>
            )}

            {/* Remember Me + 2FA */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900">
              <Label htmlFor="remember" className="text-purple-900 dark:text-purple-100">
                Remember Me
              </Label>
              <Switch id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900">
              <Label htmlFor="twoFactorToggle" className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Two-Factor Authentication
              </Label>
              <Switch
                id="twoFactorToggle"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            {twoFactorEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <Label htmlFor="twoFactorCode">2FA Code</Label>
                <Input
                  id="twoFactorCode"
                  value={formData.twoFactorCode}
                  onChange={(e) => handleChange("twoFactorCode", e.target.value)}
                  className="mt-2"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {loading
                ? "Processing..."
                : otpSent
                ? "Verify OTP & Login"
                : "Login to Patient Portal"}
            </Button>

            <p className="text-center text-slate-600 dark:text-slate-400">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigateTo("patient-signup")}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign up here
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
