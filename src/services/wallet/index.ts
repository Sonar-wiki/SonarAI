import { connectWallet, disconnectWallet, getWalletInfo } from './mockWalletService';
import type { WalletInfo, ConnectWalletResult } from './types';

// Re-export wallet service
export {
  connectWallet,
  disconnectWallet,
  getWalletInfo
};

export type {
  WalletInfo,
  ConnectWalletResult
}; 