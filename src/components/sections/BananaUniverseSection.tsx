import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Text3D, Center, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

function GiantBanana({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Main banana body */}
        <mesh rotation={[0, 0, Math.PI * 0.15]}>
          <capsuleGeometry args={[0.5, 2.5, 16, 32]} />
          <MeshDistortMaterial
            color="#FFD700"
            emissive="#FFDD00"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.3}
            distort={0.15}
            speed={3}
          />
        </mesh>
        {/* Banana tip */}
        <mesh position={[0.3, 1.5, 0]} rotation={[0, 0, Math.PI * 0.3]}>
          <coneGeometry args={[0.15, 0.4, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Banana stem */}
        <mesh position={[-0.2, -1.5, 0]} rotation={[0, 0, -Math.PI * 0.2]}>
          <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
          <meshStandardMaterial color="#2F4F2F" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingBananasField() {
  const positions: [number, number, number][] = [
    [-4, 2, -5],
    [4, -1, -4],
    [-2, -2, -6],
    [3, 3, -7],
    [0, 0, -3],
    [-3, 1, -4],
    [2, -2, -5],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <GiantBanana key={i} position={pos} />
      ))}
    </>
  );
}

function BananaRing() {
  const ringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const bananaCount = 12;
  const radius = 4;

  return (
    <group ref={ringRef}>
      {Array.from({ length: bananaCount }).map((_, i) => {
        const angle = (i / bananaCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <Float key={i} speed={2 + i * 0.1} rotationIntensity={0.2}>
            <mesh position={[x, y, 0]} rotation={[0, 0, angle + Math.PI / 2]} scale={0.4}>
              <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
              <MeshDistortMaterial
                color="#FFD700"
                emissive="#FFDD00"
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.2}
                distort={0.1}
                speed={2}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function BananaUniverseScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFDD00" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#FFD700" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.4}
          penumbra={1}
          intensity={2}
          color="#FFDD00"
        />
        
        <FloatingBananasField />
        <BananaRing />
        
        <Environment preset="night" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Suspense>
    </Canvas>
  );
}

export default function BananaUniverseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="banana-universe" className="relative min-h-screen py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(48,100%,50%,0.1)_0%,transparent_50%)]" />
      
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <BananaUniverseScene />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">Enter The</span>
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl text-card-foreground mb-4">
            <span className="text-primary glow-text">BANANA</span>
          </h2>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-card-foreground mb-8">
            UNIVERSE
          </h2>
          <div className="w-32 h-1 bg-gradient-gold mx-auto mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto text-center mt-auto pt-40"
        >
          <p className="text-card-foreground/80 font-body text-xl md:text-2xl leading-relaxed mb-8">
            Where creativity meets <span className="text-primary font-semibold">AI innovation</span>. 
            Our unique approach combines the unexpected with the intelligent, 
            creating experiences that are both <span className="text-primary font-semibold">memorable</span> and <span className="text-primary font-semibold">effective</span>.
          </p>
          <p className="text-muted-foreground font-body text-lg">
            Just like a banana — simple on the outside, packed with potential on the inside.
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
