import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
  decay: number;
}

const CELEBRATION_COLORS = [
  '#0866C6', // Brand Blue
  '#168FE5', // Sky Blue
  '#10B981', // Emerald
  '#059669', // Deep Emerald
  '#F59E0B', // Amber
  '#FBBF24', // Gold
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

// Optional subtle audio chime using Web Audio API
export function playCelebrationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a gentle ascending triad chord (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.1;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Soft gentle volume
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.75);
    });
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

interface CelebrationEffectProps {
  onComplete?: () => void;
  intensity?: 'subtle' | 'standard';
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  onComplete,
  intensity = 'subtle',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    // Play pleasant gentle chime
    playCelebrationChime();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate confetti particles
    const particleCount = intensity === 'subtle' ? 65 : 110;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Launch from top-left, top-middle, and top-right in slight fountains
      const originX = width * (0.2 + Math.random() * 0.6);
      const angle = (Math.random() * Math.PI) / 1.5 + Math.PI / 6;
      const speed = 4 + Math.random() * 8;
      const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'rect', 'circle', 'star'];

      particles.push({
        x: originX,
        y: height * 0.15 + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed * 0.8) - 2,
        size: 5 + Math.random() * 7,
        color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        decay: 0.003 + Math.random() * 0.004,
      });
    }

    let animationFrameId: number;
    let startTime = performance.now();
    const duration = 4000; // 4 seconds total duration

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.opacity <= 0.01) continue;
        aliveCount++;

        // Physics: gentle gravity and air drag
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // gravity
        p.vx *= 0.99; // drag
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, p.opacity - p.decay);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Subtle star / diamond
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 3, 0);
          ctx.lineTo(0, p.size / 2);
          ctx.lineTo(-p.size / 3, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (aliveCount > 0 && elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};
