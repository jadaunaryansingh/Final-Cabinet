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
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Car,
  Users,
  CreditCard,
  Wallet,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  RefreshCw,
  Target,
  Globe,
  Activity,
  Percent,
} from "lucide-react";

interface RevenueData {
  period: string;
  totalRevenue: number;
  ridesCount: number;
  avgFarePerRide: number;
  growth: number;
}

interface CityRevenue {
  city: string;
  revenue: number;
  rides: number;
  growth: number;
  marketShare: number;
}

interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface RideTypeRevenue {
  type: string;
  revenue: number;
  percentage: number;
  rides: number;
  avgFare: number;
}

export default function RevenueAnalyticsPage() {
  const { authState } = useAuth();
  const { addNotification } = useAppState();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedCity, setSelectedCity] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  if (!authState.user || authState.user.userType !== "developer") {
    return null;
  }

  // Mock revenue data
  const revenueData: RevenueData[] = [
    {
      period: "Today",
      totalRevenue: 125000,
      ridesCount: 450,
      avgFarePerRide: 278,
      growth: 12.5,
    },
    {
      period: "Yesterday",
      totalRevenue: 118000,
      ridesCount: 425,
      avgFarePerRide: 278,
      growth: 8.2,
    },
    {
      period: "This Week",
      totalRevenue: 850000,
      ridesCount: 3200,
      avgFarePerRide: 266,
      growth: 15.8,
    },
    {
      period: "Last Week",
      totalRevenue: 735000,
      ridesCount: 2850,
      avgFarePerRide: 258,
      growth: 22.1,
    },
    {
      period: "This Month",
      totalRevenue: 3200000,
      ridesCount: 12500,
      avgFarePerRide: 256,
      growth: 18.5,
    },
    {
      period: "Last Month",
      totalRevenue: 2850000,
      ridesCount: 11200,
      avgFarePerRide: 254,
      growth: 14.2,
    },
  ];

  const cityRevenue: CityRevenue[] = [
    {
      city: "Bangalore",
      revenue: 1245000,
      rides: 4850,
      growth: 15.2,
      marketShare: 25.8,
    },
    {
      city: "Mumbai",
      revenue: 982000,
      rides: 3920,
      growth: 12.8,
      marketShare: 18.3,
    },
    {
      city: "Delhi",
      revenue: 856000,
      rides: 3440,
      growth: 18.5,
      marketShare: 21.2,
    },
    {
      city: "Chennai",
      revenue: 634000,
      rides: 2560,
      growth: 8.9,
      marketShare: 14.7,
    },
    {
      city: "Hyderabad",
      revenue: 485000,
      rides: 1940,
      growth: 22.1,
      marketShare: 19.6,
    },
    {
      city: "Pune",
      revenue: 325000,
      rides: 1300,
      growth: 16.4,
      marketShare: 12.4,
    },
    {
      city: "Kolkata",
      revenue: 285000,
      rides: 1140,
      growth: 10.7,
      marketShare: 8.9,
    },
  ];

  const paymentMethods: PaymentMethodData[] = [
    { method: "UPI", amount: 1850000, percentage: 45.2, transactions: 7200 },
    {
      method: "Credit Card",
      amount: 1320000,
      percentage: 32.4,
      transactions: 5150,
    },
    { method: "Wallet", amount: 685000, percentage: 16.8, transactions: 2680 },
    { method: "Cash", amount: 225000, percentage: 5.5, transactions: 890 },
    {
      method: "Debit Card",
      amount: 120000,
      percentage: 2.9,
      transactions: 480,
    },
  ];

  const rideTypeRevenue: RideTypeRevenue[] = [
    {
      type: "Premium",
      revenue: 1680000,
      percentage: 42.5,
      rides: 5950,
      avgFare: 282,
    },
    {
      type: "Standard",
      revenue: 1245000,
      percentage: 31.5,
      rides: 6220,
      avgFare: 200,
    },
    {
      type: "VIP",
      revenue: 785000,
      percentage: 19.8,
      rides: 1570,
      avgFare: 500,
    },
    {
      type: "Luxury",
      revenue: 245000,
      percentage: 6.2,
      rides: 350,
      avgFare: 700,
    },
  ];

  const currentData =
    revenueData.find((d) => d.period === "This Month") || revenueData[4];
  const totalRevenue = currentData.totalRevenue;
  const totalRides = currentData.ridesCount;
  const avgFarePerRide = currentData.avgFarePerRide;
  const revenueGrowth = currentData.growth;

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

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-400" : "text-red-400";
  };

  const GrowthIndicator = ({ value }: { value: number }) => (
    <div className={`flex items-center space-x-1 ${getGrowthColor(value)}`}>
      {value >= 0 ? (
        <ArrowUp className="w-3 h-3" />
      ) : (
        <ArrowDown className="w-3 h-3" />
      )}
      <span className="text-xs font-medium">{Math.abs(value).toFixed(1)}%</span>
    </div>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      addNotification({
        type: "success",
        message: "Revenue data refreshed successfully",
      });
      setRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    addNotification({
      type: "info",
      message:
        "Revenue report export started. You will be notified when ready.",
    });
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
                Revenue Analytics
              </h1>
              <p className="text-cabinet-grey text-lg font-accent">
                Financial performance and revenue insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40 glass-morphism border-cabinet-yellow/30 text-white">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="bg-black border-cabinet-yellow/30">
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="border-cabinet-yellow/30 text-cabinet-yellow"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <GrowthIndicator value={revenueGrowth} />
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
                    Total Rides
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(totalRides)}
                  </p>
                  <GrowthIndicator value={15.8} />
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
                    Avg Fare/Ride
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ₹{avgFarePerRide}
                  </p>
                  <GrowthIndicator value={8.2} />
                </div>
                <TrendingUp className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Revenue/Hour
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ₹{Math.round(totalRevenue / (30 * 24)).toLocaleString()}
                  </p>
                  <p className="text-cabinet-yellow text-xs">
                    <Activity className="w-3 h-3 inline mr-1" />
                    Active earnings
                  </p>
                </div>
                <Activity className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by City */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-cabinet-yellow" />
                <span>Revenue by City</span>
              </CardTitle>
              <CardDescription className="text-cabinet-grey">
                City-wise revenue breakdown and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cityRevenue.slice(0, 5).map((city, index) => (
                  <div
                    key={city.city}
                    className="flex items-center justify-between p-4 glass-morphism rounded-xl border border-cabinet-yellow/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-gold-500/20 text-gold-400"
                            : index === 1
                              ? "bg-silver-500/20 text-gray-400"
                              : index === 2
                                ? "bg-bronze-500/20 text-orange-400"
                                : "bg-cabinet-yellow/20 text-cabinet-yellow"
                        }`}
                      >
                        <span className="font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {city.city}
                        </h4>
                        <p className="text-cabinet-grey text-sm">
                          {formatNumber(city.rides)} rides
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {formatCurrency(city.revenue)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <GrowthIndicator value={city.growth} />
                        <span className="text-cabinet-yellow text-xs">
                          {city.marketShare}% share
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-cabinet-yellow" />
                <span>Payment Methods</span>
              </CardTitle>
              <CardDescription className="text-cabinet-grey">
                Revenue distribution by payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.method}
                    className="flex items-center justify-between p-4 glass-morphism rounded-xl border border-cabinet-yellow/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cabinet-yellow/20 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-cabinet-yellow" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {method.method}
                        </h4>
                        <p className="text-cabinet-grey text-sm">
                          {formatNumber(method.transactions)} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {formatCurrency(method.amount)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-cabinet-yellow text-xs">
                          {method.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ride Type Revenue */}
        <Card className="glass-morphism border-cabinet-yellow/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Car className="w-5 h-5 text-cabinet-yellow" />
              <span>Revenue by Ride Type</span>
            </CardTitle>
            <CardDescription className="text-cabinet-grey">
              Performance analysis across different ride categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rideTypeRevenue.map((type) => (
                <div
                  key={type.type}
                  className="p-4 glass-morphism rounded-xl border border-cabinet-yellow/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">{type.type}</h4>
                    <Badge
                      className={`${
                        type.type === "Luxury"
                          ? "bg-purple-500/20 text-purple-400"
                          : type.type === "VIP"
                            ? "bg-gold-500/20 text-gold-400"
                            : type.type === "Premium"
                              ? "bg-cabinet-yellow/20 text-cabinet-yellow"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {type.percentage}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-cabinet-grey text-xs">Revenue</p>
                      <p className="text-white font-bold">
                        {formatCurrency(type.revenue)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-cabinet-grey text-xs">Rides</p>
                        <p className="text-white font-medium">
                          {formatNumber(type.rides)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-cabinet-grey text-xs">Avg Fare</p>
                        <p className="text-cabinet-yellow font-medium">
                          ₹{type.avgFare}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="glass-morphism border-cabinet-yellow/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-cabinet-yellow" />
              <span>Revenue Trends</span>
            </CardTitle>
            <CardDescription className="text-cabinet-grey">
              Historical revenue performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {revenueData.map((data) => (
                <div
                  key={data.period}
                  className="p-4 glass-morphism rounded-xl border border-cabinet-yellow/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{data.period}</h4>
                    <GrowthIndicator value={data.growth} />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-cabinet-grey text-xs">Revenue</p>
                      <p className="text-white font-bold">
                        {formatCurrency(data.totalRevenue)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-cabinet-grey text-xs">Rides</p>
                        <p className="text-white font-medium">
                          {formatNumber(data.ridesCount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-cabinet-grey text-xs">Avg Fare</p>
                        <p className="text-cabinet-yellow font-medium">
                          ₹{data.avgFarePerRide}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
