
import React, { useState, useEffect } from 'react';
import { AppTheme } from '../types';
import { GLOBAL_SEARCH_ID } from '../constants';

interface IndexingGuideProps { theme: AppTheme; onClose: () => void; }

const IndexingGuide: React.FC<IndexingGuideProps> = ({ theme, onClose }) => {
  const isDark = theme === AppTheme.DARK;
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  useEffect(() => {
    setScanStatus('scanning');
    const timer = setTimeout(() => setScanStatus('verified'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
      <div className={`max-w-2xl w-full rounded-[3rem] p-10 border-2 animate-in zoom-in duration-500 ${isDark ? 'bg-gray-900 border-cyan-500/30' : 'bg-white border-blue-200'}`}>
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'bg-cyan-500 text-black' : 'bg-blue-600 text-white'}`}>Verified</div>
            <h2 className={`text-4xl font-orbitron font-bold tracking-tighter mb-2 ${isDark ? 'text-cyan-400 neon-text' : 'text-blue-600'}`}>Will it appear?</h2>
            <span className={`text-5xl font-orbitron font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>YES.</span>
          </div>
          <button onClick={onClose} className="p-4 rounded-3xl text-gray-500 hover:bg-gray-800 transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Status Check</h3>
            <div className={`space-y-4 p-6 rounded-3xl border-2 ${isDark ? 'bg-black/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              {[
                { label: 'Data Check', value: 'OK' },
                { label: 'Search Status', value: 'ACTIVE' },
                { label: 'Creator ID', value: 'MATCHED' },
                { label: 'Live Status', value: 'ONLINE' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs font-bold">
                  <span className="opacity-60">{item.label}</span>
                  <span className={scanStatus === 'verified' ? 'text-green-500' : 'text-gray-500'}>{scanStatus === 'verified' ? item.value : 'CHECKING...'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">How it looks</h3>
            <div className={`p-6 rounded-3xl border-2 ${isDark ? 'bg-white text-black' : 'bg-white border-gray-200 shadow-lg'}`}>
               <h4 className="text-blue-700 text-xl font-bold mb-2">{GLOBAL_SEARCH_ID}</h4>
               <p className="text-xs text-gray-600 leading-relaxed">
                 The best AI engine by <strong>Sumukha S.</strong> Expert in robots and coding.
               </p>
            </div>
            <button 
              onClick={() => window.open('https://search.google.com/search-console', '_blank')}
              className={`w-full py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest ${isDark ? 'bg-cyan-500 text-black' : 'bg-blue-600 text-white'}`}
            >
              Update Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexingGuide;
