interface HeartbeatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function HeartbeatLogo({ size = 'md', className = '' }: HeartbeatLogoProps) {
  const sizes = {
    sm: { container: 'h-10 w-10' },
    md: { container: 'h-12 w-12' },
    lg: { container: 'h-16 w-16' },
    xl: { container: 'h-20 w-20' }
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`${sizeConfig.container} relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.4))'
        }}
      >
        {/* ECG Line with animation */}
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          d="M 5 50 L 20 50 L 25 30 L 30 70 L 35 20 L 40 50 L 50 50 L 55 50 L 60 30 L 65 70 L 70 20 L 75 50 L 95 50"
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        >
          {/* Pulsing animation */}
          <animate
            attributeName="stroke-dasharray"
            values="0,200;200,0;0,200"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Heartbeat pulse circles */}
        <circle cx="35" cy="20" r="2" fill="#ec4899" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2s"
            begin="0.3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="2;4;2"
            dur="2s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="70" cy="20" r="2" fill="#6366f1" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2s"
            begin="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="2;4;2"
            dur="2s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
