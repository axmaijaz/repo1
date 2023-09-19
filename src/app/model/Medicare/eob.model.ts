export class Meta {
  lastUpdated: Date;
}

export class Link {
  relation: string;
  url: string;
}

export class Meta2 {
  lastUpdated: Date;
}

export class ValueMoney {
  value: number;
  system: string;
  code: string;
}

export class ValueIdentifier {
  system: string;
  value: string;
}

export class ValueCoding {
  system: string;
  code: string;
  display: string;
}

export class Extension {
  url: string;
  valueMoney: ValueMoney;
  valueIdentifier: ValueIdentifier;
  valueCoding: ValueCoding;
}

export class Identifier {
  system: string;
  value: string;
}

export class Coding {
  system: string;
  code: string;
  display: string;
}

export class Type {
  coding: Coding[];
}

export class Patient {
  reference: string;
}

export class BillablePeriod {
  start: string;
  end: string;
}

export class Coding2 {
  system: string;
  code: string;
  display: string;
}

export class DiagnosisCodeableConcept {
  coding: Coding2[];
}

export class Coding3 {
  system: string;
  code: string;
  display: string;
}

export class Type2 {
  coding: Coding3[];
}

export class Diagnosis {
  sequence: number;
  diagnosisCodeableConcept: DiagnosisCodeableConcept;
  type: Type2[];
}

export class Coverage {
  reference: string;
}

export class Insurance {
  coverage: Coverage;
}

export class ValueCoding2 {
  system: string;
  code: string;
  display: string;
}

export class ValueQuantity {
  value: number;
}

export class Extension2 {
  url: string;
  valueCoding: ValueCoding2;
  valueQuantity: ValueQuantity;
}

export class Coding4 {
  system: string;
  code: string;
  display: string;
}

export class Category {
  coding: Coding4[];
}

export class Coding5 {
  system: string;
  version: string;
  code: string;
  display?: string;
}

export class Service {
  coding: Coding5[];
}

export class ServicedPeriod {
  start: string;
  end: string;
}

export class ValueCoding3 {
  system: string;
  code: string;
  display: string;
}

export class Extension3 {
  url: string;
  valueCoding: ValueCoding3;
}

export class Coding6 {
  system: string;
  code: string;
  display: string;
}

export class LocationCodeableConcept {
  extension: Extension3[];
  coding: Coding6[];
}

export class Quantity {
  value: number;
}

export class Coding7 {
  system: string;
  code: string;
  display: string;
}

export class Category2 {
  coding: Coding7[];
}

export class Coding8 {
  system: string;
  code: string;
  display: string;
}

export class Reason {
  coding: Coding8[];
}

export class ValueCoding4 {
  system: string;
  code: string;
  display: string;
}

export class Extension4 {
  url: string;
  valueCoding: ValueCoding4;
}

export class Amount {
  value: number;
  system: string;
  code: string;
}

export class Adjudication {
  category: Category2;
  reason: Reason;
  extension: Extension4[];
  amount: Amount;
}

export class Coding9 {
  system: string;
  version: string;
  code: string;
}

export class Modifier {
  coding: Coding9[];
}

export class Item {
  extension: Extension2[];
  sequence: number;
  diagnosisLinkId: number[];
  careTeamLinkId: number[];
  category: Category;
  service: Service;
  servicedDate: string;
  servicedPeriod: ServicedPeriod;
  locationCodeableConcept: LocationCodeableConcept;
  quantity: Quantity;
  adjudication: Adjudication[];
  modifier: Modifier[];
}

export class Amount2 {
  value: number;
  system: string;
  code: string;
}

export class Payment {
  amount: Amount2;
}
export class Identifier2 {
  type: Type2;
  system: string;
  value: string;
}
export class Type3 {
  coding: Coding3[];
}
export class Organization {
  identifier: Identifier2;
}
export class Identifier3 {
  type: Type3;
  system: string;
  value: string;
}
export class Facility {
  extension: Extension[];
  identifier: Identifier3;
}
export class Code {
  coding: Coding5[];
}
export class Information {
  sequence: number;
  category: Category;
  code: Code;
}
export class Identifier4 {
  system: string;
  value: string;
}
export class Provider {
  identifier: Identifier4;
}

