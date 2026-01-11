
import React, { useState } from 'react';
import { AppTheme, MemoryEntry } from '../types';

interface MemoryVaultProps {
  theme: AppTheme;
  memory: MemoryEntry[];
  onClose: () => void;
  onPurge: () => void;
}

const MemoryVault: React.FC<MemoryVaultProps> = ({ theme, memory, onClose, onPurge }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isDark = theme === AppTheme.DARK;

  const filteredMemory = memory.filter(m => 
    m.word.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(-300);

  const handlePurge = () => {
    if (confirm("DANGER: WIPE NEURAL ARCHIVE?")) {
      onPurge();
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-[#01040a]/99 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-500">
      <div className={`max-w-4xl w-full h-[80vh] rounded-[3rem] p-10 border-2 flex flex-col gap-8 relative overflow-hidden transition-all ${isDark ? 'bg-[#020617] border-blue-500/30 shadow-6xl' : 'bg-white border-slate-200'}`}>
        
        <header className="flex justify-between items-center z-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-[1.2rem] bg-blue-500/10 border-2 border-blue-500/40 flex items-center justify-center text-3xl shadow-xl">🧠</div>
            <div>
              <h2 className={`text-3xl font-orbitron font-black uppercase tracking-tighter ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Permanent_Archive</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-black mt-1">Lattice // Sumukha S.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={handlePurge} className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">PURGE</button>
            <button onClick={onClose} className="p-5 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/5 shadow-xl flex items-center justify-center font-bold">✕</button>
          </div>
        </header>

        <div className="relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Query lattice..."
            className={`w-full py-6 px-10 rounded-[2rem] border-2 outline-none transition-all text-xl font-bold ${isDark ? 'bg-black/60 border-white/10 text-blue-50 focus:border-blue-500/50 shadow-inner' : 'bg-slate-50 border-slate-200'}`}
          />
        </div>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/20 rounded-[2rem] border border-white/5">
          <div className="flex flex-wrap gap-3 justify-center">
            {filteredMemory.map((entry, idx) => (
              <div 
                key={idx}
                className={`px-4 py-2 rounded-2xl border transition-all hover:scale-105 cursor-default group relative
                  ${isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-50 hover:bg-blue-500/20' : 'bg-slate-50 border-slate-200'}
                `}
              >
                <span className="text-sm font-bold tracking-tight">{entry.word}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemoryVault;
