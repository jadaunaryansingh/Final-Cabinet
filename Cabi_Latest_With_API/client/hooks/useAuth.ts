import { useState, useEffect, createContext, useContext } from 'react';

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
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  loginWithGoogle?: () => Promise<boolean>;
  resetPassword?: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addFriend: (email: string) => Promise<boolean>;
  addFavoriteDriver: (email: string) => Promise<boolean>;
  addToHistory: (ride: RideHistoryEntry) => void;
  acceptFriendRequest: (friendId: string) => Promise<boolean>;
  isAuthenticated: () => boolean;
}

// Demo user accounts for testing
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
  friends: [
    {
      id: 'friend-001',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9db5294?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      status: 'accepted',
      addedDate: new Date('2023-06-15')
    },
    {
      id: 'friend-002',
      name: 'Raj Kumar',
      email: 'raj@example.com',
      status: 'pending',
      addedDate: new Date('2024-01-10')
    }
  ],
  favoriteDrivers: [
    {
      id: 'driver-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.driver@cabinet.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      vehicleNumber: 'KA 05 MZ 1234',
      vehicleType: 'Sedan',
      totalRides: 45,
      addedDate: new Date('2023-08-20')
    }
  ],
  unreadNotifications: 3,
  favoriteRoutes: [
    'Home → Work (Tech Park)',
    'Airport → Home',
    'Mall → Home'
  ],
  rideHistory: [
    {
      id: 'ride-001',
      date: new Date('2024-01-15'),
      pickup: 'Sector 14, Gurgaon',
      destination: 'Cyber City, Gurgaon',
      cost: 450,
      driver: 'Rajesh Kumar',
      rating: 5,
      distance: '8.2 km',
      duration: '22 min',
      rideType: 'Premium'
    },
    {
      id: 'ride-002',
      date: new Date('2024-01-12'),
      pickup: 'IGI Airport',
      destination: 'Sector 14, Gurgaon',
      cost: 850,
      driver: 'Suresh Sharma',
      rating: 4,
      distance: '15.8 km',
      duration: '45 min',
      rideType: 'VIP'
    },
    {
      id: 'ride-003',
      date: new Date('2024-01-10'),
      pickup: 'DLF Mall',
      destination: 'Home',
      cost: 320,
      driver: 'Amit Singh',
      rating: 5,
      distance: '6.5 km',
      duration: '18 min',
      rideType: 'Premium'
    },
    {
      id: 'ride-004',
      date: new Date('2024-01-08'),
      pickup: 'Metro Station',
      destination: 'Office Complex',
      cost: 280,
      driver: 'Vinod Kumar',
      rating: 4,
      distance: '5.2 km',
      duration: '15 min',
      rideType: 'Standard'
    },
    {
      id: 'ride-005',
      date: new Date('2024-01-05'),
      pickup: 'Restaurant',
      destination: 'Home',
      cost: 380,
      driver: 'Deepak Joshi',
      rating: 5,
      distance: '7.1 km',
      duration: '20 min',
      rideType: 'Premium'
    }
  ]
};

const DEMO_CTO: User = {
  id: 'demo-cto-001',
  email: 'aryan@cabinet.com',
  name: 'Aryan Singh',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  level: 'CTO - Chief Technology Officer',
  rating: 5.0,
  totalRides: 0,
  joinedDate: new Date('2022-01-01'),
  phone: '+91 98765 00001',
  emergencyContact: '+91 98765 00011',
  preferredPayment: 'Corporate',
  loyaltyPoints: 0,
  userType: 'developer',
  friends: [],
  favoriteDrivers: [],
  unreadNotifications: 0,
  favoriteRoutes: [],
  rideHistory: []
};

const DEMO_CEO: User = {
  id: 'demo-ceo-001',
  email: 'utkarsh@cabinet.com',
  name: 'Utkarsh Yadav',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  level: 'CEO - Chief Executive Officer',
  rating: 5.0,
  totalRides: 0,
  joinedDate: new Date('2022-01-01'),
  phone: '+91 98765 00002',
  emergencyContact: '+91 98765 00012',
  preferredPayment: 'Corporate',
  loyaltyPoints: 0,
  userType: 'developer',
  friends: [],
  favoriteDrivers: [],
  unreadNotifications: 0,
  favoriteRoutes: [],
  rideHistory: []
};

const DEMO_COO: User = {
  id: 'demo-coo-001',
  email: 'lucky@cabinet.com',
  name: 'Lucky Sain',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  level: 'COO - Chief Operating Officer',
  rating: 5.0,
  totalRides: 0,
  joinedDate: new Date('2022-01-01'),
  phone: '+91 98765 00003',
  emergencyContact: '+91 98765 00013',
  preferredPayment: 'Corporate',
  loyaltyPoints: 0,
  userType: 'developer',
  friends: [],
  favoriteDrivers: [],
  unreadNotifications: 0,
  favoriteRoutes: [],
  rideHistory: []
};

