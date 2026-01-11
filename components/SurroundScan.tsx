import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AppTheme } from '../types';

interface SurroundScanProps {
  theme: AppTheme;
  onClose: () => void;
}

export const SurroundScan: React.FC<SurroundScanProps> = ({ theme, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState("INITIALIZING...");

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { setLastAnalysis("ERROR: DENIED"); }
    };
    startCam();
    const interval = setInterval(async () => {
      if (isAnalyzing || !videoRef.current || !canvasRef.current) return;
      setIsAnalyzing(true);
      const ctx = canvasRef.current.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, 640, 480);
      const base64 = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: { parts: [{ inlineData: { data: base64, mimeType: 'image/jpeg' } }, { text: "Analyze frame tactically." }] }
        });
        setLastAnalysis(response.text || "NO_DATA");
      } catch (e) {} finally { setIsAnalyzing(false); }
    }, 4000);
    return () => { stream?.getTracks().forEach(t => t.stop()); clearInterval(interval); };
  }, []);

  return (
    <div className="fixed inset-0 z-[500] bg-black flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="relative w-full h-full max-w-[1600px] aspect-video rounded-[4rem] overflow-hidden border-2 border-amber-400/30 bg-gray-950">
        <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <canvas ref={canvasRef} width={640} height={480} className="hidden" />
        <div className="absolute inset-0 p-16 flex flex-col justify-between pointer-events-none">
           <div className="flex justify-between items-start">
              <span className="px-8 py-3 rounded-full bg-black/80 border border-amber-400/30 text-amber-500 font-black uppercase text-xs">SENTINEL_OPTIC</span>
              <button onClick={onClose} className="p-8 rounded-[2.5rem] bg-black/80 border border-white/10 text-white pointer-events-auto hover:bg-red-600 transition-all">✕</button>
           </div>
           <div className="p-8 rounded-[3rem] border border-amber-400/10 bg-black/60 backdrop-blur-2xl text-amber-50 font-mono text-sm uppercase">
              {isAnalyzing ? 'UPLINKING...' : lastAnalysis}
           </div>
        </div>
      </div>
    </div>
  );
};