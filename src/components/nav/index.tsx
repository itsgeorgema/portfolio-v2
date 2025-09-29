import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import MenuButton from '@/components/nav/menuButton';
import React, { useState } from 'react';
import NavLinks from '@/components/nav/NavLinks';

const links = [
  {
    title: 'home',
    href: '#hero',
    isSection: true
  },
  {
    title: 'about',
    href: '#about',
    isSection: true
  },
  {
    title: 'projects',
    href: '#projects',
    isSection: true
  },
  {
    title: 'resume',
    href: '/George_Ma_Resume.pdf',
    isSection: false
  },
  {
    title: 'github',
    href: 'https://github.com/itsgeorgema',
    isSection: false
  },
  {
    title: 'linkedin',
    href: 'https://linkedin.com/in/ggeorgema',
    isSection: false
  }
];

const menu = {
  open: {
    transition: { duration: 0.75, type: 'tween' as const, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }
  },
  closed: {
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: 'tween' as const,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number]
    }
  }
};

export default function Menu() {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="fixed right-[20px] top-[20px] z-20 lg:right-[30px] lg:top-[30px]">
      <motion.div
        className={cn('relative rounded-3xl bg-secondary', {
          'lg:top-[-25px right-[-15px] top-[-15px] h-[640px] w-[350px] sm:h-[650px] sm:w-[480px] lg:right-[-25px] ':
            isActive,
          'right-0 top-0 h-[40px] w-[100px] opacity-0': !isActive
        })}
        variants={menu}
        animate={isActive ? 'open' : 'closed'}
        initial="closed"
      >
        <AnimatePresence>
          {isActive && (
            <div className="box-border flex h-full flex-col justify-between p-[100px_40px_50px]">
              <NavLinks links={links} setIsActive={setIsActive} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      <MenuButton
        isActive={isActive}
        toggleMenu={() => {
          setIsActive(!isActive);
        }}
      />
    </div>
  );
}
