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
  const [showScrollButton, setShowScrollButton] = useState(true);
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window?.scrollY > 0) {
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    };

    window?.addEventListener('scroll', handleScroll);

    return () => {
      window?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('sliding-images');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={scrollContainerRef} className="overflow-x-hidden">
      <LetterCollision />
      <div id="hero" ref={heroRef} className="relative">
        <Hero />
        {showScrollButton && (
          <button
            aria-label="Scroll to next section"
            onClick={scrollToNext}
            className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur transition hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 animate-bounce"
            >
              <path fillRule="evenodd" d="M12 16.5a.75.75 0 0 1-.53-.22l-6-6a.75.75 0 1 1 1.06-1.06L12 14.69l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-.53.22z" clipRule="evenodd" />
            </svg>
          </button>
        )}
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
