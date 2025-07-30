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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Reply,
  Flag,
  BarChart3,
  PieChart,
} from "lucide-react";

interface CustomerFeedback {
  id: string;
  rideId: string;
  customerName: string;
  driverName: string;
  rating: number;
  comment: string;
  date: Date;
  city: string;
  rideType: string;
  category: "service" | "driver" | "vehicle" | "app" | "pricing" | "general";
  sentiment: "positive" | "neutral" | "negative";
  status: "new" | "reviewed" | "responded" | "resolved";
  upvotes: number;
  helpful: boolean;
  response?: string;
  responseDate?: Date;
}

export default function CustomerFeedbackPage() {
  const { authState } = useAuth();
  const { addNotification } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] =
    useState<CustomerFeedback | null>(null);
  const [responseText, setResponseText] = useState("");

  if (!authState.user || authState.user.userType !== "developer") {
    return null;
  }

  // Mock feedback data
  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>([
    {
      id: "fb-001",
      rideId: "R24001",
      customerName: "Priya Sharma",
      driverName: "Rajesh Kumar",
      rating: 5,
      comment:
        "Excellent service! The driver was very professional and the car was spotless. Arrived exactly on time and took the fastest route. Definitely booking again!",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      city: "Bangalore",
      rideType: "Premium",
      category: "service",
      sentiment: "positive",
      status: "new",
      upvotes: 12,
      helpful: true,
    },
    {
      id: "fb-002",
      rideId: "R24002",
      customerName: "Amit Singh",
      driverName: "Suresh Patel",
      rating: 2,
      comment:
        "Driver was rude and kept talking on phone throughout the journey. Car had a strange smell and AC wasn't working properly. Very disappointed with the service.",
      date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      city: "Delhi",
      rideType: "VIP",
      category: "driver",
      sentiment: "negative",
      status: "new",
      upvotes: 3,
      helpful: false,
    },
    {
      id: "fb-003",
      rideId: "R24003",
      customerName: "Sneha Reddy",
      driverName: "Vikash Yadav",
      rating: 4,
      comment:
        "Good overall experience. Driver was polite and punctual. Only issue was that the app showed wrong ETA initially, but everything else was perfect.",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      city: "Mumbai",
      rideType: "Luxury",
      category: "app",
      sentiment: "positive",
      status: "reviewed",
      upvotes: 8,
      helpful: true,
      response:
        "Thank you for your feedback! We're glad you had a good experience. We're working on improving our ETA accuracy.",
      responseDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "fb-004",
      rideId: "R24004",
      customerName: "Ravi Kumar",
      driverName: "Deepak Singh",
      rating: 3,
      comment:
        "Average service. Driver was okay but took longer route. Pricing seems a bit high compared to other services. Could be better.",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      city: "Chennai",
      rideType: "Standard",
      category: "pricing",
      sentiment: "neutral",
      status: "new",
      upvotes: 2,
      helpful: false,
    },
    {
      id: "fb-005",
      rideId: "R24005",
      customerName: "Manish Agarwal",
      driverName: "Rohit Sharma",
      rating: 5,
      comment:
        "Outstanding experience! Driver was incredibly friendly and helpful. Car was luxury class, very clean and comfortable. The booking process was smooth and hassle-free.",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      city: "Hyderabad",
      rideType: "Premium",
      category: "service",
      sentiment: "positive",
      status: "responded",
      upvotes: 15,
      helpful: true,
      response:
        "Thank you so much for your wonderful feedback! We're delighted that you had such a great experience.",
      responseDate: new Date(Date.now() - 10 * 60 * 60 * 1000),
    },
    {
      id: "fb-006",
      rideId: "R24006",
      customerName: "Kavya Nair",
      driverName: "Arun Pillai",
      rating: 1,
      comment:
        "Terrible experience. Driver cancelled last minute without any reason. Had to wait 30 minutes for another cab. Customer service was unhelpful when I called.",
      date: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
      city: "Kochi",
      rideType: "Standard",
      category: "service",
      sentiment: "negative",
      status: "new",
      upvotes: 1,
      helpful: false,
    },
  ]);

  const categories = [
    "all",
    "service",
    "driver",
    "vehicle",
    "app",
    "pricing",
    "general",
  ];
  const sentiments = ["all", "positive", "neutral", "negative"];
  const ratings = ["all", "5", "4", "3", "2", "1"];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "neutral":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "reviewed":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "responded":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "resolved":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredFeedback = feedbackList.filter((feedback) => {
    const matchesCategory =
      selectedCategory === "all" || feedback.category === selectedCategory;
    const matchesSentiment =
      selectedSentiment === "all" || feedback.sentiment === selectedSentiment;
    const matchesRating =
      selectedRating === "all" || feedback.rating.toString() === selectedRating;
    const matchesSearch =
      searchTerm === "" ||
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.rideId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.driverName.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesCategory && matchesSentiment && matchesRating && matchesSearch
    );
  });

  const avgRating =
    feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) /
    feedbackList.length;
  const totalFeedback = feedbackList.length;
  const positiveFeedback = feedbackList.filter(
    (f) => f.sentiment === "positive",
  ).length;
  const negativeFeedback = feedbackList.filter(
    (f) => f.sentiment === "negative",
  ).length;
  const responseRate =
    (feedbackList.filter((f) => f.response).length / totalFeedback) * 100;

  const handleRespond = (feedbackId: string) => {
    if (!responseText.trim()) {
      addNotification({ type: "error", message: "Please enter a response" });
      return;
    }

    setFeedbackList((prev) =>
      prev.map((feedback) =>
        feedback.id === feedbackId
          ? {
              ...feedback,
              response: responseText,
              responseDate: new Date(),
              status: "responded" as const,
            }
          : feedback,
      ),
    );

    setResponseText("");
    setSelectedFeedback(null);
    addNotification({ type: "success", message: "Response sent successfully" });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="text-white font-semibold ml-2">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
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
                Customer Feedback
              </h1>
              <p className="text-cabinet-grey text-lg font-accent">
                Monitor and respond to customer reviews and feedback
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {avgRating.toFixed(1)}
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-yellow-400 text-xs">out of 5</span>
                  </div>
                </div>
                <Star className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Total Feedback
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {totalFeedback}
                  </p>
                  <p className="text-green-400 text-xs">This week</p>
                </div>
                <MessageSquare className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Positive Feedback
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {positiveFeedback}
                  </p>
                  <p className="text-green-400 text-xs">
                    {((positiveFeedback / totalFeedback) * 100).toFixed(1)}% of
                    total
                  </p>
                </div>
                <ThumbsUp className="w-8 h-8 text-cabinet-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cabinet-grey text-sm font-medium">
                    Response Rate
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {responseRate.toFixed(1)}%
                  </p>
                  <p className="text-green-400 text-xs">
                    Responded to feedback
                  </p>
                </div>
                <Reply className="w-8 h-8 text-cabinet-yellow" />
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
                  placeholder="Search feedback, customers, drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-morphism border-cabinet-yellow/30 text-white w-80"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40 glass-morphism border-cabinet-yellow/30 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-black border-cabinet-yellow/30">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSentiment}
                onValueChange={setSelectedSentiment}
              >
                <SelectTrigger className="w-40 glass-morphism border-cabinet-yellow/30 text-white">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent className="bg-black border-cabinet-yellow/30">
                  {sentiments.map((sentiment) => (
                    <SelectItem key={sentiment} value={sentiment}>
                      {sentiment === "all"
                        ? "All Sentiments"
                        : sentiment.charAt(0).toUpperCase() +
                          sentiment.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-40 glass-morphism border-cabinet-yellow/30 text-white">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent className="bg-black border-cabinet-yellow/30">
                  {ratings.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating === "all" ? "All Ratings" : `${rating} Stars`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <Card
              key={feedback.id}
              className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="text-white font-semibold">
                        {feedback.customerName}
                      </h4>
                      <p className="text-cabinet-grey text-sm">
                        Ride {feedback.rideId} • {feedback.city}
                      </p>
                      <p className="text-cabinet-grey text-xs">
                        Driver: {feedback.driverName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={`${getSentimentColor(feedback.sentiment)} border`}
                    >
                      {feedback.sentiment}
                    </Badge>
                    <Badge
                      className={`${getStatusColor(feedback.status)} border`}
                    >
                      {feedback.status}
                    </Badge>
                    <span className="text-cabinet-grey text-sm">
                      {formatTimeAgo(feedback.date)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">{renderStars(feedback.rating)}</div>

                <div className="mb-4">
                  <p className="text-white leading-relaxed">
                    {feedback.comment}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-cabinet-yellow/20 text-cabinet-yellow">
                      {feedback.category}
                    </Badge>
                    <Badge className="bg-gray-500/20 text-gray-400">
                      {feedback.rideType}
                    </Badge>
                    <div className="flex items-center space-x-2 text-cabinet-grey text-sm">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{feedback.upvotes}</span>
                      {feedback.helpful && (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!feedback.response && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedFeedback(feedback)}
                        className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Respond
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cabinet-yellow/30 text-cabinet-yellow"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                {feedback.response && (
                  <div className="mt-4 p-4 bg-cabinet-yellow/10 rounded-lg border border-cabinet-yellow/20">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-cabinet-yellow font-medium">
                        Official Response
                      </h5>
                      <span className="text-cabinet-grey text-xs">
                        {feedback.responseDate &&
                          formatTimeAgo(feedback.responseDate)}
                      </span>
                    </div>
                    <p className="text-white text-sm">{feedback.response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <Card className="glass-morphism border-cabinet-yellow/20">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
              <h3 className="text-white text-lg font-semibold mb-2">
                No feedback found
              </h3>
              <p className="text-cabinet-grey">
                No feedback matches your current filters. Try adjusting the
                search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="glass-morphism border-cabinet-yellow/20 w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-white">Respond to Feedback</CardTitle>
              <CardDescription className="text-cabinet-grey">
                Respond to {selectedFeedback.customerName}'s feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-cabinet-yellow/10 rounded-lg border border-cabinet-yellow/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cabinet-yellow font-medium">
                    Customer Feedback
                  </span>
                  {renderStars(selectedFeedback.rating)}
                </div>
                <p className="text-white text-sm">{selectedFeedback.comment}</p>
              </div>
              <div>
                <label className="text-cabinet-grey text-sm font-medium block mb-2">
                  Your Response
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response to the customer..."
                  rows={4}
                  className="glass-morphism border-cabinet-yellow/30 text-white"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => handleRespond(selectedFeedback.id)}
                  className="flex-1 bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFeedback(null);
                    setResponseText("");
                  }}
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
