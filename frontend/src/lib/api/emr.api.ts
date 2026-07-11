import { apiClient } from "./client";
import { ApiResponse } from "@/types/common.types";
import { MedicalRecord, MedicalRecordRequest, Prescription, PrescriptionRequest } from "@/types/emr.types";

const RECORD_BASE_PATH = "/medical-records";
const PRESCRIPTION_BASE_PATH = "/prescriptions";

export const medicalRecordApi = {
  create: async (data: MedicalRecordRequest): Promise<MedicalRecord> => {
    const response = await apiClient.post<ApiResponse<MedicalRecord>>(RECORD_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<MedicalRecord> => {
    const response = await apiClient.get<ApiResponse<MedicalRecord>>(`${RECORD_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getByPatient: async (patientId: string): Promise<MedicalRecord[]> => {
    const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(`${RECORD_BASE_PATH}/patient/${patientId}`);
    return response.data.data;
  },

  getByDoctor: async (doctorId: string): Promise<MedicalRecord[]> => {
    const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(`${RECORD_BASE_PATH}/doctor/${doctorId}`);
    return response.data.data;
  },

  update: async (id: string, data: MedicalRecordRequest): Promise<MedicalRecord> => {
    const response = await apiClient.put<ApiResponse<MedicalRecord>>(`${RECORD_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${RECORD_BASE_PATH}/${id}`);
  },
};

export const prescriptionApi = {
  create: async (medicalRecordId: string, data: PrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.post<ApiResponse<Prescription>>(
      `${PRESCRIPTION_BASE_PATH}/medical-record/${medicalRecordId}`,
      data
    );
    return response.data.data;
  },

  getByMedicalRecord: async (medicalRecordId: string): Promise<Prescription> => {
    const response = await apiClient.get<ApiResponse<Prescription>>(
      `${PRESCRIPTION_BASE_PATH}/medical-record/${medicalRecordId}`
    );
    return response.data.data;
  },

  update: async (id: string, data: PrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.put<ApiResponse<Prescription>>(`${PRESCRIPTION_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${PRESCRIPTION_BASE_PATH}/${id}`);
  },
};