'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SlideInFadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  threshold?: number;
}

export default function SlideInFadeIn({
  children,
  delay = 0,
  direction = 'up',
  distance = 30,
  threshold = 0.4
}: SlideInFadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const directionOffset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 }
  };

  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0
            }
          : {
              opacity: 0,
              x: offset.x,
              y: offset.y
            }
      }
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
