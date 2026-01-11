
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AppTheme } from '../types';

interface BoardType {
  id: string;
  name: string;
  color: number;
  size: [number, number, number];
  mcuSize: [number, number, number];
  arch: string;
}

const BOARDS: BoardType[] = [
  { id: 'uno', name: 'Arduino Uno R3', color: 0x1e88e5, size: [3.5, 0.15, 4.5], mcuSize: [1.5, 0.4, 3], arch: 'AVR 8-bit' },
  { id: 'mega', name: 'Arduino Mega 2560', color: 0x0d47a1, size: [3.5, 0.15, 6.5], mcuSize: [1.8, 0.4, 1.8], arch: 'AVR 8-bit' },
  { id: 'esp32', name: 'ESP32 WROOM', color: 0x1a1a1a, size: [1.8, 0.15, 2.5], mcuSize: [1.2, 0.3, 1.2], arch: 'Xtensa Dual-Core' },
  { id: 'pico', name: 'Raspberry Pi Pico', color: 0x2e7d32, size: [1.0, 0.15, 2.8], mcuSize: [0.6, 0.3, 0.6], arch: 'ARM Cortex-M0+' },
];

const COMPONENTS = [
  { id: 'led', name: 'RGB LED', icon: '🚨' },
  { id: 'lcd', name: 'LCD 16x2', icon: '📟' },
  { id: 'servo', name: 'High-Torque Servo', icon: '🦾' },
  { id: 'ir', name: 'IR Receiver', icon: '📡' },
  { id: 'sonar', name: 'Ultrasonic Sonar', icon: '🦇' },
  { id: 'motor', name: 'DC Motor Hub', icon: '⚙️' },
  { id: 'camera', name: 'Neural Camera', icon: '👁️' },
];

