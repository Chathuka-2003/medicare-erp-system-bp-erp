import { UserRole } from "@/types/auth.types";

export const ALL_STAFF_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.HOSPITAL_ADMIN,
  UserRole.DOCTOR,
  UserRole.NURSE,
  UserRole.PHARMACIST,
  UserRole.LAB_TECHNICIAN,
  UserRole.RECEPTIONIST,
  UserRole.CASHIER,
  UserRole.INVENTORY_MANAGER,
  UserRole.HR_MANAGER,
  UserRole.ACCOUNTANT,
] as const;

export const ROLE_GROUPS = {
  DASHBOARD: ALL_STAFF_ROLES,
  PATIENT_MANAGEMENT: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.DOCTOR],
  APPOINTMENTS: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR, UserRole.NURSE],
  DOCTOR_DIRECTORY: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.DOCTOR, UserRole.HR_MANAGER],
  STAFF_MANAGEMENT: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.HR_MANAGER],
  EMR: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.NURSE],
  BILLING: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.CASHIER, UserRole.ACCOUNTANT],
  PHARMACY: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PHARMACIST],
  LABORATORY: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.LAB_TECHNICIAN, UserRole.DOCTOR],
  WARD: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.NURSE, UserRole.DOCTOR],
  INVENTORY: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.INVENTORY_MANAGER],
  REPORTS: [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.ACCOUNTANT],
} as const;

export const ROUTE_ACCESS_RULES = [
  { prefix: "/dashboard", roles: ROLE_GROUPS.DASHBOARD },
  { prefix: "/patients", roles: ROLE_GROUPS.PATIENT_MANAGEMENT },
  { prefix: "/appointments", roles: ROLE_GROUPS.APPOINTMENTS },
  { prefix: "/staff/doctors/new", roles: ROLE_GROUPS.STAFF_MANAGEMENT },
  { prefix: "/staff/doctors", roles: ROLE_GROUPS.DOCTOR_DIRECTORY },
  { prefix: "/staff/employees", roles: ROLE_GROUPS.STAFF_MANAGEMENT },
  { prefix: "/emr", roles: ROLE_GROUPS.EMR },
  { prefix: "/billing", roles: ROLE_GROUPS.BILLING },
  { prefix: "/pharmacy", roles: ROLE_GROUPS.PHARMACY },
  { prefix: "/laboratory", roles: ROLE_GROUPS.LABORATORY },
  { prefix: "/ward", roles: ROLE_GROUPS.WARD },
  { prefix: "/inventory", roles: ROLE_GROUPS.INVENTORY },
  { prefix: "/reports", roles: ROLE_GROUPS.REPORTS },
] as const;

export function hasRole(userRole: UserRole | undefined, allowed: readonly UserRole[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}

export function getAllowedRolesForPath(pathname: string): readonly UserRole[] | null {
  const normalizedPath = pathname === "/" ? pathname : pathname.replace(/\/$/, "");
  const rule = ROUTE_ACCESS_RULES.find(({ prefix }) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`));
  return rule?.roles ?? null;
}

export function canAccessPath(userRole: UserRole | undefined, pathname: string): boolean {
  const allowedRoles = getAllowedRolesForPath(pathname);
  if (!allowedRoles) return true;
  return hasRole(userRole, allowedRoles);
}
