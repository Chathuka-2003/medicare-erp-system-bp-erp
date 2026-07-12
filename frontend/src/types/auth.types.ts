export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  HOSPITAL_ADMIN = "HOSPITAL_ADMIN",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  PHARMACIST = "PHARMACIST",
  LAB_TECHNICIAN = "LAB_TECHNICIAN",
  RECEPTIONIST = "RECEPTIONIST",
  CASHIER = "CASHIER",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  HR_MANAGER = "HR_MANAGER",
  ACCOUNTANT = "ACCOUNTANT",
  PATIENT = "PATIENT"
}

export interface LoginResponse {
  token: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
