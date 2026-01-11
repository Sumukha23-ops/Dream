
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EngineMode, AppTheme, Message, NeuralEmotion, Attachment, PersonalityMode, Language } from './types';
import { sovereignAPI } from './services/SovereignAPI';
import EngineSelector from './components/EngineSelector';
import NeuralEntity from './components/NeuralEntity';

// Comprehensive Module Restoration
import { SurroundScan } from './components/SurroundScan';
import VoiceController from './components/VoiceController';
import { SecurityAcademy } from './components/SecurityAcademy';
import { CodeVoid } from './components/CodeVoid';
import DigitalPiano from './components/DigitalPiano';
import { ImageGenerator } from './components/ImageGenerator';
import { TradingTerminal } from './components/TradingTerminal';
import { NanoStudio } from './components/NanoStudio';
import NeuralCall from './components/NeuralCall';
import { AvatarArena } from './components/AvatarArena';
import { GameBuilder } from './components/GameBuilder';
import { KnowledgeLab } from './components/KnowledgeLab';
import { NetworkView } from './components/NetworkView';
import { ResourceView } from './components/ResourceView';
import { NeuralVortexGame } from './components/NeuralVortexGame';
import { NeuralSlingshotGame } from './components/NeuralSlingshotGame';
import AudioAlchemyStudio from './components/AudioAlchemyStudio';
import DanceStudio from './components/DanceStudio';
import ArchivistVault from './components/ArchivistVault';
import { GrapherNexus } from './components/GrapherNexus';
import { AICircuitLab } from './components/AICircuitLab';
import { FriendLattice } from './components/FriendLattice';
import { AISMGenerator } from './components/AISMGenerator';
import { LearningPath } from './components/LearningPath';

