export class PatientDetailsData {
  Name: string;
  FacilityName: string;
  EncounterDate: string;
  DurationTicks: number;
}
export class PatientDetailedReportDto {
    id = '';
    payableCount = 0;
    primaryInsurancePayment = 0;
    secondaryInsurancePayment = 0;
    primaryInsuranceAllowed = 0;
    secondaryInsuranceAllowed = 0;
    patientPaymentAmount = 0;
    totalCharges = 0;
    adjustedCharges = 0;
    receipts = 0;
    patientBalance = 0;
    insuranceBalance = 0;
    totalBalance = 0;
    procedureCodeCategory = '';
    procedureCode = '';
    procedureName = '';
    schedulingProviderName =  '';
    renderingProviderName =  '';
    serviceType = '';
    subServiceType = '';
    SecondaryClaims = 0;
    PrimaryClaims = 0;
    batchNumber = '';
    patientName = '';
    lastModifiedDate = '';
    createdDate = '';
    postingDate = '';
    primaryInsurancePaymentPostingDate = '';
    serviceStartDate = '';

    primaryClaimsPCP = 0;
    EncountersPCP = 0;
}

export class MonthlyChargesDto {
    month: string;
    serviceLocationName: string;
    countPatients = 0;
    allowedAmount = 0;
    collectedAmount = 28809.33;
    countPrimaryClaims = 0;
    countSecondaryClaims = 0;
    countPatientClaims = 0;
    totalDays = 47;
    percentage = 0;
    claimID: string;
    monthlyReport = '';
}
export class ReportsFilterDto {
  duration = 'Month';
  billingProviderId = 0;
  startDate =  '';
  endDate =  '';
  year: number;
  lastMonth: number;
  lastQuarter = '';
  filterBy = 'ServiceStartDate';
}

export class ProviderClinicalServiceReportDto {
  adjustedCharges: number;
allowedAmount: number;
category = "";
claimID = "";
collectedAmount: number;
countPatientClaims: number;
countPatients: number;
countPrimaryClaims: number;
countSecondaryClaims: number;
date = "";
insuranceBalance: number;
month = "";
patientBalance: number;
patientName = "";
primaryInsuranceInsurancePayment: number;
procedureCodeID = "";
schedulingProviderName = "";
serviceDate = "";
serviceLocationName = "";
status = "";
subCategory = "";
// primaryInsuranceInsurancePayment
secondaryInsuranceInsurancePayment: number;
tertiaryInsuranceInsurancePayment: number;
patientPaymentAmount: number;
}

export class PaymentReportDto {
  adjustedCharges: number;
category = "";
claimID = "";
date = "";
month: "";
name: "";
patientName = "";
payments: number;
posted: number;
procedureCodeID = "";
subCategory = "";
}
