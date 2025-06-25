"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { SymptomData } from "@/lib/types";
import { useSymptomStore } from "@/hooks/use-symptom-store";

const symptomSchema = z.object({
  mood: z.string().min(1, "Mood is required."),
  sleepQuality: z.string().min(1, "Sleep quality is required."),
  hotFlashes: z.string().min(1, "Hot flashes severity is required."),
  otherSymptoms: z.string().optional(),
});

export function SymptomTracker() {
  const { symptoms, setSymptoms } = useSymptomStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof symptomSchema>>({
    resolver: zodResolver(symptomSchema),
    defaultValues: symptoms,
  });

  function onSubmit(values: z.infer<typeof symptomSchema>) {
    setSymptoms(values as SymptomData);
    toast({
      title: "Symptoms Saved",
      description: "Your daily symptoms have been successfully logged.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mood</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How are you feeling?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="great">Great</SelectItem>
                  <SelectItem value="okay">Okay</SelectItem>
                  <SelectItem value="meh">Meh</SelectItem>
                  <SelectItem value="bad">Bad</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sleepQuality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Quality</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How did you sleep?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hotFlashes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hot Flashes</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How were your hot flashes?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otherSymptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Symptoms</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other symptoms to note?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save Symptoms
        </Button>
      </form>
    </Form>
  );
}
