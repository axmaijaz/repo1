import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SubSink } from 'src/app/SubSink';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { AppAdminDto } from 'src/app/core/administration.model';
import { AppAdminService } from 'src/app/core/administration/app-admin.service';
import { ClonerService } from 'src/app/core/cloner.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { DeviceManagementService } from 'src/app/core/device-management.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { DeviceRequestDetailDto, DeviceRequestListDto, DeviceRequestStatus, FilterDeviceRequestDto, ModalityDetailDto, RPMInventoryListDto, RpmPHDeviceListDto } from 'src/app/model/Inventory/rpm-inventory.model';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SaleTypeEnum } from 'src/app/model/rpm/phdevice-pricing.model';
import { SaleDeviceComponent } from '../sale-device/sale-device.component';
import { PHDeviceStatus } from 'src/app/Enums/phDevice.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-device-request-list',
  templateUrl: './device-request-list.component.html',
  styleUrls: ['./device-request-list.component.scss']
})
export class DeviceRequestListComponent implements OnInit {
  gettingDeviceRequests: boolean;
  deviceRequests = new Array<DeviceRequestListDto>();
  facilityId: number;
  DeviceRequestStatusEnum = DeviceRequestStatus;
  PHDeviceStatusEnum = PHDeviceStatus;
  saleTypeEnum = SaleTypeEnum;
  DeviceRequestStatusList = this.filterDataService.getEnumAsList(DeviceRequestStatus);
  private subs = new SubSink();
  requestStatus = [-1]


  facilityList = new Array<FacilityDto>();
  filterRequestObj = new FilterDeviceRequestDto();
  deviceRequestDetail = new DeviceRequestDetailDto();

