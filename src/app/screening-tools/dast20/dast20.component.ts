import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { ECalendarValue } from 'ng2-date-picker';
import { IDatePickerConfig } from 'ng2-date-picker/date-picker/date-picker-config.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { ValidatedScreeningToolService } from 'src/app/core/ValidatedScreeningTools/vsTools.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Dast20QuestionsData, DAST20ScreeningToolDto } from 'src/app/model/ScreeningTools/dast20.model';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-dast20',
  templateUrl: './dast20.component.html',
  styleUrls: ['./dast20.component.scss']
})
export class Dast20Component implements OnInit, OnDestroy {
  loadingData: boolean;
  savingDast20: boolean;
  dast20ToolDto = new DAST20ScreeningToolDto();
  dast20ToolsList = new Array<DAST20ScreeningToolDto>();
  private subs = new SubSink();
  PatientId: number;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    opens: 'left',
    appendTo: 'body'
  };
  questionsData = Dast20QuestionsData.questions;
  constructor(private toaster: ToastService, private securityService: SecurityService,
    private vsToolsService: ValidatedScreeningToolService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.GetDast20ByPatientId();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetDast20ByPatientId() {
    if (this.PatientId) {
      this.loadingData = true;
      this.subs.sink = this.vsToolsService.GetDast20ByPatientId(this.PatientId).subscribe((res: any) => {
        this.dast20ToolsList = res;
        this.loadingData = false;
      }, (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
      });
    }
  }
  resetObj() {
    this.dast20ToolDto = new DAST20ScreeningToolDto();
  }
  calculateScore() {
    let Score = 0;
    Score = (+this.dast20ToolDto.haveYouUserOtherDrugs || 0)
    + (+this.dast20ToolDto.haveYouAbusedPrescriptionDrugs || 0)
    + (+this.dast20ToolDto.abusedMoreThanOneDrug || 0)
    + (+this.dast20ToolDto.getThroughWeekWithOutUsingDrugs || 0)
    + (+this.dast20ToolDto.ableToStopUsingDrugs || 0)
    + (+this.dast20ToolDto.blackoutsOrFlashbacks || 0)
    + (+this.dast20ToolDto.feelBadAboutDrugsUse || 0)
    + (+this.dast20ToolDto.spouseComplainAboutDrugs || 0)
    + (+this.dast20ToolDto.drugsCreateProblemsWithYourSpouse || 0)
    + (+this.dast20ToolDto.lostFriendsForDrugUsage || 0)
    + (+this.dast20ToolDto.neglectedFamilyForDrugsUsage || 0)
    + (+this.dast20ToolDto.inTroubleAtWorkDueToDrugs || 0)
    + (+this.dast20ToolDto.lostJobDueToDrugAbuse || 0)
    + (+this.dast20ToolDto.fightsUnderDrugInfluence || 0)
    + (+this.dast20ToolDto.engagedInIllegalActivities || 0)
    + (+this.dast20ToolDto.arrestedForPossessingDrugs || 0)
    + (+this.dast20ToolDto.experiencedWithdrawalSymptomsStoppingDrugs || 0)
    + (+this.dast20ToolDto.hadMedicalProblems || 0)
    + (+this.dast20ToolDto.goneToAnyOneForHelp || 0)
    + (+this.dast20ToolDto.involvedInTreatmentProgram || 0);
   this.dast20ToolDto.score = Score;
   if (Score > 0 && Score < 6) {
     this.dast20ToolDto.result = 'Low';
   }
   if (Score > 5 && Score < 11) {
     this.dast20ToolDto.result = 'Intermediate (likely meets DSM-IV criteria)';
   }
   if (Score > 10 && Score < 16) {
     this.dast20ToolDto.result = 'Substantial';
   }
   if (Score > 15 && Score < 21) {
     this.dast20ToolDto.result = 'Severe';
   }
  }
  OpenEditModel(item: DAST20ScreeningToolDto, modal: ModalDirective) {
    Object.assign(this.dast20ToolDto, item);
    modal.show();
  }
  AddDast20ScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingDast20 = true;
      this.dast20ToolDto.patientId = this.PatientId;
      this.dast20ToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.AddDast20ScreeningTools(this.dast20ToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetDast20ByPatientId();
        this.savingDast20 = false;
        this.dast20ToolDto = new DAST20ScreeningToolDto();
        this.toaster.success('Record Added Successfully');
      }, (error: HttpResError) => {
        this.savingDast20 = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  EditDast20ScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingDast20 = true;
      this.dast20ToolDto.patientId = this.PatientId;
      this.dast20ToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditDast20ScreeningTools(this.PatientId, this.dast20ToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetDast20ByPatientId();
        this.savingDast20 = false;
        this.dast20ToolDto = new DAST20ScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingDast20 = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
}
