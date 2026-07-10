import { AppointmentStatus } from "@/types/appointment.types";

export function getAppointmentStatusVariant(status: AppointmentStatus): "default" | "success" | "warning" | "destructive" {
  switch (status) {
    case AppointmentStatus.COMPLETED:
    case AppointmentStatus.CONFIRMED:
      return "success";
    case AppointmentStatus.SCHEDULED:
    case AppointmentStatus.RESCHEDULED:
      return "warning";
    case AppointmentStatus.CANCELLED:
    case AppointmentStatus.NO_SHOW:
      return "destructive";
    default:
      return "default";
  }
}