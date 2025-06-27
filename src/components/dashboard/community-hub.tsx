"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Users, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

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

const discussions = [
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


export function CommunityHub() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users /> Community Hub</CardTitle>
        <CardDescription>Connect, learn, and grow with others.</CardDescription>
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