const DEMO_CREDENTIALS = [
  { email: 'demo@cabinet.com', password: 'demo123', userType: 'user' },
  { email: 'aryan@cabinet.com', password: 'admin123', userType: 'developer' },
  { email: 'utkarsh@cabinet.com', password: 'admin123', userType: 'developer' },
  { email: 'lucky@cabinet.com', password: 'admin123', userType: 'developer' }
];

// Mock database
const MOCK_USERS: User[] = [DEMO_USER, DEMO_CTO, DEMO_CEO, DEMO_COO];
const MOCK_DRIVERS = [
  { id: 'driver-002', name: 'Suresh Sharma', email: 'suresh.driver@cabinet.com', rating: 4.8, vehicleNumber: 'KA 03 AB 5678', vehicleType: 'SUV' },
  { id: 'driver-003', name: 'Amit Singh', email: 'amit.driver@cabinet.com', rating: 4.7, vehicleNumber: 'KA 02 CD 9012', vehicleType: 'Sedan' }
];

// Mock OTP storage (in real app, this would be on server)
const OTP_STORAGE: { [email: string]: { otp: string, expires: number } } = {};

// Mock pending registrations
const PENDING_REGISTRATIONS: { [email: string]: { email: string, password: string, name: string, userType: 'user' | 'developer', otp: string } } = {};

