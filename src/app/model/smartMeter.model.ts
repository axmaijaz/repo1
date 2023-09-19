import { CustomerType, SmartMeterSkuDelivery } from '../Enums/smartMeter.enum';
import { ModalitiesDto } from './rpm.model';
import { SaleTypeEnum } from './rpm/phdevice-pricing.model';

export class DeviceVendorsListDto {
  id: number;
  name: string;
  code: string;
  healthCareDevices: any[];
}
export class Status {
  status_code: number;
  status_message: string;
}

export class ValidateSMResponseDto {
  is_valid: boolean;
  status: Status;
  device_model?: any;
  device_id?: any;
  imei?: any;
}

export class CreateOrderDevice {
  model: string;
  macAddress: string;
  serialNo: string;
  modality: string;
}
export class AddInventoryDto{
  vendorId: number;
  devices= new Array<CreateOrderDevice>();
}
export class Line {
  modality: ModalitiesDto; // extended
  quantity: number;
  sku: string;
  line_name: string;
  devices: CreateOrderDevice[] = [];

  // Sale information
  saleType: SaleTypeEnum = SaleTypeEnum.Sale;
  salePrice: number;
  shipping: number;
  discount: number;
  totalPrice: number;
  note: string;
  installmentCount: number;
  // transmissionCharges: number;
  freeTransmissionMonths: number;
}

export class CreateSMOrderDto {
  vendorId = 0;
  order_number = '';
  customer_name = '';
  customer_id = '';
  customer_type: CustomerType;
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  zipcode = '';
  country = '';
  shipping_method = 'UPS';
  lines: Line[];
  notes = '';
  isManual = false;
}
export class SMSKuDto {
  id: number;
  sku: string;
  description: string;
  modality?: ModalitiesDto;
  model: string;
  delivery: SmartMeterSkuDelivery;
  deviceVendorId: number;
  deviceVendorName?: string;
}
export class SMModelDto {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  isIotDevice: boolean;
  make: string;
  modality?: ModalitiesDto;
  deviceVendorId: number;
  deviceVendorName?: string;
}
export class SMOrderListDto {
  id: number;
  orderNumber: string;
  customerId: number;
  customerType: number;
  customerName: string;
  orderStatus: number;
  createdOn: string;
  createdUser: string;
  updatedOn: string;
  updatedUser: string;
  isActiveState: boolean;
  isDeletedState: boolean;
  tenantId: string;
  facilityName: string;
}

export class SMOrderDetailLine {
  id: number;
  order_number: string;
  line_item: number;
  sku: string;
  line_name: string;
  serial_number?: any;
  lot_number?: any;
  part_number?: any;
  control_solution_lot_number?: any;
  udc_number?: any;
  qty: number;
  device_model: string;
  imei?: any;
  addedToInventory: boolean;
}

export class SMOrderDetailsDto {
  id: number;
  order_number: string;
  customer_name: string;
  customer_id: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  shipping_method: string;
  date_created: string;
  tracking_number?: any;
  last_updated: string;
  notes?: any;
  carrier: string;
  lines: SMOrderDetailLine[] = [];
}

export class OrderDetailStatus {
  orders_in_response: number;
  status_code: number;
  status_message: string;
}

export class SMOrderDetailsRes {
  order: SMOrderDetailsDto;
  status: OrderDetailStatus;
}


export class THExcelFileDto {
  imei: number;
  modelNumber: string;
  serialNumber: string;
  battery : number;
  lastActive: number;
  po: string;
  signal: number;
  status: string;
}
