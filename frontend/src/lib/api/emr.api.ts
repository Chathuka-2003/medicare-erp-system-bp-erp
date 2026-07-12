import { apiClient } from "./client";
import { ApiResponse } from "@/types/common.types";
import { Allergy, AllergyRequest, MedicalRecord, MedicalRecordRequest, Prescription, PrescriptionRequest } from "@/types/emr.types";

const RECORD_BASE_PATH = "/medical-records";
const PRESCRIPTION_BASE_PATH = "/prescriptions";
const ALLERGY_BASE_PATH = "/allergies";


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

export const allergyApi = {
  getByPatient: async (patientId: string): Promise<Allergy[]> => {
    const response = await apiClient.get<ApiResponse<Allergy[]>>(
      `${ALLERGY_BASE_PATH}/patient/${patientId}`
    );
    return response.data.data;
  },

  add: async (patientId: string, data: AllergyRequest): Promise<Allergy> => {
    const response = await apiClient.post<ApiResponse<Allergy>>(
      `${ALLERGY_BASE_PATH}/patient/${patientId}`,
      data
    );
    return response.data.data;
  },

  update: async (allergyId: string, data: AllergyRequest): Promise<Allergy> => {
    const response = await apiClient.put<ApiResponse<Allergy>>(
      `${ALLERGY_BASE_PATH}/${allergyId}`,
      data
    );
    return response.data.data;
  },

  delete: async (allergyId: string): Promise<void> => {
    await apiClient.delete(`${ALLERGY_BASE_PATH}/${allergyId}`);
  },
};
