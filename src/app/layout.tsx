import { Inter } from 'next/font/google';
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

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className="dark">
      <SpeedInsights />
      <body className="overflow-scroll overflow-x-hidden bg-transparent" suppressHydrationWarning>
        <SpaceBackground className="animate-fade-in fixed inset-0 z-0" />
        <FluidSimulation className="animate-fade-in fixed inset-0 z-0" />
        <Animations>
          <main>
            <Header />
            <div className="flex flex-col relative z-10 text-foreground">
              <main className={`flex-grow ${inter.className}`}>{children}</main>
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
