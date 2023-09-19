import { CustomeListService } from './../../core/custome-list.service';
import { PatientsService } from './../../core/Patient/patients.service';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcmDataService } from 'src/app/tcm-data.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Location } from '@angular/common';
import {  TcmRequirementsStatusEnum, tcmStatus2Enum, TcmStatusEnum } from 'src/app/model/Tcm/tcm.enum';
import { TcmEncounterCloseDto, AddTcmEncounterDto, TcmFilterPatient, TcmEncounterForListDto, AssignTcmProvidersDto } from 'src/app/model/Tcm/tcm.model';
import { ToastService, ModalDirective, IMyOptions } from 'ng-uikit-pro-standard';
import { LazyModalDto, PagingData } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { TcmStoreService } from 'src/app/core/tcm/tcm-store.service';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { AddEditCustomListDto, AssignPatientsToCustomListDto } from 'src/app/model/custome-list.model';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { fromEvent, Subject } from 'rxjs';
import { SubSink } from 'src/app/SubSink';
import { debounceTime, map } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { CcmStatus } from 'src/app/Enums/filterPatient.enum';
import moment from 'moment';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { CustomListForPatientListsComponent } from 'src/app/custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component';

@Component({
  selector: 'app-tcm-list',
  templateUrl: './tcm-list.component.html',
  styleUrls: ['./tcm-list.component.scss']
})
export class TcmListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild ('ClosedStatusModal') ClosedStatusModal: ModalDirective;
  @ViewChild ('HospitalizationDateModal') HospitalizationDateModal: ModalDirective;
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  public onlydatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD'
  };
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
  };
  // dateFormat: "mm-dd-yyyy"
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: 2020,
    closeAfterSelect: true,
    dateFormat: 'yyyy-mm-dd',
  };

  rowIndex = 0;
  dtTrigger = new Subject<any>();
  private subs = new SubSink();
  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};
  selected: any[];
  rows = new Array<TcmEncounterForListDto>();
  pagingData = new PagingData();
  table = $('#example').DataTable();
  @ViewChild('searchPatient') searchPatient: ElementRef;
  @ViewChild('clickOnRow') clickOnRow: ModalDirective;

  followUpDataObj = {
    patientId: 0,
    followUpDate: '',
    recentPcpAppointment: '',
    recentHospitalizationDate : '',
    lastTcmStatus: tcmStatus2Enum,
    lastTcmEncounterId: 0
  };
  tcmRequirementsStatusEnum = TcmRequirementsStatusEnum;
  IsLoading = true;
  PatientId: number;
  creatingTcm: boolean;
  tcmStatusEnum = tcmStatus2Enum;
  ccmStatusEnum = CcmStatus;
  filterPatientDto = new TcmFilterPatient();
  tcmList: [];
  addTcmEncounterDto = new AddTcmEncounterDto();
  // tcmClosedStatusEnum = ClosedStatus;
  tcmEncounterCloseDto = new TcmEncounterCloseDto();
  checkEncounter: any[];
  isShowAddButton = true;
  BIllingProviderList = new Array<CreateFacilityUserDto>();
  facilityId = 0;
  ccmStatusList: any;
  tcmStatusList: any;
  currentUser: AppUserAuth = null;
  CustomListDto = new Array<AddEditCustomListDto>();
  facilityUserId = 0;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  // selected: any[];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  gridCheckAll: boolean;
  loadingOnStart: boolean;
  rowId: any;
  CanEditAssignedDate: boolean;
  assignedDateProp: string;
  assigningDate: boolean;
  selectedPatient = new TcmEncounterForListDto();
  AssignProviderAndDateObj  = new AssignTcmProvidersDto();
  isLoadingUsers: boolean;
  facilityUsersList = new Array<CreateFacilityUserDto>();
  dischargeDate: string;
  tentativeDischargeDate: string;
  assigningDischargeDate: boolean;
  queryParamsApplied: boolean;
  // followUpDataObj: any;
  constructor(private route: ActivatedRoute,private appUi: AppUiService, private toaster: ToastService,
    private tcmSevice: TcmDataService,private ccmService: CcmDataService, private location: Location,
     private router: Router, public tcmStore: TcmStoreService, private customListService: CustomeListService,
     private facilityService: FacilityService, private patientsService: PatientsService,
     public securityService: SecurityService,private eventBus: EventBusService,private filterDataService: DataFilterService) { }

  ngOnInit() {
    this.getFiltersData();
    // this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (this.securityService.securityObject.userType == UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.facilityUserId = +this.securityService.securityObject.id;
    }
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }
    this.eventBus.on(EventTypes.RefreshCustomList).subscribe((res) => {
      this.GetCustomListsByFacilityUserId();
       });
       this.CanEditAssignedDate = this.securityService.hasClaim(
        'CanEditAssignedDate'
      );
    this.tcmStatusList = this.gettcmStatusArray();
    this.getCcmStatus();
    this.initializeDataTable();
    // this.getPatientTcmList();
    // this.getBillingProviders();
    this.GetCustomListsByFacilityUserId();
    this.getFacilityUsers();
  }
  ngAfterViewInit() {
    this.dtTrigger.next();
    this.customListForPatientsListCompRef.filterPatientDto = this.filterPatientDto as any;
    this.subs.sink = fromEvent(this.searchPatient.nativeElement, 'keyup')
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
  getFiltersData(){
    if(this.filterDataService.filterData['tcmList']){
      this.filterPatientDto = this.filterDataService.filterData['tcmList'];
    }
  }
  SaveAssignedDate(modal: any) {
    this.assigningDate = true;
    this.subs.sink = this.tcmSevice
      .EditTCMDateAssigned(this.selectedPatient.patientId, this.assignedDateProp, this.facilityId)
      .subscribe(
        (res) => {
          modal.hide();
          this.assigningDate = false;
          this.selectedPatient.dateAssigned = this.assignedDateProp;
          this.toaster.success('Date Saved Successfully');
        },
        (err: HttpResError) => {
          this.assigningDate = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  AssignDischargeDate() {
    this.dischargeDate = this.selectedPatient.dischargeDate ? moment(this.selectedPatient.dischargeDate).format('MM-DD-YYYY') : '';
    this.tentativeDischargeDate = this.selectedPatient.tentativeDischargeDate ? moment(this.selectedPatient.tentativeDischargeDate).format('MM-DD-YYYY') : '';
  }
  SetDischargeDate(modal: any) {
    this.assigningDischargeDate = true;
    this.subs.sink = this.tcmSevice
      .SetDischargeDate(this.selectedPatient.id, this.dischargeDate || '', this.tentativeDischargeDate || '')
      .subscribe(
        (res) => {
          modal.hide();
          this.assigningDischargeDate = false;
          this.selectedPatient.dischargeDate = this.dischargeDate;
          this.selectedPatient.tentativeDischargeDate = this.tentativeDischargeDate;
          this.dischargeDate = '';
          this.tentativeDischargeDate = '';
          this.toaster.success('Date Saved Successfully');
        },
        (err: HttpResError) => {
          this.assigningDischargeDate = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  resetAssignModalDetails() {
    this.AssignProviderAndDateObj = new AssignTcmProvidersDto();
  }
  SaveAssignedProvidersAndDate(modal: any) {
    this.assigningDate = true;
    this.AssignProviderAndDateObj.patientId = this.selectedPatient.patientId;
    const fPDto = new AssignTcmProvidersDto();
    for (const filterProp in this.AssignProviderAndDateObj) {
      if (
        this.AssignProviderAndDateObj[filterProp] === null ||
        this.AssignProviderAndDateObj[filterProp] === undefined
      ) {
        this.AssignProviderAndDateObj[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.subs.sink = this.tcmSevice
      .AssignProviders(this.AssignProviderAndDateObj)
      .subscribe(
        (res) => {
          this.assigningDate = false;
          modal.hide();
          this.filterPatients();
          this.toaster.success('Data daved successfully');
        },
        (err: HttpResError) => {
          this.assigningDate = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  changeStatus(row: any) {
    this.selectedPatient = row;
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.subs.unsubscribe();
  }
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
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingUsers = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.isLoadingUsers = false;
      },
      (error: HttpResError) => {
        this.isLoadingUsers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddPatientsToList(id: number) {
    // this.isLoadingPayersList = true;
    this.addPatientInCustmListDto.patientIds = new Array<number>();
    this.selected.forEach((element) => {
      this.addPatientInCustmListDto.patientIds.push(element.patientId);
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
  initializeDataTable() {
    this.dtOptions = {
      pagingType: 'first_last_numbers',
      scrollX: true,
      scrollCollapse: true,
      serverSide: true,
      stateSave: true,
      stateDuration: -1,
      stateSaveCallback: function (oSettings, oData) {
        localStorage.setItem(
          'DataTables_TCM' + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem('DataTables_TCM' + window.location.pathname)
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
        { targets: 0, orderable: false },
        { targets: 1, orderable: false }
        // { targets: 2, orderable: true },
        // { targets: 3, orderable: false },
        // { targets: 4, orderable: true },
        // { targets: 5, orderable: true },
        // { targets: 6, orderable: true },
        // { targets: 7, orderable: true },
        // { targets: 8, orderable: true },
        // { targets: 9, orderable: true },
        // { targets: 10, orderable: true },
        // { targets: 11, orderable: false },
        // { targets: 12, orderable: true },
        // { targets: 11, orderable: false },
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
        this.filterPatientDto.PageSize = dataTablesParameters.length;
        this.filterPatientDto.PageNumber =
          dataTablesParameters.start / dataTablesParameters.length + 1;
        this.filterPatientDto.PageNumber = Math.floor(
          this.filterPatientDto.PageNumber
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
          if (dataTablesParameters.order[0].dir === 'asc') {
            this.filterPatientDto.sortOrder = 0;
          }
          if (dataTablesParameters.order[0].dir === 'desc') {
            this.filterPatientDto.sortOrder = 1;
          }
        }
        if (
          this.securityService.securityObject.userType === UserType.FacilityUser
        ) {
          this.filterPatientDto.FacilityUserId = this.securityService.securityObject.id;
        } else {
          this.filterPatientDto.FacilityUserId = 0;
        }
        this.filterPatientDto.FacilityId = this.facilityId;
        this.loadingOnStart = false;
        this.IsLoading = true;
        if (!this.queryParamsApplied) {
          this.checkIfQueryParams();
        }
        this.filterDataService.filterData["tcmList"] = this.filterPatientDto;
        this.tcmSevice
          .GetPatients2(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              // res.preventiveGapScreenDtos.forEach((element) => {
              //   // if (element.dob) {
              //   //   element.dob = moment.utc( element.dob).local().format('YYYY-MM-DD');
              //   // }
              // });
              this.IsLoading = false;
              this.selected = [];
              this.rows = [];
              // this.rowIndex = this.filterPatientDto.rowIndex;
              this.rows = res.tcmPatientsList;
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
              this.IsLoading = false;
              this.toaster.error(err.error, err.message);
            }
          );
      },

      columns: [
        { name: 'id' },
        { name: 'firstName' },
        { name: 'checkBox' },
        { name: 'stage' },
        { name: 'tcmDateAssigned' },
        { name: 'hospitalizationDate' },
        { name: 'dischargeDate' },
        { name: 'tentativDischargeDate' },
        // { name: 'carecordinator' },
        // { name: 'initialCommStatus' },
        { name: 'followUpDate' },
        { name: 'ccmStatus' },
        { name: 'careFacilitatorName' },
        { name: 'tcmStatus' },
        { name: 'billingProviderName' },
        // { name: 'nextDue' },
        // { name: 'result' },
        // { name: 'note' },
        // { name: "action" },
      ],
    };
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
    this.filterDataService.filterData['tcmList'] = this.filterPatientDto;
    this.IsLoading = true;
    this.assignUserValues();
    this.rerender();
  }
  assignUserValues() {
    this.IsLoading = true;
    const fPDto = new TcmFilterPatient();
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
    this.filterPatientDto = new TcmFilterPatient();
    this.filterPatientDto.customListId = customId;
    this.filterPatientDto.PageNumber = 1;
  }
  redDraw(): void {
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust();
      // console.log('dtInt', mydtInstance);
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
  checkIfQueryParams() {
    this.queryParamsApplied = true;
    const filterState = this.route.snapshot.queryParams['filterState'];
    if (filterState) {
      this.filterPatientDto = JSON.parse(filterState);
    }
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

    this.rowId = row.patientId;
    // this.router.navigateByUrl("/admin/patient/" + row.patientId);
    if (row.profileStatus) {
      // this.router.navigate(['/admin/patient/', row.patientId]);
      this.filterDataService.routeState = this.router.url;
      this.ApplyNavigation('/admin/patient/' + row.patientId, event.ctrlKey);
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
  createTcmEncounter() {
    this.creatingTcm = true;
    this.addTcmEncounterDto.patientId = this.PatientId;
    this.addTcmEncounterDto.hospitalizationDate = this.followUpDataObj.recentHospitalizationDate;
    this.tcmSevice.createTcm(this.addTcmEncounterDto).subscribe(res => {
      this.creatingTcm = false;
      this.router.navigateByUrl(`/tcm/dischargeOverview/${this.PatientId}/${res}`);
    }, (error: HttpResError) => {
      this.creatingTcm = false;
    });
  }
  updateHospitalizationDate() {
    this.creatingTcm = true;
    this.followUpDataObj.patientId = this.PatientId;
    this.ccmService
      .changefollowUpDate(this.followUpDataObj)
      .subscribe(
        res => {
          this.creatingTcm = false;
          this.HospitalizationDateModal.hide();
          this.createTcmEncounter();
          // this.toaster.success("Data Updated Successfully");
        },
        err => {
          this.creatingTcm = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  getBillingProviders() {
    this.facilityService
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
  getCcmStatus() {
    this.patientsService
      .getCcmStatus()
      .subscribe((res: any) => {
        if (res) {
          this.ccmStatusList = res;
        }
      });
  }
  gettcmStatusArray() {
    const keys = Object.keys(TcmStatusEnum).filter(
      (k) => typeof TcmStatusEnum[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: TcmStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    return values;
  }

//   getPatientTcmList() {
//     this.IsLoading = true;
//     this.tcmSevice.getTcmListByPatientId(this.PatientId).subscribe((res: any) => {
//       this.IsLoading = false;
//       this.tcmList = res;
// if (this.tcmList) {
//   this.checkEncounter = this.tcmList.filter((res: any) => {
//     return res.tcmStatus == 1 || res.tcmStatus == 2;
//   })
//   if (this.checkEncounter.length > 0 ) {
//     this.isShowAddButton = true;
//   } else {
//     this.isShowAddButton = false;
//   }
// }
//       // this.tcmList.forEach(obj => {
//       //   obj.closedStatus
//       // });
//     }, (error: HttpResError) => {
//       this.IsLoading = false;
//     });
//   }
  singleRowData(row: any) {
    this.tcmEncounterCloseDto.TcmEncounterId = row.id;
    this.tcmEncounterCloseDto.ClosedStatus = row.closedStatus;
  }
  openAssignProviderStatusModal(row: any, modal: ModalDirective) {
    this.selectedPatient = row;
    this.AssignProviderAndDateObj.tcmDateAssigned = this.selectedPatient.dateAssigned ? moment(this.selectedPatient.dateAssigned).format('MM-DD-YYYY') : '';
    this.AssignProviderAndDateObj.tcmBillingProviderId = this.selectedPatient.tcmBillingProvider?.id || null;
    this.AssignProviderAndDateObj.tcmCareFacilitatorId = this.selectedPatient.tcmCareFacilitator?.id || null;
    this.AssignProviderAndDateObj.tcmCareCoordinatorIds = this.selectedPatient.tcmCareCoordinators?.map(x => x.id);
    modal.show();
  }
  setTcmEncounterClosedStatus() {
    this.ClosedStatusModal.hide();
    this.tcmSevice.SetTcmEncounterClosedStatus(this.tcmEncounterCloseDto).subscribe(
      (res: any) => {
       this.filterPatients();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  navigateBack() {
    this.location.back();
  }
  openConfirmModal(data: any) {
    this.ClosedStatusModal.hide();
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Close TCM Status';
    modalDto.Text = `Do you want to Close this tcm ?`;
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.setTcmEncounterClosedStatus();
  }
  navigateToPatientTcm(row){
    this.filterDataService.routeState = this.router.url;
    this.router.navigate([`/tcm/dischargeOverview/${row.patientId}/${row.id}`]);
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
}
