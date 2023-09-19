import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { SecurityService } from "../security/security.service";
import {
  PatientDto,
  DiagnosisDto,
  PatientSpecialistDto,
  FilterPatient,
  PatientNoteDto,
  MedicationDto,
  CcmStatusChangeDto,
  MasterCarePLanDto,
  AllergyDto,
  DeletPatientDto,
  AssignRemoveCareProvidersToPatientsDto,
  AssignRPMCareCoordinatorsToPatientsDto,
  EditPatientChronicConditionNoteDto,
  SetPatientInactive,
  StickyNotesDto,
  SearchPatient,
  UpdateChronicDiseaseDto,
} from "src/app/model/Patient/patient.model";
import { ProviderDto } from "src/app/model/Provider/provider.model";
import { HttpErrorHandlerService } from "src/app/shared/http-handler/http-error-handler.service";
import { catchError } from "rxjs/operators";
import { AddToDoNoteDto } from "src/app/model/todos.model";
import {
  ConsentType,
  ConsentNature,
  PatientStatus,
} from "src/app/Enums/filterPatient.enum";
import {
  ChangeMonthlyCcmStatus,
  FinancialFormSendToPatientDto,
  RpmStatusChangeDto,
} from "src/app/model/admin/ccm.model";
import { FilteredEncountersDto } from "src/app/model/ManageEncounters/manageEncounter.model";
import { PrcmStatusDto } from "src/app/model/Prcm/Prcm.model";
import { BhiMonthlyStatusDto, BhiStatusDto } from "src/app/model/Bhi/bhi.model";
import { Subject } from "rxjs";
import { PatientAlertConfigDto } from "src/app/model/rpm/rpmAlert.model";
import { PatientNotificationDto } from "src/app/model/Patient/patient-notification-model";
//
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
const httpOptions2 = {
  headers: new HttpHeaders({
    // "Content-Type": "application/pdf"
    "Content-Type": "application/csv",
  }),
};
const httpOptions1 = {
  headers: new HttpHeaders({
    responseType: "html",
  }),
};

