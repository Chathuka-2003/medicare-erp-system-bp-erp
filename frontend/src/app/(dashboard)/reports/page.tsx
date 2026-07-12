"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardStats } from "@/hooks/useReports";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { DashboardStats } from "@/components/reports/DashboardStats";
import { ReportChart } from "@/components/reports/ReportChart";
import { PatientAnalyticsPanel } from "@/components/reports/PatientAnalyticsPanel";
import { patientApi } from "@/lib/api/patient.api";
import {
  BarChart3, User, Search, ChevronDown, X, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Tab = "overview" | "patient";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Patient search state
  const [patientQuery, setPatientQuery]       = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [showDropdown, setShowDropdown]       = useState(false);

  // Load all patients once for the dropdown
  const { data: allPatientsResp, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients-all-for-reports"],
    queryFn: () => patientApi.getAll({ page: 0, size: 500 }),
    enabled: activeTab === "patient",
  });
  const allPatients = allPatientsResp?.content ?? [];

  const filteredPatients =
    patientQuery.trim().length === 0
      ? allPatients
      : allPatients.filter((p) =>
          `${p.firstName} ${p.lastName} ${p.patientNumber}`
            .toLowerCase()
            .includes(patientQuery.toLowerCase())
        );

  // Dashboard stats for overview tab
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const tabs = [
    { id: "overview" as Tab, label: "System Overview",   icon: BarChart3 },
    { id: "patient"  as Tab, label: "Patient Report",     icon: User },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold">Reports &amp; Analytics</h1>
        <p className="text-sm text-muted-foreground">
          System-wide dashboards and per-patient clinical analytics
        </p>
      </div>

      {/* ── Tab selector ────────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  TAB 1 — System Overview                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {statsLoading ? (
            <LoadingSpinner />
          ) : stats ? (
            <>
              <DashboardStats stats={stats} />
              <ReportChart stats={stats} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Dashboard statistics unavailable.
            </p>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  TAB 2 — Patient Report                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "patient" && (
        <div className="space-y-6">
          {/* Patient search card */}
          <Card>
            <CardContent className="pt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Patient to Generate Report
              </label>

              <div className="relative w-full sm:max-w-md">
                {/* Input */}
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="reports-patient-search"
                    placeholder={patientsLoading ? "Loading patients…" : "Search by name or patient ID…"}
                    value={patientQuery}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      setShowDropdown(true);
                      if (selectedPatientId) {
                        setSelectedPatientId("");
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    className="pl-9 pr-16 w-full"
                    autoComplete="off"
                    disabled={patientsLoading}
                  />
                  {selectedPatientId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId("");
                        setPatientQuery("");
                        setShowDropdown(false);
                      }}
                      className="absolute right-8 text-muted-foreground hover:text-foreground transition-colors"
                      title="Clear"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`absolute right-3 h-4 w-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                </div>

                {/* Dropdown */}
                {showDropdown && !selectedPatientId && (
                  <div className="absolute z-50 top-full mt-1 w-full rounded-xl border bg-popover text-popover-foreground shadow-xl max-h-72 overflow-y-auto">
                    {patientsLoading ? (
                      <p className="px-4 py-3 text-sm text-muted-foreground">Loading patients…</p>
                    ) : filteredPatients.length > 0 ? (
                      <>
                        <p className="px-3 py-1.5 text-[11px] text-muted-foreground border-b font-semibold uppercase tracking-wider">
                          {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
                        </p>
                        {filteredPatients.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSelectedPatientId(p.id);
                              setPatientQuery(`${p.firstName} ${p.lastName} · ${p.patientNumber}`);
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex justify-between items-center gap-3"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
                                {p.firstName?.[0]}{p.lastName?.[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{p.firstName} {p.lastName}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono shrink-0">{p.patientNumber}</span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <p className="px-4 py-3 text-sm text-muted-foreground">No patients match your search</p>
                    )}
                  </div>
                )}
              </div>

              {selectedPatientId && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Showing analytics for: <span className="font-semibold text-foreground">{patientQuery}</span>
                  <Badge variant="secondary" className="text-xs">Live Data</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient analytics (only shown after selection) */}
          {selectedPatientId ? (
            <PatientAnalyticsPanel patientId={selectedPatientId} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground space-y-3">
              <User className="h-12 w-12 opacity-25" />
              <p className="text-sm font-medium">No patient selected</p>
              <p className="text-xs">Search and select a patient above to generate their full clinical report</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
