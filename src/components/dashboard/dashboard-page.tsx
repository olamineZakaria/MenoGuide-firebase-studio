"use client";

import { Button } from "@/components/ui/button";
import { HeartPulse, TestTube } from "lucide-react";
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
import { AgentTester } from "../agent-tester";
import { ScrollArea } from "../ui/scroll-area";
import { NutritionCorner } from "./nutrition-corner";
import { CommunityHub } from "./community-hub";

export function DashboardPage({ username }: { username?: string }) {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Hello, {username || "Welcome Back"}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your daily menopause wellness overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TestTube className="mr-2" />
                Test Agents
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>AI Agent Testing Scenarios</DialogTitle>
                <DialogDescription>
                  Use these forms to test the responses of the different AI
                  agents. The dialog is scrollable.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-6">
                <AgentTester />
              </ScrollArea>
            </DialogContent>
          </Dialog>

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
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Recommendations />
        </div>
        <div className="space-y-8">
          <WeatherWidget />
          <NutritionCorner />
          <CommunityHub />
        </div>
      </div>
    </div>
  );
}
