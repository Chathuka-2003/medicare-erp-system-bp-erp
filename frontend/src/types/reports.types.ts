export enum ReportType {
  PATIENT_SUMMARY = "PATIENT_SUMMARY",
  APPOINTMENT_SUMMARY = "APPOINTMENT_SUMMARY",
  REVENUE_SUMMARY = "REVENUE_SUMMARY",
  INVENTORY_SUMMARY = "INVENTORY_SUMMARY",
  STAFF_SUMMARY = "STAFF_SUMMARY",
  ADMISSION_SUMMARY = "ADMISSION_SUMMARY",
  LAB_TEST_SUMMARY = "LAB_TEST_SUMMARY",
  PHARMACY_SUMMARY = "PHARMACY_SUMMARY",
  CUSTOM = "CUSTOM",
}

export interface ReportRequest {
  reportName: string;
  reportType: ReportType;
  reportParameters?: string;
  description?: string;
  generatedById: string;
}

export interface Report {
  id: string;
  reportName: string;
  reportType: ReportType;
  reportParameters?: string;
  description?: string;
  fileName?: string;
  filePath?: string;
  fileFormat?: string;
  generatedAt?: string;
  generatedById: string;
  generatedByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalStaff: number;
  todaysAppointments: number;
  upcomingAppointments: number;
  totalRevenueCollected: number;
  totalOutstandingBalance: number;
  unpaidInvoiceCount: number;
  currentAdmissions: number;
  totalBeds: number;
  availableBeds: number;
  lowStockMedicineCount: number;
  lowStockItemCount: number;
  pendingLabOrders: number;
}
