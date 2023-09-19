import { ActivatedRoute, Router } from '@angular/router';
import { RpmDeviceReturnComponent } from './../rpm-device-return/rpm-device-return.component';
import { RpmDeviceIssueComponent } from './../rpm-device-issue/rpm-device-issue.component';
import { DeviceManagementService } from './../../../core/device-management.service';
import { Location } from '@angular/common';
import { RpmService } from './../../../core/rpm.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RPMInventoryListDto, RpmPHDeviceListDto } from 'src/app/model/Inventory/rpm-inventory.model';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { RpmDeviceTransferComponent } from '../rpm-device-transfer/rpm-device-transfer.component';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SaleDeviceComponent } from '../sale-device/sale-device.component';
import moment from 'moment';

@Component({
  selector: 'app-rpm-inventory-list',
  templateUrl: './rpm-inventory-list.component.html',
  styleUrls: ['./rpm-inventory-list.component.scss']
})

export class RpmInventoryListComponent implements OnInit , AfterViewInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('DeviceIssueCMPRef') DeviceIssueCMPRef: RpmDeviceIssueComponent;
  @ViewChild('DeviceReturnCMPRef') DeviceReturnCMPRef: RpmDeviceTransferComponent;
  @ViewChild('DeviceTransferCMPRef') DeviceTransferCMPRef: RpmDeviceReturnComponent;
  rows = new Array<RPMInventoryListDto>();
  facilityId: number;
  gettingRPMInventry: boolean;
  preserveROws = new Array<RPMInventoryListDto>();
  rpmDevicesList: RpmPHDeviceListDto[] = [];
  searchStr = '';
  filterModalStr = '';
  facilityList = new Array<FacilityDto>();
  selectedFacility: number;
  isAppAdmin = false;
  isFacilityUser = false;
  totalDevices = 0;
  gettingFilteredDevices: boolean;
  deviceSummary =
  {
    BGCount: 0,
    BPCount: 0,
    WTCount: 0,
    POCount: 0,
  }
  constructor(private toaster: ToastService, private appUi: AppUiService, private route: ActivatedRoute,
    private rpm: RpmService, private deviceService: DeviceManagementService,
    private facilityService: FacilityService, private securityService: SecurityService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.isAppAdmin = true;
      this.selectedFacility = 0;
      this.selectedFacility = +this.route.snapshot.queryParamMap.get("selectedFacility") || 0;
      this.getFaciliesDetailsByUserId();
    }
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.isFacilityUser = true;
    }
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    if (this.isAppAdmin && this.selectedFacility) {
      this.facilityId = this.selectedFacility
    }
    this.GetRPMInventryList();
  }

  ngAfterViewInit(): void {
    if (this.isAppAdmin && this.selectedFacility) {
      this.changeFacility(this.facilityId);
    }

  }
  changeFacility(facility) {
    this.facilityId = facility;
    this.GetRPMInventryList();
    this.DeviceIssueCMPRef.facilityId = facility;
    this.DeviceTransferCMPRef.facilityId = facility;
    this.DeviceReturnCMPRef.facilityId = facility;
  }
  GetRPMInventryList() {
    this.gettingRPMInventry = true;
    this.GetFilteredDevices();
    this.deviceService.GetRpmInventoryData(this.facilityId)
      .subscribe(
        (res: RPMInventoryListDto[]) => {
          if (res) {
            this.totalDevices = 0;
            res.forEach((dev) => {
              this.totalDevices = dev.total + this.totalDevices
            })
            this.rows = [...res];
            Object.assign(this.preserveROws, res);
          }
          this.gettingRPMInventry = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingRPMInventry = false;
        }
      );
  }
  GetFilteredDevices() {
    this.deviceSummary =
    {
      BGCount: 0,
      BPCount: 0,
      WTCount: 0,
      POCount: 0,
    }
    this.rpmDevicesList = [];
    this.gettingFilteredDevices = true;
    this.deviceService
      .GetRpmInventoryDevices( this.facilityId,true, true, false, "", 0 ).subscribe(
        (res: RpmPHDeviceListDto[]) => {
          if (res?.length) {
            res.forEach(x => {
              x.macDisplay = x.macAddress;
            })
            this.rpmDevicesList = [...res];
            this.deviceSummary.BGCount = this.rpmDevicesList.filter( x => x.modality == 'BG').length || 0
            this.deviceSummary.BPCount = this.rpmDevicesList.filter( x => x.modality == 'BP').length || 0
            this.deviceSummary.WTCount = this.rpmDevicesList.filter( x => x.modality == 'WT').length || 0
            this.deviceSummary.POCount = this.rpmDevicesList.filter( x => x.modality == 'PO').length || 0
            this.rpmDevicesList = res;
          }
          this.gettingFilteredDevices = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingFilteredDevices = false;
        }
      );
  }
  FilterDevices() {
    if (!this.searchStr) {
      Object.assign(this.rows, this.preserveROws);
      this.rows = [...this.preserveROws];
      return;
    }
    const result = this.preserveROws.filter(x => x.deviceName.toLowerCase().includes(this.searchStr.toLowerCase()) || x.vendorName.toLowerCase().includes(this.searchStr.toLowerCase()));
    this.rows = [...result];
  }
  OpenIssueDeviceModal(DeviceIssueCMPRef: RpmDeviceIssueComponent, row: RPMInventoryListDto) {
    DeviceIssueCMPRef.selectedDevice = new RpmPHDeviceListDto();
    DeviceIssueCMPRef.CurrentPatient = new PatientDto();
    DeviceIssueCMPRef.filterModalStr = row.deviceName;
    DeviceIssueCMPRef.issueDeviceModal.show();
    DeviceIssueCMPRef.GetInhandDevices();
  }
  OpenTransferDeviceModal(DeviceTransferCMPRef: RpmDeviceTransferComponent, row: RPMInventoryListDto) {
    DeviceTransferCMPRef.selectedDevice = new RpmPHDeviceListDto();
    DeviceTransferCMPRef.CurrentPatient = new PatientDto();
    DeviceTransferCMPRef.filterModalStr = row.deviceName;
    DeviceTransferCMPRef.getFacilitiesbyOrgId();
    DeviceTransferCMPRef.GetInhandDevices();
    DeviceTransferCMPRef.transferDeviceModal.show();
  }
  OpenReturnDeviceModal(DeviceReturnCMPRef: RpmDeviceReturnComponent, row: RPMInventoryListDto) {
    DeviceReturnCMPRef.selectedDevice = new RpmPHDeviceListDto();
    DeviceReturnCMPRef.CurrentPatient = new PatientDto();
    DeviceReturnCMPRef.filterModalStr = row.deviceName;
    DeviceReturnCMPRef.returnDeviceModal.show();
    DeviceReturnCMPRef.GetIssuedDevices();
  }
  OpenSaleDeviceModal(DeviceSaleCMPRef: SaleDeviceComponent, row: RPMInventoryListDto) {
    DeviceSaleCMPRef.selectedSaleDevice = new Array< RpmPHDeviceListDto>();
    DeviceSaleCMPRef.CurrentPatient = new PatientDto();
    DeviceSaleCMPRef.filterModalStr = row.deviceName;
    DeviceSaleCMPRef.saleDeviceModal.show();
    DeviceSaleCMPRef.saleDeviceToFacilityObj.saleDate = moment().format('YYYY-MM-DD');
    DeviceSaleCMPRef.getFacilitiesbyOrgId();
    DeviceSaleCMPRef.GetInhandDevices();
  }
  async OpenInventoryDetail(row: RPMInventoryListDto, criteria = '') {
    if (!this.isAppAdmin) {
      let queryParam = '';
      if (criteria === 'all') {
        queryParam = `?criteria=${criteria}`;
      }
      else {
        queryParam = `?criteria=${criteria}&deviceModal=${row.deviceName || ''}`;
      }
      this.router.navigateByUrl('/rpm-inventory/inventory-detail' + queryParam);
    } else {
      const isSaved = await this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { selectedFacility: this.selectedFacility },
          queryParamsHandling: 'merge'
        });
      let queryParam = '';
      if (criteria) {
        queryParam = `?criteria=${criteria}&deviceModal=${row.deviceName || ''}&facilityId=${this.facilityId}`;
      }
      this.router.navigateByUrl('/rpm-inventory/inventory-detail' + queryParam);
    }
  }
  getFaciliesDetailsByUserId() {
    this.facilityService
      .getFacilityList()
      .subscribe(
        (res: any) => {
          if (res) {
            this.facilityList = res;
            // if(this.facilityList && this.facilityList.length)
            // this.selectedFacility = this.facilityList[0].id;
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          // console.log(error);
        }
      );
  }
}
