
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PIANO_NOTES } from '../constants';
import { AppTheme } from '../types';
import { audioService } from '../services/audioService';

interface RecordedNote {
  freq: number;
  time: number;
  key: string;
}

interface DigitalPianoProps {
  theme: AppTheme;
  onClose: () => void;
}

type InstrumentType = 'piano' | 'synth' | 'bass' | 'crystal' | 'strings' | 'organ' | 'pad' | 'brass' | 'flute' | 'choir';

const DigitalPiano: React.FC<DigitalPianoProps> = ({ theme, onClose }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState<RecordedNote[]>([]);
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  
  const recordingStartTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // We don't stopAll on unmount here anymore to allow persistent background play
    // unless specifically requested by the user.
    return () => {};
  }, []);

  const handleExit = () => {
    onClose();
  };

  const startNote = useCallback((key: string, freq: number) => {
    audioService.playInstrument(instrument, freq, 0.4, 1.5);
  }, [instrument]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === ' ') {
      e.preventDefault();
      setIsRecording(prev => {
        if (!prev) {
          setRecordedSequence([]);
          recordingStartTimeRef.current = Date.now();
          return true;
        }
        return false;
      });
      return;
    }

    const note = PIANO_NOTES.find(n => n.key === key);
    if (note && !activeKeys.has(key)) {
      setActiveKeys(prev => new Set(prev).add(key));
      startNote(key, note.frequency);
      if (isRecording) {
        const offset = Date.now() - recordingStartTimeRef.current;
        setRecordedSequence(prev => [...prev, { freq: note.frequency, time: offset, key: note.key }]);
      }
    }
  }, [activeKeys, startNote, isRecording]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key !== ' ') {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      const res = audioService.getAiResonance();
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 60;
      const barWidth = canvas.width / bars;

      for(let i = 0; i < bars; i++) {
        const h = (res * 150) + Math.sin(frame * 0.1 + i * 0.2) * 15;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.1 + (h/200)})`;
        ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
      }
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = theme === AppTheme.DARK;
  const instruments: InstrumentType[] = ['piano', 'synth', 'bass', 'crystal', 'strings', 'organ', 'pad', 'brass', 'flute', 'choir'];

  return (
    <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className={`max-w-[1200px] w-full h-[80vh] rounded-[3.5rem] p-10 border-2 flex flex-col gap-6 relative overflow-hidden transition-all ${isDark ? 'bg-gray-950 border-white/5 shadow-4xl' : 'bg-white border-slate-200'}`}>
        
        <div className="w-full flex justify-between items-center z-10">
          <div>
            <h2 className={`text-4xl font-orbitron font-black uppercase tracking-tighter ${isDark ? 'text-amber-400 neon-text' : 'text-blue-700'}`}>Maestro_Nexus</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-black">Titan Symphonic Core v3.0</span>
              <div className={`px-4 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border-2 ${isRecording ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                {isRecording ? 'REC' : 'IDLE'}
              </div>
            </div>
          </div>
          <button onClick={handleExit} className="p-6 rounded-3xl bg-white/5 hover:bg-red-600 hover:text-white transition-all border border-white/5">✕</button>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {instruments.map((inst) => (
              <button 
                key={inst} 
                onClick={() => setInstrument(inst)} 
                className={`flex-shrink-0 px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${instrument === inst ? 'bg-amber-500 border-amber-400 text-black' : 'bg-white/5 border-white/5 text-gray-500'}`}
              >
                {inst}
              </button>
            ))}
          </div>

          <div className={`flex-1 rounded-[3rem] border-2 relative overflow-hidden flex items-end ${isDark ? 'bg-black/60 border-white/10 shadow-3xl' : 'bg-slate-50 border-slate-100'}`}>
            <canvas ref={canvasRef} width={1000} height={300} className="w-full h-full opacity-30 pointer-events-none" />
          </div>

          <div className="flex justify-center gap-1 overflow-x-auto pb-4 custom-scrollbar">
            {PIANO_NOTES.map((note) => {
              const isSharp = note.note.includes('#');
              const isActive = activeKeys.has(note.key);
              return (
                <button 
                  key={note.key}
                  onMouseDown={() => { setActiveKeys(prev => new Set(prev).add(note.key)); startNote(note.key, note.frequency); }}
                  onMouseUp={() => setActiveKeys(prev => { const next = new Set(prev); next.delete(note.key); return next; })}
                  className={`relative h-48 rounded-[1.5rem] flex flex-col justify-end items-center pb-4 transition-all duration-150 transform border-2 ${isSharp ? 'w-10 z-10 -mx-2.5' : 'w-14 z-0'} ${isActive ? 'bg-amber-500 border-amber-300 translate-y-2' : isSharp ? 'bg-gray-950 border-white/5 text-gray-700' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  <span className={`text-[8px] font-black uppercase opacity-30 mb-1 ${isActive ? 'text-black' : ''}`}>{note.key}</span>
                  <span className={`text-xs font-orbitron font-black ${isActive ? 'text-black' : 'text-white'}`}>{note.note}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`w-full p-6 rounded-[2rem] flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] border-2 ${isDark ? 'bg-black/60 border-white/5 text-amber-500/40' : 'bg-slate-50 border-slate-100'}`}>
           <div className="flex gap-12">
             <span>ACTIVE: {instrument.toUpperCase()}</span>
             <span>BUFFER: 48kHz</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalPiano;
