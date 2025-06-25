"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, X, MessageSquare } from "lucide-react";
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
import { useSymptomStore } from "@/hooks/use-symptom-store";
import { chatWithHistory } from "@/ai/flows/chat-with-history";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const { symptoms } = useSymptomStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const symptomString = JSON.stringify(symptoms);
      
      const result = await chatWithHistory({ question: input, symptoms: symptomString, chatHistory });
      
      const assistantMessage: Message = { role: "assistant", content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error with AI chat:", error);
      const errorMessage: Message = { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-16 h-16 shadow-lg">
            <MessageSquare className="w-8 h-8" />
        </Button>
    )
  }

  return (
    <Card className="w-[380px] h-[550px] shadow-2xl flex flex-col animate-in fade-in-0 zoom-in-95">
      <CardHeader className="flex flex-row items-start bg-secondary">
        <div className="flex items-center space-x-4">
            <Bot className="w-8 h-8 text-primary" />
            <div className="flex-1 space-y-1">
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Ask me anything about menopause.</CardDescription>
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
                {message.role === "assistant" && (
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
            placeholder="Type a message..."
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
