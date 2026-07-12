"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { patientApi } from "@/lib/api/patient.api";
import { medicalRecordApi } from "@/lib/api/emr.api";
import { labResultApi } from "@/lib/api/laboratory.api";
import { appointmentApi } from "@/lib/api/appointment.api";
import { invoiceApi } from "@/lib/api/billing.api";
import { allergyApi } from "@/lib/api/emr.api";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  User, Search, ChevronDown, X, Activity, FlaskConical,
  CalendarDays, Receipt, ShieldAlert, Stethoscope,
  TrendingUp, HeartPulse, Pill, AlertTriangle
} from "lucide-react";

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLOURS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, colour = "text-primary", bg = "bg-primary/10",
}: { icon: React.ElementType; label: string; value: string | number; sub?: string; colour?: string; bg?: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center gap-4 pt-5 pb-5">
        <div className={`rounded-xl p-3 ${bg}`}>
          <Icon className={`h-5 w-5 ${colour}`} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-black">{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: "8px",
    border: "1px solid hsl(var(--border))",
    background: "hsl(var(--popover))",
    color: "hsl(var(--popover-foreground))",
    fontSize: "12px",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function PatientAnalyticsPanel({ patientId }: { patientId: string }) {
  // Fetch all data in parallel
  const { data: patient } = useQuery({
    queryKey: ["patient-detail", patientId],
    queryFn: () => patientApi.getById(patientId),
    enabled: !!patientId,
  });

  const { data: records = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["medical-records", "patient", patientId],
    queryFn: () => medicalRecordApi.getByPatient(patientId),
    enabled: !!patientId,
  });

  const { data: labOrders = [], isLoading: labLoading } = useQuery({
    queryKey: ["lab-orders-patient", patientId],
    queryFn: () => labResultApi.getOrdersByPatient(patientId),
    enabled: !!patientId,
  });

  const { data: appointments = [], isLoading: apptLoading } = useQuery({
    queryKey: ["appointments-patient", patientId],
    queryFn: () => appointmentApi.getByPatient(patientId),
    enabled: !!patientId,
  });

  const { data: invoices = [], isLoading: billLoading } = useQuery({
    queryKey: ["invoices-patient", patientId],
    queryFn: () => invoiceApi.getByPatient(patientId),
    enabled: !!patientId,
  });

  const { data: allergies = [] } = useQuery({
    queryKey: ["allergies", "patient", patientId],
    queryFn: () => allergyApi.getByPatient(patientId),
    enabled: !!patientId,
  });

  const isLoading = recordsLoading || labLoading || apptLoading || billLoading;
  if (isLoading) return <LoadingSpinner />;

  // ── Derived data for charts ────────────────────────────────────────────────

  // 1. Visit timeline — group records by month
  const visitsByMonth = (() => {
    const map: Record<string, number> = {};
    records.forEach((r) => {
      const month = r.recordDate?.slice(0, 7) ?? "Unknown";
      map[month] = (map[month] ?? 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, visits]) => ({ month, visits }));
  })();

  // 2. Visit type distribution (Pie)
  const visitTypeCounts = (() => {
    const map: Record<string, number> = {};
    records.forEach((r) => { map[r.recordType] = (map[r.recordType] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  })();

  // 3. Vitals trend from records (line over time)
  const vitalsTrend = records
    .filter((r) => r.vitals)
    .sort((a, b) => a.recordDate.localeCompare(b.recordDate))
    .map((r) => ({
      date: r.recordDate,
      heartRate: r.vitals?.heartRate,
      temperature: r.vitals?.temperature,
      weight: r.vitals?.weight,
      bp: r.vitals?.bloodPressure,
    }));

  // 4. Lab orders by status (Bar)
  const labStatusCounts = (() => {
    const map: Record<string, number> = {};
    labOrders.forEach((o) => { map[o.status ?? "UNKNOWN"] = (map[o.status ?? "UNKNOWN"] ?? 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  })();

  // 5. Lab test categories pie
  const labCategoryCounts = (() => {
    const map: Record<string, number> = {};
    labOrders.forEach((o) => {
      o.orderItems?.forEach((item) => {
        const cat = (item as any).labTest?.category ?? "Lab Test";
        map[cat] = (map[cat] ?? 0) + 1;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  // 6. Appointment status (Radial)
  const apptStatusCounts = (() => {
    const map: Record<string, number> = {};
    appointments.forEach((a) => { map[a.status] = (map[a.status] ?? 0) + 1; });
    return Object.entries(map).map(([name, value], i) => ({
      name, value, fill: COLOURS[i % COLOURS.length],
    }));
  })();

  // 7. Billing summary
  const totalBilled  = invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalPaid    = invoices.reduce((s, i) => s + (i.paidAmount  ?? 0), 0);
  const outstanding  = invoices.reduce((s, i) => s + (i.balanceAmount ?? 0), 0);
  const billingData = [
    { name: "Paid", value: totalPaid, fill: "#10b981" },
    { name: "Outstanding", value: Math.max(0, outstanding), fill: "#ef4444" },
  ];

  // 8. Diagnoses frequency
  const diagnosisCounts = (() => {
    const map: Record<string, number> = {};
    records.forEach((r) =>
      r.diagnoses?.forEach((d) => { map[d.diagnosisName] = (map[d.diagnosisName] ?? 0) + 1; })
    );
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  })();

  const totalRx = records.filter((r) => r.prescription).length;

  return (
    <div className="space-y-6">
      {/* ── Patient profile banner ─────────────────────────────────────────── */}
      {patient && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-6 pt-5 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shrink-0">
              {patient.firstName?.[0]}{patient.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold">{patient.firstName} {patient.lastName}</p>
              <p className="text-sm text-muted-foreground font-mono">{patient.patientNumber}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.bloodGroup && <Badge variant="outline">🩸 {patient.bloodGroup}</Badge>}
              {patient.dateOfBirth && <Badge variant="outline">🎂 {patient.dateOfBirth}</Badge>}
              {patient.gender && <Badge variant="outline">{patient.gender}</Badge>}
              {allergies.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {allergies.length} Allerg{allergies.length !== 1 ? "ies" : "y"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Summary stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Stethoscope}  label="Total Visits"    value={records.length}     sub="medical records" />
        <StatCard icon={FlaskConical} label="Lab Orders"      value={labOrders.length}   sub="tests ordered"   colour="text-teal-600"   bg="bg-teal-100" />
        <StatCard icon={CalendarDays} label="Appointments"    value={appointments.length} sub="total booked"   colour="text-violet-600" bg="bg-violet-100" />
        <StatCard icon={Pill}         label="Prescriptions"   value={totalRx}            sub="issued"          colour="text-emerald-600" bg="bg-emerald-100" />
        <StatCard icon={Receipt}      label="Total Billed"    value={`LKR ${totalBilled.toLocaleString()}`} sub={`${outstanding > 0 ? `LKR ${outstanding.toLocaleString()} due` : "Settled"}`} colour="text-amber-600" bg="bg-amber-100" />
      </div>

      {/* ── Row 1: Visit timeline + Visit type pie ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4 text-primary" />
              Visit Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visitsByMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No visit data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={visitsByMonth}>
                  <defs>
                    <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="visits" stroke="#6366f1" fill="url(#visitGrad)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Visit Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visitTypeCounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={visitTypeCounts} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3} label={({ name, percent }) => percent != null ? `${(percent * 100).toFixed(0)}%` : ""} labelLine={false}>
                    {visitTypeCounts.map((_, i) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Vitals trend ────────────────────────────────────────────── */}
      {vitalsTrend.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              Vitals Trend Over Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={vitalsTrend}>
                <defs>
                  {["#ef4444","#f59e0b","#3b82f6"].map((c, i) => (
                    <linearGradient key={i} id={`vg${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="heartRate"   name="Heart Rate (bpm)" stroke="#ef4444" fill="url(#vg0)" strokeWidth={2} connectNulls />
                <Area type="monotone" dataKey="weight"      name="Weight (kg)"      stroke="#f59e0b" fill="url(#vg1)" strokeWidth={2} connectNulls />
                <Area type="monotone" dataKey="bp"          name="BP (mmHg)"        stroke="#3b82f6" fill="url(#vg2)" strokeWidth={2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ── Row 3: Lab orders + Lab categories ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FlaskConical className="h-4 w-4 text-teal-600" />
              Lab Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {labStatusCounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No lab orders found</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={labStatusCounts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="count" name="Orders" radius={[0, 4, 4, 0]}>
                    {labStatusCounts.map((_, i) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FlaskConical className="h-4 w-4 text-indigo-500" />
              Lab Test Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {labCategoryCounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No lab category data</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={labCategoryCounts} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                    {labCategoryCounts.map((_, i) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Appointments + Billing ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="h-4 w-4 text-violet-600" />
              Appointment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apptStatusCounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No appointments found</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={90} data={apptStatusCounts} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" cornerRadius={6} label={{ fill: "hsl(var(--foreground))", fontSize: 10, position: "insideStart" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Tooltip {...TOOLTIP_STYLE} />
                </RadialBarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Receipt className="h-4 w-4 text-amber-500" />
              Billing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalBilled === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No billing records found</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={billingData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                      {billingData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => `LKR ${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 text-sm mt-2">
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />Paid: <strong>LKR {totalPaid.toLocaleString()}</strong></div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />Due: <strong>LKR {Math.max(0, outstanding).toLocaleString()}</strong></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 5: Top diagnoses bar ───────────────────────────────────────── */}
      {diagnosisCounts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Most Frequent Diagnoses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={diagnosisCounts} margin={{ top: 4, right: 8, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" name="Occurrences" radius={[4, 4, 0, 0]}>
                  {diagnosisCounts.map((_, i) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ── Allergies list ─────────────────────────────────────────────────── */}
      {allergies.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              Known Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allergies.map((a) => (
                <Badge
                  key={a.id}
                  variant="outline"
                  className={
                    a.severity === "SEVERE"   ? "border-red-400 bg-red-50 text-red-700"   :
                    a.severity === "MODERATE" ? "border-orange-400 bg-orange-50 text-orange-700" :
                    "border-yellow-400 bg-yellow-50 text-yellow-700"
                  }
                >
                  {a.allergyName} {a.severity && `· ${a.severity}`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
