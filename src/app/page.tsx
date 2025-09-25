'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import SlidingImages from '@/components/home/SlidingImages';
import { LetterCollision } from '@/components/animations/textAnimations/scrollText';
import Magnetic from '@/components/animations/magnetic';
import Hero from '@/components/home/hero';
import Description from '@/components/home/Description/description';

const slider1 = [
  {
    color: 'white',
    src: 'stylesync/pca.png'
  },
  {
    color: 'white',
    src: 'stylesync/diagram.png'
  },
  {
    color: '#21242b',
    src: 'catapult-trading/dashboard.png'
  },
  {
    color: '#21242b',
    src: 'm31/controller.jpg'
  }
];
const slider2 = [
  {
    color: '#d4e3ec',
    src: 'm31/specs.png'
  },
  {
    color: '#9289BD',
    src: 'axo/prototype.png'
  },
  {
    color: 'white',
    src: 'm31/app.png'
  },
  {
    color: 'white',
    src: 'stylesync/hero.svg'
  }
];

export default function Home() {
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);

  return (
    <div ref={scrollContainerRef} className="overflow-x-hidden">
      <div id="hero" ref={heroRef} className="relative">
        <Hero />
        <div className="pointer-events-none absolute inset-0 z-10">
          <LetterCollision />
        </div>
      </div>
      <div id="next-section">
        <Description />
      </div>
      <div id="sliding-images">
        <SlidingImages slider1={slider1} slider2={slider2} />
      </div>
      
    </div>
  );
}
