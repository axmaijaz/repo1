import { AwService } from 'src/app/core/annualWellness/aw.service';
import { FacilityService } from './../../core/facility/facility.service';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AWpendingEncounter, EncounterObjectList, EncounterTypes, FilteredEncountersDto } from 'src/app/model/ManageEncounters/manageEncounter.model';
import moment from 'moment';
import FileSaver from 'file-saver';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SubSink } from 'src/app/SubSink';
@Component({
  selector: 'app-pending-encounters-list',
  templateUrl: './pending-encounters-list.component.html',
  styleUrls: ['./pending-encounters-list.component.scss']
})
export class PendingEncountersListComponent implements OnInit {
  encountersObj = new EncounterObjectList();
  activeSec = 1;
  filteredEncountersDto = new FilteredEncountersDto();
  @ViewChild("searchPatient") searchPatient: ElementRef;
  pendingEncountersList = new Array<AWpendingEncounter>();
  isLoading = true;
  public scrollbarOptionsTabs = {
    axis: 'x',
    theme: 'dark-thin',
    live: 'on',
    autoHideScrollbar: true,
    scrollbarPosition: 'outside'
    // autoExpandScrollbar: true

  };
  daterange: any = {};
  selectedDateRange: any;
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };
  facilityUsersList = [];
  PageSize = 25;
  facilityId: number;
  rowId: number;
  @ViewChild('clickOnRow') clickOnRow: ModalDirective;
  isLoadingPayersList: boolean;
  isExcelLoading: boolean;
  private subs = new SubSink();
  constructor(private location: Location, private securityService: SecurityService, private router: Router,private awService: AwService,
    private patientService: PatientsService, private toaster: ToastService, private facilityService: FacilityService) { }

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.GetPendingEncountersForSignature();
    this.getFacilityUsers();
  }
  ngAfterViewInit() {
    this.subs.sink = fromEvent(this.searchPatient.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        this.GetPendingEncountersForSignature();
      });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
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
  GetPendingEncounterListExcelFile() {
    // let roleName = "PRCM Care Manager";
    this.isExcelLoading = true;
    this.awService.GetPendingEncounterListExcelFile(this.filteredEncountersDto).subscribe(
      (res: any) => {
        this.isExcelLoading = false;
          FileSaver.saveAs(new Blob([res] , { type: 'application/csv' } ), `EncountersList.csv`);
      },
      (error: HttpResError) => {
        this.isExcelLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetPendingEncountersForSignature() {
    this.filteredEncountersDto.facilityId = this.facilityId;
    this.nullValueChecking();
    this.isLoading = true;
    this.patientService.GetPendingEncountersForSignature(this.filteredEncountersDto).subscribe(
      (res: any) => {
        if (res) {
          this.encountersObj = res;
          // this.activeSec=1;
          this.pendingEncountersList = this.encountersObj.aWpendingEncounter;
          this.DateTimeFormating();
        }
        this.isLoading = false;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  nullValueChecking() {
    const fPDto = new FilteredEncountersDto();
    for (const filterProp in this.filteredEncountersDto) {
      if (
        this.filteredEncountersDto[filterProp] === null ||
        this.filteredEncountersDto[filterProp] === undefined
      ) {
        this.filteredEncountersDto[filterProp] = fPDto[filterProp];
        // this.filteredEncountersDto[filterProp] = 0;
      }
    }
  }
  selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.filteredEncountersDto.dateAssignedFrom = value.start.format('YYYY-MM-DD');
    this.filteredEncountersDto.dateAssignedTo = value.end.format('YYYY-MM-DD');
    this.daterange.label = value.label;
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filteredEncountersDto.dateAssignedFrom = '';
    this.filteredEncountersDto.dateAssignedTo = '';
  }
  DateTimeFormating() {
    this.pendingEncountersList.forEach(item => {
      if (item.updatedOn) {
        item.updatedOn = moment.utc(item.updatedOn).local().format('MMM-DD-YYYY');
      }
      if (item.createdOn) {
        item.createdOn = moment.utc(item.createdOn).local().format('MMM-DD-YYYY');
      }
      if (item.encounterDate) {
        item.encounterDate = moment.utc(item.encounterDate).local().format('MMM-DD-YYYY');
      }
    });
  }
  onClickRow(row: AWpendingEncounter) {
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.patientId;
    if (row.profileStatus) {
      this.router.navigate(['/admin/patient/', row.patientId]);
    } else {
      this.clickOnRow.show();
    }
  }
  addRequiredData() {
    // this.router.navigateByUrl('/admin/addPatient/'+ this.rowId, {state: {filters:this.filterPatientDto}});
    this.router.navigate(['/admin/addPatient/' + this.rowId]);
  }
  navigateBack() {
    this.location.back();
  }
  loadData(prop: string) {
    this.isLoading = true;
    this.pendingEncountersList = this.encountersObj[prop];
    this.DateTimeFormating();
    this.isLoading = false;
  }
  ProceedNavigation(item: AWpendingEncounter) {
    if (item.type === EncounterTypes.aw) {
      this.router.navigateByUrl(`/annualWellness/AWMain/${item.patientId}/${item.typeId}/awPatient`);
      return;
    }
    if (item.type === EncounterTypes.alcoholScreening) {
        this.router.navigateByUrl(`/pcm/pcmAlcohol/${item.patientId}/alcoholScreening/${item.typeId}`);
    }
    if (item.type === EncounterTypes.depressionScreening) {
      this.router.navigateByUrl(`/pcm/pcmDepression/${item.patientId}/depressionScreening/${item.typeId}`);
    }
    if (item.type === EncounterTypes.counselling) {
      this.router.navigateByUrl(`/pcm/gPcm/${item.patientId}/Counselling/${item.typeId}`);
    }
    if (item.type === EncounterTypes.tcm) {
      this.router.navigateByUrl(`/tcm/dischargeOverview/${item.patientId}/${item.typeId}`);
    }
  }
}
