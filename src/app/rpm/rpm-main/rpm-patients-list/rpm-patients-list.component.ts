import { DOCUMENT } from "@angular/common";
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
import { PagingData } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { DataTableDirective } from "angular-datatables";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { Subject, fromEvent } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { GapStatus } from "src/app/model/pcm/pcm.model";
import { PcmService } from "src/app/core/pcm/pcm.service";
import { debounceTime, map } from "rxjs/operators";
import { SecurityService } from "src/app/core/security/security.service";
import { CareGapDto } from "src/app/model/pcm/payers.model";
import { InsuranceService } from "src/app/core/insurance.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import {
  EditBhiData,
} from "src/app/model/Bhi/bhi.model";
import { BhiStatusEnum } from "src/app/Enums/bhi.enum";
import { PageScrollService } from "ngx-page-scroll-core";
import { RpmPatientsScreenParams, RpmPatientsListDto } from "src/app/model/rpm.model";
import { RpmService } from "src/app/core/rpm.service";
import { RpmStatus } from "src/app/Enums/filterPatient.enum";
import { FacilityService } from "src/app/core/facility/facility.service";
import { CreateFacilityUserDto } from "src/app/model/Facility/facility.model";
import { Location } from "@angular/common";
import { AddEditCustomListDto, AssignPatientsToCustomListDto } from "src/app/model/custome-list.model";
import { CustomeListService } from "src/app/core/custome-list.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { EventBusService, EventTypes } from "src/app/core/event-bus.service";
@Component({
  selector: 'app-rpm-patients-list',
  templateUrl: './rpm-patients-list.component.html',
  styleUrls: ['./rpm-patients-list.component.scss']
})
export class RpmPatientsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('clickOnRow') clickOnRow: ModalDirective;
    public datePickerConfig2: IDatePickerConfig = {
      allowMultiSelect: false,
      returnedValueType: ECalendarValue.StringArr,
      format: "MM-DD-YYYY",
      appendTo: "body",
    };
    public options: any = {
      locale: { format: 'MM-DD-YYYY',
      cancelLabel: 'Clear',
      // displayFormat: 'DD-MM-YYYY'
    },
      alwaysShowCalendars: false,
    };
    filterPatientDto = new RpmPatientsScreenParams();
    private subs = new SubSink();
    rowIndex = 0;
    dtTrigger = new Subject<any>();

    dtOptions: DataTables.Settings | any = {};
    dtSelect: DataTables.RowMethods | any = {};
    dtSeacrh: DataTables.SearchSettings = {};

    loadingOnStart: boolean;
    isLoading: boolean;
    selected: any[];
    rows: RpmPatientsListDto[];
    pagingData = new PagingData();
    table = $("#example").DataTable();
    bhiStatusEnum = BhiStatusEnum;
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
    CareGapsList: CareGapDto[];
    editViewData: any;
    editBhiDto = new EditBhiData();
    bhiDataSpinner: boolean;
    rpmStatusEnum = RpmStatus;
    CareProvidersList = new Array<CreateFacilityUserDto>();
    daterange: any = {};
  selectedDateRange: any;
  selectedDateRange1: any;

  CustomListDto = new Array<AddEditCustomListDto>();
  facilityUserId = 0;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  queryParamsApplied: boolean;
  routeDataFilter: string;

    constructor(
      private pcmService: PcmService,
      private datafilterService: DataFilterService,
      private patientService: PatientsService,
      private facilityService: FacilityService,
      private insuranceService: InsuranceService,
      private securityService: SecurityService,
      private rpmService: RpmService,
      private location: Location,
      private customListService: CustomeListService,
      // private bhiService: BhiService,
      private toaster: ToastService,
      private router: Router,
      private route: ActivatedRoute,
      private eventBus: EventBusService,
      private pageScrollService: PageScrollService,
      private filterDataService: DataFilterService,

      @Inject(DOCUMENT) private document: any
    ) {}

    GetCustomListsByFacilityUserId() {
      // this.isLoadingPayersList = true;
      this.customListService.GetCustomListsByFacilityUserId(this.facilityUserId).subscribe(
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
      this.customListService.AddPatientsToList(this.addPatientInCustmListDto).subscribe(
        (res) => {
          this.toaster.success('Data Saved Successfully');
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }

    ngOnInit() {
      if (this.securityService.securityObject.userType === UserType.FacilityUser) {
        // this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
        this.facilityUserId = this.securityService.securityObject.id;
        // this.filterPatientDto.CareProviderId = this.securityService.securityObject.id;
      } else {
        // this.filterPatientDto.facilityUserId = 0;
      }
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
      this.dtSelect = {
        select: true,
      };
      this.eventBus.on(EventTypes.RefreshCustomList).subscribe((res) => {
        this.GetCustomListsByFacilityUserId();
         });

      // this.getBhiStatusList();
      this.initializeDataTable();
      this.getCareProviders();
      this.GetCustomListsByFacilityUserId();
      // this.getBhiFacilityUsers();
      // this.getPsyFacilityUsers();
      // this.getCronicDiseases();
      // this.GetAllCareGaps();
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
    navigateBack() {
      this.location.back();
    }

    ngOnDestroy() {
      this.dtTrigger.unsubscribe();
      this.subs.unsubscribe();
    }
    goLogs (row: any) {
      this.router.navigate([`/admin/logsHistory/${row.id}`], { queryParams: { rpm: 2 } });
    }
    selectedDate(value: any, datepicker?: any) {
      datepicker.start = value.start;
      datepicker.end = value.end;
      this.filterPatientDto.lastReadingStartDate = value.start.format('YYYY-MM-DD');
      this.filterPatientDto.lastReadingEndDate = value.end.format('YYYY-MM-DD');
      this.daterange.label = value.label;
      // this.filterPatients();
    }
    clearDate() {
      this.daterange = {};
      this.selectedDateRange = [];
      this.filterPatientDto.lastReadingStartDate = '';
      this.filterPatientDto.lastReadingEndDate = '';
      // this.filterPatients();
    }
    selectedDate1(value: any, datepicker?: any) {
      datepicker.start = value.start;
      datepicker.end = value.end;
      this.filterPatientDto.lastLogStartDate = value.start.format('YYYY-MM-DD');
      this.filterPatientDto.lastLogEndDate = value.end.format('YYYY-MM-DD');
      this.daterange.label = value.label;
      // this.filterPatients();
    }
    clearDate2() {
      this.daterange = {};
      this.selectedDateRange1 = [];
      this.filterPatientDto.lastLogStartDate = '';
      this.filterPatientDto.lastLogEndDate = '';
      // this.filterPatients();
    }
    checkIfQueryParams() {
      this.queryParamsApplied = true;
      const filterState = this.route.snapshot.queryParams['filterState'];
      if (filterState) {
        this.filterPatientDto = JSON.parse(filterState);
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
            "DataTables_464" + window.location.pathname,
            JSON.stringify(oData)
          );
        },
        stateLoadCallback: function (oSettings) {
          return JSON.parse(
            localStorage.getItem("DataTables_464" + window.location.pathname)
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
          { targets: 1, orderable: true },
          { targets: 2, orderable: false },
          { targets: 3, orderable: true },
          { targets: 4, orderable: false },
          { targets: 5, orderable: false },
          { targets: 6, orderable: true },
          { targets: 7, orderable: false },
          // { targets: 8, orderable: false },
          // { targets: 11, orderable: false },
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
          console.log("api", aa);
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
          // if (
          //   this.securityService.securityObject.userType === UserType.FacilityUser
          // ) {
          //   this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
          // } else {
          //   this.filterPatientDto.facilityUserId = 0;
          // }
          this.filterPatientDto.facilityId = this.facilityId;
          this.loadingOnStart = false;
          this.isLoading = true;
          if (!this.queryParamsApplied) {
            this.checkIfQueryParams();
          }
          this.subs.sink = this.rpmService
            .GetRpmPatients(this.filterPatientDto)
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
                // this.rowIndex = this.filterPatientDto.rowIndex;
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
          { name: 'checkBox' },
          { name: "rpmStatus" },
          { name: "lastReadingDate" },
          { name: "bhiStatus" },
          { name: "currentMonthCompletedTimeString" },
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
        console.log("dtInt", mydtInstance);
      });
      this.table.page(this.pagingData.pageNumber).draw(false);
    }

    async onClickRow(row, event: MouseEvent) {
      // this.patientsService.getPatientDetail(row)
      this.rowId = row.id;
      if (row.profileStatus) {
        // this.router.navigate(['/admin/patient/', row.id]);
        this.datafilterService.routeState = this.router.url;
        this.ApplyNavigation('/admin/patient/' + row.id, event.ctrlKey);
      } else {
        this.clickOnRow.show();
        // this.router.navigate(['/admin/addPatient/'+ row.id);
        // this.router.navigate(['/admin/addPatient/', row.id]);
      }
    }
    ApplyNavigation(url: string, isCtrl: boolean) {
      if (isCtrl) {
        const url1 = this.router.serializeUrl( this.router.createUrlTree([`${url}`]) );
        const newWindow = window.open('', '_blank');
        newWindow.location.href = url;
        newWindow.focus();
        // const openW = window.open(url1, '_blank');
      } else {
        this.router.navigateByUrl(url);
      }
    }
    addRequiredData() {
      // this.router.navigateByUrl('/admin/addPatient/'+ this.rowId, {state: {filters:this.filterPatientDto}});
      this.router.navigate(['/admin/addPatient/' + this.rowId], {
        state: this.filterPatientDto,
      });
    }

    rowCheckBoxChecked(e, row) {
      this.gridCheckAll = false;
      if (e.target.checked) {
        this.selected.push(row);
      } else {
        const index = this.selected.findIndex(
          (x) => x.patientId === row.patientId
        );
        this.selected.splice(index, 1);
      }
    }

    // viewPatient(row: any) {
    //   this.editViewData = row;
    //   this.editBhiDto.patientId = row.id;
    //   this.editBhiDto.bhiPsychiatristId = row.psychiatristId;
    //   this.editBhiDto.bhiCareManagerId = row.bhiCareManagerId;
    //   this.editBhiDto.bhiStatus = row.bhiStatus;
    // }
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
    // getBhiFacilityUsers() {
    //   let roleName = "BHI Care Manager";
    //   this.isLoadingPayersList = true;
    //   this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
    //     (res: []) => {
    //       this.bhiFacilityUsersList = res;
    //       this.isLoadingPayersList = false;
    //     },
    //     (error: HttpResError) => {
    //       this.isLoadingPayersList = false;
    //       this.toaster.error(error.error, error.message);
    //     }
    //   );
    // }
    // getBhiStatusList() {
    //   const keys = Object.keys(BhiStatusEnum).filter(
    //     (k) => typeof BhiStatusEnum[k as any] === "number"
    //   ); // ["A", "B"]
    //   const values = keys.map((key) => ({
    //     number: BhiStatusEnum[key as any],
    //     word: key,
    //   })); // [0, 1]
    //   this.bhiStatusList = values;
    //   return values;
    // }
    // assignBhiData() {
    //   this.bhiDataSpinner = true;
    //   this.bhiService.AssignBhiData(this.editBhiDto).subscribe(
    //     (res: []) => {
    //       this.toaster.success("Added Successfully");
    //       this.bhiDataSpinner = false;
    //       this.editBhi.hide();
    //       this.filterPatients();
    //       this.editBhiDto = new EditBhiData();
    //     },
    //     (error: HttpResError) => {
    //       this.bhiDataSpinner = false;
    //       this.toaster.error(error.error, error.message);
    //     }
    //   );
    // }
    // getPsyFacilityUsers() {
    //   let roleName = "Psychiatrist";
    //   this.isLoadingPayersList = true;
    //   this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
    //     (res: []) => {
    //       this.psyfacilityUserList = res;
    //       this.isLoadingPayersList = false;
    //     },
    //     (error: HttpResError) => {
    //       this.isLoadingPayersList = false;
    //       this.toaster.error(error.error, error.message);
    //     }
    //   );
    // }
    // getCronicDiseases() {
    //   this.bhiService.GetBhiChronicDiseaseCodes().subscribe(
    //     (res: any) => {
    //       this.cronicDiseaseList = res;
    //     },
    //     (err) => {}
    //   );
    // }
    // onClickRow(row) {
    //   // this.patientsService.getPatientDetail(row)

    //   this.rowId = row.id;
    //   this.router.navigateByUrl("/admin/patient/" + row.id);
    //   // if (row.profileStatus) {
    //   //   this.router.navigate(["/admin/patient/", row.id]);
    //   // } else {
    //   //   this.clickOnRow.show();
    //   //   // this.router.navigate(['/admin/addPatient/'+ row.id);
    //   //   // this.router.navigate(['/admin/addPatient/', row.id]);
    //   // }
    // }
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
    rerender(): void {
      // this.forRerendertable = false;
      this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
        // Destroy the table first
        mydtInstance.columns.adjust().draw();
      });
    }
    filterPatients() {

      this.isLoading = true;
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
    resetFilter() {
      this.clearDate();
      this.clearDate2();
      this.filterPatientDto = new RpmPatientsScreenParams();
      this.filterPatientDto.pageNumber = 1;
      this.resetSorting()
    }
    resetSorting(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.order([]).draw();
      });
    }
    // ProceedNavigation(row: BhiPatientsListDto) {
    //   this.router.navigateByUrl(
    //     `/bhi/bhiEncounters/${row.id}?psychiatristId=${row.psychiatristId}&bhiCareManagerId=${row.bhiCareManagerId}&bhiStatus=${row.bhiStatus}`
    //   );
    // }
    scrollToTable() {
      this.pageScrollService.scroll({
        document: this.document,
        scrollTarget: ".ccm-datatable",
      });
    }

}
