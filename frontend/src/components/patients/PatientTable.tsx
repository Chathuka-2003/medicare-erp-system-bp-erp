"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Patient } from "@/types/patient.types";
import { ROUTES } from "@/lib/constants/routes";
import { Pencil, Trash2, Eye, User, Phone, Calendar, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PatientTableProps {
  patients: Patient[];
  onDelete: (id: string) => void;
}

export function PatientTable({ patients, onDelete }: PatientTableProps) {
  const router = useRouter();

  if (patients.length === 0) {
    return <EmptyState title="No patients found" description="Try adjusting your search filters." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {patients.map((patient) => (
        <Card key={patient.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
          <div className="h-1.5 w-full bg-indigo-500/80" />
          
          <CardContent className="pt-5 pb-5 px-5 space-y-4">
            <div className="flex gap-3">
              <div className="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary font-bold shrink-0 shadow-sm border border-indigo-100/50">
                {patient.firstName?.[0] || "P"}{patient.lastName?.[0] || ""}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
                  {patient.firstName} {patient.lastName ?? ""}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  No: {patient.patientNumber}
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Gender / Age</span>
                <span className="font-semibold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
                  {patient.gender ?? "—"} / {patient.age ?? "—"} yrs
                </span>
              </div>
              {patient.phone && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Contact</span>
                  <span className="font-mono text-slate-650 flex items-center gap-1 font-medium">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {patient.phone}
                  </span>
                </div>
              )}
              {patient.bloodGroup && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Blood Group</span>
                  <Badge variant="outline" className="text-[10px] text-red-650 border-red-100 bg-red-50/30">
                    🩸 {patient.bloodGroup}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-1 border-t pt-3 border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50"
                onClick={() => router.push(ROUTES.PATIENT_DETAIL(patient.id))}
              >
                <Eye className="h-3.5 w-3.5" />
                View Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-slate-600 hover:text-slate-800"
                onClick={() => router.push(ROUTES.PATIENT_EDIT(patient.id))}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={() => onDelete(patient.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
