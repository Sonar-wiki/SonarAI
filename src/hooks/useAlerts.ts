import { useState, useEffect, useCallback } from 'react';

export interface Alert {
  id: string;
  type: 'whale' | 'price' | 'volume' | 'custom';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  severity: 'low' | 'medium' | 'high';
  data?: Record<string, any>;
}

export interface AlertFilter {
  type?: Alert['type'][];
  severity?: Alert['severity'][];
  read?: boolean;
  fromDate?: number;
  toDate?: number;
}

interface UseAlertsReturn {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteAlert: (id: string) => void;
  filterAlerts: (filters: AlertFilter) => void;
  refreshAlerts: () => Promise<void>;
  createCustomAlert: (options: Omit<Alert, 'id' | 'timestamp' | 'read'>) => Promise<void>;
}

// Mock data for development
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'whale',
    title: 'Large SOL Movement Detected',
    message: 'A whale wallet has moved 50,000 SOL to an exchange wallet.',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    read: false,
    severity: 'high',
    data: {
      fromAddress: '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL',
      toAddress: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
      amount: 50000,
      token: 'SOL'
    }
  },
  {
    id: '2',
    type: 'price',
    title: 'Price Alert: SOL',
    message: 'SOL price increased by 5% in the last hour.',
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    read: true,
    severity: 'medium',
    data: {
      token: 'SOL',
      changePercent: 5,
      currentPrice: 150.25
    }
  },
  {
    id: '3',
    type: 'volume',
    title: 'Volume Spike: BONK',
    message: 'Trading volume for BONK has increased by 300% in the last 24 hours.',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    read: false,
    severity: 'low',
    data: {
      token: 'BONK',
      volumeChange: 300,
      volume24h: '1,500,000 USD'
    }
  }
];

export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<AlertFilter>({});

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In production, this would be a real API call
      setAlerts(MOCK_ALERTS);
      setFilteredAlerts(MOCK_ALERTS);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    let result = [...alerts];

    if (filters.type && filters.type.length > 0) {
      result = result.filter(alert => filters.type?.includes(alert.type));
    }

    if (filters.severity && filters.severity.length > 0) {
      result = result.filter(alert => filters.severity?.includes(alert.severity));
    }

    if (filters.read !== undefined) {
      result = result.filter(alert => alert.read === filters.read);
    }

    if (filters.fromDate) {
      result = result.filter(alert => alert.timestamp >= (filters.fromDate || 0));
    }

    if (filters.toDate) {
      result = result.filter(alert => alert.timestamp <= (filters.toDate || Infinity));
    }

    setFilteredAlerts(result);
  }, [alerts, filters]);

  const markAsRead = useCallback((id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, read: true }))
    );
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const filterAlerts = useCallback((newFilters: AlertFilter) => {
    setFilters(newFilters);
  }, []);

  const refreshAlerts = useCallback(async () => {
    await fetchAlerts();
  }, [fetchAlerts]);

  const createCustomAlert = useCallback(async (options: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...options,
      id: `custom-${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return {
    alerts: filteredAlerts,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    filterAlerts,
    refreshAlerts,
    createCustomAlert,
  };
}

export default useAlerts; 