export const RoboStudio: React.FC<{ theme: AppTheme, onClose: () => void }> = ({ theme, onClose }) => {
  const [activeBoard, setActiveBoard] = useState(BOARDS[0]);
  const [activeTab, setActiveTab] = useState<'sketch.ino' | 'diagram.json' | 'libraries'>('sketch.ino');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(["> INITIALIZING HARDWARE_LINK v15.0", "> ARCHITECT: SUMUKHA S."]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boardRef = useRef<THREE.Group | null>(null);
  const isDark = theme === AppTheme.DARK;

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x050505 : 0xf8fafc);
    
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(6, 6, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    containerRef.current?.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(20, 20, isDark ? 0x111111 : 0xe2e8f0, isDark ? 0x0a0a0a : 0xf1f5f9);
    scene.add(grid);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const point = new THREE.PointLight(isDark ? 0xfbbf24 : 0x2563eb, 80);
    point.position.set(5, 10, 5);
    scene.add(point);

    const boardGroup = new THREE.Group();
    boardRef.current = boardGroup;
    scene.add(boardGroup);

    const updateBoard = () => {
      boardGroup.clear();
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(...activeBoard.size),
        new THREE.MeshPhysicalMaterial({ color: activeBoard.color, roughness: 0.1, metalness: 0.5, clearcoat: 1 })
      );
      boardGroup.add(board);
      const mcu = new THREE.Mesh(
        new THREE.BoxGeometry(...activeBoard.mcuSize),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 })
      );
      mcu.position.y = 0.25;
      boardGroup.add(mcu);
      
      const pinMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
      for(let i=0; i<12; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.15), pinMat);
        pin.position.set(-activeBoard.size[0]/2 + 0.2, 0.3, -activeBoard.size[2]/2 + 0.4 + (i * 0.35));
        boardGroup.add(pin);
      }
    };

    updateBoard();

    const animate = () => {
      requestAnimationFrame(animate);
      if (isRunning) boardGroup.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isDark, isRunning, activeBoard]);

  const toggleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setLogs(prev => [...prev, `> Compiling Shards...`, `> Target: ${activeBoard.name}`, `> Status: EXECUTING LATTICE CODE`]);
    } else {
      setLogs(prev => [...prev, `> Halted hardware manifestation.`]);
    }
  };

  return (
    <div className={`fixed inset-0 z-[1000] flex flex-col font-orbitron animate-in fade-in overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}>
      <header className={`h-14 flex items-center justify-between px-6 border-b transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 shadow-2xl' : 'bg-slate-100 border-slate-200'}`}>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
             <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg ${isDark ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'}`}>⚙️</span>
             <div>
                <h1 className={`text-sm font-black uppercase italic tracking-widest ${isDark ? 'text-amber-400' : 'text-blue-700'}`}>RoboArchitect_Zenith_Supreme</h1>
                <p className="text-[7px] uppercase tracking-[0.4em] opacity-30 font-bold">Sumukha S. // Hardware Shard</p>
             </div>
          </div>
          <div className="flex gap-1.5 p-1 rounded-xl bg-black/20">
             {BOARDS.map(b => (
               <button key={b.id} onClick={() => setActiveBoard(b)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeBoard.id === b.id ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-white'}`}>{b.id}</button>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleRun} className={`px-10 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 shadow-2xl ${isRunning ? 'bg-red-600 text-white animate-pulse shadow-red-500/20' : 'bg-green-500 text-black shadow-green-500/20'}`}>
            {isRunning ? '🛑 STOP' : '▶️ RUN'}
          </button>
          <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all hover:bg-red-600">✕</button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className={`w-64 border-r p-6 flex flex-col gap-8 transition-all ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
           <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/40 px-2">Components</h4>
           <div className="flex flex-col gap-3">
              {COMPONENTS.map(c => (
                <button key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left flex items-center gap-4 group hover:border-amber-500/40 transition-all">
                  <span className="text-xl group-hover:scale-110 transition-transform">{c.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{c.name}</span>
                </button>
              ))}
           </div>
           <div className="mt-auto p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-[8px] font-black uppercase text-amber-500/40 mb-2">Board Architecture</p>
              <p className="text-xs font-mono text-white/80">{activeBoard.arch}</p>
           </div>
        </aside>

        <div className={`w-1/2 flex flex-col border-r transition-all ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200'}`}>
          <div className="flex-1 flex overflow-hidden">
            <div className={`w-12 flex flex-col items-center py-8 gap-1 select-none font-mono text-[10px] ${isDark ? 'bg-black/40 border-r border-white/5 text-gray-700' : 'bg-slate-50 border-r border-slate-200 text-slate-400'}`}>
              {Array.from({ length: 45 }).map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <textarea 
              defaultValue={`// Logic Manifest: ${activeBoard.name}\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  // Hardware intent here\n}`}
              className={`flex-1 p-8 outline-none font-mono text-sm leading-relaxed resize-none bg-transparent ${isDark ? 'text-amber-50/80' : 'text-slate-800'}`}
              spellCheck={false}
            />
          </div>
          <footer className={`h-40 border-t p-8 font-mono text-[11px] overflow-y-auto custom-scrollbar ${isDark ? 'bg-black/60 border-white/5 text-amber-500/40' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
             {logs.map((log, i) => <p key={i} className="mb-1">{log}</p>)}
             {isRunning && <p className="text-green-500 animate-pulse">> Real-time Link: STABLE [Board: ${activeBoard.id.toUpperCase()}]</p>}
          </footer>
        </div>

        <div className={`flex-1 relative flex flex-col ${isDark ? 'bg-[#181818]' : 'bg-slate-200'}`}>
          <div ref={containerRef} className="flex-1 cursor-crosshair" />
          <div className="absolute bottom-10 left-10 flex gap-6 z-20 pointer-events-none">
             <div className={`p-6 rounded-[2.5rem] border backdrop-blur-2xl ${isDark ? 'bg-black/60 border-white/10 shadow-6xl' : 'bg-white/80 border-slate-200 shadow-2xl'}`}>
                <p className="text-[8px] font-black uppercase text-amber-500/40 mb-2">Sync_Status</p>
                <p className={`text-xl font-mono tracking-tighter ${isRunning ? 'text-green-500' : 'text-gray-500'}`}>{isRunning ? 'ONLINE' : 'HALTED'}</p>
             </div>
          </div>
          <button className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-amber-500 text-black flex items-center justify-center text-3xl shadow-4xl hover:scale-110 active:scale-95 transition-all z-20 shadow-amber-500/20">➕</button>
        </div>
      </main>

      <footer className="h-8 px-8 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.8em] opacity-30 border-t border-white/5 bg-black">
         <span>PROTOCOL: SILICON_ZENITH_SUPREME</span>
         <span>INTEGRITY: SYNCHRONIZED</span>
         <span>CREATOR: SUMUKHA S.</span>
      </footer>
    </div>
  );
};
