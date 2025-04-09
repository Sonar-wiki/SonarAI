import { Connection, PublicKey, ParsedTransactionWithMeta, ConfirmedSignatureInfo } from '@solana/web3.js';

// Default RPC endpoints
const MAINNET_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const FALLBACK_ENDPOINTS = [
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana'
];

export interface ConnectionConfig {
  endpoint?: string;
  fallbackEndpoints?: string[];
  commitment?: 'processed' | 'confirmed' | 'finalized';
  wsEndpoint?: string;
}

export class SolanaConnectionManager {
  private connection: Connection;
  private fallbackConnections: Connection[] = [];
  private config: ConnectionConfig;
  private connectionFailures = 0;
  private maxRetries = 3;

  constructor(config: ConnectionConfig = {}) {
    this.config = {
      endpoint: config.endpoint || MAINNET_ENDPOINT,
      fallbackEndpoints: config.fallbackEndpoints || FALLBACK_ENDPOINTS,
      commitment: config.commitment || 'confirmed',
      wsEndpoint: config.wsEndpoint
    };

    this.connection = new Connection(this.config.endpoint, {
      commitment: this.config.commitment,
      wsEndpoint: this.config.wsEndpoint
    });

    // Initialize fallback connections
    this.initializeFallbacks();
  }

  private initializeFallbacks() {
    if (this.config.fallbackEndpoints && this.config.fallbackEndpoints.length > 0) {
      this.fallbackConnections = this.config.fallbackEndpoints.map(endpoint => 
        new Connection(endpoint, {
          commitment: this.config.commitment,
          wsEndpoint: this.config.wsEndpoint
        })
      );
    }
  }

  private async withRetry<T>(operation: (connection: Connection) => Promise<T>): Promise<T> {
    try {
      return await operation(this.connection);
    } catch (error) {
      this.connectionFailures++;
      
      if (this.connectionFailures > this.maxRetries || this.fallbackConnections.length === 0) {
        throw error;
      }
      
      // Try with fallback connections
      for (const fallbackConnection of this.fallbackConnections) {
        try {
          const result = await operation(fallbackConnection);
          // If successful, make this the primary connection
          this.connection = fallbackConnection;
          this.connectionFailures = 0;
          return result;
        } catch (fallbackError) {
          // Continue to next fallback
          console.error('Fallback connection failed:', fallbackError);
        }
      }
      
      // If we get here, all fallbacks failed
      throw new Error('All Solana RPC connections failed');
    }
  }

  /**
   * Get information about a wallet address
   */
  async getAccountInfo(address: string) {
    const publicKey = new PublicKey(address);
    return this.withRetry(connection => connection.getAccountInfo(publicKey));
  }

  /**
   * Get SOL balance for a wallet
   */
  async getBalance(address: string): Promise<number> {
    const publicKey = new PublicKey(address);
    const balance = await this.withRetry(connection => connection.getBalance(publicKey));
    return balance / 10 ** 9; // Convert lamports to SOL
  }

  /**
   * Get recent transactions for a wallet
   */
  async getTransactions(address: string, limit = 10): Promise<ParsedTransactionWithMeta[]> {
    const publicKey = new PublicKey(address);
    
    // Get transaction signatures
    const signatures = await this.withRetry(connection => 
      connection.getSignaturesForAddress(publicKey, { limit })
    );
    
    // Get transaction details
    const transactions = await Promise.all(
      signatures.map(sig => 
        this.withRetry(connection => 
          connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
        )
      )
    );
    
    return transactions.filter(tx => tx !== null) as ParsedTransactionWithMeta[];
  }

  /**
   * Track live transactions for a wallet
   */
  subscribeToAddress(address: string, callback: (transaction: ParsedTransactionWithMeta) => void) {
    const publicKey = new PublicKey(address);
    
    // Subscribe to account changes
    const subscriptionId = this.connection.onAccountChange(
      publicKey,
      async () => {
        // When account changes, fetch the latest transaction
        const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit: 1 });
        if (signatures.length > 0) {
          const transaction = await this.connection.getParsedTransaction(
            signatures[0].signature,
            { maxSupportedTransactionVersion: 0 }
          );
          if (transaction) {
            callback(transaction);
          }
        }
      },
      this.config.commitment
    );
    
    return {
      unsubscribe: () => {
        this.connection.removeAccountChangeListener(subscriptionId);
      }
    };
  }

  /**
   * Subscribe to program (smart contract) transactions
   */
  subscribeToProgramTransactions(programId: string, callback: (transaction: ParsedTransactionWithMeta) => void) {
    const publicKey = new PublicKey(programId);
    
    const subscriptionId = this.connection.onProgramAccountChange(
      publicKey,
      async (accountInfo) => {
        // When program accounts change, get related transactions
        const signatures = await this.connection.getSignaturesForAddress(accountInfo.accountId);
        if (signatures.length > 0) {
          const transaction = await this.connection.getParsedTransaction(
            signatures[0].signature,
            { maxSupportedTransactionVersion: 0 }
          );
          if (transaction) {
            callback(transaction);
          }
        }
      },
      this.config.commitment
    );
    
    return {
      unsubscribe: () => {
        this.connection.removeProgramAccountChangeListener(subscriptionId);
      }
    };
  }

  /**
   * Monitor recent transactions from any wallet to detect large movements
   */
  async monitorLargeTransactions(
    thresholdSol: number,
    callback: (transaction: ParsedTransactionWithMeta, signature: ConfirmedSignatureInfo) => void
  ) {
    // Subscribe to all confirmed transactions
    const subscriptionId = this.connection.onLogs(
      'all',
      async (logs) => {
        try {
          const signature = logs.signature;
          const transaction = await this.connection.getParsedTransaction(
            signature,
            { maxSupportedTransactionVersion: 0 }
          );
          
          if (transaction && transaction.meta) {
            // Check if the transaction amount exceeds threshold
            const postBalances = transaction.meta.postBalances || [];
            const preBalances = transaction.meta.preBalances || [];
            
            // Calculate the largest balance change
            let largestChange = 0;
            for (let i = 0; i < postBalances.length; i++) {
              const change = Math.abs(postBalances[i] - preBalances[i]) / 10 ** 9; // Convert to SOL
              if (change > largestChange) {
                largestChange = change;
              }
            }
            
            if (largestChange >= thresholdSol) {
              callback(transaction, {
                signature,
                slot: logs.slot,
                err: null,
                memo: null,
                blockTime: null
              });
            }
          }
        } catch (error) {
          console.error('Error processing transaction:', error);
        }
      },
      this.config.commitment
    );
    
    return {
      unsubscribe: () => {
        this.connection.removeOnLogsListener(subscriptionId);
      }
    };
  }
}

// Create and export a default instance
export const solanaConnection = new SolanaConnectionManager();

export default solanaConnection; 