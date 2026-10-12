import React from 'react';

interface FlowingBlueRibbonsProps {
  className?: string;
}

export const FlowingBlueRibbons: React.FC<FlowingBlueRibbonsProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-85"
      >
        <defs>
          {/* Ribbon 1: Royal Blue to Electric Azure Translucent Gradient */}
          <linearGradient id="blueRibbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#062B50" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#0866C6" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#168FE5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8F3FF" stopOpacity="0.1" />
          </linearGradient>

          {/* Ribbon 2: Electric Azure to Ice Blue Gradient */}
          <linearGradient id="blueRibbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#168FE5" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#0866C6" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#062B50" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E8F3FF" stopOpacity="0.05" />
          </linearGradient>

          {/* Ribbon 3: High-Gloss Specular Edge Gradient */}
          <linearGradient id="specularGlint" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#168FE5" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0866C6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>

          {/* Soft Ambient Caustic Filter */}
          <filter id="softRibbonBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* =============================================================
            RIBBON LAYER 1: Deep Navy & Royal Blue Structural Wave
            Animated with slow 11s undulating transform
            ============================================================= */}
        <g className="derote-ribbon-wave-1">
          <path
            d="M-80 320 C 260 210, 520 480, 890 280 C 1180 120, 1380 260, 1560 180 L 1580 440 C 1320 540, 1080 380, 780 490 C 420 620, 180 420, -80 500 Z"
            fill="url(#blueRibbonGrad1)"
            opacity="0.35"
          />
        </g>

        {/* =============================================================
            RIBBON LAYER 2: Main Flowing Translucent Royal Blue Ribbon
            Animated with smooth 8.5s sinusoidal breathing
            ============================================================= */}
        <g className="derote-ribbon-wave-2">
          {/* Main Translucent Body */}
          <path
            d="M-50 240 C 290 120, 590 410, 940 190 C 1220 20, 1390 190, 1550 90 L 1520 220 C 1360 310, 1180 160, 900 310 C 580 480, 260 260, -50 360 Z"
            fill="url(#blueRibbonGrad2)"
            opacity="0.55"
            filter="url(#softRibbonBlur)"
          />

          {/* Crisp Highlight Specular Edge on Top Border of Ribbon */}
          <path
            d="M-50 240 C 290 120, 590 410, 940 190 C 1220 20, 1390 190, 1550 90"
            stroke="url(#specularGlint)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Secondary Parallel Accent Filament */}
          <path
            d="M-20 255 C 310 138, 605 422, 950 205 C 1230 40, 1395 205, 1540 110"
            stroke="#168FE5"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* =============================================================
            RIBBON LAYER 3: Ambient Translucent Azure & Ice-Blue Undulation
            Animated with 14s counter-wave cycle
            ============================================================= */}
        <g className="derote-ribbon-wave-3">
          <path
            d="M120 80 C 440 220, 720 70, 1050 220 C 1260 310, 1420 180, 1540 240"
            stroke="#E8F3FF"
            strokeWidth="58"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M180 95 C 480 235, 750 85, 1070 235 C 1280 325, 1430 200, 1540 255"
            stroke="#168FE5"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>

        {/* =============================================================
            ORGANIC FLOATING ACCENT FORMS & GLOW MOTES
            Subtle floating glass-like orbs along the ribbon trajectory
            ============================================================= */}
        <g className="derote-ribbon-motes">
          <circle cx="480" cy="240" r="18" fill="#E8F3FF" opacity="0.6" />
          <circle cx="480" cy="240" r="18" stroke="#0866C6" strokeWidth="1.5" opacity="0.4" />
          <circle cx="485" cy="235" r="4" fill="#FFFFFF" opacity="0.9" />

          <circle cx="890" cy="180" r="12" fill="#E8F3FF" opacity="0.5" />
          <circle cx="890" cy="180" r="12" stroke="#168FE5" strokeWidth="1.5" opacity="0.4" />
          <circle cx="893" cy="177" r="3" fill="#FFFFFF" opacity="0.8" />

          <circle cx="1180" cy="140" r="8" fill="#168FE5" opacity="0.4" />
          <circle cx="280" cy="310" r="6" fill="#0866C6" opacity="0.3" />
        </g>
      </svg>

      <style>{`
        /* -------------------------------------------------------------
           SMOOTH GPU-ACCELERATED CSS RIBBON MOTION
           ------------------------------------------------------------- */
        .derote-ribbon-wave-1 {
          transform-origin: 50% 50%;
          animation: ribbonDrift1 11s ease-in-out infinite alternate;
          will-change: transform;
        }

        .derote-ribbon-wave-2 {
          transform-origin: 45% 45%;
          animation: ribbonDrift2 8.5s ease-in-out infinite alternate;
          will-change: transform;
        }

        .derote-ribbon-wave-3 {
          transform-origin: 60% 50%;
          animation: ribbonDrift3 14s ease-in-out infinite alternate;
          will-change: transform;
        }

        .derote-ribbon-motes {
          animation: ribbonMotesFloat 6s ease-in-out infinite alternate;
          will-change: transform;
        }

        @keyframes ribbonDrift1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          100% {
            transform: translate3d(24px, -16px, 0) scale(1.025) rotate(1.4deg);
          }
        }

        @keyframes ribbonDrift2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate3d(-18px, 12px, 0) scale(1.02) rotate(-0.8deg);
          }
          100% {
            transform: translate3d(14px, -10px, 0) scale(0.985) rotate(0.9deg);
          }
        }

        @keyframes ribbonDrift3 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(-20px, 18px, 0) scale(1.03);
          }
        }

        @keyframes ribbonMotesFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(10px, -14px, 0);
          }
        }

        /* -------------------------------------------------------------
           RESPECT PREFERS-REDUCED-MOTION
           Strictly disables all animation when user prefers reduced motion
           ------------------------------------------------------------- */
        @media (prefers-reduced-motion: reduce) {
          .derote-ribbon-wave-1,
          .derote-ribbon-wave-2,
          .derote-ribbon-wave-3,
          .derote-ribbon-motes {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};
