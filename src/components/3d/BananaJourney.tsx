import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface BananaJourneySceneProps {
  scrollProgress: number;
}

// Main Banana Character
function MainBanana({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const peelRefs = useRef<THREE.Mesh[]>([]);
  
  // Calculate banana state based on scroll
  const bananaState = useMemo(() => {
    // Scene 1: 0-0.15 (Entry - small, centered)
    // Scene 2: 0.15-0.30 (Growth - larger, with content)
    // Scene 3: 0.30-0.50 (Peel - services appear)
    // Scene 4: 0.50-0.65 (Bite - case studies)
    // Scene 5: 0.65-0.85 (Fall - banana universe)
    // Scene 6: 0.85-1.0 (Ground - footer)
    
    let scale = 0.3;
    let positionY = 0;
    let rotationZ = 0;
    let peelAmount = 0;
    let biteAmount = 0;
    
    if (scrollProgress < 0.15) {
      // Scene 1: Entry
      scale = 0.3 + (scrollProgress / 0.15) * 0.5;
      positionY = 0;
    } else if (scrollProgress < 0.30) {
      // Scene 2: Growth
      const t = (scrollProgress - 0.15) / 0.15;
      scale = 0.8 + t * 0.4;
      rotationZ = t * 0.3;
      positionY = t * -0.5;
    } else if (scrollProgress < 0.50) {
      // Scene 3: Peel
      const t = (scrollProgress - 0.30) / 0.20;
      scale = 1.2;
      peelAmount = t;
      rotationZ = 0.3 + t * 0.2;
      positionY = -0.5 - t * 1;
    } else if (scrollProgress < 0.65) {
      // Scene 4: Bite
      const t = (scrollProgress - 0.50) / 0.15;
      scale = 1.2 - t * 0.2;
      peelAmount = 1;
      biteAmount = t;
      rotationZ = 0.5 - t * 0.3;
      positionY = -1.5 - t * 0.5;
    } else if (scrollProgress < 0.85) {
      // Scene 5: Fall
      const t = (scrollProgress - 0.65) / 0.20;
      scale = 1.0 - t * 0.3;
      peelAmount = 1;
      biteAmount = 1;
      rotationZ = 0.2 + Math.sin(t * Math.PI * 4) * 0.1;
      positionY = -2 - t * 3;
    } else {
      // Scene 6: Ground
      const t = (scrollProgress - 0.85) / 0.15;
      scale = 0.7;
      peelAmount = 1;
      biteAmount = 1;
      positionY = -5 + Math.sin(t * Math.PI) * 0.2;
      rotationZ = 0.1;
    }
    
    return { scale, positionY, rotationZ, peelAmount, biteAmount };
  }, [scrollProgress]);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth idle animation
      const idleY = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      const idleRotation = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      groupRef.current.position.y = bananaState.positionY + idleY;
      groupRef.current.rotation.z = bananaState.rotationZ + idleRotation;
      groupRef.current.scale.setScalar(bananaState.scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Banana Body */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={bodyRef} castShadow>
          <capsuleGeometry args={[0.4, 2, 12, 24]} />
          <MeshDistortMaterial
            color="#FFD700"
            emissive="#FFDD00"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.1}
            distort={0.1 + bananaState.peelAmount * 0.1}
            speed={2}
          />
        </mesh>
        
        {/* Banana Tip */}
        <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color="#8B6914" roughness={0.6} />
        </mesh>
        
        {/* Banana Stem */}
        <mesh position={[0, -1.3, 0]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
          <meshStandardMaterial color="#5D4E37" roughness={0.8} />
        </mesh>

        {/* Peel Layers (animated based on peelAmount) */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          const peelOpen = Math.max(0, bananaState.peelAmount - i * 0.2) * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.sin(angle) * (0.3 + peelOpen * 0.3),
                -0.5 - peelOpen * 0.5,
                Math.cos(angle) * (0.3 + peelOpen * 0.3)
              ]}
              rotation={[
                peelOpen * 0.8,
                angle,
                peelOpen * 0.5
              ]}
              ref={(el) => { if (el) peelRefs.current[i] = el; }}
            >
              <planeGeometry args={[0.5, 1.2]} />
              <meshStandardMaterial
                color="#FFE135"
                roughness={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Bite Mark (animated based on biteAmount) */}
        {bananaState.biteAmount > 0 && (
          <mesh
            position={[0.3, 0.3, 0.3]}
            scale={bananaState.biteAmount}
          >
            <sphereGeometry args={[0.3, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial
              color="#FFF8DC"
              roughness={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </Float>
    </group>
  );
}

// Floating Particles
function BananaParticles({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 15;
      pos[i + 1] = (Math.random() - 0.5) * 30;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.position.y = -scrollProgress * 10;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FFDD00"
        transparent
        opacity={0.4 + scrollProgress * 0.3}
        sizeAttenuation
      />
    </points>
  );
}

// Mini Floating Bananas (for universe section)
function MiniBananas({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const showMiniBananas = scrollProgress > 0.6;
  
  const bananas = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8 - 5,
        (Math.random() - 0.5) * 5 - 3
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.15
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  if (!showMiniBananas) return null;

  const opacity = Math.min(1, (scrollProgress - 0.6) / 0.1);

  return (
    <group ref={groupRef}>
      {bananas.map((banana, i) => (
        <Float key={i} speed={1 + i * 0.1} floatIntensity={0.5}>
          <mesh
            position={banana.position}
            rotation={banana.rotation}
            scale={banana.scale * opacity}
          >
            <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
            <MeshDistortMaterial
              color="#FFD700"
              emissive="#FFDD00"
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.1}
              distort={0.15}
              speed={1.5}
              transparent
              opacity={opacity}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Camera Controller
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Camera positions based on scroll
    let targetY = 0;
    let targetZ = 6;
    
    if (scrollProgress < 0.15) {
      targetY = 0;
      targetZ = 8 - scrollProgress * 10;
    } else if (scrollProgress < 0.50) {
      targetY = -(scrollProgress - 0.15) * 3;
      targetZ = 6;
    } else if (scrollProgress < 0.85) {
      targetY = -1 - (scrollProgress - 0.50) * 8;
      targetZ = 6 + (scrollProgress - 0.50) * 2;
    } else {
      targetY = -4;
      targetZ = 7;
    }
    
    gsap.to(camera.position, {
      y: targetY,
      z: targetZ,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [scrollProgress, camera]);

  return null;
}

// Main Scene Component
function BananaJourneyScene({ scrollProgress }: BananaJourneySceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFDD00" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#FFD700" />
      <spotLight
        position={[0, 15, 5]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#FFDD00"
        castShadow
      />
      
      <CameraController scrollProgress={scrollProgress} />
      <MainBanana scrollProgress={scrollProgress} />
      <BananaParticles scrollProgress={scrollProgress} />
      <MiniBananas scrollProgress={scrollProgress} />
      
      <Environment preset="night" />
    </>
  );
}

export default function BananaJourney({ scrollProgress }: BananaJourneySceneProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Suspense fallback={null}>
          <BananaJourneyScene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
