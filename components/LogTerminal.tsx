import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, Clock, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react';

interface LogTerminalProps {
  logs: LogEntry[];
}

export const LogTerminal: React.FC<LogTerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (level: string) => {
    switch (level) {
      case 'WARNING': return <AlertTriangle className="w-3 h-3 text-amber-500" />;
      case 'ERROR': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'ACTION': return <Zap className="w-3 h-3 text-emerald-400" />;
      case 'SUCCESS': return <CheckCircle className="w-3 h-3 text-blue-400" />;
      default: return <Info className="w-3 h-3 text-slate-500" />;
    }
  };

  const getColor = (level: string) => {
    switch (level) {
      case 'WARNING': return 'text-amber-500';
      case 'ERROR': return 'text-red-500';
      case 'ACTION': return 'text-emerald-400 font-bold';
      case 'SUCCESS': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 flex flex-col h-full overflow-hidden font-mono text-xs shadow-inner">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400 font-semibold">systemd-journal</span>
        </div>
        <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 terminal-scroll">
        {logs.length === 0 && <span className="text-slate-600 italic">En attente de logs...</span>}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3 opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-slate-600 whitespace-nowrap flex-shrink-0 flex items-center">
                <Clock className="w-3 h-3 mr-1 inline" />
                {log.timestamp.toLocaleTimeString()}
            </span>
            <div className="flex items-center space-x-2 flex-shrink-0 w-20">
                 {getIcon(log.level)}
                 <span className={`uppercase font-bold text-[10px] ${getColor(log.level)}`}>{log.level}</span>
            </div>
            <div className="flex-1 break-words">
                <span className="text-slate-500 mr-2">[{log.module}]</span>
                <span className={getColor(log.level)}>{log.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};