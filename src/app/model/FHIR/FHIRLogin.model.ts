export class FhirLoginDto {
  patientEmrId: string;
  practiceId: string; // Location ID in fhir
  email: string;
  userName: string;
  firstName: string;
  lastName: string
}
