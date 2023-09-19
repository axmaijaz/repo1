import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { SecurityService } from 'src/app/core/security/security.service';
import { ValidatedScreeningToolService } from 'src/app/core/ValidatedScreeningTools/vsTools.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { WasaQuestionsData, WSASScreeningToolDto } from 'src/app/model/ScreeningTools/wasa.model';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-wsas',
  templateUrl: './wsas.component.html',
  styleUrls: ['./wsas.component.scss']
})
export class WsasComponent implements OnInit, OnDestroy {
  savingWsas: boolean;
  loadingData: boolean;
  questionsData = WasaQuestionsData.questions;
  WsasToolDto = new WSASScreeningToolDto();
  WsasToolsList = new Array<WSASScreeningToolDto>();
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
    this.GetWsasByPatientId();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetWsasByPatientId() {
    if (this.PatientId) {
      this.loadingData = true;
      this.subs.sink = this.vsToolsService.GetWsasByPatientId(this.PatientId).subscribe((res: any) => {
        this.WsasToolsList = res;
        this.loadingData = false;
      }, (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
      });
    }
  }
  resetObj() {
    this.WsasToolDto = new WSASScreeningToolDto();
  }
  calculateScore() {
    let Score = 0;
    Score = (+this.WsasToolDto.myAbilityToWorkIsImpaired || 0)
     + (+this.WsasToolDto.myHomeManagementIsImpaired || 0)
     + (+this.WsasToolDto.mySocialActivitiesAreImpaired || 0)
     + (+this.WsasToolDto.myPrivateActivitiesAreImpaired || 0)
     + (+this.WsasToolDto.myRelationShipsWithOthersAreImpaired || 0);
   this.WsasToolDto.score = Score;
   if (Score < 10) {
     this.WsasToolDto.result = 'Early stage';
   }
   if (Score > 9 && Score < 21) {
     this.WsasToolDto.result = 'Significant functional impairment';
   }
   if (Score > 20) {
     this.WsasToolDto.result = 'Moderately severe or worse psychopathology';
   }
  }
  OpenEditModel(item: WSASScreeningToolDto, modal: ModalDirective) {
    Object.assign(this.WsasToolDto, item);
    modal.show();
  }
  AddWsasScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingWsas = true;
      this.WsasToolDto.patientId = this.PatientId;
      this.WsasToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.AddWsasScreeningTools(this.WsasToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetWsasByPatientId();
        this.savingWsas = false;
        this.WsasToolDto = new WSASScreeningToolDto();
        this.toaster.success('Record Added Successfully');
      }, (error: HttpResError) => {
        this.savingWsas = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  EditWsasScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingWsas = true;
      this.WsasToolDto.patientId = this.PatientId;
      this.WsasToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditWsasScreeningTools(this.PatientId, this.WsasToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetWsasByPatientId();
        this.savingWsas = false;
        this.WsasToolDto = new WSASScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingWsas = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }

}
