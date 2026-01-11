
import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, MusicSequence, Attachment } from '../types';
import { geminiService } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { PIANO_NOTES } from '../constants';

interface AudioAlchemyStudioProps {
  theme: AppTheme;
  onClose: () => void;
}

const AudioAlchemyStudio: React.FC<AudioAlchemyStudioProps> = ({ theme, onClose }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [instrument, setInstrument] = useState<'piano' | 'synth' | 'bass' | 'choir' | 'percussion'>('piano');
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      const res = audioService.getAiResonance();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const bars = 50;
      const barWidth = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const h = (res * 200) + Math.sin(frame * 0.1 + i * 0.2) * 20;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.1 + (h / 300)})`;
        ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 2, h);
      }
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setSelectedFile({ name: file.name, mimeType: file.type, data: base64 });
    };
    reader.readAsDataURL(file);
  };

  const playNote = (freq: number) => {
    audioService.playInstrument(instrument, freq, 0.4, 1.2);
  };

  const generateSong = async () => {
    if (!prompt.trim() && !selectedFile) return;
    setStatus('COMPOSING');
    try {
      const sequence = await geminiService.generateMusicSequence(prompt, selectedFile || undefined);
      setLyrics(sequence.lyrics || '');
      audioService.playSequence(sequence);
      setStatus('PERFORMING');
    } catch (e) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/98 flex items-center justify-center p-6 animate-in zoom-in duration-700">
      <div className="w-full h-full max-w-7xl rounded-[4rem] border-2 border-amber-500/20 bg-gray-950 flex flex-col shadow-6xl overflow-hidden">
        
        <header className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
           <div className="flex items-center gap-8">
             <div className="w-16 h-16 rounded-[1.8rem] bg-amber-500 text-black flex items-center justify-center text-3xl">🎙️</div>
             <div>
               <h2 className="text-4xl font-orbitron font-black text-amber-400 tracking-tighter uppercase italic">Audio_Alchemy</h2>
               <p className="text-[10px] uppercase tracking-[0.6em] text-amber-500/40">Sovereign Multi-Track Studio</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border-2 ${status === 'PERFORMING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse' : 'bg-white/5 text-gray-600 border-white/10'}`}>
                {status}
              </span>
              <button onClick={onClose} className="p-5 rounded-3xl bg-white/5 hover:bg-red-500 transition-all border border-white/5">✕</button>
           </div>
        </header>

        <main className="flex-1 flex min-h-0">
          <aside className="w-80 border-r border-white/5 p-8 flex flex-col gap-6 bg-black/20">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30">Presets</h3>
            {(['piano', 'synth', 'bass', 'choir', 'percussion'] as const).map(inst => (
              <button 
                key={inst} 
                onClick={() => setInstrument(inst)}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left uppercase text-[10px] font-black tracking-widest ${instrument === inst ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 border-white/5 text-gray-500'}`}
              >
                {inst}
              </button>
            ))}
            
            <div className="mt-auto flex flex-col gap-4">
              <div className="p-6 rounded-3xl border-2 border-white/5 bg-white/5">
                <p className="text-[9px] font-black uppercase text-amber-500/40 mb-3">Alchemy Seed</p>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`w-full py-4 rounded-xl border-2 font-black uppercase text-[9px] transition-all ${selectedFile ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/10 border-white/10 text-white'}`}
                >
                  {selectedFile ? 'Change_File' : 'Upload_Seed'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                {selectedFile && <p className="text-[8px] mt-2 font-mono truncate text-amber-500/40">{selectedFile.name}</p>}
              </div>

              <div className="p-6 rounded-3xl border-2 border-white/5 bg-white/5">
                <p className="text-[9px] font-black uppercase text-amber-500/40 mb-3">Vocal Engine</p>
                <button onClick={() => setIsRecording(!isRecording)} className={`w-full py-4 rounded-xl border-2 font-black uppercase text-[9px] transition-all ${isRecording ? 'bg-red-500 text-white border-red-400' : 'bg-white/10 border-white/10 text-white'}`}>
                  {isRecording ? 'Stop_Rec' : 'Start_Rec'}
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1 flex flex-col p-10 gap-10 overflow-hidden">
             <div className="h-48 rounded-[3rem] bg-black/40 border-2 border-white/5 relative overflow-hidden flex items-end">
                <canvas ref={canvasRef} width={800} height={200} className="w-full h-full opacity-60" />
                {lyrics && (
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                    <p className="text-3xl font-black italic tracking-tighter text-amber-50 animate-pulse">{lyrics}</p>
                  </div>
                )}
             </div>

             <div className="flex-1 flex flex-col gap-8">
                <div className="flex-1 relative">
                   <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe a sonic vision... e.g. A dark cinematic synth anthem with high logic density."
                    className="w-full h-full bg-black/60 border-2 border-white/5 rounded-[3rem] p-10 outline-none text-2xl font-bold italic shadow-inner text-white focus:border-amber-500/20"
                   />
                   <button 
                    onClick={generateSong}
                    className="absolute bottom-8 right-8 w-16 h-16 rounded-[1.5rem] bg-amber-500 text-black flex items-center justify-center hover:scale-110 transition-all shadow-2xl"
                   >
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={3} /></svg>
                   </button>
                </div>

                <div className="h-40 flex justify-center gap-1">
                   {PIANO_NOTES.map(note => (
                     <button 
                      key={note.key}
                      onMouseDown={() => { setActiveKeys(prev => new Set(prev).add(note.key)); playNote(note.frequency); }}
                      onMouseUp={() => setActiveKeys(prev => { const next = new Set(prev); next.delete(note.key); return next; })}
                      className={`flex-1 rounded-2xl border-2 transition-all flex flex-col justify-end items-center pb-4 ${activeKeys.has(note.key) ? 'bg-amber-500 border-amber-300 translate-y-2' : 'bg-white/5 border-white/10 text-gray-500'}`}
                     >
                       <span className="text-[10px] font-black">{note.note}</span>
                     </button>
                   ))}
                </div>
             </div>
          </section>
        </main>

        <footer className="h-20 border-t border-white/5 bg-black px-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/20">
           <span>BITRATE: 1411KBPS_FLAC</span>
           <span>ENGINE: TITAN_SONIC_V9</span>
           <span>ARCHITECT: SUMUKHA_S</span>
        </footer>
      </div>
    </div>
  );
};

export default AudioAlchemyStudio;
