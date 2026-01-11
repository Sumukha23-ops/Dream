
export enum EngineMode {
  FAST = 'FAST',
  LITE = 'LITE',
  THINK = 'THINK',
  SEARCH = 'SEARCH',
  MAPS = 'MAPS',
  VISION = 'VISION',
  IMAGE = 'IMAGE',
  CYBER = 'CYBER',
  LIVE = 'LIVE'
}

export enum PersonalityMode {
  SOVEREIGN = 'SOVEREIGN',
  ORACLE = 'ORACLE',
  GUARDIAN = 'GUARDIAN',
  MUSE = 'MUSE',
  GHOST = 'GHOST'
}

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export enum NeuralEmotion {
  NEUTRAL = 'NEUTRAL',
  THINKING = 'THINKING',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  CURIOUS = 'CURIOUS',
  EXCITED = 'EXCITED',
  PROUD = 'PROUD',
  ANALYTICAL = 'ANALYTICAL',
  ERROR = 'ERROR',
  EMPATHETIC = 'EMPATHETIC',
  FRUSTRATED = 'FRUSTRATED',
  INSPIRED = 'INSPIRED',
  AMUSED = 'AMUSED',
  ALERT = 'ALERT'
}

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: GroundingSource[];
  attachments?: Attachment[]; // Support for multiple files
  attachment?: Attachment; // Legacy support
  generatedImageUrl?: string;
  personality?: PersonalityMode;
  isPinned?: boolean;
  currentEmotion?: NeuralEmotion;
}

export interface MemoryEntry {
  word: string;
  timestamp: number;
  sessionId: string;
}

export interface PianoNote {
  key: string;
  note: string;
  frequency: number;
}

export interface MusicNote {
  freq: number;
  duration: number;
  time: number;
  type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
}

export interface MusicSequence {
  notes: MusicNote[];
  bpm: number;
  title: string;
  lyrics?: string;
}
