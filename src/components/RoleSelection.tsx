import { motion } from 'motion/react';
import { Stethoscope, User, ArrowLeft } from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation } from '../App';
import { Button } from './ui/button';

export function RoleSelection() {
  const { navigateTo } = useNavigation();

  const roles = [
    {
      type: 'doctor',
      title: 'Healthcare Provider',
      description: 'Access advanced AI tools, manage patient data, and contribute to federated learning models',
      icon: Stethoscope,
      gradient: 'from-indigo-500 to-blue-600',
      signupPage: 'doctor-signup',
      loginPage: 'doctor-login'
    },
    {
      type: 'patient',
      title: 'Patient',
      description: 'Securely manage your health records, communicate with providers, and benefit from personalized AI insights',
      icon: User,
      gradient: 'from-purple-500 to-pink-600',
      signupPage: 'patient-signup',
      loginPage: 'patient-login'
    }
  ];

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
              onClick={() => navigateTo('landing')}
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl mb-4 text-slate-900 dark:text-white">
              Choose Your Role
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Select how you'll be using Meta Bridge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {roles.map((role, idx) => (
              <motion.div
                key={role.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="group relative"
              >
                <div className="h-full p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 transition-all duration-500 hover:-translate-y-3">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-3xl mb-4 text-slate-900 dark:text-white">
                    {role.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                    {role.description}
                  </p>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigateTo(role.signupPage)}
                      className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      Sign Up as {role.title}
                    </Button>
                    <Button
                      onClick={() => navigateTo(role.loginPage)}
                      variant="outline"
                      className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
