"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gender, BloodGroup, PatientSearchParams } from "@/types/patient.types";

interface PatientSearchFiltersProps {
  filters: PatientSearchParams;
  onChange: (filters: PatientSearchParams) => void;
}

export function PatientSearchFilters({ filters, onChange }: PatientSearchFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        placeholder="Search by name..."
        value={filters.firstName ?? ""}
        onChange={(e) => onChange({ ...filters, firstName: e.target.value, page: 0 })}
      />
      <Input
        placeholder="Patient number..."
        value={filters.patientNumber ?? ""}
        onChange={(e) => onChange({ ...filters, patientNumber: e.target.value, page: 0 })}
      />
      <Input
        placeholder="Phone number..."
        value={filters.phone ?? ""}
        onChange={(e) => onChange({ ...filters, phone: e.target.value, page: 0 })}
      />
      <Select
        value={filters.gender ?? "ANY"}
        onValueChange={(value) =>
          onChange({ ...filters, gender: value === "ANY" ? undefined : (value as Gender), page: 0 })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ANY">Any gender</SelectItem>
          {Object.values(Gender).map((g) => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}