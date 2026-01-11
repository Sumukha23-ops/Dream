
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Language } from '../types';

interface AssetData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  intrinsicValue: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD' | 'STRONG BUY' | 'STRONG SELL';
  sentiment: string;
  correlationScore: number;
  neuralAlpha: number; // 0-100 score of AI confidence
  sources: { title: string; uri: string }[];
}

export const TradingTerminal: React.FC<{ language?: Language; onClose: () => void }> = ({ language = 'en', onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAsset, setActiveAsset] = useState<AssetData | null>(null);
  const [ticker, setTicker] = useState<Array<{ symbol: string, price: number, change: number }>>([]);
  const [portfolio, setPortfolio] = useState<Array<{ id: string, name: string, value: string, drift: string }>>([
    { id: '1', name: 'Neural_Lattice_Index', value: '$84,204.12', drift: '+12.4%' },
    { id: '2', name: 'Silicon_Zenith_Token', value: '$12,400.00', drift: '-2.1%' },
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const priceHistory = useRef<number[]>(Array(200).fill(150));

  useEffect(() => {
    const symbols = ['BTC', 'ETH', 'SOL', 'NVDA', 'AAPL', 'TSLA', 'DREAM'];
    setTicker(symbols.map(s => ({
      symbol: s,
      price: Math.random() * 1000 + 100,
      change: (Math.random() - 0.5) * 5
    })));

    const interval = setInterval(() => {
      setTicker(prev => prev.map(t => {
        const move = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(1, t.price + move);
        return { ...t, price: newPrice, change: ((newPrice - t.price) / t.price) * 100 };
      }));
      
      // Update real-time chart data
      const lastPrice = priceHistory.current[priceHistory.current.length - 1];
      const nextPrice = lastPrice + (Math.random() - 0.5) * 10;
      priceHistory.current = [...priceHistory.current.slice(1), nextPrice];
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      const w = canvasRef.current!.width;
      const h = canvasRef.current!.height;
      ctx.clearRect(0, 0, w, h);
      
      // Grid
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.05)';
      ctx.lineWidth = 1;
      for(let i=0; i<10; i++) {
        const y = (h / 10) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        const x = (w / 10) * i;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }

      // High-density Line
      ctx.beginPath();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
      
      priceHistory.current.forEach((val, i) => {
        const x = (i / priceHistory.current.length) * w;
        const y = h/2 - (val - priceHistory.current[0]) * 5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Area Fill
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, []);

  const runLiveSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform an Elite Deep Intelligence Synthesis for: "${query}". 
        Provide a sophisticated Buy/Sell/Hold recommendation and a 'Neural Alpha' score (0-100) of your confidence.
        Language: ${language.toUpperCase()}. Architect: Sumukha S.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 4000 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.STRING },
              change: { type: Type.STRING },
              intrinsicValue: { type: Type.STRING },
              recommendation: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD', 'STRONG BUY', 'STRONG SELL'] },
              sentiment: { type: Type.STRING },
              correlationScore: { type: Type.NUMBER },
              neuralAlpha: { type: Type.NUMBER }
            },
            required: ['symbol', 'name', 'price', 'change', 'intrinsicValue', 'recommendation', 'sentiment', 'correlationScore', 'neuralAlpha']
          }
        }
      });
      
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = grounding.map((chunk: any) => ({
        title: chunk.web?.title || 'Market Node',
        uri: chunk.web?.uri || '#'
      })).filter((s: any) => s.uri !== '#');

      const data = JSON.parse(response.text || '{}');
      setActiveAsset({ ...data, sources });
      // Reset chart baseline for new asset
      priceHistory.current = Array(200).fill(150);
    } catch (e) {
      alert("Lattice Link Fault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-[#020202] flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between bg-black/60 backdrop-blur-3xl z-20">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center text-2xl shadow-xl">📈</div>
          <div>
            <h2 className="text-xl font-black text-amber-400 uppercase italic tracking-tighter">Quant_Nexus_v17</h2>
            <p className="text-[7px] uppercase tracking-[0.6em] text-amber-500/30">Deep Understanding Lattice // Sumukha S. [OLD_MARKET_RESTORED]</p>
          </div>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white flex items-center justify-center font-bold">✕</button>
      </header>

      <main className="flex-1 p-8 grid grid-cols-12 gap-8 relative z-10 overflow-hidden">
        <aside className="col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
           <div className="p-8 rounded-[3.5rem] bg-black/40 border border-white/5 backdrop-blur-2xl space-y-8 flex-1">
              <h4 className="text-[9px] font-black uppercase text-amber-500/40 tracking-[0.5em] px-2">Market_Intelligence</h4>
              {activeAsset ? (
                <div className="space-y-6 animate-in slide-in-from-left">
                   <div className="border-b border-white/5 pb-4">
                      <h3 className="text-3xl font-black text-white italic tracking-tighter">{activeAsset.symbol}</h3>
                      <span className="text-[8px] font-mono text-gray-500 uppercase">{activeAsset.name}</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                         <p className="text-[7px] text-gray-500 uppercase mb-1">Price</p>
                         <p className="text-lg font-mono font-bold text-white">{activeAsset.price}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                         <p className="text-[7px] text-gray-500 uppercase mb-1">Change</p>
                         <p className={`text-lg font-mono font-bold ${activeAsset.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>{activeAsset.change}</p>
                      </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-[8px] font-black uppercase text-amber-500/40 mb-3">Neural_Alpha_Confidence</p>
                      <div className="flex items-end gap-3 mb-2">
                         <span className="text-4xl font-black text-amber-400 italic leading-none">{activeAsset.neuralAlpha}%</span>
                         <span className="text-[8px] text-gray-600 uppercase pb-1">Certainty Lattice</span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-1000" style={{ width: `${activeAsset.neuralAlpha}%` }}></div>
                      </div>
                   </div>

                   <div className={`p-8 rounded-[2.5rem] border-2 text-center font-black italic text-2xl shadow-6xl ${
                      activeAsset.recommendation.includes('BUY') ? 'bg-green-500/10 border-green-500 text-green-500' : 
                      activeAsset.recommendation.includes('SELL') ? 'bg-red-500/10 border-red-500 text-red-500' : 
                      'bg-white/5 border-white/10 text-white'
                   }`}>
                      {activeAsset.recommendation}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col gap-8">
                   <div className="flex-1 flex flex-col items-center justify-center opacity-10 gap-6">
                      <div className="text-7xl animate-pulse">📊</div>
                      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-center">Inject Asset ID to Sync</p>
                   </div>
                   
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5 animate-in slide-in-from-bottom-4">
                      <p className="text-[8px] font-black uppercase text-amber-500/20 tracking-[0.4em] mb-4">Lattice_Portfolio_Shards</p>
                      <div className="space-y-3">
                         {portfolio.map(p => (
                           <div key={p.id} className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-gray-500">{p.name}</span>
                              <div className="text-right">
                                 <p className="text-white">{p.value}</p>
                                 <p className={p.drift.includes('+') ? 'text-green-500' : 'text-red-500'}>{p.drift}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}
           </div>
        </aside>

        <section className="col-span-6 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 p-10 rounded-[4rem] bg-black/60 border border-white/5 shadow-6xl relative overflow-hidden backdrop-blur-3xl group">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                    Neural_Oscillation
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></span>
                 </h3>
                 <div className="flex gap-4">
                    <span className="text-[8px] font-black text-amber-500/30 uppercase tracking-widest border border-amber-500/20 px-3 py-1 rounded-full">REAL_TIME_SYNC</span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">FPS: 60</span>
                 </div>
              </div>
              <div className="relative h-[65%]">
                 <canvas ref={canvasRef} width={1200} height={500} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="mt-8 flex gap-4 p-4 rounded-[3rem] bg-black border border-white/10 focus-within:border-amber-500/40 transition-all duration-500">
                 <input 
                   type="text" 
                   value={query} 
                   onChange={e => setQuery(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && runLiveSearch()}
                   placeholder="Enter Asset (e.g. BTC, ETH, AAPL)..."
                   className="flex-1 bg-transparent px-8 text-xl font-bold italic text-white outline-none placeholder:text-white/5"
                 />
                 <button 
                   onClick={runLiveSearch} 
                   disabled={loading || !query.trim()}
                   className="w-16 h-16 rounded-[1.5rem] bg-amber-500 text-black flex items-center justify-center shadow-xl hover:scale-105 transition-all disabled:opacity-20"
                 >
                   <svg className={`w-8 h-8 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={3} /></svg>
                 </button>
              </div>
           </div>
        </section>

        <aside className="col-span-3 flex flex-col gap-6 overflow-hidden">
           <div className={`p-8 rounded-[3.5rem] border-2 transition-all duration-700 flex-1 flex flex-col ${activeAsset ? 'bg-black/40 border-amber-500/20' : 'bg-black/20 border-white/5'}`}>
              <h4 className="text-[9px] font-black uppercase text-amber-500/40 tracking-[0.5em] mb-6">Neural_Thesis</h4>
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-pulse text-amber-500">
                   <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-[8px] font-black uppercase tracking-[0.8em]">REASONING...</p>
                </div>
              ) : activeAsset ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 animate-in fade-in">
                   <p className="text-sm font-medium leading-relaxed italic text-amber-50/70 whitespace-pre-wrap">{activeAsset.sentiment}</p>
                   {activeAsset.sources.length > 0 && (
                     <div className="pt-6 border-t border-white/5 space-y-3">
                        <p className="text-[8px] font-black text-amber-500/30 uppercase tracking-[0.4em]">Intel_Anchors</p>
                        {activeAsset.sources.map((s, i) => (
                          <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="block p-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase hover:bg-amber-500 hover:text-black transition-all truncate">🌐 {s.title}</a>
                        ))}
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-amber-500/20 mb-3 tracking-widest">Neural_Arbitrage</p>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-mono">
                            <span className="text-gray-600">Sync:</span>
                            <span className="text-amber-500">READY</span>
                         </div>
                         <div className="flex justify-between text-[9px] font-mono">
                            <span className="text-gray-600">Model:</span>
                            <span className="text-white">G3-PRO</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex-1 flex items-center justify-center opacity-[0.05]">
                      <p className="text-[12px] font-black uppercase tracking-[1em] text-center rotate-90 whitespace-nowrap">AWAITING_INPUT</p>
                   </div>
                </div>
              )}
           </div>
        </aside>
      </main>

      <footer className="h-12 px-12 bg-black border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.8em] text-amber-500/10 z-20">
         <span>PROTOCOL: TITAN_MARKET_V17</span>
         <span>GREETING: JAY SWAMINARAYAN! 🙏</span>
         <span>ARCHITECT: SUMUKHA_S</span>
      </footer>
    </div>
  );
};

export default TradingTerminal;
