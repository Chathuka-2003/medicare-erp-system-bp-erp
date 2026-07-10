"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { StaffTable } from "@/components/staff/StaffTable";
import { useStaffList, useDeactivateStaff, useDeleteStaff } from "@/hooks/useStaff";
import { usePagination } from "@/hooks/usePagination";
import { Plus } from "lucide-react";

export default function EmployeesPage() {
  const router = useRouter();
  const { page, size, setPage } = usePagination(0, 10);
  const { data, isLoading } = useStaffList({ page, size });
  const deactivateMutation = useDeactivateStaff();
  const deleteMutation = useDeleteStaff();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Staff</h1>
        <Button onClick={() => router.push("/staff/employees/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Staff Member
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <StaffTable
                staff={data?.content ?? []}
                onDeactivate={(id) => {
                  if (confirm("Deactivate this staff member?")) deactivateMutation.mutate(id);
                }}
                onDelete={(id) => {
                  if (confirm("Delete this staff member? This cannot be undone.")) deleteMutation.mutate(id);
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