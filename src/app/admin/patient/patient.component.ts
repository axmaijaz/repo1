import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import { TwocChatService } from "src/app/core/2c-chat.service";
import { AppDataService } from "src/app/core/app-data.service";
import {
  EmitEvent,
  EventBusService,
  EventTypes,
} from "src/app/core/event-bus.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { QuestionnaireService } from "src/app/core/questionnaire.service";
import { SecurityService } from "src/app/core/security/security.service";
import { StatementManagementService } from "src/app/core/statement-management.service";
import { ChatGroupDto } from "src/app/model/chat/chat.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  FilterPatient,
  PatientDto,
  StickyNotesDto,
} from "src/app/model/Patient/patient.model";
import { CcmServiceType } from "src/app/model/Questionnaire/Questionnire.model";
import { SubSink } from "src/app/SubSink";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { UploadFile } from "ng-uikit-pro-standard";
import {
  PcmMeasureDataObj,
  MeasureDto,
  EditMeasureDataParams,
  DocDataDto,
  Status,
} from "src/app/model/pcm/pcm.model";
import { PcmService } from "src/app/core/pcm/pcm.service";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { DomSanitizer } from "@angular/platform-browser";
// import { id } from '@swimlane/ngx-datatable';
import { AwsService } from "src/app/core/aws/aws.service";
import { AMScreeningDto } from "src/app/model/pcm/pcm-alcohol.model";
import { AwService } from "src/app/core/annualWellness/aw.service";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";
import { DataFilterService } from "src/app/core/data-filter.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { SetFacilityServiceConfigDto } from "src/app/model/Facility/facility.model";
import { PatinetCommunicationGroup } from "src/app/model/PatientEngagement/communication.model";
@Component({
  selector: "app-patient",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit, OnDestroy {
  public static returned: Subject<any> = new Subject();
  serviceTypes = new Array<CcmServiceType>();
  gettingChatGroup: boolean;
  files = new Array<UploadFile>();
  showFileName: any;
  pcmMeasuresList = new Array<MeasureDto>();
  pcmMeasuresListGap = new Array<MeasureDto>();
  pcmMeasuresListNotGap = new Array<MeasureDto>();
  pcmModelLoading: boolean;
  isCreatingScreening: boolean;
  pcmMOdelData = new PcmMeasureDataObj();
  docData = new DocDataDto();
  selectedMeasure = new MeasureDto();
  editingPcmData: boolean;
  selectedGapStatus: { name: string; value: number };
  whoIsCovered: any;
  currentCode: string;
  uploadImg: boolean;
  tempStatusList = new Array<Status>();
  isCreatingCounselling: boolean;
  isCreatingAWEncounter: boolean;
  ListGApWidth: number;
  ListGApNotWidth: number;
  isLoading: boolean;
  gettingGetPatientsMeasuresSummary: boolean;
  popupQustion = null;
  hasPayerGap: boolean;
  hasFacilityGap: boolean;
  hasFilter: any;
  isEndo = false;
  isGeneral = false;
  isPcmPatients = false;
  facilityId: number;
  isFacilityChatEnabled: any;
  stickyNotesDto = new StickyNotesDto();
  constructor(
    private questionService: QuestionnaireService,
    private patientsService: PatientsService,
    private securityService: SecurityService,
    private route: ActivatedRoute,
    private twocChatService: TwocChatService,
    private toaster: ToastService,
    private appData: AppDataService,
    private eventBus: EventBusService,
    private location: Location,
    private statementManagementService: StatementManagementService,
    private router: Router,
    private dataFilterService: DataFilterService,
    private facilityService: FacilityService
  ) {
    //  PatientComponent.returned.subscribe(res => {
    // this.getPatientDetail();
    //  });
    setTimeout(() => {}, 3000);
  }
  PatientData: PatientDto;
  PatientId: number;
  PatientAge: number;
  filtersObj = new FilterPatient();
  objectURLStrAW: string;
  @ViewChild("viewPdfModal") viewPdfModal: ModalDirective;
  private subs = new SubSink();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
    appendTo: "body",
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "hh:mm",
  };
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "light-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: "inside",
  };

  public scrollbarOptionsTabs = {
    axis: "x",
    theme: "dark-thin",
    live: "on",
    autoHideScrollbar: true,
    scrollbarPosition: "outside",
    // autoExpandScrollbar: true
  };

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
    const tempTabChwck = this.appData.tabCheck;
    if (tempTabChwck) {
      if (tempTabChwck == "isGeneral") {
        this.isGeneral = true;
      }
      if (tempTabChwck == "isEndo") {
        this.isEndo = true;
      }
      if (tempTabChwck == "isPcmPatients") {
        this.isPcmPatients = true;
      }
    }
    this.getPatientDetail();
    this.subs.sink = this.questionService.getServiceTypeList(false).subscribe(
      (res: any) => {
        this.serviceTypes = res;
      },
      (err) => {
        // console.log(err);
      }
    );
    // this.GetPatientsMeasuresSummary();
    this.checkFacilityChatService();
  }
  public calculateAge(birthdate: any): number {
    return moment().diff(birthdate, "years");
  }

  ngOnDestroy() {
    const counterStartingTime = "";
    const timerStart = false;
    const date = "";
    this.statementManagementService.counterStartingTime = counterStartingTime;
    this.statementManagementService.timerStart = timerStart;
    this.statementManagementService.date = date;
    this.appData.summeryViewPatient = new PatientDto();
    this.subs.unsubscribe();
  }
  navigateBack() {
    if (this.dataFilterService.routeState) {
      this.router.navigate([this.dataFilterService.routeState]);
    } else {
      this.router.navigate(["/home/page"]);
    }
    // const filterDto = localStorage.getItem('filterDto');
    // if(filterDto){
    //   this.router.navigate(
    //     ['/home/page'],
    //     {
    //       // relativeTo: ,
    //       queryParams: { filterState: JSON.stringify(filterDto) },
    //       queryParamsHandling: 'merge'
    //     });
    // }else{

    //   this.location.back();
    // }
    // this.router.navigate(['/home/page', {queryParams: hasFilter: true}])
    // this.router.navigate(['/home/page'], {
    //   queryParams: { findTutorSendMessage: true}
  }
  getPatientDetail() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.appData.summeryViewPatient = res;
              res.dateOfBirth = res.dateOfBirth.slice(0, 10);
              this.PatientData = res;
              this.stickyNotesDto.stickyNoteLow = this.PatientData.stickyNoteLow;
              this.stickyNotesDto.stickyNoteMedium =
                this.PatientData.stickyNoteMedium;
              this.stickyNotesDto.stickyNoteHigh = this.PatientData.stickyNoteHigh;
              this.stickyNotesDto.patientId = this.PatientId;

              if (this.PatientData.lastAppLaunchDate) {
                this.PatientData.isActiveMobileUser = false;
                this.PatientData.lastAppLaunchDate = moment(
                  this.PatientData.lastAppLaunchDate
                )
                  .local()
                  .format("YYYY-MM-DDTHH:mm:ss.SSSS");
                const today = moment();
                var duration = today.diff(
                  this.PatientData.lastAppLaunchDate,
                  "days"
                );
                if (duration < 30) {
                  this.PatientData.isActiveMobileUser = true;
                }
                this.PatientData.lastAppLaunchDate = moment
                  .utc(this.PatientData.lastAppLaunchDate)
                  .local()
                  .format("D MMM YY,\\ h:mm a");
              }

              if (this.PatientData.homePhone) {
                this.PatientData.homePhone = this.PatientData.homePhone.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  "($1)$2-$3"
                );
              }
              if (this.PatientData.personNumber) {
                this.PatientData.personNumber =
                  this.PatientData.personNumber.replace(
                    /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                    "($1)$2-$3"
                  );
              }
              if (this.PatientData.emergencyContactPrimaryPhoneNo) {
                this.PatientData.emergencyContactPrimaryPhoneNo =
                  this.PatientData.emergencyContactPrimaryPhoneNo.replace(
                    /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                    "($1)$2-$3"
                  );
              }
              this.PatientAge = this.calculateAge(this.PatientData.dateOfBirth);
            }
          },
          (error) => {
            //  console.log(error);
          }
        );
    }
  }
  checkFacilityChatService() {
    if (this.facilityId) {
      this.facilityService.GetFacilityServiceConfig(this.facilityId).subscribe(
        (res: SetFacilityServiceConfigDto) => {
          this.isFacilityChatEnabled = res.chatService;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
    }
  }
  getChatGroup() {
    // this.gettingChatGroup = true;
    // this.subs.sink = this.twocChatService
    //   .GetPersonalChatGroup(
    //     this.securityService.securityObject.appUserId,
    //     this.PatientData.userId
    //   )
    //   .subscribe(
    //     (res: ChatGroupDto) => {
    //       this.gettingChatGroup = false;
    //       // this.router.navigateByUrl(`/chat/messages?channel=${res.channelName}`);
    //       const event = new EmitEvent();
    //       event.name = EventTypes.OpenCommunicationModal;
    //       event.value = res;
    //       this.eventBus.emit(event);
    //     },
    //     (err: HttpResError) => {
    //       this.gettingChatGroup = false;
    //       this.toaster.error(err.message, err.error || err.error);
    //     }
    //   );
    const event = new EmitEvent();
    event.name = EventTypes.OpenCommunicationModal;
    const chatGroup = new PatinetCommunicationGroup();
    chatGroup.id = this.PatientData.id;
    chatGroup.name = `${this.PatientData.firstName} ${this.PatientData.lastName}`;
    chatGroup.lastCommunication = null
    event.value = chatGroup;
    this.eventBus.emit(event);
  }
  // onUploadOutput(output: any): void {
  //   if (output.target.files[0].size > 26214400) {
  //     this.toaster.warning('file size is more than 25 MB');
  //     return;
  //   }
  //   this.uploadImg = true;
  //   this.addPcDocument(output.target.files[0]);
  //   // if (output.target.files.length >= 1) {
  //   //   if (this.files.length > 0) {
  //   //     this.files.forEach(file => {
  //   //       if (file.name === output.target.files[0].name) return;
  //   //     });
  //   //   }
  //   //   this.files = [...this.files, ...output.target.files[0]];

  //   //   // this.imageFileExtension = false;
  //   // }
  // }
  // getMeasureDataByCode(code: string, model: ModalDirective) {
  //   this.currentCode = code
  //   this.pcmModelLoading = true;
  //   if (model) {
  //     model.show();
  //   }
  //   this.subs.sink = this.pcmService
  //     .GetPCMeasureData(this.PatientId, code)
  //     .subscribe(
  //       (res: PcmMeasureDataObj) => {
  //         if (res) {
  //           if (res.lastDone) {
  //             res.lastDone = moment.utc(res.lastDone).local().format('YYYY-MM-DD');
  //           }
  //           if (res.nextDue) {res.nextDue = moment.utc(res.nextDue).local().format('YYYY-MM-DD');}
  //           this.pcmMOdelData = res;
  //           this.tempStatusList = this.pcmMOdelData.statusList;
  //           this.selectedGapStatus = this.tempStatusList.find(status => status.value === this.pcmMOdelData.currentStatus);
  //           console.log(this.selectedGapStatus);
  //           this.whoIsCovered = this.sanatizer.bypassSecurityTrustHtml(
  //             this.pcmMOdelData.whoIsCovered
  //           );
  //         } else {
  //           this.pcmMOdelData = new PcmMeasureDataObj();
  //         }
  //         this.pcmModelLoading = false;
  //       },
  //       (err: HttpResError) => {
  //         if (model) {model.hide();}
  //         this.pcmModelLoading = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  // GetPatientsMeasuresSummary() {
  //   this.gettingGetPatientsMeasuresSummary = true;
  //   this.subs.sink = this.pcmService
  //     .GetPatientsMeasuresSummary(this.PatientId)
  //     .subscribe(
  //       (res: any) => {
  //         this.pcmMeasuresList = res;
  //         this.pcmMeasuresListGap = this.pcmMeasuresList.filter(x => x.isPayerGap);
  //         if (this.pcmMeasuresListGap.length > 0) {
  //           const arrLenth = this.pcmMeasuresListGap.length;
  //           this.ListGApWidth = (arrLenth % 2) === 0 ? arrLenth / 2 : ((arrLenth + 1) / 2);
  //         }
  //         this.pcmMeasuresListNotGap = this.pcmMeasuresList.filter(x => !x.isPayerGap);
  //         if (this.pcmMeasuresListNotGap.length > 0) {
  //           const arrLenth = this.pcmMeasuresListNotGap.length;
  //           this.ListGApNotWidth = (arrLenth % 2) === 0 ? arrLenth / 2 : ((arrLenth + 1) / 2);
  //         }
  //         const findPayerGap = this.pcmMeasuresList.find(x => x.isPayerGap === true) ;
  //         if (findPayerGap){
  //            this.hasPayerGap = true;
  //         }
  //         const findfacilityGap = this.pcmMeasuresList.find(x => x.isPayerGap !== true) ;
  //         if (findfacilityGap){
  //            this.hasFacilityGap = true;
  //         }
  //         this.gettingGetPatientsMeasuresSummary = false;
  //         // console.log(this.pcmMeasuresList.length);
  //       },
  //       (err: HttpResError) => {
  //         this.gettingGetPatientsMeasuresSummary = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  // addPcDocument(file: any) {
  //   this.uploadImg = true;
  //   let data = {
  //     title: file.name,
  //     code: this.selectedMeasure.code,
  //     patientId: this.PatientId
  //   };
  //   this.pcmService.addPcDocument(data).subscribe(
  //     (res: DocDataDto) => {
  //       this.docData = res;
  //       this.uploadPcmDocToS3(file);
  //     },
  //     (err: HttpResError) => {
  //       // this.editingPcmData = false;
  //       this.toaster.error(err.error, err.message);
  //     }
  //   );
  // }
  // async uploadPcmDocToS3(file) {
  //   // if (this.patientRpmConsentType === 1) {
  //   // this.rpmInputLoading = true;
  //   const path = `pcmDocs/preventiveCare-${this.PatientId}/${file.name}`;
  //   this.awsService.uploadUsingSdk(file, path).then(
  //     data => {
  //       this.uploadImg = false;
  //       const newFile = {
  //         id: this.docData.id,
  //         title: file.name
  //        };
  //         this.pcmMOdelData.pcmDocuments.push(newFile);
  //       // this.getMeasureDataByCode(this.currentCode ,null);
  //     },
  //     err => {
  //       this.uploadImg = false;
  //       this.pcmService.addPCDocumentOnError(this.docData).subscribe(res => {
  //         if (res) {
  //         }
  //       });
  //     }
  //   );
  //   // }
  // }
  // AddEditMeasureData(model: ModalDirective) {
  //   const data = new EditMeasureDataParams();
  //   data.id = this.pcmMOdelData.id;
  //   data.patientId = this.PatientId;
  //   data.code = this.selectedMeasure.code;
  //   data.lastDone = this.pcmMOdelData.lastDone;
  //   data.nextDue = this.pcmMOdelData.nextDue;
  //   data.result = this.pcmMOdelData.result;
  //   data.controlled = this.pcmMOdelData.controlled;
  //   data.note = this.pcmMOdelData.note;
  //   if (!this.pcmMOdelData.currentStatus) {
  //     this.pcmMOdelData.currentStatus = 0;
  //   }
  //   data.currentStatus = this.pcmMOdelData.currentStatus;
  //   this.editingPcmData = true;
  //   this.subs.sink = this.pcmService.AddEditMeasureData(data).subscribe(
  //     (res: any) => {
  //       this.editingPcmData = false;
  //       this.GetPatientsMeasuresSummary();
  //       this.toaster.success('Data updated successfully');
  //         model.hide();
  //     },
  //     (err: HttpResError) => {
  //       this.editingPcmData = false;
  //       this.toaster.error(err.error, err.message);
  //     }
  //   );
  // }
  // DeleteDoc(doc: any) {
  //   this.pcmService.deletePCDocument(doc.id).subscribe(res => {
  //     this.pcmMOdelData.pcmDocuments = this.pcmMOdelData.pcmDocuments.filter(myfile => myfile.id !== doc.id);
  //     this.toaster.success('Deleted successfully');
  //   },
  //   (err: HttpResError) => {
  //     this.editingPcmData = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  //   viewDoc(doc: any) {
  // // doc.path
  //   // const importantStuff = window.open("", "_blank");
  //   let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  //   nUrl =  environment.appUrl;
  //   nUrl = nUrl + 'success/loading';
  //   const importantStuff = window.open(nUrl);
  //   this.subs.sink = this.pcmService.getPublicPath(doc.path).subscribe(
  //     (res: any) => {
  //       this.isLoading = false;
  //       // // importantStuff.location.href = res;
  //       // var win = window.open(res, '_blank');
  //       // // win.opener = null;
  //       // win.focus();
  //       if (doc.path && doc.path.toLocaleLowerCase().includes('.pdf')) {
  //         fetch(res).then(async (fdata: any) => {
  //           const slknasl = await fdata.blob();
  //           const blob = new Blob([slknasl], { type: 'application/pdf' });
  //           const objectURL = URL.createObjectURL(blob);

  //           importantStuff.close();
  //           this.objectURLStrAW = objectURL;
  //           this.viewPdfModal.show();
  //           // importantStuff.location.href = objectURL;
  //           // window.open(objectURL, '_blank');
  //         });
  //       } else {
  //         // window.open(res, "_blank");
  //         importantStuff.location.href = res;
  //         // setTimeout(() => {
  //         //   importantStuff.close();
  //         // }, 2000);
  //       }
  //     },
  //     err => {
  //       this.isLoading = false;
  //       // this.preLoader = 0;
  //       this.toaster.error(err.error, err.message);
  //     }
  //   );
  //   }
  // AddScreening() {
  //   if (this.selectedMeasure.code === 'AM') {
  //     this.AddAMScreening();
  //   } else if (this.selectedMeasure.code === 'DP') {
  //     this.AddDepressionScreening();
  //   }
  // }
  // AddCounselling() {
  //   if (this.selectedMeasure.code === 'AM') {
  //     this.AddAlcoholCounselling();
  //   } else if (this.selectedMeasure.code === 'DP') {
  //     this.AddDepressionCounselling();
  //   }
  // }
  // AddDepressionCounselling() {
  //   this.isCreatingCounselling = true;
  //   this.pcmService.AddDepressionCounseling(this.PatientId).subscribe((res: any) => {
  //     this.isCreatingCounselling = false;
  //     this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingCounselling = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddAlcoholCounselling() {
  //   this.isCreatingCounselling = true;
  //   this.pcmService.AddAMCounseling(this.PatientId).subscribe((res: any) => {
  //     this.isCreatingCounselling = false;
  //     this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholCounselling/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingCounselling = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddDepressionScreening() {
  //   this.isCreatingScreening = true;
  //   this.pcmService.AddDPScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
  //     this.isCreatingScreening = false;
  //     this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionScreening/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingScreening = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddAMScreening() {
  //   this.isCreatingScreening = true;
  //   this.pcmService.AddAMScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
  //     this.isCreatingScreening = false;
  //     this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholScreening/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingScreening = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddAWEncounter() {
  //   this.isCreatingAWEncounter = true;
  //   this.awService.AddAWEncounter(this.PatientId).subscribe((res: number) => {
  //     this.isCreatingAWEncounter = false;
  //     this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${res}/awPatient`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingAWEncounter = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  popoverToggle(popover) {
    if (popover) {
      popover.toggle();
    }
  }
}
