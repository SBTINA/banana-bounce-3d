import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';

// Experience Banana - isolated hero object
function ExperienceBanana({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  
  const bananaState = useMemo(() => {
    // Scene 1: 0-0.2 (Entry - small, centered)
    // Scene 2: 0.2-0.4 (Growth - larger)
    // Scene 3: 0.4-0.6 (Peel - concepts appear)
    // Scene 4: 0.6-0.8 (Bite - disruption)
    // Scene 5: 0.8-1.0 (Fall & Exit)
    
    let scale = 0.15;
    let positionY = 0;
    let rotationZ = 0;
    let peelAmount = 0;
    let biteAmount = 0;
    
    if (progress < 0.2) {
      // Entry - small banana appears
      const t = progress / 0.2;
      scale = 0.15 + t * 0.35;
      positionY = 0;
    } else if (progress < 0.4) {
      // Growth - banana scales up
      const t = (progress - 0.2) / 0.2;
      scale = 0.5 + t * 0.5;
      rotationZ = t * 0.2;
      positionY = t * -0.3;
    } else if (progress < 0.6) {
      // Peel - opens gradually
      const t = (progress - 0.4) / 0.2;
      scale = 1.0;
      peelAmount = t;
      rotationZ = 0.2 + t * 0.15;
      positionY = -0.3 - t * 0.4;
    } else if (progress < 0.8) {
      // Bite - disruption
      const t = (progress - 0.6) / 0.2;
      scale = 1.0 - t * 0.1;
      peelAmount = 1;
      biteAmount = t;
      rotationZ = 0.35 - t * 0.2;
      positionY = -0.7 - t * 0.3;
    } else {
      // Fall & Exit
      const t = (progress - 0.8) / 0.2;
      scale = 0.9 * (1 - t * 0.5);
      peelAmount = 1;
      biteAmount = 1;
      rotationZ = 0.15 + Math.sin(t * Math.PI * 3) * 0.1;
      positionY = -1 - t * 4;
    }
    
    return { scale, positionY, rotationZ, peelAmount, biteAmount };
  }, [progress]);

  useFrame((state) => {
    if (groupRef.current) {
      const idleY = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      const idleRotation = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
      
      groupRef.current.position.y = bananaState.positionY + idleY;
      groupRef.current.rotation.z = bananaState.rotationZ + idleRotation;
      groupRef.current.scale.setScalar(bananaState.scale);
    }
  });

  // Concepts that appear inside peel
  const concepts = ['AI', 'Creativity', 'Motion', 'Data'];

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        {/* Main Banana Body */}
        <mesh ref={bodyRef} castShadow>
          <capsuleGeometry args={[0.35, 1.8, 12, 24]} />
          <MeshDistortMaterial
            color="#FFD700"
            emissive="#FFDD00"
            emissiveIntensity={0.5}
            roughness={0.25}
            metalness={0.05}
            distort={0.08 + bananaState.peelAmount * 0.08}
            speed={1.5}
          />
        </mesh>
        
        {/* Banana Tip */}
        <mesh position={[0, 1.15, 0]} rotation={[0, 0, 0.15]}>
          <coneGeometry args={[0.12, 0.35, 8]} />
          <meshStandardMaterial color="#8B6914" roughness={0.6} />
        </mesh>
        
        {/* Banana Stem */}
        <mesh position={[0, -1.15, 0]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.06, 0.1, 0.25, 8]} />
          <meshStandardMaterial color="#5D4E37" roughness={0.8} />
        </mesh>

        {/* Peel Layers */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          const peelOpen = Math.max(0, bananaState.peelAmount - i * 0.15) * 1.8;
          return (
            <mesh
              key={i}
              position={[
                Math.sin(angle) * (0.25 + peelOpen * 0.25),
                -0.4 - peelOpen * 0.4,
                Math.cos(angle) * (0.25 + peelOpen * 0.25)
              ]}
              rotation={[
                peelOpen * 0.7,
                angle,
                peelOpen * 0.4
              ]}
            >
              <planeGeometry args={[0.4, 1.0]} />
              <meshStandardMaterial
                color="#FFE135"
                roughness={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Bite Mark */}
        {bananaState.biteAmount > 0 && (
          <mesh
            position={[0.25, 0.25, 0.25]}
            scale={bananaState.biteAmount}
          >
            <sphereGeometry args={[0.25, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial
              color="#FFF8DC"
              roughness={0.25}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </Float>
    </group>
  );
}

// Camera controller for experience section
function ExperienceCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  
  useFrame(() => {
    let targetY = 0;
    let targetZ = 5;
    
    if (progress < 0.2) {
      targetY = 0;
      targetZ = 6 - progress * 5;
    } else if (progress < 0.6) {
      targetY = -(progress - 0.2) * 1.5;
      targetZ = 5;
    } else if (progress < 0.8) {
      targetY = -0.6 - (progress - 0.6) * 2;
      targetZ = 5;
    } else {
      const t = (progress - 0.8) / 0.2;
      targetY = -1 - t * 3;
      targetZ = 5 + t * 2;
    }
    
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
  });

  return null;
}

// Experience 3D Scene
function ExperienceScene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#FFDD00" />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#FFD700" />
      <spotLight
        position={[0, 8, 3]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#FFDD00"
        castShadow
      />
      
      <ExperienceCamera progress={progress} />
      <ExperienceBanana progress={progress} />
      
      <Environment preset="night" />
    </>
  );
}

// Text overlays
function ExperienceText({ progress }: { progress: number }) {
  const concepts = ['AI', 'Creativity', 'Motion', 'Data'];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {/* Entry text */}
      <motion.div
        className="absolute text-center"
        style={{
          opacity: progress < 0.15 ? 1 : Math.max(0, 1 - (progress - 0.15) / 0.1)
        }}
      >
        <p className="text-primary/60 font-body text-sm tracking-widest uppercase">
          Scroll to enter the experience
        </p>
      </motion.div>

      {/* Concepts during peel */}
      <div className="absolute flex flex-wrap justify-center gap-8 max-w-md">
        {concepts.map((concept, i) => {
          const conceptStart = 0.4 + i * 0.04;
          const conceptOpacity = progress > conceptStart && progress < 0.7 
            ? Math.min(1, (progress - conceptStart) / 0.05)
            : progress >= 0.7 
              ? Math.max(0, 1 - (progress - 0.7) / 0.1)
              : 0;
          
          return (
            <motion.span
              key={concept}
              className="text-primary font-display text-2xl md:text-3xl tracking-wide"
              style={{ opacity: conceptOpacity }}
            >
              {concept}
            </motion.span>
          );
        })}
      </div>

      {/* Disruption text */}
      <motion.div
        className="absolute text-center"
        style={{
          opacity: progress > 0.65 && progress < 0.85 
            ? Math.min(1, (progress - 0.65) / 0.05) * Math.max(0, 1 - (progress - 0.8) / 0.05)
            : 0
        }}
      >
        <p className="text-foreground/80 font-body text-lg md:text-xl italic">
          "Disruption creates attention."
        </p>
      </motion.div>
    </div>
  );
}

export default function BananaExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    const handleScroll = () => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress within this section only
      const scrolled = viewportHeight - rect.top;
      const totalScroll = containerHeight + viewportHeight;
      const progress = Math.min(1, Math.max(0, scrolled / totalScroll));
      
      setLocalProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[300vh] w-full"
      id="experience"
    >
      {/* Transition gradient - entering the experience */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-background to-black z-10 pointer-events-none" />
      
      {/* Fixed experience container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* 3D Canvas - only for this section */}
        {isInView && (
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <ExperienceScene progress={localProgress} />
              </Suspense>
            </Canvas>
          </div>
        )}
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(48,100%,50%,0.03)_0%,transparent_60%)]" />
        
        {/* Text overlays */}
        <ExperienceText progress={localProgress} />
        
        {/* Section label */}
        <div className="absolute top-8 left-8 z-20">
          <span className="text-primary/40 font-body text-xs tracking-widest uppercase">
            Experience
          </span>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
          <div className="h-32 w-0.5 bg-primary/10 rounded-full overflow-hidden">
            <div 
              className="w-full bg-primary/50 rounded-full transition-all duration-100"
              style={{ height: `${localProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Transition gradient - exiting the experience */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-black z-10 pointer-events-none" />
    </section>
  );
}
