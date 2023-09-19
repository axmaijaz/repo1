import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpErrorHandlerService } from "../shared/http-handler/http-error-handler.service";
import { SecurityService } from "./security/security.service";
import { catchError } from "rxjs/operators";
import {
  AddDeviceDto,
  IssueDevicesDto,
} from "../model/deviceModels/device.model";
import { DeleteRecordedImageDto } from "../rpm/device-data-sync/device-data-sync.component";
import { DeviceRequestStatus, FilterDeviceRequestDto, NewDeviceRequestDto, SaleDeviceToFacilityDto, TransferDeviceToFacilityDto } from "../model/Inventory/rpm-inventory.model";
import { Subject } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
const httpOptions1 = {
  headers: new HttpHeaders({
    "Content-Type": "image/jpeg",
  }),
};

@Injectable({
  providedIn: "root",
})
export class DeviceManagementService {
  loadSaleDetailsDevice = new Subject<number>();
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetHealthCareDevices(deviceId: number) {
    return this.http
      .get(
        this.baseUrl + "HealthCareDevices/GetHealthCareDevices/" + deviceId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDeviceVendors() {
    return this.http
      .get(this.baseUrl + "DeviceVendors/GetDeviceVendors", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetModalities() {
    return this.http
      .get(this.baseUrl + "modalities/GetModalities", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDeviceInventorybyId(facilityId: number) {
    return this.http
      .get(
        this.baseUrl +
          `HealthCareDevices/GetDeviceInventorybyFacilityId/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmInventoryData(facilityId: number) {
    return this.http
      .get(
        this.baseUrl + `PHDevices/GetRpmInventoryData/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmInventoryDevices(
    facilityId: number,
    inHand: boolean,
    issued: boolean,
    disposed: boolean,
    deviceModel = "",
    patientId = 0
  ) {
    return this.http
      .get(
        this.baseUrl +
          `PHDevices/GetRpmInventoryDevices?facilityId=${facilityId}&inHand=${inHand}&issued=${issued}&disposed=${disposed}&deviceModel=${deviceModel}&patientId=${patientId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignDeviceToPatient(
    patientID: number,
    deviceId: number,
    cpT99453: boolean,
    installationDate?: string
  ) {
    const pObj = {
      patientId: patientID,
      phDeviceId: deviceId,
      cpT99453: cpT99453,
    };
    if(installationDate) {
      pObj['installationDate'] = installationDate;
    }
    return this.http
      .put(this.baseUrl + `PHDevices/AssignDeviceToPatient`, pObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ReturnDeviceToInventory(patientID: number, deviceId: number) {
    const pObj = {
      patientId: patientID,
      phDeviceId: deviceId,
    };
    return this.http
      .put(
        this.baseUrl + `PHDevices/ReturnDeviceToInventory`,
        pObj,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddHealthCareDevice(data: any) {
    const uploadImage = new FormData();

    uploadImage.append("ImagePath", data.imagePath);
    uploadImage.append("Id", data.id);
    uploadImage.append("DeviceName", data.deviceName);
    uploadImage.append("Description", data.description);
    uploadImage.append("Price", data.price);
    uploadImage.append("DeviceVendorId", data.deviceVendorId);
    uploadImage.append("ModalityId", data.modalityId);
    uploadImage.append("SerialNumber", data.serialNumber);
    return this.http
      .post(
        this.baseUrl +
          `HealthCareDevices/AddHealthCareDevice?ImagePath=${data.imagePath}`,
        uploadImage
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddIssueDevices(data: IssueDevicesDto) {
    return this.http
      .put(
        this.baseUrl + "HealthCareDevices/IssueHealthCareDevice",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetUnRecordedImg(patientId: number) {
    return this.http
      .get(this.baseUrl + `Rpm/GetUnRecordedImages/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordDeviceReadingFromImage(data: any) {
    return this.http
      .post(
        this.baseUrl + "Rpm/RecordDeviceReadingFromImage",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordBPDeviceReadingFromImage(data: any) {
    return this.http
      .post(
        this.baseUrl + "Rpm/RecordBPDeviceReadingFromImage",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordWTDeviceReadingFromImage(data: any) {
    return this.http
      .post(
        this.baseUrl + "Rpm/RecordWTDeviceReadingFromImage",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordPODeviceReadingFromImage(data: any) {
    return this.http
      .post(
        this.baseUrl + "Rpm/RecordPODeviceReadingFromImage",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordBGDeviceReadingFromImage(data: any) {
    return this.http
      .post(
        this.baseUrl + "Rpm/RecordBGDeviceReadingFromImage",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RecordATDeviceReadingFromImage(data: any) {
    return this.http
      .post(
        this.baseUrl + "Rpm/RecordATDeviceReadingFromImage",
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteRecordedImage(imageId: any) {
    // Rpm / DeleteRecordedImage;
    // deleteImg.append("deviceReadingImageId", imageId);
    return this.http
      .post(this.baseUrl + "Rpm/DeleteRecordedImage", imageId, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendFile(path: string, patientId: number, modalityId: number, info?: string) {
    // const formdata = new FormData();
    // formdata.append('Image', Image);
    // formdata.append('PatientId', patientId);
    // formdata.append('ModalityId', modalityId);
    // formdata.append('Info', 'any info Info');
    const data = {
      path: path,
      patientId: patientId,
      modalityId: modalityId,
      info: info ? info : "",
    };
    return this.http.post(this.baseUrl + "Rpm/AddDeviceReadingImage", data);
  }
  GetModalitiesByPatientId(patientId: number) {
    return this.http.get(
      this.baseUrl + `modalities/GetModalitiesByPatientId/${patientId}`,
      httpOptions
    );
  }
  NavigateToMOdality(modalityID: number, patientId: number) {
    const myWin = window.open(
      this.baseUrl +
        `Rpm/RedirectToModality?patientId=${patientId}&modalityId=${modalityID}`,
      "_blank"
    );
    // tslint:disable-next-line: max-line-length
    // myWin.document.write('<!DOCTYPE html> <html> <head> <meta name="viewport" content="width=device-width, initial-scale=1"> <style> .loader { border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #3498db; width: 120px; height: 120px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style> </head> <body> <h2>Please Wait</h2> <div class="loader"></div> </body> </html>');
  }
  transferDeviceToFacility(
    transferDeviceToFacilityDto: TransferDeviceToFacilityDto
  ) {
    return this.http
      .put(
        this.baseUrl + "PHDevices/TransferDeviceToFacility",
        transferDeviceToFacilityDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SaleDeviceToFacility(saleDeviceToFacilityObj: SaleDeviceToFacilityDto) {
    return this.http.post(this.baseUrl + "PHDevices/SaleDeviceToFacility",saleDeviceToFacilityObj, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSalesByDeviceId(deviceId: number) {
    return this.http.get(this.baseUrl + `PHDevices/GetSalesByDeviceId/${deviceId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  WaiveOffInstallment(installmentId: number, waiveOff: boolean) {
    return this.http.put(this.baseUrl + `PHDevices/WaiveOffInstallment/${installmentId}?waiveOff=${waiveOff}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ActivatePhDevice(deviceId: number) {
    return this.http.put(this.baseUrl + `PHDevices/ActivatePhDevice/${deviceId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditSaleTrackingId(saleId: number, trackingId: string) {
    return this.http.put(this.baseUrl + `PHDevices/EditSaleTrackingId/${saleId}?trackingId=${trackingId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeActivatePhDevice(deviceId: number) {
    return this.http.put(this.baseUrl + `PHDevices/DeActivatePhDevice/${deviceId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPhDeviceHistory(deviceId: number) {
    return this.http.get(
      this.baseUrl + `PHDevices/GetPhDeviceHistory/${deviceId}`,
      httpOptions
    );
  }
  MarkDeviceDisposed(deviceId){
    return this.http.put(this.baseUrl + `PHDevices/MarkDeviceDisposed?deviceId=${deviceId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDeviceRequests(reqParm: FilterDeviceRequestDto){
    let rQ = '';
    if (reqParm.FacilityId) {
      rQ += `FacilityId=${reqParm.FacilityId}&`
    }
    if (reqParm.RequestStatus || reqParm.RequestStatus.some(x => x == DeviceRequestStatus.Open)) {
      rQ += `RequestStatus=${reqParm.RequestStatus}&`
    }
    if (reqParm.StartDate) {
      rQ += `StartDate=${reqParm.StartDate}&`
    }
    if (reqParm.EndDate) {
      rQ += `EndDate=${reqParm.EndDate}&`
    }
    if (reqParm.Assignee) {
      rQ += `Assignee=${reqParm.Assignee}&`
    }
    return this.http.get(this.baseUrl + `DeviceRequest?${rQ}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDeviceRequestById(reqId: number){
    return this.http.get(this.baseUrl + `DeviceRequest/GetDeviceRequestBy/${reqId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDeviceRequestDetail(reqId: number, requestNo: string){
    return this.http.get(this.baseUrl + `DeviceRequest/GetDevicesDetailByRequestNo?id=${reqId}&requestNo=${requestNo}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreateDeviceRequest(deviceRequest: NewDeviceRequestDto){
    return this.http.post(this.baseUrl + `DeviceRequest/CreateDeviceRequest`, deviceRequest , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignRequestToUser(userId: string, id: number){
    var rP = `?userId=${userId}&id=${id}`
    return this.http.put(this.baseUrl + `DeviceRequest/AssignRequestToUser${rP}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
