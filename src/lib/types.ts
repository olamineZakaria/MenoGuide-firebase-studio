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

// Menopause phases
export type MenopausePhase = 'pre-menopause' | 'peri-menopause' | 'post-menopause';

// Cycle information (only for pre-menopause)
export interface CycleInfo {
  averageCycleLength: number; // in days
  periodDuration: number; // in days
  lastPeriodDate: Date;
  isRegular: boolean;
}

// Symptoms by phase
export interface MenopauseSymptoms {
  // Common symptoms
  hotFlashes: boolean;
  nightSweats: boolean;
  moodSwings: boolean;
  fatigue: boolean;
  sleepProblems: boolean;
  brainFog: boolean;
  weightGain: boolean;
  vaginalDryness: boolean;
  
  // Pre-menopause specific
  irregularPeriods?: boolean;
  heavyBleeding?: boolean;
  
  // Peri-menopause specific
  skippedPeriods?: boolean;
  shorterCycles?: boolean;
  
  // Post-menopause specific
  boneLoss?: boolean;
  heartHealth?: boolean;
  
  // Custom symptoms
  otherSymptoms?: string[];
}

// Personal concerns and goals
export interface PersonalConcerns {
  sleepQuality: boolean;
  energyLevels: boolean;
  mentalHealth: boolean;
  relationships: boolean;
  career: boolean;
  physicalActivity: boolean;
  nutrition: boolean;
  stressManagement: boolean;
  otherConcerns?: string[];
}

// Complete signup data
export interface SignupData {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: File;
  
  // Step 2: Menopause Phase
  menopausePhase: MenopausePhase;
  
  // Step 3: Cycle Information (conditional)
  cycleInfo?: CycleInfo;
  
  // Step 4: Symptoms
  symptoms: MenopauseSymptoms;
  
  // Step 5: Personal Concerns
  concerns: PersonalConcerns;
  
  // Step 6: Preferences
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    communityAccess: boolean;
    dataSharing: boolean;
  };
}

// Signup step configuration
export interface SignupStep {
  id: number;
  title: string;
  description: string;
  isRequired: boolean;
  isVisible: (phase?: MenopausePhase) => boolean;
}

// Password strength indicator
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
