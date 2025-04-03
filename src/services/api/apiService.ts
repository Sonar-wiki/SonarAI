import { 
  WhaleData, 
  Alert, 
  TokenData, 
  WatchedToken, 
  WatchedWhale, 
  AlertSetting, 
  PersonalAlert,
  ApiResponse,
  PaginatedResponse 
} from './types';

import {
  mockWhaleData,
  mockAlerts,
  mockTokenData,
  mockWatchedTokens,
  mockWatchedWhales,
  mockAlertSettings,
  mockPersonalAlerts
} from './mockData';

// Mock API response delay
const MOCK_API_DELAY = 500;

// Helper function to simulate API delay
const simulateApiDelay = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_API_DELAY);
  });
};

// API Services
export const apiService = {
  // Whale Radar API
  getWhales: async (page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<WhaleData>>> => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockWhaleData.slice(startIndex, endIndex);
    
    return simulateApiDelay({
      success: true,
      data: {
        items: paginatedData,
        total: mockWhaleData.length,
        page,
        pageSize,
        hasMore: endIndex < mockWhaleData.length
      }
    });
  },
  
  getWhaleByAddress: async (address: string): Promise<ApiResponse<WhaleData | null>> => {
    const whale = mockWhaleData.find(w => w.address === address) || null;
    
    return simulateApiDelay({
      success: true,
      data: whale
    });
  },
  
  // Alert System API
  getAlerts: async (page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<Alert>>> => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockAlerts.slice(startIndex, endIndex);
    
    return simulateApiDelay({
      success: true,
      data: {
        items: paginatedData,
        total: mockAlerts.length,
        page,
        pageSize,
        hasMore: endIndex < mockAlerts.length
      }
    });
  },
  
  getAlertsByToken: async (token: string): Promise<ApiResponse<Alert[]>> => {
    const alerts = mockAlerts.filter(a => a.token === token);
    
    return simulateApiDelay({
      success: true,
      data: alerts
    });
  },
  
  // Market Intelligence API
  getTokensData: async (): Promise<ApiResponse<TokenData[]>> => {
    return simulateApiDelay({
      success: true,
      data: mockTokenData
    });
  },
  
  getTokenData: async (symbol: string): Promise<ApiResponse<TokenData | null>> => {
    const token = mockTokenData.find(t => t.symbol === symbol) || null;
    
    return simulateApiDelay({
      success: true,
      data: token
    });
  },
  
  // Personal Dashboard API
  getWatchedTokens: async (): Promise<ApiResponse<WatchedToken[]>> => {
    return simulateApiDelay({
      success: true,
      data: mockWatchedTokens
    });
  },
  
  getWatchedWhales: async (): Promise<ApiResponse<WatchedWhale[]>> => {
    return simulateApiDelay({
      success: true,
      data: mockWatchedWhales
    });
  },
  
  getAlertSettings: async (): Promise<ApiResponse<AlertSetting[]>> => {
    return simulateApiDelay({
      success: true,
      data: mockAlertSettings
    });
  },
  
  getPersonalAlerts: async (): Promise<ApiResponse<PersonalAlert[]>> => {
    return simulateApiDelay({
      success: true,
      data: mockPersonalAlerts
    });
  },
  
  // Alert Settings API
  updateAlertSetting: async (id: number, enabled: boolean): Promise<ApiResponse<AlertSetting>> => {
    const setting = mockAlertSettings.find(s => s.id === id);
    
    if (!setting) {
      return simulateApiDelay({
        success: false,
        data: null as any,
        error: 'Alert setting not found'
      });
    }
    
    setting.enabled = enabled;
    
    return simulateApiDelay({
      success: true,
      data: setting
    });
  },
  
  // Watchlist API
  addTokenToWatchlist: async (symbol: string): Promise<ApiResponse<WatchedToken>> => {
    const newToken: WatchedToken = {
      id: mockWatchedTokens.length + 1,
      symbol,
      alertsToday: 0,
      priceChange24h: 0
    };
    
    // In a real implementation, we would add this to the database
    // mockWatchedTokens.push(newToken);
    
    return simulateApiDelay({
      success: true,
      data: newToken
    });
  },
  
  addWhaleToWatchlist: async (address: string): Promise<ApiResponse<WatchedWhale>> => {
    const whale = mockWhaleData.find(w => w.address === address);
    
    if (!whale) {
      return simulateApiDelay({
        success: false,
        data: null as any,
        error: 'Whale address not found'
      });
    }
    
    const newWatchedWhale: WatchedWhale = {
      id: mockWatchedWhales.length + 1,
      address: whale.address,
      shortAddress: whale.shortAddress,
      lastActive: 'Just added'
    };
    
    // In a real implementation, we would add this to the database
    // mockWatchedWhales.push(newWatchedWhale);
    
    return simulateApiDelay({
      success: true,
      data: newWatchedWhale
    });
  }
}; 