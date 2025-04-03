/**
 * API Client Service
 * 
 * This service provides methods to interact with the backend API.
 * In a production environment, this would use a real API client library like axios.
 */

// API Response type for consistent error handling
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// HTTP methods supported by our API
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Options for API requests
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  withCredentials?: boolean;
  signal?: AbortSignal;
}

// Base API client class
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Set authorization token
  setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Generic request method
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const method = options.method || 'GET';
      
      // In a real implementation, this would use fetch() or axios
      // Simulate API call with mock data for development
      console.log(`Making ${method} request to ${url}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful response
      return {
        data: this.getMockData<T>(endpoint, method),
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Helper methods for common HTTP verbs
  async get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Helper method to get mock data for development
  private getMockData<T>(endpoint: string, method: HttpMethod): T | null {
    // This would be replaced with actual API calls in production
    if (endpoint === '/whales' && method === 'GET') {
      return {
        whales: [
          {
            address: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
            nickname: 'Binance Hot Wallet',
            balance: 2500000,
            isExchange: true
          },
          {
            address: '7bnKLhRCLZQCrLMRk6x3usiD8KspU3xRt6MxvJVzzKWL',
            nickname: 'Mega Whale',
            balance: 850000,
            isExchange: false
          }
        ]
      } as unknown as T;
    }
    
    if (endpoint === '/alerts' && method === 'GET') {
      return {
        alerts: [
          {
            id: '1',
            type: 'whale',
            title: 'Large SOL Movement Detected',
            message: 'A whale wallet has moved 50,000 SOL to an exchange wallet.',
            timestamp: Date.now() - 1000 * 60 * 30,
            read: false
          }
        ]
      } as unknown as T;
    }
    
    // Default fallback
    return null;
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

export default apiClient; 