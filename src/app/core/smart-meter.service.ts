import { SMOrderStatus } from 'src/app/Enums/smartMeter.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateSMOrderDto, SMOrderDetailLine } from '../model/smartMeter.model';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { Subject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SmartMeterService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor( private httpErrorService: HttpErrorHandlerService, private http: HttpClient) { }
  ValidateDevice(deviceID: string) {
    const pData = {
      'api_key': 'string',
      'device_id': deviceID
    };
      return this.http.post(this.baseUrl + 'SmartMeter/ValidateDevice', pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ChangeOrderStatus(orderNumber: string, orderStatus: SMOrderStatus) {
    const pData = {
      'orderNumber': orderNumber,
      'status': orderStatus
    };
    return this.http.post(this.baseUrl + 'SmartMeter/ChangeOrderStatus', pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ReceiveOrder(orderNumber: string, cpT99453: boolean, line: SMOrderDetailLine, markAsClosed: boolean) {
    const obj = {
        "orderNumber": orderNumber,
        "cpT99453": cpT99453 || false,
        markAsClosed: markAsClosed,
        lines: [line]
    }
    return this.http.put(this.baseUrl + `SmartMeter/ReceiveOrder/${orderNumber}`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetOrderDetails(orderNumber: string) {
      return this.http.get(this.baseUrl + `SmartMeter/GetOrderDetails?orderNumber=${orderNumber}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSMOrders(searchStr: string, facilityId: number) {
      return this.http.get(this.baseUrl + `SmartMeter/GetOrders?searchString=${searchStr}&facilityId=${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSkus() {
      return this.http.get(this.baseUrl + `SmartMeter/GetSkus` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CancelSMOrder(orderNumber: string) {
      return this.http.delete(this.baseUrl + `SmartMeter/CancelOrder?orderNumber=${orderNumber}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getOrdersListByPatientId(patientId: number) {
      return this.http.get(this.baseUrl + `SmartMeter/GetOrdersListByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getOrdersListByFacilityId(facilitytId: number) {
      return this.http.get(this.baseUrl + `SmartMeter/GetOrdersListByFacilityId/${facilitytId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
