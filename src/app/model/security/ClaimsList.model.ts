export class ClaimsListDto {
  // Claims List For Patients //
  CanAddPatient = false;
  CanViewPatientList = false;
  CanAssignCareProvider = false;
  CanFilterPatients = false;
  CanFilterPatientsByOrg = false;
  CanViewPatientCCM = false;
  CanModifyCCMEncounter = false;
  CanViewPatientEncounterLog = false;
  CanModifyRPMEncounter = false;
  CanViewRPMEncounterLog = false;
  //  Diagnosis, Allergies, Immunization and Medication
  CanModifyDiagnose = false;
  CanViewDiagnoseList = false;
  CanModifyMedication = false;
  CanViewMedicationList = false;

  CanModifyAllergies = false;
  CanViewAllergiesList = false;

  CanModifyImmunization = false;
  CanViewImmunizationList = false;

  CanEditBillingProvider = false;
  CanViewBillingProvider = false;
  CanViewPatientProviders = false;
  CanAddPatientProviders = false;
  CanEditClinicalSummary = false;
  CanEditEmergancyPlan = false;
  CanViewDailyReport = false;
  CanEditPatient = false;
  ShowPatientNotfIcon = false;
  CanEditAssignedDate = false;
  /// Patient CCM Claims
  CanViewTeleMedicine = false;
  CanApproveCarePlan = false;
  CanSendCarePlanApproval = false;
  CanEditFollowUpDate = false;
  CanEditPcmAppointmentDate = false;
  CanEditPatientDischargeDate = false;
  CanViewCarePlan = false;
  CanEditCarePlan = false;
  CanEditCarePlanTemplate = false;
  // CanViewToDoList = false;
  CanAddToDo = false;
  // CanViewNotesList = false;
  CanAddNote = false;
  CanAddPatientConset = false;
  CanViewPatientConset = false;

  // feedback
  CanViewFeedback = false;

  // Orgnization
  CanAddOrgnization = false;
  CanViewOrgnizationList = false;
  CanAddFacility = false;
  CanViewFacilityList = false;
  CanAddFacilityUser = false;
  CanViewFacilityUserList = false;
  CanDeleteFacilityUser = false;
  CanShowDeleteFacilityUsersList = false;

  // Questionaire

  CanAddQuestionaire = false;
  CanViewQuestionaireList = false;
  CanAssignDiseasesToQuestionaire = false;
  CanSwitchFacility = false;
  CanAddFacilityToUser = false;
  CanViewRoles = false;
  CanEditRoles = false;
  CanViewBilling = false;
  CanGenerateBills = false;

  //Daily Reporting

  CanAddandEditDailyReport = false;
}
