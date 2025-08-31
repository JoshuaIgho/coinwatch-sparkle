import axios from 'axios';

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated: string;
}

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with default config
const cryptoApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchTopCryptos = async (limit: number = 50): Promise<CryptoCoin[]> => {
  try {
    const response = await cryptoApi.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h,7d'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw new Error('Failed to fetch cryptocurrency data');
  }
};

export const fetchSingleCoin = async (coinId: string): Promise<CryptoCoin> => {
  try {
    const response = await cryptoApi.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: coinId,
        sparkline: true,
        price_change_percentage: '24h,7d'
      }
    });
    return response.data[0];
  } catch (error) {
    console.error('Error fetching single coin data:', error);
    throw new Error('Failed to fetch coin data');
  }
};

export const fetchCoinChartData = async (coinId: string, days: string): Promise<Array<{ time: string; price: number }>> => {
  try {
    const response = await cryptoApi.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days === '1' ? 'hourly' : 'daily'
      }
    });
    
    return response.data.prices.map(([timestamp, price]: [number, number]) => {
      const date = new Date(timestamp);
      return {
        time: days === '1' 
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: price,
      };
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw new Error('Failed to fetch chart data');
  }
};

export const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else if (price < 1000) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const formatMarketCap = (marketCap: number): string => {
  const trillion = 1000000000000;
  const billion = 1000000000;
  const million = 1000000;

  if (marketCap >= trillion) {
    return `$${(marketCap / trillion).toFixed(2)}T`;
  } else if (marketCap >= billion) {
    return `$${(marketCap / billion).toFixed(2)}B`;
  } else if (marketCap >= million) {
    return `$${(marketCap / million).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

export const formatPercentageChange = (change: number): string => {
  const formatted = Math.abs(change).toFixed(2);
  return change >= 0 ? `+${formatted}%` : `-${formatted}%`;
};