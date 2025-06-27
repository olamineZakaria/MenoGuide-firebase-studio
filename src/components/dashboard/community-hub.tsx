
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

interface Reply {
    author: string;
    authorInitial: string;
    content: string;
    timestamp: string;
}

interface Discussion {
    id: number;
    title: string;
    category: string;
    author: string;
    authorInitial: string;
    repliesCount: number;
    lastReply: string;
    replies: Reply[];
}

const initialDiscussions: Discussion[] = [
    {
        id: 1,
        title: "What are your go-to remedies for hot flashes?",
        category: "Symptom Management",
        author: "Sarah J.",
        authorInitial: "SJ",
        repliesCount: 2,
        lastReply: "2h ago",
        replies: [
            { author: "Maria G.", authorInitial: "MG", content: "I've found that dressing in layers helps a lot!", timestamp: "4h ago" },
            { author: "Chloe T.", authorInitial: "CT", content: "Black cohosh supplements have been a game-changer for me, but check with your doctor first.", timestamp: "3h ago" },
        ]
    },
    {
        id: 2,
        title: "Feeling so much brain fog at work lately. Any tips?",
        category: "Work & Life",
        author: "Maria G.",
        authorInitial: "MG",
        repliesCount: 1,
        lastReply: "5h ago",
        replies: [
             { author: "Sarah J.", authorInitial: "SJ", content: "I feel you! I started doing puzzles during my lunch break and it seems to help sharpen my focus.", timestamp: "6h ago" },
        ]
    },
    {
        id: 3,
        title: "Share your favorite menopause-friendly recipes!",
        category: "Nutrition",
        author: "Chloe T.",
        authorInitial: "CT",
        repliesCount: 0,
        lastReply: "1d ago",
        replies: []
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

const categories = ["Symptom Management", "Nutrition", "Work & Life", "Fitness", "Mental Wellness"];

export function CommunityHub() {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [isNewTopicDialogOpen, setIsNewTopicDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newReply, setNewReply] = useState("");

  const handleNewDiscussionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTopicTitle && newTopicCategory) {
      const newDiscussion = {
        id: discussions.length + 1,
        title: newTopicTitle,
        category: newTopicCategory,
        author: "Jane D.", // Placeholder for current user
        repliesCount: 0,
        lastReply: "Just now",
        authorInitial: "JD",
        replies: [],
      };
      setDiscussions([newDiscussion, ...discussions]);
      setIsNewTopicDialogOpen(false);
      setNewTopicTitle("");
      setNewTopicCategory("");
    }
  };

  const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newReply.trim() || !selectedDiscussion) return;

    const reply: Reply = {
      author: "Jane D.", // Placeholder
      authorInitial: "JD",
      content: newReply,
      timestamp: "Just now"
    };

    const updatedDiscussions = discussions.map(d => {
      if (d.id === selectedDiscussion.id) {
        const updatedReplies = [...d.replies, reply];
        return {
          ...d,
          replies: updatedReplies,
          repliesCount: updatedReplies.length,
          lastReply: "Just now"
        };
      }
      return d;
    });

    setDiscussions(updatedDiscussions);
    setSelectedDiscussion(prev => prev ? { ...prev, replies: [...prev.replies, reply], repliesCount: prev.replies.length + 1 } : null);
    setNewReply("");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2"><Users /> Community Hub</CardTitle>
            <CardDescription>Connect, learn, and grow with others.</CardDescription>
          </div>
          <Dialog open={isNewTopicDialogOpen} onOpenChange={setIsNewTopicDialogOpen}>
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
              <form onSubmit={handleNewDiscussionSubmit} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} placeholder="What's on your mind?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required onValueChange={setNewTopicCategory} value={newTopicCategory}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                     </SelectTrigger>
                     <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                     </SelectContent>
                  </Select>
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
            <TabsContent value="discussions" className="mt-4 space-y-2">
                {discussions.map((discussion) => (
                    <div key={discussion.id} onClick={() => setSelectedDiscussion(discussion)} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
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
                                <span>{discussion.repliesCount} replies</span>
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

      {selectedDiscussion && (
        <Dialog open={!!selectedDiscussion} onOpenChange={(isOpen) => !isOpen && setSelectedDiscussion(null)}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{selectedDiscussion.title}</DialogTitle>
                    <DialogDescription>
                        A discussion started by {selectedDiscussion.author} in <Badge variant="secondary">{selectedDiscussion.category}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-64 pr-6 -mr-6">
                    <div className="space-y-4">
                        {selectedDiscussion.replies.map((reply, index) => (
                             <div key={index} className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={reply.author} data-ai-hint="profile picture" />
                                    <AvatarFallback>{reply.authorInitial}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 rounded-lg bg-muted p-3 text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold">{reply.author}</p>
                                        <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                                    </div>
                                    <p className="text-muted-foreground">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                        {selectedDiscussion.replies.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-8">Be the first to reply!</p>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter className="flex-col items-stretch">
                    <form onSubmit={handleReplySubmit} className="flex flex-col gap-2">
                        <Label htmlFor="reply-text" className="sr-only">Your Reply</Label>
                        <Textarea id="reply-text" placeholder="Write your reply..." value={newReply} onChange={(e) => setNewReply(e.target.value)} required />
                        <Button type="submit">Post Reply</Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
