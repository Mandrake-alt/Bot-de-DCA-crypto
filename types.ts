export enum BotMode {
  OBSERVATION = 'OBSERVATION', // Passive monitoring
  ARMED = 'ARMÉ', // Conditions are aligning (price drop)
  BUYING = 'ACHAT', // Executing orders
  STOP = 'STOP', // Emergency halt or manual stop
}

export enum MarketSentiment {
  EUPHORIA = 'EUPHORIE', // Do not buy
  NEUTRAL = 'NEUTRE', // Standard DCA only
  FEAR = 'PEUR', // Good opportunities
  PANIC = 'PANIQUE', // Vulture target
}

export interface MarketData {
  price: number;
  change24h: number;
  rsi: number; // 14-period RSI
  volatility: number; // Instant volatility
  volumeSpike: boolean; // Abnormal volume detection
  fundingRate: number;
}

export interface VultureMetrics {
  panicScore: number; // 0-100, calculated from inputs
  buyZoneThreshold: number; // Price under which we consider buying
  consecutiveRedCandles: number;
  longShortRatio: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'ACTION';
  message: string;
  module: 'MARKET' | 'DECISION' | 'EXECUTION' | 'SYSTEM';
}

export interface Trade {
  id: string;
  timestamp: Date;
  price: number;
  amountEur: number;
  amountBtc: number;
  trigger: string;
}