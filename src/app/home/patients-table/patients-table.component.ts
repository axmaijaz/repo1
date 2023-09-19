
import { Router, ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy
  // ChangeDetectorRef,
  // KeyValueChanges,
  // KeyValueDiffer
} from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import * as FileSaver from 'file-saver';
import {
  AssignPatientsToCareProvider,
  FilterPatient,
  PatientDto,
  CcmStatusChangeDto,
  AllChronicDiseaseDto,
  DeletPatientDto,
  DownloadLogHistoryDto
} from 'src/app/model/Patient/patient.model';
import * as moment from 'moment';
// import { NewUser } from 'src/app/model/AppModels/usermanager.model';
import { UserManagerService } from 'src/app/core/UserManager/user-manager.service';
import {
  ToastService,
  ModalDirective,
  PopoverDirective,
  IMyOptions
} from 'ng-uikit-pro-standard';
// import { ProviderDto } from 'src/app/model/Provider/provider.model';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SecurityService } from 'src/app/core/security/security.service';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { FacilityService } from 'src/app/core/facility/facility.service';
import {
  CreateFacilityUserDto,
  FacilityDto
} from 'src/app/model/Facility/facility.model';
import {
  CcmStatus,
  RpmStatus,
  CcmMonthlyStatus
} from 'src/app/Enums/filterPatient.enum';
import {
  // CcmEncounterForList,
  CcmEncounterListDto,
  ChangeMonthlyCcmStatus,
  RpmStatusChangeDto
} from 'src/app/model/admin/ccm.model';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map, timeout } from 'rxjs/operators';
// import { state } from '@angular/animations';
import { StatementManagementService } from 'src/app/core/statement-management.service';
import { DatePipe } from '@angular/common';
import { AppDataService } from 'src/app/core/app-data.service';
import { LazyLoaderService } from 'src/app/core/Lazy/lazy-loader.service';
import { SubSink } from 'src/app/SubSink';
import { EventBusService, EmitEvent, EventTypes } from 'src/app/core/event-bus.service';

