import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MutableRefObject, useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const hi = 'Hi, ';
const my = 'my ';
const name = 'name ';
const is = 'is ';
const george = 'George';
const sentence3 = 'snowboarding is my passion';

function getRandomSpeed() {
  const randomDecimal = Math.random();
  return 0.8 + randomDecimal * (1.5 - 0.8);
}

function getRandomRotation() {
  return Math.random() * 60 - 30;
}

const animateLettersOnScroll = (containerRef: MutableRefObject<any>) => {
  const lettersContainer = containerRef.current;
  const letterElements = lettersContainer?.querySelectorAll('.letter');

  letterElements.forEach((letter: Element, index: number) => {
    gsap.to(letter, {
      y: (i, el) =>
        (1 - parseFloat(el.getAttribute('data-speed'))) *
        ScrollTrigger.maxScroll(window),
      ease: 'power2.out',
      duration: 0.8,
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        invalidateOnRefresh: true,
        scrub: 0.5
      },
      rotation: getRandomRotation()
    });
  });
};

function LetterDisplay({ word }: { word: string }) {
  return word.split('').map((letter, index) => (
    <div
      key={index}
      className="letter font-orbitron text-white text-6xl font-[500] xs:text-[90px] xs:leading-none md:text-[120px] lg:text-[150px] xl:text-[210px]"
      data-speed={0.8 + (index * 0.1) % 0.7} // Use index-based deterministic value
    >
      {letter}
    </div>
  ));
}

export function LetterCollision() {
  const containerRef = useRef(null);
  const arrowLetterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animateLettersOnScroll(containerRef);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('sliding-images');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="scroll-smooth relative">
      <div className="mt-16 flex h-screen flex-col justify-center px-8">
        <div className="flex flex-wrap p-0">
          <LetterDisplay word={hi} />
          <div className="w-2 xs:w-4 sm:w-10"></div>
          <LetterDisplay word={my} />
          <div className="w-2 xs:w-4 sm:w-10"></div>
          <LetterDisplay word={name} />
        </div>
        <div className="flex flex-wrap">
          <LetterDisplay word={is} />
          <div className="w-2 xs:w-4 sm:w-10"></div>
          <LetterDisplay word={george} />
        </div>
        {/* Arrow beneath the text that scrambles */}
        <div className="flex justify-center mt-16 w-full">
          <div
            ref={arrowLetterRef}
            className="letter font-oxanium text-white cursor-pointer text-4xl font-[600] xs:text-5xl xs:leading-none md:text-6xl lg:text-7xl xl:text-8xl animate-bounce pointer-events-auto"
            data-speed={1.2} // Fixed value to avoid hydration mismatch
            onClick={scrollToNext}
          >
            ↓
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <LetterDisplay word={sentence3} />
      </div>
    </div>
  );
}
