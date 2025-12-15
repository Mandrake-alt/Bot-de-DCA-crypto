import React from 'react';
import { MarketSentiment, VultureMetrics, BotMode } from '../types';
import { Brain, TrendingDown, TrendingUp, Activity, ShieldAlert, Skull } from 'lucide-react';

interface VultureBrainProps {
  metrics: VultureMetrics;
  sentiment: MarketSentiment;
  mode: BotMode;
}

export const VultureBrain: React.FC<VultureBrainProps> = ({ metrics, sentiment, mode }) => {
  
  const getSentimentColor = (s: MarketSentiment) => {
    switch (s) {
      case MarketSentiment.EUPHORIA: return 'text-purple-500';
      case MarketSentiment.NEUTRAL: return 'text-blue-500';
      case MarketSentiment.FEAR: return 'text-amber-500';
      case MarketSentiment.PANIC: return 'text-red-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    if (score > 50) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-2">
        <Brain className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Moteur de Décision (IA Locale)</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        
        {/* Main Sentiment Indicator */}
        <div className="text-center">
            <span className="text-xs text-slate-500 uppercase">Contexte Marché</span>
            <div className={`text-3xl font-black tracking-tight mt-1 ${getSentimentColor(sentiment)} animate-in fade-in zoom-in duration-300`}>
                {sentiment}
            </div>
            {sentiment === MarketSentiment.PANIC && (
                 <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-red-950/50 border border-red-900 text-red-400 text-xs">
                    <Skull className="w-3 h-3 mr-1" />
                    Opportunité Vautour
                 </div>
            )}
            {sentiment === MarketSentiment.EUPHORIA && (
                 <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-purple-950/50 border border-purple-900 text-purple-400 text-xs">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Protection Anti-FOMO
                 </div>
            )}
        </div>

        {/* Panic Score Bar */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-slate-400">Indice de Panique</span>
                <span className="font-mono text-slate-200">{metrics.panicScore.toFixed(1)}/100</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ease-out ${getScoreColor(metrics.panicScore)}`}
                    style={{ width: `${metrics.panicScore}%` }}
                />
            </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center space-x-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-400">Red Candles</span>
                </div>
                <div className="text-lg font-mono">{metrics.consecutiveRedCandles}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-400">L/S Ratio</span>
                </div>
                <div className={`text-lg font-mono ${metrics.longShortRatio > 1.5 ? 'text-red-400' : 'text-green-400'}`}>
                    {metrics.longShortRatio.toFixed(2)}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};