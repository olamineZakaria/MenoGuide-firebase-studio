"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import { SignupData, PasswordStrength } from "@/lib/types";
import { SignupService } from "@/lib/signup-service";

interface BasicInfoStepProps {
  data: Partial<SignupData>;
  onUpdate: (updates: Partial<SignupData>) => void;
  onNext: () => void;
}

export function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof SignupData, value: string) => {
    onUpdate({ [field]: value });

    // Real-time validation
    if (field === 'email') {
      const validation = SignupService.validateEmail(value);
      setEmailError(validation.isValid ? null : validation.errors[0]);
    }

    if (field === 'password') {
      setPasswordStrength(SignupService.evaluatePasswordStrength(value));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Optimize image
      const optimizedFile = await SignupService.optimizeProfileImage(file);
      onUpdate({ profileImage: optimizedFile });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(optimizedFile);
    } catch (error) {
      console.error('Failed to process image:', error);
    }
  };

  const removeImage = () => {
    onUpdate({ profileImage: undefined });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with your personal details</p>
      </div>

      {/* Profile Image Upload */}
      <div className="flex justify-center">
        <Card className="w-32 h-32 relative">
          <CardContent className="p-0 h-full">
            <div className="relative w-full h-full">
              <Avatar className="w-full h-full">
                <AvatarImage src={imagePreview || undefined} />
                <AvatarFallback className="text-2xl">
                  {data.firstName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {!imagePreview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              )}
              
              {imagePreview && (
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {!imagePreview && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Profile Photo
          </Button>
          <p className="text-sm text-gray-500 mt-2">Optional - We'll optimize it for you</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={data.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            className={!data.firstName ? 'border-red-300' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            className={!data.lastName ? 'border-red-300' : ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your.email@example.com"
          className={emailError ? 'border-red-300' : ''}
        />
        {emailError && (
          <p className="text-sm text-red-600">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={data.password || ''}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Create a strong password"
          className={!data.password ? 'border-red-300' : ''}
        />
        
        {/* Password Strength Indicator */}
        {passwordStrength && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Password Strength:</span>
              <span className={`text-sm font-medium ${
                passwordStrength.isStrong ? 'text-green-600' : 'text-orange-600'
              }`}>
                {getPasswordStrengthText(passwordStrength.score)}
              </span>
            </div>
            
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    level <= passwordStrength.score
                      ? getPasswordStrengthColor(passwordStrength.score)
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            {passwordStrength.feedback.length > 0 && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">To improve your password:</p>
                <ul className="list-disc list-inside space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index}>{feedback}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!data.firstName || !data.lastName || !data.email || !data.password || !!emailError}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 