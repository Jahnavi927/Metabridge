import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, User, Shield } from 'lucide-react';
import api from '../api/api'; // ✅ use shared axios instance
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation, useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function PatientSignup() {
  const { navigateTo } = useNavigation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date_of_birth: formData.dateOfBirth,
      password: formData.password,
      emergency_contact: formData.emergencyContact,
      emergency_phone: formData.emergencyPhone,
      two_factor_enabled: twoFactorEnabled
    };

    try {
      setLoading(true);
      const res = await api.post("/patient/register", payload);

      if (res.status === 201 || res.status === 200) {
        // Auto-login or redirect
        login({ name: `${formData.firstName} ${formData.lastName}`, email: formData.email }, 'patient');
        // navigateTo('patient-login'); // uncomment if you want to redirect instead
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
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

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-xl mx-auto">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl mb-3 text-slate-900 dark:text-white">
              Patient Registration
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Create your secure healthcare account
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Personal Information */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
              <h2 className="text-2xl mb-6 text-slate-900 dark:text-white">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className="mt-2" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-2" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} className="mt-2" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} className="mt-2" required />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
              <h2 className="text-2xl mb-6 text-slate-900 dark:text-white">
                Emergency Contact
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input id="emergencyContact" value={formData.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input id="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={(e) => handleChange('emergencyPhone', e.target.value)} className="mt-2" required />
                </div>
              </div>
            </div>

            {/* Two Factor */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor" className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch id="twoFactor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>
            </div>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {loading ? "Creating Account..." : "Create Patient Account"}
            </Button>

            <p className="text-center text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button type="button" onClick={() => navigateTo('patient-login')} className="text-purple-600 dark:text-purple-400 hover:underline">
                Login here
              </button>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
