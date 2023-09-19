import { EventBusService } from "src/app/core/event-bus.service";
import { EmitEvent, EventTypes } from "./../../core/event-bus.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AssignRPMCareCoordinatorsToPatientsDto, PatientDto } from "./../../model/Patient/patient.model";
import {
  Modalities,
  RPMDuration,
  RpmQualityCheckedEnum,
  RpmQualityCheckedStatusEnum,
  RPMServiceType,
} from "src/app/Enums/rpm.enum";
import { PatientsService } from "./../../core/Patient/patients.service";
import { FacilityService } from "./../../core/facility/facility.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective, PopoverDirective, ToastService } from "ng-uikit-pro-standard";
import { BhiService } from "src/app/core/bhi.service";
import { RpmService } from "src/app/core/rpm.service";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import * as XLSX from "xlsx";
import {
  ActivityDataDto,
  BGDeviceDataDto,
  BPDeviceDataDto,
  EditDateAssignedParamDto,
  PHDeviceDto,
  PulseOximetryDataDto,
  RmpDashboardDataDto,
  RmpDashboardParamsDto,
  RPMCareCoordinatorForDisplay,
  RPMCopyDto,
  RPMDeviceListDtoNew,
  RpmDownloadDataDto,
  RPMEncounterDto,
  RpmFilterDto,
  RpmMonthlyStatusChangeDto,
  RpmPatientsListDto,
  RpmPatientsScreenParams,
  RPMQualityCheckModalDto,
  RpmStatusHistoryDto,
  WeightDataDto,
} from "src/app/model/rpm.model";
import { PubnubChatService } from "src/app/core/pubnub-chat.service";
import { AppNotification, ChatGroupDto, ChatViewType } from "src/app/model/chat/chat.model";
import moment from "moment";
import {
  AlertReason,
  RpmAlertListDto,
  SendAlertSmsDto,
} from "src/app/model/rpm/rpmAlert.model";
import { Subject } from "rxjs/internal/Subject";
import { LazyModalDto, PagingData, TwoCModulesEnum } from "src/app/model/AppModels/app.model";
import { DataTableDirective } from "angular-datatables";
import { CcmStatus, CommunicationConsent, DaysPatientNotRespond, RpmMonthlyStatus, RpmStatus } from "src/app/Enums/filterPatient.enum";
import {
  AssignRemoveCareProvidersToPatientsDto,
  CareProvidersListDto,
  DeletPatientDto,
} from "src/app/model/Patient/patient.model";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { fromEvent } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { AppUiService } from "src/app/core/app-ui.service";
import { FinancialFormSendToPatientDto, RpmStatusChangeDto } from "src/app/model/admin/ccm.model";
import {
  MdbTablePaginationComponent,
  MdbTableDirective,
} from "ng-uikit-pro-standard";
import { environment } from "src/environments/environment";
import { DiagnoseStatus } from "src/app/Enums/ccm.enum";
import { DataFilterService } from "src/app/core/data-filter.service";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { ClonerService } from "src/app/core/cloner.service";
import { DataStorageService } from "src/app/core/data-storage.service";
import { DataStorage } from "src/app/model/data-storage/data-storage.model";
import { DataStorageType } from "src/app/Enums/data-storage.enum";
import * as FileSaver from "file-saver";
import { ChartDataSets } from "chart.js";
import { PageScrollService } from "ngx-page-scroll-core";
import { DatePipe, DOCUMENT } from "@angular/common";
import { CustomeListService } from "src/app/core/custome-list.service";
import { AddEditCustomListDto, AssignPatientsToCustomListDto, RemovePatientsToCustomListDto } from "src/app/model/custome-list.model";
import { AwsService } from "src/app/core/aws/aws.service";
import { TwoCTextAreaComponent } from "src/app/utility/two-c-text-area/two-c-text-area.component";
import { TwocChatService } from "src/app/core/2c-chat.service";
import { RpmQuickEncounterComponent } from "src/app/patient-shared/rpm-quick-encounter/rpm-quick-encounter.component";
import { IntellisenseService } from "src/app/core/Tools/intellisense.service";
import { AppDataService } from "src/app/core/app-data.service";
import { PatientCommunicationHistoryDto, PatinetCommunicationGroup } from "src/app/model/PatientEngagement/communication.model";
import { PatientNotificationDto } from "src/app/model/Patient/patient-notification-model";
import { CommunicationService } from "src/app/core/communication.service";
import { CustomListForPatientListsComponent } from "src/app/custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component";

