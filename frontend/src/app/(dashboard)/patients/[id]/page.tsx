"use client";

import { useParams, useRouter } from "next/navigation";
import { usePatient } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { Pencil } from "lucide-react";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: patient, isLoading } = usePatient(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!patient) return <p className="p-6">Patient not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {patient.firstName} {patient.lastName}
        </h1>
        <Button onClick={() => router.push(ROUTES.PATIENT_EDIT(patient.id))}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Patient No:</span> {patient.patientNumber}</p>
            <p><span className="text-muted-foreground">Date of Birth:</span> {patient.dateOfBirth}</p>
            <p><span className="text-muted-foreground">Age:</span> {patient.age ?? "—"}</p>
            <p><span className="text-muted-foreground">Gender:</span> {patient.gender ?? "—"}</p>
            <p><span className="text-muted-foreground">Blood Group:</span> {patient.bloodGroup ?? "—"}</p>
            <p><span className="text-muted-foreground">NIC:</span> {patient.nic ?? "—"}</p>
            <p><span className="text-muted-foreground">Email:</span> {patient.email ?? "—"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {patient.phone ?? "—"}</p>
          </CardContent>
        </Card>

        {patient.address && (
          <Card>
            <CardHeader><CardTitle>Address</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{patient.address.street}</p>
              <p>{patient.address.city}, {patient.address.district}</p>
              <p>{patient.address.postalCode}</p>
            </CardContent>
          </Card>
        )}

        {patient.insurance && (
          <Card>
            <CardHeader><CardTitle>Insurance</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Provider:</span> {patient.insurance.providerName ?? "—"}</p>
              <p><span className="text-muted-foreground">Policy No:</span> {patient.insurance.policyNumber ?? "—"}</p>
              <p><span className="text-muted-foreground">Coverage:</span> {patient.insurance.coverageType ?? "—"}</p>
            </CardContent>
          </Card>
        )}

        {patient.nextOfKin && (
          <Card>
            <CardHeader><CardTitle>Next of Kin</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {patient.nextOfKin.name}</p>
              <p><span className="text-muted-foreground">Relationship:</span> {patient.nextOfKin.relationship ?? "—"}</p>
              <p><span className="text-muted-foreground">Phone:</span> {patient.nextOfKin.phone ?? "—"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}