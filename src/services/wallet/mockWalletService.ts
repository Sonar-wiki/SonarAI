import { WalletInfo, WalletService, ConnectWalletResult } from './types';

// Mock wallet data for development
const MOCK_WALLET_INFO: WalletInfo = {
  address: '5XmXfYgbYrfZdwVFE6TYJcLSKEiqWNRrx9S6onie4XDV',
  balance: 25.75,
  isConnected: false
};

// Mock delay for wallet operations
const WALLET_DELAY = 800;

// Mock wallet service implementation
class MockWalletService implements WalletService {
  private walletInfo: WalletInfo = { ...MOCK_WALLET_INFO };

  async connect(): Promise<WalletInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.walletInfo = {
          ...this.walletInfo,
          isConnected: true
        };
        resolve(this.walletInfo);
      }, WALLET_DELAY);
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.walletInfo = {
          ...this.walletInfo,
          isConnected: false
        };
        resolve();
      }, WALLET_DELAY);
    });
  }

  async getBalance(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.walletInfo.balance);
      }, WALLET_DELAY);
    });
  }

  getAddress(): string | null {
    return this.walletInfo.isConnected ? this.walletInfo.address : null;
  }

  isConnected(): boolean {
    return this.walletInfo.isConnected;
  }
}

// Wrapper for wallet operations with error handling
export const mockWalletService = new MockWalletService();

export const connectWallet = async (): Promise<ConnectWalletResult> => {
  try {
    const walletInfo = await mockWalletService.connect();
    return {
      success: true,
      data: walletInfo
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return {
      success: false,
      error: 'Failed to connect wallet. Please try again.'
    };
  }
};

export const disconnectWallet = async (): Promise<boolean> => {
  try {
    await mockWalletService.disconnect();
    return true;
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    return false;
  }
};

export const getWalletInfo = (): WalletInfo => {
  return {
    address: mockWalletService.getAddress() || '',
    balance: 0, // Requires async call to getBalance()
    isConnected: mockWalletService.isConnected()
  };
}; 