export interface WalletInfo {
  address: string;
  balance: number;
  isConnected: boolean;
}

export interface WalletService {
  connect: () => Promise<WalletInfo>;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<number>;
  getAddress: () => string | null;
  isConnected: () => boolean;
}

// Simplify wallet connection results
export interface ConnectWalletResult {
  success: boolean;
  data?: WalletInfo;
  error?: string;
} 