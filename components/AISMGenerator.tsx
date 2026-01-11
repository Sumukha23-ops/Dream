import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, MusicSequence, PersonalityMode } from '../types';
import { sovereignAPI } from '../services/SovereignAPI';
import { audioService } from '../services/audioService';

interface AISMGeneratorProps {
  theme: AppTheme;
  onClose: () => void;
}

const PERSONA_VIBES = [
  { id: PersonalityMode.SOVEREIGN, label: '🏛️ Sovereign', desc: 'Elite Mastery' },
  { id: PersonalityMode.ORACLE, label: '👁️ Oracle', desc: 'Mystic Truth' },
  { id: PersonalityMode.MUSE, label: '🎨 Muse', desc: 'Creative Flow' },
  { id: PersonalityMode.GHOST, label: '💀 Ghost', desc: 'Shadow Logic' },
];

export const AISMGenerator: React.FC<AISMGeneratorProps> = ({ theme, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVocalizing, setIsVocalizing] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<MusicSequence | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<PersonalityMode>(PersonalityMode.SOVEREIGN);
  const [status, setStatus] = useState<'IDLE' | 'COMPOSING' | 'PERFORMING'>('IDLE');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      const res = audioService.getAiResonance();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = isVocalizing ? '#f472b6' : '#fbbf24';
      ctx.lineWidth = 2 + res * 10;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      for (let i = 0; i < canvas.width; i++) {
        const y = Math.sin(i * 0.02 + frame * 0.1) * (res * 250) + (canvas.height / 2);
        ctx.lineTo(i, y);
      }
      ctx.stroke();
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [isVocalizing]);

  const generateAndPlay = async () => {
    if (!customPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setStatus('COMPOSING');
    audioService.initContext();
    audioService.stopAll();

    try {
      const sequence = await sovereignAPI.generateMusic(customPrompt, selectedPersona);
      setCurrentSequence(sequence);
      audioService.playSequence(sequence);
      if (sequence.lyrics) {
        setIsVocalizing(true);
        setStatus('PERFORMING');
        const vocalData = await sovereignAPI.textToSpeech(sequence.lyrics, selectedPersona);
        if (vocalData) {
          const source = await audioService.playBase64Audio(vocalData);
          source.addEventListener('ended', () => { setIsVocalizing(false); setStatus('IDLE'); });
        }
      }
    } catch (err) { setStatus('IDLE'); } finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center animate-in zoom-in duration-500 overflow-hidden font-orbitron">
      <div className="absolute inset-0 bg-[#020202] bg-[radial-gradient(#fbbf24_0.5px,transparent_0.5px)] bg-[size:40px_40px] opacity-10"></div>
      <div className="w-full h-full max-w-[1700px] flex flex-col p-12 relative z-10">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-8">
             <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-amber-500 text-black text-4xl shadow-4xl">🎤</div>
             <div>
                <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Neural_Stage_v2</h1>
                <p className="text-[10px] uppercase tracking-[0.6em] text-amber-500/40 mt-1">Multi-Persona Harmonic Synthesis // Sumukha S.</p>
             </div>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-600 transition-all flex items-center justify-center text-xl">✕</button>
        </header>

        <main className="flex-1 flex flex-col gap-10 overflow-hidden">
          <div className={`flex-1 rounded-[4rem] border-2 relative overflow-hidden transition-all duration-700 bg-black/60 ${isVocalizing ? 'border-pink-500/40 shadow-[0_0_100px_rgba(236,72,153,0.15)]' : 'border-amber-500/20'}`}>
            <canvas ref={canvasRef} width={1400} height={500} className="w-full h-full opacity-70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-24 z-20">
              {currentSequence ? (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase">{currentSequence.title}</h2>
                  <div className="p-12 px-20 rounded-[4rem] bg-black/40 backdrop-blur-3xl border-2 border-white/5">
                    <p className="text-4xl font-bold italic text-white/90 leading-relaxed tracking-tight">{currentSequence.lyrics}</p>
                  </div>
                </div>
              ) : <p className="text-2xl font-black uppercase tracking-[1em] opacity-10">Awaiting_Vocal_Manifest</p>}
            </div>
            <div className="absolute bottom-10 left-10 flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${isVocalizing ? 'bg-pink-500 animate-ping' : 'bg-gray-700'}`}></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/40">{status} [PERSONA: {selectedPersona}]</span>
            </div>
          </div>

          <div className="h-[35%] flex gap-10">
            <div className="w-[450px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-4">
               {PERSONA_VIBES.map(v => (
                 <button key={v.id} onClick={() => setSelectedPersona(v.id)} disabled={isGenerating} className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-6 group ${selectedPersona === v.id ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 border-white/5 hover:border-amber-500/40'}`}>
                   <span className="text-3xl group-hover:scale-125 transition-transform">{v.label.split(' ')[0]}</span>
                   <div>
                     <p className={`text-[14px] font-black uppercase ${selectedPersona === v.id ? 'text-black' : 'text-white'}`}>{v.label.split(' ')[1]}</p>
                     <p className={`text-[9px] font-bold uppercase ${selectedPersona === v.id ? 'text-black/60' : 'text-gray-500'}`}>{v.desc}</p>
                   </div>
                 </button>
               ))}
            </div>
            <div className="flex-1 relative">
               <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Describe a rhythmic vision..." className="w-full h-full bg-black/40 border-2 border-white/5 rounded-[3rem] p-10 outline-none text-2xl font-bold italic text-white focus:border-amber-500/30 transition-all placeholder:text-white/5 resize-none" />
               <button onClick={generateAndPlay} disabled={isGenerating || !customPrompt.trim()} className={`absolute bottom-8 right-8 w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isGenerating ? 'bg-gray-800 text-gray-500' : 'bg-amber-500 text-black hover:scale-110 shadow-4xl'}`}>
                  <svg className={`w-10 h-10 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={3} /></svg>
               </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};