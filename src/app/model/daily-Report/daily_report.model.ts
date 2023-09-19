export class DailyReportingDto {
         id = 0;
         date: string;
         dailyNote: string;
         potentialPatient = 0;
         patientsEnrolled = 0;
         denied = 0;
         pendingDecision = 0;
         noShows = 0;
         patientContacted = 0;
         patientNotAvailable = 0;
         patientCompleted = 0;
         patientIncomplete = 0;
         careProviderId = 0;
         facilityId = 0;
       }

       export class DailyReportingViewDto {
                id = 0;
                date: string;
                dailyNote: string;
                potentialPatients = 0;
                patientsenrolled = 0;
                denied = 0;
                pendingDecision = 0;
                noShows = 0;
                patientContacted = 0;
                patientNotavailable = 0;
                patientCompleted = 0;
                patientIncomplete = 0;
                patientChangedStatuses = new Array<PatientChangedStatusesDto>();
                careProviderId = 0;
                careProviderName: string;
                facilityId = 0;
              }

       export class PatientChangedStatusesDto {
          patientId = 0;
      patientName: string;
      statusType: string;
      statusValue: string;
      modifiedDate: string;
       }

 export class DailyReportSummaryDto {
  totalPotentialPatients = 0;
  totalPatientsEnrolled = 0;
  totalDenied = 0;
  totalPendingDecisions = 0;
  totalNoShows = 0;
  totalPatientsContacted = 0;
  totalPatientsNotAvailable = 0;
  totalPatientsCompleted = 0;
  totalPatientsIncompleted = 0;
}
export class DailyProgreeForDashboardDto
    {
        facilityId = 0;
        facilityUserId = 0;
        role = '';
    }
