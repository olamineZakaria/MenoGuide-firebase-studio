import { SignupData, MenopausePhase, PasswordStrength, ValidationResult, CycleInfo } from './types';

export class SignupService {
  // Password strength evaluation
  static evaluatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('At least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('At least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('At least one number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score++;
    } else {
      feedback.push('At least one special character');
    }

    return {
      score,
      feedback,
      isStrong: score >= 4
    };
  }

  // Email validation
  static validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
      isValid,
      errors: isValid ? [] : ['Please enter a valid email address']
    };
  }

  // Step validation based on menopause phase
  static validateStep(step: number, data: Partial<SignupData>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (step) {
      case 1: // Basic Information
        if (!data.firstName?.trim()) errors.push('First name is required');
        if (!data.lastName?.trim()) errors.push('Last name is required');
        if (!data.email?.trim()) errors.push('Email is required');
        if (!data.password?.trim()) errors.push('Password is required');
        
        if (data.email) {
          const emailValidation = this.validateEmail(data.email);
          if (!emailValidation.isValid) {
            errors.push(...emailValidation.errors);
          }
        }
        
        if (data.password) {
          const passwordStrength = this.evaluatePasswordStrength(data.password);
          if (!passwordStrength.isStrong) {
            warnings.push('Consider strengthening your password');
          }
        }
        break;

      case 2: // Menopause Phase
        if (!data.menopausePhase) {
          errors.push('Please select your menopause phase');
        }
        break;

      case 3: // Cycle Information (only for pre-menopause)
        if (data.menopausePhase === 'pre-menopause') {
          if (!data.cycleInfo?.averageCycleLength) {
            errors.push('Average cycle length is required');
          }
          if (!data.cycleInfo?.periodDuration) {
            errors.push('Period duration is required');
          }
          if (!data.cycleInfo?.lastPeriodDate) {
            errors.push('Last period date is required');
          }
        }
        break;

      case 4: // Symptoms
        // Symptoms are optional but recommended
        const hasAnySymptom = data.symptoms && Object.values(data.symptoms).some(value => 
          typeof value === 'boolean' ? value : Array.isArray(value) ? value.length > 0 : false
        );
        if (!hasAnySymptom) {
          warnings.push('Selecting symptoms helps us personalize your experience');
        }
        break;

      case 5: // Personal Concerns
        // Concerns are optional but recommended
        const hasAnyConcern = data.concerns && Object.values(data.concerns).some(value => 
          typeof value === 'boolean' ? value : Array.isArray(value) ? value.length > 0 : false
        );
        if (!hasAnyConcern) {
          warnings.push('Selecting concerns helps us provide relevant support');
        }
        break;

      case 6: // Preferences
        // All preferences are optional
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Get visible steps based on menopause phase
  static getVisibleSteps(phase?: MenopausePhase): number[] {
    const allSteps = [1, 2, 3, 4, 5, 6];
    
    if (!phase) return [1, 2]; // Only show basic info and phase selection initially
    
    // Step 3 (cycle info) is only for pre-menopause
    if (phase !== 'pre-menopause') {
      return allSteps.filter(step => step !== 3);
    }
    
    return allSteps;
  }

  // Save progress to localStorage
  static saveProgress(data: Partial<SignupData>): void {
    try {
      localStorage.setItem('signupProgress', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save signup progress:', error);
    }
  }

  // Load progress from localStorage
  static loadProgress(): Partial<SignupData> | null {
    try {
      const saved = localStorage.getItem('signupProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved data is not too old (24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Failed to load signup progress:', error);
    }
    return null;
  }

  // Clear saved progress
  static clearProgress(): void {
    localStorage.removeItem('signupProgress');
  }

  // Optimize profile image
  static async optimizeProfileImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to 512x512
        canvas.width = 512;
        canvas.height = 512;

        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(512 / img.width, 512 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (512 - scaledWidth) / 2;
        const y = (512 - scaledHeight) / 2;

        // Draw image centered on canvas
        ctx?.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Convert to blob with 80% quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Validate complete signup data
  static validateCompleteSignup(data: SignupData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate all required fields
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.password?.trim()) errors.push('Password is required');
    if (!data.menopausePhase) errors.push('Menopause phase is required');

    // Validate email format
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }

    // Validate password strength
    const passwordStrength = this.evaluatePasswordStrength(data.password);
    if (!passwordStrength.isStrong) {
      warnings.push('Consider strengthening your password for better security');
    }

    // Validate cycle info for pre-menopause
    if (data.menopausePhase === 'pre-menopause' && !data.cycleInfo) {
      errors.push('Cycle information is required for pre-menopause');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
} 