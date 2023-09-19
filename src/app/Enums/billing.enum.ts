export enum PaymentTermEnum {
  "Fix" = 0,
  "Percent" = 1,
}
export enum PaymentApplyEnum {
  "CPT" = 0,
  "Service" = 1,
}
export enum InvoicePaymentMode {
  "Primary Insurance" = 0,
  "Secondary Insurance" = 1,
  "Patient Payment" = 2,
}
export enum InvoiceCaseStatus {
  "Open" = 0,
  "In Progress" = 1,
  "Closed" = 2,
}
export enum PaymentStatus {
  "Open" = 0,
  "Fully Paid" = 1,
  "Partially Paid" = 2,
  "Denied" = 3,
}
export enum InvoicePatientResponseType {
  "Not Set" = 0,
  "Deductible" = 1,
  "Copay" = 2,
  "Coinsurance" = 3,
  // "Responsibility" = 4,
  "No Responsibility" = 5,
}
export enum InvoiceCategoryByDevice {
  Installments = 0,
  Transmission = 1,
  Reactivation = 2,
}
