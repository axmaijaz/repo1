import { Component, OnDestroy, OnInit } from '@angular/core';
import { Gad7QuestionsData, GAD7ScreeningToolDto } from 'src/app/model/ScreeningTools/gad7.model';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ValidatedScreeningToolService } from 'src/app/core/ValidatedScreeningTools/vsTools.service';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/core/security/security.service';

@Component({
  selector: 'app-gad7',
  templateUrl: './gad7.component.html',
  styleUrls: ['./gad7.component.scss']
})
export class Gad7Component implements OnInit, OnDestroy {
  savingGad7: boolean;
  loadingData: boolean;
  questionsData = Gad7QuestionsData.questions;
  gad7ToolDto = new GAD7ScreeningToolDto();
  gad7ToolsList = new Array<GAD7ScreeningToolDto>();
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
    this.GetGAD7ByPatientId();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetGAD7ByPatientId() {
    if (this.PatientId) {
      this.loadingData = true;
      this.subs.sink = this.vsToolsService.GetGAD7ByPatientId(this.PatientId).subscribe((res: any) => {
        this.gad7ToolsList = res;
        this.loadingData = false;
      }, (error: HttpResError) => {
        this.loadingData = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  resetObj() {
    this.gad7ToolDto = new GAD7ScreeningToolDto();
  }
  calculateScore() {
    let Score = 0;
    Score = (+this.gad7ToolDto.feelingNervousAnxiousOnEdge || 0)
            + (+this.gad7ToolDto.notAbleToControlWorrying || 0)
            + (+this.gad7ToolDto.worryAboutDifferentThings || 0)
            + (+this.gad7ToolDto.troubleRelaxing || 0)
            + (+this.gad7ToolDto.beingRestlessToSitStill || 0)
            + (+this.gad7ToolDto.becomingEasyAnnoyed || 0)
            + (+this.gad7ToolDto.feelingAfraidOfSomeThingAwfull || 0);
   this.gad7ToolDto.score = Score;
   if (Score > 4 && Score < 10) {
     this.gad7ToolDto.result = 'Mild Anxiety';
   }
   if (Score > 9 && Score < 15) {
     this.gad7ToolDto.result = 'Moderate Anxiety';
   }
   if (Score > 14) {
     this.gad7ToolDto.result = 'Severe Anxiety';
   }
  }
  OpenEditModel(item: GAD7ScreeningToolDto, modal: ModalDirective) {
    Object.assign(this.gad7ToolDto, item);
    modal.show();
  }
  AddGad7ScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingGad7 = true;
      this.gad7ToolDto.patientId = this.PatientId;
      this.gad7ToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.AddGad7ScreeningTools(this.gad7ToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetGAD7ByPatientId();
        this.savingGad7 = false;
        this.gad7ToolDto = new GAD7ScreeningToolDto();
        this.toaster.success('Record Added Successfully');
      }, (error: HttpResError) => {
        this.savingGad7 = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  EditGad7ScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingGad7 = true;
      this.gad7ToolDto.patientId = this.PatientId;
      this.gad7ToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditGad7ScreeningTools(this.PatientId, this.gad7ToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetGAD7ByPatientId();
        this.savingGad7 = false;
        this.gad7ToolDto = new GAD7ScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingGad7 = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }

}
