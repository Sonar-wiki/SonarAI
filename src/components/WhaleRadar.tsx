import React, { useState, useEffect } from 'react';
import { WhaleData } from '../services/api/types';
import { mockWhaleData } from '../services/api/mockData';

const WhaleRadar: React.FC = () => {
  const [whales, setWhales] = useState<WhaleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, we would fetch data from the API
    // For demonstration, we use mock data with a delay
    const timer = setTimeout(() => {
      setWhales(mockWhaleData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Whale Radar</h2>
        <div className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">View All</div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-400">Loading whale activity data...</div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Whale
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {whales.map((whale) => (
                <tr key={whale.id} className="hover:bg-slate-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{whale.shortAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      whale.activity === 'Accumulating' ? 'text-green-400' : 
                      whale.activity === 'Selling' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {whale.activity}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{whale.token}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      whale.trend === 'increasing' ? 'text-green-400' : 
                      whale.trend === 'decreasing' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {whale.token === 'BONK' 
                        ? `${whale.amount.toLocaleString()} M` 
                        : `${whale.amount.toLocaleString()}`}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    {whale.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 text-xs text-gray-500">
        Real-time data tracking top 100 whales on Solana
      </div>
    </div>
  );
};

export default WhaleRadar; 