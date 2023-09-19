import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpErrorHandlerService } from "../shared/http-handler/http-error-handler.service";
import { SecurityService } from "./security/security.service";
import {
  RPMEncounterDto,
  ModalityDto,
  DeviceDto,
  IntigrationCheckList,
  ModalityConfDto,
  DeletePatientDeviceDto,
  PatientHealthCareDeviceForListDto,
  BloodPressure,
  Weight,
  Pulse,
  BloodGlucose,
  Activity,
  RpmPatientsScreenParams,
  RmpReadingsSearchParam,
  Alerts,
  AlertsNew,
  RmpDashboardParamsDto,
  SetupRPMDeviceParamsDto,
  EditDateAssignedParamDto,
  EditRpmReadingDto,
  AlertAddressedByDto,
  SetIsBleEnabled,
} from "../model/rpm.model";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { RecordDeviceReadingFromImageDto } from "../rpm/device-data-sync/device-data-sync.component";
import {
  SendAlertSmsDto,
  AddRpmAlertCallDto,
  EditRpmALertDto,
  SendRpmAlertChatDto,
} from "../model/rpm/rpmAlert.model";
import { DexcomGetStatParamDto } from "../model/Dexcom.model";
import { RpmDailyReadingsFilterEnum } from "../model/rpm/rpm.analytics.model";
import { RpmQualityCheckedEnum } from "../Enums/rpm.enum";
import moment from "moment";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
const httpOptions1 = {
  headers: new HttpHeaders({
    "Content-Type": "text/plain",
  }),
};

