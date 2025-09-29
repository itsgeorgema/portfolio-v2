"use client";
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, useAnimations } from '@react-three/drei';
import type { Group } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';

function EarthPlanetModel({ scale, position }: { scale: [number, number, number]; position: [number, number, number] }) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF('/planet_earth.glb');
  const { actions } = useAnimations(animations, groupRef);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    // Play the first available animation if any exist
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.keys(actions)[0];
      actions[firstAction]?.play();
    }
  }, [actions]);

  return (
    <Center>
      <group ref={groupRef} scale={scale} position={position}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

useGLTF.preload('/planet_earth.glb');

export default function EarthPlanetCanvas() {
  const [scale, setScale] = useState<[number, number, number]>([1.5, 1.5, 1.5]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const orbitControlsRef = useRef<any>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 25]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([1, 1, 1]);
        setPosition([0, 0, 0]);
        setCameraPosition([0, 2, 20]);
      } else if (window.innerWidth < 1024) {
        setScale([1.2, 1.2, 1.2]);
        setPosition([0, 0, 0]);
        setCameraPosition([0, 2.5, 25]);
      } else if (window.innerWidth < 1280) {
        setScale([1.5, 1.5, 1.5]);
        setPosition([0, 0, 0]);
        setCameraPosition([0, 3, 30]);
      } else if (window.innerWidth < 1536) {
        setScale([1.8, 1.8, 1.8]);
        setPosition([0, 0, 0]);
        setCameraPosition([0, 3.5, 35]);
      } else {
        setScale([2, 2, 2]);
        setPosition([0, 0, 0]);
        setCameraPosition([0, 4, 40]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <Canvas className="w-full h-screen bg-transparent z-0" camera={{ position: cameraPosition, fov: 30, near: 0.1, far: 1000 }} dpr={[1, 2]}>
      {/* Ambient warm glow */}
      <ambientLight intensity={0.35} color="#FFE8C7" />
      
      {/* Main sun-like directional light (warm) */}
      <directionalLight 
        position={[6, 9, 6]} 
        intensity={2.4} 
        color="#FFDFA3" 
        castShadow 
      />
      
      {/* Warm front glow and fill lights */}
      <pointLight 
        position={[0, 0, 5]} 
        intensity={3.2} 
        color="#FFC774" 
        distance={16}
        decay={2}
      />
      <pointLight 
        position={[-3, 2, 3]} 
        intensity={2.2} 
        color="#FFF1C1" 
        distance={12}
        decay={2}
      />
      <pointLight 
        position={[3, -2, 3]} 
        intensity={2.2} 
        color="#FFE0A3" 
        distance={12}
        decay={2}
      />
      
      {/* Additional cloud glow (soft warm highlights) */}
      <pointLight 
        position={[2, 3, 2]} 
        intensity={2.1} 
        color="#FFE8BB" 
        distance={9}
        decay={1.5}
      />
      <pointLight 
        position={[-2, -3, 2]} 
        intensity={1.9} 
        color="#FFF6DB" 
        distance={8}
        decay={1.5}
      />
      <pointLight 
        position={[0, 3, -2]} 
        intensity={1.8} 
        color="#FFF2CC" 
        distance={7}
        decay={1}
      />
      
      {/* Rim lighting (subtle cool back light for separation) */}
      <pointLight 
        position={[0, 0, -5]} 
        intensity={1.2} 
        color="#9BB5FF" 
        distance={9}
        decay={1.2}
      />
      
      {/* Hemisphere light for warm atmosphere */}
      <hemisphereLight 
        color="#FFF6E5" 
        groundColor="#0E2233" 
        intensity={0.7} 
      />
      
      {/* Sun spotlight for specular highlights */}
      <spotLight 
        position={[0, 10, 5]} 
        angle={0.28} 
        penumbra={1} 
        intensity={2.2} 
        color="#FFF6D5"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <EarthPlanetModel scale={scale} position={position} />
      <OrbitControls 
        ref={orbitControlsRef}
        makeDefault 
        enablePan={false} 
        enableZoom={false} 
        enableRotate 
        rotateSpeed={0.8} 
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}


