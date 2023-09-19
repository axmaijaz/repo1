import { CustomeListService } from "./../../core/custome-list.service";
import { DatePipe, DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DatatableComponent, id } from "@swimlane/ngx-datatable";
import { DataTableDirective } from "angular-datatables";
import * as FileSaver from "file-saver";
import * as moment from "moment";
import {
  IMyOptions,
  ModalDirective,
  ToastService,
} from "ng-uikit-pro-standard";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { AppDataService } from "src/app/core/app-data.service";
import { CcmDataService } from "src/app/core/ccm-data.service";
import {
  EmitEvent,
  EventBusService,
  EventTypes,
} from "src/app/core/event-bus.service";
import * as XLSX from "xlsx";
import { FacilityService } from "src/app/core/facility/facility.service";
import { LazyLoaderService } from "src/app/core/Lazy/lazy-loader.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { QuestionnaireService } from "src/app/core/questionnaire.service";
import { SecurityService } from "src/app/core/security/security.service";
// import { state } from '@angular/animations';
import { StatementManagementService } from "src/app/core/statement-management.service";
import { UserManagerService } from "src/app/core/UserManager/user-manager.service";
import {
  CarePlanUpdated,
  CcmMonthlyStatus,
  CcmStatus,
  CommunicationConsent,
  DaysPatientNotRespond,
  PatientStatus,
  RpmStatus,
} from "src/app/Enums/filterPatient.enum";
import { UserType } from "src/app/Enums/UserType.enum";
import {
  AddCcmEncounterDto,
  CcmEncounterForList,
  // CcmEncounterForList,
  CcmEncounterListDto,
  CcmEncounterTimeEnum,
  CCMMonthlyDataParamsDto,
  CCMMonthlyDataResponseDto,
  CCMQualityCheckMOdalDto,
  CcmStatusHistoryDto,
  ChangeMonthlyCcmStatus,
  FinancialFormSendToPatientDto,
  RpmStatusChangeDto,
} from "src/app/model/admin/ccm.model";
// import { ProviderDto } from 'src/app/model/Provider/provider.model';
import { LazyModalDto, PagingData, TwoCModulesEnum } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  CreateFacilityUserDto,
  FacilityDto,
} from "src/app/model/Facility/facility.model";
import {
  AllChronicDiseaseDto,
  AssignPatientsToCareProvider,
  CcmStatusChangeDto,
  DeletPatientDto,
  DownloadLogHistoryDto,
  FilterPatient,
  PatientDto,
  AssignRemoveCareProvidersToPatientsDto,
  CareProvidersListDto,
  ChronicIcd10CodeDto,
  PatientNoteDto,
  PatientActieServicesDto,
} from "src/app/model/Patient/patient.model";
import { CcmServiceType } from "src/app/model/Questionnaire/Questionnire.model";
import { AppUserAuth } from "src/app/model/security/app-user.auth";
import { SubSink } from "src/app/SubSink";
import { PageScrollService } from "ngx-page-scroll-core";
import { PatientTackService } from "src/app/core/Patient/patient-tack.service";
import { PatientTaskDto } from "src/app/model/Patient/patient-Task.model";
import { NgForm } from "@angular/forms";
import {
  MonthlyReviewDataDto,
  AssessmentProblemStatus,
} from "src/app/model/MonthlyReview/mReview.model";
import { MrAdminService } from "src/app/core/mr-admin.service";
import {
  MRProblemStatus,
  MRGoalStatus,
  MRInterventionStatus,
} from "src/app/model/MonthlyReview/mReview.enum";
import { PcmService } from "src/app/core/pcm/pcm.service";
import { MeasureDto } from "src/app/model/pcm/pcm.model";
import {
  AddEditCustomListDto,
  AssignPatientsToCustomListDto,
  RemovePatientsToCustomListDto,
} from "src/app/model/custome-list.model";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { AppUiService } from "src/app/core/app-ui.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { RpmPatientsListDto } from "src/app/model/rpm.model";
import { AwsService } from "src/app/core/aws/aws.service";
import { ChatViewType, ChatGroupDto } from "src/app/model/chat/chat.model";
import { TwocChatService } from "src/app/core/2c-chat.service";
import { PatientCommunicationHistoryDto, PatinetCommunicationGroup } from "src/app/model/PatientEngagement/communication.model";
import { PatientNotificationDto } from "src/app/model/Patient/patient-notification-model";
import { CommunicationService } from "src/app/core/communication.service";
import { TwoCTextAreaComponent } from "src/app/utility/two-c-text-area/two-c-text-area.component";
import { CustomListForPatientListsComponent } from "src/app/custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component";
@Component({
  selector: "app-patients-list",
  templateUrl: "./patients-list.component.html",
  styleUrls: ["./patients-list.component.scss"],
})
export class PatientsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  @ViewChild('myFIeldRefRPM') myFIeldRefRPM: TwoCTextAreaComponent;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
  };
  // dateFormat: "mm-dd-yyyy"
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY"
  };
  public datePickerConfig1: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A'
  };
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("ccmStatusHistoryModal") ccmStatusHistoryModal: ModalDirective;
  // @ViewChild(dataTable) dataTable: Datatable;
  private subs = new SubSink();
  gridCheckAll: boolean = false;
  myVar: any;
  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  ccmEncounterList: CcmEncounterForList;
  // dtOptions: any = {};
  dtSeacrh: DataTables.SearchSettings = {};
  dtPaging: DataTables.PageMethodeModelInfoReturn | any = {};
  myTable: DataTables.ColumnsMethodsModel;
  dtTrigger = new Subject<any>();
  dtInstance = {};
  filterPatientDto = new FilterPatient();
  filterPatientDtoforExcelFile = new FilterPatient();
  rows = new Array<PatientDto>();
  selectedPatientsCareProvidersList = new Array<CareProvidersListDto>();
  tempSelectedPatientsCareProvidersList = new Array<CareProvidersListDto>();
  selectedPatient = new PatientDto();
  hasEmail = false;
  hasPhoneNo = false;
  selectModalList = "";
  ccmMonthlyStatusEnumList = new Array<any>();
  serviceTypes = new Array<CcmServiceType>();
  assignedDateProp: string;
  lastVisitDateProp: string;
  patientData = new PatientDto();
  assigningDate: boolean;
  forRerendertable = true;
  table = $("#patientList").DataTable();
  @ViewChild("ccmStatusModal") ccmStatusModal: ModalDirective;
  @ViewChild("sendToPatientModal") sendToPatientModal: ModalDirective;
  @ViewChild("mrHtmlCOntent") mrHtmlCOntent: ElementRef;

  // end

  // SelectionType = SelectionType;
  isLoading = true;
  isLoadingZip = false;
  selectedCustomListName: string;
  AllCronicDiseaseList = new Array<AllChronicDiseaseDto>();
  // rows = new Array<PatientDto>();
  currentPatient = new PatientDto();
  pagingData = new PagingData();
  deletePatientDto = new DeletPatientDto();
  currentUser: AppUserAuth = null;
  ccmStatusChangeDto = new CcmStatusChangeDto();
  rpmStatusChangeDto = new RpmStatusChangeDto();
  ccmStatusEnum = CcmStatus;
  rpmStatusEnum = RpmStatus;
  ccmStatusHistoryList= new Array<CcmStatusHistoryDto>();
  // assignedDateProp: string;

  ccmStatusList: any;
  rpmStatusList: any;

  ccmMonthlyStatusEnum = CcmMonthlyStatus;
  ccmMonthlyStatusChangeDto = new ChangeMonthlyCcmStatus();
  temp = [];
  selected = [];
  AssessmentProblemStatusEnum = AssessmentProblemStatus;
  mrGoalStatusEnum = MRGoalStatus;
  MRInterventionStatusENum = MRInterventionStatus;
  MRProblemStatusEnum = MRProblemStatus;
  endTime: any;
  tempCcmStatusVal: number;
  isChangingCCMStatus: boolean;
  // AssignValue = 0;
  rowId: string;
  downloadData: string;
  facilityList = new Array<FacilityDto>();
  myduration: any;
  rowIndex = 0;
  profileStatus: boolean;
  downloadLogHistory = new DownloadLogHistoryDto();
  loadingOnStart = true;
  financialFormSendToPatientDto = new FinancialFormSendToPatientDto();
  // selectedpatientTask
  // currentTime = new Date();
  otherType = "";
  CareProvidersList = new Array<CreateFacilityUserDto>();
  allCareProvidersList = new Array<CreateFacilityUserDto>();
  CareFacilitatorsList = new Array<CreateFacilityUserDto>();
  BIllingProviderList = new Array<CreateFacilityUserDto>();

  // includeCarePlan = false;
  // FilterPatientDto = new FilterPatient();

  @ViewChild("searchPatient") searchPatient: ElementRef;
  @ViewChild("clickOnRow") clickOnRow: ModalDirective;
  @ViewChild("IsRevokedModal") IsRevokedModal: ModalDirective;
  @ViewChild("addEncounterModal") addEncounterModal: ModalDirective;
  @ViewChild("unApprovedCarePLanModal") unApprovedCarePLanModal: ModalDirective;
  @ViewChild("f") form: NgForm;
  AssignCareProviderToPatientsDto = new AssignPatientsToCareProvider();
  assignRemoveCareProvidersToPatientsDto =
    new AssignRemoveCareProvidersToPatientsDto();
  yearNow = new Date();
  // AssignRemoveCareProvidersToPatientsDto
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: this.yearNow.getFullYear() + 5,
    closeAfterSelect: true,
    dateFormat: "yyyy-mm-dd",
  };
  public assignedDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
    // format: "YYYY-MM-DDTHH:mm:ssZ",
    appendTo: "body",
    closeOnSelect: true,
    drops: "down",
  };
  public lastVisitDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
    // format: "YYYY-MM-DDTHH:mm:ssZ",
    appendTo: "body",
    closeOnSelect: true,
    drops: "down",
  };
  listOfYears = [];
  facilityId: number;
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
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "HH:mm",
    disableKeypress: true,
    // format: 'YYYY-MM-DD hh:mm A'
  };

  showAlertFEncounter: boolean;
  reasonDeleted: number;
  deletePatientId: number;
  reason: string;
  LoadingData = false;
  message = "";
  currentIndex: any;
  filters: string;
  currentYear: number;
  currentMonth: any;
  CanEditAssignedDate: boolean;
  GettingMRData: boolean;
  mrReviewData: MonthlyReviewDataDto;
  dueGapsList: MeasureDto[];
  gettingDueGaps: boolean;
  SetQualityCheckForMR: boolean;
  isCarePLanApproved = false;

  CustomListDto = new Array<AddEditCustomListDto>();
  facilityUserId = 0;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  cronicDiseaseList = new Array<{ id: 0; algorithm: "" }>();
  disableChronicFilter: boolean;
  isServiceLoad: boolean;
  patientActieServicesDto = new PatientActieServicesDto();
  ccmLogsModalLink: string;
  queryParamsApplied: boolean;
  revokeType: string;
  showValidationAlert: string;
  patientId: any;
  getCCMMonthlyDataParamObj = new CCMMonthlyDataParamsDto();
  CCMMonthlyDataResponseDtoObj = new CCMMonthlyDataResponseDto();
  careProviderName: string = "All Care Coordinators";
  CcmMonthlyStatusList = this.filterDataService.getEnumAsList(CcmMonthlyStatus);
  communicationConsentList = this.filterDataService.getEnumAsList(CommunicationConsent);
  carePlanUpdatedList = this.filterDataService.getEnumAsList(CarePlanUpdated);
  daysPatientNotRespondList = this.filterDataService.getEnumAsList(DaysPatientNotRespond);
  CcmEncounterTimeEnumList =
    this.filterDataService.getEnumAsList(CcmEncounterTimeEnum);
  selectedFilterWidget: string;
  mouseOverIntervalRef = {};
  mrTooltipOverRef = {};
  nameCaption: any;
  PatientEncounterMonthlyStatusAcknowledge = false;
  PatientEncounterMonthlyStatus = CcmMonthlyStatus["Not Started"];
  PatientEncounterMonthlyStatusTExt =
    CcmMonthlyStatus[CcmMonthlyStatus["Not Started"]];
  patientStatusArr = this.filterDataService.getEnumAsList(PatientStatus);

  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
     },
    alwaysShowCalendars: false,
  };
  selectedDateRange: any;
  daterange: {};
  isLoadingDependentDiseases: boolean;
  showAssignDateField = true;
  countriesList: any;
  sendingToPatient: boolean;
  uploadingDocument: boolean;
  selectedFile: any;
  ExcelData: any[];
  isMakingExcel: boolean;
  stopWatchValue: number;
  stopWatchInterval: NodeJS.Timeout;
  isLoadingCcmStatusHistory: boolean;
  ccmQualityCheckMOdalDto= new CCMQualityCheckMOdalDto();
  removePatientInCustmListDto = new RemovePatientsToCustomListDto();
  isDeletingPatientFromCustomList: boolean;
  addingPatientToCustomList: boolean;
  lastVisitAssigningDate: boolean;
  loadingMRToolTip: boolean;
  ccmMSToolTip: string;
  gettingChatGroup: boolean;
  ccmSToolTip: string;
  gettingEncounterLogs: boolean;
  constructor(
    private eventBus: EventBusService,
    private router: Router,
    private facilityService: FacilityService,
    private patientsService: PatientsService,
    private userManagerService: UserManagerService,
    private ccmService: CcmDataService,
    private lazyService: LazyLoaderService,
    private toaster: ToastService,
    private commService: CommunicationService,
    private sanatizer: DomSanitizer,
    public securityService: SecurityService,
    private statementManagementService: StatementManagementService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private appData: AppDataService,
    private questionnaireService: QuestionnaireService,
    private eventBusService: EventBusService,
    private pageScrollService: PageScrollService,
    private patientTaskService: PatientTackService,
    private mrService: MrAdminService,
    private filterDataService: DataFilterService,
    private pcmService: PcmService,
    private customListService: CustomeListService,
    private appUi: AppUiService,
    private patientService: PatientsService,
    private awsService: AwsService,
    private twoCChatService: TwocChatService,
    @Inject(DOCUMENT) private document: any
  ) {}
  // transformDate(date) {
  //   this.datePipe.transform(myDate, 'yyyy-MM-dd'); //whatever format you need.
  // }
  // private cellOverflowVisible() {
  //   const cells = document.getElementsByClassName(
  //     "datatable-body-cell overflow-visible"
  //   );
  //   for (let i = 0, len = cells.length; i < len; i++) {
  //     cells[i].setAttribute("style", "overflow: visible !important");
  //   }
  // }

  someClickHandler(info: any): void {
    this.message = info.id + " - " + info.firstName;
    // this.rowCallback();
  }
  ngOnInit() {
    this.eventBusService.on(EventTypes.CommunicationEncounterEdit).subscribe((res) => {
      this.refreshPatientsList(res.data.patientId, res.data.patientCommunicationIds, res.data.encounterObj, res.data.serviceType);
    });
    this.ccmEncounterListDto.encounterDate = moment().format("YYYY-MM-DD hh:mm A");
    this.filterDataService.selectedCCMDashboardDate = `${this.filterPatientDto.serviceYear}-${this.filterPatientDto.serviceMonth}`;
    this.GetAllCountries();
    this.getNameCaption();
    //   $('#mysdajkas').on( 'order.dt', function (event) {
    //     // This will show: "Ordering on column 1 (asc)", for example
    // } );
    this.getAllCareProviders();
    this.currentMonth = this.appData.currentMonth;
    this.currentYear = this.appData.currentYear;
    this.filterPatientDto.serviceYear = this.appData.currentYear;
    this.listOfYears = this.appData.listOfYears;
    this.CanEditAssignedDate = this.securityService.hasClaim(
      "CanEditAssignedDate"
    );
    // this.cellOverflowVisible();
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }

    if (this.currentUser.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    this.filters = this.route.snapshot.queryParamMap.get("filters");
    if (this.filters) {
      if (this.statementManagementService.IsSetDataTable) {
        this.table.state = this.statementManagementService.setTableData;
        // this.filterPatients();
      } else {
        localStorage.removeItem("DataTables_" + window.location.pathname);
      }
      this.filterPatientDto = this.statementManagementService.filterPatientData;
    } else {
      localStorage.removeItem("DataTables_" + window.location.pathname);
      // location.reload();
      // this.table.state.clear();
      // this.table.destroy();
      // this.dtTrigger.
      // this.dtOptions= DataTables.Settings | any = {};
      // this.table = $("#example").DataTable();
      // $('#example').DataTable().destroy(true);
    }
    if (this.currentUser.userType === UserType.FacilityUser) {
      this.filterPatientDto.FacilityUserId =
        this.securityService.securityObject.id;
      this.facilityUserId = this.securityService.securityObject.id;
      // this.filterPatientDto.CareProviderId = this.securityService.securityObject.id;
    } else {
      this.filterPatientDto.FacilityUserId = 0;
    }
    this.initialiceCCMMonthlyParamObj();
    this.GetMonthlyCcmData();
    this.getFiltersData();
    this.eventBusService.on(EventTypes.RefreshCustomList).subscribe((res) => {
      this.GetCustomListsByFacilityUserId();
    });
    this.GetCustomListsByFacilityUserId();
    // $('#example').DataTable().draw();
    this.dtSelect = {
      select: true,
    };
    this.dtOptions = {
      pagingType: "first_last_numbers",
      scrollX: true,
      scrollCollapse: true,
      serverSide: true,
      stateSave: true,
      stateDuration: -1,
      stateSaveCallback: function (oSettings, oData) {
        localStorage.setItem(
          "DataTables_CCM" + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem("DataTables_CCM" + window.location.pathname)
        );
      },
      //         localStorage.removeItem( 'DataTables_'+window.location.pathname );
      // location.reload();
      responsive: true,
      processing: false,
      autoWidth: true,
      pageLength: this.filterPatientDto.PageSize,
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
        { targets: 1, orderable: false },
        { targets: 0, orderDataType: "num-fmt", orderable: false },
        // { targets: 13, orderable: false },
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
        if (this.filters) {
          // this.filterPatientDto.PageSize = dataTablesParameters.length;
          this.filterPatientDto.rowIndex =
            this.statementManagementService.filterPatientData.rowIndex;
          this.filterPatientDto.PageNumber =
            this.statementManagementService.filterPatientData.PageNumber;
          this.filterPatientDto.PageSize =
            this.statementManagementService.filterPatientData.PageSize;
          this.filters = "";
        } else {
          if (dataTablesParameters.start === 1) {
            dataTablesParameters.start = 0;
          }
          this.filterPatientDto.rowIndex = dataTablesParameters.start;
          this.filterPatientDto.PageSize = dataTablesParameters.length;
          this.filterPatientDto.PageNumber =
            dataTablesParameters.start / dataTablesParameters.length + 1;
          this.filterPatientDto.PageNumber = Math.floor(
            this.filterPatientDto.PageNumber
          );
        }
        // if (this.callRedrawCheck === 2) {
        //   this.callRedrawCheck++;
        //   return;
        // }
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
        this.loadingOnStart = false;

        this.assignUserValues();
        if (
          this.securityService.securityObject.userType === UserType.FacilityUser
        ) {
          if (this.facilityId) {
            this.filterPatientDto.FacilityId = this.facilityId;
          }
        }
        this.isLoading = true;
        if (!this.queryParamsApplied) {
          this.checkIfQueryParams();
        }
        this.filterDataService.filterData["ccmList"] = this.filterPatientDto;
        this.subs.sink = this.patientsService
          .getFilterPatientsList2(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              // this.loadingOnStart = false;
              res.patientsList.forEach((element) => {
                // if (element.dateAssigned) {
                //   element.dateAssigned = moment(
                //     element.dateAssigned,
                //     'YYYY-MM-DD'
                //   ).format('YYYY-MM-DD');
                // }
              });
              this.isLoading = false;
              this.selected = [];
              this.rows = new Array<PatientDto>();
              this.rowIndex = this.filterPatientDto.rowIndex;
              res.patientsList.forEach((patient: PatientDto) => {
                if (
                  patient.msQualityCheckedByName &&
                  !patient.msQualityCheckedDate
                ) {
                  const msQualityCheckedByNameAndDate = `${patient.msQualityCheckedByName}`;
                  patient["msQualityCheckedByNameAndDate"] =
                    msQualityCheckedByNameAndDate;
                } else if (
                  patient.msQualityCheckedByName &&
                  patient.msQualityCheckedDate
                ) {
                  patient.msQualityCheckedDate = moment
                    .utc(patient.msQualityCheckedDate)
                    .local()
                    .format();
                  const dateTime = moment(patient.msQualityCheckedDate).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  );
                  const msQualityCheckedByNameAndDate = `${patient.msQualityCheckedByName}\n ${dateTime}`;
                  patient["msQualityCheckedByNameAndDate"] =
                    msQualityCheckedByNameAndDate;
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
              this.rows = res.patientsList;
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
              this.AssignHHCEndDateColor();
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
        { name: "ccmTime" },
        { name: "assignedDate" },
        { name: "ccmStatus" },
        { name: "carePlanUpdatedDate" },
        { name: "ccmMonthlyStatus" },
        { name: "lastCcm" },
        { name: "lastVisit" },
        { name: "qualityCheck" },
        // { name: "rpmStatus" },
        { name: "careManager" },
        { name: "careProviderName" },
        { name: "billingProviderName" },
        // { name: 'action' },
      ],
    };
    // $("#example").on("", function(e, settings, json) {
    //   var api = new $.fn.dataTable.Api(settings);
    //   api.page(3).draw(false);
    // });

    this.dtSeacrh = {};
    // this.loadPatients();
    if (this.currentUser.userType !== UserType.AppAdmin) {
      // this.getCareProviders();
      this.getBillingProviders();
    }
    if (this.currentUser.userType === UserType.AppAdmin) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
      // this.getCareProviders();
      this.getFacilityList();
    }
    this.getCareProviders();
    this.GetCareFacilitatorsByFacilityId();
    this.getCronicDiseases();
    this.getDependentDiseases("");
    // this.GetAllChronicDisease();

    $("#patientList tbody").on("click", "tr", function (a) {
      if (this.currentIndex) {
        $(
          "#patientList tbody tr:nth-child(" + this.currentIndex + ")"
        ).removeClass("selected");
      }
      this.currentIndex = a.currentTarget.rowIndex;
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
      } else {
        $("#patientList tr.selected").removeClass("selected");
        $(this).addClass("selected");
      }

      // console.log('row index', this.currentIndex);
    });
    this.patientService.refreshQualityCheckStatusOfCCM.subscribe((res: number) => {
      this.selectedPatient.qualityCheckStatus = res;
      // this.updateStatusOfQualityCheck();
    })
    window.addEventListener('message', this.receiveMessage, false);
  }
  refreshPatientsList(patientId: number, patientCommunicationIds: number[], encounterObj?: AddCcmEncounterDto | any, serviceType? : TwoCModulesEnum) {
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
      if(isSameMonth && patient.id == patientId && encounterObj && serviceType == TwoCModulesEnum.CCM){
        patient.currentMonthCompletedTime = ((+patient.currentMonthCompletedTime) + (+encounterObj?.duration || 0)) as any
      }
    })
  }
  receiveMessage = (event) => {
    if (event.data.type === 'PatientNotificationSettingChanged') {
      const notificationSetting = event.data.mData as PatientNotificationDto;
      const row = this.rows.find(x => x.id == notificationSetting.patientId)
      if (row) {
        row.telephonyCommunication = notificationSetting.telephonyCommunication
      }
    }
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterPatientDto.DateAssignedTo = "";
    this.filterPatientDto.DateAssignedFrom = "";
    // this.picker.datePicker.setStartDate();
    // this.picker.datePicker.setEndDate();
  }
  selectedDate(value: any, datepicker?: any) {
    // datepicker.start = value.start;
    // datepicker.end = value.end;
    this.filterPatientDto.DateAssignedFrom = value.start.format("YYYY-MM-DD");
    this.filterPatientDto.DateAssignedTo = value.end.format("YYYY-MM-DD");
    // this.daterange.label = value.label;
  }
  getFiltersData() {
    if (this.filterDataService.filterData["ccmList"]) {
      this.filterPatientDto = this.filterDataService.filterData["ccmList"];
      this.initialiceCCMMonthlyParamObj(true);
      this.GetMonthlyCcmData()
    }
  }
  checkIfQueryParams() {
    this.queryParamsApplied = true;
    const filterState = this.route.snapshot.queryParams["filterState"];
    if (filterState) {
      this.filterPatientDto = JSON.parse(filterState);
    }
  }

  getCronicDiseases() {
    this.patientsService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      (err) => {}
    );
  }
  getDependentDiseases(id: any) {
    this.isLoadingDependentDiseases = true;
    if (!id || (Array.isArray(id) && id.includes("0"))) {
      id = "";
    }
    this.LoadingData = true;
    this.AllCronicDiseaseList = new Array<ChronicIcd10CodeDto>();
    this.patientsService.GetChronicDiseaseCodes(id).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.AllCronicDiseaseList = res;
        this.isLoadingDependentDiseases = false;
      },
      (err) => {
        this.LoadingData = false;
        this.isLoadingDependentDiseases = false;
      }
    );
  }
  applyChronicFilterLogic() {
    if (
      this.filterPatientDto.conditionsIds &&
      this.filterPatientDto.conditionsIds.length > 1
    ) {
      const hasAll = this.filterPatientDto.conditionsIds.includes("0");
      if (hasAll) {
        this.filterPatientDto.conditionsIds =
          this.filterPatientDto.conditionsIds.filter((x) => x !== "0");
        this.filterPatientDto.chronicDiseasesIds = ["0"];
      }
    }
    if (
      !this.filterPatientDto.conditionsIds ||
      !this.filterPatientDto.conditionsIds.length
    ) {
      this.filterPatientDto.conditionsIds = ["0"];
    }
  }
  applyICDFilterLogic() {
    if (
      this.filterPatientDto.chronicDiseasesIds &&
      this.filterPatientDto.chronicDiseasesIds.length > 1
    ) {
      const hasAll = this.filterPatientDto.chronicDiseasesIds.includes("0");
      if (hasAll) {
        this.filterPatientDto.chronicDiseasesIds =
          this.filterPatientDto.chronicDiseasesIds.filter((x) => x !== "0");
      }
    }
    if (
      !this.filterPatientDto.chronicDiseasesIds ||
      !this.filterPatientDto.chronicDiseasesIds.length
    ) {
      this.filterPatientDto.chronicDiseasesIds = ["0"];
    }
    if (
      this.filterPatientDto.chronicDiseasesIds &&
      this.filterPatientDto.chronicDiseasesIds.length
    ) {
      const hasAll = this.filterPatientDto.chronicDiseasesIds.includes("0");
      if (!hasAll) {
        this.disableChronicFilter = true;
      } else {
        this.disableChronicFilter = false;
      }
    }
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.getCcmStatus();
    this.getRpmStatus();
    this.getCcmMonthlyStatusArray();
    this.getCcmServicesType();
    this.customListForPatientsListCompRef.filterPatientDto = this.filterPatientDto;
    this.subs.sink = fromEvent(this.searchPatient.nativeElement, "keyup")
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

  assignUserValues() {
    this.isLoading = true;
    if (!this.filterPatientDto.CareProviderId) {
      this.filterPatientDto.CareProviderId = 0;
    }
    if (!this.filterPatientDto.BillingProviderId) {
      this.filterPatientDto.BillingProviderId = 0;
    }
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.filterPatientDto.FacilityUserId =
        this.securityService.securityObject.id;
    } else {
      this.filterPatientDto.FacilityUserId = 0;
    }
    const fPDto = new FilterPatient();
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
      if (
        filterProp === "ccmStatus" &&
        this.filterPatientDto[filterProp] === ([-1] as any)
      ) {
        this.filterPatientDto[filterProp] = [-1] as any;
      }
    }
    var element = document.getElementById(
      "assignedDateField"
    ) as HTMLInputElement;
    if (element && element.value) {
      const iVal = element.value;
      const cData = moment().format("MM-DD-YYYY");
      const accuCount = (iVal.match(new RegExp(cData, "g")) || []).length;
      if (accuCount > 1) {
        this.filterPatientDto.DateAssignedFrom = moment().format("YYYY-MM-DD");
        this.filterPatientDto.DateAssignedTo = moment().format("YYYY-MM-DD");
      }
    }
    this.filterPatientDtoforExcelFile = this.filterPatientDto;
  }
  ccmStatusFilterChanged() {
    let ccmStatusList = this.filterPatientDto.ccmStatus as any;
    if (
      this.filterPatientDto["ccmStatus"] === ([-1] as any) ||
      !this.filterPatientDto["ccmStatus"] ||
      !ccmStatusList.length
    ) {
      this.filterPatientDto["ccmStatus"] = [-1] as any;
      ccmStatusList = this.filterPatientDto.ccmStatus as any;
    }
    if (
      ccmStatusList &&
      ccmStatusList.length === 1 &&
      ccmStatusList.includes(-1)
    ) {
    } else {
      ccmStatusList = ccmStatusList.filter((x) => x !== -1);
      this.filterPatientDto.ccmStatus = ccmStatusList;
    }
  }
  ccmMOnthltStatusFilterChanged() {
    let ccmMonthlyStatusList = this.filterPatientDto.ccmMonthlyStatus as any;
    if (
      !this.filterPatientDto["ccmMonthlyStatus"] ||
      !ccmMonthlyStatusList.length
    ) {
      this.filterPatientDto["ccmMonthlyStatus"] = [-1] as any;
      ccmMonthlyStatusList = this.filterPatientDto.ccmMonthlyStatus as any;
    }
    if (
      ccmMonthlyStatusList &&
      ccmMonthlyStatusList.length === 1 &&
      ccmMonthlyStatusList.includes(-1)
    ) {
    } else {
      ccmMonthlyStatusList = ccmMonthlyStatusList.filter((x) => x !== -1);
      this.filterPatientDto.ccmMonthlyStatus = ccmMonthlyStatusList;
    }
  }

  TimeRangeChanged() {
    let ccmTimeRangeList = this.filterPatientDto.ccmTimeRange;
    if (!this.filterPatientDto["ccmTimeRange"] || !ccmTimeRangeList.length) {
      this.filterPatientDto["ccmTimeRange"] = [0];
      ccmTimeRangeList = this.filterPatientDto.ccmTimeRange;
    }
    if (
      ccmTimeRangeList &&
      ccmTimeRangeList.length === 1 &&
      ccmTimeRangeList.includes(0)
    ) {
    } else {
      ccmTimeRangeList = ccmTimeRangeList.filter((x) => x !== 0);
      this.filterPatientDto.ccmTimeRange = ccmTimeRangeList;
    }
  }
  ChangeAndApplyCCMStatus(text: string, values: number[]) {
    this.selectedFilterWidget = text;
    this.filterPatientDto.ccmStatus = values as any;
    this.filterPatientDto.ccmTimeRange = [0];
    this.filterPatientDto.ccmMonthlyStatus = [-1];
    this.filterPatients();
  }
  ChangeAndApplyCCMMonthlyStatus(text: string, values: number[]) {
    this.selectedFilterWidget = text;
    this.filterPatientDto.ccmMonthlyStatus = values;
    this.filterPatientDto.ccmTimeRange = [0];
    this.filterPatientDto.ccmStatus = [7] as any;
    this.filterPatients();
  }
  ChangeAndApplyMinutesFilter(text: string, values: number[]) {
    this.selectedFilterWidget = text;
    this.filterPatientDto.ccmTimeRange = values;
    this.filterPatientDto.ccmMonthlyStatus = [];
    this.filterPatientDto.ccmStatus = [] as any;
    this.filterPatients();
  }
  getPatientListExcelFile() {
    this.assignUserValues();
    // console.log('filter' + this.filterPatientDto);
    // console.log('filter2' + this.filterPatientDtoforExcelFile);
    this.selectICDCodes();
    this.subs.sink = this.patientsService
      .getPatientListExcelFile(this.filterPatientDto)
      .subscribe(
        (res: any) => {
          // this.facilityList = res;
          this.isLoading = false;
          FileSaver.saveAs(
            new Blob([res], { type: "application/csv" }),
            `${this.securityService.getClaim('FacilityName')?.claimValue} - CCM Patient List.csv`
          );
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  FillCareProvider() {
    if (this.filterPatientDto.CareProviderId) {
      const sProvider = this.CareProvidersList.find(
        (x) => x.id === this.filterPatientDto.CareProviderId
      );
      this.careProviderName = sProvider.firstName + " " + sProvider.lastName;
      this.getCCMMonthlyDataParamObj.careCoordinatorId = sProvider.id;
    } else {
      this.careProviderName = "All Care Coordinators";
      this.getCCMMonthlyDataParamObj.careCoordinatorId = 0;
    }
    this.GetMonthlyCcmData();
  }
  MonthChanged() {
    this.getCCMMonthlyDataParamObj.monthId = this.filterPatientDto.serviceMonth;
    this.filterDataService.selectedCCMDashboardDate = `${this.filterPatientDto.serviceYear}-${this.filterPatientDto.serviceMonth}`
    this.GetMonthlyCcmData();
    this.filterPatients();
  }
  YearChanged() {
    this.getCCMMonthlyDataParamObj.yearId = this.filterPatientDto.serviceYear;
    this.filterDataService.selectedCCMDashboardDate = `${this.filterPatientDto.serviceYear}-${this.filterPatientDto.serviceMonth}`
    this.GetMonthlyCcmData();
    this.filterPatients();
  }
  selectICDCodes() {
    var tempicdCodes = this.filterPatientDto.chronicDiseasesIds.filter(
      (x) => x !== "0"
    );
    var tempConditions = this.filterPatientDto.conditionsIds.filter(
      (x) => x !== "0"
    );
    if (
      tempConditions &&
      tempConditions.length > 0 &&
      tempicdCodes.length == 0
    ) {
      this.filterPatientDto.tempChronicDiseasesIds =
        this.AllCronicDiseaseList.map((x) => x.id);
    } else {
      this.filterPatientDto.tempChronicDiseasesIds = [];
    }
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
  filterPatients() {
    this.filterDataService.filterData["ccmList"] = this.filterPatientDto;
    this.selectICDCodes();
    this.isLoading = true;
    this.assignUserValues();
    this.rerender();

    // this.subs.sink = this.patientsService
    //   .getFilterPatientsList2(this.filterPatientDto)
    //   .subscribe(
    //     (res: any) => {
    //       this.isLoading = false;
    //       this.selected = [];
    //       this.rows = new Array<PatientDto>();
    //       this.rerender();
    //       const len = this.rows.length;
    //       this.rows = res.patientsList;
    //       this.pagingData = res.pagingData;
    //       // this.rerender();
    //     },
    //     (err: HttpResError) => {
    //       this.isLoading = false;
    //       this.toaster.error(err.error, err.message);
    //     }
    //   );
    // this.table.ajax.reload(()=>,true)
    // recordsTotal: this.pagingData.elementsCount,
    //           recordsFiltered: this.pagingData.elementsCount,
    //           data: []
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
  getChatGroup(patient: PatientDto, viewMode?: ChatViewType) {
    // this.gettingChatGroup = true;
    // this.subs.sink = this.twoCChatService
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
  OpenCCMEncounterModel() {
    this.commService.GetCommunicationHistory(this.selectedPatient?.id, this.filterPatientDto.serviceMonth ,this.filterPatientDto.serviceYear).subscribe(
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
          this.commService.OpenCCMEncounterModel(this.selectedPatient, copyText, commHistory)
        }
        this.pagingData = res.pagingData;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  scrollToTable() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: ".ccm-datatable",
    });
  }
  rerender(): void {
    this.forRerendertable = false;
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust().draw();
      // mydtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      // mydtInstance.columns.adjust().draw('page');
    });
    // clearInterval(this.myVar);
  }
  redDraw(): void {
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust();
      // console.log('dtInt', mydtInstance);
    });
    this.table.page(this.pagingData.pageNumber).draw(false);
  }
  changeStatus(row: any) {
    console.log(this.assignedDateProp);

    this.selectedPatient = row;
    this.profileStatus = row.profileStatus;
    this.ccmEncounterListDto.patientId = row.id;
    this.ccmStatusChangeDto.patientId = row.id;
    this.ccmStatusChangeDto.hhcEndDate = row.hhcEndDate;
    this.ccmStatusChangeDto.newStatusValue = this.tempCcmStatusVal;
    this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus = row.ccmMonthlyStatus;
    this.ccmMonthlyStatusChangeDto.PatientId = row.id;
    this.rpmStatusChangeDto.patientId = row.id;
  }
  generateBillingProvidersCaption(names: string): string[] {
    const namesArray = new Array<string>();
    if (names) {
      const tempArr = names.split(",");
      tempArr.forEach((sName) => {
        if (sName) {
          namesArray.push(sName);
        }
      });
      return namesArray;
    } else {
      return namesArray;
    }
  }
  getCcmMonthlyStatusArray() {
    const keys = Object.keys(CcmMonthlyStatus).filter(
      (k) => typeof CcmMonthlyStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: CcmMonthlyStatus[key as any],
      word: key,
    })); // [0, 1]
    this.ccmMonthlyStatusEnumList = values;
    return values;
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
  UpdateDueGapeNote(item: any) {
    if (item.note) {
      this.subs.sink = this.pcmService.UpdateDueGapeNote(item).subscribe(
        (res: any) => {
          // this.serviceTypes = res;
        },
        (err) => {}
      );
    }
  }

  getCcmStatus() {
    this.subs.sink = this.patientsService
      .getCcmStatus()
      .subscribe((res: any) => {
        if (res) {
          this.ccmStatusList = res;
        }
      });
  }
  getRpmStatus() {
    this.subs.sink = this.patientsService
      .getRpmStatus()
      .subscribe((res: any) => {
        if (res) {
          this.rpmStatusList = res;
        }
      });
  }

  getBillingProviders() {
    this.subs.sink = this.facilityService
      .getBillingProviderByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.BIllingProviderList = res;
          }
        },
        (error) => {}
      );
  }

  getFacilityList() {
    this.subs.sink = this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getCareProviders() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.subs.sink = this.facilityService
      .GetCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.CareProvidersList = res;
          }
        },
        (error) => {}
      );
  }
  getAllCareProviders() {
    this.subs.sink = this.userManagerService.getGetCareProviderList().subscribe(
      (res: any) => {
        if (res) {
          this.allCareProvidersList = res;
        }
      },
      (error) => {}
    );
  }
  GetCareFacilitatorsByFacilityId() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.subs.sink = this.facilityService
      .GetCareFacilitatorsByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.CareFacilitatorsList = res;
          }
        },
        (error) => {}
      );
  }
  onActivate(event) {
    if (event.type === "click") {
      // id: number = +event.row.id;
      // if (event.row.isConsentTaken) {
      this.router.navigate(["/admin/patient/", event.row.id]);
      // } else {
      // this.router.navigate(['/admin/patientConsent/', event.row.id]);
      // }
    }
  }
  async onClickRow(row: PatientDto, event: MouseEvent) {
    // const isSaved = await this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { filterState: JSON.stringify(this.filterPatientDto) },
    //     queryParamsHandling: 'merge'
    //   });
    // if (isSaved) {
    // }
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.id as any;
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
  addRequiredData() {
    // this.router.navigateByUrl('/admin/addPatient/'+ this.rowId, {state: {filters:this.filterPatientDto}});
    this.router.navigate(["/admin/addPatient/" + this.rowId], {
      state: this.filterPatientDto,
    });
  }

  onSelect({ selected }) {
    // console.log('Select Event', selected, this.selected);
    if (selected && selected[0]) {
      this.currentPatient = selected[0];
    }
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  openPatientNote(row) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenPatientNote;
    event.value = row.id;
    this.eventBusService.emit(event);
  }
  displayCheck(row) {
    return row.name !== "Ethel Price";
  }
  OpenModalAssignPatientToProvider() {}
  AssignPatients() {
    this.AssignCareProviderToPatientsDto.patientIds = new Array<number>();
    this.selected.forEach((element) => {
      this.AssignCareProviderToPatientsDto.patientIds.push(element.id);
    });
    if (this.selected.length === 1) {
      this.subs.sink = this.patientsService
        .updatePatientProviders(
          this.selected[0].id,
          this.AssignCareProviderToPatientsDto.careProviderIds
        )
        .subscribe(
          (res: any) => {
            this.toaster.success("Data Successfully");
            this.filterPatients();
          },
          (err) => {
            this.toaster.error(err.message, err.error || err.error);
            // this.addUserModal.hide();
          }
        );
    } else {
      this.subs.sink = this.userManagerService
        .AssignPatientsToCareProvider(this.AssignCareProviderToPatientsDto)
        .subscribe(
          (res: any) => {
            this.filterPatients();
            this.selected = [];
            this.AssignCareProviderToPatientsDto =
              new AssignPatientsToCareProvider();
            this.toaster.success("Data Saved Successfully");
          },
          (err) => {
            this.toaster.error(err.message, err.error || err.error);
            // this.addUserModal.hide();
          }
        );
    }
  }
  getCCMMinutes(time: string): string {
    if (time) {
      const datTime = "6/14/19 " + time;
      return this.datePipe.transform(datTime, "mm") + " min";
    } else {
      return "";
    }
  }
  getFilterPatients() {
    // this.setPage({ offset: this.pagingData.pageNumber });
  }
  resetFilter() {
    const customId = this.filterPatientDto.customListId;
    this.filterPatientDto = new FilterPatient();
    this.filterPatientDto.customListId = customId;
    this.filterPatientDto.PageNumber = 1;
    this.selectedFilterWidget = "";
    this.clearDate();
    this.resetSorting()
  }
  resetSorting(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.order([]).draw();
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
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
        this.PatientEncounterMonthlyStatus
      )
      .subscribe(
        (res: CcmEncounterListDto) => {
          this.addEncounterModal.hide();
          this.isLoading = false;
          this.filterPatients();
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
          this.GetMonthlyCcmData();
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.isLoading = false;
        }
      );
  }
  startStopWatch() {
    this.stopWatchValue = 0;
    this.stopWatchInterval  = setInterval(() => {
      ++this.stopWatchValue;
      const result = moment().startOf('day').seconds(this.stopWatchValue).format('HH:mm:ss');
      document.getElementById('stopwatchFieldCCM1')?.setAttribute('value',result);
    }, 1000);
  }
  ResetStopWatch() {
    this.ccmEncounterListDto.duration =  moment().startOf('day').seconds(this.stopWatchValue).minutes();
    if ((this.stopWatchValue % 60) > 0) {
      this.ccmEncounterListDto.duration = (this.ccmEncounterListDto.duration + 1);
    }
    if (!this.ccmEncounterListDto.duration) {
      this.ccmEncounterListDto.duration = null;
    }
    clearInterval(this.stopWatchInterval);
    this.stopWatchInterval = null;
    document.getElementById('stopwatchFieldCCM1')?.setAttribute('value','');
    this.durationChanged(this.ccmEncounterListDto.duration);
  }
  ccmEncounterModalOpened() {
    this.startStopWatch();
  }
  validaeTimeDifference(): boolean {
    const sTime = moment(this.ccmEncounterListDto.startTime, "HH:mm");
    const eTime = moment(this.ccmEncounterListDto.endTime, "HH:mm");
    const res = sTime.isBefore(eTime);
    return res;
  }
  durationChanged(minsToAdd: any) {
    const totalMinutes = this.ccmEncounterList.durationInNumber + +minsToAdd;
    if(!this.selectedPatient.isConsentTaken && totalMinutes > 10){
      this.toaster.warning("Patient consent has not been taken")
      this.ccmEncounterListDto.duration = 0;
      return;
    }
    // if (!this.ccmEncounterListDto.startTime) {
    //   const duration = moment(this.ccmEncounterListDto.duration, 'mm').format('hh:mm:ss');
    //   const currentTime = moment(moment().format('hh:mm:ss'), 'hh:mm:ss');
    //   const result = moment.duration(currentTime.diff(duration));
    // }
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
  getLogsByPatientAndMonthId(patientId) {
    if (patientId) {
      this.gettingEncounterLogs = true;
      this.subs.sink = this.ccmService
        .getCCMEncounterByPatientId(patientId, this.filterPatientDto.serviceMonth, this.filterPatientDto.serviceYear)
        .subscribe(
          (res) => {
            this.gettingEncounterLogs = false;
            this.ccmEncounterList = res;
            if(this.ccmEncounterList.ccmTimeCompleted){
              this.ccmEncounterList.durationInNumber = moment.duration(this.ccmEncounterList.ccmTimeCompleted).asMinutes();
            }else {
              this.ccmEncounterList.ccmTimeCompleted = "00:00:00";
              this.ccmEncounterList.durationInNumber = 0;
            }
            this.durationChanged(this.ccmEncounterListDto.duration);
          },
          (err) => {
            this.gettingEncounterLogs = false;
          }
        );
    } else {
      this.gettingEncounterLogs = false;
    }
  }
  IsCCMCompleted(timeCompleted: string) {
    const hours = +timeCompleted.split(":")[0];
    const minutes = +timeCompleted.split(":")[1];
    if (minutes >= 20 || hours > 0) {
      return true;
    } else {
      return false;
    }
  }
  // getProvidersForPatient() {
  //   if (this.selected.length === 1) {
  //     this.subs.sink = this.patientsService
  //       .getPatientCareProviers(this.selected[0].id)
  //       .subscribe(
  //         (res: Array<{ id: number; name: string }>) => {
  //           const IDArr = new Array<number>();
  //           res.forEach((element) => {
  //             if (
  //               this.CareProvidersList &&
  //               this.CareProvidersList.length &&
  //               this.CareProvidersList.find((x) => x.id === element.id)
  //             ) {
  //               IDArr.push(element.id);
  //             }
  //           });
  //           this.AssignCareProviderToPatientsDto.careProviderIds = IDArr;
  //         },
  //         (error) => {
  //           this.toaster.error(error.message, error.error || error.error);
  //           // this.addUserModal.hide();
  //         }
  //       );
  //   }
  // }
  selectedPatientsCareProviders() {
    this.assignRemoveCareProvidersToPatientsDto.careProviderIdsToAssign = [];
    if (this.selected.length > 0) {
      this.selectedPatientsCareProvidersList =
        new Array<CareProvidersListDto>();
      this.selected.forEach((patient) => {
        this.selectedPatientsCareProvidersList = [
          ...this.selectedPatientsCareProvidersList,
          ...patient.careProviders,
        ];
      });
      this.selectedPatientsCareProvidersList =
        this.selectedPatientsCareProvidersList.filter(
          (v, i) =>
            this.selectedPatientsCareProvidersList.findIndex(
              (item) => item.careProviderId == v.careProviderId
            ) === i
        );
      // if (this.selected.length === 1) {
      //   this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = this.selected[0].careFacilitatorId;
      // } else {
      // }
      this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = 0;
    }
  }
  addEncounterModalFn() {
    if (
      this.ccmEncounterListDto.patientId &&
      this.selectedPatient &&
      this.ccmEncounterListDto.patientId === this.selectedPatient.id &&
      this.selectedPatient.chronicDiagnosesIds &&
      this.selectedPatient.chronicDiagnosesIds.length < 2
    ) {
      this.router.navigate(["/admin/patient/" + this.patientId +"/pDetail/pDiagnoses"]);
      this.toaster.warning(
        "Please add chronic diseases before proceeding."
      );
      return;
    }
    this.subs.sink = this.patientsService
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
  approveCarePlanLink() {
    this.router.navigateByUrl(
      "/admin/patient/" +
        this.ccmEncounterListDto.patientId +
        "/pDetail/pMasterCarePLan"
    );
  }
  AssignHHCEndDateColor() {
    this.rows.forEach(p => {
      if (p.ccmStatus == 25 && p.hhcEndDate && moment(p.hhcEndDate) < moment().subtract(1, 'days')) {
        p.hhcEndDateClass = 'text-danger'
      } else {
        p.hhcEndDateClass = 'text-dynamic-2c'
      }
    });

  }
  AssignCcmStatus(id: number) {
    this.isChangingCCMStatus = true;
    this.ccmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.ccmStatusChangeDto.patientId = id;
    this.subs.sink = this.patientsService
      .changePatientCcmStatus(this.ccmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Ccm Status Changed Successfully");
          this.selectedPatient.ccmStatus = this.ccmStatusChangeDto.newStatusValue;
          this.selectedPatient.hhcEndDate = this.ccmStatusChangeDto.hhcEndDate;
          this.GetMonthlyCcmData();
          this.AssignHHCEndDateColor();
          this.isChangingCCMStatus = false;
          // this.addNote();
          this.ccmStatusModal.hide();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          this.isChangingCCMStatus = false;
          // this.addUserModal.hide();
        }
      );
  }
  AssignRPMStatus(id: number) {
    this.ccmStatusModal.hide();
    this.rpmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.rpmStatusChangeDto.patientId = id;
    this.subs.sink = this.patientsService
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
  deletePatient() {
    this.subs.sink = this.patientsService
      .deletePatient(this.deletePatientDto)
      .subscribe(
        (res: any) => {
          this.deletePatientDto.reasonDeleteDetails = "";
          this.deletePatientDto.reasonDeleted = 0;
          // this.reason = '';
          this.filterPatients();
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  // GetAllChronicDisease() {
  //   this.subs.sink = this.patientsService.getAllChronicDisease().subscribe(
  //     (res: any) => {
  //       this.AllCronicDiseaseList = res;
  //     },
  //     (err) => {}
  //   );
  // }
  calculateEndtime() {
    // let currentTime = new Date();

    const endTime = moment().format("HH:mm");
    this.ccmEncounterListDto.endTime = endTime;
    if (this.ccmEncounterListDto.duration) {
      // let startTime = moment(this.ccmEncounterListDto.startTime, 'hh:mm');

      this.calculateTime();
    }
    // if (currentTime.getHours() > 12) {
    //   this.ccmEncounterListDto.endTime = (currentTime.getHours() - 12) + ':' + currentTime.getMinutes();
    // } else {
    //   this.ccmEncounterListDto.endTime = currentTime.getHours() + ':' + currentTime.getMinutes();
    // }
  }
  calculateTime() {
    const CurrentTime = moment(this.ccmEncounterListDto.endTime, "HH:mm");
    if (this.ccmEncounterListDto.duration) {
      // if (this.ccmEncounterListDto.duration >= 60) {
      //   var hours = Math.floor(this.ccmEncounterListDto.duration / 60);
      //   var minutes = this.ccmEncounterListDto.duration % 60;
      //   let duration = moment(hours + ':' + minutes, 'hh:mm');
      //   this.myduration = duration;
      // } else {
      //   let duration = moment(this.ccmEncounterListDto.duration, 'mm');
      //   this.myduration = duration;
      // }
      if (this.ccmEncounterListDto.duration > 59) {
        this.ccmEncounterListDto.duration = null;
        this.ccmEncounterListDto.startTime = null;
        return;
      }
      const duration = moment(this.ccmEncounterListDto.duration, "mm");
      this.myduration = duration;
      const startTime = moment.duration(CurrentTime.diff(this.myduration));
      const newTime =
        startTime.hours().toString() + ":" + startTime.minutes().toString();
      this.ccmEncounterListDto.startTime = moment(newTime, "HH:mm").format(
        "HH:mm"
      );
      // console.log(`start : ${this.ccmEncounterListDto.startTime}  end : ${this.ccmEncounterListDto.endTime}`)
      // this.myduration = moment(this.myduration % 60);
      // if (startTime.hours() > 12) {
      //   const calculatestartTime = moment(startTime.hours() - 12);

      //   this.ccmEncounterListDto.startTime = moment(
      //     calculatestartTime + ':' + startTime.minutes().toString(),
      //     'HH:mm'
      //   ).format('HH:mm');
      // } else {
      //   this.ccmEncounterListDto.startTime = moment(
      //     startTime.hours().toString() + ':' + startTime.minutes().toString(),
      //     'HH:mm'
      //   ).format('HH:mm');
      // }
    }
    if (this.ccmEncounterListDto.duration < 0) {
      this.toaster.warning("Invalid duration entered");
      this.ccmEncounterListDto.duration = null;
      return;
    }
  }
  calculateDuration() {
    if (this.ccmEncounterListDto.startTime) {
      const startTime = moment(this.ccmEncounterListDto.startTime, "HH:mm");
      const endTime = moment(this.ccmEncounterListDto.endTime, "HH:mm");
      const calculateDuration = moment.duration(endTime.diff(startTime));
      this.ccmEncounterListDto.duration =
        calculateDuration.hours() * 60 + calculateDuration.minutes();
      if (this.ccmEncounterListDto.duration < 0) {
        this.toaster.warning("Invalid start/end time entered");
        this.ccmEncounterListDto.duration = null;
        return;
      }
    }
  }
  resetCcmEncounterlist() {
    this.ccmEncounterListDto.note = "";
    this.ccmEncounterListDto.ccmServiceTypeId = 8;
    this.ccmEncounterListDto.startTime = "";
    this.ccmEncounterListDto.endTime = "";
    this.ccmEncounterListDto.duration = null;
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.statementManagementService.IsSetDataTable = true;
    this.statementManagementService.filterPatientData = this.filterPatientDto;
    this.statementManagementService.setTableData = this.table.state;
    this.subs.unsubscribe();
  }
  // resizeNgxTable(event: any) {
  //   this.table.recalculate();
  //   console.log(this.table.element);
  // }
  generateCareProvidersCaption(names: string): string[] {
    const namesArray = new Array<string>();
    if (names) {
      const tempArr = names.split(",");
      tempArr.forEach((sName) => {
        if (sName) {
          namesArray.push(sName);
        }
      });
      return namesArray;
    } else {
      return namesArray;
    }
  }
  DownLoadZip() {
    this.LoadingData = true;
    if (this.downloadData) {
      this.isLoadingZip = true;
      if (this.downloadData === "selected") {
        const ArrayOfIds = new Array<number>();
        // const FacilityUserId = this.securityService.securityObject.id;
        this.selected.forEach((vals) => {
          ArrayOfIds.push(vals.id);
        });
        this.downloadLogHistory.patientIds = ArrayOfIds;
      } else {
        this.downloadLogHistory.patientIds = new Array<number>();
      }
      if (this.downloadData === "active") {
        this.downloadLogHistory.isActive = true;
        this.downloadLogHistory.isCompleted = false;
      }
      if (this.downloadData === "completed") {
        this.downloadLogHistory.isActive = false;
        this.downloadLogHistory.isCompleted = true;
      }
      this.downloadLogHistory.monthId = this.filterPatientDto.serviceMonth;
      // this.downloadLogHistory.monthId = this.filterPatientDto.serviceMonth;
      this.downloadLogHistory.yearId = this.filterPatientDto.serviceYear;
      this.downloadLogHistory.facilityId = this.facilityId;
      this.subs.sink = this.ccmService
        .GetLogsHistoryByFacilityId(this.downloadLogHistory)
        .subscribe(
          (res: any) => {
            this.isLoadingZip = false;
            // const newWindow = window.open("", "_blank");
            // const blob = new Blob([res], {
            //   type: "application/zip"
            // });
            // const url = window.URL.createObjectURL(res);
            // newWindow.location.href = url;
            // FileSaver.saveAs(
            //   new Blob([res], { type: "application/zip" }),
            //   `${this.downloadLogHistory.facilityId}-${this.downloadLogHistory.monthId}-LogHistory.zip`
            // );
            this.LoadingData = false;
          },
          (err: any) => {
            this.LoadingData = false;
            this.isLoadingZip = false;
            // this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  ChangeCcmFlag(patientI: PatientDto) {
    this.subs.sink = this.ccmService
      .ChangeCcmFlag(patientI.id, !patientI.ccmFlagged)
      .subscribe(
        (res: any) => {
          patientI.ccmFlagged = !patientI.ccmFlagged;
          // this.LoadingData = false;
        },
        (err: any) => {
          // this.isLoadingZip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  initialiceCCMMonthlyParamObj(filterApplied?: boolean) {
    this.getCCMMonthlyDataParamObj = new CCMMonthlyDataParamsDto();
    if(!filterApplied){
      this.getCCMMonthlyDataParamObj.monthId = this.appData.currentMonth;
      this.getCCMMonthlyDataParamObj.yearId = this.appData.currentYear;
      this.getCCMMonthlyDataParamObj.facilityId = this.facilityId;
    }else{
      this.getCCMMonthlyDataParamObj.monthId = this.filterPatientDto.serviceMonth;
      this.getCCMMonthlyDataParamObj.yearId = this.filterPatientDto.serviceYear;
      this.getCCMMonthlyDataParamObj.facilityId = this.filterPatientDto.FacilityId;
    }
  }
  GetMonthlyCcmData() {
    const fPDto = new CCMMonthlyDataParamsDto();
    for (const filterProp in this.getCCMMonthlyDataParamObj) {
      if (
        this.getCCMMonthlyDataParamObj[filterProp] === null ||
        this.getCCMMonthlyDataParamObj[filterProp] === undefined
      ) {
        this.getCCMMonthlyDataParamObj[filterProp] = fPDto[filterProp];
      }
    }
    this.subs.sink = this.ccmService
      .GetMonthlyCcmData(this.getCCMMonthlyDataParamObj)
      .subscribe(
        (res: CCMMonthlyDataResponseDto) => {
          this.CCMMonthlyDataResponseDtoObj = res;
          const comPerc =
            (100 * this.CCMMonthlyDataResponseDtoObj.ccmTime_20_plus_plus) /
            this.CCMMonthlyDataResponseDtoObj.activePatientsCount;
          this.CCMMonthlyDataResponseDtoObj["completedPercent"] =
            (comPerc.toFixed() || 0) + "%";
        },
        (err: any) => {
          // this.isLoadingZip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  SaveAssignedDate(modal: any) {
    this.assignedDateProp = moment(this.assignedDateProp, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    this.assigningDate = true;
    this.subs.sink = this.patientsService
      .EditDateAssigned(
        this.selectedPatient.id,
        this.assignedDateProp,
        this.facilityId
      )
      .subscribe(
        (res) => {
          modal.hide();
          this.assigningDate = false;
          this.selectedPatient.dateAssigned = this.assignedDateProp;
          this.toaster.success("Date Saved Successfully");
        },
        (error) => {
          this.assigningDate = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  SaveLastVisitDate(modal: any) {
    this.lastVisitDateProp = moment(this.lastVisitDateProp, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    this.lastVisitAssigningDate = true;
    this.subs.sink = this.patientsService
      .EditRecentPcpAppointment(
        this.selectedPatient.id,
        this.lastVisitDateProp,
        this.facilityId
      )
      .subscribe(
        (res) => {
          modal.hide();
          this.lastVisitAssigningDate = false;
          this.selectedPatient.recentPcpAppointment = this.lastVisitDateProp;
          this.toaster.success("Date Saved Successfully");
        },
        (error) => {
          this.lastVisitAssigningDate = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  AssignCcmMonthlyStatus(id: number) {
    this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus = id;
    this.ccmMonthlyStatusChangeDto.PatientId = this.selectedPatient.id;
    this.subs.sink = this.patientsService
      .editPatientCcmMonthlyStatus(this.ccmMonthlyStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Ccm Monthly Status Changed Successfully");
          this.selectedPatient.ccmMonthlyStatus = id;
          this.ccmStatusModal.hide();
          this.GetMonthlyCcmData();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  getccmStatusArray() {
    const keys = Object.keys(CcmStatus).filter(
      (k) => typeof CcmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: CcmStatus[key as any],
      word: key,
    })); // [0, 1]
    return values;
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
    this.FillNoteText(this.ccmEncounterListDto.note)
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
  ProceedToCCm() {
    if (
      this.ccmEncounterListDto.patientId &&
      this.currentPatient &&
      this.ccmEncounterListDto.patientId === this.currentPatient.id &&
      this.currentPatient.chronicDiagnosesIds &&
      this.currentPatient.chronicDiagnosesIds.length < 2
    ) {
      this.router.navigate(["/admin/addPatient/" + this.currentPatient.id], {
        queryParams: { setActive: 3 },
      });
      return;
    }
    this.unApprovedCarePLanModal.hide();
    this.addEncounterModal.show();
  }
  // getRowClass(row: any) {
  //    return {
  //      "bg-danger": row.isDeleted,
  //    };
  // }
  CopyMRData(copyDataBtn: HTMLElement) {
    const textArea = document.createElement("textarea");
    // textArea.style.display = 'none';
    textArea.value = this.mrHtmlCOntent.nativeElement.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    textArea.remove();
    copyDataBtn.title = "Copied";
    this.toaster.success("Content Copied");
  }
  CopyMRData1() {
    let copyStr = "";
    copyStr += `CCM Time : ${this.mrReviewData.ccmTimeCompleted} \n`;
    copyStr += `Notes \n`;
    this.mrReviewData.ccmEncounters.forEach((log) => {
      // tslint:disable-next-line: max-line-length
      copyStr += `Service Type : ${log.ccmServiceType}, Created By : ${
        log.careProviderName
      } , Date : ${this.datePipe.transform(
        log.encounterDate,
        "MM-dd-yyyy"
      )} , Start Time: ${log.startTime}, End Time : ${
        log.endTime
      } , Duration : ${log.duration} \n`;
      copyStr += `Note: ${log.note} \n`;
    });
    // copyStr += `Assessments \n`;
    // if (this.mrReviewData.assessments.length < 1) {
    //   copyStr += `       No assessments found \n`;
    // }
    copyStr += `-----------------------------\n`;
    this.mrReviewData.assessments.forEach((assm) => {
      copyStr += `Assessment - ${assm.name} \n`;
      assm.assessmentPatientProblems.forEach((Problem) => {
        copyStr += ` ${Problem.description} \n`;
        Problem.assessmentPatientQuestions.forEach((question) => {
          copyStr += `  Question : ${question.question}\n`;
          copyStr += `  Answer : ${question.answer}\n`;
          if (question.comment) {
            copyStr += `  Comment : ${question.comment}\n`;
          }
        });
      });
    });
    copyStr += `\n-----------------------------\n`;
    this.mrReviewData.interventions.forEach((interv) => {
      copyStr += `Intervention - ${interv.name} \n`;
      interv.mrPatientProblems.forEach((Problem) => {
        copyStr += ` ${Problem.description} \n`;
        Problem.mrPatientGoals.forEach((goal) => {
          copyStr += `  Goal : ${goal.description}\n`;
          goal.mrPatientInterventions.forEach((pInterv) => {
            copyStr += `   Intervention : ${pInterv.description}\n`;
            copyStr += `   Status : ${
              this.MRInterventionStatusENum[pInterv.status]
            }\n`;
            if (pInterv.interventionDate) {
              copyStr += `   Date : ${this.datePipe.transform(
                pInterv.interventionDate,
                "MM-dd-yyyy"
              )}\n`;
            }
          });
        });
      });
      copyStr += `-----------------------------\n`;
    });
    const textArea = document.createElement("textarea");
    textArea.value = copyStr;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    textArea.remove();
    this.toaster.success("Content Copied");
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
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    this.profileStatus = row.profileStatus;
    if (e.target.checked) {
      this.selected.push(row);
      this.customListForPatientsListCompRef.selected = this.selected;
    } else {
      const index = this.selected.findIndex((x) => x.id === row.id);
      this.selected.splice(index, 1);
      this.customListForPatientsListCompRef.selected = this.selected;
    }
  }
  //  selectRow(row) {
  //   this.gridCheckAll = false;
  //   this.profileStatus = row.profileStatus;
  //   if (row.checked) {
  //     this.selected.push(row);
  //   } else {
  //     const index = this.selected.findIndex(x => x.id === row.id);
  //     this.selected.splice(index, 1);
  //   }
  // }
  deSelectPatientCareProviders(id: number) {
    this.selectedPatientsCareProvidersList =
      this.selectedPatientsCareProvidersList.filter(
        (CP) => CP.careProviderId !== id
      );
    this.assignRemoveCareProvidersToPatientsDto.careProviderIdsToRemove.push(
      id
    );
  }
  clearCareProviders() {
    //  this.tempSelectedPatientsCareProvidersList = this.selectedPatientsCareProvidersList;
    this.selectedPatientsCareProvidersList.forEach((el) => {
      this.assignRemoveCareProvidersToPatientsDto.careProviderIdsToRemove.push(
        el.careProviderId
      );
    });
    this.selectedPatientsCareProvidersList = [];
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
    this.subs.sink = this.patientsService
      .AssignRemoveCareProvidersToPatients(
        this.assignRemoveCareProvidersToPatientsDto
      )
      .subscribe(
        (res) => {
          this.assignRemoveCareProvidersToPatientsDto =
            new AssignRemoveCareProvidersToPatientsDto();
          this.assignRemoveCareProvidersToPatientsDto.careFacilitatorId = 0;
          this.selectedPatientsCareProvidersList =
            new Array<CareProvidersListDto>();
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

  GetPatientDueCareGaps(row: PatientDto, modal: ModalDirective) {
    if (!row.dueGapsCount || row.dueGapsCount < 1) {
      this.toaster.success("No due gaps found.");
      return;
    }
    this.dueGapsList = [];
    modal.show();
    this.gettingDueGaps = true;
    this.subs.sink = this.pcmService.GetPatientsDueGaps(row.id).subscribe(
      (res: MeasureDto[]) => {
        this.dueGapsList = [];
        this.dueGapsList = res;
        this.dueGapsList.forEach((element) => {
          if (!element.statusList) {
            return;
          }
          const find = element.statusList.find(
            (x) => x.value === element.status
          );
          if (find) {
            element["cStatus"] = find.name;
          }
        });
        this.gettingDueGaps = false;
      },
      (err: HttpResError) => {
        this.gettingDueGaps = false;
        modal.hide();
        this.toaster.error(err.error, err.message);
      }
    );
  }
  openMonthlyReviewModal(patientId: number){
    this.ccmQualityCheckMOdalDto.patientId = patientId;
    this.appUi.openCCMQualityCheckModal.next(this.ccmQualityCheckMOdalDto);
  }
  GetMonthlyReviewData(pId: number, modal: ModalDirective) {
    const monthId = moment(this.filterDataService.selectedCCMDashboardDate, "YYYY-MM").month() + 1;
    const yearId = moment(this.filterDataService.selectedCCMDashboardDate, "YYYY-MM").year();
    this.GettingMRData = true;
    modal.show();
    this.mrReviewData = new MonthlyReviewDataDto();
    this.subs.sink = this.mrService.GetMonthlyReviewData(pId, monthId, yearId).subscribe(
      (res: MonthlyReviewDataDto) => {
        this.mrReviewData = res;
        this.selectedPatient.msQualityCheckedByName =
          res.patient.msQualityCheckedByName;
        this.GettingMRData = false;
      },
      (err: HttpResError) => {
        this.GettingMRData = false;
        modal.hide();
        this.toaster.error(err.error, err.message);
      }
    );
  }
  SetMsQualityChecked() {
    this.SetQualityCheckForMR = true;
    this.subs.sink = this.mrService
      .SetMsQualityChecked(this.selectedPatient.id)
      .subscribe(
        (res: any) => {
          this.selectedPatient.msQualityChecked = true;
          this.rows.forEach((iPatient) => {
            if (iPatient.id === this.selectedPatient.id) {
              iPatient.msQualityChecked = true;
            }
          });
          this.SetQualityCheckForMR = false;
          this.selectedPatient.msQualityCheckedByNameAbbreviation =
            this.nameCaption;
          this.selectedPatient.msQualityCheckedByName =
            this.currentUser.fullName;
          this.selectedPatient.msQualityCheckedDate = moment().format();
          const dateTime = moment(
            this.selectedPatient.msQualityCheckedDate
          ).format("MMMM Do YYYY, h:mm:ss a");
          const msQualityCheckedByNameAndDate = `${this.selectedPatient.msQualityCheckedByName}\n ${dateTime}`;
          this.selectedPatient["msQualityCheckedByNameAndDate"] =
            msQualityCheckedByNameAndDate;
          console.log(this.selectedPatient);
          console.log(this.currentUser);
        },
        (err: HttpResError) => {
          this.SetQualityCheckForMR = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getNameCaption() {
    const fullName = this.securityService.securityObject.fullName.split(" ");
    if (fullName.length === 2) {
      this.nameCaption = fullName[0].slice(0, 1) + fullName[1].slice(0, 1);
    } else {
      this.nameCaption = fullName[0].slice(0, 2);
    }
  }
  delayForMouseOver(pId: number) {
    this.isServiceLoad = true;
    const timeOutRef = setTimeout(() => {
      if (this.mouseOverIntervalRef[pId]) {
        this.GetPatientActieServicesDetail(pId);
      }
    }, 600);
    this.mouseOverIntervalRef[pId] = timeOutRef;
  }
  clearMouseInterval(pId: number) {
    this.mouseOverIntervalRef[pId] = "";
  }
  GetPatientActieServicesDetail(pId: number) {
    this.patientActieServicesDto = new PatientActieServicesDto();
    this.isServiceLoad = true;
    this.subs.sink = this.patientsService
      .GetPatientActieServicesDetail(pId)
      .subscribe(
        (res: PatientActieServicesDto) => {
          this.isServiceLoad = false;
          this.patientActieServicesDto = res;
        },
        (err: HttpResError) => {
          this.isServiceLoad = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  delayForMouseOverMRToolTip(pId: number) {
    this.ccmMSToolTip = ``
    this.loadingMRToolTip = true;
    const timeOutRef = setTimeout(() => {
      if (this.mrTooltipOverRef[pId]) {
        this.GetCcmMsHistoryToolTip(pId);
      }
    }, 600);
    this.mrTooltipOverRef[pId] = timeOutRef;
  }
  clearMouseIntervalMRToolTip(pId: number) {
    this.mrTooltipOverRef[pId] = "";
  }
  GetCcmMsHistoryToolTip(pId: number) {
    this.loadingMRToolTip = true;
    this.subs.sink = this.patientsService
      .GetCcmMsHistoryToolTip(pId)
      .subscribe(
        (res: {name: string, date: string}) => {
          this.loadingMRToolTip = false;
          let nData = moment.utc(res.date).local().format('D MMM YY,\\ h:mm a')
          this.ccmMSToolTip = `${nData} <br> ${res.name}`
          // this.patientActieServicesDto = res;
        },
        (err: HttpResError) => {
          this.loadingMRToolTip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  delayForMouseOverCCMStatusToolTip(pId: number) {
    this.ccmSToolTip = ``
    this.loadingMRToolTip = true;
    const timeOutRef = setTimeout(() => {
      if (this.mrTooltipOverRef[pId]) {
        this.GetCcmStatusHistoryToolTip(pId);
      }
    }, 600);
    this.mrTooltipOverRef[pId] = timeOutRef;
  }
  clearMouseIntervalCCMStatusToolTip(pId: number) {
    this.mrTooltipOverRef[pId] = "";
  }
  GetCcmStatusHistoryToolTip(pId: number) {
    this.loadingMRToolTip = true;
    this.subs.sink = this.patientsService
      .GetCcmStatusHistoryToolTip(pId)
      .subscribe(
        (res: {updatedDateTime: string, updatedBy: string, reason: string}) => {
          this.loadingMRToolTip = false;
          let nData = moment.utc(res.updatedDateTime).local().format('D MMM YY,\\ h:mm a')
          this.ccmSToolTip = `Date: ${nData || ''} <br> User: ${res.updatedBy || ''} <br> Reason: ${res.reason || ''}`
          // this.patientActieServicesDto = res;
        },
        (err: HttpResError) => {
          this.loadingMRToolTip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  checkRevoked(row: PatientDto) {
    this.patientId = row.id;
    this.PatientEncounterMonthlyStatus =
      row.ccmMonthlyStatus || CcmMonthlyStatus["Not Started"];
    this.PatientEncounterMonthlyStatusTExt =
      CcmMonthlyStatus[row.ccmMonthlyStatus];
    this.PatientEncounterMonthlyStatusAcknowledge = false;
    if (row.isCCMRevoked) {
      // return;
      this.IsRevokedModal.show();
    } else {
      this.resetCcmEncounterlist();
      this.AssignValueCcmService();
      this.addEncounterModalFn();
      this.calculateEndtime();
      // this.ccmStatusModal.show();
    }
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
  OpenEncounterLogsModal(patient: PatientDto, Modal: ModalDirective) {
    let nUrl = localStorage.getItem("switchLocal")
      ? environment.localBaseUrl
      : environment.baseUrl;
    nUrl = environment.appUrl;
    nUrl = nUrl + `customUrl/logsHistory/${patient.id}`;
    nUrl += "?isIframe=true&viewType=CCM";
    // nUrl = `http://localhost:4200/customUrl/logsHistory/${patient.id}`;
    this.ccmLogsModalLink = this.sanatizer.bypassSecurityTrustResourceUrl(
      nUrl
    ) as any;
    Modal.show();
  }
  // openMonthlyReview(){
  //   // routerLink="/patientMr/{{row.id}}/monthlyReview"
  // }
  openMonthlyReview(patient: PatientDto, event: MouseEvent) {
    this.patientId = patient.id;
    this.appData.summeryViewPatient = patient;
    this.patientData = patient;
    if (this.patientData.isCCMRevoked) {
      this.revokeType = "CCM";
      this.ModelForRevokeMR();
      this.showAlertMessage();
      return;
    }
    // if (this.isCarePLanApproved === true) {
    //   this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
    //   return;
    // }
    this.filterDataService.routeState = this.router.url;
    if (
      this.appData.summeryViewPatient &&
      this.appData.summeryViewPatient.id === this.patientId &&
      (this.appData.summeryViewPatient.chronicDiagnosesIds.length < 2 ||
        this.appData.summeryViewPatient.profileStatus === false)
    ) {
      if (this.appData.summeryViewPatient.profileStatus === false) {
        this.router.navigate(["/admin/addPatient/" + this.patientId]);
        this.toaster.warning("Please complete profile before proceed.");
        return;
      } else {
        this.router.navigate(["/admin/patient/" + this.patientId +"/pDetail/pDiagnoses"]);
        this.toaster.warning(
          "Please add chronic diseases before proceeding."
        );
        return;
      }
    }
    this.patientService.IsCarePlanApproved(this.patientId).subscribe(
      (res: any) => {
        this.isCarePLanApproved = res;
        if (this.isCarePLanApproved === false) {
          // this.unApprovedCarePLanModal.show();
          // if (window.confirm('Care PLan is not approved by Billing Provider.')) {
          //   this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
          // } else {
          //   return;
          // }
          this.openConfirmModal("any");
        } else {
          // this.router.navigateByUrl('/patientMr/CpQuestions/' + this.PatientId);
          this.router.navigateByUrl(
            "/patientMr/" + this.patientId + "/monthlyReview"
          );
          // routerLink="/admin/CpQuestions/{{PatientId}}"
        }
      },
      (err: HttpResError) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
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
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Unapproved Profile";
    modalDto.Text = "Care Plan is not approved by Billing Provider.";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    modalDto.rejectButtonText = "CLOSE";
    modalDto.acceptButtonText = "PROCEED";
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.navigateToMonthlyReview();
  };
  navigateToMonthlyReview() {
    // this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
    this.router.navigateByUrl(
      "/patientMr/" + this.patientId + "/monthlyReview"
    );
  }
  openComplaintsModal(data: RpmPatientsListDto) {
    const event = new EmitEvent();
    event.name = EventTypes.openComplaintsModal;
    event.value = data;
    this.eventBus.emit(event);
  }
  assignDate(row) {
    if (!row.dateAssigned) {
      const time = "12:00 AM";
      const date = moment().format("YYYY-MM-DD");
      this.assignedDateProp = moment(date + " " + time).format("YYYY-MM-DD");
    } else {
      this.assignedDateProp = moment(row.dateAssigned).format("YYYY-MM-DD");
    }
  }
  lastVisitAssignDate(row) {
    if (!row.recentPcpAppointment) {
      const time = "12:00 AM";
      const date = moment().format("YYYY-MM-DD");
      this.lastVisitDateProp = moment(date + " " + time).format("YYYY-MM-DD");
    } else {
      this.lastVisitDateProp = moment(row.recentPcpAppointment).format("YYYY-MM-DD");
    }
  }
  clearDatePickerSelection() {
    this.showAssignDateField = false;
    setTimeout(() => {
      this.showAssignDateField = true;
    }, 300);
  }
  GetAllCountries() {
    this.patientService.GetAllCountries().subscribe(
      (res: any) => {
        this.countriesList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  clearCCMStatusChangeDtoValues() {
    this.ccmStatusChangeDto = new CcmStatusChangeDto();
  }
  addNote() {
    if (this.ccmStatusChangeDto.patientId) {
      const patientNote = new PatientNoteDto();
      patientNote.note = this.ccmStatusChangeDto.reason;
      patientNote.tag = "CCM";
      patientNote.dateCreated = new Date();
      patientNote.patientId = this.ccmStatusChangeDto.patientId;
      patientNote.facilityUserId = this.securityService.securityObject.id;
      this.isLoading = true;
      this.subs.sink = this.patientService
        .addUpdatePatientNote(patientNote)
        .subscribe(
          (res: any) => {
            // this.getNotesList();
            // this.noteText = "";
            this.isLoading = false;
            this.toaster.success("Note Added Successfully");
          },
          (err) => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
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
    this.patientService
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
  MakeCustomListExcel() {
    console.log(this.selectedCustomListName)
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
    const FileName = moment().format('DD-MMM-YYYY, h:mm a');
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
      if (item.recentPcpAppointment) {
        item.recentPcpAppointment = moment(item.recentPcpAppointment).format('DD-MMM-YYYY');
      }
      if (item.lastCcm) {
        item.lastCcm = moment(item.lastCcm).format('DD-MMM-YYYY');
      }
      if (item.dateAssigned) {
        item.dateAssigned = moment(item.dateAssigned).format('DD-MMM-YYYY');
      }
      if (item.ccmStatus >= 0) {
        item.ccmStatusString = CcmStatus[item.ccmStatus]
      }
      if (item.ccmMonthlyStatus >= 0) {
        item.ccmMonthlyStatusString = CcmMonthlyStatus[item.ccmMonthlyStatus]
      }
      if (item.rpmStatus >= 0) {
        item.rpmStatusString = RpmStatus[item.rpmStatus]
      }
      if (item.careProviderNames.length) {
        item.careProvidersNameString = item.careProviderNames.map(x=>x).join(",");
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
          'CCM Time': this.checkIfNull(item.currentMonthCompletedTime),
          'CCM Status': this.checkIfNull(item.ccmStatusString),
          'CCM MS': this.checkIfNull(item.ccmMonthlyStatusString),
          'Last CCM': this.checkIfNull(item.lastCcm),
          'Rpm Status': this.checkIfNull(item.rpmStatusString),
          'Last Visit': this.checkIfNull(item.recentPcpAppointment),
          'Quality Checked': this.checkIfNull(item.msQualityCheckedByName),
          'Assigned Date': this.checkIfNull(item.dateAssigned),
          'Billing Provider': this.checkIfNull(item.billingProviderName),
          'Care Facilitator': this.checkIfNull(item.careFacilitatorName),
          'Care Provider': this.checkIfNull(item.careProvidersNameString),
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
  randomColor() {
    // document.documentElement.style.setProperty("--dynamic-colour", 'orange')
  }
  getCcmStatusHistory(patientId) {
    this.isLoadingCcmStatusHistory = true;
    this.patientService.GetPatientCCMStatusHistory(patientId).subscribe(
      (res: any) => {
        this.ccmStatusHistoryList = res;
        this.isLoadingCcmStatusHistory = false;
        this.ccmStatusHistoryModal.show();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingCcmStatusHistory = false;
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
  changeMonthlyStatus(item){
    if(!this.selectedPatient.isConsentTaken && item.value == CcmMonthlyStatus.Completed){
      this.toaster.warning("Patient consent has not been taken.");
      return;
    }else{
      this.PatientEncounterMonthlyStatusAcknowledge=true;
      this.PatientEncounterMonthlyStatus=item.value;
      this.PatientEncounterMonthlyStatusTExt=item.name;
    }
  }
}