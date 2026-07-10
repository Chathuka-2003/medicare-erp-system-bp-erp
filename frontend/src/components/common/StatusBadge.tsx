import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  default: "bg-info-light text-info hover:bg-info-light before:bg-info",
  success: "bg-success-light text-success hover:bg-success-light before:bg-success",
  warning: "bg-warning-light text-warning hover:bg-warning-light before:bg-warning",
  destructive: "bg-critical-light text-critical hover:bg-critical-light before:bg-critical",
};

export function StatusBadge({ label, variant = "default", className }: StatusBadgeProps) {
  return (
    <Badge className={cn("gap-1.5 rounded px-2 py-0.5 text-xs font-semibold before:block before:size-1.5 before:rounded-full", VARIANT_STYLES[variant], className)} variant="secondary">
      {label}
    </Badge>
  );
}
