import { Component, OnInit, OnDestroy } from '@angular/core';
import { MrAdminService } from 'src/app/core/mr-admin.service';
import { MrSetupService } from 'src/app/core/MrSetup/mr-setup.service';
import { MRType } from 'src/app/model/MonthlyReview/mReview.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { MRProblemSetupDto } from 'src/app/model/MonthlyReview/mrSetup.model';
import { modalConfigDefaults } from 'ng-uikit-pro-standard/lib/free/modals/modal.options';
import { Location } from '@angular/common';
import { RpmMRType } from 'src/app/model/MonthlyReview/rpmMReview.model';
import { RpmService } from 'src/app/core/rpm.service';

@Component({
  selector: 'app-setup-mr-problems',
  templateUrl: './setup-mr-problems.component.html',
  styleUrls: ['./setup-mr-problems.component.scss']
})
export class SetupMrProblemsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoadingMrProblems = false;
  isLoadingTypes: boolean;
  mrTypeList: MRType[];
  rpmMrTypeList: RpmMRType[];
  pageSize = 10;
  cronicDiseaseList = new Array<{ id: 0; algorithm: '' }>();
  isLoadingProblems: boolean;
  mrProblemsList: MRProblemSetupDto[];
  addEditProblemDto = new MRProblemSetupDto();
  savingMrProblem: boolean;

  constructor(public mrService: MrAdminService, private mrSetup: MrSetupService, private toaster: ToastService,
    private patientService: PatientsService, private location: Location, private rpmService: RpmService) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if(this.mrService.selectedMRType === 'ccm'){
      this.GetTypes();
    }
    if(this.mrService.selectedMRType === 'rpm'){
      this.getRpmMrTypes();
    }
    this.getCronicDiseases();
    this.mrService.mrTypeChanges.subscribe((res: any) => {
      if(this.mrService.selectedMRType === 'ccm'){
        this.GetTypes();
      }
      if(this.mrService.selectedMRType === 'rpm'){
        this.getRpmMrTypes();
      }
      this.getCronicDiseases();
    })
  }
  GetTypes() {
    this.isLoadingTypes = true;
    this.subs.sink = this.mrService.GetTypes().subscribe(
      (res: MRType[]) => {
        this.isLoadingTypes = false;
        this.mrTypeList = res;
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getRpmMrTypes(){
    this.isLoadingTypes = true;
    this.subs.sink = this.rpmService.GetRpmMRTypes().subscribe(
      (res: RpmMRType[]) => {
        this.isLoadingTypes = false;
        this.rpmMrTypeList = res;
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetMRProblems() {
    this.isLoadingProblems = true;
    this.subs.sink = this.mrSetup.GetMRProblems().subscribe(
      (res: MRProblemSetupDto[]) => {
        this.isLoadingProblems = false;
        this.mrProblemsList = res;
       if(this.mrService.selectedMRType === 'ccm'){
         this.mrProblemsList.forEach(item => {
          const condition = this.cronicDiseaseList.find(x => x.id === item.chronicConditionId);
          const type = this.mrTypeList.find(x => x.id === item.mrTypeId);
          if (condition) {
            item['condName'] = condition.algorithm;
          }
          if (type) {
            item['typeName'] = type.name;
          }

        });}else{
          this.mrProblemsList.forEach(item => {
            const condition = this.cronicDiseaseList.find(x => x.id === item.chronicConditionId);
            const type = this.rpmMrTypeList.find(x => x.id === item.mrTypeId);
            if (condition) {
              item['condName'] = condition.algorithm;
            }
            if (type) {
              item['typeName'] = type.name;
            }
  
          });
        }
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
  getCronicDiseases() {
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
        this.GetMRProblems();
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openEditProblemModel(row: MRProblemSetupDto, modal: ModalDirective) {
    this.addEditProblemDto = row;
    modal.show();
  }
  AddMrProblem(modal: ModalDirective) {
    this.savingMrProblem = true;
    this.addEditProblemDto.id = 0;
    this.subs.sink = this.mrSetup.AddMRProblem(this.addEditProblemDto).subscribe(
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
  EditMrProblem(modal: ModalDirective) {
    this.savingMrProblem = true;
    this.subs.sink = this.mrSetup.EditMRProblem(this.addEditProblemDto).subscribe(
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
