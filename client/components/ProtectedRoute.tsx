import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/LoginPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'user' | 'developer';
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredUserType,
  fallback = <LoginPage />
}: ProtectedRouteProps) {
  const { authState } = useAuth();

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism rounded-3xl p-12 border border-cabinet-yellow/20 text-center">
          <div className="w-16 h-16 mx-auto mb-6 gradient-gold rounded-full flex items-center justify-center animate-spin">
            <span className="text-2xl">🚗</span>
          </div>
          <h2 className="text-2xl font-cabinet text-white mb-4">Loading CAB-I-NET</h2>
          <p className="text-cabinet-grey">Please wait while we authenticate you...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!authState.isLoggedIn || !authState.user) {
    return fallback;
  }

  // If specific user type is required and user doesn't match, show unauthorized
  if (requiredUserType && authState.user.userType !== requiredUserType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism rounded-3xl p-12 border border-red-500/20 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-cabinet text-white mb-4">Access Denied</h2>
          <p className="text-cabinet-grey mb-6">
            You need a {requiredUserType} account to access this page.
          </p>
          <p className="text-cabinet-grey text-sm">
            Your account type: <span className="text-cabinet-yellow capitalize">{authState.user.userType}</span>
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
}
