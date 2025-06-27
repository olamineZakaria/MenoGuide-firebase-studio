"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SignupData, MenopausePhase } from "@/lib/types";
import { SignupService } from "@/lib/signup-service";
import { DatabaseService } from "@/lib/database-service";
import { Navigation } from "@/components/navigation";
import { BasicInfoStep } from "../../components/signup/basic-info-step";
import { MenopausePhaseStep } from "../../components/signup/menopause-phase-step";
import { CycleInfoStep } from "../../components/signup/cycle-info-step";
import { SymptomsStep } from "../../components/signup/symptoms-step";
import { ConcernsStep } from "../../components/signup/concerns-step";
import { PreferencesStep } from "../../components/signup/preferences-step";
import { SignupSummary } from "../../components/signup/signup-summary";

const SIGNUP_STEPS = [
  { id: 1, title: "Basic Information", description: "Tell us about yourself" },
  { id: 2, title: "Menopause Phase", description: "Select your current phase" },
  { id: 3, title: "Cycle Information", description: "Track your menstrual cycle" },
  { id: 4, title: "Symptoms", description: "Identify your symptoms" },
  { id: 5, title: "Personal Concerns", description: "Share your goals" },
  { id: 6, title: "Preferences", description: "Customize your experience" }
];

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = SignupService.loadProgress();
    if (savedProgress) {
      setSignupData(savedProgress);
      // Determine current step based on saved data
      if (savedProgress.menopausePhase) {
        const visibleSteps = SignupService.getVisibleSteps(savedProgress.menopausePhase);
        setCurrentStep(Math.max(...visibleSteps));
      }
    }
  }, []);

  // Save progress whenever data changes
  useEffect(() => {
    if (Object.keys(signupData).length > 0) {
      SignupService.saveProgress(signupData);
    }
  }, [signupData]);

  const getVisibleSteps = () => {
    return SignupService.getVisibleSteps(signupData.menopausePhase);
  };

  const getCurrentProgress = () => {
    const visibleSteps = getVisibleSteps();
    const currentStepIndex = visibleSteps.indexOf(currentStep);
    return ((currentStepIndex + 1) / visibleSteps.length) * 100;
  };

  const validateCurrentStep = () => {
    return SignupService.validateStep(currentStep, signupData);
  };

  const handleNext = () => {
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setError(null);
    const visibleSteps = getVisibleSteps();
    const currentIndex = visibleSteps.indexOf(currentStep);
    
    if (currentIndex < visibleSteps.length - 1) {
      setCurrentStep(visibleSteps[currentIndex + 1]);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    const visibleSteps = getVisibleSteps();
    const currentIndex = visibleSteps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(visibleSteps[currentIndex - 1]);
    }
  };

  const handleStepClick = (step: number) => {
    const visibleSteps = getVisibleSteps();
    if (visibleSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleDataUpdate = (updates: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...updates }));
  };

  const handleCompleteSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Final validation
      const validation = SignupService.validateCompleteSignup(signupData as SignupData);
      if (!validation.isValid) {
        setError(validation.errors[0]);
        return;
      }

      // Complete signup process
      const result = await DatabaseService.completeSignup(signupData as SignupData);
      
      // Clear saved progress
      SignupService.clearProgress();
      
      // Set user session
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", result.userId);
      
      // Redirect to dashboard
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    if (showSummary) {
      return (
        <SignupSummary 
          data={signupData as SignupData}
          onEdit={(step) => {
            setShowSummary(false);
            setCurrentStep(step);
          }}
          onComplete={handleCompleteSignup}
          isLoading={isLoading}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={signupData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <MenopausePhaseStep
            data={signupData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <CycleInfoStep
            data={signupData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <SymptomsStep
            data={signupData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <ConcernsStep
            data={signupData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <PreferencesStep
            data={signupData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  const visibleSteps = getVisibleSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Navigation showBackButton={true} backUrl="/login" />
      
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to MenoGuide
              </CardTitle>
              <p className="text-gray-600">
                Let's create your personalized menopause journey
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress Indicator */}
              {!showSummary && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Step {visibleSteps.indexOf(currentStep) + 1} of {visibleSteps.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(getCurrentProgress())}% Complete
                    </span>
                  </div>
                  <Progress value={getCurrentProgress()} className="h-2" />
                  
                  {/* Step Indicators */}
                  <div className="flex justify-center space-x-2">
                    {visibleSteps.map((step) => (
                      <button
                        key={step}
                        onClick={() => handleStepClick(step)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          step === currentStep
                            ? 'bg-purple-600 text-white'
                            : step < currentStep
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {step < currentStep ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          step
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Current Step Content */}
              <div className="min-h-[400px]">
                {renderCurrentStep()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 