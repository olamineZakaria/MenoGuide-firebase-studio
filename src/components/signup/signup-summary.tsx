"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Activity, 
  Target, 
  Settings, 
  Edit, 
  CheckCircle,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { SignupData } from "@/lib/types";

interface SignupSummaryProps {
  data: SignupData;
  onEdit: (step: number) => void;
  onComplete: () => void;
  isLoading: boolean;
}

export function SignupSummary({ data, onEdit, onComplete, isLoading }: SignupSummaryProps) {
  const getPhaseDisplayName = (phase: string) => {
    switch (phase) {
      case 'pre-menopause': return 'Pre-Menopause';
      case 'peri-menopause': return 'Peri-Menopause';
      case 'post-menopause': return 'Post-Menopause';
      default: return phase;
    }
  };

  const getSelectedSymptoms = () => {
    const symptoms = data.symptoms || {};
    const selected: string[] = [];
    
    Object.entries(symptoms).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value) {
        selected.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      }
    });
    
    return selected;
  };

  const getSelectedConcerns = () => {
    const concerns = data.concerns || {};
    const selected: string[] = [];
    
    Object.entries(concerns).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value) {
        selected.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      }
    });
    
    return selected;
  };

  const getSelectedPreferences = () => {
    const preferences = data.preferences || {};
    const selected: string[] = [];
    
    Object.entries(preferences).forEach(([key, value]) => {
      if (value) {
        selected.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      }
    });
    
    return selected;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Information</h2>
        <p className="text-gray-600">
          Please review all your details before creating your account
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Basic Information</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={data.profileImage ? URL.createObjectURL(data.profileImage) : undefined} />
              <AvatarFallback className="text-xl">
                {data.firstName?.[0]?.toUpperCase()}{data.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {data.firstName} {data.lastName}
              </h3>
              <p className="text-gray-600">{data.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menopause Phase */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Menopause Phase</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {getPhaseDisplayName(data.menopausePhase)}
          </Badge>
        </CardContent>
      </Card>

      {/* Cycle Information (if applicable) */}
      {data.menopausePhase === 'pre-menopause' && data.cycleInfo && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Cycle Information</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Cycle Length:</span> {data.cycleInfo.averageCycleLength} days
              </div>
              <div>
                <span className="font-medium">Period Duration:</span> {data.cycleInfo.periodDuration} days
              </div>
              <div>
                <span className="font-medium">Last Period:</span> {format(data.cycleInfo.lastPeriodDate, "PPP")}
              </div>
              <div>
                <span className="font-medium">Regularity:</span> {data.cycleInfo.isRegular ? 'Regular' : 'Irregular'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptoms */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Symptoms</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getSelectedSymptoms().map((symptom, index) => (
              <Badge key={index} variant="outline">
                {symptom}
              </Badge>
            ))}
            {data.symptoms?.otherSymptoms?.map((symptom, index) => (
              <Badge key={`custom-${index}`} variant="outline">
                {symptom}
              </Badge>
            ))}
            {getSelectedSymptoms().length === 0 && (!data.symptoms?.otherSymptoms || data.symptoms.otherSymptoms.length === 0) && (
              <span className="text-gray-500 italic">No symptoms selected</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Concerns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Personal Concerns & Goals</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(5)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getSelectedConcerns().map((concern, index) => (
              <Badge key={index} variant="outline">
                {concern}
              </Badge>
            ))}
            {data.concerns?.otherConcerns?.map((concern, index) => (
              <Badge key={`custom-${index}`} variant="outline">
                {concern}
              </Badge>
            ))}
            {getSelectedConcerns().length === 0 && (!data.concerns?.otherConcerns || data.concerns.otherConcerns.length === 0) && (
              <span className="text-gray-500 italic">No concerns selected</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Preferences</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(6)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getSelectedPreferences().map((preference, index) => (
              <Badge key={index} variant="secondary">
                {preference}
              </Badge>
            ))}
            {getSelectedPreferences().length === 0 && (
              <span className="text-gray-500 italic">No preferences selected</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Ready to Create Your Account</h3>
              <p className="text-green-700 text-sm">
                All your information looks good! Click the button below to create your 
                personalized MenoGuide account and start your journey.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onComplete}
          disabled={isLoading}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Your Account...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Create My Account
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 