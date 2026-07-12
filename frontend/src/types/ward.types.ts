export enum WardType {
  GENERAL = "GENERAL",
  ICU = "ICU",
  MATERNITY = "MATERNITY",
  PEDIATRIC = "PEDIATRIC",
  SURGICAL = "SURGICAL",
  PSYCHIATRIC = "PSYCHIATRIC",
  EMERGENCY = "EMERGENCY",
  ISOLATION = "ISOLATION",
}

export enum BedStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  CLEANING = "CLEANING",
}

export interface WardRequest {
  wardCode: string;
  wardName: string;
  wardType: WardType;
  totalBeds: number;
  floor?: string;
  description?: string;
}

export interface Ward {
  id: string;
  wardCode: string;
  wardName: string;
  wardType: WardType;
  totalBeds: number;
  availableBeds: number;
  floor?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BedRequest {
  wardId: string;
  bedNumber: string;
  roomNumber?: string;
  status?: BedStatus;
}

export interface Bed {
  id: string;
  bedNumber: string;
  status: BedStatus;
  roomNumber?: string;
  wardId: string;
  wardName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdmissionRequest {
  patientId: string;
  doctorId: string;
  bedId: string;
  diagnosis?: string;
  remarks?: string;
}

export interface Admission {
  id: string;
  admissionNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  diagnosis?: string;
  remarks?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  createdAt: string;
  updatedAt?: string;
}
