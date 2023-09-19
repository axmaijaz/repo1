import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataFilterService } from "src/app/core/data-filter.service";
import { SecurityService } from "src/app/core/security/security.service";
import { ValidatedScreeningToolService } from "src/app/core/ValidatedScreeningTools/vsTools.service";
import { BHIScreeningToolTypeEnum } from "src/app/Enums/bhi-screening-tool.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import { Dast20QuestionsData, DAST20ScreeningToolDto } from "src/app/model/ScreeningTools/dast20.model";
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { GAD7ScreeningToolDto, Gad7QuestionsData } from "src/app/model/ScreeningTools/gad7.model";
import { PhqQuestionsData, PHQScreeningToolDto } from "src/app/model/ScreeningTools/phq.modal";
import { WasaQuestionsData, WSASScreeningToolDto } from "src/app/model/ScreeningTools/wasa.model";
import { SubSink } from "src/app/SubSink";
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';



@Component({
  selector: "app-all-screening-tools",
  templateUrl: "./all-screening-tools.component.html",
  styleUrls: ["./all-screening-tools.component.scss"],
})
export class AllScreeningToolsComponent implements OnInit {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    opens: 'left',
    appendTo: 'body'
  };
  loadingData: boolean;
  rows = [];
  bHIScreeningToolTypeEnum = BHIScreeningToolTypeEnum;
  savingGad7: boolean;
  gadQuestionsData = Gad7QuestionsData.questions;
  gad7ToolDto = new GAD7ScreeningToolDto();
  gad7ToolsList = new Array<GAD7ScreeningToolDto>();

  dast20ToolDto = new DAST20ScreeningToolDto();
  dastQuestionsData = Dast20QuestionsData.questions;

  WsasToolDto = new WSASScreeningToolDto();
  wsasQuestionsData = WasaQuestionsData.questions;

  phqQuestionsData = PhqQuestionsData.questions;
  PhqToolDto = new PHQScreeningToolDto();

  bHIScreeningToolTypeEnumList = this.dataFilterService.getEnumAsList(
    BHIScreeningToolTypeEnum
  );
  private subs = new SubSink();
  PatientId: number;
  savingDast20: boolean;
  savingWsas: boolean;
  savingPhq: boolean;

  constructor(
    private toaster: ToastService,
    private securityService: SecurityService,
    private vsToolsService: ValidatedScreeningToolService,
    private route: ActivatedRoute,
    private dataFilterService: DataFilterService
  ) {}

  ngOnInit(): void {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    this.GetBhiEncounterALL();
  }
  GetBhiEncounterALL() {
    this.loadingData = true;
    this.vsToolsService.GetBhiEncounterALL(this.PatientId).subscribe(
      (res: any) => {
         this.rows=[...res.dastDtos,...res.gadDtos,...res.phqDtos,...res.wsasDtos];
         this.loadingData = false;
      },
      (err: HttpResError) => {
        this.loadingData = false;
        this.toaster.error(err.error);
     }
    );
  }
  openEditModal(item, addGadModal: ModalDirective, addDastModal: ModalDirective, addWsasModal: ModalDirective, addPhqModal: ModalDirective){
    if(item.toolType == "GAD-7"){
      Object.assign(this.gad7ToolDto, item);
      addGadModal.show();

    }
    if(item.toolType == "DAST 20"){
      Object.assign(this.dast20ToolDto, item);
      addDastModal.show();
    }
    if(item.toolType == "WSAS"){
      Object.assign(this.WsasToolDto, item);
      addWsasModal.show();
    }
    if(item.toolType == "PHQ 9"){
      Object.assign(this.PhqToolDto, item);
      addPhqModal.show();
    }
  }
  calculateGadScore() {
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
  EditGad7ScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingGad7 = true;
      this.gad7ToolDto.patientId = this.PatientId;
      this.gad7ToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditGad7ScreeningTools(this.PatientId, this.gad7ToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetBhiEncounterALL();
        this.savingGad7 = false;
        this.gad7ToolDto = new GAD7ScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingGad7 = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  calculateDastScore() {
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
  EditDast20ScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingDast20 = true;
      this.dast20ToolDto.patientId = this.PatientId;
      this.dast20ToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditDast20ScreeningTools(this.PatientId, this.dast20ToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetBhiEncounterALL();
        this.savingDast20 = false;
        this.dast20ToolDto = new DAST20ScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingDast20 = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  calculateWsasScore() {
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
  EditWsasScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingWsas = true;
      this.WsasToolDto.patientId = this.PatientId;
      this.WsasToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditWsasScreeningTools(this.PatientId, this.WsasToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetBhiEncounterALL();
        this.savingWsas = false;
        this.WsasToolDto = new WSASScreeningToolDto();
        this.toaster.success('Record Updated Successfully');
      }, (error: HttpResError) => {
        this.savingWsas = false;
        this.toaster.error(error.message, error.error);
      });
    }
  }
  calculatePhqScore() {
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
  EditPhqScreeningTools(modal: ModalDirective) {
    if (this.PatientId) {
      this.savingPhq = true;
      this.PhqToolDto.patientId = this.PatientId;
      this.PhqToolDto.administratorId = this.securityService.securityObject.id;
      this.subs.sink = this.vsToolsService.EditPhqScreeningTools(this.PatientId, this.PhqToolDto).subscribe((res: any) => {
        modal.hide();
        this.GetBhiEncounterALL();
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
