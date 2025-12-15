import React from 'react';
import { BotMode, MarketData } from '../types';
import { Power, Activity, DollarSign, Lock } from 'lucide-react';

interface BotStatusProps {
  mode: BotMode;
  marketData: MarketData;
}

export const BotStatus: React.FC<BotStatusProps> = ({ mode, marketData }) => {
  const getModeStyle = (m: BotMode) => {
    switch (m) {
      case BotMode.OBSERVATION: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case BotMode.ARMED: return 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse';
      case BotMode.BUYING: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case BotMode.STOP: return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      {/* Bot Mode Card */}
      <div className={`p-4 rounded-lg border flex items-center justify-between ${getModeStyle(mode)}`}>
        <div className="flex flex-col">
            <span className="text-xs opacity-70 uppercase font-semibold">Statut du Bot</span>
            <span className="text-xl font-black tracking-wider">{mode}</span>
        </div>
        <div className="p-2 bg-slate-900/30 rounded-full">
            <Power className="w-6 h-6" />
        </div>
      </div>

      {/* Price Card */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">BTC / EUR</span>
            <div className="flex items-baseline space-x-2">
                <span className="text-xl font-mono text-slate-200">{marketData.price.toFixed(2)}</span>
                <span className={`text-xs font-mono ${marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketData.change24h > 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
                </span>
            </div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-full">
            <DollarSign className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      {/* RSI Card */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">RSI (14)</span>
            <span className={`text-xl font-mono ${marketData.rsi < 30 ? 'text-green-400' : marketData.rsi > 70 ? 'text-red-400' : 'text-slate-200'}`}>
                {marketData.rsi.toFixed(1)}
            </span>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-full">
            <Activity className="w-6 h-6 text-slate-400" />
        </div>
      </div>

       {/* Security Status */}
       <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">Sécurité</span>
            <span className="text-xl font-semibold text-emerald-400">ENCRYPTED</span>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-full">
            <Lock className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

    </div>
  );
};