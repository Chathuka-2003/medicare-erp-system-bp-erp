import { StatusBadge } from "@/components/common/StatusBadge";
import { BedStatus } from "@/types/ward.types";

const VARIANT_MAP: Record<BedStatus, "default" | "success" | "warning" | "destructive"> = {
  [BedStatus.AVAILABLE]: "success",
  [BedStatus.OCCUPIED]: "warning",
  [BedStatus.RESERVED]: "warning",
  [BedStatus.UNDER_MAINTENANCE]: "destructive",
  [BedStatus.CLEANING]: "default",
};

export function BedStatusBadge({ status }: { status: BedStatus }) {
  return <StatusBadge label={status.replace("_", " ")} variant={VARIANT_MAP[status]} />;
}
