import { z } from "zod";
import { LabTestCategory, LabOrderSubjectType } from "@/types/laboratory.types";

export const labTestSchema = z.object({
  testCode: z.string().min(1, "Test code is required"),
  testName: z.string().min(1, "Test name is required"),
  category: z.nativeEnum(LabTestCategory).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  sampleType: z.string().optional(),
  normalRange: z.string().optional(),
});

export type LabTestFormValues = z.infer<typeof labTestSchema>;

export const labOrderSchema = z.object({
  patientType: z.nativeEnum(LabOrderSubjectType).default(LabOrderSubjectType.PATIENT),
  patientId: z.string().optional(),
  staffId: z.string().optional(),
  otherName: z.string().optional(),
  doctorId: z.string().min(1, "Doctor is required"),
  labTestIds: z.array(z.string()).min(1, "Select at least one test"),
}).refine((data) => {
  if (data.patientType === LabOrderSubjectType.PATIENT && !data.patientId) {
    return false;
  }
  if (data.patientType === LabOrderSubjectType.STAFF && !data.staffId) {
    return false;
  }
  if (data.patientType === LabOrderSubjectType.OTHER && (!data.otherName || data.otherName.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Required subject detail field is missing",
  path: ["patientId"], // target the patient selector block for display
});

export type LabOrderFormValues = z.infer<typeof labOrderSchema>;

export const labResultSchema = z.object({
  labOrderItemId: z.string().min(1, "Order item is required"),
  resultValue: z.string().min(1, "Result value is required"),
  remarks: z.string().optional(),
  verifiedById: z.string().min(1, "Verifying staff member is required"),
});

export type LabResultFormValues = z.infer<typeof labResultSchema>;
