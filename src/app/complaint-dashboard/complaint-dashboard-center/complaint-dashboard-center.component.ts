import { ComplaintDetailDto, PagedPatientComplaintListDto } from './../../model/AppModels/complaints.model';
import { ComplaintDetailModalComponent } from './../complaint-detail-modal/complaint-detail-modal.component';
import { ComplaintsService } from './../../core/complaints.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import {
  ComplaintForListDto,
  ComplaintsDashboardFilterDto,
} from 'src/app/model/AppModels/complaints.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { CreateFacilityUserDto, FacilityDto } from 'src/app/model/Facility/facility.model';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { ComplaintStatus, DepartmentType } from 'src/app/Enums/complaints.enum';
import { PagingData } from 'src/app/model/AppModels/app.model';
import * as moment from 'moment';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SortOrder } from 'src/app/Enums/filterPatient.enum';
import { Router } from '@angular/router';
import { SmartMeterService } from 'src/app/core/smart-meter.service';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-complaint-dashboard-center',
  templateUrl: './complaint-dashboard-center.component.html',
  styleUrls: ['./complaint-dashboard-center.component.scss'],
})
export class ComplaintDashboardCenterComponent implements OnInit {
  isLoadingPatientOrders: boolean;
  complaintSubTypesList: any;
  tempRow: ComplaintForListDto[];
  timeout: any;
  constructor(
    private complaintService: ComplaintsService,
    private toaster: ToastService,
    private securityService: SecurityService,
    private facilityService: FacilityService,
    private router: Router,
    private smartMeterService: SmartMeterService,
  ) {}
  @ViewChild('complaintDetailModalRef') complaintDetailModalRef: ComplaintDetailModalComponent;
  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent;
  @ViewChild("deviceOrderModal") deviceOrderModal: ModalDirective;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
  };
  public sidenavScroll = {
    axis: "yx",
    theme: "minimal-dark",
    scrollInertia: 0,
    scrollbarPosition: "outside",
    autoHideScrollbar: true,
  };
  searchParam = '';
  rows = [];
  complaintsList = [];
  filterBy= 1;
  createDate: Date;
  gettingDashboadData: boolean;
  filterComplaintsParam = new ComplaintsDashboardFilterDto();
  facilityId: number;
  userList = new Array<CreateFacilityUserDto>();
  // ComplaintTypeEnum = ComplaintType;
  complaintTypesList = [];
  DepartmentTypeEnum = DepartmentType;
  ComplaintStatusEnum = ComplaintStatus;
  row = [];
  pagingData = new PagingData();
  complaintsData = new PagedPatientComplaintListDto();
  facilityList = new Array<FacilityDto>();
  selectedDateRange: any;
  selectedComplaint= new ComplaintDetailDto();
  activeAgingSection = '';
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };
  daterange: {};
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: 'outside',
  };
  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.pagingData.pageSize = 10;
    this.pagingData.pageNumber = 0;
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.facilityId = 0;
    }
    this.getComplaintsList();
    this.getFacilityUserList();
    this.getFaciliesDetailsByUserId();
    this.getComplaintTypes();
    
  }
  getComplaintTypes(){
    this.complaintService.getComplaintTypes().subscribe(
      (res: any) => {
        this.complaintTypesList = res;
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    )
  }
  getComplaintSubTypes(){
    this.complaintSubTypesList = [];
    this.filterComplaintsParam.complaintSubTypeIds = null;
    if(this.filterComplaintsParam.complaintTypeIds){
      this.complaintService.getComplaintsSubTypes(this.filterComplaintsParam.complaintTypeIds).subscribe(
        (res: any) => {
          this.complaintSubTypesList = res;
        }, (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      )
    }
  }
  openDeviceOrderModal(row: ComplaintDetailDto){
  this.selectedComplaint = row;
  this.isLoadingPatientOrders =  true;
  this.smartMeterService.getOrdersListByPatientId(row.patientId).subscribe(
    (res: any) => {
      this.rows = res;
      this.isLoadingPatientOrders = false;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
      this.isLoadingPatientOrders = false;
    }
  )
  this.deviceOrderModal.show();
  }
  addNewDeviceOrder(){
    this.router.navigate(['/rpm/new-device-order'],
    {queryParams: {patient: this.selectedComplaint.patientId, facility: this.selectedComplaint.facilityId}});
  }
  setPage(pageInfo) {
    this.pagingData.pageNumber = pageInfo.offset;
    this.getComplaintsList();
    
  }
  sortCallback(sortInfo) {
    const sortOrder = sortInfo.sorts[0].dir;
    this.filterComplaintsParam.sortBy = sortInfo.sorts[0].prop;
    if (sortOrder === 'asc') {
      this.filterComplaintsParam.sortOrder = SortOrder.Asc;
    }
    if (sortOrder === 'desc') {
      this.filterComplaintsParam.sortOrder = SortOrder.Desc;
    }
    this.pagingData.pageNumber = 0;
    this.getComplaintsList();
  }

  getComplaintsList() {
    this.gettingDashboadData = true;
    this.fillSearchParam();
    this.filterComplaintsParam.pageNumber = this.pagingData.pageNumber + 1;
    this.filterComplaintsParam.pageSize = this.pagingData.pageSize;
    this.filterComplaintsParam.facilityId = this.facilityId;
    if (this.filterComplaintsParam.facilityUserIds.length > 1) {
      this.filterComplaintsParam.facilityUserIds = this.filterComplaintsParam.facilityUserIds.filter(x => x !== 0);
    }
    if (this.filterComplaintsParam.facilityUserIds || this.filterComplaintsParam.facilityUserIds.length) {
      this.filterComplaintsParam.facilityUserIds.filter((x) => {
        if(x == -1){
            this.filterComplaintsParam.facilityUserIds = [-1];
      }})
    }
    if (!this.filterComplaintsParam.facilityUserIds || !this.filterComplaintsParam.facilityUserIds.length) {
      this.filterComplaintsParam.facilityUserIds = [0];
    }
    if(!this.filterComplaintsParam.complaintTypeIds || !this.filterComplaintsParam.complaintTypeIds.length){
      this.filterComplaintsParam.complaintSubTypeIds= '';
    }
    const fPDto = new ComplaintsDashboardFilterDto();
    for (const filterProp in this.filterComplaintsParam) {
      if (
        this.filterComplaintsParam[filterProp] === null ||
        this.filterComplaintsParam[filterProp] === undefined
      ) {
        this.filterComplaintsParam[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    var element = document.getElementById('complainDateField') as HTMLInputElement;
    if (element && element.value) {
      const iVal = element.value;
      const cData = moment().format('MM-DD-YYYY');
      const accuCount = (iVal.match(new RegExp(cData, "g")) || []).length;
      if (accuCount > 1) {
        this.filterComplaintsParam.createdOnFrom = moment().format('YYYY-MM-DD');
        this.filterComplaintsParam.createdOnTo = moment().format('YYYY-MM-DD');
      }
    }
    this.complaintService
      .GetPatientComplaintsForDashboard(this.filterComplaintsParam)
      .subscribe(
        (res: PagedPatientComplaintListDto) => {
          this.pagingData = res.pagingData;
          this.pagingData.pageNumber = this.pagingData.pageNumber - 1;
          this.row = res.complaintsList;
          this.tempRow = res.complaintsList;
          this.complaintsData = res;
          this.gettingDashboadData = false;
        },
        (err: HttpResError) => {
          this.gettingDashboadData = false;
        }
      );
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterComplaintsParam.createdOnFrom = '';
    this.filterComplaintsParam.createdOnTo = '';
    // this.picker.datePicker.setStartDate();
    // this.picker.datePicker.setEndDate();
    this.getComplaintsList();
  }
  selectedDate(value: any, datepicker?: any) {
    // datepicker.start = value.start;
    // datepicker.end = value.end;
    this.filterComplaintsParam.createdOnFrom = value.start.format('YYYY-MM-DD');
    this.filterComplaintsParam.createdOnTo = value.end.format('YYYY-MM-DD');
    // this.daterange.label = value.label;
    this.getComplaintsList();
  }
  ApplyAgingFilter(daysCount: number, statusTyp: number) {
    this.filterComplaintsParam.pageNumber = 1;
    const durationType = this.activeAgingSection.split('-')[2];
    const statusType = this.activeAgingSection.split('-')[1];
    if (statusType === 'one') {
      if (statusTyp === 0) {
        this.filterComplaintsParam.complaintStatus = 0;
      } else if (statusTyp === 1) {
        // this.filterComplaintsParam.complaintStatus = ComplaintStatus['In Process'];
        this.filterComplaintsParam.complaintStatus = -1;
      } else if (statusTyp === 2) {
        this.filterComplaintsParam.complaintStatus = ComplaintStatus.Closed;
      }
    }
    if (statusType === 'two') {
      this.filterComplaintsParam.complaintStatus = ComplaintStatus.Closed;
    }
    if (daysCount === -1) {
      this.clearDate();
      return;
    }
    this.filterComplaintsParam.createdOnFrom = moment().subtract(daysCount, 'days').format('YYYY-MM-DD');
    this.filterComplaintsParam.createdOnTo = moment().format('YYYY-MM-DD');
    this.updateDateRange();
    this.getComplaintsList();
  }
  public updateDateRange() {
    this.picker.datePicker.setStartDate(moment(this.filterComplaintsParam.createdOnFrom, 'YYYY-MM-DD').format('MM-DD-YYYY'));
    this.picker.datePicker.setEndDate(moment(this.filterComplaintsParam.createdOnTo, 'YYYY-MM-DD').format('MM-DD-YYYY'));
}
  getFacilityUserList() {
    this.facilityService
      .getFacilityUserList(this.facilityId, )
      .subscribe((res: any) => {
        this.userList = res;
      });
  }
  getFaciliesDetailsByUserId() {
    this.facilityService
      .getFacilityList()
      .subscribe(
        (res: any) => {
          if (res) {
            this.facilityList = res;
            // console.log(this.facilityList)
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          // console.log(error);
        }
      );
  }
  // getPatientComplaintList() {
  //   this.complaintService
  //     .GetPatientComplaintsForDashboard(this.filterComplaintsParam)
  //     .subscribe(
  //       (res: any) => {
  //         this.row = res.complaintsList;
  //         console.log(this.row)
  //         this.gettingDashboadData = false;
  //       },
  //       (err: HttpResError) => {
  //         this.gettingDashboadData = false;
  //       }
  //     );
  // }
  showComplaintDetail(cData: ComplaintForListDto) {
    this.complaintDetailModalRef.OpenDetailModal(cData);
  }

  getComplaintsListExcelFile(){

    this.complaintService.getComplaintsListExcelFile(this.filterComplaintsParam).subscribe((res: any) => {
      // FileSaver.saveAs(new Blob([res] , { type: 'application/csv' } ), `ProductivityReport.csv`);
      FileSaver.saveAs(new Blob([res] , { type: 'application/csv' } ), 'ComplaintList.csv');
      // this.isDownloadingExcelFile = false;
    },
    (error: HttpResError) => {
      this.toaster.error(error.error, error.message);
    })
  }
  fillSearchParam(){
    if(this.filterBy == 1){
      this.filterComplaintsParam.ticketNumber = this.searchParam;
      this.filterComplaintsParam.phoneNo = '';
      this.filterComplaintsParam.nameAndEMRID = '';
      this.filterComplaintsParam.dOB = '';
    }
    if(this.filterBy == 2){
      this.filterComplaintsParam.ticketNumber = ''
      this.filterComplaintsParam.phoneNo = '';
      this.filterComplaintsParam.nameAndEMRID = this.searchParam;
      this.filterComplaintsParam.dOB = '';
    }
    if(this.filterBy == 3){
      this.filterComplaintsParam.ticketNumber = ''
      this.filterComplaintsParam.phoneNo = '';
      this.filterComplaintsParam.nameAndEMRID = '';
      this.filterComplaintsParam.dOB = this.searchParam;
    }
    if(this.filterBy == 4){
      this.filterComplaintsParam.ticketNumber = ''
      this.filterComplaintsParam.phoneNo = this.searchParam.replace(/-/g, "");
      this.searchParam = this.filterComplaintsParam.phoneNo;
      this.filterComplaintsParam.nameAndEMRID = '';
      this.filterComplaintsParam.dOB = '';
    }
    
  }
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }
  
}
