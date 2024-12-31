'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart2, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

type Indicator = 'macd' | 'rsi' | 'volume';
type Indicators = Record<Indicator, boolean>;

type AnalysisType = 'trend' | 'momentum' | 'volume';
type Analysis = {
  title: string;
  content: string;
  recommendation: string;
};
type MarketAnalysis = Record<AnalysisType, Analysis>;

const Chart = () => {
  // State for interactive features
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState<Indicators>({
    macd: true,
    rsi: true,
    volume: true
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('trend');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample data
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

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-slate-400">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle>Smart Market Analysis</CardTitle>
            <div className="flex flex-wrap gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={timeframe} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
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
            <div style={{ width: '100%', height: '400px' }} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={tradingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    yAxisId="left"
                    name="Price"
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="sma20" 
                    stroke="#22c55e" 
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                    yAxisId="left"
                    name="SMA 20"
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="ema50" 
                    stroke="#eab308" 
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                    yAxisId="left"
                    name="EMA 50"
                  />
                  
                  {indicators.volume && (
                    <Bar 
                      dataKey="volume" 
                      fill="#3b82f6" 
                      opacity={0.3} 
                      yAxisId="right"
                      name="Volume"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {indicators.macd && (
              <div style={{ width: '100%', height: '100px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={tradingData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="macd" 
                      stroke="#db2777" 
                      dot={false}
                      name="MACD"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex flex-wrap gap-4 mb-4">
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
    </div>
  );
};

export default dynamic(() => Promise.resolve(Chart), { ssr: false });

