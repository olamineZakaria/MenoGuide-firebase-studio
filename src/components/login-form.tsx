"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call for login
    setTimeout(() => {
      // In a real app, you would handle successful login from your auth provider
      // For now, we'll just set a flag in localStorage
      localStorage.setItem("isLoggedIn", "true");
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          defaultValue="guest@menoguide.com"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
            id="password" 
            type="password" 
            required 
            defaultValue="password"
            disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <LogIn className="mr-2" />
            Log In
          </>
        )}
      </Button>
    </form>
  );
}
