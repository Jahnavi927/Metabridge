import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Stethoscope } from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation, useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import api from '../api/api';

export function DoctorLogin() {
  const { navigateTo } = useNavigation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    twoFactorCode: ''
  });

  // ✅ Auto-login if doctor remembered
  useEffect(() => {
    const rememberedUser = localStorage.getItem('doctorUser');
    const token = localStorage.getItem('doctorToken');
    if (rememberedUser && token) {
      const parsed = JSON.parse(rememberedUser);
      login(parsed, 'doctor');
      navigateTo('doctor-dashboard');
    }
  }, [login, navigateTo]);

  // ✅ Input change handler
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Submit handler (Login or Verify OTP)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otpSent) {
        // Step 1: attempt login -> backend sends OTP
        const res = await api.post('/doctor/login', {
          email: formData.email.trim(),
          password: formData.password
        });
        alert(res.data.message || 'OTP sent successfully to your email/phone.');
        setOtpSent(true);
      } else {
        // Step 2: verify OTP -> backend returns token & doctor
        const res = await api.post('/doctor/verify-otp', {
          email: formData.email.trim(),
          otp: otp.trim()
        });

        const { token, doctor } = res.data;
        const doctorData = {
          id: doctor?.id,
          name: doctor?.name || formData.name || formData.email.split('@')[0],
          email: doctor?.email || formData.email
        };

        // ✅ Save to localStorage only if "Remember Me" checked
        if (rememberMe) {
          localStorage.setItem('doctorUser', JSON.stringify(doctorData));
          localStorage.setItem('doctorToken', token);
        } else {
          sessionStorage.setItem('doctorUser', JSON.stringify(doctorData));
          sessionStorage.setItem('doctorToken', token);
        }

        // ✅ Update global auth state
        login(doctorData, 'doctor');

        alert(`✅ Welcome back, Dr. ${doctorData.name}!`);
        navigateTo('doctor-dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to server. Please check your backend.'
          : 'Login failed. Invalid credentials or OTP.');
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
              onClick={() => navigateTo('role-selection')}
              className="border-slate-300 dark:border-slate-600"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg mx-auto">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl text-center mb-2 text-slate-900 dark:text-white">
            Provider Login
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Access your healthcare provider account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-2"
                placeholder="John Smith"
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
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-2"
                placeholder="doctor@example.com"
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
                  onClick={() => navigateTo('doctor-signup')}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  disabled={otpSent}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  disabled={otpSent}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* OTP Input */}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900">
              <Label htmlFor="remember" className="text-indigo-900 dark:text-indigo-100">
                Remember Me
              </Label>
              <Switch id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
            </div>

            {/* 2FA Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900">
              <Label htmlFor="twoFactorToggle" className="text-indigo-900 dark:text-indigo-100">
                Two-Factor Authentication
              </Label>
              <Switch
                id="twoFactorToggle"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            {/* Optional 2FA Code input */}
            {twoFactorEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Label htmlFor="twoFactorCode">2FA Code</Label>
                <Input
                  id="twoFactorCode"
                  value={formData.twoFactorCode}
                  onChange={(e) => handleChange('twoFactorCode', e.target.value)}
                  className="mt-2"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {loading
                ? 'Processing...'
                : otpSent
                ? 'Verify OTP & Login'
                : 'Login to Provider Portal'}
            </Button>

            <p className="text-center text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('doctor-signup')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
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
