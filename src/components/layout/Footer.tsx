import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SONAR</h3>
            <p className="text-gray-400">
              Your AI Intelligence Officer for Blockchain Trading. Monitor whale activity and seize trading opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/whale-radar" className="text-gray-400 hover:text-blue-400">
                  Whale Radar
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-gray-400 hover:text-blue-400">
                  Alert System
                </Link>
              </li>
              <li>
                <Link href="/market-intelligence" className="text-gray-400 hover:text-blue-400">
                  Market Intelligence
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-blue-400">
                  Personal Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-blue-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-blue-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-blue-400">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/sonarprotocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://t.me/sonarprotocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://discord.gg/sonarprotocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} SONAR Protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 