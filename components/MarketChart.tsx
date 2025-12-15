import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MarketData } from '../types';

interface MarketChartProps {
  history: { time: string; price: number }[];
  currentPrice: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 text-xs rounded shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="text-emerald-400 font-mono font-bold">
          {payload[0].value.toFixed(2)} EUR
        </p>
      </div>
    );
  }
  return null;
};

export const MarketChart: React.FC<MarketChartProps> = ({ history, currentPrice }) => {
  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-lg border border-slate-800 p-4">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">BTC/EUR - M15 Reconstruction</h3>
             <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-xs text-green-500">Live Socket</span>
             </div>
        </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={history}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickFormatter={(val) => val.toFixed(0)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={currentPrice * 0.995} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Buy Zone', fill: '#ef4444', fontSize: 10 }} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};