
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AppTheme } from '../types';

export const AICircuitLab: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [codeResult, setCodeResult] = useState('');
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'CODE' | 'VISUAL'>('CODE');
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

  const handleProcess = async () => {
    if (!prompt.trim() || loading) return;

    if (mode === 'VISUAL' && !hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }

    setLoading(true);
    setCodeResult('');
    setImageResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'CODE') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Architect perfect, high-fidelity circuit logic and hardware code for: "${prompt}". 
          Include pinouts, component lists, and optimized C++/Python logic. Architect: Sumukha S.`
        });
        setCodeResult(response.text || 'ERROR: Void code returned.');
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: `A photorealistic, highly detailed 3D isometric technical visualization of a circuit connection for: ${prompt}. Professional electronics workbench lighting, floating labels, premium PCB aesthetics, 4K resolution.` }] },
          config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setImageResult(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      alert("Lattice Synthesis Fault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[1500] flex flex-col font-orbitron animate-in fade-in overflow-hidden ${isDark ? 'bg-[#020202] text-white' : 'bg-white text-slate-900'}`}>
      <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between bg-black/60 backdrop-blur-3xl z-20">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center text-2xl shadow-xl">🔌</div>
          <div>
            <h2 className="text-xl font-black text-amber-400 uppercase italic tracking-tighter">Circuit_Singularity_v1</h2>
            <p className="text-[7px] uppercase tracking-[0.6em] text-amber-500/30">Neural Hardware Architect // Sumukha S.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="p-1 rounded-xl bg-white/5 flex">
              <button onClick={() => setMode('CODE')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${mode === 'CODE' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500'}`}>Code_Forge</button>
              <button onClick={() => setMode('VISUAL')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${mode === 'VISUAL' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500'}`}>3D_Manifest</button>
           </div>
           <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center font-bold">✕</button>
        </div>
      </header>

      <main className="flex-1 p-12 grid grid-cols-12 gap-8 overflow-hidden relative">
        <aside className="col-span-4 flex flex-col gap-8 bg-black/40 p-10 rounded-[4rem] border border-white/5 backdrop-blur-2xl">
           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-amber-500/40 tracking-[0.5em] px-4">Requirement_Lattice</h3>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your circuit intent... [e.g. ESP32 with OLED and BME280 sensor]"
                className="w-full h-48 bg-black/60 border-2 border-white/5 rounded-[2.5rem] p-8 text-xl font-bold italic text-white outline-none focus:border-amber-500/30 transition-all resize-none"
              />
              <button 
                onClick={handleProcess}
                disabled={loading || !prompt.trim()}
                className="w-full py-8 rounded-[2rem] bg-amber-500 text-black font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
              >
                {loading ? 'SYTHESIZING...' : 'Establish_Circuit'}
              </button>
           </div>
           <div className="mt-auto p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-[9px] font-black text-amber-500/40 uppercase tracking-widest mb-2">Protocol_Context</p>
              <p className="text-[10px] text-gray-500 italic leading-relaxed">
                "Direct neural translation of hardware intent into perfect logic and visual grounding."
              </p>
           </div>
        </aside>

        <section className="col-span-8 bg-black/60 rounded-[5rem] border-2 border-white/5 shadow-6xl relative overflow-hidden group">
           {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 animate-pulse text-amber-500">
                <div className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.8em]">Architecting Reality...</p>
             </div>
           ) : mode === 'CODE' ? (
             <div className="p-12 h-full overflow-y-auto custom-scrollbar">
                {codeResult ? (
                  <pre className="text-amber-50/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">{codeResult}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center opacity-10 uppercase font-black text-3xl tracking-[1em]">Logic_Void</div>
                )}
             </div>
           ) : (
             <div className="h-full flex items-center justify-center">
                {imageResult ? (
                  <img src={imageResult} className="w-full h-full object-contain animate-in zoom-in" />
                ) : (
                  <div className="flex flex-col items-center gap-8 opacity-10 grayscale">
                    <div className="text-9xl">📐</div>
                    <p className="text-3xl font-black uppercase tracking-[1em]">Spatial_Void</p>
                  </div>
                )}
             </div>
           )}
        </section>
      </main>

      <footer className="h-10 px-12 bg-black border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.8em] text-amber-500/10">
         <span>CIRCUIT_SYNC: ACTIVE</span>
         <span>ARCHITECTURE: SUMUKHA_S</span>
         <span>GREETING: JAY SWAMINARAYAN! 🙏</span>
      </footer>
    </div>
  );
};
