export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum BloodGroup {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export interface AddressDto {
  street?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export interface InsuranceDto {
  providerName?: string;
  policyNumber?: string;
  coverageType?: string;
}

export interface NextOfKinDto {
  name: string;
  relationship?: string;
  phone?: string;
  address?: string;
}

export interface PatientRequest {
  firstName: string;
  lastName?: string;
  dateOfBirth: string; // ISO date string (yyyy-MM-dd)
  gender?: Gender;
  bloodGroup?: BloodGroup;
  nic?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  address?: AddressDto;
  insurance?: InsuranceDto;
  nextOfKin?: NextOfKinDto;
}

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName?: string;
  dateOfBirth: string;
  age?: number;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  nic?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  address?: AddressDto;
  insurance?: InsuranceDto;
  nextOfKin?: NextOfKinDto;
  createdAt: string;
  updatedAt?: string;
}

export interface PatientSearchParams {
  patientNumber?: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  phone?: string;
  email?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  dobFrom?: string;
  dobTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}