interface IconProps {
  className?: string;
  size?: number;
}

export const YellowCabIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <path 
      d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
      fill="url(#yellowGradient)"
      className="drop-shadow-lg"
    />
    <circle cx="6" cy="8" r="1" fill="hsl(var(--cabinet-dark))" />
    <circle cx="18" cy="8" r="1" fill="hsl(var(--cabinet-dark))" />
  </svg>
);

export const YellowDashboardIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="7" height="7" rx="1" fill="url(#dashGradient)" />
    <rect x="14" y="3" width="7" height="7" rx="1" fill="url(#dashGradient)" />
    <rect x="3" y="14" width="7" height="7" rx="1" fill="url(#dashGradient)" />
    <rect x="14" y="14" width="7" height="7" rx="1" fill="url(#dashGradient)" />
    <circle cx="6.5" cy="6.5" r="1.5" fill="hsl(var(--cabinet-dark))" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="hsl(var(--cabinet-dark))" />
    <circle cx="6.5" cy="17.5" r="1.5" fill="hsl(var(--cabinet-dark))" />
    <circle cx="17.5" cy="17.5" r="1.5" fill="hsl(var(--cabinet-dark))" />
  </svg>
);

export const YellowCommunityIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-gold))" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="8" r="4" fill="url(#communityGradient)" />
    <circle cx="16" cy="6" r="3" fill="url(#communityGradient)" opacity="0.8" />
    <circle cx="5" cy="6" r="3" fill="url(#communityGradient)" opacity="0.8" />
    <path d="M9 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" fill="url(#communityGradient)" />
    <path d="M16 12c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" fill="url(#communityGradient)" opacity="0.7" />
    <path d="M5 12c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" fill="url(#communityGradient)" opacity="0.7" />
  </svg>
);

export const YellowEntertainmentIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="entertainmentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#entertainmentGradient)" />
    <rect x="4" y="6" width="16" height="10" rx="1" fill="hsl(var(--cabinet-dark))" opacity="0.3" />
    <polygon points="10,8 10,16 16,12" fill="url(#entertainmentGradient)" />
    <circle cx="6" cy="19" r="1.5" fill="url(#entertainmentGradient)" />
    <circle cx="18" cy="19" r="1.5" fill="url(#entertainmentGradient)" />
    <rect x="7" y="18.5" width="10" height="1" fill="url(#entertainmentGradient)" />
  </svg>
);

export const YellowFriendsIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="friendsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <circle cx="8" cy="8" r="3.5" fill="url(#friendsGradient)" />
    <circle cx="16" cy="8" r="3.5" fill="url(#friendsGradient)" />
    <path d="M8 14c-3 0-5 1.5-5 3v3h10v-3c0-1.5-2-3-5-3z" fill="url(#friendsGradient)" />
    <path d="M16 14c-3 0-5 1.5-5 3v3h10v-3c0-1.5-2-3-5-3z" fill="url(#friendsGradient)" />
    <circle cx="6" cy="6" r="1" fill="hsl(var(--cabinet-dark))" />
    <circle cx="10" cy="6" r="1" fill="hsl(var(--cabinet-dark))" />
    <circle cx="14" cy="6" r="1" fill="hsl(var(--cabinet-dark))" />
    <circle cx="18" cy="6" r="1" fill="hsl(var(--cabinet-dark))" />
  </svg>
);

export const YellowStarIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
      <filter id="starGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="url(#starGradient)"
      filter="url(#starGlow)"
      className="drop-shadow-lg"
    />
    <path
      d="M12 4l2.4 4.86L19 9.7l-3.5 3.41L16.4 18L12 15.77L7.6 18l.9-4.89L5 9.7l4.6-.84L12 4z"
      fill="hsl(var(--cabinet-light-yellow))"
      opacity="0.8"
    />
  </svg>
);

// Vehicle Type Icons for Ride Selection
export const YellowCarIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" fill="url(#carGradient)" />
    <circle cx="6.5" cy="16" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="17.5" cy="16" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="6.5" cy="16" r="1" fill="url(#carGradient)" />
    <circle cx="17.5" cy="16" r="1" fill="url(#carGradient)" />
    <rect x="5" y="11" width="14" height="1" fill="hsl(var(--cabinet-dark))" opacity="0.3" />
  </svg>
);

