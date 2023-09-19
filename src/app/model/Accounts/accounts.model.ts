import { PaymentTermEnum, PaymentApplyEnum } from "src/app/Enums/billing.enum";

export class InvoiceForListDto {
  id: number;
  invoiceNumber: string;
  invoiceDate: Date | string;
  invoiceStatus: string;
  fixedMonthlyCharge: number;
  invoiceTotal: number;
  deposit: number;
  balance: number;
  totalAdjAmount: number;
  payment: number;

  payInvoiceLink: string;
  payPeriod: string;

  installmentsCount: number;
  installmentsAmount: number;
  transmissionChargesCount: number;
  transmissionCharges: number;
  reActivatedDevicesCount: number;
  reActivationCharges: number;

  monthId: number;
  yearId: number;
  // year: number;

  facilityId: number;
  facilityName: string;
  loading = false; // extended
}

export class AddEditCptChargesDto {
    id = 0;
    cptCode: string;
    defaultBillAmount: number;
    defaultFixCharge: number;
    fqhcCode = '';
    category = '';
    subCategory = '';
    // macLocality: string;
    description: string;
}
export class SyncFacilityClaimChargeDto
	{
		cptCodes: string;
		facilityName: string;
		facilityId = 0;
  }

export class FacilityClaimChargeReadAndUpdateDto {
  Id: number;
  cptCode: string;
  paymentTerm: PaymentTermEnum;
  paymentApply: PaymentApplyEnum;
  paymentAmount: number;
  percentage: number;
  verified: boolean;
  calculatedPercentageAmount: number;
  facilityId: number;
  category: string;
  subCategory: string;
}

  export class InvoiceVerificationListDto {
  facilityName: string;
	monthlyCharge: number;
  invoiceVerificationDto = new Array<FacilityClaimChargeReadAndUpdateDto>();
  }
