import { useState, useEffect, createContext, useContext } from 'react';
import { LandingPage } from './components/LandingPage';
import { RoleSelection } from './components/RoleSelection';
import { DoctorSignup } from './components/DoctorSignup';
import { PatientSignup } from './components/PatientSignup';
import { DoctorLogin } from './components/DoctorLogin';
import { PatientLogin } from './components/PatientLogin';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { Toaster } from './components/ui/sonner';

interface AuthContextType {
  user: any;
  role: 'doctor' | 'patient' | null;
  login: (userData: any, userRole: 'doctor' | 'patient') => void;
  logout: () => void;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const ThemeContext = createContext<ThemeContextType | null>(null);
const NavigationContext = createContext<NavigationContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'doctor' | 'patient' | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (userData: any, userRole: 'doctor' | 'patient') => {
    setUser(userData);
    setRole(userRole);
    setCurrentPage(userRole === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard');
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setCurrentPage('landing');
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'role-selection':
        return <RoleSelection />;
      case 'doctor-signup':
        return <DoctorSignup />;
      case 'patient-signup':
        return <PatientSignup />;
      case 'doctor-login':
        return <DoctorLogin />;
      case 'patient-login':
        return <PatientLogin />;
      case 'doctor-dashboard':
        return <DoctorDashboard />;
      case 'patient-dashboard':
        return <PatientDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, role, login, logout }}>
        <NavigationContext.Provider value={{ currentPage, navigateTo }}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 transition-colors duration-300">
            {renderPage()}
          </div>
          <Toaster />
        </NavigationContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
