import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';
import {  AssessmentPatientProblemDto, EditAssessmentPatientQuestionDto, AssessmentPatientTypeDto, AssessmentPatientQuestionDto } from 'src/app/model/MonthlyReview/mReview.model';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import * as moment from 'moment';


@Component({
  selector: 'app-mr-assessment',
  templateUrl: './mr-assessment.component.html',
  styleUrls: ['./mr-assessment.component.scss']
})
export class MrAssessmentComponent implements OnInit, OnDestroy {

  @Output() AssementAnswerEditedEmitter = new EventEmitter<string>();
  private subs = new SubSink();
  PatientId: number;
  isLoadingProblems: boolean;
  mrTypesList: AssessmentPatientTypeDto[];
  ALLQuestionsList = new Array<AssessmentPatientQuestionDto>();
  SelectedQuestionsList = new Array<AssessmentPatientQuestionDto>();
  selectedProblem = new AssessmentPatientProblemDto();
  editMRPatientQuestions = new EditAssessmentPatientQuestionDto();

  constructor(private mrService: MrAdminService, private toaster: ToastService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.GetAssessmentDataByPatientId();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetAssessmentDataByPatientId() {
    this.isLoadingProblems = true;
    this.mrTypesList = [];
    this.subs.sink = this.mrService.GetAssessmentDataByPatientId(this.PatientId)
      .subscribe(
        (res: AssessmentPatientTypeDto[]) => {
          if (res) {
            this.mrTypesList = res;
            this.mrTypesList.forEach((type, tIndex) => {
              type.assessmentPatientProblems.forEach((Problem , pIndex) => {
                if (tIndex === 0 && pIndex === 0) {
                  this.selectedProblem = Problem;
                }
                this.ALLQuestionsList = [...this.ALLQuestionsList, ...Problem.assessmentPatientQuestions];
              });
            });
            if (this.selectedProblem && this.selectedProblem.id) {
              this.filterQuestionsBYProblem(this.selectedProblem);
            }
          } else {
            this.mrTypesList = new Array<AssessmentPatientTypeDto>();
          }
          this.isLoadingProblems = false;
        },
        (error: HttpResError) => {
          this.isLoadingProblems = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  filterQuestionsBYProblem(Problem: AssessmentPatientProblemDto) {
    this.selectedProblem = Problem;
    this.SelectedQuestionsList = this.ALLQuestionsList.filter(x => x.assessmentPatientProblemId === Problem.id);
    this.SelectedQuestionsList.forEach(item => {
      if (!item.lastAssessmentDate) {
        return;
      }
      item.lastAssessmentDate = moment.utc(item.lastAssessmentDate).local() as any;
    });
  }
  editMRPatientQuestion(question: AssessmentPatientQuestionDto, changeType?: string) {
    this.editMRPatientQuestions.id = question.id;
    this.editMRPatientQuestions.comment = question.comment;
    this.editMRPatientQuestions.answer = question.answer;
    this.InsertActivityLog(question, changeType);
    this.mrService.EditAssessmentPatientQuestion(this.editMRPatientQuestions).subscribe(res => {
      const q = this.SelectedQuestionsList.find(x => x.id === question.id);
      q.assessed = true;
      q.lastAssessmentDate = new Date();
      // console.log(this.SelectedQuestionsList);
    });
  }
  InsertActivityLog(question: AssessmentPatientQuestionDto, changeType: string) {
    if (!changeType) {
      return;
    }
    if (changeType === 'yesNo') {
      if (question.answer && question.answer === 'Yes' && question.yesComment) {
        this.AssementAnswerEditedEmitter.emit(question.yesComment);
      }
      if (question.answer && question.answer === 'No' && question.noComment) {
        this.AssementAnswerEditedEmitter.emit(question.noComment);
      }
    }
    if (changeType === 'comment') {
      if (question.comment) {
        this.AssementAnswerEditedEmitter.emit(question.comment);
      }
    }
  }

}
