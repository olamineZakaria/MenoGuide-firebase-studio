export interface SymptomData {
  mood: string;
  sleepQuality: string;
  hotFlashes: string;
  otherSymptoms?: string;
}

export interface ProfileData {
  username: string;
  avatarUrl: string;
  dietaryPreferences?: string;
  menopauseNotes?: string;
}
