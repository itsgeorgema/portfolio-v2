import { motion } from 'framer-motion';
import { perspective } from '@/components/nav/anim';
import Magnetic from '@/components/animations/magnetic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

type NavLinksProps = {
  links: { title: string; href?: string; isSection?: boolean }[];
  setIsActive: (isActive: boolean) => void;
};

export default function NavLinks({ links, setIsActive }: NavLinksProps) {
  const handleClick = (link: { title: string; href?: string; isSection?: boolean }) => {
    setIsActive(false);
    
    if (link.isSection && link.href) {
      const sectionId = link.href.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        gsap.registerPlugin(ScrollToPlugin);
        const targetPosition = element.offsetTop;
        gsap.to(window, {
          duration: 2.0,
          scrollTo: { 
            y: targetPosition,
            autoKill: true
          },
          ease: "power2.inOut"
        });
      }
    } else if (link.href) {
      window.open(link.href, link.href.startsWith('http') ? '_blank' : '_self');
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {links.map((link, i) => {
        const { title } = link;
        return (
          <div key={`b_${i}`} className="perspective-[120px] origin-bottom">
            <motion.div
              custom={i}
              variants={perspective}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Magnetic>
                <button
                  onClick={() => handleClick(link)}
                  className="text-[46px] italic text-background no-underline cursor-can-hover"
                >
                  {title}
                </button>
              </Magnetic>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
