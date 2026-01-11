import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const VOICES = [
  { id: 'Fenrir', name: 'Fenrir', color: '#ff3300' },
  { id: 'Charon', name: 'Charon', color: '#bc13fe' },
  { id: 'Zephyr', name: 'Zephyr', color: '#00f3ff' },
  { id: 'Kore', name: 'Kore', color: '#10b981' },
];

export const LiveConversation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [connected, setConnected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'LIVE' | 'ERROR'>('IDLE');
  const [micLevel, setMicLevel] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextStartTimeRef = useRef<number>(0);

  const disconnect = useCallback(async () => {
    setConnected(false); setStatus('IDLE');
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (sessionRef.current) sessionRef.current.close();
    sessionRef.current = null;
  }, []);

  const connect = async () => {
    setStatus('CONNECTING');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } } },
          systemInstruction: 'You are Dream Space AI LIVE, architected by Sumukha S. Greet with "Jay Swaminarayan! 🙏". Be elite, concise, and helpful.'
        },
        callbacks: {
          onopen: () => {
            setConnected(true); setStatus('LIVE');
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm = new Int16Array(inputData.length);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                pcm[i] = inputData[i] * 32768;
                sum += Math.abs(inputData[i]);
              }
              setMicLevel(sum / inputData.length);
              const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(audioCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) setTranscription(msg.serverContent.outputTranscription.text);
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) { setStatus('ERROR'); }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      const w = canvasRef.current!.width, h = canvasRef.current!.height;
      ctx.clearRect(0, 0, w, h);
      const centerX = w / 2, centerY = h / 2;
      const pulse = 1 + (micLevel * 5) + Math.sin(frame * 0.05) * 0.1;
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 150 * pulse);
      grad.addColorStop(0, VOICES.find(v => v.id === selectedVoice)?.color || '#fbbf24');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.arc(centerX, centerY, 150 * pulse, 0, Math.PI * 2); ctx.fill();
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [micLevel, selectedVoice]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_0.5px,transparent_0.5px)] bg-[size:50px_50px]"></div>
      
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl z-10">
        <h2 className="text-xl font-black text-amber-400 uppercase italic tracking-tighter">Live_Core_Sync</h2>
        <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white">✕</button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-12 gap-12 relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <canvas ref={canvasRef} width={600} height={600} className="relative z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <span className="text-9xl drop-shadow-2xl">🧠</span>
            {connected && <p className="mt-8 text-xs font-black uppercase text-amber-500 tracking-[0.8em] animate-pulse">Live Link Active</p>}
          </div>
        </div>

        <div className="max-w-3xl w-full text-center space-y-8 z-10">
          <div className="p-8 rounded-[3rem] bg-black/60 border border-white/5 shadow-6xl backdrop-blur-3xl min-h-[120px] flex items-center justify-center italic text-2xl text-white/90 font-bold tracking-tight">
            {transcription || (status === 'LIVE' ? "Listening..." : "Awaiting Authorization")}
          </div>
          
          {!connected ? (
            <div className="space-y-8">
              <div className="flex justify-center gap-4">
                {VOICES.map(v => (
                  <button key={v.id} onClick={() => setSelectedVoice(v.id)} className={`px-6 py-2 rounded-xl border-2 transition-all text-[10px] font-black uppercase ${selectedVoice === v.id ? 'bg-white text-black border-white shadow-xl' : 'bg-transparent border-white/10 text-gray-500'}`}>{v.name}</button>
                ))}
              </div>
              <button onClick={connect} className="px-20 py-8 rounded-full bg-white text-black font-black uppercase tracking-[0.5em] text-sm shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">Engage Link</button>
            </div>
          ) : (
            <button onClick={disconnect} className="px-16 py-6 rounded-full bg-red-600 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-red-500 transition-all shadow-2xl">Terminate</button>
          )}
        </div>
      </main>

      <footer className="h-12 bg-black border-t border-white/5 flex items-center justify-center gap-8 text-[8px] font-black text-gray-700 uppercase tracking-[0.8em]">
        <span>PROTOCOL: V15_SYNC</span>
        <span>ARCHITECT: SUMUKHA_S</span>
        <span>GREETING: JAY SWAMINARAYAN! 🙏</span>
      </footer>
    </div>
  );
};