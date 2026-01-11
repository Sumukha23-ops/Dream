
import React from 'react';
import { EngineMode, AppTheme } from '../types';
import { ENGINE_CONFIGS } from '../constants';

interface EngineSelectorProps {
  currentMode: EngineMode;
  onModeChange: (mode: EngineMode) => void;
  theme: AppTheme;
}

const EngineSelector: React.FC<EngineSelectorProps> = ({ currentMode, onModeChange, theme }) => {
  const isDark = theme === AppTheme.DARK;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1">
      {Object.entries(ENGINE_CONFIGS).map(([key, config]) => {
        const mode = key as EngineMode;
        const isActive = currentMode === mode;
        const icon = config.name.split(' ')[0];
        const label = config.name.split(' ')[1];
        
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`
              flex-shrink-0 px-6 py-4 rounded-[1.8rem] border-2 transition-all duration-300 flex items-center gap-4 group
              ${isActive 
                ? (isDark ? 'border-cyan-500 bg-cyan-500/10 shadow-lg' : 'border-blue-600 bg-blue-600/5 shadow-md') 
                : (isDark ? 'border-transparent bg-white/5 hover:bg-white/10' : 'border-transparent bg-white shadow-sm hover:bg-slate-50')}
            `}
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {icon}
            </span>
            
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-orbitron font-black tracking-widest ${isActive ? (isDark ? 'text-cyan-400' : 'text-blue-700') : (isDark ? 'text-gray-500' : 'text-slate-400')}`}>
                {label}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest opacity-30 whitespace-nowrap">
                {config.description.split(' ')[0]} Mode
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default EngineSelector;
