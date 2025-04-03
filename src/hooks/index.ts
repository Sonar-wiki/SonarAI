// Export all hooks from this file
export { default as useWallet } from './useWallet';
export * from './useWallet';

export { default as useAlerts } from './useAlerts';
export * from './useAlerts';

export { default as useWhaleTracking } from './useWhaleTracking';
export * from './useWhaleTracking';

// Re-export hooks from utils (for compatibility with existing code)
export * from '../utils/hooks'; 