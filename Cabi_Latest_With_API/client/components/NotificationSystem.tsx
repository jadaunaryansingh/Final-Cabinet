import { useAppState } from "../hooks/useAppState";
import { CheckCircle, AlertCircle, Info, X, Bell } from "lucide-react";

export default function NotificationSystem() {
  const { state, removeNotification } = useAppState();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500/50 bg-green-500/20 text-green-400";
      case "error":
        return "border-red-500/50 bg-red-500/20 text-red-400";
      case "warning":
        return "border-orange-500/50 bg-orange-500/20 text-orange-400";
      default:
        return "border-cabinet-yellow/50 bg-cabinet-yellow/20 text-cabinet-yellow";
    }
  };

  if (state.notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`glass-morphism-hover rounded-2xl p-4 border ${getColors(notification.type)} animate-slide-up hover-lift`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-white font-accent font-medium text-sm leading-relaxed">
                {notification.message}
              </p>
              <p className="text-xs opacity-70 mt-1">
                {notification.timestamp instanceof Date
                  ? notification.timestamp.toLocaleTimeString()
                  : new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-white/60 hover:text-white transition-colors duration-300 hover:scale-110 magnetic"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