  appAdminList = new Array<AppAdminDto>();
  selectedDateRange: any;

  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };
  loadingAdmins: boolean;
  ViewDeviceObj = new DeviceRequestListDto;
  searchParam = ''
  deviceRequestsPres: DeviceRequestListDto[];
  constructor(
    private deviceService: DeviceManagementService,
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private filterDataService: DataFilterService,
    private appAdminService: AppAdminService,
    private patientService: PatientsService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    this.filterRequestObj.FacilityId = this.facilityId || 0;
    this.getFacilityList();

    this.GetDeviceRequests();
    if (this.securityService.securityObject.userType == UserType.AppAdmin) {
      this.getAppAdminUsers();
    }
  }
  clearDate() {
    // this.daterange = {};
    this.selectedDateRange = [];
    this.filterRequestObj.StartDate = '';
    this.filterRequestObj.EndDate = '';
    // this.picker.datePicker.setStartDate();
    // this.picker.datePicker.setEndDate();
    // this.getComplaintsList();
  }
  selectedDate(value: any, datepicker?: any) {
    // datepicker.start = value.start;
    // datepicker.end = value.end;
    this.filterRequestObj.StartDate = value.start.format('YYYY-MM-DD');
    this.filterRequestObj.EndDate = value.end.format('YYYY-MM-DD');
    // this.daterange.label = value.label;
    // this.getComplaintsList();
  }
  ResetDRFilter() {
    this.filterRequestObj = new FilterDeviceRequestDto();
    this.requestStatus = [-1];
    var element = document.getElementById('complainDateField5454') as HTMLInputElement;
    if (element) {

    }
    element.value = ''
    this.GetDeviceRequests();
  }
  filterDeviceRequests() {
    if (!this.searchParam) {
      this.deviceRequests = this.deviceRequestsPres.filter(x => x.id)
      return
    }
    this.deviceRequests = this.deviceRequestsPres.filter(x => x.requestNumber.toLowerCase().includes(this.searchParam.toLocaleLowerCase().trim()))
  }

  GetDeviceRequests() {
    this.gettingDeviceRequests = true;
    if(this.requestStatus.includes(-1)){
      this.filterRequestObj.RequestStatus = []
    }else{
      this.filterRequestObj.RequestStatus = this.requestStatus;
    }
    var element = document.getElementById("complainDateField5454") as HTMLInputElement;
    if (element && element.value) {
      const iVal = element.value;
      const cData = moment().format("MM-DD-YYYY");
      const accuCount = (iVal.match(new RegExp(cData, "g")) || []).length;
      if (accuCount > 1) {
        this.filterRequestObj.StartDate = moment().format("YYYY-MM-DD");
        this.filterRequestObj.EndDate = moment().format("YYYY-MM-DD");
      }
    }
    this.deviceService.GetDeviceRequests(this.filterRequestObj).subscribe(
      (res: DeviceRequestListDto[]) => {
        this.gettingDeviceRequests = false;

        this.deviceRequests = res || [];
        this.deviceRequestsPres = res || [];


      },
      (error: HttpResError) => {
        this.gettingDeviceRequests = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  deviceRequestAdded() {
    this.GetDeviceRequests();
  }
  getFacilityList() {
    this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AssignAdminToRequest(item: AppAdminDto, row: DeviceRequestListDto) {
    this.deviceService.AssignRequestToUser(item.userId, row.id).subscribe(
      (res: DeviceRequestListDto[]) => {
        this.gettingDeviceRequests = false;
        row.pemUserName = item.firstName + ' ' + item.lastName


      },
      (error: HttpResError) => {
        this.gettingDeviceRequests = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  getAppAdminUsers() {
    this.loadingAdmins = true;
    this.appAdminService.GetAppAdmins().subscribe(
      (res: any) => {
        this.loadingAdmins = false;
        this.appAdminList = res;
      },
      (error: HttpResError) => {
        this.loadingAdmins = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  CreateOrder() {

  }
  openRpmDeviceDetailModal(modal: ModalDirective, item: DeviceRequestListDto) {
    Object.assign(this.ViewDeviceObj, item);
    console.log(this.ViewDeviceObj)
      this.ViewDeviceObj.dateCreated = moment.utc(this.ViewDeviceObj.dateCreated).local().format('YYYY-MM-DD');
    // // console.log(this.ViewDeviceObj)
    // this.getFacilityById(this.ViewDeviceObj.facilityId)
    // this.getPatientById(this.ViewDeviceObj.patientId)
    this.GetDeviceRequestDetail(item)

    setTimeout(() => {
      modal.show();
    }, 500);
  }
  GetDeviceRequestDetail(item: DeviceRequestListDto) {
    this.deviceRequestDetail = new DeviceRequestDetailDto();
    this.deviceService.GetDeviceRequestDetail(item.id, item.requestNumber).subscribe(
      (res: DeviceRequestDetailDto) => {
        this.deviceRequestDetail = res;

      },
      (error: HttpResError) => {
        this.gettingDeviceRequests = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  OpenSaleDeviceModal(DeviceSaleCMPRef: SaleDeviceComponent, row: DeviceRequestListDto) {
    DeviceSaleCMPRef.selectedSaleDevice = new Array< RpmPHDeviceListDto>();
    DeviceSaleCMPRef.CurrentPatient = new PatientDto();
    DeviceSaleCMPRef.filterModalStr = '';
    DeviceSaleCMPRef.saleDeviceModal.show();
    DeviceSaleCMPRef.saleDeviceToFacilityObj.saleDate = moment().format('YYYY-MM-DD');
    DeviceSaleCMPRef.getFacilitiesbyOrgId();
    DeviceSaleCMPRef.GetInhandDevices();
    DeviceSaleCMPRef.FillSaleDataFromRequest(row);
  }
  navigateBack() {
    this.location.back()
  }  
  trackShipment(device: ModalityDetailDto){
    if(device.shippingService == 1){ // USPS 1
      const url = `https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${device.trackingId}%2C&tABt=false`;
      window.open(url, "_blank");
    }
    if(device.shippingService == 2){ // Fedex 2
      const url = `https://www.fedex.com/fedextrack/?trknbr=${device.trackingId}`;
      window.open(url, "_blank");
    }
  }
  filterTableData(){
    if(this.requestStatus && this.requestStatus.length ){
      const indx = this.requestStatus?.length - 1;
      if(this.requestStatus.length > 1 && this.requestStatus[indx] == -1){
        this.requestStatus = [-1];  
        return
      } 
      if(this.requestStatus.length > 1 && this.requestStatus.includes(-1)){
        this.requestStatus = this.requestStatus.filter((x) => x !== -1);
      }
    }else{
      this.requestStatus = [-1]
    }
  }
}
