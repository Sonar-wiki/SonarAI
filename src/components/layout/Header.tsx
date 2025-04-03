import React from 'react';
import Link from 'next/link';
import { useAppContext } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const { wallet, handleConnectWallet, handleDisconnectWallet } = useAppContext();
  const { info, isConnecting } = wallet;

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-500">
              SONAR
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/whale-radar" className="text-gray-300 hover:text-white">
                  Whale Radar
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-gray-300 hover:text-white">
                  Alerts
                </Link>
              </li>
              <li>
                <Link href="/market-intelligence" className="text-gray-300 hover:text-white">
                  Market Intel
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            {info.isConnected ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  <span className="mr-2">{formatWalletAddress(info.address)}</span>
                  <span className="text-green-400">{info.balance.toFixed(2)} SOL</span>
                </div>
                <button 
                  onClick={handleDisconnectWallet}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnectWallet} 
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 