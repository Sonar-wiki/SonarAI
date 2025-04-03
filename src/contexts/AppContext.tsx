import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WhaleData, Alert, TokenData, WatchedToken, WatchedWhale, AlertSetting, PersonalAlert } from '../services/api/types';
import { API } from '../services/api';
import { 
  connectWallet, 
  disconnectWallet, 
  getWalletInfo, 
  WalletInfo 
} from '../services/wallet';

// Define the context state shape
interface AppContextState {
  // Data states
  whales: WhaleData[];
  alerts: Alert[];
  tokenData: TokenData[];
  watchedTokens: WatchedToken[];
  watchedWhales: WatchedWhale[];
  alertSettings: AlertSetting[];
  personalAlerts: PersonalAlert[];
  
  // Wallet state
  wallet: {
    info: WalletInfo;
    isConnecting: boolean;
    error: string | null;
  };
  
  // Loading states
  loading: {
    whales: boolean;
    alerts: boolean;
    tokenData: boolean;
    personalData: boolean;
  };
  
  // Action methods
  refreshWhaleData: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshTokenData: () => Promise<void>;
  refreshPersonalData: () => Promise<void>;
  toggleAlertSetting: (id: number) => Promise<void>;
  addTokenToWatchlist: (symbol: string) => Promise<void>;
  addWhaleToWatchlist: (address: string) => Promise<void>;
  
  // Wallet methods
  handleConnectWallet: () => Promise<void>;
  handleDisconnectWallet: () => Promise<void>;
}

// Create the context with default values
const AppContext = createContext<AppContextState | undefined>(undefined);

// Provider Props
interface AppProviderProps {
  children: ReactNode;
}

// Provider Component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Data states
  const [whales, setWhales] = useState<WhaleData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [watchedTokens, setWatchedTokens] = useState<WatchedToken[]>([]);
  const [watchedWhales, setWatchedWhales] = useState<WatchedWhale[]>([]);
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([]);
  const [personalAlerts, setPersonalAlerts] = useState<PersonalAlert[]>([]);
  
  // Wallet state
  const [walletState, setWalletState] = useState({
    info: getWalletInfo(),
    isConnecting: false,
    error: null as string | null
  });
  
  // Loading states
  const [loading, setLoading] = useState({
    whales: true,
    alerts: true,
    tokenData: true,
    personalData: true
  });
  
  // Data fetching methods
  const refreshWhaleData = async () => {
    setLoading(prev => ({ ...prev, whales: true }));
    try {
      const response = await API.getWhales();
      if (response.success) {
        setWhales(response.data.items);
      }
    } catch (error) {
      console.error('Failed to refresh whale data:', error);
    } finally {
      setLoading(prev => ({ ...prev, whales: false }));
    }
  };
  
  const refreshAlerts = async () => {
    setLoading(prev => ({ ...prev, alerts: true }));
    try {
      const response = await API.getAlerts();
      if (response.success) {
        setAlerts(response.data.items);
      }
    } catch (error) {
      console.error('Failed to refresh alerts:', error);
    } finally {
      setLoading(prev => ({ ...prev, alerts: false }));
    }
  };
  
  const refreshTokenData = async () => {
    setLoading(prev => ({ ...prev, tokenData: true }));
    try {
      const response = await API.getTokensData();
      if (response.success) {
        setTokenData(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh token data:', error);
    } finally {
      setLoading(prev => ({ ...prev, tokenData: false }));
    }
  };
  
  const refreshPersonalData = async () => {
    setLoading(prev => ({ ...prev, personalData: true }));
    try {
      const [tokensRes, whalesRes, settingsRes, alertsRes] = await Promise.all([
        API.getWatchedTokens(),
        API.getWatchedWhales(),
        API.getAlertSettings(),
        API.getPersonalAlerts()
      ]);
      
      if (tokensRes.success) setWatchedTokens(tokensRes.data);
      if (whalesRes.success) setWatchedWhales(whalesRes.data);
      if (settingsRes.success) setAlertSettings(settingsRes.data);
      if (alertsRes.success) setPersonalAlerts(alertsRes.data);
    } catch (error) {
      console.error('Failed to refresh personal data:', error);
    } finally {
      setLoading(prev => ({ ...prev, personalData: false }));
    }
  };
  
  // Action methods
  const toggleAlertSetting = async (id: number) => {
    const setting = alertSettings.find(s => s.id === id);
    if (!setting) return;
    
    try {
      const response = await API.updateAlertSetting(id, !setting.enabled);
      if (response.success) {
        setAlertSettings(prev => 
          prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
      }
    } catch (error) {
      console.error('Failed to toggle alert setting:', error);
    }
  };
  
  const addTokenToWatchlist = async (symbol: string) => {
    try {
      const response = await API.addTokenToWatchlist(symbol);
      if (response.success) {
        setWatchedTokens(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Failed to add token to watchlist:', error);
    }
  };
  
  const addWhaleToWatchlist = async (address: string) => {
    try {
      const response = await API.addWhaleToWatchlist(address);
      if (response.success) {
        setWatchedWhales(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Failed to add whale to watchlist:', error);
    }
  };
  
  // Wallet methods
  const handleConnectWallet = async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
    try {
      const result = await connectWallet();
      if (result.success && result.data) {
        setWalletState(prev => ({ 
          ...prev, 
          info: result.data,
          isConnecting: false 
        }));
      } else {
        throw new Error(result.error || 'Unknown wallet connection error');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'Failed to connect wallet' 
      }));
    }
  };
  
  const handleDisconnectWallet = async () => {
    try {
      const success = await disconnectWallet();
      if (success) {
        const walletInfo = getWalletInfo();
        setWalletState(prev => ({ 
          ...prev, 
          info: walletInfo,
          error: null
        }));
      }
    } catch (error) {
      console.error('Wallet disconnect error:', error);
    }
  };
  
  // Load initial data
  useEffect(() => {
    refreshWhaleData();
    refreshAlerts();
    refreshTokenData();
    refreshPersonalData();
  }, []);
  
  // Context value
  const value: AppContextState = {
    whales,
    alerts,
    tokenData,
    watchedTokens,
    watchedWhales,
    alertSettings,
    personalAlerts,
    wallet: walletState,
    loading,
    refreshWhaleData,
    refreshAlerts,
    refreshTokenData,
    refreshPersonalData,
    toggleAlertSetting,
    addTokenToWatchlist,
    addWhaleToWatchlist,
    handleConnectWallet,
    handleDisconnectWallet
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 