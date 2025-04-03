import { useState, useEffect, useCallback } from 'react';

type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WalletState {
  status: WalletStatus;
  address: string | null;
  balance: number | null;
  error: Error | null;
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    status: 'disconnected',
    address: null,
    balance: null,
    error: null,
  });

  const checkWalletConnection = useCallback(async () => {
    try {
      // This would be replaced with actual wallet provider code
      const isConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (isConnected) {
        // Mock data for development
        const mockAddress = localStorage.getItem('walletAddress') || '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL';
        const mockBalance = parseFloat(localStorage.getItem('walletBalance') || '10.5');
        
        setState({
          status: 'connected',
          address: mockAddress,
          balance: mockBalance,
          error: null,
        });
      }
    } catch (error) {
      console.error('Wallet connection check failed:', error);
    }
  }, []);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, status: 'connecting' }));
      
      // Simulating wallet connection
      // In production, this would connect to a real wallet provider
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL';
      const mockBalance = 10.5;
      
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', mockAddress);
      localStorage.setItem('walletBalance', mockBalance.toString());
      
      setState({
        status: 'connected',
        address: mockAddress,
        balance: mockBalance,
        error: null,
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setState({
        status: 'error',
        address: null,
        balance: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletBalance');
    
    setState({
      status: 'disconnected',
      address: null,
      balance: null,
      error: null,
    });
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (state.status !== 'connected') {
      setState(prev => ({
        ...prev, 
        error: new Error('Wallet not connected')
      }));
      return null;
    }
    
    try {
      // Simulate message signing
      // In production, this would use the wallet's signing method
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a mock signature
      return `signed:${message}:${state.address}:${Date.now()}`;
    } catch (error) {
      console.error('Message signing failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Signing failed'),
      }));
      return null;
    }
  }, [state.status, state.address]);

  return {
    ...state,
    connect,
    disconnect,
    signMessage,
  };
}

export default useWallet; 