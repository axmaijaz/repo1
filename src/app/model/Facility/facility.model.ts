import { NewUser } from '../AppModels/userManger.model';
export class OrganizationDto {
  id = 0;
  name = '';
  contactEmail = '';
  contactNumber = '';
  website = '';
  dateAdded = '';
  facilities= [];
  shortName = '';
  primaryColor = ''
  secondaryColor = '';
  sideNavBarColor = '';
  isWhiteLabelled = false;
  logosPath = null;
  logosUpdatedDate = null;
  isSubVendor = false;
  organizationType: number;
}

export class FacilityDto {
  id = 0;
  address = '';
  city = '';
  facilityName = '';
  shortName = '';
  primaryColor = ''
  secondaryColor = '';
  sideNavBarColor = '';
  facilityDescription = '';
  website = '';
  hospitalType = '';
  facilityType = FacilityType.Traditional;
  phoneNumber = '';
  faxNumber = '';
  contactEmail = '';
  invoiceContactCCEmail= '';
  invoiceContactEmail= '';
  monthlyCharge: number;
  stateName: string;
  emrId = 1;
  zipCode = '';
  siteManager = new NewUser();
  isOrgWhiteLabelled: boolean;
  isSubVendor: boolean;
  // email = '';

  logosPath= ''; // only for list DTO
  organizationId = 0; // only for list DTO
  integrationEnabled: boolean; // only for list DTO
  scrapingEnabled: boolean; // only for list DTO
  practiceEmrId: string; // only for list DTO
  claimSubmission: boolean;
  clinicalDocumentSubmission: boolean;
  canSetCcmEnrollmentStatus: boolean;
  vitalsSubmission: boolean;

  isActiveState: boolean;
  isDeletedState: boolean;

}
export class EditFacilityIntegrationConfigDto {
  facilityId: number;
  integrationEnabled: boolean;
  scrapingEnabled: boolean;
  practiceEmrId: string;
  claimSubmission: boolean;
  clinicalDocumentSubmission: boolean;
  canSetCcmEnrollmentStatus: boolean;
  vitalsSubmission: boolean;
}
export class TansferAndDeleteFacilityUserDto {
  id = 0;
  assignToFacilityUser = 0;
}
export class CreateFacilityUserDto {
  id = 0;
  userId = '';
  firstName = '';
  lastName = '';
  middleName = '';
  email = '';
  userName = '';
  password = '';
  confirmPassword = '';
  countryCallingCode = "";
  title = '';
  isBillingProvider = false;
  assignedFacilities = new Array<string>();
  // ContactPreferenceId: number;
  phoneNo = '';
  // IsSiteManager: boolean;
  facilityId = 0;
  organizationId = 0;
  facilityName = '';
  facilityDto = new FacilityDto();
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
  isSiteManager: boolean;
  nameAbbrevation = '';
  hasAuthenticator = false;
  twoFactorEnabled = false;
  organization = new OrganizationDto();
  profileImagePath = '';
  profileImagePublicUrl = '';
  roles = '';
  isLocumCareProvider: boolean;
  isDisabled: boolean;
}
export class SendPhoneNoVerificationDto {
  phoneNumber: string;
  maskPhoneNumber: string;
  userName: string;
  countryCallingCode: string;
}
export class VerifyPhoneNumberDto {
  userName: string;
  code: string;
}
export class FeedbackDto {
  files: File[];
  facility: string;
  email: string;
  department: string;
  message: string;
  facilityId: number;
}

export class FacilityFormsDto {
  hasHumana = false;
  hasSuperBill = false;
  hasPWReport = false;
  hasAWReport = false;
}
export enum AwFormsENum {
  HumanaForm = 1,
  SuperBill = 2,
  PrimeWest = 3,
  AnnualWellness = 4,
}
export enum FacilityType {
  Traditional = 0,
  FQHC = 1,
  RHC = 2,
}

export class SetFacilityServiceConfigDto{
	id: number;
	chatService: boolean;
	telephonyCommunication: boolean;
	ccmService: boolean;
	rpmService: boolean;
	rpmComplianceMonitoring: boolean;
  enableNotifications: boolean;
	pcmService: boolean;
	bhiService: boolean;
	prcmService: boolean;
	tcmService: boolean;
  priorAuthorization: boolean;
  teleMedicine: boolean;
  awvService: boolean;
  autoTimeCapture: boolean;
  outOfRangeAlertDuration: number;
  timeLapseAlertDuration: number;
}
export class UserInActiveDto{
  userId: string;
  inActive: boolean;
}


export class MarkFacilityUsersSmsAlertDto {
  facilityUserIds: number[];
  facilityId: number;
}
