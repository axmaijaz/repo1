export class SubCategory {
  subCatShortName: string;
  subCatDisplayName: string;
}

export class CptCategoriesLookupDto {
  catShortName: string;
  catDisplayName: string;
  subCategories: SubCategory[];
}
export class GetInvoiceDetailByDeviceDto {
  facilityId: number;
  month: number;
  year: number;
  category= 0;
}
export class GetInvoiceDetailByDevice{
  patientName: string;
  deviceSerialNumber: number;
  chargeAmount: number;
  amount: number;
  appliedDate: number;
}
