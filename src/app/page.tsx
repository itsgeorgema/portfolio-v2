'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import SlidingImages from '@/components/home/SlidingImages';
import { LetterCollision } from '@/components/animations/textAnimations/scrollText';
import Magnetic from '@/components/animations/magnetic';
import Hero from '@/components/home/hero';
import Description from '@/components/home/Description/description';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useSpotify } from '@/hooks/useSpotify';
import { useGitHub } from '@/hooks/useGithub';
import GitHubContributionsGraph from '@/app/about/githubActivity';
import SpotifyPlaylists from '@/app/about/spotifyPlaylists';
import Link from 'next/link';
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

export default function Home() {
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState({ active: false, index: 0 });
  
  const {
    playlists,
    isLoading: spotifyLoading,
    error: spotifyError,
    topTracks
  } = useSpotify();

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
        <div id="hero" ref={heroRef} className="relative">
          <Hero />
          <div className="pointer-events-none absolute inset-0 z-10">
            <LetterCollision />
          </div>
        </div>

        {/* Description Section */}
        <div id="description" className="relative">
          <Description />
        </div>

        {/* About Section */}
        <div id="about" className="relative overflow-hidden bg-gradient-to-b from-purple-200 via-purple-300 to-yellow-200">
          <div className="relative min-h-screen">
            <div ref={starsRef}>
              {[...Array(50)].map((_, i) => {
                // Use deterministic positioning with fixed precision to avoid hydration mismatch
                const seed = i * 7.3;
                const top = Math.round((Math.sin(seed) * 50 + 50) * 100) / 100;
                const left = Math.round((Math.cos(seed) * 50 + 50) * 100) / 100;
                
                return (
                  <div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-white opacity-70"
                    style={{
                      top: `${top}%`,
                      left: `${left}%`
                    }}
                  />
                );
              })}
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="pb-14 text-3xl font-medium lg:text-[10rem] text-center">
                I&apos;m George
              </div>
              <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                <div className="flex flex-col gap-10">
                  <div className="relative">
                    <div className="rounded-full blur-3xl" />
                    <Image
                      className="relative z-10 mx-auto h-auto w-full max-w-sm rounded-t-full shadow-lg"
                      width={1440}
                      height={1800}
                      src="/images/profile2.jpg"
                      alt="Profile picture"
                    />
                  </div>
                  {spotifyLoading ? (
                    <p>Loading Spotify playlists...</p>
                  ) : spotifyError ? (
                    <p>Error: {spotifyError}</p>
                  ) : playlists.length > 0 ? (
                    <SpotifyPlaylists playlists={playlists} />
                  ) : null}
                </div>

                <div className="flex flex-col gap-10">
                  <div className="text-primary-950/70 dark:text-primary-200/70 space-y-8">
                    <p className="text-2xl font-semibold">
                      A software engineer and designer with a passion for
                      innovation and cutting-edge technology.
                    </p>
                    <p className="text-lg sm:text-xl">
                      I have a strong track record of building and deploying
                      successful products.
                    </p>
                    <p className="text-lg sm:text-xl">
                      At{' '}
                      <Link
                        href="https://www.sojo.uk/"
                        className="font-semibold underline"
                      >
                        Sojo
                      </Link>
                      , I was the founding full-stack engineer, responsible for
                      the design, development, and deployment of the
                      company&apos;s core platform. I built a scalable and
                      user-friendly app that allowed users to order repairs and
                      customisation clothing services online.
                    </p>
                    <p className="text-lg sm:text-xl">
                      After Sojo, I joined{' '}
                      <Link
                        href="https://www.catapultlabs.xyz/"
                        className="font-semibold underline"
                      >
                        Catapult Labs
                      </Link>
                      , a startup in the blockchain space, as a founding
                      full-stack software engineer. I played a key role in the
                      development of the company&apos;s flagship product, a Web3
                      profiles platform that enables networking in the
                      decentralized space.
                    </p>
                    <p className="text-lg sm:text-xl">
                      I then worked on developing decentralised financial
                      primitives and protocols to enable OTC (Over-The-Counter)
                      crypto markets on-chain, including collateral management and
                      margin trading systems. During this time I also learnt
                      Solidity, to enable the development of smart contracts to
                      enable new on-chain financial products.
                    </p>
                    <p className="text-lg sm:text-xl">
                      In recent months I have been working on an AI co-pilot for
                      digital asset trading that unifies client conversations
                      across chat clients like Telegram using OpenAI&apos;s
                      models.
                    </p>
                    <p className="text-lg sm:text-xl">
                      At Imperial College London, I studied design engineering.
                      During my time at university, I worked on a number of
                      projects, including{' '}
                      <Link
                        href="#projects"
                        className="font-semibold underline"
                        onClick={(e) => {
                          e.preventDefault();
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
                      >
                        Andromeda
                      </Link>
                      , which was awarded a gold prize in the Creative Conscience
                      Awards, and{' '}
                      <Link
                        href="#projects"
                        className="font-semibold underline"
                        onClick={(e) => {
                          e.preventDefault();
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
                      >
                        AxoWear
                      </Link>
                      , which was exhibited at the Design Museum London.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                className="flex flex-col gap-10 pt-10"
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
