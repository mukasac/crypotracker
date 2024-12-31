"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, TrendingUp, ShieldCheck, Activity, BarChart3 } from 'lucide-react';

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

interface VolatilityData {
  daily: number;
  monthly: number;
  yearly: number;
}

type CryptoType = 'BTC' | 'ETH' | 'SOL' | 'ADA' | 'DOT' | 'LINK' | 'XRP' | 'DOGE' | 'UNI' | 'AVAX';

type CryptoVolatilityMap = {
  [key in CryptoType]: VolatilityData;
};

// Historical volatility data by crypto
const cryptoVolatility: CryptoVolatilityMap = {
  BTC: { daily: 0.03, monthly: 0.25, yearly: 0.65 },
  ETH: { daily: 0.04, monthly: 0.30, yearly: 0.75 },
  SOL: { daily: 0.06, monthly: 0.35, yearly: 0.85 },
  ADA: { daily: 0.05, monthly: 0.32, yearly: 0.80 },
  DOT: { daily: 0.055, monthly: 0.33, yearly: 0.82 },
  LINK: { daily: 0.045, monthly: 0.31, yearly: 0.78 },
  XRP: { daily: 0.042, monthly: 0.29, yearly: 0.72 },
  DOGE: { daily: 0.07, monthly: 0.40, yearly: 0.90 },
  UNI: { daily: 0.052, monthly: 0.34, yearly: 0.83 },
  AVAX: { daily: 0.058, monthly: 0.36, yearly: 0.86 }
};

