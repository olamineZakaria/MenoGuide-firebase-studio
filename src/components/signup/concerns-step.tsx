"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Target, Heart, Brain, Users, Briefcase, Activity, Apple, Zap } from "lucide-react";
import { SignupData, PersonalConcerns } from "@/lib/types";

interface ConcernsStepProps {
  data: Partial<SignupData>;
  onUpdate: (updates: Partial<SignupData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CONCERNS = [
  { 
    id: 'sleepQuality', 
    label: 'Sleep Quality', 
    icon: '🌙',
    description: 'Improve sleep patterns and rest quality',
    color: 'border-blue-300 bg-blue-50'
  },
  { 
    id: 'energyLevels', 
    label: 'Energy Levels', 
    icon: '⚡',
    description: 'Boost daily energy and vitality',
    color: 'border-yellow-300 bg-yellow-50'
  },
  { 
    id: 'mentalHealth', 
    label: 'Mental Health', 
    icon: '🧠',
    description: 'Support emotional well-being and stress management',
    color: 'border-purple-300 bg-purple-50'
  },
  { 
    id: 'relationships', 
    label: 'Relationships', 
    icon: '💕',
    description: 'Navigate changes in personal relationships',
    color: 'border-pink-300 bg-pink-50'
  },
  { 
    id: 'career', 
    label: 'Career & Work', 
    icon: '💼',
    description: 'Maintain professional focus and productivity',
    color: 'border-gray-300 bg-gray-50'
  },
  { 
    id: 'physicalActivity', 
    label: 'Physical Activity', 
    icon: '🏃‍♀️',
    description: 'Stay active and maintain fitness',
    color: 'border-green-300 bg-green-50'
  },
  { 
    id: 'nutrition', 
    label: 'Nutrition', 
    icon: '🥗',
    description: 'Optimize diet for menopause health',
    color: 'border-orange-300 bg-orange-50'
  },
  { 
    id: 'stressManagement', 
    label: 'Stress Management', 
    icon: '🧘‍♀️',
    description: 'Develop healthy coping strategies',
    color: 'border-teal-300 bg-teal-50'
  }
];

export function ConcernsStep({ data, onUpdate, onNext, onPrevious }: ConcernsStepProps) {
  const [customConcern, setCustomConcern] = useState('');

  const handleConcernToggle = (concernId: keyof PersonalConcerns, checked: boolean) => {
    const currentConcerns = data.concerns || {};
    onUpdate({
      concerns: { ...currentConcerns, [concernId]: checked }
    });
  };

  const handleCustomConcernAdd = () => {
    if (customConcern.trim()) {
      const currentConcerns = data.concerns || {};
      const currentCustom = currentConcerns.otherConcerns || [];
      onUpdate({
        concerns: {
          ...currentConcerns,
          otherConcerns: [...currentCustom, customConcern.trim()]
        }
      });
      setCustomConcern('');
    }
  };

  const handleCustomConcernRemove = (index: number) => {
    const currentConcerns = data.concerns || {};
    const currentCustom = currentConcerns.otherConcerns || [];
    onUpdate({
      concerns: {
        ...currentConcerns,
        otherConcerns: currentCustom.filter((_, i) => i !== index)
      }
    });
  };

  const getSelectedConcernsCount = () => {
    const concerns = data.concerns || {};
    const mainCount = Object.keys(CONCERNS).filter(
      key => concerns[key as keyof PersonalConcerns]
    ).length;
    const customCount = concerns.otherConcerns?.length || 0;
    return mainCount + customCount;
  };

  const getSelectedConcerns = () => {
    const concerns = data.concerns || {};
    return CONCERNS.filter(concern => concerns[concern.id as keyof PersonalConcerns]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Concerns & Goals</h2>
        <p className="text-gray-600">
          What areas would you like to focus on during your menopause journey?
        </p>
      </div>

      {/* Selected Count */}
      <div className="text-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {getSelectedConcernsCount()} areas selected
        </Badge>
      </div>

      {/* Main Concerns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCERNS.map((concern) => (
          <Card
            key={concern.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              data.concerns?.[concern.id as keyof PersonalConcerns]
                ? `${concern.color} border-2 ring-2 ring-purple-200`
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handleConcernToggle(
              concern.id as keyof PersonalConcerns, 
              !data.concerns?.[concern.id as keyof PersonalConcerns]
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{concern.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!data.concerns?.[concern.id as keyof PersonalConcerns]}
                      onCheckedChange={(checked) => 
                        handleConcernToggle(concern.id as keyof PersonalConcerns, !!checked)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h3 className="font-semibold text-gray-800">{concern.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{concern.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Concerns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Other Areas of Focus</CardTitle>
          <p className="text-sm text-gray-600">
            Add any other concerns or goals you'd like to address
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={customConcern}
              onChange={(e) => setCustomConcern(e.target.value)}
              placeholder="e.g., spiritual growth, creative pursuits..."
              onKeyPress={(e) => e.key === 'Enter' && handleCustomConcernAdd()}
            />
            <Button
              onClick={handleCustomConcernAdd}
              disabled={!customConcern.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Custom Concerns List */}
          {data.concerns?.otherConcerns && data.concerns.otherConcerns.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.concerns.otherConcerns.map((concern, index) => (
                <Badge key={index} variant="outline" className="flex items-center space-x-1">
                  <span>{concern}</span>
                  <button
                    onClick={() => handleCustomConcernRemove(index)}
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

      {/* Selected Concerns Summary */}
      {getSelectedConcernsCount() > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-purple-800 mb-3">Your Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {getSelectedConcerns().map((concern) => (
                <Badge key={concern.id} variant="secondary" className="text-purple-700">
                  {concern.icon} {concern.label}
                </Badge>
              ))}
              {data.concerns?.otherConcerns?.map((concern, index) => (
                <Badge key={`custom-${index}`} variant="secondary" className="text-purple-700">
                  ✨ {concern}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-800 mb-2">How we'll help you</h3>
          <p className="text-green-700 text-sm">
            Based on your selected areas, we'll provide personalized content, 
            recommendations, and support resources. You can always update your 
            preferences in your profile settings.
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