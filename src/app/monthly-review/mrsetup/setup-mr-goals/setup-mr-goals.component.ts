import { Component, OnInit, OnDestroy } from '@angular/core';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { MrSetupService } from 'src/app/core/MrSetup/mr-setup.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { MRGoalSetupDto, MRProblemSetupDto } from 'src/app/model/MonthlyReview/mrSetup.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setup-mr-goals',
  templateUrl: './setup-mr-goals.component.html',
  styleUrls: ['./setup-mr-goals.component.scss']
})
export class SetupMrGoalsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoadingProblems: boolean;
  GoalsListData: MRGoalSetupDto[];
  addEditMrGoal = new MRGoalSetupDto();
  mrProblemsList: MRProblemSetupDto[];
  isLoadingGoals: boolean;
  savingMrProblem: boolean;
  pageSize= 10;

  constructor(public mrService: MrAdminService, private mrSetup: MrSetupService, private toaster: ToastService,
    private patientService: PatientsService, private location: Location) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.GetMRProblems();
    this.mrService.mrTypeChanges.subscribe((res: any ) => {
      this.GetMRProblems();
    }) 
  }
  GetMRProblems() {
    this.isLoadingProblems = true;
    this.subs.sink = this.mrSetup.GetMRProblems().subscribe(
      (res: MRProblemSetupDto[]) => {
        this.isLoadingProblems = false;
        this.mrProblemsList = res;
        this.GetMRGoals();
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
  GetMRGoals() {
    this.isLoadingGoals = true;
    this.subs.sink = this.mrSetup.GetMRGoals().subscribe(
      (res: MRGoalSetupDto[]) => {
        this.isLoadingGoals = false;
        this.GoalsListData = res;
        if(this.mrService.selectedMRType === 'ccm'){
          this.GoalsListData.forEach(item => {
            const problem = this.mrProblemsList.find(x => x.id === item.mrProblemId);
            if (problem) {
              item['probName'] = problem.description;
            }
          });
        }else{
          this.GoalsListData.forEach(item => {
            const problem = this.mrProblemsList.find(x => x.id === item.rpmMRProblemId);
            if (problem) {
              item['probName'] = problem.description;
            }
          });
        }
      },
      (error: HttpResError) => {
        this.isLoadingGoals = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openEditGoalModel(row: MRGoalSetupDto, modal: ModalDirective) {
    this.addEditMrGoal = row;
    modal.show();
  }
  AddMrGoal(modal: ModalDirective) {
    this.savingMrProblem = true;
    this.addEditMrGoal.id = 0;
    this.subs.sink = this.mrSetup.AddMRGoal(this.addEditMrGoal).subscribe(
      (res: any) => {
        this.savingMrProblem = false;
        this.GetMRProblems();
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrProblem = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditMrGoal(modal: ModalDirective) {
    this.savingMrProblem = true;
    this.subs.sink = this.mrSetup.EditMRGoal(this.addEditMrGoal).subscribe(
      (res: any) => {
        this.savingMrProblem = false;
        this.GetMRProblems();
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrProblem = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}
