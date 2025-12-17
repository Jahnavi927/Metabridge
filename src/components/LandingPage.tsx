import { motion } from 'motion/react';
import { Shield, Users, Lock, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation } from '../App';
import { Button } from './ui/button';

export function LandingPage() {
  const { navigateTo } = useNavigation();

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
            <ThemeToggle />
            <Button
              onClick={() => navigateTo('role-selection')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex justify-center">
              <HeartbeatLogo size="xl" />
            </div>
            <h1 className="text-7xl md:text-8xl mb-6 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Meta Bridge
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 mb-12" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Federated AI for Secure Healthcare
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12">
              Revolutionizing healthcare with privacy-preserving machine learning. 
              Train AI models across distributed medical data without compromising patient privacy.
            </p>
            <Button
              onClick={() => navigateTo('role-selection')}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-2 text-lg px-8 py-6"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, title: 'Secure by Design', desc: 'End-to-end encryption for all medical data' },
              { icon: Users, title: 'Collaborative AI', desc: 'Federated learning across healthcare networks' },
              { icon: Lock, title: 'Privacy First', desc: 'HIPAA compliant data protection' },
              { icon: Award, title: 'Clinical Grade', desc: 'FDA-ready AI model validation' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="group relative"
              >
                <div className="h-full p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl text-center mb-12 text-slate-900 dark:text-white">
            Why Choose Meta Bridge?
          </h2>
          <div className="space-y-4">
            {[
              'Train AI models without centralizing sensitive patient data',
              'Maintain full control over your healthcare information',
              'Contribute to advancing medical AI while preserving privacy',
              'Access personalized healthcare insights powered by federated learning',
              'Comply with GDPR, HIPAA, and international data protection standards'
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-slate-700 dark:text-slate-300">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <HeartbeatLogo size="md" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Meta Bridge
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                © 2025 Meta Bridge. All rights reserved.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                Advancing healthcare through privacy-preserving AI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
