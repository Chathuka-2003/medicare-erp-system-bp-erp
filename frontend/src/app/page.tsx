"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  ClipboardPlus,
  FlaskConical,
  LockKeyhole,
  Pill,
  Phone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  MessageSquare,
  Sun,
  Moon,
  Shield,
  Activity,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const modules = [
  { label: "Appointments", icon: CalendarCheck, detail: "Queue, schedule, and doctor availability in one view.", bgClass: "bg-blue-500/10 text-blue-550 border-blue-200/50 hover:border-blue-400" },
  { label: "EMR", icon: ClipboardPlus, detail: "Structured patient records for doctors and nurses.", bgClass: "bg-indigo-500/10 text-indigo-550 border-indigo-200/50 hover:border-indigo-400" },
  { label: "Billing", icon: ReceiptText, detail: "Invoices, payments, and insurance workflows.", bgClass: "bg-emerald-500/10 text-emerald-550 border-emerald-200/50 hover:border-emerald-400" },
  { label: "Pharmacy", icon: Pill, detail: "Medicine stock, dispensing, and reorder visibility.", bgClass: "bg-purple-500/10 text-purple-550 border-purple-200/50 hover:border-purple-400" },
  { label: "Laboratory", icon: FlaskConical, detail: "Lab tests, orders, results, and technician worklists.", bgClass: "bg-pink-500/10 text-pink-550 border-pink-200/50 hover:border-pink-400" },
  { label: "Wards", icon: BedDouble, detail: "Admissions, beds, discharge, and ward capacity.", bgClass: "bg-amber-500/10 text-amber-550 border-amber-200/50 hover:border-amber-400" },
];

const strengths = [
  { text: "Role-aware staff access", bg: "bg-blue-500/5 dark:bg-white/5 border-blue-150 dark:border-white/5 text-blue-700 dark:text-slate-300" },
  { text: "Unified clinical operations", bg: "bg-indigo-500/5 dark:bg-white/5 border-indigo-150 dark:border-white/5 text-indigo-700 dark:text-slate-300" },
  { text: "Real-time finance and stock signals", bg: "bg-emerald-500/5 dark:bg-white/5 border-emerald-150 dark:border-white/5 text-emerald-700 dark:text-slate-300" },
];

const metrics = [
  { label: "Care modules", value: "12+", color: "text-indigo-650 dark:text-indigo-400" },
  { label: "Staff roles", value: "11", color: "text-emerald-650 dark:text-emerald-400" },
  { label: "Support", value: "24/7", color: "text-blue-650 dark:text-blue-400" },
];

