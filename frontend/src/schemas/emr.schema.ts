import { z } from "zod";
import { RecordType } from "@/types/emr.types";

const vitalsSchema = z.object({
  temperature: z.coerce.number().optional(),
  heartRate: z.coerce.number().int().optional(),
  bloodPressure: z.coerce.number().int().optional(),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
});

const diagnosisSchema = z.object({
  diagnosisName: z.string().min(1, "Diagnosis name is required"),
  description: z.string().optional(),
  severity: z.string().optional(),
});

export const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  recordDate: z.string().min(1, "Record date is required"),
  description: z.string().optional(),
  recordType: z.nativeEnum(RecordType, { error: "Record type is required" }),
  vitals: vitalsSchema.optional(),
  diagnoses: z.array(diagnosisSchema).optional(),
});

export type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.coerce.number().int().positive("Duration must be a positive number"),
});

export const prescriptionSchema = z.object({
  notes: z.string().optional(),
  items: z.array(prescriptionItemSchema).min(1, "At least one medicine item is required"),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;