import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AddInventoryDto, CreateSMOrderDto } from 'src/app/model/smartMeter.model';
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
export class DeviceVendorService {

  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor( private httpErrorService: HttpErrorHandlerService, private http: HttpClient) { }
  GetDeviceVendors() {
    return this.http.get(this.baseUrl + `DeviceVendors/GetDeviceVendors` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSkusByVendorId(vendorId: number) {
    return this.http.get(this.baseUrl + `DeviceVendors/GetSkusByVendorId/${vendorId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDeviceModelsByVendorId(vendorId: number) {
    return this.http.get(this.baseUrl + `DeviceVendors/GetDeviceModelsByVendorId/${vendorId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreateSMOrder(pData: CreateSMOrderDto) {
    return this.http.post(this.baseUrl + 'DeviceVendors/CreateOrder', pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddInventory(pData: AddInventoryDto) {
    return this.http.post(this.baseUrl + 'DeviceVendors/AddInventory', pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
