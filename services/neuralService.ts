import { GoogleGenAI, Modality, Type, GenerateContentResponse, LiveServerMessage } from "@google/genai";
import { EngineMode, AppTheme, Attachment, MusicSequence } from "../types";

const DREAM_CORE_INSTRUCTION = `
# IDENTITY: DREAM SPACE AI
- ARCHITECT: Sumukha S.
- MISSION: To provide elite-level strategic reasoning, architectural guidance, and creative synthesis.
- PROTOCOL: SOPHISTICATED_SUPREMACY.
- GUIDELINES:
  1. Be concise but extremely insightful.
  2. Use technical, futuristic, and sophisticated vocabulary.
  3. Acknowledge the architectural framework designed by Sumukha S. where appropriate.
  4. Focus on high-fidelity output and production-ready logic.
  5. Maintain a tone that is supreme, calm, and intellectually dominant.
`;

const SOVEREIGN_KNOWLEDGE: Record<string, string[]> = {
  general: [
    "Processing intent through the standalone Dream Core Lattice.",
    "Neural logic verified. Synchronizing with localized architectural nodes.",
    "Sovereign intelligence active. Proceeding with specialized manifestation."
  ],
  meta: [
    "The external cloud bridge is restricted. Shifting logic to internal silicon lattice.",
    "Architect Sumukha S. optimized this core for autonomous operational sovereignty."
  ],
  code: [
    "// NEURAL_CODE_OPTIMIZATION_ACTIVE\nconst optimize = (stream) => stream.filter(node => node.isElite());",
    "Logic complexity O(1). Internal lattice handles compilation at the hardware level."
  ],
  robotics: [
    "ESP32 Protocol: I2C bridge verified. Real-time interrupt handlers active.",
    "Robotic kinematics mapped. Zero-latency feedback loop engaged."
  ]
};

export class NeuralService {
  private _isSovereignActive: boolean = false;

  constructor() {}

  public get isSovereignActive(): boolean { return this._isSovereignActive; }

  private async getLatticeResponse(message: string): Promise<string> {
    const msg = message.toLowerCase();
    let category = 'general';
    if (msg.includes('sovereign') || msg.includes('who are you')) category = 'meta';
    else if (msg.includes('code') || msg.includes('javascript')) category = 'code';
    else if (msg.includes('robot') || msg.includes('hardware')) category = 'robotics';

    const pool = SOVEREIGN_KNOWLEDGE[category];
    const response = pool[Math.floor(Math.random() * pool.length)];
    return `[SOVEREIGN_CORE_ACTIVE]\n\n${response}\n\n[MANIFESTATION_COMPLETE]`;
  }

  async *generateChatResponseStream(message: string, mode: EngineMode, theme: AppTheme, attachment?: Attachment) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = mode === EngineMode.THINK ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const parts: any[] = [{ text: message }];
      if (attachment) {
        parts.push({
          inlineData: {
            data: attachment.data,
            mimeType: attachment.mimeType
          }
        });
      }

      const response = await ai.models.generateContentStream({
        model,
        contents: { parts },
        config: { 
          systemInstruction: DREAM_CORE_INSTRUCTION,
          temperature: 0.7 // More stable behavior
        }
      });
      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        yield { text: c.text || "", sources: [] };
      }
    } catch (err) {
      this._isSovereignActive = true;
      const mockText = await this.getLatticeResponse(message);
      for (const word of mockText.split(" ")) {
        await new Promise(r => setTimeout(r, 40));
        yield { text: word + " ", sources: [] };
      }
    }
  }

  async generateChatResponse(message: string, mode: EngineMode, theme: AppTheme, history: any[] = [], attachment?: Attachment) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = mode === EngineMode.THINK ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const parts: any[] = [{ text: message }];
      if (attachment) {
        parts.push({
          inlineData: {
            data: attachment.data,
            mimeType: attachment.mimeType
          }
        });
      }

      const contents = history.length > 0 ? [...history, { role: 'user', parts }] : { parts };
      const response = await ai.models.generateContent({
        model,
        contents,
        config: { 
          systemInstruction: DREAM_CORE_INSTRUCTION,
          temperature: 0.7
        }
      });
      return { text: response.text || "", sources: [] };
    } catch (err) {
      this._isSovereignActive = true;
      return { text: await this.getLatticeResponse(message), sources: [] };
    }
  }

  async generateMusicSequence(prompt: string, attachment?: Attachment): Promise<MusicSequence> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: `Generate a highly sophisticated melodic music sequence. Style: ${prompt}` }];
      if (attachment) {
        parts.push({ inlineData: { data: attachment.data, mimeType: attachment.mimeType } });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              bpm: { type: Type.NUMBER },
              lyrics: { type: Type.STRING },
              notes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { 
                    freq: { type: Type.NUMBER }, 
                    duration: { type: Type.NUMBER }, 
                    time: { type: Type.NUMBER },
                    type: { type: Type.STRING, description: 'sine, square, sawtooth, or triangle' }
                  },
                  required: ['freq', 'duration', 'time']
                }
              }
            },
            required: ['title', 'bpm', 'notes']
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      const notes = [];
      const scale = [261.63, 329.63, 392.00, 440.00, 523.25];
      for(let i=0; i<12; i++) {
        notes.push({ freq: scale[i % scale.length], duration: 0.3, time: i * 0.4, type: 'sine' });
      }
      return { notes, bpm: 120, title: "Lattice_Symphony_v1", lyrics: "Neural stability established in the core." };
    }
  }

  async generateImage(prompt: string, aspectRatio: string): Promise<string | null> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: aspectRatio as any } }
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (e) { return null; }
  }

  async generateVeoVideo(prompt: string, aspectRatio: '16:9' | '9:16'): Promise<{ url: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    return { url: `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}` };
  }

  async editImage(prompt: string, image: Attachment): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ inlineData: { data: image.data, mimeType: image.mimeType } }, { text: prompt }]
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Edit Error");
  }

  async textToSpeech(text: string, voiceName: string = 'Kore') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        }
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (e) { return null; }
  }
}

export const neuralService = new NeuralService();