import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { IMyOptions, ModalDirective, TabsetComponent, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { Subject, fromEvent } from 'rxjs';
import { PageScrollService } from "ngx-page-scroll-core";
import { map, debounceTime } from 'rxjs/operators';
import { CustomeListService } from 'src/app/core/custome-list.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { InsuranceService } from 'src/app/core/insurance.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { PRCMService } from 'src/app/core/prcm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AddEditCustomListDto, AssignPatientsToCustomListDto, RemovePatientsToCustomListDto } from 'src/app/model/custome-list.model';
import { CareGapDto } from 'src/app/model/pcm/payers.model';
import { GapStatus } from 'src/app/model/pcm/pcm.model';
import { PRCMPatientsScreenParams, PRCMPatientsListDto, PRCMStatusEnum, EditPRCMData, PrcmDiagnosisDto, BulkDateAssignedParamDto } from 'src/app/model/Prcm/Prcm.model';
import { SubSink } from 'src/app/SubSink';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { AllChronicDiseaseDto, ChronicIcd10CodeDto, DiagnosisDto, SelectChronicDiseaseDto } from 'src/app/model/Patient/patient.model';
import moment from 'moment';
import { CustomListForPatientListsComponent } from 'src/app/custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component';

@Component({
  selector: 'app-principal-care-managements',
  templateUrl: './principal-care-managements.component.html',
  styleUrls: ['./principal-care-managements.component.scss']
})
export class PrincipalCareManagementsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
    appendTo: "body",
  };

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
  cronicDiseaseList = new Array<{ id: 0; detail: "" }>();
  gridCheckAll: boolean;
  rowId: any;
  listOfYears = [];
  @ViewChild("searchPatient") searchPatient: ElementRef;
  @ViewChild("editPRCM") editPRCM: ModalDirective;
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
  AllCronicDiseaseList = new Array<AllChronicDiseaseDto>();
  removePatientInCustmListDto = new RemovePatientsToCustomListDto();
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  patientChronicConditionsForEdit: PrcmDiagnosisDto[] = [];
  patientDiagnosesList = new Array<SelectChronicDiseaseDto>();
  gettingChronicConditions: boolean;
  tempChronicIcd10Code = new Array<string>();
  patientSelectedIcd10Code = new Array<string>();
  isEndo = false;
  isGeneral = false;

  yearNow = new Date();
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: this.yearNow.getFullYear() + 5,
    closeAfterSelect: true,
    dateFormat: 'yyyy-mm-dd',
  };
  assignedDateProp: string;
  assigningDate: boolean;

  bulkDateAssignedParamDto = new BulkDateAssignedParamDto();
  selectedCronicDisease = {
    icdCode: "",
    detail: ""
  };
  diagnose = new DiagnosisDto();
  selectedPatientData: any;


  constructor(
    private pcmService: PcmService,
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
      this.router.navigate([], {
        queryParams: {
          'isEndo': null,
        },
        queryParamsHandling: 'merge'
      })
    }
    const tempIsGeneral = this.route.snapshot.queryParams['isGeneral'];
    if(tempIsGeneral){
      this.isGeneral = JSON.parse(tempIsGeneral);
      this.router.navigate([], {
        queryParams: {
          'isGeneral': null,
        },
        queryParamsHandling: 'merge'
      })
      this.getFiltersData();
    }

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
    this.getPRCMStatusList();
    this.initializeDataTable();
    this.getPRCMFacilityUsers();
    this.getPsyFacilityUsers();
    // this.getCronicDiseases();
    this.GetAllCareGaps();
    this.GetCustomListsByFacilityUserId();
    this.GetAllChronicDisease();
  }
  ngAfterViewInit() {
    if(this.isGeneral){
        this.staticTabs.setActiveTab(2);
    }
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
    if(this.datafilterService.filterData['prcmList']){
      this.filterPatientDto = this.datafilterService.filterData['prcmList'];
    }
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
  BulkDateAssignedPrCM() {
    this.bulkDateAssignedParamDto.facilityId = this.facilityId;
    this.bulkDateAssignedParamDto.patientIds = new Array<number>()
    this.selected.forEach((element) => {
      this.bulkDateAssignedParamDto.patientIds.push(element.id);
    });
    this.subs.sink = this.PRCMService
      .BulkDateAssignedPrCM(this.bulkDateAssignedParamDto)
      .subscribe(
        (res) => {
          this.filterPatients();
          this.toaster.success('Date Saved Successfully');
          this.bulkDateAssignedParamDto = new BulkDateAssignedParamDto();
        },
        (err) => {
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
          "DataTables_PRCM12" + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem("DataTables_PRCM12" + window.location.pathname)
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
        { targets: 7, orderable: false },
        { targets: 8, orderable: true },
        { targets: 9, orderable: false },
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
        this.datafilterService.filterData['prcmList'] = this.filterPatientDto;
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
        // { name: "careCoordinators" },
        { name: "careCoordinators" },
        { name: "end_PrCMSpecialistBiller" },
        { name: "prcmStatus" },
        { name: "currentMonthCompletedTimeString" },
        { name: "assignedDate" },
        { name: "chronicDiseases" },
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
  GetAllChronicDisease() {
    this.subs.sink = this.patientService.getAllChronicDisease().subscribe(
      (res: any) => {
        this.AllCronicDiseaseList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
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
        this.editPRCM.hide();
        this.filterPatients();
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
    const tempTab = "isGeneral";
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
    } else {
      this.selected = [];
    }
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

    this.datafilterService.filterData['prcmList'] = this.filterPatientDto;
    this.isLoading = true;
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
  }
  ProceedNavigation(row: PRCMPatientsListDto) {
    const tempTab = "isGeneral";
    this.appData.addTabCheck(tempTab);
    this.router.navigate(['/principalcare/PrcmEncounters/'+row.id], {queryParams:{prcmCareFacilitatorId: row.end_PrCMCareFacilitatorId,prcmSpecialistId:row.end_PrCMSpecialistBillerId}});
  }
  scrollToTable() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: ".ccm-datatable",
    });
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
}
