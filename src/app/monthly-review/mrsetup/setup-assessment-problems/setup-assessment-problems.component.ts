import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { AssessmentProblemSetupDto, AssessmentTypeSetupDto } from 'src/app/model/MonthlyReview/mrSetup.model';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { MrSetupService } from 'src/app/core/MrSetup/mr-setup.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setup-assessment-problems',
  templateUrl: './setup-assessment-problems.component.html',
  styleUrls: ['./setup-assessment-problems.component.scss']
})
export class SetupAssessmentProblemsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoadingProblems = true;
  addEditMrAssProb = new AssessmentProblemSetupDto();
  mrAssessmentTypeList: AssessmentTypeSetupDto[];
  isLoadingGoals: boolean;
  savingMrProblem: boolean;
  mrAssessmentProblemsList: AssessmentProblemSetupDto[];
  isLoadingTypes: boolean;
  pageSize = 10;
  cronicDiseaseList = new Array<{ id: 0; algorithm: '' }>();

  constructor(private mrService: MrAdminService, private mrSetup: MrSetupService, private toaster: ToastService,
    private patientService: PatientsService, private location: Location) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.GetMrAssessmentTypes();
    this.getCronicDiseases();
  }
  GetMrAssessmentTypes() {
    this.isLoadingTypes = true;
    this.subs.sink = this.mrSetup.GetMrAssessmentTypes().subscribe(
      (res: AssessmentTypeSetupDto[]) => {
        this.mrAssessmentTypeList = res;
        // this.mrAssessmentTypeList.forEach(item => {
        //   const goal = this.GoalsListDataSave.find(x => x.id === item.mrGoalId);
        //   if (goal) {
        //     item['goalName'] = goal.description;
        //   }

        // });
        this.isLoadingTypes = false;
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getCronicDiseases() {
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
        this.GetMrAssessmentProblems();
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetMrAssessmentProblems() {
    this.isLoadingProblems = true;
    this.subs.sink = this.mrSetup.GetMrAssessmentProblems().subscribe(
      (res: AssessmentProblemSetupDto[]) => {
        this.mrAssessmentProblemsList = res;
        this.mrAssessmentProblemsList.forEach(item => {
          const condition = this.cronicDiseaseList.find(x => x.id === item.chronicConditionId);
          const type = this.mrAssessmentTypeList.find(x => x.id === item.assessmentTypeId);
          if (condition) {
            item['condName'] = condition.algorithm;
          }
          if (type) {
            item['typeName'] = type.name;
          }

        });
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
  openEditProblemModel(row: AssessmentProblemSetupDto, modal: ModalDirective) {
    this.addEditMrAssProb = row;
    modal.show();
  }
  AddMrProblem(modal: ModalDirective) {
    this.savingMrProblem = true;
    this.addEditMrAssProb.id = 0;
    this.subs.sink = this.mrSetup.AddMRAssessmentProblems(this.addEditMrAssProb).subscribe(
      (res: any) => {
        this.savingMrProblem = false;
        this.GetMrAssessmentProblems();
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrProblem = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditMrProblem(modal: ModalDirective) {
    this.savingMrProblem = true;
    this.subs.sink = this.mrSetup.EditMRAssessmentProblems(this.addEditMrAssProb).subscribe(
      (res: any) => {
        this.savingMrProblem = false;
        this.GetMrAssessmentProblems();
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrProblem = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}