@Injectable({
  providedIn: "root",
})
export class RpmService {
  startDate: string;
  endDate: string;
  careFacilitatorId = 0;
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  modalitiesList = [
    { modalityCode: "BP", modalityName: "Blood Pressure Monitor" },
    { modalityCode: "WT", modalityName: "Weighing Scale" },
    { modalityCode: "PO", modalityName: "Pulse oximetery" },
    { modalityCode: "BG", modalityName: "Blood Glucose Monitor" },
    // {modalityCode: "AT" , modalityName:  'Activity'},
    // {modalityCode: "CGM" , modalityName: 'CGM'},
    // {modalityCode: "OS" , modalityName: 'Oxygen Saturation'},
    // {modalityCode: "HR" , modalityName: 'Heart Rhythm'}
  ];
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  addRPMEncounter(data: RPMEncounterDto) {
    return this.http
      .post(this.baseUrl + "Rpm/AddRPMEncounter", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditRPMEncounter(data: RPMEncounterDto) {
    return this.http
      .put(this.baseUrl + "Rpm/EditRpmEncounter", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  DeleteRpmEncounter(encounterId: number) {
    return this.http
      .delete(
        this.baseUrl + `Rpm/DeleteRpmEncounter/${encounterId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  validateUser(userId: string, password: string) {
    const data = {
      appUserId: userId,
      password: password,
    };
    return this.http
      .post(this.baseUrl + "Account/ValidateUser", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  CheckUnbilledDeviceConfigClaim(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Rpm/CheckUnbilledDeviceConfigClaim/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmMsHistoryToolTip(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Rpm/GetRpmMsHistoryToolTip/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRPMDeviceConfiguration(patientId: number, deviceType: string) {
    return this.http
      .get(
        this.baseUrl +
          `Rpm/GetRPMDeviceConfiguration/${patientId}/${deviceType}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetupRPMDevice(data: SetupRPMDeviceParamsDto) {
    return this.http
      .put(this.baseUrl + `Rpm/SetupRPMDevice`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetModalityLogsByPatientId(
    patientId: number,
    monthID: number,
    yearId: number
  ) {
    return this.http
      .get(
        this.baseUrl +
          `Rpm/GetModalityLogsByPatientId/${patientId}/${monthID}/${yearId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getRPMEncounters(
    patientId: number,
    monthID: number,
    yearId: number
  ): Observable<Array<RPMEncounterDto>> {
    return this.http
      .get<Array<RPMEncounterDto>>(
        this.baseUrl +
          `Rpm/GetRpmEncountersByPatientId/${patientId}?month=${monthID}&year=${yearId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRPMEncountersAndReadingsForCopy(
    patientId: number,
    monthID: number,
    yearId: number
  ) {
    return this.http
      .get(
        this.baseUrl +
          `Rpm/GetRPMEncountersAndReadingsForCopy?patientId=${patientId}&month=${monthID}&year=${yearId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getModalities(): Observable<Array<ModalityDto>> {
    return this.http
      .get<Array<ModalityDto>>(
        this.baseUrl + `modalities/GetModalities`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetUnAssignedModalitiesByPatientId(
    patientid: number
  ): Observable<Array<ModalityDto>> {
    return this.http
      .get<Array<ModalityDto>>(
        this.baseUrl +
          `modalities/GetUnAssignedModalitiesByPatientId/${patientid}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDevicesByModality(modalityId: number): Observable<Array<DeviceDto>> {
    return this.http
      .get<Array<DeviceDto>>(
        this.baseUrl + `HealthCareDevices/GetDevicebyModalityId/${modalityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDevicesByPatientId(
    patientId: number
  ): Observable<Array<PatientHealthCareDeviceForListDto>> {
    return this.http
      .get<Array<PatientHealthCareDeviceForListDto>>(
        this.baseUrl + `HealthCareDevices/GetDevicebyPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetIntegrationChecklistbyModalityId(
    modalityId: number
  ): Observable<Array<IntigrationCheckList>> {
    return this.http
      .get<Array<IntigrationCheckList>>(
        this.baseUrl +
          `modalities/GetIntegrationChecklistbyModalityId/${modalityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  VerifyDeviceSerialNumberByFacilityId(
    serialNUmber: string,
    facilityId: number,
    deviceId: number
  ): any {
    return this.http
      .get<any>(
        this.baseUrl +
          `HealthCareDevices/VerifyDeviceSerialNumberByFacilityId/${serialNUmber}/${facilityId}/${deviceId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSerialNumbersByFacilityId(
    serialNUmber: string,
    facilityId: number,
    deviceId: number
  ): any {
    return this.http
      .get<any>(
        this.baseUrl +
          `HealthCareDevices/GetSerialNumbersByFacilityId/${serialNUmber}/${facilityId}/${deviceId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SaveModalityConf(data: ModalityConfDto) {
    return this.http
      .post(this.baseUrl + `modalities/AddPatientModality`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditRpmDateAssigned(data: EditDateAssignedParamDto) {
    return this.http
      .put(this.baseUrl + `Rpm/EditRpmDateAssigned`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetAddressedBy(data: AlertAddressedByDto) {
    return this.http
      .put(this.baseUrl + `RpmAlerts/SetAddressedBy`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetIHealthDeviceConsentUrl(patientId: number) {
    return this.http
      .get(this.baseUrl + `IHealth/GetCode/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDexcomCheckAuthGiven(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Dexcom/CheckAuthGiven/patientId?patientId=${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDexcomDeviceConsentUrl(patientId: number) {
    return this.http
      .get(this.baseUrl + `Dexcom/GetCode/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCalibrations(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/GetCalibrations/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCalibrationsV3(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/V3/GetCalibrations/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEgvs(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/GetEgvs/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEgvsV3(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/V3/GetEgvs/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEvents(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/GetEvents/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEventsV3(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/V3/GetEvents/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDexcomDevices(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/GetDevices/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDexcomDevicesV3(patientId: number, stDate: string, endDate: string) {
    return this.http
      .get(
        this.baseUrl +
          `Dexcom/V3/GetDevices/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDexcomStatistics(
    patientId: number,
    stDate: string,
    endDate: string,
    dObj: DexcomGetStatParamDto
  ) {
    return this.http
      .post(
        this.baseUrl +
          `Dexcom/GetStatistics/${patientId}?startDate=${stDate}&endDate=${endDate}`,
        dObj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetOmronDeviceConsentUrl(patientId: number) {
    return this.http
      .get(this.baseUrl + `Omron/GetCode/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetWithingsDeviceConsentUrl(patientId: number) {
    return this.http
      .get(this.baseUrl + `Withings/GetCode/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DownloadDeviceData(
    deviceVendor: string,
    modalityCode: string,
    patientId: number
  ) {
    if (modalityCode === "BP" && deviceVendor === "IH") {
      return this.http
        .get(
          this.baseUrl + `IHealth/DownloadUserBPData/${patientId}`,
          httpOptions
        )
        .pipe(catchError(this.httpErrorService.handleHttpError));
    } else if (modalityCode === "WT" && deviceVendor === "IH") {
      return this.http
        .get(
          this.baseUrl + `IHealth/DownloadUserWeightData/${patientId}`,
          httpOptions
        )
        .pipe(catchError(this.httpErrorService.handleHttpError));
    } else if (modalityCode === "BG" && deviceVendor === "IH") {
      return this.http
        .get(
          this.baseUrl + `IHealth/DownloadUserBGData/${patientId}`,
          httpOptions
        )
        .pipe(catchError(this.httpErrorService.handleHttpError));
    }
    // else if ( modalityCode === 'BP' && deviceVendor === 'IH' ) {
    //   return this.http.get(this.baseUrl + `IHealth/DownloadUserBPData/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    // }
  }
  DownloadIhealthAllModalitiesDeviceData(
    deviceVendor: string,
    modalityCode: string,
    patientId: number
  ) {
    // BloodPressure, Pulse, Weight, BloodGlucose, Activity
    let mCOde = "";
    switch (modalityCode) {
      case "BP":
        mCOde = "BloodPressure";
        break;
      case "WT":
        mCOde = "Weight";
        break;
      case "PO":
        mCOde = "Pulse";
        break;
      case "BG":
        mCOde = "BloodGlucose";
        break;
      case "AT":
        mCOde = "Activity";
        break;
      default:
        break;
    }
    return this.http
      .get(
        this.baseUrl + `IHealth/DownloadUserData/${patientId}/${mCOde}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmDailyReadingsSummary(
    filter: RpmDailyReadingsFilterEnum,
    startDate: string,
    endDate: string
  ) {
    return this.http
      .get(
        this.baseUrl +
          `Rpm/GetRpmDailyReadingsSummary?filter=${filter}&startDate=${startDate}&endDate=${endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getStartAndEndDateOfMonth(monthId: number, year: number) {
    this.startDate = `${year}-${monthId}-1`;
    // const lastDateOfMonth =  moment(this.startDate, 'yyyy-mm-dd').daysInMonth();
    this.endDate = moment(this.startDate, "YYYY-M-D").endOf("month").format("YYYY-MM-DD");
    // this.endDate = `${year}-${monthId}-${lastDateOfMonth}`;
  }
  getLastThirtyDaysStartAndEndDate() {
    var today = new Date();
    var priorDate = new Date(new Date().setDate(today.getDate() - 29));
    this.startDate = moment(priorDate).format("YYYY-MM-DD");
    this.endDate = moment(new Date()).format("YYYY-MM-DD");
  }
  GetBPDisplayData(patientId: number, monthId: number, year: number, lastThirtyDays?: boolean) {
    if(lastThirtyDays){
      this.getLastThirtyDaysStartAndEndDate();
    }else{
      this.getStartAndEndDateOfMonth(monthId, year);
    }
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetBPDeviceDatabyPatientId/${patientId}?startDate=${this.startDate}&endDate=${this.endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetWeightDeviceDatabyPatientId(
    patientId: number,
    monthId: number,
    year: number,
    lastThirtyDays?: boolean
  ) {
    if(lastThirtyDays){
      this.getLastThirtyDaysStartAndEndDate();
    }else{
      this.getStartAndEndDateOfMonth(monthId, year);
    }
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetWeightDeviceDatabyPatientId/${patientId}?startDate=${this.startDate}&endDate=${this.endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBloodGlucoseDeviceDatabyPatientId(
    patientId: number,
    monthId: number,
    year: number,
    lastThirtyDays?: boolean
  ) {
    if(lastThirtyDays){
      this.getLastThirtyDaysStartAndEndDate();
    }else{
      this.getStartAndEndDateOfMonth(monthId, year);
    }
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetBloodGlucoseDeviceDatabyPatientId/${patientId}?startDate=${this.startDate}&endDate=${this.endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPulseDeviceDatabyPatientId(
    patientId: number,
    monthId: number,
    year: number,
    lastThirtyDays?: boolean
  ) {
    if(lastThirtyDays){
      this.getLastThirtyDaysStartAndEndDate();
    }else{
      this.getStartAndEndDateOfMonth(monthId, year);
    }
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetPulseDeviceDatabyPatientId/${patientId}?startDate=${this.startDate}&endDate=${this.endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetActivityDeviceDatabyPatientId(
    patientId: number,
    monthId: number,
    year: number,
    lastThirtyDays?: boolean
  ) {
    if(lastThirtyDays){
      this.getLastThirtyDaysStartAndEndDate();
    }else{
      this.getStartAndEndDateOfMonth(monthId, year);
    }
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetActivityDeviceDatabyPatientId/${patientId}?startDate=${this.startDate}&endDate=${this.endDate}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRPMVendorToken(patientId: number, deviceVendorId: number) {
    return this.http
      .get(
        this.baseUrl +
          `IHealth/GetRPMVendorToken/${patientId}/${deviceVendorId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateDeviceStatus(deviceId: number, status: boolean) {
    const obj = {
      hcDeviceId: deviceId,
      isActive: status,
    };
    return this.http
      .put(
        this.baseUrl + `HealthCareDevices/UpdateDeviceStatus`,
        obj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdatePatientDeviceStatus(
    patientId: number,
    deviceId: number,
    status: boolean
  ) {
    const obj = {
      patientId: patientId,
      patientDeviceId: deviceId,
      isActive: status,
    };
    return this.http
      .put(
        this.baseUrl + `HealthCareDevices/UpdatePatientDeviceStatus`,
        obj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientDevice(data: DeletePatientDeviceDto) {
    return this.http
      .post(
        this.baseUrl + "HealthCareDevices/DeletePatientDevice",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordBPDeviceReading(data: RecordDeviceReadingFromImageDto) {
    return this.http
      .post(this.baseUrl + "Rpm/RecordBPDeviceReading", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordWTDeviceReading(data: RecordDeviceReadingFromImageDto) {
    return this.http
      .post(this.baseUrl + "Rpm/RecordWTDeviceReading", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordPODeviceReading(data: RecordDeviceReadingFromImageDto) {
    return this.http
      .post(this.baseUrl + "Rpm/RecordPODeviceReading", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordBGDeviceReading(data: RecordDeviceReadingFromImageDto) {
    return this.http
      .post(this.baseUrl + "Rpm/RecordBGDeviceReading", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordATDeviceReading(data: RecordDeviceReadingFromImageDto) {
    return this.http
      .post(this.baseUrl + "Rpm/RecordATDeviceReading", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendAlertSms(data: SendAlertSmsDto) {
    return this.http
      .put(this.baseUrl + "RpmAlerts/SendAlertSms", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendRpmAlertChat(data: SendRpmAlertChatDto) {
    return this.http
      .put(this.baseUrl + "RpmAlerts/SendRpmAlertChat", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddAllertCallLog(data: AddRpmAlertCallDto) {
    return this.http
      .put(this.baseUrl + "RpmAlerts/AddRpmAlertCall", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditRpmALert(data: EditRpmALertDto) {
    return this.http
      .put(this.baseUrl + `RpmAlerts/${data.id}`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmAlerts(patientId: number, facilityId: number) {
    return this.http
      .get(
        this.baseUrl +
          `RpmAlerts?PatientId=${patientId}&facilityId=${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRPMAlertsForDashboard(patientId: number, facilityId: number) {
    return this.http
      .get(
        this.baseUrl +
          `RpmAlerts/GetRPMAlertsForDashboard?patientId=${patientId}&facilityId=${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDefaultNotReceivedSmsContent(patientId: number, modalityName: string) {
    return this.http
      .get(
        this.baseUrl +
          `RpmAlerts/GetDefaultNotReceivedSmsContent/${patientId}?ModalityName=${modalityName}`,
        httpOptions1
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetQualityChecked(encounterId: number, qualityChecked: RpmQualityCheckedEnum) {
    return this.http
      .put(
        this.baseUrl +
          `Rpm/SetQualityChecked/${encounterId}?qualityChecked=${qualityChecked}`,
        {},
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRmpReadings(patientId: number) {
    return this.http
      .get(this.baseUrl + `Rpm/GetRmpReadings/${patientId}`, httpOptions1)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ResetQualityChecked(facilityId: number) {
    return this.http
      .put(
        this.baseUrl + `Rpm/ResetQualityChecked/${facilityId}`,
        {},
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  GetMonthlyPatientsRmpData(data: RmpDashboardParamsDto) {
    return this.http
      .get(
        this.baseUrl +
          `Rpm/GetMonthlyPatientsRmpData?FilteredMonth=${data.FilteredMonth}&CareCoordinatorId=
    ${data.CareCoordinatorId}&CareFacilitatorId=${data.CareFacilitatorId}&FacilityId=${data.FacilityId}&Status=${data.status}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmPatients(data: RpmPatientsScreenParams) {
    // if (data.duration == undefined) {
    //   data.duration = -1;
    // }
    return this.http
      .get(
        this.baseUrl +
          "Rpm/GetRpmPatients?PageNumber=" +
          data.pageNumber +
          "&PageSize=" +
          data.pageSize +
          "&CustomListId=" +
          data.customListId +
          "&FilterBy=" +
          data.filterBy +
          "&PatientStatus=" +
          data.patientStatus +
          "&RpmStatus=" +
          data.rpmStatus +
          "&LastReadingStartDate=" +
          data.lastReadingStartDate +
          "&LastReadingEndDate=" +
          data.lastReadingEndDate +
          "&LastLogStartDate=" +
          data.lastLogStartDate +
          "&LastLogEndDate=" +
          data.lastLogEndDate +
          "&CareProviderId=" +
          data.careProviderId +
          "&BillingProviderId=" +
          data.billingProviderId +
          "&CareFacilitatorId=" +
          data.careFacilitatorId +
          "&DiseaseIds=" +
          data.diseaseIds +
          "&FacilityId=" +
          data.facilityId +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.searchParam +
          "&ServiceMonth=" +
          data.serviceMonth +
          "&ServiceYear=" +
          data.serviceYear +
          // '&Section=' +
          // data.section +
          // '&Duration=' +
          // data.duration +
          "&ShowAll=" +
          data.showAll +
          "&RPMCareCoordinatorId=" +
          data.rpmCareCoordinatorId +
          "&FilteredMonth=" +
          data.filteredMonth +
          "&Assigned=" +
          data.Assigned +
          "&DateAssignedFrom=" +
          data.DateAssignedFrom +
          "&DateAssignedTo=" +
          data.DateAssignedTo +
          "&FromTransmissionDays=" +
          data.FromTransmissionDays +
          "&ToTransmissionDays=" +
          data.ToTransmissionDays +
          "&rpmTimeRange=" +
          data.rpmTimeRange +
          "&ShowActivePatientsWithNoReadings=" +
          data.showActivePatientsWithNoReadings +
          "&ShowInActivePatientsWithReadings=" +
          data.showInActivePatientsWithReadings +
          "&RpmMonthlyStatus=" +
          data.rpmMonthlyStatus +
          "&CommunicationConsent=" +
          data.communicationConsent +
          "&PatientNotRespond=" +
          data.patientNotRespond,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientsRmpReadingsList(data: RmpReadingsSearchParam) {
    return this.http
      .get(
        this.baseUrl +
          "Rpm/GetPatientsRmpReadingsList?PageNumber=" +
          data.pageNumber +
          "&PageSize=" +
          data.pageSize +
          "&FromReadingDate=" +
          data.fromReadingDate +
          "&ToReadingDate=" +
          data.toReadingDate +
          "&CareProviderId=" +
          data.careProviderId +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.searchParam +
          "&ModalityCode=" +
          data.modalityCode +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          "&PatientId=" +
          data.patientId,
        httpOptions
      )

      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SavePateintModalityAlertData(
    patientId: number,
    selectedModalityCode: string,
    dObj: AlertsNew
  ) {
    let ObjectData = {};
    let urlPart = "";
    if (selectedModalityCode === "BP") {
      ObjectData = dObj.threshold.bloodPressure;
      urlPart = "SetBpThreshhold";
    }
    if (selectedModalityCode === "WT") {
      ObjectData = dObj.threshold.weight;
      urlPart = "SetWeightThreshhold";
    }
    if (selectedModalityCode === "PO") {
      ObjectData = dObj.threshold.pulse;
      urlPart = "SetPulseThreshhold";
    }
    if (selectedModalityCode === "BG") {
      ObjectData = dObj.threshold.bloodGlucose;
      urlPart = "SetBgThreshhold";
    }
    if (selectedModalityCode === "AT") {
      ObjectData = dObj.threshold.activity;
      urlPart = "SetActivityThreshhold";
    }
    let unitVal = 0;
    if (dObj.notify.timeUnit === "hours") {
      unitVal = dObj.notify.timeLapse;
    }
    if (dObj.notify.timeUnit === "days") {
      unitVal = dObj.notify.timeLapse * 24;
    }
    ObjectData["dataTimeOut"] = unitVal;
    if (!ObjectData["id"]) {
      ObjectData["id"] = 0;
    }
    return this.http
      .post(
        this.baseUrl + `PHDevices/${urlPart}/${patientId}`,
        ObjectData,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmCarePlan(patientId: number) {
    return this.http
      .get(this.baseUrl + `rpm/GetRpmCarePlan/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditRpmCarePlan(body: any) {
    return this.http
      .put(this.baseUrl + `rpm/EditRpmCarePlan`, body, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetThreshholdData(patientId: number, modalityCode: string) {
    return this.http
      .get(
        this.baseUrl +
          `PHDevices/GetThreshholdData/${patientId}?modalityCode=${modalityCode}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRPMDeviceReadingsbyPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Rpm/GetRPMDeviceReadingsbyPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPHDevicesByPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `PHDevices/GetPHDevicesByPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPHDevicesDataByPatientId(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `PHDevices/GetPHDevicesDataByPatientId/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCareGapReadingsForRPM(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Rpm/GetCareGapReadingsForRPM/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editRpmReadings(editRpmReading: EditRpmReadingDto) {
    return this.http
      .put(this.baseUrl + "Rpm/EditRpmReading", editRpmReading, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDevicesDatabyPatientId(
    patientId: number,
    monthID: number,
    yearId: number
  ) {
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetDevicesDatabyPatientId/${patientId}/${monthID}/${yearId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  downloadRPMEncountersAndReadings(rpmDownloadDataDto) {
    return this.http.post(
      this.baseUrl + "Rpm/DownloadRPMEncountersAndReadings",
      rpmDownloadDataDto,
      { responseType: "blob" }
    );
  }
  downloadRPMEncountersAndReadingsPDF(rpmDownloadDataDto) {
    return this.http.post(
      this.baseUrl + "Rpm/DownloadRPMEncountersAndReadingsPDF",
      rpmDownloadDataDto,
      { responseType: "blob" }
    );
  }
  getRpmModalityStatistics(patientId: number) {
    return this.http
      .get(
        this.baseUrl + `Rpm/GetRpmModalityStatistics/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getRPMPatientListExcelFile(data: RpmPatientsScreenParams) {
    // if (data.duration == undefined) {
    //   data.duration = -1;
    // }
    return this.http
      .get(
        this.baseUrl +
          "Rpm/GetRPMPatientListExcelFile?PageNumber=" +
          data.pageNumber +
          "&PageSize=" +
          data.pageSize +
          "&CustomListId=" +
          data.customListId +
          "&FilterBy=" +
          data.filterBy +
          "&PatientStatus=" +
          data.patientStatus +
          "&RpmStatus=" +
          data.rpmStatus +
          "&LastReadingStartDate=" +
          data.lastReadingStartDate +
          "&LastReadingEndDate=" +
          data.lastReadingEndDate +
          "&LastLogStartDate=" +
          data.lastLogStartDate +
          "&LastLogEndDate=" +
          data.lastLogEndDate +
          "&CareProviderId=" +
          data.careProviderId +
          "&BillingProviderId=" +
          data.billingProviderId +
          "&CareFacilitatorId=" +
          data.careFacilitatorId +
          "&DiseaseIds=" +
          data.diseaseIds +
          "&FacilityId=" +
          data.facilityId +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.searchParam +
          "&ServiceMonth=" +
          data.serviceMonth +
          "&ServiceYear=" +
          data.serviceYear +
          // '&Section=' +
          // data.section +
          // '&Duration=' +
          // data.duration +
          "&ShowAll=" +
          data.showAll +
          "&RPMCareCoordinatorId=" +
          data.rpmCareCoordinatorId +
          "&FilteredMonth=" +
          data.filteredMonth +
          "&Assigned=" +
          data.Assigned +
          "&DateAssignedFrom=" +
          data.DateAssignedFrom +
          "&DateAssignedTo=" +
          data.DateAssignedTo +
          "&FromTransmissionDays=" +
          data.FromTransmissionDays +
          "&ToTransmissionDays=" +
          data.ToTransmissionDays +
          "&rpmTimeRange=" +
          data.rpmTimeRange +
          "&ShowActivePatientsWithNoReadings=" +
          data.showActivePatientsWithNoReadings +
          "&ShowInActivePatientsWithReadings=" +
          data.showInActivePatientsWithReadings,
        { responseType: "blob" }
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientRPMMonthlyStatus(data) {
    return this.http
      .put(this.baseUrl + "Rpm/EditPatientRPMMonthlyStatus", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientRPMStatusHistory(patientId) {
    return this.http
      .get(
        this.baseUrl + `Rpm/GetPatientRPMStatusHistory/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetIsBleEnabled(data: SetIsBleEnabled){
    return this.http
      .post(this.baseUrl + `Rpm/SetIsBleEnabled/${data.patientId}?enable=${data.enable}`,httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  IsBleEnabled(patientId){
    return this.http .get(
        this.baseUrl + `Rpm/IsBleEnabled/${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DownloadRPMCarePlanPdfByPatientId(patientId){
    return this.http.get(
      this.baseUrl + `Rpm/DownloadRPMCarePlanPdfByPatientId/${patientId}`, { responseType: 'blob' })
  }
  GetRpmMRTypes() {
    return this.http.get(this.baseUrl + `RpmMRType` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmMRProblems() {
    return this.http.get(this.baseUrl + `RpmMRProblem` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmMRInterventions() {
    return this.http.get(this.baseUrl + `RpmMRIntervention` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmMRGoals() {
    return this.http.get(this.baseUrl + `RpmMRGoal` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMRProblemsByTypeId(id){
    return this.http.get(this.baseUrl + `RpmMRProblems/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
