import { SortOrder } from "../Enums/filterPatient.enum";
import { RpmQualityCheckedEnum } from "../Enums/rpm.enum";
import { CareProvidersListDto } from "./Patient/patient.model";

export class RPMEncounterDto {
  id = 0;
  startTime = "";
  endTime = "";
  duration = "";
  facilityUserName = "";
  encounterDate: Date | string;
  note = "";
  patientId = 0;
  facilityUserId: number;
  billingProviderId: number;
  rpmServiceType: number;
  patientName = "";
  isProviderRpm= false;
  qualityChecked: number;
  rpmMonthlyStatus: number;
  encounterClaimId: boolean;
  qualityCheckedByName: string;
  qualityCheckedDate: string;
  patientCommunicationIds: number[] = []

}
export class ModalityDto {
  id = 0;
  name = "";
  code = "";
}
export class VendorDto {
  id = 0;
  name = "";
  healthCareDevices = [];
}
export class DeviceDto {
  id: number;
  deviceVendorId: number;
  deviceVendorCode: string;
  deviceName: string;
  description: string;
  price: number;
  isActive: boolean;
  // isGraphDisplay: boolean;
  imagePath: string;
  modalityId: number;
  modalityCode: string;
}
export class PatientHealthCareDeviceForListDto {
  id: number;
  planType: string;
  serialNumber: string;
  purchaseDate: Date | string;
  isActive: boolean;
  isGraphDisplay: boolean;
  deviceVendorId: number;
  deviceVendorCode: string;
  deviceName: string;

  description: string;
  // price: number;

  imagePath: string;

  dataTimeOut: number;

  isTimeLapseNotifySent: boolean;
  timeLapseNotifyLastRun: Date | string;

  termsAndConditionsId: number;
  patientId: number;
  healthCareDeviceId: number | null;
  healthCareDeviceInventoryId: number | null;
  modalityId: number;
  modalityCode: string;
}
export class IntigrationCheckList {
  id = 0;
  modalityId = 0;
  title = "";
  isMandatory = false;
  isChecked = false;
}
export class PurchasePlan {
  planType = 0;
  serialNumber = "";
  purchaseDate = "";
  amount = 0;
}
export class BloodPressure {
  minHighPressure: number;
  maxHighPressure: number;
  minLowPressure: number;
  maxLowPressure: number;
}
export class BloodPressureNew {
  id: number;
  minSystolic: number;
  maxSystolic: number;
  minDiastolic: number;
  maxDiastolic: number;
  dataTimeOut: number;
}
export class Weight {
  minWeight: number;
  maxWeight: number;
}
export class Schedule {
  dayName = 0;
  startHour = "";
  endHour = "";
}

export class TimeTable {
  careProviderId = 0;
  isAllWeekend = false;
  schedule = new Schedule();
}
export class Pulse {
  minBloodOxygen: number;
  maxBloodOxygen: number;
}
export class BloodGlucose {
  minGlucose: number;
  maxGlucose: number;
}
export class Activity {
  minSteps: number;
  maxSteps: number;
}
export class Notify {
  timeLapse: number;
  timeUnit = "";
}
export class ThresholdNew {
  bloodPressure = new BloodPressureNew();
  weight = new Weight();
  pulse = new Pulse();
  bloodGlucose = new BloodGlucose();
  activity = new Activity();
}
export class Threshold {
  bloodPressure = new BloodPressure();
  weight = new Weight();
  pulse = new Pulse();
  bloodGlucose = new BloodGlucose();
  activity = new Activity();
}
export class Alerts {
  threshold = new Threshold();
  notify = new Notify();
}
export class AlertsNew {
  threshold = new ThresholdNew();
  notify = new Notify();
}
export class ModalityConfDto {
  deviceInventoryId = 0;
  healthCareDeviceId = 0;
  patientId = 0;
  modalityId = 0;
  purchasePlan = new PurchasePlan();
  termsAndConditionsId = 0;
  alerts = new Alerts();
}
export class TermsAndConditionDto {
  id = 0;
  termType = 0;
  description = "";
}

