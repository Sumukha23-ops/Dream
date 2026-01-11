import React, { useState } from 'react';
import { AppTheme } from '../types';

export const NeuralVortexGame: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-500">
      <h2 className="text-5xl font-orbitron font-black tracking-tighter text-cyan-400">Neural Vortex</h2>
      <button onClick={onClose} className="mt-12 p-10 bg-white/10 rounded-full text-white font-black uppercase hover:bg-red-600 transition-all">Abandond Quest</button>
    </div>
  );
};