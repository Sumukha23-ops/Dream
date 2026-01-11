
import { MusicSequence, MusicNote } from "../types";

export class AudioService {
  private static instance: AudioService;
  public context: AudioContext | null = null;
  public aiAnalyzer: AnalyserNode | null = null;
  private freqData: Uint8Array = new Uint8Array(0);
  private activeOscillators: { osc: OscillatorNode | AudioBufferSourceNode; gain: GainNode }[] = [];
  private bgMusicSource: AudioBufferSourceNode | null = null;
  private bgMusicGain: GainNode | null = null;
  
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  private constructor() {}

  static getInstance() {
    if (!AudioService.instance) AudioService.instance = new AudioService();
    return AudioService.instance;
  }

  initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 });
      this.aiAnalyzer = this.context.createAnalyser();
      this.aiAnalyzer.fftSize = 2048;
      
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.7;

      this.delayNode = this.context.createDelay(1.0);
      this.delayNode.delayTime.value = 0.4;
      this.delayGain = this.context.createGain();
      this.delayGain.gain.value = 0.15;

      this.masterGain.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.delayNode);
      this.delayGain.connect(this.aiAnalyzer);
      
      this.masterGain.connect(this.aiAnalyzer);
      this.aiAnalyzer.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') this.context.resume();
    return this.context;
  }

  getAiResonance(): number {
    if (!this.aiAnalyzer) return 0;
    if (this.freqData.length !== this.aiAnalyzer.frequencyBinCount) {
      this.freqData = new Uint8Array(this.aiAnalyzer.frequencyBinCount);
    }
    this.aiAnalyzer.getByteFrequencyData(this.freqData);
    return (this.freqData.reduce((a, b) => a + b, 0) / this.freqData.length) / 255;
  }

  getLowFreqResonance(): number {
    if (!this.aiAnalyzer) return 0;
    this.aiAnalyzer.getByteFrequencyData(this.freqData);
    const lowFreqCount = Math.max(1, Math.floor(this.freqData.length * 0.1));
    let sum = 0;
    for (let i = 0; i < lowFreqCount; i++) sum += this.freqData[i];
    return (sum / lowFreqCount) / 255;
  }

  stopAll(stopBg: boolean = false) {
    const ctx = this.context;
    if (!ctx) return;
    
    this.activeOscillators.forEach(node => {
      try { 
        node.gain.gain.cancelScheduledValues(ctx.currentTime);
        node.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        setTimeout(() => {
          try { node.osc.stop(); } catch(e) {}
        }, 120);
      } catch (e) {}
    });
    this.activeOscillators = [];

    if (stopBg && this.bgMusicSource) {
      this.bgMusicGain?.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      setTimeout(() => {
        this.bgMusicSource?.stop();
        this.bgMusicSource = null;
      }, 1100);
    }
  }

  playSequence(sequence: MusicSequence): number {
    this.stopAll();
    const ctx = this.initContext();
    const startTime = ctx.currentTime + 0.2;
    let maxDuration = 0;

    sequence.notes.forEach((note: MusicNote) => {
      this.playInstrument(note.type as any || 'synth', note.freq, 0.3, note.duration, startTime + note.time);
      if (note.time + note.duration > maxDuration) maxDuration = note.time + note.duration;
    });

    return maxDuration;
  }

  async playCalmMelody() {
    const ctx = this.initContext();
    this.stopAll(true);
    
    const bgGain = ctx.createGain();
    bgGain.gain.value = 0;
    bgGain.connect(this.aiAnalyzer!);
    this.bgMusicGain = bgGain;

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 120, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate a calming, evolving ambient drone
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (
        Math.sin(2 * Math.PI * 55 * t + Math.sin(2 * Math.PI * 0.1 * t)) * 0.3 + 
        Math.sin(2 * Math.PI * 110 * t) * 0.1 +
        Math.sin(2 * Math.PI * 165 * t) * 0.05
      ) * Math.exp(-0.01 * (t % 10));
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(bgGain);
    source.start();
    this.bgMusicSource = source;
    bgGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
  }

  playInstrument(
    type: string = 'synth', 
    freq: number = 440, 
    volume: number = 0.4, 
    duration: number = 1.0, 
    time?: number
  ) {
    const ctx = this.initContext();
    const playTime = time || ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter).connect(gain).connect(this.masterGain!);
    osc.frequency.setValueAtTime(freq, playTime);

    switch(type) {
      case 'piano':
        osc.type = 'sine';
        const pMod = ctx.createOscillator();
        pMod.frequency.value = freq * 2;
        const pGain = ctx.createGain();
        pGain.gain.value = 0.1;
        pMod.connect(pGain).connect(gain);
        pMod.start(playTime); pMod.stop(playTime + duration);
        gain.gain.setValueAtTime(0, playTime);
        gain.gain.linearRampToValueAtTime(volume, playTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, playTime + duration * 1.5);
        break;
      case 'crystal':
        osc.type = 'triangle';
        const cMod = ctx.createOscillator();
        cMod.frequency.value = freq * 4.01;
        const cGain = ctx.createGain();
        cGain.gain.value = freq * 0.2;
        cMod.connect(cGain).connect(osc.frequency);
        cMod.start(playTime); cMod.stop(playTime + duration);
        gain.gain.setValueAtTime(0, playTime);
        gain.gain.linearRampToValueAtTime(volume * 0.4, playTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, playTime + duration * 2);
        break;
      case 'bass':
        osc.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, playTime);
        filter.frequency.exponentialRampToValueAtTime(100, playTime + duration);
        gain.gain.setValueAtTime(volume * 0.8, playTime);
        gain.gain.linearRampToValueAtTime(0, playTime + duration);
        break;
      case 'strings':
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0, playTime);
        gain.gain.linearRampToValueAtTime(volume * 0.5, playTime + duration * 0.3);
        gain.gain.linearRampToValueAtTime(0, playTime + duration);
        break;
      case 'choir':
        osc.type = 'sawtooth';
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, playTime);
        gain.gain.setValueAtTime(0, playTime);
        gain.gain.linearRampToValueAtTime(volume * 0.4, playTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, playTime + duration);
        break;
      case 'percussion':
        osc.type = 'square';
        osc.frequency.exponentialRampToValueAtTime(10, playTime + 0.08);
        gain.gain.setValueAtTime(volume, playTime);
        gain.gain.exponentialRampToValueAtTime(0.001, playTime + 0.08);
        break;
      default:
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(volume * 0.5, playTime);
        gain.gain.exponentialRampToValueAtTime(0.001, playTime + duration);
    }

    osc.start(playTime);
    osc.stop(playTime + duration + 0.5);
    this.activeOscillators.push({ osc, gain });
  }

  async playBase64Audio(base64: string) {
    const ctx = this.initContext();
    const bytes = this.decodeBase64ToUint8(base64);
    const buffer = await this.decodeAudioData(bytes, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.connect(gain).connect(this.aiAnalyzer!);
    source.start();
    this.activeOscillators.push({ osc: source, gain });
    return source;
  }

  private decodeBase64ToUint8(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }
}

export const audioService = AudioService.getInstance();