export class RpmDevicesVendors {
  static Omron = "OM";
  static Withings = "WI";
  static IHealth = "IH";
  static Dexcom = "DX";
}
export class ModalitiesDto {
  static BloodPressure = "BP"; // blooad pressure
  static Weight = "WT";
  static PulseOximetry = "PO";
  static BloodGlucose = "BG";
  static Activity = "AT";
}
export class BPDeviceDataDto {
  id = 0;
  bpl = 0;
  highPressure = 0;
  heartRate = 0;
  isArr = 0;
  lowPressure = 0;
  lat = 0;
  lon = 0;
  dataID = "";
  measurementDate = "";
  note = "";
  lastChangeTime = "";
  dataSource = "";
  userid = "";
  timeZone = "";
  bpUnit = "";
  patientId = 0;
  patient: any;
  deviceVendorId = 0;
  deviceVendor: any;
}

export class BGDeviceDataDto {
  id = 0;
  bg = 0;
  dinnerSituation = "";
  drugSituation = "";
  measurementDate = "";
  note = "";
  lat = 0;
  lon = 0;
  dataID = "";
  lastChangeTime = "";
  dataSource = "";
  userid = "";
  timeZone = "";
  status = "";
  trend: any;
  trendRate = 0;
  bgUnit = "";
  patientId = 0;
  patient = "";
  deviceVendorId = 0;
  deviceVendor: any;
}
export class ActivityDataDto {
  id: number;

  steps: number;
  distanceTraveled: number;
  measurementDate: Date | string;
  note: string;
  lon: number;
  lat: number;
  dataID: string;
  calories: number;
  lastChangeTime: Date | string;
  dataSource: string;
  userid: string;
  timeZone: string;

  distanceUnit: string;

  patientId: number;

  deviceVendorId: number;

  isOutOfRange: boolean;
  isNotificationSent: boolean;
}
export class PulseOximetryDataDto {
  id: number;

  bloodOxygen: number; // Blood Oxygen
  heartRate: number; // Heart Rate
  measurementDate: Date | string;
  note: string;
  lon: number;
  lat: number;
  dataID: string;
  lastChangeTime: Date | string;
  dataSource: string;
  userid: string;
  timeZone: string;

  bOUnit: string;

  patientId: number;

  deviceVendorId: number;

  isOutOfRange: boolean;
  isNotificationSent: boolean;
}
export class WeightDataDto {
  id: number;
  BMI: number;
  boneValue: number;
  DCI: number; // daily caloric intake
  fatValue: number;
  muscaleValue: number;
  waterValue: number;
  weightValue: number;
  dataID: string;
  measurementDate: Date | string;
  note: string;
  lastChangeTime: Date | string;
  dataSource: string;
  userid: string;
  timeZone: string;

  weightUnit: string;
  patientId: number;

  deviceVendorId: number;

  isOutOfRange: boolean;
  isNotificationSent: boolean;
}
export class DeletePatientDeviceDto {
  cPatientDeviceId = 0;
}

export class RpmPatientsScreenParams {
  pageNumber = 1;
  searchParam = "";
  pageSize = 10;
  customListId = 0;
  filterBy = 1;
  patientStatus = 1;
  rpmStatus = 0;
  lastReadingStartDate = "";
  lastReadingEndDate = "";
  lastLogStartDate = "";
  lastLogEndDate = "";
  careProviderId = 0;
  billingProviderId = 0;
  careFacilitatorId = 0;
  rpmCareCoordinatorId = 0;
  // facilityUserId = 0;
  facilityId = 0;
  filteredMonth = "";
  // serviceMonth: number;
  // serviceYear: number;
  serviceMonth = new Date().getMonth() + 1;
  serviceYear = new Date().getFullYear();
  sortBy = "";
  diseaseIds = "";
  sortOrder: SortOrder = 0;
  section = "";
  duration = 0;
  // bhiStatus = -1;
  // bhiCareManagerId = 0;
  // PsychiatristId = 0;
  // facilityUserId: number;
  showAll = false;

  Assigned = 0;
  DateAssignedFrom = "";
  DateAssignedTo = "";
  rpmTimeRange = [-1];
  FromTransmissionDays = 0;
  ToTransmissionDays = 31;

  showInActivePatientsWithReadings = false;
  showActivePatientsWithNoReadings = false;
  rpmMonthlyStatus = [''];
  communicationConsent = 0;
  patientNotRespond = 0;
  // insurancePlanId = 0;
  // measureIds: number[] = [];
  // status: GapStatus = -1;
  // lastDoneFrom: Date | string | null = '';
  // lastDoneTo: Date | string | null = '';
  // nextDueFrom: Date | string | null = '';
  // nextDueTo: Date | string | null = '';
  // chronicConditionIds: number[] = [];
}
export enum ComplaintStatusColor {
  Red = 1,
  Orange = 2,
  Green = 3,
}
export class RpmPatientsListDto {
  id = 0;
  patientEmrId = "";
  checked: boolean;
  emrId = "";
  profileStatus: boolean;
  dateOfBirth : Date | string;

