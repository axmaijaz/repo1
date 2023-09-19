import { ClonerService } from "src/app/core/cloner.service";
import { EmitEvent, EventTypes } from "src/app/core/event-bus.service";
// import { id } from '@swimlane/ngx-datatable';
import { DOCUMENT } from "@angular/common";
import { UserType } from "./../../Enums/UserType.enum";
import { BhiService } from "./../../core/bhi.service";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
} from "@angular/core";
import { SubSink } from "src/app/SubSink";
import { PatientsService } from "src/app/core/Patient/patients.service";
import * as moment from "moment";
import { PatientDto, FilterPatient, ChronicIcd10CodeDto } from "src/app/model/Patient/patient.model";
import { PagingData } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { DataTableDirective } from "angular-datatables";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { Subject, fromEvent } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { PreventiveGapScreenDto, GapStatus } from "src/app/model/pcm/pcm.model";
import { PcmService } from "src/app/core/pcm/pcm.service";
import { debounceTime, map } from "rxjs/operators";
import { SecurityService } from "src/app/core/security/security.service";
import { InsurancePlanDto, CareGapDto } from "src/app/model/pcm/payers.model";
import { InsuranceService } from "src/app/core/insurance.service";
import { DataFilterService } from "src/app/core/data-filter.service";

import {
  BhiPatientsScreenParams,
  EditBhiData,
  BhiPatientsListDto,
  BhiDashboardDto,
  AssignDateToMultiplePatientsDto,
  BhiMonthlyStatusDto,
  BhiStatusDto,
} from "src/app/model/Bhi/bhi.model";
import { BhiEncounterTimeEnum, BhiMonthlyStatus, BhiStatusEnum } from "src/app/Enums/bhi.enum";
import { PageScrollService } from "ngx-page-scroll-core";
import {
  AddEditCustomListDto,
  AssignPatientsToCustomListDto,
} from "src/app/model/custome-list.model";
import { CustomeListService } from "src/app/core/custome-list.service";
import { EventBusService } from "src/app/core/event-bus.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { AnalyticService } from "src/app/core/analytics.service";
import { AppUserAuth } from "src/app/model/security/app-user.auth";
import { CustomListForPatientListsComponent } from "src/app/custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component";

