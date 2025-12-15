import { BotMode, MarketData, MarketSentiment, VultureMetrics, LogEntry } from '../types';

// Initial state
let currentPrice = 42000;
let currentRsi = 50;
let panicScore = 20;

export const generateMarketTick = (prevData: MarketData | null): MarketData => {
  const volatility = prevData?.volatility || 0.05;
  const change = (Math.random() - 0.5) * (volatility * 1000); // Random walk
  
  currentPrice = Math.max(1000, currentPrice + change);
  
  // Simulate RSI drift
  const rsiChange = (Math.random() - 0.5) * 5;
  currentRsi = Math.max(0, Math.min(100, currentRsi + rsiChange));

  // Determine panic based on rapid drops
  const isDrop = change < -50;
  
  return {
    price: currentPrice,
    change24h: ((currentPrice - 42500) / 42500) * 100,
    rsi: currentRsi,
    volatility: isDrop ? volatility * 1.1 : volatility * 0.99, // Volatility spikes on drops
    volumeSpike: Math.random() > 0.95,
    fundingRate: 0.01 - (Math.random() * 0.02), // -0.01 to 0.01
  };
};

export const calculateVultureMetrics = (market: MarketData): { metrics: VultureMetrics, sentiment: MarketSentiment, mode: BotMode } => {
  // Logic: High RSI = Low Panic. Low RSI = High Panic.
  // High Volatility + Negative Price Action = High Panic.
  
  let targetPanic = 100 - market.rsi;
  if (market.change24h < -2) targetPanic += 10;
  if (market.change24h < -5) targetPanic += 20;
  if (market.volumeSpike) targetPanic += 10;

  // Smooth the panic score
  panicScore = (panicScore * 0.9) + (targetPanic * 0.1);
  panicScore = Math.min(100, Math.max(0, panicScore));

  let sentiment = MarketSentiment.NEUTRAL;
  if (panicScore > 80) sentiment = MarketSentiment.PANIC;
  else if (panicScore > 60) sentiment = MarketSentiment.FEAR;
  else if (panicScore < 30) sentiment = MarketSentiment.EUPHORIA;

  let mode = BotMode.OBSERVATION;
  if (sentiment === MarketSentiment.EUPHORIA) mode = BotMode.OBSERVATION; // Anti-FOMO
  else if (sentiment === MarketSentiment.FEAR) mode = BotMode.ARMED;
  else if (sentiment === MarketSentiment.PANIC) mode = BotMode.BUYING;

  return {
    metrics: {
      panicScore,
      buyZoneThreshold: market.price * 1.02, // Hypothetical dynamic resistance
      consecutiveRedCandles: market.change24h < 0 ? Math.floor(Math.random() * 5) : 0,
      longShortRatio: 1.2 + (Math.random() * 0.5 - 0.25),
    },
    sentiment,
    mode
  };
};

export const generateLog = (mode: BotMode, market: MarketData): LogEntry | null => {
  const timestamp = new Date();
  const id = Math.random().toString(36).substr(2, 9);
  
  if (Math.random() > 0.8) {
     return null; // Don't log every tick
  }

  if (mode === BotMode.BUYING && Math.random() > 0.7) {
    return {
      id,
      timestamp,
      level: 'ACTION',
      message: `ORDRE EXÉCUTÉ: Achat ${market.price.toFixed(2)}€ - Panique détectée (${panicScore.toFixed(0)}%)`,
      module: 'EXECUTION'
    };
  }

  if (mode === BotMode.OBSERVATION && Math.random() > 0.9) {
    return {
      id,
      timestamp,
      level: 'INFO',
      message: `Anti-FOMO: Marché trop haut (RSI ${market.rsi.toFixed(0)}). Attente repli.`,
      module: 'DECISION'
    };
  }

  if (Math.random() > 0.95) {
     return {
      id,
      timestamp,
      level: 'WARNING',
      message: `WebSocket latency > 200ms - Reconstruction bougie...`,
      module: 'SYSTEM'
     }
  }

  return null;
};