export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
    RESCHEDULED = "RESCHEDULED",
}

export interface AppointmentRequest {
    patientId: string;
    doctorId: string;
    appointmentDate: string; // ISO datetime string
    reason?: string;
    notes?: string;
    status?: AppointmentStatus;
}


export interface Appointment {
    id: string;
    appointmentDate: string;
    reason?: string;
    notes?: string;
    status: AppointmentStatus;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    createdAt: string;
    updatedAt?: string;
}