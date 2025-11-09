import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Upload,
  Brain,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Activity,
  FileText,
} from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth, useNavigation } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notificationCount] = useState(5);
  const [doctorName, setDoctorName] = useState('');

  // ✅ Load doctor name from context or localStorage
  useEffect(() => {
    if (user?.name) {
      setDoctorName(user.name);
    } else {
      const storedUser = localStorage.getItem('doctorUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setDoctorName(parsed.name || 'Doctor');
      } else {
        setDoctorName('Doctor');
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('doctorUser');
    localStorage.removeItem('doctorToken');
    sessionStorage.removeItem('doctorToken');
    navigateTo('landing');
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'upload', icon: Upload, label: 'Upload Reports' },
    { id: 'training', icon: Brain, label: 'Model Training' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: notificationCount },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const stats = [
    { label: 'Total Patients', value: '248', change: '+12%', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Models', value: '8', change: '+2', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { label: 'Reports Today', value: '34', change: '+18%', icon: FileText, color: 'from-green-500 to-emerald-600' },
    { label: 'Accuracy Rate', value: '94.2%', change: '+2.1%', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
  ];

  const patients = [
    { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension', risk: 'Medium', lastVisit: '2025-11-01' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Diabetes', risk: 'Low', lastVisit: '2025-11-02' },
    { id: 3, name: 'Robert Johnson', age: 58, condition: 'Heart Disease', risk: 'High', lastVisit: '2025-11-03' },
    { id: 4, name: 'Emily Davis', age: 41, condition: 'Asthma', risk: 'Low', lastVisit: '2025-11-04' },
  ];

  const models = [
    { name: 'Cardiovascular Risk Model', progress: 85, status: 'Training' },
    { name: 'Diabetes Prediction Model', progress: 100, status: 'Completed' },
    { name: 'Cancer Detection Model', progress: 45, status: 'Training' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed h-screen overflow-y-auto shadow-xl"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <HeartbeatLogo size="md" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Meta Bridge
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-xl'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="bg-red-500 text-white">{item.badge}</Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="mr-2 w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl text-slate-900 dark:text-white">
                Welcome back, {doctorName || 'Doctor'}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here's what's happening with your patients today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="outline"
                  className="relative border-slate-300 dark:border-slate-600"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl mb-1 text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Patients Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg mb-8"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-slate-900 dark:text-white">
                  Patient Overview
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          patient.risk === 'High'
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                            : patient.risk === 'Medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        }
                      >
                        {patient.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Model Training Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Model Training Progress
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {models.map((model, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 dark:text-white">
                      {model.name}
                    </span>
                    <Badge
                      className={
                        model.status === 'Completed'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }
                    >
                      {model.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={model.progress} className="flex-1" />
                    <span className="text-slate-600 dark:text-slate-400 min-w-[50px] text-right">
                      {model.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Upload className="mr-2 w-5 h-5" />
              Upload New Report
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Brain className="mr-2 w-5 h-5" />
              Start Training
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Activity className="mr-2 w-5 h-5" />
              View Analytics
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
