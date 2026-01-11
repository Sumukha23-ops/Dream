
import React, { useState, useEffect, useRef } from 'react';
import { AppTheme, Attachment } from '../types';
import { GoogleGenAI } from '@google/genai';

interface NanoVideoLabProps {
  theme: AppTheme;
  onClose: () => void;
}

const VIDEO_PRESETS = [
  { id: 'cinematic', label: '🎬 Cinematic Ext', prompt: 'Extend this scene with a dramatic sweeping camera move and high-fidelity textures.' },
  { id: 'glitch', label: '👾 Cyber Glitch', prompt: 'Add a digital glitch layer and high-speed motion blurs to the sequence.' },
  { id: 'dream', label: '🌌 Dream Logic', prompt: 'Transform the environment into a surreal floating structure with ethereal lighting.' },
  { id: 'action', label: '⚡ Pulse Kinetic', prompt: 'Introduce fast-paced kinetic energy and explosive color shifts.' },
];

const NanoVideoLab: React.FC<NanoVideoLabProps> = ({ theme, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<any>(null);
  const [status, setStatus] = useState('STANDBY');
  const [hasKey, setHasKey] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Attachment | null>(null);
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const ok = await window.aistudio.hasSelectedApiKey();
      setHasKey(ok);
    };
    checkKey();
  }, []);

  const selectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const generate = async (isExtension: boolean = false, customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim() && !selectedImage && !isExtension) return;

    if (!hasKey) {
      await selectKey();
    }

    setIsGenerating(true);
    setProgress(0);
    setStatus('SYNCING_TITAN_CORE');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'veo-3.1-fast-generate-preview';
      
      let operation;
      if (isExtension && lastOperation?.response?.generatedVideos?.[0]?.video) {
        setStatus('CALCULATING_LATTICE_EXTENSION');
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-generate-preview',
          prompt: activePrompt || 'Continue the scene logically',
          video: lastOperation.response.generatedVideos[0].video,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
          }
        });
      } else {
        setStatus('INITIALIZING_MOTION_SYNAPSE');
        operation = await ai.models.generateVideos({
          model,
          prompt: activePrompt,
          image: selectedImage ? {
            imageBytes: selectedImage.data,
            mimeType: selectedImage.mimeType
          } : undefined,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
          }
        });
      }

      let currentOp = operation;
      let count = 0;
      while (!currentOp.done) {
        count++;
        setProgress(Math.min(95, count * 5));
        const messages = [
          'Dreaming motion vectors...',
          'Compiling neural keyframes...',
          'Synthesizing temporal flow...',
          'Rendering architectural shards...',
          'Finalizing lattice sync...'
        ];
        setStatus(messages[Math.min(messages.length - 1, Math.floor(count / 3))]);
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        try {
          currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
        } catch (pollErr: any) {
          if (pollErr.message?.includes("Requested entity was not found")) {
            setHasKey(false);
            await selectKey();
            throw pollErr;
          }
          throw pollErr;
        }
      }

      setLastOperation(currentOp);
      const downloadLink = currentOp.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setResultVideo(`${downloadLink}&key=${process.env.API_KEY}`);
        setStatus('MANIFEST_COMPLETE');
        setProgress(100);
      } else {
        throw new Error("Lattice result void.");
      }

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        await selectKey();
        setStatus('RE-AUTHENTICATING...');
      } else {
        setStatus('LATTICE_FAULT');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setSelectedImage({ name: file.name, mimeType: file.type, data: base64 });
      setResultVideo(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/98 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500 font-orbitron overflow-hidden">
      <div className="absolute inset-0 bg-[#020202] bg-[radial-gradient(#fbbf24_0.2px,transparent_0.2px)] bg-[size:60px_60px] opacity-10"></div>
      
      <div className="w-full h-full max-w-[1700px] bg-[#050505] rounded-[5rem] border-2 border-amber-500/10 flex flex-col shadow-6xl relative overflow-hidden">
        
        <header className="h-28 border-b border-white/5 px-16 flex items-center justify-between bg-black/60 backdrop-blur-3xl">
           <div className="flex items-center gap-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full group-hover:bg-amber-500/40 transition-all"></div>
                <div className="w-16 h-16 rounded-[2rem] bg-amber-500 text-black flex items-center justify-center text-4xl shadow-2xl relative z-10">🎬</div>
              </div>
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-amber-400 uppercase">Nano_Video_Editor</h1>
                <p className="text-[9px] uppercase tracking-[0.6em] text-amber-500/30">Temporal Synthesis Lab // Sumukha S.</p>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end gap-1 px-8 border-r border-white/5">
                <span className="text-[8px] font-black uppercase text-amber-500/40">Neural_Status</span>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${hasKey ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                  {hasKey ? 'Lattice_Linked' : 'Void_Link'}
                </span>
              </div>
              <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all border border-white/10 flex items-center justify-center text-2xl">✕</button>
           </div>
        </header>

        <main className="flex-1 flex overflow-hidden min-h-0">
          <aside className="w-[480px] border-r border-white/5 p-12 flex flex-col gap-8 bg-black/40 overflow-y-auto custom-scrollbar">
             <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500/30 px-4">Motion_Genesis</h3>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-10 rounded-[3.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group ${selectedImage ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 hover:border-white/30'}`}
                >
                  {selectedImage ? (
                    <>
                      <img src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} className="w-full h-32 object-cover rounded-2xl grayscale brightness-75 group-hover:grayscale-0 transition-all" alt="ref" />
                      <span className="text-[9px] font-black uppercase text-amber-400">Reference Frame Loaded</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl opacity-20">📷</span>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Drop Start Frame</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/20 px-4 mt-4">Logic_Augmentation</p>
                   {VIDEO_PRESETS.map(p => (
                     <button 
                      key={p.id}
                      onClick={() => generate(true, p.prompt)}
                      disabled={isGenerating || !lastOperation}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-left flex items-center gap-6 group ${!lastOperation ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5'}`}
                     >
                       <span className="text-2xl group-hover:scale-125 transition-transform">{p.label.split(' ')[0]}</span>
                       <div>
                         <p className="text-[12px] font-black uppercase tracking-widest text-amber-100">{p.label.split(' ')[1]} {p.label.split(' ')[2]}</p>
                         <p className="text-[8px] opacity-30 font-bold uppercase mt-1">Apply Extension</p>
                       </div>
                     </button>
                   ))}
                </div>
             </div>

             <div className="mt-auto p-8 rounded-[3.5rem] bg-white/5 border border-white/5 flex flex-col gap-4">
                <h4 className="text-[10px] font-black uppercase text-amber-500/40">Architect_Notes</h4>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed italic">
                  "Each temporal sequence is synthesized from the absolute void. Expect multi-minute latency for supreme fidelity."
                </p>
             </div>
          </aside>

          <section className="flex-1 flex flex-col p-12 gap-10 overflow-hidden relative">
             <div className={`flex-1 rounded-[5rem] border-2 relative overflow-hidden transition-all duration-1000 bg-black/60 ${isGenerating ? 'border-amber-500/40 shadow-[0_0_150px_rgba(251,191,36,0.15)]' : 'border-white/5 shadow-2xl'}`}>
                {resultVideo ? (
                  <video src={resultVideo} controls autoPlay loop className="w-full h-full object-contain animate-in fade-in duration-1000" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-12 opacity-[0.03]">
                    <div className="text-[200px] animate-pulse">🎬</div>
                    <p className="text-5xl font-black uppercase tracking-[2em]">Temporal_Void</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 z-20">
                     <div className="relative w-48 h-48">
                        <div className="absolute inset-0 rounded-full border-2 border-amber-500/10 animate-ping"></div>
                        <svg className="w-full h-full rotate-[-90deg]">
                           <circle 
                             cx="96" cy="96" r="88" 
                             stroke="currentColor" 
                             strokeWidth="4" 
                             fill="transparent" 
                             className="text-white/5" 
                           />
                           <circle 
                             cx="96" cy="96" r="88" 
                             stroke="currentColor" 
                             strokeWidth="6" 
                             fill="transparent" 
                             className="text-amber-500 transition-all duration-1000" 
                             strokeDasharray={552.92}
                             strokeDashoffset={552.92 * (1 - progress / 100)}
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-amber-500 italic">
                          {progress}%
                        </div>
                     </div>
                     <div className="text-center space-y-4">
                        <p className="text-2xl font-black uppercase tracking-[0.8em] text-amber-500 animate-pulse">{status}</p>
                        <p className="text-[10px] font-bold text-amber-500/30 uppercase tracking-widest italic">Proceeding through localized neural bottlenecks...</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="h-44 flex flex-col gap-6">
                <div className="relative group">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-amber-500/40 font-black text-2xl">⚡</div>
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generate()}
                    placeholder="Describe the motion evolution... [e.g. A high-speed flight through a neon crystal cavern]"
                    className="w-full h-28 bg-black/60 border-2 border-white/5 rounded-[3.5rem] pl-20 pr-48 outline-none text-2xl font-bold italic text-amber-50 focus:border-amber-500/30 transition-all placeholder:text-white/5 shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-4">
                     <button 
                      onClick={() => generate()}
                      disabled={isGenerating || (!prompt.trim() && !selectedImage)}
                      className="h-16 px-12 rounded-[2.5rem] bg-amber-500 text-black font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-4xl disabled:opacity-20"
                     >
                       Manifest
                     </button>
                  </div>
                </div>
             </div>
          </section>
        </main>

        <footer className="h-16 px-16 bg-black border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.8em] text-amber-500/10">
           <div className="flex gap-16">
              <span>MODEL: VEO_3.1_LATTICE</span>
              <span>EXTENSION_PROTOCOL: ACTIVE</span>
           </div>
           <span>ARCHITECT_SIGNED: SUMUKHA_S</span>
        </footer>
      </div>
    </div>
  );
};

export default NanoVideoLab;
