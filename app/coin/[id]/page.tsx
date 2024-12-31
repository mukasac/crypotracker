'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDetailedCoinData, type DetailedCoinData } from '@/services/cryptoService';
import { ArrowUp, ArrowDown, Info, DollarSign, BarChart2, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  price: Math.random() * 1000 + 90000,
}));

export default function CoinDetail({ params }: { params: { id: string } }) {
  const [coinData, setCoinData] = useState<DetailedCoinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDetailedCoinData(params.id);
      setCoinData(data);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!coinData || !coinData.market_data) return <div>Error loading coin data</div>;

  const priceChangeIsPositive = (coinData.market_data.price_change_percentage_24h ?? 0) > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">
            {coinData.name} 
            <span className="text-gray-400 ml-2">({coinData.symbol.toUpperCase()})</span>
          </h1>
          <span className={`text-xl ${priceChangeIsPositive ? 'text-green-400' : 'text-red-400'} flex items-center`}>
            {priceChangeIsPositive ? <ArrowUp className="mr-1" /> : <ArrowDown className="mr-1" />}
            {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        <div className="text-3xl font-bold text-white">
          ${coinData.market_data.current_price.usd.toLocaleString()}
        </div>
      </div>

      {/* Price Chart */}
      <Card className="p-4">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#6366F1" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-5 h-5" />
              <h3>Market Cap</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              ${coinData.market_data.market_cap.usd.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <BarChart2 className="w-5 h-5" />
              <h3>24h Trading Volume</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              ${coinData.market_data.total_volume.usd.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Layers className="w-5 h-5" />
              <h3>Circulating Supply</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {coinData.market_data.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Range Slider */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">24h Range</h3>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">${coinData.market_data.low_24h.usd.toLocaleString()}</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-indigo-500 rounded-full"
              style={{
                width: `${((coinData.market_data.current_price.usd - coinData.market_data.low_24h.usd) /
                  (coinData.market_data.high_24h.usd - coinData.market_data.low_24h.usd)) * 100}%`
              }}
            />
          </div>
          <span className="text-gray-400">${coinData.market_data.high_24h.usd.toLocaleString()}</span>
        </div>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Supply Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Max Supply</span>
                <span>{coinData.market_data.max_supply?.toLocaleString() ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span>{coinData.market_data.total_supply?.toLocaleString() ?? 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Price Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap Rank</span>
                <span>#{coinData.market_cap_rank ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">All-Time High</span>
                <span>${coinData.market_data.ath?.usd?.toLocaleString() ?? 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-green-500 hover:bg-green-600">Buy {coinData.symbol.toUpperCase()}</Button>
        <Button variant="outline">Add to Portfolio</Button>
      </div>
    </div>
  );
}