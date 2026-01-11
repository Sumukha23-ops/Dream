import React, { useState } from 'react';
import { AppTheme } from '../types';

export const NeuralSlingshotGame: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-black animate-in fade-in duration-700 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-orbitron font-black text-white uppercase tracking-tighter neon-text">Kinetic Impact</h2>
      <button onClick={onClose} className="mt-12 px-12 py-5 rounded-full bg-amber-500 text-black font-black uppercase">Terminate Simulation</button>
    </div>
  );
};