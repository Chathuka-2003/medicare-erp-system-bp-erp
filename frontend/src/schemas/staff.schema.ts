import { z } from "zod";
import { UserRole } from "@/types/auth.types";

export const doctorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  licenseNumber: z.string().min(1, "License number is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  specializationId: z.string().optional(),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;

export const staffSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format").optional().or(z.literal("")),
    phone: z.string().optional(),
    employeeNumber: z.string().min(1, "Employee number is required"),
    password: z.string().optional(),
    role: z.nativeEnum(UserRole, { error: "Role is required" }),
    active: z.boolean().optional(),
    departmentId: z.string().optional(),
    doctorId: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password.length >= 8,
    { message: "Password must be at least 8 characters", path: ["password"] }
  );

export type StaffFormValues = z.infer<typeof staffSchema>;

// Separate schema for the create flow, where password is mandatory
export const staffCreateSchema = staffSchema.and(
  z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
);