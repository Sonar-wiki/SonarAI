import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid issues during build
const Header = dynamic(() => import('../components/layout/Header'));
const Footer = dynamic(() => import('../components/layout/Footer'));
const WhaleRadar = dynamic(() => import('../components/WhaleRadar'));
const AlertSystem = dynamic(() => import('../components/AlertSystem'));
const MarketIntelligence = dynamic(() => import('../components/MarketIntelligence'));
const PersonalDashboard = dynamic(() => import('../components/PersonalDashboard'));

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Head>
        <title>SONAR - AI Intelligence Officer for Blockchain Trading</title>
        <meta name="description" content="Monitor whale activity in real time, detect market trends, and receive smart alerts to seize trading opportunities on Solana." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text mb-4">
              SONAR
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Your AI Intelligence Officer for Blockchain Trading
            </p>
            <p className="mt-4 text-gray-400">
              Monitor whale activity in real time, detect market trends, and receive smart alerts.
              Stay one step ahead and seize trading opportunities on Solana.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <WhaleRadar />
          <AlertSystem />
        </section>

        <section className="mb-10">
          <MarketIntelligence />
        </section>

        <section className="mb-10">
          <PersonalDashboard />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home; 