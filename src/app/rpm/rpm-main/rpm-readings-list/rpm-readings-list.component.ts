import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { RpmService } from 'src/app/core/rpm.service';
import { ActivatedRoute } from '@angular/router';
import { RpmReadingDto, RmpReadingsSearchParam, ModalityDto, PatientHealthCareDeviceForListDto } from 'src/app/model/rpm.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Subject } from 'rxjs';
import { Location } from "@angular/common";
import { SubSink } from 'src/app/SubSink';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { DataTableDirective } from 'angular-datatables';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { DaterangepickerComponent } from 'ng2-daterangepicker';

@Component({
  selector: 'app-rpm-readings-list',
  templateUrl: './rpm-readings-list.component.html',
  styleUrls: ['./rpm-readings-list.component.scss']
})
export class RpmReadingsListComponent implements OnInit, AfterViewInit, OnDestroy {
  patientId = 0;
  isLoading: boolean;
  // rpmReadingsList = new Array<RpmReadingDto>();
  @ViewChild('datePicker1') datePicker1: DaterangepickerComponent;
  rows = new Array<RpmReadingDto>();
  devicesList = new Array<ModalityDto>();

  rowIndex = 0;
  filterPatientDto = new RmpReadingsSearchParam();
  table = $("#example").DataTable();
  // dtTrigger = new Subject<any>();
  // dtOptions: DataTables.Settings | any = {};

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};
  private subs = new SubSink();
  pagingData = new PagingData();
  loadingOnStart: boolean;
  readingDate = '';
  daterange: any = {};
  selectedDateRange: any;
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // startDate: '09-01-2017',
    // endDate: '09-02-2017',
    // displayFormat: 'DD-MM-YYYY'
    },
  };

  startDate = '09-01-2017';
  endDate = '09-02-2017';
  // isLoading: boolean;
  constructor(private rpmService: RpmService, private route: ActivatedRoute,
    private toaster: ToastService,private pageScrollService: PageScrollService,
    private location: Location,
    @Inject(DOCUMENT) private document: any ) { }

  ngOnInit(): void {

   this.patientId = +this.route.pathFromRoot[4].snapshot.paramMap.get('id');
   if (!this.patientId) {
     this.patientId = 0;
   }
    // this.getRmpReadings();
    this.dtSelect = {
      select: true,
    };
    // this.getBhiStatusList();
    this.initializeDataTable();
    this.getModalities();
  }
  navigateBack() {
    this.location.back();
  }
  // getRmpReadings() {
  //   this.isLoading = true;
  //   this.rpmService
  //     .GetRmpReadings(this.patientId)
  //     .subscribe(
  //       (res: any) => {
  //         this.isLoading = false;
  //         this.rpmReadingsList = res;
  //       },
  //       (error: HttpResError) => {
  //               this.isLoading = false;
  //               this.toaster.error(error.error, error.message);
  //       }
  //     );
  // }
  // onActivate(event: any) {
  //   if (event.type === "click") {
  //     // id: number = +event.row.id;
  //   }
  // }

  ngAfterViewInit() {
    this.dtTrigger.next();
     this.datePicker1.datePicker.setStartDate(this.startDate);
    this.datePicker1.datePicker.setEndDate(this.endDate);
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.subs.unsubscribe();
  }

  getModalities() {
      this.isLoading = true;
      this.rpmService.getModalities().subscribe(
        (res: any) => {
          this.isLoading = false;
          this.devicesList = res;
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  selectedDate(value: any, datepicker?: any) {
    // this.selectedDateRange.start = value.start;
    // this.selectedDateRange.end = value.end;
      datepicker.start = value.start;
      datepicker.end = value.end;
      this.filterPatientDto.fromReadingDate = value.start.format('YYYY-MM-DD');
      this.filterPatientDto.toReadingDate = value.end.format('YYYY-MM-DD');
      this.daterange.label = value.label;
    }
    clearDate() {
      this.daterange = {};
      this.selectedDateRange = [];
      this.filterPatientDto.fromReadingDate = '';
      this.filterPatientDto.toReadingDate = '';
      this.filterPatients();
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
          "DataTables_Readin" + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem("DataTables_Readin" + window.location.pathname)
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
        { targets: 3, orderable: false },
        { targets: 4, orderable: true },
        { targets: 5, orderable: false },
        // { targets: 5, orderable: true },
        // { targets: 6, orderable: false },
        // { targets: 7, orderable: false },
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

        // this.filterPatientDto.facilityId = this.facilityId;
        this.filterPatientDto.patientId = this.patientId;
        this.loadingOnStart = false;
        this.isLoading = true;
        this.subs.sink = this.rpmService
          .GetPatientsRmpReadingsList(this.filterPatientDto)
          .subscribe(
            (res: any) => {
             this.isLoading = false;
              // this.selected = [];
              this.rows = [];
              this.rows = res.rpmReadings;
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
        { name: "modalityName" },
        { name: "reading" },
        { name: "measurementDate" },
        { name: "threshold" },

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
    const fPDto = new RmpReadingsSearchParam();
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
    this.filterPatientDto = new RmpReadingsSearchParam();
    this.filterPatientDto.pageNumber = 1;
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
