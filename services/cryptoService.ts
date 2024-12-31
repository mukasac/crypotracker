// services/cryptoService.ts

export interface CryptoData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
   }
   
   export interface DetailedCoinData {
    id: string;
    symbol: string;
    name: string;
    market_cap_rank?: number;
    market_data: {
      current_price: { usd: number };
      price_change_percentage_24h: number;
      market_cap: { usd: number };
      fully_diluted_valuation: { usd: number };
      total_volume: { usd: number };
      circulating_supply: number;
      total_supply: number;
      max_supply: number;
      low_24h: { usd: number };
      high_24h: { usd: number };
      ath?: { usd: number };
    };
   }
   
   export const COIN_ID_MAP: { [key: string]: string } = {
    btc: 'bitcoin',
    eth: 'ethereum',
    sol: 'solana',
    ada: 'cardano'
   };
   
   export async function getCryptoData(): Promise<CryptoData[] | null> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?' +
        'vs_currency=usd' +
        '&ids=bitcoin,ethereum,solana,cardano' +
        '&order=market_cap_desc' +
        '&per_page=4' +
        '&page=1' +
        '&sparkline=false' +
        '&price_change_percentage=24h' +
        '&locale=en'
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return null;
    }
   }
   
   export async function getDetailedCoinData(coinId: string): Promise<DetailedCoinData | null> {
    try {
      const mappedId = COIN_ID_MAP[coinId.toLowerCase()] || coinId;
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${mappedId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) throw new Error('Failed to fetch coin data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching detailed coin data:', error);
      return null;
    }
   }

   interface HistoricalMarketData {
    prices: [number, number][];      // [timestamp, price]
    market_caps: [number, number][]; // [timestamp, market_cap]
    total_volumes: [number, number][]; // [timestamp, volume]
  }
  
  export async function getHistoricalData(coinId: string, days: number = 30): Promise<HistoricalMarketData | null> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      if (!response.ok) throw new Error('Failed to fetch historical data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  }
  
  // Function to calculate volatility from historical data
  export function calculateVolatility(prices: [number, number][]): number {
    if (prices.length < 2) return 0;
  
    const returns = prices.slice(1).map((price, i) => {
      return (price[1] - prices[i][1]) / prices[i][1];
    });
  
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }
  export interface ChartData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  }
  
  export async function getChartData(
    coinId: string, 
    days: string = '1', 
    interval?: string
  ): Promise<ChartData | null> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?` +
        `vs_currency=usd&days=${days}${interval ? `&interval=${interval}` : ''}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch chart data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return null;
    }
  }