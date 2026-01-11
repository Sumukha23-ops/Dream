import React, { useRef } from 'react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, logo, onLogoChange, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onLogoChange(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <h2 className="text-xl font-black text-gray-400 uppercase italic tracking-tighter">System_Config</h2>
        <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/5">✕</button>
      </header>

      <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-12">
          <section className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] space-y-10 shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
              <span className="text-4xl">🏷️</span> Brand Identity
            </h3>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className={`w-40 h-40 rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all bg-black/40 group-hover:border-amber-500/50 overflow-hidden ${logo ? 'border-solid' : ''}`}>
                  {logo ? <img src={logo} className="w-full h-full object-contain p-4" /> : <span className="text-xs text-gray-700 font-black uppercase">Upload Logo</span>}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
              </div>
              <div className="flex-1 space-y-6">
                 <p className="text-sm font-medium text-gray-500 leading-relaxed italic">Inject your own visual identifier into the architecture. Architected nodes by Sumukha S.</p>
                 <div className="flex gap-3">
                   <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Change Node</button>
                   {logo && <button onClick={() => onLogoChange(null)} className="px-8 py-3 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Clear</button>}
                 </div>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] space-y-10 shadow-2xl">
             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
              <span className="text-4xl">ℹ️</span> About Dream Space AI
            </h3>
            <div className="space-y-6 text-gray-400">
               <p className="leading-relaxed text-sm font-medium italic">
                 Dream Space AI is a premium demonstration of modern Generative AI capabilities, architected by <strong>Sumukha S.</strong> 
                 It integrates the latest models for text, code, image, and live audio interaction within a sovereign lattice.
               </p>
            </div>
          </section>

          <div className="text-center py-10 opacity-20">
             <p className="text-[10px] font-black uppercase tracking-[1em]">Dream Space AI v15.0 Elite // Sumukha S.</p>
             <p className="text-[12px] font-black uppercase tracking-[0.5em] mt-4 text-amber-500">Jay Swaminarayan! 🙏</p>
          </div>
        </div>
      </main>
    </div>
  );
};