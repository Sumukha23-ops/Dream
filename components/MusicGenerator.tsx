
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const INSTRUMENTS = [
  { id: 'piano', label: 'Grand Piano', icon: '🎹' },
  { id: 'synth', label: 'Logic-Synth', icon: '🎸' },
  { id: 'drums', label: 'Pulse Kit', icon: '🥁' },
  { id: 'strings', label: 'Stellar Cello', icon: '🎻' },
];

export const MusicGenerator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['synth']);
  const [bpm, setBpm] = useState(128);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const synthesize = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Generate a professional instrumental soundtrack: ${prompt}. BPM: ${bpm}. Greet: Jay Swaminarayan! 🙏. Architect: Sumukha S.` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
        },
      });
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64 && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (base64 && audioContextRef.current) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        
        if (sourceRef.current) sourceRef.current.stop();
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
        source.onended = () => setIsPlaying(false);
      }
    } catch (e) { alert("Synthesis failed."); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <h2 className="text-xl font-black text-pink-400 uppercase italic tracking-tighter">Sonic_Forge</h2>
        <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/5">✕</button>
      </header>

      <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] space-y-10 shadow-2xl">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-pink-500 text-black flex items-center justify-center text-4xl shadow-xl animate-float">🎹</div>
                <div>
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Music Synthesis</h3>
                   <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em]">Architected by Sumukha S.</p>
                </div>
             </div>
             <div className="space-y-4">
                <textarea 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)} 
                  className="w-full h-32 bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-xl text-white outline-none focus:border-pink-500 transition-all" 
                  placeholder="Describe your sonic vision..." 
                />
             </div>
             <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                   <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-4">Velocity (BPM)</label>
                   <input type="range" min="60" max="220" value={bpm} onChange={e => setBpm(parseInt(e.target.value))} className="w-full accent-pink-500" />
                </div>
                <button onClick={synthesize} disabled={loading || !prompt} className="px-12 py-6 rounded-full bg-pink-500 text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">Synthesize</button>
             </div>
          </div>
          {loading && (
            <div className="flex flex-col items-center gap-6 text-pink-500 animate-pulse">
               <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.8em]">Manifesting Sonic Grid...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
