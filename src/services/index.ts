// Export API services
export * from './api';

// Export wallet services
export * from './wallet/adapter';
export { default as walletAdapter } from './wallet/adapter';

// Export service interfaces and types
export interface ServiceInitOptions {
  apiBaseUrl?: string;
  enableMockData?: boolean;
  debugMode?: boolean;
}

// Initialize all services
export function initializeServices(options: ServiceInitOptions = {}): void {
  // Here we would initialize various services with provided options
  console.log('Initializing services with options:', options);
  
  // Example: Set up API base URL
  if (options.apiBaseUrl) {
    // In a real implementation, we would configure the API client here
    console.log(`Setting API base URL to ${options.apiBaseUrl}`);
  }
  
  // Example: Configure mock data
  if (options.enableMockData) {
    console.log('Mock data enabled for development');
  }
  
  // Example: Set debug mode
  if (options.debugMode) {
    console.log('Debug mode enabled');
  }
} 