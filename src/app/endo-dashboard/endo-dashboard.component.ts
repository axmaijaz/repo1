import { SelectedCronicDisease } from './../model/Patient/patient.model';
import { id } from '@swimlane/ngx-datatable';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { EditPRCMData, PRCMDashboardDataDto, PRCMDashboardParamsDto, PrcmDiagnosisDto, PRCMEncounterDto, PRCMPatientsListDto, PRCMPatientsScreenParams, PRCMStatusEnum } from '../model/Prcm/Prcm.model';
import { SubSink } from '../SubSink';
import { UserType } from '../Enums/UserType.enum';
import { DataFilterService } from '../core/data-filter.service';
import { PatientsService } from '../core/Patient/patients.service';
import { FacilityService } from '../core/facility/facility.service';
import { InsuranceService } from '../core/insurance.service';
import { SecurityService } from '../core/security/security.service';
import { PRCMService } from 'src/app/core/prcm.service';
import { IMyOptions, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PageScrollService } from "ngx-page-scroll-core";
import { AppDataService } from '../core/app-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBusService, EventTypes } from '../core/event-bus.service';
import { CustomeListService } from '../core/custome-list.service';
import { PagingData } from '../model/AppModels/app.model';
import { DataTableDirective } from 'angular-datatables';
import { HttpResError } from '../model/common/http-response-error';
import { DOCUMENT } from '@angular/common';
import { AddEditCustomListDto, AssignPatientsToCustomListDto } from '../model/custome-list.model';
import { CareGapDto, InsurancePlanDto } from '../model/pcm/payers.model';
import { debounceTime, map } from 'rxjs/operators';
import { AllChronicDiseaseDto, ChronicIcd10CodeDto, DiagnosisDto, SelectChronicDiseaseDto } from '../model/Patient/patient.model';
import { GapStatus } from '../model/pcm/pcm.model';
import moment from 'moment';
import { CustomListForPatientListsComponent } from '../custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component';

