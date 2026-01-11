import React from 'react';

const RESOURCES = [
  { id: 'portfolio', title: "Architect Portfolio", desc: "Digital architectures and tech portfolio of Sumukha S.", icon: "👨‍💻", link: "https://shashitech.netlify.app/" },
  { id: 'blog', title: "Dream Space Blog", desc: "Intelligence insights and market analysis on the future of AI.", icon: "📰", link: "https://shashi2028.blogspot.com/" },
  { id: 'book', title: "Steps Toward Coding", desc: "Definitive guide for absolute beginners by Sumukha S.", icon: "📘", link: "https://www.amazon.com/Few-Steps-Toward-Coding-Patner/dp/B0D3LZTY38/" },
  { id: 'trading', title: "Trading Logic Notes", desc: "Comprehensive notes on market dynamics and elite strategies.", icon: "📊", link: "https://docs.google.com/document/d/1s44-C9I-axZJDuSwXI1oCE1r1expDuVdJr6bX3uM9OA/edit?usp=sharing" },
];

export const ResourceView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <h2 className="text-xl font-black text-amber-400 uppercase italic tracking-tighter">Resource_Vault</h2>
        <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/5">✕</button>
      </header>

      <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">The <span className="text-amber-400">Elite Vault</span></h3>
             <p className="text-[10px] text-gray-500 uppercase tracking-[0.8em]">Architected Repository // Sumukha S.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RESOURCES.map(res => (
              <a key={res.id} href={res.link} target="_blank" className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/[0.04] transition-all flex flex-col gap-6 shadow-2xl relative overflow-hidden text-left">
                <div className="flex justify-between items-start relative z-10">
                   <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">{res.icon}</div>
                   <span className="text-[2xl] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">{res.title}</h4>
                   <p className="text-sm font-medium text-gray-600 leading-relaxed mt-2">{res.desc}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center pt-20">
             <p className="text-[14px] font-black text-amber-500 uppercase tracking-[1em]">Jay Swaminarayan! 🙏</p>
          </div>
        </div>
      </main>
    </div>
  );
};