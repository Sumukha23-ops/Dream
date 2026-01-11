
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppTheme } from '../types';

const ARCHETYPES = [
  { id: 'platformer', label: '🏃 Platformer', desc: 'Precision movement & gravity' },
  { id: 'bullet_hell', label: '🔫 Bullet Hell', desc: 'Pattern-based particle chaos' },
  { id: 'physics', label: '⚛️ Physics Lab', desc: 'Kinetic interaction & rigid bodies' },
  { id: 'rpg', label: '⚔️ Rogue-Lite', desc: 'State-driven dungeon crawling' },
];

export const GameBuilder: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [selectedArchetype, setSelectedArchetype] = useState(ARCHETYPES[0]);
  const [thoughtLog, setThoughtLog] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const addLog = (msg: string) => setThoughtLog(prev => [msg, ...prev].slice(0, 5));

  const generateGame = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setThoughtLog(['Initializing Sovereign Architect...']);
    setStatus('SYNCING_PRO_CORE');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const updateInterval = setInterval(() => {
        const phases = [
          "Analyzing physics vectors...",
          "Synthesizing state machine...",
          "Mapping control buffers...",
          "Optimizing rendering pipeline...",
          "Injecting procedural assets...",
          "Calibrating collision lattice..."
        ];
        addLog(phases[Math.floor(Math.random() * phases.length)]);
      }, 3000);

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Architect a high-fidelity, polished, and self-contained browser game based on this vision: "${prompt}". 
        Archetype: ${selectedArchetype.label}.
        
        MANDATORY SOVEREIGN SPECIFICATIONS:
        1. Return ONLY raw HTML. No markdown blocks (no \`\`\`html).
        2. Framework: Include Phaser 3 (https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js) OR Matter.js for high-fidelity simulation.
        3. Aesthetics: Use a sophisticated Dark/Gold elite palette. 
        4. State Management: Implement a robust state-driven architecture.
        5. Procedural Audio: Include a WebAudio class for dynamic sound effects (jump, hit, win).
        6. Responsive: Scale logic to fit any neural interface (desktop/mobile).
        7. Credit: A footer reading "Architected by Sumukha S. // Sovereign Arcade Forge v2.0".`,
        config: { 
          temperature: 0.9,
          thinkingConfig: { thinkingBudget: 12000 } // Deep reasoning for "Best in World" architecture
        }
      });
      
      clearInterval(updateInterval);
      let code = response.text || '';
      // Aggressive cleaning of potential markdown noise
      code = code.replace(/^```html\n?|```javascript\n?|```css\n?|```\n?$/gm, '').trim();
      
      setGeneratedCode(code);
      setStatus('MANIFEST_COMPLETE');
      setThoughtLog(['Reality Manifested Successfully.']);
    } catch (e) { 
      console.error(e);
      setStatus('LATTICE_FAULT');
      setThoughtLog(['Critical Link Fault: Synthesis Aborted.']);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (iframeRef.current && generatedCode) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generatedCode);
        doc.close();
      }
    }
  }, [generatedCode]);

  return (
    <div className="fixed inset-0 z-[1500] bg-black/98 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-24 border-b border-white/5 px-12 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-6">
           <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-all animate-pulse"></div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-4xl shadow-2xl relative z-10">🎮</div>
           </div>
           <div>
              <h2 className="text-3xl font-black text-amber-400 uppercase italic tracking-tighter">Arcade_Forge_Sovereign</h2>
              <p className="text-[8px] uppercase tracking-[0.6em] text-amber-500/30">Supreme Reality Synthesis // Sumukha S.</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden lg:flex flex-col items-end gap-1 px-8 border-r border-white/5">
              <span className="text-[7px] font-black uppercase text-gray-600 tracking-widest">Architect_Status</span>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${loading ? 'text-amber-500 animate-pulse' : 'text-green-500'}`}>
                {loading ? 'REASONING...' : 'LATTICE_STABLE'}
              </span>
           </div>
           <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center text-xl font-bold">✕</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-12 overflow-hidden gap-10 relative">
        {!generatedCode && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-16 animate-in zoom-in duration-700 max-w-6xl mx-auto w-full">
            <div className="space-y-4">
               <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">Master <span className="text-amber-400">Game Architect</span></h3>
               <p className="text-[12px] text-gray-500 uppercase tracking-[0.8em]">Deep-Reasoning Neural Engine v16.0</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
               {ARCHETYPES.map(a => (
                 <button key={a.id} onClick={() => setSelectedArchetype(a)} 
                  className={`p-8 rounded-[3rem] border-2 transition-all text-left flex flex-col gap-3 group ${selectedArchetype.id === a.id ? 'bg-amber-500 text-black border-amber-400 shadow-4xl' : 'bg-white/5 border-white/5 text-gray-500 hover:border-amber-500/30'}`}>
                   <span className="text-3xl group-hover:scale-110 transition-transform">{a.label.split(' ')[0]}</span>
                   <div>
                      <p className={`text-[13px] font-black uppercase ${selectedArchetype.id === a.id ? 'text-black' : 'text-white'}`}>{a.label.split(' ')[1]} {a.label.split(' ')[2]}</p>
                      <p className={`text-[8px] font-bold uppercase ${selectedArchetype.id === a.id ? 'text-black/60' : 'text-gray-600'}`}>{a.desc}</p>
                   </div>
                 </button>
               ))}
            </div>

            <div className="w-full relative group">
               <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                className="w-full h-48 bg-black border-2 border-white/10 rounded-[4rem] p-12 outline-none text-3xl font-bold text-white focus:border-amber-500/40 transition-all text-center italic resize-none placeholder:text-white/5 shadow-inner" 
                placeholder="Describe a supreme simulation vision..." 
               />
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                  <button onClick={generateGame} className="px-20 py-8 rounded-[3rem] bg-amber-500 text-black font-black uppercase text-[15px] tracking-[0.5em] hover:scale-[1.05] active:scale-95 transition-all shadow-6xl shadow-amber-500/40">Synthesize Simulation</button>
               </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-12 animate-pulse text-amber-500">
             <div className="relative">
                <div className="w-48 h-48 border-4 border-amber-500/10 rounded-full animate-ping"></div>
                <div className="w-48 h-48 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_80px_rgba(251,191,36,0.3)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-4xl">🧠</span>
                </div>
             </div>
             <div className="text-center space-y-6 max-w-xl">
                <p className="text-3xl font-black uppercase tracking-[0.8em]">Deep_Thinking...</p>
                <div className="flex flex-col gap-3">
                   {thoughtLog.map((log, i) => (
                     <p key={i} className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 animate-in slide-in-from-top-2" style={{ opacity: 1 - (i * 0.2) }}>
                       > {log}
                     </p>
                   ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-8 animate-in slide-in-from-bottom-12 duration-1000">
             <div className="flex justify-between items-center px-10">
                <div className="flex items-center gap-6">
                   <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                   <span className="text-[14px] font-black text-amber-400 uppercase tracking-[0.6em] italic">Simulation_Node_Active_v2.0</span>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setGeneratedCode('')} className="px-8 py-3 bg-white/5 border border-white/10 text-gray-500 text-[9px] font-black uppercase tracking-widest hover:text-white rounded-full transition-all">Recalibrate</button>
                   <button onClick={() => setGeneratedCode('')} className="px-8 py-3 bg-red-600/10 border border-red-500/30 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white rounded-full transition-all">Purge Node</button>
                </div>
             </div>
             <div className="flex-1 border-4 border-white/5 rounded-[5rem] overflow-hidden bg-white shadow-6xl relative group">
                <iframe ref={iframeRef} className="w-full h-full border-none" />
                <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <p className="text-[10px] font-black uppercase text-black/20 tracking-[1em]">Immersion_Active</p>
                </div>
             </div>
          </div>
        )}
      </main>
      
      <footer className="h-16 bg-black border-t border-white/5 flex items-center justify-center gap-24 text-[9px] font-black text-gray-800 uppercase tracking-[1em]">
         <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>BUILD: NEURAL_INSTANTIATION_PRO</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>ARCHITECT: SUMUKHA_S</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>PROTOCOL: G-V16_STABLE</span>
         </div>
      </footer>
    </div>
  );
};
