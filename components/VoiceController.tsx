
import React, { useState, useRef, useEffect } from 'react';
import { AppTheme } from '../types';

interface VoiceControllerProps {
  theme: AppTheme;
  onTranscript: (text: string) => void;
}

const VoiceController: React.FC<VoiceControllerProps> = ({ theme, onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [vol, setVol] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isFinalizedRef = useRef<boolean>(false);

  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false; // Stick to final results for stability
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        if (isFinalizedRef.current) return;
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          isFinalizedRef.current = true;
          onTranscript(transcript.trim());
          stopListening();
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.debug("Recognition link fault:", event.error);
        }
        stopListening();
      };
      
      recognition.onend = () => {
        setIsListening(false);
        cleanupAudio();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopListening();
    };
  }, [onTranscript]);

  const cleanupAudio = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setVol(0);
  };

  const startListening = async () => {
    if (!recognitionRef.current) return;
    
    try {
      isFinalizedRef.current = false;
      cleanupAudio();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVol(average / 128);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Hardware initialization blocked.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    setIsListening(false);
    cleanupAudio();
  };

  return (
    <button
      onClick={() => isListening ? stopListening() : startListening()}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all border-2 duration-100
        ${isListening ? 'bg-amber-500 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.6)] scale-110' : (isDark ? 'bg-white/5 border-white/10 text-amber-500 hover:bg-white/10' : 'bg-slate-100 text-blue-600')}
      `}
    >
      {isListening ? (
        <div className="flex items-center gap-1.5 h-10">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i}
              className="w-2 bg-black rounded-full transition-all duration-75" 
              style={{ height: `${20 + Math.random() * 80 * vol}%` }}
            ></div>
          ))}
        </div>
      ) : (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 1v11m0 0a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM19 11a7 7 0 01-14 0" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {isListening && <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse whitespace-nowrap bg-black/80 px-3 py-1 rounded-full border border-amber-500/20">Listening...</span>}
    </button>
  );
};

export default VoiceController;
