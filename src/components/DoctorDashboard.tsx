import api from "../api/api";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

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
  AlertCircle,
  Send,
  FileUp,
  Calendar,
  MessageSquare,
  X
} from 'lucide-react';
import { HeartbeatLogo } from './HeartbeatLogo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth, useNavigation } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';


export function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notificationCount] = useState(5);
  
  const [patients, setPatients] = useState<any[]>([]);

  // Dialog states
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Form states
  const [messageText, setMessageText] = useState('');
  const [reportName, setReportName] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  // Model training states
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);



  const handleLogout = () => {
  localStorage.removeItem("doctorToken");
  logout();
  navigateTo("landing");
};


  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patient List' },
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

  
  useEffect(() => {
  api.get("/doctor/patients")
    .then((res) => {
      const mappedPatients = res.data.map((p: any) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        age: "-",              // placeholder (not in DB)
        condition: "-",        // placeholder
        risk: "Low",           // default
        lastVisit: "-",        // placeholder
        raw: p                 // keep original if needed later
      }));

      setPatients(mappedPatients);
    })
    .catch(() => {
      toast.error("Failed to load patients");
    });
}, []);

  const models = [
    { name: 'Cardiovascular Risk Model', progress: 85, status: 'Training' },
    { name: 'Diabetes Prediction Model', progress: 100, status: 'Completed' },
    { name: 'Cancer Detection Model', progress: 45, status: 'Training' },
  ];
  
  const handleSendMessage = async () => {
  if (!selectedPatient || !messageText.trim()) {
    toast.error("Please enter a message");
    return;
  }

  try {
    await api.post("/doctor/send-message", {
      patient_id: selectedPatient.id,
      message: messageText,
    });

    toast.success("Message sent successfully");
    setMessageText("");
    setShowMessageDialog(false);
    setSelectedPatient(null);
  } catch (err) {
    toast.error("Failed to send message");
  }
};


  const handleUploadReport = async () => {
  if (!selectedPatient || !reportFile) {
    toast.error("Select patient and report file");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("patient_id", String(selectedPatient.id));
    formData.append("report", reportFile);

    await api.post("/doctor/send-report", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Report uploaded successfully");
    setReportFile(null);
    setShowReportDialog(false);
    setSelectedPatient(null);
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || "Upload report failed");
  }
};

const handleScheduleAppointment = async () => {
  if (!selectedPatient || !appointmentDate || !appointmentTime) {
    toast.error("Please fill all appointment details");
    return;
  }

  try {
    await api.post("/doctor/appointment", {
      patientId: selectedPatient.id,
      date: appointmentDate,
      time: appointmentTime,
    });

    toast.success("Appointment scheduled successfully");
    setAppointmentDate("");
    setAppointmentTime("");
    setShowAppointmentDialog(false);
    setSelectedPatient(null);
  } catch {
    toast.error("Failed to schedule appointment");
  }
};

