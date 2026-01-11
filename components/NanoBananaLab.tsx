
import React, { useState, useEffect } from 'react';
import { AppTheme } from '../types';
import { GoogleGenAI } from '@google/genai';

interface NanoBananaLabProps {
  theme: AppTheme;
  onClose: () => void;
}

const BANANA_PRESETS = [
  { id: 'fusion', label: '🍌 Banana Fusion', prompt: 'Incorporate banana-yellow neon highlights and tropical cyber-organic textures into this scene.' },
  { id: 'vapor', label: '🌊 Vapor-Gold', prompt: '80s vaporwave aesthetic but with a dominant gold and amber color palette, extremely high detail.' },
  { id: 'liquid', label: '💧 Liquid Logic', prompt: 'Surrealist liquid metal textures melting into abstract banana shapes, museum lighting.' },
  { id: 'hyper', label: '⚡ Hyper-Sync', prompt: 'Photorealistic macro shot, ultra-sharp focus, cinematic lighting, 8k resolution.' },
];

const NanoBananaLab: React.FC<NanoBananaLabProps> = ({ theme, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState<'FLASH' | 'PRO'>('FLASH');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('STANDBY');
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

  const generate = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    // Pro model requires user API key
    if (modelType === 'PRO' && !hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }

    setIsGenerating(true);
    setResult(null);
    setStatus('SYNCING_LATTICE');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = modelType === 'PRO' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      
      setStatus('INJECTING_NEURAL_SEED');
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts: [{ text: activePrompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: modelType === 'PRO' ? "1K" : undefined
          }
        }
      });

      setStatus('MANIFESTING_IMAGE');
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
      setStatus('SUCCESS');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setStatus('AUTH_ERROR_RETRYING');
      } else {
        setStatus('FAULT_DETECTED');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 font-orbitron overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0800] bg-[radial-gradient(#fbbf24_0.5px,transparent_0.5px)] bg-[size:30px_30px] opacity-10"></div>
      
      <div className="w-full h-full max-w-[1600px] bg-[#050505] rounded-[5rem] border-2 border-amber-500/20 flex flex-col shadow-6xl relative overflow-hidden">
        
        <header className="h-28 border-b border-white/5 px-16 flex items-center justify-between bg-black/60 backdrop-blur-3xl">
           <div className="flex items-center gap-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full group-hover:bg-amber-500/40 transition-all"></div>
                <div className="w-16 h-16 rounded-[2rem] bg-amber-500 text-black flex items-center justify-center text-4xl shadow-2xl relative z-10 animate-bounce">🍌</div>
              </div>
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-amber-400 uppercase">Nano_Banana_Lab</h1>
                <p className="text-[9px] uppercase tracking-[0.6em] text-amber-500/30">Titan Multi-Generative Engine // Sumukha S.</p>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="p-1.5 rounded-[2.5rem] bg-white/5 border border-white/10 flex gap-2 shadow-inner">
                 <button onClick={() => setModelType('FLASH')} className={`px-8 py-3 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${modelType === 'FLASH' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Nano_Flash</button>
                 <button onClick={() => setModelType('PRO')} className={`px-8 py-3 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${modelType === 'PRO' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Nano_Pro</button>
              </div>
              <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all border border-white/10 flex items-center justify-center text-2xl">✕</button>
           </div>
        </header>

        <main className="flex-1 flex overflow-hidden min-h-0">
          <aside className="w-[450px] border-r border-white/5 p-12 flex flex-col gap-10 bg-black/40 overflow-y-auto custom-scrollbar">
             <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500/30 px-4">Neural_Presets</h3>
                <div className="grid grid-cols-1 gap-4">
                   {BANANA_PRESETS.map(p => (
                     <button 
                      key={p.id}
                      onClick={() => generate(p.prompt)}
                      disabled={isGenerating}
                      className="p-8 rounded-[3.5rem] border-2 border-white/5 bg-white/5 text-left flex items-center gap-8 group hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-500"
                     >
                       <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{p.label.split(' ')[0]}</span>
                       <div>
                         <p className="text-[15px] font-black uppercase tracking-widest text-amber-100">{p.label.split(' ')[1]}</p>
                         <p className="text-[9px] opacity-30 font-bold uppercase tracking-tighter mt-1">Instant Manifest</p>
                       </div>
                     </button>
                   ))}
                </div>
             </div>

             <div className="mt-auto p-10 rounded-[3.5rem] bg-amber-500/5 border-2 border-amber-500/10 flex flex-col gap-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-amber-500/40">
                   <span>Lattice_Status</span>
                   <span className="text-green-500 animate-pulse">Online</span>
                </div>
                <p className="text-xs font-medium text-amber-50/60 leading-relaxed italic">
                  "Generative weights optimized for high-energy architectural visualization by Sumukha S."
                </p>
             </div>
          </aside>

          <section className="flex-1 flex flex-col p-12 gap-10 overflow-hidden relative">
             <div className={`flex-1 rounded-[5rem] border-2 relative overflow-hidden transition-all duration-700 bg-black/60 ${isGenerating ? 'border-amber-500/40 shadow-[0_0_150px_rgba(251,191,36,0.15)]' : 'border-white/5 shadow-2xl'}`}>
                {result ? (
                  <img src={result} className="w-full h-full object-contain animate-in zoom-in duration-1000" alt="manifest" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-10 opacity-[0.03]">
                    <div className="text-[150px] animate-pulse">🍌</div>
                    <p className="text-4xl font-black uppercase tracking-[2em]">Void_Canvas</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-10 z-20">
                     <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-amber-500 animate-ping absolute inset-0 opacity-20"></div>
                        <div className="w-32 h-32 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                     </div>
                     <p className="text-xl font-black uppercase tracking-[1em] text-amber-500 animate-pulse">{status}</p>
                  </div>
                )}
             </div>

             <div className="h-44 flex flex-col gap-6">
                <div className="relative group">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-amber-500/40 font-black text-2xl group-focus-within:text-amber-500">✨</div>
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generate()}
                    placeholder="Describe a vision of supreme synthesis..."
                    className="w-full h-28 bg-black/60 border-2 border-white/5 rounded-[3.5rem] pl-20 pr-44 outline-none text-2xl font-bold italic text-amber-50 focus:border-amber-500/30 transition-all placeholder:text-white/5"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                     <button 
                      onClick={() => generate()}
                      disabled={isGenerating || !prompt.trim()}
                      className="h-16 px-12 rounded-[2.5rem] bg-amber-500 text-black font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-4xl disabled:opacity-20"
                     >
                       Manifest
                     </button>
                  </div>
                </div>
             </div>
          </section>
        </main>

        <footer className="h-16 px-16 bg-black border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.8em] text-amber-500/10">
           <span>MODEL: {modelType === 'PRO' ? 'GEMINI_3.0_PRO' : 'GEMINI_2.5_FLASH'}</span>
           <span>RESOLUTION: 1024x576_LATTICE_SYNC</span>
           <span>ARCHITECT_SIGNED: SUMUKHA_S</span>
        </footer>
      </div>
    </div>
  );
};

export default NanoBananaLab;
