"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { useLabTests, useDeleteLabTest } from "@/hooks/useLaboratory";
import { usePagination } from "@/hooks/usePagination";
import { formatCurrency } from "@/lib/utils/format";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function LabTestsPage() {
  const router = useRouter();
  const { page, size, setPage } = usePagination(0, 10);
  const { data, isLoading } = useLabTests({ page, size });
  const deleteMutation = useDeleteLabTest();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Laboratory Management</h1>
        <Button onClick={() => router.push("/laboratory/tests/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Test
        </Button>
      </div>

      <div className="flex border-b border-muted">
        <button
          className="px-4 py-2 font-semibold text-sm border-b-2 border-primary text-primary transition-colors"
          onClick={() => router.push("/laboratory/tests")}
        >
          Test Catalog
        </button>
        <button
          className="px-4 py-2 font-medium text-sm border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => router.push("/laboratory/orders")}
        >
          Lab Orders
        </button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : !data || data.content.length === 0 ? (
            <EmptyState title="No lab tests found" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sample Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.testCode}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.category ?? "—"}</TableCell>
                      <TableCell>{test.sampleType ?? "—"}</TableCell>
                      <TableCell>{formatCurrency(test.price)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/laboratory/tests/${test.id}/edit`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this lab test?")) deleteMutation.mutate(test.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination page={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
