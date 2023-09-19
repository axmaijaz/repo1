import { ChronicIcd10CodeDto } from './Patient/patient.model';

export class CCMBillDto {
  id = 0;
  // // billNumber = 0;
  encounterClaimType: number | EncounterClaimType;
  // clinicEmrId = 0;
  cptCode = '';
  units: number;
  cptAdditionalCode = '';
  dateOfBirth = '';
  cptModifier = '';
  icd10Code = '';
  // chronicDiseases = new Array<ChronicIcd10CodeDto>();
  // serviceMonth = 0;
  timeCompleted = '';
  fqhcCode = '';
  // billingStatus = 0;
  serviceDate = '';
  encounterClaimDate = '';
  facilityPaymentAmount: number;
  billingProviderId = '';
  billingProviderName = '';
  consentDate = '';
  revokeDate = '';
  // careProviders = '';
  patientId = 0;
  patientName = '';
  facilityId = 0;
  facilityName = '';
  patientEmrId = '';
  caseStatus = 0;

  loading: boolean; // only for ui
  checked: boolean; // only for ui

  emrClaimSubmitted : boolean
  emrClaimSubmittedBy : ''
  emrClaimSubmittedDate : ""
  emrDocumentSubmitted : boolean
  emrDocumentSubmittedBy : ''
  emrDocumentSubmittedDate : ""

  primaryInsurancePayment= 0;
  secondaryInsurancePayment=0;
  patientPayment= 0
  totalPayment=0;
  patientResponseType= 0;
  paymentStatus=0;
  comments='';
  ['caseStatusStr']= '';
  ['patientResponseTypeStr']= '';
  ['paymentStatusStr']= '';
}
export enum EncounterClaimType {
  CCM = 0,
  RPM = 1,
  TCM = 2,
  PCM = 3,
  BHI = 4,
}
