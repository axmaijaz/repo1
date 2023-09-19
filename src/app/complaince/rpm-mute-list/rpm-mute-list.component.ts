import { AppUiService } from 'src/app/core/app-ui.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { RpmComplainceService } from 'src/app/core/rpm-complaince.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto, PagingData } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RpmComplainceEditDto, RPMComplainceListDto } from 'src/app/model/rpmComplaince.model';
import moment from 'moment';

@Component({
  selector: 'app-rpm-mute-list',
  templateUrl: './rpm-mute-list.component.html',
  styleUrls: ['./rpm-mute-list.component.scss']
})
export class RpmMuteListComponent implements OnInit {
  LoadingMuteList: boolean;
  facilityList: any;
  facilityId: number;
  isLoading: boolean;
  patientMuteList: RPMComplainceListDto[] = [];
  patientMuteListPre: RPMComplainceListDto[] = [];
  displayList = new Array<RPMComplainceListDto>();
  showAll = false;
  pagesArr: number[] = [];
  pagingData = new PagingData();
  searchStr: string;
  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
    appendTo: 'body',
    disableKeypress: true
  };
  MutePatientDto = new RpmComplainceEditDto();
  mutingPatient: boolean;
  unmuting: boolean;
  constructor(private facilityService: FacilityService, private securityService: SecurityService, private toaster: ToastService,
    private rpmComplaince: RpmComplainceService,  private appUi: AppUiService) { }
    public options: any = {
      locale: { format: 'DD-MMM-YYYY',
      cancelLabel: 'Clear',
      // displayFormat: 'DD-MM-YYYY'
    },
      alwaysShowCalendars: false,
    };
  ngOnInit(): void {
    this.getFacilityList();
  }
  getFacilityList() {
    this.isLoading = true;
    this.LoadingMuteList = true;
    this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
        if ( this.facilityList &&  this.facilityList.length) {
          this.facilityId = this.facilityList[0].id;
          this.GetMuteListPatients();
        } else {
          this.LoadingMuteList = false;
        }
        this.isLoading = false;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetMuteListPatients() {
    this.LoadingMuteList = true;
    this.rpmComplaince.GetPatientsMuteList(this.facilityId, this.showAll).subscribe(
      (res: any) => {
        this.patientMuteList = res || [];
        this.patientMuteListPre = res || [];
        this.InitializePaging();
        this.LoadingMuteList = false;
      },
      (error: HttpResError) => {
        this.LoadingMuteList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenMuteModal(basicModalForDate: ModalDirective, item: RPMComplainceListDto) {
    this.MutePatientDto = new RpmComplainceEditDto();
    this.MutePatientDto.muteFrom = moment().format('MM-DD-YYYY');
    this.MutePatientDto.patientId = item.patientId;
    basicModalForDate.show();
  }
  MutePatient(basicModalForDate: ModalDirective) {
    this.mutingPatient = true;
    this.rpmComplaince.AddPatientToMuteList(this.MutePatientDto).subscribe(
      (res: any) => {
        basicModalForDate.hide();
        this.mutingPatient = false;
        if (res) {
          let findPt = this.patientMuteList.find(x => x.patientId === this.MutePatientDto.patientId);
          let findPt1 = this.displayList.find(x => x.patientId === this.MutePatientDto.patientId);
          Object.assign(findPt, res);
          Object.assign(findPt1, res);
          // findPt = res;
          // findPt1 = res;
        }
      },
      (error: HttpResError) => {
        this.mutingPatient = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenConfirmUnMuteModal(item: RPMComplainceListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Unmute Patient";
    modalDto.Text = "Are you sure that you want to unmute this patient";
    modalDto.callBack = this.RemovePatientFromMuteList;
    modalDto.data = item;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  RemovePatientFromMuteList = (item: RPMComplainceListDto) => {
    this.unmuting = true;
    this.rpmComplaince.RemovePatientFromMuteList(item.patientId).subscribe(
      (res: any) => {
        this.unmuting = false;
        if (res) {
          let findPt = this.patientMuteList.find(x => x.patientId === this.MutePatientDto.patientId);
          let findPt1 = this.displayList.find(x => x.patientId === this.MutePatientDto.patientId);
          Object.assign(findPt, res);
          Object.assign(findPt1, res);
        }
      },
      (error: HttpResError) => {
        this.unmuting = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  InitializePaging() {
    this.patientMuteList = [...this.patientMuteListPre];
    if (this.searchStr) {
      this.patientMuteList = this.patientMuteListPre.filter(x => x.patientName.toLocaleLowerCase().includes(this.searchStr.toLocaleLowerCase()));
    }
    this.pagesArr = [];
    this.pagingData.elementsCount = this.patientMuteList.length
    this.pagingData.pageNumber = 1;
    this.pagingData.pageSize = this.pagingData.pageSize || 10;
    this.pagingData.pageCount = Math.ceil(this.pagingData.elementsCount / this.pagingData.pageSize);
    for (let index = 1; index <= this.pagingData.pageCount; index++) {
      this.pagesArr.push(index);
    }
    this.ApplyPageFilter();
  }
  ApplyPageFilter() {
    this.displayList = [];
    for (var i = (this.pagingData.pageNumber -1 ) * this.pagingData.pageSize; i < (this.pagingData.pageNumber * this.pagingData.pageSize); i++) {
      const obj = this.patientMuteList[i];
      if (obj) {
        obj['index'] = i + 1;
        this.displayList.push(obj);
      }
    }
  }
}
