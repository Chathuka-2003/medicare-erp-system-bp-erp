"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Doctor } from "@/types/staff.types";
import { Pencil, Trash2, ShieldAlert, Award, PhoneCall } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DoctorTableProps {
  doctors: Doctor[];
  onDelete: (id: string) => void;
}

export function DoctorTable({ doctors, onDelete }: DoctorTableProps) {
  const router = useRouter();

  if (doctors.length === 0) {
    return <EmptyState title="No doctors found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
          {/* Top highlight bar */}
          <div className="h-1.5 w-full bg-primary/80" />
          
          <CardContent className="pt-5 pb-5 px-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary font-bold shrink-0 shadow-sm border border-indigo-100/50">
                  {doctor.firstName?.[0] || "D"}{doctor.lastName?.[0] || "R"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
                    Dr. {doctor.firstName} {doctor.lastName ?? ""}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
                    <Award className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>Lic: {doctor.licenseNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Department</span>
                <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  {doctor.departmentName ?? "General"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Specialization</span>
                <span className="font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/30">
                  {doctor.specializationName ?? "General Practice"}
                </span>
              </div>
              {doctor.phone && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Contact</span>
                  <span className="font-mono font-medium text-slate-600 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3 text-slate-400" />
                    {doctor.phone}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-1 border-t pt-3 border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-slate-600 hover:text-slate-800"
                onClick={() => router.push(`/staff/doctors/${doctor.id}`)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={() => onDelete(doctor.id)}
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