  fullName = "";
  lastName = "";
  firstName = "";
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPrimaryPhoneNo: string;
  emergencyContactSecondaryPhoneNo: string;
  insurancePlanName: string;
  currentMonthCompletedTime: number;
  email = "";
  rpmDateAssigned = "";
  rpmStatus = 0;
  rpmMonthlyStatus = 0;
  patientStatus = 0;
  qualityChecked: RpmQualityCheckedEnum = RpmQualityCheckedEnum.Failed;
  lastReadingDate = "";
  lastLogDate = "";
  billingProviderId = 0;
  billingProviderName = "";
  billingProviderNameAbbreviation = "";
  careFacilitatorNameAbbreviation = "";
  complaintStatusColor: ComplaintStatusColor; // careProviderNames = new Array<string>();
  careFacilitatorName = "";
  careFacilitatorId? = 0;
  // careProviderIds = new Array<number>();
  // careProviders = new Array<CareProvidersListDto>();
  rpmCareCoordinatorNames = new Array<string>();
  rpmCareCoordinatorIds = new Array<number>();
  rpmCareCoordinators = new Array<RPMCareCoordinatorForDisplay>();
  facilityId = 0;
  isRPMRevoked: boolean;
  modality = "";
  chronicDiseasesIds = new Array<number>();
  patientId = 0;
  transmissionDays: number;
  qualityCheckStatus: number;
  telephonyCommunication: boolean;
  unAssociatedCommunication: number;
  ["rpmStatusString"]: string;
  ["rpmMonthlyStatusString"]: string;

}
export class RPMCareCoordinatorForDisplay {
  rpmCareCoordinatorId: number;
  fullName: string;
  nameAbbreviation: string;
}
export class EditDateAssignedParamDto {
  patientId: number;
  dateAssigned: Date | string | null;
  facilityId: number;
}
export class AlertAddressedByDto {
  alertId: number;
  facilityUserId: number;
}
export class RpmReadingDto {
  id: 0;
  modalityName = "";
  reading = "";
  measurementDate = "";
  threshold = "";
  patientId = 0;
  patientName = "";
  // PatientName { get; set; }
  careProvider = "";
}

export class RmpReadingsSearchParam {
  searchParam = "";
  careProviderId = 0;
  pageNumber = 1;
  pageSize = 10;
  patientId = 0;
  modalityCode = "";
  fromReadingDate = "";
  toReadingDate = "";
  sortBy = "";
  // diseaseIds = '';
  sortOrder: SortOrder = 0;
}

export class RPMDashboardSection {
  totalCount: number;
  subCountOne: number;
  subCountTwo: number;
  subCountThree: number;
  subCountFour: number;
}
export class RmpDashboardParamsDto {
  FilteredMonth = "";
  FacilityId: number;
  CareCoordinatorId: number;
  CareFacilitatorId: number;
  status: number;
}
export class RmpDashboardDataDto {
  activePatients: number;
  notStartedReadingsPatients: number;
  notStartedTimePatients: number;
  section_A = new RPMDashboardSection();
  section_B = new RPMDashboardSection();
  section_C = new RPMDashboardSection();
}
export class DexcomEgvDataResultDto {
  recordType: string
  recordVersion: string
  userId: string
  records: EgvRecord[]
}

export class EgvRecord {
  recordId: string
  systemTime: string
  displayTime: string
  transmitterId: string
  transmitterTicks: number
  value: number
  trend: string
  trendRate: number
  unit: string
  rateUnit: string
  displayDevice: string
  transmitterGeneration: string
}
export class DexcomEventResponseDto {
  recordType: string
  recordVersion: string
  userId: string
  records: DexcomeEventRecord[]
}

export class DexcomeEventRecord {
  recordId: string
  systemTime: string
  displayTime: string
  eventStatus: string
  eventType: string
  eventSubType: string
  value: number
  unit: string
  transmitterId: string
  transmitterGeneration: string
  displayDevice: string
}
export class DexcomCalibrationResponseDto {
  recordType: string
  recordVersion: string
  userId: string
  records: CalibrationRecord[]
}