export class Role {
  coding: Coding6[];
}
export class CareTeam {
  sequence: number;
  provider: Provider;
  role: Role;
}
export class Resource {
  resourceType: string;
  id: string;
  meta: Meta2;
  extension: Extension[];
  identifier: Identifier[];
  status: string;
  type: Type;
  patient: Patient;
  billablePeriod: BillablePeriod;
  diagnosis: Diagnosis[];
  insurance: Insurance;
  item: Item[];
  payment: Payment;
  organization: Organization;
  hospitalization: Hospitalization;
  totalCost: ValueMoney;
  facility: Facility;
  information: Information[];
  procedure: Procedure[];
  careTeam: CareTeam[];
}

export class ProcedureCodeableConcept {
  coding: Coding[];
}

export class Procedure {
  sequence: number;
  date: Date | string;
  procedureCodeableConcept: ProcedureCodeableConcept;
}

export class Hospitalization {
  start: string;
  end: string;
}

export class Entry {
  resource: Resource;
}

export class EobJsonDto {
  resourceType: string;
  id: string;
  meta: Meta;
  type: string;
  total: number;
  link: Link[];
  entry: Entry[];
}
export class EobClaimDto {
  claimStartDate: string;
  claimEndDate: string;
  claimAmount: string;
  diagnoseCodes: string;
  claimId: string;
  detailItems = new Array<EOBListDto>();
}
export class EobCatDto {
  category: string;
  eobItem: EOBListDto;
}

export class EOBListDto {
  // tslint:disable-next-line: no-use-before-declare
  dateOfService = new DateOfServiceDto();
  revenueCode_Desc: string;
  procedureCode_Desc: string;
  modifier_Desc: string;
  quantityBuildUnits: string;
  submittedAmountCharges: string;
  allowedAmount: string;
  non_Covered: string;
  placeOfService: string;
  typeOfService: string;
  renderingProviderNpi: string;
}
export class DateOfServiceDto {
  startDate: string | Date;
  endDate: string | Date;
}

export class PDEPatientDto {
  colorCode: string;
  date: string;
  drugNo: string;
  drugName: string;
  provider: string;
  drugCost: string;
  diagnoses: DetailDiagnoseDto[] = [];
  // procedures: DetailProcedure[] = [];
  careTeam: DetailCareTeam[] = [];
  item: Item;
}
export class CarrierPatientDto {
  colorCode: string;
  date: string;
  serviceCode: string;
  descriptionHpsc: string;
  category: string;
  provider: string;
  diagnosesStr: string;
  allowedCost: string;
  diagnoses: DetailDiagnoseDto[] = [];
  // procedures: DetailProcedure[] = [];
  careTeam: DetailCareTeam[] = [];
  item: Item;
}
export class InPatientDto {
  facility: string;
  fromDate: string;
  toDate: string;
  principleDiagnoses: string;
  totalCost: string;
  totalPayment: string;
  diagnoses: DetailDiagnoseDto[] = [];
  procedures: DetailProcedure[] = [];
  careTeam: DetailCareTeam[] = [];
  entry: Entry;
}
export class OutPatientDto {
  facility: string;
  primaryProvider: string;
  fromDate: string;
  toDate: string;
  principleDiagnoses: string;
  totalCost: string;
  totalPayment: string;
  diagnoses: DetailDiagnoseDto[] = [];
  careTeam: DetailCareTeam[] = [];
  lineItems: OPLineItemDto[] = [];
  entry: Entry;
}
export class OPLineItemDto {
  provider: string;
  service: string;
  chargeAmount: string;
  chargeDisplay: string;
  paymentAmount: string;
  paymentDisplay: string;
}

export class DetailProcedure {
  code: string;
  display: string;
  date: string;
}
export class DetailCareTeam {
  sequence: number;
  name: string;
  system: string;
  value: string;
  display: string;
}
export class DetailDiagnoseDto {
  sequence: number;
  code: string;
  display: string;
  type: string;
  codableSystem: string;
}
