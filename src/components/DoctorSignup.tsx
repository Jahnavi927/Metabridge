import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation, useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import api from '../api/api';


export function DoctorSignup() {
  const { navigateTo } = useNavigation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specialty: '',
    hospital: '',
    yearsOfExperience: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      // ✅ Send data to backend
      const res = await api.post('/doctor/signup', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialty,
        license_number: formData.licenseNumber,
        hospital_name: formData.hospital,
        years_of_experience: formData.yearsOfExperience,
        phone: formData.phone,
        twoFactorEnabled
      });

      const { doctor, token } = res.data;

      // ✅ Store token in localStorage
      localStorage.setItem('doctorToken', token);

      // ✅ Auto-login
      login({ name: `Dr. ${doctor.name}`, email: doctor.email }, 'doctor');

      alert('🎉 Signup successful! Redirecting to dashboard...');
      navigateTo('doctor-dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to backend. Please check if your server is running.'
          : 'Signup failed. Please check your details.');
      alert(`❌ ${message}`);
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
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl mb-3 text-slate-900 dark:text-white">
              Healthcare Provider Registration
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join our network of medical professionals
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                <h2 className="text-2xl mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
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

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Professional Info */}
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                <h2 className="text-2xl mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-600" />
                  Professional Credentials
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="licenseNumber">Medical License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange('licenseNumber', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) => handleChange('specialty', e.target.value)}
                      className="mt-2"
                      placeholder="e.g., Cardiology, Neurology"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="hospital">Hospital/Clinic Name</Label>
                    <Input
                      id="hospital"
                      value={formData.hospital}
                      onChange={(e) => handleChange('hospital', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900">
                      <div>
                        <Label htmlFor="twoFactor" className="text-indigo-900 dark:text-indigo-100">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                          Enhanced security for your account
                        </p>
                      </div>
                      <Switch
                        id="twoFactor"
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {loading ? 'Creating Account...' : 'Create Provider Account'}
              </Button>

              <p className="text-center text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigateTo('doctor-login')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
