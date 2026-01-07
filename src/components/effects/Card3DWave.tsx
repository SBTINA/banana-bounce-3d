import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DWaveProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function Card3DWave({ 
  children, 
  className = '',
  intensity = 15
}: Card3DWaveProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const ripples = useRef<Array<{
    x: number;
    y: number;
    time: number;
    intensity: number;
  }>>([]);

  // Motion values for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for fluid motion
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-intensity, intensity]), springConfig);
  
  // Wave distortion values
  const waveIntensity = useSpring(0, { stiffness: 100, damping: 15 });
  const turbulence = useSpring(0, { stiffness: 80, damping: 12 });

  // Wave canvas animation
  const drawWaves = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() * 0.002;

    ctx.clearRect(0, 0, width, height);

    // Draw multiple wave layers
    const drawWaveLayer = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      speed: number,
      alpha: number,
      color: string
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 2) {
        const y = yOffset + 
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.sin(x * frequency * 0.5 + time * speed * 0.7) * amplitude * 0.5 +
          Math.sin(x * frequency * 1.5 + time * speed * 1.3) * amplitude * 0.3;
        
        // Add ripple effects
        ripples.current.forEach(ripple => {
          const dx = x - ripple.x * width;
          const dy = y - ripple.y * height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const age = (Date.now() - ripple.time) / 1000;
          if (age < 2) {
            const wave = Math.sin(dist * 0.05 - age * 8) * Math.exp(-age * 2) * ripple.intensity * 30;
            ctx.lineTo(x, y + wave);
            return;
          }
        });
        
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, height);
      gradient.addColorStop(0, `hsla(48, 100%, 50%, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `hsla(48, 100%, 45%, ${alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(48, 100%, 40%, ${alpha * 0.1})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    if (isHovered) {
      // Multiple wave layers with different properties
      drawWaveLayer(height * 0.7, 15, 0.02, 1.5, 0.15, 'primary');
      drawWaveLayer(height * 0.75, 12, 0.025, 2, 0.2, 'primary');
      drawWaveLayer(height * 0.8, 10, 0.03, 2.5, 0.25, 'primary');
      drawWaveLayer(height * 0.85, 8, 0.035, 3, 0.3, 'primary');

      // Light reflection
      ctx.beginPath();
      const reflectX = width * 0.3 + Math.sin(time * 0.5) * 20;
      const reflectY = height * 0.3 + Math.cos(time * 0.7) * 15;
      const reflectGradient = ctx.createRadialGradient(reflectX, reflectY, 0, reflectX, reflectY, 80);
      reflectGradient.addColorStop(0, 'rgba(255, 221, 0, 0.2)');
      reflectGradient.addColorStop(0.5, 'rgba(255, 221, 0, 0.05)');
      reflectGradient.addColorStop(1, 'rgba(255, 221, 0, 0)');
      ctx.fillStyle = reflectGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Clean up old ripples
    ripples.current = ripples.current.filter(r => Date.now() - r.time < 2000);

    animationRef.current = requestAnimationFrame(drawWaves);
  }, [isHovered]);

  useEffect(() => {
    if (isHovered) {
      const canvas = canvasRef.current;
      if (canvas && cardRef.current) {
        canvas.width = cardRef.current.offsetWidth;
        canvas.height = cardRef.current.offsetHeight;
      }
      waveIntensity.set(1);
      turbulence.set(1);
      drawWaves();
    } else {
      waveIntensity.set(0);
      turbulence.set(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, drawWaves, waveIntensity, turbulence]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);

    // Add ripple on movement (throttled)
    if (Math.random() > 0.9) {
      ripples.current.push({
        x,
        y,
        time: Date.now(),
        intensity: 0.5 + Math.random() * 0.5
      });
    }
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
        className="relative w-full h-full"
      >
        {/* Flipped/Reversed 3D appearance with depth */}
        <div 
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: isHovered 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 221, 0, 0.2), inset 0 0 60px rgba(255, 221, 0, 0.05)'
              : '0 10px 40px -15px rgba(0, 0, 0, 0.5)',
            transition: 'box-shadow 0.5s ease',
          }}
        >
          {/* SVG Filter for wave distortion */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="wave-distortion" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={isHovered ? "0.015" : "0"}
                  numOctaves="3"
                  seed="1"
                  result="noise"
                >
                  <animate
                    attributeName="baseFrequency"
                    values="0.01;0.02;0.015;0.025;0.01"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={isHovered ? "8" : "0"}
                  xChannelSelector="R"
                  yChannelSelector="G"
                >
                  <animate
                    attributeName="scale"
                    values="5;10;8;12;5"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </feDisplacementMap>
              </filter>
            </defs>
          </svg>

          {/* Main content */}
          <div 
            className="relative w-full h-full"
            style={{
              filter: isHovered ? 'url(#wave-distortion)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          >
            {children}
          </div>

          {/* Wave overlay canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.5s ease',
              mixBlendMode: 'screen',
            }}
          />

          {/* Glass reflection effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,221,0,0.05) 100%)'
                : 'none',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />

          {/* Edge glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-30 rounded-2xl"
            style={{
              boxShadow: isHovered
                ? 'inset 0 0 30px rgba(255, 221, 0, 0.15), inset 0 0 60px rgba(255, 221, 0, 0.05)'
                : 'none',
              opacity: isHovered ? 1 : 0,
              transition: 'all 0.5s ease',
            }}
          />

          {/* Liquid glass border */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-40 rounded-2xl"
            style={{
              border: isHovered ? '2px solid rgba(255, 221, 0, 0.3)' : '2px solid rgba(255, 221, 0, 0.1)',
              transition: 'border 0.5s ease',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
