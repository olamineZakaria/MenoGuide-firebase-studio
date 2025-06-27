import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
            <Logo className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold font-headline">Welcome to MenoGuide+</h1>
            <p className="text-muted-foreground">Your personal guide through menopause.</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
            </Link>
        </p>
      </div>
    </div>
  );
}
