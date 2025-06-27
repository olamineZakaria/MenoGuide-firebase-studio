"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Users, Shield, CheckCircle } from "lucide-react";
import { SignupData } from "@/lib/types";

interface PreferencesStepProps {
  data: Partial<SignupData>;
  onUpdate: (updates: Partial<SignupData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PREFERENCES = [
  {
    id: 'notifications',
    label: 'Push Notifications',
    description: 'Receive reminders and updates on your device',
    icon: Bell,
    color: 'text-blue-600'
  },
  {
    id: 'emailUpdates',
    label: 'Email Updates',
    description: 'Get weekly insights and personalized recommendations',
    icon: Mail,
    color: 'text-green-600'
  },
  {
    id: 'communityAccess',
    label: 'Community Access',
    description: 'Connect with other women in similar situations',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    id: 'dataSharing',
    label: 'Data Sharing',
    description: 'Help improve our services (anonymized data only)',
    icon: Shield,
    color: 'text-orange-600'
  }
];

export function PreferencesStep({ data, onUpdate, onNext, onPrevious }: PreferencesStepProps) {
  const handlePreferenceToggle = (preferenceId: keyof SignupData['preferences'], checked: boolean) => {
    const currentPreferences = data.preferences || {};
    onUpdate({
      preferences: { ...currentPreferences, [preferenceId]: checked }
    });
  };

  const getSelectedPreferencesCount = () => {
    const preferences = data.preferences || {};
    return Object.values(preferences).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customize Your Experience</h2>
        <p className="text-gray-600">
          Choose how you'd like to interact with MenoGuide
        </p>
      </div>

      {/* Selected Count */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">
            {getSelectedPreferencesCount()} preferences selected
          </span>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREFERENCES.map((preference) => {
          const IconComponent = preference.icon;
          return (
            <Card
              key={preference.id}
              className={`transition-all duration-200 hover:shadow-lg ${
                data.preferences?.[preference.id as keyof SignupData['preferences']]
                  ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${preference.color} p-2 rounded-lg bg-white shadow-sm`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{preference.label}</h3>
                      <Switch
                        checked={!!data.preferences?.[preference.id as keyof SignupData['preferences']]}
                        onCheckedChange={(checked) => 
                          handlePreferenceToggle(
                            preference.id as keyof SignupData['preferences'], 
                            checked
                          )
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-600">{preference.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Privacy Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Data Protection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-700">
          <p className="text-sm">
            Your privacy is our top priority. Here's how we protect your data:
          </p>
          <ul className="text-sm space-y-1">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>All personal health data is encrypted and stored securely</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>We never share your personal information with third parties</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>You can change these preferences anytime in your settings</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Data sharing for research is always anonymized and optional</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* What You'll Get */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">What You'll Receive</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-green-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>With Notifications</span>
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Daily symptom check-ins</li>
                <li>• Medication reminders</li>
                <li>• Cycle tracking alerts</li>
                <li>• Wellness tips</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>With Email Updates</span>
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Weekly health insights</li>
                <li>• Personalized recommendations</li>
                <li>• New feature announcements</li>
                <li>• Community highlights</li>
              </ul>
            </div>
          </div>
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
          Review & Complete
        </Button>
      </div>
    </div>
  );
} 