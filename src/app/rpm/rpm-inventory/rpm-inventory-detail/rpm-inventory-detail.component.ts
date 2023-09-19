import { Location } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { TwocChatService } from "src/app/core/2c-chat.service";
import { AppUiService } from "src/app/core/app-ui.service";
import { DeviceManagementService } from "src/app/core/device-management.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { RpmService } from "src/app/core/rpm.service";
import { SecurityService } from "src/app/core/security/security.service";
import { PHDeviceStatus } from "src/app/Enums/phDevice.enum";
import { UserType } from "src/app/Enums/UserType.enum";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  RPMInventoryListDto,
  RpmPHDeviceListDto,
} from "src/app/model/Inventory/rpm-inventory.model";
import { PatientDto } from "src/app/model/Patient/patient.model";
import { DeviceSaleDetailComponent } from "../device-sale-detail/device-sale-detail.component";
import { RpmDeviceDisposeComponent } from "../rpm-device-dispose/rpm-device-dispose.component";
import { RpmDeviceHistoryComponent } from "../rpm-device-history/rpm-device-history.component";
import { RpmDeviceIssueComponent } from "../rpm-device-issue/rpm-device-issue.component";
import { RpmDeviceReturnComponent } from "../rpm-device-return/rpm-device-return.component";
import { RpmDeviceTransferComponent } from "../rpm-device-transfer/rpm-device-transfer.component";
import { SaleDeviceComponent } from "../sale-device/sale-device.component";
import { FacilityDto } from "src/app/model/Facility/facility.model";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
// import { ColumnMode, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';

@Component({
  selector: "app-rpm-inventory-detail",
  templateUrl: "./rpm-inventory-detail.component.html",
  styleUrls: ["./rpm-inventory-detail.component.scss"],
})
export class RpmInventoryDetailComponent implements OnInit, AfterViewInit {
  @ViewChild("DeviceIssueCMPRef") DeviceIssueCMPRef: RpmDeviceIssueComponent;
  @ViewChild("DeviceReturnCMPRef")
  DeviceReturnCMPRef: RpmDeviceTransferComponent;
  @ViewChild("DeviceTransferCMPRef")
  DeviceTransferCMPRef: RpmDeviceReturnComponent;
  criteria: string;
  deviceModal: string;
  facilityId: number;
  gettingFilteredDevices: boolean;
  rpmDevicesList: RpmPHDeviceListDto[] = [];
  preserveROws: RpmPHDeviceListDto[] = [];
  searchStr = "";
  isAppAdmin = false;
  selectedDeviceId: number;
  PHDeviceStatusObj = PHDeviceStatus;
  makingDevieInactive: boolean;
  makingDevieActive: boolean;
  titleAppend: string;
  pageSize = 10;
  selectedFacility: number;
  gridCheckAll: boolean;
  selected = new Array<RpmPHDeviceListDto>();
  selectedDeviceIds = new Array();
  placeHolder = '';
  showDeviceSaleDetailsIcon = true;
  facilityList = new Array<FacilityDto>();
  ExcelData: any[];
  constructor(
    private toaster: ToastService,
    private TwocHatService: TwocChatService,
    private rpm: RpmService,
    private deviceService: DeviceManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private patientService: PatientsService,
    private appUi: AppUiService
  ) { }

