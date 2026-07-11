"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import { useInvoices } from "@/hooks/useBilling";
import { usePagination } from "@/hooks/usePagination";
import { Plus } from "lucide-react";

export default function InvoicesPage() {
  const router = useRouter();
  const { page, size, setPage } = usePagination(0, 10);
  const { data, isLoading } = useInvoices({ page, size, sortBy: "invoiceDate", sortDirection: "DESC" });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button onClick={() => router.push("/billing/invoices/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <InvoiceTable invoices={data?.content ?? []} />
              {data && <Pagination page={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}