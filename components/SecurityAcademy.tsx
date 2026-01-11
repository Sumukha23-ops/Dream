import React, { useState } from 'react';
import { AppTheme } from '../types';

export const SecurityAcademy: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center p-0 md:p-8 animate-in fade-in zoom-in duration-700 font-mono">
      <div className="w-full h-full max-w-[1700px] flex flex-col border-2 border-emerald-500/40 bg-[#010602] relative overflow-hidden shadow-6xl rounded-[4rem]">
        <header className="flex-none h-28 border-b border-emerald-500/20 px-12 flex items-center justify-between bg-black/80 backdrop-blur-3xl">
          <h1 className="text-4xl font-orbitron font-black text-emerald-400 tracking-tighter uppercase italic">Wraith_Core_v11.5</h1>
          <button onClick={onClose} className="px-10 py-4 rounded-3xl border-2 border-red-500/30 text-red-500 text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all">Terminate</button>
        </header>
        <main className="flex-1 flex items-center justify-center text-emerald-500/20 uppercase font-black text-6xl italic">
          Restricted_Sovereign_Zone
        </main>
      </div>
    </div>
  );
};