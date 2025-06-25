"use client";

import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import { CommunityEvents } from "./community-events";
import { Recommendations } from "./recommendations";
import { WeatherWidget } from "./weather-widget";
import { SymptomTracker } from "./symptom-tracker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Hello, Welcome Back!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your daily menopause wellness overview.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              <HeartPulse className="mr-2" />
              Track Your Symptoms
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Daily Symptom Check-in</DialogTitle>
              <DialogDescription>
                Log your symptoms to get personalized insights.
              </DialogDescription>
            </DialogHeader>
            <SymptomTracker />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Recommendations />
        </div>
        <div className="space-y-8">
            <WeatherWidget />
            <CommunityEvents />
        </div>
      </div>
    </div>
  );
}
