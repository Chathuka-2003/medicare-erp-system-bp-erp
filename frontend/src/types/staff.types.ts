import { UserRole } from "@/types/auth.types";

export interface DepartmentLookup {
  id: string;
  name: string;
}

export interface SpecializationLookup {
  id: string;
  name: string;
}

export interface DoctorRequest {
  firstName: string;
  lastName?: string;
  licenseNumber: string;
  email?: string;
  phone?: string;
  departmentId: string;
  specializationId?: string;
  
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName?: string;
  licenseNumber: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  specializationId?: string;
  specializationName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StaffRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employeeNumber: string;
  password?: string; // required on create, optional on update
  role: UserRole;
  active?: boolean;
  departmentId?: string;
  doctorId?: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employeeNumber: string;
  role: UserRole;
  active: boolean;
  departmentId?: string;
  departmentName?: string;
  doctorId?: string;
  doctorName?: string;
  createdAt: string;
  updatedAt?: string;
}