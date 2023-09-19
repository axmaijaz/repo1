import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { MRProblemSetupDto, MRGoalSetupDto, MRInterventionSetupDto, AssessmentProblemSetupDto, AssessmentQuestionSetupDto } from 'src/app/model/MonthlyReview/mrSetup.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class MrSetupService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  // let baseUrl = this.baseUrl.replace('api/', 'VMRProblemMvc');
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService, private mrAdminService: MrAdminService,
  ) {}
  GetMRProblems() {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.get(this.baseUrl + `MRProblems` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    else{
      return this.http.get(this.baseUrl + `RpmMRProblems` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  GetMRGoals() {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.get(this.baseUrl + `MRGoals` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    else{
      return this.http.get(this.baseUrl + `RpmMRGoals` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  GetMRINterventions() {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.get(this.baseUrl + `MRInterventions` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    else{
      return this.http.get(this.baseUrl + `RpmMRInterventions` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  GetMrAssessmentTypes() {
    return this.http.get(this.baseUrl + `AssessmentTypes` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMrAssessmentProblems() {
    return this.http.get(this.baseUrl + `AssessmentProblems` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMrAssessmentQuestions() {
    return this.http.get(this.baseUrl + `AssessmentQuestions` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // GetMRINterventions() {
  //   return this.http.get(this.baseUrl + `MRInterventions` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
  AddMRProblem(data: MRProblemSetupDto) {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.post(this.baseUrl + `MRProblems`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    else{
      return this.http.post(this.baseUrl + `RpmMRProblems`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  EditMRProblem(data: MRProblemSetupDto) {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.put(this.baseUrl + `MRProblems/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    else{
      return this.http.put(this.baseUrl + `RpmMRProblems`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  AddMRGoal(data: MRGoalSetupDto) {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.post(this.baseUrl + `MRGoals`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }else{
      return this.http.post(this.baseUrl + `RpmMRGoals`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  EditMRGoal(data: MRGoalSetupDto) {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.put(this.baseUrl + `MRGoals/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }else{
      return this.http.put(this.baseUrl + `RpmMRGoals`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  AddMRInterventions(data: MRInterventionSetupDto) {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.post(this.baseUrl + `MRInterventions`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }else{
      return this.http.post(this.baseUrl + `RpmMRInterventions`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  EditMRInterventions(data: MRInterventionSetupDto) {
    if(this.mrAdminService.selectedMRType == 'ccm'){
      return this.http.put(this.baseUrl + `MRInterventions/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }else{
      return this.http.put(this.baseUrl + `RpmMRInterventions`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
  }
  AddMRAssessmentProblems(data: AssessmentProblemSetupDto) {
    return this.http.post(this.baseUrl + `AssessmentProblems`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditMRAssessmentProblems(data: AssessmentProblemSetupDto) {
    return this.http.put(this.baseUrl + `AssessmentProblems/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddMRAssessmentQuestions(data: AssessmentQuestionSetupDto) {
    return this.http.post(this.baseUrl + `AssessmentQuestions`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditMRAssessmentQuestions(data: AssessmentQuestionSetupDto) {
    return this.http.put(this.baseUrl + `AssessmentQuestions/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
