import { LabTestStatus } from "@/types/laboratory.types";

export function getLabStatusVariant(status: LabTestStatus): "default" | "success" | "warning" | "destructive" {
  switch (status) {
    case LabTestStatus.COMPLETED:
    case LabTestStatus.VERIFIED:
      return "success";
    case LabTestStatus.ORDERED:
    case LabTestStatus.SAMPLE_COLLECTED:
    case LabTestStatus.IN_PROGRESS:
      return "warning";
    case LabTestStatus.CANCELLED:
      return "destructive";
    default:
      return "default";
  }
}