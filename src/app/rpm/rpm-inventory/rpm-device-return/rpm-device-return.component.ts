import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TwocChatService } from 'src/app/core/2c-chat.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { DeviceManagementService } from 'src/app/core/device-management.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { SearchedChatUsersDto } from 'src/app/model/chat/chat.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RpmPHDeviceListDto } from 'src/app/model/Inventory/rpm-inventory.model';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';

@Component({
  selector: 'app-rpm-device-return',
  templateUrl: './rpm-device-return.component.html',
  styleUrls: ['./rpm-device-return.component.scss']
})
export class RpmDeviceReturnComponent implements OnInit {
  @ViewChild('returnDeviceModal') returnDeviceModal: ModalDirective;
  @ViewChild('SearchDeviceSelectRef') SearchDeviceSelectRef: NgSelectComponent;
  facilityId: number;
  gettingInHandDevices: boolean;
  rpmDevicesList: RpmPHDeviceListDto[] = [];
  selectedDevice = new RpmPHDeviceListDto();
  CurrentPatient = new PatientDto();
  returnIngDevice: boolean;
  @Output() ReloadInventory: EventEmitter<any> = new EventEmitter<any>();
  filterModalStr = '';
  filterPatientId: number;
  searchWatch = new Subject<string>();
  selectedSearch: { id: number; name: string };
  patientList: PatientDto[];
  filterPatientDto = new FilterPatient();
  LoadingData: boolean;
  isDeviceSelected = false;


  constructor(private toaster: ToastService, private TwocHatService: TwocChatService,  private rpm: RpmService, private deviceService: DeviceManagementService,
    private facilityService: FacilityService, private securityService: SecurityService, private patientService: PatientsService, private appUiService: AppUiService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.SearchObserver();
  }
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "minimal-dark",
    scrollInertia: 0
  };
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.filterPatientDto.SearchParam = x;
      if (!this.filterPatientDto.SearchParam) {
        // this.filterPatientId = null;
        // this.GetIssuedDevices();
        return;
      }
      this.getFilterPatientsList2();
    });
  }
  getFilterPatientsList2() {
    const fPDto = new FilterPatient();
    this.patientList = [];
    this.LoadingData = true;
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.LoadingData = true;
    // this.LoadingDataPayersList = true;
    this.filterPatientDto.FacilityUserId = 0;
    // FacilityId = 0
    this.filterPatientDto.CareProviderId = 0;
    this.filterPatientDto.FacilityId = this.facilityId;
    this.filterPatientDto.PageNumber = 1;
    this.filterPatientDto.PageSize = 20;

    this.patientService.getFilterPatientsList2(this.filterPatientDto).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.patientList = res.patientsList;
      },
      (error: HttpResError) => {
        this.LoadingData = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetIssuedDevices() {
    this.gettingInHandDevices = true;
    this.deviceService.GetRpmInventoryDevices(this.facilityId, false, true, false ,this.filterModalStr, this.filterPatientId || 0)
      .subscribe(
        (res: any[]) => {
          if (res) {
            this.rpmDevicesList = res;
          }
          this.gettingInHandDevices = false;
          this.SearchDeviceSelectRef.open();
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingInHandDevices = false;
        }
      );
  }
  SelectPatient() {
    if (!this.selectedDevice || !this.selectedDevice.patientId) {
      return;
    }
    this.patientService.getPatientDetail(this.selectedDevice.patientId).subscribe(
      (res: PatientDto) => {
        this.CurrentPatient = res;
    });
  }
  ReturnDevice() {
    this.returnIngDevice = true;
    this.deviceService.ReturnDeviceToInventory(this.CurrentPatient.id, this.selectedDevice.id)
      .subscribe(
        (res: any[]) => {
          this.returnIngDevice = false;
          this.toaster.success('Operation successfull');
          this.ReloadInventory.next();
          this.returnDeviceModal.hide();
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.returnIngDevice = false;
        }
      );
  }
  openConfirmModal() {
      const modalDto1 = new LazyModalDto();
      modalDto1.Title = 'Confirmation';
      modalDto1.Text =
        `The device ${this.selectedDevice.serialNo} will be returned to In Hand Inventory. Do you want to proceed?`;
      modalDto1.callBack = this.callBackBhi;
      modalDto1.rejectCallBack = this.rejectCallBackBhi;
      this.appUiService.openLazyConfrimModal(modalDto1);
  }
  rejectCallBackBhi = () => {
  }
  callBackBhi = (row) => {
    this.ReturnDevice();
  }
}
