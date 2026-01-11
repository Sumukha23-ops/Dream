import React, { useState, useRef } from 'react';
import { AppTheme, Attachment } from '../types';
import { geminiService } from '../services/geminiService';

interface NanoStudioProps {
  theme: AppTheme;
  onClose: () => void;
}

export const NanoStudio: React.FC<NanoStudioProps> = ({ theme, onClose }) => {
  const [image, setImage] = useState<Attachment | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === AppTheme.DARK;

  const handleExecute = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    try {
      if (image) {
        const edited = await geminiService.editImage(prompt, image);
        setResult(edited);
      } else {
        const generated = await geminiService.generateImage(prompt, "16:9");
        setResult(generated);
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500 font-orbitron">
      <div className={`max-w-6xl w-full rounded-[4.5rem] p-12 border-2 flex flex-col gap-8 relative overflow-hidden ${isDark ? 'bg-gray-950 border-white/5 shadow-2xl' : 'bg-white border-slate-200'}`}>
        <header className="flex justify-between items-center z-10">
          <div><h2 className="text-4xl font-black uppercase tracking-tighter text-amber-400">Nano Studio</h2></div>
          <button onClick={onClose} className="p-5 rounded-[2rem] bg-white/5 hover:bg-red-600 transition-all">✕</button>
        </header>
        <div className="flex-1 min-h-0 grid md:grid-cols-2 gap-8">
          <div onClick={() => fileInputRef.current?.click()} className={`rounded-[3.5rem] border-2 border-dashed relative flex items-center justify-center cursor-pointer overflow-hidden ${image ? 'border-amber-500/50' : 'bg-white/5 border-white/10'}`}>
            {image ? <img src={`data:${image.mimeType};base64,${image.data}`} className="w-full h-full object-contain" /> : <span className="text-xs opacity-20 font-black uppercase">Drop Source Frame</span>}
            <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = (ev) => setImage({ name: f.name, mimeType: f.type, data: (ev.target?.result as string).split(',')[1] }); r.readAsDataURL(f); } }} className="hidden" accept="image/*" />
          </div>
          <div className="rounded-[3.5rem] border-2 border-white/5 relative flex items-center justify-center overflow-hidden bg-black/20">
            {result ? <img src={result} className="w-full h-full object-contain" /> : <span className="text-[10px] font-black uppercase opacity-30">{isProcessing ? 'Syncing...' : 'Awaiting Manifest'}</span>}
          </div>
        </div>
        <div className="flex gap-4">
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe modifications..." className="flex-1 py-7 px-10 rounded-[2.5rem] bg-black/40 border-2 border-white/10 text-white outline-none focus:border-amber-400/30" />
          <button onClick={handleExecute} disabled={isProcessing || !prompt.trim()} className="px-14 rounded-[2.5rem] bg-amber-400 text-black font-black uppercase text-xs transition-all shadow-xl">Execute</button>
        </div>
      </div>
    </div>
  );
};