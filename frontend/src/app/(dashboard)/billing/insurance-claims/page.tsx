"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useInsuranceClaimsByPatient } from "@/hooks/useBilling";
import { patientApi } from "@/lib/api/patient.api";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function InsuranceClaimsPage() {
  const router = useRouter();
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const debouncedQuery = useDebounce(patientQuery, 400);

  const { data: patientResults } = useQuery({
    queryKey: ["patient-search-lookup", debouncedQuery],
    queryFn: () => patientApi.search({ firstName: debouncedQuery, size: 10 }),
    enabled: debouncedQuery.length > 1,
  });

  const { data: claims, isLoading } = useInsuranceClaimsByPatient(selectedPatientId || undefined);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Insurance Claims</h1>
        {selectedPatientId && (
          <Button onClick={() => router.push(`/billing/insurance-claims/new?patientId=${selectedPatientId}`)}>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
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
              <SelectValue placeholder="Select a patient to view their claims" />
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
        isLoading ? (
          <LoadingSpinner />
        ) : claims && claims.length > 0 ? (
          <div className="space-y-3">
            {claims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <p className="font-medium">{claim.claimNumber} — {claim.insuranceProvider}</p>
                    <p className="text-sm text-muted-foreground">
                      Claimed: {formatCurrency(claim.claimAmount)}
                      {claim.approvedAmount != null && ` · Approved: ${formatCurrency(claim.approvedAmount)}`}
                      {" · "}{formatDate(claim.claimDate)}
                    </p>
                  </div>
                  {claim.status && <StatusBadge label={claim.status} />}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No insurance claims found" description="This patient has no claims on record." />
        )
      ) : (
        <p className="py-8 text-center text-muted-foreground">Select a patient above to view their insurance claims.</p>
      )}
    </div>
  );
}