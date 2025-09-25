"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const BlackholeCanvas = dynamic(() => import('@/components/home/blackholeCanvas'), { ssr: false });

export default function Hero() {
  return (
    <div className="relative h-screen w-full bg-transparent">
      <BlackholeCanvas />
    </div>
  );
}
