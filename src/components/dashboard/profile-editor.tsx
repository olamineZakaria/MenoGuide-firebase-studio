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
import Image from "next/image";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  dietaryPreferences: z.string().optional(),
  menopauseNotes: z.string().optional(),
});

const avatarOptions = [
    { id: 'avatar1', url: 'https://placehold.co/100x100/D0A9F5/ffffff.png' },
    { id: 'avatar2', url: 'https://placehold.co/100x100/A9B4F5/ffffff.png' },
    { id: 'avatar3', url: 'https://placehold.co/100x100/f5a7a7/ffffff.png' },
    { id: 'avatar4', url: 'https://placehold.co/100x100/a7f5d1/ffffff.png' },
    { id: 'avatar5', url: 'https://placehold.co/100x100/F5D0A9/ffffff.png' },
    { id: 'avatar6', url: 'https://placehold.co/100x100/A9D8F5/ffffff.png' },
];

export function ProfileEditor({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { profile, setProfile } = useProfileStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const avatarUrl = form.watch("avatarUrl");
  const username = form.watch("username");

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
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback>{username ? username.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <FormLabel>Choose your avatar</FormLabel>
                    <div className="grid grid-cols-6 gap-2">
                    {avatarOptions.map((avatar) => (
                        <button
                        key={avatar.id}
                        type="button"
                        onClick={() => form.setValue("avatarUrl", avatar.url, { shouldDirty: true })}
                        className={cn(
                            "rounded-full p-1 transition-all",
                            avatarUrl === avatar.url
                            ? "ring-2 ring-offset-2 ring-primary"
                            : "ring-1 ring-transparent hover:ring-primary/50"
                        )}
                        >
                        <Image
                            src={avatar.url}
                            alt={`Avatar option ${avatar.id}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                            data-ai-hint="cute avatar"
                        />
                        </button>
                    ))}
                    </div>
                </div>
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