const handleTrainModel = async () => {
  setIsTraining(true);
  setTrainingProgress(0);

  try {
    await api.post("/doctor/train-model");

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success("Model training completed");
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  } catch {
    toast.error("Model training failed");
    setIsTraining(false);
  }
};

  const openMessageDialog = (patient: any) => {
    setSelectedPatient(patient);
    setShowMessageDialog(true);
  };

  const openReportDialog = (patient: any) => {
    setSelectedPatient(patient);
    setShowReportDialog(true);
  };

  const openAppointmentDialog = (patient: any) => {
    setSelectedPatient(patient);
    setShowAppointmentDialog(true);
  };

  const renderDashboardView = () => (
    <>
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

      {/* Model Training Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg mb-8"
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
    </>
  );

  const renderPatientListView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
    >
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-slate-900 dark:text-white">
            Patient List
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
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openMessageDialog(patient)}
                    className="border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openReportDialog(patient)}
                    className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400"
                  >
                    <FileUp className="w-4 h-4 mr-1" />
                    Report
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openAppointmentDialog(patient)}
                    className="border-green-300 dark:border-green-700 text-green-600 dark:text-green-400"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Appointment
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );

  const renderUploadView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6 text-indigo-600" />
        Upload Patient Reports
      </h2>
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Select Patient</label>
        <select
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={selectedPatient?.id || ""}
            onChange={(e) => {
            const p = patients.find(pt => pt.id === Number(e.target.value));
            setSelectedPatient(p || null);
           }}
        >
          <option value="">Choose a patient...</option>
          {patients.map(patient => (
           <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>

        </div>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Report Name</label>
          <Input 
            placeholder="e.g., Blood Test Results" 
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-2">Upload File</label>
          <Input 
            type="file" 
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(e) => setReportFile(e.target.files?.[0] || null)}
          />
        </div>
        <Button 
          onClick={handleUploadReport}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
        >
          <FileUp className="mr-2 w-5 h-5" />
          Upload Report
        </Button>
      </div>
    </motion.div>
  );

  const renderTrainingView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Brain className="w-6 h-6 text-purple-600" />
        AI Model Training
      </h2>
      
      <div className="max-w-3xl space-y-6">
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border border-purple-200 dark:border-purple-900">
          <h3 className="text-lg text-slate-900 dark:text-white mb-2">Federated Learning Model</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Train AI models on distributed patient data without compromising privacy. The model learns from multiple sources while keeping data secure.
          </p>
          
          {isTraining && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Training Progress</span>
                <span className="text-slate-600 dark:text-slate-400">{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} />
            </div>
          )}
          
          <Button 
            onClick={handleTrainModel}
            disabled={isTraining}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
          >
            <Brain className="mr-2 w-5 h-5" />
            {isTraining ? 'Training in Progress...' : 'Start Training New Model'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <Activity className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="text-slate-900 dark:text-white mb-1">Active Models</h4>
            <p className="text-2xl text-slate-700 dark:text-slate-300">8</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="text-slate-900 dark:text-white mb-1">Avg Accuracy</h4>
            <p className="text-2xl text-slate-700 dark:text-slate-300">94.2%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAnalyticsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        Analytics Dashboard
      </h2>
      <div className="text-center py-12">
        <BarChart3 className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Analytics charts and graphs would be displayed here</p>
      </div>
    </motion.div>
  );

  const renderNotificationsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8"
    >
      <h2 className="text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-yellow-600" />
        Notifications
      </h2>
      <div className="space-y-4">
        {[
          { title: 'New Patient Registration', message: 'Sarah Williams has registered', time: '5 min ago', type: 'info' },
          { title: 'Lab Results Ready', message: 'Blood test results for John Doe', time: '1 hour ago', type: 'success' },
          { title: 'Appointment Reminder', message: 'Meeting with Emily Davis at 3 PM', time: '2 hours ago', type: 'warning' },
          { title: 'Model Training Complete', message: 'Cardiovascular model finished training', time: '3 hours ago', type: 'success' },
          { title: 'System Update', message: 'New features available', time: '1 day ago', type: 'info' },
        ].map((notification, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-slate-900 dark:text-white">{notification.title}</h4>
              <span className="text-sm text-slate-500 dark:text-slate-400">{notification.time}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{notification.message}</p>
          </div>
        ))}
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
              <Input value={user?.name || ''} readOnly />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <Input value={user?.email || ''} readOnly />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-slate-900 dark:text-white mb-3">Preferences</h3>
          <p className="text-slate-600 dark:text-slate-400">Notification and display preferences can be configured here.</p>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboardView();
      case 'patients':
        return renderPatientListView();
      case 'upload':
        return renderUploadView();
      case 'training':
        return renderTrainingView();
      case 'analytics':
        return renderAnalyticsView();
      case 'notifications':
        return renderNotificationsView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderDashboardView();
    }
  };

return (
  <>
    {/* ================= MAIN LAYOUT ================= */}
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
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meta Bridge
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeMenu === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-300"
          >
            <LogOut className="mr-2 w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 ml-72">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.name}
          </h1>
        </header>

        <main className="p-8">{renderContent()}</main>
      </div>
    </div>

    {/* ================= dialogs MUST be here ================= */}

    {/* MESSAGE DIALOG */}
    <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Send Message to {selectedPatient?.name}
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type message..."
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* APPOINTMENT DIALOG */}
    <Dialog
      open={showAppointmentDialog}
      onOpenChange={setShowAppointmentDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Schedule Appointment with {selectedPatient?.name}
          </DialogTitle>
        </DialogHeader>

        <Input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
        <Input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAppointmentDialog(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleScheduleAppointment}>
            Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* REPORT DIALOG */}
    <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Upload Report for {selectedPatient?.name}
          </DialogTitle>
        </DialogHeader>

        <Input type="file" onChange={(e) =>
          setReportFile(e.target.files?.[0] || null)
        } />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowReportDialog(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleUploadReport}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
);
}
   