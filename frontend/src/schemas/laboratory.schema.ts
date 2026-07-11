import { z } from "zod";

export const labTestSchema = z.object({
  testCode: z.string().min(1, "Test code is required"),
  testName: z.string().min(1, "Test name is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  sampleType: z.string().optional(),
  normalRange: z.string().optional(),
});

export type LabTestFormValues = z.infer<typeof labTestSchema>;

export const labOrderSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  labTestIds: z.array(z.string()).min(1, "Select at least one test"),
});

export type LabOrderFormValues = z.infer<typeof labOrderSchema>;

export const labResultSchema = z.object({
  labOrderItemId: z.string().min(1, "Order item is required"),
  resultValue: z.string().min(1, "Result value is required"),
  remarks: z.string().optional(),
  verifiedById: z.string().min(1, "Verifying staff member is required"),
});

export type LabResultFormValues = z.infer<typeof labResultSchema>;