export class CalibrationRecord {
  systemTime: Date | string;
  displayTime: Date | string;
  unit: string;
  value: number;
  recordId: string;
  displayDevice: string
  transmitterId: string
  transmitterTicks: number
  transmitterGeneration: string
}
export class RPMDeviceListDtoNew {
  id: number;
  manufacturer: string;
  model: string;
  macAddress: string;
  serialNo: string;
  modality: string;
  modalityName: string;
  status: number;
  lastReading: string;
  lastReadingUnit: string;
  lastReadingDate: string;
  patientId: number;
}

export class CareGapsReadingsForRPMDto {
  bmi: GapHeaderModel;
  a1C: GapHeaderModel;
  dn: GapHeaderModel;
  ld: GapHeaderModel;
  de: GapHeaderModel;
}

export class GapHeaderModel {
  lastReadingDate: Date | string | null;
  value = "";
  valueInNumber: number;
  NoOfMonth: number;
}

export class BloodGlucoseList {
  id: number;
  bg: number;
  dinnerSituation: string;
  drugSituation?: any;
  measurementDate: string;
  note?: any;
  lat: number;
  lon: number;
  dataID?: any;
  lastChangeTime: string;
  dataSource?: any;
  userid?: any;
  timeZone?: any;
  status?: any;
  trend?: any;
  trendRate?: any;
  bgUnit: string;
  patientId: number;
  patient?: any;
  deviceVendorId: number;
  deviceVendor?: any;
  isOutOfRange: boolean;
  isNotificationSent: boolean;
}

export class BloodPressureList {
  id: number;
  bpl: number;
  highPressure: number;
  heartRate: number;
  isArr: number;
  lowPressure: number;
  lat: number;
  lon: number;
  dataID?: any;
  measurementDate: string;
  note?: any;
  lastChangeTime: string;
  dataSource?: any;
  userid?: any;
  timeZone?: any;
  bpUnit?: any;
  patientId: number;
  patient?: any;
  deviceVendorId: number;
  deviceVendor?: any;
  isOutOfRange: boolean;
  isNotificationSent: boolean;
}

export class RPMCopyDto {
  rpmEncounters: RPMEncounterDto[] = [];
  bloodGlucoseList: BloodGlucoseList[] = [];
  bloodPressureList: BloodPressureList[] = [];
  cgmpPerDayAvgList: any;
}
export class SetupRPMDeviceResponseDto {
  id = 0;
  serialNo: string;
  macAddress: string;
  model: string;
  installationDate: Date | string;
  cpT99453: boolean;
  isIotDevice = false;
}
export class SetupRPMDeviceParamsDto {
  id: number;
  patientId: number;
  deviceType: string;
  serialNo: string;
  macAddress: string;
  model: string;
  installationDate: Date | string;
  isIotDevice: boolean;
  cpt99453: boolean;
}

export class PHDeviceDto {
  id: number;
  manufacturer: string;
  model: string;
  macAddress: string;
  serialNo: string;
  chargeDeviceInstallation: string;
  installationDate: Date | string;
  cpT99453: boolean;

  modality: string; // Name suggested by Suhaib (Should be Speciality)
  modalityName: string;

  // status: PHDeviceStatus;
  lastReading: string;
  lastReadingUnit: string;
  lastReadingContext: string;
  lastReadingDate: string;

  patientId: number;
}
export class EditRpmReadingDto {
  readingId: number;
  patientId: number;
  modality: string;
  measurementDate: string;
}
export class RpmFilterDto {
  rpmStatus: number;
  rpmCoordinator: number;
  rpmFacilitator: number;
}
export class RpmDownloadDataDto {
  patientIds = [];
  monthId: number;
  yearId: number;
  allPatients: boolean;
  facilityId: number;
  isCompleted = false;
  isActive = false;
}
export class HealthGuideDto {
  id: number;
  title: string;
  url: string;
}
export class RpmMonthlyStatusChangeDto {
  patientId: number;
  rpmMonthlyStatus: number;
}
export class RpmStatusHistoryDto {
  id: number;
  status: number;
  updatedBy: string;
  updatedOn: string;
}
export class RPMQualityCheckModalDto{
  patientId: number;
  isPrDashboard= false;
}
export class SetIsBleEnabled{
  patientId: number;
  enable: boolean;
}
