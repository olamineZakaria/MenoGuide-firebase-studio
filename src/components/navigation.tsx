"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { ArrowLeft } from "lucide-react";

interface NavigationProps {
  showBackButton?: boolean;
  backUrl?: string;
  showLogo?: boolean;
}

export function Navigation({ showBackButton = false, backUrl = "/login", showLogo = true }: NavigationProps) {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Link href={backUrl}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        )}
        {showLogo && (
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8 text-purple-600" />
            <span className="font-bold text-xl text-gray-800">MenoGuide</span>
          </Link>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline" size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    </nav>
  );
} 