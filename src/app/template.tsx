'use client';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform
} from 'framer-motion';
import { isMobile } from '@/components/util';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import PreLoader from '@/components/animations/preLoader';

export default function RootTemplate({ children }: PropsWithChildren) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  const input = isMobile() ? 0.9 : 1.2;
  const height = useTransform(scrollYProgress, [0, input], [50, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname().split('/').pop();

  let bgColour = 'bg-background';
  const darkModeScreens = ['m31', 'astra'];
  if (darkModeScreens.includes(pathname!)) {
    bgColour = 'bg-foreground';
  } else if (pathname === 'about') {
    bgColour = 'bg-yellow-200';
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 800);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <PreLoader />}
      </AnimatePresence>
      <div ref={container} className="relative z-10">
        {children}
        <motion.div style={{ height }} className="relative">
          <div
            className={clsx(
              'absolute left-[-10%] z-10 h-[1050%] w-[120%] rounded-b-[100%] shadow-[0_60px_50px_0px_rgba(0,0,0,0.748)]',
              bgColour
            )}
          ></div>
        </motion.div>
      </div>
    </main>
  );
}
