import { EditComplaintDto } from 'src/app/model/AppModels/complaints.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddComplaintDto, ComplaintsDashboardFilterDto } from '../model/AppModels/complaints.model';
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
export class ComplaintsService {
  refreshComplaintCount = new Subject();
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor( private httpErrorService: HttpErrorHandlerService, private http: HttpClient) { }
  GetComplaintsByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `Complaint/GetComplaintsByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientComplaintsForDashboard(data: ComplaintsDashboardFilterDto) {
    // let departmentsList = '';
    // departmentsList = data.departmentType.filter(x => x !== 0).toString();
    return this.http.get(this.baseUrl + `Complaint/GetComplaintsForDashboard?PageNumber=` +
      data.pageNumber +
      '&PageSize=' +
      data.pageSize +
      '&ComplaintStatus=' +
      data.complaintStatus +
      '&FacilityUserIds=' +
      data.facilityUserIds +
      '&DepartmentTypes=' +
      data.departmentTypes +
      '&ComplaintSubTypeIds=' +
      data.complaintSubTypeIds+
      '&ComplaintTypeIds='+
      data.complaintTypeIds +
      '&SortBy=' +
      data.sortBy +
      '&SortOrder=' +
      data.sortOrder +
      '&FacilityId=' +
      data.facilityId +
      '&CreatedOnFrom=' +
      data.createdOnFrom +
      '&CreatedOnTo=' +
      data.createdOnTo +
      '&TicketNumber=' +
      data.ticketNumber +
      '&NameAndEMRID=' +
      data.nameAndEMRID +
      '&PhoneNo=' +
      data.phoneNo +
      '&DOB=' +
      data.dOB
    , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPatientComplaint(data: AddComplaintDto) {
    if (!data.patientId) {
      data.patientId = null;
    }
    return this.http.post(this.baseUrl + 'Complaint/AddComplaint', data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditComplaint(data: EditComplaintDto) {
    return this.http.put(this.baseUrl + 'Complaint/EditComplaint', data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetComplaintById(cID: number) {
    return this.http.get(this.baseUrl + `Complaint/GetComplaintById/${cID}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddComplaintDocument(title: number, complaintId: number) {
    const data = {
      title: title,
      complaintId: complaintId
    };
    return this.http.post(this.baseUrl + `Complaint/AddComplaintDocument`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddComplaintDocumentOnError(rId: number) {
    return this.http.post(this.baseUrl + `Complaint/AddComplaintDocumentOnError/${rId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteComplaintDocument(rId: number) {
    return this.http.delete(this.baseUrl + `Complaint/DeleteComplaintDocument/${rId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddComplaintRecording(title: string, complaintId: number) {
    const data = {
      title: title,
      complaintId: complaintId
    };
    return this.http.post(this.baseUrl + `Complaint/AddComplaintRecording`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddComplaintRecordingOnError(rId: number) {
    return this.http.post(this.baseUrl + `Complaint/AddComplaintRecordingOnError/${rId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteComplaintRecording(rId: number) {
    return this.http.delete(this.baseUrl + `Complaint/DeleteComplaintRecording/${rId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getComplaintTypes(){
    return this.http.get(this.baseUrl + 'Complaint/GetComplaintTypes' , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getComplaintSubTypes(complaintTypeId){
    return this.http.get(this.baseUrl + `Complaint/GetComplaintSubTypes/${complaintTypeId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getComplaintsSubTypes(complaintTypeIds){
    return this.http.get(this.baseUrl + `Complaint/GetComplaintsSubTypes?complaintTypeIds=${complaintTypeIds}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getComplaintsListExcelFile(filterComplaintsParam : ComplaintsDashboardFilterDto){
    return this.http.post(this.baseUrl + `Complaint/GetComplaintsListExcelFile?PageNumber=${filterComplaintsParam.pageNumber}&PageSize=${filterComplaintsParam.pageSize}&ComplaintStatus=${filterComplaintsParam.complaintStatus}&FacilityUserIds=${filterComplaintsParam.facilityUserIds}&FacilityId=${filterComplaintsParam.facilityId}&DepartmentTypes=${filterComplaintsParam.departmentTypes}&CreatedOnTo=${filterComplaintsParam.createdOnTo}&CreatedOnFrom=${filterComplaintsParam.createdOnFrom}&ComplaintSubTypeIds=${filterComplaintsParam.complaintSubTypeIds}&ComplaintTypeIds=${filterComplaintsParam.complaintTypeIds}&SortBy=${filterComplaintsParam.sortBy}&SortOrder=${filterComplaintsParam.sortOrder}`, {},{ responseType: 'blob' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getAllComplaintsByStatus(status, facilityId){
    return this.http.get(this.baseUrl + `Complaint/GetAllComplaintsbyStatus?complaintStatus=${status}&facilityId=${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
