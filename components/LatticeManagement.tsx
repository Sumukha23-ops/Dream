
import React, { useState } from 'react';
import NeuralScan from './NeuralScan';

interface LatticeManagementProps {
  onRegister: (name: string, hash: string) => void;
  onClose: () => void;
  knownHashes: Record<string, string>;
}

const LatticeManagement: React.FC<LatticeManagementProps> = ({ onRegister, onClose, knownHashes }) => {
  const [step, setStep] = useState<'IDLE' | 'ARCHITECT_SCAN' | 'INPUT_NAME' | 'NODE_SCAN' | 'SUCCESS'>('IDLE');
  const [newName, setNewName] = useState('');

  const startRegistration = () => setStep('ARCHITECT_SCAN');
  const handleArchitectSuccess = () => setStep('INPUT_NAME');
  const handleNameSubmit = (e: React.FormEvent) => { e.preventDefault(); if (newName.trim()) setStep('NODE_SCAN'); };

  const handleNodeScanSuccess = (name: string, hash: string) => {
    onRegister(newName, hash);
    setStep('SUCCESS');
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-black/95 flex items-center justify-center p-6 backdrop-blur-3xl animate-in zoom-in font-orbitron">
      <div className="max-w-xl w-full bg-[#050505] rounded-[4rem] p-12 border-2 border-amber-500/20 flex flex-col gap-10 relative overflow-hidden shadow-6xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-amber-500/40"></div>
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-amber-400 tracking-tighter uppercase italic">Lattice_Registry</h2>
            <p className="text-[8px] uppercase font-black tracking-[0.4em] text-amber-500/30">Node Initialization Protocol</p>
          </div>
          <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 transition-all border border-white/5">✕</button>
        </div>

        {step === 'IDLE' && (
          <div className="space-y-10 py-4 animate-in fade-in">
            <div className="p-10 rounded-[3rem] bg-amber-500/5 border border-amber-500/20 flex flex-col gap-8 text-center">
              <div className="text-7xl">🏛️</div>
              <div className="space-y-4">
                <p className="text-xl font-black text-amber-400 uppercase tracking-tighter italic">Architect Access Protocol</p>
                <p className="text-[10px] font-medium text-amber-50/40 leading-relaxed uppercase tracking-widest">
                  To register a new node, the primary architect scan is required for multi-factor lattice synchronization.
                </p>
              </div>
            </div>
            <button 
              onClick={startRegistration}
              className="w-full py-8 rounded-3xl bg-amber-500 text-black font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Verify_Architect_Signature
            </button>
          </div>
        )}

        {step === 'INPUT_NAME' && (
          <form onSubmit={handleNameSubmit} className="space-y-10 py-4 animate-in slide-in-from-bottom-6">
            <div className="flex flex-col gap-6 text-center">
              <label className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-500/30">Define Node Identity</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="NODE_SYNC_ID..."
                autoFocus
                className="w-full bg-black/60 border-2 border-amber-500/20 rounded-[2.5rem] py-8 px-10 text-3xl font-black text-amber-400 outline-none focus:border-amber-400 text-center italic shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={!newName.trim()}
              className="w-full py-8 rounded-3xl bg-amber-500 text-black font-black uppercase tracking-[0.4em] text-[11px] disabled:opacity-20 transition-all"
            >
              Begin_Biometric_Capture
            </button>
          </form>
        )}

        {step === 'ARCHITECT_SCAN' && (
          <NeuralScan 
            mode="VERIFY"
            knownHashes={knownHashes}
            onSuccess={handleArchitectSuccess}
            onCancel={() => setStep('IDLE')}
          />
        )}

        {step === 'NODE_SCAN' && (
          <NeuralScan 
            mode="ENROLL"
            targetName={newName}
            onSuccess={handleNodeScanSuccess}
            onCancel={() => setStep('INPUT_NAME')}
          />
        )}

        {step === 'SUCCESS' && (
          <div className="py-24 flex flex-col items-center gap-12 animate-in zoom-in text-center">
             <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center text-6xl shadow-[0_0_80px_rgba(16,185,129,0.4)]">✨</div>
             <div className="space-y-4">
               <h3 className="text-4xl font-black text-emerald-400 uppercase tracking-tighter italic">Node_Manifested</h3>
               <p className="text-[10px] uppercase tracking-[0.6em] text-gray-500">Lattice link for '{newName}' is now persistent.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatticeManagement;