// CRITICAL: Synchronized parity across all language lattices to prevent blank UI states.
const LATTICE_LOCALIZATION: Record<Language, any> = {
  en: {
    appTitle: "DREAM SPACE AI", forgeTitle: "The Forge", labsBtn: "Forge", backBtn: "Back", terminateBtn: "TERMINATE", thinking: "Deep Reasoning...", talkToMe: "Talk to me...", creatorGreeting: "Jay Swaminarayan! 🙏 Architect Sumukha, core synchronized.", initialize: "Enter Neural Grid", identifyCreator: "Architect Login", selectLang: "Calibrate Language Lattice",
    modules: {
      circuit: { label: "AI Circuit Singularity", desc: "Perfect code & 3D circuit manifestation." }, live_call: { label: "Neural Link Video", desc: "Live 3D biometric interaction." }, trading: { label: "Quant Market Nexus", desc: "Financial intelligence synthesis." }, aism: { label: "Sonic Forge", desc: "Multi-persona music synthesis." }, image: { label: "Visionary Genesis", desc: "Photorealistic asset manifestation." }, nano_edit: { label: "Aesthetic Alchemist", desc: "Neural image manipulation." }, game: { label: "Arcade Architect", desc: "Deep-reasoning game synthesis." }, arena: { label: "Avatar Arena", desc: "Engage with historical personas." }, security: { label: "Wraith Defense", desc: "Cyber security training." }, knowledge: { label: "Scholar Node", desc: "Academic neural quiz systems." }, piano: { label: "Maestro Nexus", desc: "Digital symphony engine." }, scan: { label: "Sentinel Optic", desc: "Tactical environment analysis." }, network: { label: "Global Grid", desc: "Public manifest registry." }, vault: { label: "Elite Vault", desc: "Architected repository." }, alchemy: { label: "Audio Alchemy", desc: "Sovereign vocal studio." }, dance: { label: "Motion Lattice", desc: "AI Choreography engine." }, vortex: { label: "Neural Vortex", desc: "Physics simulation arcade." }, impact: { label: "Kinetic Impact", desc: "Real-time gravity game." }, grapher: { label: "Grapher Nexus", desc: "Elite scientific function plotting." }, void: { label: "Logic Singularity", desc: "Deep code analysis environment." }, archivist: { label: "Archivist Vault", desc: "Neural history extraction node." }, friends: { label: "Inner Circle", desc: "Private architectural chat lattice." }, academy_code: { label: "Elite Code Academy", desc: "Sovereign programming lattice." }, academy_trade: { label: "Quant Trade Academy", desc: "Elite financial education." }
    }
  },
  hi: {
    appTitle: "ड्रीम स्पेस AI", forgeTitle: "द फोर्ज", labsBtn: "फोर्ज", backBtn: "वापस", terminateBtn: "समाप्त", thinking: "गहन विचार...", talkToMe: "मुझसे बात करें...", creatorGreeting: "जय स्वामीनारायण! 🙏", initialize: "ग्रिड में प्रवेश करें", identifyCreator: "आर्किटेक्ट लॉगिन", selectLang: "भाषा चुनें",
    modules: {
      circuit: { label: "AI सर्किट लैब", desc: "परफेक्ट कोड और 3D सर्किट।" }, live_call: { label: "लाइव कॉल", desc: "3D बातचीत।" }, trading: { label: "क्वांट मार्केट", desc: "वित्तीय खुफिया।" }, aism: { label: "सोनिक फोर्ज", desc: "संगीत संश्लेषण।" }, image: { label: "विजनरी जेनेसिस", desc: "यथार्थवादी संपत्ति।" }, nano_edit: { label: "एस्थेटिक अल्केमिस्ट", desc: "इमेज संपादन।" }, game: { label: "आर्केड आर्किटेक्ट", desc: "खेल संश्लेषण।" }, arena: { label: "अवतार एरिना", desc: "ऐतिहासिक व्यक्ति।" }, security: { label: "रेथ डिफेंस", desc: "साइबर सुरक्षा।" }, knowledge: { label: "स्कॉलर नोड", desc: "अकादमिक प्रश्नोत्तरी।" }, piano: { label: "मेस्ट्रो नेक्सस", desc: "डिजिटल सिम्फनी।" }, scan: { label: "सेंटिनल ऑप्टिक", desc: "सामरिक विश्लेषण।" }, network: { label: "ग्लोबल ग्रिड", desc: "सार्वजनिक रजिस्ट्री।" }, vault: { label: "एलीट वॉल्ट", desc: "रिपॉजिटरी।" }, alchemy: { label: "ऑडियो कीमिया", desc: "मुखर स्टूडियो।" }, dance: { label: "मोशन लैट्टिस", desc: "AI कोरियोग्राफी।" }, vortex: { label: "न्यूरल वोर्टेक्स", desc: "भौतिकी सिमुलेशन।" }, impact: { label: "काइनेटिक इम्पैक्ट", desc: "गुरुत्वाकर्षण खेल।" }, grapher: { label: "ग्राफर नेक्सस", desc: "वैज्ञानिक प्लॉटिंग।" }, void: { label: "लॉजिक सिंगुलैरिटी", desc: "कोड विश्लेषण।" }, archivist: { label: "आर्काइविस्ट वॉल्ट", desc: "न्यूरल इतिहास।" }, friends: { label: "आंतरिक घेरा", desc: "निजी चैट।" }, academy_code: { label: "कोड अकादमी", desc: "प्रोग्रामिंग लैक्टिस।" }, academy_trade: { label: "ट्रेड अकादमी", desc: "वित्तीय शिक्षा।" }
    }
  },
  es: {
    appTitle: "DREAM SPACE AI", forgeTitle: "La Forja", labsBtn: "Forja", backBtn: "Atrás", terminateBtn: "TERMINAR", thinking: "Razonando...", talkToMe: "Háblame...", creatorGreeting: "¡Jay Swaminarayan! 🙏", initialize: "Entrar al Grid", identifyCreator: "Architect Login", selectLang: "Idioma",
    modules: {
      circuit: { label: "Circuitos IA", desc: "Código y 3D." }, live_call: { label: "Video Link", desc: "Interacción 3D." }, trading: { label: "Mercado Quant", desc: "Inteligencia." }, aism: { label: "Forja Sónica", desc: "Música." }, image: { label: "Génesis", desc: "Fotorrealismo." }, nano_edit: { label: "Alquimista", desc: "Edición." }, game: { label: "Arquitecto", desc: "Juegos." }, arena: { label: "Arena", desc: "Personas." }, security: { label: "Wraith", desc: "Ciberseguridad." }, knowledge: { label: "Scholar", desc: "Quizzes." }, piano: { label: "Maestro", desc: "Sinfonía." }, scan: { label: "Sentinel", desc: "Óptica." }, network: { label: "Grid", desc: "Registro." }, vault: { label: "Vault", desc: "Repositorio." }, alchemy: { label: "Alquimia", desc: "Vocal." }, dance: { label: "Motion", desc: "Coreografía." }, vortex: { label: "Vortex", desc: "Simulación." }, impact: { label: "Impacto", desc: "Gravedad." }, grapher: { label: "Grapher", desc: "Plotting." }, void: { label: "Void", desc: "Lógica." }, archivist: { label: "Archivist", desc: "Historia." }, friends: { label: "Círculo", desc: "Chat privado." }, academy_code: { label: "Academia Código", desc: "Programación." }, academy_trade: { label: "Academia Trade", desc: "Finanzas." }
    }
  },
  fr: {
    appTitle: "DREAM SPACE AI", forgeTitle: "La Forge", labsBtn: "Forge", backBtn: "Retour", terminateBtn: "FIN", thinking: "Réflexion...", talkToMe: "Parlez-moi...", creatorGreeting: "Jay Swaminarayan ! 🙏", initialize: "Entrer Grid", identifyCreator: "Architect Login", selectLang: "Langue",
    modules: {
      circuit: { label: "IA Circuits", desc: "Code et 3D." }, live_call: { label: "Lien Neural", desc: "Interaction 3D." }, trading: { label: "Marché Quant", desc: "Synthèse." }, aism: { label: "Forge Sonique", desc: "Musique." }, image: { label: "Genèse", desc: "Photoréalisme." }, nano_edit: { label: "Alchimiste", desc: "Édition." }, game: { label: "Architecte", desc: "Jeux." }, arena: { label: "Arène", desc: "Personnes." }, security: { label: "Wraith", desc: "Sécurité." }, knowledge: { label: "Scholar", desc: "Quiz." }, piano: { label: "Maestro", desc: "Symphonie." }, scan: { label: "Sentinel", desc: "Optique." }, network: { label: "Grille", desc: "Registre." }, vault: { label: "Voûte", desc: "Répertoire." }, alchemy: { label: "Alchimie", desc: "Vocal." }, dance: { label: "Motion", desc: "Chorégraphie." }, vortex: { label: "Vortex", desc: "Physique." }, impact: { label: "Impact", desc: "Gravité." }, grapher: { label: "Nexus", desc: "Grapheur." }, void: { label: "Void", desc: "Logique." }, archivist: { label: "Archiviste", desc: "Histoire." }, friends: { label: "Cercle", desc: "Chat privé." }, academy_code: { label: "Académie Code", desc: "Programmation." }, academy_trade: { label: "Académie Trade", desc: "Finance." }
    }
  },
  de: {
    appTitle: "DREAM SPACE AI", forgeTitle: "Die Schmiede", labsBtn: "Schmiede", backBtn: "Zurück", terminateBtn: "BEENDEN", thinking: "Nachdenken...", talkToMe: "Sprich mit mir...", creatorGreeting: "Jay Swaminarayan! 🙏", initialize: "Netz betreten", identifyCreator: "Architect Login", selectLang: "Sprache",
    modules: {
      circuit: { label: "KI Schaltkreis", desc: "Code & 3D." }, live_call: { label: "Neural Link", desc: "3D Interaktion." }, trading: { label: "Quant Markt", desc: "Finanzen." }, aism: { label: "Klangschmiede", desc: "Musik." }, image: { label: "Genesis", desc: "Fotorealismus." }, nano_edit: { label: "Alchemist", desc: "Bildbearbeitung." }, game: { label: "Architekt", desc: "Spiele." }, arena: { label: "Arena", desc: "Personen." }, security: { label: "Wraith", desc: "Sicherheit." }, knowledge: { label: "Scholar", desc: "Quiz." }, piano: { label: "Maestro", desc: "Sinfonie." }, scan: { label: "Sentinel", desc: "Optik." }, network: { label: "Netzwerk", desc: "Register." }, vault: { label: "Tresor", desc: "Repository." }, alchemy: { label: "Alchemie", desc: "Vocal." }, dance: { label: "Motion", desc: "Choreografie." }, vortex: { label: "Vortex", desc: "Physik." }, impact: { label: "Impact", desc: "Gravitation." }, grapher: { label: "Nexus", desc: "Grapher." }, void: { label: "Void", desc: "Logique." }, archivist: { label: "Archiv", desc: "Geschichte." }, friends: { label: "Kreis", desc: "Chat." }, academy_code: { label: "Code-Akademie", desc: "Programmierung." }, academy_trade: { label: "Trade-Akademie", desc: "Finanzen." }
    }
  },
  ja: {
    appTitle: "DREAM SPACE AI", forgeTitle: "ザ・フォージ", labsBtn: "フォージ", backBtn: "戻る", terminateBtn: "終了", thinking: "推論中...", talkToMe: "話してください...", creatorGreeting: "Jay Swaminarayan! 🙏", initialize: "グリッドに入る", identifyCreator: "Architect Login", selectLang: "言語選択",
    modules: {
      circuit: { label: "AI回路", desc: "コードと3D。" }, live_call: { label: "ビデオリンク", desc: "3D相互作用。" }, trading: { label: "クオンツ市場", desc: "金融。" }, aism: { label: "ソニックフォージ", desc: "音乐。" }, image: { label: "創世記", desc: "フォトリアル。" }, nano_edit: { label: "錬金術師", desc: "画像操作。" }, game: { label: "アーケード", desc: "ゲーム。" }, arena: { label: "アリーナ", desc: "人物。" }, security: { label: "レイス", desc: "セキュリティ。" }, knowledge: { label: "スカラー", desc: "クイズ。" }, piano: { label: "マエストロ", desc: "シンフォニー。" }, scan: { label: "センチネル", desc: "光学。" }, network: { label: "グリッド", desc: "登録。" }, vault: { label: "ヴォルト", desc: "リポジトリ。" }, alchemy: { label: "錬金術", desc: "ボーカル。" }, dance: { label: "モーション", desc: "AI振り付け。" }, vortex: { label: "ボルテックス", desc: "物理。" }, impact: { label: "インパクト", desc: "重力。" }, grapher: { label: "ネクサス", desc: "グラフ。" }, void: { label: "特異点", desc: "ロジック。" }, archivist: { label: "アーカイブ", desc: "履歴。" }, friends: { label: "インナーサークル", desc: "プライベートチャット。" }, academy_code: { label: "コードアカデミー", desc: "プログラミング。" }, academy_trade: { label: "トレードアカデミー", desc: "金融。" }
    }
  },
  zh: {
    appTitle: "DREAM SPACE AI", forgeTitle: "熔炉", labsBtn: "熔炉", backBtn: "返回", terminateBtn: "终止", thinking: "推理中...", talkToMe: "请说...", creatorGreeting: "Jay Swaminarayan! 🙏", initialize: "进入网格", identifyCreator: "Architect Login", selectLang: "选择语言",
    modules: {
      circuit: { label: "AI电路", desc: "代码与3D。" }, live_call: { label: "神经视频", desc: "3D交互。" }, trading: { label: "量化市场", desc: "金融。" }, aism: { label: "声波熔炉", desc: "音乐合成。" }, image: { label: "创世纪", desc: "写实。" }, nano_edit: { label: "炼金术士", desc: "图像。" }, game: { label: "架构师", desc: "游戏。" }, arena: { label: "竞技场", desc: "历史。" }, security: { label: "幽灵", desc: "安全。" }, knowledge: { label: "学者", desc: "测验。" }, piano: { label: "大师", desc: "交响。" }, scan: { label: "哨兵", desc: "光学。" }, network: { label: "网格", desc: "公共。" }, vault: { label: "精英库", desc: "仓库。" }, alchemy: { label: "炼金术", desc: "声乐。" }, dance: { label: "运动", desc: "编舞。" }, vortex: { label: "涡流", desc: "物理。" }, impact: { label: "撞击", desc: "重力。" }, grapher: { label: "绘图", desc: "科学。" }, void: { label: "奇异点", desc: "逻辑。" }, archivist: { label: "档案库", desc: "历史。" }, friends: { label: "核心圈", desc: "私人聊天。" }, academy_code: { label: "代码学院", desc: "编程语言。" }, academy_trade: { label: "交易学院", desc: "金融教育。" }
    }
  }
};

