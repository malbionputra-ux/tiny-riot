import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const WavePlane = () => {
  const meshRef = useRef();

  // Create a large plane with many segments for smooth deformation
  // A 100x100 plane with 128x128 segments gives high quality waves
  const geometry = useMemo(() => new THREE.PlaneGeometry(25, 25, 128, 128), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;

    // Animate vertices with composed sine waves for an organic, liquid-ribbon feel
    for (let i = 0; i < positions.count; i++) {
      const u = positions.getX(i);
      const v = positions.getY(i);
      
      // Calculate complex wave
      const z = Math.sin(u * 0.5 + time * 0.4) * 0.8 + 
                Math.sin(v * 0.4 + time * 0.5) * 0.8 + 
                Math.sin((u + v) * 0.3 + time * 0.3) * 0.5;
                
      positions.setZ(i, z);
    }
    
    // Update the geometry
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    
    // Slowly rotate the entire mesh for dynamic movement
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, -5]}>
      <meshStandardMaterial 
        color="#1a1a1a"
        roughness={0.15}
        metalness={0.85}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

export default function AbstractWaves() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          {/* Base dark lighting */}
          <ambientLight intensity={0.2} color="#ffffff" />
          
          {/* Main highlight light (white/silver) */}
          <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
          
          {/* Accent light (Tiny Riot red/orange) reflecting off the metallic waves */}
          <pointLight position={[-5, 5, 2]} intensity={50} color="#fa2a0e" distance={20} />
          <pointLight position={[5, -5, 2]} intensity={30} color="#ff6b00" distance={20} />

          <WavePlane />
          
          {/* Environment map for realistic metallic reflections */}
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
