import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-2xl overflow-hidden border-primary/10 shadow-xl shadow-secondary/10">
        <CardHeader className="border-b bg-muted/40">
          <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <CardTitle>Request account access</CardTitle>
          <p className="text-sm text-muted-foreground">Staff accounts are provisioned by an administrator to protect clinical data.</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
              <p className="font-medium">Verified roles only</p>
              <p className="mt-1 text-sm text-muted-foreground">Ask your hospital administrator or HR manager to create your profile.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <Activity className="mb-3 h-5 w-5 text-primary" />
              <p className="font-medium">Secure onboarding</p>
              <p className="mt-1 text-sm text-muted-foreground">Your permissions are assigned from your department and operational role.</p>
            </div>
          </div>
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