@Component({
  selector: "app-bhi-patient-list",
  templateUrl: "./bhi-patient-list.component.html",
  styleUrls: ["./bhi-patient-list.component.scss"],
})
export class BhiPatientListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
    appendTo: "body",
  };
  public datePickerConfig3: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
  };
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
     },
    alwaysShowCalendars: false,
  };
  sectionSelection = "";
  filterPatientDto = new BhiPatientsScreenParams();
  private subs = new SubSink();
  rowIndex = 0;
  dtTrigger = new Subject<any>();

  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};

  BhiMonthlyStatusList = this.filterDataService.getEnumAsList(BhiMonthlyStatus);
  bhiStatusDto = new BhiStatusDto();
  bhiMonthlyStatusDto = new BhiMonthlyStatusDto();
  dateAssigned: string;
  assignDateToMultiplePatientsDto = new AssignDateToMultiplePatientsDto();
  assignedDateProp: string;
  loadingOnStart: boolean;
  isLoading: boolean;
  selected: any[];
  selectModalList = "";
  rows: BhiPatientsListDto[];
  pagingData = new PagingData();
  selectedDateRange: any;
  table = $("#example").DataTable();
  bhiStatusEnum = BhiStatusEnum;
  bhiMonthlyStatusEnum = BhiMonthlyStatus;
  bhiStatusList = new Array<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  cronicDiseaseList = new Array<{ id: 0; detail: "" }>();
  gridCheckAll: boolean;
  rowId: any;
  @ViewChild("searchPatient") searchPatient: ElementRef;
  @ViewChild("editBhi") editBhi: ModalDirective;
  isLoadingPayersList: boolean;
  facilityId: number;
  psyfacilityUserList = [];
  bhiFacilityUsersList = [];
  gapStatusENumList = this.datafilterService.getEnumAsList(GapStatus);
  BhiEncounterTimeEnumList =
    this.datafilterService.getEnumAsList(BhiEncounterTimeEnum);
  tempBhiEncounterTimeEnumList =
    this.datafilterService.getEnumAsList(BhiEncounterTimeEnum);
  CareGapsList: CareGapDto[];
  editViewData: any;
  editBhiDto = new EditBhiData();
  bhiDataSpinner: boolean;
  bhiEncountersList = [];
  daterange: {};

  CustomListDto = new Array<AddEditCustomListDto>();
  facilityUserId = 0;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  facilityUsersList: any;
  queryParamsApplied: boolean;
  bhDashboardData = new BhiDashboardDto();
  selectedDate: string;
  firstCHeck: boolean;
  assigningDate: boolean;
  public assignedDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
    // format: "YYYY-MM-DDTHH:mm:ssZ",
    appendTo: "body",
    closeOnSelect: true,
    drops: "down",
  };
  CanEditAssignedDate: boolean;
  selectedPatient: any;
  assignDatePatientsList = [];
  cronicConditionsList: any;
  LoadingData: boolean;
  AllCronicDiseaseList: ChronicIcd10CodeDto[];
  disableChronicFilter: boolean;
  bIllingProviderList: any;
  SetQualityCheckForMR: boolean;
  nameCaption: string;
  currentUser= new AppUserAuth();
  loadingBhiEncounters: boolean;
  isLoadingICDCode: boolean;
  constructor(
    private pcmService: PcmService,
    private datafilterService: DataFilterService,
    private patientService: PatientsService,
    private facilityService: FacilityService,
    private insuranceService: InsuranceService,
    private securityService: SecurityService,
    private bhiService: BhiService,
    private toaster: ToastService,
    private router: Router,
    private cloner: ClonerService,
    private route: ActivatedRoute,
    private eventBus: EventBusService,
    private customListService: CustomeListService,
    private pageScrollService: PageScrollService,
    private filterDataService: DataFilterService,
    private analyticService: AnalyticService,
    @Inject(DOCUMENT) private document: any
  ) {}

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
  AddPatientsToList(id: number) {
    // this.isLoadingPayersList = true;
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
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }

  ngOnInit() {
    this.getNameCaption();
    this.getFiltersData();
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.filterPatientDto.facilityUserId =
        this.securityService.securityObject.id;
      this.facilityUserId = this.securityService.securityObject.id;
      // this.filterPatientDto.CareProviderId = this.securityService.securityObject.id;
    } else {
      this.filterPatientDto.facilityUserId = 0;
    }
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    this.dtSelect = {
      select: true,
    };
    this.eventBus.on(EventTypes.RefreshCustomList).subscribe((res) => {
      this.GetCustomListsByFacilityUserId();
    });
    //  private eventBus: EventBusService
    this.getBhiStatusList();
    this.GetBhiDahboardData();
    this.initializeDataTable();
    this.getBhiFacilityUsers();
    this.getPsyFacilityUsers();
    this.getFacilityUsers();
    this.getCronicDiseases();
    this.getCronicConditions();
    this.GetAllCareGaps();
    this.GetCustomListsByFacilityUserId();
    this.getDependentDiseases();
    this.getBillingProvidersList();
    this.selectedDate =
      this.filterPatientDto.serviceYear +
      "-" +
      this.filterPatientDto.serviceMonth;
    this.CanEditAssignedDate = this.securityService.hasClaim(
      "CanEditAssignedDate"
    );
  }
  ngAfterViewInit() {
    this.dtTrigger.next();
    this.customListForPatientsListCompRef.filterPatientDto = this.filterPatientDto as any;
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
    if(this.datafilterService.filterData['bhiList']){
      this.filterPatientDto = this.datafilterService.filterData['bhiList'];
    }
  }
  MonthFilterChanged(data) {
    if (data) {
      this.selectedDate = moment(data.date).format("YYYY-MM");
      this.filterPatientDto.serviceMonth = +moment(data.date).format("M");
      this.filterPatientDto.serviceYear = +moment(data.date).format("YYYY");
      this.filterPatients();
      this.GetBhiDahboardData();
    }
  }
  mainFilterChanged() {
    this.GetBhiDahboardData();
    this.filterPatients();
    this.manageEncounterTime();
  }
  manageEncounterTime(){
      if(this.filterPatientDto.bhiStatus == 4){
        console.log(this.BhiEncounterTimeEnumList)
        const tempEncounters =  this.BhiEncounterTimeEnumList.filter(encounter => encounter.value <= 4 );
        this.BhiEncounterTimeEnumList = [];
        this.BhiEncounterTimeEnumList = tempEncounters
      }else{
        this.BhiEncounterTimeEnumList = this.tempBhiEncounterTimeEnumList;
      }

  }
  checkIfQueryParams() {
    this.queryParamsApplied = true;
    const filterState = this.route.snapshot.queryParams["filterState"];
    if (filterState) {
      this.filterPatientDto = JSON.parse(filterState);
    }
  }
  EncounterStatusChanged(status: BhiStatusEnum) {
    this.filterPatientDto.bhiStatus = status;
    this.filterPatientDto.BhiEncounterTime = [0];
    this.filterPatients();
  }
  EncounterTimeChanged(filters: BhiEncounterTimeEnum[]) {
    this.filterPatientDto.BhiEncounterTime = filters;
    this.filterPatients();
  }
  GetBhiDahboardData() {
    const newObj = new BhiPatientsScreenParams();
    newObj.facilityId = this.facilityId;
    newObj.bhiStatus = this.filterPatientDto.bhiStatus;
    newObj.facilityUserId = 0;
    newObj.bhiCareManagerId = this.filterPatientDto.bhiCareManagerId || 0;
    newObj.serviceMonth = this.filterPatientDto.serviceMonth;
    newObj.serviceYear = this.filterPatientDto.serviceYear;

    // const newObj = this.cloner.deepClone<BhiPatientsScreenParams>(this.filterPatientDto);
    this.bhiService.GetbhiDashboard(newObj).subscribe(
      (res: BhiDashboardDto) => {
        this.bhDashboardData = res;
        let newStatus = BhiStatusEnum["Active PCM"];
        if (this.bhDashboardData.type === "ActiveCocm") {
          newStatus = BhiStatusEnum["Active CoCM"];
        }
        if (this.bhDashboardData.type === "ActivePcm") {
          newStatus = BhiStatusEnum["Active PCM"];
        }
        if (this.bhDashboardData.type === "ActiveGBhi") {
          newStatus = BhiStatusEnum["Active G-BHI"];
        }
        if (newStatus !== this.filterPatientDto.bhiStatus && !this.firstCHeck) {
          this.filterPatientDto.bhiStatus = newStatus;
          this.filterPatients();
        }
        this.firstCHeck = true;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
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
          'DataTables_BHI' + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem('DataTables_BHI' + window.location.pathname)
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
        { targets: 3, orderable: true },
        { targets: 4, orderable: true },
        { targets: 5, orderable: true },
        { targets: 6, orderable: true },
        { targets: 7, orderable: false },
        // { targets: 8, orderable: false },
        { targets: 11, orderable: true },
        // { targets: 2, orderDataType: 'num-fmt', orderable: false },
        // { targets: 12, orderable: false },
      ],
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
        if (
          this.securityService.securityObject.userType === UserType.FacilityUser
        ) {
          this.filterPatientDto.facilityUserId =
            this.securityService.securityObject.id;
        } else {
          this.filterPatientDto.facilityUserId = 0;
        }
        this.filterPatientDto.facilityId = this.facilityId;
        this.loadingOnStart = false;
        this.isLoading = true;
        if (!this.queryParamsApplied) {
          this.checkIfQueryParams();
        }
        this.datafilterService.filterData['bhiList'] = this.filterPatientDto;
        this.subs.sink = this.bhiService
          .getBhiFilterPatientsList2(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              // res.preventiveGapScreenDtos.forEach((element) => {
              //   // if (element.dob) {
              //   //   element.dob = moment.utc( element.dob).local().format('YYYY-MM-DD');
              //   // }
              // });
              this.isLoading = false;
              this.selected = [];
              this.rows = [];

              res.bhiPatientsList.forEach(patient => {

                if (
                  patient.bhiMsQualityCheckedDate && patient.bhiMsQualityCheckedByName ) {
                  patient.bhiMsQualityCheckedDate = moment.utc(patient.bhiMsQualityCheckedDate).local();
                  // const dateTime = moment(patient.msQualityCheckedDate).format(
                  //   "MMMM Do YYYY, h:mm:ss a"
                  // );
                  }
                  if(patient.lastStatusChangeDate){
                    patient.lastStatusChangeDate = moment(patient.lastStatusChangeDate).format(
                      "MMMM Do YYYY"
                    );
                  }
                  if(patient.lastStatusChangeDate && patient.statusChangedBy){
                    patient['LastStatusChangedByNameAndDate'] = `${patient.lastStatusChangeDate}\n ${patient.statusChangedBy}`
                  }else{
                    patient['LastStatusChangedByNameAndDate'] = "";
                  }
              });


              // this.rowIndex = this.filterPatientDto.rowIndex;
              this.rows = res.bhiPatientsList;
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
        { name: "id" },
        { name: "name" },
        { name: "checkBox" },
        { name: "bhiTime" },
        { name: "bhiStatus" },
        { name: "bhiMonthlyStatus" },
        { name: "assignedDate" },
        { name: "bhiCareCoordinators" },
        { name: "bhiCareManagerName" },
        { name: "psychiatristName" },
        { name: "billingProvider" },
        // { name: "bhiStatus" },
        { name: "lastBhi" },
        // { name: "currentMonthCompletedTimeString" },
        { name: "lastDone" },
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
      // console.log("dtInt", mydtInstance);
    });
    this.table.page(this.pagingData.pageNumber).draw(false);
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
  GetAllCareGaps() {
    this.subs.sink = this.insuranceService.GetAllCareGaps().subscribe(
      (res: CareGapDto[]) => {
        this.CareGapsList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  viewPatient(row: BhiPatientsListDto) {
    this.editViewData = row;
    this.editBhiDto.patientId = row.id;
    this.editBhiDto.bhiPsychiatristId = row.psychiatristId;
    this.editBhiDto.bhiCareManagerId = row.bhiCareManagerId;
    this.editBhiDto.gbhiPsychiatrist = row.psychiatristName;
    this.editBhiDto.billingProviderId = row.billingProviderId;
    this.editBhiDto.bhiStatus = row.bhiStatus;
    if (row.bhiCareCoordinators && row.bhiCareCoordinators.length) {
      this.editBhiDto.bhiCareCoordinatorIds = row.bhiCareCoordinators.map(
        (x) => x.bhiCareCoordinatorId
      );
    }
  }
  getBhiFacilityUsers() {
    let roleName = "BHI Care Manager";
    this.isLoadingPayersList = true;
    this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.bhiFacilityUsersList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingPayersList = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getBhiStatusList() {
    const keys = Object.keys(BhiStatusEnum).filter(
      (k) => typeof BhiStatusEnum[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: BhiStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    this.bhiStatusList = values;
    return values;
  }
  assignBhiData() {
    this.bhiDataSpinner = true;
    if (this.editBhiDto.bhiStatus == 4) {
      this.editBhiDto.bhiPsychiatristId = null;
    } else {
      this.editBhiDto.gbhiPsychiatrist = "";
    }
    this.bhiService.AssignBhiData(this.editBhiDto).subscribe(
      (res: []) => {
        this.toaster.success("Added Successfully");
        this.bhiDataSpinner = false;
        this.editBhi.hide();
        // this.filterPatients();
        this.mainFilterChanged();
        this.editBhiDto = new EditBhiData();
      },
      (error: HttpResError) => {
        this.bhiDataSpinner = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getPsyFacilityUsers() {
    let roleName = "Psychiatrist";
    this.isLoadingPayersList = true;
    this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.psyfacilityUserList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getCronicDiseases() {
    this.bhiService.GetBhiChronicDiseaseCodes().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      (err) => {}
    );
  }
  async onClickRow(row, event: MouseEvent) {
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

    this.rowId = row.id;
    // this.router.navigateByUrl("/admin/patient/" + row.id);
    this.datafilterService.routeState = this.router.url;
    this.ApplyNavigation('/admin/patient/' + row.id, event.ctrlKey);
    // if (row.profileStatus) {
    //   this.router.navigate(["/admin/patient/", row.id]);
    // } else {
    //   this.clickOnRow.show();
    //   // this.router.navigate(['/admin/addPatient/'+ row.id);
    //   // this.router.navigate(['/admin/addPatient/', row.id]);
    // }
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
  filterPatients() {
    this.datafilterService.filterData['bhiList'] = this.filterPatientDto;
    this.isLoading = true;
    this.assignUserValues();
    this.rerender();
  }
  assignUserValues() {
    this.isLoading = true;
    const fPDto = new BhiPatientsScreenParams();
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
  resetFilter() {
    const customId = this.filterPatientDto.customListId;
    this.filterPatientDto = new BhiPatientsScreenParams();
    this.filterPatientDto.customListId = customId;
    this.filterPatientDto.pageNumber = 1;
  }
  ProceedNavigation(row: BhiPatientsListDto) {
    let bhiCareCoordinatorsIds = [];
    this.router.navigateByUrl(
      `/bhi/bhiEncounters/${row.id}?psychiatristId=${row.psychiatristId}&bhiCareManagerId=${row.bhiCareManagerId}&bhiStatus=${row.bhiStatus}`
    );
  }
  scrollToTable() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: ".ccm-datatable",
    });
  }
  clearPsychiatrist() {
    if (this.editBhiDto.bhiStatus == 6) {
      this.editBhiDto.bhiPsychiatristId = 0;
    }
  }
  openPatientNote(row) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenPatientNote;
    event.value = row.id;
    this.eventBus.emit(event);
  }
  assignDate(row) {
    if (!row.dateAssigned) {
      const time = "12:00 AM";
      const date = moment().format("YYYY-MM-DD");
      this.assignedDateProp = moment(date + " " + time).format(
        "YYYY-MM-DD"
      );
    } else {
      this.assignedDateProp = moment(row.dateAssigned).format(
        "YYYY-MM-DD"
      );
    }
  }
  changeStatus(row: any) {
    console.log(this.assignedDateProp);

    this.selectedPatient = row;
    console.log(this.selectedPatient);
    // this.profileStatus = row.profileStatus;
    // this.ccmEncounterListDto.patientId = row.id;
    // this.ccmStatusChangeDto.patientId = row.id;
    // this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus = row.ccmMonthlyStatus;
    // this.ccmMonthlyStatusChangeDto.PatientId = row.id;
    // this.rpmStatusChangeDto.patientId = row.id;
  }
  saveAssignedDate(modal: any) {
    this.assignedDateProp = moment(
      this.assignedDateProp,
      "YYYY-MM-DD hh:mm A"
    ).format("YYYY-MM-DD");
    this.assigningDate = true;
    this.assignDatePatientsList.push(this.selectedPatient.id);
    this.subs.sink = this.bhiService
      .SetBhiPatientsDateAssigned(
        this.assignedDateProp,
        this.assignDatePatientsList
      )
      .subscribe(
        (res) => {
          modal.hide();
          this.assigningDate = false;
          this.selectedPatient.dateAssigned = this.assignedDateProp;
          this.toaster.success("Date Saved Successfully");
        },
        (err) => {
          this.assigningDate = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  saveAssignedDateToMultiplePatients(modal: any) {
    // this.assignedDateProp  = moment(this.assignedDateProp, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss');
    this.assigningDate = true;
    this.selected.forEach((patient) => {
      this.assignDatePatientsList.push(patient.id);
    });
    this.changeRowsDate();
    // this.assignDatePatientsList.push(this.selectedPatient.id);
    this.subs.sink = this.bhiService
      .SetBhiPatientsDateAssigned(
        this.dateAssigned,
        this.assignDatePatientsList
      )
      .subscribe(
        (res) => {
          this.assigningDate = false;
          this.selectedPatient.dateAssigned = this.assignedDateProp;
          this.selected.forEach((patient) => {
            const date = moment(this.dateAssigned).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            patient.dateAssigned == date;
          });
          this.toaster.success("Date Saved Successfully");
          modal.hide();
          this.assignDatePatientsList = [];
        },
        (err) => {
          this.assigningDate = false;
          this.toaster.error(err.message, err.error || err.error);
          this.assignDatePatientsList = [];
        }
      );
  }
  changeRowsDate() {
    let tempPatients = [];
    this.selected.forEach((pat) => {
      const patient = this.rows.find((patient) => patient.id == pat.id);
      if (patient) {
        const date = moment(this.dateAssigned).format("YYYY-MM-DD HH:mm:ss");
        patient.dateAssigned = date;
      }
    });
  }
  OpenEncountersModal(row: BhiPatientsListDto) {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `customUrl/logsHistory/${row.id}?isIframe=true&viewType=BHI&psychiatristId=${row.psychiatristId}&bhiCareManagerId=${row.bhiCareManagerId}&bhiStatus=${row.bhiStatus}`;
    this.eventBus.emit(emitObj);
  }
  changeBhiStatus(patientId, modal: ModalDirective) {
    this.bhiStatusDto.patientId = patientId;
    this.patientService.UpdateBhiStatus(this.bhiStatusDto).subscribe(
      (res: any) => {
        this.toaster.success("BHI Status Updated");
        modal.hide();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  changeBhiMonthlyStatus(patientId, modal: ModalDirective) {
    this.bhiMonthlyStatusDto.appUserId = this.securityService.securityObject.appUserId;
    this.bhiMonthlyStatusDto.patientId = patientId;
    this.bhiService.UpdateBhiMonthlyStatus(this.bhiMonthlyStatusDto).subscribe(
      (res: any) => {
        this.toaster.success("BHI Monthly Status Updated");
        modal.hide();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
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
  getCronicConditions() {
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicConditionsList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
    }
  getDependentDiseases() {
    const id = "";
    this.isLoadingICDCode = true;
    this.LoadingData = true;
    this.AllCronicDiseaseList = new Array<ChronicIcd10CodeDto>();
    this.patientService.GetChronicDiseaseCodes(id).subscribe(
      (res: any) => {
        let startsWithF;
        startsWithF = res.filter(s => s.icdCode.toLowerCase().indexOf("f") == 0)
        this.AllCronicDiseaseList = startsWithF;
        this.LoadingData = false;
        this.isLoadingICDCode = false;
      },
      (err) => {
        this.LoadingData = false;
        this.isLoadingICDCode = false;
      }
    );
  }
  applyICDFilterLogic() {
    if (
      this.filterPatientDto.chronicDiseasesIds &&
      this.filterPatientDto.chronicDiseasesIds.length > 1
    ) {
      const hasAll = this.filterPatientDto.chronicDiseasesIds.includes("");
      if (hasAll) {
        this.filterPatientDto.chronicDiseasesIds =
          this.filterPatientDto.chronicDiseasesIds.filter((x) => x !== "");
      }
    }
    if (
      !this.filterPatientDto.chronicDiseasesIds ||
      !this.filterPatientDto.chronicDiseasesIds.length
    ) {
      this.filterPatientDto.chronicDiseasesIds = [""];
    }
    if (
      this.filterPatientDto.chronicDiseasesIds &&
      this.filterPatientDto.chronicDiseasesIds.length
    ) {
      const hasAll = this.filterPatientDto.chronicDiseasesIds.includes("");
      if (!hasAll) {
        this.disableChronicFilter = true;
      } else {
        this.disableChronicFilter = false;
      }
    }
  }
  bhiMonthltStatusFilterChanged() {
    let bhiMonthlyStatusList = this.filterPatientDto.bhiMonthlyStatus as any;
    if (
      !this.filterPatientDto["bhiMonthlyStatus"] ||
      !bhiMonthlyStatusList.length
    ) {
      this.filterPatientDto["bhiMonthlyStatus"] = [''] as any;
      bhiMonthlyStatusList = this.filterPatientDto.bhiMonthlyStatus as any;
    }
    if (
      bhiMonthlyStatusList &&
      bhiMonthlyStatusList.length === 1 &&
      bhiMonthlyStatusList.includes('')
    ) {
    } else {
      bhiMonthlyStatusList = bhiMonthlyStatusList.filter((x) => x !== '');
      this.filterPatientDto.bhiMonthlyStatus = bhiMonthlyStatusList;
    }
  }
  filterMonthlyStatusOptions(currentValue){
    if(currentValue === ''){
      this.filterPatientDto.bhiMonthlyStatus = [''];
    }
    if (!this.filterPatientDto.bhiMonthlyStatus || !this.filterPatientDto.bhiMonthlyStatus.length) {
      this.filterPatientDto.bhiMonthlyStatus = [''];
    }
    if (this.filterPatientDto.bhiMonthlyStatus.length > 1) {
      this.filterPatientDto.bhiMonthlyStatus = this.filterPatientDto.bhiMonthlyStatus.filter(x => x !== '');
    }
  }
  filterEcounterTime(currentValue){
    if(currentValue === 0){
      this.filterPatientDto.BhiEncounterTime = [0];
    }
    if (!this.filterPatientDto.BhiEncounterTime || !this.filterPatientDto.BhiEncounterTime.length) {
      this.filterPatientDto.BhiEncounterTime = [0];
    }
    if (this.filterPatientDto.BhiEncounterTime.length > 1) {
      this.filterPatientDto.BhiEncounterTime = this.filterPatientDto.BhiEncounterTime.filter(x => x !== 0);
    }
  }
  filterIcdCodes(currentValue){
    if(currentValue === 0){
      this.filterPatientDto.chronicDiseasesIds = [''];
    }
    if (!this.filterPatientDto.chronicDiseasesIds || !this.filterPatientDto.chronicDiseasesIds.length) {
      this.filterPatientDto.chronicDiseasesIds = [''];
    }
    if (this.filterPatientDto.chronicDiseasesIds.length > 1) {
      this.filterPatientDto.chronicDiseasesIds = this.filterPatientDto.chronicDiseasesIds.filter(x => x !== '');
    }
  }
  getBillingProvidersList() {
    let roleName = 'Billing Provider';
    //  this.isLoadingPayersList = true;
    this.analyticService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.bIllingProviderList = res;
        //  this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        //  this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetQualityCheckData(patientId: number, modal: ModalDirective){
    console.log(this.selectedPatient)
    modal.show();
  }
  SetMsBhiQualityChecked(){
    this.SetQualityCheckForMR = true;
    this.subs.sink = this.bhiService.SetBhiMsQualityChecked(this.selectedPatient.id)
      .subscribe(
        (res: any) => {
          this.selectedPatient.bhiMsQualityChecked = true;
          this.rows.forEach((iPatient) => {
            if (iPatient.id === this.selectedPatient.id) {
              iPatient.bhiMsQualityChecked = true;
            }
          });
          this.SetQualityCheckForMR = false;
          this.selectedPatient.bhiMsQualityCheckedByNameAbbreviation =
            this.nameCaption;
          this.selectedPatient.bhiMsQualityCheckedByName =
            this.currentUser.fullName;
          this.selectedPatient.bhiMsQualityCheckedDate = moment().format();
          const dateTime = moment(this.selectedPatient.bhiMsQualityCheckedDate).format("MMMM Do YYYY, h:mm:ss a");
          const msQualityCheckedByNameAndDate = `${this.selectedPatient.bhiMsQualityCheckedByName}\n ${dateTime}`;
          this.selectedPatient["msQualityCheckedByNameAndDate"] =
            msQualityCheckedByNameAndDate;
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
  GetBhiMsQualityChecked(){
    this.loadingBhiEncounters = true;
    this.bhiService.GetBhiMsQualityChecked(this.selectedPatient.id).subscribe((res: any) => {
      this.bhiEncountersList = res;
    this.loadingBhiEncounters = false;

      console.log(res)
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
      this.loadingBhiEncounters = false;

    })
  }
  selectDate(value: any, datepicker?: any) {
    this.filterPatientDto.DateAssignedFrom = value.start.format('YYYY-MM-DD');
    this.filterPatientDto.DateAssignedTo = value.end.format('YYYY-MM-DD');
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterPatientDto.DateAssignedTo = '';
    this.filterPatientDto.DateAssignedFrom = '';
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
}
