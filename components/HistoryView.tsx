
import React, { useState } from 'react';

export const HistoryView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <h2 className="text-xl font-black text-cyan-400 uppercase italic tracking-tighter">Manifest_History</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white">✕</button>
      </header>

      <main className="flex-1 p-12 flex flex-col items-center justify-center text-center gap-10 opacity-20">
         <div className="text-9xl">📜</div>
         <div className="space-y-4">
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Lattice Records</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.8em]">Archive node under construction // Sumukha S.</p>
         </div>
      </main>
    </div>
  );
};
