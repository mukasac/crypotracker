"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, TrendingUp, ShieldCheck, Activity, BarChart3 } from 'lucide-react';
import { getHistoricalData, COIN_ID_MAP } from '@/services/cryptoService';

// Types
interface SimulationData {
  projectedValue: number;
  potentialReturn: number;
  bestCase: number;
  bestCaseReturn: number;
  worstCase: number;
  worstCaseReturn: number;
  marketTiming: string;
  riskLevel: string;
  safetyRecommendation: string;
  volatilityScore: number;
  confidenceLevel: string;
}

interface SimulationParams {
  amount: number;
  timeframe: string;
  crypto: CryptoType;
  investmentType: string;
  riskTolerance: number;
}

interface HistoricalMarketData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

type CryptoType = 'BTC' | 'ETH' | 'SOL' | 'ADA' | 'DOT' | 'LINK' | 'XRP' | 'DOGE' | 'UNI' | 'AVAX';

// Helper functions
function getTimeAdjustedMultiplier(timeframe: string): number {
  const [value, unit] = timeframe.split(' ');
  const numericValue = parseInt(value);
  
  switch (unit) {
    case 'hour':
    case 'hours':
      return numericValue / (24 * 30 * 12);
    case 'day':
    case 'days':
      return numericValue / (30 * 12);
    case 'month':
    case 'months':
      return numericValue / 12;
    case 'year':
      return numericValue;
    default:
      return 1;
  }
}

