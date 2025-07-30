import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogIn, Heart, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  YellowCabIcon,
  YellowDashboardIcon,
  YellowCommunityIcon,
  YellowEntertainmentIcon,
  YellowFriendsIcon,
  YellowStarIcon,
} from "./CustomIcons";
import { useAuth } from "@/hooks/useUnifiedAuth";
import LoginDialog from "./LoginDialog";
import UserProfile from "./UserProfile";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEntertainment, setShowEntertainment] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const location = useLocation();
  const { authState } = useAuth();

  // Different navigation based on user type
  const userNavLinks = [
    {
      name: "Cab",
      href: "/booking",
      icon: <YellowCabIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <YellowDashboardIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Community",
      href: "/community",
      icon: <YellowCommunityIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Entertainment",
      href: "/entertainment",
      icon: (
        <YellowEntertainmentIcon size={24} className="animate-glow-pulse" />
      ),
    },
    {
      name: "Friends",
      href: "/friends",
      icon: <YellowFriendsIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Fvrt Drivers",
      href: "/favorite-drivers",
      icon: <YellowStarIcon size={24} className="animate-glow-pulse" />,
    },
  ];

  const developerNavLinks = [
    {
      name: "Admin Portal",
      href: "/developer-dashboard",
      icon: <YellowDashboardIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Live Rides",
      href: "/live-rides",
      icon: <YellowCabIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Customer Feedback",
      href: "/customer-feedback",
      icon: <YellowCommunityIcon size={24} className="animate-glow-pulse" />,
    },
    {
      name: "Revenue Analytics",
      href: "/revenue-analytics",
      icon: <YellowStarIcon size={24} className="animate-glow-pulse" />,
    },
  ];

  const navLinks =
    authState.user?.userType === "developer" ? developerNavLinks : userNavLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-morphism border-b border-glass-border">
        {/* First Row - Logo, CAB-I-NET, User */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Top Left - CAB-I-NET Logo */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-16 h-16 hover-lift magnetic group cursor-pointer">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-cabinet-yellow/50 bg-cabinet-yellow/10 p-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F39a2607ac6ea47489c1c09edb4355799%2F542a7c303535476981e07aa791111a6b?format=webp&width=800"
                      alt="CAB-I-NET Logo"
                      className="w-full h-full object-contain rounded-full animate-glow-pulse group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-cabinet-yellow/30 rounded-full blur-xl animate-breathe"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-cabinet-yellow font-display font-bold text-xl tracking-tight text-gradient">
                  CAB-I-NET
                </div>
                <div className="text-cabinet-grey text-sm font-accent font-medium tracking-wider uppercase">
                  Premium Rides
                </div>
              </div>
            </div>

            {/* Center - Glowing Cursive Neon Sign */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-neon font-display font-black text-5xl tracking-tighter animate-glow-pulse italic text-gradient text-shadow-glow hover:scale-105 transition-transform duration-300">
                CAB-I-NET
              </h1>
              <div className="text-center text-cabinet-grey text-xs font-accent font-medium tracking-[0.2em] mt-2 uppercase animate-shimmer">
                LUXURY TRANSPORT
              </div>
            </div>

            {/* Top Right - User Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                {authState.isLoggedIn && authState.user ? (
                  <>
                    {/* User Avatar and Profile */}
                    <button
                      onClick={() => setShowUserProfile(true)}
                      className="flex items-center space-x-3 glass-morphism-hover rounded-full border border-cabinet-yellow/30 px-3 py-2 text-cabinet-yellow hover-glow magnetic group transition-all duration-300"
                    >
                      <Avatar className="w-8 h-8 border border-cabinet-yellow/50">
                        <AvatarImage
                          src={authState.user.avatar}
                          alt={authState.user.name}
                        />
                        <AvatarFallback className="bg-cabinet-yellow/20 text-cabinet-yellow text-xs font-bold">
                          {authState.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-xs font-accent font-semibold">
                          {authState.user.name.split(" ")[0]}
                        </p>
                        <p className="text-xs text-cabinet-grey">
                          {authState.user.level}
                        </p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest User Icon */}
                    <button className="w-12 h-12 glass-morphism-hover rounded-full border border-cabinet-yellow/30 flex items-center justify-center text-cabinet-yellow hover-glow magnetic group">
                      <User className="w-6 h-6 group-hover:animate-bounce-gentle transition-all duration-300" />
                    </button>
                    {/* Login Button */}
                    <Button
                      onClick={() => setShowLoginDialog(true)}
                      className="btn-premium px-6 py-3 rounded-full font-accent font-semibold text-sm tracking-wide hover-lift relative z-10"
                    >
                      <LogIn className="w-4 h-4 inline mr-2" />
                      Login
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors duration-300"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Navigation Options */}
        <div className="hidden md:block border-t border-cabinet-yellow/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8 py-3">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <div
                    onMouseEnter={() =>
                      link.name === "Entertainment" &&
                      setShowEntertainment(true)
                    }
                    onMouseLeave={() =>
                      link.name === "Entertainment" &&
                      setShowEntertainment(false)
                    }
                    className="relative"
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center space-x-3 transition-all duration-500 hover-lift font-accent font-semibold px-4 py-3 rounded-xl glass-morphism-hover group relative overflow-hidden ${
                        location.pathname === link.href
                          ? "bg-cabinet-yellow/20 border border-cabinet-yellow/40 text-cabinet-yellow"
                          : "bg-transparent border border-transparent text-cabinet-grey hover:text-cabinet-yellow hover:bg-cabinet-yellow/10"
                      }`}
                    >
                      <div className="group-hover:animate-bounce-gentle transition-all duration-300 z-10 group-hover:scale-110">
                        {link.icon}
                      </div>
                      <span className="text-sm font-bold tracking-wide z-10">
                        {link.name}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cabinet-light-yellow/0 via-cabinet-light-yellow/20 to-cabinet-light-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    {/* Entertainment Dropdown */}
                    {link.name === "Entertainment" && showEntertainment && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 glass-morphism rounded-2xl p-6 shadow-2xl border border-cabinet-yellow/20 z-50"
                        onMouseEnter={() => setShowEntertainment(true)}
                        onMouseLeave={() => setShowEntertainment(false)}
                      >
                        <h3 className="text-cabinet-yellow font-bold text-lg mb-4 text-center">
                          Entertainment Hub
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="group cursor-pointer">
                            <div className="bg-red-600 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                              <div className="text-white font-bold text-sm">
                                Netflix
                              </div>
                            </div>
                          </div>
                          <div className="group cursor-pointer">
                            <div className="bg-green-500 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                              <div className="text-white font-bold text-sm">
                                Spotify
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-600 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <div className="text-white font-bold text-sm">
                              Hotstar
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-cabinet-grey mt-3 text-center">
                          Unlock during your ride for premium entertainment
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-cabinet-yellow/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-morphism border-t border-glass-border">
            <div className="px-4 py-6 space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-neon font-cabinet font-black text-2xl tracking-wider italic">
                  CAB-I-NET
                </h1>
                <div className="text-cabinet-grey text-xs font-light tracking-wider mt-1">
                  LUXURY TRANSPORT
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center space-x-3 transition-colors duration-300 py-3 font-medium border-b border-cabinet-yellow/10 ${
                    location.pathname === link.href
                      ? "text-cabinet-yellow bg-cabinet-yellow/10 px-4 rounded-lg"
                      : "text-white hover:text-cabinet-light-yellow"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="scale-110">{link.icon}</div>
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="flex flex-col space-y-3 pt-4 border-t border-cabinet-yellow/20">
                {authState.isLoggedIn && authState.user ? (
                  <>
                    <button
                      onClick={() => setShowUserProfile(true)}
                      className="flex items-center space-x-3 text-white hover:text-cabinet-light-yellow transition-colors duration-300 py-2"
                    >
                      <Avatar className="w-6 h-6 border border-cabinet-yellow/50">
                        <AvatarImage
                          src={authState.user.avatar}
                          alt={authState.user.name}
                        />
                        <AvatarFallback className="bg-cabinet-yellow/20 text-cabinet-yellow text-xs font-bold">
                          {authState.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {authState.user.name}
                        </p>
                        <p className="text-xs text-cabinet-grey">
                          {authState.user.level}
                        </p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex items-center space-x-3 text-white hover:text-cabinet-light-yellow transition-colors duration-300 py-2">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                    <Button
                      onClick={() => setShowLoginDialog(true)}
                      className="bg-gradient-gold text-black px-4 py-2 rounded-full font-medium hover:scale-105 transition-all duration-300 text-center"
                    >
                      <LogIn className="w-4 h-4 inline mr-2" />
                      Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />

      {/* User Profile Dialog */}
      <UserProfile open={showUserProfile} onOpenChange={setShowUserProfile} />

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-32"></div>
    </>
  );
}
