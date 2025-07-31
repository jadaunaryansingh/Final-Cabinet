import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppStateContext, useAppStateProvider } from "./hooks/useAppState";
import { AuthContext, useAuthProvider } from "./hooks/useAuth";
import { AuthContext as FirebaseAuthContext, useAuthProvider as useFirebaseAuthProvider } from "./hooks/useFirebaseAuth";
import NotificationSystem from "./components/NotificationSystem";
import DemoLoginButton from "./components/DemoLoginButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";
import DeveloperDashboardPage from "./pages/DeveloperDashboardPage";
import LiveRidesPage from "./pages/LiveRidesPage";
import CustomerFeedbackPage from "./pages/CustomerFeedbackPage";
import RevenueAnalyticsPage from "./pages/RevenueAnalyticsPage";
import CommunityPage from "./pages/CommunityPage";
import CalculatorPage from "./pages/CalculatorPage";
import OffersPage from "./pages/OffersPage";
import FriendsPage from "./pages/FriendsPage";
import FavoriteDriversPage from "./pages/FavoriteDriversPage";
import EntertainmentPage from "./pages/EntertainmentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TestAuthPage from "./pages/TestAuthPage";

console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/test-auth" element={<TestAuthPage />} />

    {/* Root route - redirect based on user type */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      }
    />

    {/* Landing page accessible via direct route */}
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />

    {/* Protected user routes */}
    <Route
      path="/booking"
      element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/community"
      element={
        <ProtectedRoute>
          <CommunityPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/calculator"
      element={
        <ProtectedRoute>
          <CalculatorPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/offers"
      element={
        <ProtectedRoute>
          <OffersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/entertainment"
      element={
        <ProtectedRoute>
          <EntertainmentPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/friends"
      element={
        <ProtectedRoute>
          <FriendsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/favorite-drivers"
      element={
        <ProtectedRoute>
          <FavoriteDriversPage />
        </ProtectedRoute>
      }
    />

    {/* Developer-only routes */}
    <Route
      path="/developer-dashboard"
      element={
        <ProtectedRoute requiredUserType="developer">
          <DeveloperDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/live-rides"
      element={
        <ProtectedRoute requiredUserType="developer">
          <LiveRidesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer-feedback"
      element={
        <ProtectedRoute requiredUserType="developer">
          <CustomerFeedbackPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/revenue-analytics"
      element={
        <ProtectedRoute requiredUserType="developer">
          <RevenueAnalyticsPage />
        </ProtectedRoute>
      }
    />

    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppWithFirebaseAuth = () => {
  const appState = useAppStateProvider();
  const authProvider = useFirebaseAuthProvider();

  return (
    <FirebaseAuthContext.Provider value={authProvider}>
      <AppStateContext.Provider value={appState}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <NotificationSystem />
            <BrowserRouter>
              <DemoLoginButton />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AppStateContext.Provider>
    </FirebaseAuthContext.Provider>
  );
};

const AppWithDemoAuth = () => {
  const appState = useAppStateProvider();
  const authProvider = useAuthProvider();

  return (
    <AuthContext.Provider value={authProvider}>
      <AppStateContext.Provider value={appState}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <NotificationSystem />
            <BrowserRouter>
              <DemoLoginButton />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AppStateContext.Provider>
    </AuthContext.Provider>
  );
};

const App = () => {
  // Force Firebase authentication for full functionality
  const useFirebaseAuth = true; // Always use Firebase auth
  
  console.log('🔐 Using Firebase Authentication:', useFirebaseAuth);
  
  return useFirebaseAuth ? <AppWithFirebaseAuth /> : <AppWithDemoAuth />;
};

export default App;
