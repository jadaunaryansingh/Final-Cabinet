import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useUnifiedAuth';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onOpenChange(false);
        setEmail('');
        setPassword('');
      } else {
        setError('Invalid email or password. Try the demo credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@cabinet.com');
    setPassword('demo123');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-md mx-auto">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 glass-morphism rounded-full flex items-center justify-center border border-cabinet-yellow/40 mb-4">
            <LogIn className="w-8 h-8 text-cabinet-yellow animate-glow-pulse" />
          </div>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-cabinet-grey font-body text-sm">
            Sign in to your CAB-I-NET account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-accent font-medium text-cabinet-yellow">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white placeholder:text-cabinet-grey"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-accent font-medium text-cabinet-yellow">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white placeholder:text-cabinet-grey"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cabinet-grey hover:text-cabinet-yellow transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Demo Credentials Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors underline"
            >
              Use Demo Credentials
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-400 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Demo Info */}
          <div className="glass-morphism p-4 rounded-lg border border-cabinet-yellow/20">
            <h4 className="text-cabinet-yellow font-accent font-semibold text-sm mb-2">Demo Account</h4>
            <div className="text-xs space-y-1 text-cabinet-grey">
              <p><strong>Email:</strong> demo@cabinet.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full btn-premium py-3 font-accent font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-cabinet-yellow/20">
          <p className="text-xs text-cabinet-grey">
            New to CAB-I-NET?{' '}
            <button className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors underline">
              Create Account
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
