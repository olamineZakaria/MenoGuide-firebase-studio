"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { SignupData, MenopausePhase } from "@/lib/types";

interface MenopausePhaseStepProps {
  data: Partial<SignupData>;
  onUpdate: (updates: Partial<SignupData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const MENOPAUSE_PHASES = [
  {
    id: 'pre-menopause' as MenopausePhase,
    title: 'Pre-Menopause',
    description: 'Regular menstrual cycles with some changes',
    details: [
      'Regular periods (every 21-35 days)',
      'May experience some hormonal fluctuations',
      'Usually in your 30s or early 40s',
      'Fertility is still possible'
    ],
    icon: '🌸',
    color: 'border-pink-300 bg-pink-50'
  },
  {
    id: 'peri-menopause' as MenopausePhase,
    title: 'Peri-Menopause',
    description: 'Irregular periods with menopausal symptoms',
    details: [
      'Irregular menstrual cycles',
      'Hot flashes and night sweats',
      'Mood changes and sleep problems',
      'Usually lasts 4-8 years'
    ],
    icon: '🌺',
    color: 'border-purple-300 bg-purple-50'
  },
  {
    id: 'post-menopause' as MenopausePhase,
    title: 'Post-Menopause',
    description: 'No periods for 12+ consecutive months',
    details: [
      'No menstrual periods for 12+ months',
      'May still experience some symptoms',
      'Focus on long-term health',
      'Bone and heart health become priorities'
    ],
    icon: '🌻',
    color: 'border-orange-300 bg-orange-50'
  }
];

export function MenopausePhaseStep({ data, onUpdate, onNext, onPrevious }: MenopausePhaseStepProps) {
  const handlePhaseSelect = (phase: MenopausePhase) => {
    onUpdate({ menopausePhase: phase });
  };

  const isPhaseSelected = (phase: MenopausePhase) => {
    return data.menopausePhase === phase;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Menopause Phase</h2>
        <p className="text-gray-600">
          This helps us personalize your experience and provide relevant support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MENOPAUSE_PHASES.map((phase) => (
          <Card
            key={phase.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isPhaseSelected(phase.id)
                ? `${phase.color} border-2 ring-2 ring-purple-200`
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handlePhaseSelect(phase.id)}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center mb-2">
                {isPhaseSelected(phase.id) ? (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="text-3xl mb-2">{phase.icon}</div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {phase.title}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                {phase.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-700">
                {phase.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Why is this important?</h3>
          <p className="text-blue-700 text-sm">
            Your menopause phase determines which features and support are most relevant to you. 
            Pre-menopause users will see cycle tracking options, while post-menopause users 
            will focus on long-term health monitoring. You can always update this later in your profile.
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
          disabled={!data.menopausePhase}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 