
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface LearningPathProps {
  type: 'coding' | 'trading';
  onClose: () => void;
}

const CODING_SUBJECTS = [
    { id: 'js', title: 'JavaScript', icon: '⚡', desc: 'Logic & Web Engines' },
    { id: 'python', title: 'Python', icon: '🐍', desc: 'AI & Data Science' },
    { id: 'react', title: 'React Engine', icon: '⚛️', desc: 'Component Systems' },
];

const TRADING_SUBJECTS = [
    { id: 'basics', title: 'Market Mechanics', icon: '📉', desc: 'Fundamental Analysis' },
    { id: 'technical', title: 'Technical Mastery', icon: '📊', desc: 'Chart Patterns' },
    { id: 'crypto', title: 'Web3 Finance', icon: '₿', desc: 'Blockchain Trading' },
];

export const LearningPath: React.FC<LearningPathProps> = ({ type, onClose }) => {
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPathLoading, setIsPathLoading] = useState(false);

  const initPath = async (subject: any) => {
    setIsPathLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a detailed syllabus for ${subject.title} for ${type} learners. Architect: Sumukha S. System: Dream Space AI. Ensure the hierarchy is sophisticated and logical.`,
        config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              levels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    modules: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING }
                        },
                        required: ['id', 'title']
                      }
                    }
                  },
                  required: ['title', 'modules']
                }
              }
            },
            required: ['levels']
          }
        }
      });
      const data = JSON.parse(response.text || '{"levels":[]}');
      setSyllabus(data.levels || []);
      setSelectedSubject(subject);
    } catch (e) { 
      console.error("Lattice Syllabus Fault:", e); 
      alert("Failed to synthesize educational lattice.");
    } finally { setIsPathLoading(false); }
  };

  const loadModule = async (m: any) => {
    setLoading(true); setActiveModule(m);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Teach module: "${m.title}" in depth for the ${selectedSubject.title} course. Use professional, elite academic tone. Format with clear Markdown headings and lists. Architect: Sumukha S. System: Dream Space AI.`
      });
      setLessonContent(res.text || '');
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all text-xs font-black uppercase">← Back</button>
          <div className="h-6 w-px bg-white/10"></div>
          <h2 className="text-xl font-black text-emerald-400 uppercase italic tracking-tighter">Academy_{type.toUpperCase()}</h2>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white">✕</button>
      </header>

      {!selectedSubject ? (
        <div className="flex-1 flex flex-col p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">Sovereign <span className="text-emerald-400">{type === 'coding' ? 'Code_Base' : 'Market_Lattice'}</span></h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.8em]">Dream Space AI Learning Node // Sumukha S.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(type === 'coding' ? CODING_SUBJECTS : TRADING_SUBJECTS).map(s => (
                <button key={s.id} onClick={() => initPath(s)} className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all text-left space-y-6 group shadow-2xl relative overflow-hidden">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{s.title}</h4>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">{s.desc}</p>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-emerald-500 uppercase">Uplink_Ready</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {isPathLoading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-in fade-in">
              <div className="relative">
                 <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full"></div>
                 <div className="w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
              </div>
              <p className="text-emerald-400 font-black uppercase tracking-[1em] text-xs">Uplinking to Grid...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-[340px] border-r border-white/5 bg-black/40 p-10 overflow-y-auto custom-scrollbar shrink-0">
             <div className="mb-12">
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{selectedSubject.title}</h3>
                <p className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest mt-1">Operational Lattice</p>
             </div>
             {syllabus.map((lvl, i) => (
               <div key={i} className="mb-10 last:mb-0 space-y-4">
                 <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] px-4 border-l-2 border-emerald-500/20">{lvl.title}</h4>
                 <div className="space-y-2">
                   {lvl.modules.map((m: any) => (
                     <button key={m.id} onClick={() => loadModule(m)} className={`w-full text-left p-5 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-tight leading-snug group ${activeModule?.id === m.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-transparent border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}>
                       {m.title}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
          </aside>
          <main className="flex-1 p-16 overflow-y-auto custom-scrollbar relative bg-black/20">
             {loading ? (
               <div className="h-full flex flex-col items-center justify-center gap-8 animate-pulse text-emerald-500">
                  <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="font-black uppercase tracking-[0.5em] text-[10px]">Syncing Scholar Stream...</p>
               </div>
             ) : activeModule ? (
               <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
                  <div className="prose prose-invert prose-emerald prose-xl max-w-none">
                    <ReactMarkdown>{lessonContent}</ReactMarkdown>
                  </div>
                  <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center opacity-30">
                    <span className="text-[9px] font-black uppercase tracking-widest">Architect: Sumukha S.</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Node_ID: {activeModule.id}</span>
                  </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-[0.03] gap-12 grayscale">
                  <div className="text-[200px]">🏛️</div>
                  <p className="text-4xl font-black uppercase tracking-[1.5em]">LATTICE_STANDBY</p>
               </div>
             )}
          </main>
        </div>
      )}
    </div>
  );
};
