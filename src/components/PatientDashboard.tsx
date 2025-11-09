import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Heart,
  Activity,
  Pill,
  Clock,
  Download,
  Eye
} from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth, useNavigation } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notificationCount] = useState(3);

  const handleLogout = () => {
    logout();
    navigateTo('landing');
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'reports', icon: FileText, label: 'My Reports' },
    { id: 'messages', icon: MessageSquare, label: 'Doctor Messages', badge: 2 },
    { id: 'trends', icon: TrendingUp, label: 'Health Trends' },
    { id: 'emergency', icon: AlertCircle, label: 'Emergency' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const healthMetrics = [
    { label: 'Heart Rate', value: '72 bpm', status: 'Normal', icon: Heart, color: 'from-red-500 to-pink-600', progress: 75 },
    { label: 'Blood Pressure', value: '120/80', status: 'Normal', icon: Activity, color: 'from-blue-500 to-indigo-600', progress: 85 },
    { label: 'Blood Sugar', value: '95 mg/dL', status: 'Normal', icon: Pill, color: 'from-purple-500 to-pink-600', progress: 70 },
    { label: 'Oxygen Level', value: '98%', status: 'Normal', icon: TrendingUp, color: 'from-green-500 to-emerald-600', progress: 98 },
  ];

  const recentReports = [
    { id: 1, name: 'Blood Test Results', date: '2025-11-01', doctor: 'Dr. Smith', status: 'Reviewed' },
    { id: 2, name: 'X-Ray Scan', date: '2025-10-28', doctor: 'Dr. Johnson', status: 'Pending' },
    { id: 3, name: 'ECG Report', date: '2025-10-25', doctor: 'Dr. Williams', status: 'Reviewed' },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Emily Smith', specialty: 'Cardiologist', date: '2025-11-10', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Michael Johnson', specialty: 'General Physician', date: '2025-11-15', time: '2:30 PM' },
  ];

  const messages = [
    { id: 1, from: 'Dr. Smith', message: 'Your test results look good. Continue with current medication.', time: '2 hours ago', unread: true },
    { id: 2, from: 'Dr. Johnson', message: 'Please schedule a follow-up appointment next week.', time: '1 day ago', unread: true },
    { id: 3, from: 'Dr. Williams', message: 'Your ECG results are normal.', time: '3 days ago', unread: false },
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
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
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
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here's your health overview for today
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
          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {healthMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                        {metric.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-slate-900 dark:text-white">{metric.label}</CardTitle>
                    <CardDescription className="text-2xl text-slate-700 dark:text-slate-300">
                      {metric.value}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={metric.progress} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Reports */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Recent Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex-1">
                          <h4 className="text-slate-900 dark:text-white mb-1">{report.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {report.doctor} • {report.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              report.status === 'Reviewed'
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            }
                          >
                            {report.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border border-indigo-200 dark:border-indigo-900 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-slate-900 dark:text-white mb-1">{appointment.doctor}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.specialty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Messages from Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-pink-600" />
                  Messages from Healthcare Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                        message.unread
                          ? 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900'
                          : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-slate-900 dark:text-white">{message.from}</h4>
                          {message.unread && (
                            <Badge className="bg-purple-500 text-white">New</Badge>
                          )}
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{message.time}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-2 px-12 py-6 text-lg"
            >
              <AlertCircle className="mr-3 w-6 h-6" />
              Emergency Contact
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}