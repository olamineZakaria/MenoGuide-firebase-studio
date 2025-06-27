import { SignupData, ProfileData } from './types';

// Mock Firebase services for now - replace with actual Firebase imports
interface FirebaseAuth {
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  currentUser: any;
}

interface Firestore {
  collection: (path: string) => any;
  doc: (path: string) => any;
  setDoc: (doc: any, data: any) => Promise<void>;
  updateDoc: (doc: any, data: any) => Promise<void>;
  getDoc: (doc: any) => Promise<any>;
}

// Mock Firebase instances - replace with actual Firebase initialization
const mockAuth: FirebaseAuth = {
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    // Simulate Firebase Auth
    return { user: { uid: `user_${Date.now()}`, email } };
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    return { user: { uid: 'mock_user_id', email } };
  },
  signOut: async () => {},
  currentUser: null
};

const mockFirestore: Firestore = {
  collection: (path: string) => ({
    doc: (id: string) => ({
      set: async (data: any) => Promise.resolve(),
      update: async (data: any) => Promise.resolve(),
      get: async () => Promise.resolve({ data: () => data })
    })
  }),
  doc: (path: string) => ({
    set: async (data: any) => Promise.resolve(),
    update: async (data: any) => Promise.resolve(),
    get: async () => Promise.resolve({ data: () => data })
  }),
  setDoc: async (doc: any, data: any) => Promise.resolve(),
  updateDoc: async (doc: any, data: any) => Promise.resolve(),
  getDoc: async (doc: any) => Promise.resolve({ data: () => ({}) })
};

export class DatabaseService {
  private static auth: FirebaseAuth = mockAuth;
  private static firestore: Firestore = mockFirestore;

  // Initialize Firebase services
  static initialize(auth: FirebaseAuth, firestore: Firestore) {
    this.auth = auth;
    this.firestore = firestore;
  }

  // Create user account with Firebase Auth
  static async createUserAccount(email: string, password: string): Promise<string> {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      return userCredential.user.uid;
    } catch (error: any) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }

  // Save user profile data to Firestore
  static async saveUserProfile(userId: string, signupData: SignupData): Promise<void> {
    try {
      const userDoc = this.firestore.collection('users').doc(userId);
      
      // Structure the data hierarchically
      const profileData = {
        // Basic information
        personalInfo: {
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // Menopause information
        menopauseInfo: {
          phase: signupData.menopausePhase,
          cycleInfo: signupData.cycleInfo || null,
          symptoms: signupData.symptoms,
          concerns: signupData.concerns
        },

        // Preferences
        preferences: {
          ...signupData.preferences,
          theme: 'light', // default
          language: 'en' // default
        },

        // Profile image URL (will be set after upload)
        profileImageUrl: null,

        // Account status
        isActive: true,
        lastLogin: new Date()
      };

      await userDoc.set(profileData);
    } catch (error: any) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  }

  // Upload profile image to storage (mock implementation)
  static async uploadProfileImage(userId: string, imageFile: File): Promise<string> {
    try {
      // Simulate image upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a mock URL - replace with actual Firebase Storage upload
      const imageUrl = `https://storage.googleapis.com/menoguide-profiles/${userId}/profile.jpg`;
      
      // Update the user document with the image URL
      const userDoc = this.firestore.collection('users').doc(userId);
      await userDoc.update({
        profileImageUrl: imageUrl,
        updatedAt: new Date()
      });

      return imageUrl;
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  // Complete signup process with rollback on failure
  static async completeSignup(signupData: SignupData): Promise<{ userId: string; profileImageUrl?: string }> {
    let userId: string | null = null;
    let profileImageUrl: string | undefined;

    try {
      // Step 1: Create Firebase Auth account
      userId = await this.createUserAccount(signupData.email, signupData.password);

      // Step 2: Upload profile image if provided
      if (signupData.profileImage) {
        profileImageUrl = await this.uploadProfileImage(userId, signupData.profileImage);
      }

      // Step 3: Save complete profile data
      await this.saveUserProfile(userId, signupData);

      return { userId, profileImageUrl };
    } catch (error: any) {
      // Rollback: Delete the Firebase Auth account if profile save failed
      if (userId) {
        try {
          // Note: In real Firebase, you'd need to implement account deletion
          console.warn('Rollback: Account creation succeeded but profile save failed');
        } catch (rollbackError) {
          console.error('Failed to rollback account creation:', rollbackError);
        }
      }
      throw error;
    }
  }

  // Sign in existing user
  static async signInUser(email: string, password: string): Promise<string> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return userCredential.user.uid;
    } catch (error: any) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  }

  // Get user profile data
  static async getUserProfile(userId: string): Promise<ProfileData | null> {
    try {
      const userDoc = this.firestore.collection('users').doc(userId);
      const docSnapshot = await userDoc.get();
      
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        return {
          username: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          avatarUrl: data.profileImageUrl || 'https://placehold.co/100x100.png',
          dietaryPreferences: data.preferences?.dietaryPreferences || 'vegetarian',
          menopauseNotes: data.menopauseInfo?.notes || ''
        };
      }
      
      return null;
    } catch (error: any) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<ProfileData>): Promise<void> {
    try {
      const userDoc = this.firestore.collection('users').doc(userId);
      await userDoc.update({
        ...updates,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Sign out user
  static async signOutUser(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error: any) {
      throw new Error(`Failed to sign out: ${error.message}`);
    }
  }

  // Check if user is authenticated
  static isUserAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Get current user ID
  static getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }
} 