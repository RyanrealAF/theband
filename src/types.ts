export type StemName = "piano" | "guitar" | "drums" | "bass";
export interface StemFrame { stem: StemName; level: number; onset: number; low: number; mid: number; high: number; pitchHz: number | null; time: number; }
export interface MusicalEvent extends StemFrame { kind: "hit" | "sustain" | "rise" | "fall"; intensity: number; }
export interface BandState { time: number; master: number; cameraKick: number; groundPulse: number; events: MusicalEvent[]; }
