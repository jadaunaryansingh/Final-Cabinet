import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/hooks/useAppState";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  DollarSign,
  CreditCard,
  Settings,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Database,
  Bell,
  Target,
  Globe,
  Phone,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Send,
  Star,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  PieChart,
  Filter,
  MoreVertical,
} from "lucide-react";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  status: "active" | "inactive" | "pending";
  joinedDate: Date;
  lastActive: Date;
  avatar?: string;
  phone: string;
  performance: number;
}

interface CompanyMetrics {
  totalStaff: number;
  totalSalary: number;
  avgSalary: number;
  activeStaff: number;
  departments: number;
  monthlyExpenses: number;
  quarterlyGrowth: number;
  companyRevenue: number;
}

export default function DeveloperDashboardPage() {
  const { authState, logout } = useAuth();
  const { addNotification } = useAppState();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is logged in and is a developer
  if (!authState.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism rounded-3xl p-12 border border-cabinet-yellow/20 text-center">
          <div className="w-16 h-16 mx-auto mb-6 gradient-gold rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-cabinet text-white mb-4">
            Access Denied
          </h2>
          <p className="text-cabinet-grey mb-6">
            You need to be logged in to access the developer portal.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (authState.user.userType !== "developer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism rounded-3xl p-12 border border-cabinet-yellow/20 text-center">
          <div className="w-16 h-16 mx-auto mb-6 gradient-gold rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-cabinet text-white mb-4">
            Developer Access Required
          </h2>
          <p className="text-cabinet-grey mb-6">
            This portal is only available for developer accounts. 
            Current user: {authState.user.name} ({authState.user.userType})
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
            >
              Go to User Dashboard
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-cabinet-yellow/30 text-cabinet-yellow"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock staff data
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "staff-001",
      name: "Rahul Sharma",
      email: "rahul.sharma@cabinet.com",
      role: "Senior Developer",
      department: "Engineering",
      salary: 85000,
      status: "active",
      joinedDate: new Date("2022-03-15"),
      lastActive: new Date(),
      phone: "+91 98765 11111",
      performance: 92,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "staff-002",
      name: "Priya Patel",
      email: "priya.patel@cabinet.com",
      role: "UI/UX Designer",
      department: "Design",
      salary: 75000,
      status: "active",
      joinedDate: new Date("2022-06-20"),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      phone: "+91 98765 22222",
      performance: 88,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9db5294?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "staff-003",
      name: "Amit Kumar",
      email: "amit.kumar@cabinet.com",
      role: "Marketing Manager",
      department: "Marketing",
      salary: 70000,
      status: "active",
      joinedDate: new Date("2023-01-10"),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      phone: "+91 98765 33333",
      performance: 85,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "staff-004",
      name: "Sneha Reddy",
      email: "sneha.reddy@cabinet.com",
      role: "HR Manager",
      department: "Human Resources",
      salary: 65000,
      status: "active",
      joinedDate: new Date("2022-09-05"),
      lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      phone: "+91 98765 44444",
      performance: 90,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "staff-005",
      name: "Vikash Singh",
      email: "vikash.singh@cabinet.com",
      role: "Operations Manager",
      department: "Operations",
      salary: 72000,
      status: "pending",
      joinedDate: new Date("2024-01-15"),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      phone: "+91 98765 55555",
      performance: 82,
    },
  ]);

  const companyMetrics: CompanyMetrics = {
    totalStaff: staffList.length,
    totalSalary: staffList.reduce((sum, staff) => sum + staff.salary, 0),
    avgSalary:
      staffList.reduce((sum, staff) => sum + staff.salary, 0) /
      staffList.length,
    activeStaff: staffList.filter((staff) => staff.status === "active").length,
    departments: new Set(staffList.map((staff) => staff.department)).size,
    monthlyExpenses: staffList.reduce((sum, staff) => sum + staff.salary, 0),
    quarterlyGrowth: 12.5,
    companyRevenue: 2847650,
  };

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    salary: "",
    phone: "",
  });

  const [emailForm, setEmailForm] = useState({
    recipients: "all",
    subject: "",
    message: "",
    type: "general",
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-400";
    if (performance >= 80) return "text-yellow-400";
    return "text-red-400";
  };

  const handleAddStaff = () => {
    if (
      !newStaff.name ||
      !newStaff.email ||
      !newStaff.role ||
      !newStaff.department ||
      !newStaff.salary
    ) {
      addNotification({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    const staff: Staff = {
      id: `staff-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      department: newStaff.department,
      salary: parseInt(newStaff.salary),
      status: "pending",
      joinedDate: new Date(),
      lastActive: new Date(),
      phone: newStaff.phone,
      performance: 85,
    };

    setStaffList((prev) => [...prev, staff]);
    setNewStaff({
      name: "",
      email: "",
      role: "",
      department: "",
      salary: "",
      phone: "",
    });
    setShowAddStaff(false);
    addNotification({
      type: "success",
      message: `${staff.name} has been added to staff`,
    });
  };

  const handleRemoveStaff = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    addNotification({
      type: "success",
      message: `${staff?.name} has been removed from staff`,
    });
  };

  const handleSendEmail = () => {
    if (!emailForm.subject || !emailForm.message) {
      addNotification({
        type: "error",
        message: "Please fill in subject and message",
      });
      return;
    }

    const recipientCount =
      emailForm.recipients === "all" ? staffList.length : 1;
    addNotification({
      type: "success",
      message: `Email sent successfully to ${recipientCount} recipient(s)`,
    });
    setEmailForm({
      recipients: "all",
      subject: "",
      message: "",
      type: "general",
    });
  };

  const handleSalarySend = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    addNotification({
      type: "success",
      message: `Salary payment of ${formatCurrency(staff?.salary || 0)} initiated for ${staff?.name}`,
    });
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism rounded-3xl p-12 border border-cabinet-yellow/20 text-center">
          <div className="w-16 h-16 mx-auto mb-6 gradient-gold rounded-full flex items-center justify-center animate-spin">
            <Building2 className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-cabinet text-white mb-4">
            Loading Admin Portal
          </h2>
          <p className="text-cabinet-grey">
            Fetching company metrics and staff data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-black text-gradient text-shadow-glow mb-2">
                CAB-I-NET Admin Portal
              </h1>
              <p className="text-cabinet-grey text-lg font-accent">
                Welcome back, {authState.user.name} - {authState.user.level}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="border-cabinet-yellow text-cabinet-yellow"
              >
                {authState.user.level}
              </Badge>
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Company Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {companyMetrics.totalStaff}
                  </p>
                  <p className="text-green-400 text-xs">
                    <ArrowUp className="w-3 h-3 inline mr-1" />
                    {companyMetrics.activeStaff} active
                  </p>
                </div>
                <Users className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Monthly Payroll
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(companyMetrics.totalSalary)}
                  </p>
                  <p className="text-cabinet-yellow text-xs">
                    Avg: {formatCurrency(companyMetrics.avgSalary)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Departments
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {companyMetrics.departments}
                  </p>
                  <p className="text-cabinet-yellow text-xs">Across company</p>
                </div>
                <Building2 className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Company Revenue
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(companyMetrics.companyRevenue)}
                  </p>
                  <p className="text-green-400 text-xs">
                    <ArrowUp className="w-3 h-3 inline mr-1" />
                    {companyMetrics.quarterlyGrowth}% growth
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-5 w-full bg-cabinet-dark/50 border border-cabinet-yellow/20 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black"
            >
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black"
            >
              <Users className="w-4 h-4 mr-2" />
              Staff Management
            </TabsTrigger>
            <TabsTrigger
              value="payroll"
              className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Payroll & Salary
            </TabsTrigger>
            <TabsTrigger
              value="communications"
              className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black"
            >
              <Mail className="w-4 h-4 mr-2" />
              Communications
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="glass-morphism border-cabinet-yellow/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                    onClick={() => navigate("/live-rides")}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View Live Rides
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-cabinet-yellow/30 text-cabinet-yellow"
                    onClick={() => navigate("/customer-feedback")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Customer Feedback
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-cabinet-yellow/30 text-cabinet-yellow"
                    onClick={() => navigate("/revenue-analytics")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Revenue Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-cabinet-yellow/30 text-cabinet-yellow"
                    onClick={() => setShowAddStaff(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Staff
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="glass-morphism border-cabinet-yellow/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-cabinet-yellow" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffList.slice(0, 5).map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center justify-between p-3 glass-morphism rounded-xl border border-cabinet-yellow/10"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-cabinet-yellow/20 flex items-center justify-center">
                              <Users className="w-4 h-4 text-cabinet-yellow" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {staff.name}
                              </p>
                              <p className="text-cabinet-grey text-xs">
                                {staff.role} - {staff.department}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`${getStatusColor(staff.status)} border`}
                          >
                            {staff.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-grey w-4 h-4" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-morphism border-cabinet-yellow/30 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={() => setShowAddStaff(true)}
                className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredStaff.map((staff) => (
                <Card
                  key={staff.id}
                  className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-cabinet-yellow/20">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-cabinet-yellow" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {staff.name}
                          </h3>
                          <p className="text-cabinet-grey text-sm">
                            {staff.role}
                          </p>
                          <p className="text-cabinet-yellow text-xs">
                            {staff.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-white font-semibold">
                            {formatCurrency(staff.salary)}
                          </p>
                          <p className="text-cabinet-grey text-xs">Monthly</p>
                        </div>
                        <div className="text-center">
                          <p
                            className={`font-semibold ${getPerformanceColor(staff.performance)}`}
                          >
                            {staff.performance}%
                          </p>
                          <p className="text-cabinet-grey text-xs">
                            Performance
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(staff.status)} border`}
                        >
                          {staff.status}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStaff(staff)}
                            className="border-cabinet-yellow/30 text-cabinet-yellow"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveStaff(staff.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Salary Management & Payroll
                </CardTitle>
                <CardDescription className="text-cabinet-grey">
                  Process salary payments and manage compensation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffList.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between p-4 glass-morphism rounded-xl border border-cabinet-yellow/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-cabinet-yellow/20">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-cabinet-yellow" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {staff.name}
                          </h4>
                          <p className="text-cabinet-grey text-sm">
                            {staff.role} - {staff.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {formatCurrency(staff.salary)}
                          </p>
                          <p className="text-cabinet-grey text-xs">
                            Monthly Salary
                          </p>
                        </div>
                        <Button
                          onClick={() => handleSalarySend(staff.id)}
                          className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                          disabled={staff.status !== "active"}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Salary
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 glass-morphism rounded-xl border border-cabinet-yellow/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">
                        Total Monthly Payroll
                      </h4>
                      <p className="text-cabinet-grey text-sm">
                        For {companyMetrics.activeStaff} active employees
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cabinet-yellow">
                        {formatCurrency(companyMetrics.totalSalary)}
                      </p>
                      <Button className="mt-2 bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Process All Salaries
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Staff Communications
                </CardTitle>
                <CardDescription className="text-cabinet-grey">
                  Send emails and announcements to your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-cabinet-grey">Recipients</Label>
                    <Select
                      value={emailForm.recipients}
                      onValueChange={(value) =>
                        setEmailForm((prev) => ({ ...prev, recipients: value }))
                      }
                    >
                      <SelectTrigger className="glass-morphism border-cabinet-yellow/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-cabinet-yellow/30">
                        <SelectItem value="all">All Staff</SelectItem>
                        <SelectItem value="active">
                          Active Staff Only
                        </SelectItem>
                        <SelectItem value="engineering">
                          Engineering Team
                        </SelectItem>
                        <SelectItem value="design">Design Team</SelectItem>
                        <SelectItem value="marketing">
                          Marketing Team
                        </SelectItem>
                        <SelectItem value="hr">HR Team</SelectItem>
                        <SelectItem value="operations">
                          Operations Team
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-cabinet-grey">Email Type</Label>
                    <Select
                      value={emailForm.type}
                      onValueChange={(value) =>
                        setEmailForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="glass-morphism border-cabinet-yellow/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-cabinet-yellow/30">
                        <SelectItem value="general">
                          General Announcement
                        </SelectItem>
                        <SelectItem value="urgent">Urgent Notice</SelectItem>
                        <SelectItem value="meeting">
                          Meeting Invitation
                        </SelectItem>
                        <SelectItem value="policy">Policy Update</SelectItem>
                        <SelectItem value="celebration">
                          Team Celebration
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-cabinet-grey">Subject</Label>
                  <Input
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Enter email subject"
                    className="glass-morphism border-cabinet-yellow/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-cabinet-grey">Message</Label>
                  <Textarea
                    value={emailForm.message}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Enter your message here..."
                    rows={6}
                    className="glass-morphism border-cabinet-yellow/30 text-white"
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white">Admin Settings</CardTitle>
                <CardDescription className="text-cabinet-grey">
                  Company configuration and administrative controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Administrative Controls
                  </h3>
                  <p className="text-cabinet-grey">
                    Company policies, user permissions, system configurations,
                    and security settings would be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="glass-morphism border-cabinet-yellow/20 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Add New Staff Member</CardTitle>
              <CardDescription className="text-cabinet-grey">
                Enter details for the new team member
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-cabinet-grey">Full Name</Label>
                <Input
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="glass-morphism border-cabinet-yellow/30 text-white"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label className="text-cabinet-grey">Email</Label>
                <Input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="glass-morphism border-cabinet-yellow/30 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label className="text-cabinet-grey">Role</Label>
                <Input
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="glass-morphism border-cabinet-yellow/30 text-white"
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <Label className="text-cabinet-grey">Department</Label>
                <Select
                  value={newStaff.department}
                  onValueChange={(value) =>
                    setNewStaff((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger className="glass-morphism border-cabinet-yellow/30 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cabinet-yellow/30">
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">
                      Human Resources
                    </SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-cabinet-grey">Monthly Salary</Label>
                <Input
                  type="number"
                  value={newStaff.salary}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, salary: e.target.value }))
                  }
                  className="glass-morphism border-cabinet-yellow/30 text-white"
                  placeholder="Enter salary amount"
                />
              </div>
              <div>
                <Label className="text-cabinet-grey">Phone Number</Label>
                <Input
                  value={newStaff.phone}
                  onChange={(e) =>
                    setNewStaff((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="glass-morphism border-cabinet-yellow/30 text-white"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleAddStaff}
                  className="flex-1 bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddStaff(false)}
                  className="flex-1 border-cabinet-yellow/30 text-cabinet-yellow"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
