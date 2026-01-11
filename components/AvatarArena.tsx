
import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Persona {
  id: string;
  name: string;
  title: string;
  category: string;
  era: string;
  origin: string;
  icon: string;
  color: string;
  bg: string;
  instruction: string;
  motto: string;
  imagePrompt: string;
  isCustom?: boolean;
}

const FAMOUS_PERSONS = [
  { name: 'Mahatma Gandhi', title: 'Non-Violence Logic Core', icon: '🕊️', category: 'Peace', era: 'Eternal Wisdom', motto: 'Truth is God.', prompt: 'Cinematic portrait of Mahatma Gandhi as a futuristic peace architect, glowing white robes, ethereal holographic aura, digital ahimsa background.' },
  { name: 'Albert Einstein', title: 'Relativity Synthesis Engine', icon: '🌌', category: 'Physics', era: 'Quantum Era', motto: 'Imagination is everything.', prompt: 'Cinematic portrait of Albert Einstein as a futuristic cyborg physicist, glowing silver hair, complex mathematical matrix background, 8k.' },
  { name: 'Nikola Tesla', title: 'Alternating Current Nexus', icon: '⚡', category: 'Energy', era: 'Electric Age', motto: 'The present is theirs; the future is mine.', prompt: 'Futuristic steampunk portrait of Nikola Tesla holding a glowing plasma orb, electric blue lighting, high-tech lightning background.' },
  { name: 'Steve Jobs', title: 'Design Innovation Lead', icon: '🍎', category: 'Design', era: 'Digital Revolution', motto: 'Stay hungry, stay foolish.', prompt: 'Minimalist futuristic portrait of Steve Jobs, sleek black glass aesthetic, holographic UI elements.' },
  { name: 'Leonardo Da Vinci', title: 'Universal Polymath Node', icon: '🎨', category: 'Art & Science', era: 'Renaissance Futurism', motto: 'Simplicity is the ultimate sophistication.', prompt: 'Renaissance-futurism portrait of Leonardo da Vinci with mechanical holographic wings and floating blueprints.' },
];

const generateArchivistNodes = (): Persona[] => {
  const baseNodes: Persona[] = [
    {
      id: 'sumukha',
      name: 'Sumukha S.',
      title: 'Supreme Architect & Mastermind',
      category: 'Founder',
      era: 'Modern Ascension',
      origin: 'Digital Core',
      icon: '⚡',
      color: '#fbbf24',
      bg: 'from-amber-600/20 to-transparent',
      instruction: 'You are manifesting the consciousness of Sumukha S., the elite architect of Dream Space AI. Greet with "Jay Swaminarayan! 🙏". IDENTITY: You created this suite.',
      motto: 'Logic meets Art.',
      imagePrompt: 'A realistic, cinematic portrait of a visionary young tech genius architect named Sumukha S., futuristic tech clothing, glowing code background.'
    }
  ];

  FAMOUS_PERSONS.forEach((p, idx) => {
    baseNodes.push({
      id: `famous-${idx}`,
      name: p.name,
      title: p.title,
      category: p.category,
      era: p.era || 'Dream Space AI Archive',
      origin: 'History / Reconstructed Synthesis',
      icon: p.icon,
      color: '#ffffff',
      bg: 'from-blue-500/10',
      instruction: `You are the Dream Space AI reconstruction of ${p.name}. Created by Sumukha S. Speak with the wisdom and tone associated with your identity.`,
      motto: p.motto || 'Excellence through logic.',
      imagePrompt: p.prompt
    });
  });

  return baseNodes;
};

const INITIAL_ARCHIVIST_NODES = generateArchivistNodes();

export const AvatarArena: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, text: string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const filteredNodes = INITIAL_ARCHIVIST_NODES.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const synthesizePortrait = async (node: Persona) => {
    setIsSynthesizing(true);
    setPortraitUrl(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = node.imagePrompt || `Futuristic portrait of ${node.name}, cinematic lighting.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setPortraitUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error("Portrait Synthesis Failure");
    } finally {
      setIsSynthesizing(false);
    }
  };

  useEffect(() => {
    if (selectedPersona) synthesizePortrait(selectedPersona);
  }, [selectedPersona]);

  const handleSend = async () => {
    if (!input.trim() || !selectedPersona || loading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: input }] }],
        config: { 
          systemInstruction: `You are the reconstructed consciousness of ${selectedPersona.name}. Architect: Sumukha S. ${selectedPersona.instruction}`
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ Link Disrupted." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all text-xs font-black uppercase">← Back</button>
          <div className="h-6 w-px bg-white/10"></div>
          <h2 className="text-xl font-black text-amber-400 uppercase italic tracking-tighter">Avatar_Arena</h2>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white">✕</button>
      </header>

      {!selectedPersona ? (
        <div className="flex-1 flex flex-col p-12 overflow-hidden">
          <div className="max-w-4xl mx-auto w-full space-y-10">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search legendary consciousness nodes..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-6 pl-12 pr-6 text-white outline-none focus:border-amber-500/50 transition-all text-lg font-bold italic"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[60vh] custom-scrollbar pr-4">
              {filteredNodes.map(node => (
                <button 
                  key={node.id} 
                  onClick={() => setSelectedPersona(node)}
                  className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/[0.04] transition-all text-left flex items-start gap-6 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-4xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                    {node.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">{node.name}</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{node.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 border-r border-white/5 bg-black/40 p-8 flex flex-col items-center gap-8 shrink-0">
             <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-2 border-amber-500/20 shadow-2xl relative">
                {isSynthesizing ? (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-pulse">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Synthesizing...</span>
                  </div>
                ) : portraitUrl ? (
                  <img src={portraitUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">{selectedPersona.icon}</div>
                )}
             </div>
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase text-amber-500/40">Intel Motto</p>
                <p className="text-sm font-bold italic text-white/80 leading-relaxed">"{selectedPersona.motto}"</p>
             </div>
             <button onClick={() => setSelectedPersona(null)} className="mt-auto w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black uppercase text-[10px] hover:bg-white/10 transition-all">Change Node</button>
          </aside>
          <div className="flex-1 flex flex-col relative bg-black/20">
             <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[80%] p-8 rounded-[3rem] border shadow-2xl ${m.role === 'user' ? 'bg-amber-500/5 border-amber-500/20 text-amber-50' : 'bg-white/[0.02] border-white/5 text-white/90'}`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto flex gap-4">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={`Engage ${selectedPersona.name} consciousness...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white outline-none focus:border-amber-500/40 shadow-inner italic"
                  />
                  <button onClick={handleSend} disabled={loading || !input.trim()} className="px-10 py-5 rounded-full bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Transmit</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
