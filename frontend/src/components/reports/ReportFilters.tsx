import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportType } from "@/types/reports.types";

interface ReportFiltersProps {
  value: ReportType | "ALL";
  onChange: (value: ReportType | "ALL") => void;
}

export function ReportFilters({ value, onChange }: ReportFiltersProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ReportType | "ALL")}>
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Types</SelectItem>
        {Object.values(ReportType).map((t) => (
          <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
