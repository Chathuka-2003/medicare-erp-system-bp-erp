import { z } from "zod";
import { WardType } from "@/types/ward.types";

export const wardSchema = z.object({
  wardCode: z.string().min(1, "Ward code is required"),
  wardName: z.string().min(1, "Ward name is required"),
  wardType: z.nativeEnum(WardType, { error: "Ward type is required" }),
  totalBeds: z.coerce.number().int().positive("Total beds must be positive"),
  floor: z.string().optional(),
  description: z.string().optional(),
});

export type WardFormValues = z.infer<typeof wardSchema>;

export const bedSchema = z.object({
  wardId: z.string().min(1, "Ward is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  roomNumber: z.string().optional(),
});

export type BedFormValues = z.infer<typeof bedSchema>;

export const admissionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  bedId: z.string().min(1, "Bed is required"),
  diagnosis: z.string().optional(),
  remarks: z.string().optional(),
});

export type AdmissionFormValues = z.infer<typeof admissionSchema>;
