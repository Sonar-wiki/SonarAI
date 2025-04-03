/**
 * Formats a number to a readable string with thousands separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats a wallet address to a shortened form
 */
export const formatAddress = (address: string, startLength = 4, endLength = 4): string => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Formats a token amount based on token type
 */
export const formatTokenAmount = (amount: number, symbol: string): string => {
  if (symbol === 'BONK' || symbol === 'SAMO' || symbol === 'WIF') {
    // For tokens with high supply, format in millions or billions
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2)}M`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(2)}K`;
    }
  }
  
  // Default formatting for other tokens
  return formatNumber(amount);
};

/**
 * Formats a price change percentage
 */
export const formatPriceChange = (change: number): string => {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * Formats a date to a relative time string (e.g. "5 mins ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffMins > 0) {
    return diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`;
  } else {
    return 'Just now';
  }
}; 