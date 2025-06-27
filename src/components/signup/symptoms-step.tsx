"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { SignupData, MenopauseSymptoms, MenopausePhase } from "@/lib/types";

interface SymptomsStepProps {
  data: Partial<SignupData>;
  onUpdate: (updates: Partial<SignupData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const COMMON_SYMPTOMS = [
  { id: 'hotFlashes', label: 'Hot Flashes', icon: '🔥' },
  { id: 'nightSweats', label: 'Night Sweats', icon: '💧' },
  { id: 'moodSwings', label: 'Mood Swings', icon: '😤' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
  { id: 'sleepProblems', label: 'Sleep Problems', icon: '🌙' },
  { id: 'brainFog', label: 'Brain Fog', icon: '🧠' },
  { id: 'weightGain', label: 'Weight Gain', icon: '⚖️' },
  { id: 'vaginalDryness', label: 'Vaginal Dryness', icon: '🌸' }
];

const PHASE_SPECIFIC_SYMPTOMS = {
  'pre-menopause': [
    { id: 'irregularPeriods', label: 'Irregular Periods', icon: '📅' },
    { id: 'heavyBleeding', label: 'Heavy Bleeding', icon: '🩸' }
  ],
  'peri-menopause': [
    { id: 'skippedPeriods', label: 'Skipped Periods', icon: '⏭️' },
    { id: 'shorterCycles', label: 'Shorter Cycles', icon: '⏱️' }
  ],
  'post-menopause': [
    { id: 'boneLoss', label: 'Bone Loss Concerns', icon: '🦴' },
    { id: 'heartHealth', label: 'Heart Health Concerns', icon: '❤️' }
  ]
};

export function SymptomsStep({ data, onUpdate, onNext, onPrevious }: SymptomsStepProps) {
  const [customSymptom, setCustomSymptom] = useState('');

  const handleSymptomToggle = (symptomId: keyof MenopauseSymptoms, checked: boolean) => {
    const currentSymptoms = data.symptoms || {};
    onUpdate({
      symptoms: { ...currentSymptoms, [symptomId]: checked }
    });
  };

  const handleCustomSymptomAdd = () => {
    if (customSymptom.trim()) {
      const currentSymptoms = data.symptoms || {};
      const currentCustom = currentSymptoms.otherSymptoms || [];
      onUpdate({
        symptoms: {
          ...currentSymptoms,
          otherSymptoms: [...currentCustom, customSymptom.trim()]
        }
      });
      setCustomSymptom('');
    }
  };

  const handleCustomSymptomRemove = (index: number) => {
    const currentSymptoms = data.symptoms || {};
    const currentCustom = currentSymptoms.otherSymptoms || [];
    onUpdate({
      symptoms: {
        ...currentSymptoms,
        otherSymptoms: currentCustom.filter((_, i) => i !== index)
      }
    });
  };

  const getPhaseSpecificSymptoms = () => {
    const phase = data.menopausePhase as MenopausePhase;
    return PHASE_SPECIFIC_SYMPTOMS[phase] || [];
  };

  const getSelectedSymptomsCount = () => {
    const symptoms = data.symptoms || {};
    const commonCount = Object.keys(COMMON_SYMPTOMS).filter(
      key => symptoms[key as keyof MenopauseSymptoms]
    ).length;
    const phaseCount = Object.keys(getPhaseSpecificSymptoms()).filter(
      key => symptoms[key as keyof MenopauseSymptoms]
    ).length;
    const customCount = symptoms.otherSymptoms?.length || 0;
    return commonCount + phaseCount + customCount;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Symptoms</h2>
        <p className="text-gray-600">
          Select the symptoms you're experiencing to help us personalize your support
        </p>
      </div>

      {/* Selected Count */}
      <div className="text-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {getSelectedSymptomsCount()} symptoms selected
        </Badge>
      </div>

      {/* Common Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Symptoms</CardTitle>
          <p className="text-sm text-gray-600">
            These symptoms are common across all menopause phases
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => (
              <label
                key={symptom.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={!!data.symptoms?.[symptom.id as keyof MenopauseSymptoms]}
                  onCheckedChange={(checked) => 
                    handleSymptomToggle(symptom.id as keyof MenopauseSymptoms, !!checked)
                  }
                />
                <span className="text-lg">{symptom.icon}</span>
                <span className="text-sm font-medium">{symptom.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase-Specific Symptoms */}
      {data.menopausePhase && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {data.menopausePhase === 'pre-menopause' && 'Pre-Menopause Specific'}
              {data.menopausePhase === 'peri-menopause' && 'Peri-Menopause Specific'}
              {data.menopausePhase === 'post-menopause' && 'Post-Menopause Specific'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Symptoms more common in your current phase
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getPhaseSpecificSymptoms().map((symptom) => (
                <label
                  key={symptom.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={!!data.symptoms?.[symptom.id as keyof MenopauseSymptoms]}
                    onCheckedChange={(checked) => 
                      handleSymptomToggle(symptom.id as keyof MenopauseSymptoms, !!checked)
                    }
                  />
                  <span className="text-lg">{symptom.icon}</span>
                  <span className="text-sm font-medium">{symptom.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Other Symptoms</CardTitle>
          <p className="text-sm text-gray-600">
            Add any other symptoms you're experiencing
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="e.g., joint pain, hair loss..."
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSymptomAdd()}
            />
            <Button
              onClick={handleCustomSymptomAdd}
              disabled={!customSymptom.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Custom Symptoms List */}
          {data.symptoms?.otherSymptoms && data.symptoms.otherSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.symptoms.otherSymptoms.map((symptom, index) => (
                <Badge key={index} variant="outline" className="flex items-center space-x-1">
                  <span>{symptom}</span>
                  <button
                    onClick={() => handleCustomSymptomRemove(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Why track symptoms?</h3>
          <p className="text-blue-700 text-sm">
            Understanding your symptoms helps us provide personalized recommendations, 
            track patterns over time, and connect you with relevant resources and support. 
            This information is completely private and helps us tailor your experience.
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        
        <Button
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 