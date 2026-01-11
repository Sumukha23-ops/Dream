
import React from 'react';

export const CreatorDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-24 border-b border-white/5 px-16 flex items-center justify-between bg-black/60 backdrop-blur-3xl z-20">
         <div className="flex items-center gap-10">
            <div className="w-16 h-16 rounded-[2rem] bg-amber-500 text-black flex items-center justify-center text-4xl shadow-2xl">🏛️</div>
            <div>
               <h1 className="text-3xl font-black italic tracking-tighter text-amber-400 uppercase">Sovereign_Control</h1>
               <p className="text-[8px] uppercase tracking-[0.6em] text-amber-500/30">Master Architect Override // Sumukha S.</p>
            </div>
         </div>
         <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center text-xl font-bold">✕</button>
      </header>

      <main className="flex-1 p-20 grid grid-cols-1 md:grid-cols-3 gap-12">
         {[
           { label: 'Neural Stability', value: 'OPTIMAL', icon: '🧠' },
           { label: 'Lattice Integrity', value: '99.98%', icon: '🌐' },
           { label: 'Protocol Version', value: 'v16.0_S', icon: '📜' },
         ].map((stat, i) => (
           <div key={i} className="p-12 rounded-[4rem] bg-white/5 border-2 border-white/5 flex flex-col items-center gap-6 group hover:border-amber-500/20 transition-all">
              <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{stat.icon}</span>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.5em]">{stat.label}</p>
              <p className="text-4xl font-black italic text-white tracking-tighter">{stat.value}</p>
           </div>
         ))}
      </main>

      <footer className="h-16 px-16 bg-black border-t border-white/5 flex items-center justify-center text-[10px] font-black uppercase tracking-[1.5em] text-amber-500/10">
         Jay Swaminarayan! 🙏 Creator Recognized: Sumukha S.
      </footer>
    </div>
  );
};

export default CreatorDashboard;