@Injectable({
  providedIn: "root",
})
export class PatientsService {
  refreshQualityCheckStatusOfCCM = new Subject<Number>();
  refreshQualityCheckStatusOfRPM = new Subject<Number>();
  refreshPatient = new Subject();
  baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private http: HttpClient,
    private securityService: SecurityService,
    private httpErrorService: HttpErrorHandlerService
  ) {}

  getPatientNotesLIst(id: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetPatientNotes/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCcmMsHistoryToolTip(id: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetCcmMsHistoryToolTip/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCcmStatusHistoryToolTip(id: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetCcmStatusToolTip/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getTodoListByUser(id: string) {
    return this.http
      .get(this.baseUrl + "ToDo/GetUsersToDoNotes/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getTodoListByPatientId(id: string) {
    return this.http
      .get(
        this.baseUrl + "ToDo/GetUsersToDoNotesByPatientId/" + id,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addEditTodo(data: AddToDoNoteDto) {
    return this.http
      .post(this.baseUrl + "ToDo/AddEditToDoNote", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getChronicDependentDiseases(id: number) {
    return this.http
      .get(
        this.baseUrl + "ChronicConditions/GetChronicDiseaseCodes/" + id,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetChronicDiseaseCodes(id: any) {
    return this.http
      .get(
        this.baseUrl + `ChronicConditions/GetChronicDiseaseCodes?ids=${id}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getChronicConditions() {
    return this.http
      .get(this.baseUrl + "ChronicConditions/GetChronicDiseases", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getClinicalSummary(id: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetClinicalSummary/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDiseaseCategories() {
    return this.http
      .get(this.baseUrl + "Diagnosis/GetIcdCodesCategories", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDiseaseBYCategoryId(id: number) {
    return this.http
      .get(this.baseUrl + `Diagnosis/GetIcdCodes/${id}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateDiagnosisDateById(diagnoseId: number, resolvedDate: string) {
    return this.http
      .put(
        this.baseUrl +
          `Diagnosis/UpdateDiagnosisDateById/${diagnoseId}?resolvedDate=${resolvedDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getCLinicalDiseases(searchParm: string) {
    return this.http
      .get(
        `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${searchParm}&maxList=50&sf=code,name`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getEmergencyPlan(id: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetEmergencyPlan/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientAlertConfig(id: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetPatientAlertConfig/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientAlertConfig(dObj: PatientAlertConfigDto) {
    return this.http
      .put(this.baseUrl + "Patients/EditPatientAlertConfig/" + dObj.patientId, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientNotificationConfig(PatientId: number) {
    return this.http
      .get(
        this.baseUrl + "Patients/GetPatientNotificationConfig/" + PatientId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientNotificationConfig(PatientNotifSetting: PatientNotificationDto) {
    return this.http
      .put(
        this.baseUrl + "Patients/EditPatientNotificationConfig", PatientNotifSetting ,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientTelephonyConfig(PatientNotifSetting: PatientNotificationDto) {
    const pObj = {
      "patientId": PatientNotifSetting.patientId,
      "enableTelephony": PatientNotifSetting.telephonyCommunication
    }
    return this.http
      .put(
        this.baseUrl + "Patients/EditPatientTelephonyConfig", pObj ,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientProviderSmsAlertConfig(patientId: number, disableProviderSmsAlert: boolean) {
    const pObj = {
      "patientId": patientId,
      "disableProviderSmsAlert": disableProviderSmsAlert
    }
    return this.http.put(
        this.baseUrl + "Patients/EditPatientProviderSmsAlertConfig", pObj ,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addUpdatePatientNote(data: PatientNoteDto) {
    return this.http
      .put(this.baseUrl + "Patients/EditPatientNote", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  DeleteToDoNote(id: number) {
    return this.http
      .delete(this.baseUrl + `ToDo/DeleteToDoNote/${id}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientNote(id: number) {
    return this.http
      .delete(this.baseUrl + `Patients/DeletePatientNote/${id}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  checkEmrAvailability(emr: string, facilityId: number) {
    return this.http
      .get(
        this.baseUrl +
          `Patients/CheckPatientEmrIdExists?emrId=${emr}&facilityId=${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdatePatientChronicDiseases(data: number[], patientId: number) {
    const obj = {
      patientId: patientId,
      chronicDiseasesIds: data,
    };
    return this.http
      .put(
        this.baseUrl + "Patients/EditPatientsChronicDiseases",
        obj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addUpdateClinicalSummary(data: string, id: number) {
    const SummaryObj = {
      patientId: id,
      clinicalSummary: data,
    };
    return this.http
      .put(
        this.baseUrl + "Patients/EditClinicalSummary",
        SummaryObj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addUpdateEmergencyPlan(data: string, id: number) {
    const EditEmergencyPlanobj = {
      patientId: id,
      emergencyPlan: data,
    };
    return this.http
      .put(
        this.baseUrl + "Patients/EditEmergencyPlan",
        EditEmergencyPlanobj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  AddCCMConsent(
    path,
    PatientId,
    consentType: ConsentType,
    Signature: string,
    consentNature: ConsentNature
  ): any {
    const data = {
      path: path,
      patientId: PatientId,
      consentType: consentType,
      consentNature: consentNature,
    };
    return this.http.post(this.baseUrl + "Patients/CcmConsent", data);
    // .pipe(
    //     catchError(this.httpError.handleHttpError)
    // );
  }
  // Patients/UploadCCMConsent
  UploadCcmConsent(
    path: any,
    PatientId,
    consentType: ConsentType,
    consentNature: ConsentNature,
    fileName: string
  ): any {
    const data = {
      path: path,
      patientId: PatientId,
      consentType: consentType,
      consentNature: consentNature,
      fileName: fileName,
    };
    return this.http.post(this.baseUrl + "PatientConsents/UploadConsent", data);
    // .pipe(
    //     catchError(this.httpError.handleHttpError)
    // );
  }
  getDocumentContent(
    documentType: any,
    patientName: string,
    physicianName: string
  ) {
    return this.http
      .get(
        this.baseUrl +
          "AppData/GetDocumentContent?docType=" +
          documentType +
          "&Patient=" +
          patientName +
          "&Physician=" +
          physicianName,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getProviderById(id: number) {
    return this.http
      .get(this.baseUrl + "Providers/GetProvider/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientProfile(data: any) {
    return this.http
      .put(this.baseUrl + "Patients/EditPatientProfile", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editProvider(data: ProviderDto) {
    return this.http
      .put(
        this.baseUrl + "Providers/EditProvider/" + data.id,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getProviderList() {
    return this.http
      .get(this.baseUrl + "Providers/GetProviders", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addNewIcdCode(data: any) {
    return this.http
      .post(this.baseUrl + "ChronicConditions/AddNewIcdCode", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CheckIcdCodeExist(icdCode: string) {
    return this.http
      .get(
        this.baseUrl + `ChronicConditions/CheckIcdCodeExist/${icdCode}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  IsDiseaseOnRpm(icdCode: string) {
    return this.http
      .get(
        this.baseUrl + `Diagnosis/IsDiseaseOnRpm?icdCode=${icdCode}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  IsCarePlanApproved(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `CarePlanMaster/IsCarePlanApproved/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddUpdateBillingProvider(data: any) {
    return this.http
      .put(
        this.baseUrl + "Patients/AddUpdateBillingProvider",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddUpdatePatientPreference(data: any) {
    return this.http
      .put(this.baseUrl + "Patients/EditPatientPreferences", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddUpdatePatientSpecialist(data: PatientSpecialistDto) {
    return this.http
      .put(this.baseUrl + "Patients/AddUpdateSpecialist", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getProviderSpecialities() {
    return this.http
      .get(this.baseUrl + "Providers/GetSpecialities", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addProvider(data: ProviderDto) {
    return this.http
      .post(this.baseUrl + "Providers/AddProvider", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addPatient(data: PatientDto, FacilityUserId: number) {
    return this.http.post(
      this.baseUrl + "Patients/CreatePatient/" + FacilityUserId,
      data,
      httpOptions
    );
  }
  editPatient(data: PatientDto) {
    return this.http.put(
      this.baseUrl + "Patients/EditPatient",
      data,
      httpOptions
    );
  }
  //methode name change for testing patient list
  getFilterPatientsList2(data: FilterPatient) {
    let chronicIdsStr = "";
    // if (data.chronicDiseasesIds.length > 0) {
    //   chronicIdsStr = data.chronicDiseasesIds.join(',');
    // }
    if (data.tempChronicDiseasesIds && data.tempChronicDiseasesIds.length > 0) {
      chronicIdsStr = data.tempChronicDiseasesIds;
    } else {
      chronicIdsStr = data.chronicDiseasesIds.filter((x) => x !== "0");
    }
    if (data.filterBy === 3 && data.SearchParam) {
      data.SearchParam = data.SearchParam.replace(/-/g, "");
    }
    let ccmStatusVal = "";
    let ccmStatusList = data.ccmStatus as any;
    if (!ccmStatusList && !ccmStatusList.length) {
      ccmStatusVal = "";
    } else {
      ccmStatusList = ccmStatusList.filter((x) => x !== -1);
      ccmStatusVal = ccmStatusList.toString();
    }
    let ccmStatusMonthlyVal = "";
    let ccmStatusMonthlyList = data.ccmMonthlyStatus;
    if (!ccmStatusMonthlyList && !ccmStatusMonthlyList.length) {
      ccmStatusMonthlyVal = "";
    } else {
      ccmStatusMonthlyList = ccmStatusMonthlyList.filter((x) => x !== -1);
      ccmStatusMonthlyVal = ccmStatusMonthlyList.toString();
    }
    let ccmTimeRangeVal = "";
    let ccmTimeRangeList = data.ccmTimeRange;
    if (!ccmTimeRangeList || !ccmTimeRangeList.length) {
      ccmTimeRangeVal = "0";
    } else {
      // ccmTimeRangeList = ccmTimeRangeList.filter(x => x !== -1);
      ccmTimeRangeVal = ccmTimeRangeList.toString();
    }

    return this.http
      .get(
        this.baseUrl +
          "Patients/GetPatients2?PageNumber=" +
          data.PageNumber +
          "&PageSize=" +
          data.PageSize +
          "&CustomListId=" +
          data.customListId +
          "&PatientStatus=" +
          data.PatientStatus +
          "&Assigned=" +
          data.Assigned +
          "&RpmStatus=" +
          data.RpmStatus +
          "&CcmStatus=" +
          ccmStatusVal +
          "&CcmMonthlyStatus=" +
          ccmStatusMonthlyVal +
          "&profileStatus=" +
          data.profileStatus +
          "&FacilityUserId=" +
          data.FacilityUserId +
          "&FacilityId=" +
          data.FacilityId +
          "&CareProviderId=" +
          data.CareProviderId +
          "&BillingProviderId=" +
          data.BillingProviderId +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.SearchParam +
          "&ServiceMonth=" +
          data.serviceMonth +
          "&ConsentDate=" +
          data.consentDate +
          "&DiseaseIds=" +
          chronicIdsStr +
          "&ModifiedDate=" +
          data.modifiedDate +
          "&ServiceYear=" +
          data.serviceYear +
          `&FilterBy=${data.filterBy}` +
          `&ccmTimeRange=${ccmTimeRangeVal}` +
          "&DateAssignedFrom=" +
          data.DateAssignedFrom +
          "&DateAssignedTo=" +
          data.DateAssignedTo +
          "&CommunicationConsent=" +
          data.communicationConsent +
          "&CarePlanUpdated=" +
          data.carePlanUpdated +
          "&PatientNotRespond=" +
          data.patientNotRespond,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFilterPatientsForCustomList2(data: FilterPatient) {
    return this.http
      .get(
        this.baseUrl +
          "Patients/GetPatients2?PageNumber=" +
          data.PageNumber +
          "&PageSize=" +
          data.PageSize +
          "&CustomListId=" +
          data.customListId +
          "&FacilityId=" +
          data.FacilityId +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.SearchParam +
          `&FilterBy=${data.filterBy}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFilterPatientsList(data: FilterPatient) {
    return this.http
      .get(
        this.baseUrl +
          "Patients/GetPatients?PageNumber=" +
          data.PageNumber +
          "&PageSize=" +
          data.PageSize +
          "&PatientStatus=" +
          data.PatientStatus +
          "&Assigned=" +
          data.Assigned +
          "&RpmStatus=" +
          data.RpmStatus +
          "&ccmStatus=" +
          data.ccmStatus +
          "&profileStatus=" +
          data.profileStatus +
          "&FacilityUserId=" +
          data.FacilityUserId +
          "&FacilityId=" +
          data.FacilityId +
          "&CareProviderId=" +
          data.CareProviderId +
          "&BillingProviderId=" +
          data.BillingProviderId +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.SearchParam +
          "&ServiceMonth=" +
          data.serviceMonth +
          "&ConsentDate=" +
          data.consentDate +
          "&DiseaseId=" +
          data["chronicDiseasesIds"] +
          "&ModifiedDate=" +
          data.modifiedDate +
          "&ServiceYear=" +
          data.serviceYear,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientListExcelFile(data: FilterPatient) {
    let chronicIdsStr = "";
    // if (data.tempChronicDiseasesIds && data.tempChronicDiseasesIds.length > 0) {
    //    chronicIdsStr = data.tempChronicDiseasesIds;

    // } else {
    // chronicIdsStr = data.chronicDiseasesIds.filter(x => x !== '0');
    // }
    if (data.tempChronicDiseasesIds && data.tempChronicDiseasesIds.length > 0) {
      chronicIdsStr = data.tempChronicDiseasesIds;
    } else {
      chronicIdsStr = data.chronicDiseasesIds.filter((x) => x !== "0");
    }
    if (data.filterBy === 3 && data.SearchParam) {
      data.SearchParam = data.SearchParam.replace(/-/g, "");
    }
    let ccmStatusVal = "";
    let ccmStatusList = data.ccmStatus as any;
    if (!ccmStatusList && !ccmStatusList.length) {
      ccmStatusVal = "";
    } else {
      ccmStatusList = ccmStatusList.filter((x) => x !== -1);
      ccmStatusVal = ccmStatusList.toString();
    }
    let ccmStatusMonthlyVal = "";
    let ccmStatusMonthlyList = data.ccmMonthlyStatus;
    if (!ccmStatusMonthlyList && !ccmStatusMonthlyList.length) {
      ccmStatusMonthlyVal = "";
    } else {
      ccmStatusMonthlyList = ccmStatusMonthlyList.filter((x) => x !== -1);
      ccmStatusMonthlyVal = ccmStatusMonthlyList.toString();
    }
    let ccmTimeRangeVal = "";
    let ccmTimeRangeList = data.ccmTimeRange;
    if (!ccmTimeRangeList || !ccmTimeRangeList.length) {
      ccmTimeRangeVal = "0";
    } else {
      // ccmTimeRangeList = ccmTimeRangeList.filter(x => x !== -1);
      ccmTimeRangeVal = ccmTimeRangeList.toString();
    }
    return this.http
      .get(
        this.baseUrl +
          "Patients/GetPatientListExcelFile?PatientStatus=" +
          data.PatientStatus +
          "&Assigned=" +
          data.Assigned +
          "&RpmStatus=" +
          data.RpmStatus +
          "&CcmStatus=" +
          ccmStatusVal +
          "&CcmMonthlyStatus=" +
          ccmStatusMonthlyVal +
          "&profileStatus=" +
          data.profileStatus +
          "&FacilityUserId=" +
          data.FacilityUserId +
          "&FacilityId=" +
          data.FacilityId +
          "&CareProviderId=" +
          data.CareProviderId +
          "&BillingProviderId=" +
          data.BillingProviderId +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.SearchParam +
          "&ServiceMonth=" +
          data.serviceMonth +
          "&ConsentDate=" +
          data.consentDate +
          "&DiseaseIds=" +
          chronicIdsStr +
          "&ModifiedDate=" +
          data.modifiedDate +
          "&ServiceYear=" +
          data.serviceYear +
          `&ccmTimeRange=${ccmTimeRangeVal}` +
          "&DateAssignedFrom=" +
          data.DateAssignedFrom +
          "&CustomListId=" +
          data.customListId +
          "&DateAssignedTo=" +
          data.DateAssignedTo,
        { responseType: "blob" }
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientsList(facilityId: number) {
    return this.http
      .get(this.baseUrl + `Patients/GetAllPatients/${facilityId}`, httpOptions1)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientsByFacilityId(
    facilityId: number,
    monthId?: number,
    yearId?: number
  ) {
    if (!monthId) {
    }
    return this.http
      .get(
        this.baseUrl + `Patients/GetPatientsByFacilityId/${facilityId}`,
        httpOptions1
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getCcmStatus() {
    return this.http
      .get(this.baseUrl + `Patients/GetCCMStatus`, httpOptions1)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getRpmStatus() {
    return this.http
      .get(this.baseUrl + `Patients/GetRPMStatus`, httpOptions1)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientsChronicDiseases(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Patients/GetPatientsChronicDiseases/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientDetail(patientId: number) {
    return this.http
      .get(this.baseUrl + "Patients/GetPatientById/" + patientId, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientDetailByUserId(userId: string) {
    return this.http
      .get(this.baseUrl + "Patients/GetPatientByUserId/" + userId, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDiagnosesByPatientId(patientId: number, awid?: number, bhiId?: number) {
    let urlString = "Diagnosis/GetDiagnosesByPatientId/";
    let bhiStr = "";
    if (awid) {
      urlString = "Diagnosis/GetAWDiagnoses/";
      patientId = awid;
    }
    if (bhiId) {
      bhiStr = `?startsWith=F`;
    }
    return this.http
      .get(this.baseUrl + urlString + patientId + bhiStr, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditPatientDiagnosis(diagnosisDto: DiagnosisDto) {
    return this.http
      .post(
        this.baseUrl +
          "Diagnosis/AddEditPatientDiagnosis/" +
          diagnosisDto.patientId,
        diagnosisDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddMultipleDiagnosis(patientId: number, dData: DiagnosisDto[]) {
    return this.http
      .post(
        this.baseUrl +
          `Diagnosis/AddMultipleDiagnosis/${patientId}` , dData,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddMultipleMedications(patientId: number, dData: MedicationDto[]) {
    return this.http
      .post(
        this.baseUrl +
          `Medications/AddMultipleMedications` , dData,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDiagnoseById(diagnoseId: number) {
    return this.http
      .get(
        this.baseUrl + "Diagnosis/GetDiagnosisById/" + diagnoseId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addUpdateMedication(data: MedicationDto) {
    return this.http
      .post(this.baseUrl + "Medications/AddEditMedication", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
    // return this.http.put(this.baseUrl + 'Patients/AddUpdateMedication', data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientMedications(patientId: number, awId?: number) {
    let urlString = "Medications/GetMedicationsByPatientId/";
    if (awId) {
      urlString = "Medications/GetAWMedications/";
      patientId = awId;
    }
    return this.http
      .get(this.baseUrl + `${urlString}${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
    // return this.http.get(this.baseUrl + `Patients/GetMedicationsByPatientId/${patientId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientAllergies(patientId: number, awId?: number) {
    let urlString = "allergy/GetPatientAllergy/";
    if (awId) {
      urlString = "allergy/getawallergies/";
      patientId = awId;
    }
    return this.http
      .get(this.baseUrl + `${urlString}${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getAllergy(id: number) {
    return this.http
      .get(this.baseUrl + `allergy/GetAllergy/${id}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addAllergy(data: AllergyDto) {
    return this.http
      .post(this.baseUrl + `allergy/AddUpdateAllergy`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getMedicinesList(madicineName: string) {
    return this.http
      .get(
        this.baseUrl + `Medications/GetMedicineList/${madicineName}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTermTypeSynonyms(medicineName: string) {
    return this.http
      .get(
        this.baseUrl +
          `Medications/GetTermTypeSynonyms?medicineName=${medicineName}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetVaccinationCodes() {
    return this.http
      .get(this.baseUrl + `Vaccinations/GetVaccinationCodes`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetImmunizationsOfPatient(patientId: number, awId?: number) {
    let urlString = "Immunizations/GetImmunizationsOfPatient/";
    if (awId) {
      urlString = "Immunizations/GetAWImmunizations/";
      patientId = awId;
    }
    return this.http
      .get(this.baseUrl + `${urlString}${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditImmunizationForPatient(data: any) {
    return this.http
      .post(
        this.baseUrl + `Immunizations/AddEditImmunizationForPatient`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientCareProviers(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Patients/GetCareProvidersByPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCarePlanMasterByPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl +
          `CarePlanMaster/GetCarePlanMasterByPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditCarePlanMaster(data: MasterCarePLanDto) {
    return this.http
      .put(
        this.baseUrl + `CarePlanMaster/AddEditCarePlanMaster`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ReviewCarePlan(data: any) {
    return this.http
      .post(
        this.baseUrl + `CarePlanMaster/ReviewCarePlanApproval`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ApproveAllPending(data: number[]) {
    return this.http
      .put(
        this.baseUrl + `CarePlanMaster/ApproveAllCarePlanApprovals`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendForApproval(data: any) {
    return this.http
      .post(
        this.baseUrl + `CarePlanMaster/SendCarePlanApproval`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  updatePatientProviders(patientId: number, providerIds: number[]) {
    const obj = {
      patientId: patientId,
      careProviderIds: providerIds,
    };
    return this.http
      .put(
        this.baseUrl + `Patients/UpdatePatientCareProviders`,
        obj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignRemoveCareProvidersToPatients(
    data: AssignRemoveCareProvidersToPatientsDto
  ) {
    return this.http
      .post(
        this.baseUrl + `Patients/AssignRemoveCareProvidersToPatients`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignRemoveRPMCareCoordinatorsToPatients(
    data: AssignRPMCareCoordinatorsToPatientsDto
  ) {
    return this.http
      .post(
        this.baseUrl + `Patients/AssignRemoveRPMCareCoordinatorsToPatients`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  changePatientCcmStatus(data: CcmStatusChangeDto) {
    return this.http
      .put(this.baseUrl + "Patients/ChangePatientCcmStatus", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  changePatientRpmStatus(data: RpmStatusChangeDto) {
    return this.http
      .put(this.baseUrl + "Patients/ChangePatientRPMStatus", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editPatientCcmMonthlyStatus(data: ChangeMonthlyCcmStatus) {
    return this.http
      .put(
        this.baseUrl + "Patients/EditPatientCcmMonthlyStatus",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditDateAssigned(patientId: number, date: string, facilityId: number) {
    const data = {
      patientId: patientId,
      dateAssigned: date,
      facilityId: facilityId,
    };
    return this.http
      .put(this.baseUrl + "Patients/EditDateAssigned", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditRecentPcpAppointment(patientId: number, date: string, facilityId: number) {
    const data = {
      patientId: patientId,
      recentPcpAppointment: date,
      facilityId: facilityId,
    };
    return this.http
      .put(this.baseUrl + "Patients/EditRecentPcpAppointment", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // /api/Patients/EditRecentPcpAppointment

  // EditPatientCcmMonthlyStatus;
  MarkPatientInActive(
    patientId: number,
    status: PatientStatus,
    reason: string
  ) {
    const inactivePatientModal = new SetPatientInactive();
    inactivePatientModal.patientId = patientId;
    // inactivePatientModal.status = PatientStatus['In Active'];
    inactivePatientModal.reason = reason;
    inactivePatientModal.status = status;
    return this.http
      .put(
        this.baseUrl + "Patients/MarkPatientInActive",
        inactivePatientModal,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  deletePatient(deletePatientDto: DeletPatientDto) {
    return this.http
      .put(
        this.baseUrl + "Patients/MarkPatientAsDeleted",
        deletePatientDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CheckPatientHasEncounters(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Patients/CheckPatientHasEncounters/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getAllChronicDisease() {
    return this.http
      .get(
        this.baseUrl + "ChronicConditions/GetAllChronicDiseaseCodes",
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPendingEncountersForSignature(dObj: FilteredEncountersDto) {
    return this.http
      .post(
        this.baseUrl + `AnnualWellness/GetFilteredEncounters`,
        dObj,
        // `http://27b889855e8b.ngrok.io/api/AnnualWellness/GetFilteredEncounters`, dObj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // getPdfdata() {
  //   this.http
  //     .get(this.baseUrl + "CcmServices/GetLogsHistoryByFacilityId?facilityId=" +, {
  //       responseType: ResponseContentType.Blob
  //     })
  //     .subscribe(response => {
  //       var blob = new Blob([response["_body"]], { type: "application/zip" });
  //       FileSaver.saveAs(blob, dlData.file_name);
  //     })
  //     .catch(error => {
  //       // Error code
  //     });
  // }

  deletePatientDiagnosis(data: any) {
    return this.http
      .post(
        this.baseUrl + "Diagnosis/DeletePatientDiagnosis",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  deleteMedication(data: any) {
    return this.http
      .post(
        this.baseUrl + "Medications/DeletePatientMedication",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientAllergy(data: any) {
    return this.http
      .post(this.baseUrl + "allergy/DeletePatientAllergy", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientImmunization(data: any) {
    return this.http
      .post(
        this.baseUrl + "Immunizations/DeletePatientImmunization",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteWrittenDocument(filePath: any) {
    return this.http
      .get(this.baseUrl + "S3/DeleteFile?key=" + filePath, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getCarePlanHistoryByPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl +
          "Patients/GetCarePlanHistoryByPatientId?patientId=" +
          patientId,
        { responseType: "blob" }
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DownloadCarePlanPdfByPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl +
          `CarePlanMaster/DownloadCarePlanPdfByPatientId/${patientId}`,
        { responseType: "blob" }
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFilteredChronicDiseases(filter: string) {
    return this.http
      .get(
        this.baseUrl +
          `ChronicConditions/GetFilteredChronicDiseases?filter=${filter}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendCarePlanHistoryPdf(data: any) {
    return this.http.post(
      this.baseUrl + "Patients/SendCarePlanHistoryPdf",
      data,
      httpOptions
    );
  }
  AddEditPatientSchedulingNote(patientId: number, note: string) {
    return this.http.put(
      this.baseUrl +
        `Patients/AddEditPatientSchedulingNote/${patientId}?note=${note}`,
      httpOptions
    );
  }
  getAddressbyLatAndLong(latitude: number, longitude: number) {
    return this.http.get(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        latitude +
        "," +
        longitude +
        "&key=AIzaSyDuGcWGIfbZbmIwUD_cHfovG-L8-SSL_I4"
    );
  }
  UpdatePrcmStatus(prcmStatusDto: PrcmStatusDto) {
    return this.http
      .put(
        this.baseUrl + `Patients/UpdatePrCMStatus`,
        prcmStatusDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ReactivatePatient(patientId: number) {
    return this.http
      .put(
        this.baseUrl + `Patients/ReactivatePatient?patientId=${patientId}`,
        {},
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ReActivateDeletedPatient(emrId: string, facilityId: number) {
    return this.http
      .post(
        this.baseUrl + `Patients/ReActivateDeletedPatient/${emrId}?facilityId=${facilityId}`,
        {},
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateBhiStatus(bhiStatusDto: BhiStatusDto) {
    return this.http
      .put(this.baseUrl + `Patients/UpdateBhiStatus`, bhiStatusDto, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientActieServicesDetail(pId: number) {
    return this.http
      .get(
        this.baseUrl +
          `Patients/GetPatientActieServicesDetail?PatientId=${pId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  IsDiseaseOnServices(code: number) {
    return this.http
      .get(
        this.baseUrl + `Diagnosis/IsDiseaseOnServices?icdCode=${code}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetChronicConditionsByPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Diagnosis/GetChronicConditionsByPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientChronicConditionNote(data: EditPatientChronicConditionNoteDto) {
    return this.http
      .put(
        this.baseUrl + "Diagnosis/EditPatientChronicConditionNote",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllCountries() {
    return this.http
      .get(this.baseUrl + "AppData/GetAllCountries", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditStickyNotes(stickyNotesData: StickyNotesDto) {
    return this.http
      .put(
        this.baseUrl + "Patients/EditStickyNotes",
        stickyNotesData,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientEmrSummaryData(patientId: number, monthId: number, yearId: number) {
    const facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    return this.http
      .get(
        this.baseUrl + `Patients/GetPatientEmrSummaryData?facilityId=${facilityId}&patientId=${patientId}&monthId=${monthId}&yearId=${yearId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetPatientServices(servicesNames, ids: any) {
    let data = {
      ids,
      servicesNames,
    };
    return this.http
      .put(this.baseUrl + `Patients/SetPatientServices`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientDetailsById(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Patients/GetPatientDetailsById/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  SearchPatients(data: SearchPatient) {
    return this.http
      .get(
        this.baseUrl +
          `Patients/SearchPatients?facilityId=${data.facilityId}&fullName=${data.fullName}&emrId=${data.emrId}&phoneNo=${data.phoneNo}&firstName=${data.firstName}&lastName=${data.lastName}&patientId=${data.patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendFinancialHardshipForm(data: FinancialFormSendToPatientDto) {
    return this.http
      .post(
        this.baseUrl +
          `Patients/SendFinancialHardshipForm?PatientId=${data.patientId}&Email=${data.email}&CountryCallingCode=${data.countryCallingCode}&PhoneNo=${data.phoneNo}&DocumentTitle=${data.documentTitle}&DocumentLink=${data.documentLink}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateChronicDisease(data: UpdateChronicDiseaseDto) {
    return this.http
      .post(
        this.baseUrl +
          `ChronicConditions/UpdateChronicCondition?Id=${data.id}&IsOnRpm=${data.isOnRpm}&IsOnCcm=${data.isOnCcm}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientCCMStatusHistory(patientId) {
    return this.http
      .get(
        this.baseUrl + `CcmServices/GetPatientCCMStatusHistory/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RemoveIcdCode(id){
    return this.http
    .delete(
      this.baseUrl + `ChronicConditions/RemoveICDCode/${id}`,
      httpOptions
    )
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
