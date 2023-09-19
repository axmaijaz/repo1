export interface PHDevicePricingListDto {
  id: number;
  modality: string;
  price: number;
  leasePrice: number;
  installmentsCount: number;
  // transmissionCharges: number;
  createdOn: Date;
  createdUser?: any;
  updatedOn: Date;
  updatedUser?: any;
  isActiveState: boolean;
  isDeletedState: boolean;
}
export class EditPHDevicePricingDto {
  id: number;
  price: number;
  leasePrice: number;
  installmentsCount: number;
  // transmissionCharges: number;
}
export class TransmissionChargesDto {
  id: number;
  transmissionCharges: number;
  reactivationCharges: number;
  createdOn: Date;
  createdUser: string;
  updatedOn: Date;
  updatedUser: string;
  isActiveState: boolean;
  isDeletedState: boolean;
}
export class EditTransmissionChargesDto {
  id: number; // only used when adding for facility
  transmissionCharges: number;
  reactivationCharges: number;
  facilityId: number; // only applicable when editing for facility not default
}

export enum SaleTypeEnum {
  Sale = 1,
  Lease = 2,
}
// export class MultipleSaleDeviceToFacilityDto {
//   phDeviceIds: [];
//   facilityToId: number;
//   saleType: number;
//   salePrice: number;
//   saleDate: string;
//   shipping: number;
//   discount: number;
//   totalPrice: number;
//   note: string;
//   installmentCount: number;
//   freeTransmissionMonths: number;
//   successCount: number;
//   failCount: number;
//   details: string;
// }
