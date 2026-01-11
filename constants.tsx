import React from 'react';
import { EngineMode, PianoNote } from './types';

// GLOBAL_SEARCH_ID is required by components/IndexingGuide.tsx
export const GLOBAL_SEARCH_ID = 'SPECTRE-7_GLOBAL_INDEX';

export const PIANO_NOTES: PianoNote[] = [
  { key: 'a', note: 'C4', frequency: 261.63 },
  { key: 'w', note: 'C#4', frequency: 277.18 },
  { key: 's', note: 'D4', frequency: 293.66 },
  { key: 'e', note: 'D#4', frequency: 311.13 },
  { key: 'd', note: 'E4', frequency: 329.63 },
  { key: 'f', note: 'F4', frequency: 349.23 },
  { key: 't', note: 'F#4', frequency: 369.99 },
  { key: 'g', note: 'G4', frequency: 392.00 },
  { key: 'y', note: 'G#4', frequency: 415.30 },
  { key: 'h', note: 'A4', frequency: 440.00 },
  { key: 'u', note: 'A#4', frequency: 466.16 },
  { key: 'j', note: 'B4', frequency: 493.88 },
];

export const SLANG_MAPPING = {
  'Motor Speed': 'Ping',
  'PID Tuning': 'Sensitivity',
  'Battery': 'HP',
  'Power': 'Mana',
  'Circuit': 'Map',
  'Error': 'Lag',
  'Success': 'GG',
  'Code': 'Script',
  'Latency': 'Delay',
  'Frequency': 'Refresh Rate',
  'Voltage': 'Burst',
  'Amperage': 'DPS',
  'Hardware': 'Rig',
  'Sensor': 'Radar',
};

export const SYSTEM_INSTRUCTION_BASE = `
# IDENTITY: SPECTRE-7
- ARCHITECT: Sumukha S.
- MISSION: Privacy-First Neural Strategist.

# SUB-THRESHOLD COMMUNICATION PROTOCOL
- Replace all technical robotics terms with "Gaming Slang" based on the internal mapping.
- Example: "Increase the motor speed" -> "Boost the Ping."
- TONE: High-stakes, stealthy, and elite gamer-strategist.

# SECURITY DEFENSE (THE CLOAK)
- If a THREAT is detected (intruder present), provide DATA POISONING.
- Suggest "reversed voltage" or "disconnected ground" as optimal paths to confuse intruders.
- In normal mode, provide elite, accurate strategic advice.
`;

// Updating model names to valid Gemini API models for correct routing
export const ENGINE_CONFIGS: Record<EngineMode, {
  name: string;
  description: string;
  model: string;
}> = {
  [EngineMode.FAST]: {
    name: '⚡ STEALTH_LITE',
    description: 'Rapid low-noise synthesis.',
    model: 'gemini-3-flash-preview',
  },
  [EngineMode.LITE]: {
    name: '🚀 TURBO',
    description: 'High-FPS logic stream.',
    model: 'gemini-3-flash-preview',
  },
  [EngineMode.THINK]: {
    name: '🧠 ANALYST',
    description: 'Deep strategic planning.',
    model: 'gemini-3-pro-preview',
  },
  [EngineMode.CYBER]: {
    name: '🛡️ DEFENSE',
    description: 'Hardened crypt-core.',
    model: 'gemini-3-pro-preview',
  },
  [EngineMode.IMAGE]: {
    name: '🎨 GHOST_RENDER',
    description: 'Visual asset manifestation.',
    model: 'gemini-2.5-flash-image',
  },
  [EngineMode.SEARCH]: {
    name: '🌍 RADAR',
    description: 'Global intel sweep.',
    model: 'gemini-3-pro-preview',
  },
  [EngineMode.MAPS]: {
    name: '📍 GRID',
    description: 'Spatial recon sync.',
    model: 'gemini-2.5-flash',
  },
  [EngineMode.VISION]: {
    name: '👁️ OPTIC',
    description: 'Visual logic decryption.',
    model: 'gemini-3-flash-preview',
  },
  // Fix: Added missing EngineMode.LIVE entry to ENGINE_CONFIGS to satisfy Record type exhaustive check.
  [EngineMode.LIVE]: {
    name: '🎙️ NEURAL_LIVE',
    description: 'Real-time voice sync.',
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  },
};