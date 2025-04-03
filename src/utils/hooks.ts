import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for implementing debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook for handling local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback((value: T) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key "${key}" even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Save state
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}

/**
 * Hook for implementing polling functionality
 */
export function usePolling(callback: () => void, interval: number, immediate = true): [boolean, () => void, () => void] {
  const [isPolling, setIsPolling] = useState<boolean>(immediate);
  
  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);
  
  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);
  
  useEffect(() => {
    if (!isPolling) return;
    
    // Execute immediately if requested
    if (immediate) {
      callback();
    }
    
    const id = setInterval(callback, interval);
    
    return () => {
      clearInterval(id);
    };
  }, [callback, interval, isPolling, immediate]);
  
  return [isPolling, startPolling, stopPolling];
} 