import { z } from "zod";
import { AppointmentStatus } from "@/types/appointment.types";

export const appointmentSchema = z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    appointmentDate: z
        .string()
        .min(1, "Appointment date is required")
        .refine((val) => new Date(val) > new Date(), "Appointment date must be in the future"),
    reason: z.string().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;