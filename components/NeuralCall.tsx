
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AppTheme, PersonalityMode } from '../types';

interface NeuralCallProps {
  theme: AppTheme;
  personality: PersonalityMode;
  onClose: () => void;
}

const NeuralCall: React.FC<NeuralCallProps> = ({ theme, personality, onClose }) => {
  const [status, setStatus] = useState<'INITIALIZING' | 'LIVE' | 'ENDING'>('INITIALIZING');
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiVoiceLevel, setAiVoiceLevel] = useState(0);
  const [sessionInfo, setSessionInfo] = useState({ bitrate: '0 kbps', fps: '0' });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const canvasVisualizerRef = useRef<HTMLCanvasElement>(null);

  // High-performance visualizer animation
  useEffect(() => {
    const canvas = canvasVisualizerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const bars = 40;
      const spacing = 12;
      const barWidth = 4;
      const centerX = canvas.width / 2;
      
      ctx.fillStyle = personality === PersonalityMode.GHOST ? '#00ff41' : '#fbbf24';
      
      for (let i = 0; i < bars; i++) {
        const offset = (i - bars / 2) * spacing;
        const distToCenter = Math.abs(i - bars / 2);
        const h = 5 + (aiVoiceLevel * 40 * Math.exp(-distToCenter * 0.15)) + Math.sin(frame * 0.1 + i * 0.5) * 5;
        
        ctx.beginPath();
        ctx.roundRect(centerX + offset, (canvas.height - h) / 2, barWidth, h, 2);
        ctx.fill();
      }
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [aiVoiceLevel, personality]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let frameInterval: number;

    const initCall = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('LIVE');
              const source = inputCtx.createMediaStreamSource(stream!);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              processor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) pcm[i] = inputData[i] * 32768;
                const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
                sessionPromise.then(s => s.sendRealtimeInput({ 
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
                }));
              };
              source.connect(processor);
              processor.connect(inputCtx.destination);

              frameInterval = window.setInterval(() => {
                if (!canvasRef.current || !videoRef.current) return;
                const ctx = canvasRef.current.getContext('2d');
                ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob(async (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(s => s.sendRealtimeInput({
                        media: { data: base64, mimeType: 'image/jpeg' }
                      }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.4);
                setSessionInfo(prev => ({ ...prev, fps: '12' }));
              }, 800);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                setTranscription(message.serverContent.outputTranscription.text);
              }
              const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData) {
                const binary = atob(audioData);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                
                const dataInt16 = new Int16Array(bytes.buffer);
                const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
                const channelData = buffer.getChannelData(0);
                for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

                setAiVoiceLevel(1.5);
                const source = outputCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(outputCtx.destination);
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setAiVoiceLevel(0);
                };
              }
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            outputAudioTranscription: {},
            systemInstruction: `You are Dream Space AI in its ${personality} state. 
            Tone and Mission: ${personality}. 
            Architect: Sumukha S. 
            You are on a live high-fidelity video call. Be engaging, insightful, and elite.`
          }
        });
        sessionRef.current = await sessionPromise;
      } catch (e) {
        onClose();
      }
    };

    initCall();

    return () => {
      stream?.getTracks().forEach(t => t.stop());
      clearInterval(frameInterval);
      sessionRef.current?.close();
    };
  }, [personality]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col font-orbitron overflow-hidden">
      <div className="absolute inset-0 bg-[#020202] bg-[radial-gradient(#fbbf24_0.2px,transparent_0.2px)] bg-[size:50px_50px] opacity-10"></div>
      
      {/* Immersive Header */}
      <header className="h-24 px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-3xl z-20">
         <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${personality === PersonalityMode.GHOST ? 'border-green-500/40 bg-green-500/5' : 'border-amber-400/40 bg-amber-500/5'}`}>
               <span className="text-3xl animate-pulse">📡</span>
            </div>
            <div>
               <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">NEURAL_LIVE_v12</h1>
               <p className="text-[8px] uppercase font-black tracking-[0.5em] text-amber-500/40">Active_Persona: {personality}</p>
            </div>
         </div>
         <div className="flex gap-6 items-center">
            <div className="flex flex-col items-end gap-1">
               <span className="text-[7px] font-black uppercase text-gray-600">Lattice_Signature</span>
               <span className="text-[10px] font-mono text-amber-400/60 uppercase">0x8F22...B3A</span>
            </div>
            <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all border border-white/10 flex items-center justify-center text-xl font-bold">✕</button>
         </div>
      </header>

      <main className="flex-1 flex p-10 gap-10 min-h-0 relative">
        {/* Main Video Stage */}
        <div className="flex-1 rounded-[5rem] overflow-hidden border-2 border-white/5 bg-gray-950 relative shadow-6xl group">
           <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 scale-x-[-1] transition-opacity duration-1000 group-hover:opacity-40" />
           <canvas ref={canvasRef} width={320} height={240} className="hidden" />
           
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-700 bg-amber-500/20`} style={{ transform: `scale(${1 + aiVoiceLevel})` }}></div>
                <div className={`w-64 h-64 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${status === 'LIVE' ? 'border-amber-400 shadow-[0_0_120px_rgba(251,191,36,0.3)]' : 'border-white/5 opacity-10 animate-spin'}`}>
                   <span className="text-9xl drop-shadow-2xl">{personality === PersonalityMode.GHOST ? '💀' : personality === PersonalityMode.MUSE ? '🎨' : '🧠'}</span>
                </div>
              </div>
              <canvas ref={canvasVisualizerRef} width={600} height={120} className="mt-12" />
           </div>

           {/* Live HUD Readouts */}
           <div className="absolute top-12 left-12 space-y-6 pointer-events-none">
              <div className="p-4 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/5 animate-in slide-in-from-left duration-700">
                 <p className="text-[8px] font-black uppercase text-amber-500/40 mb-2">Neural_Latency</p>
                 <p className="text-xl font-mono text-white tracking-tighter">42.2<span className="text-[10px] ml-1">MS</span></p>
              </div>
              <div className="p-4 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/5 animate-in slide-in-from-left duration-1000">
                 <p className="text-[8px] font-black uppercase text-amber-500/40 mb-2">Logic_Streams</p>
                 <div className="flex gap-1 h-3 items-end">
                    {[0.4, 0.8, 0.6, 0.9, 0.3].map((h, i) => (
                      <div key={i} className="w-1 bg-amber-500/40 rounded-full" style={{ height: `${h * 100}%` }}></div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="absolute bottom-40 inset-x-20 flex justify-center z-20 pointer-events-none">
              <div className={`px-12 py-8 rounded-[4rem] bg-black/80 backdrop-blur-3xl border-2 border-white/10 shadow-6xl max-w-4xl transition-all duration-500 ${transcription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                 <p className="text-3xl font-bold italic text-white/90 leading-tight tracking-tight text-center">
                    {transcription || "Establishing Synapse Link..."}
                 </p>
              </div>
           </div>

           {/* Immersive Controls */}
           <div className="absolute bottom-12 inset-x-0 flex justify-center items-center gap-12 z-30">
              <button onClick={() => setIsMuted(!isMuted)} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all border-2 group ${isMuted ? 'bg-red-600 border-red-400' : 'bg-white/5 border-white/10 hover:bg-white/20'}`}>
                 <span className="text-3xl group-active:scale-90 transition-transform">{isMuted ? '🔇' : '🎙️'}</span>
              </button>
              <button onClick={onClose} className="w-32 h-32 rounded-full bg-red-600 border-4 border-red-500 flex items-center justify-center shadow-[0_0_80px_rgba(239,68,68,0.4)] hover:scale-110 active:scale-95 transition-all">
                 <span className="text-5xl text-white">📞</span>
              </button>
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center opacity-30 grayscale cursor-not-allowed">
                 <span className="text-3xl">📷</span>
              </div>
           </div>
        </div>

        {/* Side Meta Panels */}
        <aside className="w-80 flex flex-col gap-10">
           <div className="p-8 rounded-[4rem] bg-black/40 border-2 border-white/5 backdrop-blur-2xl flex-1 flex flex-col">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500/30 mb-8">Spatial_Recon</h3>
              <div className="flex-1 relative border-2 border-white/5 rounded-[3rem] bg-black/60 overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(251,191,36,1)] animate-ping"></div>
              </div>
              <div className="mt-8 space-y-4">
                 <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-500">Bitrate:</span>
                    <span className="text-amber-500">4800 kbps</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-500">Stability:</span>
                    <span className="text-green-500">99.9%</span>
                 </div>
              </div>
           </div>
           
           <div className="p-8 rounded-[4rem] bg-black/40 border-2 border-white/5 backdrop-blur-2xl flex flex-col gap-6">
              <p className="text-[10px] font-black uppercase text-amber-500/30 tracking-widest text-center">Session_Context</p>
              <div className="p-4 rounded-3xl bg-white/5 text-[9px] font-bold text-gray-400 italic leading-relaxed text-center">
                 "Stand-alone operational mode is currently active. Neural weights restricted to ARCHITECT: SUMUKHA S."
              </div>
           </div>
        </aside>
      </main>

      <footer className="h-16 px-16 bg-black/60 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.8em] text-amber-500/10">
         <span>PROTOCOL_TITAN_SYNC_V12.5</span>
         <span>ZERO_LATENCY_LATTICE_ACTIVE</span>
         <span>SUMUKHA_S_CORE_RESTRICTION_OFF</span>
      </footer>
    </div>
  );
};

export default NeuralCall;
