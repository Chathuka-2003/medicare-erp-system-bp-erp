"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useDrugDispensesByPatient } from "@/hooks/usePharmacy";
import { patientApi } from "@/lib/api/patient.api";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime } from "@/lib/utils/format";
import { Plus } from "lucide-react";

export default function DispensePage() {
    const router = useRouter();
    const [patientQuery, setPatientQuery] = useState("");
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const debouncedQuery = useDebounce(patientQuery, 400);

    const { data: patientResults } = useQuery({
        queryKey: ["patient-search-lookup", debouncedQuery],
        queryFn: () => patientApi.search({ firstName: debouncedQuery, size: 10 }),
        enabled: debouncedQuery.length > 1,
    });

    const { data: dispenses, isLoading } = useDrugDispensesByPatient(selectedPatientId || undefined);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Drug Dispense</h1>
                <Button onClick={() => router.push("/pharmacy/dispense/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Dispense
                </Button>
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
                            <SelectValue placeholder="Select a patient to view dispense history" />
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
                ) : dispenses && dispenses.length > 0 ? (
                    <div className="space-y-3">
                        {dispenses.map((d) => (
                            <Card key={d.id}>
                                <CardContent className="pt-6">
                                    <p className="font-medium">{d.dispenseNumber} — {formatDateTime(d.dispenseDate)}</p>
                                    <p className="text-sm text-muted-foreground">Pharmacist: {d.pharmacistName}</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                        {d.items.map((item, i) => (
                                            <p key={item.id ?? i}>{item.medicineName} × {item.quantity} {item.dosage && `(${item.dosage})`}</p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState title="No dispense records found" />
                )
            ) : (
                <p className="py-8 text-center text-muted-foreground">Select a patient above to view their dispense history.</p>
            )}
        </div>
    );
}