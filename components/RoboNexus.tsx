
import React, { useState, useEffect, useRef } from 'react';
import { AppTheme } from '../types';
import { geminiService } from '../services/geminiService';

interface RoboNexusProps {
  theme: AppTheme;
  onClose: () => void;
}

const ROBOTICS_MODELS = [
  { id: 'esp32', name: 'ESP32 (WROOM)', type: 'Dual-Core IoT', protocol: 'SPI/I2C/UART' },
  { id: 'stm32', name: 'STM32 (F4)', type: 'ARM Cortex-M4', protocol: 'DMA/ADC/CAN' },
  { id: 'arduino', name: 'Arduino (Nano)', type: '8-Bit Realtime', protocol: 'PWM/Analog' },
  { id: 'fpga', name: 'Verilog FPGA', type: 'Parallel Gates', protocol: 'HVL/Logical' },
];

const RoboNexus: React.FC<RoboNexusProps> = ({ theme, onClose }) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calcValues, setCalcValues] = useState({ voltage: 5, resistance: 220, current: 0.0227 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCalc = (v: number, r: number) => {
    const i = r === 0 ? 0 : v / r;
    setCalcValues({ voltage: v, resistance: r, current: i });
  };

  const submitQuery = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const query = customInput || terminalInput;
    if (!query.trim() || isProcessing) return;

    setTerminalInput('');
    setTerminalHistory(prev => [...prev, { role: 'user', text: query }]);
    setIsProcessing(true);

    try {
      const response = await geminiService.generateChatResponse(
        `[ROBO-NEXUS LAB] Engineering Protocol. Query: ${query}`,
        'THINK' as any,
        theme
      );
      setTerminalHistory(prev => [...prev, { role: 'ai', text: response.text }]);
    } catch (err) {
      setTerminalHistory(prev => [...prev, { role: 'ai', text: "ERROR: NEURAL BRIDGE INTERRUPTED." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-[#020617] flex items-center justify-center p-4 animate-in fade-in duration-500 overflow-hidden">
      <div className={`max-w-[1300px] w-full h-[85vh] rounded-[3rem] p-8 border-2 flex flex-col gap-8 relative overflow-hidden transition-all ${isDark ? 'bg-gray-950 border-cyan-500/20 shadow-4xl' : 'bg-white border-slate-200'}`}>
        
        <header className="flex justify-between items-center z-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-[1.2rem] bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center text-2xl shadow-xl">🤖</div>
            <div>
              <h2 className="text-3xl font-orbitron font-black uppercase tracking-tighter text-cyan-400 neon-text">Robo_Nexus</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-black">Titan Engineering Lab // Sumukha S.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/5 shadow-3xl">✕</button>
        </header>

        <div className="flex-1 flex gap-8 overflow-hidden z-10">
          <aside className="w-[320px] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="p-6 rounded-[2rem] border-2 bg-white/5 border-white/5 shadow-xl">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500/40 mb-6">Hardware</h3>
              <div className="space-y-3">
                {ROBOTICS_MODELS.map(m => (
                  <button key={m.id} onClick={() => submitQuery(undefined, `Show pinout for ${m.name}`)}
                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-transparent hover:border-cyan-500/40 transition-all text-left">
                    <p className="text-sm font-black uppercase text-white">{m.name}</p>
                    <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">{m.type}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[2rem] border-2 bg-white/5 border-white/5 shadow-xl flex flex-col gap-4">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500/40">Ohm_Calc</h3>
              <div className="space-y-3">
                <input type="number" value={calcValues.voltage} onChange={(e) => handleCalc(Number(e.target.value), calcValues.resistance)} className="w-full bg-black/60 border-2 border-white/5 rounded-xl p-3 text-cyan-400 font-mono text-sm focus:border-cyan-500/40" />
                <input type="number" value={calcValues.resistance} onChange={(e) => handleCalc(calcValues.voltage, Number(e.target.value))} className="w-full bg-black/60 border-2 border-white/5 rounded-xl p-3 text-cyan-400 font-mono text-sm focus:border-cyan-500/40" />
                <div className="mt-2 p-6 rounded-2xl bg-cyan-500/5 border-2 border-cyan-500/20 text-center">
                  <p className="text-2xl font-mono font-black text-cyan-400 tracking-tighter">{calcValues.current.toFixed(4)}A</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col gap-6 bg-black/40 rounded-[2.5rem] border-2 border-white/5 p-8 overflow-hidden relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4">
              {terminalHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-mono text-cyan-500/40 uppercase">{msg.role === 'user' ? '[IO]' : '[NEXUS]'}</span>
                  <div className={`max-w-[92%] p-6 rounded-[2rem] border-2 ${msg.role === 'user' ? 'bg-cyan-500/10 border-cyan-500/40 text-white' : 'bg-white/5 border-white/10 text-cyan-50/90'}`}>
                    <div className="prose prose-invert prose-cyan max-w-none font-mono text-sm leading-relaxed">
                      {msg.text.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submitQuery} className="relative mt-auto">
              <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} disabled={isProcessing}
                placeholder="Hardware command..."
                className="w-full bg-black/60 border-2 border-white/10 rounded-[2rem] py-4 pl-6 pr-32 outline-none text-base font-mono text-cyan-100 focus:border-cyan-500/40 shadow-xl"
              />
              <button type="submit" disabled={isProcessing || !terminalInput.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-cyan-500 text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14 5l7 7-7 7" /></svg>
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoboNexus;
