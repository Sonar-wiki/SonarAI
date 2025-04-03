import { useState, useEffect, useCallback } from 'react';

export interface WhaleWallet {
  address: string;
  nickname?: string;
  balance: number;
  tokenHoldings: TokenHolding[];
  activity: WalletActivity[];
  isExchange: boolean;
  tags: string[];
  riskScore: number;
}

export interface TokenHolding {
  tokenSymbol: string;
  tokenName: string;
  amount: number;
  valueUsd: number;
  percentOfSupply: number;
}

export interface WalletActivity {
  txHash: string;
  timestamp: number;
  type: 'send' | 'receive' | 'swap' | 'mint' | 'burn';
  tokenSymbol: string;
  amount: number;
  valueUsd: number;
  fromAddress?: string;
  toAddress?: string;
}

export interface UseWhaleTrackingOptions {
  minBalanceThreshold?: number;
  excludeExchanges?: boolean;
  includeTags?: string[];
  excludeTags?: string[];
  trackTokens?: string[];
}

interface UseWhaleTrackingReturn {
  whales: WhaleWallet[];
  topWhales: WhaleWallet[];
  loading: boolean;
  error: Error | null;
  trackWhale: (address: string, nickname?: string) => void;
  untrackWhale: (address: string) => void;
  refreshWhaleData: () => Promise<void>;
  getWhaleDetails: (address: string) => Promise<WhaleWallet | null>;
  filterWhales: (options: UseWhaleTrackingOptions) => void;
}

// Mock data for development
const MOCK_WHALES: WhaleWallet[] = [
  {
    address: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    nickname: 'Binance Hot Wallet',
    balance: 2500000,
    tokenHoldings: [
      {
        tokenSymbol: 'SOL',
        tokenName: 'Solana',
        amount: 2500000,
        valueUsd: 375000000,
        percentOfSupply: 0.62
      },
      {
        tokenSymbol: 'USDC',
        tokenName: 'USD Coin',
        amount: 125000000,
        valueUsd: 125000000,
        percentOfSupply: 0.12
      }
    ],
    activity: [
      {
        txHash: '4RPtEuThS32cEUGHbcgWXHbYGNUCN3z8jWwKxu6qWNrE',
        timestamp: Date.now() - 1000 * 60 * 5,
        type: 'receive',
        tokenSymbol: 'SOL',
        amount: 15000,
        valueUsd: 2250000,
        fromAddress: '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL'
      }
    ],
    isExchange: true,
    tags: ['exchange', 'binance', 'CEX'],
    riskScore: 30
  },
  {
    address: '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL',
    nickname: 'Mega Whale',
    balance: 850000,
    tokenHoldings: [
      {
        tokenSymbol: 'SOL',
        tokenName: 'Solana',
        amount: 850000,
        valueUsd: 127500000,
        percentOfSupply: 0.21
      },
      {
        tokenSymbol: 'JUP',
        tokenName: 'Jupiter',
        amount: 5000000,
        valueUsd: 5000000,
        percentOfSupply: 0.5
      }
    ],
    activity: [
      {
        txHash: '4RPtEuThS32cEUGHbcgWXHbYGNUCN3z8jWwKxu6qWNrE',
        timestamp: Date.now() - 1000 * 60 * 5,
        type: 'send',
        tokenSymbol: 'SOL',
        amount: 15000,
        valueUsd: 2250000,
        toAddress: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
      }
    ],
    isExchange: false,
    tags: ['individual', 'early investor'],
    riskScore: 65
  }
];

export function useWhaleTracking(initialOptions?: UseWhaleTrackingOptions): UseWhaleTrackingReturn {
  const [whales, setWhales] = useState<WhaleWallet[]>([]);
  const [filteredWhales, setFilteredWhales] = useState<WhaleWallet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [options, setOptions] = useState<UseWhaleTrackingOptions>(initialOptions || {});

  const fetchWhales = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be a real API call
      setWhales(MOCK_WHALES);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch whale data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWhales();
  }, [fetchWhales]);

  useEffect(() => {
    let result = [...whales];

    if (options.minBalanceThreshold) {
      result = result.filter(whale => whale.balance >= (options.minBalanceThreshold || 0));
    }

    if (options.excludeExchanges) {
      result = result.filter(whale => !whale.isExchange);
    }

    if (options.includeTags && options.includeTags.length > 0) {
      result = result.filter(whale => 
        whale.tags.some(tag => options.includeTags?.includes(tag))
      );
    }

    if (options.excludeTags && options.excludeTags.length > 0) {
      result = result.filter(whale => 
        !whale.tags.some(tag => options.excludeTags?.includes(tag))
      );
    }

    if (options.trackTokens && options.trackTokens.length > 0) {
      result = result.filter(whale => 
        whale.tokenHoldings.some(holding => 
          options.trackTokens?.includes(holding.tokenSymbol)
        )
      );
    }

    setFilteredWhales(result);
  }, [whales, options]);

  const trackWhale = useCallback((address: string, nickname?: string) => {
    // In a real app, this would call an API to track a new whale
    console.log(`Tracking whale ${address} with nickname ${nickname || 'None'}`);
  }, []);

  const untrackWhale = useCallback((address: string) => {
    // In a real app, this would call an API to untrack a whale
    console.log(`Untracking whale ${address}`);
  }, []);

  const refreshWhaleData = useCallback(async () => {
    await fetchWhales();
  }, [fetchWhales]);

  const getWhaleDetails = useCallback(async (address: string): Promise<WhaleWallet | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find whale in our mock data
    const whale = MOCK_WHALES.find(w => w.address === address) || null;
    return whale;
  }, []);

  const filterWhales = useCallback((newOptions: UseWhaleTrackingOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Get top 5 whales by balance
  const topWhales = [...filteredWhales]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  return {
    whales: filteredWhales,
    topWhales,
    loading,
    error,
    trackWhale,
    untrackWhale,
    refreshWhaleData,
    getWhaleDetails,
    filterWhales
  };
}

export default useWhaleTracking; 