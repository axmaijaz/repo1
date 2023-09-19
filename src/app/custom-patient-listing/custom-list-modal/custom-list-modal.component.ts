import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CustomeListService } from 'src/app/core/custome-list.service';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { HomeService } from 'src/app/core/home.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AddEditCustomListDto, AssignPatientsToCustomListDto, ColumnDto } from 'src/app/model/custome-list.model';
import { LandingPageParamsDto } from 'src/app/model/home.model';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-custom-list-modal',
  templateUrl: './custom-list-modal.component.html',
  styleUrls: ['./custom-list-modal.component.scss']
})
export class CustomListModalComponent implements OnInit, AfterViewInit, OnDestroy {
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };
  isAddListLoading = false;
  listOfColumns = new Array<ColumnDto>();
  // tempListOfColumns = new Array<ColumnDto>();
  columnsName = new Array<string>();
  facilityUserId = 0;
  addEditCustomListDto = new AddEditCustomListDto();
  CustomListDto = new Array<AddEditCustomListDto>();
  filterPatientDto = new LandingPageParamsDto();
  @ViewChild('customListModal') customListModal: ModalDirective;
  rows = new Array<PatientDto>();
  gridCheckAll: boolean = false;
  selected = new Array<PatientDto>();
  facilityId: number;
  private subs = new SubSink();
  currentUser: AppUserAuth = null;
  isLoading: boolean;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  @ViewChild('searchPatient') searchPatient: ElementRef;
  slectedListId: number;
  tempCustomId = 0;

  public sidenavScroll = {
    axis: "yx",
    theme: "minimal-dark",
    scrollInertia: 0,
    scrollbarPosition: "outside",
    autoHideScrollbar: true,
  };
  loadingListData: boolean;
  removeAblePatientsCount = 0;

  constructor(private customListService: CustomeListService, private toaster: ToastService,
    private patientsService: PatientsService, private homeService: HomeService,
    private securityService: SecurityService,private eventBus: EventBusService,) { }

  ngOnInit() {
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.facilityUserId = this.securityService.securityObject.id;
      this.getCustomListColums();
      this.eventBus.on(EventTypes.CustomListModal).subscribe((res) => {
        this.selected = [];
        this.gridCheckAll = false;
        this.removeAblePatientsCount = 0;
        Object.assign(this.addEditCustomListDto , res);
        this.filterPatientDto = new LandingPageParamsDto();
        if (res) {
          this.getCustomListDataById();
          this.getSelectedColumns(res);
        } else {
          this.resetModal();
          this.customListModal.show();
        }
      });
    }
  }
  EmitEventForRefreshCustomList() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.RefreshCustomList;
    if (this.tempCustomId == 0) {
      event.value = true;
    } else {
      event.value = '';
    }
    this.eventBus.emit(event);
    this.tempCustomId = 0;
  }
  ngAfterViewInit() {
    this.subs.sink = fromEvent(this.searchPatient.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        if (this.filterPatientDto.searchParam) {
          this.getFilterPatientsList2();
        }
      });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  AddPatientsToList(id: number) {
    // this.isLoadingPayersList = true;

    this.addPatientInCustmListDto.patientIds = new Array<number>();
    this.addPatientInCustmListDto.customListIds = [id];
    this.tempCustomId = this.addEditCustomListDto.id;
    
    this.addPatientInCustmListDto.patientIds = this.selected.filter(x => !x.checked).map(x => x.id);
    this.customListService.AddPatientsToList(this.addPatientInCustmListDto, true).subscribe(
      (res) => {
        // this.EmitEventForRefreshCustomList();
        this.EmitEventForRefreshCustomList();
        this.toaster.success('Data Saved Successfully');
      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  getCustomListColums() {
    // this.isLoadingPayersList = true;
    this.customListService.GetCustomListColums().subscribe(
      (res: ColumnDto[]) => {
        if (res.length > 0) {
          res.forEach(element => {
            element.check = false;
          });
          // this.tempListOfColumns = [...res];
          this.listOfColumns = res;
        }
      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
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
  getCustomListDataById() {
    this.loadingListData = true;
    this.customListService.GetCustomListData(this.addEditCustomListDto.id).subscribe(
      (res: any) => {
       this.selected = res.customListDataDto;
       this.loadingListData = false;
      },
      (error: HttpResError) => {
        this.loadingListData = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFilterPatientsList2() {
    const fPDto = new FilterPatient();
    this.rows = [];
    this.gridCheckAll = false;
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.isLoading = true;
    // this.isLoadingPayersList = true;
    this.filterPatientDto.facilityId = this.facilityId;
    this.homeService.GetPatientsForDashboard(this.filterPatientDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.rows = res.patientsList;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  ItemSelected(item: PatientDto) {
    const alreadyExist = this.selected?.find(x => x.id === item.id)
    if (!alreadyExist) {
      this.selected.push(item);
    }
    this.rows = [];
  }
  deActiveColumns() {
    this.listOfColumns.forEach(element => {
      element.check = false;
    });
  }
  getSelectedColumns(item: AddEditCustomListDto) {
    this.slectedListId = item.id;
    this.customListModal.show();
    this.resetModal();
    Object.assign(this.addEditCustomListDto , item);
    // this.addEditCustomListDto = item;
   var columns = item.columnsList.split(',');
   columns.forEach(element => {
     this.listOfColumns.forEach(col => {
      if (col.name === element) {
        col.check = true;
        this.columnsName.push(col.name);
      }
     });
   });

  }
  selectColumns(column: ColumnDto) {
    column.check = !column.check;
    if (column.check) {
      this.columnsName.push(column.name);
    } else {
      this.columnsName = this.columnsName.filter(res => {
        return res !== column.name;
      });
    }
  }
  addEditCustomList() {
    this.isAddListLoading = true;
    this.addEditCustomListDto.columnsList = this.columnsName.join();
    this.addEditCustomListDto.facilityUserId = this.facilityUserId;
    this.customListService.AddEditCustomList(this.addEditCustomListDto).subscribe(
      (res: any) => {
        // this.GetCustomListsByFacilityUserId();
        this.customListModal.hide();
        if (this.selected?.length > 0) {
          this.AddPatientsToList(res.id);
        } else {
          this.EmitEventForRefreshCustomList();
        }
        this.addEditCustomListDto = new AddEditCustomListDto();
        this.columnsName = [];
        this.isAddListLoading = false;
      },
      (error: HttpResError) => {
        this.isAddListLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  gridAllRowsCheckBoxChecked = (e) => {
    this.selected.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    setTimeout(() => {
      this.removeAblePatientsCount = this.selected.filter((x) => x.checked)?.length || 0;
    }, 500);
  }

  rowCheckBoxChecked = () => {
    setTimeout(() => {
      this.removeAblePatientsCount = this.selected.filter((x) => x.checked)?.length || 0;
    }, 100);
  }

  resetModal() {
    this.addEditCustomListDto = new AddEditCustomListDto();
    this.columnsName = [];
    this.selected = [];
    this.deActiveColumns();
  }

}
