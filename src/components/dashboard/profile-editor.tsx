"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/hooks/use-profile-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const profileSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  dietaryPreferences: z.string().optional(),
  menopauseNotes: z.string().optional(),
});

export function ProfileEditor({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { profile, setProfile } = useProfileStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const avatarUrl = form.watch("avatarUrl");

  function onSubmit(values: z.infer<typeof profileSchema>) {
    setProfile(values);
    toast({
      title: "Profile Saved",
      description: "Your profile has been successfully updated.",
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={profile.username} data-ai-hint="profile picture" />
            <AvatarFallback>{profile.username ? profile.username.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
              <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" {...field} />
                  </FormControl>
                    <FormDescription>
                    Enter a URL for your profile picture.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="dietaryPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preferences</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Vegetarian, Gluten-Free" {...field} />
              </FormControl>
                <FormDescription>
                This helps tailor nutrition advice for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="menopauseNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>My Menopause Journey</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share any details that might be helpful for personalizing your experience."
                  {...field}
                  rows={4}
                />
              </FormControl>
                <FormDescription>
                Notes about your symptoms, triggers, or what you've found helpful.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