@Component({
  selector: "app-patients-table",
  templateUrl: "./patients-table.component.html",
  styleUrls: ["./patients-table.component.scss"]
})
export class PatientsTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new SubSink();
  // pagesize=10
  SelectionType = SelectionType;
  isLoading = false;
  isLoadingZip = false;
  AllCronicDiseaseList = new Array<AllChronicDiseaseDto>();
  rows = new Array<PatientDto>();
  currentPatient = new PatientDto();
  pagingData = new PagingData();
  deletePatientDto = new DeletPatientDto();
  currentUser: AppUserAuth = null;
  ccmStatusChangeDto = new CcmStatusChangeDto();
  rpmStatusChangeDto = new RpmStatusChangeDto();
  ccmStatusEnum = CcmStatus;
  rpmStatusEnum = RpmStatus;
  assignedDateProp: string;

  ccmStatusList: any;
  rpmStatusList: any;

  ccmMonthlyStatusEnum = CcmMonthlyStatus;
  ccmMonthlyStatusChangeDto = new ChangeMonthlyCcmStatus();
  temp = [];
  selected = [];
  endTime: any;
  AssignValue = 0;
  rowId: string;
  downloadData: string;
  facilityList = new Array<FacilityDto>();
  myduration: any;
  profileStatus: boolean;
  downloadLogHistory = new DownloadLogHistoryDto();
  // currentTime = new Date();
  CareProvidersList = new Array<CreateFacilityUserDto>();
  BIllingProviderList = new Array<CreateFacilityUserDto>();
  FilterPatientDto = new FilterPatient();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('searchPatient') searchPatient: ElementRef;
  @ViewChild('clickOnRow') clickOnRow: ModalDirective;
  @ViewChild('addEncounterModal') addEncounterModal: ModalDirective;
  @ViewChild('unApprovedCarePLanModal') unApprovedCarePLanModal: ModalDirective;
  @ViewChild('pop') pop: PopoverDirective;
  AssignCareProviderToPatientsDto = new AssignPatientsToCareProvider();
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: 2020,
    closeAfterSelect: true,
    dateFormat: 'yyyy-mm-dd'
    // const year = this.yearNow.getFullYear() - 60;
    //   const month = this.yearNow.getMonth() + 1;
    //   const day = this.yearNow.getDate();
    //   this.PatientForm.get('dateOfBirth').setValue(year + '-' + month + '-' + day);

    // startDate:
    // this.yearNow.getFullYear() -
    // 60 +
    // "-" +
    // (this.yearNow.getMonth() + 1) +
    // "-" +
    // this.yearNow.getDate()
    // 2000 - 10 - 4,
    // ariaLabelPrevYear:2020
  };

  yearNum: number;
  // isDeleted = true;
  listOfYears = [];
  facilityId: number;
  ccmEncounterListDto = {
    id: 0,
    startTime: '',
    endTime: '',
    ccmServiceTypeId: 0,
    careProviderId: 0,
    patientId: 0,
    appAdminId: 0,
    duration: 0,
    encounterDate: '',
    note: ''
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'HH:mm'
    // format: 'YYYY-MM-DD hh:mm A'
  };
  public scrollbarOptions = {
    axis: 'y',
    theme: 'minimal-dark',
    scrollbarPosition: 'inside',
    scrollInertia: 0
  };
  public dropdownScroll = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true }
  };
  showAlertFEncounter: boolean;
  reasonDeleted: number;
  deletePatientId: number;
  reason: string;
  LoadingData = false;
  assigningDate: boolean;
  constructor(
    private router: Router,
    private facilityService: FacilityService,
    private patientsService: PatientsService,
    private userManagerService: UserManagerService,
    private ccmService: CcmDataService,
    private lazyService: LazyLoaderService,
    private toaster: ToastService,
    public securityService: SecurityService,
    private statementManagementService: StatementManagementService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private appData: AppDataService,
    private eventBusService: EventBusService
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

  ngOnInit() {
    this.FilterPatientDto.serviceYear = this.appData.currentYear;
    this.listOfYears = this.appData.listOfYears;
    // this.cellOverflowVisible();
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }
    if (this.currentUser.userType === UserType.FacilityUser) {
      this.FilterPatientDto.FacilityUserId = this.securityService.securityObject.id;
    } else {
      this.FilterPatientDto.FacilityUserId = 0;
    }
    if (this.currentUser.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    }
    this.loadPatients();
    if (this.currentUser.userType !== UserType.AppAdmin) {
      this.getCareProviders();
      this.getBillingProviders();
    }
    if (this.currentUser.userType === UserType.AppAdmin) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.getCareProviders();
      this.getFacilityList();
    }
    const filters = this.route.snapshot.queryParamMap.get('filters');
    if (filters) {
      this.pagingData.pageNumber =
        this.statementManagementService.filterPatientData.PageNumber - 1;
      this.FilterPatientDto = this.statementManagementService.filterPatientData;
      this.getFilterPatients();
    }
    this.GetAllChronicDisease();
  }

  ngAfterViewInit() {
     this.getCcmStatus();
     this.getRpmStatus();
    // this.searchPatient.nativeElement.focus();

    this.subs.sink = fromEvent(this.searchPatient.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 2
        // filter(res => res.length > 2),
        // Time in milliseconds between key events
        debounceTime(1000)
        // subscription for response
      )
      .subscribe((text: string) => {
        this.filterSearchParamData();
      });
    // setTimeout(() => {
    //   this.lazyService.loadModule('admin').then(() => {
    //     console.log('Admin module downloaded.', 'background: #222; color: #bada55')
    //   });
    // }, 1000);
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
        error => {
        }
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
        error => {
        }
      );
  }
  loadPatients() {
    this.setPage({ offset: 0 });
    // this.isLoading = true;
    // this.patientsService.getFilterPatientsList(this.FilterPatientDto).subscribe((res: any) => {
    //   this.isLoading = false;
    //   if (res) {
    //     this.rows = res;
    //     this.temp = res;
    //   }
    // }, error => {
    //   this.isLoading = false;
    //   console.log(error);
    // });
  }
  onActivate(event) {
    if (event.type === 'click') {
      // id: number = +event.row.id;
      // if (event.row.isConsentTaken) {
      this.router.navigate(['/admin/patient/', event.row.id]);
      // } else {
      // this.router.navigate(['/admin/patientConsent/', event.row.id]);
      // }
    }
  }
  onClickRow(row) {
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.id;
    if (row.profileStatus) {
      this.router.navigate(['/admin/patient/', row.id]);
    } else {
      this.clickOnRow.show();
      // this.router.navigate(['/admin/addPatient/'+ row.id);
      // this.router.navigate(['/admin/addPatient/', row.id]);
    }
  }
  addRequiredData() {
    // this.router.navigateByUrl('/admin/addPatient/'+ this.rowId, {state: {filters:this.FilterPatientDto}});
    this.router.navigate(['/admin/addPatient/' + this.rowId], {
      state: this.FilterPatientDto
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
  HeaderSelect(allRowsSelected, selectfn) {
    if (allRowsSelected === true) {
      this.selected = [];
      Object.assign(this.selected, this.rows);
    } else {
      this.selected = [];
    }
  }
  RowSelected(isSelected, row) {
    this.profileStatus = row.profileStatus;
    if (isSelected) {
      this.selected.push(row);
    } else {
      const index = this.selected.findIndex(x => x.id === row.id);
      this.selected.splice(index, 1);
    }
  }
  displayCheck(row) {
    return row.name !== 'Ethel Price';
  }
  OpenModalAssignPatientToProvider() {}
  AssignPatients() {
    this.AssignCareProviderToPatientsDto.patientIds = new Array<number>();
    this.selected.forEach(element => {
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
            this.toaster.success('Data Successfully');
            this.loadPatients();
          },
          error => {
            this.toaster.error(error.message, error.error || error.error);
            // this.addUserModal.hide();
          }
        );
    } else {
      this.subs.sink = this.userManagerService
        .AssignPatientsToCareProvider(this.AssignCareProviderToPatientsDto)
        .subscribe(
          (res: any) => {
            this.loadPatients();
            this.selected = [];
            this.AssignCareProviderToPatientsDto = new AssignPatientsToCareProvider();
            this.toaster.success('Data Saved Successfully');
          },
          error => {
            this.toaster.error(error.message, error.error || error.error);
            // this.addUserModal.hide();
          }
        );
    }
  }
  getCCMMinutes(time: string): string {
    if (time) {
      const datTime = '6/14/19 ' + time;
      return this.datePipe.transform(datTime, 'mm') + ' min';
    } else {
      return '';
    }
  }
  getFilterPatients() {
    this.setPage({ offset: this.pagingData.pageNumber });
  }
  resetFilter() {
    this.FilterPatientDto = new FilterPatient();
  }
  setPage(pageInfo) {
    if (!this.FilterPatientDto.CareProviderId) {
      this.FilterPatientDto.CareProviderId = 0;
    }
    if (!this.FilterPatientDto.BillingProviderId) {
      this.FilterPatientDto.BillingProviderId = 0;
    }
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.FilterPatientDto.FacilityUserId = this.securityService.securityObject.id;
    } else {
      this.FilterPatientDto.FacilityUserId = 0;
    }

    this.pagingData.pageNumber = pageInfo.offset;
    this.isLoading = true;
    // if (!this.FilterPatientDto.chronicDiseasesIds) {
    //   this.FilterPatientDto.chronicDiseasesIds = 0;
    // }
    const fPDto = new FilterPatient();
    for (const filterProp in this.FilterPatientDto) {
      if (this.FilterPatientDto[filterProp] === null) {
        this.FilterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }

    this.FilterPatientDto.PageNumber = this.pagingData.pageNumber + 1;
    this.subs.sink = this.patientsService
      .getFilterPatientsList(this.FilterPatientDto)
      .subscribe(
        (res: any) => {
          // this.FilterPatientDto = new FilterPatient();
          this.rows = res.patientsList;
          this.temp = res.patientsList;
          this.pagingData = res.pagingData;
          this.pagingData.pageSize = this.pagingData.pageSize;
          this.pagingData.pageNumber = res.pagingData.pageNumber - 1;
          this.isLoading = false;
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  filterSearchParamData() {
    this.setPage({ offset: 0 });
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
    this.ccmEncounterListDto.encounterDate = moment().format('YYYY-MM-DD');
    this.ccmEncounterListDto.appAdminId = this.securityService.securityObject.id;
    this.ccmEncounterListDto.careProviderId = this.securityService.securityObject.id;
    this.subs.sink = this.ccmService
      .addCCMEncounter(this.ccmEncounterListDto)
      .subscribe(
        (res: CcmEncounterListDto) => {
          this.addEncounterModal.hide();
          this.isLoading = false;
          this.loadPatients();
          this.ccmEncounterListDto = {
            id: 0,
            startTime: '',
            endTime: '',
            ccmServiceTypeId: 0,
            careProviderId: 0,
            patientId: 0,
            appAdminId: 0,
            duration: 0,
            encounterDate: '',
            note: ''
          };
        },
        error => {
          this.toaster.error(error.message, error.error || error.error);
          this.isLoading = false;
        }
      );
  }
  validaeTimeDifference(): boolean {
    const sTime = moment(this.ccmEncounterListDto.startTime, 'HH:mm');
    const eTime = moment(this.ccmEncounterListDto.endTime, 'HH:mm');
    const res = sTime.isBefore(eTime);
    return res;
  }
  durationChanged(minsToAdd: any) {
    // if (!this.ccmEncounterListDto.startTime) {
    //   const duration = moment(this.ccmEncounterListDto.duration, 'mm').format('hh:mm:ss');
    //   const currentTime = moment(moment().format('hh:mm:ss'), 'hh:mm:ss');
    //   const result = moment.duration(currentTime.diff(duration));
    // }
    const startTime = this.ccmEncounterListDto.startTime;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece: any = startTime.split(':');
    const mins: any = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    this.ccmEncounterListDto.endTime = newTime;
  }
  onSort(event) {
    // event was triggered, start sort sequence
    this.isLoading = true;
    // emulate a server request with a timeout
    this.FilterPatientDto.sortBy = event.column.prop;
    if (event.newValue && event.newValue === 'asc') {
      this.FilterPatientDto.sortOrder = 0;
    } else if (event.newValue && event.newValue === 'desc') {
      this.FilterPatientDto.sortOrder = 1;
    }
    this.filterSearchParamData();
  }
  IsCCMCompleted(timeCompleted: string) {
    const hours = +timeCompleted.split(':')[0];
    const minutes = +timeCompleted.split(':')[1];
    if (minutes >= 20 || hours > 0) {
      return true;
    } else {
      return false;
    }
  }
  getProvidersForPatient() {
    if (this.selected.length === 1) {
      this.subs.sink = this.patientsService
        .getPatientCareProviers(this.selected[0].id)
        .subscribe(
          (res: Array<{ id: number; name: string }>) => {
            const IDArr = new Array<number>();
            res.forEach(element => {
              if (
                this.CareProvidersList &&
                this.CareProvidersList.length &&
                this.CareProvidersList.find(x => x.id === element.id)
              ) {
                IDArr.push(element.id);
              }
            });
            this.AssignCareProviderToPatientsDto.careProviderIds = IDArr;
          },
          error => {
            this.toaster.error(error.message, error.error || error.error);
            // this.addUserModal.hide();
          }
        );
    }
  }
  addEncounterModalFn() {
    if (
      this.ccmEncounterListDto.patientId &&
      this.currentPatient &&
      this.ccmEncounterListDto.patientId === this.currentPatient.id &&
      this.currentPatient.chronicDiagnosesIds &&
      this.currentPatient.chronicDiagnosesIds.length < 2
    ) {
      this.router.navigate(['/admin/addPatient/' + this.currentPatient.id], {
        queryParams: { setActive: 3 }
      });
      return;
    }
    this.subs.sink = this.patientsService
      .IsCarePlanApproved(this.ccmEncounterListDto.patientId)
      .subscribe(
        res => {
          if (res) {
            this.addEncounterModal.show();
          } else {
            this.unApprovedCarePLanModal.show();
          }
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  approveCarePlanLink() {
    this.router.navigateByUrl(
      "/admin/patient/" + this.ccmEncounterListDto.patientId + "/pDetail/pMasterCarePLan"
    );
  }
  AssignCcmStatus(id: number) {
    this.ccmStatusChangeDto.appUserId = this.securityService.securityObject.appUserId;
    this.ccmStatusChangeDto.patientId = id;
    this.subs.sink = this.patientsService
      .changePatientCcmStatus(this.ccmStatusChangeDto)
      .subscribe(
        res => {
          this.toaster.success('Ccm Status Changed Successfully');
        },
        error => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  AssignRPMStatus(id: number) {
    this.rpmStatusChangeDto.appUserId = this.securityService.securityObject.appUserId;
    this.rpmStatusChangeDto.patientId = id;
    this.subs.sink = this.patientsService
      .changePatientRpmStatus(this.rpmStatusChangeDto)
      .subscribe(
        res => {
          this.toaster.success('Rpm Status Changed Successfully');
        },
        error => {
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
          this.deletePatientDto.reasonDeleteDetails = '';
          this.deletePatientDto.reasonDeleted = 0;
          // this.reason = '';
          this.loadPatients();
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  GetAllChronicDisease() {
    this.subs.sink = this.patientsService.getAllChronicDisease().subscribe(
      (res: any) => {
        this.AllCronicDiseaseList = res;
      },
      err => {
      }
    );
  }
  calculateEndtime() {
    // let currentTime = new Date();

    const endTime = moment().format('HH:mm');
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
    const CurrentTime = moment(this.ccmEncounterListDto.endTime, 'HH:mm');
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
      const duration = moment(this.ccmEncounterListDto.duration, 'mm');
      this.myduration = duration;
      const startTime = moment.duration(CurrentTime.diff(this.myduration));
      this.ccmEncounterListDto.startTime = moment(
        startTime.hours().toString() + ':' + startTime.minutes().toString(),
        'HH:mm'
      ).format('HH:mm');
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
  }
  calculateDuration() {
    if (this.ccmEncounterListDto.startTime) {
      const startTime = moment(this.ccmEncounterListDto.startTime, 'HH:mm');
      const endTime = moment(this.ccmEncounterListDto.endTime, 'HH:mm');
      const calculateDuration = moment.duration(endTime.diff(startTime));
      this.ccmEncounterListDto.duration =
        calculateDuration.hours() * 60 + calculateDuration.minutes();
    }
  }
  resetCcmEncounterlist() {
    this.ccmEncounterListDto.note = '';
    this.ccmEncounterListDto.startTime = '';
    this.ccmEncounterListDto.duration = null;
  }

  ngOnDestroy() {
    this.statementManagementService.filterPatientData = this.FilterPatientDto;
    this.subs.unsubscribe();
  }
  // resizeNgxTable(event: any) {
  //   this.table.recalculate();
  //   console.log(this.table.element);
  // }
  generateCareProvidersCaption(names: string): string[] {
    const namesArray = new Array<string>();
    if (names) {
      const tempArr = names.split(',');
      tempArr.forEach(sName => {
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
      if (this.downloadData === 'selected') {
        const ArrayOfIds = new Array<number>();
        // const FacilityUserId = this.securityService.securityObject.id;
        this.selected.forEach(vals => {
          ArrayOfIds.push(vals.id);
        });
        this.downloadLogHistory.patientIds = ArrayOfIds;
      } else {
        this.downloadLogHistory.patientIds = new Array<number>();
      }
      this.downloadLogHistory.monthId = this.FilterPatientDto.serviceMonth;
      this.downloadLogHistory.yearId = this.FilterPatientDto.serviceYear;
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
            FileSaver.saveAs(
              new Blob([res], { type: 'application/zip' }),
              `${this.downloadLogHistory.facilityId}-${this.downloadLogHistory.monthId}-LogHistory.zip`
            );
            this.LoadingData = false;
          },
          (err: any) => {
            this.isLoadingZip = false;
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  SaveAssignedDate(modal: any) {
    this.assigningDate = true;
    this.subs.sink = this.patientsService.EditDateAssigned(this.currentPatient.id , this.assignedDateProp, this.facilityId)
    .subscribe(
      res => {
        modal.hide();
        this.assigningDate = false;
        this.currentPatient.dateAssigned = this.assignedDateProp;
        this.toaster.success('Date Saved Successfully');
      },
      error => {
        this.assigningDate = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  AssignCcmMonthlyStatus(id: number) {
    this.ccmMonthlyStatusChangeDto.PatientId = id;
    this.subs.sink = this.patientsService
      .editPatientCcmMonthlyStatus(this.ccmMonthlyStatusChangeDto)
      .subscribe(
        res => {
          this.toaster.success('Ccm Monthly Status Changed Successfully');
        },
        error => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  getccmStatusArray() {
    const keys = Object.keys(CcmStatus).filter(
      k => typeof CcmStatus[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map(key => ({
      number: CcmStatus[key as any],
      word: key
    })); // [0, 1]
    return values;
  }
  AssignValueCcmService() {
    if (this.ccmEncounterListDto.ccmServiceTypeId === 8) {
      this.ccmEncounterListDto.duration = 5;
      this.ccmEncounterListDto.note = 'Discussed with other providers office.';
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 12) {
      this.ccmEncounterListDto.duration = 5;
      this.ccmEncounterListDto.note = 'Arranged medical refill.';
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 19) {
      this.ccmEncounterListDto.note = 'Reviewed and uploaded lab results.';
      this.ccmEncounterListDto.duration = 7;
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 35) {
      this.ccmEncounterListDto.note = 'Got preapproval for the patient.';
      this.ccmEncounterListDto.duration = 5;
    } else if (this.ccmEncounterListDto.ccmServiceTypeId === 40) {
      this.ccmEncounterListDto.duration = 5;
      this.ccmEncounterListDto.note = 'Arranged referral for the patient.';
    } else {
      this.ccmEncounterListDto.duration = null;
      this.ccmEncounterListDto.note = '';
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
      this.router.navigate(['/admin/addPatient/' + this.currentPatient.id], {
        queryParams: { setActive: 3 }
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
}
