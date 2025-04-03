import React, { useState, useEffect } from 'react';
import { TokenData } from '../services/api/types';
import { mockTokenData } from '../services/api/mockData';

const MarketIntelligence: React.FC = () => {
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, we would fetch data from the API
    // For demonstration, we use mock data with a delay
    const timer = setTimeout(() => {
      setTokenData(mockTokenData);
      setLoading(false);
    }, 900); // Slightly different loading time for visual effect

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Market Intelligence</h2>
        <div className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">View Detailed Analysis</div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-400">Loading market intelligence data...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Whale Interest
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Net Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {tokenData.map((token) => (
                  <tr key={token.id} className="hover:bg-slate-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-white">{token.name}</div>
                          <div className="text-sm text-gray-400">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-white">{token.whaleInterest}</div>
                        <div className="ml-2">
                          {token.interestTrend === 'increasing' && (
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                          {token.interestTrend === 'decreasing' && (
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        token.netWhalePosition === 'Accumulating' ? 'text-green-400' : 
                        token.netWhalePosition === 'Selling' ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>
                        {token.netWhalePosition}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        token.riskLevel === 'Low' ? 'bg-green-900/40 text-green-300' : 
                        token.riskLevel === 'Medium' ? 'bg-yellow-900/40 text-yellow-300' : 
                        'bg-red-900/40 text-red-300'
                      }`}>
                        {token.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`text-sm ${token.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">Market Insights</h3>
            <p className="text-sm text-gray-300">
              Whales are currently accumulating SOL and PYTH while showing mixed signals on BONK. 
              Overall market sentiment based on whale activity is cautiously bullish, with higher 
              than average on-chain velocity in the last 24 hours.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketIntelligence; 