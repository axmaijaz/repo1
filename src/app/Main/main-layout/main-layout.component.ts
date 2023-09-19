import { SpeechToTextService } from "./../../core/Tools/speech-to-text.service";
import { TwoCTextAreaComponent } from "./../../utility/two-c-text-area/two-c-text-area.component";
import { S3RecordingService } from "./../../core/aws/s3-recording.service";
import { DayName } from "./../../Enums/rpm.enum";
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  ContentChild,
  AfterViewInit,
} from "@angular/core";
import { HubSateEnum } from '../../model/chat/chat.model';

import { SecurityService } from "src/app/core/security/security.service";
import {
  AppUserAuth,
  ChnagePasswordDto,
} from "src/app/model/security/app-user.auth";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientsService } from "src/app/core/Patient/patients.service";
import {
  PatientNoteDataStorageDto,
  PatientNoteDto,
} from "src/app/model/Patient/patient.model";
import {
  ToastService,
  ModalDirective,
  UploadFile,
  UploadOutput,
} from "ng-uikit-pro-standard";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { ToDoNoteDto, AddToDoNoteDto } from "src/app/model/todos.model";
import {
  EventBusService,
  EventTypes,
  EmitEvent,
} from "src/app/core/event-bus.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserType } from "src/app/Enums/UserType.enum";
import { PubnubChatService } from "src/app/core/pubnub-chat.service";
import {
  AppNotification,
  MsgNotification,
} from "src/app/model/chat/chat.model";
import { AppUiService } from "src/app/core/app-ui.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import {
  FacilityDto,
  CreateFacilityUserDto,
  FeedbackDto,
  SetFacilityServiceConfigDto,
} from "src/app/model/Facility/facility.model";
import { StatementManagementService } from "src/app/core/statement-management.service";
import { VideoCallingService } from "src/app/core/video-calling.service";
import { Location } from "@angular/common";
import { HttpResError } from "src/app/model/common/http-response-error";
import * as moment from "moment";
import { LazyLoaderService } from "src/app/core/Lazy/lazy-loader.service";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { PatientTackService } from "src/app/core/Patient/patient-tack.service";
import { SubSink } from "src/app/SubSink";
import { PatientTaskDto } from "src/app/model/Patient/patient-Task.model";
import { UserManagerService } from "src/app/core/UserManager/user-manager.service";
import { CcmEncounterListDto } from "src/app/model/admin/ccm.model";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { CcmServiceType } from "src/app/model/Questionnaire/Questionnire.model";
import { QuestionnaireService } from "src/app/core/questionnaire.service";
import { PatientsListComponent } from "src/app/home/patients-list/patients-list.component";
import { FeedbackService } from "src/app/core/feedback.service";
import { AppDataService } from "src/app/core/app-data.service";
import { MessagingComponent } from "src/app/user-chat/messaging/messaging.component";
import { environment } from "src/environments/environment";
import { DataStorageService } from "src/app/core/data-storage.service";
import { DataStorage } from "src/app/model/data-storage/data-storage.model";
import { DataStorageType } from "src/app/Enums/data-storage.enum";
import { DataFilterService } from "src/app/core/data-filter.service";
import { TriggerIntellisenseWidgetDTO } from "src/app/model/Tools/intellisense.model";
import { PublishDownloadLogsProgressModel } from "src/app/model/socket.model";
import { BrandingService } from "src/app/core/branding.service";
import { AppAnnouncementService } from "src/app/core/app-announcement.service";
import { AthenaClaimDocResponseDto } from "src/app/model/EmrConnect/emr-connect.model";
import { LaunchModeEnum } from "src/app/model/AppData.model";
import { PatinetCommunicationGroup } from "src/app/model/PatientEngagement/communication.model";
import { CommunicationDetailComponent } from "src/app/patient-communication/communication-detail/communication-detail.component";
import { RpmQuickEncounterComponent } from "src/app/patient-shared/rpm-quick-encounter/rpm-quick-encounter.component";
import { CcmQuickEncounterComponent } from './../../patient-shared/ccm-quick-encounter/ccm-quick-encounter.component';
import { PatientDto } from './../../model/Patient/patient.model';
import { BulkCommunicationService } from "src/app/communication/bulk-communication.service";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
  providers: [PatientsListComponent],
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  // @ViewChild(PatientsListComponent) child:PatientsListComponent;
  //   @ContentChild (PatientsListComponent)
  // private childComponent: PatientsListComponent;
  numbered = 60;
  todoDto = new AddToDoNoteDto();
  activeNotificationFilter = {
    ccm: "New",
    rpm: "New",
    todo: "New",
  };

  @ViewChild('detailCompRef') detailCompRef: CommunicationDetailComponent;
  @ViewChild("addRPmEncounterRef") addRPmEncounterRef: RpmQuickEncounterComponent;
  @ViewChild("addCCmEncounterRef") addCCmEncounterRef: CcmQuickEncounterComponent;
  @ViewChild("clinicalSummary") clinicalSummary: ModalDirective;
  @ViewChild("patientNoteModal") patientNoteModal: ModalDirective;
  @ViewChild("ccmStatusModal") ccmStatusModal: ModalDirective;
  @ViewChild("lazyConfirmContainer", { read: ViewContainerRef })
  lazyConfirmContainer: ViewContainerRef;
  @ViewChild("addEncounterModal") addEncounterModal: ModalDirective;
  @ViewChild("feedbackModal") feedbackModal: ModalDirective;
  @ViewChild("unApprovedCarePLanModal") unApprovedCarePLanModal: ModalDirective;
  // @ViewChild("messagingCOmp") messagingCOmpRef: MessagingComponent;
  @ViewChild("myFIeldRef") myFIeldRef: TwoCTextAreaComponent;
  public sidenavScrolls = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 0,
    scrollbarPosition: "inside",
    scrollButtons: { enable: false },
    autoHideScrollbar: true,
  };
  // @ViewChild("ccmStatusModal") ccmStatusModal: ModalDirective;
  micState = false;
  todoListDto = new Array<ToDoNoteDto>();
  private subs = new SubSink();
  CareProvidersList = new Array<CreateFacilityUserDto>();
  securityObject: AppUserAuth = null;
  PatientId: number;
  SummaryText = "";
  dateTime: any;
  showAll = false;
  notificationaudio = new Audio();
  nameCaption: string;
  sideCollapse = false;
  @ViewChild("patientTaskViewModal") patientTaskViewModal: ModalDirective;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  hide: boolean = true;
  changePasswordForm: FormGroup;
  patientTaskData = new PatientTaskDto();
  facilityName: string;
  appNotifyList = new Array<AppNotification>();
  rpmNotifyList = new Array<AppNotification>();
  toDoNotifyList = new Array<AppNotification>();
  messageNotifyList = new Array<MsgNotification>();
  facilityList = new Array<FacilityDto>();
  facilityId: number;
  serviceTypes = new Array<CcmServiceType>();
  OrganizationId: number;
  switchFacilityId: number;
  searchingNotification: boolean;
  rpmNotificationLength = 0;
  ccmNotificationLength = 0;
  rpmFilter = "";
  ccmFilter = "";
  facilityUserId: number;
  patientTasksList: any[];
  connectionState: HubSateEnum;
  hubSateEnum = HubSateEnum;
  colorForConnectionState = '';

  ccmEncounterListDto = {
    id: 0,
    startTime: "",
    endTime: "",
    ccmServiceTypeId: 0,
    careProviderId: 0,
    patientId: 0,
    appAdminId: 0,
    duration: 0,
    encounterDate: "",
    note: "",
  };
  selectedPatient: any;
  myduration: moment.Moment;
  showAlertFEncounter: boolean;
  taskIsLoading: boolean;
  profileStatus: any;

  appUserName = "";
  anonymous: boolean;
  feedbackDto = new FeedbackDto();
  file = new Array<File>();
  dataStorageDto = new DataStorage();
  patientNoteDataStorageDto = new PatientNoteDataStorageDto();
  isFacilityChatEnabled: boolean;
  // file: any;

  // files: UploadFile[];
  // dragOver: boolean;

  patientNote = new PatientNoteDto();
  showAnalyticLayout = false;
  twoFactorEnabled: string;
  presPatientNotesObj = {
    count: 0,
    patientName: "",
    notes: new Array<PatientNoteDto>(),
  };
  public recordingService: S3RecordingService;
  typedElement: any;
  selectionAnchorOffset: number;
  activeDownloadsList = new Array<PublishDownloadLogsProgressModel>();
  claimProgressList: { key: string, value: AthenaClaimDocResponseDto[]}[] = [];
  // claimProgressList: { key: string; value: any[]; }[];
  selectedAnnouncementIndex: number;
  announcementText:any;
  facilitySearch = new Array<FacilityDto>();
  filterfacility: any[];
  filterfacilitymain: any;
  tempFacilityList: any;

  selectedGroup: PatinetCommunicationGroup;
  chatExpand = false;
  reviewNote: string;

  constructor(
    public brandingService: BrandingService,
    private patientService: PatientsService,
    private facilityService: FacilityService,
    private bulkCommService: BulkCommunicationService,
    public securityService: SecurityService,
    private chatService: PubnubChatService,
    private _recordingService: S3RecordingService,
    private videoService: VideoCallingService,
    private route: ActivatedRoute,
    private toaster: ToastService,
    private chng: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    public eventBus: EventBusService,
    private fb: FormBuilder,
    public appUi: AppUiService,
    public appData: AppDataService,
    private lazyLoaderService: LazyLoaderService,
    private statemanagementService: StatementManagementService,
    private patientTaskService: PatientTackService,
    private userManagerService: UserManagerService,
    private ccmService: CcmDataService,
    private questionnaireService: QuestionnaireService,
    private feedbackService: FeedbackService,
    private dataStorageService: DataStorageService,
    private filterDataService: DataFilterService,
    private speechService: SpeechToTextService,
    private appAnnouncementService: AppAnnouncementService
  ) {
    this.securityObject = securityService.securityObject;
    this.recordingService = _recordingService;
    this.getNameCaption();
  }

  breadcrumb: string;
  isLoading = false;
  showPatientLayout = false;
  showAddnoteButton = false;
  noteText = "";
  patientNoteObj = {
    count: 0,
    patientName: "",
    notes: new Array<PatientNoteDto>(),
  };
  notesFilter = {
    ALL: true,
    CCM: false,
    RPM: false,
    BHI: false,
    OTHERS: false
  };
  public scrollbarOptions = {
    axis: "y",
    theme: "minimal-dark",
    scrollInertia: 0,
  };
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 0,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: "inside",
  };
  public notificationScroll = {
    axis: "yx",
    theme: "minimal",
    scrollInertia: 0,
    scrollbarPosition: "outside",
    autoHideScrollbar: true,
  };

  public sidenavScroll = {
    axis: "yx",
    theme: "minimal-dark",
    scrollInertia: 0,
    // scrollbarPosition: "inside",
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
  };

  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD hh:mm A",
  };
  public timePickerConfig1: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "HH:mm",
    // format: 'YYYY-MM-DD hh:mm A'
  };
  compactMode = true;
  ngOnInit() {
    this.WatchHubConnectionState();
    this.securityObject = this.securityService.securityObject;
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    this.getAllAppAnnouncement();
    this.getCareProviders();
    this.manageNotification();
    this.getNOtificationHistory();
    this.changePasswordForm = this.fb.group({
      // userId: ['', [Validators.required, Validators.email]],
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      verifyPassword: ["", Validators.required],
    });
    this.appUserName = this.securityObject.userName;
    this.feedbackDto.email = this.securityObject.userName;
    if (this.securityObject.userType === UserType.FacilityUser) {
      this.facilityUserId = this.securityObject.id;
      this.facilityName =
        this.securityService.getClaim("FacilityName").claimValue;
      this.manageFacilities();
    } else {
      this.facilityName = "";
    }
    this.getNavigationStatus();
    this.router.events.subscribe((event) => {
      this.getNavigationStatus();
      if (this.showAddnoteButton) {
        this.PatientId = +this.route.snapshot.paramMap.get("id");
        if (!this.PatientId) {
          // this.PatientId = +this.route.pathFromRoot[2].children[0].snapshot.paramMap.get('id');
          this.PatientId =
            +this.route.snapshot.children[0].firstChild.paramMap.get("id");
        }
      }
    });
    if (this.showAddnoteButton) {
      this.PatientId = +this.route.snapshot.paramMap.get("id");
      if (!this.PatientId) {
        // this.PatientId = +this.route.pathFromRoot[2].children[0].snapshot.paramMap.get('id');
        this.PatientId =
          +this.route.snapshot.children[0].firstChild.paramMap.get("id");
      }
    }
    if (this.PatientId) {
      this.getNotesList();
      this.getClinicalSummary();
    }
    this.getTodoList();
    this.eventBus.on(EventTypes.OpenClinicalSummary).subscribe((res) => {
      this.clinicalSummary.config = {
        backdrop: false,
        ignoreBackdropClick: true,
      };
      this.clinicalSummary.show();
    });
    this.eventBus.on(EventTypes.RemoveChatNotif).subscribe((res) => {
      if (this.messageNotifyList.length > 0) {
        const tempArr = [];
        Object.assign(tempArr, this.messageNotifyList);
        tempArr.forEach((mNot, index) => {
          if (mNot.chatGroupId === res) {
            this.messageNotifyList.splice(
              this.messageNotifyList.indexOf(mNot),
              1
            );
          }
        });
      }
    });
    // this.eventBus.on(EventTypes.PhraseSelectedEvent).subscribe((res) => {
    //   this.FillSelectedPhraseText(res);
    // });

    this.eventBus
      .on(EventTypes.OnGoingDowloadsProgress)
      .subscribe((res: PublishDownloadLogsProgressModel) => {
        this.handleActiveDowloads(res);
      });
    this.eventBus
      .on(EventTypes.OnUploadClaimDocProgress)
      .subscribe((res: AthenaClaimDocResponseDto[]) => {
        this.handleCLaimProgressUpload(res);
      });

    this.eventBus.on(EventTypes.OpenPatientNote).subscribe((res) => {
      this.PatientId = res;
      this.getNewObj();
      this.patientNoteModal.config = {
        backdrop: false,
        // ignoreBackdropClick: true,
      };
      this.notesFilter.ALL = false;
      this.onOpenPatientNoteModal();
      this.patientNoteModal.show();
      this.getNotesList();
    });
    this.handleModalOpening();
    this.chatService
      .getMessageNotificationHistory(this.securityObject.appUserId)
      .subscribe((hstry: Array<any>) => {
        // console.table(hstry);
        if (hstry) {
          hstry.forEach((h) => {
            let chathtry = new MsgNotification();
            chathtry = h;
            chathtry.count = h.count;
            this.messageNotifyList.push(chathtry);
          });
        }
      });
    this.chatService.MessageNotifySubject.asObservable().subscribe(
      (msg: MsgNotification) => {
        if (!this.router.url.includes("messages")) {
          const find = true;
          /// Warning Not to delete . Must complete
          /* for (let i = 0; i < this.messageNotifyList.length; i++) {
          if (this.messageNotifyList[i].senderEmail === msg.senderEmail) {
            this.messageNotifyList[i].count =
              this.messageNotifyList[i].count + 1;
            find = false;
          }
        }
        if (find) {
          const newnotyfi = new MsgNotification();
          newnotyfi.senderEmail = msg.senderEmail;
          newnotyfi.count = 1;
          this.messageNotifyList.push(newnotyfi);
        } */ let newnotyfi = new MsgNotification();
          newnotyfi = msg;
          newnotyfi.count = 1;
          // console.table(msg);
          this.notificationaudio.muted = false;
          this.notificationaudio.play();
          if (this.appUi.chatShown) {
            return;
          }
          this.messageNotifyList.push(newnotyfi);
        }
      }
    );
    this.getCcmServicesType();
    this.GetUserAuthDetails();
    // this.isFacilityChatEnabled = JSON.parse(localStorage.getItem('isChatEnabled'));
    this.checkFacilityChatService();
  }
  ngAfterViewInit(): void {
    this.checkForPageLoadActions();
  }
  handleModalOpening() {
    this.eventBus.on(EventTypes.OpenCommunicationModal).subscribe((res: null | PatinetCommunicationGroup) => {
      if (res) {
        this.appUi.chatShown = true;
        this.selectedGroupChanged(res)
      }
    })
  }
  async checkForPageLoadActions() {
    if(this.appUi.pageLoadActions?.includes('QuickNote')) {
      const patientId = this.appUi.pageLoadActions?.split('VV')[1];
      const event = new EmitEvent();
      event.name = EventTypes.OpenPatientNote;
      event.value = +patientId;
      this.eventBus.emit(event);
    }
    if(this.appUi.pageLoadActions?.includes('ComplaintModal')) {
      const patientId = this.appUi.pageLoadActions?.split('VV')[1];
      const event = new EmitEvent();
      event.name = EventTypes.openComplaintsModal;
      await this.appData.getPatientById(+patientId)
      event.value = this.appData.summeryViewPatient;
      // event.value = data;
      this.eventBus.emit(event);
    }
    if(this.appUi.pageLoadActions?.includes('ChatWindow')) {
      this.openChatModal();
      this.loadCallingComponent()
    }
  }
  checkFacilityChatService() {
    if (this.securityService.securityObject.userType == UserType.AppAdmin) {
      this.isFacilityChatEnabled = false;
      return;
    }
    if (this.facilityId) {
      this.facilityService.GetFacilityServiceConfig(this.facilityId).subscribe(
        (res: SetFacilityServiceConfigDto) => {
          this.isFacilityChatEnabled = res?.chatService || res?.telephonyCommunication;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
    }
  }
  manageFacilities() {
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    this.OrganizationId =
      +this.securityService.getClaim("OrganizationId").claimValue;
    if (this.OrganizationId) {
      this.getFaciliesDetailsByUserId();
    }
    if (this.facilityId) {
      this.switchFacilityId = this.facilityId;
    }
  }
  removeEmail() {
    if (this.anonymous) {
      this.feedbackDto.email = "";
    } else {
      this.feedbackDto.email = this.appUserName;
    }
  }

  feedbacks() {
    this.isLoading = true;
    this.feedbackDto.facilityId = this.facilityId;
    this.feedbackService.feedbacks(this.feedbackDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.file = [];
        this.feedbackDto = new FeedbackDto();
        this.feedbackModal.hide();
        this.toaster.success("Thanks for your feedback");
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }
  resetFeedBackForm() {
    this.file = [];
    this.feedbackDto = new FeedbackDto();
    this.feedbackDto.email = this.securityObject.userName;
  }
  getFaciliesDetailsByUserId() {
    this.isLoading = true;
    this.facilityService
      .getFaciliesDetailsByUserId(this.securityService.securityObject.id)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res) {
            res.sort((a, b) => a.facilityName.localeCompare(b.facilityName));
            this.facilityList = res;
            this.tempFacilityList = res;
          }
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          this.isLoading = false;
        }
      );
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempFacilityList.filter(function (d) {
      return d.facilityName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.facilityList = temp;
  }

  switchFacility() {
    this.isLoading = true;
    this.appUi.showAppLoader();
    const data = {
      facilityUserId: this.securityService.securityObject.id,
      facilityId: this.switchFacilityId,
    };
    this.facilityService.SwitchFacility(data).subscribe(
      (res: any) => {
        if (res) {
          this.securityService.updateToken(res);
          if (this.router.url.includes("home/page")) {
            window.location.reload();
          } else {
            this.router.navigateByUrl("home/page").then(() => {
              window.location.reload();
            });
          }
          this.isLoading = false;
          // this.router.navigateByUrl("/", { skipLocationChange: true });
          // this.router.navigate([decodeURI(this.location.path())]);
          // this.appUi.hideAppLoader();
        }
      },
      (err: HttpResError) => {
        this.appUi.hideAppLoader();
        this.isLoading = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  getNameCaption() {
    const fullName = this.securityObject.fullName.split(" ");
    if (fullName.length === 2) {
      this.nameCaption = fullName[0].slice(0, 1) + fullName[1].slice(0, 1);
    } else {
      this.nameCaption = fullName[0].slice(0, 2);
    }
  }
  getNavigationStatus() {
    if (
      this.route.snapshot.children &&
      this.route.snapshot.children.length > 0 &&
      this.route.snapshot.children[0].firstChild
    ) {
      this.showPatientLayout =
        this.route.snapshot.children[0].firstChild.data["showPatientLayout"];
      // this.showAnalyticLayout = this.route.snapshot.children[0].firstChild.data[
      //   'showAnalyticLayout'
      // ];
      this.showAddnoteButton = this.showPatientLayout;
    } else {
      this.PatientId = 0;
      // this.showAnalyticLayout = false;
      this.showPatientLayout = false;
      this.showAddnoteButton = false;
    }
    this.appData.isPatientLayout = this.showPatientLayout;
  }
  logout() {
    this.router.navigateByUrl("/login", {
      queryParams: { reason: "Logged out" },
    });
    this.securityService.logout();
    this.securityObject = this.securityService.securityObject;
  }

  addNote() {
    if (this.PatientId) {
      // this.patientNote = new PatientNoteDto();
      // this.patientNote.note = this.noteText;
      if (!this.patientNote.id) {
        this.patientNote.dateCreated = new Date();
        this.patientNote.patientId = this.PatientId;
        this.patientNote.facilityUserId = this.securityObject.id;
      }
      if (this.patientNote["dateCreatedDisplay"]) {
        delete this.patientNote["dateCreatedDisplay"];
      }
      this.isLoading = true;
      this.patientService.addUpdatePatientNote(this.patientNote).subscribe(
        (res: any) => {
          this.patientNote = new PatientNoteDto();
          this.getNotesList();
          //  this.getNOtificationHistory();
          this.noteText = "";
          this.isLoading = false;
          this.toaster.success("Note Added Successfully");
          this.FillNoteText("");
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
    }
  }
  fillEditFields(row: PatientNoteDto) {
    Object.assign(this.patientNote, row);
    // this.patientNote = row;
    this.FillNoteText(this.patientNote.note);
  }
  checkNote() {
    this.patientNoteModal.hide();
    this.patientNote.note = "";
  }
  rejectAlert = () => {
    this.patientNoteModal.show();
  };
  noteValueConfirmModal() {
    this.patientNoteModal.hide();
    // if (this.patientNote.note) {
    //   const modalDto = new LazyModalDto();
    //   modalDto.Title = 'Alert';
    //   modalDto.Text = 'Are you sure to discard your note';
    //   modalDto.callBack = this.callBack;
    //   modalDto.rejectCallBack = this.rejectAlert;
    //   this.appUi.openLazyConfrimModal(modalDto);
    // } else {
    //   this.patientNoteModal.hide();
    // }
  }
  callBack = (data: any) => {
    this.checkNote();
  };
  openDeleteNoteConfirmModal(data: PatientNoteDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Note";
    modalDto.Text = "Do you want to delete this record ?";
    // modalDto.hideProceed = true;
    modalDto.callBack = this.DeletePatientNote;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeletePatientNote = (item: PatientNoteDto) => {
    this.subs.sink = this.patientService.DeletePatientNote(item.id).subscribe(
      (res: any) => {
        if (this.patientNote.id === item.id) {
          this.resetNoteObj();
        }
        this.patientNoteObj.notes = this.patientNoteObj.notes.filter(
          (row) => row.id !== item.id
        );
        this.toaster.success("Record deleted successfully.");
      },
      (error: HttpResError) => {
        item["deleting"] = false;
        this.toaster.error(error.error, error.message);
      }
    );
  };
  EditPatientReviewNote = () => {
    this.subs.sink = this.bulkCommService.EditPatientReviewNote(this.PatientId, this.reviewNote).subscribe(
      (res: any) => {

      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  };
  GetPatientReviewNote = () => {
    this.reviewNote = ''
    this.subs.sink = this.bulkCommService.GetPatientReviewNote(this.PatientId).subscribe(
      (res: any) => {
        this.reviewNote = res
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  };
  resetNoteObj() {
    this.patientNote = new PatientNoteDto();
  }
  getNotesList() {
    if (this.PatientId) {
      this.GetPatientReviewNote()
      this.isLoading = true;
      // this.patientNote = new PatientNoteDto();
      this.patientService.getPatientNotesLIst(this.PatientId).subscribe(
        (res: any) => {
          res.notes.forEach((data) => {
            data["dateCreatedDisplay"] = moment
              .utc(data.dateCreated)
              .local()
              .format("DD-MMM-YYYY, h:mm a");
            if (data.note) {
              data["noteFormat"] = data.note.replace(/\n/g, "<br>\n");
            }
          });
          this.patientNoteObj.notes = res.notes;
          this.patientNoteObj.patientName = res.patientName;
          this.patientNoteObj.count = res.count;
          Object.assign(this.presPatientNotesObj, this.patientNoteObj);
          this.NotesFilterChanged("ALL");
          // this.presPatientNotesObj = this.patientNoteObj;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }
  getNewObj() {
    this.patientNoteObj.notes = new Array<PatientNoteDto>();
  }
  getClinicalSummary() {
    if (this.PatientId) {
      this.isLoading = true;
      this.patientService.getClinicalSummary(this.PatientId).subscribe(
        (res: any) => {
          this.SummaryText = res;
          this.isLoading = false;
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }
  GetUserAuthDetails() {
    this.securityService
      .GetUserAuthDetails(this.securityObject.appUserId)
      .subscribe(
        (res: any) => {
          if (res.twoFactorEnabled) {
            this.twoFactorEnabled = "Yes";
          } else {
            this.twoFactorEnabled = "No";
          }
          this.appData.TwoFactorEnabled = this.twoFactorEnabled;
        },
        (err) => {
          // this.isLoading = false;
          this.toaster.error(err.error);
        }
      );
  }
  addSummary() {
    if (this.PatientId) {
      this.patientService
        .addUpdateClinicalSummary(this.SummaryText, this.PatientId)
        .subscribe(
          (res: any) => {
            this.getNotesList();
            this.isLoading = false;
            this.toaster.success("Clinical Summary Update Successfully");
          },
          (err: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }

  openChat(item: MsgNotification) {
    // this.messageNotifyList.splice(this.messageNotifyList.indexOf(item), 1);
    this.messageNotifyList = this.messageNotifyList.filter(
      (x) => x.senderEmail !== item.senderEmail
    );
    this.router.navigateByUrl(`/chat/messages?userName=${item.senderEmail}`);
  }
  addTodo() {
    this.isLoading = true;
    this.todoDto.userId = this.securityObject.appUserId;
    const dateNow = new Date();
    // if(dateNow) {
    //   dateNow.slice(0, 24);
    // }
    // this.todoDto.dateCreated = dateNow;
    this.todoDto.dateCreated =
      dateNow.getFullYear() +
      "-" +
      (dateNow.getMonth() + 1) +
      "-" +
      dateNow.getDate() +
      " " +
      dateNow.getHours() +
      ":" +
      dateNow.getMinutes() +
      ":" +
      dateNow.getSeconds();
    if (this.PatientId) {
      this.todoDto.patientId = this.PatientId;
    }
    this.patientService.addEditTodo(this.todoDto).subscribe(
      (res: any) => {
        this.todoDto = new AddToDoNoteDto();
        this.getTodoList();
        this.getNOtificationHistory();
        this.isLoading = false;
        this.toaster.success("data added Successfully");
      },
      (err) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }

  getTodoList() {
    this.isLoading = true;
    this.todoListDto = [];
    this.patientService
      .getTodoListByUser(this.securityObject.appUserId)
      .subscribe(
        (res: any) => {
          const tempArr = [];
          res.forEach((data) => {
            data.dateCreated = moment
              .utc(data.dateCreated)
              .local()
              .format("MMM DD, h:mm:ss a");
            tempArr.push(data);
          });
          this.todoListDto = tempArr;
          this.isLoading = false;
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }

  changePassword() {
    const cahangePasswordObj = new ChnagePasswordDto();
    cahangePasswordObj.oldPassword =
      this.changePasswordForm.get("oldPassword").value;
    cahangePasswordObj.newPassword =
      this.changePasswordForm.get("newPassword").value;
    cahangePasswordObj.userId = this.securityObject.appUserId;
    this.securityService.changePassword(cahangePasswordObj).subscribe(
      (res: any) => {
        this.changePasswordForm.reset();
        this.toaster.success("Password Updated Successfully");
      },
      (err: any) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }

  openAlertModal() {
    const event = new EmitEvent();
    event.name = EventTypes.patientAlertModal;
    event.value = "patientAlertModal";
    this.eventBus.emit(event);
  }
  manageNotification() {
    this.notificationaudio.src = "../../../assets/sounds/notification.MP3";
    this.notificationaudio.load();
    this.notificationaudio.muted = true;
    this.chatService.AppNotification.asObservable().subscribe(
      (appNotify: AppNotification) => {
        appNotify.timeStamp = moment().format("MMM DD,\\ h:mm a");
        if (appNotify.notificationType === "CCM") {
          this.appNotifyList.push(appNotify);
        }
        if (appNotify.notificationType === "RPM") {
          this.rpmNotifyList.push(appNotify);
        }
        if (appNotify.notificationType === "ToDo") {
          this.toDoNotifyList.push(appNotify);
        }
        // let find = true;
        // for (let i = 0; i < this.appNotifyList.length; i++) {
        //   if (
        //     this.appNotifyList[i].entityId === appNotify.entityId &&
        //     this.appNotifyList[i].notificationType ===
        //       appNotify.notificationType
        //   ) {
        //     this.appNotifyList[i].count = this.appNotifyList[i].count + 1;
        //     find = false;
        //   }
        // }
        // if (find) {
        //   let newAppnotyfi = new AppNotification();
        //   newAppnotyfi = appNotify;
        //   newAppnotyfi.count = 1;
        //   this.appNotifyList.push(newAppnotyfi);
        // }
        // console.table(appNotify);
        this.notificationaudio.muted = false;
        this.notificationaudio.play();
        // this.flterAppNotifications();
      }
    );
  }
  navigateHome() {
    if (this.securityService.securityObject.isAuthenticated) {
      if (this.securityService.securityObject.userType === UserType.AppAdmin) {
        this.router.navigateByUrl("/dashboard");
      } else if (
        this.securityService.securityObject.userType === UserType.Patient
      ) {
        this.router.navigateByUrl("/patient/profile");
      } else if (
        this.securityService.securityObject.userType === UserType.FacilityUser
      ) {
        this.router.navigateByUrl("/home");
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }
  OpenNotification(notify: AppNotification) {
    if (notify.linkUrl) {
      this.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then((value) => {
          this.router.navigateByUrl(notify.linkUrl);
          // this.router.navigateByUrl(`/rpm/PatientRpm/${notify.entityId}`);
        });
    } else if (notify.module === "RPM") {
      // console.table(notify);
      this.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then((value) => {
          this.router.navigateByUrl(`/rpm/PatientRpm/${notify.entityId}`);
        });
    }
    this.markNOtificationRead(notify);
  }
  getNOtificationHistory() {
    this.chatService
      .getNotificationHistory(this.securityObject.userName, "", "new")
      .subscribe(
        (res: any) => {
          res.filter((data) => {
            data.timeStamp = moment
              .utc(data.timeStamp)
              .local()
              .format("MMM DD,\\ h:mm a");
            this.appNotifyList.push(data);
          });
          // this.appNotifyList = res;
          this.flterAppNotifications();
          // this.toaster.success('Password Updated Successfully');
        },
        (err: any) => {
          // this.toaster.error('Error Loading Notifications');
        }
      );
  }
  searchAppNotifications(type: string, filter: string) {
    this.searchingNotification = true;
    this.chatService
      .getNotificationHistory(this.securityObject.userName, type, filter)
      .subscribe(
        (res: any) => {
          this.appNotifyList = new Array<AppNotification>();
          res.forEach((data) => {
            data.timeStamp = moment
              .utc(data.timeStamp)
              .local()
              .format("MMM DD,\\ h:mm a");
            // res.push(data);
          });
          this.searchingNotification = false;
          if (type === "RPM") {
            this.rpmNotifyList = res;
            this.rpmFilter = filter;
            if (filter === "New") {
              this.rpmNotificationLength = this.rpmNotifyList.length;
            }
          } else if (type === "ToDo") {
            this.toDoNotifyList = res;
          } else if (type === "CCM") {
            this.appNotifyList = res;
            this.ccmFilter = filter;
            if (filter === "New") {
              this.ccmNotificationLength = this.appNotifyList.length;
            }
          }

          // this.appNotifyList = res;
          // this.flterAppNotifications();
          // this.toaster.success('Password Updated Successfully');
        },
        (err: any) => {
          this.searchingNotification = false;
          // this.toaster.error('Error Loading Notifications');
        }
      );
  }
  flterAppNotifications() {
    if (this.appNotifyList.length > 0) {
      this.rpmNotifyList = this.appNotifyList.filter(
        (x) => x.module && x.module === "RPM"
      );
      this.appNotifyList = this.appNotifyList.filter(
        (x) => x.module && x.module !== "RPM"
      );
      this.toDoNotifyList = this.appNotifyList.filter(
        (x) => x.module && x.module === "ToDo"
      );
      this.appNotifyList = this.appNotifyList.filter(
        (x) => x.module && x.module !== "ToDo"
      );
    }
  }
  markNOtificationRead(notify: AppNotification) {
    this.chatService
      .markNotificationAsRead(
        this.securityObject.userName,
        notify.notificationType,
        notify.id
      )
      .subscribe(
        (res: any) => {
          // const index = this.appNotifyList.findIndex(x => x.id === notify.id);
          // this.appNotifyList = this.appNotifyList.splice(index, 1);
          if (notify.module === "RPM") {
            this.rpmNotifyList = this.rpmNotifyList.filter(
              (x) => x.id !== notify.id
            );
          } else if (notify.module === "ToDo") {
            this.toDoNotifyList = this.toDoNotifyList.filter(
              (x) => x.id !== notify.id
            );
          } else {
            this.appNotifyList = this.appNotifyList.filter(
              (x) => x.id !== notify.id
            );
          }
        },
        (err: any) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  refrestNgx() {
    this.appUi.showAppSideNav();
  }
  ApplyLockScreen() {
    const event = new EmitEvent();
    event.name = EventTypes.ScreenLocked;
    localStorage.setItem("screenLocked", "true");
    event.value = null;
    this.eventBus.emit(event);
  }
  profile() {
    if (this.securityObject.userType === UserType.Patient) {
      this.router.navigateByUrl("patient/profile");
    }
    if (this.securityObject.userType === UserType.FacilityUser) {
      this.router.navigateByUrl("user/info");
    }
  }
  loadCallingComponent() {
    if (!this.videoService.isCallingComponentLoaded) {
      this.videoService.loadCallingComponent();
    }
  }
  getvalue(name, prop) {
    if (name) {
      const obj = JSON.parse(name);
      return obj[prop];
    } else {
      return "";
    }
  }
  // loadModule() {
  // this.lazyLoaderService.loadModule("patentTask").then((res) => {
  //   this.appUi.isPatientTaskModuleLoaded = true;
  // });
  // ReadyToLoadConfirmation() {
  //   this.appUi.patientTasklazyConfirmationSubject.subscribe((val: boolean) => {
  //     this.loadConfirmation();
  //   });
  // }
  async loadConfirmation() {
    // this.lazyConfirmContainer.clear();
    if (!this.appUi.isPatientTaskModuleLoaded) {
      const res = await this.lazyLoaderService
        .loadModule("patentTask")
        .then(() => {
          this.appUi.isPatientTaskModuleLoaded = true;
          this.appUi.showPatientTaskSubject.next(true);
          // console.log('load module');
        });
      // return true;
    } else {
      this.appUi.showPatientTaskSubject.next(true);
    }
  }
  getCareProviders() {
    this.subs.sink = this.userManagerService.getGetCareProviderList().subscribe(
      (res: any) => {
        if (res) {
          this.CareProvidersList = res;
        }
      },
      (error) => {}
    );
  }
  getPatientTasksList() {
    this.patientTaskViewModal.show();
    this.taskIsLoading = true;
    this.subs.sink = this.patientTaskService
      .GetPatientTasksList(this.showAll, this.facilityId)
      .subscribe(
        (res: any[]) => {
          this.patientTasksList = res;
          this.taskIsLoading = false;
          this.patientTasksList.forEach((task) => {
            // task.patient.
            if (task.patient.primaryPhoneNumber) {
              task.patient.primaryPhoneNumber =
                task.patient.primaryPhoneNumber.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  "($1)$2-$3"
                );
            }
          });
          // console.log(res);
        },
        (err: any) => {
          // this.isLoadingZip = false;
          this.taskIsLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  addEditPatientTask(row: any) {
    this.patientTaskData.patientId = row.patientId;
    this.patientTaskData.action = row.action;
    this.patientTaskData.assignedToId = row.assignedToId;
    this.patientTaskData.assignedToName = row.assignedToName;
    this.patientTaskData.id = row.id;
    this.patientTaskData.facilityId = this.facilityId;
    this.patientTaskData.notes = row.notes;
    this.patientTaskData.patientTaskStatus = row.patientTaskStatus;
    this.patientTaskData.patientTaskPriority = row.patientTaskPriority;
    this.patientTaskData.patientTaskType = row.patientTaskType;
    this.patientTaskData.completedById = this.securityObject.id;
    this.patientTaskData.completedByName = this.securityObject.fullName;
    this.subs.sink = this.patientTaskService
      .addEditPatientTask(this.patientTaskData)
      .subscribe(
        (res: any) => {
          // this.patientTaskData = res;
          // if (row.patientTaskStatus !== 'InProgress' && row.patientTaskStatus !== 'Created') {
          //   this.patientTasksList = this.patientTasksList.filter(
          //     (fil) => fil.id !== this.patientTaskData.id
          //   );
          // }
          // this.toaster.success("Added Successfully");
          // this.LoadingData = false;
        },
        (err: any) => {
          // this.isLoadingZip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  changeStatus(row: any, ccmStatusModal: ModalDirective) {
    if (row.patient.profileStatus) {
      this.selectedPatient = row.patient;
      this.profileStatus = row.patient.profileStatus;
      this.ccmEncounterListDto.patientId = row.patientId;
    } else {
      this.toaster.warning(
        `Patient profile status is incomplete can't add ccm encounter`
      );
    }
  }
  resetCcmEncounterlist() {
    this.ccmEncounterListDto.note = "";
    this.ccmEncounterListDto.startTime = "";
    this.ccmEncounterListDto.duration = null;
  }
  AssignValueCcmService() {
    if (this.ccmEncounterListDto.ccmServiceTypeId === 8) {
      this.ccmEncounterListDto.duration = 5;
      this.ccmEncounterListDto.note = "Discussed with other providers office.";
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 12) {
      this.ccmEncounterListDto.duration = 5;
      this.ccmEncounterListDto.note = "Arranged medical refill.";
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 19) {
      this.ccmEncounterListDto.note = "Reviewed and uploaded lab results.";
      this.ccmEncounterListDto.duration = 7;
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 35) {
      this.ccmEncounterListDto.note = "Got preapproval for the patient.";
      this.ccmEncounterListDto.duration = 5;
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 40) {
      this.ccmEncounterListDto.duration = 5;
      this.ccmEncounterListDto.note = "Arranged referral for the patient.";
    } else {
      this.ccmEncounterListDto.duration = null;
      this.ccmEncounterListDto.note = "";
    }
  }
  addEncounterModalFn() {
    if (
      this.ccmEncounterListDto.patientId &&
      this.selectedPatient &&
      this.ccmEncounterListDto.patientId === this.selectedPatient.id &&
      this.selectedPatient.chronicDiseasesIds &&
      this.selectedPatient.chronicDiseasesIds.length < 2
    ) {
      this.patientTaskViewModal.hide();
      this.unApprovedCarePLanModal.hide();
      this.ccmStatusModal.hide();
      this.router.navigate([
        "/admin/patient/" + this.selectedPatient.id + "/pDetail/pDiagnoses",
      ]);
      this.toaster.warning("Please add chronic diseases before proceeding.");
      return;
    }
    this.subs.sink = this.patientService
      .IsCarePlanApproved(this.ccmEncounterListDto.patientId)
      .subscribe(
        (res) => {
          if (res) {
            this.addEncounterModal.show();
          } else {
            this.unApprovedCarePLanModal.show();
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  calculateEndtime() {
    const endTime = moment().format("HH:mm");
    this.ccmEncounterListDto.endTime = endTime;
    if (this.ccmEncounterListDto.duration) {
      this.calculateTime();
    }
  }
  calculateTime() {
    const CurrentTime = moment(this.ccmEncounterListDto.endTime, "HH:mm");
    if (this.ccmEncounterListDto.duration) {
      if (this.ccmEncounterListDto.duration > 59) {
        this.ccmEncounterListDto.duration = null;
        this.ccmEncounterListDto.startTime = null;
        return;
      }
      const duration = moment(this.ccmEncounterListDto.duration, "mm");
      this.myduration = duration;
      const startTime = moment.duration(CurrentTime.diff(this.myduration));
      this.ccmEncounterListDto.startTime = moment(
        startTime.hours().toString() + ":" + startTime.minutes().toString(),
        "HH:mm"
      ).format("HH:mm");
    }
  }
  addEncounter() {
    this.isLoading = true;
    if (!this.ccmEncounterListDto.endTime) {
      this.durationChanged(this.ccmEncounterListDto.duration);
    }
    if (!this.validaeTimeDifference()) {
      this.isLoading = false;
      this.showAlertFEncounter = true;
      setTimeout(() => {
        this.showAlertFEncounter = false;
      }, 5000);
      return;
    }
    this.ccmEncounterListDto.encounterDate = moment().format("YYYY-MM-DD");
    this.ccmEncounterListDto.appAdminId =
      this.securityService.securityObject.id;
    this.ccmEncounterListDto.careProviderId =
      this.securityService.securityObject.id;
    this.subs.sink = this.ccmService
      .addCCMEncounter(
        this.ccmEncounterListDto,
        this.selectedPatient.ccmMonthlyStatus
      )
      .subscribe(
        (res: CcmEncounterListDto) => {
          this.addEncounterModal.hide();
          this.patientTaskViewModal.hide();
          // this.childComponent.filterPatients();
          this.isLoading = false;
          this.router
            .navigateByUrl("/dmin/dashboard", { skipLocationChange: true })
            .then((value) => {
              // this.router.navigateByUrl(notify.linkUrl);
              this.router.navigateByUrl("/home/page");
              // this.router.navigateByUrl(`/rpm/PatientRpm/${notify.entityId}`);
            });
          // this.filterPatients();
          this.ccmEncounterListDto = {
            id: 0,
            startTime: "",
            endTime: "",
            ccmServiceTypeId: 0,
            careProviderId: 0,
            patientId: 0,
            appAdminId: 0,
            duration: 0,
            encounterDate: "",
            note: "",
          };
        },
        (err) => {
          this.toaster.error(err.error, err.message);
          this.isLoading = false;
        }
      );
  }
  durationChanged(minsToAdd: any) {
    const startTime = this.ccmEncounterListDto.startTime;
    function D(J) {
      return (J < 10 ? "0" : "") + J;
    }
    const piece: any = startTime.split(":");
    const mins: any = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ":" + D(mins % 60);
    this.ccmEncounterListDto.endTime = newTime;
  }
  validaeTimeDifference(): boolean {
    const sTime = moment(this.ccmEncounterListDto.startTime, "HH:mm");
    const eTime = moment(this.ccmEncounterListDto.endTime, "HH:mm");
    const res = sTime.isBefore(eTime);
    return res;
  }
  approveCarePlanLink() {
    this.unApprovedCarePLanModal.hide();
    this.patientTaskViewModal.hide();
    this.unApprovedCarePLanModal.hide();
    this.ccmStatusModal.hide();
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then((value) => {
        // this.router.navigateByUrl(notify.linkUrl);
        this.router.navigateByUrl(
          "/admin/patient/" +
            this.ccmEncounterListDto.patientId +
            "/pDetail/pMasterCarePLan"
        );
        // this.router.navigateByUrl(`/rpm/PatientRpm/${notify.entityId}`);
      });
  }
  ProceedToCCm() {
    if (
      this.ccmEncounterListDto.patientId &&
      this.selectedPatient &&
      this.ccmEncounterListDto.patientId === this.selectedPatient.id &&
      this.selectedPatient.chronicDiseasesIds &&
      this.selectedPatient.chronicDiseasesIds.length < 2
    ) {
      this.patientTaskViewModal.hide();
      this.ccmStatusModal.hide();
      this.router.navigate(["/admin/addPatient/" + this.selectedPatient.id], {
        queryParams: { setActive: 3 },
      });
      return;
    }
    this.unApprovedCarePLanModal.hide();
    this.addEncounterModal.show();
  }
  calculateDuration() {
    if (this.ccmEncounterListDto.startTime) {
      const startTime = moment(this.ccmEncounterListDto.startTime, "HH:mm");
      const endTime = moment(this.ccmEncounterListDto.endTime, "HH:mm");
      const calculateDuration = moment.duration(endTime.diff(startTime));
      this.ccmEncounterListDto.duration =
        calculateDuration.hours() * 60 + calculateDuration.minutes();
    }
  }
  getCcmServicesType() {
    this.subs.sink = this.questionnaireService
      .getServiceTypeList(true)
      .subscribe(
        (res: any) => {
          this.serviceTypes = res;
        },
        (err) => {}
      );
  }
  resetfields() {
    this.showAll = false;
  }

  onUploadOutput(event) {
    if (event.target.files[0].size > 26214400) {
      this.toaster.warning("file size is more than 25 MB");
      return;
    }
    // this.file = event.target.files[0];
    this.file.push(event.target.files[0]);
    this.feedbackDto.files = this.file;
    // this.bhiUploadDocObj.title = this.file.name;
  }
  popFile(doc: any) {
    this.file = this.file.filter((file) => {
      return file.name !== doc.name && file.lastModified !== doc.lastModified;
    });
    this.feedbackDto.files = this.file;
  }
  get2FAPdf() {
    if (environment.production == true) {
      const url = "https://api.2chealthsolutions.com/Info2FA.pdf";
      const win = window.open(url, "_blank");
      win.focus();
    } else {
      const url1 = "https://api.healthforcehub.link/Info2FA.pdf";
      const win = window.open(url1, "_blank");
      win.focus();
    }
  }
  NotesFilterChanged(type: string) {
    this.patientNoteObj.notes = [];
    this.notesFilter[type] = !this.notesFilter[type];
    if (type !== "ALL" && !this.notesFilter[type]) {
      this.notesFilter["ALL"] = false;
    }
    if (this.notesFilter.CCM) {
      const CCMRes = this.presPatientNotesObj.notes.filter(
        (y) => y.tag === "CCM"
      );
      this.patientNoteObj.notes.push(...CCMRes);
    }
    if (this.notesFilter.RPM) {
      const RPMRes = this.presPatientNotesObj.notes.filter(
        (y) => y.tag === "RPM"
      );
      this.patientNoteObj.notes.push(...RPMRes);
    }
    if (this.notesFilter.BHI) {
      const BHIRes = this.presPatientNotesObj.notes.filter(
        (y) => y.tag === "BHI"
      );
      this.patientNoteObj.notes.push(...BHIRes);
    }
    if (this.notesFilter.OTHERS) {
      const OTHERSRes = this.presPatientNotesObj.notes.filter(
        (y) => y.tag === "OTHERS"
      );
      this.patientNoteObj.notes.push(...OTHERSRes);
    }
    if (type === "ALL" && this.notesFilter[type]) {
      this.notesFilter.BHI = true;
      this.notesFilter.RPM = true;
      this.notesFilter.CCM = true;
      this.notesFilter.OTHERS = true;
      this.patientNoteObj.notes = this.presPatientNotesObj.notes;
    } else if (type === "ALL") {
      this.patientNoteObj.notes = this.presPatientNotesObj.notes
        .filter((x) => x.tag)
        .sort();
    }
    const ccmEnabled = this.securityService.hasClaim("ccmService");
    const rpmEnabled = this.securityService.hasClaim("rpmService");
    const bhiEnabled = this.securityService.hasClaim("bhiService");
    if (!ccmEnabled) {
      this.patientNoteObj.notes = this.patientNoteObj.notes.filter(
        (y) => y.tag !== "CCM"
      );
    }
    if (!rpmEnabled) {
      this.patientNoteObj.notes = this.patientNoteObj.notes.filter(
        (y) => y.tag !== "RPM"
      );
    }
    if (!bhiEnabled) {
      this.patientNoteObj.notes = this.patientNoteObj.notes.filter(
        (y) => y.tag !== "BHI"
      );
    }
  }
  StopRecording() {
    const event = new EmitEvent();
    event.name = EventTypes.stopRecordingEmit;
    event.value = "";
    this.eventBus.emit(event);
  }
  onOpenPatientNoteModal() {
    this.dataStorageDto.userId = this.securityService.securityObject.appUserId;
    this.dataStorageDto.entityId = this.PatientId;
    this.dataStorageDto.dataStorageType = DataStorageType.QuickNotes;
    const patientModalData = this.dataStorageService.getData(
      this.dataStorageDto.userId,
      this.dataStorageDto.entityId,
      this.dataStorageDto.dataStorageType
    );
    if (patientModalData && patientModalData.length) {
      this.patientNote.patientId =
        patientModalData[patientModalData.length - 1].data.patientId;
      this.patientNote.tag =
        patientModalData[patientModalData.length - 1].data.tag;
      this.patientNote.note =
        patientModalData[patientModalData.length - 1].data.note;
      this.FillNoteText(this.patientNote.note);
    }
  }
  NoteFieldChanged(nData: string) {
    this.patientNote.note = nData;
  }
  onClosePatientNoteModal() {
    if (this.patientNote.note) {
      this.patientNoteDataStorageDto.patientId = this.PatientId;
      this.patientNoteDataStorageDto.note = this.patientNote.note;
      this.patientNoteDataStorageDto.tag = this.patientNote.tag;

      this.dataStorageDto.userId =
        this.securityService.securityObject.appUserId;
      this.dataStorageDto.entityId = this.PatientId;
      this.dataStorageDto.dataStorageType = DataStorageType.QuickNotes;
      this.dataStorageDto.data = this.patientNoteDataStorageDto;

      this.dataStorageService.saveData(this.dataStorageDto);
    }
  }
  onClosedPatientNoteModal() {
    this.patientNote = new PatientNoteDto();
  }
  clearPatientNoteStorageData() {
    this.dataStorageDto.userId = this.securityService.securityObject.appUserId;
    this.dataStorageDto.entityId = this.PatientId;
    this.dataStorageDto.dataStorageType = DataStorageType.QuickNotes;
    this.dataStorageService.deleteData(
      this.dataStorageDto.userId,
      this.dataStorageDto.entityId,
      this.dataStorageDto.dataStorageType
    );
    this.patientNote = new PatientNoteDto();
    this.FillNoteText("");
  }
  FillNoteText(text: string) {
    if (this.myFIeldRef?.FillValue) {
      this.myFIeldRef.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRef?.FillValue) {
          this.myFIeldRef.FillValue(text);
        }
      }, 1000);
    }
    // if (document.getElementById('eitableContectDiv')) {
    //   document.getElementById('eitableContectDiv').innerText = text;
    // } else {
    //   setTimeout(() => {
    //     if (document.getElementById('eitableContectDiv')) {
    //       document.getElementById('eitableContectDiv').innerText = text;
    //     }
    //   }, 1000);
    // }
  }

  SpeechModeChange() {
    this.micState = !this.micState;

    if (this.micState) {
      this.speechService.start();
    } else {
      this.speechService.stop();
    }
  }
  handleCLaimProgressUpload(res: AthenaClaimDocResponseDto[]) {
    const result = this.filterDataService.groupByProp(res, 'invoiceId')
    this.claimProgressList = result;
  }
  handleActiveDowloads(res: PublishDownloadLogsProgressModel) {
    res.percentage =
      +((100 * res.completedSteps) / res.totalSteps).toFixed() || 5;
    if (res.percentage > 50) {
      res.class = "over50";
    } else {
      res.class = "over100";
    }
    let result = this.activeDownloadsList?.find((x) => x.key === res.key);
    if (!result) {
      this.activeDownloadsList.push(res);
    } else {
      var index = this.activeDownloadsList.indexOf(result);
      if (index !== -1) {
        this.activeDownloadsList[index] = res;
      }
      result = res;
    }
    if (res.downloadReady) {
      setTimeout(() => {
        this.activeDownloadsList = this.activeDownloadsList?.filter(
          (x) => x.key !== res.key
        );
        this.chng.detectChanges();
      }, 4000);
    }
    this.chng.detectChanges();
  }
  CancelDownloadPatients(res: PublishDownloadLogsProgressModel) {
    const result = localStorage.getItem('CanceledDownloadItems')
    if (!result?.includes(res.key)) {
      localStorage.setItem('CanceledDownloadItems', `${result},${res.key}`)
      this.activeDownloadsList = this.activeDownloadsList?.filter((x) => x.key !== res.key);
      this.chng.detectChanges();
    }
  }
  openDocumentLibrary() {
    this.facilityService
      .WPLogin(this.securityService.securityObject.id)
      .subscribe(
        (res: any) => {
          if (res.url === null) {
            this.toaster.warning("Please contact to support");
          } else {
            window.open(res.url, "_blank");
            window.focus();
          }
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  getAllAppAnnouncement() {
    this.appAnnouncementService.getAllAppAnnouncement().subscribe(
      (res: any) => {
        if (res.length) {
          this.appUi.appAnnouncementsList = res.filter(
            (announcement) => announcement.isActiveState === true
          );
          this.ArrayPlusDelay();
        }
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  ArrayPlusDelay() {
    this.selectedAnnouncementIndex = 0;
    this.announcementText = "";
    setInterval(() => {
      this.announcementText =
        this.appUi.appAnnouncementsList[this.selectedAnnouncementIndex];
      if (
        this.selectedAnnouncementIndex + 1 ==
        this.appUi.appAnnouncementsList.length
      ) {
        this.selectedAnnouncementIndex = 0;
      } else {
        this.selectedAnnouncementIndex++;
      }
    }, 2500);
  }
  closeAppAnnouncementBar(){
    this.appUi.appAnnouncementsList = [];
    this.announcementText = '';
    var elements = document.getElementsByClassName('margin-top-30px');
    while(elements.length > 0){
      elements[0].classList.remove('margin-top-30px');
  }
  }
  facilityFilter(event) {
    console.log(this.filterfacility)
    const val = event.target.value.toLowerCase();
    const facilitySearch = this.filterfacility.filter(function (d) {
      return (
        d.toLowerCase().indexOf(val) !== -1 || !val
      );
    });
    console.log(facilitySearch);
    this.filterfacilitymain = facilitySearch;
  }
  WatchHubConnectionState() {
    this.chatService.hubConnectionStateSUbject.asObservable().subscribe((stateVal: HubSateEnum) => {
      this.connectionState = stateVal;
      if (location.href?.includes('insights') || location.href?.includes('customUrl')) {
        this.connectionState = null;
      }
      if (stateVal === HubSateEnum.Connected) {
        this.colorForConnectionState = 'state-success';
      }
      if (stateVal === HubSateEnum['Re Connecting']) {
        this.colorForConnectionState = 'state-warning';
      }
      if (stateVal === HubSateEnum.Disconnected || stateVal === HubSateEnum['Connection Error']) {
        this.colorForConnectionState = 'state-danger';
      }
    });
  }
  openUrl(){
    // const selectedAnnouncement =  this.appAnnouncementsList.filter((announce) => announce.announcement == this.announcementText);
    // if(selectedAnnouncement[0].url){
    //   window.open(selectedAnnouncement[0].url)
    // }
    if(this.announcementText?.url){
      window.open(this.announcementText?.url)
    }
  }
  openComplaintsModal() {
    const event = new EmitEvent();
    event.name = EventTypes.openAddComplaintModal;
    // event.value = data;
    this.eventBus.emit(event);
  }
  changePasswordView(){
    this.hide = !this.hide;
  }
  resetChangePasswordForm(){
    this.changePasswordForm.reset();
  }
  password(type) {
    if(type === 'showOldPassword'){
      this.showOldPassword = !this.showOldPassword;
    }
    if(type === 'showNewPassword'){
      this.showNewPassword = !this.showNewPassword;
    }
    if(type === 'showConfirmPassword'){
      this.showConfirmPassword = !this.showConfirmPassword;
    }

  }
  selectedGroupChanged(data: PatinetCommunicationGroup) {
    this.selectedGroup = data
    if (data?.id) {
      this.detailCompRef?.loadGroupData(this.selectedGroup)
    } else {
      this.compactMode = false
    }
  }

  openChatModal() {
    // console.table(this.messageNotifyList);
    this.appUi.chatShown = !this.appUi.chatShown;
    // if (this.appUi.chatShown) {
    //   // const event = new EmitEvent();
    //   // event.name = EventTypes.OpenCommunicationModal;
    //   // event.value = null;
    //   // this.eventBus.emit(event);
    // } else {
    //   // const event = new EmitEvent();
    //   // event.name = EventTypes.Close2cChatModal;
    //   // event.value = null;
    //   // this.eventBus.emit(event);
    // }
    if (!this.appUi.chatShown) {
      this.DisableExpandChat();
    }
  }
  EnableExpandChat() {
    this.chatExpand = true
    if (this.selectedGroup?.id) {
      this.compactMode = true
    } else {
      this.compactMode = false
    }
  }
  DisableExpandChat() {
    this.chatExpand = false
    this.compactMode = true
  }
  CCMEncounterAdded() {
    // this.getPatientById();
    // this.getLogsByPatientAndMonthId();
    // this.GetPatientEmrSummaryData();
  }
  OpenRPMEncounterModal() {
    const patient = new PatientDto();
    this.addRPmEncounterRef.OpenAddEncounterModal(patient)
  }
  RPMEncounterAdded() {
    // this.getPatientById();
    // this.getLogsByPatientAndMonthId();
    // this.GetPatientEmrSummaryData();
  }
}
