"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";
import { Logo } from "@/components/icons";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // In a real app, you'd have a more robust auth check, e.g., checking a token.
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
    if (!loggedIn) {
      router.replace("/login");
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <Logo className="h-12 w-12 text-primary animate-pulse" />
        <p className="text-muted-foreground">Loading MenoGuide+...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting...
  }

  return <DashboardClient />;
}
