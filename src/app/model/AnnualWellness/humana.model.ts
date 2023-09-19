import { HumanaCareGapTextboxType } from "src/app/Enums/ae.enum";

export class PatientInfo {
  patient: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  dateOfService: Date;
  humanaMemberId: string;
  raceOrEthnicity: string;
}

export class MedicalHistory {
  id: number;
  icdCode: string;
  description: string;
  note: string;
  diagnosis: string;
  isChronic: boolean;
  diagnosisDate: Date;
  resolvedDate: Date;
  remarks: string;
  active: boolean;
  resolved: boolean;
  providers: string[];
  treatmentPlan: string;
}

export class SurgicalHistory {
  id: number;
  procedure: string;
  reason: string;
  date: Date;
  surgeonOrFacility: string;
}

export class CurrentMedication {
  id: number;
  medicationName: string;
  dose: string;
  startDate: Date;
  stopDate: Date;
  status: string;
  conditionsTreated: string;
}

export class MedicalReconsiliation {
  hospitalizedLastYear: boolean;
  dateOfReview: Date;
  physician: string;
}

export class StatinTherapy {
  therapyReceived: boolean;
  date: Date;
  patientDispensedDate: Date;
  statinRxName: string;
  rxDose: string;
  rxAdministrationMode: string;
  statinTherapyIntensity: string;
}

export class MedicalAllergy {
  agent: string;
  date: string;
  reaction: string;
  type: number;
  criticality: number;
  clinicalStatus: number;
  category: number;
}

export class SocialHistory {
  name: string;
  remarks: string;
}

export class FamilyHistory {
  id: number;
  diseaseName: string;
  father: boolean | null;
  mother: boolean | null;
  children: boolean | null;
  siblings: boolean | null;
  grandparents: boolean | null;
}

export class Vitals {
  weight: string;
  height: string;
  heartRate: string;
  bpDiastolic: string;
  bpSystolic: string;
  bmiCompleted: boolean;
  bloodPressure: string;
  bmi: string;
}

export class PhysicalExamination {
  examinationName: string;
  normalLimit: boolean;
  abnormal: boolean;
  findings: string;
}

export class CognitiveImpairement {
  repeatedWordOne: string;
  repeatedWordTwo: string;
  repeatedWordThree: string;
  cognitiveAssessmentDoc: string;
  clockResponse: string;
}

export class ScoringInstruction {
  cognitiveImpairment: boolean;
  additionalComments: string;
  alternateToolUsed: string;
}

export class ColorectalCancerScreening {
  colonscopyPerformedDate: Date | string;
  colonsgraphyPerformedDate: Date | string;
  sigmoidoscopyPerformedDate: Date | string;
  cologuardPerformedDate: Date | string;
  fobtPerformedDate: Date | string;
  excludedColectomyDate: Date | string;
  excludedColorectalDate: Date | string;
}

export class BreastCancerScreening {
  applicable: boolean;
  mammographyPerformedDate: Date | string;
  excludedBilateralMastectomy: Date | string;
  excludedUnilateralMastectomy: Date | string;
  excludedUnilateralMastectomyTwo: Date | string;
  excludedUnilateralMastectomyWithBilateralModifier: Date | string;
  excludedUnilateralMastectomyWithRightSideModifier: Date | string;
}

export class DiabeticNephropathy {
  applicable: boolean;
  microalbuminTestDate: Date | string;
  microalbuminTestResult: string;
  macroalbuminTestDate: Date | string;
  macroalbuminTestResult: string;
  aceInhibitorDate: Date | string;
  isACEInhibitor: boolean;
  nephrologistVisit: boolean;
  nephrologistVisitDate: Date | string;
  renalTransplant: boolean;
  renalTransplantDate: Date | string;
  medication: string;
}

export class DiabeticEyeCare {
  applicable: boolean;
  eyeCareProfessional: string;
  polycysticOvarianSyndromeDate: string;
  polycysticOvarianSyndromeProfessional: string;
  retinalOrDilatedExamDate: Date | string;
  retinalOrDilatedProfessional: string;
  negativeRetinalOrDilatedExamDate: Date | string;
  negativeRetinalOrDilatedProfessional: string;
  gestationalDiabetesDate: Date | string;
  gestationalDiabetesProfessional: string;
  steroidInducedDiabetesDate: Date | string;
  steroidInducedDiabetesProfessional: string;
}

