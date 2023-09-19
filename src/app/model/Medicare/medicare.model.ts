export class BlueButtonReportDto {
  id: string;
  lastUpdated: Date | string;
  total: number;
  resources: ReportResource[];
}

export class ReportResource {
  id: string;
  status: string;
  start: Date | string;
  end: Date | string;
  insuranceReference: string;
  patientReference: string;
  extension: ReportExtension[];
  identifier: ReportIdentifier[];
  type: ReportCoding[];
  diagnosis: ReportDiagnosis[];
  items: ResourceItem[];
  payment: ReportAmount;
}

export class ResourceItem {
  sequence: number;
  quantity: number;
  extension: ReportExtension[];
  category: ReportCoding[];
  service: ReportServiceCoding[];
  adjudication: ReportAdjudication[];
  servicePeriodStart: Date | string;
  servicePeriodEnd: Date | string;
}

export class ReportDiagnosis {
  sequence: number;
  diagnosisCoding: ReportCoding[];
  // diagnosisType: ReportCoding[];
}

export class ReportLocation {
  extension: ReportExtension[];
  coding: ReportCoding;
}

export class ReportAdjudication {
  category: ReportCoding[];
  reason: ReportCoding[];
  extension: ReportExtension[];
  amount: ReportAmount;
}

export class ReportExtension {
  url: string;
  valueMoney: ReportAmount;
  valueIdentifier: ReportIdentifier;
  valueCoding: ReportCoding;
  quantity: number;
  reportExtensionType: string;
  variableName: string;
}

export class ReportAmount {
  system: string;
  code: string;
  value: number;
}

export class ReportCoding {
  system: string;
  code: string;
  display: string;
  variableName: string;
}

export class ReportIdentifier {
  system: string;
  value: string;
  variableName: string;
}

export class ReportServiceCoding {
  system: string;
  code: string;
  version: string;
}
