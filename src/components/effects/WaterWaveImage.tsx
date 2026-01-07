import { useRef, useEffect, useState, useCallback } from 'react';

interface WaterWaveImageProps {
  src: string;
  videoSrc?: string;
  alt: string;
  className?: string;
  isHovered: boolean;
}

export default function WaterWaveImage({
  src,
  videoSrc,
  alt,
  className = '',
  isHovered,
}: WaterWaveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; time: number; id: number }>>([]);
  const rippleIdRef = useRef(0);
  const filterId = useRef(`wave-filter-${Math.random().toString(36).substr(2, 9)}`);
  const animationFrameRef = useRef<number>();
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  // Animate turbulence for organic water movement
  useEffect(() => {
    if (!isHovered || isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let time = 0;
    const animate = () => {
      time += 0.015;
      
      if (turbulenceRef.current) {
        const baseFreq = 0.008 + Math.sin(time * 0.5) * 0.003;
        const baseFreq2 = 0.012 + Math.cos(time * 0.7) * 0.004;
        turbulenceRef.current.setAttribute('baseFrequency', `${baseFreq} ${baseFreq2}`);
      }
      
      if (displacementRef.current) {
        const scale = 20 + Math.sin(time * 1.2) * 8 + Math.cos(time * 0.8) * 5;
        displacementRef.current.setAttribute('scale', String(scale));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, isPlaying]);

  // Handle mouse move for ripple creation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || isPlaying) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Add new ripple
    const newRipple = {
      x,
      y,
      time: Date.now(),
      id: rippleIdRef.current++,
    };
    
    setRipples(prev => {
      const now = Date.now();
      // Keep only recent ripples (last 2 seconds)
      const filtered = prev.filter(r => now - r.time < 2000);
      return [...filtered, newRipple].slice(-8); // Max 8 ripples
    });
  }, [isPlaying]);

  // Handle video play
  const handlePlay = useCallback(() => {
    if (videoRef.current && videoSrc) {
      setIsPlaying(true);
      videoRef.current.play();
    }
  }, [videoSrc]);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Clean up ripples
  useEffect(() => {
    if (!isHovered) {
      setRipples([]);
    }
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onClick={handlePlay}
    >
      {/* SVG Filters for water wave effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Main water distortion filter */}
          <filter id={filterId.current} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.01 0.015"
              numOctaves="4"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="25"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.8" result="blurred" />
            <feBlend in="blurred" in2="SourceGraphic" mode="normal" />
          </filter>

          {/* Ripple highlight filter */}
          <filter id={`${filterId.current}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      1 0.8 0 0 0
                      0 0 0.3 0 0
                      0 0 0 0.6 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Background image with water effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `url(${src})`,
          filter: isHovered && !isPlaying ? `url(#${filterId.current})` : 'none',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Video element (hidden until playing) */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          onEnded={handleVideoEnd}
          playsInline
          muted
        />
      )}

      {/* Water wave overlay layers */}
      {isHovered && !isPlaying && (
        <>
          {/* Wave layer 1 - slow, large waves */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 100% 40% at 50% 100%, hsla(48, 100%, 50%, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 80% 30% at 30% 80%, hsla(48, 100%, 60%, 0.1) 0%, transparent 60%)
              `,
              animation: 'waveLayer1 4s ease-in-out infinite',
            }}
          />

          {/* Wave layer 2 - medium waves */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 60% 25% at 70% 90%, hsla(48, 100%, 55%, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse 50% 20% at 20% 70%, hsla(48, 100%, 65%, 0.08) 0%, transparent 50%)
              `,
              animation: 'waveLayer2 3s ease-in-out infinite 0.5s',
            }}
          />

          {/* Wave layer 3 - fast, small ripples */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(180deg, 
                  transparent 60%,
                  hsla(48, 100%, 50%, 0.05) 75%,
                  hsla(48, 100%, 60%, 0.1) 85%,
                  hsla(48, 100%, 50%, 0.05) 95%,
                  transparent 100%
                )
              `,
              animation: 'waveLayer3 2s ease-in-out infinite',
            }}
          />

          {/* Dynamic ripples from mouse */}
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: `${ripple.x}%`,
                top: `${ripple.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {[0, 1, 2].map((layer) => (
                <div
                  key={layer}
                  className="absolute rounded-full"
                  style={{
                    width: '20px',
                    height: '20px',
                    transform: 'translate(-50%, -50%)',
                    border: `2px solid hsla(48, 100%, ${60 + layer * 10}%, ${0.4 - layer * 0.1})`,
                    animation: `rippleExpand ${1.5 + layer * 0.3}s ease-out forwards`,
                    animationDelay: `${layer * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ))}

          {/* Light caustics effect */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: `
                conic-gradient(
                  from 0deg at 30% 70%,
                  transparent 0deg,
                  hsla(48, 100%, 70%, 0.1) 60deg,
                  transparent 120deg,
                  hsla(48, 100%, 80%, 0.08) 200deg,
                  transparent 260deg,
                  hsla(48, 100%, 70%, 0.1) 320deg,
                  transparent 360deg
                )
              `,
              animation: 'caustics 8s linear infinite',
            }}
          />

          {/* Surface reflection shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                110deg,
                transparent 20%,
                hsla(48, 100%, 90%, 0.15) 40%,
                hsla(48, 100%, 95%, 0.25) 50%,
                hsla(48, 100%, 90%, 0.15) 60%,
                transparent 80%
              )`,
              animation: 'shimmerWave 4s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Water surface edge glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered && !isPlaying ? 1 : 0,
          boxShadow: `
            inset 0 0 60px hsla(48, 100%, 50%, 0.2),
            inset 0 0 120px hsla(48, 100%, 50%, 0.1),
            inset 0 -40px 80px hsla(48, 100%, 60%, 0.15)
          `,
        }}
      />

      {/* Keyframe animations */}
      <style>{`
        @keyframes waveLayer1 {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.8; }
          50% { transform: translateY(-8px) scaleY(1.1); opacity: 1; }
        }
        @keyframes waveLayer2 {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.7; }
          33% { transform: translateX(5px) translateY(-5px); opacity: 0.9; }
          66% { transform: translateX(-3px) translateY(-3px); opacity: 0.8; }
        }
        @keyframes waveLayer3 {
          0%, 100% { transform: scaleX(1) translateY(0); }
          50% { transform: scaleX(1.02) translateY(-4px); }
        }
        @keyframes rippleExpand {
          0% { 
            width: 20px; 
            height: 20px; 
            opacity: 0.6;
          }
          100% { 
            width: 150px; 
            height: 150px; 
            opacity: 0;
          }
        }
        @keyframes caustics {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes shimmerWave {
          0% { transform: translateX(-100%) skewX(-15deg); }
          50% { transform: translateX(0%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
}
