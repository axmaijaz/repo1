import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { Subject, fromEvent } from 'rxjs';
import { SubSink } from 'src/app/SubSink';
import { DataTableDirective } from 'angular-datatables';
import { debounceTime, map } from 'rxjs/operators';
import { IMyOptions, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import moment from 'moment';
import { AWPhysiciantabEncounterDto, AWVDashboardData, AwPatientListDto, FilterAwPatientsDto, HRACallStatus, SendAWToPatientDto } from 'src/app/model/AnnualWellness/aw.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppDataService } from 'src/app/core/app-data.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { StatementManagementService } from 'src/app/core/statement-management.service';
import { PatientActieServicesDto, PatientDto } from 'src/app/model/Patient/patient.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { CloseEncounterDto, GapStatus, MeasureDto, PcmEncounterStatus, PcmEncounterType, PcmMeasureDataObj } from 'src/app/model/pcm/pcm.model';
import { ChatViewType } from 'src/app/model/chat/chat.model';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { PatinetCommunicationGroup } from 'src/app/model/PatientEngagement/communication.model';
import { RpmPatientsListDto } from 'src/app/model/rpm.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { enumToArray } from 'src/app/shared-functions/enumFunction';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { PatientGapDetailComponent } from 'src/app/admin/patient/patient-details/patient-detail/patient-gap-detail/patient-gap-detail.component';
import { environment } from 'src/environments/environment';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { tcmStatus2Enum } from 'src/app/model/Tcm/tcm.enum';

@Component({
  selector: 'app-annual-wellness-dashboard',
  templateUrl: './annual-wellness-dashboard.component.html',
  styleUrls: ['./annual-wellness-dashboard.component.scss']
})
export class AnnualWellnessDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("gapDetailRef") gapDetailRef: PatientGapDetailComponent;
  @ViewChild("clickOnRow") clickOnRow: ModalDirective;
  mouseOverIntervalRef = {};
  mrTooltipOverRef = {};
  dueGapsList: MeasureDto[];
  PcmEncounterStatus = PcmEncounterStatus;
  patientActieServicesDto = new PatientActieServicesDto();
  HRACallStatus = HRACallStatus;
  gapStatusEnum = GapStatus;
  HRACallStatusList = enumToArray(HRACallStatus);
  CareProvidersList = new Array<CreateFacilityUserDto>();
  dtTrigger = new Subject<any>();
  private subs = new SubSink();
  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};
  selected: any[];
  table = $('#awvPatients').DataTable();

  closePcmEncounterObj = new CloseEncounterDto();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    closeAfterSelect: true,
    dateFormat: "yyyy-mm-dd",
  };
  filterPatientDto = new FilterAwPatientsDto();
  AWVDashboardObj = new AWVDashboardData();
  filters: string;
  rows: AwPatientListDto[] = [];
  selectedRow = new AwPatientListDto()

  pagingData = new PagingData();
  isLoading: boolean;
  loadingOnStart = true;
  facilityId: number;
  gettingSummaryData: boolean;
  forRerendertable = true;
  gettingDueGaps= false;
  rowId: number;
  isServiceLoad= false;
  isCreatingAWEncounter: boolean;
  closingEncounter: boolean;
  selectedEncounter: AwPatientListDto;
  saveHraStatus: boolean;
  currentCode: string;
  pcmModelLoading: boolean;
  pcmMOdelData: PcmMeasureDataObj;
  sendToPatienTDto = new SendAWToPatientDto();
  sendingToPatient: boolean;
  countryCallingCode: null;
  FilterText: string;

  constructor(private toaster: ToastService, public securityService: SecurityService,
    private statementManagementService: StatementManagementService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private awService: AwService,
    private appData: AppDataService,private eventBus: EventBusService,
    private pcmService: PcmService,
    private facilityService: FacilityService,private patientsService: PatientsService,
    private router: Router,
    private filterDataService: DataFilterService, private ccmService: CcmDataService,) { }
    public datePickerConfig1: IDatePickerConfig = {
      allowMultiSelect: false,
      returnedValueType: ECalendarValue.StringArr,
      format: 'YYYY-MM-DD',
      disableKeypress: true,
      appendTo: 'body'
    };
  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
    this.initializeDataTable();
    this.dtTrigger.next();
    this.dtTrigger["new"] = new Subject<any>();
    this.filters = this.route.snapshot.queryParamMap.get("filters");
    this.GetAWDashboardData();
    this.getCareProviders();
    if (this.filters) {
      if (this.statementManagementService.IsSetDataTable) {
        this.table.state = this.statementManagementService.setTableData;
        // this.filterPatients();
      } else {
        localStorage.removeItem("DataTables_" + window.location.pathname);
      }
      // this.filterPatientDto = this.statementManagementService.filterPatientData;
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
  }
  ngAfterViewInit() {
    this.dtTrigger.next();
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.subs.unsubscribe();
  }
  filterPatients() {
    if (this.FilterText == this.filterPatientDto.FilterText) {
      this.filterPatientDto.FilterText = ''
      this.FilterText = ''
    } else {
      this.FilterText = this.filterPatientDto.FilterText;
    }
    this.rerender();
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
          'DataTables_Awv' + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem('DataTables_Awv' + window.location.pathname)
        );
      },
      responsive: true,
      processing: false,
      autoWidth: true,
      searching: false,
      paging: true,
      select: true,
      pageLength: 10,
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
        if (dataTablesParameters.start === 1) {
          dataTablesParameters.start = 0;
        }
        if (this.filters) {
          // this.filterPatientDto.PageSize = dataTablesParameters.length;
          // this.filterPatientDto.rowIndex =
          //   this.statementManagementService.filterPatientData.rowIndex;
          this.filterPatientDto.PageNumber =
            this.statementManagementService.filterPatientData.PageNumber;
          this.filterPatientDto.PageSize =
            this.statementManagementService.filterPatientData.PageSize;
          this.filters = "";
        } else {
          if (dataTablesParameters.start === 1) {
            dataTablesParameters.start = 0;
          }
          // this.filterPatientDto.rowIndex = dataTablesParameters.start;
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
          dataTablesParameters.draw > 1 &&
          dataTablesParameters.order.length > 0
        ) {
          const findFilterColumn = dataTablesParameters.columns.filter(
            (res) => {
              return res.data === dataTablesParameters.order[0].column;
            }
          );
          this.filterPatientDto.SortBy = findFilterColumn[0].name;
          if (dataTablesParameters.order[0].dir === "asc") {
            this.filterPatientDto.SortOrder = 0;
          }
          if (dataTablesParameters.order[0].dir === "desc") {
            this.filterPatientDto.SortOrder = 1;
          }
        }
        this.filterPatientDto.FacilityId = this.facilityId
        this.loadingOnStart = false;
        this.awService
          .GetAWPatients(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              // this.loadingOnStart = false;
              res.results.forEach((element) => {
                // if (element.dateAssigned) {
                //   element.dateAssigned = moment(
                //     element.dateAssigned,
                //     'YYYY-MM-DD'
                //   ).format('YYYY-MM-DD');
                // }
              });
              this.isLoading = false;
              this.selected = [];
              this.rows = new Array<AwPatientListDto>();
              res.results.forEach((patient: PatientDto) => {

              });
              this.rows = res.results;
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
        { name: 'checkBox' },
        { name: 'id' },
        { name: 'FirstName' },
        { name: 'Chat' },
        { name: 'AwGapStatus' },
        { name: 'Status' },
        { name: 'HRA' },
        { name: 'HRACallStatus' },
        { name: 'AWVCompletionDate' },
        { name: 'ScheduleVisit' },
        { name: 'LastOfficeVisit' }
      ],
    };
    this.dtTrigger.next();
  }
  async onClickRow(row: AwPatientListDto, event: MouseEvent) {
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
    this.filterDataService.routeState = this.router.url;
    this.ApplyNavigation("/admin/patient/" + row.patientId, event.ctrlKey);
    // if (row.profileStatus) {
    //   // this.router.navigate(['/admin/patient/', row.id]);
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
  GetAWDashboardData() {
    this.gettingSummaryData = true;
    this.subs.sink = this.awService
      .GetAWDashboardData(this.facilityId)
      .subscribe(
        (res: AWVDashboardData) => {
          this.AWVDashboardObj = res
          this.gettingSummaryData = false;
        },
        (err: HttpResError) => {
          this.gettingSummaryData = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getChatGroup(patient: PatientDto, viewMode?: ChatViewType) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenCommunicationModal;
    const chatGroup = new PatinetCommunicationGroup();
    chatGroup.id = patient.patientId;
    chatGroup.name = `${patient.fullName}`;
    chatGroup.lastCommunication = null
    event.value = chatGroup;
    this.eventBus.emit(event);
  }
  openComplaintsModal(data: RpmPatientsListDto) {
    data['id'] = data.patientId;
    const event = new EmitEvent();
    event.name = EventTypes.openComplaintsModal;
    event.value = data;
    this.eventBus.emit(event);
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
  openAddTaskModal(addPTaskRef, row){
    addPTaskRef.CareProvidersList=this.CareProvidersList;
    row['id'] = row.patientId;
    addPTaskRef.OpenTaskViewModal(row);
  }
  openPatientNote(row) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenPatientNote;
    event.value = row.patientId;
    this.eventBus.emit(event);
  }
  GetPatientDueCareGaps(row: PatientDto, modal: ModalDirective) {
    if (!row.dueGapsCount || row.dueGapsCount < 1) {
      this.toaster.success("No due gaps found.");
      return;
    }
    this.dueGapsList = [];
    modal.show();
    this.gettingDueGaps = true;
    this.subs.sink = this.pcmService.GetPatientsDueGaps(row.patientId).subscribe(
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
  ProceedNavigation(item: AwPatientListDto) {
    this.router.navigateByUrl(`/annualWellness/AWMain/${item.patientId}/${item.awEncounterId}/awPatient`);
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
  clearMouseInterval(pId: number) {
    this.mouseOverIntervalRef[pId] = "";
  }
  AddAWEncounter(item: AwPatientListDto) {
    this.isCreatingAWEncounter = true;
    this.awService.AddAWEncounter(item.patientId).subscribe((res: number) => {
      this.isCreatingAWEncounter = false;
      this.router.navigateByUrl(`/annualWellness/AWMain/${item.patientId}/${res}/awPatient`);
    },
    (err: HttpResError) => {
      this.isCreatingAWEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  ClosePcmEncounter(modal: ModalDirective) {
    this.closingEncounter = true;
    this.closePcmEncounterObj.id = this.selectedEncounter.awEncounterId;
    this.closePcmEncounterObj.measure = 'AW';
    this.closePcmEncounterObj.encounterType = PcmEncounterType['Annuall Wellness'];
    this.awService.ClosePcmEncounter(this.closePcmEncounterObj).subscribe((res: any) => {
      this.closingEncounter = false;
      this.selectedEncounter.awEncounterStatus = this.closePcmEncounterObj.status
      this.toaster.success('Encounter closed successfully');
      modal.hide();
    },
    (err: HttpResError) => {
      this.closingEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  UpdateHRACallStatus(item: AwPatientListDto) {
    this.saveHraStatus = true;
    let newNote = `Date: ${moment().format("MMM DD, YYYY")} Status: ${HRACallStatus[item.hraStatus]} \nNote: ${item.hraNote}`
    if (item.hraCallLogHistory) {
      newNote = item.hraCallLogHistory + '\n' + newNote
    }
    this.awService.UpdateHRACallStatus(item.awEncounterId, item.hraStatus, newNote).subscribe((res: any) => {
      this.saveHraStatus = false;
      item.hraCallStatus = item.hraStatus
      item.hraStatus = null;
      item.hraNote = "";
      item.hraCallLogHistory = newNote
      this.GetAWDashboardData();
    },
    (err: HttpResError) => {
      this.saveHraStatus = false;
      this.toaster.error(err.error, err.message);
    });
  }
  changeEncounterdate(event, item: AwPatientListDto) {
    if (event.date) {
      const day = moment(event.date).format('YYYY-MM-DD');
      this.UpdateEncounterDate(item, day)
    }

  }
  UpdateEncounterDate(item: AwPatientListDto, nDate: string) {
    this.awService.UpdateEncounterDate(item.awEncounterId, nDate).subscribe(
      (res) => {
        item.encounterDate = nDate;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  changeVisitDate(event, item: AwPatientListDto) {
    if (event.date) {
      const day = moment(event.date).format('YYYY-MM-DD');
      this.UpdateAWVisitScheduleDate(item, day)
      this.GetAWDashboardData();
    }
  }
  changeLastOfficeVisitDate(event, item: AwPatientListDto){
    if (event.date) {
      const day = moment(event.date).format('YYYY-MM-DD');
      this.updateFollowUpDate(item, day)
    }
  }
  updateFollowUpDate(item, day){
    var followUpDataObj = {
      patientId: 0,
      followUpDate: '',
      recentPcpAppointment: '',
      recentHospitalizationDate: '',
      lastTcmStatus: tcmStatus2Enum,
      lastTcmEncounterId: 0,
    }
    followUpDataObj.recentPcpAppointment = day;
    followUpDataObj.patientId = item.patientId;
    this.ccmService
    .changefollowUpDate(followUpDataObj)
    .subscribe(
      (res) => {
        this.toaster.success('Data Updated Successfully');
        item.recentPcpAppointmentDate = day
      },
      (err) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  UpdateAWVisitScheduleDate(item: AwPatientListDto, nDate: string) {
    this.awService.UpdateAWVisitScheduleDate(item.awEncounterId, nDate).subscribe(
      (res) => {
        item.awVisitScheduleDate = nDate;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  gapModelOpenFromOtherComponent(item: AwPatientListDto) {
    this.gapDetailRef.PatientId = item.patientId;
    this.gapDetailRef.getMeasureDataByCode("AW", this.gapDetailRef.pcmMOdel);
  }
  ResetSentPatient() {
    this.sendToPatienTDto = new SendAWToPatientDto();
  }
  SendToPatient(modal: ModalDirective) {
    this.sendingToPatient = true;
    const phoneNumberWithCountryCallingCode =  1 + this.sendToPatienTDto.phoneNo;
    this.sendToPatienTDto.phoneNo = phoneNumberWithCountryCallingCode;
    this.sendToPatienTDto.awEncounterId = this.selectedRow.awEncounterId;
    let url = '';
    //  url = "http://localhost:4200/teleCare/vCall";
    if (environment.production === true) {
      url = `https://app.2chealthsolutions.com/awForm/awPatient/${this.selectedRow.patientId}/${this.selectedRow.awEncounterId}`;
    } else {
      url = `${environment.appUrl}awForm/awPatient/${this.selectedRow.patientId}/${this.selectedRow.awEncounterId}`;
    }
    this.sendToPatienTDto.urlLink = url;
    this.awService.SendToPatient(this.sendToPatienTDto).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      modal.hide();
      this.sendToPatienTDto = new SendAWToPatientDto();
      this.countryCallingCode = null;
      this.sendingToPatient = false;
    },
      (err: HttpResError) => {
        this.sendingToPatient = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
}
