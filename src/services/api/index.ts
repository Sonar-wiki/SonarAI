import { apiService } from './apiService';

// Re-export the API service functions with proper error handling
export const API = {
  // Whale Radar API
  getWhales: async (page = 1, pageSize = 10) => {
    try {
      return await apiService.getWhales(page, pageSize);
    } catch (error) {
      console.error('Error fetching whale data:', error);
      throw error;
    }
  },
  
  getWhaleByAddress: async (address: string) => {
    try {
      return await apiService.getWhaleByAddress(address);
    } catch (error) {
      console.error('Error fetching whale details:', error);
      throw error;
    }
  },
  
  // Alert System API
  getAlerts: async (page = 1, pageSize = 10) => {
    try {
      return await apiService.getAlerts(page, pageSize);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },
  
  getAlertsByToken: async (token: string) => {
    try {
      return await apiService.getAlertsByToken(token);
    } catch (error) {
      console.error('Error fetching token alerts:', error);
      throw error;
    }
  },
  
  // Market Intelligence API
  getTokensData: async () => {
    try {
      return await apiService.getTokensData();
    } catch (error) {
      console.error('Error fetching tokens data:', error);
      throw error;
    }
  },
  
  getTokenData: async (symbol: string) => {
    try {
      return await apiService.getTokenData(symbol);
    } catch (error) {
      console.error('Error fetching token data:', error);
      throw error;
    }
  },
  
  // Personal Dashboard API
  getWatchedTokens: async () => {
    try {
      return await apiService.getWatchedTokens();
    } catch (error) {
      console.error('Error fetching watched tokens:', error);
      throw error;
    }
  },
  
  getWatchedWhales: async () => {
    try {
      return await apiService.getWatchedWhales();
    } catch (error) {
      console.error('Error fetching watched whales:', error);
      throw error;
    }
  },
  
  getAlertSettings: async () => {
    try {
      return await apiService.getAlertSettings();
    } catch (error) {
      console.error('Error fetching alert settings:', error);
      throw error;
    }
  },
  
  getPersonalAlerts: async () => {
    try {
      return await apiService.getPersonalAlerts();
    } catch (error) {
      console.error('Error fetching personal alerts:', error);
      throw error;
    }
  },
  
  // Settings API
  updateAlertSetting: async (id: number, enabled: boolean) => {
    try {
      return await apiService.updateAlertSetting(id, enabled);
    } catch (error) {
      console.error('Error updating alert setting:', error);
      throw error;
    }
  },
  
  // Watchlist API
  addTokenToWatchlist: async (symbol: string) => {
    try {
      return await apiService.addTokenToWatchlist(symbol);
    } catch (error) {
      console.error('Error adding token to watchlist:', error);
      throw error;
    }
  },
  
  addWhaleToWatchlist: async (address: string) => {
    try {
      return await apiService.addWhaleToWatchlist(address);
    } catch (error) {
      console.error('Error adding whale to watchlist:', error);
      throw error;
    }
  }
};

// Export all API-related modules
export * from './client';
export { default as apiClient } from './client';

// Endpoints for different API resources
export const endpoints = {
  whales: {
    list: '/whales',
    get: (address: string) => `/whales/${address}`,
    track: '/whales/track',
    untrack: (address: string) => `/whales/${address}/untrack`,
  },
  alerts: {
    list: '/alerts',
    get: (id: string) => `/alerts/${id}`,
    create: '/alerts',
    markAsRead: (id: string) => `/alerts/${id}/read`,
    markAllAsRead: '/alerts/read-all',
    delete: (id: string) => `/alerts/${id}`,
  },
  market: {
    overview: '/market/overview',
    token: (symbol: string) => `/market/tokens/${symbol}`,
    trending: '/market/trending',
    volume: '/market/volume',
  },
  user: {
    profile: '/user/profile',
    preferences: '/user/preferences',
    watchlist: '/user/watchlist',
  },
}; 