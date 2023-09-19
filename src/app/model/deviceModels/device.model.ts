import { DeviceDto } from '../rpm.model';

export class HealthCareDeviceModalityJoins {
  healthCareDeviceId = 0;
  modalityId = 0;
  modality: any;
}
export class AdminDevicesListDto extends DeviceDto {
  healthCareDeviceModalityJoins = new HealthCareDeviceModalityJoins();
  healthCareDeviceInventory = new Array<DeviceInventoryDto>();
  deviceInventory = new Array<DeviceInvetoryidDto>();
}
export class DeviceInvetoryidDto {
  deviceInventoryId = 0;
  serialNumber= new Array<string>();
}
export class DevicesSerialNosDto {
  serialNumbers = new Array<string>();
}
export class IssueDevicesDto {

  deviceInventoryId = new Array<any>();
  facilityId: number;
}
export class AddDeviceDto {
  id = 0;
  deviceName = '';
  description = '';
  price: number;
  imagePath: any;
  deviceVendorId: number;
  modalityId: number;
  serialNumber = '';
}
export class DeviceInventoryListDto {
  deviceId = 0;
  deviceName = '';
  companyName = '';
  modality = '';
  stockCount = 0;
  deviceVendorId = 0;
}

export class DeviceInventoryDto {
  id = 0;
  serialNumber = '';
  facilityId = 0;
  facility: any;
  healthCareDeviceId = 0;
  patientId = 0;
  patient: any;
}