export class DiabeticFootExam {
  applicable: boolean;
  examinationName: string;
  normalLimit: boolean;
  abnormal: boolean;
  comment: string;
  findingList: string;
  findings: string;
}

export class Immunization {
  influenzaVaccine: boolean;
  influenzaVaccineDate: Date;
  pcV13: boolean;
  pcV13Date: Date;
  pcV23: boolean;
  pcV23Date: Date;
}

export class Labs {
  applicable: boolean;
  hbA1cDate: Date;
  hbA1cResult: string;
  excludedGestationalDiabetesDate: Date;
  gestationalResult: string;
  excludedSteroidInducedDiabetesDate: Date;
  polycysticOvarianSyndromeDate: Date;
  result: string;
}

export class RaManagement {
  applicable: boolean;
  dmard: Date;
  medicationName: string;
  adminRoute: string;
  dosage: string;
  excludedPregnancyDate: Date;
  excludedHIVDate: Date;
}

export class OsteoporosisManagement {
  applicable: boolean;
  osteoporosisMedicationDate: Date;
  medicationName: string;
  adminRoute: string;
  dosage: string;
  boneMineralDensityTestDate: Date;
  excludedBoneMineralDensityTestDate: Date;
  excludedOsteoporosisTherapyDate: Date;
  excludedOsteoporosisPrescriptionDate: Date;
  excludedFractureDate: Date;
}

export class PainScreening {
  painLevel: number;
  painManagement: boolean;
  painMedication: boolean;
}

export class FunctionalAssessment {
  iadLsAssessment: boolean;
  componentAssessment: boolean;
  statusAssessment: boolean;
  statusAssessmentTool: string;
  adLsAssessment: boolean;
}

export class OtherAssessment {
  physicalActivityAssessment: boolean;
  advanceDirective: boolean;
  aspirinUse: boolean;
  fallRisk: boolean;
  depressionScreening: boolean;
  score: string;
  medicationReview: boolean;
  medicationReviewText: string;
  drugDiseaseName: string;
}

export class HumanaDiagnosis {
  diagnosis: string;
  icdCode: string;
  treatmentPlan: string;
  otherTreatmentPlan: string;
}

export class HumanaDto {
  patientInfo = new PatientInfo();
  medicalHistory: MedicalHistory[] = [];
  surgicalHistory: SurgicalHistory[] = [];
  currentMedications: CurrentMedication[] = [];
  medicalReconsiliation = new MedicalReconsiliation();
  statinTherapy = new StatinTherapy();
  medicalAllergies: MedicalAllergy[] = [];
  socialHistory: SocialHistory[] = [];
  familyHistory: FamilyHistory[] = [];
  providers: OtherProviders[] = [];
  vitals = new Vitals();
  physicalExamination: PhysicalExamination[] = [];
  cognitiveImpairement = new CognitiveImpairement();
  scoringInstruction = new ScoringInstruction();
  colorectalCancerScreening = new ColorectalCancerScreening();
  breastCancerScreening = new BreastCancerScreening();
  diabeticNephropathy = new DiabeticNephropathy();
  diabeticEyeCare = new DiabeticEyeCare();
  diabeticFootExam: DiabeticFootExam[] = [];
  immunization = new Immunization();
  labs = new Labs();
  raManagement = new RaManagement();
  osteoporosisManagement = new OsteoporosisManagement();
  painScreening = new PainScreening();
  functionalAssessment = new FunctionalAssessment();
  otherAssessment = new OtherAssessment();
  humanaDiagnosis = new Array<HumanaDiagnosis>();
  screeningPlan: string;
  followUp: string;
  healthCareProviderName: string;
  healthCareProviderSignature: string;
  date: string;
  isDiabetic: boolean;
  providerOfficeNo: string;
  billingProviderId: string;
  tin: boolean;
  npi: boolean;
  healthCareProviderAddress: string;
  cityStateZIP: string;
}

export class OtherProviders {
  firstName: string;
  lastName: string;
  degree: string;
  specialty: string;
  prevAppointment: Date | string | null;
  nextAppointment: Date | string | null;
}
export class HumanaResDto {
  id: number;
  humanaDto = new HumanaDto();
  awEncounterId: number;
}
export class HumanaCareGapParamsDto {
        awEncounterId: number;
        textboxType: HumanaCareGapTextboxType;
    }

