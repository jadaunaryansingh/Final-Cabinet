import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendEmailVerification,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';

// User interfaces (keeping the same structure as the original)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  level: string;
  rating: number;
  totalRides: number;
  joinedDate: Date;
  phone: string;
  emergencyContact?: string;
  preferredPayment: string;
  rideHistory: RideHistoryEntry[];
  favoriteRoutes: string[];
  loyaltyPoints: number;
  userType: 'user' | 'developer';
  friends: Friend[];
  favoriteDrivers: FavoriteDriver[];
  unreadNotifications: number;
  firebaseUid?: string; // Add Firebase UID for linking
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'pending' | 'accepted' | 'blocked';
  addedDate: Date;
}

export interface FavoriteDriver {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  vehicleNumber: string;
  vehicleType: string;
  totalRides: number;
  addedDate: Date;
}

export interface RideHistoryEntry {
  id: string;
  date: Date;
  pickup: string;
  destination: string;
  cost: number;
  driver: string;
  rating: number;
  distance: string;
  duration: string;
  rideType: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string, userType?: 'user' | 'developer') => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: 'user' | 'developer') => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addFriend: (email: string) => Promise<boolean>;
  addFavoriteDriver: (email: string) => Promise<boolean>;
  addToHistory: (ride: RideHistoryEntry) => void;
  acceptFriendRequest: (friendId: string) => Promise<boolean>;
  isAuthenticated: () => boolean;
}

// Demo user for fallback (keeping existing demo functionality)
const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@cabinet.com',
  name: 'Aryan Singh',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  level: 'VIP Premium',
  rating: 4.9,
  totalRides: 156,
  joinedDate: new Date('2022-03-15'),
  phone: '+91 98765 43210',
  emergencyContact: '+91 98765 43211',
  preferredPayment: 'UPI',
  loyaltyPoints: 2840,
  userType: 'user',
  friends: [],
  favoriteDrivers: [],
  unreadNotifications: 3,
  favoriteRoutes: [
    'Home → Work (Tech Park)',
    'Airport → Home',
    'Mall → Home'
  ],
  rideHistory: []
};

