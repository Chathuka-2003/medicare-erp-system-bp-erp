import { z } from "zod";
import { Gender, BloodGroup } from "@/types/patient.types";

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  postalCode: z.string().optional(),
});

const insuranceSchema = z.object({
  providerName: z.string().optional(),
  policyNumber: z.string().optional(),
  coverageType: z.string().optional(),
});

const nextOfKinSchema = z.object({
  name: z.string().min(1, "Next of kin name is required"),
  relationship: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => new Date(val) < new Date(), "Date of birth must be in the past"),
  gender: z.nativeEnum(Gender).optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  nic: z
    .string()
    .regex(/^([0-9]{9}[vVxX]|[0-9]{12})$/, "Invalid NIC format")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9+ -]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  emergencyContact: z.string().optional(),
  address: addressSchema.optional(),
  insurance: insuranceSchema.optional(),
  nextOfKin: nextOfKinSchema.optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;