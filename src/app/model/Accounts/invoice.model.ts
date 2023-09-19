import { SubCategory } from "./billing.model";
import { EncounterClaimType } from "../bills.model";

export class EncounterClaimsdto {
  id: number;
  encounterClaimType: EncounterClaimType;
  encounterClaimTypeKey: string;
  units: number;
  cptCode: string;
  fqhcCode?: string;
  cptAdditionalCode?: string;
  cptModifier?: string;
  icd10Code?: string;
  timeCompleted?: string;
  serviceDate: string;
  encounterClaimDate: string;
  facilityPaymentAmount: number;
  patientId: number;
  patientName?: string;
  dateOfBirth?: string | Date;
  billingProviderId: number;
  billingProviderName?: string;
  facilityId: number;
  facilityName?: string;
  invoiceId?: number;
  category: string;
  subCategory: string;
}
export class InvoicePreviewDto {
  fixedMonthlyCharge: number;
  invoiceTotal: number;
  installmentsCount: number;
  installmentsAmount: number;
  transmissionChargesCount: number;
  transmissionCharges: number;
  reActivatedDevicesCount: number;
  reActivationCharges: number;
  encounterClaimsDto: EncounterClaimsdto[] = [];
}
export class InvoicePreviewFilteredDto {
  key: string;
  value: EncounterClaimsdto[] = [];
  moduleTotal: number;
}

export class InvoicePageDto {
  searchParam = "";
  facilityId = 0;
  payerIds: number[] = [];
  filterBy = 1;
  patientStatus = [0];
  sortBy = "";
  pageSize = 10;
  pageNumber = 1;
}
export class FilterInvoice {
  invoiceId: number;
  cptCode = [""];
  serviceStartDate = "";
  serviceEndDate = "";
  paymentMode = [-1];
  caseStatus = -1;
  paymentStatus = -1;
  patientResponseType = -1;
  sortBy="";
  sortOrder= 0;
}
export class EncounterClaim {
  id: number;
  caseStatus: number;
  primaryInsurancePayment=0;
  secondaryInsurancePayment=0;
  patientPayment = 0;
  totalPayment: number;
  patientResponseType: number;
  paymentStatus: number;
  comments: string;
}
