import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { ECalendarValue } from 'ng2-date-picker';
import { IDatePickerConfig } from 'ng2-date-picker/date-picker/date-picker-config.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { ValidatedScreeningToolService } from 'src/app/core/ValidatedScreeningTools/vsTools.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { PhqQuestionsData, PHQScreeningToolDto } from 'src/app/model/ScreeningTools/phq.modal';
import { WasaQuestionsData } from 'src/app/model/ScreeningTools/wasa.model';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-phq9',
  templateUrl: './phq9.component.html',
  styleUrls: ['./phq9.component.scss']
})
export class Phq9Component implements OnInit, OnDestroy {
  savingPhq: boolean;
  loadingData: boolean;
  questionsData = PhqQuestionsData.questions;
  PhqToolDto = new PHQScreeningToolDto();
  PhqToolsList = new Array<PHQScreeningToolDto>();
  private subs = new SubSink();
  PatientId: number;
  constructor(private toaster: ToastService, private securityService: SecurityService,
    private vsToolsService: ValidatedScreeningToolService, private route: ActivatedRoute) { }
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    opens: 'left',
    appendTo: 'body'
  };
  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.GetPhqByPatientId();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetPhqByPatientId() {
    if (this.PatientId) {
      this.loadingData = true;
      this.subs.sink = this.vsToolsService.GetPhqByPatientId(this.PatientId).subscribe((res: any) => {
        this.PhqToolsList = res;
        this.loadingData = false;
      }, (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
      });
    }
  }
  resetObj() {
    this.PhqToolDto = new PHQScreeningToolDto();
  }
  calculateScore() {
    let Score = 0;
    Score = (+this.PhqToolDto.littleInterestInDoingThings || 0)
    + (+this.PhqToolDto.feelingDownDepressed || 0)
    + (+this.PhqToolDto.troubleFallingOrStayingAsleep || 0)
    + (+this.PhqToolDto.feelingTiredLittleEnergy || 0)
    + (+this.PhqToolDto.poorAppetiteOrOverEating || 0)
    + (+this.PhqToolDto.feelingBadAboutYourSelf || 0)
    + (+this.PhqToolDto.troubleConcentratingOnThings || 0)
    + (+this.PhqToolDto.movingOrSleepingSlowly || 0)
    + (+this.PhqToolDto.thoughtsBetterOffDead || 0);
    // + (+this.PhqToolDto.checkedOffAnyProblems || 0);
   this.PhqToolDto.score = Score;
   if (this.PhqToolDto.score > 0 && this.PhqToolDto.score < 5) {
      this.PhqToolDto.result = 'Minimal depression';
    } else if (this.PhqToolDto.score > 5 && this.PhqToolDto.score < 10) {
      this.PhqToolDto.result = 'Mild depression';
    } else if (this.PhqToolDto.score > 9 && this.PhqToolDto.score < 15) {
      this.PhqToolDto.result = 'Moderate depression';
    } else if (this.PhqToolDto.score > 14  && this.PhqToolDto.score < 20) {
      this.PhqToolDto.result = 'Moderately severe depression';
    } else if (this.PhqToolDto.score > 19  && this.PhqToolDto.score < 28) {
      this.PhqToolDto.result = 'Severe depression';
    }
  }
  OpenEditModel(item: PHQScreeningToolDto, modal: ModalDirective) {
    Object.assign(this.PhqToolDto, item);
    modal.show();
  }
  AddPhqScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingPhq = true;
      this.PhqToolDto.patientId = this.PatientId;
      this.PhqToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.AddPhqScreeningTools(this.PhqToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetPhqByPatientId();
        this.savingPhq = false;
        this.PhqToolDto = new PHQScreeningToolDto();
        this.toaster.success('Record Added Successfully');
      }, (error: HttpResError) => {
        this.savingPhq = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  EditPhqScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingPhq = true;
      this.PhqToolDto.patientId = this.PatientId;
      this.PhqToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditPhqScreeningTools(this.PatientId, this.PhqToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetPhqByPatientId();
        this.savingPhq = false;
        this.PhqToolDto = new PHQScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingPhq = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }

}

