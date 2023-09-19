export class InsurancePlanDto {
  id: number;
  name: string;

  payerId: number;
  payerName: string;

  facilityId: number;

  insuranceGapIds: number[];
}

export class AddInsurancePlanDto {
  id = 0;
  payerName: string;
  name: string;

  facilityId: number;
  payerId: number;
  isCcmCovered: boolean;
  isRpmCovered: boolean;

  // selectedGapIds = new Array<number>();
  selectedGaps = new Array<SelectedGapDto>();
}
export class SelectedGapDto {
	id: number;
	guideline: string;
}
export interface PayersListDto {
  id: number;
  payerId: string;
  payerName: string;
  insurancePlans: any[];
}
export class CareGapDto {
  id: number;
  measureName: string;
  code: string;
  isMedicareGap: boolean;
  guideline: string;
}
