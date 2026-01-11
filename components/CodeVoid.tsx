import React, { useState } from 'react';
import { AppTheme } from '../types';

export const CodeVoid: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-[400] bg-[#010204] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-700 overflow-hidden font-orbitron">
      <div className="w-full h-full max-w-[1700px] md:rounded-[6rem] border-2 border-blue-500/20 bg-[#020408] flex flex-col shadow-4xl relative overflow-hidden">
        <header className="h-32 border-b border-white/5 px-20 flex items-center justify-between backdrop-blur-3xl bg-black/40">
          <h2 className="text-5xl font-black text-blue-400 italic tracking-tighter uppercase">Logic_Singularity</h2>
          <button onClick={onClose} className="px-12 py-5 rounded-[2.5rem] bg-white/5 border-2 border-white/5 text-blue-400 text-[12px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">Disconnect</button>
        </header>
        <main className="flex-1 flex items-center justify-center text-blue-500/10 uppercase font-black text-7xl italic">Logic_Lattice_Idle</main>
      </div>
    </div>
  );
};