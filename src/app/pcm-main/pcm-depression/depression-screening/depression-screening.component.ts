import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { SubSink } from 'src/app/SubSink';
import { DepressionScreeningDto, EditDepressionScreeningDto, EditDepressionScreeningDetailDto } from 'src/app/model/pcm/pcm-depression.model';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Location } from '@angular/common';
import { PcmScreeningSignDto } from 'src/app/model/pcm/pcm.model';

@Component({
  selector: 'app-depression-screening',
  templateUrl: './depression-screening.component.html',
  styleUrls: ['./depression-screening.component.scss']
})
export class DepressionScreeningComponent implements OnInit, OnDestroy {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'
  };
  PatientId: number;
  screeningId: number;
  // @Input() awPId: number;
  @Input() awSId: number;
  private subs = new SubSink();
  isLoadingScreening = true;
  depressionScreeningObj: DepressionScreeningDto;
  // consumptionScore: number;
  // auditScore: number;
  // dependenceScore: number;
  editDepressionScreeningDto = new EditDepressionScreeningDto();
  pcmScreeningSignDto = new PcmScreeningSignDto();

  scoreResult: string;
  savingEncounter: boolean;
  totalScore: number;
  IsSigning: boolean;
  PHQScoreCalculate: string;
  constructor(private location: Location, private pcmService: PcmService, private route: ActivatedRoute, private toaster: ToastService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.screeningId = +this.route.snapshot.paramMap.get('sId');
    // if (!this.PatientId && this.awPId) {
    //   this.PatientId = this.awPId;
    // }
    if (!this.screeningId && this.awSId) {
      this.screeningId = this.awSId;
    }
    this.GetDPScreeningById();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  goBack() {
    this.location.back();
  }
  GetDPScreeningById() {
    this.isLoadingScreening = true;
    this.subs.sink = this.pcmService.GetDPScreeningById(this.screeningId).subscribe(
      (res: DepressionScreeningDto) => {
        this.depressionScreeningObj = res;
        this.isLoadingScreening = false;
        if (this.depressionScreeningObj) {
          this.editDepressionScreeningDto.note = this.depressionScreeningObj.note;
          this.pcmScreeningSignDto.signatureDate = this.depressionScreeningObj.signatureDate ? this.depressionScreeningObj.signatureDate : '';
          this.pcmScreeningSignDto.signature = this.depressionScreeningObj.signature;
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
    this.PHQScoreCalculate = ''
    const arLength = this.depressionScreeningObj.depressionScreeningDetails.length;
    this.totalScore = null;
    for (let index = 0; index < arLength; index++) {
      const question = this.depressionScreeningObj.depressionScreeningDetails[index];
      if (question.selectedOptionScore !== null) {
        this.totalScore = this.totalScore + question.selectedOptionScore;
      }
    }
    if (this.totalScore == 0) {
      this.scoreResult = 'Not depressed';
    } else if (this.totalScore > 0 && this.totalScore < 5) {
      this.scoreResult = 'Minimal depression';
    } else if (this.totalScore > 5 && this.totalScore < 10) {
      this.scoreResult = 'Mild depression';
    } else if (this.totalScore > 9 && this.totalScore < 15) {
      this.scoreResult = 'Moderate depression';
    } else if (this.totalScore > 14  && this.totalScore < 20) {
      this.scoreResult = 'Moderately severe depression';
    } else if (this.totalScore > 19  && this.totalScore < 28) {
      this.scoreResult = 'Severe depression';
    }
    this.editDepressionScreeningDto.scoreResult = this.scoreResult;
    if(this.scoreResult ) {
      this.PHQScoreCalculate = `${this.totalScore}-${this.scoreResult}`;
    }
  }
  saveDepressionScreening() {
    this.savingEncounter = true;
    const arLength = this.depressionScreeningObj.depressionScreeningDetails.length;
    this.editDepressionScreeningDto.depressionScreeningDetails = [];
    this.editDepressionScreeningDto.id = this.depressionScreeningObj.id;
    for (let index = 0; index < arLength; index++) {
      const question = this.depressionScreeningObj.depressionScreeningDetails[index];
      const detail = new EditDepressionScreeningDetailDto();
      detail.id = question.id;
      detail.selectedOptionScore = isNaN(question.selectedOptionScore) ? null : question.selectedOptionScore;
      detail.depressionScreeningQuestionId = question.depressionScreeningQuestionId;
      this.editDepressionScreeningDto.depressionScreeningDetails.push(detail);
    }
    this.editDepressionScreeningDto.totalScore = this.totalScore ? this.totalScore : 0;
    this.subs.sink = this.pcmService.EditDPScreening(this.editDepressionScreeningDto).subscribe(
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
    this.subs.sink = this.pcmService.SignDepressionScreening(this.pcmScreeningSignDto).subscribe(
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
