'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart2, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { getChartData, COIN_ID_MAP } from '@/services/cryptoService';

type Indicator = 'macd' | 'rsi' | 'volume';
type Indicators = Record<Indicator, boolean>;

type AnalysisType = 'trend' | 'momentum' | 'volume';
type Analysis = {
  title: string;
  content: string;
  recommendation: string;
};
type MarketAnalysis = Record<AnalysisType, Analysis>;

interface FormattedChartData {
  timestamp: number;
  displayTime: string;
  price: number;
  volume: number;
  sma20?: number;
  ema50?: number;
  rsi?: number;
}

const Chart = () => {
  // State
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [chartData, setChartData] = useState<FormattedChartData[]>([]);
  const [indicators, setIndicators] = useState<Indicators>({
    macd: true,
    rsi: true,
    volume: true
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('trend');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to format date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    if (timeframe === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '1W') {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  // Technical Indicators Calculations
  const calculateSMA = (data: number[], period: number): (number | undefined)[] => {
    const sma: (number | undefined)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(undefined);
        continue;
      }
      const avg = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      sma.push(avg);
    }
    return sma;
  };

  const calculateEMA = (data: number[], period: number): (number | undefined)[] => {
    const ema: (number | undefined)[] = [];
    const multiplier = 2 / (period + 1);
    let previousEMA: number | undefined = undefined;

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ema.push(undefined);
        continue;
      }
      if (previousEMA === undefined) {
        // First EMA is SMA
        previousEMA = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
        ema.push(previousEMA);
      } else {
        const currentEMA: number = (data[i] - previousEMA) * multiplier + previousEMA;
        previousEMA = currentEMA;
        ema.push(currentEMA);
      }
    }
    return ema;
  };

  const calculateRSI = (data: number[], period: number = 14): (number | undefined)[] => {
    const rsi: (number | undefined)[] = [];
    const changes = data.map((price, i) => 
      i === 0 ? 0 : price - data[i - 1]
    );

    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        rsi.push(undefined);
        continue;
      }

      const gains = changes.slice(i - period + 1, i + 1)
        .filter(change => change > 0);
      const losses = changes.slice(i - period + 1, i + 1)
        .filter(change => change < 0)
        .map(loss => Math.abs(loss));

      const avgGain = gains.reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.reduce((a, b) => a + b, 0) / period;

      const RS = avgGain / (avgLoss || 1);
      const RSIValue = 100 - (100 / (1 + RS));
      rsi.push(RSIValue);
    }
    return rsi;
  };

  // Fetch and format data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const days = timeframe === '1D' ? '1' : 
                    timeframe === '1W' ? '7' : '30';
                    
        const data = await getChartData(selectedCoin, days);
        
        if (data) {
          const prices = data.prices;
          const volumes = data.total_volumes;
          const priceValues = prices.map(p => p[1]);
          
          const sma20Values = calculateSMA(priceValues, 20);
          const ema50Values = calculateEMA(priceValues, 50);
          const rsiValues = calculateRSI(priceValues);

          const formattedData: FormattedChartData[] = prices.map((price, i) => ({
            timestamp: price[0],
            displayTime: new Date(price[0]).toLocaleString(),
            price: price[1],
            volume: volumes[i][1],
            sma20: sma20Values[i],
            ema50: ema50Values[i],
            rsi: rsiValues[i]
          }));

          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchData();
    }
  }, [timeframe, selectedCoin, mounted]);
  useEffect(() => {
    setMounted(true);
  }, []);

  const generateAnalysis = (data: FormattedChartData[]): MarketAnalysis => {
    if (data.length < 2) return defaultAnalysis;

    const latestPrice = data[data.length - 1].price;
    const previousPrice = data[data.length - 2].price;
    const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100;
    const latestRSI = data[data.length - 1].rsi;
    const latestVolume = data[data.length - 1].volume;
    const avgVolume = data.reduce((acc, curr) => acc + curr.volume, 0) / data.length;

    return {
      trend: {
        title: "Market Trend",
        content: `Price ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChange).toFixed(2)}% in the last period.`,
        recommendation: priceChange > 0 ? "Consider buying on dips" : "Wait for trend reversal"
      },
      momentum: {
        title: "Market Momentum",
        content: `RSI is currently at ${latestRSI?.toFixed(2) ?? 'N/A'}`,
        recommendation: latestRSI && latestRSI > 70 ? "Overbought - Exercise caution" : 
                       latestRSI && latestRSI < 30 ? "Oversold - Look for buying opportunities" : 
                       "Market is in neutral territory"
      },
      volume: {
        title: "Trading Volume",
        content: `Volume is ${latestVolume > avgVolume ? 'above' : 'below'} average`,
        recommendation: latestVolume > avgVolume * 1.5 ? "Strong market interest" : "Wait for volume confirmation"
      }
    };
  };

  const defaultAnalysis: MarketAnalysis = {
    trend: {
      title: "Market Trend",
      content: "Loading market trend data...",
      recommendation: "Wait for data"
    },
    momentum: {
      title: "Market Momentum",
      content: "Loading momentum data...",
      recommendation: "Wait for data"
    },
    volume: {
      title: "Trading Volume",
      content: "Loading volume data...",
      recommendation: "Wait for data"
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-slate-400">Loading chart...</p>
      </div>
    );
  }

  const marketAnalysis = generateAnalysis(chartData);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle>Smart Market Analysis</CardTitle>
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COIN_ID_MAP).map(([symbol, id]) => (
                    <SelectItem key={id} value={id}>
                      {symbol.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
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
          {loading ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <p className="text-slate-400">Loading data...</p>
            </div>
          ) : (<div className="space-y-6">
            <div style={{ width: '100%', height: '400px' }} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="timestamp"
                    stroke="#94a3b8"
                    tickFormatter={formatDate}
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    scale="time"
                  />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: number) => [value.toFixed(2), '']}
                  />
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

            {indicators.rsi && (
              <div style={{ width: '100%', height: '100px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="timestamp"
                      stroke="#94a3b8"
                      tickFormatter={formatDate}
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      scale="time"
                    />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      formatter={(value: number) => [value.toFixed(2), 'RSI']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rsi" 
                      stroke="#db2777" 
                      dot={false}
                      name="RSI"
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
        )}
      </CardContent>
    </Card>
  </div>
);
};

// Use dynamic import to avoid SSR issues with chart components
export default dynamic(() => Promise.resolve(Chart), { ssr: false });