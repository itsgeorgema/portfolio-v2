'use client';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import SlidingImages from '@/components/home/SlidingImages';
import { LetterCollision } from '@/components/animations/textAnimations/scrollText';
import Hero from '@/components/home/hero';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGitHub } from '@/hooks/useGithub';
import GitHubContributionsGraph from '@/app/about/githubActivity';
import SpotifyTrackCard from '@/app/about/spotifyTrackCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectLink from '@/app/projects/projectLink';
import Modal from '@/app/projects/project/modal';
import { ModalContext } from '@/app/projects/modalContext';

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

const projects = [
  {
    title: 'M31 Controller',
    src: 'm31/controller.jpg',
    description:
      'A video/audio game controller to make digital entertainment more approachable to those with visual impairments.',
    href: '/projects/m31',
    tag: 'Prototyping',
    color: '#000000'
  },
  {
    title: 'AXO',
    src: 'axo/astronaut-square.png',
    href: '/projects/axo',
    tag: 'Bio Materials',
    color: '#ee5622'
  },
  {
    title: 'StyleSync',
    src: 'stylesync/stylesync.png',
    href: '/projects/stylesync',
    tag: 'ML / AI',
    color: 'pink'
  },
  {
    title: 'StackeRs',
    description:
      'Reusable packaging made of highly recyclable materials for baby bathing products.',
    src: 'bottles/block.png',
    href: '/projects/stackers',
    tag: 'Packaging',
    color: '#EFE8D3'
  },
  {
    title: 'ASTRA',
    description: 'An interstellar games arcade with a hologram screen.',
    src: 'astra/astra.png',
    href: '/projects/astra',
    tag: 'GIZMO',
    color: '#303030'
  }
];

type ExperienceItem = {
  title: string;
  company: string;
  url?: string;
  date: string;
  highlights: string[];
};

const experiences: ExperienceItem[] = [
  {
    title: 'Software Engineer Intern',
    company: 'Praxie AI',
    url: 'https://praxie.ai/',
    date: 'Apr. 2025 – Present',
    highlights: [
      'Created reusable MVP React Native UI components for iOS and Android',
      'Developed algorithms for searching, sorting, and saving tournaments',
      'Optimized database structures by denormalizing fields'
    ]
  },
  {
    title: 'Webmaster/Lead Developer',
    company: 'Alpha Kappa Psi @ UCSD',
    date: 'Dec. 2024 – Present',
    highlights: [
      'Developed a new chapter website using Next.js, Tailwind CSS, and Supabase',
      'Led a team of 3 developers with a Github-driven agile workflow'
    ]
  },
  {
    title: 'Data Science Consultant',
    company: 'DS3 @ UCSD',
    date: 'Mar. 2025 – Jun. 2025',
    highlights: [
      'Implemented a data processing pipeline for client datasets',
      'Built a Streamlit dashboard for client data visualization',
      'Forecasted participation with XGBoost, SARIMA, and Prophet with automated residual diagnostics'
    ]
  }
];

function ExperienceTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate which timeline item is closest to the center of the viewport
  useEffect(() => {
    if (experiences.length === 0) return;

    const calculateClosestItem = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    calculateClosestItem();
    window.addEventListener("scroll", calculateClosestItem);
    window.addEventListener("resize", calculateClosestItem);
    return () => {
      window.removeEventListener("scroll", calculateClosestItem);
      window.removeEventListener("resize", calculateClosestItem);
    };
  }, [activeIndex]);

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      <h3 className="mb-16 text-center text-4xl font-bold text-white lg:text-5xl">
        Experience
      </h3>
      <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-purple-400/50 transform md:-translate-x-1/2 z-0" />
      <div className="space-y-12 relative">
        {experiences.map((experience, index) => (
          <TimelineItem
            key={index}
            experience={experience}
            index={index}
            isActive={index === activeIndex}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineItemProps {
  experience: ExperienceItem;
  index: number;
  isActive: boolean;
}

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(function TimelineItem(
  { experience, index, isActive },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-start md:items-center gap-4 ${
        index % 2 === 0 ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        className={`flex-1 text-left`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div
          className={`${
            isActive
              ? "bg-gray-900/90 border-purple-400 border-2 scale-[1.02]"
              : "bg-gray-900/80 border-purple-400/40 border-2"
          } rounded-lg p-6 shadow-lg transition-all duration-300 relative z-20 text-white text-left`}
        >
          <h4 className="text-xl font-bold mb-2">{experience.title}</h4>
          <p className="text-lg font-semibold text-purple-400 mb-2">
            {experience.url ? (
              <a
                href={experience.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
          </p>
          <p className="text-sm text-gray-300 mb-4">{experience.date}</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm marker:text-gray-300 marker:font-extrabold">
            {experience.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </motion.div>
      <div className="flex items-center justify-center z-10">
        <div
          className={`w-8 h-8 rounded-full transition-colors duration-300 border-4 border-purple-400/50 ${
            isActive
              ? "bg-purple-600"
              : "bg-gray-700"
          }`}
        />
      </div>
      <div className="flex-1 hidden md:block"></div>
    </div>
  );
});

TimelineItem.displayName = "TimelineItem";

export default function Home() {
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState({ active: false, index: 0 });
  
  const {
    githubData,
    isLoading: githubLoading,
    error: githubError
  } = useGitHub();

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollToPlugin);
    
    // Animate stars
    if (!starsRef.current) return;
    gsap.to(starsRef.current?.children, {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      rotation: 'random(-360, 360)',
      duration: 3,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      stagger: 0.1
    });
  }, []);

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      <div ref={scrollContainerRef} className="overflow-x-hidden">
        {/* Hero Section */}
        <div id="hero" ref={heroRef} className="relative pb-80">
          <Hero />
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <LetterCollision />
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="relative overflow-hidden">
          <div className="relative min-h-screen">
            <div ref={starsRef} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              
              {/* About Summary Section */}
              <div className="mb-20">
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16 mb-12">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/profile.jpeg"
                      alt="George Ma"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover shadow-2xl"
                    />
                  </div>

                  {/* About Text */}
                  <div className="flex-1 space-y-6 text-white">
                    <h2 className="text-4xl font-bold text-white mb-6">
                      Hi, I&apos;m George <span className="inline-block animate-wave">👋</span>
                    </h2>
                    
                    <p className="text-lg leading-relaxed sm:text-xl">
                      I&apos;m a Computer Science student at UCSD minoring in Business Analytics. I have extensive experience in web and app development as well as machine learning, and am pursuing a career in software engineering. I currently work as a Software Engineer Intern at{' '}
                      <Link
                        href="https://www.praxie.ai/"
                        className="font-semibold underline hover:text-purple-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Praxie AI
                      </Link>
                      , a startup that provides an AI-powered coaching platform for youth golfers.
                    </p>

                    <p className="text-lg leading-relaxed sm:text-xl">
                      In my free time, I enjoy snowboarding, rock climbing, hiking, and playing basketball and guitar. I&apos;m also an avid fan of the Lakers, and McDonald&apos;s.
                    </p>

                    {/* Music Section - centered within text column */}
                    <div className="flex justify-center pt-4">
                      <div className="w-full max-w-sm">
                        <SpotifyTrackCard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Experience Timeline */}
              <ExperienceTimeline />

              {/* GitHub Activity */}
              <div className="mt-20 flex justify-center">
                <Link
                  className="flex flex-col gap-10 max-w-4xl w-full"
                  href="https://github.com/itsgeorgema"
                >
                  {githubLoading ? (
                    <div></div>
                  ) : githubError ? (
                    <div></div>
                  ) : githubData ? (
                    <GitHubContributionsGraph
                      contributions={githubData.contributions}
                      totalContributions={githubData.totalContributions}
                      restrictedContributions={githubData.restrictedContributions}
                    />
                  ) : null}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div id="projects" className="mt-36 px-8 py-16 sm:py-20">
          <h1 className="pb-14 text-3xl font-medium lg:text-[10rem]">
            My Work
          </h1>
          <div className="m-0">
            <div className="m-0 overflow-hidden">
              {projects.map((project, index) => {
                return (
                  <Link href={project.href} key={index}>
                    <ProjectLink
                      index={index}
                      title={project.title}
                      tag={project.tag}
                    />
                  </Link>
                );
              })}
            </div>
            <Modal projects={projects} />
          </div>
        </div>

        {/* Sliding Images Section */}
        <div id="sliding-images">
          <SlidingImages slider1={slider1} slider2={slider2} />
        </div>
      </div>
    </ModalContext.Provider>
  );
}
