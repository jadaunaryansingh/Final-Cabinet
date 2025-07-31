import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Button } from '@/components/ui/button';

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>('Testing...');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!auth) {
      setStatus('Firebase Auth not available');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setStatus('Firebase Auth working - User logged in');
      } else {
        setUser(null);
        setStatus('Firebase Auth working - No user logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  const testAnonymousAuth = async () => {
    if (!auth) {
      setStatus('Firebase Auth not available');
      return;
    }

    try {
      setStatus('Testing anonymous auth...');
      await signInAnonymously(auth);
      setStatus('Anonymous auth successful!');
    } catch (error) {
      setStatus(`Auth error: ${error}`);
    }
  };

  return (
    <div className="p-4 glass-morphism rounded-lg border border-cabinet-yellow/30">
      <h3 className="text-cabinet-yellow font-semibold mb-2">Firebase Test</h3>
      <p className="text-sm text-cabinet-grey mb-4">{status}</p>
      {user && (
        <p className="text-sm text-white mb-4">
          User ID: {user.uid}
        </p>
      )}
      <Button 
        onClick={testAnonymousAuth}
        className="btn-premium"
        disabled={!auth}
      >
        Test Anonymous Auth
      </Button>
    </div>
  );
} 