// Real email sending function
async function sendEmailWithOTP(email: string, otp: string, name?: string): Promise<boolean> {
  try {
    // Using EmailJS service for real email sending
    const emailData = {
      to_email: email,
      to_name: name || 'User',
      otp_code: otp,
      from_name: 'CAB-I-NET Team',
      subject: 'Your CAB-I-NET Verification Code',
      message: `Your verification code is: ${otp}. This code will expire in 10 minutes. Please do not share this code with anyone.`
    };

    // In a real app, you would use a backend service or EmailJS
    // For now, we'll simulate the email sending but display the OTP
    console.log('📧 Email sent to:', email);
    console.log('✅ OTP Code:', otp);
    console.log('📝 Email Content:');
    console.log(`From: ${emailData.from_name} <noreply@cabinet.com>`);
    console.log(`To: ${emailData.to_name} <${email}>`);
    console.log(`Subject: ${emailData.subject}`);
    console.log(`Message: ${emailData.message}`);
    console.log('---');
    
    // Show user-friendly notification
    alert(`📧 OTP sent to ${email}!\n\nFor testing purposes, your OTP is: ${otp}\n\nIn production, this would be sent to your email. Please check the browser console for email details.`);
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

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

  const login = async (email: string, password: string, userType: 'user' | 'developer' = 'user'): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const credentials = DEMO_CREDENTIALS.find(cred =>
      cred.email === email && cred.password === password && cred.userType === userType
    );

    if (credentials) {
      let userData: User;
      if (userType === 'developer') {
        // Find the correct developer user based on email
        if (email === 'aryan@cabinet.com') userData = { ...DEMO_CTO };
        else if (email === 'utkarsh@cabinet.com') userData = { ...DEMO_CEO };
        else if (email === 'lucky@cabinet.com') userData = { ...DEMO_COO };
        else userData = { ...DEMO_CTO }; // fallback
      } else {
        userData = { ...DEMO_USER };
      }

      setAuthState({
        user: userData,
        isLoggedIn: true,
        isLoading: false
      });

      // Save to localStorage
      localStorage.setItem('cab-i-net-user', JSON.stringify(userData));
      localStorage.setItem('cab-i-net-auth', 'true');

      return true;
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = MOCK_USERS.find(user => user.email === email);
    if (existingUser) {
      return false;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Store OTP (in real app, this would be sent via email service)
    OTP_STORAGE[email] = { otp, expires };

    // Send real email with OTP
    const emailSent = await sendEmailWithOTP(email, otp);
    
    if (!emailSent) {
      // If email sending fails, still allow testing with console log
      console.log(`📧 Email sending failed, but OTP for testing: ${otp}`);
    }

    return true;
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const storedOTP = OTP_STORAGE[email];
    if (!storedOTP) {
      console.log('❌ No OTP found for email:', email);
      return false;
    }

    if (storedOTP.otp !== otp) {
      console.log('❌ Invalid OTP. Expected:', storedOTP.otp, 'Received:', otp);
      return false;
    }

    if (Date.now() > storedOTP.expires) {
      console.log('❌ OTP expired');
      delete OTP_STORAGE[email];
      return false;
    }

    // OTP verified successfully
    console.log('✅ OTP verified successfully');
    delete OTP_STORAGE[email];
    return true;
  };

  const register = async (email: string, password: string, name: string, userType: 'user' | 'developer'): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email already exists
    const existingUser = MOCK_USERS.find(user => user.email === email);
    if (existingUser) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }

    // Create new user
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
      preferredPayment: 'UPI',
      loyaltyPoints: 100, // Welcome bonus
      userType,
      friends: [],
      favoriteDrivers: [],
      unreadNotifications: 1, // Welcome notification
      favoriteRoutes: [],
      rideHistory: []
    };

    MOCK_USERS.push(newUser);

    setAuthState({
      user: newUser,
      isLoggedIn: true,
      isLoading: false
    });

    // Save to localStorage
    localStorage.setItem('cab-i-net-user', JSON.stringify(newUser));
    localStorage.setItem('cab-i-net-auth', 'true');

    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isLoggedIn: false,
      isLoading: false
    });

    // Clear all localStorage data
    localStorage.removeItem('cab-i-net-user');
    localStorage.removeItem('cab-i-net-auth');
    localStorage.clear(); // Clear everything to ensure fresh start

    // Force page reload to ensure clean state
    window.location.href = '/login';
  };

  const updateUser = (updates: Partial<User>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...updates };
      localStorage.setItem('cab-i-net-user', JSON.stringify(updatedUser));

      return {
        ...prev,
        user: updatedUser
      };
    });
  };

  const addFriend = async (email: string): Promise<boolean> => {
    if (!authState.user) return false;

    // Check if user exists
    const userExists = MOCK_USERS.find(user => user.email === email);
    if (!userExists) return false;

    // Check if already friends
    const alreadyFriend = authState.user.friends.find(friend => friend.email === email);
    if (alreadyFriend) return false;

    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name: userExists.name,
      email: userExists.email,
      avatar: userExists.avatar,
      status: 'pending',
      addedDate: new Date()
    };

    updateUser({
      friends: [...authState.user.friends, newFriend]
    });

    // Send real email invitation
    const invitationSent = await sendEmailWithOTP(
      email, 
      'INVITE', 
      userExists.name
    );

    console.log(`📧 Friend invitation ${invitationSent ? 'sent' : 'failed'} to ${email} from ${authState.user.name}`);

    return true;
  };

  const acceptFriendRequest = async (friendId: string): Promise<boolean> => {
    if (!authState.user) return false;

    const friendIndex = authState.user.friends.findIndex(friend => friend.id === friendId);
    if (friendIndex === -1) return false;

    const updatedFriends = [...authState.user.friends];
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      status: 'accepted'
    };

    updateUser({
      friends: updatedFriends
    });

    return true;
  };

  const addFavoriteDriver = async (email: string): Promise<boolean> => {
    if (!authState.user) return false;

    // Check if driver exists
    const driverExists = MOCK_DRIVERS.find(driver => driver.email === email);
    if (!driverExists) return false;

    // Check if already in favorites
    const alreadyFavorite = authState.user.favoriteDrivers.find(driver => driver.email === email);
    if (alreadyFavorite) return false;

    const newFavoriteDriver: FavoriteDriver = {
      id: `favdriver-${Date.now()}`,
      name: driverExists.name,
      email: driverExists.email,
      rating: driverExists.rating,
      vehicleNumber: driverExists.vehicleNumber,
      vehicleType: driverExists.vehicleType,
      totalRides: 0,
      addedDate: new Date()
    };

    updateUser({
      favoriteDrivers: [...authState.user.favoriteDrivers, newFavoriteDriver]
    });

    return true;
  };

  const addToHistory = (ride: RideHistoryEntry) => {
    if (!authState.user) return;

    updateUser({
      rideHistory: [ride, ...authState.user.rideHistory],
      totalRides: authState.user.totalRides + 1,
      loyaltyPoints: authState.user.loyaltyPoints + Math.floor(ride.cost * 0.1) // 10% of cost as points
    });
  };

  const isAuthenticated = (): boolean => {
    return authState.isLoggedIn && authState.user !== null;
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('cab-i-net-user');
        const savedAuth = localStorage.getItem('cab-i-net-auth');

        // Add a small delay to ensure proper loading state
        await new Promise(resolve => setTimeout(resolve, 500));

        if (savedUser && savedAuth === 'true') {
          try {
            const user = JSON.parse(savedUser);

            // Validate user object structure
            if (!user.id || !user.email || !user.name) {
              throw new Error('Invalid user data');
            }

            // Convert date strings back to Date objects
            user.joinedDate = new Date(user.joinedDate);
            user.rideHistory = (user.rideHistory || []).map((ride: any) => ({
              ...ride,
              date: new Date(ride.date)
            }));

            // Ensure all required properties exist
            user.friends = user.friends || [];
            user.favoriteDrivers = user.favoriteDrivers || [];
            user.unreadNotifications = user.unreadNotifications || 0;

            setAuthState({
              user,
              isLoggedIn: true,
              isLoading: false
            });
          } catch (error) {
            console.error('Failed to load saved user:', error);
            // Clear invalid data
            localStorage.removeItem('cab-i-net-user');
            localStorage.removeItem('cab-i-net-auth');
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
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    // Not available in demo mode
    console.log('Google login is not available in demo mode');
    return false;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Not available in demo mode
    console.log('Password reset is not available in demo mode');
    return false;
  };

  return {
    authState,
    login,
    register,
    sendVerificationEmail,
    verifyOTP,
    loginWithGoogle,
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
