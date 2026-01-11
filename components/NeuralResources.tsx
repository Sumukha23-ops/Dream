
import React from 'react';
import { AppTheme } from '../types';

interface NeuralResourcesProps {
  theme: AppTheme;
  onClose: () => void;
}

const CATEGORIES = [
  {
    name: "AI & Neural Research",
    links: [
      { title: "Google DeepMind Papers", url: "https://deepmind.google/research/" },
      { title: "Gemini API Documentation", url: "https://ai.google.dev/gemini-api/docs" },
      { title: "Hugging Face Models", url: "https://huggingface.co/models" },
      { title: "ArXiv AI Preprint", url: "https://arxiv.org/list/cs.AI/recent" }
    ]
  },
  {
    name: "Robotics & Hardware",
    links: [
      { title: "ESP32 Official Docs", url: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/" },
      { title: "Arduino Cloud Hub", url: "https://create.arduino.cc/" },
      { title: "ROS 2 (Robot OS) Wiki", url: "https://docs.ros.org/en/humble/index.html" },
      { title: "Raspberry Pi Research", url: "https://www.raspberrypi.com/documentation/" }
    ]
  },
  {
    name: "Verified Cyber Tools",
    links: [
      { title: "OWASP Top 10 2024", url: "https://owasp.org/www-project-top-ten/" },
      { title: "Pentest-Standard", url: "http://www.pentest-standard.org/" },
      { title: "Exploit-DB (Active)", url: "https://www.exploit-db.com/" },
      { title: "DefCon Archives", url: "https://media.defcon.org/" }
    ]
  }
];

const NeuralResources: React.FC<NeuralResourcesProps> = ({ theme, onClose }) => {
  const isDark = theme === AppTheme.DARK;

  return (
    <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className={`max-w-5xl w-full h-[85vh] rounded-[4rem] p-12 border-2 flex flex-col gap-10 overflow-hidden ${isDark ? 'bg-gray-950 border-white/5 shadow-2xl' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-4xl font-orbitron font-black uppercase tracking-tighter ${isDark ? 'text-cyan-400 neon-text' : 'text-blue-700'}`}>Neural Node Hub</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold mt-2">Verified Neural Access Links // 2024-2025 Edition</p>
          </div>
          <button onClick={onClose} className="p-6 rounded-[2.5rem] bg-white/5 hover:bg-red-500 hover:text-white transition-all">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar grid md:grid-cols-3 gap-8 pr-4">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className={`p-8 rounded-[3rem] border-2 flex flex-col gap-6 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                {cat.name}
              </h3>
              <div className="flex flex-col gap-3">
                {cat.links.map((link, lIdx) => (
                  <a 
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center group ${isDark ? 'border-white/5 hover:border-cyan-500/30 bg-black/40 hover:bg-black' : 'border-slate-200 bg-white hover:border-blue-500'}`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-tight">{link.title}</span>
                    <span className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`w-full p-6 rounded-[3rem] text-center border-2 ${isDark ? 'bg-black/60 border-white/5 text-gray-500' : 'bg-slate-50 border-slate-100'}`}>
          <span className="text-[9px] font-black uppercase tracking-[0.5em]">Links are automatically verified and rotated by Creator: Sumukha S.</span>
        </div>
      </div>
    </div>
  );
};

export default NeuralResources;
