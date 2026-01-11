
import React from 'react';
import { AppTheme, Message } from '../types';

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

interface HistorySidebarProps {
  theme: AppTheme;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNewChat: () => void;
  onExport: () => void;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  theme, sessions, currentSessionId, onSelect, onDelete, onClearAll, onNewChat, onExport, onClose 
}) => {
  const isDark = theme === AppTheme.DARK;

  return (
    <div className="fixed inset-y-0 left-0 z-[500] w-80 bg-black/60 backdrop-blur-3xl border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-500 shadow-2xl">
      <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
        <div>
          <h2 className={`text-xl font-orbitron font-black uppercase tracking-tight ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Vault</h2>
          <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Neural Threads</p>
        </div>
        <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all">✕</button>
      </div>

      <div className="p-6 flex flex-col gap-3">
        <button 
          onClick={onNewChat}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-cyan-500 text-black font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
        >
          <span>✦</span> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">History</h3>
          {sessions.length > 0 && (
            <button onClick={onClearAll} className="text-[8px] font-black uppercase text-red-500/60 hover:text-red-500 transition-colors">Clear All</button>
          )}
        </div>
        
        {sessions.length === 0 ? (
          <div className="text-center py-20 opacity-20 text-[10px] uppercase tracking-widest font-black">No Records</div>
        ) : (
          sessions.sort((a, b) => b.timestamp - a.timestamp).map(session => (
            <div 
              key={session.id}
              className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${currentSessionId === session.id ? 'bg-white/10 border-cyan-500/50 shadow-xl' : 'bg-white/5 border-transparent hover:border-white/10'}`}
              onClick={() => onSelect(session.id)}
            >
              <div className="flex flex-col gap-1 pr-8">
                <span className={`text-xs font-bold truncate ${currentSessionId === session.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {session.title || 'Untitled'}
                </span>
                <span className="text-[8px] font-mono opacity-30">
                  {new Date(session.timestamp).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-red-500/60 hover:text-red-500 transition-all"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-8 border-t border-white/10 bg-black/40 flex flex-col gap-3">
        <button 
          onClick={onExport}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          📥 Export Data
        </button>
        <p className="text-[8px] text-center opacity-20 uppercase font-mono tracking-widest">Sumukha S. // Local Persistence</p>
      </div>
    </div>
  );
};

export default HistorySidebar;
