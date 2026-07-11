"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Lock, Mail, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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

  // Quick fill helper for developers / testing
  const handleQuickFill = (role: string) => {
    if (role === "admin") {
      setEmail("admin@medicare.com");
      setPassword("admin123");
    } else if (role === "doctor") {
      setEmail("doctor@medicare.com");
      setPassword("doctor123");
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Visual Branding Section */}
      <section className="relative hidden overflow-hidden bg-slate-900 text-white lg:flex lg:flex-col lg:justify-between px-16 py-12">
        <Image
          src="/healthcare-hero-photo.jpg"
          alt="Healthcare professionals using digital hospital technology"
          fill
          priority
          sizes="55vw"
          className="object-cover opacity-15 mix-blend-luminosity"
        />
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900/40 opacity-95" />
        <div className="absolute -right-20 -top-20 size-[450px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 size-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
        
        {/* Header Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Image src="/medicare-logo.svg" alt="MediCare ERP logo" width={28} height={28} />
          </div>
          <div>
            <p className="font-extrabold tracking-tight text-white text-base">MediCare ERP</p>
            <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-widest">Sri Lanka Operations</p>
          </div>
        </Link>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Operational Workspace v2.0
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
            Smart clinical decisions start here.
          </h1>
          <p className="text-base text-slate-300 leading-relaxed font-medium">
            MediCare ERP unifies scheduling, electronic health records, automated ward bed control, real-time pharmacy supply tracking, and invoice claims in one responsive dashboard.
          </p>
        </div>

        {/* Bottom Feature cards */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { title: "Role-aware Security", desc: "Granular RBAC access control" },
            { title: "Real-time Audits", desc: "Automated logging workflows" },
            { title: "Clinical Standards", desc: "HIPAA structured EMR format" }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md shadow-inner space-y-1">
              <p className="text-xs font-bold text-indigo-200">{item.title}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Access Login Form Section */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 bg-slate-50/50">
        <Card className="w-full max-w-[430px] rounded-3xl border border-slate-100 p-5 sm:p-7 shadow-lg bg-white">
          <CardHeader className="space-y-4 p-0 pb-6">
            <div className="flex justify-between items-center">
              <Button asChild variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-slate-800 rounded-xl">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Home
                </Link>
              </Button>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Entry</span>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-black tracking-tight text-slate-800">Welcome Back</CardTitle>
              <CardDescription className="text-xs text-slate-400 font-semibold mt-1">
                Authorized staff sign-in for medical operations.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@medicare.com"
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-primary shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-primary shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-150 p-3 text-xs text-red-700 font-semibold">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 rounded-xl font-bold tracking-wide shadow-md shadow-primary/20" size="lg" disabled={loading}>
                {loading ? "Verifying Credentials..." : "Sign In to Workspace"}
                {!loading && <ArrowRight className="h-4 w-4 ml-1.5" />}
              </Button>
            </form>

            {/* Quick Demo Assist Credentials section for Developer testing usability */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Dev Account Access</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleQuickFill("admin")}
                  className="flex-1 text-[10px] font-bold text-slate-650 bg-slate-50 border border-slate-150 py-1.5 rounded-lg hover:bg-slate-100/60 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle className="h-3 w-3 text-emerald-500" /> Admin Access
                </button>
                <button 
                  onClick={() => handleQuickFill("doctor")}
                  className="flex-1 text-[10px] font-bold text-slate-650 bg-slate-50 border border-slate-150 py-1.5 rounded-lg hover:bg-slate-100/60 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle className="h-3 w-3 text-indigo-500" /> Doctor Access
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-500 text-center leading-normal">
              New staff member?{" "}
              <Link href="/register" className="font-extrabold text-primary hover:underline">
                Request Account Access
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
