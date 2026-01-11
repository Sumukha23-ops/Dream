
import React, { useState, useEffect, useRef } from 'react';
import { AppTheme, Message, PersonalityMode } from '../types';

interface ArchivistVaultProps {
  theme: AppTheme;
  history: Message[];
  onClose: () => void;
  onPin: (id: string) => void;
}

const SHARDS = [
  { id: 'all', label: 'Master Lattice', icon: '🌐', color: 'text-white' },
  { id: 'pinned', label: 'Pinned Core', icon: '📌', color: 'text-amber-400' },
  { id: PersonalityMode.MUSE, label: 'Creative Shards', icon: '🎨', color: 'text-pink-400' },
  { id: PersonalityMode.ORACLE, label: 'Oracle Logs', icon: '👁️', color: 'text-purple-400' },
  { id: PersonalityMode.GUARDIAN, label: 'Guardian Protocols', icon: '🛡️', color: 'text-emerald-400' },
];

const ArchivistVault: React.FC<ArchivistVaultProps> = ({ theme, history, onClose, onPin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeShard, setActiveShard] = useState('all');
  
  const isDark = theme === AppTheme.DARK;

  const filteredHistory = history.filter(m => {
    const matchesSearch = m.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShard = activeShard === 'all' || 
                         (activeShard === 'pinned' && m.isPinned) || 
                         (m.personality === activeShard);
    return matchesSearch && matchesShard;
  });

  return (
    <div className="fixed inset-0 z-[600] bg-black/98 flex items-center justify-center p-8 animate-in fade-in duration-500 font-orbitron">
      <div className="w-full h-full max-w-[1700px] border-2 border-white/10 bg-[#050505] rounded-[4rem] flex overflow-hidden shadow-6xl">
        
        <aside className="w-[400px] border-r border-white/5 bg-black/40 p-10 flex flex-col gap-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-3xl shadow-2xl">📚</div>
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Archivist_Vault</h2>
              <p className="text-[9px] uppercase tracking-[0.4em] text-amber-500/40">Neural Indexing Protocol</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
             <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-6 px-4">Vault_Filters</h3>
             {SHARDS.map(shard => (
               <button 
                key={shard.id}
                onClick={() => setActiveShard(shard.id)}
                className={`w-full p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-6 group ${activeShard === shard.id ? 'bg-white/5 border-amber-500/50' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
               >
                 <span className="text-3xl group-hover:scale-110 transition-transform">{shard.icon}</span>
                 <div>
                   <p className={`text-[13px] font-black uppercase tracking-widest ${activeShard === shard.id ? shard.color : 'text-gray-500'}`}>{shard.label}</p>
                   <p className="text-[8px] opacity-20 font-bold uppercase mt-1">Fragment Segment {shard.id.slice(0, 3).toUpperCase()}</p>
                 </div>
               </button>
             ))}
          </div>

          <div className="p-8 rounded-[3rem] bg-white/5 border border-white/5 text-center space-y-4">
             <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/20">Archive Status</p>
             <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">Commits:</span>
                <span className="text-amber-500">{history.length}</span>
             </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-black/20 min-w-0">
          <header className="h-28 border-b border-white/5 px-12 flex items-center justify-between backdrop-blur-3xl bg-black/40">
             <div className="flex-1 max-w-2xl relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-amber-500/40 font-black text-xl">🔍</div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Query archival lattice..."
                  className="w-full bg-black/60 border-2 border-white/5 rounded-full py-5 pl-16 pr-8 outline-none text-white font-bold text-lg focus:border-amber-500/20"
                />
             </div>
             <button onClick={onClose} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-600 transition-all flex items-center justify-center text-xl">✕</button>
          </header>

          <section className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-8">
             {filteredHistory.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-10 gap-8 grayscale">
                  <div className="text-9xl">📼</div>
                  <p className="text-2xl font-black uppercase tracking-[2em]">NO_DATA_FOUND</p>
               </div>
             ) : (
               filteredHistory.map((m, i) => (
                 <div 
                   key={m.id} 
                   className={`p-10 rounded-[4rem] border-2 transition-all flex flex-col gap-6 relative group animate-in slide-in-from-bottom-4 duration-500 ${m.isPinned ? 'bg-amber-500/5 border-amber-500/40' : 'bg-black/60 border-white/5'}`}
                   style={{ animationDelay: `${i * 50}ms` }}
                 >
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border ${m.role === 'user' ? 'border-amber-500/20 text-amber-50' : 'border-cyan-500/20 text-cyan-400'}`}>
                            {m.role === 'user' ? 'Intent_Source' : `${m.personality}_Manifest`}
                          </span>
                          <span className="text-[9px] font-mono opacity-20">TS: {new Date(m.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <button 
                        onClick={() => onPin(m.id)}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${m.isPinned ? 'bg-amber-500 border-amber-400 text-black shadow-xl' : 'bg-white/5 border-white/10 text-white/20 hover:text-white'}`}
                       >
                         {m.isPinned ? '📌' : '📍'}
                       </button>
                    </div>
                    <p className="text-xl font-medium tracking-tight text-white/90 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                 </div>
               ))
             )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ArchivistVault;
