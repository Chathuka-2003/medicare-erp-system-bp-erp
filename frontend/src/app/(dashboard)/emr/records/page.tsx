"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { MedicalRecordTimeline } from "@/components/emr/MedicalRecordTimeline";
import { AllergyPanel } from "@/components/emr/AllergyPanel";
import { useMedicalRecordsByPatient } from "@/hooks/useMedicalRecords";
import { patientApi } from "@/lib/api/patient.api";
import { Plus, User, Calendar, Phone, FileText, Search, ChevronDown, X } from "lucide-react";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load ALL patients once for the dropdown
  const { data: allPatientsResp, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients-all-for-emr"],
    queryFn: () => patientApi.getAll({ page: 0, size: 500 }),
  });
  const allPatients = allPatientsResp?.content ?? [];

  // Filter client-side based on what the user types
  const filteredPatients = patientQuery.trim().length === 0
    ? allPatients
    : allPatients.filter((p) =>
        `${p.firstName} ${p.lastName} ${p.patientNumber}`
          .toLowerCase()
          .includes(patientQuery.toLowerCase())
      );

  const { data: patientDetail } = useQuery({
    queryKey: ["patient-detail", selectedPatientId],
    queryFn: () => patientApi.getById(selectedPatientId),
    enabled: !!selectedPatientId,
  });

  const { data: records, isLoading } = useMedicalRecordsByPatient(selectedPatientId || undefined);

  const totalVisits = records?.length ?? 0;
  const lastVisit = records?.length
    ? [...records].sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())[0]
    : null;
  const totalDiagnoses = records?.reduce((s, r) => s + r.diagnoses.length, 0) ?? 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Electronic Medical Records</h1>
          <p className="text-sm text-muted-foreground">Search a patient to view their complete medical history</p>
        </div>
        {selectedPatientId && (
          <Button onClick={() => router.push(`/emr/records/new?patientId=${selectedPatientId}`)}>
            <Plus className="mr-2 h-4 w-4" />
            New Visit Record
          </Button>
        )}
      </div>

      {/* Patient Search */}
      <Card>
        <CardContent className="pt-6">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Select Patient
          </label>
          <div className="relative w-full sm:max-w-sm" ref={dropdownRef}>
            {/* Input row */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="emr-patient-search"
                placeholder={patientsLoading ? "Loading patients..." : "Search by name or patient ID..."}
                value={patientQuery}
                onChange={(e) => {
                  setPatientQuery(e.target.value);
                  setShowDropdown(true);
                  if (selectedPatientId) {
                    setSelectedPatientId("");
                    setSelectedPatientName("");
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
                    setSelectedPatientName("");
                    setPatientQuery("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-8 text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown className={`absolute right-3 h-4 w-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </div>

            {/* Dropdown list */}
            {showDropdown && !selectedPatientId && (
              <div className="absolute z-50 top-full mt-1 w-full rounded-lg border bg-popover text-popover-foreground shadow-lg max-h-64 overflow-y-auto">
                {patientsLoading ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Loading patients...</p>
                ) : filteredPatients.length > 0 ? (
                  <>
                    <p className="px-3 py-1.5 text-[11px] text-muted-foreground border-b font-medium">
                      {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
                    </p>
                    {filteredPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setSelectedPatientName(`${p.firstName} ${p.lastName}`);
                          setPatientQuery(`${p.firstName} ${p.lastName} · ${p.patientNumber}`);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex justify-between items-center gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5 text-primary" />
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
        </CardContent>
      </Card>

      {/* Patient Panel */}
      {selectedPatientId && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Patient info + stats + allergies */}
          <div className="space-y-4 lg:col-span-1">
            {/* Patient Info Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Patient Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {patientDetail ? (
                  <>
                    <div>
                      <p className="text-lg font-semibold">{patientDetail.firstName} {patientDetail.lastName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{patientDetail.patientNumber}</p>
                    </div>
                    {patientDetail.dateOfBirth && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {patientDetail.dateOfBirth}
                      </p>
                    )}
                    {patientDetail.phone && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {patientDetail.phone}
                      </p>
                    )}
                    {patientDetail.bloodGroup && (
                      <Badge variant="outline" className="mt-1">
                        Blood: {patientDetail.bloodGroup}
                      </Badge>
                    )}
                  </>
                ) : (
                  <LoadingSpinner />
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center p-3">
                <p className="text-2xl font-bold text-primary">{totalVisits}</p>
                <p className="text-xs text-muted-foreground">Visits</p>
              </Card>
              <Card className="text-center p-3">
                <p className="text-2xl font-bold text-amber-500">{totalDiagnoses}</p>
                <p className="text-xs text-muted-foreground">Diagnoses</p>
              </Card>
              <Card className="text-center p-3">
                <p className="text-2xl font-bold text-emerald-500">
                  {records?.filter((r) => r.prescription).length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Prescriptions</p>
              </Card>
            </div>

            {/* Last Visit */}
            {lastVisit && (
              <Card>
                <CardContent className="pt-4 text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
                  <p className="font-medium">{lastVisit.recordDate}</p>
                  <p className="text-muted-foreground">Dr. {lastVisit.doctorName}</p>
                </CardContent>
              </Card>
            )}

            {/* Allergies */}
            <AllergyPanel patientId={selectedPatientId} />
          </div>

          {/* Right: Medical Record Timeline */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Visit History
              </h2>
              {totalVisits > 0 && (
                <Badge variant="secondary">{totalVisits} record{totalVisits !== 1 ? "s" : ""}</Badge>
              )}
            </div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <MedicalRecordTimeline records={records ?? []} />
            )}
          </div>
        </div>
      )}

      {!selectedPatientId && (
        <div className="py-16 text-center text-muted-foreground">
          <User className="mx-auto mb-4 h-10 w-10 opacity-30" />
          <p className="text-sm">Search and select a patient above to view their complete medical history.</p>
        </div>
      )}
    </div>
  );
}
