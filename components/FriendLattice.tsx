
import React, { useState, useEffect, useRef } from 'react';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
}

const FRIENDS: Friend[] = [
  { id: '1', name: 'Dheeraj', email: 'af6574@gurukul.org', avatar: '🛡️', status: 'Lattice sync active.' },
  { id: '2', name: 'Ram S', email: 'af4931@gurukul.org', avatar: '⚔️', status: 'Online' },
  { id: '3', name: 'Sumukha', email: 'ae4981@gurukul.org', avatar: '🏛️', status: 'Master Architect' },
];

export const FriendLattice: React.FC<{ onClose: () => void, isCreator: boolean }> = ({ onClose, isCreator }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isCreator);
  const [password, setPassword] = useState('');
  const [activeFriend, setActiveFriend] = useState<Friend>(FRIENDS[0]);
  const [messages, setMessages] = useState<Record<string, Array<{ text: string, sent: boolean, time: string }>>>({
    '1': [{ text: 'Architect, the grid is synchronized and ready for deployment.', sent: false, time: '11:00 AM' }],
    '2': [{ text: 'Awaiting your command, Sumukha. The new modules are looking sharp.', sent: false, time: '10:45 AM' }],
    '3': [{ text: 'Dream Space AI core is stable. Proceed with high-fidelity synthesis.', sent: true, time: 'Now' }],
  });
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeFriend, isAuthenticated]);

  const handleAuth = () => {
    if (password === 'Sumkey!@#$' || password === 'Sumukha!@#$') {
      setIsAuthenticated(true);
    } else {
      alert("KEY_MISMATCH: Unauthorized Inner Circle access.");
      setPassword('');
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => ({
      ...prev,
      [activeFriend.id]: [...(prev[activeFriend.id] || []), { text: inputText, sent: true, time: now }]
    }));
    setInputText('');
    
    // Logic: Simulated responses removed for a "Real Chat" feeling as requested.
    // This allows the user to use the lattice as a sandbox for private architectural notes/real messaging vibes.
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[1500] bg-black/98 flex items-center justify-center p-6 animate-in zoom-in duration-500 font-orbitron">
        <div className="max-w-md w-full bg-[#0b0b0b] border-2 border-green-500/20 rounded-[3rem] p-12 text-center space-y-10 shadow-6xl relative overflow-hidden">
           <div className="absolute inset-0 bg-green-500/5 blur-[80px] rounded-full"></div>
           <div className="text-7xl relative z-10 animate-pulse">⚔️</div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-2xl font-black text-green-400 uppercase italic">Inner_Circle_Lock</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">Verification required to access private architectural chat lattice.</p>
           </div>
           <div className="space-y-6 relative z-10">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-xl font-black text-green-400 outline-none focus:border-green-500/40 text-center tracking-widest"
                placeholder="••••••••"
                autoFocus
              />
              <div className="flex gap-4">
                 <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 text-[10px] font-black uppercase">Cancel</button>
                 <button onClick={handleAuth} className="flex-[2] py-4 rounded-2xl bg-green-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">Establish_Link</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex items-center justify-center p-4 animate-in zoom-in duration-500 font-orbitron">
      <div className="w-full h-full max-w-7xl rounded-[4rem] border-2 border-green-500/20 bg-[#0b141a] flex shadow-6xl overflow-hidden relative">
        
        {/* Sidebar */}
        <aside className="w-96 border-r border-white/5 bg-[#111b21] flex flex-col">
           <header className="p-8 border-b border-white/5 bg-[#202c33] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center text-2xl shadow-lg">🏛️</div>
              <div>
                 <h2 className="text-sm font-black text-white uppercase italic tracking-tighter">Inner_Circle</h2>
                 <p className="text-[7px] text-green-500 uppercase tracking-[0.4em]">Grid: 0x8F...A1</p>
              </div>
           </header>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {FRIENDS.map(f => (
                <button 
                  key={f.id} 
                  onClick={() => setActiveFriend(f)}
                  className={`w-full p-4 rounded-xl transition-all flex items-center gap-4 group ${activeFriend.id === f.id ? 'bg-[#2a3942] border border-white/5 shadow-xl' : 'hover:bg-[#202c33]'}`}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-800 border border-white/5 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">{f.avatar}</div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-[13px] font-bold truncate ${activeFriend.id === f.id ? 'text-white' : 'text-gray-300'}`}>{f.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{f.status}</p>
                  </div>
                </button>
              ))}
           </div>
        </aside>

        {/* Messaging Core */}
        <main className="flex-1 flex flex-col bg-[#0b141a] relative">
           <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#202c33] shrink-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="text-3xl animate-float">{activeFriend.avatar}</div>
                 <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{activeFriend.name}</h3>
                    <p className="text-[9px] text-green-500/60 uppercase tracking-widest">{activeFriend.status}</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center text-xl">✕</button>
           </header>

           <section className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-4 bg-[url('https://i.pinimg.com/originals/85/ec/da/85ecda1afc2264426549294e1014e7a3.png')] bg-repeat bg-opacity-5">
              {messages[activeFriend.id]?.map((m, i) => (
                <div key={i} className={`flex ${m.sent ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                   <div className={`max-w-[65%] p-4 rounded-2xl shadow-xl relative ${m.sent ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none border border-white/5'}`}>
                      <p className="text-md font-medium leading-relaxed tracking-tight">{m.text}</p>
                      <p className="text-[8px] font-bold opacity-40 mt-1 text-right uppercase">{m.time}</p>
                      <div className={`absolute top-0 w-3 h-3 ${m.sent ? 'right-[-8px] border-l-[10px] border-l-[#005c4b] border-b-[10px] border-b-transparent' : 'left-[-8px] border-r-[10px] border-r-[#202c33] border-b-[10px] border-b-transparent'}`}></div>
                   </div>
                </div>
              ))}
              <div ref={chatEndRef} />
           </section>

           <footer className="p-6 bg-[#202c33] flex items-center gap-4">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${activeFriend.name}...`}
                className="flex-1 bg-[#2a3942] border-none rounded-full px-8 py-4 text-white outline-none text-md placeholder:text-gray-500 italic"
              />
              <button 
                onClick={handleSend}
                className="w-14 h-14 rounded-full bg-[#00a884] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
           </footer>
        </main>
      </div>
    </div>
  );
};