const contactNumberDisplay = "+94 77 052 2297";
const contactNumberRaw = "+94770522297";
const whatsappLink = `https://wa.me/${contactNumberRaw.replace("+", "")}`;
const googleMapLink = "https://maps.google.com/?q=Galle+Road,+Colombo+03,+Sri+Lanka";
const embeddedMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.912644265147!2d79.8465!3d6.9038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2594242e23b83%3A0xc4a383d47bf1b250!2sGalle%20Rd%2C%20Colombo%2003!5e0!3m2!1sen!2slk!4v1680000000000!5m2!1sen!2slk";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = mounted ? theme : "light";

  return (
    <main className={cn(
      "min-h-screen flex flex-col transition-colors duration-300 selection:bg-indigo-500 selection:text-white",
      currentTheme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50/50 text-slate-800"
    )}>
      {/* Hero Section */}
      <section className={cn(
        "relative min-h-[95vh] overflow-hidden flex flex-col justify-between border-b transition-colors duration-300",
        currentTheme === "dark" ? "bg-slate-950 border-slate-800" : "bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 border-indigo-100"
      )}>
        <Image
          src="/healthcare-hero-photo.jpg"
          alt="Healthcare professionals using digital hospital technology"
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-300 animate-pulse",
            currentTheme === "dark" ? "opacity-15 mix-blend-luminosity" : "opacity-[0.06] mix-blend-multiply"
          )}
          style={{ animationDuration: "8s" }}
        />
        
        {/* Modern Gradients */}
        <div className={cn(
          "absolute inset-0 transition-colors duration-300",
          currentTheme === "dark" 
            ? "bg-gradient-to-tr from-slate-955 via-slate-900/90 to-indigo-950/40" 
            : "bg-gradient-to-tr from-transparent via-white/50 to-transparent"
        )} />
        <div className="absolute -right-20 -top-20 size-[500px] rounded-full bg-indigo-500/15 blur-3xl animate-bounce pointer-events-none" style={{ animationDuration: "12s" }} />
        <div className="absolute -bottom-24 -left-20 size-[600px] rounded-full bg-blue-500/10 blur-3xl animate-bounce pointer-events-none" style={{ animationDuration: "15s" }} />
        
        <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10 border-b backdrop-blur-md border-white/5 bg-slate-950/80 text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center border border-white/20 bg-white/10 shadow-sm overflow-hidden">
              <div className="p-1 flex items-center justify-center">
                <Image src="/medicare-logo.svg" alt="MediCare ERP logo" width={28} height={28} />
              </div>
            </div>
            <span>
              <span className="block font-black tracking-tight text-white">MediCare ERP</span>
              <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Sri Lanka Operations</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-xl transition-colors h-10 w-10 shrink-0 text-amber-400 hover:bg-white/10 border border-white/10 bg-white/5 shadow-sm"
              title="Toggle theme mode"
            >
              {currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <a href={`tel:${contactNumberRaw}`} className="hidden items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all md:flex border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 shadow-sm">
              <Phone className="h-3.5 w-3.5 text-indigo-600" />
              {contactNumberDisplay}
            </a>
            
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-650 backdrop-blur transition-all hover:bg-emerald-500/20 md:flex">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
              WhatsApp
            </a>
            
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/10">
              <Link href="/register">Request access</Link>
            </Button>
            
            <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-650/20 rounded-xl px-5">
              <Link href="/login">
                Sign in
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </nav>
        </header>

        <div className="relative z-10 grid min-h-[calc(95vh-88px)] items-center gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 max-w-7xl mx-auto w-full">
          <div className="space-y-8 animate-fade-in-up">
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold backdrop-blur-sm shadow-sm",
              currentTheme === "dark" ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300" : "border-indigo-200 bg-indigo-50 text-indigo-750"
            )}>
              <LockKeyhole className="h-3.5 w-3.5" />
              Secure MediCare operations workspace
            </div>
            <h1 className={cn("max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl", currentTheme === "dark" ? "text-white" : "text-slate-800")}>
              Modern hospital ERP for Sri Lankan care teams.
            </h1>
            <p className={cn("max-w-2xl text-lg leading-relaxed font-medium", currentTheme === "dark" ? "text-slate-350" : "text-slate-650")}>
              MediCare ERP connects appointments, patient records, EMR, billing, pharmacy, laboratory, wards, inventory, and staff operations in one secure theme-customizable dashboard.
            </p>
            
            <div className="flex flex-wrap gap-3.5">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-6 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-transform hover:-translate-y-0.5">
                <Link href="/login">
                  Go to MediCare login
                  <ArrowRight className="h-4.5 w-4.5 ml-1.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={cn(
                "h-12 px-6 rounded-xl font-bold transition-transform hover:-translate-y-0.5 shadow-sm",
                currentTheme === "dark" ? "border-slate-700 hover:bg-white/5 text-slate-200" : "border-indigo-200 bg-white hover:bg-indigo-50/50 text-indigo-750"
              )}>
                <Link href="/register">Create access request</Link>
              </Button>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white h-12 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-emerald-600/20 transition-transform hover:-translate-y-0.5">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-5 w-5" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <a href={`tel:${contactNumberRaw}`} className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 backdrop-blur transition-all shadow-sm",
                currentTheme === "dark" ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-indigo-100 bg-white text-slate-700 hover:bg-indigo-50"
              )}>
                <Phone className="h-3.5 w-3.5 text-indigo-600" />
                Sri Lanka: {contactNumberDisplay}
              </a>
              <span className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 backdrop-blur shadow-sm",
                currentTheme === "dark" ? "border-white/5 bg-white/5" : "border-indigo-100 bg-white text-slate-700"
              )}>
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-650" />
                HIPAA-minded access design
              </span>
            </div>
            
            <div className="grid max-w-2xl gap-4 sm:grid-cols-3 pt-4">
              {strengths.map((item) => (
                <div key={item.text} className={cn(
                  "flex items-start gap-2.5 rounded-2xl border p-4 text-xs font-bold backdrop-blur shadow-sm transition-transform hover:-translate-y-0.5 duration-200",
                  currentTheme === "dark" ? "border-white/5 bg-white/5 text-slate-300" : item.bg
                )}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="leading-normal">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:block animate-fade-in-right">
            <div className={cn(
              "relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl",
              currentTheme === "dark" ? "border-white/5 bg-slate-900/80" : "border-indigo-100 bg-white/95"
            )}>
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Live Command Center</p>
                  <p className="mt-1 text-xs text-slate-400 font-semibold">MediCare Operational Pulse</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-650 border border-indigo-500/20">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="relative mt-6 grid gap-4">
                {[
                  { label: "Today appointments", value: "128", icon: CalendarCheck, color: "text-blue-600 bg-blue-50 border-blue-200 shadow-blue-100/50" },
                  { label: "Available beds", value: "34", icon: BedDouble, color: "text-emerald-600 bg-emerald-50 border-emerald-200 shadow-emerald-100/50" },
                  { label: "Revenue collected", value: "LKR 4.8M", icon: TrendingUp, color: "text-amber-600 bg-amber-50 border-amber-200 shadow-amber-100/50" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={cn(
                      "flex items-center justify-between rounded-2xl border p-4 transition-transform hover:scale-[1.02] duration-250 shadow-sm",
                      currentTheme === "dark" ? "border-white/5 bg-slate-950/40" : "border-indigo-50 bg-white"
                    )}>
                      <div className="flex items-center gap-3">
                        <span className={`flex size-10 items-center justify-center rounded-xl shrink-0 border ${item.color} shadow-sm`}>
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="text-xs text-slate-450 font-bold">{item.label}</span>
                      </div>
                      <span className="text-base font-black">{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-6 grid grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className={cn(
                    "rounded-2xl border p-3.5 text-center shadow-md",
                    currentTheme === "dark" ? "border-white/5 bg-slate-950/60" : "border-indigo-50 bg-white"
                  )}>
                    <p className={cn("text-lg font-black", currentTheme === "dark" ? "text-white" : metric.color)}>{metric.value}</p>
                    <p className="mt-1 text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Banner */}
      <section className={cn(
        "py-10 border-b transition-colors duration-300",
        currentTheme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Shield, title: "Data Protection", desc: "Full encryption for clinical health records" },
            { icon: Activity, title: "System Uptime", desc: "99.9% reliable cloud servers availability" },
            { icon: HeartPulse, title: "Standard Care", desc: "Designed to conform to Sri Lanka healthcare standards" }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col items-center space-y-2 max-w-[280px] mx-auto">
                <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Connected Modules Section */}
      <section className={cn(
        "px-6 py-20 lg:px-10 border-b transition-colors duration-300",
        currentTheme === "dark" ? "bg-slate-950/50 border-slate-900" : "bg-indigo-50/20 border-indigo-100"
      )}>
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-650">Connected modules</p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Everything your hospital team opens every day.</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500 font-semibold">
              A focused operating layer for administrators, clinicians, finance teams, lab teams, pharmacy staff, and ward coordinators.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.label} className={cn(
                  "group rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
                  currentTheme === "dark" 
                    ? "border-white/5 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/20" 
                    : "border-indigo-150 bg-white hover:bg-slate-50 hover:border-indigo-300 shadow-md shadow-indigo-100/10"
                )}>
                  <div className={cn(
                    "flex size-11 items-center justify-center rounded-xl border transition-colors",
                    currentTheme === "dark" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : module.bgClass
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-bold text-base">{module.label}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                    {module.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sri Lanka Map and Headquarters Section */}
      <section className={cn(
        "px-6 py-20 lg:px-10 transition-colors duration-300",
        currentTheme === "dark" ? "bg-slate-950" : "bg-white"
      )}>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-650">Sri Lanka Headquarters</p>
              <h2 className="text-3xl font-black tracking-tight">Visit our Colombo centre.</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                Conveniently located in Colombo 03, Medicare support operations provide round-the-clock technical SLAs and system integrations for healthcare institutes island-wide.
              </p>
            </div>

            <div className="space-y-4">
              <a href={googleMapLink} target="_blank" rel="noopener noreferrer" className={cn(
                "flex items-start gap-4 p-4 border rounded-2xl transition-colors group shadow-md",
                currentTheme === "dark" ? "border-white/5 bg-slate-900/50 hover:bg-slate-900" : "border-indigo-100 bg-white hover:bg-indigo-50"
              )}>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-650 shrink-0 group-hover:bg-indigo-650 group-hover:text-white transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    Colombo Office <ExternalLink className="h-3 w-3 opacity-60" />
                  </h4>
                  <p className="text-xs text-slate-550 mt-1 leading-relaxed">Medicare ERP Solutions Ltd.<br />Galle Road, Colombo 03, Sri Lanka.</p>
                </div>
              </a>
              
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={cn(
                "flex items-start gap-4 p-4 border rounded-2xl transition-colors group shadow-md",
                currentTheme === "dark" ? "border-white/5 bg-slate-900/50 hover:bg-slate-900" : "border-indigo-100 bg-white hover:bg-indigo-50"
              )}>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    WhatsApp Hotline <ExternalLink className="h-3 w-3 opacity-60" />
                  </h4>
                  <p className="text-xs text-slate-550 mt-1 leading-relaxed">Instantly reach helpdesk operations.<br />{contactNumberDisplay}</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className={cn(
              "w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden border shadow-2xl relative transition-colors duration-300",
              currentTheme === "dark" ? "border-white/10 bg-slate-900" : "border-indigo-100 bg-white"
            )}>
              <iframe
                title="MediCare Colombo Location Map"
                src={embeddedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={cn(
                  "opacity-90 transition-all duration-350 hover:opacity-100 hover:grayscale-0 hover:invert-0",
                  currentTheme === "dark" ? "grayscale invert" : ""
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SLA Section */}
      <section className={cn(
        "px-6 pb-20 lg:px-10 transition-colors duration-300",
        currentTheme === "dark" ? "bg-slate-950" : "bg-white"
      )}>
        <div className={cn(
          "mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300",
          currentTheme === "dark" ? "border-white/5 bg-gradient-to-r from-slate-900 to-indigo-950" : "border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-blue-50/40"
        )}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-650">Ready for a hospital-ready ERP?</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Talk to the MediCare team in Sri Lanka.</h2>
            <p className="text-xs text-slate-550 max-w-xl font-semibold leading-relaxed">Get setup guidance for staff role permissions, clinical modules, billing invoice configurations, and live dashboard modules.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto relative z-10">
            <Button asChild size="lg" className={cn(
              "h-12 px-6 rounded-xl font-bold shadow-md",
              currentTheme === "dark" 
                ? "bg-indigo-650 hover:bg-indigo-600 text-white shadow-indigo-650/20" 
                : "bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 shadow-indigo-100/10"
            )}>
              <a href={`tel:${contactNumberRaw}`}>
                <Phone className="h-4.5 w-4.5 mr-2" />
                {contactNumberDisplay}
              </a>
            </Button>
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white h-12 px-6 rounded-xl font-bold gap-2 shadow-md shadow-emerald-600/20">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4.5 w-4.5" /> WhatsApp Chat
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Smart Footer */}
      <footer className="border-t py-16 px-6 lg:px-10 mt-auto border-white/5 bg-slate-950 text-slate-400">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center border bg-white/10 border-white/20 shadow-sm">
                <Image src="/medicare-logo.svg" alt="MediCare ERP logo" width={22} height={22} />
              </div>
              <span className="font-extrabold text-base text-white">MediCare ERP</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Sri Lanka's modern hospital operating system. Unifying admissions, EMR records, pharmacy inventory, and lab results into one fast secure ecosystem.
            </p>
            <div className="space-y-1.5 text-xs text-slate-450 font-semibold pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" /> Colombo 03, Sri Lanka
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-indigo-400" /> {contactNumberDisplay}
              </p>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-2">
              © {new Date().getFullYear()} MediCare ERP Solutions Ltd. All rights reserved.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinical Suite</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Appointments Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">EMR Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Laboratory Systems</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Pharmacy Inventories</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal & Support</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Privacy Policy <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Terms of Service <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Support Helpdesk <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
