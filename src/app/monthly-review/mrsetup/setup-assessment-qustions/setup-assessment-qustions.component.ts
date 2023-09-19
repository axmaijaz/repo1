import { Component, OnInit, OnDestroy } from '@angular/core';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { AssessmentProblemSetupDto, AssessmentQuestionSetupDto, AssessmentQuestionType } from 'src/app/model/MonthlyReview/mrSetup.model';
import { MrSetupService } from 'src/app/core/MrSetup/mr-setup.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setup-assessment-qustions',
  templateUrl: './setup-assessment-qustions.component.html',
  styleUrls: ['./setup-assessment-qustions.component.scss']
})
export class SetupAssessmentQustionsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoadingProblems = true;
  addEditMrAssQuestion = new AssessmentQuestionSetupDto();
  isLoadingGoals: boolean;
  savingMrAssQuestion: boolean;
  AssessmentQuestionTypeEnum = AssessmentQuestionType;
  mrAssessmentProblemsList: AssessmentProblemSetupDto[];
  isLoadingTypes: boolean;
  isLoadingQuestions = true;
  mrAssessmentQuestionsList: AssessmentQuestionSetupDto[];
  pageSize = 10;

  constructor(private mrService: MrAdminService, private mrSetup: MrSetupService, private toaster: ToastService,
    private patientService: PatientsService, private location: Location) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.GetMrAssessmentProblems();
  }
  GetMrAssessmentQuestions() {
    this.isLoadingQuestions = true;
    this.subs.sink = this.mrSetup.GetMrAssessmentQuestions().subscribe(
      (res: AssessmentQuestionSetupDto[]) => {
        this.mrAssessmentQuestionsList = res;
        this.mrAssessmentQuestionsList.forEach(item => {
          const problem = this.mrAssessmentProblemsList.find(x => x.id === item.assessmentProblemId);
          // const type = this.mrAssessmentTypeList.find(x => x.id === item.assessmentTypeId);
          if (problem) {
            item['probName'] = problem.description;
          }
          if (item.questionType || item.questionType === 0) {
            item['typeName'] = this.AssessmentQuestionTypeEnum[item.questionType];
          }

        });
        this.isLoadingQuestions = false;
      },
      (error: HttpResError) => {
        this.isLoadingQuestions = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetMrAssessmentProblems() {
    this.isLoadingProblems = true;
    this.subs.sink = this.mrSetup.GetMrAssessmentProblems().subscribe(
      (res: AssessmentProblemSetupDto[]) => {
        this.mrAssessmentProblemsList = res;
        this.GetMrAssessmentQuestions();
        this.isLoadingProblems = false;
      },
      (error: HttpResError) => {
        this.isLoadingProblems = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  openEditProblemModel(row: AssessmentQuestionSetupDto, modal: ModalDirective) {
    this.addEditMrAssQuestion = row;
    modal.show();
  }
  AddMrAssQuestion(modal: ModalDirective) {
    this.savingMrAssQuestion = true;
    this.addEditMrAssQuestion.id = 0;
    if (this.addEditMrAssQuestion.questionType !== AssessmentQuestionType.YesNo && this.addEditMrAssQuestion.questionType !== AssessmentQuestionType.YesNoComment) {
      this.addEditMrAssQuestion.yesComment = '';
      this.addEditMrAssQuestion.noComment = '';
    }
    this.subs.sink = this.mrSetup.AddMRAssessmentQuestions(this.addEditMrAssQuestion).subscribe(
      (res: any) => {
        this.savingMrAssQuestion = false;
        this.GetMrAssessmentQuestions();
        this.toaster.success('Data saved successfully');
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrAssQuestion = false;
        this.toaster.error(error.error, error.message);
      }
      );
    }
    EditMrAssQuestion(modal: ModalDirective) {
      this.savingMrAssQuestion = true;
      if (this.addEditMrAssQuestion.questionType !== AssessmentQuestionType.YesNo && this.addEditMrAssQuestion.questionType !== AssessmentQuestionType.YesNoComment) {
        this.addEditMrAssQuestion.yesComment = '';
        this.addEditMrAssQuestion.noComment = '';
      }
      this.subs.sink = this.mrSetup.EditMRAssessmentQuestions(this.addEditMrAssQuestion).subscribe(
        (res: any) => {
          this.toaster.success('Data saved successfully');
          this.savingMrAssQuestion = false;
          this.GetMrAssessmentQuestions();
          modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrAssQuestion = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}


