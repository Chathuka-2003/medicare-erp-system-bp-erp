//Types of Billing
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  INSURANCE = "INSURANCE",
  ONLINE_PAYMENT = "ONLINE_PAYMENT",
  CHEQUE = "CHEQUE",
}

export interface InvoiceItemDto {
  id?: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface InvoiceRequest {
  patientId: string;
  appointmentId?: string;
  invoiceDate: string; // yyyy-MM-dd
  dueDate?: string;
  items: { itemName: string; quantity: number; unitPrice: number }[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  items: InvoiceItemDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRequest {
  invoiceId: string;
  amount: number;
  paymentDate?: string;
  paymentMethod: PaymentMethod;
  remarks?: string;
}

export interface Payment {
  id: string;
  paymentReference: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  remarks?: string;
  invoiceId: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InsuranceClaimRequest {
  patientId: string;
  invoiceId?: string;
  insuranceProvider: string;
  claimAmount: number;
  approvedAmount?: number;
  claimDate: string;
  settlementDate?: string;
  status?: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  approvedAmount?: number;
  claimDate: string;
  settlementDate?: string;
  status?: string;
  patientId: string;
  patientName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt?: string;
}