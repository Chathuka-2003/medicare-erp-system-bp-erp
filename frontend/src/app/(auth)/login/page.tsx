"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-border bg-surface-2 px-12 py-10 text-foreground lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/healthcare-hero-photo.jpg"
          alt="Healthcare professionals using digital hospital technology"
          fill
          priority
          sizes="55vw"
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--surface-1)_0%,var(--primary-light)_100%)] opacity-90" />
        <div className="absolute right-[-8rem] top-[-8rem] size-80 rounded-full bg-primary/10" />
        <div className="absolute bottom-[-10rem] left-[-10rem] size-96 rounded-full bg-primary/8" />
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image src="/medicare-logo.svg" alt="MediCare ERP logo" width={44} height={44} className="rounded-xl" />
          <div>
            <p className="font-semibold">MediCare ERP</p>
            <p className="text-xs text-muted-foreground">Secure care operations</p>
          </div>
        </Link>
        <div className="relative z-10 max-w-xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">MediCare staff workspace</p>
          <h1 className="text-5xl font-bold leading-tight text-primary">Modern healthcare management, simplified.</h1>
          <p className="text-lg text-muted-foreground">Manage patients, staff, appointments, billing, labs, pharmacy, wards, and analytics in one secure role-based workspace.</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3 text-sm text-muted-foreground">
          <div className="rounded-md border border-border bg-card p-4">Role-aware access</div>
          <div className="rounded-md border border-border bg-card p-4">Live operations data</div>
          <div className="rounded-md border border-border bg-card p-4">Protected staff login</div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md rounded-xl border-border p-4 shadow-modal">
          <CardHeader className="space-y-3">
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>MediCare sign in</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access the system.</p>
            </div>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
          <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            New staff member?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Request account access
            </Link>
          </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
