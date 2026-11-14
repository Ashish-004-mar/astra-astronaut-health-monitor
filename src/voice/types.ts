export type VoiceCategory =
  | "general"
  | "baseline"
  | "sleep"
  | "stress"
  | "activity"
  | "space"
  | "simulation"
  | "checkin"
  | "help";

export interface DynamicVoiceContext {
  hr: number;
  spo2: number;
  sleep: number;
  stress: number;
  activity: number;
  baselineHr: number;
  baselineSpo2: number;
  baselineSleep: number;
  baselineStress: number;
  baselineActivity: number;
  healthStatus: "NOMINAL" | "ATTENTION" | "INCOMPLETE" | string;
  healthReasons: string[];
  healthAction: string;
  missionDay: number;
  missionHour: number;
  scenarioName: string;
  hasCheckinToday: boolean;
  todayCheckin?: {
    energy?: string;
    stress?: string;
    mood?: string;
    sleep?: string;
    discomfort?: string;
  };
}

export interface KnowledgeEntry {
  id: string;
  category: VoiceCategory;
  intent: string;
  questionEn: string;
  questionHi: string;
  questionHinglish?: string[];
  keywords: string[];
  answerEn: string | ((ctx: DynamicVoiceContext) => string);
  answerHi: string | ((ctx: DynamicVoiceContext) => string);
  isDynamic?: boolean;
}

export interface VoiceMessage {
  id: string;
  sender: "user" | "astra";
  text: string;
  lang: "en" | "hi";
  timestamp: string;
  category?: VoiceCategory;
  intent?: string;
  isDynamic?: boolean;
}

export type AssistantLanguage = "en" | "hi";

export interface VoiceSettings {
  enabled: boolean;
  language: AssistantLanguage;
  speechRate: number; // 0.8, 1.0, 1.2
  voiceOutput: boolean;
  soundVisualizer: boolean;
}
