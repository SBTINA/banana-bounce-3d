import { useRef, useEffect, useCallback, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  layer: number;
}

interface WaterRippleBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  borderWidth?: number;
  isActive?: boolean;
}

export default function WaterRippleBorder({
  children,
  className = '',
  borderRadius = 16,
  borderWidth = 3,
  isActive = true,
}: WaterRippleBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Ripple[]>([]);
  const animationRef = useRef<number>();
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const filterId = useRef(`water-filter-${Math.random().toString(36).substr(2, 9)}`);

  // Create ripple at position
  const createRipple = useCallback((x: number, y: number) => {
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      ripples.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 80 + i * 40 + Math.random() * 30,
        opacity: 0.6 - i * 0.15,
        speed: 1.5 + i * 0.3 + Math.random() * 0.5,
        layer: i,
      });
    }
  }, []);

  // Animate ripples
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw ripples
    ripples.current = ripples.current.filter((ripple) => {
      ripple.radius += ripple.speed;
      ripple.opacity *= 0.985;

      if (ripple.opacity < 0.01 || ripple.radius > ripple.maxRadius) {
        return false;
      }

      // Draw multiple wave rings per ripple
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        const waveRadius = ripple.radius - w * 8;
        if (waveRadius <= 0) continue;

        const waveOpacity = ripple.opacity * (1 - w * 0.25);
        const gradient = ctx.createRadialGradient(
          ripple.x, ripple.y, waveRadius - 3,
          ripple.x, ripple.y, waveRadius + 3
        );

        // Golden/yellow water tint
        gradient.addColorStop(0, `hsla(48, 100%, 50%, 0)`);
        gradient.addColorStop(0.3, `hsla(48, 100%, 60%, ${waveOpacity * 0.4})`);
        gradient.addColorStop(0.5, `hsla(48, 100%, 70%, ${waveOpacity * 0.7})`);
        gradient.addColorStop(0.7, `hsla(48, 100%, 60%, ${waveOpacity * 0.4})`);
        gradient.addColorStop(1, `hsla(48, 100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4 + ripple.layer;
        ctx.stroke();
      }

      // Add subtle highlight reflection
      const highlightGradient = ctx.createRadialGradient(
        ripple.x - ripple.radius * 0.3,
        ripple.y - ripple.radius * 0.3,
        0,
        ripple.x,
        ripple.y,
        ripple.radius * 0.6
      );
      highlightGradient.addColorStop(0, `hsla(48, 100%, 90%, ${ripple.opacity * 0.3})`);
      highlightGradient.addColorStop(1, `hsla(48, 100%, 50%, 0)`);

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = highlightGradient;
      ctx.fill();

      return true;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isActive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is near the border
    const padding = 40;
    const isNearBorder =
      x < padding ||
      x > rect.width - padding ||
      y < padding ||
      y > rect.height - padding;

    if (isNearBorder) {
      const distance = Math.hypot(x - lastMousePos.current.x, y - lastMousePos.current.y);
      if (distance > 15) {
        createRipple(x, y);
        lastMousePos.current = { x, y };
      }
    }
  }, [createRipple, isActive]);

  // Handle mouse enter
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create initial burst of ripples
    for (let i = 0; i < 2; i++) {
      setTimeout(() => createRipple(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10), i * 50);
    }
  }, [createRipple]);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    });

    resizeObserver.observe(container);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderRadius }}
    >
      {/* SVG Filters for displacement effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId.current} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isHovered ? "0.015 0.015" : "0.01 0.01"}
              numOctaves="3"
              seed="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.01 0.01;0.02 0.015;0.01 0.01"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isHovered ? "8" : "4"}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>

      {/* Animated water border */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ borderRadius }}
      >
        {/* Base liquid glass border */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            borderRadius,
            border: `${borderWidth}px solid transparent`,
            background: `linear-gradient(var(--background), var(--background)) padding-box,
                        linear-gradient(135deg, 
                          hsla(48, 100%, 50%, ${isHovered ? 0.6 : 0.2}) 0%,
                          hsla(48, 100%, 60%, ${isHovered ? 0.4 : 0.1}) 25%,
                          hsla(48, 100%, 50%, ${isHovered ? 0.5 : 0.15}) 50%,
                          hsla(48, 100%, 60%, ${isHovered ? 0.4 : 0.1}) 75%,
                          hsla(48, 100%, 50%, ${isHovered ? 0.6 : 0.2}) 100%
                        ) border-box`,
            filter: isHovered ? `url(#${filterId.current})` : 'none',
          }}
        />

        {/* Animated wave layers */}
        {[0, 1, 2].map((layer) => (
          <div
            key={layer}
            className="absolute inset-0 opacity-0 transition-opacity duration-700"
            style={{
              borderRadius,
              opacity: isHovered ? 0.3 - layer * 0.08 : 0,
              border: `${borderWidth + layer}px solid transparent`,
              background: `linear-gradient(var(--background), var(--background)) padding-box,
                          linear-gradient(${135 + layer * 45}deg, 
                            hsla(48, 100%, 70%, 0.4) 0%,
                            hsla(48, 100%, 50%, 0.1) 30%,
                            hsla(48, 100%, 70%, 0.3) 50%,
                            hsla(48, 100%, 50%, 0.1) 70%,
                            hsla(48, 100%, 70%, 0.4) 100%
                          ) border-box`,
              animation: isHovered
                ? `waterWave${layer} ${3 + layer * 0.5}s ease-in-out infinite`
                : 'none',
            }}
          />
        ))}

        {/* Shimmer highlight */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            borderRadius,
            opacity: isHovered ? 1 : 0,
            background: `linear-gradient(
              105deg,
              transparent 40%,
              hsla(48, 100%, 80%, 0.15) 45%,
              hsla(48, 100%, 90%, 0.25) 50%,
              hsla(48, 100%, 80%, 0.15) 55%,
              transparent 60%
            )`,
            animation: isHovered ? 'shimmer 3s ease-in-out infinite' : 'none',
          }}
        />

        {/* Canvas for dynamic ripples */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ 
            borderRadius,
            mixBlendMode: 'screen',
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            borderRadius,
            boxShadow: isHovered
              ? `inset 0 0 30px hsla(48, 100%, 50%, 0.15),
                 inset 0 0 60px hsla(48, 100%, 50%, 0.08),
                 0 0 20px hsla(48, 100%, 50%, 0.2),
                 0 0 40px hsla(48, 100%, 50%, 0.1)`
              : `inset 0 0 10px hsla(48, 100%, 50%, 0.05)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes waterWave0 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.002) rotate(0.3deg); }
          50% { transform: scale(0.998) rotate(-0.2deg); }
          75% { transform: scale(1.001) rotate(0.2deg); }
        }
        @keyframes waterWave1 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(0.999) rotate(-0.4deg); }
          66% { transform: scale(1.002) rotate(0.3deg); }
        }
        @keyframes waterWave2 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.003) rotate(-0.25deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
