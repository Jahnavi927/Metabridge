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
  login: (userData: any, userRole: 'doctor' | 'patient', remember?: boolean) => void;
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

  // ✅ Check localStorage for remembered login
  useEffect(() => {
    const storedUser = localStorage.getItem('metabridge_user');
    const storedRole = localStorage.getItem('metabridge_role');
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole as 'doctor' | 'patient');
      setCurrentPage(storedRole === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard');
    }
  }, []);

  // ✅ Theme switcher
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // ✅ Login handler (with Remember Me)
  const login = (userData: any, userRole: 'doctor' | 'patient', remember = false) => {
    setUser(userData);
    setRole(userRole);
    if (remember) {
      localStorage.setItem('metabridge_user', JSON.stringify(userData));
      localStorage.setItem('metabridge_role', userRole);
    }
    setCurrentPage(userRole === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard');
  };

  // ✅ Logout clears everything
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('metabridge_user');
    localStorage.removeItem('metabridge_role');
    setCurrentPage('landing');
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  // ✅ Render pages
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
        return <DoctorDashboard user={user} />;
      case 'patient-dashboard':
        return <PatientDashboard user={user} />;
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
