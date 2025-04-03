// Whale data types
export interface WhaleData {
  id: number;
  address: string;
  shortAddress: string;
  activity: 'Accumulating' | 'Selling' | 'Moving' | 'Holding';
  token: string;
  amount: number;
  time: string;
  trend: 'increasing' | 'decreasing' | 'neutral';
}

// Alert types
export interface Alert {
  id: number;
  type: 'whale-movement' | 'market-trend' | 'market-anomaly';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  token: string;
}

// Market intelligence types
export interface TokenData {
  id: number;
  name: string;
  symbol: string;
  whaleInterest: 'Very High' | 'High' | 'Medium' | 'Low';
  interestTrend: 'increasing' | 'decreasing' | 'stable';
  netWhalePosition: 'Accumulating' | 'Selling' | 'Holding' | 'Mixed';
  riskLevel: 'High' | 'Medium' | 'Low';
  priceChange24h: number;
}

// Personal dashboard types
export interface WatchedToken {
  id: number;
  symbol: string;
  alertsToday: number;
  priceChange24h: number;
}

export interface WatchedWhale {
  id: number;
  address: string;
  shortAddress: string;
  lastActive: string;
}

export interface AlertSetting {
  id: number;
  name: string;
  enabled: boolean;
}

export interface PersonalAlert {
  id: number;
  title: string;
  description: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
} 