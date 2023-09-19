import { data } from "jquery";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { HttpErrorHandlerService } from "src/app/shared/http-handler/http-error-handler.service";
import { SecurityService } from "../security/security.service";
import {
  FacilityDto,
  CreateFacilityUserDto,
  OrganizationDto,
  SetFacilityServiceConfigDto,
  UserInActiveDto,
  EditFacilityIntegrationConfigDto,
  MarkFacilityUsersSmsAlertDto,
} from "src/app/model/Facility/facility.model";
import { Observable } from "rxjs";
import { FacilityNotificationDto } from "src/app/model/Facility/facility-notification.model";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class FacilityService {
  isFacilitySubVendor = false;
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}

  addFacilityUSer(data: CreateFacilityUserDto, isLocumCareProvider: boolean) {
    return this.http
      .post(
        this.baseUrl +
          "Facility/AddFacilityUser?isLocumCareProvider=" +
          isLocumCareProvider,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  editFacilityUSer(data: CreateFacilityUserDto) {
    const obj = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email: data.email,
      title: data.title,
      contactPreferenceId: 0,
      countryCallingCode: data.countryCallingCode,
      // isBillingProvider: data.isBillingProvider,
      phoneNo: data.phoneNo,
    };
    return this.http
      .put(
        this.baseUrl + "Facility/EditFacilityUser/" + data.id,
        obj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editFacility(data: FacilityDto) {
    const obj = {
      id: data.id,
      facilityName: data.facilityName,
      shortName: data.shortName,
      facilityDescription: data.facilityDescription,
      zipCode: data.zipCode,
      phoneNumber: data.phoneNumber,
      contactEmail: data.contactEmail,
      facilityType: data.facilityType,
      faxNumber: data.faxNumber,
      website: data.website,
      address: data.address,
      city: data.city,
      stateName: data.stateName,
      placeId: "",
      latitude: "",
      longitude: "",
      organizationId: data.organizationId,
      emrId: data.emrId,
      invoiceContactEmail: data.invoiceContactEmail,
      invoiceContactCCEmail: data.invoiceContactCCEmail,
    };
    return this.http
      .put(this.baseUrl + "Facility/EditFacility/" + data.id, obj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  registerFacility(data: FacilityDto) {
    return this.http
      .post(this.baseUrl + "Facility/RegisterFacility", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  registerOrganization(data: OrganizationDto) {
    return this.http
      .post(this.baseUrl + "Facility/CreateOrganization", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignFacilitiesToUsers(data: any) {
    return this.http
      .post(
        this.baseUrl + "Facility/AssignFacilitiesToUsers",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SwitchFacility(data: any) {
    return this.http
      .post(this.baseUrl + "Facility/SwitchFacility", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getorganizationList(orgType?) {
    return this.http
      .get(this.baseUrl + `Facility/GetAllOrganizations?orgTypes=${orgType || ''}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFacilityByOrgId(id: number, showInActive?: boolean, includeWhiteLabelled?: boolean) {
    if(!showInActive){
      showInActive = false;
    }
    if(!includeWhiteLabelled){
      includeWhiteLabelled = false;
    }
    return this.http
      .get(
        this.baseUrl +
          `Facility/GetFacilitiesByOrganizationId/${id}?showAll=${showInActive}&includeWhiteLabelled=${includeWhiteLabelled}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFaciliesByUserId(id: number) {
    return this.http
      .get(this.baseUrl + "Facility/GetUserFacilitiesIds/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFaciliesDetailsByUserId(id: number) {
    return this.http
      .get(
        this.baseUrl + "Facility/GetFacilitiesByFacilityUserId/" + id,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFacilityList() {
    return this.http
      .get(this.baseUrl + "Facility", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  changeFacilityUser(data: any) {
    return this.http
      .post(this.baseUrl + "Facility/ChangeFacilityUser", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDeletedFacilityUsers() {
    return this.http
      .get(this.baseUrl + "Facility/GetDeletedFacilityUsers", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  recoverFacilityUser(id: number) {
    return this.http
      .post(
        this.baseUrl + "Facility/RecoverFacilityUser?facilityUserId=" + id,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  getFacilityUserList(facilityId: number, showAll?: boolean) {
    return this.http
      .get(
        this.baseUrl +
          `Facility/GetFacilityUsers/${facilityId}?showAll=${showAll || false}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilitiesUsers(facilityIds: number[]) {
    const newArr = facilityIds.filter((x) => x !== -1 && x !== 0);
    return this.http
      .get(
        this.baseUrl + "Facility/GetFacilitiesUsers?facilityIds=" + newArr,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCareProvidersByFacilityId(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + "Facility/GetCareProvidersByFacilityId/" + facilityId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCareFacilitatorsByFacilityId(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + "Facility/GetCareFacilitatorsByFacilityId/" + facilityId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityUsers(facilityId: number, roleName: string) {
    return this.http
      .get(
        this.baseUrl +
          `Facility/GetFacilityUsers/${facilityId}?roleName=${roleName}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFacilityBillingProviderList(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + "Facility/GetFacilityUsers/" + facilityId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityNotificationConfig(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + "Facility/GetFacilityNotificationConfig/" + facilityId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditFacilityNotificationConfig(facilityNotifSetting: FacilityNotificationDto) {
    return this.http
      .put(
        this.baseUrl + "Facility/EditFacilityNotificationConfig", facilityNotifSetting ,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFacilityUserById(userId: number) {
    return this.http
      .get(this.baseUrl + "Facility/GetFacilityUser/" + userId, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getBillingProviderByFacilityId(userId: number) {
    return this.http
      .get(
        this.baseUrl + "Facility/GetBillingProvidersByFacilityId/" + userId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getFacilityDetail(id: number) {
    return this.http
      .get(this.baseUrl + "Facility/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getBillingProvidersByFacilityId(
    facilityId: number
  ): Observable<Array<CreateFacilityUserDto>> {
    return this.http
      .get<Array<CreateFacilityUserDto>>(
        this.baseUrl + `Facility/GetBillingProvidersByFacilityId/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getCareProvidersByFacilityId(
    facilityId: number
  ): Observable<Array<CreateFacilityUserDto>> {
    return this.http
      .get<Array<CreateFacilityUserDto>>(
        this.baseUrl + `Facility/GetCareProvidersByFacilityId/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  removeFacility(id: number) {
    return this.http
      .delete(this.baseUrl + "Facility/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTermsAndConditions(id: number) {
    return this.http
      .get(
        this.baseUrl + `General/GetTermsAndConditionsbyTermType/${id}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddCareProviderSchedule(data: any) {
    return this.http
      .post(
        this.baseUrl + `CareProvider/AddCareProviderSchedule`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getScheduleByFacilityId(facilityId: number) {
    return this.http
      .get(
        this.baseUrl +
          `CareProvider/GetCareProviderSchedulebyFacility/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  archiveFacilityUser(facilityUserId: number) {
    return this.http
      .post(
        this.baseUrl + `Facility/ArchiveFacilityUser/${facilityUserId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getEmrList() {
    return this.http
      .get(this.baseUrl + `facility/getemrlist`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editMonthlyCharge(facilityId: number, charge: number) {
    return this.http
      .put(
        this.baseUrl + `Facility/EditMonthlyCharge/${facilityId}/${charge}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  copyCptCodeFomOtherFacility(
    currentFacilityId: number,
    selectedFacilityId: number
  ) {
    return this.http
      .put(
        this.baseUrl +
          `facilityClaimCharges/${currentFacilityId}/fromfacility/${selectedFacilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityForms(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + `Facility/GetFacilityForms/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditFacilityIntegrationConfig(mObj: EditFacilityIntegrationConfigDto) {
    return this.http
      .put(
        this.baseUrl + `Facility/EditFacilityIntegrationConfig`, mObj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientCustomForms(patientId: number, awId: number) {
    return this.http
      .get(
        this.baseUrl + `Patients/GetPatientCustomForms/${patientId}/${awId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditMonthlyTarget(facilityId: number, monthlyTarget: number) {
    return this.http
      .put(
        this.baseUrl +
          `Facility/AddEditMonthlyTarget/${facilityId}/${monthlyTarget}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyTarget(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + `Facility/GetMonthlyTarget/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddFacilityForms(facilityId: number, data: any) {
    return this.http
      .post(
        this.baseUrl + `Facility/AddFacilityForms/${facilityId}`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditOrganization(data: any) {
    return this.http
      .post(this.baseUrl + "Facility/EditOrganization", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityServiceConfig(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + `FacilityServiceConfig/GetByFacilityId/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetFacilityServiceCOnfig(
    setFacilityChatService: SetFacilityServiceConfigDto
  ) {
    return this.http
      .put(
        this.baseUrl + `FacilityServiceConfig`,
        setFacilityChatService,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EnableFacilityUser(facilityUserId) {
    return this.http
      .delete(
        this.baseUrl + `Facility/EnableFacilityUser/${facilityUserId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DisableFacilityUser(facilityUserId) {
    return this.http
      .delete(
        this.baseUrl + `Facility/DisableFacilityUser/${facilityUserId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MakeUserInActive(userInActiveDto: UserInActiveDto) {
    return this.http
      .put(
        this.baseUrl +
          `Facility/MakeUserInActive?UserId=${userInActiveDto.userId}&InActive=${userInActiveDto.inActive}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MakeFacilityInActive(facilityId, inActive: boolean) {
    return this.http
      .put(
        this.baseUrl +
          `Facility/MakeFacilityInActive?FacilityId=${facilityId}&InActive=${inActive}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  WPLogin(facilityUserId) {
    return this.http
      .post(this.baseUrl + `WordPress/WPLogin/${facilityUserId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MarkFacilityUserAsSubVendor(facilityUserId, isSubVendor){
    return this.http
      .post(this.baseUrl + `Facility/MarkFacilityUserAsSubVendor/${facilityUserId}?isSubVendor=${isSubVendor}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSmsAlertEnabledFacilityUsers(facilityId:number){
    return this.http
      .get(this.baseUrl + `Facility/GetSmsAlertEnabledFacilityUsers?facilityId=${facilityId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MarkFacilityUsersSmsAlertEnabled(dObj: MarkFacilityUsersSmsAlertDto){
    return this.http
      .put(this.baseUrl + `Facility/MarkFacilityUsersSmsAlertEnabled?facilityId=${dObj.facilityId}`, dObj.facilityUserIds, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
