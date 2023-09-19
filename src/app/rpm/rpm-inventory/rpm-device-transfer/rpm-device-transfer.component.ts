import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { DeviceManagementService } from 'src/app/core/device-management.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { RpmPHDeviceListDto, TransferDeviceToFacilityDto } from 'src/app/model/Inventory/rpm-inventory.model';
import { PatientDto } from 'src/app/model/Patient/patient.model';

@Component({
  selector: 'app-rpm-device-transfer',
  templateUrl: './rpm-device-transfer.component.html',
  styleUrls: ['./rpm-device-transfer.component.scss']
})
export class RpmDeviceTransferComponent implements OnInit {
  @ViewChild('transferDeviceModal') transferDeviceModal: ModalDirective;
  selectedFacility = new  FacilityDto();
  selectedTransferDevice = new  RpmPHDeviceListDto();
  transferDeviceToFacilityDto = new TransferDeviceToFacilityDto();
  facilityList = new Array<FacilityDto>();
  organizationId: number;
  facilityId: number;
  gettingInHandDevices: boolean;
  gettingFacilitiesList: boolean;
  rpmDevicesList: RpmPHDeviceListDto[] = [];
  filterModalStr = '';
  selectedDevice = new  RpmPHDeviceListDto();
  CurrentPatient = new PatientDto();
  @Output() ReloadInventory: EventEmitter<any> = new EventEmitter<any>();
  showDeviceSales: boolean;


  constructor(private securityService: SecurityService, private deviceService: DeviceManagementService, private toaster: ToastService, private facilityService: FacilityService, private appUiService: AppUiService) { }

  ngOnInit(): void {
    this.selectedFacility.id = -1;
    this.organizationId = +this.securityService.getClaim('OrganizationId').claimValue;
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
  }
  getFacilitiesbyOrgId() {
    if (!this.organizationId) {
      return;
    }
    this.gettingFacilitiesList = true;
    this.facilityService.getFacilityByOrgId(this.organizationId).subscribe(
      (res: any) => {
    this.gettingFacilitiesList = false;
        if (res) {
          this.facilityList = res;
        }
      },
      error => {
        this.toaster.error(error.message, error.error || error.error);
        this.gettingFacilitiesList = false;
      }
    );
  }
  GetInhandDevices() {
    this.gettingInHandDevices = true;
    this.deviceService.GetRpmInventoryDevices(this.facilityId, true, false, false ,this.filterModalStr)
      .subscribe(
        (res: any[]) => {
          if (res) {
            this.rpmDevicesList = res;
          }
          this.gettingInHandDevices = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingInHandDevices = false;
        }
      );
  }
  transferDevice(){
    this.transferDeviceToFacilityDto.FacilityToId = this.selectedFacility.id;
    this.transferDeviceToFacilityDto.PhDeviceId = this.selectedTransferDevice.id;
    this.transferDeviceToFacilityDto.FacilityFromId = this.facilityId;
    this.deviceService.transferDeviceToFacility(this.transferDeviceToFacilityDto).subscribe(
      (res: any) => {
        this.toaster.success("Successfully","Device Transfered");
        this.ReloadInventory.next()
        this.transferDeviceModal.hide();
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    )
  }
  closeTransferModal(){
  this.selectedFacility = new  FacilityDto();
  this.selectedFacility.id = -1;
  this.selectedTransferDevice = new  RpmPHDeviceListDto();
  }
  DeviceSelectionChanged() {
    this.showDeviceSales = false;
    setTimeout(() => {
        this.showDeviceSales = true;
    }, 300);
  }
  openConfirmModal() {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = 'Confirmation';
    modalDto1.Text =
      `The device ${this.selectedTransferDevice.serialNo} will be transferred to 2C Inventory. Do you want to proceed?`;
    modalDto1.callBack = this.callBackBhi;
    modalDto1.rejectCallBack = this.rejectCallBackBhi;
    this.appUiService.openLazyConfrimModal(modalDto1);
}
rejectCallBackBhi = () => {
}
callBackBhi = (row) => {
  this.transferDevice();
}
}
