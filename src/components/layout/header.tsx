'use client';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';
import Menu from '../nav';
import Link from 'next/link';
import { isMobile } from '@/components/util';
import Magnetic from '@/components/animations/magnetic';
import Image from 'next/image';

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname, isActive]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: 'power1.out'
          });
        },
        onEnterBack: () => {
          gsap.to(button.current, {
            scale: 0,
            duration: 0.25,
            ease: 'power1.out'
          });
        }
      }
    });
  }, []);

  return (
    <>
      <div
        ref={header}
        className="absolute top-0 z-20 box-border flex w-full items-center justify-between p-4 font-light text-white mix-blend-difference lg:p-8"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href={'/'} className="group z-10 flex items-center space-x-2 cursor-can-hover">
            <Magnetic>
              <Image
                height={32}
                width={32}
                src="/images/logo.png"
                alt="George Ma"
                priority
              />
            </Magnetic>
            {!isMobile() && (
              <div className="relative flex overflow-hidden">
                <div className="ease-custom-cubic px-1 transition-transform duration-500 group-hover:translate-x-[-100%]">
                  George
                </div>
                <div className="ease-custom-cubic translate-x-full transition-transform duration-500 group-hover:translate-x-[-70px]">
                  Ma
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        {!isMobile() && (
          <div className="flex items-center space-x-8 font-semibold">
            <Magnetic>
              <button
                onClick={() => {
                  const section = document.getElementById('about');
                  if (section) {
                    const targetPosition = section.offsetTop;
                    gsap.to(window, {
                      duration: 2.0,
                      scrollTo: { 
                        y: targetPosition,
                        autoKill: true
                      },
                      ease: "power2.inOut"
                    });
                  }
                }}
                className="cursor-can-hover hover:opacity-70 transition-opacity"
              >
                ABOUT
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => {
                  const section = document.getElementById('projects');
                  if (section) {
                    const targetPosition = section.offsetTop;
                    gsap.to(window, {
                      duration: 2.0,
                      scrollTo: { 
                        y: targetPosition,
                        autoKill: true
                      },
                      ease: "power2.inOut"
                    });
                  }
                }}
                className="cursor-can-hover hover:opacity-70 transition-opacity"
              >
                PROJECTS
              </button>
            </Magnetic>
            <Magnetic>
              <Link href={'/George_Ma_Resume.pdf'} target="_blank" rel="noopener noreferrer" className="cursor-can-hover hover:opacity-70 transition-opacity">
                RESUME
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href={'https://github.com/itsgeorgema'} target="_blank" rel="noopener noreferrer" className="cursor-can-hover hover:opacity-70 transition-opacity">
                GITHUB
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href={'https://linkedin.com/in/ggeorgema'} target="_blank" rel="noopener noreferrer" className="cursor-can-hover hover:opacity-70 transition-opacity">
                LINKEDIN
              </Link>
            </Magnetic>
          </div>
        )}
      </div>
      {!isMobile() && (
        <div ref={button} className="fixed right-0 z-20 scale-0 transform">
          <Menu />
        </div>
      )}
      {isMobile() && (
        <div className="fixed right-2 z-20 transform">
          <Menu />
        </div>
      )}
    </>
  );
}
