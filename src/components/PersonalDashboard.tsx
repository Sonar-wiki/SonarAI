import React, { useState, useEffect } from 'react';
import { 
  WatchedToken,
  WatchedWhale,
  AlertSetting,
  PersonalAlert
} from '../services/api/types';
import { 
  mockWatchedTokens,
  mockWatchedWhales,
  mockAlertSettings,
  mockPersonalAlerts
} from '../services/api/mockData';

const PersonalDashboard: React.FC = () => {
  const [watchedTokens, setWatchedTokens] = useState<WatchedToken[]>([]);
  const [watchedWhales, setWatchedWhales] = useState<WatchedWhale[]>([]);
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([]);
  const [personalAlerts, setPersonalAlerts] = useState<PersonalAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, we would fetch data from the API
    // For demonstration, we use mock data with a delay
    const timer = setTimeout(() => {
      setWatchedTokens(mockWatchedTokens);
      setWatchedWhales(mockWatchedWhales);
      setAlertSettings(mockAlertSettings);
      setPersonalAlerts(mockPersonalAlerts);
      setLoading(false);
    }, 1100); // Slightly different loading time for visual effect

    return () => clearTimeout(timer);
  }, []);

  const toggleAlertSetting = (id: number) => {
    setAlertSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Personal Intelligence Center</h2>
        <div className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">Customize</div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-400">Loading your personalized dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Watched Tokens</h3>
              <div className="space-y-3">
                {watchedTokens.map(token => (
                  <div key={token.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${
                        token.symbol === 'SOL' ? 'bg-blue-500/20 text-blue-400' : 
                        token.symbol === 'BONK' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-purple-500/20 text-purple-400'
                      } rounded-full flex items-center justify-center mr-3`}>
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-400">{token.alertsToday} alerts today</div>
                      </div>
                    </div>
                    <div className={token.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}>
                      {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  + Add Token
                </button>
              </div>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Whale Watchlist</h3>
              <div className="space-y-3">
                {watchedWhales.map(whale => (
                  <div key={whale.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm text-white">{whale.shortAddress}</div>
                    </div>
                    <div className="text-xs text-gray-400">Active {whale.lastActive}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  + Add Wallet
                </button>
              </div>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Alert Settings</h3>
              <div className="space-y-3">
                {alertSettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="text-sm text-white">{setting.name}</div>
                    <div 
                      onClick={() => toggleAlertSetting(setting.id)} 
                      className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer"
                    >
                      <div className={`block w-10 h-6 rounded-full ${setting.enabled ? 'bg-blue-600' : 'bg-gray-500'}`}></div>
                      <div className={`absolute ${setting.enabled ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-full transition`}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">Recent Personalized Alerts</h3>
            <div className="space-y-3">
              {personalAlerts.map(alert => (
                <div key={alert.id} className={`flex justify-between items-start border-l-4 ${
                  alert.severity === 'high' ? 'border-green-500' :
                  alert.severity === 'medium' ? 'border-yellow-500' :
                  'border-blue-500'
                } pl-3`}>
                  <div>
                    <div className="text-white font-medium">{alert.title}</div>
                    <div className="text-sm text-gray-300">{alert.description}</div>
                  </div>
                  <div className="text-xs text-gray-400">{alert.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
              Connect Wallet to Enable All Features
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalDashboard; 