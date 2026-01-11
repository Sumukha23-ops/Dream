
import React, { useState, useEffect, useRef } from 'react';
import { AppTheme } from '../types';

export const GrapherNexus: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  const [equation, setEquation] = useState('Math.sin(x) * Math.cos(x / 5)');
  const [scale, setScale] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(37, 99, 235, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 50) {
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += 50) {
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(37, 99, 235, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.stroke();

    // Plot
    ctx.strokeStyle = isDark ? '#22d3ee' : '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    try {
      for (let px = 0; px < w; px++) {
        const x = (px - w/2) / scale;
        // eslint-disable-next-line no-eval
        const y = eval(equation);
        const py = h/2 - y * scale;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } catch (e) {
      // Equation fault
    }
  }, [equation, scale, isDark]);

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron animate-in zoom-in duration-500 overflow-hidden">
      <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500 text-black flex items-center justify-center text-2xl shadow-xl">📉</div>
          <div>
            <h2 className="text-xl font-black text-cyan-400 uppercase italic tracking-tighter">Grapher_Nexus</h2>
            <p className="text-[7px] uppercase tracking-[0.6em] text-cyan-500/30">Logic Visualization // Sumukha S.</p>
          </div>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center font-bold">✕</button>
      </header>

      <main className="flex-1 p-12 flex gap-12 overflow-hidden">
        <aside className="w-[400px] flex flex-col gap-8 bg-black/40 p-10 rounded-[4rem] border border-white/5 backdrop-blur-2xl">
           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-cyan-500/40 tracking-[0.5em] px-4">Function_Lattice</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[8px] font-bold text-gray-500 uppercase px-4">Input Equation (y = ...)</label>
                    <textarea 
                      value={equation}
                      onChange={(e) => setEquation(e.target.value)}
                      className="w-full h-32 bg-black border-2 border-white/5 rounded-[2rem] p-6 text-xl font-mono text-cyan-400 outline-none focus:border-cyan-500/30"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-bold text-gray-500 uppercase px-4">Visual Scale: {scale}</label>
                    <input 
                      type="range" min="10" max="200" value={scale} 
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                 </div>
              </div>
           </div>
           <div className="mt-auto p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
              <p className="text-[8px] font-black text-cyan-500/20 uppercase tracking-widest text-center">Mathematical Context</p>
              <p className="text-[10px] text-gray-500 italic leading-relaxed text-center">
                "Visualization of sovereign logical structures through kinetic geometry."
              </p>
           </div>
        </aside>

        <section className="flex-1 bg-black/60 rounded-[5rem] border-2 border-white/5 shadow-6xl relative overflow-hidden group">
           <canvas ref={canvasRef} width={1200} height={800} className="w-full h-full opacity-90 transition-opacity" />
           <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-cyan-500">Render_Grid_0x7A</span>
              <span className="text-[10px] font-mono text-white">X_DOMAIN: [-12, 12]</span>
           </div>
        </section>
      </main>

      <footer className="h-10 px-12 bg-black border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.8em] text-cyan-500/10">
         <span>GRAPHER_SYNC: ACTIVE</span>
         <span>ARCHITECT: SUMUKHA_S</span>
      </footer>
    </div>
  );
};
