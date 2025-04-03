/**
 * Wallet Adapter Service
 * 
 * This service provides methods to interact with Solana wallets
 * through wallet adapters. In a production environment, this would use
 * Solana wallet-adapter libraries.
 */

import { EventEmitter } from 'events';

export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  signTransaction(transaction: any): Promise<any>;
  publicKey: string | null;
  isConnected: boolean;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

// Simplified mock implementation
class MockWalletAdapter extends EventEmitter implements WalletAdapter {
  private _publicKey: string | null = null;
  private _isConnected: boolean = false;

  constructor() {
    super();
  }

  get publicKey(): string | null {
    return this._publicKey;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  async connect(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this._publicKey = '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL';
    this._isConnected = true;
    
    this.emit('connect', this._publicKey);
  }

  async disconnect(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this._publicKey = null;
    this._isConnected = false;
    
    this.emit('disconnect');
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this._isConnected) {
      throw new Error('Wallet not connected');
    }
    
    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new mock signature without attempting to iterate through the input message
    const signature = new Uint8Array(64);
    for (let i = 0; i < signature.length; i++) {
      signature[i] = Math.floor(Math.random() * 256);
    }
    
    // Concatenate the original message and our signature
    const result = new Uint8Array(message.length + signature.length);
    result.set(message, 0);
    result.set(signature, message.length);
    
    return result;
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this._isConnected) {
      throw new Error('Wallet not connected');
    }
    
    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Create a mock signature
    const signature = new Array(64).fill(0).map(() => Math.floor(Math.random() * 256));
    
    // In a real implementation, this would sign the transaction with the wallet's private key
    return {
      ...transaction,
      signatures: [{
        signature,
        publicKey: this._publicKey
      }]
    };
  }
}

// Factory function to create wallet adapters
export const createWalletAdapter = (): WalletAdapter => {
  // In a real app, we would detect available wallet providers and return an appropriate adapter
  return new MockWalletAdapter();
};

// Singleton instance for use throughout the app
export const walletAdapter = createWalletAdapter();

export default walletAdapter; 