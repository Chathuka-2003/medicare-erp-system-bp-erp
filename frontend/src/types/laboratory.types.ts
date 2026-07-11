export enum LabTestStatus {
  ORDERED = "ORDERED",
  SAMPLE_COLLECTED = "SAMPLE_COLLECTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  VERIFIED = "VERIFIED",
  CANCELLED = "CANCELLED",
}

export interface LabTestRequest {
  testCode: string;
  testName: string;
  category?: string;
  description?: string;
  price: number;
  sampleType?: string;
  normalRange?: string;
}

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  category?: string;
  description?: string;
  price: number;
  sampleType?: string;
  normalRange?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LabOrderRequest {
  patientId: string;
  doctorId: string;
  labTestIds: string[];
}

export interface LabOrderItemDto {
  id: string;
  labTestId: string;
  testName: string;
  resultAvailable: boolean;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: LabTestStatus;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderItems: LabOrderItemDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface LabResultRequest {
  labOrderItemId: string;
  resultValue: string;
  remarks?: string;
  verifiedById: string;
}

export interface LabResult {
  id: string;
  labOrderItemId: string;
  testName: string;
  resultValue: string;
  remarks?: string;
  completedDate?: string;
  verifiedById: string;
  verifiedByName: string;
  createdAt: string;
  updatedAt?: string;
}
