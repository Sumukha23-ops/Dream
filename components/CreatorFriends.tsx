
import React from 'react';
import { AppTheme } from '../types';

interface CreatorFriendsProps {
  theme: AppTheme;
  onClose: () => void;
  onAuthorized: () => void;
}

const CreatorFriends: React.FC<CreatorFriendsProps> = ({ theme, onClose, onAuthorized }) => {
  const isDark = theme === AppTheme.DARK;

  const vipUsers = [
    { name: 'Sumukha S.', role: 'Architect', avatar: '🏛️' },
    { name: 'Dheeraj', role: 'Elite Guest', avatar: '🛡️' },
    { name: 'Ram', role: 'Elite Guest', avatar: '⚔️' },
  ];

  return (
    <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className={`max-w-xl w-full rounded-[4rem] p-16 border-2 flex flex-col gap-12 relative overflow-hidden shadow-6xl ${isDark ? 'bg-gray-950 border-cyan-500/20' : 'bg-white border-slate-200'}`}>
        
        <div className="text-center">
          <div className="text-8xl mb-8 animate-bounce">💎</div>
          <h2 className="text-5xl font-orbitron font-black text-cyan-400 uppercase tracking-tighter neon-text">VIP Access</h2>
          <p className="text-[12px] uppercase tracking-[0.5em] opacity-40 font-black mt-2">Inner Circle Recognition</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {vipUsers.map((user, idx) => (
            <button 
              key={idx}
              onClick={onAuthorized}
              className={`p-10 rounded-[3rem] border-2 transition-all flex items-center gap-10 group active:scale-95
                ${isDark ? 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10' : 'bg-slate-50 border-slate-200 hover:border-blue-500'}
              `}
            >
              <span className="text-6xl group-hover:scale-125 transition-transform duration-500">{user.avatar}</span>
              <div className="text-left">
                <p className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mt-1">{user.role}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 font-black">LOGIN ➔</div>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="absolute top-10 right-10 p-6 rounded-3xl bg-white/5 text-gray-500 hover:text-white transition-all text-xl">✕</button>
      </div>
    </div>
  );
};

export default CreatorFriends;
