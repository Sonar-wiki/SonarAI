import { 
  WhaleData, 
  Alert, 
  TokenData, 
  WatchedToken, 
  WatchedWhale, 
  AlertSetting, 
  PersonalAlert 
} from './types';

// Mock Whale Data
export const mockWhaleData: WhaleData[] = [
  {
    id: 1,
    address: '5XmXfYgbYrfZdwVFE6TYJcLSKEiqWNRrx9S6onie4XDV',
    shortAddress: '5XmX...4XDV',
    activity: 'Accumulating',
    token: 'SOL',
    amount: 25000,
    time: '10 mins ago',
    trend: 'increasing'
  },
  {
    id: 2,
    address: '8GamvS6khiZHdaZfJVJmNbFnJSVd5HKP4pT7tYoscQzW',
    shortAddress: '8Gam...cQzW',
    activity: 'Selling',
    token: 'BONK',
    amount: 15000000,
    time: '25 mins ago',
    trend: 'decreasing'
  },
  {
    id: 3,
    address: '9r4VDTsL8MRc6Lzs1D7MRwb4GEJTugNzKXRccTchhxwP',
    shortAddress: '9r4V...hxwP',
    activity: 'Moving',
    token: 'JUP',
    amount: 75000,
    time: '40 mins ago',
    trend: 'neutral'
  },
  {
    id: 4,
    address: '2YmM7qrZpTgFGBUwQmmyLycGcmKpXSxtYDZXJDYJUgvq',
    shortAddress: '2YmM...Ugvq',
    activity: 'Accumulating',
    token: 'RNDR',
    amount: 12500,
    time: '1 hour ago',
    trend: 'increasing'
  },
  {
    id: 5,
    address: 'HN4VxoLQ1se8GVDjmSeF66LcNafJsYYNgmWHzYmGbNjS',
    shortAddress: 'HN4V...bNjS',
    activity: 'Holding',
    token: 'PYTH',
    amount: 50000,
    time: '2 hours ago',
    trend: 'neutral'
  }
];

// Mock Alert Data
export const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'whale-movement',
    severity: 'high',
    title: 'Large SOL Accumulation',
    description: '3 whales accumulated 150,000 SOL in the last hour',
    time: '5 mins ago',
    token: 'SOL'
  },
  {
    id: 2,
    type: 'market-trend',
    severity: 'medium',
    title: 'BONK Selling Pressure',
    description: 'Multiple whales selling BONK, ~50B tokens moved',
    time: '15 mins ago',
    token: 'BONK'
  },
  {
    id: 3,
    type: 'whale-movement',
    severity: 'medium',
    title: 'JUP Token Movement',
    description: 'Whale moved 500,000 JUP from CEX to wallet',
    time: '30 mins ago',
    token: 'JUP'
  },
  {
    id: 4,
    type: 'market-anomaly',
    severity: 'low',
    title: 'Unusual Trading Volume',
    description: 'RNDR trading volume 3x above daily average',
    time: '45 mins ago',
    token: 'RNDR'
  }
];

// Mock Token Data
export const mockTokenData: TokenData[] = [
  {
    id: 1,
    name: 'Solana',
    symbol: 'SOL',
    whaleInterest: 'High',
    interestTrend: 'increasing',
    netWhalePosition: 'Accumulating',
    riskLevel: 'Low',
    priceChange24h: 3.8
  },
  {
    id: 2,
    name: 'Jupiter',
    symbol: 'JUP',
    whaleInterest: 'Medium',
    interestTrend: 'stable',
    netWhalePosition: 'Holding',
    riskLevel: 'Medium',
    priceChange24h: -1.2
  },
  {
    id: 3,
    name: 'Bonk',
    symbol: 'BONK',
    whaleInterest: 'Very High',
    interestTrend: 'increasing',
    netWhalePosition: 'Mixed',
    riskLevel: 'High',
    priceChange24h: 15.6
  },
  {
    id: 4,
    name: 'Render',
    symbol: 'RNDR',
    whaleInterest: 'Low',
    interestTrend: 'decreasing',
    netWhalePosition: 'Selling',
    riskLevel: 'Medium',
    priceChange24h: -5.4
  },
  {
    id: 5,
    name: 'Pyth Network',
    symbol: 'PYTH',
    whaleInterest: 'Medium',
    interestTrend: 'increasing',
    netWhalePosition: 'Accumulating',
    riskLevel: 'Medium',
    priceChange24h: 7.2
  }
];

// Mock Personal Dashboard Data
export const mockWatchedTokens: WatchedToken[] = [
  {
    id: 1,
    symbol: 'SOL',
    alertsToday: 3,
    priceChange24h: 3.8
  },
  {
    id: 2,
    symbol: 'BONK',
    alertsToday: 5,
    priceChange24h: 15.6
  },
  {
    id: 3,
    symbol: 'JUP',
    alertsToday: 1,
    priceChange24h: -1.2
  }
];

export const mockWatchedWhales: WatchedWhale[] = [
  {
    id: 1,
    address: '5XmXfYgbYrfZdwVFE6TYJcLSKEiqWNRrx9S6onie4XDV',
    shortAddress: '5XmX...4XDV',
    lastActive: '10m ago'
  },
  {
    id: 2,
    address: '8GamvS6khiZHdaZfJVJmNbFnJSVd5HKP4pT7tYoscQzW',
    shortAddress: '8Gam...cQzW',
    lastActive: '25m ago'
  },
  {
    id: 3,
    address: '9r4VDTsL8MRc6Lzs1D7MRwb4GEJTugNzKXRccTchhxwP',
    shortAddress: '9r4V...hxwP',
    lastActive: '40m ago'
  }
];

export const mockAlertSettings: AlertSetting[] = [
  {
    id: 1,
    name: 'Large Transactions',
    enabled: true
  },
  {
    id: 2,
    name: 'Whale Movements',
    enabled: true
  },
  {
    id: 3,
    name: 'Market Anomalies',
    enabled: false
  }
];

export const mockPersonalAlerts: PersonalAlert[] = [
  {
    id: 1,
    title: 'SOL Accumulation by Watched Whale',
    description: '5XmX...4XDV accumulated 15,000 SOL',
    time: '15 mins ago',
    severity: 'high'
  },
  {
    id: 2,
    title: 'BONK Price Deviation Alert',
    description: 'Price increased by 10% in the last hour',
    time: '35 mins ago',
    severity: 'medium'
  },
  {
    id: 3,
    title: 'JUP Token Movement Alert',
    description: 'Large JUP transfer from CEX detected',
    time: '1 hour ago',
    severity: 'low'
  }
]; 