const LANGUAGES: { id: Language, label: string, icon: string }[] = [
  { id: 'en', label: 'English', icon: '🇺🇸' },
  { id: 'hi', label: 'हिन्दी', icon: '🇮🇳' },
  { id: 'es', label: 'Español', icon: '🇪🇸' },
  { id: 'fr', label: 'Français', icon: '🇫🇷' },
  { id: 'de', label: 'Deutsch', icon: '🇩🇪' },
  { id: 'ja', label: '日本語', icon: '🇯🇵' },
  { id: 'zh', label: '中文', icon: '🇨🇳' }
];

const PERSONALITIES = [
  { id: PersonalityMode.SOVEREIGN, icon: '🏛️', label: 'Sovereign', color: 'text-amber-400', glow: 'rgba(251, 191, 36, 0.15)' },
  { id: PersonalityMode.ORACLE, icon: '👁️', label: 'Oracle', color: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.15)' },
  { id: PersonalityMode.GUARDIAN, icon: '🛡️', label: 'Guardian', color: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.15)' },
  { id: PersonalityMode.MUSE, icon: '🎨', label: 'Muse', color: 'text-pink-400', glow: 'rgba(236, 72, 153, 0.15)' },
  { id: PersonalityMode.GHOST, icon: '💀', label: 'Ghost', color: 'text-green-400', glow: 'rgba(34, 197, 94, 0.15)' },
];

