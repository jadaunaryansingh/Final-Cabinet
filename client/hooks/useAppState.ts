import { useState, useEffect, createContext, useContext } from "react";

interface AppState {
  user: {
    name: string;
    level: string;
    rating: number;
    totalRides: number;
    isLoggedIn: boolean;
  };
  currentBooking: {
    pickup: string;
    destination: string;
    rideType: string;
    status: "idle" | "booking" | "confirmed" | "ongoing" | "completed";
    driver?: {
      name: string;
      rating: number;
      eta: string;
      vehicleNumber: string;
    };
  };
  notifications: Array<{
    id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    timestamp: Date;
  }>;
  preferences: {
    theme: "dark" | "light";
    language: string;
    voiceEnabled: boolean;
    notifications: boolean;
  };
}

const initialState: AppState = {
  user: {
    name: "Guest User",
    level: "Premium",
    rating: 4.8,
    totalRides: 47,
    isLoggedIn: false,
  },
  currentBooking: {
    pickup: "",
    destination: "",
    rideType: "premium",
    status: "idle",
  },
  notifications: [],
  preferences: {
    theme: "dark",
    language: "en",
    voiceEnabled: true,
    notifications: true,
  },
};

export const AppStateContext = createContext<{
  state: AppState;
  updateUser: (user: Partial<AppState["user"]>) => void;
  updateBooking: (booking: Partial<AppState["currentBooking"]>) => void;
  addNotification: (
    notification: Omit<AppState["notifications"][0], "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  updatePreferences: (preferences: Partial<AppState["preferences"]>) => void;
} | null>(null);

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export function useAppStateProvider() {
  const [state, setState] = useState<AppState>(initialState);

  const updateUser = (user: Partial<AppState["user"]>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...user },
    }));
  };

  const updateBooking = (booking: Partial<AppState["currentBooking"]>) => {
    setState((prev) => ({
      ...prev,
      currentBooking: { ...prev.currentBooking, ...booking },
    }));
  };

  const addNotification = (
    notification: Omit<AppState["notifications"][0], "id" | "timestamp">,
  ) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      notifications: [...prev.notifications, newNotification],
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  };

  const updatePreferences = (preferences: Partial<AppState["preferences"]>) => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  };

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("cab-i-net-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Convert timestamp strings back to Date objects
        if (parsed.notifications) {
          parsed.notifications = parsed.notifications.map(
            (notification: any) => ({
              ...notification,
              timestamp: new Date(notification.timestamp),
            }),
          );
        }
        setState((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cab-i-net-state", JSON.stringify(state));
  }, [state]);

  return {
    state,
    updateUser,
    updateBooking,
    addNotification,
    removeNotification,
    updatePreferences,
  };
}
