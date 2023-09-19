export class ExtClient {
  id: number;
  domain: string;
  contentScript: string;
  emr: string;
  emrId: number;
}
export class Emr{
id: number;
name: string;
isIntegrated: boolean;
claimSubmission: boolean;
clinicalDocumentSubmission: boolean;
canSetCcmEnrollmentStatus: boolean;
vitalsSubmission: boolean;
contentScript: string;
}
