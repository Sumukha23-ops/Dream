import React, { useState, useEffect } from 'react';
import { AppTheme } from '../types';
import { geminiService } from '../services/geminiService';

interface AnimationStudioProps {
  theme: AppTheme;
  onClose: () => void;
}

export const VeoGenerator: React.FC<AnimationStudioProps> = ({ theme, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const ok = await window.aistudio.hasSelectedApiKey();
      setHasKey(ok);
    };
    checkKey();
  }, []);

  const selectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    if (!hasKey) await selectKey();
    setIsGenerating(true);
    setResultVideo(null);
    setStatus('Dreaming motion sequence...');
    try {
      const { url } = await geminiService.generateVeoVideo(prompt, aspectRatio);
      setResultVideo(url);
      setStatus('Manifestation complete.');
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        await selectKey();
      }
      setStatus('Synthesis failed.');
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className={`max-w-5xl w-full h-[85vh] rounded-[3.5rem] p-10 border-2 flex flex-col gap-8 relative overflow-hidden transition-all ${isDark ? 'bg-gray-950 border-white/5 shadow-2xl' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-orbitron font-black uppercase tracking-tighter text-amber-400">Motion Studio</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold mt-1">Veo 3.1 Neural Processing</p>
          </div>
          <button onClick={onClose} className="p-4 rounded-3xl glass hover:bg-red-600 transition-all">✕</button>
        </div>
        <div className="flex-1 grid md:grid-cols-12 gap-8 overflow-hidden">
          <div className="md:col-span-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="High-speed cinematic sequence..." className={`w-full h-56 py-5 px-6 rounded-3xl border-2 outline-none transition-all resize-none text-[15px] ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-400' : 'bg-slate-50 border-slate-200'}`} />
            <div className="flex gap-2">
              <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase ${aspectRatio === '16:9' ? 'bg-amber-400 text-black' : 'bg-white/5'}`}>Wide</button>
              <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase ${aspectRatio === '9:16' ? 'bg-amber-400 text-black' : 'bg-white/5'}`}>Portrait</button>
            </div>
            <button onClick={generate} disabled={isGenerating || !prompt.trim()} className="mt-auto py-6 rounded-[2rem] font-black uppercase tracking-[0.5em] text-xs transition-all shadow-xl bg-amber-400 text-black">{isGenerating ? 'Synthesizing...' : 'Launch Synthesis'}</button>
          </div>
          <div className="md:col-span-7 flex flex-col">
            <div className="flex-1 rounded-[3rem] border-2 relative flex items-center justify-center overflow-hidden bg-black border-white/5">
              {resultVideo ? <video src={resultVideo} controls autoPlay loop className="w-full h-full object-contain" /> : <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">{status || "Awaiting neural parameters."}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};