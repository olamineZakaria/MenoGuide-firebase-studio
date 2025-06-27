"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { SignupData, CycleInfo } from "@/lib/types";

interface CycleInfoStepProps {
  data: Partial<SignupData>;
  onUpdate: (updates: Partial<SignupData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function CycleInfoStep({ data, onUpdate, onNext, onPrevious }: CycleInfoStepProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCycleInfoUpdate = (updates: Partial<CycleInfo>) => {
    const currentCycleInfo = data.cycleInfo || {};
    onUpdate({
      cycleInfo: { ...currentCycleInfo, ...updates }
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleCycleInfoUpdate({ lastPeriodDate: date });
    }
    setIsCalendarOpen(false);
  };

  const isFormValid = () => {
    const cycleInfo = data.cycleInfo;
    return cycleInfo?.averageCycleLength && 
           cycleInfo?.periodDuration && 
           cycleInfo?.lastPeriodDate;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cycle Information</h2>
        <p className="text-gray-600">
          Help us track your menstrual cycle for better insights
        </p>
      </div>

      {/* Information Card */}
      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-pink-800 mb-1">Why track your cycle?</h3>
              <p className="text-pink-700 text-sm">
                Understanding your cycle patterns helps us provide personalized insights, 
                predict symptoms, and offer relevant health recommendations. 
                This information is kept private and secure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cycle Length */}
      <div className="space-y-2">
        <Label htmlFor="cycleLength">
          Average Cycle Length (days) *
        </Label>
        <Input
          id="cycleLength"
          type="number"
          min="21"
          max="35"
          value={data.cycleInfo?.averageCycleLength || ''}
          onChange={(e) => handleCycleInfoUpdate({ 
            averageCycleLength: parseInt(e.target.value) || undefined 
          })}
          placeholder="e.g., 28"
          className={!data.cycleInfo?.averageCycleLength ? 'border-red-300' : ''}
        />
        <p className="text-sm text-gray-500">
          Most women have cycles between 21-35 days
        </p>
      </div>

      {/* Period Duration */}
      <div className="space-y-2">
        <Label htmlFor="periodDuration">
          Average Period Duration (days) *
        </Label>
        <Input
          id="periodDuration"
          type="number"
          min="2"
          max="7"
          value={data.cycleInfo?.periodDuration || ''}
          onChange={(e) => handleCycleInfoUpdate({ 
            periodDuration: parseInt(e.target.value) || undefined 
          })}
          placeholder="e.g., 5"
          className={!data.cycleInfo?.periodDuration ? 'border-red-300' : ''}
        />
        <p className="text-sm text-gray-500">
          Most periods last 2-7 days
        </p>
      </div>

      {/* Last Period Date */}
      <div className="space-y-2">
        <Label>Date of Last Period *</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !data.cycleInfo?.lastPeriodDate ? 'border-red-300' : ''
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.cycleInfo?.lastPeriodDate ? (
                format(data.cycleInfo.lastPeriodDate, "PPP")
              ) : (
                <span className="text-gray-500">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.cycleInfo?.lastPeriodDate}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-500">
          This helps us calculate your next expected period
        </p>
      </div>

      {/* Cycle Regularity */}
      <div className="space-y-3">
        <Label>Cycle Regularity</Label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="regularity"
              checked={data.cycleInfo?.isRegular === true}
              onChange={() => handleCycleInfoUpdate({ isRegular: true })}
              className="text-purple-600"
            />
            <span className="text-sm">Regular (consistent cycle length)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="regularity"
              checked={data.cycleInfo?.isRegular === false}
              onChange={() => handleCycleInfoUpdate({ isRegular: false })}
              className="text-purple-600"
            />
            <span className="text-sm">Irregular (varying cycle length)</span>
          </label>
        </div>
      </div>

      {/* Next Period Prediction */}
      {data.cycleInfo?.lastPeriodDate && data.cycleInfo?.averageCycleLength && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-purple-800 mb-2">Next Period Prediction</h3>
            <p className="text-purple-700 text-sm">
              Based on your cycle length of {data.cycleInfo.averageCycleLength} days, 
              your next period is expected around{' '}
              <span className="font-medium">
                {format(
                  new Date(data.cycleInfo.lastPeriodDate.getTime() + 
                    (data.cycleInfo.averageCycleLength * 24 * 60 * 60 * 1000)),
                  "PPP"
                )}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isFormValid()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 