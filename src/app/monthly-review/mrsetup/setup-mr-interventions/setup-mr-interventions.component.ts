import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { MRInterventionSetupDto, MRGoalSetupDto, MRProblemSetupDto } from 'src/app/model/MonthlyReview/mrSetup.model';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { MrSetupService } from 'src/app/core/MrSetup/mr-setup.service';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { Location } from '@angular/common';
import { HttpResError } from 'src/app/model/common/http-response-error';

@Component({
  selector: 'app-setup-mr-interventions',
  templateUrl: './setup-mr-interventions.component.html',
  styleUrls: ['./setup-mr-interventions.component.scss']
})
export class SetupMrInterventionsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoadingProblems = true;
  GoalsListData: MRGoalSetupDto[];
  addEditMrInterv = new MRInterventionSetupDto();
  mrInterVentionsList: MRInterventionSetupDto[];
  isLoadingGoals: boolean;
  savingMrGoal: boolean;
  GoalsListDataSave: MRGoalSetupDto[] = [];
  mrProblemsList: MRProblemSetupDto[];
  pageSize = 10;

  constructor(private mrService: MrAdminService, private mrSetup: MrSetupService, private toaster: ToastService,
    private patientService: PatientsService, private location: Location) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.GetMRGoals();
    this.mrService.mrTypeChanges.subscribe((res: any) => {
      this.GetMRGoals();
    })
  }
  getMRINterventions() {
    this.isLoadingProblems = true;
    this.subs.sink = this.mrSetup.GetMRINterventions().subscribe(
      (res: MRInterventionSetupDto[]) => {
        this.mrInterVentionsList = res;
        this.mrInterVentionsList.forEach(item => {
          const goal = this.GoalsListDataSave.find(x => x.id === item.mrGoalId);
          if (goal) {
            item['goalName'] = goal.description;
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
  filterGoals(event: number) {
    if (!event) {
      return;
    }
    if(this.mrService.selectedMRType == 'ccm'){
      this.GoalsListData = this.GoalsListDataSave.filter(x => x.mrProblemId === event);
    }
    if(this.mrService.selectedMRType == 'rpm'){
      this.GoalsListData = this.GoalsListDataSave.filter(x => x.rpmMRProblemId === event);
    }
  }
  goBack() {
    this.location.back();
  }
  GetMRProblems() {
    this.isLoadingProblems = true;
    this.subs.sink = this.mrSetup.GetMRProblems().subscribe(
      (res: MRProblemSetupDto[]) => {
        this.isLoadingProblems = false;
        this.mrProblemsList = res;
      },
      (error: HttpResError) => {
        this.isLoadingProblems = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetMRGoals() {
    this.isLoadingGoals = true;
    this.GoalsListData= [];
    this.GoalsListDataSave = [];
    this.subs.sink = this.mrSetup.GetMRGoals().subscribe(
      (res: MRGoalSetupDto[]) => {
        this.isLoadingGoals = false;
        this.GoalsListData = res;
        Object.assign(this.GoalsListDataSave, res);
        this.getMRINterventions();
        this.GetMRProblems();
      },
      (error: HttpResError) => {
        this.isLoadingGoals = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openEditGoalModel(row: MRInterventionSetupDto, modal: ModalDirective) {
    this.addEditMrInterv = row;
    this.GoalsListData = this.GoalsListDataSave;
    modal.show();
  }
  AddMrINtervention(modal: ModalDirective) {
    this.savingMrGoal = true;
    this.addEditMrInterv.id = 0;
    this.subs.sink = this.mrSetup.AddMRInterventions(this.addEditMrInterv).subscribe(
      (res: any) => {
        this.savingMrGoal = false;
        this.getMRINterventions();
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrGoal = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditMrINtervention(modal: ModalDirective) {
    this.savingMrGoal = true;
    this.subs.sink = this.mrSetup.EditMRInterventions(this.addEditMrInterv).subscribe(
      (res: any) => {
        this.savingMrGoal = false;
        this.getMRINterventions();
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingMrGoal = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}