// Helper functions
function getTimeAdjustedMultiplier(timeframe: string): number {
  const [value, unit] = timeframe.split(' ');
  const numericValue = parseInt(value);
  
  switch (unit) {
    case 'hour':
    case 'hours':
      return numericValue / (24 * 30 * 12); // Fraction of a year
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

// Calculate market conditions score (0-1)
function getMarketConditions(crypto: CryptoType): number {
  const baseScore = 0.6; // Neutral market conditions
  const volatility = cryptoVolatility[crypto].monthly;
  return Math.min(Math.max(baseScore + (Math.random() - 0.5) * volatility, 0), 1);
}

// Main calculation function
function calculateSimulation(params: SimulationParams): SimulationData {
  const { amount, timeframe, crypto, investmentType, riskTolerance } = params;
  
  // Get base multipliers
  const timeMultiplier = getTimeAdjustedMultiplier(timeframe);
  const riskMultiplier = riskTolerance / 100;
  const marketConditions = getMarketConditions(crypto);
  const volatility = cryptoVolatility[crypto].yearly;
  
  // Calculate base return rate (considering amount size effects)
  let baseReturnRate = 0.15; // 15% base annual return
  if (amount < 100) {
    baseReturnRate *= 0.8; // Smaller amounts might have relatively lower returns
  } else if (amount > 10000) {
    baseReturnRate *= 1.2; // Larger amounts might have better rates
  }

  // Adjust for investment type
  if (investmentType === 'recurring') {
    baseReturnRate *= 1.1; // 10% bonus for recurring investments (dollar-cost averaging benefit)
  }

  // Adjust return based on risk tolerance and market conditions
  const adjustedReturn = baseReturnRate * (1 + (riskMultiplier - 0.5) * 0.5) * marketConditions;
  
  // Calculate time-adjusted return
  const timeAdjustedReturn = adjustedReturn * timeMultiplier;
  
  // Calculate projected value
  const projectedValue = amount * (1 + timeAdjustedReturn);
  
  // Calculate best and worst cases based on volatility
  const volatilityImpact = volatility * riskMultiplier * timeMultiplier;
  const bestCase = projectedValue * (1 + volatilityImpact);
  const worstCase = projectedValue * (1 - volatilityImpact);
  
  // Determine risk level and recommendations
  let riskLevel = '';
  let safetyRecommendation = '';
  if (riskTolerance < 33) {
    riskLevel = 'Conservative';
    safetyRecommendation = 'Consider dollar-cost averaging to minimize risk';
  } else if (riskTolerance < 66) {
    riskLevel = 'Moderate';
    safetyRecommendation = 'Balance your portfolio with stable coins';
  } else {
    riskLevel = 'Aggressive';
    safetyRecommendation = 'Set stop-loss orders to protect your investment';
  }

  // Market timing assessment
  let marketTiming = '';
  if (marketConditions > 0.7) {
    marketTiming = 'Current market conditions are favorable';
  } else if (marketConditions > 0.4) {
    marketTiming = 'Market conditions are neutral';
  } else {
    marketTiming = 'Consider waiting for better market conditions';
  }

  // Calculate confidence level based on amount and market conditions
  let confidenceLevel = 'Medium';
  if (amount > 1000 && marketConditions > 0.6) {
    confidenceLevel = 'High';
  } else if (amount < 50 || marketConditions < 0.4) {
    confidenceLevel = 'Low';
  }

  return {
    projectedValue,
    potentialReturn: timeAdjustedReturn,
    bestCase,
    bestCaseReturn: (bestCase - amount) / amount,
    worstCase,
    worstCaseReturn: (worstCase - amount) / amount,
    marketTiming,
    riskLevel,
    safetyRecommendation,
    volatilityScore: volatility,
    confidenceLevel
  };
}

export function InvestmentSimulator() {
  const [results, setResults] = useState<SimulationData | null>(null);
  const [amount, setAmount] = useState("1");
  const [timeframe, setTimeframe] = useState("1 month");
  const [crypto, setCrypto] = useState<CryptoType>("BTC");
  const [investmentType, setInvestmentType] = useState("one-time");
  const [riskTolerance, setRiskTolerance] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const simulation = calculateSimulation({
      amount: parseFloat(amount),
      timeframe,
      crypto,
      investmentType,
      riskTolerance,
    });
    setResults(simulation);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-indigo-500/20">
      <CardHeader className="bg-gray-900">
        <CardTitle className="text-2xl font-bold text-indigo-200">AI Investment Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-gray-900">
        <div className="text-sm text-indigo-300">
          Simulate your crypto investment outcomes with our AI-powered tool. 
          Start with as little as $1 and see potential returns.
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
                className="w-full bg-gray-900 border-indigo-800 text-indigo-200 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500 relative z-40"
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Cryptocurrency</label>
              <Select value={crypto} onValueChange={(value: string) => setCrypto(value as CryptoType)}>
                <SelectTrigger className="bg-gray-900 border-indigo-800 text-indigo-200 relative z-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-indigo-900 shadow-xl z-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900" />
                  <div className="bg-gray-900 p-1 rounded-md relative">
                    <SelectItem value="BTC" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Solana (SOL)</SelectItem>
                    <SelectItem value="ADA" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Cardano (ADA)</SelectItem>
                    <SelectItem value="DOT" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Polkadot (DOT)</SelectItem>
                    <SelectItem value="LINK" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Chainlink (LINK)</SelectItem>
                    <SelectItem value="XRP" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Ripple (XRP)</SelectItem>
                    <SelectItem value="DOGE" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Dogecoin (DOGE)</SelectItem>
                    <SelectItem value="UNI" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Uniswap (UNI)</SelectItem>
                    <SelectItem value="AVAX" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Avalanche (AVAX)</SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Investment Type</label>
              <Select value={investmentType} onValueChange={(value: string) => setInvestmentType(value)}>
                <SelectTrigger className="bg-gray-900 border-indigo-800 text-indigo-200 relative z-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-indigo-900 shadow-xl z-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900" />
                  <div className="bg-gray-900 p-1 rounded-md relative">
                    <SelectItem value="one-time" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">One-time Investment</SelectItem>
                    <SelectItem value="recurring" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">Recurring Investment</SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-gray-900 border-indigo-800 text-indigo-200 relative z-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-indigo-900 shadow-xl z-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900" />
                  <div className="bg-gray-900 p-1 rounded-md relative">
                    <SelectItem value="1 hour" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">1 Hour</SelectItem>
                    <SelectItem value="6 hours" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">6 Hours</SelectItem>
                    <SelectItem value="12 hours" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">12 Hours</SelectItem>
                    <SelectItem value="1 day" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">1 Day</SelectItem>
                    <SelectItem value="3 days" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">3 Days</SelectItem>
                    <SelectItem value="7 days" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">7 Days</SelectItem>
                    <SelectItem value="14 days" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">14 Days</SelectItem>
                    <SelectItem value="1 month" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">1 Month</SelectItem>
                    <SelectItem value="3 months" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">3 Months</SelectItem>
                    <SelectItem value="6 months" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">6 Months</SelectItem>
                    <SelectItem value="1 year" className="bg-gray-900 text-indigo-200 hover:bg-indigo-900 hover:text-indigo-100 relative z-50">1 Year</SelectItem>
                  </div>
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
          >
            Simulate Investment
          </Button>
        </form>

        {results && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4 bg-gray-900 border-indigo-500/20">
                <div className="text-sm font-medium text-indigo-300">
                  Expected Return
                </div>
                <div className="text-2xl font-bold mt-2 text-indigo-200">
                  ${results.projectedValue.toFixed(2)}
                </div>
                <div className="text-sm text-indigo-400 mt-1">
                  {(results.potentialReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>
              <Card className="p-4 bg-gray-900 border-green-500/20">
                <div className="text-sm font-medium text-indigo-300">
                  Best Case Scenario
                </div>
                <div className="text-2xl font-bold mt-2 text-green-400">
                  ${results.bestCase.toFixed(2)}
                </div>
                <div className="text-sm text-indigo-400 mt-1">
                  {(results.bestCaseReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>
              <Card className="p-4 bg-gray-900 border-red-500/20">
                <div className="text-sm font-medium text-indigo-300">
                  Worst Case Scenario
                </div>
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
                  Based on investment size and market conditions
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
                  Historical volatility for selected timeframe
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