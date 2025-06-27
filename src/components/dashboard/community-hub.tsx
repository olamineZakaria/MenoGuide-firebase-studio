"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Users, MessageSquare, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialDiscussions = [
    {
        title: "What are your go-to remedies for hot flashes?",
        category: "Symptom Management",
        author: "Sarah J.",
        replies: 12,
        lastReply: "2h ago",
        authorInitial: "SJ",
    },
    {
        title: "Feeling so much brain fog at work lately. Any tips?",
        category: "Work & Life",
        author: "Maria G.",
        replies: 8,
        lastReply: "5h ago",
        authorInitial: "MG",
    },
    {
        title: "Share your favorite menopause-friendly recipes!",
        category: "Nutrition",
        author: "Chloe T.",
        replies: 25,
        lastReply: "1d ago",
        authorInitial: "CT",
    }
];

const events = [
  {
    title: "Mindful Menopause Workshop",
    date: "October 26, 2024",
    description: "Join us for a workshop on mindfulness techniques to manage stress.",
    imageHint: "workshop yoga"
  },
  {
    title: "Nutrition for Menopause Webinar",
    date: "November 12, 2024",
    description: "Learn about the best foods to support your body during menopause.",
    imageHint: "healthy food"
  },
  {
    title: "Local Meetup: Walk & Talk",
    date: "November 18, 2024",
    description: "Connect with others in your community for a refreshing walk.",
    imageHint: "women walking"
  },
];

export function CommunityHub() {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewDiscussion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;

    if (title && category) {
      const newDiscussion = {
        title,
        category,
        author: "Jane D.", // Placeholder for current user
        replies: 0,
        lastReply: "Just now",
        authorInitial: "JD",
      };
      setDiscussions([newDiscussion, ...discussions]);
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2"><Users /> Community Hub</CardTitle>
            <CardDescription>Connect, learn, and grow with others.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <PlusCircle className="mr-2" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>
                  Share your thoughts or questions with the community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewDiscussion} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" name="title" className="col-span-3" placeholder="What's on your mind?" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" name="category" className="col-span-3" placeholder="e.g., Symptom Management" required />
                </div>
                 <DialogFooter>
                  <Button type="submit">Post Topic</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="discussions" className="mt-4 space-y-4">
                {discussions.map((discussion, index) => (
                    <div key={index} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png`} alt={discussion.author} data-ai-hint="profile picture" />
                            <AvatarFallback>{discussion.authorInitial}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold text-sm leading-tight">{discussion.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                By {discussion.author} in <Badge variant="secondary" className="font-normal">{discussion.category}</Badge>
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <MessageSquare className="w-3 h-3"/>
                                <span>{discussion.replies} replies</span>
                                <span>&middot;</span>
                                <span>Last reply {discussion.lastReply}</span>
                            </div>
                        </div>
                        <div className="flex items-center h-full">
                             <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </TabsContent>
            <TabsContent value="events" className="mt-4">
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={index} className="flex items-start gap-4 group cursor-pointer">
                            <Image src={`https://placehold.co/200x200.png`} alt={event.title} width={80} height={80} className="rounded-lg object-cover" data-ai-hint={event.imageHint} />
                        <div className="flex-1">
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                            <p className="text-sm mt-1">{event.description}</p>
                            <Button variant="link" className="p-0 h-auto text-sm mt-1">
                                Learn More <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
