import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import components
const Header = dynamic(() => import('../components/layout/Header'));
const Footer = dynamic(() => import('../components/layout/Footer'));
const AlertSystem = dynamic(() => import('../components/AlertSystem'));

const AlertsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Head>
        <title>Alerts | SONAR</title>
        <meta name="description" content="Real-time alerts on significant market movements and whale activities." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Alert System
            </h1>
            <p className="text-lg text-gray-300">
              Stay informed with real-time notifications about significant market movements, 
              whale activities, and emerging trends on Solana. Never miss an important opportunity again.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <AlertSystem />
        </section>
        
        <section className="mb-10">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Customize Your Alerts</h2>
            <p className="text-gray-300 mb-4">
              Connect your wallet to access personalized alerts based on your preferences and portfolio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Portfolio Alerts</h3>
                <p className="text-sm text-gray-400">
                  Get notified when whales move tokens you own or when significant price movements occur.
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Custom Thresholds</h3>
                <p className="text-sm text-gray-400">
                  Set your own thresholds for transaction size, price movements, and wallet activities.
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Multi-channel Delivery</h3>
                <p className="text-sm text-gray-400">
                  Receive alerts via email, mobile notifications, or Telegram in addition to the dashboard.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                Connect Wallet to Customize Alerts
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AlertsPage; 