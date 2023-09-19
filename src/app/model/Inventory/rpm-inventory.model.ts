import { PHDeviceStatus } from "src/app/Enums/phDevice.enum";
import { SaleTypeEnum } from "../rpm/phdevice-pricing.model";

export class RPMInventoryListDto {
  deviceName: string;
  vendorName: string;
  total: number;
  inHand: number;
  issued: number;
}
export class RpmPHDeviceListDto {
  id: number;
  patientName: string;
  manufacturer: string;
  model: string;
  macAddress: string;
  serialNo: string;
  installationDate: string;
  isIotDevice: boolean;
  cpT99453: boolean;
  modality: string;
  modalityName: string;
  status: PHDeviceStatus;
  inventoryStatus: number;
  lastReading: string;
  lastReadingUnit: string;
  lastReadingContext: string;
  lastReadingDate: string;
  patientId: number;
  facilityId: number;
  phDeviceModelId: number;
  place: string;
  remainingInstallmentsCount: number
  remainingInstallmentsAmount: number

  macDisplay: string; // Display Only
  ['StatusStr']= '';
}

export class TransferDeviceToFacilityDto {
  PhDeviceId: number;
  FacilityToId: number;
  FacilityFromId: number;
}



export class SaleDeviceToFacilityDto {
  phDeviceIds: number[] = [];
  requestNumber: string
  facilityToId: number
  saleType: SaleTypeEnum;
  salePrice: number
  saleDate: string
  shipping: number
  discount: number
  totalPrice: number
  note: string
  installmentCount: number
  freeTransmissionMonths: number
  trackingId: string
  shippingService: number
  shippingAmount: number; // duplicate
  successCount: number
  failCount: number
  details: string; // duplicate with note
}
export class PhDeviceInstallmentDto {
  id: number;
  month: number;
  year: number;
  installmentAmount: number;
  isWaivedOff: boolean;
  invoiceId?: number;
  phDeviceSaleId: number;
}

export class DeviceSaleDetailDto {
  id: number;
  saleDate: Date;
  saleType: SaleTypeEnum;
  salePrice: number;
  shipping: number;
  discount: number;
  waivedOffAmount: number;
  totalPrice: number;
  note: string;
  trackingId: string;
  installmentCount: number;
  transmissionCharges: number;
  phDeviceId: number;
  facilityId: number;
  phDeviceInstallments: PhDeviceInstallmentDto[] = [];
}
export class PHDeviceHistoryDto {
  id: number;
  actionType: number;
  manufacturer: string;
  model: string;
  macAddress?: any;
  serialNo: string;
  installationDate: Date;
  cpT99453: boolean;
  modality: string;
  status: number;
  inventoryStatus: number;
  dataTimeOut: number;
  lastDataReceived: Date;
  timeLapseNotifyLastRun: Date;
  timeLapseAlertCount: number;
  isIotDevice: boolean;
  patientId?: number;
  patientName: string;
  facilityId?: number;
  facilityName: string;
  phDeviceModelId: number;
  phDeviceId: number;
  updatedOn: Date;
  updatedUser: string;
  updatedUserName: string;
}


export class NewDeviceRequestDto {
  modalityCode: string
  quantity = 1;
  saleType: SaleTypeEnum = SaleTypeEnum.Sale
  salePrice: number
  shipping: number
  totalPrice: number
  note: string
  installmentCount: number
  status: number
  type: number
  address1: string
  address2: string
  city: string
  state: string
  country: string
  zipCode: string
  facilityId: number
  patientId: number
}

export class FilterDeviceRequestDto {
  RequestStatus: DeviceRequestStatus[] = [-1];
  FacilityId: number;
  StartDate: string
  EndDate: string;
  Assignee= 0;
}

export class DeviceRequestListDto {
  id: number
  requestNumber: string
  dateCreated: string
  modalityCode: string
  quantity: number
  saleType: number
  salePrice: number
  shipping: number
  totalPrice: number
  note: string
  installmentCount: number
  status: DeviceRequestStatus
  type: number
  address1: string
  address2: string
  city: string
  state: string
  country: string
  zipCode: string
  dateAssigned: string
  pemUserId: string
  pemUserName: string
  trackingId: any
  shippingService: number; // USPS 1, Fedex 2
  orderCreatedCount: number
  salesCreatedCount: number
  facilityId: number
  patientId?: number
}

export class DeviceRequestDetailDto {
  requestNo: string
  status: number
  quantity: number
  facilityName: string
  requestDate: string
  patientName: string
  type: number
  modality: string
  modalityDetailDtos: ModalityDetailDto[] = []
}

export class ModalityDetailDto {
  macAddress: string
  serialNo: string
  status: number
  modelName: string
  shippingService: number // USPS 1, Fedex 2
  trackingId: string
}


export enum DeviceRequestStatus {
  All = -1,
  Open = 0,
  WaitingForApproval = 1,
  InProcess = 2,
  Shipped = 3,
  Closed = 4
}
