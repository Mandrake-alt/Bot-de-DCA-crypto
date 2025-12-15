import React, { useState, useEffect, useCallback } from 'react';
import { BotMode, MarketData, MarketSentiment, VultureMetrics, LogEntry } from './types';
import { generateMarketTick, calculateVultureMetrics, generateLog } from './services/simulation';
import { BotStatus } from './components/BotStatus';
import { MarketChart } from './components/MarketChart';
import { VultureBrain } from './components/VultureBrain';
import { LogTerminal } from './components/LogTerminal';
import { Settings, Shield, Server, LayoutDashboard } from 'lucide-react';

const MAX_HISTORY = 50;

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'STRATEGY' | 'SETTINGS'>('DASHBOARD');
  
  // Market State
  const [marketData, setMarketData] = useState<MarketData>({
    price: 42000,
    change24h: -1.2,
    rsi: 45,
    volatility: 0.02,
    volumeSpike: false,
    fundingRate: 0.001
  });

  const [priceHistory, setPriceHistory] = useState<{time: string, price: number}[]>([]);
  
  // Bot State
  const [botMode, setBotMode] = useState<BotMode>(BotMode.OBSERVATION);
  const [sentiment, setSentiment] = useState<MarketSentiment>(MarketSentiment.NEUTRAL);
  const [metrics, setMetrics] = useState<VultureMetrics>({
    panicScore: 0,
    buyZoneThreshold: 0,
    consecutiveRedCandles: 0,
    longShortRatio: 1
  });

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // --- Simulation Effect ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Market
      setMarketData(prev => {
        const newData = generateMarketTick(prev);
        
        // Update History
        setPriceHistory(history => {
          const newEntry = { 
            time: new Date().toLocaleTimeString(), 
            price: newData.price 
          };
          const newHistory = [...history, newEntry];
          if (newHistory.length > MAX_HISTORY) newHistory.shift();
          return newHistory;
        });

        // 2. Run Vulture Logic
        const decision = calculateVultureMetrics(newData);
        setMetrics(decision.metrics);
        setSentiment(decision.sentiment);
        setBotMode(decision.mode);

        // 3. Generate Logs
        const newLog = generateLog(decision.mode, newData);
        if (newLog) {
          setLogs(prevLogs => [...prevLogs, newLog].slice(-100)); // Keep last 100 logs
        }

        return newData;
      });

    }, 1000); // 1 tick per second for demo purposes

    return () => clearInterval(interval);
  }, []);

  // --- Render Helpers ---

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column: Chart & Logs */}
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <MarketChart history={priceHistory} currentPrice={marketData.price} />
        <div className="flex-1 min-h-[300px]">
          <LogTerminal logs={logs} />
        </div>
      </div>

      {/* Right Column: Vulture Brain & Stats */}
      <div className="flex flex-col space-y-6">
        <div className="flex-1">
          <VultureBrain metrics={metrics} sentiment={sentiment} mode={botMode} />
        </div>
        
        {/* Quick Stats Panel */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Statistiques de Session</h3>
          <div className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Temps Actif</span>
               <span className="font-mono text-slate-200">24h 12m</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Achats Exécutés</span>
               <span className="font-mono text-emerald-400">3</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Total Investi</span>
               <span className="font-mono text-slate-200">30.00 EUR</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Prix Moyen</span>
               <span className="font-mono text-slate-200">41,250.00 EUR</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Shield className="w-6 h-6 mr-3 text-emerald-500" />
        Stratégie "Vautour" - Architecture
      </h2>
      
      <div className="space-y-8 text-slate-300">
        <section>
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">1. Philosophie</h3>
          <p className="leading-relaxed">
            Le bot n'est pas prédictif. Il est réactif. Il n'achète jamais la force (breakout), mais exclusivement la faiblesse (pullback, crash, liquidation cascade).
            L'objectif est d'accumuler du BTC à des prix inférieurs à la moyenne mobile court terme, uniquement quand les indicateurs de sentiment signalent une peur excessive.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">2. Conditions d'Entrée (OR Logic)</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="text-slate-100 font-mono">RSI(14) &lt; 30</span> en timeframe M15/H1.</li>
            <li><span className="text-slate-100 font-mono">Chute > 5%</span> en moins de 1h (Flash Crash).</li>
            <li><span className="text-slate-100 font-mono">Liquidation Cascade</span> détectée via volume anormal + chute prix.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">3. Garde-fous (Hard Filters)</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="text-red-400">EUPHORIE:</span> Si RSI > 70, achat désactivé (Mode OBSERVATION).</li>
            <li><span className="text-red-400">PLAFOND:</span> Max 10 achats par 24h.</li>
            <li><span className="text-red-400">TREND:</span> Pas d'achat si BTC > MA(200) Daily avec pente > 45° (éviter d'acheter le top).</li>
          </ul>
        </section>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Server className="w-6 h-6 mr-3 text-emerald-500" />
        Configuration Système
      </h2>
      
      <div className="space-y-6">
        <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded text-sm text-amber-200 flex items-start">
           <Shield className="w-5 h-5 mr-2 flex-shrink-0" />
           <p>
             Les clés API ne sont jamais affichées ici. Elles sont chargées depuis le fichier 
             <span className="font-mono bg-black px-1 mx-1 rounded">.env.encrypted</span> 
             au démarrage du Raspberry Pi.
           </p>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Montant par Tranche (DCA)</label>
            <div className="flex">
                <input type="number" disabled value={10} className="bg-slate-950 border border-slate-700 text-white p-2 rounded-l w-full opacity-50 cursor-not-allowed" />
                <span className="bg-slate-800 border border-slate-700 border-l-0 text-slate-400 p-2 rounded-r flex items-center">EUR</span>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Seuil RSI Panique</label>
            <input type="range" min="10" max="40" defaultValue="30" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10 (Extrême)</span>
                <span>40 (Modéré)</span>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
            <button className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 font-bold py-3 px-4 rounded border border-red-800 transition-colors">
                ARRÊT D'URGENCE (KILL SWITCH)
            </button>
            <p className="text-xs text-center text-slate-600 mt-2">Arrête le bot et annule tous les ordres ouverts.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Top Navigation */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <LayoutDashboard className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-tight">VAUTOUR <span className="text-emerald-500">PI</span></h1>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Raspberry Pi 4 • 16GB RAM • Local AI</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'DASHBOARD' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
                Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('STRATEGY')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'STRATEGY' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
                Stratégie
            </button>
            <button 
                onClick={() => setActiveTab('SETTINGS')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'SETTINGS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
                Config
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 overflow-hidden">
        
        {activeTab === 'DASHBOARD' && (
            <>
                <BotStatus mode={botMode} marketData={marketData} />
                {renderDashboard()}
            </>
        )}

        {activeTab === 'STRATEGY' && renderStrategy()}
        {activeTab === 'SETTINGS' && renderSettings()}
        
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 py-2 px-4 text-[10px] text-slate-500 flex justify-between items-center">
        <div className="flex space-x-4">
            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div> System Normal</span>
            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div> Binance API: 42ms</span>
            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div> DB Local: Connected</span>
        </div>
        <div>
            v1.0.4-rc • Vautour Algo Trading
        </div>
      </footer>
    </div>
  );
};

export default App;