import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  { label: "Appointments", icon: CalendarCheck, detail: "Queue, schedule, and doctor availability in one view." },
  { label: "EMR", icon: ClipboardPlus, detail: "Structured patient records for doctors and nurses." },
  { label: "Billing", icon: ReceiptText, detail: "Invoices, payments, and insurance workflows." },
  { label: "Pharmacy", icon: Pill, detail: "Medicine stock, dispensing, and reorder visibility." },
  { label: "Laboratory", icon: FlaskConical, detail: "Lab tests, orders, results, and technician worklists." },
  { label: "Wards", icon: BedDouble, detail: "Admissions, beds, discharge, and ward capacity." },
];

const strengths = [
  "Role-aware staff access",
  "Unified clinical operations",
  "Real-time finance and stock signals",
];

const metrics = [
  { label: "Care modules", value: "12+" },
  { label: "Staff roles", value: "11" },
  { label: "Support", value: "24/7" },
];

const contactNumber = "+94 11 234 5678";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative min-h-[94vh] overflow-hidden border-b border-border bg-background text-foreground">
        <Image
          src="/healthcare-hero-photo.jpg"
          alt="Healthcare professionals using digital hospital technology"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--surface-1)_0%,color-mix(in_srgb,var(--surface-1),transparent_6%)_52%,color-mix(in_srgb,var(--surface-1),transparent_26%)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,var(--primary-glow),transparent_28rem)]" />
        <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/medicare-logo.svg" alt="MediCare ERP logo" width={44} height={44} className="rounded-xl" />
            <span>
              <span className="block font-semibold">MediCare ERP</span>
              <span className="block text-xs text-muted-foreground">Smart clinical operations</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <a href={`tel:${contactNumber.replaceAll(" ", "")}`} className="hidden items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-card md:flex">
              <Phone className="h-4 w-4 text-primary" />
              {contactNumber}
            </a>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/register">Request access</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </header>

        <div className="relative z-10 grid min-h-[calc(94vh-88px)] items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.02fr_0.8fr] lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-primary-light px-3 py-1 text-sm font-semibold text-primary">
              <LockKeyhole className="h-4 w-4" />
              Secure MediCare operations workspace
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal text-primary md:text-6xl">
              Modern hospital ERP for Sri Lankan care teams.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              MediCare ERP connects appointments, patient records, billing, pharmacy, laboratory, wards, inventory, and staff operations in one secure dashboard.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">
                  Go to MediCare login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create access request</Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <a href={`tel:${contactNumber.replaceAll(" ", "")}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 backdrop-blur hover:bg-card">
                <Phone className="h-4 w-4 text-primary" />
                Sri Lanka: {contactNumber}
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                HIPAA-minded access design
              </span>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {strengths.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl border border-border bg-card/80 p-3 text-sm text-muted-foreground backdrop-blur">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 p-5 shadow-modal backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Live command preview</p>
                  <p className="mt-1 text-xs text-muted-foreground">MediCare operational pulse</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div className="relative mt-6 grid gap-3">
                {[
                  { label: "Today appointments", value: "128", icon: CalendarCheck },
                  { label: "Available beds", value: "34", icon: BedDouble },
                  { label: "Revenue collected", value: "LKR 4.8M", icon: TrendingUp },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="text-lg font-semibold">{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-5 grid grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border bg-surface-3 p-3 text-center">
                    <p className="text-xl font-semibold">{metric.value}</p>
                    <p className="mt-1 text-[0.7rem] text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Connected modules</p>
              <h2 className="mt-2 text-3xl font-semibold">Everything your hospital team opens every day.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              A focused operating layer for administrators, clinicians, finance teams, lab teams, pharmacy staff, and ward coordinators.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.label} className="rounded-xl border bg-card/90 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-secondary/10">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{module.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {module.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-border bg-primary-light p-6 text-foreground shadow-surface md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Ready for a hospital-ready ERP?</p>
            <h2 className="mt-2 text-2xl font-semibold">Talk to the MediCare team in Sri Lanka.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get setup guidance for roles, modules, billing workflows, and operational dashboards.</p>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <a href={`tel:${contactNumber.replaceAll(" ", "")}`}>
              <Phone className="h-4 w-4" />
              {contactNumber}
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
