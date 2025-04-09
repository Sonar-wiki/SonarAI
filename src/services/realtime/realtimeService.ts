import { EventEmitter } from 'events';
import { solanaConnection } from '../blockchain/solanaConnection';
import { Alert } from '../api/types';
import { WhaleWallet, WalletActivity } from '../../hooks/useWhaleTracking';
import { SolanaConnectionManager } from '../blockchain/solanaConnection';
import { marketAnalytics, WhalePattern, AnomalyDetection } from '../analytics/marketAnalytics';

// Event channels
const EVENT_CHANNELS = {
  WHALE_MOVEMENT: 'whale-movement',
  LARGE_TRANSACTION: 'large-transaction',
  MARKET_ANOMALY: 'market-anomaly',
  PRICE_ALERT: 'price-alert',
  WALLET_UPDATE: 'wallet-update'
};

// Types for the events
export interface WhaleMovementEvent {
  whale: WhaleWallet;
  activity: WalletActivity;
  timestamp: number;
}

export interface LargeTransactionEvent {
  transactionHash: string;
  amount: number;
  tokenSymbol: string;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
}

export interface MarketAnomalyEvent {
  id: string;
  type: string;
  description: string;
  severity: number;
  affectedTokens: string[];
  timestamp: number;
}

export interface PriceAlertEvent {
  tokenSymbol: string;
  price: number;
  changePercent: number;
  direction: 'up' | 'down';
  timestamp: number;
}

// Define event types for subscribers
export type RealtimeEventType = 
  | 'market:update' 
  | 'whale:transaction' 
  | 'whale:pattern' 
  | 'anomaly:detected'
  | 'token:price'
  | 'token:volume'
  | 'token:volatility';

// Define event data interface
export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  data: T;
  timestamp: number;
}

// Define subscriber callback
export type RealtimeSubscriber<T = any> = (event: RealtimeEvent<T>) => void;

export class RealtimeService extends EventEmitter {
  private static instance: RealtimeService;
  private subscribers: Map<string, Set<RealtimeSubscriber>> = new Map();
  private connection: SolanaConnectionManager;
  private isRunning: boolean = false;
  private simulationIntervalId: NodeJS.Timeout | null = null;
  private knownPatterns: Set<string> = new Set();
  private knownAnomalies: Set<string> = new Set();
  private whaleAddresses: Set<string> = new Set();
  private trackedTokens: Set<string> = new Set();
  private watchedWallets: Set<string> = new Set();
  private subscriptions: any[] = [];
  private pollingInterval: number | null = null;
  private threshold: number = 10000; // 10,000 SOL for whale transactions

  private constructor() {
    super();
    this.connection = new SolanaConnectionManager();
    
    // Initialize subscriber sets for different event types
    const eventTypes: RealtimeEventType[] = [
      'market:update', 
      'whale:transaction', 
      'whale:pattern', 
      'anomaly:detected',
      'token:price',
      'token:volume',
      'token:volatility'
    ];
    
    eventTypes.forEach(type => {
      this.subscribers.set(type, new Set());
    });

    // Add some default whale addresses
    this.whaleAddresses.add('5XmXfYgbYrfZdwVFE6TYJcLSKEiqWNRrx9S6onie4XDV');
    this.whaleAddresses.add('8GamvS6khiZHdaZfJVJmNbFnJSVd5HKP4pT7tYoscQzW');
    this.whaleAddresses.add('9r4VDTsL8MRc6Lzs1D7MRwb4GEJTugNzKXRccTchhxwP');

    // Add some default tokens to track
    this.trackedTokens.add('SOL');
    this.trackedTokens.add('BONK');
    this.trackedTokens.add('JUP');
  }

