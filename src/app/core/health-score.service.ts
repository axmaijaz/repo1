import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { AddEditPHSForm, AddEditPHSFormQuestion, AddEditPHSFormQuestionOption, FilterPHSForm } from '../model/health-score/health-score.model';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //
  })
};
@Injectable({
  providedIn: 'root'
})
export class HealthScoreService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;


  constructor(private http: HttpClient, private httpErrorService: HttpErrorHandlerService) { }
  // /api/PHSForm/AddEditPHSForm

  getAllPHSFormsgetAllPHSForms(filterPHSFormDto: FilterPHSForm){
    return this.http.get(this.baseUrl + `PHSForm/GetAllPHSForms?moduleIds=${filterPHSFormDto.moduleIds}&careEpisodeIds=${filterPHSFormDto.careEpisodeIds}&chronicConditionIds=${filterPHSFormDto.chronicConditionIds}&searchParam=${filterPHSFormDto.searchParam}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPHSForm(id: number){
    return this.http.get(this.baseUrl + `PHSForm/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  phsFormQuestionById(id: number){
    return this.http.get(this.baseUrl + `PHSForm/PHSFormQuestionById/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  phsFormQuestionOptionsByQuestionId(questionId: number){
    return this.http.get(this.baseUrl + `PHSForm/PHSFormQuestionOptionsByQuestionId/${questionId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  phsCareEpisodes() {
    return this.http.get(this.baseUrl + `PHSForm/PHSCareEpisodes`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addEditPHSForm(addEditPHSFromDto: AddEditPHSForm) {
    return this.http.put(this.baseUrl + `PHSForm/AddEditPHSForm`, addEditPHSFromDto, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addEditPHSFormQuestion(addEditPHSFormQuestionDto: AddEditPHSFormQuestion) {
    return this.http.put(this.baseUrl + `PHSForm/AddEditPHSFormQuestion`, addEditPHSFormQuestionDto, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addEditPHSFormQuestionOption(addEditPHSFormQuestionOptionDto: AddEditPHSFormQuestionOption) {
    return this.http.put(this.baseUrl + `PHSForm/AddEditPHSFormQuestionOption`, addEditPHSFormQuestionOptionDto, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  deletePHSForm(id: number){
    return this.http.delete(this.baseUrl + `PHSForm/DeletePHSForm?id=${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  deletePHSFormQuestionOption(id: number){
    return this.http.delete(this.baseUrl + `PHSForm/DeletePHSFormQuestionOption?id=${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
