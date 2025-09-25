"use client";
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center } from '@react-three/drei';
import type { Group } from 'three';

function BlackholeModel({ scale, position }: { scale: [number, number, number]; position: [number, number, number] }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF('/blackhole.glb');

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <Center>
      <group ref={groupRef} scale={scale} position={position}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

useGLTF.preload('/blackhole.glb');

export default function BlackholeCanvas() {
  const [scale, setScale] = useState<[number, number, number]>([1.5, 1.5, 1.5]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([1, 1, 1]);
        setPosition([0, 0, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([1.2, 1.2, 1.2]);
        setPosition([0, 0, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([1.5, 1.5, 1.5]);
        setPosition([0, 0, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([1.8, 1.8, 1.8]);
        setPosition([0, 0, 0]);
      } else {
        setScale([2, 2, 2]);
        setPosition([0, 0, 0]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Canvas className="w-full h-screen bg-transparent z-0" camera={{ position: [0, 2, 6], fov: 75, near: 0.1, far: 1000 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 3]} intensity={1.5} />
      <pointLight position={[10, 5, 10]} intensity={2} />
      <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
      <BlackholeModel scale={scale} position={position} />
      <OrbitControls makeDefault enablePan={false} enableZoom={false} enableRotate rotateSpeed={0.8} target={[0, -0.2, 0]} />
    </Canvas>
  );
}


