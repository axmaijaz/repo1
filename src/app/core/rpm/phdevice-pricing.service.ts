import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { SaleDeviceToFacilityDto } from 'src/app/model/Inventory/rpm-inventory.model';
import { EditPHDevicePricingDto, EditTransmissionChargesDto} from 'src/app/model/rpm/phdevice-pricing.model';
import { CheckPatientDeviceExistsDto } from 'src/app/model/ScreeningTools/phq.modal';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PhdevicePricingService {

  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  
  constructor( private httpErrorService: HttpErrorHandlerService, private http: HttpClient) { }
  
  GetDefaultPricings() {
    return this.http.get(this.baseUrl + `PhDevicePricings/GetDefaultPricings` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPricingsByFacilityId(facilityId: number) {
    return this.http.get(this.baseUrl + `PhDevicePricings/GetPricingsByFacilityId/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditDefaultPhDevicePricing(obj: EditPHDevicePricingDto) {
    return this.http.put(this.baseUrl + `PhDevicePricings/EditDefaultPhDevicePricing`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPhDevicePricing(obj: EditPHDevicePricingDto) {
    return this.http.put(this.baseUrl + `PhDevicePricings/EditPhDevicePricing`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDefaultTransmissionCharges() {
    return this.http.get(this.baseUrl + `TransmissionCharges/GetDefaultTransmissionCharges` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTransmissionChargesByFacilityId(facilityId: number) {
    return this.http.get(this.baseUrl + `TransmissionCharges/GetTransmissionChargesByFacilityId/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditDefaultTransmissionCharges(obj: EditTransmissionChargesDto) {
    return this.http.put(this.baseUrl + `TransmissionCharges/EditDefaultTransmissionCharges`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditTransmissionCharges(obj: EditTransmissionChargesDto) {
    return this.http.put(this.baseUrl + `TransmissionCharges/EditTransmissionCharges`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MultipleSaleDeviceToFacility(obj: SaleDeviceToFacilityDto) {
    return this.http.post(this.baseUrl + `PHDevices/MultipleSaleDeviceToFacility`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CheckPatientDeviceExists(checkPatientDeviceExistsDto: CheckPatientDeviceExistsDto){
    return this.http.get(this.baseUrl + `PHDevices/CheckPatientDeviceExists/${checkPatientDeviceExistsDto.patientId}?modalityCode=${checkPatientDeviceExistsDto.modalityCode}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  } 
}