function calculateVolatility(prices: [number, number][]): number {
  if (prices.length < 2) return 0;

  const returns = prices.slice(1).map((price, i) => {
    return (price[1] - prices[i][1]) / prices[i][1];
  });

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

function getMarketTimingMessage(conditions: number): string {
  if (conditions > 0.7) return 'Current market conditions are very favorable';
  if (conditions > 0.5) return 'Market conditions are moderately favorable';
  if (conditions > 0.3) return 'Market conditions are neutral';
  return 'Consider waiting for better market conditions';
}

function getRiskLevel(riskTolerance: number): string {
  if (riskTolerance > 70) return 'Aggressive';
  if (riskTolerance > 40) return 'Moderate';
  return 'Conservative';
}

function getSafetyRecommendation(riskTolerance: number, volatility: number): string {
  if (volatility > 0.5) {
    return 'High volatility detected. Consider using stop-loss orders';
  }
  if (riskTolerance > 70) {
    return 'Set strict stop-loss orders to protect your investment';
  }
  if (riskTolerance > 40) {
    return 'Balance your portfolio with stable coins';
  }
  return 'Consider dollar-cost averaging to minimize risk';
}
// Main calculation function
function calculateSimulation(
  params: SimulationParams, 
  historicalData: HistoricalMarketData | null
): SimulationData {
  const { amount, timeframe, crypto, investmentType, riskTolerance } = params;
  
  // Calculate volatility from real data
  let realVolatility = 0;
  if (historicalData?.prices) {
    realVolatility = calculateVolatility(historicalData.prices);
  } else {
    realVolatility = 0.3; // Default fallback volatility
  }

  // Get current price trend from historical data
  const recentPrices = historicalData?.prices.slice(-7) || [];
  const priceChange = recentPrices.length > 1 
    ? (recentPrices[recentPrices.length - 1][1] - recentPrices[0][1]) / recentPrices[0][1]
    : 0;

  // Calculate market conditions based on real data
  const marketConditions = 0.5 + (priceChange > 0 ? Math.min(priceChange, 0.5) : Math.max(priceChange, -0.5));

  const timeMultiplier = getTimeAdjustedMultiplier(timeframe);
  const riskMultiplier = riskTolerance / 100;

  // Calculate base return rate using historical performance
  let baseReturnRate = priceChange * (12 / timeMultiplier); // Annualized return
  baseReturnRate = Math.max(Math.min(baseReturnRate, 2), -0.5); // Cap extreme values

  // Adjust for investment type
  if (investmentType === 'recurring') {
    baseReturnRate *= 1.1; // 10% bonus for DCA
  }

  // Amount size effects
  if (amount > 10000) {
    baseReturnRate *= 1.05; // 5% bonus for larger investments
  }

  // Calculate projected values
  const adjustedReturn = baseReturnRate * (1 + (riskMultiplier - 0.5) * 0.5) * marketConditions;
  const timeAdjustedReturn = adjustedReturn * timeMultiplier;
  const projectedValue = amount * (1 + timeAdjustedReturn);

  const volatilityImpact = realVolatility * riskMultiplier * timeMultiplier;
  const bestCase = projectedValue * (1 + volatilityImpact);
  const worstCase = projectedValue * (1 - volatilityImpact);

  // Calculate confidence level based on volume trend
  let confidenceLevel = 'Medium';
  const volumeTrend = historicalData?.total_volumes.slice(-7).reduce((acc, curr, i, arr) => {
    if (i === 0) return 0;
    return acc + (curr[1] - arr[i-1][1]) / arr[i-1][1];
  }, 0) || 0;

  if (volumeTrend > 0.1 && marketConditions > 0.6) {
    confidenceLevel = 'High';
  } else if (volumeTrend < -0.1 || marketConditions < 0.4) {
    confidenceLevel = 'Low';
  }

  return {
    projectedValue,
    potentialReturn: timeAdjustedReturn,
    bestCase,
    bestCaseReturn: (bestCase - amount) / amount,
    worstCase,
    worstCaseReturn: (worstCase - amount) / amount,
    marketTiming: getMarketTimingMessage(marketConditions),
    riskLevel: getRiskLevel(riskTolerance),
    safetyRecommendation: getSafetyRecommendation(riskTolerance, realVolatility),
    volatilityScore: realVolatility,
    confidenceLevel
  };
}
export function InvestmentSimulator() {
  const [results, setResults] = useState<SimulationData | null>(null);
  const [amount, setAmount] = useState("1000");
  const [timeframe, setTimeframe] = useState("1 month");
  const [crypto, setCrypto] = useState<CryptoType>("BTC");
  const [investmentType, setInvestmentType] = useState("one-time");
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [historicalData, setHistoricalData] = useState<HistoricalMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const mappedId = COIN_ID_MAP[crypto.toLowerCase()];
      const data = await getHistoricalData(mappedId);
      setHistoricalData(data);
    };

    fetchHistoricalData();
  }, [crypto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const simulation = calculateSimulation(
        {
          amount: parseFloat(amount),
          timeframe,
          crypto,
          investmentType,
          riskTolerance,
        },
        historicalData
      );
      setResults(simulation);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-indigo-500/20">
      <CardHeader className="bg-gray-900">
        <CardTitle className="text-2xl font-bold text-indigo-200">AI Investment Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-gray-900">
        <div className="text-sm text-indigo-300">
          Simulate your crypto investment outcomes with our AI-powered tool using real-time market data. 
          Adjust parameters to see potential returns and risks.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Investment Amount (USD)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
                className="w-full bg-gray-900 border-indigo-800 text-indigo-200 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Cryptocurrency</label>
              <Select value={crypto} onValueChange={(value: string) => setCrypto(value as CryptoType)}>
                <SelectTrigger className="bg-gray-900 border-indigo-800 text-indigo-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-indigo-900">
                  {Object.entries(COIN_ID_MAP).map(([symbol, name]) => (
                    <SelectItem 
                      key={symbol} 
                      value={symbol.toUpperCase()}
                      className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100"
                    >
                      {name.charAt(0).toUpperCase() + name.slice(1)} ({symbol.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Investment Type</label>
              <Select value={investmentType} onValueChange={setInvestmentType}>
                <SelectTrigger className="bg-gray-900 border-indigo-800 text-indigo-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-indigo-900">
                  <SelectItem value="one-time" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900">
                    One-time Investment
                  </SelectItem>
                  <SelectItem value="recurring" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900">
                    Recurring Investment
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-gray-900 border-indigo-800 text-indigo-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-indigo-900">
                  {['1 day', '7 days', '14 days', '1 month', '3 months', '6 months', '1 year'].map((time) => (
                    <SelectItem 
                      key={time} 
                      value={time}
                      className="bg-gray-900 text-indigo-200 hover:bg-indigo-900"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-300">Risk Tolerance</label>
            <Slider
              value={[riskTolerance]}
              onValueChange={(value) => setRiskTolerance(value[0])}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-indigo-300">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Simulate Investment'}
          </Button>
        </form>

        {results && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="text-sm font-medium text-indigo-300">Expected Return</div>
                <div className="text-2xl font-bold mt-2 text-indigo-200">
                  ${results.projectedValue.toFixed(2)}
                </div>
                <div className="text-sm text-indigo-400 mt-1">
                  {(results.potentialReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>

              <Card className="p-4 bg-gray-900 border-green-500/20">
                <div className="text-sm font-medium text-indigo-300">Best Case</div>
                <div className="text-2xl font-bold mt-2 text-green-400">
                  ${results.bestCase.toFixed(2)}
                </div>
                <div className="text-sm text-indigo-400 mt-1">
                  {(results.bestCaseReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>

              <Card className="p-4 bg-gray-900 border-red-500/20">
                <div className="text-sm font-medium text-indigo-300">Worst Case</div>
                <div className="text-2xl font-bold mt-2 text-red-400">
                  ${results.worstCase.toFixed(2)}
                </div>
                <div className="text-sm text-indigo-400 mt-1">
                  {(results.worstCaseReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <TrendingUp className="h-4 w-4" />
                  <div className="text-sm font-medium">Market Timing</div>
                </div>
                <div className="mt-2 text-sm text-indigo-200">{results.marketTiming}</div>
              </Card>

              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="text-sm font-medium">Risk Level</div>
                </div>
                <div className="mt-2 text-sm text-indigo-200">{results.riskLevel}</div>
              </Card>

              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <ShieldCheck className="h-4 w-4" />
                  <div className="text-sm font-medium">Safety Recommendation</div>
                </div>
                <div className="mt-2 text-sm text-indigo-200">{results.safetyRecommendation}</div>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <Activity className="h-4 w-4" />
                  <div className="text-sm font-medium">Confidence Level</div>
                </div>
                <div className="mt-2 text-sm text-indigo-200">{results.confidenceLevel}</div>
                <div className="text-xs text-indigo-400 mt-1">
                  Based on current market conditions and volume
                </div>
              </Card>

              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <BarChart3 className="h-4 w-4" />
                  <div className="text-sm font-medium">Volatility Score</div>
                </div>
                <div className="mt-2 text-sm text-indigo-200">
                  {(results.volatilityScore * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-indigo-400 mt-1">
                  Based on recent price movements
                </div>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InvestmentSimulator;