  /**
   * Get the singleton instance of RealtimeService
   */
  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  /**
   * Subscribe to a specific type of realtime event
   */
  public subscribe<T = any>(eventType: RealtimeEventType, callback: RealtimeSubscriber<T>): () => void {
    const subscribers = this.subscribers.get(eventType) || new Set();
    subscribers.add(callback as RealtimeSubscriber);
    this.subscribers.set(eventType, subscribers);
    
    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(eventType);
      if (subs) {
        subs.delete(callback as RealtimeSubscriber);
      }
    };
  }

  /**
   * Publish a realtime event to all subscribers
   */
  private publish<T = any>(eventType: RealtimeEventType, data: T): void {
    const subscribers = this.subscribers.get(eventType);
    if (!subscribers) return;
    
    const event: RealtimeEvent<T> = {
      type: eventType,
      data,
      timestamp: Date.now()
    };
    
    subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in realtime subscriber callback for ${eventType}:`, error);
      }
    });
  }

  /**
   * Start the realtime monitoring service
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Subscribe to blockchain events
    try {
      // Subscribe to large transactions (whale activity)
      this.connection.monitorLargeTransactions(10000, (transaction) => {
        this.publish('whale:transaction', transaction);
      });
      
      // In a real app, there would be more blockchain listeners here
      console.log('实时更新服务已启动');
      
      // Start simulation for development
      this.startSimulation();
    } catch (error) {
      console.error('启动实时服务失败:', error);
      this.isRunning = false;
    }
  }

  /**
   * Stop the realtime monitoring service
   */
  public stop(): void {
    if (!this.isRunning) return;
    
    // Stop simulation
    if (this.simulationIntervalId) {
      clearInterval(this.simulationIntervalId);
      this.simulationIntervalId = null;
    }
    
    // In a real app, unsubscribe from blockchain events here
    
    this.isRunning = false;
    console.log('实时更新服务已停止');
  }

  /**
   * Add a whale address to monitor
   */
  public addWhaleAddress(address: string): void {
    this.whaleAddresses.add(address);
    
    // If already running, subscribe to this new address
    if (this.isRunning) {
      const subscription = solanaConnection.subscribeToAddress(address, (tx) => {
        this.processWhaleTransaction(address, tx);
      });
      this.subscriptions.push(subscription);
    }
  }

  /**
   * Add a token to track
   */
  public addTrackedToken(tokenSymbol: string): void {
    this.trackedTokens.add(tokenSymbol);
  }

  /**
   * Add a wallet to the watch list
   */
  public addWatchedWallet(address: string): void {
    this.watchedWallets.add(address);
    
    // If already running, subscribe to this new wallet
    if (this.isRunning) {
      const subscription = solanaConnection.subscribeToAddress(address, (tx) => {
        this.processWalletUpdate(address, tx);
      });
      this.subscriptions.push(subscription);
    }
  }

  /**
   * Set the threshold for large transactions (in SOL)
   */
  public setLargeTransactionThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  /**
   * Subscribe to all whale wallet activity
   */
  private subscribeToWhaleWallets(): void {
    this.whaleAddresses.forEach(address => {
      const subscription = solanaConnection.subscribeToAddress(address, (tx) => {
        this.processWhaleTransaction(address, tx);
      });
      this.subscriptions.push(subscription);
    });
  }

  /**
   * Monitor for large transactions across the network
   */
  private monitorLargeTransactions(): void {
    const subscription = solanaConnection.monitorLargeTransactions(this.threshold, (tx, signature) => {
      this.processLargeTransaction(tx, signature);
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Start polling for market data updates
   */
  private startMarketDataPolling(): void {
    // Poll every 30 seconds
    const POLLING_INTERVAL = 30 * 1000;
    
    this.pollingInterval = window.setInterval(() => {
      this.pollMarketData();
      this.checkForAnomalies();
    }, POLLING_INTERVAL);
  }

  /**
   * Process a transaction from a whale wallet
   */
  private processWhaleTransaction(address: string, tx: any): void {
    // In a real implementation, this would parse the transaction
    // and extract relevant information about tokens, amounts, etc.
    
    // For now, we'll emit a mock event
    const mockEvent: WhaleMovementEvent = {
      whale: {
        address,
        nickname: address === '5XmXfYgbYrfZdwVFE6TYJcLSKEiqWNRrx9S6onie4XDV' ? 'Mega Whale' : undefined,
        balance: 500000,
        tokenHoldings: [
          {
            tokenSymbol: 'SOL',
            tokenName: 'Solana',
            amount: 500000,
            valueUsd: 75000000,
            percentOfSupply: 0.125
          }
        ],
        activity: [],
        isExchange: false,
        tags: ['whale'],
        riskScore: 65
      },
      activity: {
        txHash: tx.transaction?.signatures?.[0] || 'mock-hash',
        timestamp: Date.now(),
        type: Math.random() > 0.5 ? 'send' : 'receive',
        tokenSymbol: 'SOL',
        amount: 10000 + Math.random() * 50000,
        valueUsd: 1500000,
        fromAddress: '5XmXfYgbYrfZdwVFE6TYJcLSKEiqWNRrx9S6onie4XDV',
        toAddress: '8GamvS6khiZHdaZfJVJmNbFnJSVd5HKP4pT7tYoscQzW'
      },
      timestamp: Date.now()
    };
    
    this.emit(EVENT_CHANNELS.WHALE_MOVEMENT, mockEvent);
    
    // Generate an alert for significant movements
    if (mockEvent.activity.amount > 25000) {
      const alert: Alert = {
        id: Date.now(),
        type: 'whale-movement',
        severity: 'high',
        title: `Large ${mockEvent.activity.tokenSymbol} Movement`,
        description: `Whale ${address.substring(0, 4)}...${address.substring(address.length - 4)} moved ${mockEvent.activity.amount.toLocaleString()} ${mockEvent.activity.tokenSymbol}`,
        time: 'just now',
        token: mockEvent.activity.tokenSymbol
      };
      
      this.emit('alert', alert);
    }
  }

  /**
   * Process a large transaction
   */
  private processLargeTransaction(tx: any, signature: any): void {
    // In a real implementation, this would analyze the transaction details
    
    // For now, we'll emit a mock event
    const mockEvent: LargeTransactionEvent = {
      transactionHash: signature.signature,
      amount: this.threshold + Math.random() * 5000,
      tokenSymbol: 'SOL',
      fromAddress: tx.transaction?.message?.accountKeys?.[0]?.pubkey?.toString() || 'unknown',
      toAddress: tx.transaction?.message?.accountKeys?.[1]?.pubkey?.toString() || 'unknown',
      timestamp: Date.now()
    };
    
    this.emit(EVENT_CHANNELS.LARGE_TRANSACTION, mockEvent);
    
    // Generate an alert
    const alert: Alert = {
      id: Date.now(),
      type: 'whale-movement',
      severity: 'medium',
      title: `Large Transaction Detected`,
      description: `${mockEvent.amount.toLocaleString()} ${mockEvent.tokenSymbol} moved between wallets`,
      time: 'just now',
      token: mockEvent.tokenSymbol
    };
    
    this.emit('alert', alert);
  }

  /**
   * Process an update from a watched wallet
   */
  private processWalletUpdate(address: string, tx: any): void {
    this.emit(EVENT_CHANNELS.WALLET_UPDATE, {
      address,
      transaction: tx,
      timestamp: Date.now()
    });
  }

  /**
   * Poll for market data updates
   */
  private pollMarketData(): void {
    // In a real implementation, this would fetch current market data
    // from exchanges or price oracles
    
    this.trackedTokens.forEach(token => {
      // Generate mock price changes
      const changePercent = -5 + Math.random() * 10; // -5% to +5%
      const direction = changePercent >= 0 ? 'up' : 'down';
      const price = token === 'SOL' ? 150 + changePercent * 3 : 
                    token === 'BONK' ? 0.00002 + changePercent * 0.000001 : 
                    token === 'JUP' ? 1.2 + changePercent * 0.06 : 
                    10 + changePercent * 0.5;
      
      // Only emit events for significant changes
      if (Math.abs(changePercent) > 3) {
        const event: PriceAlertEvent = {
          tokenSymbol: token,
          price,
          changePercent: Math.abs(changePercent),
          direction,
          timestamp: Date.now()
        };
        
        this.emit(EVENT_CHANNELS.PRICE_ALERT, event);
        
        // Generate an alert for significant price movements
        const alert: Alert = {
          id: Date.now(),
          type: 'market-trend',
          severity: Math.abs(changePercent) > 4 ? 'high' : 'medium',
          title: `${token} Price ${direction === 'up' ? 'Surge' : 'Drop'}`,
          description: `${token} price ${direction === 'up' ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(1)}% in the last interval`,
          time: 'just now',
          token
        };
        
        this.emit('alert', alert);
      }
    });
  }

  /**
   * Check for market anomalies
   */
  private checkForAnomalies(): void {
    // In a real implementation, this would use statistical models
    // to detect unusual market behavior
    
    // Simulate random anomalies (about 10% chance per check)
    if (Math.random() < 0.1) {
      const tokens = Array.from(this.trackedTokens);
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      
      // Types of anomalies we can detect
      const anomalyTypes = [
        'Unusual trading volume',
        'Abnormal price volatility',
        'Whale concentration increasing',
        'Exchange outflow spike'
      ];
      
      const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
      
      const event: MarketAnomalyEvent = {
        id: `anomaly-${Date.now()}`,
        type: 'market-anomaly',
        description: `${anomalyType} detected for ${token}`,
        severity: 50 + Math.floor(Math.random() * 50),
        affectedTokens: [token],
        timestamp: Date.now()
      };
      
      this.emit(EVENT_CHANNELS.MARKET_ANOMALY, event);
      
      // Generate an alert
      const alert: Alert = {
        id: Date.now(),
        type: 'market-anomaly',
        severity: event.severity > 75 ? 'high' : event.severity > 60 ? 'medium' : 'low',
        title: `Anomaly Detected: ${token}`,
        description: event.description,
        time: 'just now',
        token
      };
      
      this.emit('alert', alert);
    }
  }

  /**
   * 仅供开发: 模拟实时事件
   */
  private startSimulation(): void {
    // Check for whale patterns and anomalies every 30 seconds
    this.simulationIntervalId = setInterval(() => {
      // Detect whale patterns
      const patterns = marketAnalytics.detectWhalePatterns();
      patterns.forEach(pattern => {
        // Only publish new patterns
        if (!this.knownPatterns.has(pattern.id)) {
          this.knownPatterns.add(pattern.id);
          this.publish('whale:pattern', pattern);
        }
      });
      
      // Detect market anomalies
      const anomalies = marketAnalytics.detectAnomalies();
      anomalies.forEach(anomaly => {
        // Only publish new anomalies
        if (!this.knownAnomalies.has(anomaly.id)) {
          this.knownAnomalies.add(anomaly.id);
          this.publish('anomaly:detected', anomaly);
        }
      });
      
      // Simulate price updates
      this.simulatePriceUpdates();
      
    }, 30000); // 30 seconds
    
    // Simulate market updates more frequently
    setInterval(() => {
      this.simulateMarketUpdates();
    }, 5000); // 5 seconds
  }
  
  /**
   * 模拟市场更新
   */
  private simulateMarketUpdates(): void {
    const tokens = ['SOL', 'BONK', 'JUP', 'RNDR', 'PYTH'];
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    
    // Publish market update
    this.publish('market:update', {
      token: randomToken,
      price: this.getRandomPrice(randomToken),
      volume: this.getRandomVolume(randomToken),
      timestamp: Date.now()
    });
    
    // Occasionally publish volume spikes
    if (Math.random() > 0.8) {
      this.publish('token:volume', {
        token: randomToken,
        volume: this.getRandomVolume(randomToken) * (Math.random() * 3 + 2), // 2-5x normal volume
        percentChange: Math.round(Math.random() * 150) + 50, // 50-200% increase
        timeframe: '5m'
      });
    }
  }
  
  /**
   * 模拟价格更新
   */
  private simulatePriceUpdates(): void {
    const tokens = ['SOL', 'BONK', 'JUP', 'RNDR', 'PYTH'];
    
    tokens.forEach(token => {
      const basePrice = this.getBasePrice(token);
      const priceChange = (Math.random() * 0.1 - 0.05) * basePrice; // -5% to +5%
      const newPrice = basePrice + priceChange;
      
      // Publish price update
      this.publish('token:price', {
        token,
        price: newPrice,
        percentChange: (priceChange / basePrice) * 100,
        timeframe: '1m'
      });
      
      // Occasionally publish volatility updates
      if (Math.random() > 0.7) {
        this.publish('token:volatility', {
          token,
          volatility: Math.random() * 30 + 10, // 10-40%
          change: Math.random() > 0.5 ? 'increasing' : 'decreasing',
          timeframe: '15m'
        });
      }
    });
  }
  
  /**
   * 获取基础价格 (模拟)
   */
  private getBasePrice(token: string): number {
    switch (token) {
      case 'SOL':
        return 100 + Math.random() * 20;
      case 'BONK':
        return 0.00002 + Math.random() * 0.000005;
      case 'JUP':
        return 0.65 + Math.random() * 0.1;
      case 'RNDR':
        return 4.5 + Math.random() * 0.5;
      case 'PYTH':
        return 0.4 + Math.random() * 0.05;
      default:
        return 1.0 + Math.random() * 0.2;
    }
  }
  
  /**
   * 获取随机价格 (模拟)
   */
  private getRandomPrice(token: string): number {
    const basePrice = this.getBasePrice(token);
    return basePrice * (1 + (Math.random() * 0.02 - 0.01)); // ±1%
  }
  
  /**
   * 获取随机交易量 (模拟)
   */
  private getRandomVolume(token: string): number {
    switch (token) {
      case 'SOL':
        return Math.round(500000 + Math.random() * 500000);
      case 'BONK':
        return Math.round(50000000000 + Math.random() * 20000000000);
      case 'JUP':
        return Math.round(2000000 + Math.random() * 1000000);
      case 'RNDR':
        return Math.round(1000000 + Math.random() * 500000);
      case 'PYTH':
        return Math.round(3000000 + Math.random() * 1500000);
      default:
        return Math.round(100000 + Math.random() * 100000);
    }
  }
}

// Export default instance
export const realtimeService = RealtimeService.getInstance();
export default realtimeService; 