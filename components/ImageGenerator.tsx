import React, { useState } from 'react';
import { AppTheme } from '../types';
import { geminiService } from '../services/geminiService';

interface ImageGeneratorProps { 
  theme: AppTheme; 
  onClose: () => void; 
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ theme, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const generate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const img = await geminiService.generateImage(prompt, '1:1');
      setResult(img);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/98 flex items-center justify-center p-4 animate-in fade-in duration-500 font-orbitron overflow-hidden">
      <div className="w-full h-full max-w-[1600px] bg-[#050505] rounded-[5rem] border-2 border-amber-500/10 flex flex-col shadow-6xl relative overflow-hidden">
        <header className="h-28 border-b border-white/5 px-16 flex items-center justify-between bg-black/60 backdrop-blur-3xl">
           <h1 className="text-4xl font-black italic tracking-tighter text-amber-400 uppercase">Visionary_Genesis</h1>
           <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all flex items-center justify-center text-2xl">✕</button>
        </header>
        <main className="flex-1 flex flex-col p-12 gap-10 overflow-hidden">
           <div className="flex-1 rounded-[5rem] border-2 border-white/5 relative overflow-hidden bg-black/60">
              {result ? <img src={result} className="w-full h-full object-contain" /> : <p className="h-full flex items-center justify-center opacity-10 uppercase font-black text-4xl">Void_Canvas</p>}
              {isGenerating && <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-pulse text-amber-500 uppercase font-black">Manifesting...</div>}
           </div>
           <div className="flex gap-6">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe a dream sequence..." className="flex-1 h-28 bg-black/60 border-2 border-white/5 rounded-[3rem] p-8 text-2xl font-bold italic text-white outline-none focus:border-amber-400/30" />
              <button onClick={generate} disabled={isGenerating || !prompt.trim()} className="h-28 px-12 rounded-[2.5rem] bg-amber-400 text-black font-black uppercase text-xs shadow-4xl">Manifest</button>
           </div>
        </main>
      </div>
    </div>
  );
};