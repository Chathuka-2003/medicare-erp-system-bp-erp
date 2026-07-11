import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/session";

export default async function UnauthorizedPage() {
  const session = await requireAuth();

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="w-full max-w-xl border-destructive/20 shadow-xl shadow-secondary/10">
        <CardContent className="pt-6">
          <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Access restricted</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your current role, {session.user.role.replaceAll("_", " ")}, is not authorized to open this workspace module.
            Contact a hospital administrator if your responsibilities require this access.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Return to dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Sign in with another account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
