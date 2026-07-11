"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { MedicalRecordTimeline } from "@/components/emr/MedicalRecordTimeline";
import { useMedicalRecordsByPatient } from "@/hooks/useMedicalRecords";
import { patientApi } from "@/lib/api/patient.api";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus } from "lucide-react";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const debouncedQuery = useDebounce(patientQuery, 400);

  const { data: patientResults } = useQuery({
    queryKey: ["patient-search-lookup", debouncedQuery],
    queryFn: () => patientApi.search({ firstName: debouncedQuery, size: 10 }),
    enabled: debouncedQuery.length > 1,
  });

  const { data: records, isLoading } = useMedicalRecordsByPatient(selectedPatientId || undefined);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Medical Records</h1>
        {selectedPatientId && (
          <Button onClick={() => router.push(`/emr/records/new?patientId=${selectedPatientId}`)}>
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Input
            placeholder="Search patient by first name..."
            value={patientQuery}
            onChange={(e) => setPatientQuery(e.target.value)}
          />
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-full sm:w-96">
              <SelectValue placeholder="Select a patient to view their records" />
            </SelectTrigger>
            <SelectContent>
              {patientResults?.content.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientNumber})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPatientId ? (
        isLoading ? <LoadingSpinner /> : <MedicalRecordTimeline records={records ?? []} />
      ) : (
        <p className="py-8 text-center text-muted-foreground">Search and select a patient above to view their medical history.</p>
      )}
    </div>
  );
}