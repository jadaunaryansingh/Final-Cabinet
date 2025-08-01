import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Lock, User, Building, Eye, EyeOff, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
  name?: string;
  userType: 'user' | 'developer';
}

interface SignupState {
  step: 'form' | 'otp' | 'completed';
  email: string;
  otp: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, sendVerificationEmail, verifyOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [signupState, setSignupState] = useState<SignupState>({
    step: 'form',
    email: '',
    otp: ''
  });
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    name: '',
    userType: 'user'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password, formData.userType);

      if (success) {
        navigate(formData.userType === 'developer' ? '/developer-dashboard' : '/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name?.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await sendVerificationEmail(formData.email);
      if (success) {
        setSignupState({ step: 'otp', email: formData.email, otp: '' });
        setSuccess(`Verification code sent to ${formData.email}! Check your email for the 6-digit code.`);
      } else {
        setError('Email already exists. Please use a different email or try logging in.');
      }
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupState.otp || signupState.otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const otpValid = await verifyOTP(signupState.email, signupState.otp);
      if (otpValid) {
        // Now create the account (always as 'user' for public signup)
        const success = await register(formData.email, formData.password, formData.name!, 'user');
        if (success) {
          setSignupState({ step: 'completed', email: '', otp: '' });
          setSuccess('Account created successfully!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setError('Failed to create account. Please try again.');
        }
      } else {
        setError('Invalid or expired verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-cabinet-yellow/5 via-cabinet-gold/3 to-transparent"></div>
      <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23D89000\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"}></div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 gradient-gold rounded-full flex items-center justify-center animate-breathe">
            <span className="text-3xl">🚗</span>
          </div>
          <h1 className="text-4xl font-display font-black text-gradient text-shadow-glow mb-3">
            CAB-I-NET
          </h1>
          <p className="text-cabinet-grey font-accent">
            Premium Cab Booking Experience
          </p>
        </div>

        <Card className="glass-morphism border-cabinet-yellow/20 backdrop-blur-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-cabinet text-white">Welcome Back</CardTitle>
            <CardDescription className="text-cabinet-grey">
              Sign in to access your premium cab experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-cabinet-dark/50 border border-cabinet-yellow/20">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-cabinet-grey font-medium">Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={formData.userType === 'user' ? 'default' : 'outline'}
                        onClick={() => updateFormData('userType', 'user')}
                        className={formData.userType === 'user' 
                          ? 'bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow' 
                          : 'border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow/10'
                        }
                      >
                        <User className="w-4 h-4 mr-2" />
                        User
                      </Button>
                      <Button
                        type="button"
                        variant={formData.userType === 'developer' ? 'default' : 'outline'}
                        onClick={() => updateFormData('userType', 'developer')}
                        className={formData.userType === 'developer' 
                          ? 'bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow' 
                          : 'border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow/10'
                        }
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Developer
                      </Button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-cabinet-grey font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="pl-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-cabinet-grey font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="pl-10 pr-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="glass-morphism border border-red-500/30 bg-red-500/10 p-3 rounded-xl">
                      <div className="flex items-center space-x-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Demo Credentials */}
                  <div className="glass-morphism border border-blue-500/30 bg-blue-500/10 p-3 rounded-xl">
                    <div className="text-blue-400 text-sm">
                      <div className="font-semibold mb-1">Demo Credentials:</div>
                      <div>📧 User: demo@cabinet.com / demo123</div>
                      <div>👨‍💻 Developer: aryan@cabinet.com / admin123</div>
                      <div>👨‍💻 Developer: utkarsh@cabinet.com / admin123</div>
                      <div>👨‍💻 Developer: lucky@cabinet.com / admin123</div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow font-semibold py-3 text-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                {signupState.step === 'form' && (
                  <form onSubmit={handleSendOTP} className="space-y-6">
                    {/* Info Message - Only User Registration */}
                    <div className="glass-morphism border border-blue-500/30 bg-blue-500/10 p-4 rounded-xl">
                      <div className="text-blue-400 text-sm">
                        <div className="font-semibold mb-1">🚗 User Registration</div>
                        <div>Create your CAB-I-NET account to start booking premium rides</div>
                        <div className="mt-2 text-xs text-cabinet-grey">Developer accounts are managed separately by admin</div>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-cabinet-grey font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="pl-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-cabinet-grey font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="pl-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-cabinet-grey font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <Input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          className="pl-10 pr-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-cabinet-grey text-xs">Password must be at least 6 characters long</p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                      <div className="glass-morphism border border-red-500/30 bg-red-500/10 p-3 rounded-xl">
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="glass-morphism border border-green-500/30 bg-green-500/10 p-3 rounded-xl">
                        <div className="flex items-center space-x-2 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">{success}</span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow font-semibold py-3 text-lg disabled:opacity-50"
                    >
                      {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                    </Button>
                  </form>
                )}

                {signupState.step === 'otp' && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="text-center mb-6">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
                      <p className="text-cabinet-grey">
                        We've sent a 6-digit verification code to<br />
                        <span className="text-cabinet-yellow">{signupState.email}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-cabinet-grey font-medium">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={signupState.otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setSignupState(prev => ({ ...prev, otp: value }));
                          setError('');
                        }}
                        className="text-center text-2xl tracking-widest glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                        maxLength={6}
                        required
                      />
                      <p className="text-cabinet-grey text-xs text-center">
                        Check your email for the verification code. It may take a few minutes to arrive.
                      </p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                      <div className="glass-morphism border border-red-500/30 bg-red-500/10 p-3 rounded-xl">
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || signupState.otp.length !== 6}
                      className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow font-semibold py-3 text-lg disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setSignupState({ step: 'form', email: '', otp: '' });
                          setError('');
                          setSuccess('');
                        }}
                        className="text-cabinet-yellow hover:text-cabinet-light-yellow"
                      >
                        ← Back to signup form
                      </Button>
                    </div>
                  </form>
                )}

                {signupState.step === 'completed' && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">Welcome to CAB-I-NET!</h3>
                    <p className="text-cabinet-grey mb-6">
                      Your account has been created successfully.<br />
                      Redirecting you to your dashboard...
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-cabinet-yellow animate-spin" />
                      <span className="text-cabinet-yellow">Loading...</span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-cabinet-grey text-sm">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
