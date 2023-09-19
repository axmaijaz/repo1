export enum CustomerType {
  Facility = 0,
  Patient = 1,
  CCHealth = 2
}
export enum DeviceVendorSkuDelivery {
  Commercial = 0,
  DirectToHome = 1,
  Both = 2
}
export enum SMOrderStatus {
  'In Process' = 0,
  'Awaiting Fulfillment' = 1,
  Shipped = 2,
  Closed = 3,
  Cancelled = 4,
  LabelCreated = 5,
  'In Transit' = 6,
  Delivered = 7,
  'Returned To Shipper' = 8,
  Exception = 9
}
export enum SmartMeterSkuDelivery {
  Commercial = 0,
  DirectToHome = 1,
}
