"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { MedicineTable } from "@/components/pharmacy/MedicineTable";
import { useMedicines, useDeleteMedicine } from "@/hooks/usePharmacy";
import { usePagination } from "@/hooks/usePagination";
import { Plus } from "lucide-react";

export default function MedicinesPage() {
    const router = useRouter();
    const { page, size, setPage } = usePagination(0, 10);
    const { data, isLoading } = useMedicines({ page, size });
    const deleteMutation = useDeleteMedicine();

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Medicines</h1>
                <Button onClick={() => router.push("/pharmacy/medicines/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Medicine
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <MedicineTable
                                medicines={data?.content ?? []}
                                onDelete={(id) => {
                                    if (confirm("Delete this medicine?")) deleteMutation.mutate(id);
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