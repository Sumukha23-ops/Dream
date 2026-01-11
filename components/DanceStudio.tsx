
import React, { useState } from 'react';
import { AppTheme } from '../types';

interface DanceStudioProps {
  theme: AppTheme;
  onClose: () => void;
}

const DanceStudio: React.FC<DanceStudioProps> = ({ theme, onClose }) => {
  const [songTitle, setSongTitle] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const isDark = theme === AppTheme.DARK;

  const analyzeDance = () => {
    if (!songTitle.trim()) return;
    setIsAnalyzing(true);
    setSteps([]);
    setTimeout(() => {
      setSteps([
        "Double step right, hold with a robotic tilt.",
        "Spin 360 CCW, arms at 90-degree lock.",
        "Glide backward (Lattice walk), mimic neural flow.",
        "Sharp arm thrusts on the 4th beat.",
        "Final pose: Sovereign core collapse."
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full h-[80vh] rounded-[4rem] p-12 border-2 border-emerald-500/20 bg-gray-950 flex flex-col gap-10 shadow-6xl overflow-hidden">
        
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-emerald-500 text-black flex items-center justify-center text-4xl">🕺</div>
            <div>
              <h2 className="text-4xl font-orbitron font-black text-emerald-400 tracking-tighter uppercase italic">Motion_Lattice</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-500/40">AI Choreography Studio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-5 rounded-3xl bg-white/5 hover:bg-red-500 transition-all border border-white/5">✕</button>
        </header>

        <div className="flex-1 flex flex-col gap-10 overflow-hidden">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Inject track signature or style..."
              className="flex-1 py-7 px-10 rounded-[2.5rem] bg-black/60 border-2 border-white/5 outline-none text-2xl font-bold italic text-white focus:border-emerald-500/40"
            />
            <button 
              onClick={analyzeDance}
              className="px-12 rounded-[2.5rem] bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
            >
              Analyze
            </button>
          </div>

          <div className="flex-1 rounded-[3rem] border-2 border-white/5 bg-black/40 p-12 overflow-y-auto custom-scrollbar">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 opacity-30 animate-pulse">
                <div className="text-6xl">🔄</div>
                <p className="text-sm font-black uppercase tracking-[1em]">Scanning_BPM_Lattice...</p>
              </div>
            ) : steps.length > 0 ? (
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-8 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-4xl font-mono font-black text-emerald-500/20">{(i + 1).toString().padStart(2, '0')}</span>
                    <p className="text-2xl font-bold text-emerald-50 italic">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-[0.05] gap-8">
                <div className="text-9xl">🕴️</div>
                <p className="text-2xl font-black uppercase tracking-[2em]">Awaiting_Neural_Sync</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DanceStudio;
