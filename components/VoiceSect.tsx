
import React, { useState, useRef, useEffect } from 'react';
import { audioService } from '../services/audioService';
import { geminiService } from '../services/geminiService';
import { AppTheme } from '../types';

interface VoiceSectProps {
  theme: AppTheme;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onLiveMessage: (role: 'user' | 'assistant', content: string) => void;
}

const VoiceSect: React.FC<VoiceSectProps> = ({ theme, onClose, onSendMessage, onLiveMessage }) => {
  const [isActive, setIsActive] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SYNCED'>('IDLE');
  const [aiVol, setAiVol] = useState(0);
  const [userVol, setUserVol] = useState(0);
  
  const isDark = theme === AppTheme.DARK;
  const animFrame = useRef<number>(0);

  const toggleLink = () => {
    if (!isActive) {
      setIsActive(true);
      setStatus('SYNCED');
      startVisualizer();
    } else {
      setIsActive(false);
      setStatus('IDLE');
      setIsAiTalking(false);
      cancelAnimationFrame(animFrame.current);
    }
  };

  const startVisualizer = () => {
    const update = () => {
      setAiVol(isAiTalking ? Math.random() * 0.5 : 0);
      setUserVol(isActive ? Math.random() * 0.2 : 0);
      animFrame.current = requestAnimationFrame(update);
    };
    update();
  };

  const simulateChat = async () => {
    if (!isActive) return;
    setIsAiTalking(true);
    const text = "Jay Swaminarayan! My internal core is fully synchronized. Standalone processing is active.";
    await geminiService.textToSpeech(text);
    setTimeout(() => setIsAiTalking(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-500">
      <div className={`max-w-4xl w-full mx-4 rounded-[4rem] p-12 border-2 flex flex-col gap-10 relative overflow-hidden shadow-2xl ${isDark ? 'bg-gray-950 border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center z-10">
          <div className="flex flex-col">
            <h2 className={`text-4xl font-orbitron font-black uppercase tracking-tighter ${isDark ? 'text-cyan-400 neon-text' : 'text-blue-700'}`}>Internal_Link</h2>
            <div className={`mt-2 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-500' : 'text-gray-500'}`}>
              {status} [CORE_MODE]
            </div>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-full glass hover:bg-red-500 transition-all flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 min-h-[450px]">
          <div className="relative flex items-center justify-center" onClick={simulateChat}>
            <div className={`absolute rounded-full blur-3xl transition-all duration-300 mix-blend-screen bg-cyan-500 opacity-20`} 
                 style={{ width: '320px', height: '320px', transform: `scale(${1 + aiVol * 4 + userVol * 3})` }}></div>
            <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-700 cursor-pointer ${isActive ? 'border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.4)]' : 'border-white/10 opacity-20'}`}>
              <span className="text-7xl">{isAiTalking ? '🤖' : '🧠'}</span>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold tracking-tight text-white">
              {isAiTalking ? "Synthesizing Vocal Patterns..." : (isActive ? "Listening for Neural Intent..." : "Core Standby")}
            </p>
            <p className="text-[10px] uppercase font-black tracking-[0.6em] text-cyan-500/40">Architect Sumukha S. // Zero Latency</p>
          </div>
        </div>

        <button 
          onClick={toggleLink} 
          className={`w-full py-8 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.5em] transition-all shadow-xl ${isActive ? 'bg-red-600 text-white' : 'bg-cyan-500 text-black'}`}
        >
          {isActive ? 'DISCONNECT CORE' : 'ACTIVATE INTERNAL LINK'}
        </button>
      </div>
    </div>
  );
};

export default VoiceSect;
