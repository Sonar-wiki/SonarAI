import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import components
const Header = dynamic(() => import('../components/layout/Header'));
const Footer = dynamic(() => import('../components/layout/Footer'));
const WhaleRadar = dynamic(() => import('../components/WhaleRadar'));

const WhaleRadarPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Head>
        <title>Whale Radar | SONAR</title>
        <meta name="description" content="Track whale activities in real-time on Solana blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Whale Radar
            </h1>
            <p className="text-lg text-gray-300">
              Track the movements of the largest holders on Solana in real-time. Monitor accumulation, 
              selling, and transfer patterns of influential wallets to identify market trends before they happen.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <WhaleRadar />
        </section>
        
        <section className="mb-10">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Advanced Whale Analysis</h2>
            <p className="text-gray-300 mb-4">
              Unlock premium features to get deeper insights into whale behavior patterns, wallet clustering, and predictive alerts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Historical Patterns</h3>
                <p className="text-sm text-gray-400">
                  View historical whale activity to identify recurring patterns and predict future movements.
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Wallet Clustering</h3>
                <p className="text-sm text-gray-400">
                  Identify related wallets through on-chain analysis to track sophisticated whale strategies.
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Custom Alerts</h3>
                <p className="text-sm text-gray-400">
                  Set up custom alerts for specific whales, tokens, or transaction thresholds.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                Connect Wallet to Access Premium Features
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WhaleRadarPage; 