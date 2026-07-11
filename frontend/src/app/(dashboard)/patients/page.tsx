"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientSearchFilters } from "@/components/patients/PatientSearchFilters";
import { usePatients, useDeletePatient } from "@/hooks/usePatients";
import { useDebounce } from "@/hooks/useDebounce";
import { PatientSearchParams } from "@/types/patient.types";
import { ROUTES } from "@/lib/constants/routes";
import { Plus } from "lucide-react";

export default function PatientsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<PatientSearchParams>({ page: 0, size: 10 });
  const debouncedFilters = useDebounce(filters, 400);

  const { data, isLoading } = usePatients(debouncedFilters);
  const deleteMutation = useDeletePatient();

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this patient? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <Button onClick={() => router.push(ROUTES.PATIENT_NEW)}>
          <Plus className="mr-2 h-4 w-4" />
          New Patient
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <PatientSearchFilters filters={filters} onChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <PatientTable patients={data?.content ?? []} onDelete={handleDelete} />
              {data && (
                <Pagination
                  page={data.pageNumber}
                  totalPages={data.totalPages}
                  onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}