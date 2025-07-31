import { useState } from "react";
import { useAuth } from "@/hooks/useUnifiedAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Building2, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

export default function Index() {
  const { authState, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async (email: string, password: string, userType: 'user' | 'developer') => {
    setIsLoading(true);
    const success = await login(email, password, userType);
    setIsLoading(false);
    
    if (success) {
      if (userType === 'developer') {
        navigate('/developer-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Authentication Test Section */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-morphism border-cabinet-yellow/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="w-5 h-5 text-cabinet-yellow" />
                <span>Authentication Status</span>
              </CardTitle>
              <CardDescription className="text-cabinet-grey">
                Current authentication state and quick access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authState.isLoggedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-cabinet-yellow/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-cabinet-yellow" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{authState.user?.name}</p>
                        <p className="text-cabinet-grey text-sm">{authState.user?.email}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={authState.user?.userType === 'developer' 
                        ? "border-cabinet-yellow text-cabinet-yellow" 
                        : "border-green-500 text-green-400"
                      }
                    >
                      {authState.user?.userType === 'developer' ? 'Developer' : 'User'}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => navigate(authState.user?.userType === 'developer' ? '/developer-dashboard' : '/dashboard')}
                      className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-cabinet-grey">Not logged in. Choose a demo account:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">User Accounts</h4>
                      <Button
                        onClick={() => handleQuickLogin('demo@cabinet.com', 'demo123', 'user')}
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Demo User
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">Developer Accounts</h4>
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleQuickLogin('aryan@cabinet.com', 'admin123', 'developer')}
                          disabled={isLoading}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          CTO Demo
                        </Button>
                        <Button
                          onClick={() => handleQuickLogin('utkarsh@cabinet.com', 'admin123', 'developer')}
                          disabled={isLoading}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          CEO Demo
                        </Button>
                        <Button
                          onClick={() => handleQuickLogin('lucky@cabinet.com', 'admin123', 'developer')}
                          disabled={isLoading}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          COO Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <HeroSection />
      <MapSection />
      <Footer />
    </div>
  );
}
