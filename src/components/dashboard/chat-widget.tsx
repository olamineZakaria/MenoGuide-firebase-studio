"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCoachingResponse } from "@/ai/flows/life-coach-flow";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "coach";
  content: string;
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', content: "Welcome! I'm here to listen. What's on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const historyForPrompt = messages;
    setInput("");
    setIsLoading(true);

    try {
      const historyString = historyForPrompt
        .map(msg => `${msg.role === 'coach' ? 'Coach' : 'User'}: ${msg.content}`)
        .join('\n');
      
      const result = await getCoachingResponse({ userStatement: input, chatHistory: historyString });
      
      const coachMessage: Message = { role: "coach", content: result.coachResponse };
      setMessages((prev) => [...prev, coachMessage]);
    } catch (error)
 {
      console.error("Error with Life Coach:", error);
      const errorMessage: Message = { role: "coach", content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-16 h-16 shadow-lg">
            <Sparkles className="w-8 h-8" />
        </Button>
    )
  }

  return (
    <Card className="w-[380px] h-[550px] shadow-2xl flex flex-col animate-in fade-in-0 zoom-in-95">
      <CardHeader className="flex flex-row items-start bg-secondary">
        <div className="flex items-center space-x-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <div className="flex-1 space-y-1">
            <CardTitle>Life Coach</CardTitle>
            <CardDescription>Ready to talk? I&apos;m here to listen.</CardDescription>
            </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[350px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                {message.role === "coach" && (
                  <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                 {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                     <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 text-sm bg-muted">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
