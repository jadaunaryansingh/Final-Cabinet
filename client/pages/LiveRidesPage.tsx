import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/hooks/useAppState";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Car,
  MapPin,
  Clock,
  User,
  Phone,
  Star,
  Navigation,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Activity,
  TrendingUp,
  Globe,
  Eye,
  RefreshCw,
  Map,
} from "lucide-react";

interface LiveRide {
  id: string;
  rideId: string;
  customerName: string;
  driverName: string;
  pickupLocation: string;
  destination: string;
  status: "requested" | "accepted" | "in_progress" | "completed" | "cancelled";
  rideType: "Standard" | "Premium" | "VIP" | "Luxury";
  estimatedFare: number;
  distance: string;
  duration: string;
  startTime: Date;
  city: string;
  customerPhone: string;
  driverPhone: string;
  vehicleNumber: string;
  customerRating: number;
  driverRating: number;
  paymentMethod: string;
}

export default function LiveRidesPage() {
  const { authState } = useAuth();
  const { addNotification } = useAppState();
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  if (!authState.user || authState.user.userType !== "developer") {
    return null;
  }

  // Mock live rides data
  const [liveRides, setLiveRides] = useState<LiveRide[]>([
    {
      id: "ride-live-001",
      rideId: "R24001",
      customerName: "Priya Sharma",
      driverName: "Rajesh Kumar",
      pickupLocation: "Electronic City, Bangalore",
      destination: "Koramangala, Bangalore",
      status: "in_progress",
      rideType: "Premium",
      estimatedFare: 450,
      distance: "12.3 km",
      duration: "25 min",
      startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      city: "Bangalore",
      customerPhone: "+91 98765 11111",
      driverPhone: "+91 98765 22222",
      vehicleNumber: "KA 05 MZ 1234",
      customerRating: 4.8,
      driverRating: 4.9,
      paymentMethod: "UPI",
    },
    {
      id: "ride-live-002",
      rideId: "R24002",
      customerName: "Amit Singh",
      driverName: "Suresh Patel",
      pickupLocation: "Connaught Place, Delhi",
      destination: "IGI Airport, Delhi",
      status: "accepted",
      rideType: "VIP",
      estimatedFare: 850,
      distance: "18.5 km",
      duration: "35 min",
      startTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      city: "Delhi",
      customerPhone: "+91 98765 33333",
      driverPhone: "+91 98765 44444",
      vehicleNumber: "DL 01 AB 5678",
      customerRating: 4.7,
      driverRating: 4.8,
      paymentMethod: "Credit Card",
    },
    {
      id: "ride-live-003",
      rideId: "R24003",
      customerName: "Sneha Reddy",
      driverName: "Vikash Yadav",
      pickupLocation: "Bandra West, Mumbai",
      destination: "Worli, Mumbai",
      status: "requested",
      rideType: "Luxury",
      estimatedFare: 650,
      distance: "8.7 km",
      duration: "20 min",
      startTime: new Date(),
      city: "Mumbai",
      customerPhone: "+91 98765 55555",
      driverPhone: "+91 98765 66666",
      vehicleNumber: "MH 01 CD 9012",
      customerRating: 4.9,
      driverRating: 4.7,
      paymentMethod: "Wallet",
    },
    {
      id: "ride-live-004",
      rideId: "R24004",
      customerName: "Ravi Kumar",
      driverName: "Deepak Singh",
      pickupLocation: "Anna Nagar, Chennai",
      destination: "OMR, Chennai",
      status: "in_progress",
      rideType: "Standard",
      estimatedFare: 320,
      distance: "15.2 km",
      duration: "30 min",
      startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      city: "Chennai",
      customerPhone: "+91 98765 77777",
      driverPhone: "+91 98765 88888",
      vehicleNumber: "TN 09 EF 3456",
      customerRating: 4.6,
      driverRating: 4.8,
      paymentMethod: "Cash",
    },
    {
      id: "ride-live-005",
      rideId: "R24005",
      customerName: "Manish Agarwal",
      driverName: "Rohit Sharma",
      pickupLocation: "Hitec City, Hyderabad",
      destination: "Gachibowli, Hyderabad",
      status: "completed",
      rideType: "Premium",
      estimatedFare: 280,
      distance: "6.8 km",
      duration: "15 min",
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      city: "Hyderabad",
      customerPhone: "+91 98765 99999",
      driverPhone: "+91 98765 12345",
      vehicleNumber: "TS 09 GH 7890",
      customerRating: 4.8,
      driverRating: 4.9,
      paymentMethod: "UPI",
    },
  ]);

  const cities = [
    "all",
    "Bangalore",
    "Delhi",
    "Mumbai",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
  ];
  const statuses = [
    "all",
    "requested",
    "accepted",
    "in_progress",
    "completed",
    "cancelled",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "accepted":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "in_progress":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRideTypeColor = (type: string) => {
    switch (type) {
      case "Standard":
        return "bg-gray-500/20 text-gray-400";
      case "Premium":
        return "bg-cabinet-yellow/20 text-cabinet-yellow";
      case "VIP":
        return "bg-purple-500/20 text-purple-400";
      case "Luxury":
        return "bg-gold-500/20 text-gold-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredRides = liveRides.filter((ride) => {
    const matchesCity = selectedCity === "all" || ride.city === selectedCity;
    const matchesStatus =
      selectedStatus === "all" || ride.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      ride.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.rideId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCity && matchesStatus && matchesSearch;
  });

  const totalRides = liveRides.length;
  const activeRides = liveRides.filter((ride) =>
    ["requested", "accepted", "in_progress"].includes(ride.status),
  ).length;
  const completedToday = liveRides.filter(
    (ride) => ride.status === "completed",
  ).length;
  const totalRevenue = liveRides
    .filter((ride) => ride.status === "completed")
    .reduce((sum, ride) => sum + ride.estimatedFare, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      addNotification({
        type: "success",
        message: "Live rides data refreshed successfully",
      });
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just started";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-black text-gradient text-shadow-glow mb-2">
                Live Rides Monitor
              </h1>
              <p className="text-cabinet-grey text-lg font-accent">
                Real-time ride tracking across India
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Total Rides Today
                  </p>
                  <p className="text-2xl font-bold text-white">{totalRides}</p>
                  <p className="text-green-400 text-xs">Live tracking</p>
                </div>
                <Car className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Active Rides
                  </p>
                  <p className="text-2xl font-bold text-white">{activeRides}</p>
                  <p className="text-green-400 text-xs">In progress</p>
                </div>
                <Activity className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Completed Today
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {completedToday}
                  </p>
                  <p className="text-green-400 text-xs">
                    Successfully finished
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Revenue Today
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-green-400 text-xs">From completed rides</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-morphism border-cabinet-yellow/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-grey w-4 h-4" />
                <Input
                  placeholder="Search rides, customers, drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-morphism border-cabinet-yellow/30 text-white w-80"
                />
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40 glass-morphism border-cabinet-yellow/30 text-white">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent className="bg-black border-cabinet-yellow/30">
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city === "all" ? "All Cities" : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 glass-morphism border-cabinet-yellow/30 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-black border-cabinet-yellow/30">
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all"
                        ? "All Status"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Live Rides List */}
        <div className="space-y-4">
          {filteredRides.map((ride) => (
            <Card
              key={ride.id}
              className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-cabinet-yellow/20 text-cabinet-yellow font-semibold">
                      {ride.rideId}
                    </Badge>
                    <Badge
                      className={`${getStatusColor(ride.status)} border font-medium`}
                    >
                      {ride.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={`${getRideTypeColor(ride.rideType)} border`}
                    >
                      {ride.rideType}
                    </Badge>
                    <span className="text-cabinet-grey text-sm">
                      {ride.city}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      ₹{ride.estimatedFare}
                    </p>
                    <p className="text-cabinet-grey text-xs">
                      {formatTime(ride.startTime)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer & Driver Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold flex items-center">
                          <User className="w-4 h-4 mr-2 text-cabinet-yellow" />
                          {ride.customerName}
                        </h4>
                        <p className="text-cabinet-grey text-sm">
                          {ride.customerPhone}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-yellow-400 text-xs">
                            {ride.customerRating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h4 className="text-white font-semibold flex items-center justify-end">
                          <Car className="w-4 h-4 mr-2 text-cabinet-yellow" />
                          {ride.driverName}
                        </h4>
                        <p className="text-cabinet-grey text-sm">
                          {ride.vehicleNumber}
                        </p>
                        <div className="flex items-center justify-end mt-1">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-yellow-400 text-xs">
                            {ride.driverRating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-medium text-sm">Pickup</p>
                        <p className="text-cabinet-grey text-xs">
                          {ride.pickupLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Navigation className="w-4 h-4 text-red-400 mt-1" />
                      <div>
                        <p className="text-white font-medium text-sm">
                          Destination
                        </p>
                        <p className="text-cabinet-grey text-xs">
                          {ride.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-cabinet-grey">
                          {ride.distance}
                        </span>
                        <span className="text-cabinet-grey">
                          {ride.duration}
                        </span>
                        <span className="text-cabinet-yellow">
                          {ride.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <Card className="glass-morphism border-cabinet-yellow/20">
            <CardContent className="p-12 text-center">
              <Car className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
              <h3 className="text-white text-lg font-semibold mb-2">
                No rides found
              </h3>
              <p className="text-cabinet-grey">
                No rides match your current filters. Try adjusting the search
                criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
