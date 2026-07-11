export enum RecordType {
  CONSULTATION = "CONSULTATION",
  FOLLOW_UP = "FOLLOW_UP",
  EMERGENCY = "EMERGENCY",
  SURGERY = "SURGERY",
  LAB_REVIEW = "LAB_REVIEW",
  ROUTINE_CHECKUP = "ROUTINE_CHECKUP",
  DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY",
}

export interface VitalsDto {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: number;
  weight?: number;
  height?: number;
}

export interface DiagnosisDto {
  id?: string;
  diagnosisName: string;
  description?: string;
  severity?: string;
}

export interface PrescriptionItemDto {
  id?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
}

export interface PrescriptionRequest {
  notes?: string;
  items: PrescriptionItemDto[];
}

export interface Prescription {
  id: string;
  notes?: string;
  medicalRecordId: string;
  items: PrescriptionItemDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface MedicalRecordRequest {
  patientId: string;
  doctorId: string;
  recordDate: string; // yyyy-MM-dd
  description?: string;
  recordType: RecordType;
  vitals?: VitalsDto;
  diagnoses?: DiagnosisDto[];
  prescription?: PrescriptionRequest;
}

export interface MedicalRecord {
  id: string;
  recordDate: string;
  description?: string;
  recordType: RecordType;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  vitals?: VitalsDto & { id?: string };
  diagnoses: DiagnosisDto[];
  prescription?: Prescription;
  createdAt: string;
  updatedAt?: string;
}