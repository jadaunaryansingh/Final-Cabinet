import { useAuth } from '@/hooks/useUnifiedAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, Shield, MoreVertical, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoLoginButton() {
  const { authState, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email: string, password: string, userType: 'user' | 'developer', label: string) => {
    console.log(`${label} login clicked`);
    const success = await login(email, password, userType);
    console.log(`${label} login result:`, success);
    
    if (success) {
      console.log(`${label} login successful!`);
      navigate(userType === 'developer' ? '/developer-dashboard' : '/dashboard');
    } else {
      console.log(`${label} login failed!`);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login clicked');
    const success = await loginWithGoogle();
    
    if (success) {
      console.log('Google login successful!');
      navigate('/dashboard');
    } else {
      console.log('Google login failed!');
    }
  };

  if (authState.isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="w-10 h-10 p-0 rounded-full bg-cabinet-yellow/10 border-cabinet-yellow/20 hover:bg-cabinet-yellow/20"
          >
            <MoreVertical className="w-4 h-4 text-cabinet-yellow" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 glass-morphism border-cabinet-yellow/20 backdrop-blur-xl"
        >
          <div className="p-2">
            <p className="text-xs text-cabinet-grey mb-2 px-2">Quick Access</p>
          </div>
          
          <DropdownMenuItem 
            onClick={() => handleDemoLogin('demo@cabinet.com', 'demo123', 'user', 'User Demo')}
            className="flex items-center space-x-2 cursor-pointer hover:bg-cabinet-yellow/10"
          >
            <User className="w-4 h-4 text-green-500" />
            <span>User Demo</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleDemoLogin('aryan@cabinet.com', 'admin123', 'developer', 'Developer Demo')}
            className="flex items-center space-x-2 cursor-pointer hover:bg-cabinet-yellow/10"
          >
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Developer Demo</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleGoogleLogin}
            className="flex items-center space-x-2 cursor-pointer hover:bg-cabinet-yellow/10"
          >
            <Chrome className="w-4 h-4 text-red-500" />
            <span>Google Login</span>
          </DropdownMenuItem>
          
          <div className="border-t border-cabinet-yellow/10 my-1"></div>
          
          <DropdownMenuItem 
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 cursor-pointer hover:bg-cabinet-yellow/10"
          >
            <User className="w-4 h-4 text-cabinet-yellow" />
            <span>Full Login Page</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 