  ngOnInit(): void {
    if (this.securityService.getClaim("isSubVendorFacility")?.claimValue) {
      if (this.securityService.getClaim("isSubVendor")?.claimValue) {
        const tet = this.securityService.getClaim("isSubVendor").claimValue;
        this.showDeviceSaleDetailsIcon = JSON.parse(tet);
      } else {
        this.showDeviceSaleDetailsIcon = false;
      }
    }
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.selectedFacility = 0;
      this.selectedFacility =
        +this.route.snapshot.queryParamMap.get("selectedFacility") || 0;
    }
    this.ApplyInitCriteria();
    this.getFaciliesDetailsByUserId();
  }
  ngAfterViewInit(): void {
    if (this.isAppAdmin && this.facilityId) {
      this.changeFacility(this.facilityId);
    }
  }
  changeFacility(facility) {
    this.facilityId = facility;
    this.DeviceIssueCMPRef.facilityId = facility;
    this.DeviceTransferCMPRef.facilityId = facility;
    this.DeviceReturnCMPRef.facilityId = facility;
    this.GetFilteredDevices();
  }
  ApplyInitCriteria() {
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.isAppAdmin = true;

      this.facilityId = +this.route.snapshot.queryParamMap.get("facilityId");
    } else {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.criteria = this.route.snapshot.queryParams["criteria"];
    this.deviceModal = this.route.snapshot.queryParams["deviceModal"];
    this.GetFilteredDevices();
    this.titleAppend = "";
    if (this.criteria == "inhand") {
      this.titleAppend = "In Hand ";
    }
    if (this.criteria == "issued") {
      this.titleAppend = "Issued ";
      this.placeHolder = "/ Patient Name";
    }
    if (this.criteria == "disposed") {
      this.titleAppend = "Disposed ";
    }
    if (this.criteria == "all") {
      this.titleAppend = "All ";
    }
    this.clearSelectedList();
  }
  FilterDevices() {
    if (!this.searchStr) {
      Object.assign(this.rpmDevicesList, this.preserveROws);
      this.rpmDevicesList = [...this.preserveROws];
      return;
    }
    const result = this.preserveROws.filter(
      (x) =>
        x.model?.toLowerCase().includes(this.searchStr.toLowerCase()) ||
        x.macAddress?.toLowerCase().includes(this.searchStr.toLowerCase()) ||
        x.serialNo?.toLowerCase().includes(this.searchStr.toLowerCase()) ||
        x.patientName?.toLowerCase().includes(this.searchStr.toLowerCase()) ||
        x.manufacturer?.toLowerCase().includes(this.searchStr.toLowerCase())
    );
    this.rpmDevicesList = [...result];
  }
  GetFilteredDevices() {
    this.gettingFilteredDevices = true;
    let inhandBool = this.criteria && this.criteria === "inhand" ? true : false;
    let issuedBool = this.criteria && this.criteria === "issued" ? true : false;
    let disposedBool = this.criteria && this.criteria === "disposed" ? true : false;
    if (this.criteria === "all") {
      inhandBool = true;
      issuedBool = true;
      disposedBool = false;
    }
    this.deviceService
      .GetRpmInventoryDevices(
        this.facilityId,
        inhandBool,
        issuedBool,
        disposedBool,
        this.deviceModal || "",
        0
      )
      .subscribe(
        (res: RpmPHDeviceListDto[]) => {
          if (res) {
            if (res) {
              res.forEach(x => {
                x.macDisplay = x.macAddress;
              })
              this.rpmDevicesList = [...res];
              Object.assign(this.preserveROws, res);
            }
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
  navigateBack() {
    this.location.back();
  }
  openDeviceHistoryModal(
    device: RpmPHDeviceListDto,
    RpmDeviceHistoryCMPRef: RpmDeviceHistoryComponent,
    RpmDeviceHistoryModal
  ) {
    RpmDeviceHistoryCMPRef.getPhDeviceHistory(device);
    RpmDeviceHistoryModal.show();
  }
  openDeviceSaleDetailModal(deviceId: number, modal: ModalDirective) {
    this.selectedDeviceId = 0;
    setTimeout(() => {
      this.selectedDeviceId = deviceId;
    }, 300);
    modal.show();
  }
  ConfirmStatusChange(row: RpmPHDeviceListDto) {
    if (!this.isAppAdmin) {
      if (this.criteria != "inhand") {
        this.toaster.warning(
          "Device status can only be changed when it is InHand"
        );
        return;
      }
      const modalDto = new LazyModalDto();
      modalDto.Title = `${row.status === PHDeviceStatus.Active ? "Inactivate" : "Activate"
        } Device`;
      if (row.status === PHDeviceStatus.Active) {
        modalDto.Text = `You are going to deactivate this device, deactivation charges may be applied`;
      } else {
        modalDto.Text = `You are going to reactivate this device, reactivation can take 2-3 business days.`;
      }
      modalDto.callBack =
        row.status === PHDeviceStatus.Active
          ? this.DeActivatePhDevice
          : this.ActivatePhDevice;
      modalDto.data = row;
      this.appUi.openLazyConfrimModal(modalDto);
    } else {
      this.toaster.warning('Admin is not able to change the device status.')
    }
  }

  ActivatePhDevice = (row: RpmPHDeviceListDto) => {
    this.makingDevieInactive = true;
    this.deviceService.ActivatePhDevice(row.id).subscribe(
      (res: any) => {
        this.makingDevieInactive = false;
        row.status = PHDeviceStatus.Active;
        this.toaster.success("Device activated");
        this.toaster.success(
          `Ticket ${res.ticketNo} has been generated in Complaint Center for further follow-up.`
        );
      },
      (error: HttpResError) => {
        this.makingDevieInactive = false;
        this.toaster.error(error.error, error.message);
      }
    );
  };
  DeActivatePhDevice = (row: RpmPHDeviceListDto) => {
    this.makingDevieActive = true;
    this.deviceService.DeActivatePhDevice(row.id).subscribe(
      (res: any) => {
        this.makingDevieActive = false;
        row.status = PHDeviceStatus.InActive;
        this.toaster.success("Device deactivated");
        this.toaster.success(
          `Ticket ${res.ticketNo} has been generated in Complaint Center for further follow-up.`
        );
      },
      (error: HttpResError) => {
        this.makingDevieActive = false;
        this.toaster.error(error.error, error.message);
      }
    );
  };
  OpenDisposeDeviceModal(
    DeviceDisposeCMPRef: RpmDeviceDisposeComponent,
    row: RpmPHDeviceListDto
  ) {
    Object.assign(DeviceDisposeCMPRef.selectedDevice, row);
    DeviceDisposeCMPRef.getSaleDetails();
    DeviceDisposeCMPRef.disposeDeviceModal.show();
  }
  OpenIssueDeviceModal(
    DeviceIssueCMPRef: RpmDeviceIssueComponent,
    row: RpmPHDeviceListDto
  ) {
    Object.assign(DeviceIssueCMPRef.selectedDevice, row);
    Object.assign(DeviceIssueCMPRef.selectedTransferDevice, row);
    DeviceIssueCMPRef.CurrentPatient = new PatientDto();
    DeviceIssueCMPRef.filterModalStr = row.model;
    DeviceIssueCMPRef.issueDeviceModal.show();
    DeviceIssueCMPRef.GetInhandDevices();
  }
  OpenTransferDeviceModal(
    DeviceTransferCMPRef: RpmDeviceTransferComponent,
    row: RpmPHDeviceListDto
  ) {
    Object.assign(DeviceTransferCMPRef.selectedDevice, row);
    Object.assign(DeviceTransferCMPRef.selectedTransferDevice, row);
    DeviceTransferCMPRef.CurrentPatient = new PatientDto();
    DeviceTransferCMPRef.filterModalStr = row.model;
    DeviceTransferCMPRef.getFacilitiesbyOrgId();
    DeviceTransferCMPRef.GetInhandDevices();
    DeviceTransferCMPRef.transferDeviceModal.show();
  }
  OpenReturnDeviceModal(
    DeviceReturnCMPRef: RpmDeviceReturnComponent,
    row: RpmPHDeviceListDto
  ) {
    Object.assign(DeviceReturnCMPRef.selectedDevice, row);
    DeviceReturnCMPRef.isDeviceSelected = true;
    DeviceReturnCMPRef.CurrentPatient = new PatientDto();
    DeviceReturnCMPRef.SelectPatient();
    DeviceReturnCMPRef.filterModalStr = row.model;
    DeviceReturnCMPRef.returnDeviceModal.show();
    // DeviceReturnCMPRef.GetIssuedDevices();
  }
  OpenSaleDeviceModal(
    DeviceSaleCMPRef: SaleDeviceComponent,
    row: RpmPHDeviceListDto
  ) {
    DeviceSaleCMPRef.selectedSaleDevice = new Array<RpmPHDeviceListDto>();
    DeviceSaleCMPRef.selectedDeviceIds = [row.id];
    // Object.assign(DeviceSaleCMPRef.selectedSaleDevice, row);
    DeviceSaleCMPRef.CurrentPatient = new PatientDto();
    DeviceSaleCMPRef.filterModalStr = row.model;
    DeviceSaleCMPRef.saleDeviceModal.show();
    DeviceSaleCMPRef.saleDeviceToFacilityObj.saleDate =
      moment().format("YYYY-MM-DD");
    DeviceSaleCMPRef.getFacilitiesbyOrgId();
    DeviceSaleCMPRef.GetInhandDevices();
  }
  saleSelectedDevices(DeviceSaleCMPRef: SaleDeviceComponent) {
    DeviceSaleCMPRef.isBulkIssuance = true;
    DeviceSaleCMPRef.selectedSaleDevice = new Array<RpmPHDeviceListDto>();
    DeviceSaleCMPRef.saleDeviceToFacilityObj.saleDate =
      moment().format("YYYY-MM-DD");
    DeviceSaleCMPRef.facilityId = this.facilityId;
    DeviceSaleCMPRef.filterModalStr = this.route.snapshot.queryParams["deviceModal"];
    DeviceSaleCMPRef.selectedDeviceIds = [];
    DeviceSaleCMPRef.selectedDeviceIds = this.selected.map(x => x.id);
    DeviceSaleCMPRef.getFacilitiesbyOrgId();
    DeviceSaleCMPRef.GetInhandDevices();
    DeviceSaleCMPRef.saleDeviceModal.show();
  }
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    if (e.target.checked) {
      this.selected.push(row);
    } else {
      const index = this.selected.findIndex((x) => x.id === row.id);
      this.selected.splice(index, 1);
    }
    console.log(this.selected)
  }
  gridAllRowsCheckBoxChecked(e) {
    this.rpmDevicesList.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      Object.assign(this.selected, this.rpmDevicesList);
    } else {
      this.selected = [];
    }
    console.log(this.selected)
  }
  clearSelectedList() {
    this.selected = new Array<RpmPHDeviceListDto>();
  }
  getFaciliesDetailsByUserId() {
    this.facilityService
      .getFacilityList()
      .subscribe(
        (res: any) => {
          if (res) {
            this.facilityList = res;
            this.selectedFacility =
        +this.route.snapshot.queryParamMap.get("facilityId") || 0;
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  MakeExcel(){
    this.ExcelData = [];
    // if(this.criteria == 'inhand'){
    //   this.ExcelData = new Array<{
    //     'Modality Name': string;
    //     'Status': string;
    //     'Installation Date': string;
    //     'Model': string;
    //     'Serial No.': string;
    //     'Mac': string;
    //   }>();
    // }else{
      this.ExcelData = new Array<{
        'Patient Name': string;
        'Modality Name': string;
        'Status': string;
        'Place': string;
        'Installation Date': string;
        'Model': string;
        'Remaining Installments Amount': string;
        'Remaining Installments Count': string;
        'Serial No.': string;
        'Mac': string;
      }>();
    // }

  this.CreateExcelData(this.rpmDevicesList);
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: 'SheetJS Tutorial',
    Subject: 'Test',
    Author: 'Talha Ikram',
    CreatedDate: new Date(),
    Company: 'Premier Solutions',
  };
  let sheetName = 'Devices List';
  // if (facility.facilityName) {
  //   sheetName = facility.facilityName.toString();
  //   if (sheetName.length > 29) {
  //     sheetName = sheetName.substring(0, 26) + '...';
  //   }
  // }
  wb.SheetNames.push(sheetName);
  const ws_data = [['hello', 'world']];
  // const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const ws = XLSX.utils.json_to_sheet<any>(this.ExcelData, {
    // header: myHeader,
    skipHeader: false,
  });
  const wscols = [
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  ws['!cols'] = wscols;
  wb.Sheets[sheetName] = ws;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  // const wbout = XLSX.write(wb, {bookType: 'xlsx',  type: 'binary'});
  function s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      // tslint:disable-next-line: no-bitwise
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  const FileName = moment().format('YYYY-MM-DD hh:mm A');
  FileSaver.saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    'Devices List ' + FileName + '.xlsx'
  );
  }
  CreateExcelData(eData: RpmPHDeviceListDto[]) {
    eData.forEach((item: RpmPHDeviceListDto) => {
      if (item.installationDate) {
        item.installationDate = moment(item.installationDate).format('DD-MMM-YYYY')
      }
      if (item.status >=0) {
        item.StatusStr = PHDeviceStatus[item.status] as any;
      }
      // if(this.criteria == 'inhand'){
      //   this.ExcelData.push({
      //     'Modality Name': this.checkIfNull(item.modalityName),
      //     'Status': this.checkIfNull(item.StatusStr),
      //     'Installation Date': this.checkIfNull(item.installationDate),
      //     'Model': this.checkIfNull(item.model),
      //     'Serial No.': this.checkIfNull(item.serialNo),
      //     'Mac': this.checkIfNull(item.macAddress),
      //   });
      // }else{
        this.ExcelData.push({
          'Patient Name': this.checkIfNull(item.patientName),
          'Modality Name': this.checkIfNull(item.modalityName),
          'Status': this.checkIfNull(item.StatusStr),
          'Place': this.checkIfNull(item.place),
          'Installation Date': this.checkIfNull(item.installationDate),
          'Model': this.checkIfNull(item.model),
          'Remaining Installments Amount': this.checkIfNull(item.remainingInstallmentsAmount),
          'Remaining Installments Count': this.checkIfNull(item.remainingInstallmentsCount),
          'Serial No.': this.checkIfNull(item.serialNo),
          'Mac': this.checkIfNull(item.macAddress),
        });
      // }
    });
  }
  sortCallback(sortInfo) {
    console.log(sortInfo)
  }
  checkIfNull(data: any): string {
    if (data) {
      return data.toString();
    }
    else {
      return "";
    }
  }
}
