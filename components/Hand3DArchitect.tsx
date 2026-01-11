import React, { useState } from 'react';
import { AppTheme } from '../types';

export const Hand3DArchitect: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-black/95 animate-in fade-in duration-700 flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-5xl font-orbitron font-black uppercase text-cyan-400 neon-text">Spatial Architect</h2>
      <button onClick={onClose} className="mt-12 p-8 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase text-xs hover:bg-red-600 transition-all">Exit Studio</button>
      <div className="absolute bottom-12 text-cyan-500/20 font-black uppercase tracking-[1em]">Hand_Sync_Idle</div>
    </div>
  );
};