@Component({
  selector: 'app-endo-dashboard',
  templateUrl: './endo-dashboard.component.html',
  styleUrls: ['./endo-dashboard.component.scss']
})
export class EndoDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
    appendTo: "body",
  };
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM',
  };
  // public datePickerConfig: IDatePickerConfig = {
  //   allowMultiSelect: false,
  //   returnedValueType: ECalendarValue.StringArr,
  //   format: 'YYYY-MM-DD',
  //   appendTo: "body",
  //   drops:'down'
  // };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'hh:mm'
  };

  durationNO: number;

  filterPatientDto = new PRCMPatientsScreenParams();
  private subs = new SubSink();
  rowIndex = 0;
  dtTrigger = new Subject<any>();

  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};

  loadingOnStart: boolean;
  isLoading: boolean;
  selected: any[];
  rows: PRCMPatientsListDto[];
  selectedPatient: PRCMPatientsListDto;
  pagingData = new PagingData();
  table = $("#example").DataTable();
  PRCMStatusEnum = PRCMStatusEnum;
  PRCMStatusList = new Array<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  // cronicDiseaseList = new Array<{ id: 0; detail: "" }>();
  cronicDiseaseList = new Array<{ id: 0; algorithm: "" }>();
  gridCheckAll: boolean;
  rowId: any;
  listOfYears = [];
  @ViewChild("searchPatient") searchPatient: ElementRef;
  @ViewChild("editPRCM2") editPRCM2: ModalDirective;
  isLoadingPayersList: boolean;
  facilityId: number;
  psyfacilityUserList = [];
  facilityUsersList = [];
  gapStatusENumList = this.datafilterService.getEnumAsList(GapStatus);
  prcmStatusStatusENumList = this.datafilterService.getEnumAsList(PRCMStatusEnum);
  CareGapsList: CareGapDto[];
  editViewData: any;
  editPRCMDto = new EditPRCMData();
  PRCMDataSpinner: boolean;

  CustomListDto = new Array<AddEditCustomListDto>();
  facilityUserId = 0;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  patientChronicConditionsForEdit: PrcmDiagnosisDto[] = [];
  patientDiagnosesList = new Array<SelectChronicDiseaseDto>();
  gettingChronicConditions: boolean;
  tempChronicIcd10Code = new Array<string>();
  isEndo = false;
  isGeneral = false;
  patientSelectedIcd10Code = new Array<string>();

  yearNow = new Date();
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: this.yearNow.getFullYear() + 5,
    closeAfterSelect: true,
    dateFormat: 'yyyy-mm-dd',
  };
  assignedDateProp: string;
  assigningDate: boolean;

  addPRCMEncounterDto = new PRCMEncounterDto();
  prcmDashboardDataDto = new PRCMDashboardDataDto();
  prcmDashboardParamsDto = new PRCMDashboardParamsDto();
  selectedDate = moment().format("YYYY-MM");
  insurancePLanList: InsurancePlanDto[];
  LoadingData: boolean;
  chronicDependentDiseases = new Array<ChronicIcd10CodeDto>();
  ageFrom: number;
  ageTo: number;
  selectedPatientData: any;
  IsaddingEncounterLoading: boolean;
  disableChronicFilter: boolean;
  diagnose = new DiagnosisDto();
  selectedCronicDisease = {
    icdCode: "",
    detail: ""
  };



  constructor(
    private datafilterService: DataFilterService,
    private patientService: PatientsService,
    private facilityService: FacilityService,
    private insuranceService: InsuranceService,
    private securityService: SecurityService,
    private PRCMService: PRCMService,
    private toaster: ToastService,
    private appData: AppDataService,
    private router: Router,
    private eventBus: EventBusService,
    private customListService: CustomeListService,
    private pageScrollService: PageScrollService,
    private route: ActivatedRoute,
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
    const tempIsEndo = this.route.snapshot.queryParams['isEndo'];
    if(tempIsEndo){
      this.isEndo = JSON.parse(tempIsEndo);
      this.getFiltersData();
    }
    const tempIsGeneral = this.route.snapshot.queryParams['isGeneral'];
    if(tempIsGeneral){
      this.isGeneral = JSON.parse(tempIsGeneral);
    }
    this.filterPatientDto.filteredMonth = this.selectedDate;
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
      this.facilityUserId = this.securityService.securityObject.id;
      // this.filterPatientDto.CareProviderId = this.securityService.securityObject.id;
    } else {
      this.filterPatientDto.facilityUserId = 0;
    }
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    this.dtSelect = {
      select: true,
    };
    this.eventBus.on(EventTypes.RefreshCustomList).subscribe((res) => {
      this.GetCustomListsByFacilityUserId();
       });

    this.listOfYears = this.appData.listOfYears;
      //  private eventBus: EventBusService
      this.GetMonthlyPatientsPRCMData();
      this.getDependentDiseases('');
    this.getPRCMStatusList();
    this.initializeDataTable();
    this.getPRCMFacilityUsers();
    this.getCronicDiseases()
    this.GetCustomListsByFacilityUserId();
    this.GetInsurancePlansByFacilityId();
  }
  getFiltersData(){
    if(this.datafilterService.filterData['endoList']){
      this.filterPatientDto = this.datafilterService.filterData['endoList'];
    }
  }
  resetEncounterModal(prcmEncounterModal: ModalDirective, service: number) {
    this.addPRCMEncounterDto = new PRCMEncounterDto();
    this.addPRCMEncounterDto.encounterDate = moment().format("YYYY-MM-DD");
    const time = moment().format("hh:mm");
    this.addPRCMEncounterDto.startTime = time;
    this.addPRCMEncounterDto.prCMServiceTypeId = service;
    this.addPRCMEncounterDto.end_PrCMCareFacilitatorId = this.selectedPatientData.end_PrCMCareFacilitatorId;
    this.addPRCMEncounterDto.end_PrCMSpecialistBillerId = this.selectedPatientData.end_PrCMSpecialistBillerId;
    this.addPRCMEncounterDto.cptCode = "G2065";
    if(this.securityService.getClaim("IsEndoCareCoordinator") && this.securityService.getClaim("IsEndoCareCoordinator").claimValue) {
      this.addPRCMEncounterDto.prCMCareCoordinatorId = this.securityService.securityObject.id;
    }
    // this.addPRCMEncounterDto
    prcmEncounterModal.show();
  }
  addPRCMEncounter(prcmEncounterModal: ModalDirective) {
    this.IsaddingEncounterLoading = true;
    prcmEncounterModal.hide();
    this.addPRCMEncounterDto.patientId = this.selectedPatientData.id;
    this.PRCMService.AddPRCMEncounter(this.addPRCMEncounterDto).subscribe(
      (res: []) => {
       //  this.psyfacilityUserList = res;
       this.toaster.success('Encounter added successfully');
       this.GetMonthlyPatientsPRCMData();
       this.filterPatients();
        this.IsaddingEncounterLoading = false;
      },
      (error: HttpResError) => {
       this.IsaddingEncounterLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  durationChanged(minsToAdd: number) {
    const startTime = this.addPRCMEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece: any = startTime.split(':');
    const mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    // this.encounterTimeForm.get('endTime').setValue(newTime);
    this.addPRCMEncounterDto.endTime = newTime;
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
  applyChronicFilterLogic() {
    if (this.filterPatientDto.dashboardConditionsIds && this.filterPatientDto.dashboardConditionsIds.length > 1) {
      const hasAll = this.filterPatientDto.dashboardConditionsIds.includes('0');
      if (hasAll) {
        this.filterPatientDto.dashboardConditionsIds = this.filterPatientDto.dashboardConditionsIds.filter(x => x !== '0');
      }
    }
    if (!this.filterPatientDto.dashboardConditionsIds || !this.filterPatientDto.dashboardConditionsIds.length) {
      this.filterPatientDto.dashboardConditionsIds = ['0'];
    }
  }
  applyICDFilterLogic() {
    if (this.filterPatientDto.dashboardDiseaseIds && this.filterPatientDto.dashboardDiseaseIds.length > 1) {
      const hasAll = this.filterPatientDto.dashboardDiseaseIds.includes('0');
      if (hasAll) {
        this.filterPatientDto.dashboardDiseaseIds = this.filterPatientDto.dashboardDiseaseIds.filter(x => x !== '0');
      }
    }
    if (!this.filterPatientDto.dashboardDiseaseIds || !this.filterPatientDto.dashboardDiseaseIds.length) {
      this.filterPatientDto.dashboardDiseaseIds = ['0'];
    }
    if (this.filterPatientDto.dashboardDiseaseIds && this.filterPatientDto.dashboardDiseaseIds.length) {
      const hasAll = this.filterPatientDto.dashboardDiseaseIds.includes('0');
      if (!hasAll) {
        this.disableChronicFilter = true;
      } else {
        this.disableChronicFilter = false;
      }
    }
  }
  getDependentDiseases(id: any) {
    if(!id || (Array.isArray(id) && id.includes('0'))) {
      id = '';
    }
    this.LoadingData = true;
    this.chronicDependentDiseases = new Array<ChronicIcd10CodeDto>();
    this.patientService.GetChronicDiseaseCodes(id).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.chronicDependentDiseases = res;
        // if (this.selectedCronicDiseases.length > 0) {
        //   this.selectedCronicDiseases.forEach(element => {
        //     const data = this.chronicDependentDiseases.find(
        //       x => x.id === element.id && x.chronicConditionId === id
        //     );
        //     if (data) {
        //       this.tempChroniObj = [...this.tempChroniObj, data];
        //     }
        //   });
        // }
        // if (this.tempSearchChroniObj) {
        //   const data23 = this.chronicDependentDiseases.find(
        //     x => x.icdCode === this.tempSearchChroniObj.icdCode
        //   );
        //   if (data23) {
        //     this.tempChroniObj = [...this.tempChroniObj, data23];
        //   }
        // }
      },
      err => {
        this.LoadingData = false;
      }
    );
  }
  GetInsurancePlansByFacilityId() {
    this.isLoadingPayersList = true;
    this.insuranceService.GetInsurancePlansByFacilityId(this.facilityId).subscribe(
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
  SaveAssignedDate(modal: any) {
    this.assigningDate = true;
    this.subs.sink = this.PRCMService
      .EditPrCMDateAssigned(this.selectedPatient.id, this.assignedDateProp, this.facilityId)
      .subscribe(
        (res) => {
          modal.hide();
          this.assigningDate = false;
          this.selectedPatient.dateAssigned = this.assignedDateProp;
          this.toaster.success('Date Saved Successfully');
        },
        (err) => {
          this.assigningDate = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  changeStatus(row: any) {
    this.selectedPatient = row;
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
          "DataTables_Endo" + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem("DataTables_Endo" + window.location.pathname)
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
        { targets: 5, orderable: true },
        { targets: 6, orderable: true },
        { targets: 7, orderable: true },
        { targets: 8, orderable: false },
        { targets: 9, orderable: false },
        { targets: 10, orderable: false },
        { targets: 11, orderable: false },
        { targets: 12, orderable: false },
        { targets: 13, orderable: false },
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
        if (
          this.securityService.securityObject.userType === UserType.FacilityUser
        ) {
          this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
        } else {
          this.filterPatientDto.facilityUserId = 0;
        }
        this.assignUserValues();
        this.filterPatientDto.facilityId = this.facilityId;
        this.loadingOnStart = false;
        this.isLoading = true;
        this.datafilterService.filterData['endoList'] = this.filterPatientDto;
        this.subs.sink = this.PRCMService
          .getPRCMFilterPatientsList2(this.filterPatientDto)
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
              this.rows = res.prCMPatientsList;
              this.rows.forEach(x => {
                var date = new Date('2021-04-01');
                if (x.bmi.lastReadingDate) {
                  x.bmi.NoOfMonth = this.Noofmonths(x.bmi.lastReadingDate,date);
                }
                if (x.a1C.lastReadingDate) {
                  x.a1C.NoOfMonth = this.Noofmonths(x.a1C.lastReadingDate,date);
                }
                if (x.dn.lastReadingDate) {
                  x.dn.NoOfMonth = this.Noofmonths(x.dn.lastReadingDate,date);
                }
                if (x.ld.lastReadingDate) {
                  x.ld.NoOfMonth = this.Noofmonths(x.ld.lastReadingDate,date);
                }
                if (x.de.lastReadingDate) {
                  x.de.NoOfMonth = this.Noofmonths(x.de.lastReadingDate,date);
                }
                if (x.bmi.value) {
                  x.bmi.valueInNumber = Number(x.bmi.value);
                  // (Math.round(x.bmi.valueInNumber * 10) / 10).toFixed(1);
                  // x.bmi.valueInNumber = Number(x.bmi.valueInNumber);
                  x.bmi.valueInNumber = Math.round(x.bmi.valueInNumber);
                  // x.bmi.valueInNumber = Number(x.bmi.valueInNumber);
                }
                if (x.a1C.value) {
                  x.a1C.valueInNumber = Number(x.a1C.value);
                  x.a1C.valueInNumber = Number((Math.round(x.a1C.valueInNumber * 10) / 10).toFixed(1));
                  // x.a1C.valueInNumber = Number(x.a1C.valueInNumber);
                }
                if (x.dn.value) {
                  x.dn.valueInNumber = Number(x.dn.value);
                  // Math.round(x.dn.valueInNumber * 10) / 10;
                  // x.dn.valueInNumber = Number(x.dn.valueInNumber);
                  // Math.ceil(x.dn.valueInNumber);
                  x.dn.valueInNumber = Math.round(x.dn.valueInNumber);
                }
                if (x.ld.value) {
                  x.ld.valueInNumber = Number(x.ld.value);
                  x.ld.valueInNumber = Math.round(x.ld.valueInNumber);
                  // Math.round(x.ld.valueInNumber * 10) / 10;
                  // x.ld.valueInNumber = Number(x.ld.valueInNumber);
                  // Math.ceil(x.ld.valueInNumber);
                }
                // x.ld.NoOfMonth = this.Noofmonths(x.ld.value,date)

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
        { name: "id" },
        { name: "name" },
        { name: 'checkBox' },
        { name: "end_PrCMCareFacilitator" },
        { name: "careCoordinators" },
        { name: "end_PrCMSpecialistBiller" },
        { name: "assignedDate" },
        { name: "prcmStatus" },
        { name: "currentMonthCompletedTimeString" },
        { name: "bmi" },
        { name: "a1C" },
        { name: 'dn' },
        { name: 'ld' },
        { name: 'de' },
        // { name: "action" },
      ],
    };
  }
  Noofmonths(date1, date2) {
    var readingDate = new Date(Date.parse(date1));
    var Nomonths;
    Nomonths= (date2.getFullYear() - readingDate.getFullYear()) * 12;
    Nomonths-= readingDate.getMonth() + 1;
    Nomonths+= date2.getMonth() +1; // we should add + 1 to get correct month number
    return Nomonths <= 0 ? 0 : Nomonths;
}
  redDraw(): void {
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust();
      console.log("dtInt", mydtInstance);
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
  GetPrCMPatientsChronicDiseases(patientId: number) {
    this.gettingChronicConditions = true;
    this.patientChronicConditionsForEdit = [];
    this.tempChronicIcd10Code = [];
    this.subs.sink = this.PRCMService.GetPrCMPatientsChronicDiseases(patientId).subscribe(
      (res: PrcmDiagnosisDto[]) => {
        this.gettingChronicConditions = false;
        this.patientChronicConditionsForEdit = res;
        if (res.length > 0) {
          this.patientChronicConditionsForEdit.forEach(dis => {
            if (dis.isPrCMDiagnose) {
              // this.editPRCMDto.chronicIcd10Code.push(dis.icdCode);
              this.tempChronicIcd10Code.push(dis.icdCode);
            }
          });
        }
      },
      (error: HttpResError) => {
        this.gettingChronicConditions = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  removeICDCodes(code: string) {
    this.tempChronicIcd10Code = this.tempChronicIcd10Code.filter(function(item) {
      return item !== code
    });
    this.patientChronicConditionsForEdit.forEach(dis => {
      if (dis.icdCode == code) {
        dis.isPrCMDiagnose = false;
      }
    });
  }
  loadDiagnoses(PatientId: number) {
    if (PatientId) {
      this.isLoading = true;
      // this.patientsService.getPatientDetail(PatientId).subscribe(
        this.patientDiagnosesList = [];
      this.subs.sink = this.patientService.GetDiagnosesByPatientId(PatientId).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res && res.length >= 0) {
            this.patientDiagnosesList = res;
          }
          // if (!this.rows || !this.rows.length) {
          //   var tempData = {
          //     description: "NA",
          //     encounterTimestamp: "NA",
          //     icdCode: "NA",
          //     note: "NA"
          //   }
          //   this.rows.push(tempData);
          // }
        },
        error => {
          this.isLoading = false;
          // console.log(error);
        }
      );
    }
  }
  filterByMonth(date) {
    this.GetMonthlyPatientsPRCMData(date);
    this.filterPatients(date);
   }
  GetMonthlyPatientsPRCMData(date?) {
    this.prcmDashboardParamsDto.facilityId = this.facilityId;
    if (date) {
      this.selectedDate = moment(date.date).format("YYYY-MM");
    }
    this.prcmDashboardParamsDto.filteredMonth = this.selectedDate;
    // this.prcmDashboardParamsDto.careCoordinatorId = this.facilityId;
    // this.prcmDashboardParamsDto.careFacilitatorId = this.facilityId;

    this.subs.sink = this.PRCMService.GetMonthlyPatientsPRCMData(this.prcmDashboardParamsDto).subscribe(
      (res: PRCMDashboardDataDto) => {
        this.prcmDashboardDataDto = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // GetAllCareGaps() {
  //   this.subs.sink = this.insuranceService.GetAllCareGaps().subscribe(
  //     (res: CareGapDto[]) => {
  //       this.CareGapsList = res;
  //     },
  //     (error: HttpResError) => {
  //       this.toaster.error(error.error, error.message);
  //     }
  //   );
  // }
  viewPatient(row: PRCMPatientsListDto) {
    this.editPRCMDto = new EditPRCMData();
    this.patientSelectedIcd10Code = new Array<string>();
    this.editViewData = row;
    this.editPRCMDto.patientId = row.id;
    this.editPRCMDto.prCMSpecialistBillerId = row.end_PrCMSpecialistBillerId;
    this.editPRCMDto.prCMCareFacilitatorId = row.end_PrCMCareFacilitatorId;
    this.editPRCMDto.prCMCareCoordinatorId = [];
    if (row.careCoordinators && row.careCoordinators.length) {
      this.editPRCMDto.prCMCareCoordinatorId = row.careCoordinators.map(x => x.careCoordinatorId);
    }
    this.editPRCMDto.prCMStatus = row.prCMStatus;
    this.GetPrCMPatientsChronicDiseases(row.id);
    this.loadDiagnoses(row.id);

  }
  getPRCMFacilityUsers() {
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
  getPRCMStatusList() {
    const keys = Object.keys(PRCMStatusEnum).filter(
      (k) => typeof PRCMStatusEnum[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: PRCMStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    this.PRCMStatusList = values;
    return values;
  }

  assignPRCMData() {
    this.PRCMDataSpinner = true;
    if (this.selectedCronicDisease && this.selectedCronicDisease.icdCode) {
      this.tempChronicIcd10Code.push(this.selectedCronicDisease.icdCode);
    }
    this.editPRCMDto.chronicIcd10Code = [...this.tempChronicIcd10Code];
    this.editPRCMDto.chronicIcd10Code = [...this.patientSelectedIcd10Code, ...this.editPRCMDto.chronicIcd10Code];
    // var mySet = new Set(this.editPRCMDto.chronicIcd10Code);
    // this.editPRCMDto.chronicIcd10Code = [...mySet];

    this.editPRCMDto.chronicIcd10Code = this.toUniqueArray(this.editPRCMDto.chronicIcd10Code);

    this.PRCMService.AssignPRCMData(this.editPRCMDto).subscribe(
      (res: []) => {
        this.toaster.success("Assigned Successfully");
        this.PRCMDataSpinner = false;
        this.editPRCM2.hide();
        this.filterPatients();
        this.GetMonthlyPatientsPRCMData();
        this.editPRCMDto = new EditPRCMData();
      },
      (error: HttpResError) => {
        this.PRCMDataSpinner = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

   toUniqueArray(a){
    var newArr = [];
    for (var i = 0; i < a.length; i++) {
        if (newArr.indexOf(a[i]) === -1) {
            newArr.push(a[i]);
        }
    }
  return newArr;
}
  getPsyFacilityUsers() {
    let roleName = "Psychiatrist";
    this.isLoadingPayersList = true;
    this.PRCMService.GetFacilityUsers(this.facilityId, roleName).subscribe(
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
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      err => {}
    );
  }
  // getCronicDiseases() {
  //   this.PRCMService.GetPRCMChronicDiseaseCodes().subscribe(
  //     (res: any) => {
  //       this.cronicDiseaseList = res;
  //     },
  //     (err) => {}
  //   );
  // }
  onClickRow(row, event: MouseEvent) {
    // this.patientsService.getPatientDetail(row)
    this.rowId = row.id;
    // this.router.navigate(["/admin/patient/" + row.id]);
    this.datafilterService.routeState = this.router.url;
    this.ApplyNavigation('/admin/patient/' + row.id, event.ctrlKey);
    const tempTab = "isEndo";
    this.appData.addTabCheck(tempTab);
    // this.router.navigateByUrl("/admin/patient/" + row.id);
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
      const url1 = this.router.serializeUrl( this.router.createUrlTree([`${url}`]) );
      const newWindow = window.open('', '_blank');
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
  filterPatients(date?) {
    this.datafilterService.filterData['endoList'] = this.filterPatientDto;
    this.isLoading = true;
    this.ageSelection();
    if (date) {
      date = moment(date.date).format("YYYY-MM")
     var splitedArray = date.split('-');
     this.filterPatientDto.serviceYear = splitedArray[0];
     this.filterPatientDto.serviceMonth = splitedArray[1];

    }
    this.filterPatientDto.filteredMonth = this.selectedDate;
    this.rerender();
  }
  assignUserValues() {
    this.isLoading = true;
    const fPDto = new PRCMPatientsScreenParams();
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
    this.filterPatientDto = new PRCMPatientsScreenParams();
    this.filterPatientDto.pageNumber = 1;
    this.filterPatientDto.filteredMonth = moment().format("YYYY-MM");
    this.selectedDate = moment().format("YYYY-MM");
    this.ageFrom = null;
    this.ageTo = null;
  }
  ProceedNavigation(row: PRCMPatientsListDto) {
    const tempTab = "isEndo";
    this.appData.addTabCheck(tempTab);
    this.router.navigate(['/principalcare/PrcmEncounters/'+row.id], {queryParams:{prcmCareFacilitatorId: row.end_PrCMCareFacilitatorId,prcmSpecialistId:row.end_PrCMSpecialistBillerId}});
  }
  scrollToTable() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: ".ccm-datatable",
    });
  }
  ageSelection() {
    if (this.filterPatientDto.age == 'custom' && this.ageFrom && this.ageTo) {
      this.filterPatientDto.age = this.ageFrom + '-' + this.ageTo;
    }
  }
  adddiagnose() {
    if (this.selectedCronicDisease && this.selectedCronicDisease.icdCode) {

      this.diagnose.patientId = this.selectedPatientData.id
      this.diagnose.diagnosisDate = moment().format("YYYY-MM-DD");
      this.diagnose.icdCode = this.selectedCronicDisease.icdCode;
        this.diagnose.description = this.selectedCronicDisease.detail;
        if (this.diagnose.isChronic == null) {
          this.diagnose.isChronic = false;
        }
        const fPDto = new DiagnosisDto();
      for (const filterProp in this.diagnose) {
        if (
          this.diagnose[filterProp] === null ||
          this.diagnose[filterProp] === undefined
        ) {
          this.diagnose[filterProp] = fPDto[filterProp];
          // this.FilterPatientDto[filterProp] = 0;
        }
      }
      this.subs.sink = this.patientService
        .AddEditPatientDiagnosis(this.diagnose)
        .subscribe(
          (res: any) => {
            this.toaster.success("Diagnose Assign Successfully");
            this.diagnose = new DiagnosisDto();
            this.selectedCronicDisease = {
              icdCode: "",
              detail: ""
            };
          },
          (error: HttpResError) => {
            this.toaster.error(error.error);
            // this.closeModal.emit();
          }
        );
    }
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
}
