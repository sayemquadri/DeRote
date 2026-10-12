import React, { useState } from 'react';
import blueHeroSculpture from '../assets/images/derote_blue_hero_sculpture_1791725693793.jpg';

interface HeroVisualProps {
  className?: string;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ className = '' }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={`relative w-full max-w-[500px] mx-auto select-none ${className}`}
      aria-label="DeRote abstract blue sculptural artwork with floating translucent shapes"
    >
      {/* -------------------------------------------------------------
          BACKGROUND AMBIENT GLOW LAYER
          ------------------------------------------------------------- */}
      <div
        className="absolute -inset-4 bg-gradient-to-tr from-[#E8F3FF] via-[#168FE5]/15 to-[#0866C6]/10 rounded-[36px] blur-xl opacity-75 pointer-events-none hero-ambient-pulse"
        aria-hidden="true"
      />

      {/* -------------------------------------------------------------
          MAIN ARTWORK CARD CONTAINER
          ------------------------------------------------------------- */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-[#062B50]/8 border border-[#E8F3FF] group">
        {/* Placeholder mesh while loading */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-white via-[#F4F8FD] to-[#E8F3FF] transition-opacity duration-500 flex items-center justify-center ${
            imgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E8F3FF] border border-[#168FE5]/30 animate-pulse" />
        </div>

        {/* High-Resolution 3D Blue Sculptural Artwork */}
        <img
          src={blueHeroSculpture}
          alt="DeRote abstract 3D sculpture with deep navy ribbons and crystalline arches on white"
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02] ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Smooth CSS Glass Highlight Sheen Sweep */}
        <div
          className="absolute inset-0 pointer-events-none hero-glass-sheen"
          aria-hidden="true"
        />

        {/* Polished Inset Border */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-[#0866C6]/15"
          aria-hidden="true"
        />
      </div>

      {/* -------------------------------------------------------------
          FLOATING TRANSLUCENT BLUE ORGANIC SHAPE 1 (Top-Left Arch Pill)
          Flows with 7s smooth vertical and rotational float
          ------------------------------------------------------------- */}
      <div
        className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 z-20 pointer-events-none hero-float-shape-1"
        aria-hidden="true"
      >
        <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#E8F3FF] shadow-lg shadow-[#062B50]/6 flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[#168FE5] to-[#0866C6] shadow-xs" />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0866C6] leading-none">
              Perspective
            </span>
            <span className="text-[11px] font-semibold text-[#062B50] leading-tight">
              Self-Discovery
            </span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          FLOATING TRANSLUCENT BLUE ORGANIC SHAPE 2 (Bottom-Right Glass Orb)
          Flows with 8.5s floating rhythm
          ------------------------------------------------------------- */}
      <div
        className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 z-20 pointer-events-none hero-float-shape-2"
        aria-hidden="true"
      >
        <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#062B50]/90 to-[#0866C6]/90 text-white backdrop-blur-md shadow-xl shadow-[#0866C6]/20 border border-white/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#168FE5] animate-ping opacity-75" />
          <span className="text-xs font-bold tracking-tight">Classes 5–12</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          FLOATING TRANSLUCENT BLUE ORGANIC SHAPE 3 (Middle-Left Ribbon Pill)
          Translucent layered glass ribbon accent with 6s counter-motion
          ------------------------------------------------------------- */}
      <div
        className="absolute top-1/2 -left-6 -translate-y-1/2 hidden sm:block z-10 pointer-events-none hero-float-shape-3"
        aria-hidden="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#168FE5]/35 to-[#0866C6]/25 backdrop-blur-md border border-white/60 shadow-md flex items-center justify-center">
          <div className="w-6 h-6 rounded-xl bg-white/70 shadow-xs flex items-center justify-center">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-3.5 h-3.5 text-[#0866C6]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13C3 7.477 7.477 3 13 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          CSS KEYFRAMES: SMOOTH FLOATING EFFECTS & ACCESSIBILITY
          ------------------------------------------------------------- */}
      <style>{`
        /* Smooth, floating CSS keyframes for translucent blue shapes */
        .hero-float-shape-1 {
          animation: heroFloat1 7s ease-in-out infinite alternate;
          will-change: transform;
        }

        .hero-float-shape-2 {
          animation: heroFloat2 8.5s ease-in-out infinite alternate;
          will-change: transform;
        }

        .hero-float-shape-3 {
          animation: heroFloat3 6s ease-in-out infinite alternate;
          will-change: transform;
        }

        .hero-ambient-pulse {
          animation: heroAmbientPulse 9s ease-in-out infinite alternate;
          will-change: opacity, transform;
        }

        .hero-glass-sheen {
          background: linear-gradient(
            115deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(22, 143, 229, 0.15) 55%,
            transparent 65%,
            transparent 100%
          );
          background-size: 250% 250%;
          animation: heroSheenSweep 8s ease-in-out infinite;
          mix-blend-mode: soft-light;
          will-change: background-position;
        }

        @keyframes heroFloat1 {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(6px, -10px, 0) rotate(1.5deg);
          }
          100% {
            transform: translate3d(-4px, -16px, 0) rotate(-1deg);
          }
        }

        @keyframes heroFloat2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-8px, -12px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(6px, -6px, 0) scale(0.98);
          }
        }

        @keyframes heroFloat3 {
          0% {
            transform: translate3d(0, -50%, 0) rotate(0deg);
          }
          100% {
            transform: translate3d(8px, calc(-50% - 14px), 0) rotate(6deg);
          }
        }

        @keyframes heroAmbientPulse {
          0% {
            opacity: 0.55;
            transform: scale(0.98);
          }
          100% {
            opacity: 0.85;
            transform: scale(1.03);
          }
        }

        @keyframes heroSheenSweep {
          0% {
            background-position: 200% 0%;
          }
          50% {
            background-position: -50% 100%;
          }
          100% {
            background-position: 200% 0%;
          }
        }

        /* Respect prefers-reduced-motion media queries */
        @media (prefers-reduced-motion: reduce) {
          .hero-float-shape-1,
          .hero-float-shape-2,
          .hero-float-shape-3,
          .hero-ambient-pulse,
          .hero-glass-sheen {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};