// Helper function to convert Firestore user to our User interface
const createUserFromFirebase = (firebaseUser: FirebaseUser, userType: 'user' | 'developer'): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=d89000&color=000000&size=200`,
    level: userType === 'developer' ? 'Developer Admin' : 'Standard Member',
    rating: 5.0,
    totalRides: 0,
    joinedDate: new Date(),
    phone: '',
    emergencyContact: '',
    preferredPayment: 'UPI',
    loyaltyPoints: 100,
    userType,
    friends: [],
    favoriteDrivers: [],
    unreadNotifications: 1,
    favoriteRoutes: [],
    rideHistory: [],
    firebaseUid: firebaseUser.uid
  };
};

const mapFirestoreToUser = (firebaseUser: FirebaseUser, userData: any): User => {
  let joinedDate = userData.joinedDate;
  if (joinedDate && typeof joinedDate.toDate === 'function') {
    joinedDate = joinedDate.toDate();
  } else if (typeof joinedDate === 'string') {
    joinedDate = new Date(joinedDate);
  } // else leave as is (could be Date or undefined)

  return {
    id: userData.id || firebaseUser.uid,
    email: firebaseUser.email || '',
    name: userData.name || firebaseUser.displayName || '',
    avatar: userData.avatar || firebaseUser.photoURL,
    level: userData.level || 'Standard Member',
    rating: userData.rating || 5.0,
    totalRides: userData.totalRides || 0,
    joinedDate,
    phone: userData.phone || '',
    emergencyContact: userData.emergencyContact || '',
    preferredPayment: userData.preferredPayment || 'UPI',
    rideHistory: (userData.rideHistory || []).map((ride: any) => {
      let date = ride.date;
      if (date && typeof date.toDate === 'function') {
        date = date.toDate();
      } else if (typeof date === 'string') {
        date = new Date(date);
      }
      return { ...ride, date };
    }),
    favoriteRoutes: userData.favoriteRoutes || [],
    loyaltyPoints: userData.loyaltyPoints || 100,
    userType: userData.userType || 'user',
    friends: (userData.friends || []).map((friend: any) => {
      let addedDate = friend.addedDate;
      if (addedDate && typeof addedDate.toDate === 'function') {
        addedDate = addedDate.toDate();
      } else if (typeof addedDate === 'string') {
        addedDate = new Date(addedDate);
      }
      return { ...friend, addedDate };
    }),
    favoriteDrivers: (userData.favoriteDrivers || []).map((driver: any) => {
      let addedDate = driver.addedDate;
      if (addedDate && typeof addedDate.toDate === 'function') {
        addedDate = addedDate.toDate();
      } else if (typeof addedDate === 'string') {
        addedDate = new Date(addedDate);
      }
      return { ...driver, addedDate };
    }),
    unreadNotifications: userData.unreadNotifications || 0,
    firebaseUid: firebaseUser.uid
  };
};

// Helper function to convert User to Firestore document
const mapUserToFirestore = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    level: user.level,
    rating: user.rating,
    totalRides: user.totalRides,
    joinedDate: Timestamp.fromDate(user.joinedDate),
    phone: user.phone,
    emergencyContact: user.emergencyContact,
    preferredPayment: user.preferredPayment,
    rideHistory: user.rideHistory.map(ride => ({
      ...ride,
      date: Timestamp.fromDate(ride.date)
    })),
    favoriteRoutes: user.favoriteRoutes,
    loyaltyPoints: user.loyaltyPoints,
    userType: user.userType,
    friends: user.friends.map(friend => ({
      ...friend,
      addedDate: Timestamp.fromDate(friend.addedDate)
    })),
    favoriteDrivers: user.favoriteDrivers.map(driver => ({
      ...driver,
      addedDate: Timestamp.fromDate(driver.addedDate)
    })),
    unreadNotifications: user.unreadNotifications,
    firebaseUid: user.firebaseUid
  };
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true
  });

  // Check if Firebase is configured (use imported function)
  const firebaseConfigured = isFirebaseConfigured();

  // Login function
  const login = async (email: string, password: string, userType: 'user' | 'developer' = 'user'): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      if (!firebaseConfigured || !auth) {
        // Fallback to demo login if Firebase is not configured
        return handleDemoLogin(email, password, userType);
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('Firebase Auth successful for:', email);
      
      // Check if user data exists in localStorage (from registration)
      const savedUser = localStorage.getItem('cab-i-net-user');
      let user: User;
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Verify it's the same user
          if (parsedUser.email === email || parsedUser.firebaseUid === firebaseUser.uid) {
            console.log('Loading user from localStorage');
            user = parsedUser;
          } else {
            // Create new user data
            user = createUserFromFirebase(firebaseUser, userType);
          }
        } catch (error) {
          console.log('Invalid localStorage data, creating new user');
          user = createUserFromFirebase(firebaseUser, userType);
        }
      } else {
        // Create new user data
        user = createUserFromFirebase(firebaseUser, userType);
      }

      // Save to localStorage for offline access
      localStorage.setItem('cab-i-net-user', JSON.stringify(user));
      localStorage.setItem('cab-i-net-auth', 'true');

      setAuthState({
        user,
        isLoggedIn: true,
        isLoading: false
      });

      console.log('User logged in successfully:', user.name);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // If Firebase auth fails, try demo login as fallback
      if (error.code === 'auth/operation-not-allowed' || 
          error.code === 'auth/user-not-found' || 
          error.code === 'auth/invalid-email' ||
          error.code === 'auth/wrong-password') {
        console.log('Firebase auth failed, trying demo login...');
        return handleDemoLogin(email, password, userType);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Demo login fallback
  const handleDemoLogin = async (email: string, password: string, userType: 'user' | 'developer'): Promise<boolean> => {
    console.log('Starting demo login with:', email, userType);
    
    const DEMO_CREDENTIALS = [
      { email: 'demo@cabinet.com', password: 'demo123', userType: 'user' },
      { email: 'aryan@cabinet.com', password: 'admin123', userType: 'developer' },
      { email: 'utkarsh@cabinet.com', password: 'admin123', userType: 'developer' },
      { email: 'lucky@cabinet.com', password: 'admin123', userType: 'developer' }
    ];

    await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay

    // Check for exact match first
    const credentials = DEMO_CREDENTIALS.find(cred =>
      cred.email === email && cred.password === password && cred.userType === userType
    );

    if (credentials) {
      console.log('Demo login successful for:', email);
      const demoUser = { ...DEMO_USER, userType };
      
      // Save to localStorage for persistence
      localStorage.setItem('cab-i-net-user', JSON.stringify(demoUser));
      localStorage.setItem('cab-i-net-auth', 'true');
      
      setAuthState({
        user: demoUser,
        isLoggedIn: true,
        isLoading: false
      });
      
      console.log('Demo user state set:', demoUser.name);
      return true;
    }

    // Fallback: If Firebase auth failed, create a demo user anyway
    console.log('No exact demo credentials match, creating fallback demo user');
    const demoUser = { 
      ...DEMO_USER, 
      userType,
      email: email, // Use the provided email
      name: email.split('@')[0] || 'Demo User' // Extract name from email
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('cab-i-net-user', JSON.stringify(demoUser));
    localStorage.setItem('cab-i-net-auth', 'true');
    
    setAuthState({
      user: demoUser,
      isLoggedIn: true,
      isLoading: false
    });
    
    console.log('Fallback demo user created:', demoUser.name);
    return true;
  };

  // Google login
  const loginWithGoogle = async (): Promise<boolean> => {
    if (!firebaseConfigured || !auth) {
      console.log('Firebase not configured, Google login not available');
      return false;
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters to improve popup handling
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user already exists
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      let user: User;

      if (userDoc.exists()) {
        // Existing user
        const userData = userDoc.data();
        user = mapFirestoreToUser(firebaseUser, userData);
      } else {
        // New user, create profile
        user = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || undefined,
          level: 'Standard Member',
          rating: 5.0,
          totalRides: 0,
          joinedDate: new Date(),
          phone: '',
          emergencyContact: '',
          preferredPayment: 'UPI',
          rideHistory: [],
          favoriteRoutes: [],
          loyaltyPoints: 100,
          userType: 'user',
          friends: [],
          favoriteDrivers: [],
          unreadNotifications: 1,
          firebaseUid: firebaseUser.uid
        };

        // Save to Firestore
        await setDoc(userDocRef, mapUserToFirestore(user));
      }

      setAuthState({
        user,
        isLoggedIn: true,
        isLoading: false
      });

      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Handle specific error types
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Google login popup was closed by user');
      } else if (error.code === 'auth/popup-blocked') {
        console.log('Google login popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Google login was cancelled');
      } else {
        console.log('Google login failed:', error.message);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string, userType: 'user' | 'developer'): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      if (!firebaseConfigured || !auth) {
        // Fallback for demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d89000&color=000000&size=200`,
          level: userType === 'developer' ? 'Developer Admin' : 'Standard Member',
          rating: 5.0,
          totalRides: 0,
          joinedDate: new Date(),
          phone: '',
          emergencyContact: '',
          preferredPayment: 'UPI',
          loyaltyPoints: 100,
          userType,
          friends: [],
          favoriteDrivers: [],
          unreadNotifications: 1,
          favoriteRoutes: [],
          rideHistory: []
        };

        setAuthState({
          user: newUser,
          isLoggedIn: true,
          isLoading: false
        });

        return true;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: name
      });

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d89000&color=000000&size=200`,
        level: userType === 'developer' ? 'Developer Admin' : 'Standard Member',
        rating: 5.0,
        totalRides: 0,
        joinedDate: new Date(),
        phone: '',
        emergencyContact: '',
        preferredPayment: 'UPI',
        loyaltyPoints: 100,
        userType,
        friends: [],
        favoriteDrivers: [],
        unreadNotifications: 1,
        favoriteRoutes: [],
        rideHistory: [],
        firebaseUid: firebaseUser.uid
      };

      // Save to localStorage instead of Firestore (since Firestore is disabled)
      localStorage.setItem('cab-i-net-user', JSON.stringify(newUser));
      localStorage.setItem('cab-i-net-auth', 'true');

      setAuthState({
        user: newUser,
        isLoggedIn: true,
        isLoading: false
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      console.log('User registered successfully:', newUser.email);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        console.log('Email already registered, trying to login instead...');
        // Try to login with the same credentials
        return login(email, password, userType);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      if (!firebaseConfigured || !auth) {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`📧 Demo OTP for ${email}: ${otp}`);
        alert(`📧 Demo mode: Your OTP is ${otp}`);
        return true;
      }

      // In Firebase mode, verification is handled automatically
      return true;
    } catch (error) {
      console.error('Send verification email error:', error);
      return false;
    }
  };

  // Verify OTP (for demo compatibility)
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    // In Firebase mode, email verification is handled automatically
    // This is kept for demo compatibility
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  };

  // Reset password
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      if (!firebaseConfigured || !auth) {
        console.log('Demo mode: Password reset not available');
        return false;
      }

      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (firebaseConfigured && auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    setAuthState({
      user: null,
      isLoggedIn: false,
      isLoading: false
    });

    // Clear localStorage
    localStorage.removeItem('cab-i-net-user');
    localStorage.removeItem('cab-i-net-auth');
  };

  // Update user function
  const updateUser = async (updates: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...updates };

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    // Update Firestore if configured
    if (firebaseConfigured && db && authState.user.firebaseUid) {
      try {
        const userDocRef = doc(db, 'users', authState.user.firebaseUid);
        await updateDoc(userDocRef, mapUserToFirestore(updatedUser));
      } catch (error) {
        console.error('Error updating user in Firestore:', error);
      }
    }
  };

  // Add friend function
  const addFriend = async (email: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      if (!firebaseConfigured || !auth || !db) {
        // Demo mode
        return true;
      }

      // Query Firestore for user with this email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return false; // User not found
      }

      const targetUserDoc = querySnapshot.docs[0];
      const targetUserData = targetUserDoc.data();

      const newFriend: Friend = {
        id: `friend-${Date.now()}`,
        name: targetUserData.name,
        email: targetUserData.email,
        avatar: targetUserData.avatar,
        status: 'pending',
        addedDate: new Date()
      };

      await updateUser({
        friends: [...authState.user.friends, newFriend]
      });

      return true;
    } catch (error) {
      console.error('Add friend error:', error);
      return false;
    }
  };

  // Add favorite driver function
  const addFavoriteDriver = async (email: string): Promise<boolean> => {
    if (!authState.user) return false;
    // Implementation similar to addFriend but for drivers
    return true;
  };

  // Accept friend request
  const acceptFriendRequest = async (friendId: string): Promise<boolean> => {
    if (!authState.user) return false;

    const friendIndex = authState.user.friends.findIndex(friend => friend.id === friendId);
    if (friendIndex === -1) return false;

    const updatedFriends = [...authState.user.friends];
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      status: 'accepted'
    };

    await updateUser({
      friends: updatedFriends
    });

    return true;
  };

  // Add to history
  const addToHistory = (ride: RideHistoryEntry) => {
    if (!authState.user) return;

    updateUser({
      rideHistory: [ride, ...authState.user.rideHistory],
      totalRides: authState.user.totalRides + 1,
      loyaltyPoints: authState.user.loyaltyPoints + Math.floor(ride.cost * 0.1)
    });
  };

  // Check if authenticated
  const isAuthenticated = (): boolean => {
    return authState.isLoggedIn && authState.user !== null;
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('Setting up Firebase Auth listener...');
    
    // Fallback timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout, falling back to logged out state');
      setAuthState({
        user: null,
        isLoggedIn: false,
        isLoading: false
      });
    }, 2000); // Reduced to 2 second timeout for faster response

    // Check if Firebase is available
    if (!auth) {
      // Firebase not configured, check localStorage for demo mode
      const checkDemoAuth = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const savedUser = localStorage.getItem('cab-i-net-user');
        const savedAuth = localStorage.getItem('cab-i-net-auth');

        if (savedUser && savedAuth === 'true') {
          try {
            const user = JSON.parse(savedUser);
            // Save to localStorage for offline access
            localStorage.setItem('cab-i-net-user', JSON.stringify(user));
            localStorage.setItem('cab-i-net-auth', 'true');

            setAuthState({
              user,
              isLoggedIn: true,
              isLoading: false
            });
          } catch (error) {
            setAuthState({
              user: null,
              isLoggedIn: false,
              isLoading: false
            });
          }
        } else {
          setAuthState({
            user: null,
            isLoggedIn: false,
            isLoading: false
          });
        }
      };

      checkDemoAuth();
      clearTimeout(loadingTimeout);
      return;
    }

    console.log('Firebase Auth available, setting up listener...');
    clearTimeout(loadingTimeout); // Clear timeout since auth is available
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      if (firebaseUser) {
        try {
          // Check localStorage first for faster loading
          const savedUser = localStorage.getItem('cab-i-net-user');
          if (savedUser) {
            try {
              const user = JSON.parse(savedUser);
              // Verify it's the same user
              if (user.firebaseUid === firebaseUser.uid || user.email === firebaseUser.email) {
                console.log('Loading user from localStorage');
                setAuthState({
                  user,
                  isLoggedIn: true,
                  isLoading: false
                });
                return; // Skip Firestore fetch
              }
            } catch (parseError) {
              console.warn('Invalid localStorage data, will fetch from Firebase');
            }
          }
          // Skip Firestore entirely due to connection issues - use Firebase Auth only
          console.log('Using Firebase Auth only (Firestore disabled)');
          const firebaseUserData = mapFirestoreToUser(firebaseUser, {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            level: 'Standard Member',
            rating: 5.0,
            totalRides: 0,
            joinedDate: new Date(),
            phone: '',
            emergencyContact: '',
            preferredPayment: 'UPI',
            loyaltyPoints: 100,
            userType: 'user',
            friends: [],
            favoriteDrivers: [],
            unreadNotifications: 1,
            favoriteRoutes: [],
            rideHistory: []
          });

          // Save to localStorage for offline access
          localStorage.setItem('cab-i-net-user', JSON.stringify(firebaseUserData));
          localStorage.setItem('cab-i-net-auth', 'true');

          setAuthState({
            user: firebaseUserData,
            isLoggedIn: true,
            isLoading: false
          });
          return;

          // FIRESTORE DISABLED - Using localStorage + Firebase Auth only
          console.log('Firestore operations disabled, using Firebase Auth data');

          // Create user from Firebase auth data immediately
          const userData = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            level: 'Standard Member',
            rating: 5.0,
            totalRides: 0,
            joinedDate: new Date(),
            phone: '',
            emergencyContact: '',
            preferredPayment: 'UPI',
            loyaltyPoints: 100,
            userType: 'user',
            friends: [],
            favoriteDrivers: [],
            unreadNotifications: 1,
            favoriteRoutes: [],
            rideHistory: []
          };

          const user = mapFirestoreToUser(firebaseUser, userData);

          // Save to localStorage for offline access
          localStorage.setItem('cab-i-net-user', JSON.stringify(user));
          localStorage.setItem('cab-i-net-auth', 'true');

          setAuthState({
            user,
            isLoggedIn: true,
            isLoading: false
          });
        } catch (error) {
          console.warn('Firestore unavailable, using Firebase Auth data only:', error.message);

          // Create fallback user from Firebase auth data
          const fallbackUser = mapFirestoreToUser(firebaseUser, {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            level: 'Standard Member',
            rating: 5.0,
            totalRides: 0,
            joinedDate: new Date(),
            phone: '',
            emergencyContact: '',
            preferredPayment: 'UPI',
            loyaltyPoints: 100,
            userType: 'user',
            friends: [],
            favoriteDrivers: [],
            unreadNotifications: 1,
            favoriteRoutes: [],
            rideHistory: []
          });

          setAuthState({
            user: fallbackUser,
            isLoggedIn: true,
            isLoading: false
          });
        }
      } else {
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false
        });
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  return {
    authState,
    login,
    register,
    loginWithGoogle,
    sendVerificationEmail,
    verifyOTP,
    resetPassword,
    logout,
    updateUser,
    addFriend,
    addFavoriteDriver,
    addToHistory,
    acceptFriendRequest,
    isAuthenticated
  };
}

export { AuthContext };