export const YellowEcoIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.06.66C6.16 17.23 9 14 17 12V8z" fill="url(#ecoGradient)" />
    <path d="M3.82 21.34C5.9 16.17 8 10 17 8v4c8 2 2.93 8.17.85 13.34l-1.06-.66C18.84 19.77 16 16.54 8 18.54l-4.18 2.8z" fill="url(#ecoGradient)" opacity="0.7" />
    <circle cx="12" cy="12" r="1.5" fill="url(#ecoGradient)" />
    <path d="M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="url(#ecoGradient)" opacity="0.5" transform="scale(0.5) translate(12, 8)" />
  </svg>
);

export const YellowLuxuryIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="33%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="66%" stopColor="hsl(var(--cabinet-light-yellow))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-yellow))" />
      </linearGradient>
      <filter id="luxuryGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M19 6.5h-3l-1-2h-6l-1 2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z" fill="url(#luxuryGradient)" filter="url(#luxuryGlow)" />
    <circle cx="10" cy="16" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="18" cy="16" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="10" cy="16" r="1" fill="url(#luxuryGradient)" />
    <circle cx="18" cy="16" r="1" fill="url(#luxuryGradient)" />
    <rect x="6" y="9" width="12" height="4" rx="1" fill="hsl(var(--cabinet-dark))" opacity="0.2" />
    <path d="M12 7l1 2-1 2-1-2z" fill="url(#luxuryGradient)" />
  </svg>
);

export const YellowXLIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="xlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <path d="M20 8h-3l-1.5-3h-7L7 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2v1c0 .55.45 1 1 1s1-.45 1-1v-1h8v1c0 .55.45 1 1 1s1-.45 1-1v-1h2c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z" fill="url(#xlGradient)" />
    <circle cx="7" cy="17" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="17" cy="17" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="7" cy="17" r="1" fill="url(#xlGradient)" />
    <circle cx="17" cy="17" r="1" fill="url(#xlGradient)" />
    <rect x="5" y="11" width="14" height="3" rx="1" fill="hsl(var(--cabinet-dark))" opacity="0.2" />
    <text x="12" y="13" textAnchor="middle" fontSize="8" fill="url(#xlGradient)" fontWeight="bold">XL</text>
  </svg>
);

export const YellowBikeIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="bikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <circle cx="5" cy="17" r="3" fill="none" stroke="url(#bikeGradient)" strokeWidth="2" />
    <circle cx="19" cy="17" r="3" fill="none" stroke="url(#bikeGradient)" strokeWidth="2" />
    <path d="M12 6l-2 4h4l-2-4z" fill="url(#bikeGradient)" />
    <path d="M8 17l4-7 4 7" fill="none" stroke="url(#bikeGradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 10h3l2 7" fill="none" stroke="url(#bikeGradient)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="6" r="1" fill="url(#bikeGradient)" />
    <path d="M10 8l4 2" stroke="url(#bikeGradient)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const YellowAutoIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="autoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
    </defs>
    <path d="M4 11h16l-2-3H6l-2 3z" fill="url(#autoGradient)" />
    <path d="M4 11v6c0 1.1.9 2 2 2h1c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-1.66 1.34-3 3-3s3 1.34 3 3h1c1.1 0 2-.9 2-2v-6H4z" fill="url(#autoGradient)" />
    <circle cx="10" cy="17" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="18" cy="17" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="10" cy="17" r="1" fill="url(#autoGradient)" />
    <circle cx="18" cy="17" r="1" fill="url(#autoGradient)" />
    <path d="M12 4l1 4-1 4h-2l-1-4 1-4h2z" fill="url(#autoGradient)" />
    <rect x="8" y="13" width="8" height="1" fill="hsl(var(--cabinet-dark))" opacity="0.3" />
  </svg>
);

export const YellowERickshawIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="erickshawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" />
        <stop offset="50%" stopColor="hsl(var(--cabinet-gold))" />
        <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" />
      </linearGradient>
      <filter id="electricGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M5 11h14l-1-3H6l-1 3z" fill="url(#erickshawGradient)" />
    <path d="M5 11v6c0 1.1.9 2 2 2h1c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-1.66 1.34-3 3-3s3 1.34 3 3h1c1.1 0 2-.9 2-2v-6H5z" fill="url(#erickshawGradient)" />
    <circle cx="10" cy="17" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="18" cy="17" r="2" fill="hsl(var(--cabinet-dark))" />
    <circle cx="10" cy="17" r="1" fill="url(#erickshawGradient)" />
    <circle cx="18" cy="17" r="1" fill="url(#erickshawGradient)" />
    <path d="M12 3l2 5-2 3-2-3 2-5z" fill="url(#erickshawGradient)" filter="url(#electricGlow)" />
    <circle cx="12" cy="3" r="1" fill="url(#erickshawGradient)" filter="url(#electricGlow)" />
    <path d="M10 5h4" stroke="url(#erickshawGradient)" strokeWidth="1" />
    <path d="M11 7h2" stroke="url(#erickshawGradient)" strokeWidth="1" />
  </svg>
);
