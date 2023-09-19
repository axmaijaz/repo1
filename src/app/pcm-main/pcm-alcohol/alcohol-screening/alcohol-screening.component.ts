import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { PcmAlcoholService } from 'src/app/core/pcm/pcm-alcohol.service';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AMScreeningDto, AMScreeningQuestionOptionDto, EditAMScreeningDto, EditAMScreeningDetailDto, AMScreeningDetailDto } from 'src/app/model/pcm/pcm-alcohol.model';
import { PcmScreeningSignDto } from 'src/app/model/pcm/pcm.model';
import { PcmService } from 'src/app/core/pcm/pcm.service';
@Component({
  selector: 'app-alcohol-screening',
  templateUrl: './alcohol-screening.component.html',
  styleUrls: ['./alcohol-screening.component.scss']
})
export class AlcoholScreeningComponent implements OnInit, OnDestroy {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'
  };
  PatientId: number;
  screeningId: number;
  private subs = new SubSink();
  isLoadingScreening = true;
  amScreeningObj: AMScreeningDto;
  consumptionScore: number;
  @Input() awSId: number;
  auditScore: number;
  dependenceScore: number;
  editAlcoholScreeningDto = new EditAMScreeningDto();
  pcmScreeningSignDto = new PcmScreeningSignDto();
  scoreResult: string;
  savingEncounter: boolean;
  IsSigning: boolean;
  constructor(private pcmService: PcmService, private location: Location, private alcoholService: PcmAlcoholService, private route: ActivatedRoute, private toaster: ToastService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.screeningId = +this.route.snapshot.paramMap.get('sId');
    // if (!this.PatientId && this.awPId) {
    //   this.PatientId = this.awPId;
    // }
    if (!this.screeningId && this.awSId) {
      this.screeningId = this.awSId;
    }
    this.GetAMScreeningById();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  goBack() {
    this.location.back();
  }
  GetAMScreeningById() {
    this.isLoadingScreening = true;
    this.subs.sink = this.alcoholService.GetAMScreeningById(this.screeningId).subscribe(
      (res: AMScreeningDto) => {
        this.amScreeningObj = res;
        this.isLoadingScreening = false;
        if (this.amScreeningObj) {
          this.editAlcoholScreeningDto.note = this.amScreeningObj.note;
          this.pcmScreeningSignDto.signatureDate = this.amScreeningObj.signatureDate ? this.amScreeningObj.signatureDate : '';
          this.pcmScreeningSignDto.signature = this.amScreeningObj.signature;
        }
        this.calculateScore();
      },
      (error: HttpResError) => {
        this.isLoadingScreening = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  /*
  Score 0 – 7  :  Consumption Score less than 6 and Dependence Score less than 4 –  Low Risk
                  Dependency Score of 4 or more  -  Assess for Dependency
                  Consumption Score of 6 or more – Assess for At risk drinking
  Score 8-15 :    Dependence Score less than  4 – Risky or Hazardous Level
                  Dependence Score of 4 or more - Risky or Hazardous Level and Assess for Dependency
  Score 16 – 19:  Dependence Score less than 4 – High Risk or Harmful Level
		              Dependence Score of 4 or more- High Risk or Harmful Level and Assess for Dependency
  Score 20 or More: Dependence Score less than 4 – High Risk
			            Dependence Score of 4 or more – Almost certainly dependent and Assess for Dependency

   */
  calculateScore() {
    const arLength = this.amScreeningObj.amScreeningDetails.length;
    this.auditScore = 0;
    this.consumptionScore = 0;
    this.dependenceScore = 0;
    for (let index = 0; index < arLength; index++) {
      const question = this.amScreeningObj.amScreeningDetails[index];
      if (question.isAuditQuestion && question.selectedOptionScore !== null) {
        this.auditScore = this.auditScore + question.selectedOptionScore;
      }
      if (question.isConsumptionQuestion && question.selectedOptionScore !== null) {
        this.consumptionScore = this.consumptionScore + question.selectedOptionScore;
      }
      if (question.isDependenceQuestion && question.selectedOptionScore !== null) {
        this.dependenceScore = this.dependenceScore + question.selectedOptionScore;
      }
    }
    if (this.auditScore < 8) {
      if (this.consumptionScore < 6 && this.dependenceScore < 4) {
        this.scoreResult = 'Low Risk';
      } else if (this.dependenceScore >= 4) {
        this.scoreResult = 'Assess for Dependency';
      } else if (this.consumptionScore >= 6) {
        this.scoreResult = 'Assess for At risk drinking ';
      }
    } else if (this.auditScore > 7 && this.auditScore < 16) {
      if (this.dependenceScore < 4) {
        this.scoreResult = 'Risky or Hazardous Level ';
      } else if (this.dependenceScore >= 4) {
        this.scoreResult = 'Risky or Hazardous Level and Assess for Dependency ';
      }
    } else if (this.auditScore > 15 && this.auditScore < 20) {
      if (this.dependenceScore < 4) {
        this.scoreResult = 'High Risk or Harmful Level';
      } else if (this.dependenceScore >= 4) {
        this.scoreResult = 'High Risk or Harmful Level and Assess for Dependency ';
      }
    } else if (this.auditScore > 19) {
      if (this.dependenceScore < 4) {
        this.scoreResult = 'High Risk';
      } else if (this.dependenceScore >= 4) {
        this.scoreResult = 'Almost certainly dependent and Assess for Dependency';
      }
    }
    this.editAlcoholScreeningDto.auditScore = this.auditScore;
    this.editAlcoholScreeningDto.consumptionScore = this.consumptionScore;
    this.editAlcoholScreeningDto.dependenceScore = this.dependenceScore;
    this.editAlcoholScreeningDto.scoreResult = this.scoreResult;
  }
  checkIfFirstQuestion(qIndex: number, question: AMScreeningDetailDto, option: AMScreeningQuestionOptionDto) {
    if (qIndex === 0 && option.text.toLocaleLowerCase() === 'never' && option.score === 0) {
      this.amScreeningObj.amScreeningDetails.forEach(ques => {
        if (ques.options) {
          ques.selectedOptionScore = ques.options[0].score;
        }
      });
      this.calculateScore();
      this.saveAlcoholScreening();
    }
  }
  saveAlcoholScreening() {
    this.savingEncounter = true;
    const arLength = this.amScreeningObj.amScreeningDetails.length;
    this.editAlcoholScreeningDto.amScreeningDetails = [];
    this.editAlcoholScreeningDto.id = this.amScreeningObj.id;
    for (let index = 0; index < arLength; index++) {
      const question = this.amScreeningObj.amScreeningDetails[index];
      const detail = new EditAMScreeningDetailDto();
      detail.id = question.id;
      detail.selectedOptionScore = isNaN(question.selectedOptionScore) ? null : question.selectedOptionScore;
      detail.amScreeningQuestionId = question.amScreeningQuestionId;
      this.editAlcoholScreeningDto.amScreeningDetails.push(detail);
    }
    this.subs.sink = this.alcoholService.EditAMScreening(this.editAlcoholScreeningDto).subscribe(
      (res: any) => {
        // this.toaster.success('Encounter saved successfully');
        this.savingEncounter = false;
      },
      (error: HttpResError) => {
        this.savingEncounter = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SignScreeningEncounter() {
    this.IsSigning = true;
    this.pcmScreeningSignDto.screeningId = this.screeningId;
    this.subs.sink = this.pcmService.SignAMScreening(this.pcmScreeningSignDto).subscribe(
      (res: any) => {
        this.toaster.success('Encounter submitted successfully');
        this.IsSigning = false;
      },
      (error: HttpResError) => {
        this.IsSigning = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
