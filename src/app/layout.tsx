import { Orbitron, Oxanium } from 'next/font/google';
import './globals.css';
import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import Animations from './animations';
import Header from '@/components/layout/header';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SpaceBackground from '@/components/animations/spaceBackground';
import ElasticCursor from '@/components/animations/elasticCursor';
import Preloader from '@/components/animations/preLoader';
import FluidSimulation from '@/components/animations/fluidSimulation';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400','500','600','700','800','900'], variable: '--font-orbitron' });
const oxanium = Oxanium({ subsets: ['latin'], weight: ['200','300','400','500','600','700','800'], variable: '--font-oxanium' });

export const metadata: Metadata = {
  title: "George's Portfolio",
  description: 'George Ma.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${orbitron.variable} ${oxanium.variable}`}>
      <SpeedInsights />
      <body className="overflow-scroll overflow-x-hidden bg-transparent font-orbitron" suppressHydrationWarning>
        <SpaceBackground className="animate-fade-in fixed inset-0 z-0" />
        <FluidSimulation className="animate-fade-in fixed inset-0 z-0" />
        <Animations>
          <main>
            <Header />
            <div className="flex flex-col relative z-10 text-foreground">
              <main className={`flex-grow font-orbitron`}>{children}</main>
              <Analytics />
            </div>
            <Toaster />
          </main>
        </Animations>
        <ElasticCursor />
      </body>
    </html>
  );
}
