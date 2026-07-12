"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { DoctorTable } from "@/components/staff/DoctorTable";
import { useDoctors, useDeleteDoctor } from "@/hooks/useStaff";
import { usePagination } from "@/hooks/usePagination";
import { Plus } from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const { page, size, setPage } = usePagination(0, 10);
  const { data, isLoading } = useDoctors({ page, size });
  const deleteMutation = useDeleteDoctor();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <Button onClick={() => router.push("/staff/doctors/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Doctor
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <DoctorTable
                doctors={data?.content ?? []}
                onDelete={(id) => {
                  if (confirm("Delete this doctor?")) deleteMutation.mutate(id);
                }}
              />
              {data && <Pagination page={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}