"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Staff } from "@/types/staff.types";
import { Pencil, Trash2, UserX, Briefcase, Mail, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StaffTableProps {
  staff: Staff[];
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StaffTable({ staff, onDeactivate, onDelete }: StaffTableProps) {
  const router = useRouter();

  if (staff.length === 0) {
    return <EmptyState title="No staff members found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {staff.map((member) => (
        <Card key={member.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
          {/* Top highlight bar */}
          <div className={`h-1.5 w-full ${member.active ? "bg-emerald-500/80" : "bg-slate-300"}`} />

          <CardContent className="pt-5 pb-5 px-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm border overflow-hidden">
                <span className={`flex h-full w-full items-center justify-center ${member.active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {member.firstName?.[0] || "S"}{member.lastName?.[0] || "M"}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
                  {member.firstName} {member.lastName ?? ""}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
                  <Award className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>No: {member.employeeNumber}</span>
                </div>
              </div>
            </div>
            <div className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border shrink-0 ${member.active ? "bg-emerald-100 text-emerald-800 border-emerald-250" : "bg-slate-100 text-slate-600 border-slate-250"}`}>
              {member.active ? "Active" : "Inactive"}
            </div>
          </div>

            <div className="space-y-2 border-t pt-4 border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Role</span>
                <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-slate-400" />
                  {member.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Department</span>
                <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  {member.departmentName ?? "General Administration"}
                </span>
              </div>
              {member.email && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Email</span>
                  <span className="font-medium text-slate-600 truncate max-w-[160px] flex items-center gap-1" title={member.email}>
                    <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                    {member.email}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-1 border-t pt-3 border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-slate-600 hover:text-slate-800"
                onClick={() => router.push(`/staff/employees/${member.id}`)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              {member.active && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50/50"
                  onClick={() => onDeactivate(member.id)}
                >
                  <UserX className="h-3.5 w-3.5 text-amber-500" />
                  Deactivate
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={() => onDelete(member.id)}
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
