export type ThemeMode = 'calm-blue' | 'black-yellow' | 'white-black' | 'dark-blue';

export type TremorSensitivity = 'low' | 'medium' | 'high';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  imageUrl: string;
  duration: number; // in seconds
  benefits: string;
}

export interface Report {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  warnings: string;
  sideEffects: string;
  simpleExplanation: string;
  imageUrl?: string;
  createdAt: string;
  sentToDoctor: boolean;
}

export interface UserPreferences {
  name: string;
  preferredLanguage: string;
  fontSize: number; // 24 to 72
  themeMode: ThemeMode;
  tremorAssistOn: boolean;
  tremorSensitivity: TremorSensitivity;
}
