"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { AlertTriangle, TrendingUp, ShieldCheck, Bitcoin, Coins } from 'lucide-react';

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
}

interface SimulationParams {
  amount: number;
  timeframe: string;
  crypto: string;
  investmentType: string;
  riskTolerance: number;
}

// Helper function to calculate simulation
function calculateSimulation(params: SimulationParams): SimulationData {
  const { amount, timeframe, riskTolerance } = params;
  
  // Basic calculations based on risk tolerance
  const riskMultiplier = riskTolerance / 100;
  const timeMultiplier = getTimeMultiplier(timeframe);
  
  // Calculate projected values
  const baseReturn = 0.1 * timeMultiplier; // 10% base monthly return
  const projectedReturn = baseReturn * (1 + riskMultiplier);
  const projectedValue = amount * (1 + projectedReturn);
  
  // Calculate scenarios
  const bestCase = projectedValue * (1 + riskMultiplier * 0.5);
  const worstCase = projectedValue * (1 - riskMultiplier * 0.5);
  
  // Risk assessment
  const riskLevel = riskTolerance < 33 ? "Conservative" : riskTolerance < 66 ? "Moderate" : "Aggressive";
  
  return {
    projectedValue,
    potentialReturn: projectedReturn,
    bestCase,
    bestCaseReturn: (bestCase - amount) / amount,
    worstCase,
    worstCaseReturn: (worstCase - amount) / amount,
    marketTiming: "Current market conditions are favorable for your strategy",
    riskLevel,
    safetyRecommendation: `Consider ${riskLevel.toLowerCase()} investment approach based on your risk tolerance`
  };
}

function getTimeMultiplier(timeframe: string): number {
  const [value, unit] = timeframe.split(' ');
  const numericValue = parseInt(value);
  switch (unit) {
    case 'hour':
    case 'hours':
      return numericValue / (24 * 30); // Assuming 30 days in a month
    case 'day':
    case 'days':
      return numericValue / 30;
    case 'month':
    case 'months':
      return numericValue;
    case 'year':
      return numericValue * 12;
    default:
      return 1;
  }
}

export function InvestmentSimulator() {
  const [results, setResults] = useState<SimulationData | null>(null);
  const [amount, setAmount] = useState("200");
  const [timeframe, setTimeframe] = useState("1 month");
  const [crypto, setCrypto] = useState("BTC");
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
    <Card className="w-full max-w-4xl mx-auto bg-gray-800/50 backdrop-blur border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">AI Investment Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-blue-200">
          Simulate your crypto investment outcomes with our AI-powered tool. 
          Start with as little as $200 and see potential returns.
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Investment Amount (USD)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="200"
                step="100"
                required
                className="w-full bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Cryptocurrency</label>
              <Select value={crypto} onValueChange={setCrypto}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                  <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                  <SelectItem value="LINK">Chainlink (LINK)</SelectItem>
                  <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                  <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                  <SelectItem value="UNI">Uniswap (UNI)</SelectItem>
                  <SelectItem value="AVAX">Avalanche (AVAX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Investment Type</label>
              <Select value={investmentType} onValueChange={setInvestmentType}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time Investment</SelectItem>
                  <SelectItem value="recurring">Recurring Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hour">1 Hour</SelectItem>
                  <SelectItem value="6 hours">6 Hours</SelectItem>
                  <SelectItem value="12 hours">12 Hours</SelectItem>
                  <SelectItem value="1 day">1 Day</SelectItem>
                  <SelectItem value="3 days">3 Days</SelectItem>
                  <SelectItem value="7 days">7 Days</SelectItem>
                  <SelectItem value="14 days">14 Days</SelectItem>
                  <SelectItem value="1 month">1 Month</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="1 year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">Risk Tolerance</label>
            <Slider
              value={[riskTolerance]}
              onValueChange={(value) => setRiskTolerance(value[0])}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-blue-200">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Simulate Investment
          </Button>
        </form>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4 bg-gray-700/50 border-blue-500/20">
                <div className="text-sm font-medium text-blue-300">
                  Expected Return
                </div>
                <div className="text-2xl font-bold mt-2 text-white">
                  ${results.projectedValue.toFixed(2)}
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  {(results.potentialReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>
              <Card className="p-4 bg-gray-700/50 border-green-500/20">
                <div className="text-sm font-medium text-blue-300">
                  Best Case Scenario
                </div>
                <div className="text-2xl font-bold mt-2 text-green-400">
                  ${results.bestCase.toFixed(2)}
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  {(results.bestCaseReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>
              <Card className="p-4 bg-gray-700/50 border-red-500/20">
                <div className="text-sm font-medium text-blue-300">
                  Worst Case Scenario
                </div>
                <div className="text-2xl font-bold mt-2 text-red-400">
                  ${results.worstCase.toFixed(2)}
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  {(results.worstCaseReturn * 100).toFixed(2)}% ROI
                </div>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4 bg-gray-700/50 border-blue-500/20">
                <div className="flex items-center space-x-2 text-blue-300">
                  <TrendingUp className="h-4 w-4" />
                  <div className="text-sm font-medium">Market Timing</div>
                </div>
                <div className="mt-2 text-sm text-white">{results.marketTiming}</div>
              </Card>
              <Card className="p-4 bg-gray-700/50 border-blue-500/20">
                <div className="flex items-center space-x-2 text-blue-300">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="text-sm font-medium">Risk Level</div>
                </div>
                <div className="mt-2 text-sm text-white">{results.riskLevel}</div>
              </Card>
              <Card className="p-4 bg-gray-700/50 border-blue-500/20">
                <div className="flex items-center space-x-2 text-blue-300">
                  <ShieldCheck className="h-4 w-4" />
                  <div className="text-sm font-medium">Safety Recommendation</div>
                </div>
                <div className="mt-2 text-sm text-white">{results.safetyRecommendation}</div>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InvestmentSimulator;

