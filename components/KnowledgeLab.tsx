
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const GRADES = [
  { id: 'elementary', label: '🌱 Elementary', icon: '🌱' },
  { id: 'middle', label: '🌿 Middle School', icon: '🌿' },
  { id: 'class10', label: '⚔️ Class 10 (Boards)', icon: '⚔️' },
  { id: 'class12', label: '🎓 Class 12 (Boards)', icon: '🎓' },
  { id: 'pro', label: '💎 Professional', icon: '💎' }
];

export const KnowledgeLab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gradeLevel, setGradeLevel] = useState(GRADES[2]);

  const startQuiz = async () => {
    if (!topic || loading) return;
    setLoading(true); setQuizData([]); setScore(0); setCurrentQuestion(0); setShowResult(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: `Generate exactly 5 highly analytical multiple choice questions about "${topic}" for a ${gradeLevel.label} level. Architect: Sumukha S.`, 
        config: { 
          responseMimeType: 'application/json', 
          responseSchema: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                question: { type: Type.STRING }, 
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswerIndex: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              },
              required: ['question', 'options', 'correctAnswerIndex', 'explanation']
            } 
          } 
        } 
      });
      const parsed = JSON.parse(response.text || '[]');
      if (parsed.length > 0) {
        setQuizData(parsed);
      } else {
        throw new Error("Empty quiz lattice.");
      }
    } catch (e) { 
      console.error(e);
      alert("Intelligence Synthesis Fault. Please re-input parameters."); 
    } finally { setLoading(false); }
  };

  const handleNext = () => {
    if (selectedOption === quizData[currentQuestion].correctAnswerIndex) setScore(s => s + 1);
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/95 flex flex-col font-orbitron overflow-hidden animate-in fade-in">
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all text-xs font-black uppercase">← Back</button>
          <div className="h-6 w-px bg-white/10"></div>
          <h2 className="text-xl font-black text-cyan-400 uppercase italic tracking-tighter">Scholar_Hub</h2>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-600 transition-all border border-white/10 text-white">✕</button>
      </header>

      <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-12">
          {!quizData.length && !loading ? (
            <div className="bg-white/[0.02] border border-white/5 p-16 rounded-[4rem] space-y-12 shadow-2xl text-center">
              <div className="text-9xl animate-float">🧠</div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Initialize Knowledge Node</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em]">Intellectual Forge by Sumukha S.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {GRADES.map(g => (
                  <button key={g.id} onClick={() => setGradeLevel(g)} className={`p-5 rounded-3xl border-2 transition-all text-[11px] font-black uppercase tracking-tight ${gradeLevel.id === g.id ? 'bg-cyan-500 text-black border-cyan-400 shadow-xl' : 'bg-white/5 border-white/5 text-gray-600 hover:bg-white/10'}`}>
                    {g.icon} {g.label.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                <input 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  className="w-full bg-black/60 border-2 border-white/10 rounded-[3rem] px-12 py-8 text-2xl font-bold text-white outline-none focus:border-cyan-500 text-center italic shadow-inner" 
                  placeholder="Target logic sector (e.g. Quantum Mechanics)..." 
                />
                <button onClick={startQuiz} className="w-full py-8 rounded-[3rem] bg-cyan-500 text-black font-black uppercase text-[12px] tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-cyan-500/20">Manifest Module</button>
              </div>
            </div>
          ) : loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-10 text-center animate-pulse">
              <div className="relative">
                 <div className="w-32 h-32 border-4 border-cyan-500/10 rounded-full"></div>
                 <div className="w-32 h-32 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_50px_rgba(6,182,212,0.2)]"></div>
              </div>
              <p className="text-cyan-400 uppercase tracking-[1em] text-xs font-black">Architecting Logic nodes...</p>
            </div>
          ) : showResult ? (
            <div className="bg-white/[0.02] border border-white/5 p-20 rounded-[5rem] text-center space-y-12 animate-in zoom-in duration-700 shadow-6xl">
              <div className="text-[120px] drop-shadow-[0_0_100px_rgba(6,182,212,0.3)]">🏆</div>
              <div>
                <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter">Sync_Rating: {Math.round((score/quizData.length)*100)}%</h3>
                <p className="text-cyan-500/40 text-xl font-medium mt-4 uppercase tracking-[0.2em]">Synchronized {score} of {quizData.length} neural nodes.</p>
              </div>
              <button onClick={() => setQuizData([])} className="px-20 py-8 bg-white text-black rounded-[3rem] font-black uppercase text-[12px] tracking-[0.5em] hover:bg-cyan-500 transition-all shadow-2xl">Restart_System</button>
            </div>
          ) : (
            <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="flex justify-between items-end px-8">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.6em]">Neural_Lattice_Scan</p>
                   <span className="text-2xl font-black text-white uppercase italic">Node {currentQuestion + 1} / {quizData.length}</span>
                </div>
                <div className="w-80 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-1000" style={{ width: `${((currentQuestion + 1)/quizData.length)*100}%` }}></div>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-3xl border-2 border-white/5 p-16 rounded-[5rem] space-y-12 shadow-6xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                <h3 className="text-4xl font-bold text-white leading-[1.3] tracking-tight italic">"{quizData[currentQuestion].question}"</h3>
                <div className="grid gap-5">
                  {quizData[currentQuestion].options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedOption(i)} 
                      className={`p-10 rounded-[3rem] border-2 text-left transition-all text-2xl font-bold italic relative group ${selectedOption === i ? 'bg-cyan-500 text-black border-cyan-400 shadow-4xl scale-[1.02] z-10' : 'bg-white/5 border-white/5 hover:bg-white/[0.07] text-white/60'}`}
                    >
                      <span className={`mr-8 font-mono opacity-30 ${selectedOption === i ? 'text-black' : ''}`}>{String.fromCharCode(65 + i)}//</span>
                      {opt}
                      {selectedOption === i && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-2xl">✓</span>}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleNext} 
                  disabled={selectedOption === null} 
                  className="w-full py-10 rounded-[3rem] bg-white text-black font-black uppercase text-[14px] tracking-[0.6em] hover:bg-cyan-500 transition-all disabled:opacity-10 shadow-6xl mt-6 active:scale-95"
                >
                  Confirm_Transmission ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
