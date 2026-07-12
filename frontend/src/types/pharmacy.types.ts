export enum MedicineCategory {
    ANTIBIOTIC = "ANTIBIOTIC",
    ANALGESIC = "ANALGESIC",
    ANTIPYRETIC = "ANTIPYRETIC",
    ANTIHISTAMINE = "ANTIHISTAMINE",
    ANTIHYPERTENSIVE = "ANTIHYPERTENSIVE",
    ANTIDIABETIC = "ANTIDIABETIC",
    VITAMIN_SUPPLEMENT = "VITAMIN_SUPPLEMENT",
    CARDIOVASCULAR = "CARDIOVASCULAR",
    RESPIRATORY = "RESPIRATORY",
    GASTROINTESTINAL = "GASTROINTESTINAL",
    OTHER = "OTHER",
}

export interface MedicineRequest {
    medicineCode: string;
    medicineName: string;
    genericName?: string;
    manufacturer?: string;
    category: MedicineCategory;
    dosageForm?: string;
    strength?: string;
    unitPrice: number;
}

export interface Medicine {
    id: string;
    medicineCode: string;
    medicineName: string;
    genericName?: string;
    manufacturer?: string;
    category: MedicineCategory;
    dosageForm?: string;
    strength?: string;
    unitPrice: number;
    totalStock: number;
    createdAt: string;
    updatedAt?: string;
}

export interface MedicineStockRequest {
    batchNumber: string;
    quantityInStock: number;
    reorderLevel?: number;
    manufactureDate?: string;
    expiryDate: string;
    storageLocation?: string;
}

export interface MedicineStock {
    id: string;
    batchNumber: string;
    quantityInStock: number;
    reorderLevel?: number;
    manufactureDate?: string;
    expiryDate: string;
    storageLocation?: string;
}

export interface DrugDispenseItemDto {
    id?: string;
    medicineId: string;
    medicineName?: string;
    quantity: number;
    dosage?: string;
    instructions?: string;
}

export interface DrugDispenseRequest {
    patientId: string;
    prescriptionId?: string;
    pharmacistId: string;
    remarks?: string;
    items: { medicineId: string; quantity: number; dosage?: string; instructions?: string }[];
}

export interface DrugDispense {
    id: string;
    dispenseNumber: string;
    dispenseDate: string;
    remarks?: string;
    patientId: string;
    patientName: string;
    prescriptionId?: string;
    pharmacistId: string;
    pharmacistName: string;
    items: DrugDispenseItemDto[];
    createdAt: string;
    updatedAt?: string;
}