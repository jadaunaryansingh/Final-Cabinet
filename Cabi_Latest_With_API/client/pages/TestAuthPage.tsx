import { useState } from "react";
import { useAuth } from "@/hooks/useUnifiedAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Building2, Settings, LogOut, CheckCircle, XCircle, Chrome, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TestAuthPage() {
  const { authState, login, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test: string, passed: boolean) => {
    setTestResults(prev => [...prev, `${passed ? '✅' : '❌'} ${test}`]);
  };

  const handleTestLogin = async (email: string, password: string, userType: 'user' | 'developer', testName: string) => {
    setIsLoading(true);
    console.log(`Testing ${testName}...`);
    const success = await login(email, password, userType);
    setIsLoading(false);

    if (success) {
      addTestResult(`${testName} - Login successful`, true);
      // Wait a moment then test navigation
      setTimeout(() => {
        if (userType === 'developer') {
          navigate('/developer-dashboard');
          addTestResult(`${testName} - Navigation to developer dashboard`, true);
        } else {
          navigate('/dashboard');
          addTestResult(`${testName} - Navigation to user dashboard`, true);
        }
      }, 1000);
    } else {
      addTestResult(`${testName} - Login failed`, false);
    }
  };

  const handleTestGoogleLogin = async () => {
    setIsLoading(true);
    console.log('Testing Google login...');

    try {
      const success = await loginWithGoogle();
      setIsLoading(false);

      if (success) {
        addTestResult('Google Login - Login successful', true);
        setTimeout(() => {
          navigate('/dashboard');
          addTestResult('Google Login - Navigation to dashboard', true);
        }, 1000);
      } else {
        addTestResult('Google Login - Login failed', false);
      }
    } catch (error) {
      setIsLoading(false);
      addTestResult(`Google Login - Error: ${error}`, false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    // Ensure logout before running tests to start from a clean state
    logout();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for logout to process

    // Test user login
    await handleTestLogin('demo@cabinet.com', 'demo123', 'user', 'User Demo Login');

    // Wait a bit then test developer login
    // Need to logout first to switch user types
    logout();
    await new Promise(resolve => setTimeout(resolve, 500));
    await handleTestLogin('aryan@cabinet.com', 'admin123', 'developer', 'Developer Demo Login');
  };

  const runFirebaseTests = async () => {
    setTestResults([]);
    logout();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test Google login
    await handleTestGoogleLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        <Card className="glass-morphism border-cabinet-yellow/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-cabinet-yellow" />
              <span>Authentication Test Suite</span>
            </CardTitle>
            <CardDescription className="text-cabinet-grey">
              Testing Firebase and Demo authentication functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Auth Status */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Current Authentication Status</h3>
              {authState.isLoggedIn ? (
                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl border border-cabinet-yellow/10">
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
              ) : (
                <div className="p-4 glass-morphism rounded-xl border border-cabinet-yellow/10">
                  <p className="text-cabinet-grey">Not logged in</p>
                </div>
              )}
            </div>

            {/* Test Buttons */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Individual Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleTestLogin('demo@cabinet.com', 'demo123', 'user', 'User Demo')}
                  disabled={isLoading || authState.isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Test User Login
                </Button>

                <Button
                  onClick={() => handleTestLogin('aryan@cabinet.com', 'admin123', 'developer', 'Developer Demo')}
                  disabled={isLoading || authState.isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Test Developer Login
                </Button>

                <Button
                  onClick={handleTestGoogleLogin}
                  disabled={isLoading || authState.isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Test Google Login
                </Button>

                <Button
                  onClick={() => navigate('/login')}
                  disabled={isLoading || authState.isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Go to Login Page
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={runAllTests}
                  disabled={isLoading || authState.isLoading}
                  className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Run All Demo Tests
                </Button>

                <Button
                  onClick={runFirebaseTests}
                  disabled={isLoading || authState.isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Run Firebase Tests
                </Button>
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Test Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div key={index} className="p-2 glass-morphism rounded-lg border border-cabinet-yellow/10">
                      <p className="text-sm">{result}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {authState.isLoggedIn && (
                <Button
                  onClick={() => navigate(authState.user?.userType === 'developer' ? '/developer-dashboard' : '/dashboard')}
                  className="flex-1 bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              )}

              {authState.isLoggedIn && (
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>

            {/* Environment Info */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Environment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 glass-morphism rounded-xl border border-cabinet-yellow/10">
                  <p className="text-cabinet-grey">Firebase API Key:</p>
                  <p className="text-white font-mono text-xs break-all">
                    {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Configured' : '❌ Not configured'}
                  </p>
                </div>
                <div className="p-4 glass-morphism rounded-xl border border-cabinet-yellow/10">
                  <p className="text-cabinet-grey">Auth Provider:</p>
                  <p className="text-white">
                    {import.meta.env.VITE_USE_FIREBASE_AUTH === 'true' ? 'Firebase' : 'Demo'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 