import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuestionnaireDto } from '../model/Questionnaire/Questionnire.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient
  ) {}

  AddQuestionsToTemplate(questions: QuestionnaireDto[]) {
    return this.http.post(this.baseUrl + 'CarePlan/AddCPQuestionnairesDto', questions, httpOptions);
  }
  AddCPQuestionnairesFromQuestionnaresList(questions: QuestionnaireDto[]) {
    const data = {
      'questionnaireIds': [],
      'carePlanTemplateId': 0
    };
    questions.forEach(item => {
      data.carePlanTemplateId = item.carePlanTemplateId;
      data.questionnaireIds.push(item.id);
    });
    return this.http.post(this.baseUrl + 'CarePlan/AddCPQuestionnairesFromQuestionnaresList', data, httpOptions);
  }
  EditTemplateQuestion(question: QuestionnaireDto) {
    return this.http.post(this.baseUrl + 'CarePlan/EditCPQuestionnaireDto', question, httpOptions);
  }
  addQuestion(question: QuestionnaireDto) {
    return this.http.post(this.baseUrl + 'Questionnaire/EditQuestionnaire', question);
  }
  deleteQuestion(QuestionId: number) {
    return this.http.delete(this.baseUrl + 'Questionnaire/DeleteQuestionnaire?id=' + QuestionId, httpOptions);
  }
  getQuestionsList(diseaseId: number) {
    if (!diseaseId) {
      diseaseId = 0;
    }
    return this.http.get(this.baseUrl + 'Questionnaire/GetAllQuestionnaires?diseaseId=' + diseaseId, httpOptions);
  }
  RemoveQuestion(id: number) {
    return this.http.delete(this.baseUrl + 'CarePlan/DeleteCPQuestionnaire/' + id, httpOptions);
  }
  getPatientTemplate(patientId: number) {
    return this.http.get(this.baseUrl + 'CarePlan/GetCarePlanTemplate/' + patientId, httpOptions);
  }
  createPatientTemplate(template: any) {
    return this.http.post(this.baseUrl + 'CarePlan/CreateCarePlanTemplate' , template, httpOptions);
  }
  getTemplateData(cpTemplateId: any) {
    return this.http.get(this.baseUrl + 'CarePlan/GetCarePlanData/' + cpTemplateId, httpOptions);
  }
  saveTemplateData(data: any) {
    return this.http.post(this.baseUrl + 'CarePlan/EditCarePlanData' , data, httpOptions);
  }
  getServiceTypeList(isFav: boolean) {
    return this.http.get(this.baseUrl + 'CcmServices/GetCcmServiceTypes?isFav=' + isFav, httpOptions);
  }
  addCategory(category: string, ParentCatId: number) {
    return this.http.post(this.baseUrl + 'Questionnaire/AddCategory?categoryName=' + category + '&parentId=' + ParentCatId, httpOptions);
  }
  getCategoryList() {
    return this.http.get(this.baseUrl + 'Questionnaire/GetCategories', httpOptions);
  }
  getQuestionListByCategoryId(carePlanId: number, categoryId: number) {
    return this.http.get(this.baseUrl + `CarePlan/GetCarePlanQuestionsByCategory?carePlanTemplateId=${carePlanId}&categoryId=${categoryId}`, httpOptions);
  }
  SaveQuestionsOrder(newOrder: Array<{questionId: number, newOrder: number}>) {
    return this.http.put(this.baseUrl + `CarePlan/ReorderCarePlanQuestions/` , newOrder, httpOptions);
  }
  questionsOrderChange(newOrder: Array<{questionId: number, newOrder: number}>) {
    return this.http.put(this.baseUrl + `Questionnaire/ReorderQuestionnaires` , newOrder, httpOptions);
  }
  getParentCategoryList() {
    return this.http.get(this.baseUrl + 'Questionnaire/GetParentCategories', httpOptions);
  }
  getFilterDiseaseList(searchParm: string) {
    return this.http.get(this.baseUrl + 'Diseases/SearchDisease?searchParam=' + searchParm, httpOptions);
  }
  getCCMDiseases() {
    return this.http.get(this.baseUrl + 'Diseases/GetCcmDiseases' , httpOptions);
  }
}
