import api from "../api/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from 'framer-motion';

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
  const [patientReports, setPatientReports] = useState<any[]>([]);
  const [patientMessages, setPatientMessages] = useState<any[]>([]);
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);

    useEffect(() => {
    api.get("/patient/reports")
      .then(res => setPatientReports(res.data))
      .catch(() => toast.error("Failed to load reports"));

    api.get("/patient/messages")
      .then(res => setPatientMessages(res.data))
      .catch(() => {});

    api.get("/patient/appointments")
      .then(res => setPatientAppointments(res.data))
      .catch(() => {});
  }, []);


  // Mock data - will be replaced with API calls to your backend


  const notificationCount = 0;

  const handleLogout = () => {
    logout();
    navigateTo('landing');
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'reports', icon: FileText, label: 'My Reports' },
    { id: 'messages', icon: MessageSquare, label: 'Doctor Messages' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
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

  const renderDashboardView = () => (
    <>
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

      {/* Quick Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveMenu('messages')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-5 h-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 dark:text-white mb-2">{patientMessages.length}</div>
              <p className="text-slate-600 dark:text-slate-400">New messages from doctors</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveMenu('reports')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 dark:text-white mb-2">{patientReports.length}</div>
              <p className="text-slate-600 dark:text-slate-400">Medical reports available</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveMenu('appointments')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Calendar className="w-5 h-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 dark:text-white mb-2">{patientAppointments.length}</div>
              <p className="text-slate-600 dark:text-slate-400">Upcoming appointments</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );

  const renderReportsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            My Medical Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No reports available yet</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Your doctor will send reports here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1">
                    <h4 className="text-slate-900 dark:text-white mb-1">
                      {report.file_name}
                    </h4>
                    <p className="text-sm text-slate-500">
                       Uploaded on {new Date(report.created_at).toLocaleDateString()}
                    </p>

                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      New
                    </Badge>
                   {/* 👁 VIEW REPORT */}
                   <a
                     href={`http://localhost:5000/${report.file_url}`}
                     target="_blank"
                     rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </a>

                    {/* ⬇ DOWNLOAD REPORT */}
                    <a
                      href={`http://localhost:5000/${report.file_url}`}
                      download
                    >
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
               </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderMessagesView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-600" />
            Messages from Healthcare Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No messages yet</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Messages from your doctor will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientMessages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    idx < 2
                      ? 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900'
                      : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-slate-900 dark:text-white">{message.from}</h4>
                      {idx < 2 && (
                        <Badge className="bg-purple-500 text-white">New</Badge>
                      )}
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{message.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAppointmentsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            My Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No appointments scheduled</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Your doctor will schedule appointments here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border border-indigo-200 dark:border-indigo-900 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-slate-900 dark:text-white mb-1">{appointment.doctor}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.specialty}</p>
                    </div>
                    <Badge className="bg-indigo-500 text-white">Upcoming</Badge>
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
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderTrendsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        Health Trends
      </h2>
      <div className="text-center py-12">
        <TrendingUp className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Health trends and charts would be displayed here</p>
      </div>
    </motion.div>
  );

  const renderEmergencyView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-red-600" />
        Emergency Contacts
      </h2>
      <div className="max-w-2xl space-y-4">
        <div className="p-6 rounded-xl border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950">
          <h3 className="text-lg text-slate-900 dark:text-white mb-2">Emergency Hotline</h3>
          <p className="text-3xl text-red-600 dark:text-red-400 mb-2">911</p>
          <p className="text-slate-600 dark:text-slate-400">For immediate medical emergencies</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="text-slate-900 dark:text-white mb-1">Your Primary Care Doctor</h4>
          <p className="text-slate-600 dark:text-slate-400">Dr. Sarah Williams</p>
          <p className="text-slate-600 dark:text-slate-400">(555) 123-4567</p>
        </div>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
        >
          <AlertCircle className="mr-2 w-6 h-6" />
          Call Emergency Services
        </Button>
      </div>
    </motion.div>
  );

  const renderSettingsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-slate-600" />
        Settings
      </h2>
      <div className="max-w-2xl space-y-6">
        <div>
          <h3 className="text-lg text-slate-900 dark:text-white mb-3">Profile Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={user?.name || ''} 
                readOnly 
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={user?.email || ''} 
                readOnly 
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-slate-900 dark:text-white mb-3">Preferences</h3>
          <p className="text-slate-600 dark:text-slate-400">Notification and privacy preferences can be configured here.</p>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboardView();
      case 'reports':
        return renderReportsView();
      case 'messages':
        return renderMessagesView();
      case 'appointments':
        return renderAppointmentsView();
      case 'trends':
        return renderTrendsView();
      case 'emergency':
        return renderEmergencyView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderDashboardView();
    }
  };

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
                  onClick={() => setActiveMenu('messages')}
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}