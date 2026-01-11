
import React, { useState } from 'react';

const MOCK_GRID_NODES = [
  { id: '1', title: 'Cyberpunk Arena', author: 'Sumukha S.', type: 'GAME', date: '2025-05-12', icon: '🎮', desc: 'High-speed neon combat simulation.', category: 'Simulation' },
  { id: '2', title: 'Neural Synth Loop', author: 'Elite_Node', type: 'AUDIO', date: '2025-05-11', icon: '🎵', desc: 'Recursive frequency modulation.', category: 'Synthesis' },
  { id: '3', title: 'Recursive Logic v2', author: 'Sumukha S.', type: 'CODE', date: '2025-05-10', icon: '⌨️', desc: 'Self-optimizing algorithmic shard.', category: 'Logic' },
  { id: '4', title: 'Infinite Void Vision', author: 'Ghost_Architect', type: 'IMAGE', date: '2025-05-09', icon: '🎨', desc: 'Ethereal manifestations from the core.', category: 'Art' },
  { id: '5', title: 'Tactical Recon Node', author: 'Sumukha S.', type: 'SCAN', date: '2025-05-08', icon: '📡', desc: 'Environmental optic indexing.', category: 'Recon' },
  { id: '6', title: 'Quantum Market Shard', author: 'Trade_Node', type: 'TRADE', date: '2025-05-07', icon: '📈', desc: 'Predictive finance synthesis.', category: 'Finance' },
  { id: '7', title: 'Astra Galactic Map', author: 'Explorer_7', type: 'MAPS', date: '2025-05-06', icon: '📍', desc: 'Deep-space spatial mapping.', category: 'Navigation' },
  { id: '8', title: 'Core Vocal Patterns', author: 'Sumukha S.', type: 'LIVE', date: '2025-05-05', icon: '🎙️', desc: 'Biometric voice sync recording.', category: 'Biometrics' },
];

export const NetworkView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  const filteredNodes = MOCK_GRID_NODES.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[1500] bg-black/98 flex flex-col font-orbitron overflow-hidden animate-in fade-in duration-500">
      <header className="h-24 border-b border-white/5 px-12 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-xl animate-pulse">🌐</div>
          <div>
            <h2 className="text-2xl font-black text-emerald-400 uppercase italic tracking-tighter">Global_Grid_Registry</h2>
            <p className="text-[8px] uppercase tracking-[0.4em] text-emerald-500/30">Lattice Networking Protocol // Sumukha S.</p>
          </div>
        </div>
        <button onClick={onClose} className="p-6 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center">✕</button>
      </header>

      <main className="flex-1 p-16 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
              <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">The <span className="text-emerald-400">Elite Hub</span></h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.6em] font-bold">Synchronized Public Manifestations</p>
            </div>
            <div className="w-full md:w-[500px] relative group">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur opacity-25 group-focus-within:opacity-100 transition-opacity"></div>
              <input 
                type="text" 
                placeholder="Scan neural grid nodes..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full bg-black/60 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-white outline-none focus:border-emerald-500/50 transition-all text-lg font-bold italic relative z-10"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40 font-black text-2xl z-20 group-focus-within:text-emerald-400">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNodes.map(node => (
              <div key={node.id} className="group p-10 rounded-[4rem] bg-black/40 border-2 border-white/5 hover:border-emerald-500/40 transition-all duration-500 flex flex-col gap-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest">TS_{node.id}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{node.icon}</div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">{node.type}</span>
                    <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{node.category}</span>
                  </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter truncate group-hover:text-emerald-400 transition-colors leading-none italic">{node.title}</h4>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">By {node.author}</p>
                   </div>
                   <p className="text-[11px] text-gray-600 font-medium leading-relaxed pt-2 line-clamp-2">{node.desc}</p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-gray-800 uppercase tracking-widest">
                   <span className="font-mono">{node.date}</span>
                   <button className="text-emerald-400 hover:text-white transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4">
                      MANIFEST <span className="text-xl">➔</span>
                   </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredNodes.length === 0 && (
            <div className="py-40 flex flex-col items-center justify-center opacity-10 gap-10 grayscale">
               <div className="text-[120px]">📡</div>
               <h3 className="text-3xl font-black uppercase tracking-[1em]">NO_MATCHING_NODES_IN_GRID</h3>
            </div>
          )}

          <div className="text-center pt-24 pb-12">
             <p className="text-[11px] font-black text-emerald-500/20 uppercase tracking-[1.5em] animate-pulse italic">
                Sovereign Network Active — Global Shard Density: 99.12%
             </p>
          </div>
        </div>
      </main>

      <footer className="h-16 px-16 bg-black border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.8em] text-emerald-500/10">
         <span>TOTAL_NODES: 82,104</span>
         <span>LATTICE_INTEGRITY: OPTIMAL</span>
         <span>GREETING: JAY SWAMINARAYAN! 🙏</span>
      </footer>
    </div>
  );
};
