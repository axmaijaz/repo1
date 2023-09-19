import { DomSanitizer } from "@angular/platform-browser";
import { AppUiService } from "./../core/app-ui.service";
import { PcmService } from "src/app/core/pcm/pcm.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { HomeService } from "./../core/home.service";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { fromEvent, Subject } from "rxjs";
import { SecurityService } from "../core/security/security.service";
import { LazyModalDto, PagingData } from "../model/AppModels/app.model";
import { HttpResError } from "../model/common/http-response-error";
import {
  LandingPageParamsDto,
  PatientForPendingPageListDto,
} from "../model/home.model";
import { SubSink } from "../SubSink";
import { debounceTime, map } from "rxjs/operators";
import { PageScrollService } from "ngx-page-scroll-core";
import { DOCUMENT } from "@angular/common";
import { InsurancePlanDto } from "../model/pcm/payers.model";
import { InsuranceService } from "../core/insurance.service";
import {
  CcmStatus,
  PatientStatus,
  RpmStatus,
} from "../Enums/filterPatient.enum";
import { PcmStatus } from "../Enums/pcm.enum";
import { BhiStatusEnum } from "../Enums/bhi.enum";
import { PrcmStatusDto, PRCMStatusEnum } from "../model/Prcm/Prcm.model";
import { TcmStatusEnum } from "../model/Tcm/tcm.enum";
import {
  CcmStatusChangeDto,
  DeletPatientDto,
  PatientActieServicesDto,
  PatientDto,
  PatientNoteDto,
  ServiceNames,
} from "../model/Patient/patient.model";
import { PcmStatusDto } from "../model/pcm/pcm.model";
import { BhiStatusDto } from "../model/Bhi/bhi.model";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { RpmPatientsListDto } from "../model/rpm.model";
import {
  EmitEvent,
  EventBusService,
  EventTypes,
} from "../core/event-bus.service";
import { DataFilterService } from "../core/data-filter.service";
import moment from "moment";
import { SetFacilityServiceConfigDto } from "../model/Facility/facility.model";
import { ChatGroupDto, ChatViewType } from "../model/chat/chat.model";
import { TwocChatService } from "../core/2c-chat.service";
import { VideoCallingService } from "../core/video-calling.service";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { PatinetCommunicationGroup } from "../model/PatientEngagement/communication.model";
import { PatientNotificationDto } from "../model/Patient/patient-notification-model";
import { AWServiceStatus } from "../Enums/aw.enum";
import { AWServiceStatusChangeDto } from "../model/AnnualWellness/aw.model";
import { AwService } from "../core/annualWellness/aw.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY"
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
  filterPatientDto = new LandingPageParamsDto();
  private subs = new SubSink();
  rowIndex = 0;
  dtTrigger = new Subject<any>();
  serviceNamesDto = new ServiceNames();

  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};
  isLoading: boolean;
  checkingHasEncounter: boolean;
  hasPreviousEncounters: boolean;
  facilityId: number;
  selected: any[];
  rows = new Array<PatientForPendingPageListDto>();
  selectedPatient = new PatientForPendingPageListDto();
  deactivateStatus: PatientStatus;
  deactivateReason = "";
  tempSelectedPatient = new PatientForPendingPageListDto();
  pagingData = new PagingData();
  table = $("#landingTable").DataTable();
  @ViewChild("ccmStatusModal") ccmStatusModal: ModalDirective;
  @ViewChild("clickOnRow") clickOnRow: ModalDirective;
  insurancePLanList: InsurancePlanDto[];
  selectModalList = "";
  mouseOverIntervalRef = {};

  patientStatus = PatientStatus;
  patientStatusArr = this.filterDataService.getEnumAsList(PatientStatus);
  awvServiceStatusEnumList = this.filterDataService.getEnumAsList(AWServiceStatus);
  ccmStatus = CcmStatus;
  pcmStatus = PcmStatus;
  bhiStatus = BhiStatusEnum;
  prCMStatus = PRCMStatusEnum;
  tcmStatus = TcmStatusEnum;
  rpmStatus = RpmStatus;
  awServiceStatus = AWServiceStatus;

  // for status list Array
  ccmStatusEnumList = new Array<any>();
  rpmStatusEnumList = new Array<any>();
  prcmStatusEnumList = new Array<any>();
  bhiStatusEnumList = new Array<any>();
  tcmStatusEnumList = new Array<any>();
  pcmStatusEnumList = new Array<any>();

  // for radio button Values
  tempCcmStatusVal: number;
  tempPcmStatusVal: number;
  tempBhiStatusVal: number;
  tempPrCMStatusVal: number;
  tempTcmStatusVal: number;
  tempRpmStatusVal: number;

  // status change DTO
  ccmStatusChangeDto = new CcmStatusChangeDto();
  rpmStatusChangeDto = new CcmStatusChangeDto();
  bhiStatusChangeDto = new BhiStatusDto();
  // tcmStatusChangeDto = new PcmStatusDto();
  pcmStatusChangeDto = new PcmStatusDto();
  prcmStatusChangeDto = new PrcmStatusDto();

  deletePatientDto = new DeletPatientDto();

  patientActieServicesDto = new PatientActieServicesDto();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("searchPatient") searchPatient: ElementRef;
  isLoadingPayersList: boolean;
  rowId: any;
  isServiceLoad: boolean;
  ccmLogsModalLink: string;
  defaultSelect: number;
  serviceSettingObj = new SetFacilityServiceConfigDto();
  isChangingCCMStatus: boolean;
  gettingChatGroup: boolean;
  gridCheckAll: boolean;
  profileStatus: any;
  chatShown: boolean;
  awServiceStatusChangeDto = new AWServiceStatusChangeDto();
  constructor(
    private securityService: SecurityService,
    private homeService: HomeService,
    private toaster: ToastService,
    private insuranceService: InsuranceService,
    private router: Router,
    private twoCChatService: TwocChatService,
    private patientsService: PatientsService,
    private pcmService: PcmService,
    private pageScrollService: PageScrollService,
    private appUi: AppUiService,
    private sanatizer: DomSanitizer,
    private route: ActivatedRoute,
    private eventBus: EventBusService,
    private filterDataService: DataFilterService,
    private patientService: PatientsService,
    private videoService: VideoCallingService,
    private awvService: AwService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    console.log(this.awvServiceStatusEnumList);
    this.serviceSettingObj.ccmService =
      this.securityService.hasClaim("ccmService");
    this.serviceSettingObj.rpmService =
      this.securityService.hasClaim("rpmService");
    this.serviceSettingObj.bhiService =
      this.securityService.hasClaim("bhiService");
    this.serviceSettingObj.pcmService =
      this.securityService.hasClaim("pcmService");
    this.serviceSettingObj.prcmService =
      this.securityService.hasClaim("prcmService");
    this.serviceSettingObj.tcmService =
      this.securityService.hasClaim("tcmService");

    // if (this.securityService.securityObject.userType === UserType.FacilityUser) {
    //   this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
    //   this.facilityUserId = this.securityService.securityObject.id;
    // } else {
    //   this.filterPatientDto.facilityUserId = 0;
    // }
    this.getFiltersData();
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;

    this.dtSelect = {
      select: true,
    };
    this.initializeDataTable();
    this.GetInsurancePlansByFacilityId();

    // status arrays
    this.getCcmStatusArray();
    this.getRpmStatusArray();
    this.getTcmStatusArray();
    this.getBhiStatusArray();
    this.getPcmStatusArray();
    this.getPrcmStatusArray();
    window.addEventListener('message', this.receiveMessage, false);
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
  ngAfterViewInit() {
    this.dtTrigger.next();
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

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.subs.unsubscribe();
  }
  getFiltersData(){
    if(this.filterDataService.filterData['mainList']){
      this.filterPatientDto = this.filterDataService.filterData['mainList'];
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
  GetPatientActieServicesDetail(id: number) {
    this.patientActieServicesDto = new PatientActieServicesDto();
    this.isServiceLoad = true;
    this.subs.sink = this.patientsService
      .GetPatientActieServicesDetail(id)
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
  GetInsurancePlansByFacilityId() {
    this.isLoadingPayersList = true;
    this.insuranceService
      .GetInsurancePlansByFacilityId(this.facilityId)
      .subscribe(
        (res: InsurancePlanDto[]) => {
          this.insurancePLanList = res;
          this.isLoadingPayersList = false;
        },
        (error: HttpResError) => {
          this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }

  initializeDataTable() {
    const defList = this.GetColumnsDefList();
    const colList = this.GetTableColumnList();
    this.dtOptions = {
      pagingType: "first_last_numbers",
      scrollX: true,
      scrollCollapse: true,
      serverSide: true,
      stateSave: true,
      stateDuration: -1,
      stateSaveCallback: function (oSettings, oData) {
        localStorage.setItem(
          'DataTables_MAIN1' + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem('DataTables_MAIN1' + window.location.pathname)
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
      columnDefs: defList,
      language: {
        paginate: {
          first: '<i class="fa fa-backward fa-lg"></i>',
          last: '<i class="fa fa-forward fa-lg"></i>',
        },
      },
      initComplete: function (aa) {
        // console.log("api", aa);
      },
      ajax: (dataTablesParameters: any, callback, settings) => {
        if (dataTablesParameters.start === 1) {
          dataTablesParameters.start = 0;
        }
        this.rowIndex = dataTablesParameters.start;
        this.filterPatientDto.pageSize = dataTablesParameters.length;
        this.filterPatientDto.pageNumber =
          dataTablesParameters.start / dataTablesParameters.length + 1;
        this.filterPatientDto.pageNumber = Math.floor(
          this.filterPatientDto.pageNumber
        );
        if (
          dataTablesParameters.draw > 1 &&
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
        this.assignUserValues();
        this.filterPatientDto.facilityId = this.facilityId;
        this.isLoading = true;
        this.filterDataService.filterData['mainList'] = this.filterPatientDto;
        this.subs.sink = this.homeService
          .GetPatientsForDashboard(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              this.isLoading = false;
              this.selected = [];
              this.rows = [];
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
                if(patient.lastCcmStatusChangeDate){
                  patient.lastCcmStatusChangeDate = moment(patient.lastCcmStatusChangeDate).format(
                    "MMMM Do YYYY"
                  );
                }
                if(patient.lastRpmStatusChangeDate){
                  patient.lastRpmStatusChangeDate = moment(patient.lastRpmStatusChangeDate).format(
                    "MMMM Do YYYY"
                  );
                }
                if(patient.lastBhiStatusChangeDate){
                  patient.lastBhiStatusChangeDate = moment(patient.lastBhiStatusChangeDate).format(
                    "MMMM Do YYYY"
                  );
                }
                if(patient.lastCcmStatusChangeDate && patient.ccmStatusChangedBy){
                  patient['ccmLastStatusChangedByNameAndDate'] = `${patient.lastCcmStatusChangeDate}\n ${patient.ccmStatusChangedBy}`
                }else{
                  patient['ccmLastStatusChangedByNameAndDate'] = "";
                }
                if(patient.lastRpmStatusChangeDate && patient.rpmStatusChangedBy){
                  patient['rpmLastStatusChangedByNameAndDate'] = `${patient.lastRpmStatusChangeDate}\n ${patient.rpmStatusChangedBy}`
                }else{
                  patient['rpmLastStatusChangedByNameAndDate'] = "";
                }
                if(patient.lastBhiStatusChangeDate && patient.bhiStatusChangedBy){
                  patient['bhiLastStatusChangedByNameAndDate'] = `${patient.lastBhiStatusChangeDate}\n ${patient.bhiStatusChangedBy}`
                }else{
                  patient['bhiLastStatusChangedByNameAndDate'] = "";
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
              this.AssignHHCEndDateColor()
            },
            (err: HttpResError) => {
              this.isLoading = false;
              this.toaster.error(err.error, err.message);
            }
          );
      },

      columns: colList,
    };
  }
  GetColumnsDefList = () => {
    var list = [
      { targets: 0, orderable: false },
      { targets: 1, orderable: false },
      { targets: 2, orderable: true },
    ];
    var tIndex = 2;
    if (this.serviceSettingObj.ccmService) {
      tIndex = tIndex + 1;
      list.push({ targets: tIndex, orderable: true });
    }
    if (this.serviceSettingObj.rpmService) {
      tIndex = tIndex + 1;
      list.push({ targets: tIndex, orderable: true });
    }
    if (this.serviceSettingObj.pcmService) {
      tIndex = tIndex + 1;
      list.push({ targets: tIndex, orderable: true });
    }
    if (this.serviceSettingObj.tcmService) {
      tIndex = tIndex + 1;
      list.push({ targets: tIndex, orderable: false });
    }
    if (this.serviceSettingObj.bhiService) {
      tIndex = tIndex + 1;
      list.push({ targets: tIndex, orderable: true });
    }
    if (this.serviceSettingObj.prcmService) {
      tIndex = tIndex + 1;
      list.push({ targets: tIndex, orderable: true });
    }
    list.push({ targets: tIndex + 1, orderable: false });
    return list;
  };
  GetTableColumnList = () => {
    var list = [
      { name: "checkBox" },
      { name: "id" },
      { name: "name" },
      { name: "Status" },
      // { name: "action" },
    ];

    if (this.serviceSettingObj.ccmService) {
      list.push({ name: "ccmStatus" });
    }
    if (this.serviceSettingObj.rpmService) {
      list.push({ name: "rpmStatus" });
    }
    if (this.serviceSettingObj.pcmService) {
      list.push({ name: "pcmStatus" });
    }
    if (this.serviceSettingObj.tcmService) {
      list.push({ name: "tcmStatus" });
    }
    if (this.serviceSettingObj.bhiService) {
      list.push({ name: "bhiStatus" });
    };
    list.push({ name: "awv" });
    if (this.serviceSettingObj.prcmService) {
      list.push({ name: "prcmStatus" });
    }
    // list.push({ name: "Action" });
    return list;
  };
  assignUserValues() {
    this.isLoading = true;
    const fPDto = new LandingPageParamsDto();
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
  redDraw(): void {
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust();
      // console.log("dtInt", mydtInstance);
    });
    this.table.page(this.pagingData.pageNumber).draw(false);
  }
  rerender(): void {
    // this.forRerendertable = false;
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
  filterPatients(date?) {
    this.filterDataService.filterData['mainList'] = this.filterPatientDto;
    this.isLoading = true;
    this.rerender();
  }
  resetFilter() {
    this.filterPatientDto = new LandingPageParamsDto();
    this.filterPatientDto.pageNumber = 1;
  }
  scrollToTable() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: ".ccm-datatable",
    });
  }
  ConfirmReActive(patient: PatientForPendingPageListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Reactivate Patient";
    modalDto.Text = "Do you want to Reactivate this patient?";
    modalDto.callBack = this.ReactivatePatientCallBack;
    // modalDto.rejectCallBack = this.rejectCallBack;
    modalDto.data = patient;
    this.appUi.openLazyConfrimModal(modalDto);
  }

  ReactivatePatientCallBack = (patient: PatientForPendingPageListDto) => {
    this.subs.sink = this.patientsService
      .ReactivatePatient(patient.id)
      .subscribe(
        (res: any) => {
          this.selectedPatient.patientStatus = PatientStatus.Active;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
        }
      );
  };
  CheckPatientHasEncounters = () => {
    this.checkingHasEncounter = true;
    this.hasPreviousEncounters = false;
    this.subs.sink = this.patientsService
      .CheckPatientHasEncounters(this.selectedPatient.id)
      .subscribe(
        (res: any) => {
          this.hasPreviousEncounters = res;
          this.checkingHasEncounter = false;
        },
        (err: HttpResError) => {
          this.hasPreviousEncounters = false;
          this.checkingHasEncounter = false;
          this.toaster.error(err.error, err.message);
        }
      );
  };
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
  MarkPatientInActive() {
    this.subs.sink = this.patientsService
      .MarkPatientInActive(
        this.selectedPatient.id,
        this.deactivateStatus,
        this.deactivateReason
      )
      .subscribe(
        (res: any) => {
          this.selectedPatient.patientStatus = this.deactivateStatus;
          // this.reason = '';
          // this.filterPatients();
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  async onClickRow(row: PatientForPendingPageListDto, event: MouseEvent) {
    this.rowId = row.id;
    if (row.profileStatus) {
      // this.router.navigate(['/admin/patient/', row.id]);
      this.filterDataService.routeState = this.router.url;
      this.ApplyNavigation(`/admin/patient/${row.id}`, event.ctrlKey);
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
  AssignHHCEndDateColor() {
    this.rows.forEach(p => {
      if (p.ccmStatus == 25 && p.hhcEndDate && moment(p.hhcEndDate) < moment().subtract(1, 'days')) {
        p.hhcEndDateClass = 'text-danger'
      } else {
        p.hhcEndDateClass = 'text-dynamic-2c'
      }
    });

  }
  changeStatus(row: any) {
    this.selectedPatient = row;
    this.profileStatus = row.profileStatus;
    this.ccmStatusChangeDto.patientId = row.id;
    let hhcEndDate = ``
    if (row.hhcEndDate) {
      hhcEndDate = moment(row.hhcEndDate).format('YYYY-MM-DD')
    }
    this.ccmStatusChangeDto.hhcEndDate = hhcEndDate;
    this.ccmStatusChangeDto.newStatusValue = this.tempCcmStatusVal;
    this.rpmStatusChangeDto.patientId = row.id;
  }

  AssignCcmStatus() {
    this.isChangingCCMStatus = true;
    this.ccmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.ccmStatusChangeDto.patientId = this.tempSelectedPatient.id;
    // this.ccmStatusChangeDto.newStatusValue = this.tempCcmStatusVal;
    this.subs.sink = this.patientsService
      .changePatientCcmStatus(this.ccmStatusChangeDto)
      .subscribe(
        (res) => {
          this.tempSelectedPatient.ccmStatus = this.tempCcmStatusVal;
          this.tempSelectedPatient.hhcEndDate = this.ccmStatusChangeDto.hhcEndDate;
          this.selectedPatient.ccmStatus = this.ccmStatusChangeDto.newStatusValue;
          this.selectedPatient.hhcEndDate = this.ccmStatusChangeDto.hhcEndDate;
          this.toaster.success("Ccm Status Changed Successfully");
          // this.addNote();
          this.isChangingCCMStatus = false;
          this.AssignHHCEndDateColor()
          this.ccmStatusModal.hide();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          this.isChangingCCMStatus = false;
        }
      );
  }
  AssignRPMStatus() {
    this.ccmStatusModal.hide();
    this.rpmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.rpmStatusChangeDto.patientId = this.tempSelectedPatient.id;
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
  assignAwServiceStatus(status) {
    this.ccmStatusModal.hide();
    this.awServiceStatusChangeDto.awServiceStatus = status;
    this.awServiceStatusChangeDto.patientId = this.tempSelectedPatient.id;
    this.subs.sink = this.awvService
      .UpdateAWServiceStatus(this.awServiceStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("AWV Service Status Changed Successfully");
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  AssignPrCMStatus() {
    this.ccmStatusModal.hide();
    // this.rpmStatusChangeDto.appUserId = this.securityService.securityObject.appUserId;
    this.prcmStatusChangeDto.patientId = this.tempSelectedPatient.id;
    this.subs.sink = this.patientsService
      .UpdatePrcmStatus(this.prcmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Prcm Status Changed Successfully");
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  AssignPCMStatus() {
    this.ccmStatusModal.hide();
    this.pcmStatusChangeDto.patientId = this.tempSelectedPatient.id;
    this.subs.sink = this.pcmService
      .UpdatePcmStatus(this.pcmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Pcm Status Changed Successfully");
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  AssignBHIStatus() {
    this.ccmStatusModal.hide();
    this.bhiStatusChangeDto.patientId = this.tempSelectedPatient.id;
    this.subs.sink = this.patientsService
      .UpdateBhiStatus(this.bhiStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Bhi Status Changed Successfully");
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }

  getCcmStatusArray() {
    const keys = Object.keys(CcmStatus).filter(
      (k) => typeof CcmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: CcmStatus[key as any],
      word: key,
    })); // [0, 1]
    this.ccmStatusEnumList = values;
    return values;
  }
  getRpmStatusArray() {
    const keys = Object.keys(RpmStatus).filter(
      (k) => typeof RpmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: RpmStatus[key as any],
      word: key,
    })); // [0, 1]
    this.rpmStatusEnumList = values;
    return values;
  }
  getTcmStatusArray() {
    const keys = Object.keys(TcmStatusEnum).filter(
      (k) => typeof TcmStatusEnum[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: TcmStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    this.tcmStatusEnumList = values;
    return values;
  }

  getBhiStatusArray() {
    const keys = Object.keys(BhiStatusEnum).filter(
      (k) => typeof BhiStatusEnum[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: BhiStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    this.bhiStatusEnumList = values;
    return values;
  }
  getPcmStatusArray() {
    const keys = Object.keys(PcmStatus).filter(
      (k) => typeof PcmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: PcmStatus[key as any],
      word: key,
    })); // [0, 1]
    this.pcmStatusEnumList = values;
    return values;
  }
  getPrcmStatusArray() {
    const keys = Object.keys(PRCMStatusEnum).filter(
      (k) => typeof PRCMStatusEnum[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: PRCMStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    this.prcmStatusEnumList = values;
    return values;
  }
  OpenEncounterLogsModal(
    patient: PatientForPendingPageListDto,
    Modal: ModalDirective
  ) {
    let nUrl = localStorage.getItem("switchLocal")
      ? environment.localBaseUrl
      : environment.baseUrl;
    nUrl = environment.appUrl;
    nUrl = nUrl + `customUrl/logsHistory/${patient.id}`;
    nUrl += "?isIframe=true";
    // nUrl = `http://localhost:4200/customUrl/logsHistory/${patient.id}`;
    this.ccmLogsModalLink = this.sanatizer.bypassSecurityTrustResourceUrl(
      nUrl
    ) as string;
    Modal.show();
  }
  FilterSelect() {
    const allExist = this.filterPatientDto.patientStatus.find((x) => x === 0);
    if (this.filterPatientDto.patientStatus[0] === 0) {
      this.filterPatientDto.patientStatus =
        this.filterPatientDto.patientStatus.filter((x) => x !== 0);
    }
    if (this.filterPatientDto.patientStatus.length === 0) {
      this.filterPatientDto.patientStatus.push(0);
      this.filterPatientDto.patientStatus =
        this.filterPatientDto.patientStatus.filter((x) => x == 0);
    }
    // if(allExist)
  }
  openComplaintsModal(data: RpmPatientsListDto) {
    const event = new EmitEvent();
    event.name = EventTypes.openComplaintsModal;
    event.value = data;
    this.eventBus.emit(event);
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
    chatGroup.name = `${patient.fullName}`;
    chatGroup.lastCommunication = null
    event.value = chatGroup;
    this.eventBus.emit(event);
  }

  SetPatientServices() {
    let selectedPatientsIds = [];
    let serviceNames = [];
    console.log(this.serviceNamesDto);
    if (this.serviceNamesDto.bhi) {
      serviceNames.push("BHI");
    }
    if (this.serviceNamesDto.rpm) {
      serviceNames.push("RPM");
    }
    if (this.serviceNamesDto.pcm) {
      serviceNames.push("PCM");
    }
    if (this.serviceNamesDto.ccm) {
      serviceNames.push("CCM");
    }
    console.log(serviceNames);
    this.selected.forEach((patient) => {
      selectedPatientsIds.push(patient.id);
    });
    this.patientsService
      .SetPatientServices(serviceNames, selectedPatientsIds)
      .subscribe(
        (res: any) => {
          this.toaster.success("Services Updated");
          this.selected.forEach((patient: PatientDto) => {
            const selectPatient = this.rows.filter(pt => patient.id == pt.id)
            serviceNames.forEach((service) => {
              if(service == "CCM"){
                selectPatient[0].ccmStatus = CcmStatus.Active
              }
              if(service == "RPM"){
                selectPatient[0].rpmStatus = RpmStatus.Active
              }
              if(service == "PCM"){
                selectPatient[0].pcmStatus = PcmStatus.Active
              }
              if(service == "BHI"){
                selectPatient[0].bhiStatus = BhiStatusEnum["Active PCM"]
              }
            })
          })
          this.serviceNamesDto = new ServiceNames();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  gridAllRowsCheckBoxChecked(e) {
    this.rows.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      Object.assign(this.selected, this.rows);
    } else {
      this.selected = [];
    }
  }
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    this.profileStatus = row.profileStatus;
    if (e.target.checked) {
      this.selected.push(row);
    } else {
      const index = this.selected.findIndex((x) => x.id === row.id);
      this.selected.splice(index, 1);
    }
  }
  clearServiceNamesDto(){
    this.serviceNamesDto = new ServiceNames();
  }
  clearCCMStatusChangeDtoValues(){
    this.ccmStatusChangeDto = new CcmStatusChangeDto();
  }
  addNote() {
    if (this.ccmStatusChangeDto.patientId) {
      const patientNote = new PatientNoteDto();
      patientNote.note = this.ccmStatusChangeDto.reason;
      patientNote.tag = 'CCM';
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
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
}