@Component({
  selector: "app-rpm-dashboard",
  templateUrl: "./rpm-dashboard.component.html",
  styleUrls: ["./rpm-dashboard.component.scss"],
})
export class RpmDashboardComponent implements OnInit {
  @ViewChild('myFIeldRefRPM') myFIeldRefRPM: TwoCTextAreaComponent;
  @ViewChild("downloadRpmDataModal") downloadRpmDataModal: ModalDirective;
  @ViewChild("viewPdfModal") viewPdfModal: ModalDirective;
  @ViewChild("rpmMonthlyStatusModal") rpmMonthlyStatusModal: ModalDirective;
  @ViewChild("rpmStatusHistoryModal") rpmStatusHistoryModal: ModalDirective;
  @ViewChild("addRPmEncounterRef") addRPmEncounterRef: RpmQuickEncounterComponent;
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  patientEncounterMonthlyStatusAcknowledge = false;
  rpmStatusHistory: any;
  sectionSelection = "";
  rpmStatusHistoryDto = new RpmStatusHistoryDto();
  CustomListDto = new Array<AddEditCustomListDto>();
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  rpmStatusHistoryList = new Array<RpmStatusHistoryDto>();
  addingPatientToCustomList: boolean;
  removePatientInCustmListDto = new RemovePatientsToCustomListDto();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD hh:mm A",
    appendTo: "body",
    disableKeypress: true,
    drops: "down",
  };
  public DeviceBarChartData: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 3,
    scrollButtons: { enable: true },
    scrollbarPosition: "inside",
  };
  public assignedDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD hh:mm A",
    // format: "YYYY-MM-DDTHH:mm:ssZ",
    appendTo: "body",
    closeOnSelect: true,
    drops: "down",
  };
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ];
  public options: any = {
    locale: {
      format: "MM-DD-YYYY",
      cancelLabel: "Clear",
      // displayFormat: 'DD-MM-YYYY'
    },
    alwaysShowCalendars: false,
  };
  patientDevicesDataList = new Array<{
    chartType: string;
    deviceObj: RPMDeviceListDtoNew;
    deviceData: any;
  }>();
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  rpmEncounterCovered = `CPT Code 99091 is the collection and interpretation of physiologic data (e.g., ECG, blood pressure, glucose monitoring) digitally stored and/or transmitted by the patient and/or caregiver to the physician or other qualified health care professional. In this instance, a QHP is qualified by education, training, licensure/regulation (when applicable). The code requires a minimum of 30 minutes of interpretation and review and is billable once in a 30-day billing period.`;
  isPatientModalityDetails = false;
  rpmCopyDataObj: RPMCopyDto;
  diagnoseStatusEnum = DiagnoseStatus;
  PatientTestData = new Array<BPDeviceDataDto>();
  showAssignDateField = true;
  facilityUserId: number;
  rpmMonthlyStatusChangeDto = new RpmMonthlyStatusChangeDto();
  activityDataList = new Array<ActivityDataDto>();
  facilityId: number;
  hasEmail = false;
  hasPhoneNo = false;
  public DeviceBarChartLabels: Array<string> = [];
  careFacilitatorsList = [];
  careProvidersList = [];
  bloodGlucoseStatistics = [];
  bloodPressureStatistics = [];
  daterange: {};
  daterangeOfLastReading: {};
  daterangeOfLastLog: {};
  isBpDevice = false;
  isWtDevice = false;
  isPoDevice = false;
  isBgDevice = false;
  isAtDevice = false;
  weightStatistics = [];
  assignedDateProp: string;
  patientId: number;
  CareCordinatorId = 0;
  CareFacilitatorId = 0;
  dateAssigned: string;
  rpmMonthlyStatusList = this.filterDataService.getEnumAsList(RpmMonthlyStatus);
  rpmMonthlyStatusListFromEnum = this.filterDataService.getEnumAsList(RpmStatus);
  rpmMonthlyStatusEnum = RpmMonthlyStatus;
  rmpDashboardDataDto = new RmpDashboardDataDto();
  public datePickerConfig3: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
  };
  // appNotifyList = new Array<AppNotification>();
  sendingToPatient: boolean;
  uploadingDocument: boolean;
  isAlertLoading: boolean;
  rpmAlertListDto = new Array<RpmAlertListDto>();
  selectedDateRange: any;
  selectedDateRangeOfLastReading: any;
  fromTransmissionDays: number;
  toTransmissionDays: number;
  selectedDateRangeOfLastLog: any;
  rpmAlertListTimeLapse = new Array<RpmAlertListDto>();
  rpmAlertListOutOfRange = new Array<RpmAlertListDto>();
  pulseOximetryDataList = new Array<PulseOximetryDataDto>();
  selectedRpmAlertOutOfRange = new RpmAlertListDto();
  filterPatientDto = new RpmPatientsScreenParams();
  bpReadingDayCount: number;
  deletePatientDto = new DeletPatientDto();
  rowIndex = 0;
  dtTrigger = new Subject<any>();

  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};

  RPMServiceTypeEnum = RPMServiceType;
  isDownloadingRpmData: boolean;
  loadingOnStart: boolean;
  isLoading: boolean;
  selected: any[];
  rpmFilterDto = new RpmFilterDto();
  rows: RpmPatientsListDto[];
  PatientEncounterMonthlyStatusTExt = RpmMonthlyStatus[RpmMonthlyStatus["Not Started"]];
  rpmMonthlyStatusEnumList = this.filterDataService.getEnumAsList(RpmMonthlyStatus);
  communicationConsentList = this.filterDataService.getEnumAsList(CommunicationConsent);
  selectedPatient = new RpmPatientsListDto();
  selectedRpmAlert = new RpmPatientsListDto();
  rpmDownloadDataDto = new RpmDownloadDataDto();
  downloadData: string;
  yearNum: number = new Date().getFullYear();
  pagingData = new PagingData();
  table = $("#example").DataTable();
  gridCheckAll: boolean;
  rowId: any;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("clickOnRow") clickOnRow: ModalDirective;
  @ViewChild("outOfRangeAlertsHistoryModal") outOfRangeAlertsHistoryModal: ModalDirective;
  rpmStatusEnum = RpmStatus;
  selectedPatientsCareProvidersList = new Array<RPMCareCoordinatorForDisplay>();
  assignRemoveCareProvidersToPatientsDto =
    new AssignRPMCareCoordinatorsToPatientsDto();
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM"
  };
  public datePickerConfigForFilterDOB: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
  };
  selectedDate = moment().format("YYYY-MM");
  @ViewChild("searchPatient") searchPatient: ElementRef;
  public datePickerConfig1: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A'
  };
  public datePickerConfig4: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "hh:mm",
  };
  services;
  sendAlertSmsObj = new SendAlertSmsDto();
  rpmEncounterList = new Array<RPMEncounterDto>();
  rpmServiceTypeEnum = RPMServiceType;
  isSendingAlertSms: boolean;
  rpmEncounterDto = new RPMEncounterDto();
  isAddEncounter: boolean;
  rpmServiceType: number;
  isCFGet: boolean;
  rpmStatusChangeDto = new RpmStatusChangeDto();
  devicesList = new Array<RPMDeviceListDtoNew>();
  quickActions= 0;

  @ViewChild("ccmStatusModal") ccmStatusModal: ModalDirective;
  rpmQualityCheckModalDto = new RPMQualityCheckModalDto()
  rpmStatusList: any;
  rpmStatusListOfEnum = this.filterDataService.getEnumAsList(RpmStatus);
  disclaimer = "Disclaimer: This is an automated SMS, please do not reply.";

  rpmStatus = 0;

  // tempSelectedPatientsCareProvidersList = new Array<CareProvidersListDto>();
  // @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  // @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  @ViewChild("tableEl2") tableEl2: MdbTableDirective;
  @ViewChild("tableEl2Page") tableEl2Page: MdbTablePaginationComponent;
  @ViewChild("tableEl1") tableEl1: MdbTableDirective;
  @ViewChild("tableEl1Page") tableEl1Page: MdbTablePaginationComponent;
  @ViewChild("sendToPatientModal") sendToPatientModal: ModalDirective;
  assigningRpmDate: boolean;
  selectedPatientDateAssigned: string;
  ccmLogsModalLink: string;
  queryParamsApplied: boolean;
  PatientId: any;
  subs: any;
  awId: number;
  bhiPatientId: number;
  selecteChronicDiseaseList: any;
  tabledata: any;
  selectedPatientRPMQC: RpmQualityCheckedEnum;
  rpmQualityCheckedEnum = RpmQualityCheckedEnum;
  rpmQualityCheckedStatusEnum = RpmQualityCheckedStatusEnum;
  financialFormSendToPatientDto = new FinancialFormSendToPatientDto();
  changingQualityCHeck: boolean;
  rpmEncounterTime: any;
  rpmEncounterTimeEnumList = this.filterDataService.getEnumAsList(RPMDuration);
  daysPatientNotRespondList = this.filterDataService.getEnumAsList(DaysPatientNotRespond);
  // rpmEncountTimeEnumList =
  //   this.filterDataService.getEnumAsList();
  rpmCarePlan: string;
  rpmMonthId: number;
  rpmOutOfRangeMonthId: number = new Date().getMonth() + 1;
  rpmOutOfRangeYearNum: number = new Date().getFullYear();
  rpmYearId: number;
  BGDeviceDataList = new Array<BGDeviceDataDto>();
  BPDeviceDataList = new Array<BPDeviceDataDto>();
  weightDataList = new Array<WeightDataDto>();
  selectedModalityCode = "";
  dataStorageDto = new DataStorage();
  public dropdownScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside",
  };
  revokeType: string;
  showValidationAlert: string;
  outOfRangeAddressedCount: number;
  timeLapseAddressedCount: number;
  objectURLStrAW = "";
  isLoadingRpmModalityStatistics: boolean;
  gettingBpData: boolean;
  gettingWTData: boolean;
  wtReadingDayCount: any;
  gettingBGData: boolean;
  bgReadingDayCount: any;
  bgCHartData: { key: string; value: any[] }[];
  isDownloadingPatientsData: boolean;
  gettingChatGroup: boolean;
  showLastReadingDateField = true;
  showLastLogDateField = true;
  isLoadingRpmStatusHistory: boolean;
  isMakingExcel: boolean;
  ExcelData: any[];
  selectedFile: any;
  stopWatchValue: number;
  stopWatchInterval: NodeJS.Timeout;
  copyDataStr: string;
  gettingRPMCopyData: boolean;
  includeEncounters= true;
  isDeletingPatientFromCustomList: boolean;
  usingSMartPhrase: boolean;
  currentMonthYear: any;
  filterMonthYear: any;
  loadingRPMMSToolTip: boolean;
  RPMMSTooltipOverRef = {};
  rpmMSToolTip: string;
  rpmEncounterDuration = '';
  gettingRpmEncounterTimeDuration= false;
  currentMonth: number;
  totalRpmDuration: any;
  alertFilterObj = {
    outOfRange: "all",
    missedReading: "all"
  }

  constructor(
    public securityService: SecurityService,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private router: Router,
    private bhiService: BhiService,
    private toaster: ToastService,
    private rpmService: RpmService,
    private intellisenseService: IntellisenseService,
    private appUi: AppUiService,
    private patientsService: PatientsService,
    private cdRef: ChangeDetectorRef,
    private ccmService: CcmDataService,
    private sanatizer: DomSanitizer,
    private eventBus: EventBusService,
    private commService: CommunicationService,
    private filterDataService: DataFilterService,
    private dataFilterService: DataFilterService,
    private dataStorageService: DataStorageService,
    private cloneService: ClonerService,
    private pageScrollService: PageScrollService,
    private customListService: CustomeListService,
    private eventBusService: EventBusService,
    private datePipe: DatePipe,
    private awsService: AwsService,
    private twocChatService: TwocChatService,
    private appData: AppDataService,
    @Inject(DOCUMENT) private document: any
  ) {}

  getRowClass = (row) => {
    return {
      "my-class-rpmalert": row.isDue,
    };
  };
  ngOnInit() {
    this.currentMonth = this.appData.currentMonth;
    this.currentMonthYear = moment().format('MM YYYY')
    this.filterMonthYear = moment().format('MM YYYY');
    this.filterDataService.selectedRPMDashboardDate = this.selectedDate;
    // for (let i = 1; i <= 15; i++) {
    //   this.elements.push({id: i.toString(), first: 'User ' + i, last: 'Name ' + i, handle: 'Handle ' + i});
    // }

    // this.mdbTable.setDataSource(this.elements);
    // this.elements = this.mdbTable.getDataSource();
    // this.previous = this.mdbTable.getDataSource();
    // this.loadDiagnoses();
    this.isCFGet = true;
    this.initializeParams();
    this.eventBusService.on(EventTypes.RefreshCustomList).subscribe((res) => {
      this.GetCustomListsByFacilityUserId();
    });
    this.eventBusService.on(EventTypes.CommunicationEncounterEdit).subscribe((res) => {
      this.refreshPatientsList(res.data.patientId, res.data.patientCommunicationIds, res.data.encounterObj, res.data.serviceType);
    });
    this.GetCustomListsByFacilityUserId();
    this.initializeDataTable();
    this.GetRpmAlerts();
    this.getRpmStatus();
    this.GetMonthlyPatientsRmpData();
    this.getCareFacilitatorsList();
    this.getCareProvidersList();
    this.getFiltersData();
    if (this.securityService.hasClaim('IsBillingProvider')) {
      // this.isBillingProvider = true;
      this.rpmEncounterDto.billingProviderId = this.securityService.securityObject.id;
    }
    this.patientsService.refreshQualityCheckStatusOfRPM.subscribe((res: number)=>{
      this.selectedPatient.qualityCheckStatus = res;
        })
    window.addEventListener('message', this.receiveMessage, false);
  }
  refreshPatientsList(patientId: number, patientCommunicationIds: number[], encounterObj?: RPMEncounterDto, serviceType? : TwoCModulesEnum) {
    this.rows.forEach((patient) => {
      if(patient.id == patientId){
        patient.unAssociatedCommunication = patient.unAssociatedCommunication - patientCommunicationIds?.length
      }
      let isSameMonth = false
      if (encounterObj?.encounterDate) {
        const cMonth = moment(encounterObj.encounterDate, 'YYYY-MM-DD').month() + 1
        if (this.filterPatientDto.serviceMonth == cMonth) {
          isSameMonth = true
        }

      }
      if(isSameMonth && patient.id == patientId && encounterObj && serviceType == TwoCModulesEnum.RPM){
        patient.currentMonthCompletedTime = (patient.currentMonthCompletedTime) + (+encounterObj?.duration || 0)
      }
    })
  }
  receiveMessage = (event) => {
    if (event.data.type === 'PatientNotificationSettingChanged') {
      const notificationSetting = event.data.mData as PatientNotificationDto;
      const row = this.rows.find(x => x.patientId == notificationSetting.patientId)
      if (row) {
        row.telephonyCommunication = notificationSetting.telephonyCommunication
      }
    }
  }
  startStopWatch() {
    this.stopWatchValue = 0;
    this.stopWatchInterval  = setInterval(() => {
      ++this.stopWatchValue;
      const result = moment().startOf('day').seconds(this.stopWatchValue).format('HH:mm:ss');
      document.getElementById('stopwatchFieldRPM2').setAttribute('value',result);
    }, 1000);
  }
  AddEncounterClosed() {
    this.ResetStopWatch();
    this.FillNoteText('');
  }
  ResetStopWatch() {
    this.rpmEncounterDuration =  moment().startOf('day').seconds(this.stopWatchValue).minutes().toString();
    if ((this.stopWatchValue % 60) > 0) {
      this.rpmEncounterDuration = (this.rpmEncounterDuration + 1).toString();
    }
    if (!+this.rpmEncounterDuration) {
      this.rpmEncounterDuration = null;
    }
    clearInterval(this.stopWatchInterval);
    this.stopWatchInterval = null;
    document.getElementById('stopwatchFieldRPM2')?.setAttribute('value','');
    this.durationChanged(this.rpmEncounterDuration);
  }
  FillNoteText(text: string) {
    if (this.myFIeldRefRPM?.FillValue) {
      this.myFIeldRefRPM.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRefRPM?.FillValue) {
          this.myFIeldRefRPM.FillValue(text);
        }
      }, 1000);
    }
  }
  rpmEncounterModalOpened() {
    this.startStopWatch();
  }
  initializeParams() {
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityUserId = this.securityService.securityObject.id;
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    } else {
      this.facilityUserId = 0;
      this.facilityId = 0;
    }
    // if (this.securityService.hasClaim("IsCareFacilitator")) {
    //   this.CareFacilitatorId = this.securityService.securityObject.id;
    // }
    if (this.rpmService.careFacilitatorId) {
      this.filterPatientDto.careFacilitatorId =
        this.rpmService.careFacilitatorId;
      this.CareFacilitatorId = this.rpmService.careFacilitatorId;
    } else {
      this.filterPatientDto.careFacilitatorId = this.CareFacilitatorId;
    }
    this.filterPatientDto.careProviderId = this.CareCordinatorId;
    this.filterPatientDto.filteredMonth = this.selectedDate;
  }
  donwloadRpmData() {
    this.isDownloadingRpmData = true;
    const monthId = +moment(this.selectedDate).format("MM");
    const yearId = +moment(this.selectedDate).format("YYYY");
    if (this.downloadData === "selected") {
      this.rpmDownloadDataDto.yearId = yearId;
      this.rpmDownloadDataDto.monthId = monthId;
      this.rpmDownloadDataDto.facilityId = this.facilityId;
      this.selected.forEach((patient) => {
        this.rpmDownloadDataDto.patientIds.push(patient.id);
      });
      this.rpmDownloadDataDto.isActive = false;
      this.rpmDownloadDataDto.isCompleted = false;
    } else {
      this.rpmDownloadDataDto.yearId = yearId;
      this.rpmDownloadDataDto.monthId = monthId;
      this.rpmDownloadDataDto.facilityId = this.facilityId;
      this.rpmDownloadDataDto.patientIds = [];
    }
    if (this.downloadData === "active") {
      this.rpmDownloadDataDto.isActive = true;
      this.rpmDownloadDataDto.isCompleted = false;
    }
    if (this.downloadData === "completed") {
      this.rpmDownloadDataDto.isActive = false;
      this.rpmDownloadDataDto.isCompleted = true;
    }
    setTimeout(() => {
      this.downloadRpmDataModal.hide();
    }, 600);
    this.rpmDownloadDataDto.allPatients = false;
    this.isDownloadingRpmData = false;
    this.rpmService
      .downloadRPMEncountersAndReadingsPDF(this.rpmDownloadDataDto)
      .subscribe(
        (res: any) => {
          // FileSaver.saveAs(
          //   new Blob([res], { type: "application/zip" }),
          //   `${this.rpmDownloadDataDto.monthId}-${this.rpmDownloadDataDto.yearId}-RpmData.zip`
          // );
        },
        (err: HttpResError) => {
          // this.toaster.error(err.error);
          this.isDownloadingRpmData = false;
        }
      );
  }
  clearRpmDownloadDto() {
    this.rpmDownloadDataDto.patientIds = [];
  }
  GetPHDevicesByPatientId(row) {
    this.isLoading = true;
    this.rpmService.GetPHDevicesByPatientId(row.id).subscribe(
      (res: any) => {
        this.devicesList = res;
      if(!this.rpmMonthId){
        this.rpmMonthId = this.rpmOutOfRangeMonthId;
       }
      if(!this.rpmYearId){
        this.rpmYearId = this.rpmOutOfRangeYearNum;
       }
        this.getDeviceDisplayData(row);
        if (this.devicesList) {
          this.devicesList.forEach((device: RPMDeviceListDtoNew) => {
            if (device.modality) {
              if (device.modality === "BP") {
                device.modalityName = "Blood Pressure";
              }
              if (device.modality === "WT") {
                device.modalityName = "Weight";
              }
              if (device.modality === "PO") {
                device.modalityName = "Pulse Oximetry";
              }
              if (device.modality === "BG") {
                device.modalityName = "Blood Glucose";
              }
              if (device.modality === "AT") {
                device.modalityName = "Activity";
              }
            }
          });
        }
        this.selectedRpmAlertOutOfRange.patientId=row.id;
        this.selectedRpmAlertOutOfRange.modality = this.devicesList[0]?.modalityName;
        this.getRpmReadingHistory();
        // if(this.devicesList.length){
        // }else{
        //   this.toaster.warning(`This Patient haven't any device`);
        // }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  getDeviceDisplayData(row) {
    if (!this.selectedModalityCode) {
      setTimeout(() => {
        this.selectedModalityCode = this.devicesList[0].modality;
      }, 2000);
    }
    this.rpmService
      .getDevicesDatabyPatientId(row.id, this.rpmMonthId, this.rpmYearId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.bgData.length > 0) {
          res.bgData = res.bgData.reverse();
          res.bgData.forEach((element) => {
            element.measurementDate = moment(element.measurementDate).format(
              "D MMM YY,\\ h:mm a"
            );
          });
          res.bgData = this.dataFilterService.distictArrayByProperty(
            res.bgData,
            "measurementDate"
          );
          this.BGDeviceDataList = res.bgData;
        }
        if (res.bpData.length > 0) {
          res.bpData.forEach((element) => {
            element.measurementDate = moment(element.measurementDate).format(
              "D MMM YY,\\ h:mm a"
            );
          });
          this.BPDeviceDataList = this.cloneService.deepClone(res.bpData);
        }
        if (res.wtData.length > 0) {
          res.wtData.forEach((element) => {
            element.measurementDate = moment(element.measurementDate).format(
              "D MMM YY,\\ h:mm a"
            );
          });
          res.wtData = this.dataFilterService.distictArrayByProperty(
            res.wtData,
            "measurementDate"
          );
          this.weightDataList = res.wtData;
        }
      });
  }
  GetRPMCarePlan(row) {
    this.rpmService.GetRpmCarePlan(row.id).subscribe(
      (res: any) => {
        if (res) {
          this.rpmCarePlan = res.carePlan;
        }
      },
      (error: HttpResError) => {
        // this.loadingPsy = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFiltersData() {
    if (this.filterDataService.filterData["rpmList"]) {
      this.filterPatientDto = this.filterDataService.filterData["rpmList"];
      this.rpmStatus = this.filterDataService.rpmFilterDto.rpmStatus;
      this.CareCordinatorId =
        this.filterDataService.rpmFilterDto.rpmCoordinator;
      this.CareFacilitatorId =
        this.filterDataService.rpmFilterDto.rpmFacilitator;
    }
  }
  checkIfQueryParams() {
    this.queryParamsApplied = true;
    const filterState = this.route.snapshot.queryParams["filterState"];
    if (filterState) {
      this.filterPatientDto = JSON.parse(filterState);
    }
  }
  facilitatorSaveInService() {
    this.rpmService.careFacilitatorId = this.CareFacilitatorId;
  }

  getRpmStatus() {
    this.patientsService.getRpmStatus().subscribe((res: any) => {
      if (res) {
        this.rpmStatusList = res;
      }
    });
  }
  changeStatus(row: any) {
    this.selectedPatient = row;
    this.rpmStatusChangeDto.patientId = row.id;
    if (this.selectedPatient.rpmDateAssigned) {
      this.selectedPatientDateAssigned = moment(
        this.selectedPatient.rpmDateAssigned
      ).format("MM-DD-YYYY");
    } else {
      this.selectedPatientDateAssigned = "";
    }
  }
  AssignRpmDate(modal: any) {
    this.assigningRpmDate = true;
    const newObj = new EditDateAssignedParamDto();
    newObj.patientId = this.selectedPatient.id;
    newObj.dateAssigned = this.selectedPatientDateAssigned;
    newObj.facilityId = this.facilityId;
    this.rpmService.EditRpmDateAssigned(newObj).subscribe(
      (res) => {
        modal.hide();
        this.assigningRpmDate = false;
        this.selectedPatient.rpmDateAssigned = this.selectedPatientDateAssigned;
        this.selectedPatientDateAssigned = "";
        this.toaster.success("Date Saved Successfully");
      },
      (err: HttpResError) => {
        this.assigningRpmDate = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  AssignRPMStatus(id: number) {
    this.ccmStatusModal.hide();
    this.rpmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.rpmStatusChangeDto.patientId = id;
    this.patientsService
      .changePatientRpmStatus(this.rpmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Rpm Status Changed Successfully");
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  assignRpmMonthlyStatus() {
    this.rpmMonthlyStatusChangeDto.patientId = this.selectedPatient.id;
    this.rpmService
      .EditPatientRPMMonthlyStatus(this.rpmMonthlyStatusChangeDto)
      .subscribe(
        (res: any) => {
          this.selectedPatient.rpmMonthlyStatus =
            this.rpmMonthlyStatusChangeDto.rpmMonthlyStatus;
          this.toaster.success("Rpm Monthly Status Changed Successfully");
          this.rpmMonthlyStatusModal.hide();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  durationChanged(minsToAdd: any) {
    const startTime = this.rpmEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? "0" : "") + J;
    }
    const piece = startTime.split(":");
    const mins = +piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ":" + D(mins % 60);
    this.rpmEncounterDto.endTime = newTime;
    this.totalRpmDuration = this.rpmEncounterTime.durationInNumber + +this.rpmEncounterDuration;
  }
  GetDefaultNotReceivedSmsContent() {
    // this.isLoadingSmsContent = true;
    this.sendAlertSmsObj.messageText = "";
    this.rpmService
      .GetDefaultNotReceivedSmsContent(
        this.selectedRpmAlert.patientId,
        this.selectedRpmAlert.modality
      )
      .subscribe(
        (res: any) => {
          // this.isLoadingSmsContent = false;
          // this.smsNotReceivedContent = res.message;
          this.sendAlertSmsObj.messageText = res.message;
        },
        (error: HttpResError) => {
          // this.isLoadingSmsContent = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  ChangeQualityCheckValue(enumVal: RpmQualityCheckedEnum) {
    this.changingQualityCHeck = true;
    this.rpmService
      .SetQualityChecked(this.selectedPatient.id, enumVal)
      .subscribe(
        (res: any) => {
          this.selectedPatient.qualityChecked = enumVal;
          this.changingQualityCHeck = false;
        },
        (error: HttpResError) => {
          this.changingQualityCHeck = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  resetEncounterModal(rpmEncounterModal: ModalDirective) {
    this.rpmEncounterDto = new RPMEncounterDto();
    if (this.securityService.hasClaim('IsBillingProvider')) {
      // this.isBillingProvider = true;
      this.rpmEncounterDto.billingProviderId = this.securityService.securityObject.id;
    }
    this.rpmEncounterDto.encounterDate = moment().format("YYYY-MM-DD hh:mm A");
    const time = moment().format("hh:mm");
    this.rpmEncounterDto.startTime = time;
    rpmEncounterModal.show();
  }
  addEncounterOnSMS() {
    this.rpmEncounterDto.startTime = moment().format("hh:mm");
    this.rpmEncounterDto.encounterDate = moment().format("YYYY-MM-DD");
    this.rpmEncounterDuration = "1";
    this.durationChanged("1");
    this.rpmEncounterDto.note = this.sendAlertSmsObj.messageText;
    this.rpmEncounterDto.rpmServiceType = 1;
    this.addRpmEncounter();
  }
  addRpmEncounter(rpmEncounterModal?: ModalDirective) {
    this.isAddEncounter = true;
    if (this.selectedRpmAlert.patientId) {
      this.rpmEncounterDto.patientId = this.selectedRpmAlert.patientId;
    } else {
      this.rpmEncounterDto.patientId = this.selectedRpmAlert.id;
    }

    this.rpmEncounterDto.facilityUserId =
      this.securityService.securityObject.id;
    const hours = Math.floor(+this.rpmEncounterDuration / 60);
    const minutes = +this.rpmEncounterDuration % 60;
    this.rpmEncounterDto.duration = hours + ":" + minutes;
    if (hours > 0) {
      this.rpmEncounterDto.duration = moment(
        this.rpmEncounterDto.duration,
        "h:m"
      ).format("hh:mm");
    }
    // this.rpmEncounterDto.note = this.rpmEncounterDto.note + ' ' + this.disclaimer;
    this.rpmService.addRPMEncounter(this.rpmEncounterDto).subscribe(
      (res) => {
        this.GetRpmAlerts();
        this.GetMonthlyPatientsRmpData();
        this.filterPatients();
        this.isAddEncounter = false;
        this.patientEncounterMonthlyStatusAcknowledge = false;
        rpmEncounterModal.hide();
        if (this.rpmEncounterDto) {
          this.rpmEncounterDto = new RPMEncounterDto();
        }
        this.toaster.success("Rpm Encounter Added Successfully");
      },
      (error: HttpResError) => {
        this.isAddEncounter = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  GetPatientRPMDetails(row: RpmPatientsListDto) {
    this.selectedPatientRPMQC = row.qualityChecked;
    this.rpmEncounterTime = "";
    this.rpmEncounterList = [];
    this.getLogsByPatientAndMonthId();
    this.getRpmEncounterTime();
    this.GetRPMCarePlan(row);
    this.GetPHDevicesByPatientId(row);
  }
  getLogsByPatientAndMonthId() {
    this.rpmMonthId = moment(this.selectedDate, "YYYY-MM").month() + 1;
    this.rpmYearId = moment(this.selectedDate, "YYYY-MM").year();
    if (this.selectedPatient.id && this.rpmMonthId) {
      this.rpmService
        .getRPMEncounters(
          this.selectedPatient.id,
          this.rpmMonthId,
          this.rpmYearId
        )
        .subscribe(
          (res) => {
            this.rpmEncounterList = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  getRpmEncounterTime() {
    this.gettingRpmEncounterTimeDuration = true;
    const rpmMonthId = moment(this.selectedDate, "YYYY-MM").month() + 1;
    const rpmYearId = moment(this.selectedDate, "YYYY-MM").year();
    this.ccmService
      .GetRpmEncountersDurationByPatientId(
        this.selectedPatient.id,
        rpmMonthId,
        rpmYearId
      )
      .subscribe(
        (res: any) => {
          if (res.duration) {
            this.rpmEncounterTime = res.duration;
            this.rpmEncounterTime['durationInNumber'] = moment.duration(this.rpmEncounterTime.duration).asMinutes();
          } else {
            this.rpmEncounterTime.duration = "00:00:00";
            this.rpmEncounterTime['durationInNumber'] = 0;
          }
          // this.toaster.success('Data Updated Successfully');
          this.gettingRpmEncounterTimeDuration = false;
        },
        (error) => {
          this.rpmEncounterTime = "00:00:00";
          this.toaster.error(error.message, error.error || error.error);
          this.gettingRpmEncounterTimeDuration = false;
        }
      );
  }
  deletePatient() {
    this.patientsService.deletePatient(this.deletePatientDto).subscribe(
      (res: any) => {
        this.deletePatientDto.reasonDeleteDetails = "";
        this.deletePatientDto.reasonDeleted = 0;
        this.toaster.success("Patient deleted successfully.");
        // this.reason = '';
        this.filterPatients();
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  ConfirmREsetQC() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Reset QC";
    modalDto.Text =
      "Are you sure that you want to rest Quality Check for all patients.";
    modalDto.callBack = this.ResetQC;
    modalDto.data = {};
    this.appUi.openLazyConfrimModal(modalDto);
  }
  ResetQC = () => {
    this.rpmService.ResetQualityChecked(this.facilityId).subscribe(
      (res: any) => {
        this.toaster.success("Quality check reset successful.");
        // this.reason = '';
        this.filterPatients();
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  };
  // getCcmMonthlyStatusArray() {
  //   const keys = Object.keys(RPMDuration).filter(
  //     (k) => typeof RPMDuration[k as any] === 'number'
  //   ); // ["A", "B"]
  //   const values = keys.map((key) => ({
  //     number: RPMDuration[key as any],
  //     word: key,
  //   })); // [0, 1]
  //   this.ccmMonthlyStatusEnumList = values;
  //   return values;
  // }
  ngAfterViewInit() {
    this.tableEl2Page.setMaxVisibleItemsNumberTo(5);

    this.tableEl2Page.calculateFirstItemIndex();
    this.tableEl2Page.calculateLastItemIndex();
    this.tableEl1Page.setMaxVisibleItemsNumberTo(5);

    this.tableEl1Page.calculateFirstItemIndex();
    this.tableEl1Page.calculateLastItemIndex();
    this.cdRef.detectChanges();
    this.customListForPatientsListCompRef.filterPatientDto = this.filterPatientDto as any;
    this.dtTrigger.next();
    fromEvent(this.searchPatient.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        this.filterPatients();
      });
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    // this.subs.unsubscribe();
  }
  smsAlertDate() {
    this.sendAlertSmsObj = new SendAlertSmsDto();
    if (this.selectedRpmAlert.modality) {
      this.GetDefaultNotReceivedSmsContent();
    }
    // this.sendAlertSmsObj.timeOut = moment().format('YYYY-MM-DD h:mm:ss a');
  }
  SendAlertSms(modal: ModalDirective) {
    this.isSendingAlertSms = true;
    if (this.selectedRpmAlert.patientId) {
      this.sendAlertSmsObj.patientId = this.selectedRpmAlert.patientId;
    } else {
      this.sendAlertSmsObj.patientId = this.selectedRpmAlert.id;
    }
    // this.sendAlertSmsObj.patientId = this.selectedRpmAlert.id;
    this.sendAlertSmsObj.rpmAlertId = 0;
    this.sendAlertSmsObj.timeOut = moment(
      this.sendAlertSmsObj.timeOut,
      "YYYY-MM-DD h:mm:ss a"
    )
      .utc()
      .format("YYYY-MM-DD h:mm:ss a");
    this.sendAlertSmsObj.messageText =
      this.sendAlertSmsObj.messageText + " " + this.disclaimer;
    this.rpmService.SendAlertSms(this.sendAlertSmsObj).subscribe(
      (res: any) => {
        this.addEncounterOnSMS();
        this.isSendingAlertSms = false;
        modal.hide();
        this.toaster.success("Sms sent successfully");
        this.sendAlertSmsObj = new SendAlertSmsDto();
        this.GetRpmAlerts();
      },
      (error: HttpResError) => {
        this.isSendingAlertSms = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  selectedPatientsCareProviders() {
    this.assignRemoveCareProvidersToPatientsDto.careCoordinatorIdsToAssign = [];
    if (this.selected.length > 0) {
      this.selectedPatientsCareProvidersList =
        new Array<RPMCareCoordinatorForDisplay>();
      this.selected.forEach((patient) => {
        this.selectedPatientsCareProvidersList = [
          ...this.selectedPatientsCareProvidersList,
          ...patient.rpmCareCoordinators,
        ];
      });
      this.selectedPatientsCareProvidersList =
        this.selectedPatientsCareProvidersList.filter(
          (v, i) =>
            this.selectedPatientsCareProvidersList.findIndex(
              (item) => item.rpmCareCoordinatorId == v.rpmCareCoordinatorId
            ) === i
        );
      // if (this.selected.length === 1) {
      //   this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = this.selected[0].careFacilitatorId;
      // } else {
      // }
      this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = 0;
    }
  }
  assignRemoveCareProvidersToPatients(careProvider: any) {
    // AssignRemoveCareProvidersToPatients
    this.assignRemoveCareProvidersToPatientsDto.patientIds =
      new Array<number>();
    // this.tempSelectedPatientsCareProvidersList = new Array<
    //   CareProvidersListDto
    // >();
    // this.assignRemoveCareProvidersToPatientsDto.careProviderIdsToRemove = [];
    // if (careProvider) {
    //   this.tempSelectedPatientsCareProvidersList = [
    //     ...this.tempSelectedPatientsCareProvidersList,
    //     ...careProvider,
    //   ];
    //   this.tempSelectedPatientsCareProvidersList.forEach((el) => {
    //     this.assignRemoveCareProvidersToPatientsDto.careProviderIdsToRemove.push(
    //       el.careProviderId
    //     );
    //   });
    // }
    // this.assignRemoveCareProvidersToPatientsDto.careProviderIdsToAssign
    this.selected.forEach((element) => {
      this.assignRemoveCareProvidersToPatientsDto.patientIds.push(element.id);
    });
    if (!this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId) {
      this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = 0;
    }
    if (this.dateAssigned) {
      this.assignRemoveCareProvidersToPatientsDto.dateAssign =
        this.dateAssigned;
    }
    this.patientsService
      .AssignRemoveRPMCareCoordinatorsToPatients(
        this.assignRemoveCareProvidersToPatientsDto
      )
      .subscribe(
        (res) => {
          this.assignRemoveCareProvidersToPatientsDto =
            new AssignRPMCareCoordinatorsToPatientsDto();
          this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = 0;
          this.selectedPatientsCareProvidersList =
            new Array<RPMCareCoordinatorForDisplay>();
          this.filterPatients();
          // if (
          //   this.tempSelectedPatientsCareProvidersList.length ==
          //   this.selectedPatientsCareProvidersList.length
          // ) {
          //   this.selectedPatientsCareProvidersList = new Array<CareProvidersListDto>();
          // } else {
          //   if(careProvider) {
          //     this.selectedPatientsCareProvidersList = this.selectedPatientsCareProvidersList.filter(
          //       (Cp) => Cp.careProviderId !== careProvider.careProviderId
          //     );
          //   }
          // }
          this.toaster.success("Data updated successfully");
          // this.filterPatients();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  deSelectPatientCareProviders(id: number) {
    this.selectedPatientsCareProvidersList =
      this.selectedPatientsCareProvidersList.filter(
        (CP) => CP.rpmCareCoordinatorId !== id
      );
    this.assignRemoveCareProvidersToPatientsDto.coordinatorsIdsToRemove.push(
      id
    );
  }
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    if (e.target.checked) {
      this.selected.push(row);
      this.customListForPatientsListCompRef.selected = this.selected;
    } else {
      const index = this.selected.findIndex(
        (x) => x.patientId === row.patientId
      );
      this.selected.splice(index, 1);
      this.customListForPatientsListCompRef.selected = this.selected;
    }
  }
  initializeDataTable() {
    this.dtOptions = {
      pagingType: "first_last_numbers",
      scrollX: true,
      scrollCollapse: true,
      serverSide: true,
      stateSave: true,
      stateDuration: -1,
      stateSaveCallback: function (oSettings, oData) {
        localStorage.setItem(
          "DataTables_RPM" + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem("DataTables_RPM" + window.location.pathname)
        );
      },
      //         localStorage.removeItem( 'DataTables_'+window.location.pathname );
      // location.reload();
      responsive: true,
      processing: false,
      autoWidth: true,
      pageLength: this.filterPatientDto.pageSize,
      // displayStart: this.filterPatientDto.PageNumber,
      searching: false,
      paging: true,
      select: true,
      order: [],
      lengthMenu: [
        [10, 25, 50, 100],
        [10, 25, 50, 100],
      ],
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 1, orderable: false },
        { targets: 2, orderable: true },
        { targets: 3, orderable: true },
        { targets: 4, orderable: true },
        { targets: 5, orderable: true },
        { targets: 6, orderable: true },
        { targets: 7, orderable: true },
        { targets: 8, orderable: true },
        { targets: 9, orderable: true },
        { targets: 10, orderable: true },
        { targets: 11, orderable: true },
        // { targets: 7, orderable: false },
        // { targets: 8, orderable: false },
        // { targets: 11, orderable: false },
        // { targets: 2, orderDataType: 'num-fmt', orderable: false },
        { targets: 12, orderable: false },
      ],
      language: {
        paginate: {
          first: '<i class="fa fa-backward fa-lg"></i>',
          last: '<i class="fa fa-forward fa-lg"></i>',
        },
      },
      initComplete: function (aa) {
        // console.log('api', aa);
      },
      ajax: (dataTablesParameters: any, callback, settings) => {
        // if (this.filters) {
        //   // this.filterPatientDto.PageSize = dataTablesParameters.length;
        //   this.filterPatientDto.rowIndex = this.statementManagementService.filterPatientData.rowIndex;
        //   this.filterPatientDto.PageNumber = this.statementManagementService.filterPatientData.PageNumber;
        //   this.filterPatientDto.PageSize = this.statementManagementService.filterPatientData.PageSize;
        //   this.filters = '';
        // } else {

        if (dataTablesParameters.start === 1) {
          dataTablesParameters.start = 0;
        }
        // this.filterPatientDto.rowIndex = dataTablesParameters.start;
        this.rowIndex = dataTablesParameters.start;
        this.filterPatientDto.pageSize = dataTablesParameters.length;
        this.filterPatientDto.pageNumber =
          dataTablesParameters.start / dataTablesParameters.length + 1;
        this.filterPatientDto.pageNumber = Math.floor(
          this.filterPatientDto.pageNumber
        );
        if (
          dataTablesParameters.order.length > 0
        ) {
          const findFilterColumn = dataTablesParameters.columns.filter(
            (res) => {
              return res.data === dataTablesParameters.order[0].column;
            }
          );
          this.filterPatientDto.sortBy = findFilterColumn[0].name;
          if (dataTablesParameters.order[0].dir === "asc") {
            this.filterPatientDto.sortOrder = 0;
          }
          if (dataTablesParameters.order[0].dir === "desc") {
            this.filterPatientDto.sortOrder = 1;
          }
        }
        // if (
        //   this.securityService.securityObject.userType === UserType.FacilityUser
        // ) {
        //   this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
        // } else {
        //   this.filterPatientDto.facilityUserId = 0;
        // }
        this.filterPatientDto.facilityId = this.facilityId;
        this.filterPatientDto.serviceMonth = +moment(this.selectedDate).format(
          "MM"
        );
        this.filterPatientDto.serviceYear = +moment(this.selectedDate).format(
          "YYYY"
        );
        this.loadingOnStart = false;
        this.isLoading = true;
        if (!this.queryParamsApplied) {
          this.checkIfQueryParams();
        }
        this.filterDataService.filterData["rpmList"] = this.filterPatientDto;
        this.rpmService.GetRpmPatients(this.filterPatientDto).subscribe(
          (res: any) => {
            // if (this.isCFGet) {
            //   // setTimeout(() => {
            //     this.getFacilityUserByFacilityUserId();
            //   // }, 1000);
            // }
            // res.preventiveGapScreenDtos.forEach((element) => {
            //   // if (element.dob) {
            //   //   element.dob = moment.utc( element.dob).local().format('YYYY-MM-DD');
            //   // }
            // });
            this.isLoading = false;
            this.selected = [];
            this.rows = [];
            // this.rowIndex = this.filterPatientDto.rowIndex;
            this.rows = res.patientsList;
            res.patientsList.forEach((patient) => {
              if (patient.lastAppLaunchDate) {
                patient.isActiveMobileUser = false;
                patient.lastAppLaunchDate = moment
                  .utc(patient.lastAppLaunchDate)
                  .local();
                const today = moment();
                var duration = today.diff(patient.lastAppLaunchDate, "days");
                if (duration < 30) {
                  patient.isActiveMobileUser = true;
                }
                patient.lastAppLaunchDate = moment(patient.lastAppLaunchDate)
                  .local()
                  .format("D MMM YY,\\ h:mm a");
              }
              if (patient.lastStatusChangeDate) {
                patient.lastStatusChangeDate = moment(
                  patient.lastStatusChangeDate
                ).format("MMMM Do YYYY");
              }
              if (patient.lastStatusChangeDate && patient.statusChangedBy) {
                patient[
                  "LastStatusChangedByNameAndDate"
                ] = `${patient.lastStatusChangeDate}\n ${patient.statusChangedBy}`;
              } else {
                patient["LastStatusChangedByNameAndDate"] = "";
              }
            });
            this.pagingData = res.pagingData;
            this.table.page(this.pagingData.pageNumber).draw(false);
            callback({
              recordsTotal: this.pagingData.elementsCount,
              recordsFiltered: this.pagingData.elementsCount,
              data: [],
            });

            setTimeout(() => {
              this.redDraw();
            }, 50);
          },
          (err: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(err.error, err.message);
          }
        );
      },

      columns: [
        { name: "checkBox" },
        { name: "id" },
        { name: "name" },
        { name: "chat" },
        { name: "rpmTime" },
        { name: "transmissionDays" },
        { name: "rpmStatus" },
        { name: "rpmMonthlyStatus" },
        { name: "assignedDate" },
        { name: "lastVisit" },
        { name: "lastReadingDate" },
        { name: "lastLogDate" },
        { name: "rpmCareCoordinators" },
        // { name: "lastDone" },
        // { name: 'nextDue' },
        // { name: 'result' },
        // { name: 'note' },
        // { name: "action" },
      ],
    };
  }
  redDraw(): void {
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust();
      // console.log('dtInt', mydtInstance);
    });
    this.table.page(this.pagingData.pageNumber).draw(false);
  }
  onClickRow(row, event: MouseEvent) {
    this.rpmFilterDto.rpmStatus = this.rpmStatus;
    this.rpmFilterDto.rpmCoordinator = this.CareCordinatorId;
    this.rpmFilterDto.rpmFacilitator = this.CareFacilitatorId;
    this.filterDataService.rpmFilterDto = this.rpmFilterDto;
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.id;
    if (row.profileStatus) {
      // this.router.navigate(['/admin/patient/', row.id]);
      this.filterDataService.routeState = this.router.url;
      this.ApplyNavigation("/admin/patient/" + row.id, event.ctrlKey);
    } else {
      this.clickOnRow.show();
      // this.router.navigate(['/admin/addPatient/'+ row.id);
      // this.router.navigate(['/admin/addPatient/', row.id]);
    }
  }
  ApplyNavigation(url: string, isCtrl: boolean) {
    if (isCtrl) {
      const url1 = this.router.serializeUrl(
        this.router.createUrlTree([`${url}`])
      );
      const newWindow = window.open("", "_blank");
      newWindow.location.href = url;
      newWindow.focus();
      // const openW = window.open(url1, '_blank');
    } else {
      this.router.navigateByUrl(url);
    }
  }
  gridAllRowsCheckBoxChecked(e) {
    this.rows.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      Object.assign(this.selected, this.rows);
      this.customListForPatientsListCompRef.selected = this.selected;
    } else {
      this.selected = [];
      this.customListForPatientsListCompRef.selected = [];
    }
  }
  deselectCheckedRows(){
    this.selected = [];
    this.rows.forEach((data: any) => {
      data.checked = false;
    });
    this.gridCheckAll = false;
  }
  checkRpmRevoked(row) {
    this.revokeType = "RPM";
    if (row.isRPMRevoked) {
      this.ModelForRevokeMR();
      this.showAlertMessage();
      return;
    } else {
      this.SaveFilterState(row);
    }
  }
  ModelForRevokeMR() {
    this.showValidationAlert = `
        <div>
          <div class="d-flex justify-content-between">
            <div>
              <strong class="ml-3"></strong>
              <span>Patient ${this.revokeType} Consent is revoked.
              This patient is not eligible for this work.</span>
            </div>
            </div>
          </div>
        </div>`;
  }
  showAlertMessage() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Alert";
    modalDto.Text = this.showValidationAlert;
    // modalDto.hideProceed = true;
    // modalDto.callBack = this.SubmitEncounterTimeForm;
    modalDto.data = {};
    modalDto.rejectButtonText = "OK";
    // modalDto.acceptButtonText = ".";
    this.appUi.openLazyConfrimModal(modalDto);
  }
  async SaveFilterState(row: RpmPatientsListDto) {
    this.filterDataService.routeState = this.router.url;
    this.filterDataService.filterData["rpmList"] = this.filterPatientDto;
    this.rpmFilterDto.rpmStatus = this.rpmStatus;
    this.rpmFilterDto.rpmCoordinator = this.CareCordinatorId;
    this.rpmFilterDto.rpmFacilitator = this.CareFacilitatorId;
    this.filterDataService.rpmFilterDto = this.rpmFilterDto;
    // const isSaved = await this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { filterState: JSON.stringify(this.filterPatientDto) },
    //     queryParamsHandling: 'merge'
    //   });
    // if (isSaved) {
    // }
    this.router.navigateByUrl(`/rpm/PatientRpm/${row.id}`);
  }
  rerender(): void {
    // this.forRerendertable = false;
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust().draw();
    });
  }
  checkQuickActionsValue(){
    if(this.quickActions === 17){
      this.filterPatientDto.showInActivePatientsWithReadings = true;
      this.filterPatientDto.showActivePatientsWithNoReadings = false;
      this.filterPatientDto.showAll = false
      this.rpmStatus = -1;
    }
    if(this.quickActions === 16){
      this.filterPatientDto.showActivePatientsWithNoReadings = true;
      this.filterPatientDto.showInActivePatientsWithReadings = false;
      this.filterPatientDto.showAll = false;
      this.rpmStatus = -1;
    }
    if(this.quickActions === 15){
      this.filterPatientDto.showAll = true;
      this.filterPatientDto.showActivePatientsWithNoReadings = false;
      this.filterPatientDto.showInActivePatientsWithReadings = false;
      this.rpmStatus = -1;
      this.filterPatientDto.rpmStatus = -1;
    }
    if(this.quickActions >= 0 && this.quickActions < 7){
      this.filterPatientDto.showAll = false;
      this.filterPatientDto.showActivePatientsWithNoReadings = false;
      this.filterPatientDto.showInActivePatientsWithReadings = false;
      this.rpmStatus = this.quickActions;
      this.filterPatientDto.rpmStatus = this.quickActions;
    }

  }
  filterPatients() {
    this.filterDataService.filterData["rpmList"] = this.filterPatientDto;
    this.isLoading = true;
    this.filterPatientDto.careFacilitatorId = this.CareFacilitatorId;
    this.filterPatientDto.rpmCareCoordinatorId = this.CareCordinatorId;
    this.filterPatientDto.filteredMonth = this.selectedDate;
    if (this.rpmStatus == null || this.rpmStatus == undefined) {
      this.filterPatientDto.rpmStatus = -1;
    } else {
      this.filterPatientDto.rpmStatus = this.rpmStatus;
    }
    this.assignUserValues();
    this.rerender();
  }
  assignUserValues() {
    this.isLoading = true;
    const fPDto = new RpmPatientsScreenParams();
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    // this.filterPatientDtoforExcelFile = this.filterPatientDto;
  }
  GetRpmAlerts() {
    this.isAlertLoading = true;
    this.rpmService.GetRPMAlertsForDashboard(0, this.facilityId).subscribe(
      (res: any) => {
        this.isAlertLoading = false;
        this.rpmAlertListDto = res;
        if (this.rpmAlertListDto && this.rpmAlertListDto.length) {
          this.rpmAlertListOutOfRange = this.rpmAlertListDto.filter(
            (x) => x.alertReason === AlertReason.OutOfRange
          );
          this.rpmAlertListOutOfRange.forEach((rpmAlert) => {
            rpmAlert.measurementDate = moment(rpmAlert.measurementDate).format(
              "YYYY-MM-DD hh:mm A"
            );
          });
          this.rpmAlertListTimeLapse = this.rpmAlertListDto.filter(
            (x) => x.alertReason === AlertReason.NotReceived
          );
          // this.rpmAlertListTimeLapse = this.rpmAlertListDto;
        } else {
          this.rpmAlertListOutOfRange = [];
          this.rpmAlertListTimeLapse = [];
        }
        this.tableEl2.setDataSource(this.rpmAlertListOutOfRange);
        this.tableEl1.setDataSource(this.rpmAlertListTimeLapse);

        this.CalculateAddressedCOunt();
        // this.rpmAlertListDto.forEach(element => {
        //   if (element.callTime) {
        //     element.callTime = moment.utc(element.callTime).local().format('DD MMM h:mm a');
        //   }
        //   if (element.smsTime ) {
        //     element.smsTime = moment.utc(element.smsTime).local().format('DD MMM h:mm a');
        //   }
        //   if (element.dueTime ) {
        //     element.dueTime = moment.utc(element.dueTime).local().format('DD MMM h:mm a');
        //   }
        //   if (element.timeOut ) {
        //     element.timeOut = moment.utc(element.timeOut).local().format('DD MMM h:mm a');
        //   }
        //   if (element.alertTime) {
        //     element.alertTime = moment.utc(element.alertTime).local().format('DD MMM h:mm a');
        //   }
        // });
      },
      (error: HttpResError) => {
        this.isAlertLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  CalculateAddressedCOunt() {
    this.outOfRangeAddressedCount = 0;
    this.timeLapseAddressedCount = 0;
    this.rpmAlertListOutOfRange.forEach((element) => {
      if (element.addressedById) {
        this.outOfRangeAddressedCount = this.outOfRangeAddressedCount + 1;
      }
    });
    this.rpmAlertListTimeLapse.forEach((element) => {
      if (element.addressedById) {
        this.timeLapseAddressedCount = this.timeLapseAddressedCount + 1;
      }
    });
  }
  getFacilityUserByFacilityUserId() {
    this.facilityService.getFacilityUserById(this.facilityUserId).subscribe(
      (res: any) => {
        if (res.roles) {
          const rolesList = res.roles.split(",");
          rolesList.forEach((x) => {
            if (x == "Care Facilitator") {
              this.CareFacilitatorId = this.securityService.securityObject.id;
              // setTimeout(() => {
              this.filterPatients();
              this.isCFGet = false;
              // }, 1000);
            }
          });
        }
        this.GetMonthlyPatientsRmpData();
      },
      (error) => {
        this.GetMonthlyPatientsRmpData();
        this.toaster.error(error.error);
      }
    );
  }

  getCareFacilitatorsList() {
    let roleName = "Care Facilitator";
    //  this.isLoadingPayersList = true;
    this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.careFacilitatorsList = res;
        //  this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        //  this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  delayForMouseOverRPMMSToolTip(pId: number) {
    this.rpmMSToolTip = ''
    this.loadingRPMMSToolTip = true;
    const timeOutRef = setTimeout(() => {
      if (this.RPMMSTooltipOverRef[pId]) {
        this.GetRPmMsHistoryToolTip(pId);
      }
    }, 600);
    this.RPMMSTooltipOverRef[pId] = timeOutRef;
  }
  clearMouseIntervalRPMMSToolTip(pId: number) {
    this.RPMMSTooltipOverRef[pId] = "";
    this.rpmMSToolTip = ''
  }
  GetRPmMsHistoryToolTip(pId: number) {
    this.loadingRPMMSToolTip = true;
    this.subs.sink = this.rpmService
      .GetRpmMsHistoryToolTip(pId)
      .subscribe(
        (res: {name: string, date: string}) => {
          this.loadingRPMMSToolTip = false;
          let nData = moment.utc(res.date).local().format('D MMM YY,\\ h:mm a')
          this.rpmMSToolTip = `${nData} <br> ${res.name}`

          // this.patientActieServicesDto = res;
        },
        (err: HttpResError) => {
          this.loadingRPMMSToolTip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getCareProvidersList() {
    let roleName = "Care Coordinator";
    //  this.isLoadingPayersList = true;
    this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.careProvidersList = res;
        //  this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        //  this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  checkShowAllValue() {
    if (this.filterPatientDto.showAll) {
      this.rpmStatus = null;
      this.quickActions = 15;
    } else {
      this.rpmStatus = 0;
      this.quickActions = 0;
    }
    this.GetMonthlyPatientsRmpData();
    //  this.filterPatients();
  }

  filterByMonth(date) {
    this.filterMonthYear = moment(date.date).format('MM YYYY');
    this.GetMonthlyPatientsRmpData(date);
    this.filterPatients();
  }
  GetMonthlyPatientsRmpData(date?) {
    //  this.isLoadingPayersList = true;
    var filterDto = new RmpDashboardParamsDto();
    if (this.CareCordinatorId == null) {
      this.CareCordinatorId = 0;
    }
    if (this.CareFacilitatorId == null) {
      this.CareFacilitatorId = 0;
    }
    // if(this.rpmStatus == null || this.rpmStatus == undefined) {
    //   this.filterPatientDto.rpmStatus = -1;
    // } else {
    //   this.filterPatientDto.rpmStatus = this.rpmStatus;
    // }
    if (date) {
      this.selectedDate = moment(date.date).format("YYYY-MM");
      this.filterDataService.selectedRPMDashboardDate = moment(date.date).format("YYYY-MM");
    }
    filterDto.status = 0;
    filterDto.CareCoordinatorId = this.CareCordinatorId;
    filterDto.CareFacilitatorId = this.CareFacilitatorId;
    filterDto.FilteredMonth = this.selectedDate;
    filterDto.FacilityId = this.facilityId;
    this.rpmService.GetMonthlyPatientsRmpData(filterDto).subscribe(
      (res: RmpDashboardDataDto) => {
        this.rmpDashboardDataDto = res;
        //  this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        //  this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SetAddressedBy(alert: RpmAlertListDto) {
    this.getPatientById(alert);
    this.rpmService
      .SetAddressedBy({
        facilityUserId: this.securityService.securityObject.id,
        alertId: alert.id,
      })
      .subscribe(
        (res) => {
          alert.addressedById = this.securityService.securityObject.id;
          this.CalculateAddressedCOunt();
          //  this.isLoadingPayersList = false;
        },
        (error: HttpResError) => {
          //  this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  getPatientById(alert: RpmAlertListDto) {
    this.patientsService.getPatientDetail(alert.patientId).subscribe(
      (res: PatientDto) => {
        this.OpenEncounterModal(alert, res);
      }, (err) => {
        this.toaster.error(err.error, err.message);
      })

  }
  OpenEncounterModal(alert: RpmAlertListDto, patient: PatientDto) {
    const encounterObj = new RPMEncounterDto()
    encounterObj.rpmServiceType = RPMServiceType['Data Analysis']
    encounterObj.duration = 5 as any;
    if (alert.modality == Modalities.BP) {
      this.SmartPhraseSelected(alert, 'BP', patient)
    } else if (alert.modality == Modalities.BG) {
      this.SmartPhraseSelected(alert, 'BG', patient)
    } else if (alert.modality == Modalities.PO) {
      this.SmartPhraseSelected(alert, 'PO', patient)
    } else if (alert.modality == Modalities.WT) {
      this.SmartPhraseSelected(alert, 'WT', patient)
    } else {
      this.openRpmQuickEncountersModal(patient, encounterObj, alert)
    }
  }
  SmartPhraseSelected(alert: RpmAlertListDto, code: string, patient: PatientDto) {
    this.usingSMartPhrase = true;
    this.intellisenseService.GetModalityReviewText(alert.patientId, code, alert.id).subscribe(
      (res: any) => {
        this.usingSMartPhrase = false;
        const encounterObj = new RPMEncounterDto()
        encounterObj.rpmServiceType = RPMServiceType['Data Analysis']
        encounterObj.duration = 5 as any;
        if (res) {
           if (AlertReason.OutOfRange ==  alert.alertReason) {
            // let nText = `Patient reading noted to be out of range. Reading was taken on ${alert.measurementDate}.  [${code}] is [${alert.reading}]. `
            // res  = nText + res;
          }
          if (AlertReason.NotReceived ==  alert.alertReason) {
            // let nText = `Patient reading has not been received. `
            // res  = nText + res;
           }
          encounterObj.note = res
        }
        this.openRpmQuickEncountersModal(patient, encounterObj, alert)
      },
      (error: HttpResError) => {
        this.usingSMartPhrase = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openRpmQuickEncountersModal(patient, encounterObj, alert){
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.OpenRPMQuickEncounter;
    emitObj.value = {
      type: EventTypes.OpenRPMQuickEncounter.toString(),
      data: {
        patient: patient,
        encounterObj,
        config: {
          hideTimer: true
        },
        alerts: alert
      },

    };
    this.eventBus.emit(emitObj);
  }
  openComplaintsModal(data: RpmPatientsListDto) {
    const event = new EmitEvent();
    event.name = EventTypes.openComplaintsModal;
    event.value = data;
    this.eventBus.emit(event);
  }
  OpenEncounterLogsModal(patient: RpmPatientsListDto, Modal: ModalDirective) {
    let nUrl = localStorage.getItem("switchLocal")
      ? environment.localBaseUrl
      : environment.baseUrl;
    nUrl = environment.appUrl;
    nUrl = nUrl + `customUrl/logsHistory/${patient.id}`;
    nUrl += "?isIframe=true&viewType=RPM";
    // nUrl = `http://localhost:4200/customUrl/logsHistory/${patient.id}?isIframe=true&viewType=RPM`;
    this.ccmLogsModalLink = this.sanatizer.bypassSecurityTrustResourceUrl(
      nUrl
    ) as string;
    Modal.show();
  }
  loadDiagnoses(PatientId: number) {
    this.PatientId = PatientId;
    if (this.PatientId) {
      this.subs = this.patientsService
        .GetDiagnosesByPatientId(this.PatientId)
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            this.tabledata = res;

            // if (res && res.length >= 0) {
            //   this.selecteChronicDiseaseList = res;
            // }
          },
          (error) => {
            this.isLoading = false;
            // console.log(error);
          }
        );
    }
  }
  navigation(patientId) {
    this.router.navigateByUrl(
      "/admin/patient/" + patientId + "/" + "pDetail/pDiagnoses"
    );
  }
  openPatientNote(row) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenPatientNote;
    event.value = row.id;
    this.eventBus.emit(event);
  }
  onCloseRpmQualityCheckModal() {
    this.selectedModalityCode = "";
    this.devicesList = new Array<RPMDeviceListDtoNew>();
  }
  openRpmDownloadModal() {
    this.downloadRpmDataModal.show();
    this.downloadData = '';
    // if (this.selected && this.selected.length > 0) {
    // } else {
    // }
  }
  OpenRPMGuidePDF() {
    fetch("/assets/Docs/RPM_Alert_Guide.pdf").then(async (fdata: any) => {
      const slknasl = await fdata.blob();
      const blob = new Blob([slknasl], { type: "application/pdf" });
      const objectURL = URL.createObjectURL(blob);
      this.objectURLStrAW = objectURL;
      this.viewPdfModal.show();
      // importantStuff.location.href = objectURL;
      // window.open(objectURL, '_blank');
    });
  }
  OpenQuickViewModal(row: RpmPatientsListDto) {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `insights/summary/${row.id}`;
    this.eventBus.emit(emitObj);
  }
  OpenPatientSetting(row: RpmPatientsListDto) {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `insights/setting/sms-voice-consent/${row.id}`;
    this.eventBus.emit(emitObj);
  }
  OpenRpmNotifications(row: RpmPatientsListDto) {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `insights/setting/rpmNotifications/${row.id}`;
    this.eventBus.emit(emitObj);
  }
  OpenRPMEncounterModel() {
    const monthId = +moment(this.selectedDate).format("MM");
    const yearId = +moment(this.selectedDate).format("YYYY");
    this.commService.GetCommunicationHistory(this.selectedPatient?.id, monthId , yearId).subscribe(
      (res: { pagingData: PagingData, results: PatientCommunicationHistoryDto[] }) => {

        if (res.results?.length) {
          let commHistory = res.results.reverse();
          commHistory = commHistory.filter(x => x.serviceType == null)
          commHistory.forEach(item => {
            item.shortCode = item.senderName?.getShortCode();
            item.timeStamp = moment.utc(item.timeStamp).local().format('MMM DD,\\ hh:mm a');
            item.selected = true
          });

          let copyText = ``;
          let facilityName = this.securityService?.getClaim('FacilityName')?.claimValue
          commHistory.forEach(x => {
            if (x.selected) {
              const nTime = moment(x.timeStamp).format('DD MMM')
              copyText += `${nTime} ${x.senderName}@${facilityName || ''}:  ${x.message || ''} \n`;
            }
          });
          navigator.clipboard.writeText(copyText);
          const currentPatient = this.cloneService.deepClone<PatientDto>(this.selectedPatient);
          // currentPatient.id = this.selectedPatient?.patientId
          this.commService.OpenRPMEncounterModel(currentPatient, copyText, commHistory)
        }
        this.pagingData = res.pagingData;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getRpmReadingHistory() {
    this.getRpmModalityStatistics();
    if (this.selectedRpmAlertOutOfRange.modality == "Blood Pressure") {
      this.GetBPDeviceDisplayData();
      this.isBpDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Weight") {
      this.GetWeightDeviceDatabyPatientId();
      this.isWtDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Pulse Oximetry") {
      this.GetPulseDeviceDatabyPatientId();
      this.isPoDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Blood Glucose") {
      this.GetBloodGlucoseDeviceDatabyPatientId();
      this.isBgDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Activity") {
      this.GetActivityDeviceDatabyPatientId();
      this.isAtDevice = true;
    }
    this.outOfRangeAlertsHistoryModal.show();
  }
  getRpmModalityStatistics() {
    this.isLoadingRpmModalityStatistics = true;
    this.rpmService
      .getRpmModalityStatistics(this.selectedRpmAlertOutOfRange.patientId)
      .subscribe(
        (res: any) => {
          this.bloodPressureStatistics = res.bloodPressureStatistics;
          this.bloodGlucoseStatistics = res.bloodGlucoseStatistics;
          this.weightStatistics = res.weightStatistics;
          this.isLoadingRpmModalityStatistics = false;
          console.log(res);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isLoadingRpmModalityStatistics = false;
        }
      );
  }
  GetBPDeviceDisplayData() {
    this.gettingBpData = true;
    const lastThirtyDays = true;
    this.rpmService
      .GetBPDisplayData(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: BPDeviceDataDto[]) => {
          if (res) {
            res.forEach((element) => {
              element.measurementDate = moment(element.measurementDate).format(
                "D MMM YY,\\ h:mm a"
              );
            });
            this.bpReadingDayCount = res
              .map((x) => x.measurementDate)
              .map((x) => moment(x).format("YYYY-MM-DD"))
              .filter((item, i, ar) => ar.indexOf(item) === i).length;
            // res = this.dataFilterService.distictArrayByProperty(res, 'measurementDate');
            // above code distinct reading on the basis of date time
          }
          this.BPDeviceDataList = this.cloneService.deepClone(res);
          if (res) {
            this.PatientTestData = res.reverse();
            const highPressure = new Array<number>();
            const lowPressure = new Array<number>();
            const heartRate = new Array<number>();
            const bpl = new Array<number>();
            const tempLabels = new Array<string>();
            if (this.PatientTestData && this.PatientTestData.length > 0) {
              this.PatientTestData.forEach(
                (element: BPDeviceDataDto, index: number) => {
                  // tempLabels.push((index + 1).toString());
                  tempLabels.push(
                    // moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                    element.measurementDate
                  );
                  highPressure.push(element.highPressure);
                  lowPressure.push(element.lowPressure);
                  heartRate.push(element.heartRate);
                  bpl.push(element.bpl);
                }
              );
              const tempArr = new Array<any>();
              tempArr.push({ data: highPressure, label: "Systoliac" });
              tempArr.push({ data: lowPressure, label: "Diastolic" });
              // tempArr.push({ data: heartRate, label: 'Heart Rate' });
              // tempArr.push({ data: bpl, label: 'BPL' });
              this.DeviceBarChartLabels = tempLabels;
              this.DeviceBarChartData = tempArr;
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'line',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: this.DeviceBarChartLabels,
            //     data: this.DeviceBarChartData
            //   }
            // });
          }
          this.gettingBpData = false;
          // this.toaster.success('data saved successfully.');
        },
        (error) => {
          this.gettingBpData = false;
          this.toaster.error(error.message, error.error || error.error);
          return null;
        }
      );
  }
  GetWeightDeviceDatabyPatientId() {
    this.gettingWTData = true;
    const lastThirtyDays = true;
    this.rpmService
      .GetWeightDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          if (res) {
            res.forEach((element) => {
              element.measurementDate = moment(element.measurementDate).format(
                "D MMM YY,\\ h:mm a"
              );
            });
            this.wtReadingDayCount = res
              .map((x) => x.measurementDate)
              .map((x) => moment(x).format("YYYY-MM-DD"))
              .filter((item, i, ar) => ar.indexOf(item) === i).length;
            res = this.dataFilterService.distictArrayByProperty(
              res,
              "measurementDate"
            );
          }
          this.weightDataList = res;
          if (res) {
            const muscaleValue = new Array<number>();
            const waterValue = new Array<number>();
            const weightValue = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  // moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                  element.measurementDate
                );
                muscaleValue.push(element.muscaleValue);
                waterValue.push(element.waterValue);
                weightValue.push(element.weightValue);
              });
              // tempArr.push({ data: muscaleValue, label: 'Muscale Value' });
              // tempArr.push({ data: waterValue, label: 'Water Value' });
              tempArr.push({ data: weightValue, label: "Weight Value" });
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'bar',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: tempLabels,
            //     data: tempArr
            //   }
            // });
          }
          this.gettingWTData = false;
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.gettingWTData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetPulseDeviceDatabyPatientId() {
    const lastThirtyDays = true;
    this.rpmService
      .GetPulseDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.pulseOximetryDataList = res;
          if (res) {
            const bloodOxygen = new Array<number>();
            const heartRate = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  moment
                    .utc(element.measurementDate)
                    .local()
                    .format("D MMM YY,\\ h:mm a")
                );
                bloodOxygen.push(element.bloodOxygen);
                heartRate.push(element.heartRate);
              });
              tempArr.push({ data: bloodOxygen, label: "Blood Oxygen" });
              tempArr.push({ data: heartRate, label: "Heart Rate" });
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'horizontalBar',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: tempLabels,
            //     data: tempArr
            //   }
            // });
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetBloodGlucoseDeviceDatabyPatientId() {
    this.gettingBGData = true;
    const lastThirtyDays = true;
    this.rpmService
      .GetBloodGlucoseDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          if (res) {
            res = res.reverse();
            res.forEach((element1) => {
              element1.measurementDate = moment(
                element1.measurementDate
              ).format("D MMM YY,\\ h:mm a");
            });
            this.bgReadingDayCount = res
              .map((x) => x.measurementDate)
              .map((x) => moment(x).format("YYYY-MM-DD"))
              .filter((item, i, ar) => ar.indexOf(item) === i).length;
            res = this.dataFilterService.distictArrayByProperty(
              res,
              "measurementDate"
            );
          }
          this.BGDeviceDataList = res;
          if (res) {
            const bloodGlucose = new Array<number>();
            const dinnerSituation = new Array<number>();
            const tempArr = new Array<ChartDataSets>();
            let tempLabels = new Array<string>();
            const rData = this.dataFilterService.groupByProp(
              this.BGDeviceDataList,
              "dinnerSituation"
            );
            this.BGDeviceDataList = this.BGDeviceDataList.reverse();
            this.bgCHartData = rData;
            if (res && res.length > 0) {
              rData.forEach((item: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                item.value.forEach((element2: BGDeviceDataDto) => {
                  // const xLabelFormat = moment(element2.measurementDate, 'D MMM YY,\\ h:mm a').format('D MMM \\ h:mm a');
                  tempLabels.push(
                    // moment.utc(element2.measurementDate).local().format('D MMM YY,\\ h:mm a')
                    // moment(element2.measurementDate).format('D MMM YY,\\ h:mm a')
                    element2.measurementDate
                  );
                });
                // tempArr.push({ data: item.value.map((x: BGDeviceDataDto) => x.bg), label: item.key });
              });
            }
            tempLabels = tempLabels.sort((left, right) => {
              const ssd = moment(left, "D MMM YY,\\ h:mm a").diff(
                moment(right, "D MMM YY,\\ h:mm a")
              );
              return ssd;
            });
            rData.forEach((item, index) => {
              const dataSet: ChartDataSets = {};
              dataSet.label = item.key;
              dataSet.data = [];
              dataSet.backgroundColor =
                this.chartColors[0].backgroundColor[index];
              dataSet.borderColor = this.chartColors[0].borderColor[index];
              dataSet.borderWidth = 1;
              tempLabels.forEach((element3) => {
                const currentDate = element3;
                element3 = moment(element3, "D MMM YY,\\ h:mm a").format(
                  "D MMM \\ h:mm a"
                );
                const existDate = item.value.find(
                  (row: BGDeviceDataDto) => row.measurementDate === currentDate
                );
                if (existDate) {
                  dataSet.data.push(existDate.bg);
                } else {
                  dataSet.data.push(null);
                }
              });
              tempArr.push(dataSet);
            });

            // this.patientDevicesDataList.push({
            //   chartType: 'horizontalBar',
            //   deviceObj: device,
            //   deviceData:
            //   // [
            //     {
            //       labels: tempLabels,
            //       data: tempArr
            //     }
            //   // ]
            // });
          }
          this.gettingBGData = false;
          // console.log(this.devicesList);
          // this.selectGraph();
        },
        (error: HttpResError) => {
          this.gettingBGData = true;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetActivityDeviceDatabyPatientId() {
    const lastThirtyDays = true;
    this.rpmService
      .GetActivityDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.activityDataList = res;
          if (res) {
            const steps = new Array<number>();
            const calories = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  moment
                    .utc(element.measurementDate)
                    .local()
                    .format("D MMM YY,\\ h:mm a")
                );
                steps.push(element.steps);
                calories.push(element.calories);
              });
              tempArr.push({ data: steps, label: "Steps" });
              tempArr.push({ data: calories, label: "Calories" });
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'line',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: tempLabels,
            //     data: tempArr
            //   }
            // });
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  selectDate(value: any, datepicker?: any, type?: string) {
    if (type == "assignDate") {
      this.filterPatientDto.DateAssignedFrom = value.start.format("YYYY-MM-DD");
      this.filterPatientDto.DateAssignedTo = value.end.format("YYYY-MM-DD");
    }
    if (type == "lastReadingDate") {
      this.filterPatientDto.lastReadingStartDate =
        value.start.format("YYYY-MM-DD");
      this.filterPatientDto.lastReadingEndDate = value.end.format("YYYY-MM-DD");
    }
    if (type == "lastLogDate") {
      this.filterPatientDto.lastLogStartDate = value.start.format("YYYY-MM-DD");
      this.filterPatientDto.lastLogEndDate = value.end.format("YYYY-MM-DD");
    }
  }
  clearDate(type?: string) {
    if (type == "assignDate") {
      this.daterange = {};
      this.selectedDateRange = [];
      this.filterPatientDto.DateAssignedTo = "";
      this.filterPatientDto.DateAssignedFrom = "";
    }
    if (type == "lastReadingDate") {
      this.daterangeOfLastReading = {};
      this.selectedDateRangeOfLastReading = [];
      this.filterPatientDto.lastReadingStartDate = "";
      this.filterPatientDto.lastReadingEndDate = "";
    }
    if (type == "lastLogDate") {
      this.daterangeOfLastLog = {};
      this.selectedDateRangeOfLastLog = [];
      this.filterPatientDto.lastLogStartDate = "";
      this.filterPatientDto.lastLogEndDate = "";
    }
  }
  fillSection() {
    if (
      this.filterPatientDto.rpmTimeRange == ([0] as any) ||
      this.filterPatientDto.rpmTimeRange == ([1] as any) ||
      this.filterPatientDto.rpmTimeRange == ([2] as any) ||
      this.filterPatientDto.rpmTimeRange == ([3] as any)
    ) {
      this.filterPatientDto.section = "A";
    } else if (
      this.filterPatientDto.rpmTimeRange == ([4] as any) ||
      this.filterPatientDto.rpmTimeRange == ([5] as any) ||
      this.filterPatientDto.rpmTimeRange == ([6] as any) ||
      this.filterPatientDto.rpmTimeRange == ([7] as any)
    ) {
      this.filterPatientDto.section = "B";
    } else {
      this.filterPatientDto.section = "C";
    }
  }
  scrollToTable() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: ".ccm-datatable",
    });
  }

  GetRPMPatientListExcelFile() {
    this.isDownloadingPatientsData = true;
    this.rpmService.getRPMPatientListExcelFile(this.filterPatientDto).subscribe(
      (res: any) => {
        FileSaver.saveAs(
          new Blob([res], { type: "application/csv" }),
          `${this.securityService.getClaim('FacilityName')?.claimValue} - RPM Patient List.csv`
        );
        this.isDownloadingPatientsData = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
        this.isDownloadingPatientsData = false;
      }
    );
  }
  assignTransmissionDate() {
    this.filterPatientDto.FromTransmissionDays = this.fromTransmissionDays;
    this.filterPatientDto.ToTransmissionDays = this.toTransmissionDays;
    this.fromTransmissionDays = null;
    this.toTransmissionDays = null;
  }
  resetFilters() {
    const customId = this.filterPatientDto.customListId;
    this.filterPatientDto = new RpmPatientsScreenParams();
    this.filterPatientDto.customListId = customId;
    this.filterPatientDto.pageNumber = 1;
    this.clearDate("assignDate");
    this.clearDate("lastReadingDate");
    this.clearDate("lastLogDate");
    this.sectionSelection = "";
    this.quickActions = 0;
    this.rpmStatus = 0;
    // this.initializeParams();
    this.resetSorting()
    this.filterPatients();
  }
  resetSorting(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.order([]).draw();
    });
  }
  clearData() {
    this.BGDeviceDataList = new Array<BGDeviceDataDto>();
    this.BPDeviceDataList = new Array<BPDeviceDataDto>();
    this.weightDataList = new Array<WeightDataDto>();
    this.activityDataList = new Array<ActivityDataDto>();
    this.pulseOximetryDataList = new Array<PulseOximetryDataDto>();
    this.isBpDevice = false;
    this.isWtDevice = false;
    this.isPoDevice = false;
    this.isBgDevice = false;
    this.isAtDevice = false;
  }
  filterMonthlyStatus(currentValue) {
    if (currentValue === '') {
      this.filterPatientDto.rpmMonthlyStatus = [''];
    }
    if (currentValue === '') {
      this.filterPatientDto.rpmMonthlyStatus = [''];
    }
    if (
      !this.filterPatientDto.rpmMonthlyStatus ||
      !this.filterPatientDto.rpmMonthlyStatus.length
    ) {
      this.filterPatientDto.rpmMonthlyStatus = [''];
    }
    if (this.filterPatientDto.rpmMonthlyStatus.length > 1) {
      this.filterPatientDto.rpmMonthlyStatus =
        this.filterPatientDto.rpmMonthlyStatus.filter((x) => x !== '');
    }
  }
  fillRpmMonthlyStatusValue(){
    if (
      !this.filterPatientDto.rpmMonthlyStatus ||
      !this.filterPatientDto.rpmMonthlyStatus.length
    ) {
      this.filterPatientDto.rpmMonthlyStatus = [''];
    }
  }
  filterEcounterTime(currentValue) {
    if (currentValue == null) {
      this.filterPatientDto.rpmTimeRange = [-1];
    }
    if (currentValue === -1) {
      this.filterPatientDto.rpmTimeRange = [-1];
    }
    if (
      !this.filterPatientDto.rpmTimeRange ||
      !this.filterPatientDto.rpmTimeRange.length
    ) {
      this.filterPatientDto.rpmTimeRange = [-1];
    }
    if (this.filterPatientDto.rpmTimeRange.length > 1) {
      this.filterPatientDto.rpmTimeRange =
        this.filterPatientDto.rpmTimeRange.filter((x) => x !== -1);
    }
  }
  rpmMonthlyStatusFilterChanged() {
    let rpmMonthlyStatusList = this.filterPatientDto.rpmMonthlyStatus as any;
    if (
      !this.filterPatientDto.rpmMonthlyStatus ||
      !rpmMonthlyStatusList.length
    ) {
      this.filterPatientDto.rpmMonthlyStatus = [''] as any;
      rpmMonthlyStatusList = this.filterPatientDto.rpmMonthlyStatus as any;
    }
    if (
      rpmMonthlyStatusList &&
      rpmMonthlyStatusList.length === 1 &&
      rpmMonthlyStatusList.includes('')
    ) {
    } else {
      rpmMonthlyStatusList = rpmMonthlyStatusList.filter((x) => x !== '');
      this.filterPatientDto.rpmMonthlyStatus = rpmMonthlyStatusList;
    }
  }
  fillValue() {
    if (
      !this.filterPatientDto.rpmTimeRange ||
      !this.filterPatientDto.rpmTimeRange.length
    ) {
      this.filterPatientDto.rpmTimeRange = [-1];
    }
  }
  getChatGroup(patient: PatientDto, viewMode?: ChatViewType) {
    // this.gettingChatGroup = true;
    // this.twocChatService
    //   .GetPersonalChatGroup(
    //     this.securityService.securityObject.appUserId,
    //     userId
    //   )
    //   .subscribe(
    //     (res: ChatGroupDto) => {
    //       this.gettingChatGroup = false;
    //       const event = new EmitEvent();
    //       event.name = EventTypes.OpenCommunicationModal;
    //       res['viewMode'] = viewMode || ChatViewType.Chat;
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
      chatGroup.id = patient.id;
      chatGroup.name = `${patient.firstName} ${patient.lastName}`;
      chatGroup.lastCommunication = null
      event.value = chatGroup;
      this.eventBus.emit(event);
  }
  clearDatePickerSelection() {
    this.showAssignDateField = false;
    setTimeout(() => {
      this.showAssignDateField = true;
    }, 300);
  }
  clearLastReadingDateSelection() {
    this.showLastReadingDateField = false;
    setTimeout(() => {
      this.showLastReadingDateField = true;
    }, 300);
  }
  clearLastLogDateSelection() {
    this.showLastLogDateField = false;
    setTimeout(() => {
      this.showLastLogDateField = true;
    }, 300);
  }
  getRpmStatusHistory(patientId) {
    this.isLoadingRpmStatusHistory = true;
    this.rpmService.GetPatientRPMStatusHistory(patientId).subscribe(
      (res: any) => {
        this.rpmStatusHistoryList = res;
        this.isLoadingRpmStatusHistory = false;
        this.rpmStatusHistoryModal.show();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingRpmStatusHistory = false;
      }
    );
  }
  GetCustomListsByFacilityUserId() {
    // this.isLoadingPayersList = true;
    this.customListService
      .GetCustomListsByFacilityUserId(this.facilityUserId)
      .subscribe(
        (res: any) => {
          this.CustomListDto = res.customListsDto;
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  MakeCustomListExcel() {
    this.isMakingExcel = true;
    this.ExcelData = [];
    this.ExcelData = new Array<{
      'EMR ID': string;
      'Patient Name': string;
      'Primary Number': string;
      'Secondary Number': string;
      'Emergency Contact Name': string;
      'Emergency Contact Relationship': string;
      'Emergency Contact Primary Phone Number': string;
      'Emergency Contact Secondary Phone Number': string;
      'Patient Insurance': string;
      'Date of Birth': string;
      'CCM Time': string;
      'CCM Status': string;
      'CCM MS': string;
      'Last CCM': string;
      'Rpm Status': string;
      'Last Visit': string;
      'Quality Checked': string;
      'Assigned Date': string;
      'Billing Provider': string;
      'Care Facilitator': string;
      'Care Provider': string;
    }>();

    this.CreateExcelData();
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'SheetJS Tutorial',
      Subject: 'Test',
      Author: 'Talha Ikram',
      CreatedDate: new Date(),
      Company: 'Premier Solutions',
    };
    let sheetName = 'Custom List';
    wb.SheetNames.push(sheetName);
    const ws_data = [['hello', 'world']];
    const ws = XLSX.utils.json_to_sheet<any>(this.ExcelData, {
      skipHeader: false,
    });
    const wscols = [
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws['!cols'] = wscols;
    wb.Sheets[sheetName] = ws;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s: any) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }
    const FileName = moment().format('YYYY-MM-DD hh:mm A');
    // const FileName = this.selectedCustomListName;
    this.isMakingExcel = false;
    FileSaver.saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      'Custom List ' + FileName + '.xlsx'
    );
  }
  CreateExcelData() {

    this.rows.forEach((item) => {
      if (item.dateOfBirth) {
        item.dateOfBirth = moment(item.dateOfBirth).format('DD-MMM-YYYY');
      }
      if (item.rpmDateAssigned) {
        item.rpmDateAssigned = moment(item.rpmDateAssigned).format('DD-MMM-YYYY');
      }
      if (item.lastReadingDate) {
        item.lastReadingDate = moment(item.lastReadingDate).format('DD-MMM-YYYY');
      }
      if (item.lastLogDate) {
        item.lastLogDate = moment(item.lastLogDate).format('DD-MMM-YYYY');
      }
      if (item.rpmStatus >= 0) {
        item.rpmStatusString = CcmStatus[item.rpmStatus]
      }
      if (item.rpmMonthlyStatus >= 0) {
        item.rpmMonthlyStatusString = RpmMonthlyStatus[item.rpmMonthlyStatus]
      }
        this.ExcelData.push({
          'EMR ID': this.checkIfNull(item.patientEmrId),
          'Patient Name': this.checkIfNull(item.fullName),
          'Primary Number': this.checkIfNull(item.primaryPhoneNumber),
          'Secondary Number': this.checkIfNull(item.secondaryPhoneNumber),
          'Emergency Contact Name': this.checkIfNull(item.emergencyContactName),
          'Emergency Contact Relationship': this.checkIfNull(item.emergencyContactRelationship),
          'Emergency Contact Primary Phone Number': this.checkIfNull(item.emergencyContactPrimaryPhoneNo),

          'Emergency Contact Secondary Phone Number': this.checkIfNull(item.emergencyContactSecondaryPhoneNo),
          'Patient Insurance': this.checkIfNull(item.insurancePlanName),
          'Date of Birth': this.checkIfNull(item.dateOfBirth),
          'RPM Time': this.checkIfNull(item.currentMonthCompletedTime),
          'Days': this.checkIfNull(item.transmissionDays),
          'RPM Status': this.checkIfNull(item.rpmStatusString),
          'RPM MS': this.checkIfNull(item.rpmMonthlyStatusString),
          'Assigned Date': this.checkIfNull(item.rpmDateAssigned),
          'Last Reading Date': this.checkIfNull(item.lastReadingDate),
          'Last Log Date': this.checkIfNull(item.lastLogDate),
          'RPM Coordinator': this.checkIfNull(item.rpmCareCoordinatorNames),
        });
    });
  }
  checkIfNull(data: any): string {
    if (data) {
      return data.toString();
    } else {
      return '';
    }
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0]) {
      this.financialFormSendToPatientDto.documentTitle =
        output.target.files[0].name;
        this.selectedFile = output.target.files[0];
    }
  }
  async uploadFinancialFormToS3() {
    this.uploadingDocument = true;
    const file = this.selectedFile;
    const path = `Patients/${this.financialFormSendToPatientDto.patientId}/FinancialHardshipForm/${this.financialFormSendToPatientDto.documentTitle}`;
    this.awsService.uploadUsingSdk(file, path).then(
      (data) => {
        this.financialFormSendToPatientDto.documentLink = path;
        this.uploadingDocument = false;
        this.sendFinancialHardshipForm();
      },
      (err: HttpResError) => {
        this.uploadingDocument = false;
        this.toaster.error(err.error);
      }
    );
  }
  sendFinancialHardshipForm() {
    this.sendingToPatient = true;
    this.patientsService
      .SendFinancialHardshipForm(this.financialFormSendToPatientDto)
      .subscribe(
        (res: any) => {
          this.sendingToPatient = false;
          this.toaster.success('File sent successfully');
          this.sendToPatientModal.hide();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.sendingToPatient = false;
        }
      );
  }
  assignFinancialHardshipFormValue(patient) {
    console.log(patient);
    this.financialFormSendToPatientDto.patientId = patient.id;
    if (patient.email) {
      this.financialFormSendToPatientDto.email = patient.email;
      this.hasEmail = true;
    }
    if (patient.primaryPhoneNumber) {
      this.financialFormSendToPatientDto.phoneNo = patient.primaryPhoneNumber;
      // this.financialFormSendToPatientDto.countryCallingCode =
      //   patient.countryCallingCode;
      this.hasPhoneNo = true;
    }
  }
  clearFinancialHardshipFormValues() {
    this.financialFormSendToPatientDto = new FinancialFormSendToPatientDto();
    this.hasEmail = false;
    this.hasPhoneNo = false;
  }
  CopyModalitiesData() {
    this.gettingRPMCopyData = true;
    this.rpmService.GetRPMEncountersAndReadingsForCopy(
      this.selectedPatient.id,
      this.rpmMonthId,
      this.yearNum).subscribe(
      (res: RPMCopyDto) => {
        this.rpmCopyDataObj = res;
        const mydoc = document;
        const div = mydoc.createElement('div');
        // div.style.display = 'none';
        // const data: string = text;
        div.innerHTML = this.rpmCarePlan;
        mydoc.body.appendChild(div);
        const text = div.innerText;
        div.remove();
        this.copyDataStr = ``;
        this.copyDataStr += `Patient Name: ${this.selectedPatient.fullName}\n`;
        this.copyDataStr += `Date of Birth: ${moment(this.selectedPatient.dateOfBirth).format('MM-DD-YYYY')}\n`;
        this.copyDataStr += `Age: ${moment().diff(this.selectedPatient.dateOfBirth, 'years')}\n`;
        this.copyDataStr += `\n-------------- Treatment Plan ------------------\n`;
        this.copyDataStr += text + '\n';
        if (this.selectedModalityCode === 'BP') {
          this.includeBpDataForCopy();
        }
        if (this.selectedModalityCode === 'BG') {
          this.includeBGDataForCopy();
        }
        if (this.selectedModalityCode === 'CGM') {
          this.includeCGMDataForCopy();
        }
        if (this.includeEncounters) {
          this.includeEncounterLogs();
        }
        this.executeCopyCommand();
        this.gettingRPMCopyData = false;
      },
      (error: HttpResError) => {
        this.gettingRPMCopyData = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  executeCopyCommand() {
    const textArea = document.createElement('textarea');
    // textArea.style.display = 'none';
    textArea.value = this.copyDataStr;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    textArea.remove();
    this.toaster.success('Content Copied');
  }
  includeBpDataForCopy() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.bloodPressureList) {
      this.copyDataStr += `\n-------------Blood Pressure Data----------------\n`;
      this.rpmCopyDataObj.bloodPressureList.forEach(item => {
        const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${time} ${item.highPressure}/${item.lowPressure} mmHg ${item.heartRate} beats/min \n`;
      });
    }
  }
  includeBGDataForCopy() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.bloodGlucoseList) {
      this.copyDataStr += `\n-------------Blood Glucose Data----------------\n`;
      this.rpmCopyDataObj.bloodGlucoseList.forEach(item => {
        const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${time} ${item.bg} mg/dl \n`;
      });
    }
  }
  includeCGMDataForCopy() {
    this.copyDataStr += `\n-------------CONTINUOUS GLUCOSE (AVG)----------------\n`;
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.cgmpPerDayAvgList) {
      this.rpmCopyDataObj.cgmpPerDayAvgList.forEach(item => {
        // const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${item.date} ${item.avg} mg/dl \n`;
      });
      // this.copyDataStr += ` ${moment().month(this.rpmMonthId).format('MMM')} ${this.yearNum} ` + this.rpmCopyDataObj.cgmAvg + `\n`;
    }
  }
  includeEncounterLogs() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.rpmEncounters) {
      this.copyDataStr += `\n-------------RPM Encounter Logs----------------\n`;
      this.rpmCopyDataObj.rpmEncounters.forEach(log => {
        // tslint:disable-next-line: max-line-length
        this.copyDataStr += `Service Type : ${this.RPMServiceTypeEnum[log.rpmServiceType]}\n Created By : ${ log.facilityUserName} \n Date : ${ moment(log.encounterDate).format('D MMM YY,\\ h:mm a')} , Start Time: ${ log.startTime}, End Time : ${ log.endTime} \n Duration : ${ log.duration} \n`;
        this.copyDataStr += `Note: ${log.note} \n`;
      });
    }
  }
  openRPMQualityCheckModal(row){
    this.rpmQualityCheckModalDto.patientId = row.id;
    this.rpmQualityCheckModalDto.isPrDashboard = false;
    this.appUi.openRPMQualityCheckModal.next(this.rpmQualityCheckModalDto);
  }
  syncQuickActions(){
    console.log(this.filterPatientDto.rpmStatus);
    if(this.filterPatientDto.rpmStatus == -1){
    this.quickActions = 15;
    }else{
      this.quickActions = this.filterPatientDto.rpmStatus;
    }
    this.checkQuickActionsValue();
    this.filterPatients();
  }
  AddPatientsToList(id: number) {
    this.addingPatientToCustomList = true;
    this.addPatientInCustmListDto.patientIds = new Array<number>();
    this.selected.forEach((element) => {
      this.addPatientInCustmListDto.patientIds.push(element.id);
    });
    this.addPatientInCustmListDto.customListIds = [id];
    this.customListService
      .AddPatientsToList(this.addPatientInCustmListDto)
      .subscribe(
        (res) => {
          this.toaster.success("Data Saved Successfully");
          this.addingPatientToCustomList = false;
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
          this.addingPatientToCustomList = false;
        }
      );
  }
  removePatientsFromList() {
    this.isDeletingPatientFromCustomList = true;
    this.removePatientInCustmListDto.patientIds = [];
    this.removePatientInCustmListDto.customListId = this.filterPatientDto.customListId;
    this.selected.forEach((element) => {
      this.removePatientInCustmListDto.patientIds.push(element.id);
    });
    // this.removePatientInCustmListDto.patientIds = this.selected;
    this.customListService
      .RemovePatientsFromList(this.removePatientInCustmListDto)
      .subscribe(
        (res: any) => {
          this.filterPatients();
          this.isDeletingPatientFromCustomList = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isDeletingPatientFromCustomList = false;
        }
      );
  }
  getSelectedModalityHistory(){
    this.selectedRpmAlertOutOfRange.patientId=this.selectedPatient.id;
    if(this.selectedModalityCode == 'BG'){
      this.selectedRpmAlertOutOfRange.modality = 'Blood Glucose';
    }
    if(this.selectedModalityCode == 'BP'){
      this.selectedRpmAlertOutOfRange.modality = 'Blood Pressure';
    }
    if(this.selectedModalityCode == 'WT'){
      this.selectedRpmAlertOutOfRange.modality = 'Weight';
    }
    if(this.selectedModalityCode == 'PO'){
      this.selectedRpmAlertOutOfRange.modality = 'Pulse Oximetry';
    }
    if(this.selectedModalityCode == 'AT'){
      this.selectedRpmAlertOutOfRange.modality = 'Activity';
    }
    this.getRpmReadingHistory();
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
}