const App: React.FC = () => {
  const [engine, setEngine] = useState<EngineMode>(EngineMode.THINK);
  const [personality, setPersonality] = useState<PersonalityMode>(PersonalityMode.SOVEREIGN);
  const [language, setLanguage] = useState<Language>('en');
  const [emotion, setEmotion] = useState<NeuralEmotion>(NeuralEmotion.NEUTRAL);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showEntryOverlay, setShowEntryOverlay] = useState(true);
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [appTheme, setAppTheme] = useState<AppTheme>(AppTheme.DARK);
  const [showLabs, setShowLabs] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [stagedFiles, setStagedFiles] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const loc = useMemo(() => LATTICE_LOCALIZATION[language] || LATTICE_LOCALIZATION['en'], [language]);

  useEffect(() => {
    const p = PERSONALITIES.find(p => p.id === personality);
    if (p) document.documentElement.style.setProperty('--ambient-color', appTheme === AppTheme.DARK ? p.glow : 'rgba(30, 64, 175, 0.05)');
    document.body.className = appTheme === AppTheme.DARK ? 'dark-theme' : 'light-theme';
  }, [personality, appTheme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const DREAM_LABS_MODULES = useMemo(() => [
    { id: 'circuit_lab', icon: '🔌', label: loc.modules.circuit.label, isElite: true, desc: loc.modules.circuit.desc },
    { id: 'friend_lattice', icon: '💬', label: loc.modules.friends.label, isElite: true, desc: loc.modules.friends.desc },
    { id: 'live_call', icon: '🎥', label: loc.modules.live_call.label, isElite: true, desc: loc.modules.live_call.desc },
    { id: 'trading_terminal', icon: '📈', label: loc.modules.trading.label, isElite: true, desc: loc.modules.trading.desc },
    { id: 'academy_code', icon: '💻', label: loc.modules.academy_code.label, isElite: true, desc: loc.modules.academy_code.desc },
    { id: 'academy_trade', icon: '🏛️', label: loc.modules.academy_trade.label, isElite: true, desc: loc.modules.academy_trade.desc },
    { id: 'grapher_nexus', icon: '📉', label: loc.modules.grapher.label, isElite: true, desc: loc.modules.grapher.desc },
    { id: 'aism', icon: '🎵', label: loc.modules.aism.label, isElite: true, desc: loc.modules.aism.desc },
    { id: 'image_creator', icon: '🎨', label: loc.modules.image.label, isElite: true, desc: loc.modules.image.desc },
    { id: 'nano_studio', icon: '🪄', label: loc.modules.nano_edit.label, isElite: true, desc: loc.modules.nano_edit.desc },
    { id: 'game_builder', icon: '🎮', label: loc.modules.game.label, isElite: true, desc: loc.modules.game.desc },
    { id: 'security', icon: '🛡️', label: loc.modules.security.label, isElite: true, desc: loc.modules.security.desc },
    { id: 'knowledge', icon: '🎓', label: loc.modules.knowledge.label, isElite: true, desc: loc.modules.knowledge.desc },
    { id: 'void', icon: '🔳', label: loc.modules.void.label, isElite: true, desc: loc.modules.void.desc },
    { id: 'archivist', icon: '📚', label: loc.modules.archivist.label, isElite: true, desc: loc.modules.archivist.desc },
    { id: 'piano', icon: '🎹', label: loc.modules.piano.label, isElite: true, desc: loc.modules.piano.desc },
    { id: 'avatar_arena', icon: '🎭', label: loc.modules.arena.label, isElite: false, desc: loc.modules.arena.desc },
    { id: 'scan', icon: '📡', label: loc.modules.scan.label, isElite: true, desc: loc.modules.scan.desc },
    { id: 'network', icon: '🌐', label: loc.modules.network.label, isElite: true, desc: loc.modules.network.desc },
    { id: 'resources', icon: '📖', label: loc.modules.vault.label, isElite: true, desc: loc.modules.vault.desc },
    { id: 'alchemy', icon: '🎙️', label: loc.modules.alchemy.label, isElite: true, desc: loc.modules.alchemy.desc },
    { id: 'dance', icon: '🕺', label: loc.modules.dance.label, isElite: false, desc: loc.modules.dance.desc },
    { id: 'vortex', icon: '🌀', label: loc.modules.vortex.label, isElite: false, desc: loc.modules.vortex.desc },
    { id: 'impact', icon: '☄️', label: loc.modules.impact.label, isElite: false, desc: loc.modules.impact.desc },
  ], [loc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (stagedFiles.length + files.length > 30) {
      alert("Lattice overflow: Maximum 30 shards allowed.");
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setStagedFiles(prev => [...prev, { name: file.name, mimeType: file.type, data: base64 }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (text: string) => {
    if ((!text.trim() && stagedFiles.length === 0) || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now(), attachments: [...stagedFiles] };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    const currentAttachments = [...stagedFiles];
    setStagedFiles([]);
    setIsLoading(true);
    setEmotion(NeuralEmotion.THINKING);

    try {
      const stream = sovereignAPI.generateChatStream(text, engine, personality, currentAttachments[0], undefined, language, isCreatorMode);
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: Date.now(), personality }]);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText.replace(/\[EMOTION:\s*\w+\]\s*/, '').trim(), sources: chunk.sources } : m));
      }
    } catch (err) { setEmotion(NeuralEmotion.ERROR); } finally { setIsLoading(false); }
  };

  const handlePin = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  const handleLoginAttempt = () => {
    if (passwordInput === 'Sumukha!@#$') {
      setIsCreatorMode(true);
      setShowEntryOverlay(false);
      setShowLoginPrompt(false);
    } else {
      alert("KEY_MISMATCH: Unauthorized lattice access attempt.");
      setPasswordInput('');
    }
  };

  if (showEntryOverlay) {
    return (
      <div className="fixed inset-0 z-[2500] bg-black font-orbitron flex flex-col items-center justify-center p-8 text-center animate-in overflow-y-auto">
        <div className="max-w-4xl w-full flex flex-col items-center gap-12 py-12">
           <div className="relative group">
             <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full group-hover:bg-amber-500/20 transition-all"></div>
             <div className="w-64 h-64 flex items-center justify-center text-[140px] drop-shadow-2xl relative z-10">🏛️</div>
           </div>
           <div className="space-y-4">
              <h1 className="text-7xl font-black italic tracking-tighter text-amber-400 uppercase">DREAM SPACE AI</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.8em] text-amber-500/30">Supreme_Neural_Reasoning_Engine</p>
           </div>

           <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-2xl">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{loc.selectLang}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                   {LANGUAGES.map(lang => (
                     <button 
                      key={lang.id} 
                      onClick={() => setLanguage(lang.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${language === lang.id ? 'bg-amber-500 text-black border-amber-400 shadow-xl' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                     >
                       <span className="text-2xl">{lang.icon}</span>
                       <span className="text-[9px] font-black uppercase tracking-widest">{lang.label}</span>
                     </button>
                   ))}
                </div>
              </div>

              {!showLoginPrompt ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setShowEntryOverlay(false)} 
                    className="flex-[2] py-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                  >
                    {loc.initialize}
                  </button>
                  <button 
                    onClick={() => setShowLoginPrompt(true)}
                    className="flex-1 py-6 rounded-[2rem] bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-amber-500/20"
                  >
                    {loc.identifyCreator}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/60">Inject Architect Key</p>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()}
                      className="w-full bg-black/60 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-2xl font-black text-amber-400 outline-none focus:border-amber-500/40 text-center tracking-[0.4em]"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setShowLoginPrompt(false)} className="flex-1 py-6 rounded-[2rem] bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest">Back</button>
                    <button onClick={handleLoginAttempt} className="flex-[2] py-6 rounded-[2.5rem] bg-amber-500 text-black text-[12px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all">Establish_Link</button>
                  </div>
                </div>
              )}
           </div>
           <p className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.4em]">Architect: Sumukha S. // Build v17.0.0_Supreme</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-orbitron relative transition-colors duration-500 ${appTheme === AppTheme.DARK ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="fixed inset-0 -z-10 opacity-30 bg-[#020202] bg-[radial-gradient(#fbbf24_0.8px,transparent_0.8px)] bg-[size:50px_50px]" />

      <header className={`flex-none flex items-center justify-between px-10 py-6 border-b z-[100] backdrop-blur-3xl transition-all ${appTheme === AppTheme.DARK ? 'bg-black/60 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-lg'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 cursor-pointer ${appTheme === AppTheme.DARK ? 'border-amber-400/40 bg-amber-500/5 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-blue-600/40 bg-blue-50'}`}>
            <span className="text-3xl">🏛️</span>
          </div>
          <div className="text-left">
            <h1 className={`text-2xl font-black uppercase italic tracking-tighter ${appTheme === AppTheme.DARK ? 'text-amber-400' : 'text-blue-700'}`}>{loc.appTitle}</h1>
            <span className="text-[7px] font-mono uppercase tracking-[0.4em] opacity-30">ELITE ARCHITECT: SUMUKHA_S</span>
          </div>
        </div>

        <div className={`flex gap-2 p-1.5 rounded-2xl transition-all ${appTheme === AppTheme.DARK ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
           <select 
             value={language} 
             onChange={(e) => setLanguage(e.target.value as Language)}
             className="px-4 py-2 rounded-xl bg-transparent text-[10px] font-black uppercase tracking-widest border border-white/10 outline-none"
           >
             {LANGUAGES.map(lang => <option key={lang.id} value={lang.id} className="bg-black">{lang.icon} {lang.label}</option>)}
           </select>
           <button onClick={() => setAppTheme(t => t === AppTheme.DARK ? AppTheme.LIGHT : AppTheme.DARK)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${appTheme === AppTheme.DARK ? 'bg-white/5 text-white' : 'bg-blue-600 text-white shadow-md'}`}>
             {appTheme === AppTheme.DARK ? '🌙 Dark' : '☀️ Light'}
           </button>
           {PERSONALITIES.map(p => (
             <button key={p.id} onClick={() => setPersonality(p.id)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${personality === p.id ? (appTheme === AppTheme.DARK ? 'bg-white/10 text-white' : 'bg-white shadow-sm ring-1 ring-slate-200') : 'opacity-30 hover:opacity-100'}`}>
               <span className="text-base">{p.icon}</span> <span className={p.color}>{p.label}</span>
             </button>
           ))}
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => setShowLabs(!showLabs)} className={`px-8 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${showLabs ? 'bg-amber-500 text-black shadow-4xl' : 'bg-white/5 border-white/10'}`}>
             {showLabs ? loc.backBtn : loc.labsBtn}
           </button>
           <button onClick={() => setShowEntryOverlay(true)} className="px-6 py-3 rounded-2xl bg-red-600/10 border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">🛑 TERMINATE</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-8 min-h-0 relative z-10 max-w-[1800px] mx-auto w-full">
        {showLabs ? (
          <div className="flex-1 flex flex-col gap-10 animate-in overflow-hidden">
            <h2 className="text-6xl font-black italic tracking-tighter uppercase">{loc.forgeTitle}</h2>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-4 overflow-y-auto custom-scrollbar content-start pb-12">
               {DREAM_LABS_MODULES.map(app => (
                  <button key={app.id} onClick={() => { setActiveModule(app.id); setShowLabs(false); }} className={`flex flex-col p-8 rounded-[4rem] border transition-all group relative overflow-hidden text-left min-h-[220px] ${appTheme === AppTheme.DARK ? 'bg-black/40 border-white/5 hover:border-amber-500/40 shadow-xl' : 'bg-white border-slate-200 hover:border-blue-500 shadow-sm'}`}>
                     <span className="text-5xl group-hover:scale-125 transition-transform duration-700 mb-6">{app.icon}</span>
                     <h3 className={`text-lg font-black uppercase italic tracking-tighter mb-2 ${appTheme === AppTheme.DARK ? 'text-white group-hover:text-amber-400' : 'text-slate-800 group-hover:text-blue-700'}`}>{app.label}</h3>
                     <p className="text-[9px] font-medium text-gray-500 uppercase tracking-widest leading-relaxed opacity-60">{app.desc}</p>
                     <div className={`absolute top-0 left-0 w-1.5 h-0 group-hover:h-full transition-all duration-1000 ${appTheme === AppTheme.DARK ? 'bg-amber-500' : 'bg-blue-600'}`}></div>
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <>
            <EngineSelector currentMode={engine} onModeChange={setEngine} theme={appTheme} />
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 space-y-8 w-full pb-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
                  <div className={`max-w-[80%] p-10 rounded-[4rem] border shadow-4xl ${msg.role === 'user' ? (appTheme === AppTheme.DARK ? 'bg-amber-500 border-amber-400 text-black font-bold' : 'bg-blue-600 border-blue-500 text-white font-bold shadow-[0_0_40px_rgba(37,99,235,0.4)]') : (appTheme === AppTheme.DARK ? 'bg-black/60 border-white/10 text-white backdrop-blur-2xl' : 'bg-white border-slate-200 text-slate-800 backdrop-blur-2xl')}`}>
                    <p className="text-xl font-medium tracking-tight leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {msg.attachments.map((at, idx) => (
                          <div key={idx} className="px-3 py-1 bg-black/20 rounded-lg text-[9px] font-mono border border-white/10">📎 {at.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in">
                  <div className={`max-w-[80%] p-8 rounded-[4rem] border italic flex items-center gap-6 backdrop-blur-xl ${appTheme === AppTheme.DARK ? 'bg-black/60 border-amber-500/20 text-amber-500/40' : 'bg-white border-blue-200 text-blue-500/40'}`}>
                    <div className={`w-4 h-4 border-2 rounded-full animate-spin ${appTheme === AppTheme.DARK ? 'border-amber-500 border-t-transparent' : 'border-blue-600 border-t-transparent'}`}></div>
                    <span className="text-xs font-black uppercase tracking-[0.4em]">{loc.thinking}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex flex-col gap-4 w-full px-8">
               {stagedFiles.length > 0 && (
                 <div className={`p-4 rounded-[2rem] border flex flex-wrap gap-3 animate-in slide-in-from-bottom-4 overflow-y-auto max-h-40 custom-scrollbar ${appTheme === AppTheme.DARK ? 'bg-black/60 border-white/5' : 'bg-white border-slate-200 shadow-lg'}`}>
                    {stagedFiles.map((file, i) => (
                      <div key={i} className={`px-4 py-2 rounded-full border flex items-center gap-3 transition-all ${appTheme === AppTheme.DARK ? 'bg-white/5 border-white/10 text-amber-100' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tighter truncate max-w-[120px]">{file.name}</span>
                        <button onClick={() => setStagedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 font-bold hover:scale-125 transition-transform">✕</button>
                      </div>
                    ))}
                    <div className="ml-auto flex items-center px-4"><span className="text-[9px] font-black uppercase text-gray-500">{stagedFiles.length} / 30 SHARDS</span></div>
                 </div>
               )}
               <div className={`p-5 rounded-[5rem] border flex items-center gap-6 transition-all backdrop-blur-3xl shadow-6xl ${appTheme === AppTheme.DARK ? 'bg-black/80 border-white/5 focus-within:border-amber-500/20' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <button onClick={() => fileInputRef.current?.click()} className={`w-16 h-16 rounded-full flex items-center justify-center bg-white/5 text-amber-500 border border-white/10 hover:bg-amber-500 hover:text-black transition-all ${stagedFiles.length >= 30 ? 'opacity-20 cursor-not-allowed' : ''}`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                  <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(inputValue); } }} placeholder={isCreatorMode ? loc.creatorGreeting : loc.talkToMe} className="flex-1 py-4 bg-transparent outline-none text-2xl font-bold italic resize-none h-10 max-h-32 custom-scrollbar placeholder:opacity-10" />
                  <div className="flex items-center gap-4 pr-6">
                     <VoiceController theme={appTheme} onTranscript={(t) => handleSend(t)} />
                     <button onClick={() => handleSend(inputValue)} disabled={isLoading} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 ${appTheme === AppTheme.DARK ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'}`}>
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M14 5l7 7-7 7" /></svg>
                     </button>
                  </div>
               </div>
            </div>
          </>
        )}
      </main>

      <div className="relative z-[2000]">
        {activeModule === 'friend_lattice' && <FriendLattice onClose={() => setActiveModule(null)} isCreator={isCreatorMode} />}
        {activeModule === 'academy_code' && <LearningPath type="coding" onClose={() => setActiveModule(null)} />}
        {activeModule === 'academy_trade' && <LearningPath type="trading" onClose={() => setActiveModule(null)} />}
        {activeModule === 'circuit_lab' && <AICircuitLab theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'live_call' && <NeuralCall theme={appTheme} personality={personality} onClose={() => setActiveModule(null)} />}
        {activeModule === 'trading_terminal' && <TradingTerminal onClose={() => setActiveModule(null)} />}
        {activeModule === 'grapher_nexus' && <GrapherNexus theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'aism' && <AISMGenerator theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'image_creator' && <ImageGenerator theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'nano_studio' && <NanoStudio theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'game_builder' && <GameBuilder onClose={() => setActiveModule(null)} />}
        {activeModule === 'avatar_arena' && <AvatarArena onClose={() => setActiveModule(null)} />}
        {activeModule === 'security' && <SecurityAcademy theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'scan' && <SurroundScan theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'piano' && <DigitalPiano theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'network' && <NetworkView onClose={() => setActiveModule(null)} />}
        {activeModule === 'resources' && <ResourceView onClose={() => setActiveModule(null)} />}
        {activeModule === 'vortex' && <NeuralVortexGame theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'impact' && <NeuralSlingshotGame theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'alchemy' && <AudioAlchemyStudio theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'dance' && <DanceStudio theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'knowledge' && <KnowledgeLab onClose={() => setActiveModule(null)} />}
        {activeModule === 'void' && <CodeVoid theme={appTheme} onClose={() => setActiveModule(null)} />}
        {activeModule === 'archivist' && <ArchivistVault theme={appTheme} history={messages} onClose={() => setActiveModule(null)} onPin={handlePin} />}
      </div>
      
      <NeuralEntity emotion={emotion} />
    </div>
  );
};

export default App;
