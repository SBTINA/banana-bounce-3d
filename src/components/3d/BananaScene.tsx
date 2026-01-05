import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Banana({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {/* Banana body - curved cylinder approximation */}
        <capsuleGeometry args={[0.3, 1.5, 8, 16]} />
        <MeshDistortMaterial
          color="#FFD700"
          emissive="#FFDD00"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.1}
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function FloatingBananas() {
  return (
    <>
      <Banana position={[-3, 2, -2]} rotation={[0.5, 0, 0.3]} scale={0.8} />
      <Banana position={[3, -1, -3]} rotation={[-0.3, 0.5, 0.2]} scale={0.6} />
      <Banana position={[0, 3, -4]} rotation={[0.2, 0.3, -0.4]} scale={0.7} />
      <Banana position={[-2, -2, -2]} rotation={[-0.4, -0.2, 0.5]} scale={0.5} />
      <Banana position={[2.5, 1.5, -3]} rotation={[0.3, -0.3, 0.1]} scale={0.65} />
    </>
  );
}

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <sphereGeometry args={[2, 64, 64]} />
      <MeshDistortMaterial
        color="#000000"
        emissive="#FFDD00"
        emissiveIntensity={0.2}
        roughness={0.1}
        metalness={0.8}
        distort={0.4}
        speed={3}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FFDD00"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function BananaScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#FFDD00" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFD700" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#FFDD00"
          />
          
          <FloatingBananas />
          <GlowingSphere />
          <Particles />
          
          <Environment preset="night" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
