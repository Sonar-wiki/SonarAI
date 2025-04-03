import React, { useState, useEffect } from 'react';
import { Alert } from '../services/api/types';
import { mockAlerts } from '../services/api/mockData';

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, we would fetch data from the API
    // For demonstration, we use mock data with a delay
    const timer = setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 700); // Slightly different loading time for visual effect

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Alert System</h2>
        <div className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">View All</div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-400">Loading alerts...</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-500/10' : 
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-500/10' : 
                'border-blue-500 bg-blue-500/10'
              } p-4 rounded-r-lg`}
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-white">{alert.title}</h3>
                <span className="text-sm text-gray-400">{alert.time}</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
              <div className="flex items-center mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.type === 'whale-movement' ? 'bg-purple-900/50 text-purple-300' : 
                  alert.type === 'market-trend' ? 'bg-blue-900/50 text-blue-300' : 
                  'bg-green-900/50 text-green-300'
                }`}>
                  {alert.type === 'whale-movement' ? 'Whale Movement' : 
                   alert.type === 'market-trend' ? 'Market Trend' : 
                   'Market Anomaly'}
                </span>
                <span className="text-xs text-gray-400 ml-2">{alert.token}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Alerts based on AI analysis of on-chain activity
      </div>
    </div>
  );
};

export default AlertSystem; 