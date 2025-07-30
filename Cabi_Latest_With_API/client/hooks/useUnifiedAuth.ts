import { useContext } from 'react';
import { AuthContext } from './useAuth';
import { AuthContext as FirebaseAuthContext } from './useFirebaseAuth';

/**
 * Unified useAuth hook that works with both Firebase and Demo auth contexts
 * Automatically detects which context is available and uses the appropriate one
 */
export function useAuth() {
  // Try Firebase context first
  const firebaseContext = useContext(FirebaseAuthContext);
  
  // If Firebase context is available, use it
  if (firebaseContext) {
    return firebaseContext;
  }
  
  // Otherwise, try demo context
  const demoContext = useContext(AuthContext);
  
  // If demo context is available, use it
  if (demoContext) {
    return demoContext;
  }
  
  // If neither context is available, throw error
  throw new Error('useAuth must be used within an AuthProvider (either Firebase or Demo)');
}
