import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AssignPatientsToCareProvider } from 'src/app/model/Patient/patient.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(private http: HttpClient) {}
  addNewCareProvider(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'Admin/CreateCareProvider', data, httpOptions );
  }
  AssignPatientsToCareProvider(data: AssignPatientsToCareProvider): Observable<any> {
    return this.http.put(this.baseUrl + 'Patients/AssignPatientsToCareProviders', data, httpOptions );
  }
  getPatientSByCareProviderID(ID: number): Observable<any> {
    return this.http.get(this.baseUrl + 'CareProvider/GetPatientIdsByCareProviderId/' + ID, httpOptions );
  }
  getGetCareProviderList() {
    return this.http.get(this.baseUrl + 'CareProvider/GetCareProviders');
  }
}
