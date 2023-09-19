import { PatientDto } from 'src/app/model/Patient/patient.model';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { Location } from '@angular/common';
import {
  AWProvidertabEncounterDto,
  AWSectionDto,
  AWQuestionDto,
  AWPhysiciantabEncounterDto,
  AWScreeningDto,
  AddEditAWScreeningDto,
  TCMEncounterForAWDto,
} from 'src/app/model/AnnualWellness/aw.model';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Router, ActivatedRoute } from '@angular/router';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AwsService } from 'src/app/core/aws/aws.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SubSink } from 'src/app/SubSink';
import { environment } from 'src/environments/environment';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';

@Component({
  selector: 'app-aw-detail',
  templateUrl: './aw-detail.component.html',
  styleUrls: ['./aw-detail.component.scss'],
})
export class AwDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('feetVal') feetVal: ElementRef;
  @ViewChild('heightVal') inchVal: ElementRef;
  @ViewChild('weightVal') weightVal: ElementRef;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'
  };
  awDisable = true;
  annualWellnessID: number;
  PatientId: number;
  awEncounterPTabQuestions: AWProvidertabEncounterDto;
  pTabDataObj = {};
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  isLoadingPTABData: boolean;
  BMIResultText = '';
  awEncounterPTabDto = new AWPhysiciantabEncounterDto();
  isLoadingPhysicianTABData: boolean;
  SaveEncounterTabData: boolean;
  savingScreeningData: boolean;
  ScreeningData = new Array<AWScreeningDto>();
  isDisabled = false;
  PatientAge: number;
  uploadImg: boolean;
  isLoadingPublic: boolean;
  TobaccoFormObj = {};
  patientData = new PatientDto();
  tcmEncounterForAWDto = new TCMEncounterForAWDto();
  private subs = new SubSink();
  isRefreshTCM: boolean;
  constructor(
    private location: Location,
    private toaster: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private awService: AwService,
    private awsService: AwsService,
    private appData: AppDataService,
    private eventBus: EventBusService,
    private patientsService: PatientsService,
  ) {}

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get(
      'awId'
    );
    this.GetAWEncounterProviderTabById();
    this.GetAWEncounterPatientTabById();
    this.eventBus.on(EventTypes.GapsDataChanged).subscribe((res) => {
      this.GetAWEncounterProviderTabById();
    });
  }
  ngAfterViewInit() {
    if (!this.appData.summeryViewPatient.id || this.appData.summeryViewPatient.id !== this.PatientId) {
      this.getPatientDetail();
    } else {
     this.patientData = this.appData.summeryViewPatient;
    }
  }
  resetBmiValues() {
    this.inchVal.nativeElement.value = '';
    this.weightVal.nativeElement.value = '';
    this.feetVal.nativeElement.value = '';
    this.pTabDataObj['BMI'].answer = '';
    this.BMIResultText = '';
  }
  getPatientDetail() {
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.appData.summeryViewPatient = res;
              // res.dateOfBirth = res.dateOfBirth.slice(0, 10);
              this.patientData = res;
            }
          },
          error => {
            //  console.log(error);
          }
        );
    }
  }
  GetAWEncounterProviderTabById() {
    this.isLoadingPTABData = true;
    this.awService
      .GetAWEncounterProviderTabById(this.annualWellnessID)
      .subscribe(
        (res: AWProvidertabEncounterDto) => {
          this.awEncounterPTabQuestions = res;
          if (res.status && res.status === 2) {
            this.awDisable = true;
          } else {
            this.awDisable = false;
          }
          this.PatientAge = this.awEncounterPTabQuestions.patientAge;
          this.ScreeningData = res.awScreenings;
          this.isDisabled = true;
          this.awEncounterPTabQuestions.awSections.forEach(
            (section: AWSectionDto) => {
              section.awQuestions.forEach((question: AWQuestionDto) => {
                this.pTabDataObj[question.shortDesc] = {};
                this.pTabDataObj[question.shortDesc]['question'] = question;
                this.pTabDataObj[question.shortDesc]['answer'] =
                  question.response;
                this.pTabDataObj[question.shortDesc]['section'] = section;
                if (question.shortDesc === 'TobaccoForm') {
                  if (question.response) {
                    const selectedOptions = question.response.split(',');
                    selectedOptions.forEach(element => {
                      if (element) {
                        this.TobaccoFormObj[element] = true;
                      }
                    });
                  }
                }
              });
              if (!this.pTabDataObj['DiscussedLDCT']) {
                this.pTabDataObj['DiscussedLDCT'] = {};
              }
              if (!this.pTabDataObj['HeartRate']) {
                this.pTabDataObj['HeartRate'] = {};
              }
              if (!this.pTabDataObj['Temp']) {
                this.pTabDataObj['Temp'] = {};
              }
              if (!this.pTabDataObj['BMIPregnancy']) {
                this.pTabDataObj['BMIPregnancy'] = {};
              }
              if (!this.pTabDataObj['O2SAT']) {
                this.pTabDataObj['O2SAT'] = {};
              }
              if (!this.pTabDataObj['AgreementLDCT']) {
                this.pTabDataObj['AgreementLDCT'] = {};
              }
              setTimeout(() => {
                this.calculateSBP();
                this.calculateDBP();
                this.FillHeightWeight();
              }, 1000);
            }
          );
          this.isLoadingPTABData = false;
        },
        (err: HttpResError) => {
          // this.isLoadingPTABData = false;
          // this.isCreatingEncounter = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  saveTobaccoFormObj() {
    let answer = '';
    Object.keys(this.TobaccoFormObj).forEach((value, index, obj) => {
      if (this.TobaccoFormObj[value]) {
        answer += value + ',';
      }
    });
    this.pTabDataObj['TobaccoForm'].answer = answer;
    this.saveQuestion(this.pTabDataObj['TobaccoForm'], 'TobaccoForm');
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    this.uploadImg = true;
    this.getUrlForFIle(output.target.files[0]);
  }
  getTCMEncounterDetailsForAW() {
    this.isRefreshTCM = true;
    this.awService.GetTCMEncounterDetailsForAW(this.PatientId).subscribe(
      (res: TCMEncounterForAWDto) => {
        this.tcmEncounterForAWDto = res;
        this.awEncounterPTabQuestions.tcmUpdateAvailable = false;
        this.pTabDataObj['RHDischargeDate'].answer = this.tcmEncounterForAWDto.dischargeDate
        this.pTabDataObj['RHDischargeFrom'].answer = this.tcmEncounterForAWDto.dischargedFrom
        this.pTabDataObj['RHReason'].answer = this.tcmEncounterForAWDto.reason;
        this.isRefreshTCM = false;
      },
      (err: HttpResError) => {
        // this.isCreatingEncounter = false;
        this.isRefreshTCM = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  getUrlForFIle(file: any) {
    this.uploadImg = true;
    this.awService.AddCognitiveAssessmentDocumentForAWEncounter(this.annualWellnessID, file.name).subscribe(
      (res: any) => {
          this.UploadtoS3(file, res);
      },
      (err: HttpResError) => {
        // this.isCreatingEncounter = false;
        this.uploadImg = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async UploadtoS3(file: any, path: string) {
    // if (this.patientRpmConsentType === 1) {
    // this.rpmInputLoading = true;
    // const path = `pcmDocs/preventiveCare-${this.PatientId}/${file.name}`;
    this.awsService.uploadUsingSdk(file, path).then(
      data => {
        this.uploadImg = false;
        this.awEncounterPTabQuestions.cognitiveAssessmentDoc = path;
        // this.getMeasureDataByCode(this.currentCode ,null);
        this.toaster.success('Document uploaded successfully');
      },
      err => {
        this.removeDoc();
        this.uploadImg = false;

      }
    );
    // }
  }
  removeDoc(remove?: boolean) {
    this.awService.AddCognitiveAssessmentDocumentError(this.annualWellnessID).subscribe(res => {
      // if (res) {
        if (remove) {
          this.toaster.success('File deleted successfully.');
          this.awEncounterPTabQuestions.cognitiveAssessmentDoc = '';
        } else {
          this.toaster.warning('Error while uploading image.');
        }
      // }
    });
  }
  getPublicUrl(url: string) {
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.awsService.getPublicPath(url).subscribe(
      (res: any) => {
        this.isLoadingPublic = false;
        // importantStuff.location.href = res;
        // FileSaver.saveAs(
        //   new Blob([res], { type: 'application/pdf' }),
        //   'Consent-Document'
        // );
        if (url.toLocaleLowerCase().includes('.pdf')) {
          fetch(res).then(async (fdata: any) => {
            const slknasl = await fdata.blob();
            const blob = new Blob([slknasl], { type: 'application/pdf' });
            const objectURL = URL.createObjectURL(blob);

            importantStuff.close();
            this.objectURLStrAW = objectURL;
            this.viewPdfModal.show();
            // importantStuff.location.href = objectURL;
            // window.open(objectURL, '_blank');
          });
        } else {
          // window.open(res, "_blank");
          importantStuff.location.href = res;
          // setTimeout(() => {
          //   importantStuff.close();
          // }, 2000);
        }
      },
      (err) => {
        this.isLoadingPublic = false;
        // this.preLoader = 0;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  saveQuestion(data: {
    question: AWQuestionDto;
    answer: string;
    section: AWSectionDto;
  }, desc: string) {
    if ( !data.question || !data.question.id) {
      data.question = new AWQuestionDto();
      data.question.id = 0;
    }
    const obj = { questionId: data.question.id, response: data.answer, shortDesc: desc, awEncounterId: this.annualWellnessID };
    this.awService.EditAWQuestion(obj).subscribe(
      (res: AWProvidertabEncounterDto) => {},
      (err: HttpResError) => {
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  SaveHeightWeight(feet: number, inches: number, weight: number) {
    let heightStr = '';
    let weightStr = '';
    if (feet || inches || weight) {
      heightStr = `${feet ? feet : '0'}.${inches ? inches : '0'}`;
      weightStr = `${weight}`;
    }
    if (this.pTabDataObj['Height']) {
      this.pTabDataObj['Height'].answer = heightStr;
      this.saveQuestion(this.pTabDataObj['Height'] , 'Height');
    }
    if (this.pTabDataObj['Weight']) {
      this.pTabDataObj['Weight'].answer = weightStr;
      this.saveQuestion(this.pTabDataObj['Weight'] , 'Weight');
    }
  }
  checkIfEverUsedIsNo() {
    if (this.pTabDataObj['CurrentlyUsingTobacco'].answer === 'Yes') {
      this.pTabDataObj['EverUsedTobacco'].answer = 'Yes';
      this.saveQuestion(this.pTabDataObj['EverUsedTobacco'], 'EverUsedTobacco');
    }
    if (this.pTabDataObj['CurrentlyUsingTobacco'].answer === 'No') {
      this.pTabDataObj['CurrentSmokerOrQuitIn15Years'].answer = '';
      this.pTabDataObj['LungCancer'].answer = '';
      this.pTabDataObj['PacksPerDay'].answer = '';
      this.pTabDataObj['NoOfYears'].answer = '';
      this.saveQuestion(this.pTabDataObj['CurrentSmokerOrQuitIn15Years'], 'CurrentSmokerOrQuitIn15Years');
      this.saveQuestion(this.pTabDataObj['LungCancer'], 'LungCancer');
      this.saveQuestion(this.pTabDataObj['PacksPerDay'], 'PacksPerDay');
      this.saveQuestion(this.pTabDataObj['NoOfYears'], 'NoOfYears');
    }
  }
  CalculateBMI(height, weight, feet) {
    this.BMIResultText = '';
    let innerText = '';
    height = parseInt(height);
    weight = parseInt(weight);
    feet = parseInt(feet);
    if (feet) {
      height += feet * 12;
    }
    height /= 39.3700787;
    weight /= 2.20462;
    let BMI = (weight / Math.pow(height, 2));
    if (BMI) {
      BMI = +BMI.toFixed(2);
      this.pTabDataObj['BMI'].answer = BMI;
    }
    const output = Math.round(BMI * 100) / 100;
    if (output < 18.5) {
      innerText = 'BMI is below normal';
    } else if (output >= 18.5 && output <= 25) {
      innerText = 'BMI is normal ';
    } else if (output >= 25 && output <= 40) {
      innerText = 'Morbid Obesity  ';
    } else if (output > 40) {
      innerText = 'Overweight';
    }
    this.BMIResultText = innerText;
    // document.getElementById("answer").value = output;
  }
  FillHeightWeight() {
    if (this.pTabDataObj['Height']) {
      const heStr = this.pTabDataObj['Height'].answer;
      if (heStr) {
        const arrH = heStr.split('.');
        if (arrH.length) {
          this.feetVal.nativeElement.value = +arrH[0];
          this.inchVal.nativeElement.value = +arrH[1];
        }
      }
    }
    if (this.pTabDataObj['Weight']) {
      const weStr = this.pTabDataObj['Weight'].answer;
      if (weStr) {
          this.weightVal.nativeElement.value = +weStr;
      }
    }
    this.CalculateBMI(this.inchVal.nativeElement.value,this.weightVal.nativeElement.value, this.feetVal.nativeElement.value);
  }


  calculateSBP() {
    const SBP = this.pTabDataObj['LastSystolicReading'].answer;
    if (!this.pTabDataObj['SystolicStatus']) {
      return;
    }
    if (!SBP) {
      this.pTabDataObj['SystolicStatus'].answer = '';
      return;
    }
    if (SBP <= 140) {
      this.pTabDataObj['SystolicStatus'].answer = 'Controlled';
      this.saveQuestion(this.pTabDataObj['SystolicStatus'], 'SystolicStatus');
    } else if (SBP > 140 ) {
      this.pTabDataObj['SystolicStatus'].answer = 'Uncontrolled';
      this.saveQuestion(this.pTabDataObj['SystolicStatus'], 'SystolicStatus');
    }
  }
  calculateDBP() {
    const DBP = this.pTabDataObj['LastDiastolicReading'].answer;
    if (!this.pTabDataObj['DiastolicStatus']) {
      return;
    }
    if (!DBP) {
      this.pTabDataObj['DiastolicStatus'].answer = '';
      return;
    }
    if (DBP <= 90) {
      this.pTabDataObj['DiastolicStatus'].answer = 'ControlledDiastolic';
      this.saveQuestion(this.pTabDataObj['DiastolicStatus'], 'DiastolicStatus');
    } else if (DBP > 90 ) {
      this.pTabDataObj['DiastolicStatus'].answer = 'UncontrolledDiastolic';
      this.saveQuestion(this.pTabDataObj['DiastolicStatus'], 'DiastolicStatus');
    }
  }
  GetAWEncounterPatientTabById() {
    this.isLoadingPhysicianTABData = true;
    this.awService.GetAWEncounterPhysicianTabById(this.annualWellnessID).subscribe((res: AWPhysiciantabEncounterDto) => {
      this.awEncounterPTabDto = res;
      this.isLoadingPhysicianTABData = false;
    },
      (err: HttpResError) => {
        this.isLoadingPhysicianTABData = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  EditAWEncounterNotes() {
    this.SaveEncounterTabData = true;
    this.awService.EditAWEncounterNotes(this.awEncounterPTabDto).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      this.SaveEncounterTabData = false;
    },
      (err: HttpResError) => {
        this.SaveEncounterTabData = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  EmitEventForOpenGapDetail(code: string) {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.OpenGapDetail;
    event.value = code;
    this.eventBus.emit(event);
  }
  AddEditAWScreening(item: AddEditAWScreeningDto) {
    this.savingScreeningData = true;
    this.awService.AddEditAWScreening(item).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      this.savingScreeningData = false;
    },
      (err: HttpResError) => {
        this.savingScreeningData = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  calcMiniCog() {
      let WordsRecalled = +this.pTabDataObj['WordsRecalled'].answer;
      const DrewClock = this.pTabDataObj['DrewClock'].answer;
      if (!WordsRecalled) {
        WordsRecalled = 0;
      }
      let miniCogRes = 0;
      if (DrewClock === 'Yes') {
        miniCogRes = 1;
      } else {
        miniCogRes = 0;
      }
      this.pTabDataObj['MinicogScore'].answer  = miniCogRes + WordsRecalled;
      this.saveQuestion(this.pTabDataObj['MinicogScore'], 'MinicogScore');
    }
    calculateCaScore(){
      if(!this.pTabDataObj['6CIT']){
        this.pTabDataObj['6CIT'] = {}
      }
      this.pTabDataObj['6CIT'].answer = +this.pTabDataObj['YearItIs']?.answer  + +this.pTabDataObj['MonthItIs']?.answer  + +this.pTabDataObj['TimeItIs']?.answer  + +this.pTabDataObj['BackwardCount']?.answer  + +this.pTabDataObj['MonthsReverse']?.answer  + +this.pTabDataObj['RepeatPhrase']?.answer 
      this.saveQuestion(this.pTabDataObj['6CIT'], '6CIT');
    }

}
