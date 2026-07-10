import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md border-primary/10 shadow-xl shadow-secondary/10">
        <CardHeader className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <CardTitle>Password recovery</CardTitle>
          <p className="text-sm text-muted-foreground">For data safety, password resets are handled by administrators.</p>
        </CardHeader>
        <CardContent className="space-y-5 text-sm text-muted-foreground">
          <p>Contact your hospital administrator to verify your identity and reset access.</p>
          <Button asChild size="lg" className="w-full">
            <Link href="/login">
              Back to sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
