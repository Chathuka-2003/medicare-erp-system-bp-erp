"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useWard, useBedsByWard, useCreateBed, useUpdateBedStatus, useCurrentAdmissions, useAdmitPatient } from "@/hooks/useWard";
import { useCreatePatient } from "@/hooks/usePatients";
import { bedSchema, BedFormValues } from "@/schemas/ward.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BedGrid } from "@/components/ward/BedGrid";
import { Pencil, Plus, UserPlus, Bed } from "lucide-react";
import { patientApi } from "@/lib/api/patient.api";
import { doctorApi } from "@/lib/api/staff.api";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wardId = params.id as string;

  const { data: ward, isLoading } = useWard(wardId);
  const { data: beds, isLoading: bedsLoading } = useBedsByWard(wardId);
  const { data: admissions, isLoading: admissionsLoading } = useCurrentAdmissions();
  
  const createBedMutation = useCreateBed();
  const updateStatusMutation = useUpdateBedStatus();
  const admitMutation = useAdmitPatient();
  const createPatientMutation = useCreatePatient();

  const [showAddBed, setShowAddBed] = useState(false);

  // Quick Admission Form States
  const [admissionBedId, setAdmissionBedId] = useState("");
  const [admissionPatientId, setAdmissionPatientId] = useState("");
  const [admissionDoctorId, setAdmissionDoctorId] = useState("");
  const [admissionDiagnosis, setAdmissionDiagnosis] = useState("");
  const [admissionRemarks, setAdmissionRemarks] = useState("");
  const [patientQuery, setPatientQuery] = useState("");
  const debouncedPatientQuery = useDebounce(patientQuery, 400);

  // Patient Creation Dialog States
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [newPatientFirstName, setNewPatientFirstName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");
  const [newPatientDob, setNewPatientDob] = useState("");
  const [newPatientGender, setNewPatientGender] = useState("MALE");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newPatientNic, setNewPatientNic] = useState("");

  const { data: patientResults } = useQuery({
    queryKey: ["patient-search-lookup", debouncedPatientQuery],
    queryFn: () => patientApi.search({ firstName: debouncedPatientQuery, size: 10 }),
    enabled: debouncedPatientQuery.length > 1,
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors-lookup"],
    queryFn: () => doctorApi.getAll({ page: 0, size: 100 }),
  });

  const bedForm = useForm<any>({
    resolver: zodResolver(bedSchema),
    defaultValues: { wardId, bedNumber: "", roomNumber: "" },
  });

  async function onBedSubmit(values: BedFormValues) {
    await createBedMutation.mutateAsync(values);
    bedForm.reset({ wardId, bedNumber: "", roomNumber: "" });
    setShowAddBed(false);
  }

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientFirstName || !newPatientDob) {
      toast.error("First Name and Date of Birth are required");
      return;
    }
    try {
      const patient = await createPatientMutation.mutateAsync({
        firstName: newPatientFirstName,
        lastName: newPatientLastName,
        dateOfBirth: newPatientDob,
        gender: newPatientGender as any,
        phone: newPatientPhone || undefined,
        nic: newPatientNic || undefined,
      });
      setAdmissionPatientId(patient.id);
      setPatientQuery(`${patient.firstName} ${patient.lastName}`);
      setPatientDialogOpen(false);
      // Clear fields
      setNewPatientFirstName("");
      setNewPatientLastName("");
      setNewPatientDob("");
      setNewPatientGender("MALE");
      setNewPatientPhone("");
      setNewPatientNic("");
    } catch (err) {
      // Mutation handles error toasts
    }
  };

  const handleAdmitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionBedId || !admissionPatientId || !admissionDoctorId) {
      toast.error("Please select a bed, patient, and admitting doctor.");
      return;
    }
    try {
      await admitMutation.mutateAsync({
        patientId: admissionPatientId,
        doctorId: admissionDoctorId,
        bedId: admissionBedId,
        diagnosis: admissionDiagnosis || undefined,
        remarks: admissionRemarks || undefined,
      });
      // Reset form states
      setAdmissionBedId("");
      setAdmissionPatientId("");
      setPatientQuery("");
      setAdmissionDoctorId("");
      setAdmissionDiagnosis("");
      setAdmissionRemarks("");
    } catch (err) {
      // Mutation handles error toasts
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!ward) return <p className="p-6">Ward not found.</p>;

  const availableBeds = beds?.filter((b: any) => b.status === "AVAILABLE") ?? [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{ward.wardName}</h1>
          <p className="text-sm text-muted-foreground">
            {ward.wardCode} · {ward.wardType} · <span className="font-semibold text-foreground">{ward.availableBeds}</span>/{ward.totalBeds} beds available
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/ward/wards/${ward.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Ward
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beds Registry Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Beds Registry</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAddBed(!showAddBed)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Bed
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddBed && (
                <Form {...bedForm}>
                  <form onSubmit={bedForm.handleSubmit(onBedSubmit)} className="flex gap-3 rounded-md border p-3 bg-muted/10">
                    <FormField control={bedForm.control} name="bedNumber" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bed Number</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. 104A" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={bedForm.control} name="roomNumber" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Room Number</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. 104" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-end">
                      <Button type="submit" disabled={createBedMutation.isPending}>Save</Button>
                    </div>
                  </form>
                </Form>
              )}

              {bedsLoading || admissionsLoading ? (
                <LoadingSpinner />
              ) : (
                <BedGrid
                  beds={beds ?? []}
                  admissions={admissions ?? []}
                  onStatusChange={(bedId, status) => updateStatusMutation.mutate({ id: bedId, status })}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Admission Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Bed className="h-5 w-5 text-primary" />
                Quick Admission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdmitSubmit} className="space-y-4">
                {/* Available Beds Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="admission-bed">Select Available Bed</Label>
                  <Select value={admissionBedId} onValueChange={setAdmissionBedId} disabled={availableBeds.length === 0}>
                    <SelectTrigger id="admission-bed">
                      <SelectValue placeholder={availableBeds.length === 0 ? "No available beds" : "Select a bed"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBeds.map((b: any) => (
                        <SelectItem key={b.id} value={b.id}>
                          Bed {b.bedNumber} {b.roomNumber ? `(Room ${b.roomNumber})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Patient Search & Add Dropdown */}
                <div className="space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="patient-search">Patient Search</Label>
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm" 
                      onClick={() => setPatientDialogOpen(true)}
                      className="h-auto p-0 flex items-center text-xs text-primary hover:no-underline"
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Add Patient
                    </Button>
                  </div>
                  
                  <Input 
                    id="patient-search"
                    placeholder="Type patient's first name..." 
                    value={patientQuery}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      if (admissionPatientId) {
                        setAdmissionPatientId("");
                      }
                    }}
                  />

                  {patientQuery.length > 1 && !admissionPatientId && (
                    <div className="absolute z-50 w-full bg-popover text-popover-foreground border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto p-1">
                      {patientResults?.content && patientResults.content.length > 0 ? (
                        patientResults.content.map((p: any) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setAdmissionPatientId(p.id);
                              setPatientQuery(`${p.firstName} ${p.lastName} (${p.patientNumber})`);
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {p.firstName} {p.lastName} ({p.patientNumber})
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground p-2">No patients found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Admitting Doctor Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="admission-doctor">Admitting Doctor</Label>
                  <Select value={admissionDoctorId} onValueChange={setAdmissionDoctorId}>
                    <SelectTrigger id="admission-doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.content.map((d: any) => (
                        <SelectItem key={d.id} value={d.id}>
                          Dr. {d.firstName} {d.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Diagnosis Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="admission-diagnosis">Diagnosis (Optional)</Label>
                  <Input 
                    id="admission-diagnosis" 
                    value={admissionDiagnosis} 
                    onChange={(e) => setAdmissionDiagnosis(e.target.value)}
                    placeholder="Primary diagnostic reason"
                  />
                </div>

                {/* Remarks Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="admission-remarks">Remarks (Optional)</Label>
                  <Input 
                    id="admission-remarks" 
                    value={admissionRemarks} 
                    onChange={(e) => setAdmissionRemarks(e.target.value)}
                    placeholder="Special instructions or notes"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-2" 
                  disabled={admitMutation.isPending || availableBeds.length === 0}
                >
                  {admitMutation.isPending ? "Admitting..." : "Admit Patient"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Patient Modal Dialog */}
      <Dialog open={patientDialogOpen} onOpenChange={setPatientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreatePatient}>
            <DialogHeader>
              <DialogTitle>Quick Add Patient</DialogTitle>
              <DialogDescription>
                Register a new patient record to assign them to an available bed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="first-name">First Name</Label>
                <Input 
                  id="first-name" 
                  value={newPatientFirstName}
                  onChange={(e) => setNewPatientFirstName(e.target.value)}
                  placeholder="e.g. John" 
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="last-name">Last Name</Label>
                <Input 
                  id="last-name" 
                  value={newPatientLastName}
                  onChange={(e) => setNewPatientLastName(e.target.value)}
                  placeholder="e.g. Doe" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  type="date"
                  value={newPatientDob}
                  onChange={(e) => setNewPatientDob(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gender">Gender</Label>
                <Select value={newPatientGender} onValueChange={setNewPatientGender}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">MALE</SelectItem>
                    <SelectItem value="FEMALE">FEMALE</SelectItem>
                    <SelectItem value="OTHER">OTHER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="e.g. +94771234567" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nic">NIC</Label>
                <Input 
                  id="nic" 
                  value={newPatientNic}
                  onChange={(e) => setNewPatientNic(e.target.value)}
                  placeholder="e.g. 199912345678" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPatientDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createPatientMutation.isPending}>
                {createPatientMutation.isPending ? "Creating..." : "Save Patient"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
