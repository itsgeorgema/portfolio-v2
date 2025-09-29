"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const StylizedPlanetCanvas = dynamic(() => import('@/components/home/purplePlanetCanvas'), { ssr: false });

export default function Hero() {
  return (
    <div className="relative h-screen w-full bg-transparent">
      <StylizedPlanetCanvas />
    </div>
  );
}
