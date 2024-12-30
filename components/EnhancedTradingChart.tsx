"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart2, AlertTriangle } from 'lucide-react'

type Indicator = 'macd' | 'rsi' | 'volume';
type Indicators = Record<Indicator, boolean>;

type AnalysisType = 'trend' | 'momentum' | 'volume';
type Analysis = {
  title: string;
  content: string;
  recommendation: string;
};
type MarketAnalysis = Record<AnalysisType, Analysis>;

export const EnhancedTradingChart = () => {
  // State for interactive features
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState<Indicators>({
    macd: true,
    rsi: true,
    volume: true
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('trend');

  // Enhanced sample data with more indicators
  const tradingData = [
    { 
      day: '1',
      price: 42000,
      volume: 28000,
      macd: 100,
      signal: 'wait',
      rsi: 45,
      sma20: 41800,
      ema50: 41600,
      aiConfidence: 65,
      sentiment: 'neutral'
    },
    { 
      day: '2',
      price: 42500,
      volume: 30000,
      macd: 120,
      signal: 'buy',
      rsi: 55,
      sma20: 42000,
      ema50: 41800,
      aiConfidence: 70,
      sentiment: 'bullish'
    },
    { 
      day: '3',
      price: 43000,
      volume: 35000,
      macd: 150,
      signal: 'buy',
      rsi: 60,
      sma20: 42300,
      ema50: 42000,
      aiConfidence: 75,
      sentiment: 'bullish'
    },
    { 
      day: '4',
      price: 42800,
      volume: 25000,
      macd: 130,
      signal: 'hold',
      rsi: 58,
      sma20: 42500,
      ema50: 42200,
      aiConfidence: 60,
      sentiment: 'neutral'
    },
    { 
      day: '5',
      price: 43500,
      volume: 40000,
      macd: 180,
      signal: 'buy',
      rsi: 65,
      sma20: 42800,
      ema50: 42400,
      aiConfidence: 80,
      sentiment: 'bullish'
    }
  ];

  // AI Analysis for different aspects
  const marketAnalysis: MarketAnalysis = {
    trend: {
      title: "Market Trend",
      content: "We've spotted a strong upward trend. The next resistance level is around $43,500.",
      recommendation: "Consider buying on small dips"
    },
    momentum: {
      title: "Market Momentum",
      content: "The market is showing positive momentum. There's still room for growth.",
      recommendation: "Stay optimistic, but be cautious"
    },
    volume: {
      title: "Trading Volume",
      content: "We're seeing higher than average trading volume, which supports the current price movement.",
      recommendation: "Watch for continued high volume"
    }
  };

  // Custom tooltip with enhanced information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Price</p>
              <p className="text-white font-bold">${data.price}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Volume</p>
              <p className="text-white font-bold">{data.volume.toLocaleString()}</p>
            </div>
            {indicators.macd && (
              <div>
                <p className="text-sm text-slate-400">MACD</p>
                <p className="text-white font-bold">{data.macd}</p>
              </div>
            )}
            {indicators.rsi && (
              <div>
                <p className="text-sm text-slate-400">RSI</p>
                <p className="text-white font-bold">{data.rsi}</p>
              </div>
            )}
          </div>
          {data.signal !== 'hold' && (
            <div className="mt-2 p-2 rounded bg-slate-700">
              <p className="text-sm font-medium text-blue-400">
                AI Signal: {data.signal.toUpperCase()}
              </p>
              <p className="text-sm text-slate-300">
                Confidence: {data.aiConfidence}%
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Smart Market Analysis</CardTitle>
          <div className="flex space-x-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              {(Object.keys(indicators) as Indicator[]).map(indicator => (
                <Button
                  key={indicator}
                  variant={indicators[indicator] ? "default" : "outline"}
                  onClick={() => setIndicators(prev => ({
                    ...prev,
                    [indicator]: !prev[indicator]
                  }))}
                  className="text-xs"
                >
                  {indicator.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price and Indicator Charts */}
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={tradingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Main price line */}
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  yAxisId="left"
                />
                
                {/* Moving averages */}
                <Line 
                  type="monotone" 
                  dataKey="sma20" 
                  stroke="#22c55e" 
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="3 3"
                  yAxisId="left"
                />
                
                <Line 
                  type="monotone" 
                  dataKey="ema50" 
                  stroke="#eab308" 
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="3 3"
                  yAxisId="left"
                />
                
                {/* Volume bars */}
                {indicators.volume && (
                  <Bar 
                    dataKey="volume" 
                    fill="#3b82f6" 
                    opacity={0.3} 
                    yAxisId="right"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Technical Indicators */}
          {indicators.macd && (
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={tradingData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="macd" stroke="#db2777" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* AI Analysis Tabs */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex space-x-4 mb-4">
              {(Object.keys(marketAnalysis) as AnalysisType[]).map(type => (
                <Button
                  key={type}
                  variant={selectedAnalysis === type ? "default" : "outline"}
                  onClick={() => setSelectedAnalysis(type)}
                  className="text-sm"
                >
                  {type === 'trend' ? <TrendingUp className="w-4 h-4 mr-2" /> :
                   type === 'momentum' ? <BarChart2 className="w-4 h-4 mr-2" /> :
                   <AlertTriangle className="w-4 h-4 mr-2" />}
                  {marketAnalysis[type].title}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {marketAnalysis[selectedAnalysis].title}
              </h3>
              <p className="text-slate-300">
                {marketAnalysis[selectedAnalysis].content}
              </p>
              <p className="text-indigo-400 font-medium">
                Our take: {marketAnalysis[selectedAnalysis].recommendation}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

