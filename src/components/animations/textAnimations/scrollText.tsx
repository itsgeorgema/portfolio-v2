import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MutableRefObject, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const my = 'MY ';
const name = 'NAME ';
const is = 'IS ';
const george = 'GEORGE';
const sentence3 = 'SNOWBOARDING IS MY PASSION';

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

  // Special animation for the button to mimic text scrambling
  const button = lettersContainer?.querySelector('button.letter');
  if (button) {
    gsap.to(button, {
      y: (1 - parseFloat(button.getAttribute('data-speed'))) * ScrollTrigger.maxScroll(window),
      rotation: () => Math.random() * 120 - 60, // Random rotation between -60 and 60 degrees
      ease: 'power2.out',
      duration: 0.8,
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        invalidateOnRefresh: true,
        scrub: 0.5
      }
    });
  }
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
  const scrollAnimationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animateLettersOnScroll(containerRef);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('description');
    if (nextSection) {
      const targetPosition = nextSection.offsetTop;
      
      // Kill any existing scroll animation
      if (scrollAnimationRef.current) {
        scrollAnimationRef.current.kill();
        scrollAnimationRef.current = null;
      }
      
      // Create new scroll animation
      scrollAnimationRef.current = gsap.to(window, {
        duration: 2.0,
        scrollTo: { 
          y: targetPosition,
          autoKill: false
        },
        ease: "power2.inOut",
        onComplete: () => {
          scrollAnimationRef.current = null;
        }
      });

      // Simple interruption handler using kill method
      const handleInterruption = () => {
        if (scrollAnimationRef.current) {
          scrollAnimationRef.current.kill();
          scrollAnimationRef.current = null;
          
          // Clean up listeners
          window.removeEventListener('wheel', handleInterruption);
          window.removeEventListener('touchmove', handleInterruption);
          window.removeEventListener('keydown', handleInterruption);
        }
      };

      // Listen for user interaction to interrupt
      window.addEventListener('wheel', handleInterruption, { once: true, passive: true });
      window.addEventListener('touchmove', handleInterruption, { once: true, passive: true });
      window.addEventListener('keydown', handleInterruption, { once: true, passive: true });
    }
  };

  return (
    <div ref={containerRef} className="scroll-smooth relative">
      <div className="mt-16 flex h-screen flex-col justify-center px-8">
        <div className="flex flex-wrap p-0">
          <LetterDisplay word={my} />
          <div className="w-2 xs:w-4 sm:w-10"></div>
          <LetterDisplay word={name} />
        </div>
        <div className="flex flex-wrap">
          <LetterDisplay word={is} />
          <div className="w-2 xs:w-4 sm:w-10"></div>
          <LetterDisplay word={george} />
        </div>
        {/* Scroll Indicator */}
        <div className="flex justify-center mt-16 w-full">
          <button
            ref={arrowLetterRef}
            className="letter pointer-events-auto focus:outline-none transform-gpu cursor-can-hover"
            data-speed={1.2} // Fixed value to avoid hydration mismatch
            onClick={scrollToNext}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="w-fit min-h-[70px] p-2 border-2 rounded-full border-gray-500 dark:border-white"
              >
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 35], opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                  className="w-4 h-4 rounded-full bg-gray-500 dark:bg-white"
                />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap">
        <LetterDisplay word={sentence3} />
      </div>
      {/* Add spacing after sentence3 to prevent overlap with next sections */}
      <div className="h-screen"></div>
    </div>
  );
}
